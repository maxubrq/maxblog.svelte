// Companion.jsx — M2: the margin AI that has read everything you wrote.
//
// Three artboards:
//   CompanionAsk       — the gutter prompt with a question being typed/sent
//   CompanionAnswer    — the answer in margin form with citations
//   CompanionRefusal   — the honest "you have not written about this yet"
//
// Two design rules above all:
//   1. The Companion will not invent. Out-of-corpus questions are turned
//      into reader-letters to the author.
//   2. It lives in the article grid, not a chat panel. Same serif. Same
//      hair-rules. Italic small-caps for citations. No avatars, no bubbles.
//
// The mocked answers are static so they can be read in the canvas. The
// input control wires to window.claude.complete with the corpus stuffed
// into the system prompt and a strict refusal contract — so dropped into
// a real article it actually works.

const CORPUS_SAMPLE = [
  // Lightweight excerpts — in the real site this would be a fuller index
  { slug: 'debounce', section: 'III', title: 'Debounce, rebuilt',
    excerpt: 'Debounce postpones every call until the storm of calls has stopped. Throttle, by contrast, lets one through and ignores the rest until a window has elapsed. The two are easy to confuse and entirely different.' },
  { slug: 'rate-limits', section: 'II', title: 'A note on rate-limits',
    excerpt: 'Throttle is a rate limit applied to the future; debounce is a rate limit applied to the past. The first protects a downstream system; the second waits for a quiet moment to act.' },
  { slug: 'pendulums', section: 'V',
    title: 'On the patience of pendulums',
    excerpt: 'There is a small lesson in the way a pendulum will not finish its swing if you keep pushing it: every interrupt resets the period. Patience, in code, is the same shape.' },
];

function compVars(palette = 'warm', theme = 'light') {
  return window.getPalette
    ? window.getPalette(palette, theme)
    : { '--paper': '#faf8f4', '--ink': '#1a1814', '--paper2': '#f1ece2',
        '--muted': 'rgba(26,24,20,0.55)', '--rule': 'rgba(26,24,20,0.12)',
        '--accent': '#c96442' };
}
const compSerif = '"Newsreader", Georgia, serif';
const compMono  = '"IBM Plex Mono", monospace';

// ── Shared chrome ────────────────────────────────────────────────────
function CompanionShell({ children, palette = 'warm', theme = 'light' }) {
  const vars = compVars(palette, theme);
  return (
    <div style={{ ...vars, height: '100%', overflow: 'hidden',
      background: 'var(--paper)', color: 'var(--ink)',
      fontFamily: compSerif, position: 'relative' }}>
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
        {children}
      </div>
    </div>
  );
}

// ── Article body shared across the three artboards ──────────────────
function CompanionArticleBody() {
  return (
    <article style={{ paddingTop: 28 }}>
      <div style={{ fontFamily: compMono, fontSize: 11,
        letterSpacing: 0.8, textTransform: 'uppercase',
        color: 'var(--muted)', marginBottom: 16 }}>
        Software · 14 min read · Feb 17, 2026
      </div>
      <h1 style={{ fontFamily: compSerif, fontWeight: 500,
        fontSize: 'clamp(2.2em, 4.4vw, 3em)', lineHeight: 1.1,
        margin: '0 0 0.3em', letterSpacing: '-0.02em',
        maxWidth: '20ch' }}>
        Debounce, rebuilt
      </h1>
      <p style={{ margin: '0 0 1.2em', fontFamily: compSerif,
        fontStyle: 'italic', fontSize: 17, color: 'var(--muted)',
        maxWidth: '46ch', lineHeight: 1.5 }}>
        You have written debounce a hundred times and gotten it
        wrong eighty.
      </p>

      <h2 style={{ fontFamily: compSerif, fontVariant: 'small-caps',
        letterSpacing: '0.28em', fontSize: 12, color: 'var(--accent)',
        margin: '32px 0 12px' }}>§ III · A correct implementation</h2>

      <p style={{ margin: '0 0 1em', fontFamily: compSerif,
        fontSize: 18, lineHeight: 1.7, color: 'var(--ink)' }}>
        The version of <code style={{ fontFamily: compMono,
          fontSize: 14.5, padding: '1px 5px',
          background: 'var(--paper2)' }}>debounce</code> in your
        first internship was probably wrong, and it was wrong in
        a very specific way. We're going to write the right one
        here, in eighteen lines.
      </p>
      <p style={{ margin: '0 0 1em', fontFamily: compSerif,
        fontSize: 18, lineHeight: 1.7, color: 'var(--ink)' }}>
        Each call cancels the timer (if any), stashes the new
        arguments, and schedules a fresh timer to apply them
        after the wait has elapsed. That is the entire trick.
      </p>
      <p style={{ margin: '0 0 1em', fontFamily: compSerif,
        fontSize: 18, lineHeight: 1.7, color: 'var(--ink)' }}>
        The reason this looks strange is that the "stashes the new
        arguments" step is the only line in the function that does
        the <em>important</em> thing, and it does it without any
        visible computation. The timer is the actor; the closure
        is the stage.
      </p>
    </article>
  );
}

