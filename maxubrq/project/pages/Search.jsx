// Search.jsx — universal search, designed as a library index card drawer.
//
// Trigger: ⌘/Ctrl + K (registered at App level), or the "search" link in
// the running head. Surface is a paper-colored card that covers the
// content area — not a modal floating over it. Feels like flipping to
// the back of the book.
//
// Result types: posts, passages, sections, and "my marks" (the reader's
// own reactions). Arrow-key navigation, enter opens.

const { useState, useEffect, useRef, useMemo } = React;

// ── The corpus ───────────────────────────────────────────────────────
// In production this is a pre-built search index. For this design,
// inline sample data that matches what the rest of the site shows.

const CORPUS = {
  posts: [
    { id: 'horizon-pendulum',  title: 'The Horizon of a Pendulum',
      topic: 'Science',  date: '14 Apr 2026', readMin: 9,
      excerpt: 'being a consideration of determinism and that which lies beyond it' },
    { id: 'debounce-rebuilt',  title: 'Debounce, Rebuilt',
      topic: 'Software', date: '22 Apr 2026', readMin: 18,
      excerpt: 'or, why the four-line utility is almost always wrong' },
    { id: 'reading-slowly',    title: 'On Reading Slowly',
      topic: 'Essay',    date: '02 Mar 2026', readMin: 6,
      excerpt: 'an argument for the long form in an age that forgot it' },
    { id: 'shape-of-proof',    title: 'The Shape of a Proof',
      topic: 'Science',  date: '18 Feb 2026', readMin: 12,
      excerpt: 'what a mathematical argument and a sonata have in common' },
    { id: 'color-of-silence',  title: 'The Color of Silence',
      topic: 'Art',      date: '04 Feb 2026', readMin: 7,
      excerpt: 'on Rothko, rooms, and what paint asks of you' },
  ],
  passages: [
    { id: 'p1', post: 'horizon-pendulum', postTitle: 'The Horizon of a Pendulum',
      section: 'When the small angle breaks',
      text: 'Determinism gives you the equation. It does not give you the future.' },
    { id: 'p2', post: 'horizon-pendulum', postTitle: 'The Horizon of a Pendulum',
      section: 'A closing note',
      text: 'past a certain horizon, the pendulum and you are both free.' },
    { id: 'p3', post: 'debounce-rebuilt', postTitle: 'Debounce, Rebuilt',
      section: 'A mental model',
      text: 'If your debounce can\u2019t tell you what state it\u2019s in, it isn\u2019t a primitive \u2014 it\u2019s a liability.' },
    { id: 'p4', post: 'horizon-pendulum', postTitle: 'The Horizon of a Pendulum',
      section: 'Lyapunov',
      text: 'Not a wall, but a fog: the far distance where even a perfect model stops being able to tell you what the pendulum is doing.' },
    { id: 'p5', post: 'reading-slowly', postTitle: 'On Reading Slowly',
      section: 'A defense',
      text: 'To read slowly is to trust that the writer meant the order of the sentences.' },
  ],
  sections: [
    { id: 's1', post: 'horizon-pendulum', postTitle: 'The Horizon of a Pendulum', label: 'The pendulum' },
    { id: 's2', post: 'horizon-pendulum', postTitle: 'The Horizon of a Pendulum', label: 'When the small angle breaks' },
    { id: 's3', post: 'horizon-pendulum', postTitle: 'The Horizon of a Pendulum', label: 'Lyapunov, or: the horizon' },
    { id: 's4', post: 'debounce-rebuilt', postTitle: 'Debounce, Rebuilt',        label: 'A mental model, in four states' },
    { id: 's5', post: 'debounce-rebuilt', postTitle: 'Debounce, Rebuilt',        label: 'The implementation, annotated' },
  ],
  marks: [
    { id: 'm1', post: 'horizon-pendulum', postTitle: 'The Horizon of a Pendulum',
      kind: 'resonant',
      text: 'past a certain horizon, the pendulum and you are both free.' },
    { id: 'm2', post: 'debounce-rebuilt', postTitle: 'Debounce, Rebuilt',
      kind: 'thinking',
      text: 'If your debounce can\u2019t tell you what state it\u2019s in, it isn\u2019t a primitive.' },
    { id: 'm3', post: 'reading-slowly', postTitle: 'On Reading Slowly',
      kind: 'resonant',
      text: 'To read slowly is to trust that the writer meant the order of the sentences.' },
  ],
};

