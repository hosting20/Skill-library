# Skill Library — All Claude Skills in One Place

A single-page directory of Claude skills published on GitHub, so you don't have to hunt across repos yourself. Search, filter by category, sort, and open a Quick View panel with full details, install instructions, and user reviews for each skill.

Built with React + Vite, styled pixel-per-spec with the **Nocturne** design system from the design handoff in `../Skills Repository Dashboard/design_handoff_skill_library/`.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
```

## What's inside

- **400+ real skills imported live from GitHub** (`npm run import`): every official skill in `anthropics/skills` (parsed from each skill's own `SKILL.md`), community repos found via GitHub topic/keyword search with live star counts, and everything linked from the major awesome-lists (travisvn, ComposioHQ, karanb192).
- **25 hand-curated entries** on top with richer details, tested install commands, and seeded reviews (superpowers, Trail of Bits, playwright-skill, the official document skills, …).
- **Quick View panel** per skill: description, author, GitHub stars, date added, a copyable install command, a "View on GitHub" link, and user reviews with star ratings.
- **Search** (title/description/author), **multi-select category filter** with removable badges, **sort** (Newest / Most stars / A–Z), **dark/light theme** persisted to localStorage, responsive single-column layout under 880px.

## Refreshing the catalog

```bash
npm run import                 # rewrites src/data/catalog.json from GitHub
GITHUB_TOKEN=ghp_xxx npm run import   # higher rate limits, full star coverage
```

The importer ([scripts/import-skills.mjs](scripts/import-skills.mjs)) pulls from three sources: GitHub repo search (`topic:claude-skills`, `topic:agent-skills`, keyword queries), the `anthropics/skills` git tree (frontmatter of every `SKILL.md`), and the awesome-list READMEs. Results are deduped, categorized heuristically, sorted by stars, and capped at 500. Run it on a schedule (or in CI before deploy) to keep the catalog fresh — the sync date shows in the nav bar.

## Data notes (important)

- **Skills, repos, authors, descriptions, and star counts are real, live GitHub data** from the last `npm run import`.
- **Reviews exist only on the 25 curated entries in [`src/data/skills.js`](src/data/skills.js) and are seeded sample data** written to be representative — there is no review backend yet. Imported skills honestly show "No reviews yet."
- Curated entries win over imported duplicates (matched by repo / official skill name) but take their star counts from the live import.

## Structure

```
src/
  data/skills.js   # all skill + review data (edit here to add skills)
  App.jsx          # page, sidebar, card grid, Quick View panel
  icons.jsx        # inline Phosphor icons
  nocturne.css     # Nocturne design-system tokens & components (from the handoff)
  index.css        # light-theme override + page-level classes
```
