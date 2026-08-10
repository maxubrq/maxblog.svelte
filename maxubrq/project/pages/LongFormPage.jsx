// LongFormPage.jsx — the 8,000+ word treatment.
//
// Same book vocabulary as ArticlePage, turned up:
//   1. Front matter card  — colophon-style "front of the book" panel
//   2. Movements          — named, with their own title page + abstract
//   3. Journey rail       — vertical rail of all movements in the right margin
//   4. Recurrence marks   — (↑II) inline back-references to first mention
//   5. Pulse              — single italic line at each movement's close
//   6. Interlude          — a pause page near the middle, no body text
//   7. Resumption banner  — book-marked re-entry with sentence + minutes
//   8. Personal index     — "What you marked in this piece" at the end
//
// One scroller inside a tall artboard. All eight moves visible by scrolling.

const { useState: useStateLF, useEffect: useEffectLF, useRef: useRefLF, useMemo: useMemoLF } = React;

// ── Movement data ────────────────────────────────────────────────────
const MOVEMENTS = [
  { num: 'I',   roman: 'i',   title: 'A weight on a string',
    abstract: 'In which Galileo watches a chandelier, and a question is mistaken for an answer.',
    min: 6 },
  { num: 'II',  roman: 'ii',  title: 'The pendulum',
    abstract: 'In which the equation appears, behaves itself, and then refuses to.',
    min: 9 },
  { num: 'III', roman: 'iii', title: 'When the small angle breaks',
    abstract: 'In which a thirty-degree push is enough to undo a clock, and the lie at the heart of every approximation is named.',
    min: 8 },
  { num: 'IV',  roman: 'iv',  title: 'Lyapunov, or: the horizon',
    abstract: 'In which two identical pendulums part company, and the word forecast loses its meaning.',
    min: 7 },
  { num: 'V',   roman: 'v',   title: 'The grief of a periodic function',
    abstract: 'In which the argument turns home, and the equation is asked to do a thing it cannot.',
    min: 2 },
];

const TOTAL_WORDS = 8240;
const TOTAL_MIN = MOVEMENTS.reduce((a, m) => a + m.min, 0);

// ── Recurrence mark — (↑II) with hover preview of first mention ──────
function Recur({ to, first, children }) {
  const [show, setShow] = useStateLF(false);
  return (
    <span style={{ position: 'relative' }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}>
      <span style={{ borderBottom: show ? '1px dotted var(--accent)' : '1px dotted transparent',
        transition: 'border-color 0.15s' }}>{children}</span>
      <a href={`#mvt-${to}`} style={{
        fontFamily: 'var(--serif)', fontSize: '0.72em',
        color: 'var(--accent)', textDecoration: 'none',
        marginLeft: 2, fontStyle: 'normal',
        fontVariantNumeric: 'oldstyle-nums',
        verticalAlign: '0.3em', letterSpacing: 0.2, cursor: 'pointer',
      }}>
        (↑{to})
      </a>
      {show && first && (
        <span style={{ position: 'absolute', bottom: 'calc(100% + 10px)', left: 0,
          zIndex: 30, minWidth: 320, maxWidth: 380,
          background: 'var(--paper)', border: '1px solid var(--rule)',
          padding: '14px 18px 12px',
          boxShadow: '0 8px 28px rgba(0,0,0,0.12)',
          fontFamily: 'var(--serif)', textAlign: 'left',
          fontStyle: 'normal', textIndent: 0 }}>
          <span style={{ display: 'block', fontVariant: 'small-caps',
            letterSpacing: '0.24em', fontSize: 9.5, color: 'var(--accent)',
            marginBottom: 8 }}>
            You met this in Movement {to}
          </span>
          <span style={{ display: 'block', fontFamily: 'var(--serif)',
            fontStyle: 'italic', fontSize: 13.5, lineHeight: 1.55,
            color: 'var(--ink)' }}>
            &ldquo;{first}&rdquo;
          </span>
          <span style={{ display: 'block', marginTop: 10,
            fontFamily: 'var(--serif)', fontVariant: 'small-caps',
            letterSpacing: '0.22em', fontSize: 9.5, color: 'var(--muted)',
            textAlign: 'right' }}>
            jump back ↑
          </span>
        </span>
      )}
    </span>
  );
}