// ── A citation chip ──────────────────────────────────────────────────
function Citation({ slug, section, title }) {
  return (
    <a href={`#${slug}`} style={{ display: 'inline-flex',
      alignItems: 'baseline', gap: 6, fontFamily: compSerif,
      color: 'var(--accent)', textDecoration: 'none' }}>
      <span style={{ fontVariant: 'small-caps', letterSpacing: '0.2em',
        fontSize: 10 }}>§ {title.split(' ').slice(0, 3).join(' ')}</span>
      <span style={{ fontStyle: 'italic', fontSize: 11.5,
        color: 'var(--muted)' }}>{section}</span>
    </a>
  );
}

// ── 1. The ask state ─────────────────────────────────────────────────
function CompanionAsk({ palette = 'warm', theme = 'light' }) {
  return (
    <CompanionShell palette={palette} theme={theme}>
      <div style={{ display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) 320px',
        gap: 56, maxWidth: 1100, margin: '0 auto',
        padding: '0 48px' }}>
        <div>
          <CompanionArticleBody />
        </div>

        {/* Right margin — the companion */}
        <aside style={{ position: 'sticky', top: 80, alignSelf: 'start',
          paddingTop: 36, fontFamily: compSerif }}>

          {/* The standing invitation */}
          <div style={{ borderTop: '1px solid var(--rule)',
            borderBottom: '1px solid var(--rule)', padding: '14px 0',
            marginBottom: 18 }}>
            <div style={{ fontFamily: compSerif, fontVariant: 'small-caps',
              letterSpacing: '0.32em', fontSize: 10,
              color: 'var(--accent)', marginBottom: 6 }}>
              ✦ the margin
            </div>
            <p style={{ margin: 0, fontFamily: compSerif,
              fontStyle: 'italic', fontSize: 14, lineHeight: 1.5,
              color: 'var(--muted)' }}>
              Ask anything. I have read everything the author has
              written. I will not invent.
            </p>
          </div>

          {/* The reader's question — already typed, awaiting send */}
          <div style={{ marginBottom: 14, fontFamily: compSerif }}>
            <div style={{ fontVariant: 'small-caps',
              letterSpacing: '0.28em', fontSize: 9.5,
              color: 'var(--muted)', marginBottom: 6 }}>
              you ask
            </div>
            <p style={{ margin: 0, fontFamily: compSerif,
              fontSize: 16, lineHeight: 1.5, color: 'var(--ink)',
              borderLeft: '2px solid var(--accent)', paddingLeft: 12 }}>
              What's the difference between debounce and throttle?
            </p>
          </div>

          {/* Honest reasoning state */}
          <div style={{ padding: '12px 0',
            borderTop: '1px solid var(--rule)',
            borderBottom: '1px solid var(--rule)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8,
              fontFamily: compSerif, fontStyle: 'italic',
              fontSize: 12.5, color: 'var(--muted)', marginBottom: 8 }}>
              <span style={{ display: 'inline-block', width: 6, height: 6,
                borderRadius: '50%', background: 'var(--accent)',
                animation: 'compPulse 1.4s ease-in-out infinite' }} />
              reading what you've written…
            </div>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0,
              display: 'flex', flexDirection: 'column', gap: 4,
              fontFamily: compSerif, fontSize: 11.5, color: 'var(--muted)' }}>
              <li>↳ <em>Debounce, rebuilt</em>, § III</li>
              <li>↳ <em>A note on rate-limits</em>, § II</li>
              <li style={{ opacity: 0.55 }}>↳ <em>On the patience of pendulums</em>, § V (in passing)</li>
            </ul>
          </div>

          {/* Refresh control */}
          <div style={{ marginTop: 14, display: 'flex',
            justifyContent: 'space-between', fontFamily: compSerif,
            fontStyle: 'italic', fontSize: 12, color: 'var(--muted)' }}>
            <span>(thinking…)</span>
            <a href="#" style={{ color: 'var(--muted)',
              borderBottom: '1px solid var(--rule)',
              textDecoration: 'none' }}>cancel</a>
          </div>

          <div style={{ marginTop: 26, fontFamily: compSerif,
            fontStyle: 'italic', fontSize: 11.5, color: 'var(--muted)',
            lineHeight: 1.55, paddingTop: 14,
            borderTop: '1px solid var(--rule)' }}>
            The margin will only quote the author's own writing. If a
            question has not been written about, it will say so.
          </div>

          <style>{`@keyframes compPulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }`}</style>
        </aside>
      </div>
    </CompanionShell>
  );
}

