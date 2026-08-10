// ReadingMemory.jsx — "You were here" memory.
//
// Three surfaces:
//   ArticleWithMemory   — an article with the soft "you were here" line
//                         beneath the masthead, plus the gutter bookmark glyph.
//   HomeWithMemory      — the homepage with a "Pick up where you left off"
//                         rail listing in-progress posts with baseline-rule
//                         progress bars.
//   ArchiveWithMemory   — the archive with half-read posts marked.
//
// The aesthetic: never a modal. Italic, small-caps, hair-thin rules. Reads
// like a margin note from the author, not an app dialog.

const MEMORY_POSTS = [
  { id: 'pendulum', title: 'On the patience of pendulums',
    topic: 'Science', section: 'II', sectionTitle: 'A first model',
    pct: 0.62, minLeft: 7, lastSeen: 'Tue evening',
    excerpt: 'A pendulum is a scientific instrument and a small philosophy lesson.' },
  { id: 'debounce', title: 'Debounce, rebuilt',
    topic: 'Software', section: 'IV', sectionTitle: 'A correct implementation',
    pct: 0.34, minLeft: 12, lastSeen: 'Sun morning',
    excerpt: 'You have written debounce a hundred times and gotten it wrong eighty.' },
  { id: 'weil', title: 'Simone Weil, attention, and the page that broke me',
    topic: 'Philosophy', section: 'I', sectionTitle: 'Reading at a distance',
    pct: 0.18, minLeft: 5, lastSeen: 'last Friday',
    excerpt: 'I have been carrying one sentence around for three weeks now.' },
];

// ── helpers ──────────────────────────────────────────────────────────
function memVars(palette = 'warm', theme = 'light') {
  return window.getPalette
    ? window.getPalette(palette, theme)
    : { '--paper': '#faf8f4', '--ink': '#1a1814', '--paper2': '#f1ece2',
        '--muted': 'rgba(26,24,20,0.55)', '--rule': 'rgba(26,24,20,0.12)',
        '--accent': '#c96442' };
}
const memSerif = '"Newsreader", Georgia, serif';
const memMono  = '"IBM Plex Mono", monospace';

// A baseline-rule progress bar: a thin horizontal rule, filled in accent
// up to `pct`. Reads like a typesetter's marker.
function ProgressRule({ pct, width = '100%' }) {
  return (
    <div style={{ position: 'relative', width, height: 4 }}>
      <div style={{ position: 'absolute', inset: 0,
        borderTop: '1px solid var(--rule)' }} />
      <div style={{ position: 'absolute', left: 0, top: 0,
        height: 1, width: `${Math.round(pct * 100)}%`,
        background: 'var(--accent)' }} />
      {/* tiny tick at current position */}
      <div style={{ position: 'absolute',
        left: `calc(${Math.round(pct * 100)}% - 1px)`,
        top: -2, width: 2, height: 7,
        background: 'var(--accent)' }} />
    </div>
  );
}

