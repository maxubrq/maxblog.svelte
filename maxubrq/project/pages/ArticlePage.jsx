// ArticlePage.jsx — book-reading experience.
// Chapter-style masthead, drop cap, running head + folio, fleuron section
// breaks, hand-set pullquote with ornamental rules, sim styled as "Plate I",
// end mark, proper serif typography (ligatures, tabular figures, small caps).

const { useState, useEffect, useRef, useMemo } = React;

// ── Palettes ─────────────────────────────────────────────────────────
const PALETTES = {
  warm: {
    light: { '--paper': '#faf6ec', '--paper2': '#f3ecdc', '--ink': '#1a1814', '--muted': 'rgba(26,24,20,0.55)',
      '--rule': 'rgba(26,24,20,0.22)', '--accent': '#a1432b', '--sim-bg': '#efe8d4' },
    dark:  { '--paper': '#1a1814', '--paper2': '#141210', '--ink': '#ede5d0', '--muted': 'rgba(237,229,208,0.55)',
      '--rule': 'rgba(237,229,208,0.22)', '--accent': '#e09060', '--sim-bg': '#13110e' },
  },
  ink: {
    light: { '--paper': '#f6f5f0', '--paper2': '#edece6', '--ink': '#141619', '--muted': 'rgba(20,22,25,0.55)',
      '--rule': 'rgba(20,22,25,0.22)', '--accent': '#2f5fa6', '--sim-bg': '#ebe9e1' },
    dark:  { '--paper': '#141619', '--paper2': '#0e1013', '--ink': '#e6e8eb', '--muted': 'rgba(230,232,235,0.55)',
      '--rule': 'rgba(230,232,235,0.22)', '--accent': '#7fa9d8', '--sim-bg': '#0e1013' },
  },
  prussian: {
    light: { '--paper': '#f3eedf', '--paper2': '#ebe5d3', '--ink': '#0f2942', '--muted': 'rgba(15,41,66,0.55)',
      '--rule': 'rgba(15,41,66,0.22)', '--accent': '#a8542b', '--sim-bg': '#e5dfcc' },
    dark:  { '--paper': '#0f2942', '--paper2': '#0a2036', '--ink': '#ede5d0', '--muted': 'rgba(237,229,208,0.55)',
      '--rule': 'rgba(237,229,208,0.22)', '--accent': '#e89464', '--sim-bg': '#0a2036' },
  },
  slate: {
    light: { '--paper': '#f5f3ec', '--paper2': '#ecead9', '--ink': '#0b1220', '--muted': 'rgba(11,18,32,0.55)',
      '--rule': 'rgba(11,18,32,0.2)', '--accent': '#2758b8', '--sim-bg': '#e8e6d5' },
    dark:  { '--paper': '#0b1220', '--paper2': '#07101c', '--ink': '#e8ecf3', '--muted': 'rgba(232,236,243,0.55)',
      '--rule': 'rgba(232,236,243,0.22)', '--accent': '#7aa6e8', '--sim-bg': '#07101c' },
  },
  oxford: {
    light: { '--paper': '#f1ebdc', '--paper2': '#e9e2cd', '--ink': '#1a2b4a', '--muted': 'rgba(26,43,74,0.55)',
      '--rule': 'rgba(26,43,74,0.22)', '--accent': '#8a5a1f', '--sim-bg': '#e3dcc5' },
    dark:  { '--paper': '#101826', '--paper2': '#0a111d', '--ink': '#ede8d8', '--muted': 'rgba(237,232,216,0.55)',
      '--rule': 'rgba(237,232,216,0.22)', '--accent': '#d4b26a', '--sim-bg': '#0a111d' },
  },
};
window.PALETTES = PALETTES;

const getPalette = (palette = 'warm', theme = 'light') =>
  (PALETTES[palette] || PALETTES.warm)[theme === 'dark' ? 'dark' : 'light'];
window.getPalette = getPalette;

