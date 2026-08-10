// Series.jsx — book-volume vocabulary for collected post arcs.
//
// Three example series with real content. Two surfaces:
//   SeriesPage  — the masthead + author letter + reading map for one series.
//   SeriesShelf — a site-level /series index, like a library shelf.
//   SeriesRibbon, SeriesRail, SeriesNext — chrome for an in-article view.
//
// Visual vocabulary: Volumes & chapters. Roman numerals. A series is a
// "set"; open-ended series are "Vol. I — in progress". Finite series carry
// "Volume complete in IX chapters".

const SERIES = {
  ts: {
    id: 'ts',
    title: 'TypeScript for the Strong Engineer',
    subtitle: 'Or: the type system as an instrument of thought.',
    topic: 'Software',
    state: 'in-progress', // 'in-progress' | 'complete'
    volume: 'I',
    started: 'Sep 2025',
    chapterCount: 12, // expected
    letter: [
      "I have written TypeScript professionally for about a decade. For most of that decade I treated the type system as a fence — a thing you keep code inside of. It took me a long time to notice the type system is also a *tool*: a way of thinking through what a program is.",
      "These chapters are the long version of that realization. They are written for engineers who already ship — who know what `any` does, and want to know why a senior engineer never reaches for it.",
      "I will keep adding chapters as long as I keep learning. I do not know how many there will be. The number on the spine will change.",
    ],
    chapters: [
      { num: 'I',    title: 'Why this series exists',                       min: 6,  date: 'Sep 14, 2025', read: true,  pinned: false },
      { num: 'II',   title: 'The five mistakes I made for ten years',        min: 9,  date: 'Sep 28, 2025', read: true,  pinned: false },
      { num: 'III',  title: 'Variance, in plain English',                    min: 12, date: 'Oct 12, 2025', read: true,  pinned: false },
      { num: 'IV',   title: 'Discriminated unions as a habit',               min: 8,  date: 'Oct 26, 2025', read: true,  pinned: false },
      { num: 'V',    title: 'Where `any` is, and is not, the right answer',  min: 7,  date: 'Nov 09, 2025', read: false, pinned: true  },
      { num: 'VI',   title: 'The shape of a really good generic',            min: 14, date: 'Nov 23, 2025', read: false, pinned: false },
      { num: 'VII',  title: 'Branded types, after a year of use',            min: 9,  date: 'Dec 07, 2025', read: false, pinned: false },
      { num: 'VIII', title: 'When the compiler is wrong (and what to do)',   min: 10, date: 'in draft',     read: false, pinned: false, draft: true },
    ],
  },

  philo: {
    id: 'philo',
    title: 'How I Learn Philosophy',
    subtitle: 'A reader\u2019s notebook, kept in public.',
    topic: 'Philosophy',
    state: 'in-progress',
    volume: 'I',
    started: 'Jan 2026',
    chapterCount: 'open-ended',
    letter: [
      "I do not have a philosophy degree, and I am not catching up on one. These chapters are the record of how a non-specialist who loves the subject actually reads it: slowly, with detours, with a lot of rereading.",
      "Each entry is a short essay built around one passage I have been sitting with. The order is the order I read in. If you want a syllabus, the philosophy departments have those. This is not that.",
    ],
    chapters: [
      { num: 'I',   title: 'Reading Boethius on a train',                    min: 5, date: 'Jan 16, 2026', read: true, pinned: false },
      { num: 'II',  title: 'Simone Weil, attention, and the page that broke me',     min: 7, date: 'Feb 09, 2026', read: true, pinned: true },
      { num: 'III', title: 'Marcus Aurelius for people who don\u2019t need life-hacks', min: 6, date: 'Mar 02, 2026', read: false, pinned: false },
      { num: 'IV',  title: 'On the difficulty of reading Heidegger in good faith',    min: 11, date: 'Apr 06, 2026', read: false, pinned: false },
    ],
  },

  math: {
    id: 'math',
    title: 'Mathematics for Developers',
    subtitle: 'A finite course. Nine chapters. No prerequisites except curiosity.',
    topic: 'Software',
    state: 'complete',
    volume: 'I',
    started: 'Apr 2025',
    completed: 'Aug 2025',
    chapterCount: 9,
    letter: [
      "I wrote this series for my friends. They are good engineers who left math in their last year of high school and have, in the years since, wished they hadn\u2019t.",
      "The volume is finite by design. Nine chapters, in order, each one assuming only the chapter before. I have closed the volume; if I write more on the subject, it will be a Volume II.",
    ],
    chapters: [
      { num: 'I',    title: 'Why a function is a strange kind of object',           min: 6,  date: 'Apr 04, 2025', read: true, pinned: false },
      { num: 'II',   title: 'Sets, in case you skipped that day',                   min: 5,  date: 'Apr 18, 2025', read: true, pinned: false },
      { num: 'III',  title: 'A modest tour of logic',                                min: 8,  date: 'May 02, 2025', read: true, pinned: false },
      { num: 'IV',   title: 'Counting things you can\u2019t see',                    min: 9,  date: 'May 16, 2025', read: true, pinned: false },
      { num: 'V',    title: 'Probability, for people who have been burned by it',    min: 11, date: 'Jun 06, 2025', read: true, pinned: false },
      { num: 'VI',   title: 'A linear algebra you can keep in your head',            min: 14, date: 'Jun 27, 2025', read: false, pinned: true },
      { num: 'VII',  title: 'Calculus as the study of *near*',                       min: 12, date: 'Jul 11, 2025', read: false, pinned: false },
      { num: 'VIII', title: 'Graphs, the way computer scientists mean it',          min: 9,  date: 'Jul 25, 2025', read: false, pinned: false },
      { num: 'IX',   title: 'A closing note on which math you can skip',             min: 4,  date: 'Aug 08, 2025', read: false, pinned: false },
    ],
  },
};
window.SERIES = SERIES;