// ── Front matter card ────────────────────────────────────────────────
function FrontMatter({ serif, hasResumption }) {
  return (
    <section style={{ margin: '1.4em auto 2em', maxWidth: '34em' }}>
      {/* Volume tag */}
      <div style={{ textAlign: 'center', fontFamily: serif,
        fontVariant: 'small-caps', letterSpacing: '0.4em', fontSize: 11,
        color: 'var(--muted)', marginBottom: 28 }}>
        Maxubrq · Volume the Third · 14 — 17 April MMXXVI
      </div>

      {/* Double rule */}
      <div style={{ borderTop: '1px solid var(--rule)',
        borderBottom: '1px solid var(--rule)', height: 4, marginBottom: 36 }} />

      {/* Title */}
      <h1 style={{ fontFamily: serif, fontWeight: 500, textAlign: 'center',
        fontSize: '2.6em', lineHeight: 1.08, letterSpacing: '-0.018em',
        margin: '0 0 0.45em' }}>
        On Grief, &amp; the
        <br />
        <span style={{ fontStyle: 'italic', fontWeight: 400 }}>Periodic Function</span>
      </h1>

      {/* Subtitle */}
      <div style={{ textAlign: 'center', fontFamily: serif,
        fontVariant: 'small-caps', letterSpacing: '0.28em',
        fontSize: 11.5, color: 'var(--muted)', margin: '6px 0 36px' }}>
        being a long consideration of determinism
        <br />
        and that which lies beyond it
      </div>

      {/* Colophon block — the front-matter card proper */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr',
        gap: '14px 36px', maxWidth: 460, margin: '0 auto 28px',
        fontFamily: serif, fontSize: 12.5, lineHeight: 1.7,
        color: 'var(--ink)' }}>
        {[
          ['Length',      <span><span style={{ fontVariantNumeric: 'oldstyle-nums' }}>8,240</span> words</span>],
          ['Pace',        <span><span style={{ fontVariantNumeric: 'oldstyle-nums' }}>32</span> minutes, unhurried</span>],
          ['Shape',       <span><span style={{ fontVariantNumeric: 'oldstyle-nums' }}>5</span> movements, <span style={{ fontVariantNumeric: 'oldstyle-nums' }}>1</span> plate</span>],
          ['Apparatus',   <span><span style={{ fontVariantNumeric: 'oldstyle-nums' }}>18</span> footnotes, <span style={{ fontVariantNumeric: 'oldstyle-nums' }}>6</span> margin notes</span>],
          ['Written',     'Nov 2025 — Feb 2026'],
          ['First read by',  <span><span style={{ fontVariantNumeric: 'oldstyle-nums' }}>3</span> friends</span>],
        ].map(([k, v], i) => (
          <div key={i} style={{ display: 'grid',
            gridTemplateColumns: '90px 1fr', columnGap: 10, alignItems: 'baseline' }}>
            <span style={{ fontVariant: 'small-caps', letterSpacing: '0.2em',
              fontSize: 10, color: 'var(--muted)', textAlign: 'right' }}>{k}</span>
            <span style={{ fontStyle: 'italic' }}>{v}</span>
          </div>
        ))}
      </div>

      {/* Thesis */}
      <div style={{ textAlign: 'center', margin: '34px auto 0', maxWidth: '32em' }}>
        <div style={{ fontFamily: serif, fontVariant: 'small-caps',
          letterSpacing: '0.32em', fontSize: 10.5, color: 'var(--muted)',
          marginBottom: 14 }}>The argument</div>
        <p style={{ fontFamily: serif, fontStyle: 'italic', fontSize: 17,
          lineHeight: 1.55, margin: 0, color: 'var(--ink)',
          letterSpacing: '-0.003em' }}>
          Determinism gives the equation. Grief, like a pendulum, has a horizon —
          a point past which the equation is true but useless. This essay is an
          attempt to live there.
        </p>
      </div>

      {/* End rule */}
      <div style={{ width: 60, height: 1, background: 'var(--rule)',
        margin: '32px auto 0' }} />
    </section>
  );
}

// ── Resumption banner (#7) — sits ABOVE front matter ─────────────────
function ResumptionBanner({ serif, dismiss }) {
  return (
    <div style={{ background: 'var(--paper2)', border: '1px solid var(--rule)',
      padding: '18px 22px', margin: '8px 0 28px',
      display: 'grid', gridTemplateColumns: '1fr auto', gap: 24,
      alignItems: 'center', fontFamily: serif }}>
      <div>
        <div style={{ fontVariant: 'small-caps', letterSpacing: '0.28em',
          fontSize: 10, color: 'var(--accent)', marginBottom: 8 }}>
          You were here · 2 days ago
        </div>
        <div style={{ fontSize: 14.5, color: 'var(--ink)', lineHeight: 1.55 }}>
          You were <span style={{ fontStyle: 'italic' }}>seven minutes</span> into
          Movement III · <span style={{ fontStyle: 'italic' }}>When the small angle breaks</span>.
          The previous sentence ended:
          <span style={{ display: 'block', marginTop: 6, paddingLeft: 16,
            borderLeft: '2px solid var(--accent)', color: 'var(--muted)',
            fontStyle: 'italic' }}>
            “…and the air, very slightly, fights back.”
          </span>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10,
        alignItems: 'flex-end' }}>
        <a href="#mvt-III" style={{ fontFamily: serif, fontVariant: 'small-caps',
          letterSpacing: '0.25em', fontSize: 10.5, color: 'var(--ink)',
          borderBottom: '1px solid var(--ink)', textDecoration: 'none',
          paddingBottom: 2 }}>
          take me back
        </a>
        <button onClick={dismiss} style={{ background: 'transparent', border: 'none',
          fontFamily: serif, fontStyle: 'italic', fontSize: 11,
          color: 'var(--muted)', cursor: 'pointer', padding: 0 }}>
          start over
        </button>
      </div>
    </div>
  );
}

// ── Movement title page ──────────────────────────────────────────────
function MovementOpener({ m, serif }) {
  return (
    <section id={`mvt-${m.num}`} style={{ margin: '4.4em 0 2.4em',
      textAlign: 'center', position: 'relative' }}>
      <div style={{ fontFamily: serif, fontVariant: 'small-caps',
        letterSpacing: '0.4em', fontSize: 10.5, color: 'var(--muted)',
        marginBottom: 16 }}>
        Movement the {m.roman === 'i' ? 'First' : m.roman === 'ii' ? 'Second' :
                       m.roman === 'iii' ? 'Third' : m.roman === 'iv' ? 'Fourth' : 'Fifth'}
      </div>

      {/* Roman numeral as ornament */}
      <div style={{ fontFamily: serif, fontStyle: 'italic',
        fontSize: 44, lineHeight: 1, color: 'var(--accent)',
        fontVariantNumeric: 'oldstyle-nums', marginBottom: 22,
        opacity: 0.85 }}>
        {m.roman}.
      </div>

      <h2 style={{ fontFamily: serif, fontWeight: 500, fontSize: '1.85em',
        lineHeight: 1.18, letterSpacing: '-0.01em', margin: '0 0 18px',
        fontStyle: 'italic' }}>
        {m.title}
      </h2>

      <div style={{ fontFamily: serif, fontStyle: 'italic',
        fontSize: 14.5, color: 'var(--muted)', maxWidth: '36ch',
        margin: '0 auto 22px', lineHeight: 1.55 }}>
        {m.abstract}
      </div>

      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 16,
        fontFamily: serif, fontVariant: 'small-caps', letterSpacing: '0.22em',
        fontSize: 10, color: 'var(--muted)' }}>
        <span style={{ width: 24, height: 1, background: 'var(--rule)' }} />
        <span style={{ fontVariantNumeric: 'oldstyle-nums', letterSpacing: 0,
          fontVariant: 'normal', fontStyle: 'italic' }}>{m.min} min</span>
        <span style={{ width: 24, height: 1, background: 'var(--rule)' }} />
      </div>
    </section>
  );
}

