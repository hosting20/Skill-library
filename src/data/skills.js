// The skill catalog = live GitHub import (catalog.json, regenerate with
// `npm run import`) merged with the hand-curated entries below, which add
// richer details and seeded sample reviews (see project README).
import catalog from "./catalog.json";

const CATEGORY_ORDER = [
  "Documents",
  "Development",
  "Design & Creative",
  "Testing & QA",
  "Security",
  "Data & Visualization",
  "Communication",
  "Workflows",
  "Collections",
  "Other",
];

const MANUAL_INSTALL = (repo, path, name) =>
  `# Manual install (Claude Code)\ngit clone ${repo}\ncp -r ${path} ~/.claude/skills/${name}\n\n# Then just ask Claude — skills load automatically when relevant.`;

const CURATED = [
  // ─── Official Anthropic skills (anthropics/skills) ───
  {
    id: "docx",
    title: "docx — Word Documents",
    category: "Documents",
    author: "anthropics",
    repo: "https://github.com/anthropics/skills",
    stars: 160000,
    dateAdded: "2025-10-16",
    description:
      "Anthropic's official skill for creating, editing, and analyzing Word documents — tracked changes, comments, formatting, templates.",
    install: MANUAL_INSTALL("https://github.com/anthropics/skills", "skills/skills/docx", "docx"),
    details:
      "Part of Anthropic's production document-skills suite (the same skills that power document handling on Claude.ai). Handles .docx and .dotx creation from scratch, structured edits, tracked changes, and content extraction.",
    reviews: [
      { user: "mkessler_dev", rating: 5, date: "2026-05-02", text: "This is the exact skill Claude.ai uses internally. Generated a 30-page formatted report with TOC and page numbers on the first try." },
      { user: "annapdx", rating: 5, date: "2026-03-18", text: "Tracked-changes support is the killer feature. Legal review workflows finally automated." },
      { user: "jorge.r", rating: 4, date: "2026-06-11", text: "Excellent overall. Complex table layouts occasionally need a second pass." },
    ],
  },
  {
    id: "pdf",
    title: "pdf — PDF Toolkit",
    category: "Documents",
    author: "anthropics",
    repo: "https://github.com/anthropics/skills",
    stars: 160000,
    dateAdded: "2025-10-16",
    description:
      "Official PDF manipulation skill: merge, split, fill forms, extract text and tables, watermark, and generate new PDFs.",
    install: MANUAL_INSTALL("https://github.com/anthropics/skills", "skills/skills/pdf", "pdf"),
    details:
      "Production-grade PDF skill from the anthropics/skills repository. Covers the full lifecycle: reading and extracting, form filling, page operations (merge/split/rotate), and creating polished new PDFs.",
    reviews: [
      { user: "datadompteur", rating: 5, date: "2026-04-22", text: "Batch-filled 200 PDF forms from a CSV without a single manual touch. Worth the setup alone." },
      { user: "quietfox", rating: 4, date: "2026-02-27", text: "Table extraction from scanned PDFs is solid once OCR deps are installed. Docs could flag that earlier." },
    ],
  },
  {
    id: "pptx",
    title: "pptx — PowerPoint Decks",
    category: "Documents",
    author: "anthropics",
    repo: "https://github.com/anthropics/skills",
    stars: 160000,
    dateAdded: "2025-10-16",
    description:
      "Official skill for building and editing PowerPoint presentations — layouts, speaker notes, templates, and brand-consistent decks.",
    install: MANUAL_INSTALL("https://github.com/anthropics/skills", "skills/skills/pptx", "pptx"),
    details:
      "Creates full slide decks from briefs, edits existing .pptx files, works with .potx templates, and keeps typography and spacing consistent across slides.",
    reviews: [
      { user: "slidegrinder", rating: 5, date: "2026-06-30", text: "Monday-morning pipeline: meeting notes in, investor-ready deck out. Genuinely saves me hours weekly." },
      { user: "h.tanaka", rating: 4, date: "2026-01-15", text: "Great structure and notes. Custom fonts need to be installed on the machine or it falls back quietly." },
    ],
  },
  {
    id: "xlsx",
    title: "xlsx — Excel Spreadsheets",
    category: "Documents",
    author: "anthropics",
    repo: "https://github.com/anthropics/skills",
    stars: 160000,
    dateAdded: "2025-10-16",
    description:
      "Official Excel skill: create and edit spreadsheets with real formulas, charts, formatting, and data cleaning.",
    install: MANUAL_INSTALL("https://github.com/anthropics/skills", "skills/skills/xlsx", "xlsx"),
    details:
      "Writes live formulas (not baked values), builds charts, applies conditional formatting, and restructures messy tabular data into clean workbooks.",
    reviews: [
      { user: "fp_a_lead", rating: 5, date: "2026-05-19", text: "It writes actual formulas that recalculate. Our budget model updates itself now." },
      { user: "csv_wrangler", rating: 5, date: "2026-03-03", text: "Fed it a disgusting 40-column export. Got back a clean, pivoted workbook with charts." },
      { user: "leons", rating: 3, date: "2026-02-08", text: "Powerful but heavyweight for tiny edits — sometimes a one-cell change spawns a whole script." },
    ],
  },
  {
    id: "skill-creator",
    title: "skill-creator",
    category: "Workflows",
    author: "anthropics",
    repo: "https://github.com/anthropics/skills",
    stars: 160000,
    dateAdded: "2025-10-16",
    description:
      "The meta-skill: interactively scaffolds, edits, and evaluates new skills — the recommended way to author your own.",
    install: MANUAL_INSTALL("https://github.com/anthropics/skills", "skills/skills/skill-creator", "skill-creator"),
    details:
      "Walks you through naming, description-writing (critical for reliable triggering), folder structure, and eval-driven iteration on new skills. Maintained alongside the official Agent Skills spec in the same repo.",
    reviews: [
      { user: "buildermara", rating: 5, date: "2026-06-14", text: "Wrote my first three team skills with this. The description-tuning guidance fixed our triggering issues." },
      { user: "ops_kevin", rating: 4, date: "2026-04-09", text: "Solid scaffolding. Wish the eval harness examples covered non-coding skills more." },
    ],
  },
  {
    id: "mcp-builder",
    title: "mcp-builder",
    category: "Development",
    author: "anthropics",
    repo: "https://github.com/anthropics/skills",
    stars: 160000,
    dateAdded: "2025-11-04",
    description:
      "Official guide-skill for building high-quality MCP servers — protocol patterns, tool design, auth, and testing.",
    install: MANUAL_INSTALL("https://github.com/anthropics/skills", "skills/skills/mcp-builder", "mcp-builder"),
    details:
      "Encodes Anthropic's own conventions for Model Context Protocol servers: tool naming, schema design, error handling, and how to test servers before shipping.",
    reviews: [
      { user: "protocol_pete", rating: 5, date: "2026-05-28", text: "Shipped a production MCP server for our CRM in two days. The tool-design checklist alone is gold." },
      { user: "yuki.dev", rating: 4, date: "2026-03-21", text: "Great patterns. Python examples are stronger than the TypeScript ones right now." },
    ],
  },
  {
    id: "frontend-design",
    title: "frontend-design",
    category: "Development",
    author: "anthropics",
    repo: "https://github.com/anthropics/skills",
    stars: 160000,
    dateAdded: "2025-11-04",
    description:
      "Pushes Claude toward bold, intentional design decisions when building React + Tailwind UIs instead of generic boilerplate.",
    install: MANUAL_INSTALL("https://github.com/anthropics/skills", "skills/skills/frontend-design", "frontend-design"),
    details:
      "A taste-injection skill: typography scale discipline, restrained palettes, real visual hierarchy. Noticeably reduces the 'AI-generated dashboard' look in Claude's frontend output.",
    reviews: [
      { user: "pixelpusher", rating: 5, date: "2026-06-02", text: "Night and day. Claude stopped producing the same purple-gradient hero section every time." },
      { user: "sofia_ui", rating: 4, date: "2026-04-17", text: "Strong opinions, mostly good ones. Occasionally fights with an existing design system — disable it then." },
    ],
  },
  {
    id: "web-artifacts-builder",
    title: "web-artifacts-builder",
    category: "Development",
    author: "anthropics",
    repo: "https://github.com/anthropics/skills",
    stars: 160000,
    dateAdded: "2025-11-20",
    description:
      "Builds complex, multi-component HTML artifacts with React and Tailwind — state, routing, and polish in a single file.",
    install: MANUAL_INSTALL("https://github.com/anthropics/skills", "skills/skills/web-artifacts-builder", "web-artifacts-builder"),
    details:
      "Optimized for Claude.ai artifacts: teaches Claude to structure larger single-file apps cleanly, manage state, and avoid the common artifact pitfalls (broken imports, CDN issues).",
    reviews: [
      { user: "artifact_andy", rating: 5, date: "2026-05-11", text: "My artifacts went from toy demos to things I actually ship to stakeholders." },
      { user: "nb_dev", rating: 4, date: "2026-02-19", text: "Very good. Still hits size limits on truly large apps, but that's an artifacts constraint, not the skill's fault." },
    ],
  },
  {
    id: "canvas-design",
    title: "canvas-design",
    category: "Design & Creative",
    author: "anthropics",
    repo: "https://github.com/anthropics/skills",
    stars: 160000,
    dateAdded: "2025-10-16",
    description:
      "Design polished visual art, posters, and graphics as .png and .pdf — layout, color theory, and typography built in.",
    install: MANUAL_INSTALL("https://github.com/anthropics/skills", "skills/skills/canvas-design", "canvas-design"),
    details:
      "Turns Claude into a competent graphic designer for static output: event posters, social cards, infographics — rendered to pixel or print formats.",
    reviews: [
      { user: "printshop_niko", rating: 5, date: "2026-04-25", text: "Client-ready event posters straight out of a chat. The typography choices are genuinely tasteful." },
      { user: "megan.k", rating: 4, date: "2026-06-08", text: "Great for posters and cards. Multi-page brochure layouts take a few iterations." },
    ],
  },
  {
    id: "algorithmic-art",
    title: "algorithmic-art",
    category: "Design & Creative",
    author: "anthropics",
    repo: "https://github.com/anthropics/skills",
    stars: 160000,
    dateAdded: "2025-10-16",
    description:
      "Generative art with p5.js — flow fields, particle systems, and parametric compositions with seeded randomness.",
    install: MANUAL_INSTALL("https://github.com/anthropics/skills", "skills/skills/algorithmic-art", "algorithmic-art"),
    details:
      "A creative-coding skill covering p5.js sketch structure, seeded randomness for reproducibility, and classic generative techniques (flow fields, recursion, noise).",
    reviews: [
      { user: "genart_lu", rating: 5, date: "2026-03-29", text: "The seeded-randomness discipline means I can actually reproduce and iterate on outputs I like." },
      { user: "casualcoder9", rating: 4, date: "2026-01-30", text: "Fun and surprisingly deep. You'll want basic p5.js familiarity to steer it well." },
    ],
  },
  {
    id: "brand-guidelines",
    title: "brand-guidelines",
    category: "Communication",
    author: "anthropics",
    repo: "https://github.com/anthropics/skills",
    stars: 160000,
    dateAdded: "2025-10-16",
    description:
      "Applies Anthropic's official brand styling — a template for encoding your own company's brand into a skill.",
    install: MANUAL_INSTALL("https://github.com/anthropics/skills", "skills/skills/brand-guidelines", "brand-guidelines"),
    details:
      "Ships with Anthropic's palette and typography as a working example; the real value is forking it into a your-company-brand skill so every artifact and document lands on-brand.",
    reviews: [
      { user: "brandon_mktg", rating: 5, date: "2026-05-06", text: "Forked it with our brand tokens in an afternoon. Every deck and doc now comes out on-brand by default." },
      { user: "tessdesigns", rating: 4, date: "2026-02-14", text: "Great as a template. Use skill-creator alongside it when adapting to your own guidelines." },
    ],
  },
  {
    id: "internal-comms",
    title: "internal-comms",
    category: "Communication",
    author: "anthropics",
    repo: "https://github.com/anthropics/skills",
    stars: 160000,
    dateAdded: "2025-10-16",
    description:
      "Writes crisp status reports, newsletters, and FAQs in a consistent internal voice — no corporate fluff.",
    install: MANUAL_INSTALL("https://github.com/anthropics/skills", "skills/skills/internal-comms", "internal-comms"),
    details:
      "Encodes patterns for common internal formats: weekly status updates, incident comms, launch announcements, and FAQ docs, all tuned for skimmability.",
    reviews: [
      { user: "chiefofstaff_j", rating: 5, date: "2026-06-22", text: "Our weekly org update went from an hour of writing to five minutes of editing." },
      { user: "remote_rita", rating: 4, date: "2026-03-12", text: "Very good defaults. I customized the tone section — stock voice was slightly more formal than our culture." },
    ],
  },
  {
    id: "slack-gif-creator",
    title: "slack-gif-creator",
    category: "Design & Creative",
    author: "anthropics",
    repo: "https://github.com/anthropics/skills",
    stars: 160000,
    dateAdded: "2025-11-20",
    description:
      "Creates animated GIFs sized and optimized for Slack — celebration emotes, reaction gifs, tiny animations.",
    install: MANUAL_INSTALL("https://github.com/anthropics/skills", "skills/skills/slack-gif-creator", "slack-gif-creator"),
    details:
      "Handles Slack's size/dimension constraints automatically and generates lightweight programmatic animations — the team-morale skill nobody knew they needed.",
    reviews: [
      { user: "gifmaster_flex", rating: 5, date: "2026-04-01", text: "Custom team celebration emotes on demand. My most-used skill, no contest." },
      { user: "pm_daniela", rating: 4, date: "2026-05-20", text: "Delightful. Complex multi-character scenes are hit or miss, simple loops are perfect." },
    ],
  },
  {
    id: "webapp-testing",
    title: "webapp-testing",
    category: "Testing & QA",
    author: "anthropics",
    repo: "https://github.com/anthropics/skills",
    stars: 160000,
    dateAdded: "2025-11-04",
    description:
      "Official skill for testing local web apps with Playwright — navigate, assert, screenshot, and debug frontend behavior.",
    install: MANUAL_INSTALL("https://github.com/anthropics/skills", "skills/skills/webapp-testing", "webapp-testing"),
    details:
      "Gives Claude a disciplined Playwright workflow: launch the app, drive real browser interactions, capture screenshots and console errors, and verify fixes actually work.",
    reviews: [
      { user: "qa_quinn", rating: 5, date: "2026-06-17", text: "Claude now verifies its own frontend fixes in a real browser before telling me it's done. Trust restored." },
      { user: "startup_sam", rating: 4, date: "2026-02-23", text: "Works great once Playwright browsers are installed. First-run setup on CI took some fiddling." },
    ],
  },

  // ─── Community skills ───
  {
    id: "superpowers",
    title: "Superpowers",
    category: "Workflows",
    author: "obra",
    repo: "https://github.com/obra/superpowers",
    stars: 22000,
    dateAdded: "2025-10-20",
    description:
      "The most popular community skill pack: 20+ battle-tested skills for TDD, systematic debugging, planning, and code review.",
    install:
      "# Claude Code plugin install\n/plugin marketplace add obra/superpowers-marketplace\n/plugin install superpowers@superpowers-marketplace\n\n# Or clone and copy skills manually\ngit clone https://github.com/obra/superpowers",
    details:
      "Jesse Vincent's famous skill collection. Includes brainstorming-before-coding, test-driven development, root-cause debugging, subagent-driven planning, and 'how to receive code review'. Widely considered the reference for what community skills can be.",
    reviews: [
      { user: "tdd_tomas", rating: 5, date: "2026-05-30", text: "The TDD skill alone changed how I use Claude Code. It refuses to write implementation before a failing test — exactly right." },
      { user: "elena_codes", rating: 5, date: "2026-04-14", text: "The systematic-debugging skill has caught root causes I'd have patched over. Install this first." },
      { user: "graybeard_al", rating: 4, date: "2026-06-25", text: "Excellent but opinionated — it will slow you down on trivial scripts by design. Know when to toggle it off." },
    ],
  },
  {
    id: "playwright-skill",
    title: "playwright-skill",
    category: "Testing & QA",
    author: "lackeyjb",
    repo: "https://github.com/lackeyjb/playwright-skill",
    stars: 900,
    dateAdded: "2025-11-10",
    description:
      "General-purpose browser automation for Claude Code — scraping, form flows, and E2E checks with Playwright.",
    install: MANUAL_INSTALL("https://github.com/lackeyjb/playwright-skill", "playwright-skill", "playwright-skill"),
    details:
      "A leaner, general-purpose alternative to the official webapp-testing skill: good for scraping, automating repetitive browser flows, and quick end-to-end smoke checks.",
    reviews: [
      { user: "scrape_n_bake", rating: 5, date: "2026-03-08", text: "Simple, does what it says. Automated a weekly data pull from a legacy portal in one session." },
      { user: "devops_dee", rating: 4, date: "2026-05-15", text: "Good general automation. For app testing specifically the official skill is more thorough." },
    ],
  },
  {
    id: "ios-simulator-skill",
    title: "ios-simulator-skill",
    category: "Testing & QA",
    author: "conorluddy",
    repo: "https://github.com/conorluddy/ios-simulator-skill",
    stars: 700,
    dateAdded: "2025-12-01",
    description:
      "Drives the iOS Simulator from Claude Code — build, install, tap through, and screenshot iOS apps automatically.",
    install: MANUAL_INSTALL("https://github.com/conorluddy/ios-simulator-skill", "ios-simulator-skill", "ios-simulator"),
    details:
      "Wraps simctl and friends so Claude can build an app, boot a simulator, interact with the UI, and verify behavior — closing the loop for iOS development the way Playwright does for web.",
    reviews: [
      { user: "swiftly_done", rating: 5, date: "2026-04-28", text: "Claude fixes a SwiftUI bug, rebuilds, taps through the flow, screenshots the result. Feels like the future." },
      { user: "indie_iris", rating: 4, date: "2026-06-05", text: "Mac-only obviously, and Xcode versions matter. Once aligned it's superb." },
    ],
  },
  {
    id: "trailofbits-security",
    title: "Trail of Bits Security Skills",
    category: "Security",
    author: "trailofbits",
    repo: "https://github.com/trailofbits/claude-skills",
    stars: 1500,
    dateAdded: "2026-01-15",
    description:
      "Professional static-analysis skills from Trail of Bits — CodeQL and Semgrep workflows for finding real vulnerabilities.",
    install: MANUAL_INSTALL("https://github.com/trailofbits/claude-skills", "claude-skills", "trailofbits-security"),
    details:
      "From one of the most respected security firms: teaches Claude to run and triage CodeQL and Semgrep properly — writing custom queries, filtering noise, and reporting findings like a security engineer.",
    reviews: [
      { user: "appsec_anna", rating: 5, date: "2026-05-23", text: "The Semgrep rule-writing guidance is better than most paid training. Found two real issues in week one." },
      { user: "blue_team_ben", rating: 5, date: "2026-03-26", text: "Finally, security skills written by people who actually do audits for a living." },
    ],
  },
  {
    id: "ffuf-web-fuzzing",
    title: "ffuf-web-fuzzing",
    category: "Security",
    author: "jthack",
    repo: "https://github.com/jthack/ffuf_claude_skill",
    stars: 400,
    dateAdded: "2026-02-10",
    description:
      "Web fuzzing guidance for authorized penetration testing — wordlist selection, ffuf flags, and result triage.",
    install: MANUAL_INSTALL("https://github.com/jthack/ffuf_claude_skill", "ffuf_claude_skill", "ffuf-web-fuzzing"),
    details:
      "By bug-bounty hunter Joseph Thacker: encodes practical ffuf workflows for authorized testing engagements — endpoint discovery, parameter fuzzing, and separating signal from noise in results.",
    reviews: [
      { user: "bounty_hunter_x", rating: 5, date: "2026-04-19", text: "Triage guidance is the best part — Claude filters false positives instead of dumping raw ffuf output on you." },
      { user: "pentest_petra", rating: 4, date: "2026-06-01", text: "Solid for engagements. Assumes you already have ffuf and scope authorization sorted, as it should." },
    ],
  },
  {
    id: "claude-d3js-skill",
    title: "claude-d3js-skill",
    category: "Data & Visualization",
    author: "chrisvoncsefalvay",
    repo: "https://github.com/chrisvoncsefalvay/claude-d3js-skill",
    stars: 350,
    dateAdded: "2025-12-18",
    description:
      "Builds proper D3.js visualizations — scales, axes, transitions, and interaction patterns that hold up beyond toy charts.",
    install: MANUAL_INSTALL("https://github.com/chrisvoncsefalvay/claude-d3js-skill", "claude-d3js-skill", "d3js"),
    details:
      "Encodes idiomatic D3 patterns (joins, scales, layered composition) so Claude produces maintainable visualization code instead of copy-pasted bl.ocks spaghetti.",
    reviews: [
      { user: "vizwizard", rating: 5, date: "2026-05-09", text: "Claude's D3 went from 'works but unreadable' to code I'm happy to maintain. Join patterns done right." },
      { user: "data_journalist_k", rating: 4, date: "2026-03-15", text: "Great for bespoke charts. If you just need a bar chart, a chart library is still faster." },
    ],
  },
  {
    id: "expo-skills",
    title: "Expo App Skills",
    category: "Development",
    author: "expo",
    repo: "https://github.com/expo/skills",
    stars: 800,
    dateAdded: "2026-01-28",
    description:
      "Official skills from the Expo team for building React Native apps — routing, EAS builds, and platform conventions.",
    install: MANUAL_INSTALL("https://github.com/expo/skills", "skills", "expo"),
    details:
      "First-party skills from a major framework vendor: Expo Router patterns, EAS build/submit workflows, and the platform-specific gotchas the Expo team knows best.",
    reviews: [
      { user: "rn_rachel", rating: 5, date: "2026-06-19", text: "Vendor-authored skills are clearly the way. Claude stopped suggesting deprecated Expo APIs overnight." },
      { user: "mobile_mo", rating: 4, date: "2026-04-05", text: "EAS workflow guidance is excellent. Hoping they expand native-module coverage." },
    ],
  },

  // ─── Collections / directories ───
  {
    id: "awesome-claude-skills-travisvn",
    title: "awesome-claude-skills (travisvn)",
    category: "Collections",
    author: "travisvn",
    repo: "https://github.com/travisvn/awesome-claude-skills",
    stars: 14100,
    dateAdded: "2025-10-25",
    description:
      "The most-starred curated list of Claude skills — official, community, and vendor skills organized by category.",
    install:
      "# Browse the list, then install any skill it links to:\n# https://github.com/travisvn/awesome-claude-skills\n\n# Skills install by copying into your skills folder:\ncp -r <skill-folder> ~/.claude/skills/",
    details:
      "The de-facto community index. If a skill matters, it's probably listed here with a one-line description and link. Actively maintained with contribution guidelines.",
    reviews: [
      { user: "curator_cal", rating: 5, date: "2026-05-27", text: "My starting point whenever I need a skill for a new domain. Well-organized, low junk ratio." },
      { user: "newbie_nate", rating: 4, date: "2026-02-11", text: "Great index. As with any awesome-list, check the linked repo's freshness before installing." },
    ],
  },
  {
    id: "awesome-claude-skills-composio",
    title: "awesome-claude-skills (Composio)",
    category: "Collections",
    author: "ComposioHQ",
    repo: "https://github.com/ComposioHQ/awesome-claude-skills",
    stars: 5200,
    dateAdded: "2025-11-02",
    description:
      "Composio's curated skill list with a practical bent — integration-heavy workflows and tool-using skills.",
    install:
      "# Browse and pick skills:\n# https://github.com/ComposioHQ/awesome-claude-skills\n\ncp -r <skill-folder> ~/.claude/skills/",
    details:
      "Maintained by the Composio team; leans toward skills that connect Claude to external tools and real-world workflows. Good complement to the travisvn list.",
    reviews: [
      { user: "integration_iggy", rating: 4, date: "2026-04-12", text: "Found two workflow skills here that weren't on the other lists. Worth watching both." },
      { user: "ml_marta", rating: 4, date: "2026-06-09", text: "Nice categorization. Slightly more vendor-flavored picks, still genuinely useful." },
    ],
  },
  {
    id: "antigravity-awesome-skills",
    title: "antigravity-awesome-skills",
    category: "Collections",
    author: "sickn33",
    repo: "https://github.com/sickn33/antigravity-awesome-skills",
    stars: 3800,
    dateAdded: "2026-03-05",
    description:
      "The largest raw collection — 1,200+ skills covering nearly every niche. Quantity-first; curate before installing.",
    install:
      "git clone https://github.com/sickn33/antigravity-awesome-skills\n# Cherry-pick — don't install all 1200+:\ncp -r antigravity-awesome-skills/skills/<skill-name> ~/.claude/skills/",
    details:
      "A massive aggregation of community skills. Variable quality by design — treat it as a search space, not a curated set. Excellent when no curated list covers your niche.",
    reviews: [
      { user: "longtail_leo", rating: 4, date: "2026-05-31", text: "Found a niche LaTeX-tables skill here that existed nowhere else. You dig, but the gems are real." },
      { user: "skeptical_sue", rating: 3, date: "2026-04-23", text: "Quality varies wildly. Read every SKILL.md before installing — some are one-line stubs." },
    ],
  },
  {
    id: "karanb192-awesome",
    title: "awesome-claude-skills (karanb192)",
    category: "Collections",
    author: "karanb192",
    repo: "https://github.com/karanb192/awesome-claude-skills",
    stars: 2100,
    dateAdded: "2025-12-08",
    description:
      "50+ verified skills, each actually tested before listing — the quality-over-quantity directory.",
    install:
      "# Browse verified skills:\n# https://github.com/karanb192/awesome-claude-skills\n\ncp -r <skill-folder> ~/.claude/skills/",
    details:
      "Every listed skill is verified working before inclusion, covering TDD, debugging, git workflows, and document processing. Smaller but trustworthy — good for teams that can't audit everything themselves.",
    reviews: [
      { user: "teamlead_tara", rating: 5, date: "2026-06-13", text: "The verification promise holds up — everything I've installed from here worked first try." },
      { user: "backend_boris", rating: 4, date: "2026-03-19", text: "Smaller selection, higher hit rate. My default recommendation for teammates new to skills." },
    ],
  },
];