// ── Pendulum sim, styled as a book plate ─────────────────────────────
function PendulumSim({ theme, palette }) {
  const canvasRef = useRef(null);
  const [length, setLength] = useState(140);
  const [gravity, setGravity] = useState(9.8);
  const [damping, setDamping] = useState(0.002);
  const [playing, setPlaying] = useState(true);
  const stateRef = useRef({ angle: Math.PI / 3, vel: 0 });

  useEffect(() => {
    const cvs = canvasRef.current; if (!cvs) return;
    const ctx = cvs.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const resize = () => {
      const r = cvs.getBoundingClientRect();
      cvs.width = r.width * dpr; cvs.height = r.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize); ro.observe(cvs);

    let raf;
    const trail = [];
    let last = performance.now();
    const loop = (t) => {
      const dt = Math.min(0.033, (t - last) / 1000); last = t;
      const w = cvs.clientWidth, h = cvs.clientHeight;
      const pivot = { x: w / 2, y: 60 };

      if (playing) {
        const s = stateRef.current;
        const acc = -(gravity / (length / 60)) * Math.sin(s.angle);
        s.vel += acc * dt;
        s.vel *= (1 - damping);
        s.angle += s.vel * dt;
      }
      const s = stateRef.current;
      const bob = { x: pivot.x + Math.sin(s.angle) * length, y: pivot.y + Math.cos(s.angle) * length };
      trail.push(bob); if (trail.length > 100) trail.shift();

      const p = getPalette(palette, theme);
      const ink = p['--ink'];
      const muted = p['--rule'];
      const accent = p['--accent'];

      ctx.clearRect(0, 0, w, h);

      // arc of possible swing (hairline)
      ctx.strokeStyle = muted; ctx.lineWidth = 0.6; ctx.setLineDash([2, 3]);
      ctx.beginPath(); ctx.arc(pivot.x, pivot.y, length, 0, Math.PI, false); ctx.stroke();
      ctx.setLineDash([]);

      // tick marks every 30°
      ctx.strokeStyle = muted; ctx.lineWidth = 0.8;
      for (let deg = -90; deg <= 90; deg += 30) {
        const rad = (deg + 90) * Math.PI / 180;
        const x1 = pivot.x + Math.cos(rad) * (length - 4);
        const y1 = pivot.y + Math.sin(rad) * (length - 4);
        const x2 = pivot.x + Math.cos(rad) * (length + 4);
        const y2 = pivot.y + Math.sin(rad) * (length + 4);
        ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      }

      // trail
      ctx.strokeStyle = accent; ctx.lineWidth = 1.1;
      for (let i = 1; i < trail.length; i++) {
        ctx.globalAlpha = (i / trail.length) * 0.55;
        ctx.beginPath(); ctx.moveTo(trail[i - 1].x, trail[i - 1].y); ctx.lineTo(trail[i].x, trail[i].y); ctx.stroke();
      }
      ctx.globalAlpha = 1;

      // string
      ctx.strokeStyle = ink; ctx.lineWidth = 0.8;
      ctx.beginPath(); ctx.moveTo(pivot.x, pivot.y); ctx.lineTo(bob.x, bob.y); ctx.stroke();

      // pivot
      ctx.fillStyle = ink;
      ctx.beginPath(); ctx.arc(pivot.x, pivot.y, 2.5, 0, Math.PI * 2); ctx.fill();

      // bob (filled circle with hairline)
      ctx.fillStyle = ink;
      ctx.beginPath(); ctx.arc(bob.x, bob.y, 9, 0, Math.PI * 2); ctx.fill();

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [length, gravity, damping, playing, theme, palette]);

  const Knob = ({ label, value, min, max, step, unit, onChange }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1, minWidth: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--serif)',
        fontSize: 12, fontStyle: 'italic', color: 'var(--muted)' }}>
        <span>{label}</span>
        <span style={{ fontVariantNumeric: 'tabular-nums', fontStyle: 'normal', color: 'var(--ink)' }}>
          {Number(value).toFixed(step < 1 ? 3 : 0)}{unit}
        </span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={{ width: '100%' }} />
    </div>
  );

  const reset = () => { stateRef.current = { angle: Math.PI / 3, vel: 0 }; };

  return (
    <figure style={{ margin: '2.6em 0', position: 'relative' }}>
      {/* double-rule top */}
      <div style={{ borderTop: '1px solid var(--rule)', borderBottom: '1px solid var(--rule)',
        height: 3, marginBottom: 20 }} />
      <div style={{ textAlign: 'center', fontFamily: 'var(--serif)', fontSize: 13,
        fontVariant: 'small-caps', letterSpacing: '0.18em', color: 'var(--muted)', marginBottom: 14 }}>
        Plate I · The Simple Pendulum
      </div>

      <div style={{ background: 'var(--sim-bg)', height: 260, position: 'relative',
        border: '1px solid var(--rule)' }}>
        <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
        <div style={{ position: 'absolute', top: 10, left: 12, fontFamily: 'var(--serif)',
          fontSize: 11, fontStyle: 'italic', color: 'var(--muted)' }}>fig. 1</div>
        <div style={{ position: 'absolute', top: 10, right: 12, display: 'flex', gap: 16 }}>
          <button onClick={reset}
            style={{ background: 'transparent', border: 'none', color: 'var(--muted)',
              fontFamily: 'var(--serif)', fontSize: 12, fontStyle: 'italic', cursor: 'pointer',
              padding: 0, borderBottom: '1px solid var(--rule)' }}>reset</button>
          <button onClick={() => setPlaying((p) => !p)}
            style={{ background: 'transparent', border: 'none', color: 'var(--ink)',
              fontFamily: 'var(--serif)', fontSize: 12, fontStyle: 'italic', cursor: 'pointer',
              padding: 0, borderBottom: '1px solid var(--ink)' }}>
            {playing ? 'pause' : 'play'}</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 28, marginTop: 20, padding: '0 4px' }}>
        <Knob label="length" value={length} min={60} max={220} step={1} unit="" onChange={setLength} />
        <Knob label="gravity" value={gravity} min={1} max={25} step={0.1} unit="" onChange={setGravity} />
        <Knob label="damping" value={damping} min={0} max={0.02} step={0.001} unit="" onChange={setDamping} />
      </div>

      <figcaption style={{ fontFamily: 'var(--serif)', fontSize: 13.5, fontStyle: 'italic',
        marginTop: 22, color: 'var(--muted)', lineHeight: 1.6, textAlign: 'center',
        maxWidth: '44ch', marginLeft: 'auto', marginRight: 'auto' }}>
        A pendulum is a first-order differential equation once you linearize,
        and a chaotic system once you do not. Try pulling damping to zero.
      </figcaption>

      <div style={{ borderTop: '1px solid var(--rule)', marginTop: 22 }} />
    </figure>
  );
}

// ── Footnote — Tufte-style hover card ────────────────────────────────
function Footnote({ n, children }) {
  const [show, setShow] = useState(false);
  return (
    <span style={{ position: 'relative' }}>
      <sup onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}
        style={{ color: 'var(--accent)', cursor: 'help', fontFamily: 'var(--serif)',
          fontSize: '0.72em', padding: '0 1px', fontWeight: 500, fontVariantNumeric: 'oldstyle-nums' }}>
        {n}
      </sup>
      {show && (
        <span style={{ position: 'absolute', bottom: 'calc(100% + 8px)', left: 0, zIndex: 20,
          minWidth: 280, maxWidth: 360, background: 'var(--paper)',
          border: '1px solid var(--rule)', padding: '12px 16px',
          fontFamily: 'var(--serif)', fontSize: 14, lineHeight: 1.55, color: 'var(--ink)',
          boxShadow: '0 6px 24px rgba(0,0,0,0.1)' }}>
          <span style={{ fontStyle: 'italic', color: 'var(--muted)', marginRight: 6 }}>{n}.</span>
          {children}
        </span>
      )}
    </span>
  );
}

