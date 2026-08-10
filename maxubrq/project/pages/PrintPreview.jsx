// PrintPreview.jsx — what the long-form essay looks like as a printed book.
//
// Demonstrates the print stylesheet: facing pages at trade-paperback
// proportions, running heads, oldstyle folios in outer corners, footnotes
// collected at the FOOT of the page (not the end), movement openers that
// start on a recto page and drop a third of the way down, half-title on
// the verso, real title page on the recto.
//
// Renders three spreads stacked vertically:
//   1. Half-title (verso) + Title page (recto)
//   2. End of Movement II w/ pulse (verso) + Movement III opener (recto)
//   3. Body w/ footnotes at foot (verso) + Body w/ footnotes at foot (recto)

const { useState: useStatePP } = React;

// Each "page" is fixed-size, simulating a printed leaf.
const PAGE_W = 432;   // ~ 6 inches at 72dpi feel
const PAGE_H = 648;   // ~ 9 inches — trade paperback ratio

// Roman numeral helper (for front matter folios)
function rom(n) {
  const map = [['l',50],['xl',40],['x',10],['ix',9],['v',5],['iv',4],['i',1]];
  let s = ''; for (const [r, v] of map) while (n >= v) { s += r; n -= v; } return s;
}

// ── A single printed leaf ────────────────────────────────────────────
function Leaf({ side, folio, romanFolio, runningHead, children, serif, blank }) {
  // Verso = even (left page), recto = odd (right page).
  // Outer margins are larger than inner (gutter) margins.
  const isVerso = side === 'verso';
  const padL = isVerso ? 56 : 40;
  const padR = isVerso ? 40 : 56;

  return (
    <div style={{
      position: 'relative',
      width: PAGE_W, height: PAGE_H,
      background: 'var(--paper)',
      boxShadow: isVerso
        ? '-1px 0 2px rgba(0,0,0,0.05), -8px 8px 22px rgba(0,0,0,0.10)'
        : '1px 0 2px rgba(0,0,0,0.05), 8px 8px 22px rgba(0,0,0,0.10)',
      color: 'var(--ink)',
      fontFamily: serif,
      overflow: 'hidden',
    }}>
      {/* Running head — small-caps, muted, with folio at outer corner */}
      {!blank && (
        <div style={{ position: 'absolute', top: 32,
          left: padL, right: padR,
          display: 'grid', gridTemplateColumns: isVerso ? 'auto 1fr' : '1fr auto',
          alignItems: 'baseline',
          fontFamily: serif, fontSize: 9.5,
          fontVariant: 'small-caps', letterSpacing: '0.22em',
          color: 'var(--muted)',
          paddingBottom: 6,
          borderBottom: '0.5px solid var(--rule)',
        }}>
          {isVerso ? (
            <>
              <span style={{ fontVariantNumeric: 'oldstyle-nums',
                fontVariant: 'normal', letterSpacing: 0,
                fontStyle: 'italic', fontSize: 10 }}>
                {romanFolio ? rom(folio) : folio}
              </span>
              <span style={{ justifySelf: 'center', textAlign: 'center' }}>
                {runningHead}
              </span>
            </>
          ) : (
            <>
              <span style={{ justifySelf: 'center', textAlign: 'center' }}>
                {runningHead}
              </span>
              <span style={{ fontVariantNumeric: 'oldstyle-nums',
                fontVariant: 'normal', letterSpacing: 0,
                fontStyle: 'italic', fontSize: 10 }}>
                {romanFolio ? rom(folio) : folio}
              </span>
            </>
          )}
        </div>
      )}

      <div style={{ position: 'absolute',
        top: 70, bottom: 50, left: padL, right: padR,
      }}>
        {children}
      </div>
    </div>
  );
}

// ── Spread: two facing leaves with binding shadow between ────────────
function Spread({ children, label }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column',
      alignItems: 'center', margin: '0 auto 80px' }}>
      {label && (
        <div style={{ fontFamily: '"IBM Plex Mono", monospace',
          fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase',
          color: 'var(--muted)', marginBottom: 16, opacity: 0.7 }}>
          {label}
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'stretch',
        position: 'relative' }}>
        {children}
        {/* Center binding shadow */}
        <div style={{ position: 'absolute', top: 0, bottom: 0,
          left: '50%', width: 18, transform: 'translateX(-50%)',
          background: 'linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.10) 50%, rgba(0,0,0,0) 100%)',
          pointerEvents: 'none' }} />
      </div>
    </div>
  );
}

