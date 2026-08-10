// Glossary.jsx — interactive inline glossary system.
//
// Surfaces:
//   GlossaryProvider    — hosts the shared term dictionary on React context.
//   Term / G            — inline marker for a glossary term. Hover = tooltip,
//                         click = pinned popover. Same component for both.
//   GlossaryFootnote    — per-post, collects every <Term> used and lists them
//                         at the foot of the article (like footnotes).
//   GlossaryPage        — site-level /glossary, A–Z index w/ post citations.
//
// Design intent:
//   - Inline marks: hair dotted underline in accent + a tiny superscript °
//     after the term. Restrained, textbook feel. Not a button, not a link.
//   - Hover: light tooltip card, auto-dismisses. No pin, no actions.
//   - Click: the card upgrades to a pinned popover with actions — "see
//     appearances", "read full entry in glossary", "copy definition".
//   - Per-post footnote block: mirrors the footnote apparatus and reuses
//     the small-caps roman numeral treatment for consistency.
//   - Site page: looks like an old dictionary — small-caps headers per
//     letter, each entry is typographic, appearances listed in italic.

// ── Dictionary ────────────────────────────────────────────────────────
// Terms used in the pendulum article + a few seed terms from other posts,
// so the site-level page looks inhabited. Author-curated, not scraped.

const TERMS = {
  'lyapunov-exponent': {
    term: 'Lyapunov exponent',
    pos: 'noun · dynamical systems',
    short: 'A number that measures how fast nearby trajectories pull apart. Positive = chaos; the larger it is, the sooner your predictions fog over.',
    long: 'A positive Lyapunov exponent means that two starting points that differ by \u03b5 grow apart as \u03b5 \u00b7 e^{\u03bbt}. Double your measurement precision and you buy only a fixed extra horizon \u2014 minutes, maybe hours, depending on \u03bb. It is the clearest quantitative answer to the question "how far can we see into a deterministic system?"',
    topic: 'Science',
    appearances: [
      { title: 'The horizon of a pendulum', section: 'Lyapunov, or: the horizon' },
    ],
  },
  'deterministic': {
    term: 'deterministic',
    pos: 'adjective',
    short: 'A system whose future is fully fixed by its present state \u2014 no randomness involved. But: determined does not mean predictable.',
    long: 'A deterministic system has one and only one trajectory through each point of its state space. Predictability is another question entirely: it depends on how well you can measure, and how fast errors grow.',
    topic: 'Science',
    appearances: [
      { title: 'The horizon of a pendulum', section: 'Chaos' },
    ],
  },
  'small-angle-approximation': {
    term: 'small-angle approximation',
    pos: 'noun · physics',
    short: 'Pretending sin \u03b8 \u2248 \u03b8 when \u03b8 is small. Turns a hard equation into a simple one \u2014 and lies at every other angle.',
    long: 'The great friendly deception of introductory physics. It turns the pendulum equation into the equation of simple harmonic motion, which has a tidy solution. The moment you swing harder, the approximation stops paying rent.',
    topic: 'Science',
    appearances: [
      { title: 'The horizon of a pendulum', section: 'When the small angle breaks' },
    ],
  },
  'debounce': {
    term: 'debounce',
    pos: 'noun/verb · interaction',
    short: 'A technique that delays the effect of repeated events until the storm of events has quieted for a moment.',
    long: 'Distinct from throttle: throttle fires on a cadence; debounce waits out the silence. Use debounce when you want only the settled answer (search-as-you-type). Use throttle when you want a steady stream (scroll-driven animation).',
    topic: 'Software',
    appearances: [
      { title: 'Debounce, rebuilt', section: '\u00a7 I' },
    ],
  },
  'state-machine': {
    term: 'state machine',
    pos: 'noun',
    short: 'A formalism: a finite set of states, and rules for moving between them.',
    long: 'A state machine makes illegal states unrepresentable. If your debounce can be in {idle, waiting, cooling}, you cannot ask "is it waiting AND idle?" \u2014 the question does not exist. This is the quiet superpower of the form.',
    topic: 'Software',
    appearances: [
      { title: 'Debounce, rebuilt', section: '\u00a7 II' },
    ],
  },
  'via-negativa': {
    term: 'via negativa',
    pos: 'noun · latin',
    short: 'The practice of defining something by what it is not. To say what God is not, rather than what God is.',
    long: 'From apophatic theology. The method turns out to be useful well outside religion \u2014 in aesthetics, in engineering, in how we build trust. Often the cleanest definition of "a good essay" is the list of what it refuses to be.',
    topic: 'Philosophy',
    appearances: [
      { title: 'On reading slowly', section: 'Opening' },
    ],
  },
  'chiaroscuro': {
    term: 'chiaroscuro',
    pos: 'noun · italian',
    short: 'The strong interplay of light and dark in a painting. From Caravaggio to Rothko.',
    long: 'Literally "light-dark". A painting built on chiaroscuro draws the eye without narrative \u2014 the eye goes to the light because the eye does. Abstraction inherits this trick without having to draw a face.',
    topic: 'Art',
    appearances: [
      { title: 'Agnes Martin and the grid as devotion', section: 'Light' },
    ],
  },
};