// ── 2. The answer state ──────────────────────────────────────────────
function CompanionAnswer({ palette = 'warm', theme = 'light' }) {
  return (
    <CompanionShell palette={palette} theme={theme}>
      <div style={{ display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) 320px',
        gap: 56, maxWidth: 1100, margin: '0 auto',
        padding: '0 48px' }}>
        <div>
          <CompanionArticleBody />
        </div>

        <aside style={{ position: 'sticky', top: 80, alignSelf: 'start',
          paddingTop: 36, fontFamily: compSerif }}>

          {/* The question, retained */}
          <div style={{ marginBottom: 14, fontFamily: compSerif }}>
            <div style={{ fontVariant: 'small-caps',
              letterSpacing: '0.28em', fontSize: 9.5,
              color: 'var(--muted)', marginBottom: 6 }}>
              you asked
            </div>
            <p style={{ margin: 0, fontFamily: compSerif,
              fontSize: 14.5, lineHeight: 1.5, color: 'var(--muted)',
              borderLeft: '2px solid var(--rule)', paddingLeft: 12,
              fontStyle: 'italic' }}>
              What's the difference between debounce and throttle?
            </p>
          </div>

          {/* The answer in body type, in margin form */}
          <div style={{ paddingTop: 16, paddingBottom: 14,
            borderTop: '1px solid var(--rule)' }}>
            <div style={{ fontFamily: compSerif, fontVariant: 'small-caps',
              letterSpacing: '0.32em', fontSize: 10,
              color: 'var(--accent)', marginBottom: 10 }}>
              ✦ the margin
            </div>
            <p style={{ margin: '0 0 0.9em', fontFamily: compSerif,
              fontSize: 14.5, lineHeight: 1.65, color: 'var(--ink)' }}>
              Debounce <em>postpones</em> every call until the storm of
              calls has stopped. Throttle, by contrast, <em>lets one
              through</em> and ignores the rest until a window has elapsed.
              The two are easy to confuse and entirely different.
            </p>
            <p style={{ margin: '0', fontFamily: compSerif,
              fontSize: 14.5, lineHeight: 1.65, color: 'var(--ink)' }}>
              The author phrases it sharper in another piece: throttle
              is a rate limit applied to <em>the future</em>; debounce
              is a rate limit applied to <em>the past</em>.
            </p>
          </div>

          {/* Citations */}
          <div style={{ paddingTop: 14, paddingBottom: 14,
            borderTop: '1px solid var(--rule)',
            borderBottom: '1px solid var(--rule)' }}>
            <div style={{ fontFamily: compSerif, fontVariant: 'small-caps',
              letterSpacing: '0.28em', fontSize: 9.5, color: 'var(--muted)',
              marginBottom: 8 }}>
              drawn from
            </div>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0,
              display: 'flex', flexDirection: 'column', gap: 6 }}>
              <li>
                <a href="#" style={{ display: 'flex',
                  justifyContent: 'space-between', alignItems: 'baseline',
                  fontFamily: compSerif, color: 'var(--ink)',
                  textDecoration: 'none' }}>
                  <span style={{ fontStyle: 'italic', fontSize: 13.5 }}>
                    Debounce, rebuilt
                  </span>
                  <span style={{ fontVariant: 'small-caps',
                    letterSpacing: '0.2em', fontSize: 10,
                    color: 'var(--accent)' }}>§ iii</span>
                </a>
              </li>
              <li>
                <a href="#" style={{ display: 'flex',
                  justifyContent: 'space-between', alignItems: 'baseline',
                  fontFamily: compSerif, color: 'var(--ink)',
                  textDecoration: 'none' }}>
                  <span style={{ fontStyle: 'italic', fontSize: 13.5 }}>
                    A note on rate-limits
                  </span>
                  <span style={{ fontVariant: 'small-caps',
                    letterSpacing: '0.2em', fontSize: 10,
                    color: 'var(--accent)' }}>§ ii</span>
                </a>
              </li>
              <li>
                <a href="#" style={{ display: 'flex',
                  justifyContent: 'space-between', alignItems: 'baseline',
                  fontFamily: compSerif, color: 'var(--muted)',
                  textDecoration: 'none' }}>
                  <span style={{ fontStyle: 'italic', fontSize: 13.5 }}>
                    On the patience of pendulums
                  </span>
                  <span style={{ fontVariant: 'small-caps',
                    letterSpacing: '0.2em', fontSize: 10,
                    color: 'var(--accent)' }}>§ v · in passing</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Follow-up input */}
          <div style={{ marginTop: 18, fontFamily: compSerif }}>
            <div style={{ fontVariant: 'small-caps',
              letterSpacing: '0.28em', fontSize: 9.5,
              color: 'var(--muted)', marginBottom: 6 }}>
              follow up
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8,
              borderBottom: '1px solid var(--accent)',
              paddingBottom: 6 }}>
              <input type="text"
                placeholder="ask again, or refine…"
                style={{ flex: 1, border: 'none', background: 'transparent',
                fontFamily: compSerif, fontSize: 14, color: 'var(--ink)',
                outline: 'none', padding: 0 }} />
              <span style={{ fontFamily: compSerif, fontStyle: 'italic',
                fontSize: 12, color: 'var(--accent)' }}>↵</span>
            </div>
          </div>

          {/* Reader-side actions */}
          <div style={{ marginTop: 18, display: 'flex',
            justifyContent: 'space-between', fontFamily: compSerif,
            fontStyle: 'italic', fontSize: 11.5, color: 'var(--muted)' }}>
            <a href="#" style={{ color: 'var(--muted)',
              borderBottom: '1px solid var(--rule)',
              textDecoration: 'none' }}>save to my margin</a>
            <a href="#" style={{ color: 'var(--muted)',
              borderBottom: '1px solid var(--rule)',
              textDecoration: 'none' }}>start over</a>
          </div>
        </aside>
      </div>
    </CompanionShell>
  );
}