const SUGGESTED = ['pendulum', 'debounce', 'determinism', 'reading slowly', 'Rothko'];
const RECENT = [
  { id: 'horizon-pendulum', title: 'The Horizon of a Pendulum', when: 'a few minutes ago' },
  { id: 'debounce-rebuilt', title: 'Debounce, Rebuilt',          when: 'yesterday' },
  { id: 'shape-of-proof',   title: 'The Shape of a Proof',       when: '2 days ago' },
];

// ── Tiny match helper with accent highlight ──────────────────────────
function Highlight({ text, q }) {
  if (!q) return <>{text}</>;
  const i = text.toLowerCase().indexOf(q.toLowerCase());
  if (i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <mark style={{ background: 'color-mix(in oklab, var(--accent) 18%, transparent)',
        color: 'var(--ink)', padding: '0 1px', borderRadius: 1,
        fontStyle: 'italic', fontWeight: 500 }}>
        {text.slice(i, i + q.length)}
      </mark>
      {text.slice(i + q.length)}
    </>
  );
}

// ── Filter matching ──────────────────────────────────────────────────
function runSearch(q) {
  const qq = q.trim().toLowerCase();
  if (!qq) return { posts: [], passages: [], sections: [], marks: [] };
  const match = (s) => s.toLowerCase().includes(qq);
  return {
    posts:    CORPUS.posts.filter((p) => match(p.title) || match(p.excerpt) || match(p.topic)),
    passages: CORPUS.passages.filter((p) => match(p.text) || match(p.postTitle)),
    sections: CORPUS.sections.filter((s) => match(s.label) || match(s.postTitle)),
    marks:    CORPUS.marks.filter((m) => match(m.text) || match(m.postTitle)),
  };
}