// ── Heading with section ornament ────────────────────────────────────
function H2({ id, children, num }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div style={{ margin: '2.6em 0 0.8em', textAlign: 'center', position: 'relative' }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div style={{ fontFamily: 'var(--serif)', fontSize: 12, fontVariant: 'small-caps',
        letterSpacing: '0.22em', color: 'var(--muted)', marginBottom: 10 }}>§ {num}</div>
      <h2 id={id} style={{ fontFamily: 'var(--serif)', fontWeight: 500, fontSize: '1.55em',
        lineHeight: 1.25, margin: 0, letterSpacing: '-0.005em', fontStyle: 'italic' }}>
        {children}
      </h2>
      <a href={`#${id}`} style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)',
        color: 'var(--muted)', textDecoration: 'none', opacity: hovered ? 0.7 : 0,
        transition: 'opacity 0.2s', fontSize: 14, fontFamily: 'var(--serif)' }}>¶</a>
    </div>
  );
}

// ── Fleuron section break ────────────────────────────────────────────
function Fleuron() {
  return (
    <div style={{ textAlign: 'center', margin: '2em 0', color: 'var(--muted)',
      fontFamily: 'var(--serif)', fontSize: 18, letterSpacing: '0.8em' }}>
      ❦
    </div>
  );
}

// ── Sidenote ─────────────────────────────────────────────────────────
function Sidenote({ children, layout, n }) {
  if (layout === 'sidenote') {
    return (
      <aside style={{ position: 'absolute', left: 'calc(100% + 48px)', width: 240,
        fontFamily: 'var(--serif)', fontSize: 13.5, fontStyle: 'italic',
        lineHeight: 1.55, color: 'var(--muted)', top: 4 }}>
        {n && <span style={{ fontStyle: 'normal', color: 'var(--accent)', marginRight: 6 }}>{n}.</span>}
        {children}
      </aside>
    );
  }
  return (
    <aside style={{ fontFamily: 'var(--serif)', fontSize: 15, fontStyle: 'italic',
      lineHeight: 1.55, color: 'var(--muted)', textAlign: 'center',
      maxWidth: '44ch', margin: '1.6em auto' }}>
      — {children} —
    </aside>
  );
}

// ── Article — printable editorial pages ──────────────────────────────
const ARTICLE_NOTES = [
  { n: 1, text: 'Or so the story goes. The chandelier that stands there now was hung after his death, but the observation itself is well documented in his Discorsi.' },
  { n: 2, text: 'The double pendulum is one of the canonical simple systems that exhibits deterministic chaos. Its phase space is four-dimensional, which is one more than the eye can hold.' },
];

const pIndent = { margin: '0 0 0.85em', textIndent: '1.5em' };

