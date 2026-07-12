// Imports the Claude-skills catalog live from GitHub and writes src/data/catalog.json.
// Sources:
//   1. GitHub repo search (topics + keywords) — repos with stars, dates, descriptions
//   2. anthropics/skills repo tree — every official skill's SKILL.md frontmatter
//   3. Awesome-list READMEs — community skills the search may miss
//
// Run:  npm run import
// Set GITHUB_TOKEN to raise API rate limits (60/hr unauthenticated → 5000/hr).

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "src", "data", "catalog.json");

const TOKEN = process.env.GITHUB_TOKEN;
const API_HEADERS = {
  Accept: "application/vnd.github+json",
  "User-Agent": "skill-library-import",
  ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
};

const SEARCH_QUERIES = [
  "topic:claude-skills",
  "topic:claude-skill",
  "topic:agent-skills",
  '"claude skills" in:name,description',
  '"claude skill" in:name,description',
  // Catch skills tagged only with generic claude topics (e.g. ui-ux-pro-max-skill)
  "skill in:name topic:claude-code",
  "skill in:name topic:claude",
  "topic:ai-skills topic:claude-code",
  // Skills that self-describe as "agent skill" without mentioning Claude (e.g. shadcn/improve)
  '"agent skill" in:name,description',
];

// Always included regardless of search discovery. Add repos here when a
// known skill keeps slipping through the queries. Optional `install`
// overrides the generic git-clone snippet; optional `category` overrides
// the keyword heuristic.
const PINNED_REPOS = [
  { repo: "shadcn/improve", install: "npx skills add shadcn/improve", category: "Development" },
  { repo: "nextlevelbuilder/ui-ux-pro-max-skill" },
];

const AWESOME_LISTS = [
  "travisvn/awesome-claude-skills",
  "ComposioHQ/awesome-claude-skills",
  "karanb192/awesome-claude-skills",
];

// Repos that are not installable skills/collections themselves
const EXCLUDE = new Set(["anthropics/skills"]); // itemized per-skill below

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function ghJson(url) {
  const res = await fetch(url, { headers: API_HEADERS });
  if (!res.ok) throw new Error(`GitHub API ${res.status}: ${url}`);
  return res.json();
}

async function rawText(url) {
  const res = await fetch(url, { headers: { "User-Agent": "skill-library-import" } });
  return res.ok ? res.text() : null;
}

function categorize(name, desc) {
  const t = `${name} ${desc}`.toLowerCase();
  const has = (...words) => words.some((w) => t.includes(w));
  if (has("awesome", "curated list", "collection of", "skills collection", "skill collection", "skills library", "marketplace", "curated collection")) return "Collections";
  if (has("docx", "pdf", "pptx", "xlsx", "word document", "excel", "powerpoint", "spreadsheet", "document creation", "documents")) return "Documents";
  if (has("security", "pentest", "fuzz", "vulnerab", "exploit", "ctf", "semgrep", "codeql", "threat", "malware", "forensic")) return "Security";
  if (has("testing", "playwright", "e2e", "simulator", "selenium", "test automation", "qa ")) return "Testing & QA";
  if (has("chart", "visualization", "visualisation", "d3", "data analysis", "analytics", "sql", "dataset", "jupyter", "notebook", "bigquery")) return "Data & Visualization";
  if (has("design", "generative art", "canvas", "gif", "image", "svg", "animation", "creative", "illustration", "video", "figma", "artwork")) return "Design & Creative";
  if (has("writing", "comms", "email", "newsletter", "blog", "seo", "marketing", "content creation", "copywrit", "slack message")) return "Communication";
  if (has("workflow", "productivity", "planning", "tdd", "debugging", "memory", "automation", "brainstorm", "task management")) return "Workflows";
  if (has("mcp", "coding", "code review", "api", "react", "frontend", "backend", "git", "developer", "framework", "sdk", "programming", "web app", "typescript", "python", "codebase", "refactor", "audit")) return "Development";
  return "Other";
}