// ── In-article ribbon ────────────────────────────────────────────────
// A slim line that sits above the chapter title in an article body.
// Looks like a book's running head: VOLUME I  ·  CHAPTER III  ·  Series Title
function SeriesRibbon({ seriesId, chapterNum }) {
  const s = SERIES[seriesId];
  if (!s) return null;
  return (
    <div style={{ display: 'flex', alignItems: 'center',
      justifyContent: 'center', gap: 14, margin: '0 auto 18px',
      paddingBottom: 12, borderBottom: '1px solid var(--rule)',
      fontFamily: 'var(--serif)', fontVariant: 'small-caps',
      letterSpacing: '0.3em', fontSize: 10.5, color: 'var(--muted)',
      maxWidth: '60ch' }}>
      <span>Vol. {s.volume}</span>
      <span style={{ color: 'var(--rule)' }}>·</span>
      <span style={{ color: 'var(--accent)', fontStyle: 'italic',
        letterSpacing: '0.2em' }}>Chapter {chapterNum}</span>
      <span style={{ color: 'var(--rule)' }}>·</span>
      <span style={{ fontStyle: 'italic', letterSpacing: '0.18em',
        fontVariant: 'normal', textTransform: 'none', fontSize: 12 }}>
        {s.title}
      </span>
    </div>
  );
}