// ── 1. Article with masthead nudge + gutter glyph ────────────────────
function ArticleWithMemory({ palette = 'warm', theme = 'light' }) {
  const vars = memVars(palette, theme);
  const [dismissed, setDismissed] = React.useState(false);

  return (
    <div style={{ ...vars, height: '100%', overflow: 'hidden',
      background: 'var(--paper)', color: 'var(--ink)',
      fontFamily: memSerif, position: 'relative' }}>

      <header style={{ position: 'absolute', top: 0, left: 0, right: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '22px 48px 0', zIndex: 5,
        fontFamily: '"IBM Plex Sans", sans-serif', fontSize: 13 }}>
        <a href="#" style={{ color: 'var(--ink)', textDecoration: 'none',
          fontWeight: 600, letterSpacing: '-0.01em' }}>maxubrq</a>
        <nav style={{ display: 'flex', gap: 24, color: 'var(--muted)' }}>
          <a href="#" style={{ color: 'var(--ink)', fontWeight: 500, textDecoration: 'none' }}>Writing</a>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Topics</a>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Series</a>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Glossary</a>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>About</a>
        </nav>
      </header>

      <div style={{ height: '100%', overflowY: 'auto',
        paddingTop: 72, paddingBottom: 80 }}>
        <div style={{ maxWidth: 880, margin: '0 auto',
          padding: '0 48px', position: 'relative' }}>

          {/* Chapter masthead */}
          <section style={{ padding: '36px 0 8px', textAlign: 'center' }}>
            <div style={{ fontFamily: memMono, fontSize: 11,
              letterSpacing: 0.8, textTransform: 'uppercase',
              color: 'var(--muted)', marginBottom: 18 }}>
              Science · 14 min read · Mar 04, 2026
            </div>
            <div style={{ fontFamily: memSerif, fontVariant: 'small-caps',
              letterSpacing: '0.4em', fontSize: 12, color: 'var(--accent)',
              marginBottom: 14 }}>
              Folio iv
            </div>
            <h1 style={{ fontFamily: memSerif, fontWeight: 500,
              fontSize: 'clamp(2.4em, 4.8vw, 3.4em)', lineHeight: 1.05,
              margin: '0 0 0.35em', letterSpacing: '-0.02em',
              maxWidth: '20ch', marginInline: 'auto' }}>
              On the patience of pendulums
            </h1>
            <p style={{ margin: '0 auto', fontFamily: memSerif,
              fontStyle: 'italic', fontSize: 17, lineHeight: 1.5,
              color: 'var(--muted)', maxWidth: '40ch' }}>
              A scientific instrument is also a small philosophy lesson.
            </p>
          </section>

          {/* The "you were here" nudge — soft, beneath the masthead,
              above the body. Italic, hair-rule, never a modal. */}
          {!dismissed && (
            <section style={{ margin: '28px auto 32px', maxWidth: '54ch',
              padding: '14px 0', borderTop: '1px solid var(--rule)',
              borderBottom: '1px solid var(--rule)',
              display: 'grid',
              gridTemplateColumns: 'auto 1fr auto auto',
              alignItems: 'center', gap: 14,
              fontFamily: memSerif, animation: 'memFadeIn 0.6s ease' }}>
              <span style={{ fontFamily: memSerif, fontStyle: 'italic',
                fontSize: 18, color: 'var(--accent)', letterSpacing: '-0.02em',
                lineHeight: 1 }}>
                ✦
              </span>
              <span style={{ fontFamily: memSerif, fontStyle: 'italic',
                fontSize: 14.5, color: 'var(--muted)', letterSpacing: '-0.005em' }}>
                you were here — <span style={{ fontVariant: 'small-caps',
                  letterSpacing: '0.18em', fontStyle: 'normal',
                  fontSize: 11.5 }}>§ ii · a first model</span>, about{' '}
                <span style={{ color: 'var(--ink)' }}>7 minutes</span> from the end
              </span>
              <a href="#section-2" style={{ fontFamily: memSerif,
                fontStyle: 'italic', fontSize: 13.5, color: 'var(--accent)',
                borderBottom: '1px solid var(--accent)',
                textDecoration: 'none', whiteSpace: 'nowrap' }}>
                resume reading →
              </a>
              <button onClick={() => setDismissed(true)}
                aria-label="dismiss"
                style={{ background: 'transparent', border: 'none',
                cursor: 'pointer', color: 'var(--muted)',
                fontFamily: memSerif, fontSize: 16, lineHeight: 1,
                padding: 4, opacity: 0.6 }}>
                ✕
              </button>

              {/* Hair progress rule under the nudge */}
              <div style={{ gridColumn: '1 / -1', marginTop: 12 }}>
                <ProgressRule pct={0.62} />
                <div style={{ display: 'flex',
                  justifyContent: 'space-between', marginTop: 6,
                  fontFamily: memSerif, fontVariant: 'small-caps',
                  letterSpacing: '0.2em', fontSize: 9.5, color: 'var(--muted)' }}>
                  <span>start</span>
                  <span style={{ fontStyle: 'italic',
                    fontVariant: 'normal', letterSpacing: 0,
                    fontSize: 11, color: 'var(--accent)' }}>
                    you ·  62%
                  </span>
                  <span>end</span>
                </div>
              </div>
            </section>
          )}

          {/* Article body — start of section I (already read) */}
          <section style={{ maxWidth: '54ch', margin: '0 auto',
            position: 'relative' }}>
            <div style={{ fontFamily: memSerif, fontVariant: 'small-caps',
              letterSpacing: '0.32em', fontSize: 11, color: 'var(--accent)',
              marginBottom: 12 }}>§ I · the question</div>
            <p style={{ margin: '0 0 1em', fontFamily: memSerif,
              fontSize: 18, lineHeight: 1.7, color: 'var(--ink)' }}>
              <span style={{ float: 'left', fontFamily: memSerif,
                fontSize: 58, lineHeight: 0.85,
                padding: '6px 10px 0 0', color: 'var(--accent)' }}>
                A
              </span>
              pendulum, when you watch it carefully, behaves the way a
              good mathematical model says it ought to. It does not behave
              the way you think it ought to. The two are subtly different,
              and the difference is the entire reason we build instruments.
            </p>
            <p style={{ margin: '0 0 1em', fontFamily: memSerif,
              fontSize: 18, lineHeight: 1.7, color: 'var(--ink)',
              opacity: 0.7 }}>
              For a long time, I thought the pendulum was a metaphor for
              certainty. The same swing, again and again, is the very
              picture of a thing you can rely on.
            </p>

            {/* Section II — where the gutter glyph sits */}
            <div id="section-2" style={{ position: 'relative', marginTop: 32 }}>
              {/* Gutter glyph — sits in the left margin at the exact
                  paragraph the reader stopped on. */}
              <div style={{ position: 'absolute',
                left: -42, top: 64,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: 4 }}>
                <span style={{ fontFamily: memSerif, fontSize: 16,
                  color: 'var(--accent)', lineHeight: 1 }}>✦</span>
                <span style={{ fontFamily: memSerif, fontVariant: 'small-caps',
                  fontSize: 8.5, letterSpacing: '0.22em',
                  color: 'var(--accent)', writingMode: 'vertical-rl',
                  transform: 'rotate(180deg)', marginTop: 2 }}>
                  here · tue
                </span>
              </div>

              <div style={{ fontFamily: memSerif, fontVariant: 'small-caps',
                letterSpacing: '0.32em', fontSize: 11, color: 'var(--accent)',
                marginBottom: 12 }}>§ II · a first model</div>

              <p style={{ margin: '0 0 1em', fontFamily: memSerif,
                fontSize: 18, lineHeight: 1.7, color: 'var(--ink)' }}>
                The first model of a pendulum that anyone teaches you is
                a small lie. It assumes the swing is small enough that
                the sine of the angle is, near enough, the angle itself.
                This is the small-angle approximation, and it is wrong
                in a way that is easy to forgive.
              </p>
              <p style={{ margin: '0 0 1em', fontFamily: memSerif,
                fontSize: 18, lineHeight: 1.7, color: 'var(--ink)' }}>
                When you write the equation down, the period of the swing
                turns out to depend only on the length of the string and
                the strength of gravity. It does not depend, at first
                glance, on how hard you pushed it. This is the result that
                makes pendulum clocks possible.
              </p>
              <p style={{ margin: '0 0 1em', fontFamily: memSerif,
                fontSize: 18, lineHeight: 1.7, color: 'var(--ink)' }}>
                But the small lie has a tail. If you swing it harder, the
                period <em>does</em> change — by a few percent at first,
                then more. The honest equation is messier, and an
                honest pendulum keeps slightly worse time at large
                amplitude. The clockmaker's job is to keep the swing
                small enough that the lie stays small.
              </p>
            </div>
          </section>

          <div style={{ maxWidth: '54ch', margin: '40px auto 0',
            paddingTop: 22, borderTop: '1px solid var(--rule)',
            fontFamily: memSerif, fontStyle: 'italic',
            fontSize: 13, color: 'var(--muted)', textAlign: 'center' }}>
            (article continues — § III · what changes at large angle, § IV · plate i)
          </div>
        </div>
      </div>

      <style>{`@keyframes memFadeIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: none; } }`}</style>
    </div>
  );
}

