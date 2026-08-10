// OtherPages.jsx — Home, Index (archive), About
// All three share the same paper/ink palette and typography system.

// ── Shared ──────────────────────────────────────────────────────────
const getPagePalette = (palette = 'warm', theme = 'light') =>
  (window.PALETTES && window.PALETTES[palette]
    ? window.PALETTES[palette][theme === 'dark' ? 'dark' : 'light']
    : { '--paper': '#faf8f4', '--ink': '#1a1814', '--muted': 'rgba(26,24,20,0.6)',
        '--rule': 'rgba(26,24,20,0.12)', '--accent': '#c96442' });

const SERIF = '"Newsreader", Georgia, serif';
const SANS = '"IBM Plex Sans", -apple-system, sans-serif';
const MONO = '"IBM Plex Mono", monospace';

function PageChrome({ children, current, palette = 'warm', theme = 'light' }) {
  const vars = getPagePalette(palette, theme);
  return (
    <div style={{ ...vars, height: '100%', overflow: 'hidden', background: 'var(--paper)',
      color: 'var(--ink)', fontFamily: SERIF, position: 'relative' }}>
      <header style={{ position: 'absolute', top: 0, left: 0, right: 0, display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', padding: '22px 40px 0', zIndex: 5, fontFamily: SANS, fontSize: 13 }}>
        <a href="#" style={{ color: 'var(--ink)', textDecoration: 'none', fontWeight: 600, letterSpacing: '-0.01em' }}>
          maxubrq
        </a>
        <nav style={{ display: 'flex', gap: 24, color: 'var(--muted)' }}>
          <a href="#" style={{ color: current === 'writing' ? 'var(--ink)' : 'inherit', textDecoration: 'none',
            fontWeight: current === 'writing' ? 500 : 400 }}>Writing</a>
          <a href="#" style={{ color: current === 'about' ? 'var(--ink)' : 'inherit', textDecoration: 'none',
            fontWeight: current === 'about' ? 500 : 400 }}>About</a>
        </nav>
      </header>
      <div style={{ height: '100%', overflowY: 'auto', paddingTop: 88 }}>
        {children}
      </div>
    </div>
  );
}

// ── Home ────────────────────────────────────────────────────────────
function HomePage({ palette = "warm", theme = "light" }) {
  const posts = [
    { topic: 'Science',    title: 'The horizon of a pendulum, and other small infinities', date: 'Apr 14, 2026', time: 9, slug: 'pendulum' },
    { topic: 'Philosophy', title: 'On reading slowly',                                       date: 'Mar 28, 2026', time: 6 },
    { topic: 'Tech',       title: 'What a proof costs: notes from a week with Lean',         date: 'Mar 09, 2026', time: 12 },
    { topic: 'Art',        title: 'Agnes Martin and the grid as devotion',                   date: 'Feb 22, 2026', time: 7 },
    { topic: 'Tech',       title: 'Small models, small problems',                             date: 'Feb 01, 2026', time: 5 },
    { topic: 'Philosophy', title: 'Đọc chậm — và tại sao nó quan trọng',                      date: 'Jan 16, 2026', time: 8 },
  ];

  return (
    <PageChrome current="writing" palette={palette} theme={theme}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 40px 120px' }}>
        {/* Masthead */}
        <section style={{ padding: '40px 0 56px', borderBottom: '1px solid var(--rule)' }}>
          <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: 0.8, textTransform: 'uppercase',
            color: 'var(--muted)', marginBottom: 18 }}>
            A notebook · est. 2024
          </div>
          <h1 style={{ fontFamily: SERIF, fontWeight: 500, fontSize: '2.6em', lineHeight: 1.1,
            letterSpacing: '-0.02em', margin: '0 0 0.4em', maxWidth: '16ch' }}>
            Writing, mostly about things that take a while.
          </h1>
          <p style={{ fontFamily: SERIF, fontSize: '1.15em', lineHeight: 1.5, color: 'var(--muted)',
            margin: 0, maxWidth: '52ch' }}>
            Essays on science, technology, philosophy, and art — often with something you can play with.
            Updated roughly monthly, or when I have something to say.
          </p>
        </section>

        {/* Featured */}
        <section style={{ padding: '40px 0', borderBottom: '1px solid var(--rule)' }}>
          <div style={{ fontFamily: MONO, fontSize: 10.5, letterSpacing: 0.8, textTransform: 'uppercase',
            color: 'var(--accent)', marginBottom: 16 }}>
            Latest · Interactive
          </div>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none', display: 'block' }}>
            <h2 style={{ fontFamily: SERIF, fontWeight: 500, fontSize: '1.9em', lineHeight: 1.18,
              letterSpacing: '-0.01em', margin: '0 0 0.4em' }}>
              The horizon of a pendulum, and other small infinities
            </h2>
            <p style={{ fontFamily: SERIF, fontSize: '1.05em', lineHeight: 1.55, color: 'var(--muted)',
              margin: '0 0 14px', maxWidth: '60ch' }}>
              On why a system so simple it fits in a single equation can still refuse to tell you where
              it will be in an hour. With a pendulum you can grab and pull.
            </p>
            <div style={{ fontFamily: MONO, fontSize: 11, color: 'var(--muted)', letterSpacing: 0.3 }}>
              Science · Apr 14, 2026 · 9 min · <span style={{ color: 'var(--accent)' }}>● interactive</span>
            </div>
          </a>
        </section>

        {/* Archive */}
        <section style={{ padding: '40px 0 0' }}>
          <div style={{ fontFamily: MONO, fontSize: 10.5, letterSpacing: 0.8, textTransform: 'uppercase',
            color: 'var(--muted)', marginBottom: 24 }}>
            Archive
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {posts.slice(1).map((p, i) => (
              <li key={i} style={{ padding: '18px 0', borderBottom: '1px solid var(--rule)' }}>
                <a href="#" style={{ color: 'inherit', textDecoration: 'none', display: 'grid',
                  gridTemplateColumns: '90px 1fr auto', alignItems: 'baseline', gap: 20 }}>
                  <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: 0.4, textTransform: 'uppercase',
                    color: 'var(--muted)' }}>{p.topic}</span>
                  <span style={{ fontFamily: SERIF, fontSize: '1.1em', lineHeight: 1.35 }}>{p.title}</span>
                  <span style={{ fontFamily: MONO, fontSize: 11, color: 'var(--muted)',
                    fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>{p.date}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </PageChrome>
  );
}

// ── Index / Archive ─────────────────────────────────────────────────
function IndexPage({ palette = "warm", theme = "light" }) {
  const posts = [
    { y: 2026, topic: 'Science',    title: 'The horizon of a pendulum, and other small infinities', date: 'Apr 14', time: 9, interactive: true },
    { y: 2026, topic: 'Philosophy', title: 'On reading slowly',                                       date: 'Mar 28', time: 6 },
    { y: 2026, topic: 'Tech',       title: 'What a proof costs: notes from a week with Lean',         date: 'Mar 09', time: 12 },
    { y: 2026, topic: 'Art',        title: 'Agnes Martin and the grid as devotion',                   date: 'Feb 22', time: 7 },
    { y: 2026, topic: 'Tech',       title: 'Small models, small problems',                             date: 'Feb 01', time: 5 },
    { y: 2026, topic: 'Philosophy', title: 'Đọc chậm — và tại sao nó quan trọng',                      date: 'Jan 16', time: 8 },
    { y: 2025, topic: 'Science',    title: 'A season with phase diagrams',                             date: 'Dec 04', time: 10 },
    { y: 2025, topic: 'Art',        title: 'Color is a relationship',                                   date: 'Nov 11', time: 6, interactive: true },
    { y: 2025, topic: 'Tech',       title: 'Caching, and the limits of knowing',                        date: 'Oct 28', time: 9 },
    { y: 2025, topic: 'Philosophy', title: 'What I mean when I say &ldquo;elegant&rdquo;',              date: 'Sep 30', time: 5 },
    { y: 2025, topic: 'Science',    title: 'Notes on the second law',                                   date: 'Aug 15', time: 11 },
  ];

  const topics = ['All', 'Science', 'Tech', 'Philosophy', 'Art'];
  const [filter, setFilter] = React.useState('All');
  const visible = posts.filter((p) => filter === 'All' || p.topic === filter);
  const grouped = visible.reduce((acc, p) => { (acc[p.y] = acc[p.y] || []).push(p); return acc; }, {});

  return (
    <PageChrome current="writing" palette={palette} theme={theme}>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 40px 120px' }}>
        <div style={{ padding: '40px 0 28px' }}>
          <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: 0.8, textTransform: 'uppercase',
            color: 'var(--muted)', marginBottom: 14 }}>
            Writing · {posts.length} essays
          </div>
          <h1 style={{ fontFamily: SERIF, fontWeight: 500, fontSize: '2.2em', lineHeight: 1.15,
            letterSpacing: '-0.02em', margin: 0 }}>
            Everything, in order of when.
          </h1>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 6, paddingBottom: 28, borderBottom: '1px solid var(--rule)',
          marginBottom: 8, flexWrap: 'wrap' }}>
          {topics.map((t) => (
            <button key={t} onClick={() => setFilter(t)}
              style={{ border: '1px solid var(--rule)', background: filter === t ? 'var(--ink)' : 'transparent',
                color: filter === t ? 'var(--paper)' : 'var(--ink)',
                fontFamily: MONO, fontSize: 11, letterSpacing: 0.5, textTransform: 'uppercase',
                padding: '6px 12px', borderRadius: 2, cursor: 'pointer' }}>{t}</button>
          ))}
        </div>

        {Object.keys(grouped).sort((a, b) => b - a).map((year) => (
          <section key={year} style={{ padding: '28px 0' }}>
            <div style={{ fontFamily: MONO, fontSize: 13, color: 'var(--muted)', letterSpacing: 0.3,
              paddingBottom: 14, marginBottom: 4 }}>
              {year}
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {grouped[year].map((p, i) => (
                <li key={i}>
                  <a href="#" style={{ color: 'inherit', textDecoration: 'none', display: 'grid',
                    gridTemplateColumns: '60px 90px 1fr auto', alignItems: 'baseline', gap: 18,
                    padding: '14px 0', borderBottom: '1px solid var(--rule)' }}>
                    <span style={{ fontFamily: MONO, fontSize: 11, color: 'var(--muted)',
                      fontVariantNumeric: 'tabular-nums' }}>{p.date}</span>
                    <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: 0.4, textTransform: 'uppercase',
                      color: 'var(--muted)' }}>{p.topic}</span>
                    <span style={{ fontFamily: SERIF, fontSize: '1.05em', lineHeight: 1.35 }}
                      dangerouslySetInnerHTML={{ __html: p.title }} />
                    <span style={{ fontFamily: MONO, fontSize: 11, color: 'var(--muted)' }}>
                      {p.time} min {p.interactive && <span style={{ color: 'var(--accent)' }}>●</span>}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </PageChrome>
  );
}

// ── About ───────────────────────────────────────────────────────────
function AboutPage({ palette = "warm", theme = "light" }) {
  return (
    <PageChrome current="about" palette={palette} theme={theme}>
      <div style={{ maxWidth: 620, margin: '0 auto', padding: '40px 40px 120px', fontSize: 18, lineHeight: 1.62 }}>
        <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: 0.8, textTransform: 'uppercase',
          color: 'var(--muted)', marginBottom: 14 }}>
          About
        </div>
        <h1 style={{ fontFamily: SERIF, fontWeight: 500, fontSize: '2.4em', lineHeight: 1.1,
          letterSpacing: '-0.02em', margin: '0 0 0.8em' }}>
          A notebook, kept in public.
        </h1>

        <p style={{ margin: '0 0 1.2em' }}>
          I'm <strong style={{ fontWeight: 500 }}>maxubrq</strong>. I write here about things that feel
          worth thinking about slowly: a physics problem that stuck with me, a piece of software I finally
          understood, a painting I kept coming back to, a sentence that would not leave me alone.
        </p>
        <p style={{ margin: '0 0 1.2em' }}>
          Some of these essays come with a thing you can play with — a small simulation, a diagram that
          responds to a slider, a figure that recomputes itself. I think of writing and interaction as the
          same craft: both are attempts to hand someone a thought in a form they can turn over.
        </p>

        <h2 style={{ fontFamily: SERIF, fontWeight: 500, fontSize: '1.4em', lineHeight: 1.25,
          letterSpacing: '-0.01em', margin: '2em 0 0.5em' }}>
          What I write about
        </h2>
        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.5em',
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 20px', fontFamily: SANS, fontSize: 15 }}>
          {[
            ['Science',    'Mostly physics & math, sometimes biology.'],
            ['Tech',        'Software, and the shape of thinking it asks of you.'],
            ['Philosophy',  'Attention, time, what it means to know a thing.'],
            ['Art',         'Painting, music, the logic of composition.'],
          ].map(([k, v]) => (
            <li key={k} style={{ borderTop: '1px solid var(--rule)', paddingTop: 10 }}>
              <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: 0.4, textTransform: 'uppercase',
                color: 'var(--muted)', marginBottom: 4 }}>{k}</div>
              <div style={{ color: 'var(--ink)', lineHeight: 1.4 }}>{v}</div>
            </li>
          ))}
        </ul>

        <h2 style={{ fontFamily: SERIF, fontWeight: 500, fontSize: '1.4em', lineHeight: 1.25,
          letterSpacing: '-0.01em', margin: '2em 0 0.5em' }}>
          Elsewhere
        </h2>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontFamily: SANS, fontSize: 15,
          display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            ['GitHub',   '@maxubrq'],
            ['Email',    'max @ maxubrq.com'],
            ['RSS',      '/feed.xml'],
          ].map(([k, v]) => (
            <li key={k} style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: 20, alignItems: 'baseline' }}>
              <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: 0.4, textTransform: 'uppercase',
                color: 'var(--muted)' }}>{k}</span>
              <a href="#" style={{ color: 'var(--ink)', textDecoration: 'none', borderBottom: '1px solid var(--rule)',
                paddingBottom: 2 }}>{v}</a>
            </li>
          ))}
        </ul>

        <p style={{ margin: '3em 0 0', fontFamily: SERIF, fontStyle: 'italic', color: 'var(--muted)',
          fontSize: '1em', borderTop: '1px solid var(--rule)', paddingTop: 20 }}>
          Cảm ơn bạn đã ghé qua. — <span style={{ fontStyle: 'normal' }}>Thanks for stopping by.</span>
        </p>
      </div>
    </PageChrome>
  );
}

Object.assign(window, { HomePage, IndexPage, AboutPage });