// ── In-article sticky rail ───────────────────────────────────────────
// A second sidebar, beneath the post's TOC, listing the series chapters.
// Compressed; current chapter is bolded; read chapters get a small ✓.
function SeriesRail({ seriesId, currentChapter }) {
  const s = SERIES[seriesId];
  if (!s) return null;
  const ratio = s.chapters.filter((c) => c.read).length;
  return (
    <div style={{ marginTop: 24, paddingTop: 14, borderTop: '1px solid var(--rule)',
      fontFamily: 'var(--serif)', fontSize: 12, color: 'var(--muted)',
      textAlign: 'left' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between',
        alignItems: 'baseline', marginBottom: 10 }}>
        <span style={{ fontVariant: 'small-caps', letterSpacing: '0.22em',
          fontSize: 10.5 }}>The series</span>
        <span style={{ fontFamily: 'var(--serif)', fontStyle: 'italic',
          fontSize: 10.5, color: 'var(--accent)' }}>
          {ratio} of {s.chapters.length}
        </span>
      </div>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0,
        display: 'flex', flexDirection: 'column', gap: 6 }}>
        {s.chapters.map((c) => {
          const cur = c.num === currentChapter;
          return (
            <li key={c.num} style={{ position: 'relative' }}>
              {cur && (
                <span style={{ position: 'absolute', left: -10, top: 4,
                  bottom: 4, width: 2, background: 'var(--accent)' }} />
              )}
              <a href="#" style={{
                display: 'grid', gridTemplateColumns: '20px 1fr 14px',
                alignItems: 'baseline', gap: 6,
                color: cur ? 'var(--ink)' : 'var(--muted)',
                fontStyle: cur ? 'italic' : 'normal',
                opacity: c.draft ? 0.55 : 1,
                textDecoration: 'none', lineHeight: 1.3, fontSize: 11.5 }}>
                <span style={{ fontVariant: 'small-caps',
                  letterSpacing: '0.1em', fontSize: 9.5,
                  color: cur ? 'var(--accent)' : 'var(--muted)' }}>
                  {c.num}.
                </span>
                <span>{c.title}{c.draft ? ' (draft)' : ''}</span>
                <span style={{ color: c.read ? 'var(--accent)' : 'transparent',
                  fontSize: 10 }}>{c.read ? '\u2713' : '·'}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// ── End-of-article: previous / next in series ────────────────────────
function SeriesNext({ seriesId, currentChapter }) {
  const s = SERIES[seriesId];
  if (!s) return null;
  const idx = s.chapters.findIndex((c) => c.num === currentChapter);
  const prev = idx > 0 ? s.chapters[idx - 1] : null;
  const next = idx >= 0 && idx < s.chapters.length - 1 ? s.chapters[idx + 1] : null;

  return (
    <section style={{ margin: '3.4em 0 0', padding: '24px 0',
      borderTop: '1px solid var(--rule)', borderBottom: '1px solid var(--rule)' }}>
      <div style={{ textAlign: 'center', marginBottom: 18,
        fontFamily: 'var(--serif)', fontVariant: 'small-caps',
        letterSpacing: '0.3em', fontSize: 10.5, color: 'var(--muted)' }}>
        Continuing in {s.title}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr',
        gap: 24, alignItems: 'stretch' }}>
        <a href="#" style={{ padding: 18, borderRight: '1px solid var(--rule)',
          textDecoration: 'none', color: 'inherit', textAlign: 'left',
          opacity: prev ? 1 : 0.35, pointerEvents: prev ? 'auto' : 'none' }}>
          <div style={{ fontFamily: 'var(--serif)', fontVariant: 'small-caps',
            letterSpacing: '0.22em', fontSize: 10, color: 'var(--muted)',
            marginBottom: 4 }}>← Previously</div>
          {prev ? (
            <>
              <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic',
                fontSize: 10.5, color: 'var(--muted)',
                fontVariant: 'small-caps', letterSpacing: '0.18em' }}>
                Chapter {prev.num}
              </div>
              <div style={{ fontFamily: 'var(--serif)', fontSize: 17,
                lineHeight: 1.3, color: 'var(--ink)', marginTop: 4 }}>
                {prev.title}
              </div>
            </>
          ) : (
            <div style={{ fontStyle: 'italic', fontSize: 13,
              color: 'var(--muted)' }}>This is the first chapter.</div>
          )}
        </a>
        <a href="#" style={{ padding: 18,
          textDecoration: 'none', color: 'inherit', textAlign: 'right',
          opacity: next ? 1 : 0.35, pointerEvents: next ? 'auto' : 'none' }}>
          <div style={{ fontFamily: 'var(--serif)', fontVariant: 'small-caps',
            letterSpacing: '0.22em', fontSize: 10, color: 'var(--accent)',
            marginBottom: 4 }}>Next chapter →</div>
          {next ? (
            <>
              <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic',
                fontSize: 10.5, color: 'var(--muted)',
                fontVariant: 'small-caps', letterSpacing: '0.18em' }}>
                Chapter {next.num}
              </div>
              <div style={{ fontFamily: 'var(--serif)', fontSize: 17,
                lineHeight: 1.3, color: 'var(--ink)', marginTop: 4 }}>
                {next.title}
              </div>
            </>
          ) : (
            <div style={{ fontStyle: 'italic', fontSize: 13,
              color: 'var(--muted)' }}>You have reached the end.</div>
          )}
        </a>
      </div>
      <div style={{ textAlign: 'center', marginTop: 16,
        fontFamily: 'var(--serif)', fontStyle: 'italic',
        fontSize: 12.5, color: 'var(--muted)' }}>
        or <a href="#" style={{ color: 'var(--accent)',
          borderBottom: '1px solid var(--accent)',
          textDecoration: 'none' }}>see the whole volume</a>
      </div>
    </section>
  );
}