// ── End-of-movement pulse ────────────────────────────────────────────
function MovementPulse({ next, serif }) {
  return (
    <div style={{ textAlign: 'center', margin: '2.4em 0 1.4em' }}>
      <div style={{ fontFamily: serif, fontStyle: 'italic',
        fontSize: 14, lineHeight: 1.5, color: 'var(--muted)',
        maxWidth: '40ch', margin: '0 auto' }}>
        {next}
      </div>
      <div style={{ textAlign: 'center', margin: '1.6em 0', color: 'var(--rule)',
        fontFamily: serif, fontSize: 18, letterSpacing: '0.8em' }}>❦</div>
    </div>
  );
}

// ── Interlude — pause page ───────────────────────────────────────────
function Interlude({ serif }) {
  return (
    <section style={{ margin: '4em -40px',
      padding: '90px 60px',
      background: 'var(--paper2)',
      borderTop: '1px solid var(--rule)',
      borderBottom: '1px solid var(--rule)',
      textAlign: 'center', position: 'relative' }}>
      <div style={{ fontFamily: serif, fontVariant: 'small-caps',
        letterSpacing: '0.38em', fontSize: 10.5, color: 'var(--muted)',
        marginBottom: 32 }}>Interlude</div>

      <div style={{ fontFamily: serif, fontStyle: 'italic',
        fontSize: 26, lineHeight: 1.4, color: 'var(--ink)',
        maxWidth: '22ch', margin: '0 auto', letterSpacing: '-0.005em' }}>
        Halfway. The argument so far is that an equation can be true and useless
        at the same time. The rest is what to do about it.
      </div>

      <div style={{ width: 36, height: 1, background: 'var(--rule)',
        margin: '40px auto 32px' }} />

      <div style={{ fontFamily: serif, fontStyle: 'italic',
        fontSize: 13, color: 'var(--muted)' }}>
        Good place to stop. The piece will keep your spot.
      </div>

      <div style={{ display: 'inline-flex', gap: 28, marginTop: 18,
        fontFamily: serif, fontVariant: 'small-caps',
        letterSpacing: '0.24em', fontSize: 10, color: 'var(--muted)' }}>
        <button style={{ background: 'transparent', border: 'none',
          color: 'var(--ink)', borderBottom: '1px solid var(--ink)',
          fontFamily: 'inherit', fontVariant: 'inherit',
          letterSpacing: 'inherit', fontSize: 'inherit',
          padding: '2px 0', cursor: 'pointer' }}>
          mark this spot
        </button>
        <button style={{ background: 'transparent', border: 'none',
          color: 'var(--muted)', fontFamily: 'inherit', fontVariant: 'inherit',
          letterSpacing: 'inherit', fontSize: 'inherit', padding: 0,
          cursor: 'pointer' }}>
          carry on ↓
        </button>
      </div>
    </section>
  );
}