function articlePrintPages() {
  // Page 1 — masthead + opening, single wide measure then two columns
  const page1 = (
    <React.Fragment>
      <EdMasthead kicker="being a consideration of determinism, and that which lies beyond it"
        title="The Horizon of a Pendulum" subtitle="& other small infinities"
        byline="By maxubrq" meta={['14 April 2026', '9 min read']} />
      <EdColumns>
        <EdLede dropcap="A">
          <span style={{ fontVariant: 'small-caps' }}> pendulum</span> is the simplest machine worth
          thinking about. A weight, a string, a pivot — that is all. Galileo watched a chandelier in a
          Pisa cathedral and timed it with his pulse<sup style={{ color: 'var(--accent)', fontSize: '0.7em' }}>1</sup>,
          and the pattern he noticed — that the period barely depends on how far you pull it — has been
          the foundation of clocks, metronomes, and a surprising amount of physics ever since.
        </EdLede>
        <p style={pIndent}>
          And yet: pull it far enough, and the same pendulum becomes unpredictable. Not statistically
          — <em>actually</em>. The equation that describes it is deterministic, solvable in principle,
          and produces behavior you can simulate but cannot forecast. This is the fact I want to sit with.
        </p>
        <EdSectionHead num="I">The pendulum</EdSectionHead>
        <p style={{ margin: '0 0 0.85em' }}>
          Here is the equation, in the form most textbooks give it:
        </p>
        <EdEquation>d²θ/dt² + (g/L)·sin θ = 0</EdEquation>
        <p style={pIndent}>
          The angle θ, the gravitational constant g, the length L. That is the entire state of the
          world, as far as a pendulum is concerned. The sine is the interesting character in the
          sentence — it keeps the restoring force pointing toward zero, and it is what makes the
          equation nonlinear.
        </p>
        <p style={pIndent}>
          Everything that follows is a consequence of that one curved term. Remove it — pretend the
          angle is always small — and you get a clock. Keep it, and you get weather.
        </p>
      </EdColumns>
    </React.Fragment>
  );

  // Page 2 — figure plate spanning, then the chaos section in columns w/ pullquote
  const page2 = (
    <React.Fragment>
      <EdFigure height={230} label="plate i — the simple pendulum"
        caption="Fig. 1 — A pendulum is a first-order differential equation once you linearize, and a chaotic system once you do not. In the reading view this plate is a live simulation." />
      <EdSectionHead num="II">When the small angle breaks</EdSectionHead>
      <EdColumns>
        <p style={{ margin: '0 0 0.85em' }}>
          For small θ, sin θ ≈ θ, and the equation becomes a spring. Clean, periodic, boring in a
          good way. This is the small-angle approximation, and it is the reason the pendulum in a
          grandfather clock keeps better time than most of your friends.
        </p>
        <p style={pIndent}>
          Push θ past about thirty degrees, though, and the approximation starts to lie. The period
          grows with amplitude. Add a second pendulum — hang one off the first — and the lie becomes
          a cascade<sup style={{ color: 'var(--accent)', fontSize: '0.7em' }}>2</sup>. Two identical
          double pendulums, started from angles that differ by a thousandth of a degree, will be in
          entirely different places a minute later. Not noisy. Not drifting. <em>Different.</em>
        </p>
      </EdColumns>
      <EdPullquote>Determinism gives you the equation. It does not give you the future.</EdPullquote>
      <EdColumns>
        <p style={{ margin: '0 0 0.85em' }}>
          The first time I watched it happen on a screen I assumed the simulation had a bug. It did
          not. The two pendulums had simply been handed very slightly different numbers.
        </p>
        <p style={{ margin: '0 0 0.85em' }}>
          The equation did the rest — patiently, exactly, and without the smallest regard for the
          fact that I could no longer say what it would do next.
        </p>
      </EdColumns>
    </React.Fragment>
  );

  // Page 3 — Lyapunov + closing, two columns, notes at foot
  const page3 = (
    <React.Fragment>
      <EdSectionHead num="III">Lyapunov, or: the horizon</EdSectionHead>
      <EdColumns>
        <p style={{ margin: '0 0 0.85em' }}>
          The rate at which two nearby trajectories pull apart has a name: the Lyapunov exponent. A
          positive one means small errors grow exponentially. Double the precision of your measurement
          and you buy a fixed amount of time — maybe a few seconds, maybe a few hours. After that, you
          are guessing.
        </p>
        <p style={pIndent}>
          This is the horizon I mean. Not a wall, but a fog: the far distance where even a perfect
          model, run on a perfect computer, stops being able to tell you what the pendulum is doing,
          because the tiniest rounding error has grown into the whole answer.
        </p>
        <EdSectionHead num="IV">A closing note</EdSectionHead>
        <p style={{ margin: '0 0 0.85em' }}>
          I find this comforting, in a way I do not fully understand. There is a limit to what you can
          know about a string with a weight on it. There is a limit to what you can know about most
          things.
        </p>
        <p style={pIndent}>
          The equation is still there, still clean, still solvable in the way the word is used in a
          math class. The world is still deterministic. And yet, past a certain horizon, the pendulum
          and you are both free.
        </p>
      </EdColumns>
      <div style={{ textAlign: 'center', margin: '0.6em 0 1em', color: 'var(--accent)' }}>■</div>
      <EdNotes notes={ARTICLE_NOTES} />
    </React.Fragment>
  );

  return [page1, page2, page3];
}