// Make it available on window for other components (TopicPage, etc.)
window.GLOSSARY_TERMS = TERMS;

// ── Inline Term ───────────────────────────────────────────────────────
// Usage in article body:  <Term id="lyapunov-exponent">Lyapunov exponent</Term>
// Or shorthand:           <G id="lyapunov-exponent" />   (uses term.term as label)

function Term({ id, children }) {
  const entry = TERMS[id];
  if (!entry) return <span>{children}</span>;

  const [hovered, setHovered] = React.useState(false);
  const [pinned, setPinned] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const anchorRef = React.useRef(null);
  const shown = hovered || pinned;

  // Register term usage with any parent <GlossaryFootnote> collector,
  // or a window-level collector (useful in ArticlePage which does not wrap).
  const collect = React.useContext(GlossaryCollectContext);
  React.useEffect(() => {
    if (collect) collect(id);
    else if (typeof window.__glossaryCollect === 'function') window.__glossaryCollect(id);
  }, [id, collect]);

  // Close pinned popover on outside click or Esc.
  React.useEffect(() => {
    if (!pinned) return;
    const onDoc = (e) => {
      if (anchorRef.current && !anchorRef.current.contains(e.target)) setPinned(false);
    };
    const onKey = (e) => { if (e.key === 'Escape') setPinned(false); };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [pinned]);

  const copy = () => {
    navigator.clipboard && navigator.clipboard.writeText(`${entry.term} — ${entry.short}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };

  return (
    <span ref={anchorRef} style={{ position: 'relative', whiteSpace: 'nowrap' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}>
      <span onClick={() => setPinned((p) => !p)}
        style={{
          cursor: 'help',
          borderBottom: '1px dotted var(--accent)',
          paddingBottom: 1,
        }}>
        {children || entry.term}
      </span>
      <sup style={{ fontSize: '0.7em', color: 'var(--accent)',
        marginLeft: 1, fontFamily: 'var(--serif)', fontStyle: 'normal',
        cursor: 'help', userSelect: 'none' }}
        onClick={() => setPinned((p) => !p)}>
        °
      </sup>

      {shown && (
        <span onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              style={{
          position: 'absolute',
          left: 0, top: 'calc(100% + 8px)',
          zIndex: 40,
          width: pinned ? 360 : 300,
          background: 'var(--paper)',
          border: '1px solid var(--rule)',
          borderLeft: '2px solid var(--accent)',
          boxShadow: pinned ? '0 10px 36px rgba(0,0,0,0.12)' : '0 4px 16px rgba(0,0,0,0.06)',
          fontFamily: 'var(--serif)',
          color: 'var(--ink)',
          padding: '14px 18px 14px',
          whiteSpace: 'normal',
          transition: 'width 0.18s',
        }}>
          {/* Header — term + pos */}
          <div style={{ display: 'flex', alignItems: 'baseline',
            justifyContent: 'space-between', gap: 12, marginBottom: 6 }}>
            <span style={{ fontWeight: 500, fontSize: 15, letterSpacing: '-0.005em' }}>
              {entry.term}
            </span>
            <span style={{ fontSize: 10.5, fontStyle: 'italic',
              color: 'var(--muted)', whiteSpace: 'nowrap' }}>
              {entry.pos}
            </span>
          </div>

          {/* Short definition */}
          <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.55,
            color: 'var(--ink)' }}>
            {entry.short}
          </p>

          {/* Long def + actions only when pinned */}
          {pinned && (
            <>
              <div style={{ height: 1, background: 'var(--rule)', margin: '12px 0' }} />
              <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.55,
                color: 'var(--muted)', fontStyle: 'italic' }}>
                {entry.long}
              </p>

              {entry.appearances.length > 0 && (
                <div style={{ marginTop: 12 }}>
                  <div style={{ fontVariant: 'small-caps', letterSpacing: '0.22em',
                    fontSize: 9.5, color: 'var(--muted)', marginBottom: 4 }}>
                    Also appears in
                  </div>
                  <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                    {entry.appearances.map((a, i) => (
                      <li key={i} style={{ fontSize: 12, color: 'var(--ink)',
                        display: 'flex', justifyContent: 'space-between',
                        padding: '3px 0', borderBottom: i < entry.appearances.length - 1 ? '1px dotted var(--rule)' : 'none' }}>
                        <span style={{ fontStyle: 'italic' }}>{a.title}</span>
                        <span style={{ color: 'var(--muted)', fontSize: 11 }}>{a.section}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div style={{ marginTop: 12, display: 'flex',
                justifyContent: 'space-between', alignItems: 'baseline',
                fontSize: 10.5, fontVariant: 'small-caps', letterSpacing: '0.2em' }}>
                <button onClick={copy} style={{
                  background: 'transparent', border: 'none', padding: 0,
                  cursor: 'pointer', color: copied ? 'var(--accent)' : 'var(--muted)',
                  fontFamily: 'var(--serif)', fontVariant: 'small-caps',
                  letterSpacing: '0.2em', fontSize: 10.5 }}>
                  {copied ? 'copied' : 'copy'}
                </button>
                <a href="#glossary" style={{ color: 'var(--accent)',
                  textDecoration: 'none', borderBottom: '1px solid var(--accent)' }}>
                  see full entry
                </a>
                <button onClick={() => setPinned(false)} style={{
                  background: 'transparent', border: 'none', padding: 0,
                  cursor: 'pointer', color: 'var(--muted)',
                  fontFamily: 'var(--serif)', fontVariant: 'small-caps',
                  letterSpacing: '0.2em', fontSize: 10.5 }}>
                  dismiss · esc
                </button>
              </div>
            </>
          )}

          {!pinned && (
            <div style={{ marginTop: 8, fontSize: 10.5, fontVariant: 'small-caps',
              letterSpacing: '0.22em', color: 'var(--muted)', fontStyle: 'normal' }}>
              click to pin
            </div>
          )}
        </span>
      )}
    </span>
  );
}

// Shorthand: <G id="lyapunov-exponent" />
function G({ id }) {
  return <Term id={id} />;
}

// Context used by <GlossaryFootnote> to collect terms used in its children.
const GlossaryCollectContext = React.createContext(null);

// ── Per-post Glossary Footnote ────────────────────────────────────────
// Drop at the end of an article. It collects every <Term>/<G> used in any
// descendant (by wrapping them in a context), and renders a footnote-style
// block listing them alphabetically.
//
// Usage:
//   <GlossaryFootnote>
//     <article>... <Term id="..."/> ... </article>
//   </GlossaryFootnote>

function GlossaryFootnote({ children }) {
  const [used, setUsed] = React.useState(new Set());
  const add = React.useCallback((id) => {
    setUsed((s) => {
      if (s.has(id)) return s;
      const next = new Set(s);
      next.add(id);
      return next;
    });
  }, []);

  const list = Array.from(used)
    .map((id) => ({ id, ...TERMS[id] }))
    .filter((t) => t.term)
    .sort((a, b) => a.term.localeCompare(b.term));

  return (
    <GlossaryCollectContext.Provider value={add}>
      {children}
      {list.length > 0 && (
        <section style={{ marginTop: '3em', paddingTop: 20,
          borderTop: '1px solid var(--rule)' }}>
          <div style={{ display: 'flex', alignItems: 'baseline',
            justifyContent: 'space-between', marginBottom: 18 }}>
            <h3 style={{ margin: 0, fontFamily: 'var(--serif)',
              fontVariant: 'small-caps', letterSpacing: '0.28em',
              fontSize: 11, color: 'var(--muted)', fontWeight: 400 }}>
              Glossary
            </h3>
            <span style={{ fontFamily: 'var(--serif)',
              fontStyle: 'italic', fontSize: 12, color: 'var(--muted)' }}>
              terms used in this piece
            </span>
          </div>

          <dl style={{ margin: 0, display: 'grid',
            gridTemplateColumns: '160px 1fr', columnGap: 32, rowGap: 14 }}>
            {list.map((t) => (
              <React.Fragment key={t.id}>
                <dt style={{ fontFamily: 'var(--serif)',
                  fontSize: 14.5, fontStyle: 'italic',
                  color: 'var(--ink)', textAlign: 'right',
                  paddingTop: 2, fontVariantNumeric: 'oldstyle-nums' }}>
                  {t.term}
                  <div style={{ fontStyle: 'normal', fontSize: 10.5,
                    fontVariant: 'small-caps', letterSpacing: '0.2em',
                    color: 'var(--muted)', marginTop: 2 }}>
                    {t.pos}
                  </div>
                </dt>
                <dd style={{ margin: 0, fontFamily: 'var(--serif)',
                  fontSize: 14, lineHeight: 1.55, color: 'var(--ink)' }}>
                  {t.short}
                </dd>
              </React.Fragment>
            ))}
          </dl>

          <div style={{ marginTop: 16, fontSize: 11.5,
            fontFamily: 'var(--serif)', fontStyle: 'italic',
            color: 'var(--muted)', textAlign: 'center' }}>
            The full glossary, across all posts, lives <a href="#glossary"
              style={{ color: 'var(--accent)',
                borderBottom: '1px solid var(--accent)',
                textDecoration: 'none' }}>here</a>.
          </div>
        </section>
      )}
    </GlossaryCollectContext.Provider>
  );
}

// ── Site-level Glossary Page ──────────────────────────────────────────
// A dictionary, not a dashboard. A–Z headers, entries below.

function GlossaryPage({ palette = 'warm', theme = 'light' }) {
  const vars = window.getPalette
    ? window.getPalette(palette, theme)
    : { '--paper': '#faf8f4', '--ink': '#1a1814',
        '--paper2': '#f1ece2', '--muted': 'rgba(26,24,20,0.55)',
        '--rule': 'rgba(26,24,20,0.12)', '--accent': '#c96442' };

  const [query, setQuery] = React.useState('');
  const [topic, setTopic] = React.useState('All');

  const entries = Object.entries(TERMS)
    .map(([id, t]) => ({ id, ...t }))
    .filter((t) => topic === 'All' || t.topic === topic)
    .filter((t) => !query ||
      t.term.toLowerCase().includes(query.toLowerCase()) ||
      t.short.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => a.term.localeCompare(b.term));

  // Group by first letter
  const letters = {};
  entries.forEach((e) => {
    const L = e.term[0].toUpperCase();
    letters[L] = letters[L] || [];
    letters[L].push(e);
  });
  const letterKeys = Object.keys(letters).sort();

  const topics = ['All', 'Science', 'Software', 'Philosophy', 'Art'];

  return (
    <div style={{ ...vars, height: '100%', overflow: 'hidden',
      background: 'var(--paper)', color: 'var(--ink)',
      fontFamily: '"Newsreader", Georgia, serif', position: 'relative' }}>

      {/* Header bar */}
      <header style={{ position: 'absolute', top: 0, left: 0, right: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '22px 48px 0', zIndex: 5,
        fontFamily: '"IBM Plex Sans", sans-serif', fontSize: 13 }}>
        <a href="#" style={{ color: 'var(--ink)', textDecoration: 'none',
          fontWeight: 600, letterSpacing: '-0.01em' }}>maxubrq</a>
        <nav style={{ display: 'flex', gap: 24, color: 'var(--muted)' }}>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Writing</a>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Topics</a>
          <a href="#" style={{ color: 'var(--ink)', fontWeight: 500, textDecoration: 'none' }}>Glossary</a>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>About</a>
        </nav>
      </header>

      <div style={{ height: '100%', overflowY: 'auto', paddingTop: 80, paddingBottom: 120 }}>
        <div style={{ maxWidth: 820, margin: '0 auto', padding: '0 48px' }}>

          {/* Masthead */}
          <div style={{ padding: '24px 0 40px',
            borderBottom: '1px solid var(--rule)' }}>
            <div style={{ fontFamily: '"IBM Plex Mono", monospace',
              fontSize: 11, letterSpacing: 0.8, textTransform: 'uppercase',
              color: 'var(--muted)', marginBottom: 14 }}>
              An index · updated as I write
            </div>
            <h1 style={{ fontFamily: 'var(--serif)', fontWeight: 500,
              fontSize: '2.6em', lineHeight: 1.05, margin: '0 0 0.3em',
              letterSpacing: '-0.015em' }}>
              Glossary
            </h1>
            <p style={{ margin: 0, fontFamily: 'var(--serif)',
              fontStyle: 'italic', fontSize: 17, lineHeight: 1.55,
              color: 'var(--muted)', maxWidth: '48ch' }}>
              Technical words, loanwords, half-technical metaphors. Every
              term marked in an essay collects here, with the sentences
              where I first used it.
            </p>
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 20,
            padding: '24px 0', borderBottom: '1px solid var(--rule)',
            flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="Search terms or definitions…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{ flex: 1, minWidth: 220,
                background: 'transparent', border: 'none',
                borderBottom: '1px solid var(--rule)',
                padding: '8px 0', fontFamily: 'var(--serif)',
                fontSize: 16, color: 'var(--ink)', outline: 'none' }} />
            <div style={{ display: 'flex', gap: 14,
              fontFamily: 'var(--serif)', fontSize: 12,
              fontVariant: 'small-caps', letterSpacing: '0.22em' }}>
              {topics.map((t) => (
                <button key={t} onClick={() => setTopic(t)}
                  style={{ background: 'transparent', border: 'none',
                    padding: '2px 0', cursor: 'pointer',
                    color: topic === t ? 'var(--accent)' : 'var(--muted)',
                    borderBottom: topic === t ? '1px solid var(--accent)' : '1px solid transparent',
                    fontFamily: 'var(--serif)', fontVariant: 'small-caps',
                    letterSpacing: '0.22em', fontSize: 12 }}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* A–Z Jump strip */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8,
            padding: '22px 0 30px', flexWrap: 'wrap',
            fontFamily: 'var(--serif)', fontSize: 13 }}>
            {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((L) => {
              const has = letterKeys.includes(L);
              return has ? (
                <a key={L} href={`#gl-${L}`} style={{
                  color: 'var(--ink)', textDecoration: 'none',
                  padding: '3px 6px', fontVariant: 'small-caps',
                  fontStyle: 'italic', letterSpacing: '0.1em' }}>{L}</a>
              ) : (
                <span key={L} style={{
                  color: 'var(--rule)', padding: '3px 6px',
                  fontVariant: 'small-caps',
                  letterSpacing: '0.1em' }}>{L}</span>
              );
            })}
          </div>

          {/* Entries grouped by letter */}
          {letterKeys.length === 0 && (
            <div style={{ padding: 60, textAlign: 'center',
              fontStyle: 'italic', color: 'var(--muted)' }}>
              No entries match.
            </div>
          )}
          {letterKeys.map((L) => (
            <section key={L} id={`gl-${L}`} style={{ marginBottom: 44 }}>
              <div style={{ display: 'flex', alignItems: 'baseline',
                gap: 16, marginBottom: 16 }}>
                <h2 style={{ margin: 0, fontFamily: 'var(--serif)',
                  fontSize: 44, fontStyle: 'italic', fontWeight: 500,
                  color: 'var(--accent)', letterSpacing: '-0.02em',
                  lineHeight: 1 }}>{L}</h2>
                <span style={{ flex: 1, height: 1, background: 'var(--rule)' }} />
                <span style={{ fontVariant: 'small-caps',
                  letterSpacing: '0.22em', fontSize: 10.5,
                  color: 'var(--muted)' }}>
                  {letters[L].length} {letters[L].length === 1 ? 'entry' : 'entries'}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
                {letters[L].map((e) => (
                  <article key={e.id} style={{ display: 'grid',
                    gridTemplateColumns: '220px 1fr', gap: 32,
                    paddingBottom: 18, borderBottom: '1px dotted var(--rule)' }}>
                    <div>
                      <div style={{ fontFamily: 'var(--serif)',
                        fontSize: 20, fontStyle: 'italic',
                        letterSpacing: '-0.005em',
                        fontWeight: 500 }}>{e.term}</div>
                      <div style={{ fontFamily: 'var(--serif)',
                        fontVariant: 'small-caps', letterSpacing: '0.2em',
                        fontSize: 10.5, color: 'var(--muted)',
                        marginTop: 4 }}>{e.pos}</div>
                      <div style={{ marginTop: 10, fontFamily: 'var(--serif)',
                        fontVariant: 'small-caps', letterSpacing: '0.2em',
                        fontSize: 10, color: 'var(--accent)' }}>
                        {e.topic}
                      </div>
                    </div>
                    <div>
                      <p style={{ margin: '0 0 8px',
                        fontFamily: 'var(--serif)', fontSize: 15.5,
                        lineHeight: 1.55, color: 'var(--ink)' }}>
                        {e.short}
                      </p>
                      <p style={{ margin: 0,
                        fontFamily: 'var(--serif)', fontStyle: 'italic',
                        fontSize: 13.5, lineHeight: 1.55,
                        color: 'var(--muted)' }}>
                        {e.long}
                      </p>
                      {e.appearances.length > 0 && (
                        <div style={{ marginTop: 12, display: 'flex',
                          gap: 14, flexWrap: 'wrap',
                          fontSize: 11.5, color: 'var(--muted)' }}>
                          <span style={{ fontVariant: 'small-caps',
                            letterSpacing: '0.22em', fontSize: 10 }}>
                            Appears in
                          </span>
                          {e.appearances.map((a, i) => (
                            <a key={i} href="#" style={{
                              color: 'var(--ink)', textDecoration: 'none',
                              borderBottom: '1px solid var(--rule)',
                              paddingBottom: 1, fontStyle: 'italic' }}>
                              {a.title}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}

          {/* Colophon */}
          <div style={{ marginTop: 48, paddingTop: 24,
            borderTop: '1px solid var(--rule)',
            fontFamily: 'var(--serif)', fontSize: 12,
            color: 'var(--muted)', textAlign: 'center',
            fontStyle: 'italic' }}>
            A living document. Last updated the day I last used a new word.
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Term, G, GlossaryFootnote, GlossaryPage, GlossaryCollectContext });