// ── 3. The honest refusal ────────────────────────────────────────────
function CompanionRefusal({ palette = 'warm', theme = 'light' }) {
  return (
    <CompanionShell palette={palette} theme={theme}>
      <div style={{ display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) 320px',
        gap: 56, maxWidth: 1100, margin: '0 auto',
        padding: '0 48px' }}>
        <div>
          <CompanionArticleBody />
        </div>

        <aside style={{ position: 'sticky', top: 80, alignSelf: 'start',
          paddingTop: 36, fontFamily: compSerif }}>

          {/* The question */}
          <div style={{ marginBottom: 14, fontFamily: compSerif }}>
            <div style={{ fontVariant: 'small-caps',
              letterSpacing: '0.28em', fontSize: 9.5,
              color: 'var(--muted)', marginBottom: 6 }}>
              you asked
            </div>
            <p style={{ margin: 0, fontFamily: compSerif,
              fontSize: 14.5, lineHeight: 1.5, color: 'var(--muted)',
              borderLeft: '2px solid var(--rule)', paddingLeft: 12,
              fontStyle: 'italic' }}>
              What does the author think about Heidegger?
            </p>
          </div>

          {/* The refusal */}
          <div style={{ paddingTop: 16, paddingBottom: 18,
            borderTop: '1px solid var(--rule)' }}>
            <div style={{ fontFamily: compSerif, fontVariant: 'small-caps',
              letterSpacing: '0.32em', fontSize: 10,
              color: 'var(--accent)', marginBottom: 10 }}>
              ✦ the margin
            </div>
            <p style={{ margin: '0 0 0.9em', fontFamily: compSerif,
              fontSize: 14.5, lineHeight: 1.65, color: 'var(--ink)' }}>
              The author has not written about Heidegger.
            </p>
            <p style={{ margin: 0, fontFamily: compSerif,
              fontStyle: 'italic', fontSize: 14, lineHeight: 1.55,
              color: 'var(--muted)' }}>
              I won't speak for them. Would you like to leave this as a
              question?
            </p>

            <a href="#" style={{ display: 'inline-flex',
              alignItems: 'center', gap: 6, marginTop: 14,
              fontFamily: compSerif, fontStyle: 'italic',
              fontSize: 13.5, color: 'var(--accent)',
              borderBottom: '1px solid var(--accent)',
              textDecoration: 'none' }}>
              yes, queue it for the author →
            </a>
          </div>

          {/* Adjacent essays — what the corpus does cover */}
          <div style={{ paddingTop: 14,
            borderTop: '1px solid var(--rule)' }}>
            <div style={{ fontFamily: compSerif, fontVariant: 'small-caps',
              letterSpacing: '0.28em', fontSize: 9.5, color: 'var(--muted)',
              marginBottom: 10 }}>
              adjacent essays in the archive
            </div>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0,
              display: 'flex', flexDirection: 'column', gap: 10 }}>
              <li>
                <a href="#" style={{ display: 'block',
                  fontFamily: compSerif, color: 'var(--ink)',
                  textDecoration: 'none' }}>
                  <div style={{ fontFamily: compSerif,
                    fontVariant: 'small-caps', letterSpacing: '0.2em',
                    fontSize: 9.5, color: 'var(--accent)',
                    marginBottom: 2 }}>Philosophy</div>
                  <div style={{ fontStyle: 'italic', fontSize: 14 }}>
                    Reading Boethius on a train
                  </div>
                </a>
              </li>
              <li>
                <a href="#" style={{ display: 'block',
                  fontFamily: compSerif, color: 'var(--ink)',
                  textDecoration: 'none' }}>
                  <div style={{ fontFamily: compSerif,
                    fontVariant: 'small-caps', letterSpacing: '0.2em',
                    fontSize: 9.5, color: 'var(--accent)',
                    marginBottom: 2 }}>Philosophy</div>
                  <div style={{ fontStyle: 'italic', fontSize: 14 }}>
                    Simone Weil, attention, and the page that broke me
                  </div>
                </a>
              </li>
            </ul>
          </div>

          <div style={{ marginTop: 24, fontFamily: compSerif,
            fontStyle: 'italic', fontSize: 11.5, color: 'var(--muted)',
            lineHeight: 1.55, paddingTop: 14,
            borderTop: '1px solid var(--rule)' }}>
            The margin will not invent. When the archive falls silent,
            it falls silent.
          </div>
        </aside>
      </div>
    </CompanionShell>
  );
}

// ── Live wiring (drop-in for a real article) ─────────────────────────
// Calls window.claude.complete with a strict refusal contract. Used here
// only as an export for real-site usage; the canvas artboards above are
// static so they read clearly.
async function askMargin(question, corpus = CORPUS_SAMPLE) {
  if (!window.claude || !window.claude.complete) return null;
  const corpusText = corpus.map((c) =>
    `[${c.slug} § ${c.section}] "${c.title}" — ${c.excerpt}`
  ).join('\n\n');
  const system = `You are the margin — an assistant that has read everything in this corpus and ONLY this corpus. You speak in the voice of warm scholarship: short, careful, never glib. You quote the author's own phrasing wherever possible. You include citations as "[slug § section]". If the question is not addressed in the corpus, say exactly: "The author has not written about this. I won't speak for them. Would you like to leave it as a question?" — and propose 1-2 adjacent corpus essays. NEVER invent. NEVER speculate beyond the corpus.\n\nCORPUS:\n${corpusText}`;
  return await window.claude.complete({
    messages: [
      { role: 'user', content: `${system}\n\nQUESTION: ${question}` },
    ],
  });
}

Object.assign(window, { CompanionAsk, CompanionAnswer, CompanionRefusal,
  askMargin });
