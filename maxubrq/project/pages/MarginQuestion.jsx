// MarginQuestion.jsx — feature #9.
//
// A full-bleed pause inside an article. Two fleurons frame an italic
// question. Click "reveal" to expose the author's answer + a short
// italic commentary. Persisted across visits in localStorage.
//
// One artboard: a tech-style article that contains one Question. We
// also export a TOC marker glyph (¶?) so the contents page can foreshadow.
//
// Aesthetic: never a card with a border. Reads like the pause between
// movements in a printed book.

const MQ_KEY = 'maxubrq:mq:debounce-state-machine';

function mqVars(palette = 'warm', theme = 'light') {
  return window.getPalette
    ? window.getPalette(palette, theme)
    : { '--paper': '#faf8f4', '--ink': '#1a1814', '--paper2': '#f1ece2',
        '--muted': 'rgba(26,24,20,0.55)', '--rule': 'rgba(26,24,20,0.12)',
        '--accent': '#c96442' };
}
const mqSerif = '"Newsreader", Georgia, serif';
const mqMono  = '"IBM Plex Mono", monospace';

// ── The pause ────────────────────────────────────────────────────────
function MarginQuestion({
  storageKey = MQ_KEY,
  prompt = 'Before you scroll — what does the state machine need to remember between calls?',
  hint = 'Think about it for a moment. Then click below.',
  answer = 'It needs to remember exactly two things: the timer handle, and the most-recent arguments.',
  commentary = "If you also said \u201cthe last result\u201d \u2014 you're in good company; that's the trailing-edge intuition. The catch is debounce, classically, never returns a value: it only forwards. So the result has nowhere to live."
}) {
  const [state, setState] = React.useState(() => {
    try {
      const v = localStorage.getItem(storageKey);
      return v === 'revealed' ? 'revealed' : 'pristine';
    } catch (e) { return 'pristine'; }
  });
  const reveal = () => {
    setState('revealed');
    try { localStorage.setItem(storageKey, 'revealed'); } catch (e) {}
  };
  const reset = () => {
    setState('pristine');
    try { localStorage.removeItem(storageKey); } catch (e) {}
  };

  return (
    <section style={{ margin: '2.6em 0', textAlign: 'center',
      fontFamily: mqSerif }}>
      {/* Top fleuron + rule */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16,
        color: 'var(--muted)' }}>
        <div style={{ flex: 1, height: 1, background: 'var(--rule)' }} />
        <span style={{ fontFamily: mqSerif, fontSize: 18,
          color: 'var(--accent)', lineHeight: 1 }}>❦</span>
        <div style={{ flex: 1, height: 1, background: 'var(--rule)' }} />
      </div>

      {/* Label */}
      <div style={{ fontFamily: mqSerif, fontVariant: 'small-caps',
        letterSpacing: '0.32em', fontSize: 10.5, color: 'var(--accent)',
        margin: '18px 0 12px' }}>
        a pause
      </div>

      {/* The question */}
      <p style={{ margin: '0 auto', fontFamily: mqSerif,
        fontStyle: 'italic', fontSize: 22, lineHeight: 1.4,
        color: 'var(--ink)', maxWidth: '38ch',
        letterSpacing: '-0.005em' }}>
        {prompt}
      </p>

      {/* Hint */}
      <p style={{ margin: '12px auto 0', fontFamily: mqSerif,
        fontStyle: 'italic', fontSize: 13, color: 'var(--muted)',
        maxWidth: '34ch' }}>
        {state === 'pristine' ? hint : 'You looked.'}
      </p>

      {/* The reveal control */}
      <div style={{ marginTop: 18, display: 'flex',
        justifyContent: 'center', gap: 24 }}>
        {state === 'pristine' ? (
          <button onClick={reveal}
            style={{ background: 'transparent', border: 'none',
              cursor: 'pointer', padding: 0,
              fontFamily: mqSerif, fontStyle: 'italic',
              fontSize: 14, color: 'var(--accent)',
              borderBottom: '1px solid var(--accent)' }}>
            reveal the answer →
          </button>
        ) : (
          <button onClick={reset}
            style={{ background: 'transparent', border: 'none',
              cursor: 'pointer', padding: 0,
              fontFamily: mqSerif, fontStyle: 'italic',
              fontSize: 12.5, color: 'var(--muted)',
              borderBottom: '1px solid var(--rule)' }}>
            hide the answer
          </button>
        )}
      </div>

      {/* The answer */}
      {state === 'revealed' && (
        <div style={{ margin: '24px auto 0', maxWidth: '46ch',
          paddingTop: 22, borderTop: '1px solid var(--rule)',
          textAlign: 'left', animation: 'mqFadeIn 0.35s ease' }}>
          <div style={{ fontFamily: mqSerif, fontVariant: 'small-caps',
            letterSpacing: '0.3em', fontSize: 10.5,
            color: 'var(--muted)', marginBottom: 10 }}>
            the answer
          </div>
          <p style={{ margin: '0 0 1em', fontFamily: mqSerif,
            fontSize: 17.5, lineHeight: 1.6, color: 'var(--ink)' }}>
            {answer}
          </p>
          <p style={{ margin: 0, fontFamily: mqSerif,
            fontStyle: 'italic', fontSize: 14.5, lineHeight: 1.55,
            color: 'var(--muted)' }}>
            {commentary}
          </p>
        </div>
      )}

      {/* Bottom fleuron + rule */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16,
        color: 'var(--muted)', marginTop: 22 }}>
        <div style={{ flex: 1, height: 1, background: 'var(--rule)' }} />
        <span style={{ fontFamily: mqSerif, fontSize: 18,
          color: 'var(--accent)', lineHeight: 1 }}>❦</span>
        <div style={{ flex: 1, height: 1, background: 'var(--rule)' }} />
      </div>

      <style>{`@keyframes mqFadeIn { from { opacity: 0; transform: translateY(-2px); } to { opacity: 1; transform: none; } }`}</style>
    </section>
  );
}

