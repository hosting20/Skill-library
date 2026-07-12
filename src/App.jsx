import { useEffect, useMemo, useRef, useState } from "react";
import { SKILLS, CATEGORIES, CATALOG_SYNCED_AT, averageRating, formatStars } from "./data/skills";
import {
  MoonIcon, SunIcon, SearchIcon, CheckIcon, CloseIcon, CopyIcon,
  StarIcon, GithubIcon, UserIcon, CalendarIcon, TerminalIcon, Stars,
} from "./icons";

const THEME_KEY = "skill-library-theme";

function SkillCard({ skill, onQuickView }) {
  const rating = averageRating(skill);
  return (
    <div
      className="card elev-sm sl-card"
      style={{ cursor: "pointer" }}
      onClick={onQuickView}
      tabIndex={0}
      role="button"
      aria-label={`Quick view ${skill.title}`}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onQuickView(); } }}
    >
      <div style={{ display: "flex", gap: 6, alignSelf: "flex-start" }}>
        <span className="tag tag-neutral">{skill.category}</span>
        {skill.source === "official" && <span className="tag tag-accent">Official</span>}
      </div>
      <h3 className="card-title">{skill.title}</h3>
      <p className="card-body">{skill.description}</p>
      <div className="card-meta">
        <GithubIcon size={12} />
        {skill.author}
        {skill.stars != null && (
          <>
            <span style={{ opacity: 0.4 }}>·</span>
            <StarIcon size={12} />
            {formatStars(skill.stars)}
          </>
        )}
        {rating && (
          <>
            <span style={{ opacity: 0.4 }}>·</span>
            <Stars value={rating} size={10} />
            {rating}
          </>
        )}
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 2 }}>
        <a
          href={skill.repo}
          target="_blank"
          rel="noreferrer"
          className="btn btn-primary"
          style={{ flex: 1, fontSize: 12 }}
          onClick={(e) => e.stopPropagation()}
        >
          <GithubIcon size={13} />
          View on GitHub
        </a>
        <button
          type="button"
          className="btn btn-secondary"
          style={{ fontSize: 12 }}
          onClick={(e) => { e.stopPropagation(); onQuickView(); }}
        >
          Quick View
        </button>
      </div>
    </div>
  );
}