// ── Personal index ───────────────────────────────────────────────────
function PersonalIndex({ serif }) {
  const marks = [
    { kind: 'highlight', mvt: 'I',   text: 'the period barely depends on how far you pull it' },
    { kind: 'highlight', mvt: 'II',  text: 'the sine is the interesting character in the sentence' },
    { kind: 'note',      mvt: 'II',  text: 'remind me of harmonic motion lectures — Prof. Lê' },
    { kind: 'reaction',  mvt: 'III', text: 'confused — what does "phase space" mean here?' },
    { kind: 'highlight', mvt: 'III', text: 'Two identical double pendulums, started from angles that differ by a thousandth of a degree, will be in entirely different places a minute later.' },
    { kind: 'highlight', mvt: 'IV',  text: 'Double the precision of your measurement and you buy a fixed amount of time.' },
    { kind: 'note',      mvt: 'IV',  text: 'this is the sentence I will quote to D.' },
    { kind: 'reaction',  mvt: 'V',   text: 'resonant — the closing image is exactly right' },
  ];
  const KIND = {
    highlight: { label: 'underlined',  glyph: '▮' },
    note:      { label: 'noted',       glyph: '✎' },
    reaction:  { label: 'reacted',     glyph: '✦' },
  };

  return (
    <section style={{ margin: '3.8em 0 0', paddingTop: 30,
      borderTop: '1px solid var(--rule)' }}>
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <div style={{ fontFamily: serif, fontVariant: 'small-caps',
          letterSpacing: '0.36em', fontSize: 10.5, color: 'var(--muted)',
          marginBottom: 10 }}>What you marked in this piece</div>
        <div style={{ fontFamily: serif, fontStyle: 'italic',
          fontSize: 12.5, color: 'var(--muted)' }}>
          your trail, in reading order — private to you
        </div>
      </div>

      <div style={{ display: 'grid', gap: 0 }}>
        {marks.map((m, i) => (
          <div key={i} style={{ display: 'grid',
            gridTemplateColumns: '52px 90px 1fr',
            gap: 18, alignItems: 'baseline',
            padding: '14px 0',
            borderBottom: i < marks.length - 1 ? '1px solid var(--rule)' : 'none' }}>

            <div style={{ fontFamily: serif, fontVariant: 'small-caps',
              letterSpacing: '0.2em', fontSize: 10,
              color: 'var(--accent)', textAlign: 'right' }}>
              § {m.mvt}
            </div>

            <div style={{ display: 'flex', gap: 8, alignItems: 'baseline',
              fontFamily: serif, fontVariant: 'small-caps',
              letterSpacing: '0.18em', fontSize: 10, color: 'var(--muted)' }}>
              <span style={{ color: 'var(--accent)', fontVariant: 'normal',
                letterSpacing: 0, fontSize: 12 }}>{KIND[m.kind].glyph}</span>
              <span>{KIND[m.kind].label}</span>
            </div>

            <div style={{ fontFamily: serif, fontSize: 15,
              lineHeight: 1.6, color: 'var(--ink)',
              fontStyle: m.kind === 'note' || m.kind === 'reaction' ? 'italic' : 'normal' }}>
              {m.kind === 'highlight'
                ? <>&ldquo;{m.text}&rdquo;</>
                : m.text}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 22, textAlign: 'center',
        fontFamily: serif, fontStyle: 'italic',
        fontSize: 12, color: 'var(--muted)' }}>
        send to my <a href="#commonplace" style={{ color: 'var(--accent)',
          borderBottom: '1px solid var(--accent)',
          textDecoration: 'none' }}>commonplace book</a> · download as plate
      </div>
    </section>
  );
}

// ── Journey rail ─────────────────────────────────────────────────────
// Vertical, sits in the right margin, sticky. Each movement is a tall
// segment; the active one is filled; a dot tracks position within it.
function JourneyRail({ activeIdx, withinSec, serif }) {
  return (
    <div style={{ position: 'sticky', top: 110, alignSelf: 'start',
      paddingLeft: 24, fontFamily: serif }}>

      <div style={{ fontVariant: 'small-caps', letterSpacing: '0.28em',
        fontSize: 10, color: 'var(--muted)', marginBottom: 16,
        writingMode: 'horizontal-tb' }}>
        The shape
      </div>

      <div style={{ display: 'flex', gap: 12, alignItems: 'stretch' }}>
        {/* Bars */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4,
          width: 4, paddingTop: 4 }}>
          {MOVEMENTS.map((m, i) => {
            const isActive = i === activeIdx;
            const isPast = i < activeIdx;
            const h = 30 + m.min * 4; // height roughly proportional to length
            return (
              <div key={m.num} style={{ position: 'relative',
                width: 4, height: h,
                background: isActive ? 'var(--accent)' :
                            isPast   ? 'var(--ink)' :
                                       'var(--rule)',
                opacity: isPast ? 0.35 : 1 }}>
                {isActive && (
                  <div style={{ position: 'absolute',
                    left: -3, top: `${withinSec * 100}%`,
                    width: 10, height: 10, borderRadius: '50%',
                    background: 'var(--paper)',
                    border: '2px solid var(--accent)',
                    transform: 'translate(0, -50%)',
                    transition: 'top 0.12s ease-out' }} />
                )}
              </div>
            );
          })}
        </div>

        {/* Labels */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4,
          paddingTop: 4 }}>
          {MOVEMENTS.map((m, i) => {
            const isActive = i === activeIdx;
            const isPast = i < activeIdx;
            const h = 30 + m.min * 4;
            return (
              <a key={m.num} href={`#mvt-${m.num}`} style={{
                height: h, display: 'flex', flexDirection: 'column',
                justifyContent: 'flex-start', textDecoration: 'none',
                color: isActive ? 'var(--ink)' : 'var(--muted)',
                opacity: isPast ? 0.5 : 1, lineHeight: 1.2,
              }}>
                <div style={{ fontVariant: 'small-caps',
                  letterSpacing: '0.16em', fontSize: 9.5,
                  color: isActive ? 'var(--accent)' : 'var(--muted)' }}>
                  Movement {m.num}
                </div>
                <div style={{ fontStyle: 'italic',
                  fontSize: 12.5,
                  marginTop: 2,
                  textDecoration: isPast ? 'line-through' : 'none',
                  textDecorationColor: 'var(--rule)' }}>
                  {m.title}
                </div>
                <div style={{ fontSize: 10, fontStyle: 'italic',
                  color: 'var(--muted)', marginTop: 2,
                  fontVariantNumeric: 'oldstyle-nums' }}>
                  {m.min} min
                </div>
              </a>
            );
          })}
        </div>
      </div>

      <div style={{ marginTop: 24, paddingTop: 14,
        borderTop: '1px solid var(--rule)',
        fontFamily: serif, fontSize: 11, color: 'var(--muted)' }}>
        <div style={{ fontVariant: 'small-caps', letterSpacing: '0.24em',
          fontSize: 9.5, marginBottom: 6 }}>You are here</div>
        <div style={{ fontStyle: 'italic',
          fontVariantNumeric: 'oldstyle-nums' }}>
          {Math.round((activeIdx + withinSec) / MOVEMENTS.length * 100)}% in ·
          ~{Math.max(1, Math.round(TOTAL_MIN * (1 - (activeIdx + withinSec) / MOVEMENTS.length)))} min left
        </div>
      </div>
    </div>
  );
}

// ── On Grief — printable editorial pages ─────────────────────────────
const lfP = { margin: '0 0 0.85em' };
const lfPIndent = { margin: '0 0 0.85em', textIndent: '1.5em' };