// ── Footnote rule (the rule above footnotes at the foot of the page) ─
function FootRule() {
  return <div style={{ width: 90, height: 0.5,
    background: 'var(--rule)', margin: '20px 0 12px' }} />;
}

// ── Spread 1: Half-title (verso) + Title page (recto) ────────────────
function TitleSpread({ serif }) {
  return (
    <Spread label="Spread A · half-title and title page · pp. ii–iii">
      <Leaf side="verso" folio={2} romanFolio runningHead="" serif={serif}>
        {/* Half-title: a quiet, centered, mostly-empty page */}
        <div style={{ height: '100%', display: 'flex',
          flexDirection: 'column', justifyContent: 'center',
          alignItems: 'center', textAlign: 'center' }}>
          <div style={{ fontVariant: 'small-caps', letterSpacing: '0.36em',
            fontSize: 9, color: 'var(--muted)', marginBottom: 22 }}>
            Maxubrq · Volume the Third
          </div>
          <div style={{ fontFamily: serif, fontSize: 14,
            fontStyle: 'italic', color: 'var(--ink)',
            letterSpacing: '-0.005em', lineHeight: 1.35,
            maxWidth: '20ch' }}>
            On Grief, &amp; the
            <br />
            Periodic Function
          </div>
          <div style={{ width: 36, height: 0.5, background: 'var(--rule)',
            margin: '36px auto' }} />
          <div style={{ fontFamily: serif, fontStyle: 'italic',
            fontSize: 10.5, color: 'var(--muted)', maxWidth: '24ch',
            lineHeight: 1.55 }}>
            &ldquo;The horizon is not a wall<br />
            but a fog.&rdquo;
          </div>
          <div style={{ fontFamily: serif, fontVariant: 'small-caps',
            letterSpacing: '0.22em', fontSize: 8.5,
            color: 'var(--muted)', marginTop: 8 }}>
            — from movement iv
          </div>
        </div>
      </Leaf>

      <Leaf side="recto" folio={3} romanFolio runningHead="" serif={serif}>
        {/* Title page — the loud one */}
        <div style={{ height: '100%', display: 'flex',
          flexDirection: 'column', justifyContent: 'space-between',
          alignItems: 'center', textAlign: 'center', paddingTop: 30 }}>
          <div>
            <div style={{ fontVariant: 'small-caps', letterSpacing: '0.4em',
              fontSize: 9, color: 'var(--muted)' }}>
              Maxubrq · Volume the Third
            </div>
            <div style={{ borderTop: '0.5px solid var(--rule)',
              borderBottom: '0.5px solid var(--rule)',
              height: 3, width: 60, margin: '20px auto 30px' }} />
            <h1 style={{ fontFamily: serif, fontWeight: 500,
              fontSize: 28, lineHeight: 1.08, letterSpacing: '-0.015em',
              margin: '0 0 12px' }}>
              On Grief,
              <br />
              <span style={{ fontStyle: 'italic', fontWeight: 400,
                color: 'var(--ink)' }}>&amp; the Periodic Function</span>
            </h1>
            <div style={{ fontVariant: 'small-caps', letterSpacing: '0.28em',
              fontSize: 9, color: 'var(--muted)', marginTop: 16,
              lineHeight: 1.7 }}>
              being a long consideration
              <br />
              of determinism, and that
              <br />
              which lies beyond it
            </div>
          </div>

          <div>
            <div style={{ fontFamily: serif, fontStyle: 'italic',
              fontSize: 12, color: 'var(--ink)', marginBottom: 4 }}>
              by maxubrq
            </div>
            <div style={{ fontFamily: serif, fontVariant: 'small-caps',
              letterSpacing: '0.22em', fontSize: 8.5,
              color: 'var(--muted)' }}>
              april mmxxvi
            </div>
            <div style={{ width: 16, height: 0.5, background: 'var(--rule)',
              margin: '14px auto 0' }} />
          </div>
        </div>
      </Leaf>
    </Spread>
  );
}