function ArticlePage({ theme = 'light', fontPair = 'newsreader', layout = 'single', framing = 'rule', palette = 'warm' }) {
  const [mode, setMode] = useState(layout === 'sidenote' ? 'study' : 'flow');
  const [progress, setProgress] = useState(0);
  const [fontSize, setFontSize] = useState(18);
  const [activeSection, setActiveSection] = useState('opening');
  const [reactionToast, setReactionToast] = useState(null);
  const scrollerRef = useRef(null);
  const articleRef = useRef(null);

  useEffect(() => {
    if (!reactionToast) return;
    const t = setTimeout(() => setReactionToast(null), 2200);
    return () => clearTimeout(t);
  }, [reactionToast]);

  const serif = fontPair === 'newsreader' ? '"Newsreader", Georgia, serif'
    : fontPair === 'source' ? '"Source Serif 4", Georgia, serif'
    : fontPair === 'lora' ? '"Lora", Georgia, serif'
    : '"EB Garamond", Georgia, serif';

  const sans = '"IBM Plex Sans", -apple-system, sans-serif';

  useEffect(() => {
    const el = scrollerRef.current; if (!el) return;
    const onScroll = () => {
      const p = el.scrollTop / (el.scrollHeight - el.clientHeight);
      setProgress(Math.max(0, Math.min(1, p)));
      const headings = el.querySelectorAll('h2[id]');
      let active = 'opening';
      for (const h of headings) {
        if (h.getBoundingClientRect().top - el.getBoundingClientRect().top < 180) active = h.id;
      }
      setActiveSection(active);
    };
    el.addEventListener('scroll', onScroll); onScroll();
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  const toc = [
    { id: 'opening',       label: 'Opening',                     num: 'I',   min: 1 },
    { id: 'the-pendulum',  label: 'The pendulum',                num: 'II',  min: 2 },
    { id: 'chaos',         label: 'When the small angle breaks', num: 'III', min: 3 },
    { id: 'lyapunov',      label: 'Lyapunov, or: the horizon',   num: 'IV',  min: 2 },
    { id: 'closing',       label: 'A closing note',              num: 'V',   min: 1 },
  ];
  const totalMin = toc.reduce((a, t) => a + t.min, 0);

  // ── Per-section reading-time remaining ──
  // Based on the current active section: time left = remaining sections' time,
  // prorated by how far through the active section we are.
  const activeIdx = Math.max(0, toc.findIndex((t) => t.id === activeSection));
  const minLeft = useMemo(() => {
    const past = toc.slice(0, activeIdx).reduce((a, t) => a + t.min, 0);
    const inActive = toc[activeIdx]?.min || 0;
    // progress through this section — crude but readable: assume sections take up
    // equal vertical space; refine later with real section offsets.
    const sectionSpan = 1 / toc.length;
    const withinSec = Math.min(1, Math.max(0, (progress - activeIdx * sectionSpan) / sectionSpan));
    const left = totalMin - past - withinSec * inActive;
    return Math.max(0, Math.round(left * 10) / 10);
  }, [progress, activeIdx]);

  const [glossaryUsed, setGlossaryUsed] = useState(new Set());
  const addGlossaryTerm = React.useCallback((id) => {
    setGlossaryUsed((s) => {
      if (s.has(id)) return s;
      const next = new Set(s); next.add(id); return next;
    });
  }, []);
  // Expose to <Term> via window (avoids restructuring the JSX tree).
  useEffect(() => {
    window.__glossaryCollect = addGlossaryTerm;
    return () => { if (window.__glossaryCollect === addGlossaryTerm) delete window.__glossaryCollect; };
  }, [addGlossaryTerm]);

  const vars = getPalette(palette, theme);
  const showMarginNotes = mode === 'study';

  if (mode === 'print') {
    return (
      <PrintDeck theme={theme} palette={palette} serif={serif} sans={sans}
        title="The Horizon of a Pendulum" mode={mode} onModeChange={setMode}
        pages={articlePrintPages()} />
    );
  }

  // Page number feel — derive a fake folio from progress (iii–xlii style)
  const folio = Math.max(1, Math.round(progress * 24 + 1));
  const romanize = (n) => {
    const map = [['xl',40],['x',10],['ix',9],['v',5],['iv',4],['i',1]];
    let s = ''; for (const [r, v] of map) while (n >= v) { s += r; n -= v; } return s;
  };

  const activeLabel = (toc.find((t) => t.id === activeSection) || toc[0]).label;

  return (
    <div style={{
      ...vars, '--serif': serif, '--sans': sans,
      height: '100%', overflow: 'hidden', position: 'relative',
      background: 'var(--paper)', color: 'var(--ink)',
      fontFamily: serif,
      backgroundImage: 'radial-gradient(ellipse at top, var(--paper) 0%, var(--paper2) 100%)',
    }}>
      <ModeSwitcher mode={mode} onChange={setMode} serif={serif} />
      {/* hair progress bar at very top */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'var(--rule)', zIndex: 10 }}>
        <div style={{ height: '100%', width: `${progress * 100}%`, background: 'var(--accent)', transition: 'width 0.08s' }} />
      </div>

      {/* Running head — book page style */}
      <header style={{ position: 'absolute', top: 0, left: 0, right: 0,
        display: 'grid', gridTemplateColumns: '1fr auto 1fr',
        alignItems: 'center', padding: '22px 56px 0', zIndex: 5,
        fontFamily: serif, fontSize: 12, color: 'var(--muted)',
        fontVariant: 'small-caps', letterSpacing: '0.2em' }}>
        <a href="#" style={{ color: 'inherit', textDecoration: 'none', justifySelf: 'start' }}>
          maxubrq
        </a>
        <span style={{ justifySelf: 'center', fontStyle: 'italic', fontVariant: 'normal',
          letterSpacing: 0, fontSize: 12.5, color: 'var(--muted)' }}>
          {activeLabel}
        </span>
        <span style={{ justifySelf: 'end', fontVariantNumeric: 'oldstyle-nums',
          fontVariant: 'normal', letterSpacing: 0 }}>
          {romanize(folio)}
        </span>
      </header>

      {/* Scroller */}
      <div ref={scrollerRef} style={{ height: '100%', overflowY: 'auto', overflowX: 'hidden',
        paddingTop: 56, paddingBottom: 120 }}>
        <div style={{ display: 'grid',
          gridTemplateColumns: showMarginNotes ? '1fr 600px 260px 1fr' : '1fr 600px 1fr',
          gap: showMarginNotes ? '0 56px' : 0, alignItems: 'start', position: 'relative' }}>

          {/* Sticky TOC — book "Contents" page */}
          <aside style={{ gridColumn: 1, position: 'sticky', top: 80, alignSelf: 'start',
            paddingLeft: 56, paddingRight: 32, fontFamily: serif, fontSize: 13,
            maxWidth: 230, justifySelf: 'end' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between',
              alignItems: 'baseline', marginBottom: 14,
              paddingBottom: 10, borderBottom: '1px solid var(--rule)' }}>
              <span style={{ fontVariant: 'small-caps', letterSpacing: '0.22em', fontSize: 11,
                color: 'var(--muted)' }}>Contents</span>
              <span style={{ fontFamily: serif, fontStyle: 'italic', fontSize: 11.5,
                color: 'var(--accent)', fontVariantNumeric: 'oldstyle-nums' }}>
                {minLeft < 0.4 ? 'nearly done' : `${minLeft < 1 ? '<1' : Math.round(minLeft)} min left`}
              </span>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex',
              flexDirection: 'column', gap: 12 }}>
              {toc.map((t, i) => {
                const isActive = activeSection === t.id;
                const isPast = i < activeIdx;
                return (
                  <li key={t.id} style={{ position: 'relative' }}>
                    {isActive && (
                      <span style={{ position: 'absolute', left: -14, top: 4, bottom: 4,
                        width: 2, background: 'var(--accent)' }} />
                    )}
                    <a href={`#${t.id}`} style={{
                      color: isActive ? 'var(--ink)' : 'var(--muted)',
                      textDecoration: 'none',
                      display: 'grid', gridTemplateColumns: '22px 1fr auto', alignItems: 'baseline',
                      gap: 4, fontStyle: isActive ? 'italic' : 'normal',
                      lineHeight: 1.4, transition: 'all 0.2s',
                      opacity: isPast ? 0.5 : 1,
                    }}>
                      <span style={{ fontVariant: 'small-caps', letterSpacing: '0.1em',
                        fontSize: 10.5, color: isActive ? 'var(--accent)' : 'var(--muted)' }}>
                        {t.num}.
                      </span>
                      <span style={{ textDecoration: isPast ? 'line-through' : 'none',
                        textDecorationColor: 'var(--rule)' }}>{t.label}</span>
                      <span style={{ fontVariantNumeric: 'oldstyle-nums',
                        color: isActive ? 'var(--accent)' : 'var(--muted)',
                        fontSize: 10.5, fontStyle: 'italic' }}>
                        {t.min}m
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
            <div style={{ marginTop: 16, paddingTop: 12, borderTop: '1px solid var(--rule)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
              fontSize: 10.5, color: 'var(--muted)', fontVariant: 'small-caps',
              letterSpacing: '0.2em' }}>
              <span>Total</span>
              <span style={{ fontVariantNumeric: 'oldstyle-nums', letterSpacing: 0,
                fontVariant: 'normal', fontStyle: 'italic', fontSize: 12 }}>
                {totalMin} min
              </span>
            </div>

            <div style={{ marginTop: 32, paddingTop: 14, borderTop: '1px solid var(--rule)',
              color: 'var(--muted)', fontSize: 11.5, lineHeight: 1.5, textAlign: 'center' }}>
              <div style={{ fontVariant: 'small-caps', letterSpacing: '0.2em', marginBottom: 8 }}>Type size</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                <button onClick={() => setFontSize((s) => Math.max(15, s - 1))}
                  style={{ border: 'none', background: 'transparent', color: 'var(--ink)',
                    cursor: 'pointer', fontSize: 18, fontFamily: serif, lineHeight: 1,
                    padding: 0 }}>a</button>
                <span style={{ fontFamily: serif, fontSize: 14, fontVariantNumeric: 'tabular-nums' }}>{fontSize}</span>
                <button onClick={() => setFontSize((s) => Math.min(22, s + 1))}
                  style={{ border: 'none', background: 'transparent', color: 'var(--ink)',
                    cursor: 'pointer', fontSize: 24, fontFamily: serif, lineHeight: 1,
                    padding: 0 }}>A</button>
              </div>
            </div>
          </aside>

          {/* Body — book page */}
          <article ref={articleRef} style={{ gridColumn: 2, fontSize, lineHeight: 1.7,
            color: 'var(--ink)', position: 'relative',
            fontFeatureSettings: '"liga", "dlig", "onum", "kern"',
            textRendering: 'optimizeLegibility',
            hyphens: 'auto', textAlign: 'justify' }}>

            {/* Chapter opener — book style masthead */}
            <div style={{ textAlign: 'center', margin: '2em 0 2.4em' }}>
              <div style={{ fontVariant: 'small-caps', letterSpacing: '0.4em',
                fontSize: 12, color: 'var(--muted)', marginBottom: 14 }}>
                Chapter the First
              </div>
              <div style={{ borderTop: '1px solid var(--rule)', borderBottom: '1px solid var(--rule)',
                height: 4, width: 80, margin: '0 auto 22px' }} />
              <h1 style={{ fontFamily: serif, fontWeight: 500, fontSize: '2.3em', lineHeight: 1.12,
                letterSpacing: '-0.015em', margin: '0 0 0.5em', fontStyle: 'normal' }}>
                The Horizon of a Pendulum,
                <br />
                <span style={{ fontStyle: 'italic', fontWeight: 400 }}>&amp; other small infinities</span>
              </h1>
              <div style={{ fontVariant: 'small-caps', letterSpacing: '0.3em', fontSize: 11,
                color: 'var(--muted)', margin: '22px 0 8px' }}>
                being a consideration of determinism
                <br />
                and that which lies beyond it
              </div>
              <div style={{ color: 'var(--muted)', fontSize: 13, fontStyle: 'italic',
                marginTop: 16 }}>
                By maxubrq · 14 April 2026 · nine minutes
              </div>
            </div>

            <section id="opening" style={{ position: 'relative' }}>
              <p style={{ margin: '0 0 1em' }}>
                <span style={{ float: 'left', fontFamily: serif, fontWeight: 500,
                  fontSize: '5.2em', lineHeight: 0.85, paddingTop: '0.08em',
                  paddingRight: '0.12em', color: 'var(--ink)',
                  fontFeatureSettings: '"liga", "dlig"' }}>A</span>
                <span style={{ fontVariant: 'small-caps', letterSpacing: '0.05em' }}> pendulum</span> is
                the simplest machine worth thinking about. A weight, a string, a pivot — that is all.
                Galileo watched a chandelier in a Pisa cathedral and timed it with his pulse<Footnote n="1">Or so the story goes. The chandelier that stands there now was hung after his death, but the observation itself is well documented in his <em>Discorsi</em>.</Footnote>,
                and the pattern he noticed — that the period barely depends on how far you pull it —
                has been the foundation of clocks, metronomes, and a surprising amount of modern
                physics ever since.
              </p>
              <p style={{ margin: '0 0 1em', textIndent: '1.8em' }}>
                And yet: pull it far enough, and the same pendulum becomes unpredictable.
                Not statistically — <em>actually</em>. The equation that describes it is <Term id="deterministic">deterministic</Term>,
                solvable in principle, and produces behavior you can simulate but cannot forecast.
                This is the fact I want to sit with.
              </p>
              {showMarginNotes && (
                <div style={{ position: 'relative', height: 0 }}>
                  <Sidenote layout="sidenote" n="*">
                    &ldquo;Determinism does not imply predictability&rdquo; is one of those sentences
                    that takes a minute to become strange and then stays strange forever.
                  </Sidenote>
                </div>
              )}
              {!showMarginNotes && (
                <Sidenote layout="inline">
                  Determinism does not imply predictability — a sentence that
                  takes a minute to become strange and then stays strange forever.
                </Sidenote>
              )}
            </section>

            <H2 id="the-pendulum" num="II">The pendulum</H2>
            <p style={{ margin: '0 0 1em', textIndent: '1.8em' }}>
              Here is the equation, in the form most textbooks give it — and which, were this
              a proper printed volume, would stand at the foot of the page in a slightly
              smaller size, set apart by a thin rule:
            </p>

            <div style={{ fontFamily: serif, fontSize: '1.05em', fontStyle: 'italic',
              textAlign: 'center', margin: '1.4em 0 1.6em', color: 'var(--ink)',
              letterSpacing: '0.02em' }}>
              d²θ/dt² + (g/L)·sin θ = 0
            </div>

            <p style={{ margin: '0 0 1em', textIndent: '1.8em' }}>
              The angle θ, the gravitational constant g, the length L. That is the entire state
              of the world, as far as a pendulum is concerned. The sine is the interesting
              character in the sentence — it is what keeps the restoring force pointing roughly
              toward zero, and it is also what makes the equation nonlinear.
            </p>

            {/* Interactive — Plate I */}
            {framing === 'rule' && <PendulumSim theme={theme} palette={palette} />}
            {framing === 'bleed' && (
              <div style={{ margin: '2.6em -80px' }}>
                <PendulumSim theme={theme} palette={palette} />
              </div>
            )}
            {framing === 'card' && (
              <div style={{ margin: '2.6em -20px', padding: '4px 24px', background: 'var(--paper2)' }}>
                <PendulumSim theme={theme} palette={palette} />
              </div>
            )}

            <Fleuron />

            <H2 id="chaos" num="III">When the small angle breaks</H2>
            <p style={{ margin: '0 0 1em', textIndent: '1.8em' }}>
              For small θ, sin θ ≈ θ, and the equation becomes a spring. Clean, periodic,
              boring in a good way. This is the <em><Term id="small-angle-approximation">small-angle approximation</Term>,</em> and it is
              the reason the pendulum in a grandfather clock keeps better time than most of
              your friends.
            </p>
            <p style={{ margin: '0 0 1em', textIndent: '1.8em' }}>
              Push θ past about thirty degrees, though, and the approximation starts to lie.
              The period grows with amplitude. Add a second pendulum — hang one off the first —
              and the lie becomes a cascade<Footnote n="2">The double pendulum is one of the canonical simple systems that exhibits deterministic chaos. Its phase space is four-dimensional, which is one more than your eyes can hold at once, which is part of why it feels uncanny to watch.</Footnote>.
              Two identical double pendulums, started from angles that differ by a thousandth
              of a degree, will be in entirely different places a minute later. Not noisy.
              Not drifting. <em>Different.</em>
            </p>

            {/* Hand-set pullquote */}
            <div style={{ margin: '2.2em 0', textAlign: 'center' }}>
              <div style={{ height: 1, background: 'var(--rule)', width: 120, margin: '0 auto 22px' }} />
              <blockquote style={{ fontFamily: serif, fontStyle: 'italic', fontSize: '1.42em',
                lineHeight: 1.35, margin: 0, padding: 0, color: 'var(--ink)',
                maxWidth: '18ch', marginLeft: 'auto', marginRight: 'auto',
                letterSpacing: '-0.005em' }}>
                <span style={{ fontSize: '1.6em', lineHeight: 0, verticalAlign: '-0.3em',
                  color: 'var(--accent)', marginRight: '0.12em', fontStyle: 'normal' }}>“</span>
                Determinism gives you the equation. It does not give you the future.
                <span style={{ fontSize: '1.6em', lineHeight: 0, verticalAlign: '-0.3em',
                  color: 'var(--accent)', marginLeft: '0.08em', fontStyle: 'normal' }}>”</span>
              </blockquote>
              <div style={{ height: 1, background: 'var(--rule)', width: 120, margin: '22px auto 0' }} />
            </div>

            <H2 id="lyapunov" num="IV">Lyapunov, or: the horizon</H2>
            <p style={{ margin: '0 0 1em', textIndent: '1.8em' }}>
              The rate at which two nearby trajectories pull apart has a name: the
              <em> <Term id="lyapunov-exponent">Lyapunov exponent</Term>.</em> A positive one means small errors grow
              exponentially. Double the precision of your measurement and you buy a
              fixed amount of time — maybe a few seconds, maybe a few hours, depending
              on the system. After that, you are guessing.
            </p>
            <p style={{ margin: '0 0 1em', textIndent: '1.8em' }}>
              This is the horizon I mean. Not a wall, but a fog: the far distance where
              even a perfect model, run on a perfect computer, stops being able to tell
              you what the pendulum is doing, because the tiniest rounding error has
              grown into the whole answer.
            </p>

            <Fleuron />

            <H2 id="closing" num="V">A closing note</H2>
            <p style={{ margin: '0 0 1em', textIndent: '1.8em' }}>
              I find this comforting, in a way I do not fully understand. There is a
              limit to what you can know about a string with a weight on it. There is
              a limit to what you can know about most things. The equation is still
              there, still clean, still solvable in the way the word is used in a math
              class. The world is still deterministic. And yet, past a certain horizon,
              the pendulum and you are both free.
            </p>

            {/* End mark */}
            <div style={{ textAlign: 'center', margin: '2em 0 0',
              fontFamily: serif, color: 'var(--accent)', fontSize: 16 }}>
              ■
            </div>

            {/* Feature #8 — one sentence to remember */}
            {window.RememberCard && (
              <RememberCard
                sentence="Determinism gives you the equation. It does not give you the future."
                attribution="from The Horizon of a Pendulum" />
            )}

            {/* Reflection prompt — quiet private listening */}
            {window.ReflectionPrompt && <ReflectionPrompt />}

            {/* Feature #5 — in this neighborhood */}
            {window.Neighborhood && (
              <Neighborhood items={[
                { id: 'shape-of-proof', title: 'The Shape of a Proof',
                  topic: 'Science', min: 12, relation: 'A companion piece',
                  reason: 'If the pendulum essay was about the limits of prediction, this one is about the form that makes knowledge stick. They rhyme.' },
                { id: 'reading-slowly', title: 'On Reading Slowly',
                  topic: 'Essay', min: 6, relation: 'Change of pace',
                  reason: 'Shorter, softer. A defense of the long form in an age that forgot it. Read it when you need permission to slow down.' },
                { id: 'color-of-silence', title: 'The Color of Silence',
                  topic: 'Art', min: 7, relation: 'Argues the opposite',
                  reason: 'I spent this essay describing fog in the equations. This one is about standing in front of a Rothko and letting the fog be the answer.' },
              ]} />
            )}

            {/* Per-post glossary footnote */}
            {glossaryUsed.size > 0 && window.GLOSSARY_TERMS && (
              <section style={{ marginTop: '3em', paddingTop: 20,
                borderTop: '1px solid var(--rule)' }}>
                <div style={{ display: 'flex', alignItems: 'baseline',
                  justifyContent: 'space-between', marginBottom: 18 }}>
                  <h3 style={{ margin: 0, fontFamily: serif,
                    fontVariant: 'small-caps', letterSpacing: '0.28em',
                    fontSize: 11, color: 'var(--muted)', fontWeight: 400 }}>
                    Glossary
                  </h3>
                  <span style={{ fontFamily: serif, fontStyle: 'italic',
                    fontSize: 12, color: 'var(--muted)' }}>
                    terms used in this piece
                  </span>
                </div>
                <dl style={{ margin: 0, display: 'grid',
                  gridTemplateColumns: '160px 1fr', columnGap: 32, rowGap: 14,
                  textAlign: 'left' }}>
                  {Array.from(glossaryUsed)
                    .map((id) => ({ id, ...window.GLOSSARY_TERMS[id] }))
                    .filter((t) => t.term)
                    .sort((a, b) => a.term.localeCompare(b.term))
                    .map((t) => (
                      <React.Fragment key={t.id}>
                        <dt style={{ fontFamily: serif, fontSize: 14.5,
                          fontStyle: 'italic', color: 'var(--ink)',
                          textAlign: 'right', paddingTop: 2 }}>
                          {t.term}
                          <div style={{ fontStyle: 'normal', fontSize: 10.5,
                            fontVariant: 'small-caps', letterSpacing: '0.2em',
                            color: 'var(--muted)', marginTop: 2 }}>
                            {t.pos}
                          </div>
                        </dt>
                        <dd style={{ margin: 0, fontFamily: serif,
                          fontSize: 14, lineHeight: 1.55, color: 'var(--ink)' }}>
                          {t.short}
                        </dd>
                      </React.Fragment>
                    ))}
                </dl>
                <div style={{ marginTop: 16, fontSize: 11.5,
                  fontFamily: serif, fontStyle: 'italic',
                  color: 'var(--muted)', textAlign: 'center' }}>
                  The full glossary, across all posts, lives <a href="#glossary"
                    style={{ color: 'var(--accent)',
                      borderBottom: '1px solid var(--accent)',
                      textDecoration: 'none' }}>here</a>.
                </div>
              </section>
            )}

            {/* Colophon-style footer */}
            <div style={{ marginTop: '3.5em', paddingTop: 24, borderTop: '1px solid var(--rule)',
              fontFamily: serif, fontSize: 12.5, color: 'var(--muted)',
              display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 20, alignItems: 'center' }}>
              <span style={{ fontStyle: 'italic' }}>← On reading slowly</span>
              <span style={{ fontVariant: 'small-caps', letterSpacing: '0.2em', fontSize: 10.5 }}>
                Finis
              </span>
              <span style={{ fontStyle: 'italic', textAlign: 'right' }}>The shape of a proof →</span>
            </div>
          </article>

          {showMarginNotes && <div style={{ gridColumn: 3 }} />}
        </div>
      </div>

      {/* Selection → react popover (positioned relative to this container) */}
      {window.SelectionReact && (
        <SelectionReact scopeRef={articleRef}
          onReact={(kind) => setReactionToast(kind)} />
      )}

      {/* Quiet toast — bottom center, small-caps, disappears */}
      {reactionToast && (
        <div style={{ position: 'absolute', bottom: 28, left: '50%',
          transform: 'translateX(-50%)', background: 'var(--ink)', color: 'var(--paper)',
          fontFamily: serif, fontSize: 12, fontVariant: 'small-caps',
          letterSpacing: '0.22em', padding: '10px 20px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)', zIndex: 30 }}>
          {reactionToast === 'resonant' && '❤ noted — passed privately to the author'}
          {reactionToast === 'thinking' && '✦ noted — passed privately to the author'}
          {reactionToast === 'confused' && '? noted — the author will know this passage was hard'}
          {reactionToast === 'note' && '✎ open a note — coming to your letterbox soon'}
        </div>
      )}
    </div>
  );
}

window.ArticlePage = ArticlePage;
