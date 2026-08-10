// FairWitness.jsx — M5: the fair-witness drawer.
//
// Three surfaces:
//   WitnessInvite     — article scrolled to the end-mark; the soft italic
//                       invitation has just appeared in the colophon.
//   WitnessDrawer     — the drawer open: count → pull-quote → retention →
//                       witnessed passages → reaction ribbons → letters → join.
//   WitnessConsent    — the per-mark "share with the witness?" chip moment.
//
// Design intent: never bias the reader before they've read. Soft-gated by
// scroll-completion + dwell. Drawer is a single quiet reading column,
// not a dashboard.

const fwSerif = '"Newsreader", Georgia, serif';
const fwMono  = '"IBM Plex Mono", monospace';

function fwVars(palette = 'warm', theme = 'light') {
  return window.getPalette
    ? window.getPalette(palette, theme)
    : { '--paper': '#faf8f4', '--ink': '#1a1814', '--paper2': '#f1ece2',
        '--muted': 'rgba(26,24,20,0.55)', '--rule': 'rgba(26,24,20,0.12)',
        '--accent': '#c96442' };
}

// Article header (shared)
function FwHeader() {
  return (
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
  );
}

// A small fleuron divider, used to separate panels in the drawer
function Fleuron({ size = 14, ml = 'auto', mr = 'auto' }) {
  return (
    <div style={{ textAlign: 'center', margin: '28px 0',
      color: 'var(--accent)', fontFamily: fwSerif, fontSize: size,
      letterSpacing: '0.6em', marginLeft: ml, marginRight: mr }}>
      ❦
    </div>
  );
}

// ── 1. The opening invitation ────────────────────────────────────────
function WitnessInvite({ palette = 'warm', theme = 'light' }) {
  const vars = fwVars(palette, theme);
  return (
    <div style={{ ...vars, height: '100%', overflow: 'hidden',
      background: 'var(--paper)', color: 'var(--ink)',
      fontFamily: fwSerif, position: 'relative' }}>
      <FwHeader />
      <div style={{ height: '100%', overflowY: 'auto',
        paddingTop: 72, paddingBottom: 80 }}>
        <div style={{ maxWidth: 880, margin: '0 auto', padding: '0 48px' }}>

          {/* Tail of the article — last paragraph + end mark */}
          <section style={{ maxWidth: '54ch', margin: '40px auto 0' }}>
            <div style={{ fontFamily: fwSerif, fontVariant: 'small-caps',
              letterSpacing: '0.32em', fontSize: 11, color: 'var(--accent)',
              marginBottom: 12 }}>§ V · in closing</div>

            <p style={{ margin: '0 0 1em', fontFamily: fwSerif,
              fontSize: 18, lineHeight: 1.7, color: 'var(--ink)' }}>
              The pendulum keeps a kind of time, but not the kind we
              think it does. It is patient with us when we are wrong
              about it, and it does not mind being a metaphor.
              That is more than most instruments can say.
            </p>
            <p style={{ margin: '0 0 1em', fontFamily: fwSerif,
              fontSize: 18, lineHeight: 1.7, color: 'var(--ink)' }}>
              The work is to keep our small angle small. The work is
              to remember what part of the answer was a lie that we
              forgave.
            </p>

            {/* End mark */}
            <div style={{ textAlign: 'center', margin: '32px 0 24px' }}>
              <span style={{ fontFamily: fwSerif, fontSize: 16,
                color: 'var(--accent)', letterSpacing: '0.4em' }}>
                ❦ ❦ ❦
              </span>
            </div>
          </section>

          {/* Colophon — the soft witness invitation has just appeared. */}
          <section style={{ maxWidth: '54ch', margin: '0 auto',
            paddingTop: 22, borderTop: '1px solid var(--rule)' }}>
            <div style={{ fontFamily: fwSerif, fontStyle: 'italic',
              fontSize: 13.5, color: 'var(--muted)', textAlign: 'center',
              lineHeight: 1.65, marginBottom: 18 }}>
              First plate after Galileo, with thanks to a generous
              clockmaker. Set in Newsreader.
              <br />
              Mar 04, 2026 · 14 min · Science · Folio iv
            </div>

            {/* The witness invitation — just appeared, animated in. */}
            <div style={{ marginTop: 22, padding: '18px 22px 16px',
              background: 'var(--paper2)', border: '1px solid var(--rule)',
              borderLeft: '2px solid var(--accent)',
              animation: 'fwFadeIn 0.7s ease' }}>
              <div style={{ display: 'flex', alignItems: 'center',
                gap: 10, marginBottom: 8,
                fontFamily: fwSerif, fontVariant: 'small-caps',
                letterSpacing: '0.3em', fontSize: 10.5,
                color: 'var(--accent)' }}>
                <span style={{ fontSize: 14, letterSpacing: 0 }}>✦</span>
                <span>the witness has opened</span>
              </div>
              <p style={{ margin: '0 0 10px', fontFamily: fwSerif,
                fontStyle: 'italic', fontSize: 17, lineHeight: 1.55,
                color: 'var(--ink)' }}>
                You finished the essay. Twenty-four other readers
                finished it before you. If you are curious what they
                marked, you may now look.
              </p>
              <div style={{ display: 'flex', alignItems: 'baseline',
                gap: 18, fontFamily: fwSerif, fontSize: 13.5 }}>
                <a href="#" style={{ color: 'var(--accent)',
                  fontStyle: 'italic',
                  borderBottom: '1px solid var(--accent)',
                  textDecoration: 'none' }}>
                  open the witness drawer →
                </a>
                <a href="#" style={{ color: 'var(--muted)',
                  fontStyle: 'italic',
                  textDecoration: 'none' }}>
                  not this time
                </a>
              </div>
            </div>

            <div style={{ marginTop: 22, fontFamily: fwSerif,
              fontStyle: 'italic', fontSize: 12, color: 'var(--muted)',
              textAlign: 'center' }}>
              The drawer was hidden until you finished. So is everyone else's.
            </div>
          </section>
        </div>
      </div>
      <style>{`@keyframes fwFadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }`}</style>
    </div>
  );
}