// ── 2. Home with "Pick up where you left off" ───────────────────────
function HomeWithMemory({ palette = 'warm', theme = 'light' }) {
  const vars = memVars(palette, theme);
  return (
    <div style={{ ...vars, height: '100%', overflow: 'hidden',
      background: 'var(--paper)', color: 'var(--ink)',
      fontFamily: memSerif, position: 'relative' }}>

      <header style={{ position: 'absolute', top: 0, left: 0, right: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '22px 48px 0', zIndex: 5,
        fontFamily: '"IBM Plex Sans", sans-serif', fontSize: 13 }}>
        <a href="#" style={{ color: 'var(--ink)', textDecoration: 'none',
          fontWeight: 600, letterSpacing: '-0.01em' }}>maxubrq</a>
        <nav style={{ display: 'flex', gap: 24, color: 'var(--muted)' }}>
          <a href="#" style={{ color: 'var(--ink)', fontWeight: 500, textDecoration: 'none' }}>Writing</a>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Topics</a>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Series</a>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Glossary</a>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>About</a>
        </nav>
      </header>

      <div style={{ height: '100%', overflowY: 'auto',
        paddingTop: 88, paddingBottom: 80 }}>
        <div style={{ maxWidth: 920, margin: '0 auto', padding: '0 48px' }}>

          {/* Masthead */}
          <section style={{ padding: '24px 0 36px' }}>
            <h1 style={{ fontFamily: memSerif, fontWeight: 500,
              fontSize: 'clamp(2.6em, 5vw, 4em)', lineHeight: 1.02,
              margin: '0 0 0.25em', letterSpacing: '-0.025em' }}>
              maxubrq
            </h1>
            <p style={{ margin: 0, fontFamily: memSerif,
              fontStyle: 'italic', fontSize: 18, color: 'var(--muted)',
              maxWidth: '46ch' }}>
              Long-form notes on science, software, and the books I happen
              to be reading.
            </p>
          </section>

          {/* Pick up where you left off — set as a quiet, half-bleed
              card with the warm-paper2 background. Top section. */}
          <section style={{ marginBottom: 56,
            background: 'var(--paper2)',
            border: '1px solid var(--rule)',
            padding: '26px 28px 22px',
            position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'baseline',
              justifyContent: 'space-between', marginBottom: 18 }}>
              <div>
                <div style={{ fontFamily: memSerif,
                  fontVariant: 'small-caps', letterSpacing: '0.3em',
                  fontSize: 10.5, color: 'var(--accent)',
                  marginBottom: 6 }}>
                  ✦ where you were
                </div>
                <h2 style={{ margin: 0, fontFamily: memSerif,
                  fontWeight: 500, fontSize: 24, fontStyle: 'italic',
                  letterSpacing: '-0.005em', color: 'var(--ink)' }}>
                  Pick up where you left off
                </h2>
              </div>
              <a href="#" style={{ fontFamily: memSerif,
                fontStyle: 'italic', fontSize: 12.5,
                color: 'var(--muted)', textDecoration: 'none',
                borderBottom: '1px solid var(--rule)' }}>
                clear memory
              </a>
            </div>

            <ul style={{ listStyle: 'none', margin: 0, padding: 0,
              display: 'flex', flexDirection: 'column', gap: 0 }}>
              {MEMORY_POSTS.map((p, i) => (
                <li key={p.id}>
                  <a href="#" style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 220px auto',
                    gap: 24, alignItems: 'center',
                    padding: '16px 0',
                    borderTop: i === 0 ? '1px solid var(--rule)' : 'none',
                    borderBottom: '1px solid var(--rule)',
                    textDecoration: 'none', color: 'inherit' }}>

                    <div>
                      <div style={{ fontFamily: memSerif,
                        fontVariant: 'small-caps',
                        letterSpacing: '0.22em', fontSize: 10,
                        color: 'var(--accent)', marginBottom: 4 }}>
                        {p.topic}
                      </div>
                      <div style={{ fontFamily: memSerif, fontSize: 19,
                        color: 'var(--ink)', fontWeight: 500,
                        letterSpacing: '-0.005em', marginBottom: 4 }}>
                        {p.title}
                      </div>
                      <div style={{ fontFamily: memSerif,
                        fontStyle: 'italic', fontSize: 13,
                        color: 'var(--muted)' }}>
                        § {p.section} · {p.sectionTitle} · {p.minLeft} min left
                      </div>
                    </div>

                    <div>
                      <ProgressRule pct={p.pct} />
                      <div style={{ display: 'flex',
                        justifyContent: 'space-between', marginTop: 6,
                        fontFamily: memSerif, fontVariant: 'small-caps',
                        letterSpacing: '0.2em', fontSize: 9,
                        color: 'var(--muted)' }}>
                        <span>{Math.round(p.pct * 100)}%</span>
                        <span style={{ fontStyle: 'italic',
                          fontVariant: 'normal', letterSpacing: 0,
                          fontSize: 10.5, color: 'var(--muted)' }}>
                          {p.lastSeen}
                        </span>
                      </div>
                    </div>

                    <span style={{ fontFamily: memSerif,
                      fontStyle: 'italic', fontSize: 13,
                      color: 'var(--accent)' }}>
                      resume →
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </section>

          {/* Latest writing */}
          <section>
            <div style={{ fontFamily: memSerif, fontVariant: 'small-caps',
              letterSpacing: '0.3em', fontSize: 10.5, color: 'var(--muted)',
              marginBottom: 18 }}>
              Latest writing
            </div>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {[
                { d: 'Apr 18, 2026', t: 'On rereading Boethius', topic: 'Philosophy' },
                { d: 'Apr 04, 2026', t: 'A diary about diaries', topic: 'Art' },
                { d: 'Mar 21, 2026', t: 'TypeScript variance, in plain English', topic: 'Software' },
              ].map((row) => (
                <li key={row.t} style={{
                  display: 'grid',
                  gridTemplateColumns: '120px 1fr 100px',
                  gap: 24, padding: '18px 0',
                  borderTop: '1px solid var(--rule)' }}>
                  <span style={{ fontFamily: memSerif,
                    fontVariant: 'small-caps', letterSpacing: '0.18em',
                    fontSize: 11, color: 'var(--muted)' }}>{row.d}</span>
                  <a href="#" style={{ fontFamily: memSerif,
                    fontSize: 17, color: 'var(--ink)',
                    textDecoration: 'none' }}>{row.t}</a>
                  <span style={{ fontFamily: memSerif,
                    fontStyle: 'italic', fontSize: 12.5,
                    color: 'var(--accent)', textAlign: 'right' }}>
                    {row.topic}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}

// ── 3. Archive with half-read marks ───────────────────────────────────
function ArchiveWithMemory({ palette = 'warm', theme = 'light' }) {
  const vars = memVars(palette, theme);
  const ROWS = [
    { d: 'Apr 18, 2026', t: 'On rereading Boethius', topic: 'Philosophy', mem: null },
    { d: 'Apr 04, 2026', t: 'A diary about diaries', topic: 'Art', mem: null },
    { d: 'Mar 21, 2026', t: 'TypeScript variance, in plain English', topic: 'Software', mem: null },
    { d: 'Mar 04, 2026', t: 'On the patience of pendulums', topic: 'Science',
      mem: { section: 'II', minLeft: 7, pct: 0.62 } },
    { d: 'Feb 17, 2026', t: 'Debounce, rebuilt', topic: 'Software',
      mem: { section: 'IV', minLeft: 12, pct: 0.34 } },
    { d: 'Feb 09, 2026', t: 'Simone Weil, attention, and the page that broke me',
      topic: 'Philosophy', mem: { section: 'I', minLeft: 5, pct: 0.18 } },
    { d: 'Jan 28, 2026', t: 'A modest tour of logic', topic: 'Software', mem: null },
    { d: 'Jan 16, 2026', t: 'Reading Boethius on a train', topic: 'Philosophy', mem: null },
  ];

  return (
    <div style={{ ...vars, height: '100%', overflow: 'hidden',
      background: 'var(--paper)', color: 'var(--ink)',
      fontFamily: memSerif, position: 'relative' }}>

      <header style={{ position: 'absolute', top: 0, left: 0, right: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '22px 48px 0', zIndex: 5,
        fontFamily: '"IBM Plex Sans", sans-serif', fontSize: 13 }}>
        <a href="#" style={{ color: 'var(--ink)', textDecoration: 'none',
          fontWeight: 600, letterSpacing: '-0.01em' }}>maxubrq</a>
        <nav style={{ display: 'flex', gap: 24, color: 'var(--muted)' }}>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Writing</a>
          <a href="#" style={{ color: 'var(--ink)', fontWeight: 500, textDecoration: 'none' }}>Archive</a>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Topics</a>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Series</a>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>About</a>
        </nav>
      </header>

      <div style={{ height: '100%', overflowY: 'auto',
        paddingTop: 88, paddingBottom: 80 }}>
        <div style={{ maxWidth: 880, margin: '0 auto', padding: '0 48px' }}>

          <section style={{ padding: '24px 0 28px' }}>
            <div style={{ fontFamily: memMono, fontSize: 11,
              letterSpacing: 0.8, textTransform: 'uppercase',
              color: 'var(--muted)', marginBottom: 14 }}>
              The full index
            </div>
            <h1 style={{ fontFamily: memSerif, fontWeight: 500,
              fontSize: 'clamp(2.4em, 4.6vw, 3.2em)', lineHeight: 1.05,
              margin: '0 0 0.3em', letterSpacing: '-0.02em' }}>
              Archive
            </h1>
            <p style={{ margin: 0, fontFamily: memSerif,
              fontStyle: 'italic', fontSize: 16, color: 'var(--muted)' }}>
              Posts marked <span style={{ color: 'var(--accent)' }}>✦</span> are
              ones you have started but not finished. Click to resume.
            </p>
          </section>

          <ul style={{ listStyle: 'none', margin: 0, padding: 0,
            borderTop: '1px solid var(--rule)' }}>
            {ROWS.map((r) => (
              <li key={r.t} style={{ position: 'relative' }}>
                {r.mem && (
                  <span style={{ position: 'absolute', left: -8, top: 0,
                    bottom: 0, width: 2, background: 'var(--accent)' }} />
                )}
                <a href="#" style={{
                  display: 'grid',
                  gridTemplateColumns: '110px 18px 1fr 120px 90px',
                  gap: 18, alignItems: 'center',
                  padding: '16px 0',
                  borderBottom: '1px solid var(--rule)',
                  textDecoration: 'none', color: 'inherit' }}>

                  <span style={{ fontFamily: memSerif,
                    fontVariant: 'small-caps', letterSpacing: '0.18em',
                    fontSize: 10.5, color: 'var(--muted)' }}>
                    {r.d}
                  </span>

                  <span style={{ fontFamily: memSerif, fontSize: 14,
                    color: r.mem ? 'var(--accent)' : 'transparent',
                    textAlign: 'center' }}>
                    {r.mem ? '✦' : '·'}
                  </span>

                  <div>
                    <div style={{ fontFamily: memSerif, fontSize: 17,
                      color: 'var(--ink)', letterSpacing: '-0.005em' }}>
                      {r.t}
                    </div>
                    {r.mem && (
                      <div style={{ marginTop: 4, fontFamily: memSerif,
                        fontStyle: 'italic', fontSize: 12,
                        color: 'var(--muted)' }}>
                        § {r.mem.section} · {r.mem.minLeft} min left
                      </div>
                    )}
                  </div>

                  <div>
                    {r.mem ? (
                      <ProgressRule pct={r.mem.pct} />
                    ) : (
                      <div style={{ height: 4, borderTop: '1px solid var(--rule)',
                        opacity: 0.4 }} />
                    )}
                  </div>

                  <span style={{ fontFamily: memSerif,
                    fontStyle: 'italic', fontSize: 12,
                    color: r.mem ? 'var(--accent)' : 'var(--muted)',
                    textAlign: 'right' }}>
                    {r.topic}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ArticleWithMemory, HomeWithMemory, ArchiveWithMemory,
  MEMORY_POSTS });