// ── Spread 2: End of Mvt II w/ pulse (verso) + Mvt III opener (recto) ─
function MovementSpread({ serif }) {
  return (
    <Spread label="Spread B · movement transition · pp. 14–15">
      <Leaf side="verso" folio={14} runningHead="On Grief, &amp; the Periodic Function" serif={serif}>
        {/* End of Movement II */}
        <div style={{ fontSize: 10.5, lineHeight: 1.62,
          textAlign: 'justify', hyphens: 'auto', color: 'var(--ink)',
          fontFeatureSettings: '"liga","onum","kern"' }}>
          <p style={{ margin: '0 0 0.7em', textIndent: '1.4em' }}>
            you'd rather take the equation as given and skip to the part where it
            starts to break, you have my permission — the argument survives.
          </p>
          <p style={{ margin: '0 0 0.7em', textIndent: '1.4em' }}>
            But it is also worth noticing what the equation does
            <em> not</em> say. It says nothing about whether the pendulum is
            made of brass or of grief. It says nothing about who built the
            clock, or what hour of the morning it is, or whether the room is
            cold. The state of the world, in this little theatre, is three
            numbers and a sign.<sup style={{ color: 'var(--accent)',
              fontVariantNumeric: 'oldstyle-nums', fontSize: 7.5 }}>4</sup>
          </p>
          <p style={{ margin: '0 0 0.7em', textIndent: '1.4em' }}>
            This is what physics is, more often than not: a deliberate
            forgetting. We forget the brass. We forget the cold. We get,
            in exchange, an equation that obeys us — until it doesn't.
          </p>

          {/* Pulse — italic, centered */}
          <div style={{ textAlign: 'center', margin: '1.4em 0 0' }}>
            <div style={{ fontStyle: 'italic', fontSize: 10,
              color: 'var(--muted)', maxWidth: '32ch',
              margin: '0 auto', lineHeight: 1.55 }}>
              You've just met the equation. It is, so far,
              <br />
              well-behaved. Next: the angle at which
              <br />
              it stops being.
            </div>
            <div style={{ color: 'var(--rule)', fontSize: 13,
              letterSpacing: '0.8em', margin: '14px 0 0' }}>❦</div>
          </div>
        </div>

        {/* Footnote at foot of page */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
          <FootRule />
          <div style={{ fontFamily: serif, fontSize: 9,
            lineHeight: 1.5, color: 'var(--muted)',
            display: 'grid', gridTemplateColumns: '18px 1fr',
            gap: 6, alignItems: 'baseline' }}>
            <span style={{ fontStyle: 'italic',
              fontVariantNumeric: 'oldstyle-nums',
              color: 'var(--accent)', textAlign: 'right' }}>4.</span>
            <span>
              Four, if you count time. Strictly speaking, the state is
              (θ, dθ/dt) — two numbers — and the equation tells you the
              second derivative. The rest is housekeeping.
            </span>
          </div>
        </div>
      </Leaf>

      <Leaf side="recto" folio={15} runningHead="iii · when the small angle breaks" serif={serif}>
        {/* Movement III opener — drops down ~1/3 of page */}
        <div style={{ height: '100%', display: 'flex',
          flexDirection: 'column', justifyContent: 'flex-start',
          paddingTop: '24%', textAlign: 'center' }}>
          <div style={{ fontVariant: 'small-caps', letterSpacing: '0.4em',
            fontSize: 9, color: 'var(--muted)', marginBottom: 18 }}>
            Movement the Third
          </div>

          <div style={{ fontFamily: serif, fontStyle: 'italic',
            fontSize: 30, lineHeight: 1, color: 'var(--accent)',
            fontVariantNumeric: 'oldstyle-nums', marginBottom: 18,
            opacity: 0.85 }}>
            iii.
          </div>

          <h2 style={{ fontFamily: serif, fontWeight: 500,
            fontSize: 17, lineHeight: 1.2, letterSpacing: '-0.01em',
            margin: '0 0 14px', fontStyle: 'italic' }}>
            When the small angle breaks
          </h2>

          <div style={{ fontFamily: serif, fontStyle: 'italic',
            fontSize: 10.5, color: 'var(--muted)', maxWidth: '28ch',
            margin: '0 auto 18px', lineHeight: 1.55 }}>
            In which a thirty-degree push is enough to undo a clock, and the
            lie at the heart of every approximation is named.
          </div>

          <div style={{ display: 'inline-flex', alignItems: 'center',
            justifyContent: 'center', gap: 12, fontFamily: serif,
            fontVariant: 'small-caps', letterSpacing: '0.22em',
            fontSize: 8.5, color: 'var(--muted)' }}>
            <span style={{ width: 18, height: 0.5,
              background: 'var(--rule)' }} />
            <span style={{ fontVariantNumeric: 'oldstyle-nums',
              letterSpacing: 0, fontVariant: 'normal',
              fontStyle: 'italic' }}>8 min</span>
            <span style={{ width: 18, height: 0.5,
              background: 'var(--rule)' }} />
          </div>
        </div>
      </Leaf>
    </Spread>
  );
}

// ── Spread 3: body w/ footnotes (verso) + body w/ footnotes (recto) ──
function BodyFootnotesSpread({ serif }) {
  const para = {
    margin: '0 0 0.7em', textIndent: '1.4em',
    textAlign: 'justify', hyphens: 'auto',
  };
  const noteRow = {
    display: 'grid', gridTemplateColumns: '18px 1fr',
    gap: 6, alignItems: 'baseline',
    fontFamily: serif, fontSize: 9, lineHeight: 1.5,
    color: 'var(--muted)', marginBottom: 6,
  };
  const noteNum = {
    fontStyle: 'italic', fontVariantNumeric: 'oldstyle-nums',
    color: 'var(--accent)', textAlign: 'right',
  };

  return (
    <Spread label="Spread C · body with footnotes at foot · pp. 18–19">
      <Leaf side="verso" folio={18} runningHead="On Grief, &amp; the Periodic Function" serif={serif}>
        <div style={{ fontSize: 10.5, lineHeight: 1.62,
          color: 'var(--ink)',
          fontFeatureSettings: '"liga","onum","kern"' }}>
          <p style={{ ...para, textIndent: 0 }}>
            <span style={{ fontVariant: 'small-caps',
              letterSpacing: '0.06em' }}>Push θ</span> past about thirty
            degrees, though, and the approximation starts to lie. The period
            grows with amplitude. Add a second pendulum — hang one off the
            first — and the lie becomes a cascade.<sup style={{
              color: 'var(--accent)', fontVariantNumeric: 'oldstyle-nums',
              fontSize: 7.5 }}>7</sup> Two identical double pendulums,
            started from angles that differ by a thousandth of a degree, will
            be in entirely different places a minute later. Not noisy. Not
            drifting. <em>Different.</em>
          </p>
          <p style={para}>
            The first time I saw this happen on a screen, I assumed there
            was a bug. The two simulations were running in lockstep for the
            first six seconds and then, abruptly, the lockstep ended.<sup
              style={{ color: 'var(--accent)',
                fontVariantNumeric: 'oldstyle-nums', fontSize: 7.5 }}>8</sup>
            One pendulum had decided to swing left. The other had decided
            to swing right. They had been given the same equation and very
            nearly the same number, and they had, for a while, behaved as
            if they were one pendulum, and then they had stopped.
          </p>
          <p style={para}>
            I want to be careful about the verb <em>decided</em>. There is
            no decision; there is no will; there is barely a difference.
            What there is, instead, is a fact about the equation: that the
            distance between two trajectories doesn't grow linearly, the way
            distances usually do.
          </p>
        </div>

        {/* Footnotes at foot of page */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
          <FootRule />
          <div style={noteRow}>
            <span style={noteNum}>7.</span>
            <span>
              The double pendulum is one of the canonical simple systems
              that exhibits deterministic chaos. Its phase space is
              four-dimensional, which is one more than the eye can hold.
            </span>
          </div>
          <div style={noteRow}>
            <span style={noteNum}>8.</span>
            <span>
              Six seconds is generous; on the simulation I had at the time,
              it was closer to four.
            </span>
          </div>
        </div>
      </Leaf>

      <Leaf side="recto" folio={19} runningHead="iii · when the small angle breaks" serif={serif}>
        <div style={{ fontSize: 10.5, lineHeight: 1.62,
          color: 'var(--ink)',
          fontFeatureSettings: '"liga","onum","kern"' }}>
          <p style={{ ...para, textIndent: 0 }}>
            It grows <em>exponentially</em>. After one unit of time, the gap
            between the two trajectories is twice what it was. After two,
            four. After ten, a thousand. The number that measures how fast
            this happens has a name, and a man's name attached to it, and a
            home in every textbook on chaos.<sup style={{
              color: 'var(--accent)', fontVariantNumeric: 'oldstyle-nums',
              fontSize: 7.5 }}>9</sup>
          </p>

          {/* Pull-quote */}
          <div style={{ margin: '1.2em auto', textAlign: 'center',
            maxWidth: '22ch' }}>
            <div style={{ width: 60, height: 0.5,
              background: 'var(--rule)', margin: '0 auto 12px' }} />
            <blockquote style={{ margin: 0, padding: 0,
              fontFamily: serif, fontStyle: 'italic',
              fontSize: 14.5, lineHeight: 1.35,
              color: 'var(--ink)', letterSpacing: '-0.005em' }}>
              Determinism gives the equation. It does not give the future.
            </blockquote>
            <div style={{ width: 60, height: 0.5,
              background: 'var(--rule)', margin: '12px auto 0' }} />
          </div>

          <p style={para}>
            We will get to <em>Lyapunov</em> in the next movement. For now I
            want to sit with the fact, because it took me a long time to
            believe it, and because the moment of belief — when it stopped
            being a sentence and started being an image — was also the
            moment the rest of this essay became inevitable.
          </p>
        </div>

        {/* Footnote at foot */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
          <FootRule />
          <div style={noteRow}>
            <span style={noteNum}>9.</span>
            <span>
              Aleksandr Mikhailovich Lyapunov, 1857–1918. The exponent that
              bears his name comes from his doctoral thesis,
              <em> The General Problem of the Stability of Motion</em> (1892),
              which spent thirty years on a shelf before anyone noticed.
            </span>
          </div>
        </div>
      </Leaf>
    </Spread>
  );
}

// ── The page surface ─────────────────────────────────────────────────
function PrintPreview({ theme = 'light', palette = 'warm', fontPair = 'newsreader' }) {
  const [actualPrint, setActualPrint] = useStatePP(false);
  const serif = fontPair === 'newsreader' ? '"Newsreader", Georgia, serif'
    : fontPair === 'source' ? '"Source Serif 4", Georgia, serif'
    : fontPair === 'lora' ? '"Lora", Georgia, serif'
    : '"EB Garamond", Georgia, serif';

  const vars = (window.getPalette || (() => ({})))(palette, theme);

  // The artboard background is a darker "table" color so the paper
  // pages float on it — like book pages on a desk.
  const tableBg = theme === 'dark' ? '#08090b' : '#dcd6c5';

  return (
    <div style={{
      ...vars, '--serif': serif,
      height: '100%', overflow: 'hidden', position: 'relative',
      background: tableBg, color: 'var(--ink)',
      fontFamily: serif,
    }}>
      {/* Header strip — print preview chrome */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0,
        zIndex: 5, padding: '16px 28px',
        display: 'grid', gridTemplateColumns: '1fr auto 1fr',
        alignItems: 'center',
        background: theme === 'dark' ? '#0e1013' : '#cfc7b3',
        borderBottom: theme === 'dark' ? '1px solid #1a1d22' : '1px solid #b8af98',
        fontFamily: '"IBM Plex Mono", monospace',
        fontSize: 10.5, color: theme === 'dark' ? 'rgba(232,236,243,0.6)' : 'rgba(11,18,32,0.6)',
        letterSpacing: '0.16em', textTransform: 'uppercase',
      }}>
        <span>Print preview</span>
        <span style={{ justifySelf: 'center', fontStyle: 'normal',
          letterSpacing: '0.2em' }}>
          6 × 9 in · trim · facing pages
        </span>
        <span style={{ justifySelf: 'end', display: 'flex', gap: 18,
          alignItems: 'center' }}>
          <span style={{ letterSpacing: '0.18em' }}>
            32 pp · 8,240 words
          </span>
          <button style={{ background: 'transparent', border: 'none',
            cursor: 'pointer', color: 'inherit',
            fontFamily: 'inherit', fontSize: 'inherit',
            letterSpacing: '0.18em', textTransform: 'uppercase',
            borderBottom: '1px solid currentColor',
            padding: '2px 0' }}>
            export pdf
          </button>
        </span>
      </div>

      {/* The desk — pages float on it */}
      <div style={{ position: 'absolute', top: 44, left: 0, right: 0, bottom: 0,
        overflowY: 'auto', overflowX: 'hidden',
        paddingTop: 48, paddingBottom: 80,
      }}>
        <TitleSpread serif={serif} />
        <MovementSpread serif={serif} />
        <BodyFootnotesSpread serif={serif} />

        {/* Closing label */}
        <div style={{ textAlign: 'center', marginTop: 0,
          fontFamily: '"IBM Plex Mono", monospace', fontSize: 10,
          color: theme === 'dark' ? 'rgba(232,236,243,0.5)' : 'rgba(11,18,32,0.5)',
          letterSpacing: '0.2em', textTransform: 'uppercase' }}>
          ✱ &nbsp; three of sixteen spreads shown
        </div>
      </div>
    </div>
  );
}

window.PrintPreview = PrintPreview;