// ── The article around it ────────────────────────────────────────────
function ArticleWithMarginQuestion({ palette = 'warm', theme = 'light' }) {
  const vars = mqVars(palette, theme);

  return (
    <div style={{ ...vars, height: '100%', overflow: 'hidden',
      background: 'var(--paper)', color: 'var(--ink)',
      fontFamily: mqSerif, position: 'relative' }}>

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
        <div style={{ display: 'grid',
          gridTemplateColumns: '220px minmax(0, 1fr)',
          gap: 56, maxWidth: 1040, margin: '0 auto',
          padding: '0 48px' }}>

          {/* Sticky TOC with ¶? marker */}
          <aside style={{ position: 'sticky', top: 80, alignSelf: 'start',
            paddingTop: 36, fontFamily: mqSerif }}>
            <div style={{ fontVariant: 'small-caps',
              letterSpacing: '0.28em', fontSize: 10.5,
              color: 'var(--muted)', marginBottom: 14 }}>
              Contents
            </div>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0,
              display: 'flex', flexDirection: 'column', gap: 10,
              fontSize: 13 }}>
              {[
                { num: 'I', t: 'The naïve attempt', mark: false },
                { num: 'II', t: 'What goes wrong in practice', mark: false },
                { num: 'III', t: 'A correct implementation', mark: true },
                { num: 'IV', t: 'Edge cases that bite', mark: false },
              ].map((s) => (
                <li key={s.num} style={{ display: 'grid',
                  gridTemplateColumns: '24px 1fr 18px',
                  alignItems: 'baseline', gap: 6,
                  color: s.mark ? 'var(--ink)' : 'var(--muted)' }}>
                  <span style={{ fontVariant: 'small-caps',
                    letterSpacing: '0.1em', fontSize: 10.5,
                    color: 'var(--accent)' }}>{s.num}.</span>
                  <span style={{ fontStyle: s.mark ? 'italic' : 'normal' }}>
                    {s.t}
                  </span>
                  <span title="contains a pause"
                    style={{ fontFamily: mqSerif,
                      fontSize: 11, color: s.mark ? 'var(--accent)' : 'transparent',
                      letterSpacing: 0 }}>
                    ¶?
                  </span>
                </li>
              ))}
            </ul>

            <div style={{ marginTop: 22, paddingTop: 14,
              borderTop: '1px solid var(--rule)',
              fontFamily: mqSerif, fontStyle: 'italic',
              fontSize: 11.5, color: 'var(--muted)',
              lineHeight: 1.5 }}>
              <span style={{ color: 'var(--accent)',
                fontStyle: 'normal' }}>¶?</span> means a pause to think,
              if you'd like one.
            </div>
          </aside>

          {/* Article body */}
          <article style={{ paddingTop: 28 }}>
            <div style={{ fontFamily: mqMono, fontSize: 11,
              letterSpacing: 0.8, textTransform: 'uppercase',
              color: 'var(--muted)', marginBottom: 16 }}>
              Software · 14 min read · Feb 17, 2026
            </div>
            <h1 style={{ fontFamily: mqSerif, fontWeight: 500,
              fontSize: 'clamp(2.2em, 4.4vw, 3em)', lineHeight: 1.1,
              margin: '0 0 0.3em', letterSpacing: '-0.02em',
              maxWidth: '20ch' }}>
              Debounce, rebuilt
            </h1>
            <p style={{ margin: '0 0 1.2em', fontFamily: mqSerif,
              fontStyle: 'italic', fontSize: 17, color: 'var(--muted)',
              maxWidth: '46ch', lineHeight: 1.5 }}>
              You have written debounce a hundred times and gotten it
              wrong eighty.
            </p>

            <section>
              <h2 style={{ fontFamily: mqSerif, fontVariant: 'small-caps',
                letterSpacing: '0.28em', fontSize: 12, color: 'var(--accent)',
                margin: '32px 0 12px' }}>§ III · A correct implementation</h2>

              <p style={{ margin: '0 0 1em', fontFamily: mqSerif,
                fontSize: 18, lineHeight: 1.7, color: 'var(--ink)' }}>
                The version of <code style={{ fontFamily: mqMono,
                  fontSize: 14.5, padding: '1px 5px',
                  background: 'var(--paper2)' }}>debounce</code> in your
                first internship was probably wrong, and it was wrong in a
                very specific way. We're going to write the right one
                here, in eighteen lines, and the right one will look
                strange to you for about a week.
              </p>

              <p style={{ margin: '0 0 1em', fontFamily: mqSerif,
                fontSize: 18, lineHeight: 1.7, color: 'var(--ink)' }}>
                Before we write any code, though — and this is the part
                most engineers skip — let us pause to ask what the
                function has to remember.
              </p>

              {/* The pause */}
              <MarginQuestion />

              <p style={{ margin: '0 0 1em', fontFamily: mqSerif,
                fontSize: 18, lineHeight: 1.7, color: 'var(--ink)' }}>
                With those two pieces of state pinned down, the
                implementation almost writes itself. Each call cancels
                the timer (if any), stashes the new arguments, and
                schedules a fresh timer to apply them after the wait
                has elapsed. That is the entire trick.
              </p>

              <p style={{ margin: '0 0 1em', fontFamily: mqSerif,
                fontSize: 18, lineHeight: 1.7, color: 'var(--ink)' }}>
                The reason this looks strange for a week is that the
                "stashes the new arguments" step is the only line in
                the function that does the *important* thing, and it
                does it without any visible computation. The timer is
                the actor; the closure is the stage.
              </p>
            </section>

            <div style={{ margin: '36px 0 0', paddingTop: 22,
              borderTop: '1px solid var(--rule)',
              fontFamily: mqSerif, fontStyle: 'italic',
              fontSize: 13, color: 'var(--muted)', textAlign: 'center' }}>
              (article continues — § IV · edge cases that bite)
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { MarginQuestion, ArticleWithMarginQuestion });