function cleanDescription(text) {
  return (text || "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // markdown links → text
    .replace(/[*_`]/g, "")
    .replace(/\s+/g, " ")
    .replace(/^[-—–:\s]+/, "")
    .trim();
}

function repoEntry(r) {
  return {
    id: r.full_name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    title: r.name,
    category: categorize(r.name, r.description || ""),
    author: r.owner.login,
    repo: r.html_url,
    stars: r.stargazers_count,
    dateAdded: (r.created_at || "").slice(0, 10) || null,
    description: cleanDescription(r.description) || "No description provided on GitHub.",
    source: r.full_name.toLowerCase().includes("awesome") ? "collection" : "community",
    repoKey: r.full_name.toLowerCase(),
  };
}

async function searchRepos() {
  const found = new Map();
  for (const q of SEARCH_QUERIES) {
    const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(q)}&sort=stars&order=desc&per_page=100`;
    try {
      const data = await ghJson(url);
      for (const r of data.items || []) {
        if (r.fork || EXCLUDE.has(r.full_name)) continue;
        if (!found.has(r.full_name.toLowerCase())) found.set(r.full_name.toLowerCase(), repoEntry(r));
      }
      console.log(`search "${q}": ${data.items?.length ?? 0} repos (total unique: ${found.size})`);
    } catch (e) {
      console.warn(`search "${q}" failed: ${e.message}`);
    }
    await sleep(2500); // stay under the 10 searches/min unauthenticated limit
  }
  return found;
}

function parseFrontmatter(text) {
  const m = text.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!m) return {};
  const lines = m[1].split("\n");
  const out = {};
  for (let i = 0; i < lines.length; i++) {
    const kv = lines[i].match(/^(\w[\w-]*):\s*(.*)$/);
    if (!kv) continue;
    let val = kv[2].trim();
    if (/^[|>]-?$/.test(val)) {
      // YAML block scalar — gather the indented lines that follow
      const block = [];
      while (i + 1 < lines.length && /^\s+\S/.test(lines[i + 1])) block.push(lines[++i].trim());
      val = block.join(" ");
    }
    out[kv[1]] = val.replace(/^["']|["']$/g, "");
  }
  return out;
}

async function officialSkills() {
  const entries = [];
  try {
    const repo = await ghJson("https://api.github.com/repos/anthropics/skills");
    const branch = repo.default_branch || "main";
    const stars = repo.stargazers_count;
    const tree = await ghJson(`https://api.github.com/repos/anthropics/skills/git/trees/${branch}?recursive=1`);
    const skillDirs = (tree.tree || [])
      .filter((n) => n.path.endsWith("/SKILL.md"))
      .map((n) => n.path.replace(/\/SKILL\.md$/, ""));
    console.log(`anthropics/skills: found ${skillDirs.length} SKILL.md files`);
    for (const dir of skillDirs) {
      const md = await rawText(`https://raw.githubusercontent.com/anthropics/skills/${branch}/${dir}/SKILL.md`);
      if (!md) continue;
      const fm = parseFrontmatter(md);
      const name = fm.name || dir.split("/").pop();
      entries.push({
        id: `official-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
        title: name,
        category: categorize(name, fm.description || ""),
        author: "anthropics",
        repo: `https://github.com/anthropics/skills/tree/${branch}/${dir}`,
        stars,
        dateAdded: null,
        description: cleanDescription(fm.description) || "Official Anthropic skill.",
        install: `# Manual install (Claude Code)\ngit clone https://github.com/anthropics/skills\ncp -r skills/${dir} ~/.claude/skills/${name}`,
        source: "official",
        repoKey: `anthropics/skills#${name.toLowerCase()}`,
      });
    }
  } catch (e) {
    console.warn(`official skills import failed: ${e.message}`);
  }
  return entries;
}

async function awesomeListRepos(known) {
  const found = new Map();
  for (const list of AWESOME_LISTS) {
    for (const branch of ["main", "master"]) {
      const md = await rawText(`https://raw.githubusercontent.com/${list}/${branch}/README.md`);
      if (!md) continue;
      const linkRe = /\[([^\]]+)\]\(https:\/\/github\.com\/([\w.-]+)\/([\w.-]+?)(?:\.git)?(?:[/#?][^)]*)?\)\s*(?:[-—–:]\s*)?([^\n|]*)/g;
      let m, count = 0;
      while ((m = linkRe.exec(md))) {
        const [, label, owner, name, tail] = m;
        const key = `${owner}/${name}`.toLowerCase();
        if (EXCLUDE.has(`${owner}/${name}`) || known.has(key) || found.has(key)) continue;
        if (/^(anthropics|features|issues|pulls|wiki|topics|search|orgs|sponsors|marketplace|about)$/i.test(owner)) continue;
        const desc = cleanDescription(tail) || cleanDescription(label);
        found.set(key, {
          id: key.replace(/[^a-z0-9]+/g, "-"),
          title: name,
          category: categorize(`${name} ${label}`, desc),
          author: owner,
          repo: `https://github.com/${owner}/${name}`,
          stars: null,
          dateAdded: null,
          description: desc || "Listed in a curated awesome-list.",
          source: "community",
          repoKey: key,
        });
        count++;
      }
      console.log(`${list} (${branch}): +${count} new repos`);
      break; // this branch worked; skip the other
    }
  }
  return found;
}

async function enrichStars(entries) {
  // Fill in stars/dates for awesome-list repos the search didn't cover.
  const missing = entries.filter((e) => e.stars === null);
  const budget = TOKEN ? missing.length : Math.min(missing.length, 35); // respect 60/hr unauth core limit
  console.log(`enriching ${budget}/${missing.length} repos with star counts${TOKEN ? "" : " (set GITHUB_TOKEN to cover all)"}`);
  for (let i = 0; i < budget; i++) {
    const e = missing[i];
    try {
      const r = await ghJson(`https://api.github.com/repos/${e.repoKey}`);
      e.stars = r.stargazers_count;
      e.dateAdded = (r.created_at || "").slice(0, 10) || null;
      e.description = cleanDescription(r.description) || e.description;
      if (r.fork) e.skip = true;
    } catch {
      e.skip = true; // repo deleted/renamed — drop it
    }
    await sleep(150);
  }
}

async function pinnedRepos(known) {
  const found = new Map();
  for (const pin of PINNED_REPOS) {
    const key = pin.repo.toLowerCase();
    const existing = known.get(key) || found.get(key);
    if (existing) {
      if (pin.install) existing.install = pin.install;
      if (pin.category) existing.category = pin.category;
      continue;
    }
    try {
      const r = await ghJson(`https://api.github.com/repos/${pin.repo}`);
      const entry = repoEntry(r);
      if (pin.install) entry.install = pin.install;
      if (pin.category) entry.category = pin.category;
      found.set(key, entry);
    } catch (e) {
      console.warn(`pinned repo ${pin.repo} failed: ${e.message}`);
    }
  }
  console.log(`pinned repos: +${found.size}`);
  return found;
}

async function main() {
  console.log("Importing Claude skills catalog from GitHub…\n");
  const searched = await searchRepos();
  for (const [k, v] of await pinnedRepos(searched)) searched.set(k, v);
  const official = await officialSkills();
  const awesome = await awesomeListRepos(searched);

  let entries = [...official, ...searched.values(), ...awesome.values()];
  await enrichStars(entries);
  entries = entries.filter((e) => !e.skip);

  // Drop unstarred search noise, keep everything that came from a curated list or is official
  entries = entries.filter((e) => e.source === "official" || e.stars === null || e.stars >= 2);
  entries.sort((a, b) => (b.stars ?? 0) - (a.stars ?? 0));
  entries = entries.slice(0, 500).map(({ skip, repoKey, ...e }) => ({ ...e, repoKey }));

  fs.writeFileSync(OUT, JSON.stringify({ generatedAt: new Date().toISOString(), entries }, null, 2));
  console.log(`\nWrote ${entries.length} skills to ${OUT}`);
  const byCat = {};
  for (const e of entries) byCat[e.category] = (byCat[e.category] || 0) + 1;
  console.table(byCat);
}

main().catch((e) => { console.error(e); process.exit(1); });