// ─── Merge: live catalog + curated enrichment ───

function curatedKey(s) {
  if (s.repo === "https://github.com/anthropics/skills") return `anthropics/skills#${s.id}`;
  const m = s.repo.match(/github\.com\/([^/]+\/[^/#?]+)/);
  return m ? m[1].toLowerCase() : s.id;
}

function cleanDescription(text) {
  // Guard against YAML block scalars the importer may not have flattened
  return /^[|>]/.test(text || "") ? "See the SKILL.md in the repository for details." : text;
}

function genericInstall(e) {
  return `# Manual install (Claude Code)\ngit clone ${e.repo}\n# copy the skill folder(s) into ~/.claude/skills/`;
}

const catalogByKey = new Map(catalog.entries.map((e) => [e.repoKey, e]));
const curatedKeys = new Set(CURATED.map(curatedKey));

const curated = CURATED.map((s) => {
  const live = catalogByKey.get(curatedKey(s));
  return {
    ...s,
    source: s.author === "anthropics" ? "official" : s.category === "Collections" ? "collection" : "community",
    stars: live?.stars ?? s.stars, // prefer live GitHub star counts
    dateAdded: s.dateAdded ?? live?.dateAdded ?? null,
    repo: live?.source === "official" ? live.repo : s.repo, // deep-link official skills to their folder
  };
});

const imported = catalog.entries
  .filter((e) => !curatedKeys.has(e.repoKey))
  .map(({ repoKey: _repoKey, ...e }) => ({
    ...e,
    description: cleanDescription(e.description),
    install: e.install ?? genericInstall(e),
    reviews: [],
  }));

export const SKILLS = [...curated, ...imported];
export const CATEGORIES = CATEGORY_ORDER.filter((c) => SKILLS.some((s) => s.category === c));
export const CATALOG_SYNCED_AT = (catalog.generatedAt || "").slice(0, 10);

export function averageRating(skill) {
  if (!skill.reviews?.length) return null;
  const sum = skill.reviews.reduce((a, r) => a + r.rating, 0);
  return Math.round((sum / skill.reviews.length) * 10) / 10;
}

export function formatStars(n) {
  if (n >= 1000) {
    const k = n / 1000;
    return (k >= 100 ? Math.round(k) : Math.round(k * 10) / 10) + "k";
  }
  return String(n);
}