// ── Universal search surface ─────────────────────────────────────────
function UniversalSearch({ palette = 'warm', theme = 'light', initialOpen = false, onClose }) {
  const vars = (window.PALETTES && window.PALETTES[palette])
    ? window.PALETTES[palette][theme === 'dark' ? 'dark' : 'light']
    : { '--paper': '#faf6ec', '--paper2': '#f3ecdc', '--ink': '#1a1814',
        '--muted': 'rgba(26,24,20,0.55)', '--rule': 'rgba(26,24,20,0.22)',
        '--accent': '#a1432b' };

  const [q, setQ] = useState('');
  const [scope, setScope] = useState('all'); // all | posts | passages | sections | marks
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current && inputRef.current.focus(); }, []);

  const results = useMemo(() => runSearch(q), [q]);

  const flat = useMemo(() => {
    const include = (k) => scope === 'all' || scope === k;
    const list = [];
    if (include('posts'))    results.posts   .forEach((x) => list.push({ kind: 'post',    x }));
    if (include('sections')) results.sections.forEach((x) => list.push({ kind: 'section', x }));
    if (include('passages')) results.passages.forEach((x) => list.push({ kind: 'passage', x }));
    if (include('marks'))    results.marks   .forEach((x) => list.push({ kind: 'mark',    x }));
    return list;
  }, [results, scope]);

  useEffect(() => { setCursor(0); }, [q, scope]);

  // keyboard
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') { e.preventDefault(); onClose && onClose(); return; }
      if (e.key === 'ArrowDown') { e.preventDefault(); setCursor((c) => Math.min(flat.length - 1, c + 1)); }
      if (e.key === 'ArrowUp')   { e.preventDefault(); setCursor((c) => Math.max(0, c - 1)); }
      if (e.key === 'Enter')     { /* would jump to result */ }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [flat.length, onClose]);

  const totalCount = results.posts.length + results.passages.length +
    results.sections.length + results.marks.length;

  const Scope = ({ id, label, count }) => (
    <button onClick={() => setScope(id)} style={{
      display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'baseline',
      width: '100%', padding: '9px 12px',
      background: scope === id ? 'color-mix(in oklab, var(--accent) 12%, transparent)' : 'transparent',
      border: 'none', borderLeft: scope === id ? '2px solid var(--accent)' : '2px solid transparent',
      cursor: 'pointer', textAlign: 'left',
      fontFamily: 'var(--serif)', fontSize: 14,
      color: scope === id ? 'var(--ink)' : 'var(--muted)',
      fontStyle: scope === id ? 'normal' : 'italic',
      transition: 'all 0.12s',
    }}>
      <span>{label}</span>
      <span style={{ fontVariantNumeric: 'oldstyle-nums', fontSize: 12, color: 'var(--muted)' }}>
        {count > 0 ? count : ''}
      </span>
    </button>
  );

  const GroupHeader = ({ children, right }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
      padding: '18px 0 10px', margin: '0 24px',
      borderBottom: '1px solid var(--rule)',
      fontFamily: 'var(--serif)', fontVariant: 'small-caps',
      letterSpacing: '0.24em', fontSize: 10.5, color: 'var(--muted)' }}>
      <span>{children}</span>
      {right && <span style={{ letterSpacing: 0, fontVariant: 'normal', fontStyle: 'italic' }}>{right}</span>}
    </div>
  );

  // flat index mapping for cursor
  let idxCounter = 0;
  const nextIdx = () => idxCounter++;

  const Row = ({ children, i }) => (
    <div onMouseEnter={() => setCursor(i)}
      style={{
        display: 'block', padding: '14px 24px', borderBottom: '1px solid var(--rule)',
        background: cursor === i ? 'color-mix(in oklab, var(--accent) 7%, transparent)' : 'transparent',
        borderLeft: cursor === i ? '2px solid var(--accent)' : '2px solid transparent',
        cursor: 'pointer', transition: 'background 0.1s',
      }}>
      {children}
    </div>
  );

  return (
    <div style={{ ...vars, position: 'absolute', inset: 0,
      background: 'var(--paper)', color: 'var(--ink)',
      fontFamily: 'var(--serif)', zIndex: 100,
      display: 'grid', gridTemplateRows: 'auto 1fr auto', overflow: 'hidden' }}>

      {/* Header — the search bar */}
      <header style={{ display: 'grid', gridTemplateColumns: '1fr auto',
        alignItems: 'center', padding: '26px 40px 18px',
        borderBottom: '1px solid var(--rule)' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
          <div style={{ fontVariant: 'small-caps', letterSpacing: '0.3em',
            fontSize: 11, color: 'var(--muted)', paddingTop: 4 }}>
            Index
          </div>
          <input ref={inputRef} value={q} onChange={(e) => setQ(e.target.value)}
            placeholder="Search posts, passages, sections, your own marks…"
            style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent',
              fontFamily: 'var(--serif)', fontSize: 28, color: 'var(--ink)',
              fontStyle: q ? 'normal' : 'italic',
              letterSpacing: '-0.01em' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {q && <span style={{ fontSize: 12, color: 'var(--muted)',
            fontVariant: 'small-caps', letterSpacing: '0.18em' }}>
            {totalCount} {totalCount === 1 ? 'result' : 'results'}
          </span>}
          <button onClick={onClose} style={{ background: 'transparent', border: '1px solid var(--rule)',
            padding: '4px 8px', fontFamily: '"IBM Plex Mono", monospace',
            fontSize: 10.5, letterSpacing: 1, color: 'var(--muted)',
            cursor: 'pointer', borderRadius: 2 }}>ESC</button>
        </div>
      </header>

      {/* Body — two-column */}
      <div style={{ display: 'grid', gridTemplateColumns: '210px 1fr',
        minHeight: 0, borderBottom: '1px solid var(--rule)' }}>
        {/* Left rail */}
        <aside style={{ borderRight: '1px solid var(--rule)', padding: '22px 0',
          background: 'var(--paper2)', overflow: 'auto' }}>
          <div style={{ fontVariant: 'small-caps', letterSpacing: '0.24em',
            fontSize: 10.5, color: 'var(--muted)', padding: '0 14px 10px' }}>
            Scope
          </div>
          <Scope id="all"      label="All"           count={totalCount} />
          <Scope id="posts"    label="Posts"         count={results.posts.length} />
          <Scope id="sections" label="Sections"      count={results.sections.length} />
          <Scope id="passages" label="Passages"      count={results.passages.length} />
          <Scope id="marks"    label="My marks"      count={results.marks.length} />

          <div style={{ fontVariant: 'small-caps', letterSpacing: '0.24em',
            fontSize: 10.5, color: 'var(--muted)', padding: '28px 14px 10px' }}>
            Topic
          </div>
          {['Science', 'Software', 'Philosophy', 'Art', 'Essay'].map((t) => (
            <button key={t} style={{ display: 'block', width: '100%',
              background: 'transparent', border: 'none',
              padding: '6px 14px', textAlign: 'left', cursor: 'pointer',
              fontFamily: 'var(--serif)', fontSize: 13, fontStyle: 'italic',
              color: 'var(--muted)' }}>
              {t}
            </button>
          ))}
        </aside>

        {/* Results */}
        <main style={{ overflow: 'auto' }}>
          {!q && (
            <div style={{ padding: '32px 40px' }}>
              <div style={{ fontVariant: 'small-caps', letterSpacing: '0.3em',
                fontSize: 10.5, color: 'var(--muted)', marginBottom: 18 }}>
                Start typing, or try
              </div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 42 }}>
                {SUGGESTED.map((s) => (
                  <button key={s} onClick={() => setQ(s)}
                    style={{ background: 'transparent', border: '1px solid var(--rule)',
                      padding: '7px 14px', fontFamily: 'var(--serif)',
                      fontSize: 14, fontStyle: 'italic', color: 'var(--ink)',
                      cursor: 'pointer', borderRadius: 2,
                      transition: 'all 0.15s' }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent)';
                      e.currentTarget.style.color = 'var(--accent)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--rule)';
                      e.currentTarget.style.color = 'var(--ink)'; }}>
                    {s}
                  </button>
                ))}
              </div>

              <div style={{ fontVariant: 'small-caps', letterSpacing: '0.3em',
                fontSize: 10.5, color: 'var(--muted)', marginBottom: 14,
                borderBottom: '1px solid var(--rule)', paddingBottom: 10 }}>
                Recently read
              </div>
              {RECENT.map((r, i) => (
                <div key={r.id} style={{ padding: '14px 0',
                  borderBottom: i < RECENT.length - 1 ? '1px solid var(--rule)' : 'none',
                  display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 20,
                  alignItems: 'baseline' }}>
                  <span style={{ fontFamily: 'var(--serif)',
                    fontVariantNumeric: 'oldstyle-nums', color: 'var(--muted)',
                    fontSize: 13 }}>{String(i + 1).padStart(2, '0')}</span>
                  <span style={{ fontFamily: 'var(--serif)', fontSize: 17,
                    color: 'var(--ink)', fontStyle: 'italic' }}>{r.title}</span>
                  <span style={{ fontFamily: 'var(--serif)', fontSize: 12,
                    color: 'var(--muted)', fontStyle: 'italic' }}>{r.when}</span>
                </div>
              ))}
            </div>
          )}

          {q && totalCount === 0 && (
            <div style={{ padding: '60px 40px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic',
                fontSize: 20, color: 'var(--muted)', marginBottom: 18 }}>
                Nothing found for &ldquo;{q}&rdquo;.
              </div>
              <button onClick={() => setQ('')}
                style={{ background: 'transparent', border: 'none',
                  fontFamily: 'var(--serif)', fontStyle: 'italic',
                  fontSize: 14, color: 'var(--accent)', cursor: 'pointer',
                  borderBottom: '1px solid var(--accent)', padding: 0 }}>
                see the full index →
              </button>
            </div>
          )}

          {q && totalCount > 0 && (
            <div style={{ paddingBottom: 30 }}>
              {(scope === 'all' || scope === 'posts') && results.posts.length > 0 && (
                <>
                  <GroupHeader right={`${results.posts.length} ${results.posts.length === 1 ? 'post' : 'posts'}`}>
                    Posts
                  </GroupHeader>
                  {results.posts.map((p) => {
                    const i = nextIdx();
                    return (
                      <Row key={p.id} i={i}>
                        <div style={{ fontFamily: 'var(--serif)', fontSize: 19,
                          color: 'var(--ink)', lineHeight: 1.3, marginBottom: 4 }}>
                          <Highlight text={p.title} q={q} />
                        </div>
                        <div style={{ fontFamily: 'var(--serif)', fontSize: 14,
                          fontStyle: 'italic', color: 'var(--muted)',
                          lineHeight: 1.5, marginBottom: 6 }}>
                          <Highlight text={p.excerpt} q={q} />
                        </div>
                        <div style={{ fontFamily: 'var(--serif)', fontVariant: 'small-caps',
                          letterSpacing: '0.2em', fontSize: 10.5, color: 'var(--muted)' }}>
                          {p.topic} · {p.date} · {p.readMin} min
                        </div>
                      </Row>
                    );
                  })}
                </>
              )}

              {(scope === 'all' || scope === 'sections') && results.sections.length > 0 && (
                <>
                  <GroupHeader right={`${results.sections.length}`}>
                    Sections
                  </GroupHeader>
                  {results.sections.map((s) => {
                    const i = nextIdx();
                    return (
                      <Row key={s.id} i={i}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto',
                          alignItems: 'baseline', gap: 20 }}>
                          <div>
                            <div style={{ fontFamily: 'var(--serif)', fontSize: 16,
                              color: 'var(--ink)', marginBottom: 3 }}>
                              <span style={{ color: 'var(--muted)', fontStyle: 'italic',
                                marginRight: 8 }}>§</span>
                              <Highlight text={s.label} q={q} />
                            </div>
                            <div style={{ fontFamily: 'var(--serif)', fontSize: 12.5,
                              fontStyle: 'italic', color: 'var(--muted)' }}>
                              in &ldquo;{s.postTitle}&rdquo;
                            </div>
                          </div>
                          <span style={{ color: 'var(--accent)',
                            fontFamily: 'var(--serif)', fontSize: 14 }}>→</span>
                        </div>
                      </Row>
                    );
                  })}
                </>
              )}

              {(scope === 'all' || scope === 'passages') && results.passages.length > 0 && (
                <>
                  <GroupHeader right={`${results.passages.length}`}>
                    Passages
                  </GroupHeader>
                  {results.passages.map((p) => {
                    const i = nextIdx();
                    return (
                      <Row key={p.id} i={i}>
                        <blockquote style={{ margin: 0, borderLeft: '2px solid var(--accent)',
                          paddingLeft: 14, fontFamily: 'var(--serif)', fontSize: 16,
                          lineHeight: 1.55, color: 'var(--ink)', fontStyle: 'italic',
                          marginBottom: 8 }}>
                          &ldquo;<Highlight text={p.text} q={q} />&rdquo;
                        </blockquote>
                        <div style={{ fontFamily: 'var(--serif)', fontSize: 12,
                          fontStyle: 'italic', color: 'var(--muted)' }}>
                          from &ldquo;{p.postTitle}&rdquo; &nbsp;·&nbsp; § {p.section}
                        </div>
                      </Row>
                    );
                  })}
                </>
              )}

              {(scope === 'all' || scope === 'marks') && results.marks.length > 0 && (
                <>
                  <GroupHeader right={`${results.marks.length} · your private trail`}>
                    My marks
                  </GroupHeader>
                  {results.marks.map((m) => {
                    const i = nextIdx();
                    const r = findReactionMeta(m.kind);
                    return (
                      <Row key={m.id} i={i}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr',
                          gap: 14, alignItems: 'start' }}>
                          <span style={{ color: 'var(--accent)', fontSize: 18,
                            lineHeight: 1.2 }}>{r.glyph}</span>
                          <div>
                            <blockquote style={{ margin: 0, fontFamily: 'var(--serif)',
                              fontSize: 15.5, lineHeight: 1.55, color: 'var(--ink)',
                              fontStyle: 'italic', marginBottom: 6 }}>
                              &ldquo;<Highlight text={m.text} q={q} />&rdquo;
                            </blockquote>
                            <div style={{ fontFamily: 'var(--serif)',
                              fontVariant: 'small-caps', letterSpacing: '0.2em',
                              fontSize: 10.5, color: 'var(--muted)' }}>
                              {r.word} · from &ldquo;{m.postTitle}&rdquo;
                            </div>
                          </div>
                        </div>
                      </Row>
                    );
                  })}
                </>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Footer — keyboard legend */}
      <footer style={{ display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', padding: '12px 40px',
        background: 'var(--paper2)',
        fontFamily: '"IBM Plex Mono", monospace', fontSize: 10.5,
        letterSpacing: 0.4, color: 'var(--muted)' }}>
        <div style={{ display: 'flex', gap: 22 }}>
          <span><Kbd>↑</Kbd><Kbd>↓</Kbd> navigate</span>
          <span><Kbd>↵</Kbd> open</span>
          <span><Kbd>esc</Kbd> close</span>
          <span><Kbd>⌘</Kbd><Kbd>K</Kbd> reopen anywhere</span>
        </div>
        <div style={{ fontStyle: 'italic', fontFamily: 'var(--serif)',
          fontSize: 11, textTransform: 'none', letterSpacing: 0 }}>
          &ldquo;My marks&rdquo; are private to you.
        </div>
      </footer>
    </div>
  );
}

