// InkFree.jsx — the "Free" article type. Full-bleed, scroll-driven, off the
// grid — a pudding.cool-style scrollytelling piece. NOT flow (flow is
// structured-but-quiet); Free is a canvas. A sticky stage transforms as you
// scroll steps past it; full-bleed panels punctuate.
//
// Self-contained scroll viewport so the scroll-driven graphic works inside
// the artboard. Topic: the forgetting curve — a line that draws itself and a
// field of memory-dots that fade, threaded through the site's memory motif.

const { useState: useSF, useRef: useRF, useEffect: useEF } = React;

// the sticky graphic: a forgetting curve + decaying memory dots.
// `t` in 0..1 = progress through the charted section; `step` = active step.
function ForgettingStage({ t, step }) {
  const W = 640, H = 460, padL = 70, padB = 70;
  const x0 = padL, x1 = W - 40, y0 = 30, y1 = H - padB;
  // forgetting curve R = e^(-k*time); draw progressively by t
  const k = 1.7;
  const pts = [];
  const N = 60;
  for (let i = 0; i <= N; i++) {
    const f = i / N;
    const x = x0 + f * (x1 - x0);
    const y = y1 - Math.exp(-k * f) * (y1 - y0);
    pts.push([x, y]);
  }
  const drawN = Math.max(1, Math.round(t * N));
  const curveD = pts.slice(0, drawN + 1).map((p, i) => `${i ? 'L' : 'M'} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
  // step 2 overlays a review "boost" curve; step 3 shows spaced reviews
  const showReview = step >= 2;
  const showSpaced = step >= 3;
  // memory dots decaying with the curve
  const dots = [];
  for (let i = 0; i < 40; i++) {
    const f = (i * 0.61803) % 1;
    const x = x0 + f * (x1 - x0);
    const decay = Math.exp(-k * f);
    const alive = decay > (1 - t) * 0.9;
    dots.push({ x, yBase: y1, decay, alive, jitter: ((i * 97) % 40) - 20 });
  }
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block', maxHeight: '76vh' }}>
      {/* axes */}
      <line x1={x0} y1={y1} x2={x1} y2={y1} stroke={INK.ruleHard} strokeWidth="1.5" />
      <line x1={x0} y1={y0} x2={x0} y2={y1} stroke={INK.ruleHard} strokeWidth="1.5" />
      <text x={x0} y={y1 + 28} fill={INK.muted} style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em' }}>TIME →</text>
      <text x={x0 - 14} y={y0 - 8} fill={INK.muted} style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em' }}>MEMORY</text>
      {/* decaying dots */}
      {dots.map((d, i) => (
        <circle key={i} cx={d.x} cy={y1 - d.decay * (y1 - y0) + 0} r={d.alive ? 3 : 2}
          fill={d.alive ? INK.blue : INK.rule} opacity={d.alive ? 0.9 : 0.4} />
      ))}
      {/* the forgetting curve, drawn by scroll */}
      <path d={curveD} fill="none" stroke={INK.ink} strokeWidth="3" strokeLinecap="round" />
      {/* review boost — a second curve jumping back up */}
      {showReview && (
        <path d={`M ${x0 + 0.42 * (x1 - x0)} ${y1 - Math.exp(-k * 0.42) * (y1 - y0)}
          C ${x0 + 0.45 * (x1 - x0)} ${y0 + 8}, ${x0 + 0.5 * (x1 - x0)} ${y0 + 8}, ${x0 + 0.52 * (x1 - x0)} ${y0 + 20}`}
          fill="none" stroke={INK.blue} strokeWidth="2.5" strokeDasharray="4 4" opacity="0.9" />
      )}
      {/* spaced reviews — vertical ticks */}
      {showSpaced && [0.52, 0.68, 0.85].map((f, i) => (
        <g key={i}>
          <line x1={x0 + f * (x1 - x0)} y1={y0 + 14} x2={x0 + f * (x1 - x0)} y2={y1}
            stroke={INK.blue} strokeWidth="1.5" strokeDasharray="2 5" opacity="0.6" />
          <circle cx={x0 + f * (x1 - x0)} cy={y0 + 14} r="5" fill={INK.blue} />
        </g>
      ))}
    </svg>
  );
}

// a scroll step — reports when it's centered
function Step({ children, onActive, idx, active }) {
  const ref = useRF(null);
  useEF(() => {
    function check() {
      const el = ref.current; if (!el) return;
      const scroller = el.closest('[data-scroller]'); if (!scroller) return;
      const sr = scroller.getBoundingClientRect();
      const r = el.getBoundingClientRect();
      const center = sr.top + sr.height * 0.5;
      if (r.top < center && r.bottom > center) onActive(idx);
    }
    const scroller = ref.current?.closest('[data-scroller]');
    scroller && scroller.addEventListener('scroll', check);
    check();
    return () => scroller && scroller.removeEventListener('scroll', check);
  }, [idx, onActive]);
  return (
    <div ref={ref} style={{ minHeight: '72vh', display: 'flex', alignItems: 'center',
      opacity: active ? 1 : 0.32, transition: 'opacity .3s ease' }}>
      <div style={{ background: INK.paper, border: `1.5px solid ${INK.ruleHard}`, padding: '22px 24px',
        maxWidth: 420 }}>{children}</div>
    </div>
  );
}

function InkFree() {
  const scRef = useRF(null);
  const [t, setT] = useSF(0);         // progress through charted section
  const [step, setStep] = useSF(0);

  function onScroll() {
    const el = scRef.current; if (!el) return;
    const chart = el.querySelector('[data-chart-section]');
    if (chart) {
      const cr = chart.getBoundingClientRect();
      const sr = el.getBoundingClientRect();
      const prog = (sr.top + sr.height * 0.5 - cr.top) / cr.height;
      setT(Math.min(1, Math.max(0, prog)));
    }
  }

  return (
    <InkChrome current="writing" foot="maxubrq.space / free">
      <div data-scroller ref={scRef} onScroll={onScroll} className="ink-scroll"
        style={{ height: 760, overflowY: 'auto', position: 'relative', scrollBehavior: 'smooth' }}>

        {/* ── FULL-BLEED TITLE ── */}
        <section style={{ minHeight: 760, background: INK.blue, color: '#fff', display: 'flex',
          flexDirection: 'column', justifyContent: 'center', padding: '0 8%', position: 'relative' }}>
          <div style={{ fontFamily: MONO, fontSize: 12, letterSpacing: '0.22em', textTransform: 'uppercase',
            opacity: 0.8, marginBottom: 20 }}>maxubrq · a free reading · scroll ↓</div>
          <h1 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 'clamp(48px, 9vw, 116px)', lineHeight: 0.9,
            letterSpacing: '-0.05em', margin: 0, textTransform: 'lowercase' }}>
            the shape<br />of forgetting.
          </h1>
          <p style={{ fontFamily: BODY, fontSize: 19, lineHeight: 1.55, maxWidth: '46ch', marginTop: 28, opacity: 0.92 }}>
            An hour after you finish this sentence, most of it will be gone. Watch how — and watch what
            brings it back. Scroll.
          </p>
          <div style={{ position: 'absolute', bottom: 30, left: '8%', fontFamily: MONO, fontSize: 11,
            letterSpacing: '0.15em', opacity: 0.7 }}>▽ a “free” piece — no column, no rules</div>
        </section>

        {/* ── STICKY SCROLLYTELLING STAGE ── */}
        <section data-chart-section style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
          {/* sticky graphic */}
          <div style={{ position: 'sticky', top: 0, height: 760, display: 'flex', flexDirection: 'column',
            justifyContent: 'center', padding: '0 30px', borderRight: `1.5px solid ${INK.ruleHard}` }}>
            <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase',
              color: INK.muted, marginBottom: 14 }}>ebbinghaus, redrawn · step {step + 1} / 4</div>
            <ForgettingStage t={t} step={step} />
          </div>
          {/* scrolling steps */}
          <div style={{ padding: '0 42px' }}>
            <Step idx={0} active={step === 0} onActive={setStep}>
              <div style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 26, letterSpacing: '-0.02em',
                lineHeight: 1.1, textTransform: 'lowercase', color: INK.blue, marginBottom: 10 }}>right now, it’s all here.</div>
              <p style={{ fontFamily: BODY, fontSize: 16.5, lineHeight: 1.6, margin: 0, color: INK.ink }}>
                The moment you read something, retention is near total. The curve starts at the top — every
                dot lit. This is the illusion that makes us think we’ll remember.</p>
            </Step>
            <Step idx={1} active={step === 1} onActive={setStep}>
              <div style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 26, letterSpacing: '-0.02em',
                lineHeight: 1.1, textTransform: 'lowercase', color: INK.blue, marginBottom: 10 }}>then it falls, fast.</div>
              <p style={{ fontFamily: BODY, fontSize: 16.5, lineHeight: 1.6, margin: 0, color: INK.ink }}>
                Within a day the curve plunges. The dots go grey. Not because you were careless — because
                this is what memory is built to do: keep the gist, drop the detail.</p>
            </Step>
            <Step idx={2} active={step === 2} onActive={setStep}>
              <div style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 26, letterSpacing: '-0.02em',
                lineHeight: 1.1, textTransform: 'lowercase', color: INK.blue, marginBottom: 10 }}>one review resets it.</div>
              <p style={{ fontFamily: BODY, fontSize: 16.5, lineHeight: 1.6, margin: 0, color: INK.ink }}>
                Return to it once — the dashed line jumps back up. But it will fall again, a little slower
                this time. A single review is not enough; it only buys you a gentler slope.</p>
            </Step>
            <Step idx={3} active={step === 3} onActive={setStep}>
              <div style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 26, letterSpacing: '-0.02em',
                lineHeight: 1.1, textTransform: 'lowercase', color: INK.blue, marginBottom: 10 }}>spaced, it stays.</div>
              <p style={{ fontFamily: BODY, fontSize: 16.5, lineHeight: 1.6, margin: 0, color: INK.ink }}>
                Review at widening intervals and each rise decays slower than the last. The blue ticks are
                the reviews. This is the whole trick — not more effort, better timing.</p>
            </Step>
          </div>
        </section>

        {/* ── FULL-BLEED PULL MOMENT ── */}
        <section style={{ minHeight: 620, background: INK.ink, color: '#fff', display: 'flex',
          alignItems: 'center', padding: '0 8%' }}>
          <blockquote style={{ margin: 0, fontFamily: DISPLAY, fontWeight: 500, fontSize: 'clamp(30px, 5vw, 62px)',
            lineHeight: 1.1, letterSpacing: '-0.03em', textTransform: 'lowercase', maxWidth: '18ch' }}>
            you don’t have a bad memory. you have an <span style={{ color: INK.blue, background: '#fff', padding: '0 .1em' }}>untimed</span> one.
          </blockquote>
        </section>

        {/* ── OUTRO ── */}
        <section style={{ minHeight: 480, display: 'flex', flexDirection: 'column', justifyContent: 'center',
          padding: '0 8%' }}>
          <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase',
            color: INK.muted, marginBottom: 16 }}>the end — a free piece</div>
          <p style={{ fontFamily: BODY, fontSize: 20, lineHeight: 1.6, maxWidth: '54ch', color: INK.ink, margin: 0 }}>
            Everything above ignored the reading column, the flow rules, the quiet chrome. That’s what
            <strong> Free</strong> is for: when the idea wants the whole screen and its own motion. Most
            pieces don’t. This one did.
          </p>
          <div style={{ display: 'flex', gap: 12, marginTop: 26 }}>
            <a href="#" style={{ fontFamily: MONO, fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase',
              border: `1.5px solid ${INK.ruleHard}`, padding: '12px 18px', color: INK.ink, textDecoration: 'none' }}>↑ back to top</a>
          </div>
        </section>
      </div>
    </InkChrome>
  );
}

Object.assign(window, { InkFree });