function QuickView({ skill, onClose }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => { setCopied(false); }, [skill.id]);

  const copyInstall = () => {
    try { navigator.clipboard.writeText(skill.install); } catch { /* clipboard unavailable */ }
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1800);
  };

  const rating = averageRating(skill);

  return (
    <>
      <div className="sl-backdrop" onClick={onClose} />
      <div className="sl-panel" role="dialog" aria-modal="true" aria-label={skill.title}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "var(--space-3)" }}>
          <div style={{ display: "flex", gap: 6 }}>
            <span className="tag tag-neutral">{skill.category}</span>
            {skill.source === "official" && <span className="tag tag-accent">Official</span>}
          </div>
          <button type="button" className="btn btn-icon btn-secondary" aria-label="Close" onClick={onClose}>
            <CloseIcon size={16} />
          </button>
        </div>

        <div>
          <h3 style={{ margin: "0 0 6px" }}>{skill.title}</h3>
          <p style={{ margin: 0, fontSize: 14, opacity: 0.8 }}>{skill.description}</p>
        </div>

        <div className="card-meta" style={{ fontSize: 12, flexWrap: "wrap" }}>
          <UserIcon size={12} />
          {skill.author}
          {skill.stars != null && (
            <>
              <span style={{ opacity: 0.4 }}>·</span>
              <StarIcon size={12} />
              {formatStars(skill.stars)} stars
            </>
          )}
          {skill.dateAdded && (
            <>
              <span style={{ opacity: 0.4 }}>·</span>
              <CalendarIcon size={12} />
              Added {skill.dateAdded}
            </>
          )}
        </div>

        {skill.details && (
          <p style={{ margin: 0, fontSize: 13, opacity: 0.75, lineHeight: 1.6 }}>{skill.details}</p>
        )}

        <a href={skill.repo} target="_blank" rel="noreferrer" className="btn btn-primary btn-block">
          <GithubIcon size={14} />
          View on GitHub
        </a>

        <hr className="hr" style={{ margin: 0 }} />

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <h6 style={{ margin: 0, opacity: 0.7, display: "inline-flex", alignItems: "center", gap: 6 }}>
              <TerminalIcon size={13} /> Install
            </h6>
            <button type="button" className="btn btn-ghost" style={{ fontSize: 12 }} onClick={copyInstall}>
              {copied ? (<><CheckIcon size={13} /> Copied</>) : (<><CopyIcon size={13} /> Copy</>)}
            </button>
          </div>
          <pre className="sl-pre">{skill.install}</pre>
        </div>

        <hr className="hr" style={{ margin: 0 }} />

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <h6 style={{ margin: 0, opacity: 0.7 }}>User Reviews</h6>
            {rating && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, opacity: 0.85 }}>
                <Stars value={rating} size={12} />
                {rating} · {skill.reviews.length} review{skill.reviews.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>
          {skill.reviews.length === 0 && (
            <p style={{ margin: 0, fontSize: 12.5, opacity: 0.6 }}>
              No reviews yet for this skill — check the repository's issues and discussions for community feedback.
            </p>
          )}
          {skill.reviews.map((r, i) => (
            <div key={i} className="sl-review">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 500 }}>{r.user}</span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <Stars value={r.rating} size={10} />
                  <span className="text-muted" style={{ fontSize: 11 }}>{r.date}</span>
                </span>
              </div>
              <p style={{ margin: "5px 0 0", fontSize: 12.5, lineHeight: 1.55, opacity: 0.85 }}>{r.text}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default function App() {
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem(THEME_KEY) === "light" ? "light" : "dark"; }
    catch { return "dark"; }
  });
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sort, setSort] = useState("newest");
  const [quickViewId, setQuickViewId] = useState(null);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") setQuickViewId(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const toggleTheme = () => {
    setTheme((t) => {
      const next = t === "dark" ? "light" : "dark";
      try { localStorage.setItem(THEME_KEY, next); } catch { /* private mode */ }
      return next;
    });
  };

  const toggleCategory = (cat) =>
    setSelectedCategories((cur) =>
      cur.includes(cat) ? cur.filter((c) => c !== cat) : [...cur, cat]
    );

  const clearAll = () => { setSearch(""); setSelectedCategories([]); setSort("newest"); };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = SKILLS.filter((s) => {
      const matchesSearch =
        !q ||
        s.title.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.author.toLowerCase().includes(q);
      const matchesCategory =
        selectedCategories.length === 0 || selectedCategories.includes(s.category);
      return matchesSearch && matchesCategory;
    });
    if (sort === "stars") list = [...list].sort((a, b) => b.stars - a.stars);
    else if (sort === "az") list = [...list].sort((a, b) => a.title.localeCompare(b.title));
    else list = [...list].sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
    return list;
  }, [search, selectedCategories, sort]);

  const activeBadges = [
    ...(search ? [{ key: "search", label: `“${search}”`, onRemove: () => setSearch("") }] : []),
    ...selectedCategories.map((cat) => ({ key: cat, label: cat, onRemove: () => toggleCategory(cat) })),
  ];

  const quickViewSkill = quickViewId ? SKILLS.find((s) => s.id === quickViewId) : null;

  return (
    <div data-theme={theme} className="sl-root">
      <div className="sl-navwrap">
        <div className="nav" style={{ maxWidth: 1400, margin: "0 auto", padding: "var(--space-3) var(--space-6)" }}>
          <span className="nav-brand" style={{ marginRight: 0 }}>Skill Library</span>
          <span className="text-muted" style={{ fontSize: 12, marginLeft: "var(--space-3)" }}>
            All Claude skills in one place · synced from GitHub{CATALOG_SYNCED_AT ? ` · ${CATALOG_SYNCED_AT}` : ""}
          </span>
          <div style={{ flex: 1 }} />
          <button type="button" className="btn btn-icon btn-secondary" aria-label="Toggle theme" onClick={toggleTheme}>
            {theme === "dark" ? <MoonIcon size={18} /> : <SunIcon size={18} />}
          </button>
        </div>
      </div>

      <div className="sl-shell">
        <aside className="sl-sidebar">
          <div className="field">
            <label htmlFor="sl-search">Search</label>
            <div style={{ position: "relative" }}>
              <SearchIcon
                size={15}
                style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", opacity: 0.55, pointerEvents: "none" }}
              />
              <input
                id="sl-search"
                className="input"
                type="text"
                placeholder="Search skills, authors…"
                style={{ paddingLeft: 32 }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div>
            <h6 style={{ margin: "0 0 var(--space-3)", color: "var(--color-text)", opacity: 0.7 }}>Category</h6>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {CATEGORIES.map((name) => {
                const active = selectedCategories.includes(name);
                const count = SKILLS.filter((s) => s.category === name).length;
                return (
                  <button key={name} type="button" className="sl-catrow" onClick={() => toggleCategory(name)}>
                    <span
                      className="sl-catdot"
                      style={{
                        borderColor: active ? "var(--color-accent)" : "var(--color-divider)",
                        background: active ? "var(--color-accent)" : "transparent",
                      }}
                    >
                      {active && <CheckIcon size={10} fill="var(--color-bg)" />}
                    </span>
                    <span style={{ flex: 1 }}>{name}</span>
                    <span className="text-muted" style={{ fontSize: 11 }}>{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="field">
            <label htmlFor="sl-sort">Sort by</label>
            <select id="sl-sort" className="input" value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="newest">Newest</option>
              <option value="stars">Most stars</option>
              <option value="az">A–Z</option>
            </select>
          </div>

          {activeBadges.length > 0 && (
            <button type="button" className="btn btn-secondary btn-block" onClick={clearAll}>
              Clear all filters
            </button>
          )}
        </aside>

        <main style={{ minWidth: 0, display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "var(--space-3)" }}>
            <p style={{ margin: 0, fontSize: 14, opacity: 0.85 }}>
              Showing {filtered.length} of {SKILLS.length} Skills
            </p>
            {activeBadges.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 6 }}>
                {activeBadges.map((b) => (
                  <span key={b.key} className="tag tag-neutral" style={{ display: "inline-flex", alignItems: "center", gap: 6, cursor: "default" }}>
                    {b.label}
                    <button type="button" className="sl-badge-x" aria-label="Remove filter" onClick={b.onRemove}>
                      <CloseIcon size={10} />
                    </button>
                  </span>
                ))}
                <button type="button" className="btn btn-ghost" style={{ fontSize: 12, padding: "2px 8px" }} onClick={clearAll}>
                  Clear all
                </button>
              </div>
            )}
          </div>

          {filtered.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "var(--space-4)" }}>
              {filtered.map((skill) => (
                <SkillCard key={skill.id} skill={skill} onQuickView={() => setQuickViewId(skill.id)} />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "calc(var(--space-8) * 2) 0", opacity: 0.6 }}>
              <p style={{ margin: "0 0 var(--space-2)", fontSize: 16 }}>No skills match your filters.</p>
              <button type="button" className="btn btn-ghost" onClick={clearAll}>Clear all filters</button>
            </div>
          )}
        </main>
      </div>

      {quickViewSkill && <QuickView skill={quickViewSkill} onClose={() => setQuickViewId(null)} />}
    </div>
  );
}