function Kbd({ children }) {
  return (
    <span style={{ display: 'inline-block', border: '1px solid var(--rule)',
      padding: '1px 5px', borderRadius: 2, marginRight: 4,
      minWidth: 14, textAlign: 'center', color: 'var(--ink)' }}>{children}</span>
  );
}

function findReactionMeta(kind) {
  const map = {
    resonant:  { glyph: '❤',  word: 'resonant'  },
    thinking:  { glyph: '✦',  word: 'thinking'  },
    reread:    { glyph: '↻',  word: 're-read'   },
    confused:  { glyph: '?',  word: 'confused'  },
    beautiful: { glyph: '✶',  word: 'beautiful' },
    disagree:  { glyph: '≠',  word: 'disagree'  },
  };
  return map[kind] || map.resonant;
}

window.UniversalSearch = UniversalSearch;

// Seeded wrapper — forces a query + scope so artboards show populated states.
function SearchSeeded({ palette, theme, q, scope }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const root = ref.current; if (!root) return;
    const id = setTimeout(() => {
      const input = root.querySelector('input');
      if (input && q) {
        const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        setter.call(input, q);
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
      if (scope) {
        const btns = root.querySelectorAll('button');
        btns.forEach((b) => {
          const t = (b.textContent || '').trim().toLowerCase();
          if (scope === 'marks' && t.startsWith('my marks')) b.click();
          else if (scope !== 'marks' && t === scope) b.click();
        });
      }
    }, 60);
    return () => clearTimeout(id);
  }, [q, scope]);
  return React.createElement('div',
    { ref, style: { position: 'relative', height: '100%' } },
    React.createElement(UniversalSearch, { palette, theme, onClose: () => {} })
  );
}
window.SearchSeeded = SearchSeeded;