// ── retention sparkline ──────────────────────────────────────────────
// A hair-thin path showing % of witnesses still reading at each scroll
// position. Not a chart — a typesetter's mark.
function RetentionRule({ width = 540, height = 46 }) {
  // 12 datapoints — starts at 1.0, drops with shape
  const data = [1.0, 0.98, 0.95, 0.91, 0.84, 0.78, 0.72, 0.66, 0.62, 0.58, 0.54, 0.50];
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - 4 - v * (height - 8);
    return [x, y];
  });
  const path = pts.map((p, i) => (i === 0 ? `M${p[0]} ${p[1]}` : `L${p[0]} ${p[1]}`)).join(' ');
  // brush position — where most stopped (smallest derivative, ~ index 4-5)
  const brushIdx = 5;
  const brushX = (brushIdx / (data.length - 1)) * width;
  const brushY = height - 4 - data[brushIdx] * (height - 8);

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <svg viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        style={{ width: '100%', height,
          display: 'block', overflow: 'visible' }}>
        {/* baseline rule */}
        <line x1="0" y1={height - 4} x2={width} y2={height - 4}
          stroke="var(--rule)" strokeWidth="1" />
        {/* retention path */}
        <path d={path} stroke="var(--accent)" strokeWidth="1"
          fill="none" />
        {/* fill below path, very faint */}
        <path d={`${path} L${width} ${height - 4} L0 ${height - 4} Z`}
          fill="var(--accent)" opacity="0.06" />
        {/* the brush — where most stopped */}
        <line x1={brushX} y1={brushY - 6} x2={brushX} y2={height - 4 + 4}
          stroke="var(--accent)" strokeWidth="1" />
        <circle cx={brushX} cy={brushY} r="3" fill="var(--accent)" />
      </svg>
      <div style={{ display: 'flex', justifyContent: 'space-between',
        marginTop: 6, fontFamily: fwSerif, fontVariant: 'small-caps',
        letterSpacing: '0.22em', fontSize: 9.5, color: 'var(--muted)' }}>
        <span>the opening</span>
        <span style={{ fontStyle: 'italic', fontVariant: 'normal',
          letterSpacing: 0, fontSize: 11.5, color: 'var(--accent)' }}>
          most stopped near § iii
        </span>
        <span>end mark</span>
      </div>
    </div>
  );
}