function MvtOpener({ roman, ord, title, abstract }) {
  return (
    <div className="pm-avoid-break" style={{ textAlign: 'center', margin: '0 0 1.2em', breakInside: 'avoid' }}>
      <div style={{ fontVariant: 'small-caps', letterSpacing: '0.3em', fontSize: 9.5,
        color: 'var(--muted)', marginBottom: 8 }}>Movement the {ord}</div>
      <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 24,
        color: 'var(--accent)', marginBottom: 6 }}>{roman}.</div>
      <h2 style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontWeight: 500, fontSize: 18,
        margin: '0 0 8px' }}>{title}</h2>
      <div style={{ fontStyle: 'italic', fontSize: 11.5, color: 'var(--muted)', maxWidth: '38ch',
        margin: '0 auto' }}>{abstract}</div>
    </div>
  );
}

function longformPrintPages() {
  const page1 = (
    <React.Fragment>
      <EdMasthead kicker="Maxubrq · Volume the Third" title="On Grief, & the Periodic Function"
        subtitle="being a long consideration of determinism and that which lies beyond it"
        byline="By maxubrq" meta={['April 2026', '8,240 words', '32 min']} />
      <p style={{ textAlign: 'center', fontStyle: 'italic', color: 'var(--muted)', fontSize: 13,
        maxWidth: '40ch', margin: '0 auto 1.6em' }}>
        Determinism gives the equation. Grief, like a pendulum, has a horizon — a point past which
        the equation is true but useless. This essay is an attempt to live there.
      </p>
      <MvtOpener roman="i" ord="First" title="A weight on a string"
        abstract="In which Galileo watches a chandelier, and a question is mistaken for an answer." />
      <EdColumns>
        <EdLede dropcap="A">
          <span style={{ fontVariant: 'small-caps' }}> pendulum</span> is the simplest machine worth
          thinking about. A weight, a string, a pivot — that is all. Galileo watched a chandelier in
          a Pisa cathedral and timed it with his pulse, and the pattern he noticed has been the
          foundation of clocks and metronomes ever since.
        </EdLede>
        <p style={lfPIndent}>
          And yet: pull it far enough, and the same pendulum becomes unpredictable. Not
          statistically — <em>actually</em>. This is the fact I want to sit with — not because it is
          true, but because it is also a feeling I have been carrying around all winter.
        </p>
        <p style={lfPIndent}>
          The essay that follows is in five movements. The first three are mostly physics, in the
          way that a long meal is mostly food: necessary, occasionally showy, never the point.
        </p>
      </EdColumns>
      <EdFleuron />
    </React.Fragment>
  );

  const page2 = (
    <React.Fragment>
      <MvtOpener roman="ii" ord="Second" title="The pendulum"
        abstract="In which the equation appears, behaves itself, and then refuses to." />
      <p style={lfP}>
        Here is the equation, in the form most textbooks give it — and which, were this a proper
        printed volume, would stand at the foot of the page in a slightly smaller size:
      </p>
      <EdEquation>d²θ/dt² + (g/L)·sin θ = 0</EdEquation>
      <EdColumns>
        <p style={lfP}>
          The angle θ, the gravitational constant g, the length L. That is the entire state of the
          world, as far as a pendulum is concerned. The sine is the interesting character in the
          sentence — it is what makes the equation nonlinear.
        </p>
        <p style={lfPIndent}>
          I will not pretend the next four pages are easy. They are not hard either; they are just
          slow. If you’d rather take the equation as given and skip to where it breaks, you have my
          permission — the argument survives.
        </p>
      </EdColumns>
      <div style={{ textAlign: 'center', fontStyle: 'italic', fontSize: 11.5, color: 'var(--muted)',
        margin: '0.4em auto 0', maxWidth: '40ch' }}>
        You’ve just met the equation. It is, so far, well-behaved. Next: the angle at which it stops being.
      </div>
      <EdFleuron />
    </React.Fragment>
  );

  const page3 = (
    <React.Fragment>
      <MvtOpener roman="iii" ord="Third" title="When the small angle breaks"
        abstract="In which a thirty-degree push is enough to undo a clock, and the lie at the heart of every approximation is named." />
      <EdColumns>
        <p style={lfP}>
          For small θ, sin θ ≈ θ, and the equation becomes a spring — clean, periodic, boring in a
          good way. This is the small-angle approximation.
        </p>
        <p style={lfPIndent}>
          Push θ past about thirty degrees, and the approximation starts to lie. Two identical double
          pendulums, started a thousandth of a degree apart, will be in entirely different places a
          minute later. Not noisy. Not drifting. <em>Different.</em> And the air, very slightly,
          fights back.
        </p>
      </EdColumns>
      <EdPullquote>Determinism gives the equation. It does not give the future.</EdPullquote>
      <div className="pm-avoid-break" style={{ margin: '0.4em 0 0', padding: '22px 24px',
        background: 'var(--paper2)', border: '1px solid var(--rule)', textAlign: 'center',
        breakInside: 'avoid' }}>
        <div style={{ fontVariant: 'small-caps', letterSpacing: '0.3em', fontSize: 9.5,
          color: 'var(--muted)', marginBottom: 10 }}>Interlude</div>
        <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 15,
          maxWidth: '28ch', margin: '0 auto', lineHeight: 1.4 }}>
          Halfway. The argument so far is that an equation can be true and useless at the same time.
          The rest is what to do about it.
        </div>
      </div>
    </React.Fragment>
  );

  const page4 = (
    <React.Fragment>
      <MvtOpener roman="iv" ord="Fourth" title="Lyapunov, or: the horizon"
        abstract="In which two identical pendulums part company, and the word forecast loses its meaning." />
      <EdColumns>
        <p style={lfP}>
          The rate at which two nearby trajectories pull apart has a name: the Lyapunov exponent. A
          positive one means small errors grow exponentially. Double your precision and you buy a
          fixed amount of time. After that, you are guessing.
        </p>
        <p style={lfPIndent}>
          This is the horizon I mean. Not a wall, but a fog: the far distance where even a perfect
          model stops being able to tell you what the pendulum is doing. Grief has one of these too.
          The equation is still there; the future is just out of reach.
        </p>
      </EdColumns>
      <EdFleuron />
      <MvtOpener roman="v" ord="Fifth" title="The grief of a periodic function"
        abstract="In which the argument turns home, and the equation is asked to do a thing it cannot." />
      <p style={lfPIndent}>
        I find this comforting, in a way I do not fully understand. There is a limit to what you can
        know about a string with a weight on it. The world is still deterministic. And yet, past a
        certain horizon, the pendulum and you are both free.
      </p>
      <div style={{ textAlign: 'center', margin: '0.6em 0 0.8em', color: 'var(--accent)' }}>■</div>
      <div style={{ textAlign: 'center', fontVariant: 'small-caps', letterSpacing: '0.24em',
        fontSize: 9.5, color: 'var(--muted)' }}>
        Set in Newsreader · Finis · 8,240 words
      </div>
    </React.Fragment>
  );

  return [page1, page2, page3, page4];
}