// ── Series Index Page ────────────────────────────────────────────────
function SeriesPage({ seriesId = 'ts', palette = 'warm', theme = 'light' }) {
  const s = SERIES[seriesId] || SERIES.ts;
  const vars = window.getPalette
    ? window.getPalette(palette, theme)
    : { '--paper': '#faf8f4', '--ink': '#1a1814', '--paper2': '#f1ece2',
        '--muted': 'rgba(26,24,20,0.55)', '--rule': 'rgba(26,24,20,0.12)',
        '--accent': '#c96442' };
  const serif = '"Newsreader", Georgia, serif';
  const mono  = '"IBM Plex Mono", monospace';

  const readCount = s.chapters.filter((c) => c.read).length;
  const draftCount = s.chapters.filter((c) => c.draft).length;

  return (
    <div style={{ ...vars, height: '100%', overflow: 'hidden',
      background: 'var(--paper)', color: 'var(--ink)',
      fontFamily: serif, position: 'relative' }}>
      <header style={{ position: 'absolute', top: 0, left: 0, right: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '22px 48px 0', zIndex: 5,
        fontFamily: '"IBM Plex Sans", sans-serif', fontSize: 13 }}>
        <a href="#" style={{ color: 'var(--ink)', textDecoration: 'none',
          fontWeight: 600, letterSpacing: '-0.01em' }}>maxubrq</a>
        <nav style={{ display: 'flex', gap: 24, color: 'var(--muted)' }}>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Writing</a>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Topics</a>
          <a href="#" style={{ color: 'var(--ink)', fontWeight: 500, textDecoration: 'none' }}>Series</a>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Glossary</a>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>About</a>
        </nav>
      </header>

      <div style={{ height: '100%', overflowY: 'auto',
        paddingTop: 72, paddingBottom: 100 }}>
        <div style={{ maxWidth: 920, margin: '0 auto', padding: '0 48px' }}>

          {/* Spine masthead — looks like a book's title page */}
          <section style={{ padding: '40px 0 20px', textAlign: 'center' }}>
            <div style={{ fontFamily: mono, fontSize: 11, letterSpacing: 0.8,
              textTransform: 'uppercase', color: 'var(--muted)',
              marginBottom: 18 }}>
              A series · {s.topic}
            </div>
            <div style={{ fontFamily: serif, fontVariant: 'small-caps',
              letterSpacing: '0.4em', fontSize: 13, color: 'var(--accent)',
              marginBottom: 12 }}>
              Volume {s.volume}
            </div>
            <h1 style={{ fontFamily: serif, fontWeight: 500,
              fontSize: 'clamp(2.4em, 4.8vw, 3.6em)', lineHeight: 1.05,
              margin: '0 auto 0.4em', letterSpacing: '-0.02em',
              maxWidth: '20ch' }}>
              {s.title}
            </h1>
            <p style={{ margin: '0 auto', fontFamily: serif,
              fontStyle: 'italic', fontSize: 17, lineHeight: 1.5,
              color: 'var(--muted)', maxWidth: '40ch' }}>
              {s.subtitle}
            </p>

            {/* Volume status badge */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 14,
              marginTop: 28, padding: '8px 18px',
              border: '1px solid var(--rule)',
              fontFamily: serif, fontVariant: 'small-caps',
              letterSpacing: '0.22em', fontSize: 11, color: 'var(--muted)' }}>
              <span style={{ fontSize: 9, color: s.state === 'complete' ? 'var(--accent)' : 'var(--muted)' }}>
                {s.state === 'complete' ? '●' : '○'}
              </span>
              <span>
                {s.state === 'complete'
                  ? `Volume complete · ${s.chapterCount} chapters`
                  : `In progress · ${s.chapters.length}${typeof s.chapterCount === 'number' ? ` of ~${s.chapterCount}` : ''} chapters`}
              </span>
              {draftCount > 0 && (
                <span style={{ color: 'var(--accent)', fontStyle: 'italic',
                  fontVariant: 'normal', letterSpacing: 0, fontSize: 12 }}>
                  · {draftCount} in draft
                </span>
              )}
            </div>
          </section>

          {/* Author letter */}
          <section style={{ padding: '40px 0 36px',
            borderTop: '1px solid var(--rule)',
            borderBottom: '1px solid var(--rule)' }}>
            <div style={{ fontFamily: serif, fontVariant: 'small-caps',
              letterSpacing: '0.3em', fontSize: 10.5,
              color: 'var(--muted)', marginBottom: 20, textAlign: 'center' }}>
              A letter from the author
            </div>
            <div style={{ maxWidth: '54ch', margin: '0 auto' }}>
              {s.letter.map((p, i) => (
                <p key={i} style={{ margin: '0 0 1em',
                  fontFamily: serif, fontSize: 17.5, lineHeight: 1.7,
                  color: 'var(--ink)', textAlign: 'left' }}>
                  {i === 0 && (
                    <span style={{ float: 'left', fontFamily: serif,
                      fontSize: 52, lineHeight: 0.9,
                      padding: '6px 10px 0 0', color: 'var(--accent)' }}>
                      {p.charAt(0)}
                    </span>
                  )}
                  {i === 0 ? p.slice(1) : p}
                </p>
              ))}
              <div style={{ marginTop: 14, fontFamily: serif,
                fontStyle: 'italic', fontSize: 13.5,
                color: 'var(--muted)', textAlign: 'right' }}>
                — m., {s.started}
              </div>
            </div>
          </section>

          {/* Reading map */}
          <section style={{ padding: '44px 0 0' }}>
            <div style={{ display: 'flex', alignItems: 'baseline',
              justifyContent: 'space-between', marginBottom: 22 }}>
              <h2 style={{ margin: 0, fontFamily: serif, fontWeight: 500,
                fontSize: 22, fontStyle: 'italic',
                letterSpacing: '-0.005em' }}>
                The reading map
              </h2>
              <span style={{ fontFamily: serif, fontStyle: 'italic',
                fontSize: 12.5, color: 'var(--muted)' }}>
                {readCount} read · {s.chapters.length - readCount - draftCount} ahead{draftCount > 0 ? ` · ${draftCount} drafted` : ''}
              </span>
            </div>

            <ol style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {s.chapters.map((c, i) => {
                const isPinned = c.pinned; // "where you left off"
                const isFirst = i === 0;
                return (
                  <li key={c.num}>
                    <a href="#" style={{
                      display: 'grid',
                      gridTemplateColumns: '60px 1fr auto',
                      gap: 24, alignItems: 'baseline',
                      padding: '18px 8px',
                      borderTop: '1px solid var(--rule)',
                      borderBottom: i === s.chapters.length - 1 ? '1px solid var(--rule)' : 'none',
                      textDecoration: 'none', color: 'inherit',
                      background: isPinned ? 'var(--paper2)' : 'transparent',
                      opacity: c.draft ? 0.65 : 1,
                      transition: 'background 0.12s', position: 'relative' }}
                      onMouseEnter={(e) => { if (!isPinned) e.currentTarget.style.background = 'var(--paper2)'; }}
                      onMouseLeave={(e) => { if (!isPinned) e.currentTarget.style.background = 'transparent'; }}>

                      {isPinned && (
                        <span style={{ position: 'absolute', left: 0, top: 0, bottom: 0,
                          width: 2, background: 'var(--accent)' }} />
                      )}

                      <div style={{ fontFamily: serif,
                        fontSize: 28, fontStyle: 'italic',
                        color: c.read ? 'var(--muted)' : 'var(--accent)',
                        textDecoration: c.read ? 'line-through' : 'none',
                        textDecorationColor: 'var(--rule)',
                        lineHeight: 1, fontVariant: 'small-caps',
                        letterSpacing: '-0.01em' }}>
                        {c.num}
                      </div>

                      <div>
                        <div style={{ fontFamily: serif, fontSize: 18,
                          color: 'var(--ink)', fontWeight: 500,
                          letterSpacing: '-0.005em',
                          textDecoration: c.read ? 'line-through' : 'none',
                          textDecorationColor: 'var(--rule)' }}>
                          {c.title}
                          {c.draft && (
                            <span style={{ marginLeft: 10,
                              fontFamily: serif, fontStyle: 'italic',
                              fontSize: 11.5, color: 'var(--muted)' }}>
                              (draft)
                            </span>
                          )}
                        </div>
                        <div style={{ display: 'flex', gap: 14,
                          marginTop: 4, fontFamily: serif, fontSize: 11.5,
                          fontVariant: 'small-caps', letterSpacing: '0.2em',
                          color: 'var(--muted)' }}>
                          <span>{c.date}</span>
                          {!c.draft && <span>·</span>}
                          {!c.draft && <span>{c.min} min</span>}
                          {isPinned && (
                            <>
                              <span>·</span>
                              <span style={{ color: 'var(--accent)',
                                fontStyle: 'italic', fontVariant: 'normal',
                                letterSpacing: 0, fontSize: 12.5 }}>
                                where you left off
                              </span>
                            </>
                          )}
                          {isFirst && readCount === 0 && !isPinned && (
                            <>
                              <span>·</span>
                              <span style={{ color: 'var(--accent)',
                                fontStyle: 'italic', fontVariant: 'normal',
                                letterSpacing: 0, fontSize: 12.5 }}>
                                start here
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      <div style={{ fontFamily: serif, fontSize: 14,
                        color: c.read ? 'var(--accent)' : 'var(--muted)' }}>
                        {c.read ? '\u2713' : c.draft ? '·' : '→'}
                      </div>
                    </a>
                  </li>
                );
              })}
            </ol>

            <div style={{ marginTop: 22, display: 'flex',
              justifyContent: 'center', gap: 28,
              fontFamily: serif, fontStyle: 'italic', fontSize: 12.5,
              color: 'var(--muted)' }}>
              <a href="#" style={{ color: 'var(--accent)',
                borderBottom: '1px solid var(--accent)',
                textDecoration: 'none' }}>
                {s.state === 'complete' ? 'read from chapter I →' :
                  readCount > 0 ? 'continue where you left off →' : 'start with chapter I →'}
              </a>
              <span>·</span>
              <a href="#" style={{ color: 'inherit',
                textDecoration: 'none',
                borderBottom: '1px solid var(--rule)' }}>
                subscribe to new chapters
              </a>
            </div>
          </section>

          {/* Colophon */}
          <div style={{ marginTop: 60, paddingTop: 24,
            borderTop: '1px solid var(--rule)', textAlign: 'center',
            fontFamily: serif, fontStyle: 'italic',
            fontSize: 12, color: 'var(--muted)' }}>
            {s.state === 'complete'
              ? `This volume was opened ${s.started} and closed ${s.completed}.`
              : `This volume was opened ${s.started}. It is still being written.`}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Site-level shelf ─────────────────────────────────────────────────
function SeriesShelf({ palette = 'warm', theme = 'light' }) {
  const vars = window.getPalette
    ? window.getPalette(palette, theme)
    : { '--paper': '#faf8f4', '--ink': '#1a1814', '--paper2': '#f1ece2',
        '--muted': 'rgba(26,24,20,0.55)', '--rule': 'rgba(26,24,20,0.12)',
        '--accent': '#c96442' };
  const serif = '"Newsreader", Georgia, serif';
  const mono  = '"IBM Plex Mono", monospace';
  const all = Object.values(SERIES);

  return (
    <div style={{ ...vars, height: '100%', overflow: 'hidden',
      background: 'var(--paper)', color: 'var(--ink)',
      fontFamily: serif, position: 'relative' }}>
      <header style={{ position: 'absolute', top: 0, left: 0, right: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '22px 48px 0', zIndex: 5,
        fontFamily: '"IBM Plex Sans", sans-serif', fontSize: 13 }}>
        <a href="#" style={{ color: 'var(--ink)', textDecoration: 'none',
          fontWeight: 600, letterSpacing: '-0.01em' }}>maxubrq</a>
        <nav style={{ display: 'flex', gap: 24, color: 'var(--muted)' }}>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Writing</a>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Topics</a>
          <a href="#" style={{ color: 'var(--ink)', fontWeight: 500, textDecoration: 'none' }}>Series</a>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Glossary</a>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>About</a>
        </nav>
      </header>

      <div style={{ height: '100%', overflowY: 'auto',
        paddingTop: 72, paddingBottom: 80 }}>
        <div style={{ maxWidth: 980, margin: '0 auto', padding: '0 48px' }}>

          <section style={{ padding: '32px 0 28px' }}>
            <div style={{ fontFamily: mono, fontSize: 11, letterSpacing: 0.8,
              textTransform: 'uppercase', color: 'var(--muted)',
              marginBottom: 18 }}>
              The shelf
            </div>
            <h1 style={{ fontFamily: serif, fontWeight: 500,
              fontSize: 'clamp(2.4em, 4.8vw, 3.4em)', lineHeight: 1.05,
              margin: '0 0 0.25em', letterSpacing: '-0.02em' }}>
              Series
            </h1>
            <p style={{ margin: 0, fontFamily: serif,
              fontStyle: 'italic', fontSize: 17, lineHeight: 1.55,
              color: 'var(--muted)', maxWidth: '46ch' }}>
              When a subject deserves more than one essay, it gets a volume.
              Some volumes are closed. Some are still being written.
            </p>
          </section>

          <section style={{ display: 'flex', flexDirection: 'column', gap: 0,
            borderTop: '1px solid var(--rule)' }}>
            {all.map((s) => {
              const readCount = s.chapters.filter((c) => c.read).length;
              return (
                <a key={s.id} href="#" style={{
                  display: 'grid', gridTemplateColumns: '110px 1fr auto',
                  gap: 32, alignItems: 'center',
                  padding: '32px 8px',
                  borderBottom: '1px solid var(--rule)',
                  textDecoration: 'none', color: 'inherit',
                  transition: 'background 0.12s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--paper2)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}>

                  {/* Spine — looks like a book spine */}
                  <div style={{ height: 130, background: 'var(--paper2)',
                    border: '1px solid var(--rule)', borderLeft: '3px solid var(--accent)',
                    display: 'flex', flexDirection: 'column',
                    justifyContent: 'space-between', padding: '14px 12px',
                    fontFamily: serif }}>
                    <div style={{ fontVariant: 'small-caps',
                      letterSpacing: '0.3em', fontSize: 9.5,
                      color: 'var(--muted)' }}>
                      Vol. {s.volume}
                    </div>
                    <div style={{ fontStyle: 'italic', fontSize: 13,
                      lineHeight: 1.2, color: 'var(--ink)' }}>
                      {s.title.split(' ').slice(0, 3).join(' ')}…
                    </div>
                    <div style={{ fontVariant: 'small-caps',
                      letterSpacing: '0.22em', fontSize: 9,
                      color: s.state === 'complete' ? 'var(--accent)' : 'var(--muted)' }}>
                      {s.state === 'complete' ? '● closed' : '○ in progress'}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontFamily: serif, fontVariant: 'small-caps',
                      letterSpacing: '0.22em', fontSize: 10.5,
                      color: 'var(--accent)', marginBottom: 6 }}>
                      {s.topic}
                    </div>
                    <h2 style={{ margin: '0 0 6px', fontFamily: serif,
                      fontWeight: 500, fontSize: 26,
                      letterSpacing: '-0.01em', lineHeight: 1.15 }}>
                      {s.title}
                    </h2>
                    <p style={{ margin: '0 0 12px', fontFamily: serif,
                      fontStyle: 'italic', fontSize: 14.5,
                      color: 'var(--muted)', lineHeight: 1.5,
                      maxWidth: '54ch' }}>
                      {s.subtitle}
                    </p>
                    <div style={{ display: 'flex', gap: 14,
                      fontFamily: serif, fontSize: 11.5,
                      fontVariant: 'small-caps', letterSpacing: '0.2em',
                      color: 'var(--muted)' }}>
                      <span>
                        {s.state === 'complete'
                          ? `Closed · ${s.chapters.length} chapters`
                          : `${s.chapters.length}${typeof s.chapterCount === 'number' ? ` of ~${s.chapterCount}` : ''} chapters`}
                      </span>
                      <span>·</span>
                      <span>{readCount} read</span>
                      <span>·</span>
                      <span>{s.started}{s.completed ? ` – ${s.completed}` : ' – present'}</span>
                    </div>
                  </div>

                  <div style={{ fontFamily: serif, fontStyle: 'italic',
                    fontSize: 14, color: 'var(--accent)' }}>
                    enter →
                  </div>
                </a>
              );
            })}
          </section>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { SERIES, SeriesPage, SeriesShelf,
  SeriesRibbon, SeriesRail, SeriesNext });