// ── reaction ribbons — typesetter's tally marks ─────────────────────
function ReactionRibbon({ label, count, total, hue = 'accent' }) {
  const pct = count / total;
  return (
    <div style={{ display: 'grid',
      gridTemplateColumns: '110px 1fr 50px',
      gap: 14, alignItems: 'center', padding: '8px 0' }}>
      <span style={{ fontFamily: fwSerif, fontVariant: 'small-caps',
        letterSpacing: '0.22em', fontSize: 11, color: 'var(--muted)' }}>
        {label}
      </span>
      <div style={{ position: 'relative', height: 12 }}>
        <div style={{ position: 'absolute', inset: 0,
          borderTop: '1px solid var(--rule)',
          borderBottom: '1px solid var(--rule)' }} />
        {/* tally marks — one short hair line per reaction */}
        <div style={{ position: 'absolute', left: 0, right: 0, top: 1, bottom: 1,
          display: 'flex', gap: 2, alignItems: 'center' }}>
          {Array.from({ length: count }).map((_, i) => (
            <span key={i} style={{
              width: 1, height: 8, background: 'var(--accent)',
              opacity: hue === 'muted' ? 0.5 : 1 }} />
          ))}
        </div>
      </div>
      <span style={{ fontFamily: fwSerif, fontStyle: 'italic',
        fontSize: 13, color: 'var(--ink)', textAlign: 'right' }}>
        {count}
      </span>
    </div>
  );
}