// ── The page ─────────────────────────────────────────────────────────
function LongFormPage({ theme = 'light', palette = 'warm', fontPair = 'newsreader',
                        variant = 'fresh' }) {
  const [mode, setModeLF] = useStateLF('flow');
  const [progress, setProgress] = useStateLF(0);
  const [activeIdx, setActiveIdx] = useStateLF(0);
  const [withinSec, setWithinSec] = useStateLF(0);
  const [showResume, setShowResume] = useStateLF(variant === 'resume');
  const scrollerRef = useRefLF(null);

  const serif = fontPair === 'newsreader' ? '"Newsreader", Georgia, serif'
    : fontPair === 'source' ? '"Source Serif 4", Georgia, serif'
    : fontPair === 'lora' ? '"Lora", Georgia, serif'
    : '"EB Garamond", Georgia, serif';

  useEffectLF(() => {
    const el = scrollerRef.current; if (!el) return;
    const onScroll = () => {
      const total = el.scrollHeight - el.clientHeight;
      const p = total > 0 ? el.scrollTop / total : 0;
      setProgress(Math.max(0, Math.min(1, p)));

      // Find active movement by section top within viewport
      const sections = el.querySelectorAll('section[id^="mvt-"]');
      let idx = 0;
      const containerTop = el.getBoundingClientRect().top;
      sections.forEach((s, i) => {
        const top = s.getBoundingClientRect().top - containerTop;
        if (top < 200) idx = i;
      });
      setActiveIdx(idx);

      // Position within active section
      const cur = sections[idx];
      const next = sections[idx + 1];
      if (cur) {
        const a = cur.getBoundingClientRect().top - containerTop;
        const b = next ? next.getBoundingClientRect().top - containerTop : (el.scrollHeight - el.scrollTop);
        const span = b - a;
        if (variant === 'resume' && idx === 2) {
          // Lock display to mid-movement III for the resumption artboard
          setWithinSec(0.55);
        } else {
          const within = Math.max(0, Math.min(1, -a / Math.max(1, span)));
          setWithinSec(within);
        }
      }
    };
    el.addEventListener('scroll', onScroll); onScroll();
    return () => el.removeEventListener('scroll', onScroll);
  }, [variant]);

  // For "resume" variant, scroll to Movement III after mount
  useEffectLF(() => {
    if (variant !== 'resume') return;
    const el = scrollerRef.current; if (!el) return;
    const t = setTimeout(() => {
      const tgt = el.querySelector('#mvt-III');
      if (tgt) {
        el.scrollTop = tgt.offsetTop - 80;
      }
    }, 60);
    return () => clearTimeout(t);
  }, [variant]);

  const vars = (window.getPalette || (() => ({})))(palette, theme);
  const activeMvt = MOVEMENTS[activeIdx];

  // Roman folio
  const folio = Math.max(1, Math.round(progress * 64 + 1));
  const romanize = (n) => {
    const map = [['l',50],['xl',40],['x',10],['ix',9],['v',5],['iv',4],['i',1]];
    let s = ''; for (const [r, v] of map) while (n >= v) { s += r; n -= v; } return s;
  };

  return (
    <div style={{
      ...vars, '--serif': serif,
      height: '100%', overflow: 'hidden', position: 'relative',
      background: 'var(--paper)', color: 'var(--ink)',
      fontFamily: serif,
      backgroundImage: 'radial-gradient(ellipse at top, var(--paper) 0%, var(--paper2) 100%)',
    }}>
      {mode !== 'print' && <ModeSwitcher mode={mode} onChange={setModeLF} serif={serif} />}
      {mode === 'print' ? (
        <PrintDeck theme={theme} palette={palette} serif={serif} sans='"IBM Plex Sans", sans-serif'
          title="On Grief, & the Periodic Function" mode={mode} onModeChange={setModeLF}
          pages={longformPrintPages()} />
      ) : (
      <React.Fragment>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0,
        height: 1, background: 'var(--rule)', zIndex: 10 }}>
        <div style={{ height: '100%', width: `${progress * 100}%`,
          background: 'var(--accent)', transition: 'width 0.08s' }} />
      </div>

      {/* Running head — adds movement breadcrumb */}
      <header style={{ position: 'absolute', top: 0, left: 0, right: 0,
        display: 'grid', gridTemplateColumns: '1fr auto 1fr',
        alignItems: 'center', padding: '22px 56px 0', zIndex: 5,
        fontFamily: serif, fontSize: 12, color: 'var(--muted)',
        fontVariant: 'small-caps', letterSpacing: '0.2em' }}>
        <span style={{ justifySelf: 'start' }}>maxubrq</span>
        <span style={{ justifySelf: 'center', fontStyle: 'italic',
          fontVariant: 'normal', letterSpacing: 0, fontSize: 12.5,
          color: 'var(--muted)' }}>
          On Grief &amp; the Periodic Function
          <span style={{ color: 'var(--rule)', margin: '0 10px' }}>·</span>
          <span style={{ color: 'var(--accent)' }}>{activeMvt.num} {activeMvt.title}</span>
        </span>
        <span style={{ justifySelf: 'end', fontVariantNumeric: 'oldstyle-nums',
          fontVariant: 'normal', letterSpacing: 0 }}>
          {romanize(folio)}
        </span>
      </header>

      {/* Scroller */}
      <div ref={scrollerRef} style={{ height: '100%', overflowY: 'auto',
        overflowX: 'hidden', paddingTop: 60, paddingBottom: 120 }}>
        <div style={{ display: 'grid',
          gridTemplateColumns: '1fr 620px 230px 1fr',
          gap: '0 40px', alignItems: 'start', position: 'relative' }}>

          {/* Body column */}
          <article style={{ gridColumn: 2, fontSize: 17.5, lineHeight: 1.78,
            color: 'var(--ink)', position: 'relative',
            fontFeatureSettings: '"liga", "dlig", "onum", "kern"',
            textRendering: 'optimizeLegibility',
            hyphens: 'auto', textAlign: 'justify' }}>

            {showResume && (
              <ResumptionBanner serif={serif} dismiss={() => setShowResume(false)} />
            )}

            <FrontMatter serif={serif} hasResumption={showResume} />

            {/* Movement I */}
            <MovementOpener m={MOVEMENTS[0]} serif={serif} />

            <p style={{ margin: '0 0 1em' }}>
              <span style={{ float: 'left', fontFamily: serif, fontWeight: 500,
                fontSize: '5.2em', lineHeight: 0.85, paddingTop: '0.08em',
                paddingRight: '0.12em', color: 'var(--ink)' }}>A</span>
              <span style={{ fontVariant: 'small-caps', letterSpacing: '0.05em' }}> pendulum</span> is
              the simplest machine worth thinking about. A weight, a string, a pivot — that is all.
              Galileo watched a chandelier in a Pisa cathedral and timed it with his pulse, and the
              pattern he noticed — that the period barely depends on how far you pull it — has been
              the foundation of clocks, metronomes, and a surprising amount of modern physics ever
              since.
            </p>
            <p style={{ margin: '0 0 1em', textIndent: '1.8em' }}>
              And yet: pull it far enough, and the same pendulum becomes unpredictable.
              Not statistically — <em>actually</em>. The equation that describes it is
              deterministic, solvable in principle, and produces behavior you can simulate
              but cannot forecast. This is the fact I want to sit with — not because it
              is true (it is, and the truth is well-trodden), but because it is also a
              feeling I have been carrying around all winter, and I want to learn its shape.
            </p>
            <p style={{ margin: '0 0 1em', textIndent: '1.8em' }}>
              The essay that follows is in five movements. The first three are mostly
              physics, in the way that a long meal is mostly food: necessary, occasionally
              showy, never the point. The fourth movement is the one I lost November to.
              The fifth is short.
            </p>

            <MovementPulse serif={serif}
              next="You've just watched a chandelier swing. Next: the equation that explains why, and the moment it stops explaining." />

            {/* Movement II */}
            <MovementOpener m={MOVEMENTS[1]} serif={serif} />

            <p style={{ margin: '0 0 1em', textIndent: '1.8em' }}>
              Here is the equation, in the form most textbooks give it — and which, were
              this a proper printed volume, would stand at the foot of the page in a
              slightly smaller size, set apart by a thin rule:
            </p>

            <div style={{ fontFamily: serif, fontSize: '1.05em', fontStyle: 'italic',
              textAlign: 'center', margin: '1.4em 0 1.6em', color: 'var(--ink)',
              letterSpacing: '0.02em' }}>
              d²θ/dt² + (g/L)·sin θ = 0
            </div>

            <p style={{ margin: '0 0 1em', textIndent: '1.8em' }}>
              The angle θ, the gravitational constant g, the length L. That is the
              entire state of the world, as far as <Recur to="I" first="A pendulum is the simplest machine worth thinking about. A weight, a string, a pivot — that is all.">a pendulum</Recur> is
              concerned. The sine is the interesting character in the sentence — it
              is what keeps the restoring force pointing roughly toward zero, and it
              is also what makes the equation nonlinear.
            </p>
            <p style={{ margin: '0 0 1em', textIndent: '1.8em' }}>
              I will not pretend the next four pages are easy. They are not hard
              either; they are just slow. If you'd rather take the equation as given
              and skip to the part where it starts to break, you have my permission —
              the argument survives.
            </p>

            <MovementPulse serif={serif}
              next="You've just met the equation. It is, so far, well-behaved. Next: the angle at which it stops being." />

            {/* Movement III */}
            <MovementOpener m={MOVEMENTS[2]} serif={serif} />

            <p style={{ margin: '0 0 1em', textIndent: '1.8em' }}>
              For small θ, sin θ ≈ θ, and <Recur to="II" first="Here is the equation, in the form most textbooks give it — and which, were this a proper printed volume, would stand at the foot of the page in a slightly smaller size, set apart by a thin rule.">the equation</Recur> becomes
              a spring. Clean, periodic, boring in a good way. This is the
              <em> small-angle approximation</em>, and it is the reason the pendulum
              in a grandfather clock keeps better time than most of your friends.
            </p>
            <p style={{ margin: '0 0 1em', textIndent: '1.8em' }}>
              Push θ past about thirty degrees, though, and the approximation starts
              to lie. The period grows with amplitude. Add a second pendulum — hang
              one off the first — and the lie becomes a cascade. Two identical
              double pendulums, started from angles that differ by a thousandth of
              a degree, will be in entirely different places a minute later. Not
              noisy. Not drifting. <em>Different</em>. And the air, very slightly,
              fights back.
            </p>

            {/* Pull-quote */}
            <div style={{ margin: '2.2em 0', textAlign: 'center' }}>
              <div style={{ height: 1, background: 'var(--rule)', width: 120,
                margin: '0 auto 22px' }} />
              <blockquote style={{ fontFamily: serif, fontStyle: 'italic',
                fontSize: '1.42em', lineHeight: 1.35, margin: 0, padding: 0,
                color: 'var(--ink)', maxWidth: '18ch',
                marginLeft: 'auto', marginRight: 'auto',
                letterSpacing: '-0.005em' }}>
                <span style={{ fontSize: '1.6em', lineHeight: 0,
                  verticalAlign: '-0.3em', color: 'var(--accent)',
                  marginRight: '0.12em', fontStyle: 'normal' }}>“</span>
                Determinism gives the equation. It does not give the future.
                <span style={{ fontSize: '1.6em', lineHeight: 0,
                  verticalAlign: '-0.3em', color: 'var(--accent)',
                  marginLeft: '0.08em', fontStyle: 'normal' }}>”</span>
              </blockquote>
              <div style={{ height: 1, background: 'var(--rule)', width: 120,
                margin: '22px auto 0' }} />
            </div>

            <MovementPulse serif={serif}
              next="You've just seen the equation lie. Next: a number that measures how fast the lie grows." />

            {/* Interlude — between III and IV */}
            <Interlude serif={serif} />

            {/* Movement IV */}
            <MovementOpener m={MOVEMENTS[3]} serif={serif} />

            <p style={{ margin: '0 0 1em', textIndent: '1.8em' }}>
              The rate at which <Recur to="III" first="Two identical double pendulums, started from angles that differ by a thousandth of a degree, will be in entirely different places a minute later. Not noisy. Not drifting. Different.">two nearby trajectories</Recur> pull
              apart has a name: the <em>Lyapunov exponent</em>. A positive one means
              small errors grow exponentially. Double the precision of your
              measurement and you buy a fixed amount of time — maybe a few seconds,
              maybe a few hours, depending on the system. After that, you are
              guessing.
            </p>
            <p style={{ margin: '0 0 1em', textIndent: '1.8em' }}>
              This is the horizon I mean. Not a wall, but a fog: the far distance
              where even a perfect model, run on a perfect computer, stops being
              able to tell you what <Recur to="I" first="A pendulum is the simplest machine worth thinking about. A weight, a string, a pivot — that is all.">the pendulum</Recur> is doing,
              because the tiniest rounding error has grown into the whole answer.
              Grief has one of these. So does any sentence you wish you hadn't said.
              The equation is still there; the future is just out of reach.
            </p>

            <MovementPulse serif={serif}
              next="You've just learned the word for a horizon you can measure. Last: what is on the other side of it." />

            {/* Movement V */}
            <MovementOpener m={MOVEMENTS[4]} serif={serif} />

            <p style={{ margin: '0 0 1em', textIndent: '1.8em' }}>
              I find this comforting, in a way I do not fully understand. There is
              a limit to what you can know about a string with a weight on it.
              There is a limit to what you can know about most things. The equation
              is still there, still clean, still solvable in the way the word is
              used in a math class. The world is still deterministic. And yet, past
              a certain horizon, <Recur to="I" first="A pendulum is the simplest machine worth thinking about. A weight, a string, a pivot — that is all.">the pendulum</Recur> and you are
              both free.
            </p>

            {/* End mark */}
            <div style={{ textAlign: 'center', margin: '2em 0 0',
              fontFamily: serif, color: 'var(--accent)', fontSize: 16 }}>
              ■
            </div>

            {/* Colophon footer */}
            <div style={{ marginTop: '3em', paddingTop: 22,
              borderTop: '1px solid var(--rule)',
              fontFamily: serif, fontSize: 12, color: 'var(--muted)',
              display: 'grid', gridTemplateColumns: '1fr auto 1fr',
              gap: 20, alignItems: 'center' }}>
              <span style={{ fontStyle: 'italic' }}>
                <span style={{ fontVariant: 'small-caps', letterSpacing: '0.2em',
                  fontSize: 10.5 }}>Set in </span>Newsreader, with Plex Sans for marginalia.
              </span>
              <span style={{ fontVariant: 'small-caps', letterSpacing: '0.2em',
                fontSize: 10.5 }}>Finis</span>
              <span style={{ fontStyle: 'italic', textAlign: 'right' }}>
                32 min · 8,240 words · April MMXXVI
              </span>
            </div>

            <PersonalIndex serif={serif} />

          </article>

          {/* Journey rail column */}
          <div style={{ gridColumn: 3 }}>
            <JourneyRail activeIdx={activeIdx} withinSec={withinSec} serif={serif} />
          </div>
        </div>
      </div>
      </React.Fragment>
      )}
    </div>
  );
}

window.LongFormPage = LongFormPage;