// ── 2. The drawer open ───────────────────────────────────────────────
function WitnessDrawer({ palette = 'warm', theme = 'light' }) {
  const vars = fwVars(palette, theme);

  const passages = [
    { count: 18, dom: 'kept',
      text: 'It does not behave the way you think it ought to. The two are subtly different, and the difference is the entire reason we build instruments.' },
    { count: 12, dom: 'kept',
      text: 'A pendulum is a scientific instrument and a small philosophy lesson.' },
    { count: 9, dom: 'confused',
      text: 'The honest equation is messier, and an honest pendulum keeps slightly worse time at large amplitude.' },
    { count: 7, dom: 'surprised',
      text: 'It is patient with us when we are wrong about it, and it does not mind being a metaphor.' },
    { count: 5, dom: 'disagreed',
      text: 'The work is to remember what part of the answer was a lie that we forgave.' },
  ];

  const letters = [
    { ts: 'Mar 18, 14:02', text: 'I read this on a long bus ride and now I have to find a pendulum.' },
    { ts: 'Mar 12, 22:41', text: 'The phrase “a lie that we forgave” is going to live with me.' },
    { ts: 'Mar 06, 08:17', text: 'The §III maths lost me, but I came back the next morning and got it.' },
  ];

  const reactionMap = { kept: 'kept', confused: 'confused',
    surprised: 'surprised', disagreed: 'disagreed' };

  return (
    <div style={{ ...vars, height: '100%', overflow: 'hidden',
      background: 'var(--paper)', color: 'var(--ink)',
      fontFamily: fwSerif, position: 'relative' }}>
      <FwHeader />

      {/* Faded article body underneath, suggests where the drawer lives */}
      <div style={{ position: 'absolute', inset: '72px 0 0',
        opacity: 0.32, pointerEvents: 'none',
        padding: '0 48px',
        display: 'flex', justifyContent: 'flex-start' }}>
        <div style={{ maxWidth: 540, paddingTop: 30 }}>
          <div style={{ fontFamily: fwSerif, fontVariant: 'small-caps',
            letterSpacing: '0.32em', fontSize: 11,
            color: 'var(--accent)', marginBottom: 12 }}>
            § V · in closing
          </div>
          <p style={{ fontSize: 18, lineHeight: 1.7,
            color: 'var(--ink)' }}>
            The pendulum keeps a kind of time, but not the kind we
            think it does. It is patient with us when we are wrong
            about it, and it does not mind being a metaphor.
            That is more than most instruments can say.
          </p>
        </div>
      </div>

      {/* The drawer itself — slid in from the right */}
      <aside style={{ position: 'absolute',
        top: 72, right: 0, bottom: 0,
        width: 'min(560px, 60%)',
        background: 'var(--paper)',
        borderLeft: '1px solid var(--rule)',
        boxShadow: '-12px 0 32px rgba(0,0,0,0.04)',
        display: 'flex', flexDirection: 'column',
        animation: 'fwSlide 0.5s cubic-bezier(0.2, 0.7, 0.2, 1)' }}>

        {/* drawer header */}
        <div style={{ padding: '20px 32px 16px',
          borderBottom: '1px solid var(--rule)',
          display: 'flex', alignItems: 'baseline',
          justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontFamily: fwSerif, fontVariant: 'small-caps',
              letterSpacing: '0.3em', fontSize: 10.5,
              color: 'var(--accent)', marginBottom: 4 }}>
              ✦ the witness
            </div>
            <div style={{ fontFamily: fwSerif, fontStyle: 'italic',
              fontSize: 14, color: 'var(--muted)',
              letterSpacing: '-0.005em' }}>
              On the patience of pendulums
            </div>
          </div>
          <button aria-label="close drawer"
            style={{ background: 'transparent', border: 'none',
            cursor: 'pointer', color: 'var(--muted)',
            fontFamily: fwSerif, fontSize: 20, lineHeight: 1,
            padding: 4 }}>
            ✕
          </button>
        </div>

        {/* drawer body — single reading column */}
        <div style={{ flex: 1, overflowY: 'auto',
          padding: '28px 32px 32px' }}>

          {/* PANEL 1 — headline count */}
          <div>
            <div style={{ fontFamily: fwSerif, fontStyle: 'italic',
              fontSize: 19, lineHeight: 1.45, color: 'var(--ink)',
              letterSpacing: '-0.01em' }}>
              <span style={{ fontFamily: fwSerif, fontWeight: 500,
                fontStyle: 'normal', fontSize: 28,
                color: 'var(--accent)', marginRight: 4 }}>
                24
              </span>
              readers finished this. Their marks, below.
            </div>
          </div>

          <Fleuron />

          {/* PANEL 2 — the people's pull-quote */}
          <div>
            <div style={{ fontFamily: fwSerif, fontVariant: 'small-caps',
              letterSpacing: '0.3em', fontSize: 10,
              color: 'var(--muted)', marginBottom: 14, textAlign: 'center' }}>
              the people's pull-quote
            </div>
            <blockquote style={{ margin: 0, padding: '0 12px',
              borderLeft: '2px solid var(--accent)',
              fontFamily: fwSerif, fontStyle: 'italic', fontSize: 21,
              lineHeight: 1.4, color: 'var(--ink)',
              letterSpacing: '-0.005em' }}>
              “It does not behave the way you think it ought to.
              The two are subtly different, and the difference is
              the entire reason we build instruments.”
            </blockquote>
            <div style={{ marginTop: 10, paddingLeft: 14,
              fontFamily: fwSerif, fontVariant: 'small-caps',
              letterSpacing: '0.22em', fontSize: 10,
              color: 'var(--muted)' }}>
              Most quoted · 18 of 24 readers · § ii
            </div>
          </div>

          <Fleuron />

          {/* PANEL 3 — retention curve */}
          <div>
            <div style={{ fontFamily: fwSerif, fontVariant: 'small-caps',
              letterSpacing: '0.3em', fontSize: 10,
              color: 'var(--muted)', marginBottom: 14, textAlign: 'center' }}>
              attention, end-to-end
            </div>
            <RetentionRule />
            <div style={{ marginTop: 12, fontFamily: fwSerif,
              fontStyle: 'italic', fontSize: 13,
              lineHeight: 1.55, color: 'var(--muted)',
              textAlign: 'center', maxWidth: '40ch',
              marginInline: 'auto' }}>
              Most readers slowed near the start of § iii — the
              first equation. You may want to reread it.
            </div>
          </div>

          <Fleuron />

          {/* PANEL 4 — witnessed passages */}
          <div>
            <div style={{ fontFamily: fwSerif, fontVariant: 'small-caps',
              letterSpacing: '0.3em', fontSize: 10,
              color: 'var(--muted)', marginBottom: 14, textAlign: 'center' }}>
              what readers underlined
            </div>
            <ol style={{ listStyle: 'none', margin: 0, padding: 0,
              display: 'flex', flexDirection: 'column', gap: 18 }}>
              {passages.map((p, i) => (
                <li key={i} style={{
                  paddingBottom: 16,
                  borderBottom: i < passages.length - 1 ? '1px solid var(--rule)' : 'none' }}>
                  <p style={{ margin: '0 0 8px', fontFamily: fwSerif,
                    fontSize: 16, lineHeight: 1.55, color: 'var(--ink)',
                    fontStyle: 'italic',
                    borderLeft: '1px solid var(--accent)',
                    paddingLeft: 12 }}>
                    {p.text}
                  </p>
                  <div style={{ display: 'flex', gap: 12,
                    paddingLeft: 13, fontFamily: fwSerif,
                    fontVariant: 'small-caps',
                    letterSpacing: '0.2em', fontSize: 10,
                    color: 'var(--muted)' }}>
                    <span>{p.count} readers</span>
                    <span>·</span>
                    <span style={{ color: 'var(--accent)',
                      fontStyle: 'italic', fontVariant: 'normal',
                      letterSpacing: 0, fontSize: 11.5 }}>
                      mostly {reactionMap[p.dom]}
                    </span>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <Fleuron />

          {/* PANEL 5 — reaction ribbons */}
          <div>
            <div style={{ fontFamily: fwSerif, fontVariant: 'small-caps',
              letterSpacing: '0.3em', fontSize: 10,
              color: 'var(--muted)', marginBottom: 14, textAlign: 'center' }}>
              how readers felt
            </div>
            <ReactionRibbon label="kept"      count={37} total={64} />
            <ReactionRibbon label="surprised" count={14} total={64} />
            <ReactionRibbon label="confused"  count={9}  total={64} hue="muted" />
            <ReactionRibbon label="disagreed" count={4}  total={64} hue="muted" />
            <div style={{ marginTop: 10, fontFamily: fwSerif,
              fontStyle: 'italic', fontSize: 11.5,
              color: 'var(--muted)', textAlign: 'right' }}>
              64 reactions across 24 readers
            </div>
          </div>

          <Fleuron />

          {/* PANEL 6 — letters */}
          <div>
            <div style={{ fontFamily: fwSerif, fontVariant: 'small-caps',
              letterSpacing: '0.3em', fontSize: 10,
              color: 'var(--muted)', marginBottom: 14, textAlign: 'center' }}>
              one-line letters
            </div>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0,
              display: 'flex', flexDirection: 'column', gap: 14 }}>
              {letters.map((l, i) => (
                <li key={i} style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr auto',
                  gap: 14, alignItems: 'baseline',
                  paddingBottom: 12,
                  borderBottom: i < letters.length - 1 ? '1px solid var(--rule)' : 'none' }}>
                  <p style={{ margin: 0, fontFamily: fwSerif,
                    fontStyle: 'italic', fontSize: 15.5,
                    lineHeight: 1.55, color: 'var(--ink)',
                    letterSpacing: '-0.005em' }}>
                    “{l.text}”
                  </p>
                  <span style={{ fontFamily: fwSerif,
                    fontVariant: 'small-caps',
                    letterSpacing: '0.18em', fontSize: 9.5,
                    color: 'var(--muted)', whiteSpace: 'nowrap' }}>
                    {l.ts}
                  </span>
                </li>
              ))}
            </ul>
            <div style={{ marginTop: 10, fontFamily: fwSerif,
              fontStyle: 'italic', fontSize: 11.5,
              color: 'var(--muted)', textAlign: 'right' }}>
              shown anonymously · 21 unread
            </div>
          </div>

          <Fleuron />

          {/* Footer — join state */}
          <div style={{ paddingTop: 14, borderTop: '1px solid var(--rule)',
            textAlign: 'center' }}>
            <p style={{ margin: '0 0 8px', fontFamily: fwSerif,
              fontStyle: 'italic', fontSize: 13.5, color: 'var(--muted)',
              maxWidth: '36ch', marginInline: 'auto', lineHeight: 1.6 }}>
              You have shared <span style={{ color: 'var(--accent)',
                fontWeight: 500 }}>4 marks</span> with the witness.
              Each one was your choice.
            </p>
            <a href="#" style={{ fontFamily: fwSerif,
              fontStyle: 'italic', fontSize: 12.5,
              color: 'var(--muted)',
              textDecoration: 'none',
              borderBottom: '1px solid var(--rule)' }}>
              manage what you've shared
            </a>
          </div>
        </div>
      </aside>

      <style>{`@keyframes fwSlide { from { transform: translateX(100%); } to { transform: none; } }`}</style>
    </div>
  );
}

// ── 3. The "share with the witness?" consent moment ─────────────────
function WitnessConsent({ palette = 'warm', theme = 'light' }) {
  const vars = fwVars(palette, theme);
  return (
    <div style={{ ...vars, height: '100%', overflow: 'hidden',
      background: 'var(--paper)', color: 'var(--ink)',
      fontFamily: fwSerif, position: 'relative' }}>
      <FwHeader />
      <div style={{ height: '100%', overflowY: 'auto',
        paddingTop: 72, paddingBottom: 80 }}>
        <div style={{ maxWidth: 880, margin: '0 auto', padding: '0 48px' }}>

          <section style={{ padding: '36px 0 16px', textAlign: 'center' }}>
            <div style={{ fontFamily: fwMono, fontSize: 11,
              letterSpacing: 0.8, textTransform: 'uppercase',
              color: 'var(--muted)', marginBottom: 14 }}>
              Science · Folio iv · Mar 04, 2026
            </div>
            <h1 style={{ fontFamily: fwSerif, fontWeight: 500,
              fontSize: 'clamp(2.4em, 4.6vw, 3.2em)', lineHeight: 1.05,
              margin: 0, letterSpacing: '-0.02em',
              maxWidth: '20ch', marginInline: 'auto' }}>
              On the patience of pendulums
            </h1>
          </section>

          <section style={{ maxWidth: '54ch', margin: '24px auto 0',
            position: 'relative' }}>
            <div style={{ fontFamily: fwSerif, fontVariant: 'small-caps',
              letterSpacing: '0.32em', fontSize: 11, color: 'var(--accent)',
              marginBottom: 12 }}>§ II · a first model</div>

            <p style={{ margin: '0 0 1em', fontFamily: fwSerif,
              fontSize: 18, lineHeight: 1.7, color: 'var(--ink)' }}>
              The first model of a pendulum that anyone teaches you is
              a small lie.
            </p>

            {/* The just-underlined passage + the consent chip */}
            <p style={{ margin: '0 0 1em', fontFamily: fwSerif,
              fontSize: 18, lineHeight: 1.7, color: 'var(--ink)',
              position: 'relative' }}>
              When you write the equation down, the period of the swing
              turns out to depend only on the length of the string and
              the strength of gravity.{' '}
              <span style={{
                background: 'var(--paper2)',
                borderBottom: '2px solid var(--accent)',
                padding: '0 1px',
                boxShadow: 'inset 0 -3px 0 var(--paper2)' }}>
                It does not depend, at first glance, on how hard you
                pushed it. This is the result that makes pendulum
                clocks possible.
              </span>

              {/* The consent chip — slides in to the right of the line */}
              <span style={{ position: 'absolute',
                right: -240, top: 50, width: 220,
                padding: '12px 14px',
                background: 'var(--paper)',
                border: '1px solid var(--rule)',
                borderLeft: '2px solid var(--accent)',
                boxShadow: '0 6px 18px rgba(0,0,0,0.06)',
                animation: 'fwChip 0.5s cubic-bezier(0.2, 0.7, 0.2, 1)' }}>
                <div style={{ fontFamily: fwSerif,
                  fontVariant: 'small-caps', letterSpacing: '0.22em',
                  fontSize: 9.5, color: 'var(--accent)',
                  marginBottom: 6 }}>
                  ✦ kept · underlined
                </div>
                <p style={{ margin: '0 0 10px', fontFamily: fwSerif,
                  fontStyle: 'italic', fontSize: 13,
                  lineHeight: 1.45, color: 'var(--ink)' }}>
                  share with the witness?
                </p>
                <div style={{ display: 'flex',
                  alignItems: 'center', gap: 10,
                  fontFamily: fwSerif, fontSize: 12.5 }}>
                  <button style={{ padding: '4px 10px',
                    background: 'var(--accent)', color: 'var(--paper)',
                    border: 'none', cursor: 'pointer',
                    fontFamily: fwSerif, fontStyle: 'italic',
                    fontSize: 12.5 }}>
                    yes, share
                  </button>
                  <button style={{ padding: '4px 6px',
                    background: 'transparent', color: 'var(--muted)',
                    border: 'none', cursor: 'pointer',
                    fontFamily: fwSerif, fontStyle: 'italic',
                    fontSize: 12.5,
                    borderBottom: '1px solid var(--rule)' }}>
                    not this one
                  </button>
                </div>
                <div style={{ marginTop: 10, paddingTop: 8,
                  borderTop: '1px solid var(--rule)',
                  fontFamily: fwSerif, fontStyle: 'italic',
                  fontSize: 10.5, color: 'var(--muted)',
                  lineHeight: 1.5 }}>
                  3 readers underlined this too. Counts only — never
                  who you are.
                </div>
                <a href="#" style={{ display: 'inline-block',
                  marginTop: 8, fontFamily: fwSerif, fontSize: 10,
                  fontVariant: 'small-caps', letterSpacing: '0.22em',
                  color: 'var(--muted)', textDecoration: 'none' }}>
                  always share my marks · settings
                </a>
              </span>
            </p>
            <p style={{ margin: '0 0 1em', fontFamily: fwSerif,
              fontSize: 18, lineHeight: 1.7, color: 'var(--ink)',
              opacity: 0.5 }}>
              But the small lie has a tail. If you swing it harder, the
              period does change — by a few percent at first, then more.
            </p>
          </section>
        </div>
      </div>
      <style>{`@keyframes fwChip { from { opacity: 0; transform: translate(-6px, 0); } to { opacity: 1; transform: none; } }`}</style>
    </div>
  );
}

Object.assign(window, { WitnessInvite, WitnessDrawer, WitnessConsent });
