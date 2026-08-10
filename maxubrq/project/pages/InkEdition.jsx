// InkEdition.jsx — maxubrq, redrawn as white + electric-ink-blue,
// brutalist digital-editorial. Big lowercase grotesque, hairline grids,
// hand-drawn scribble marks, cyanotype photo plates, coordinate footers.
// Fixed palette on purpose — this is a specific art direction.

const INK = {
  paper:  '#ffffff',
  paper2: '#f2f2ef',      // light panel (Swiss poster grey)
  ink:    '#0d0d11',
  muted:  '#77777f',
  faint:  '#a7a7ad',
  rule:   'rgba(13,13,17,0.14)',
  ruleHard:'#0d0d11',
  blue:   '#1a24df',      // electric ink blue — headlines, accents, plates
  blueDeep:'#0f1699',
};

const DISPLAY = '"Space Grotesk", "IBM Plex Sans", sans-serif';
const BODY    = '"IBM Plex Sans", -apple-system, sans-serif';
const MONO    = '"IBM Plex Mono", monospace';

if (typeof document !== 'undefined' && !document.getElementById('ink-styles')) {
  const s = document.createElement('style');
  s.id = 'ink-styles';
  s.textContent = `
  .ink-root a{color:${INK.blue};text-decoration:none}
  .ink-root a:hover{text-decoration:underline;text-underline-offset:3px}
  .ink-root ::selection{background:${INK.blue};color:#fff}
  .ink-duo{position:relative;overflow:hidden;background:${INK.paper2}}
  .ink-duo image-slot{display:block;width:100%;height:100%;filter:grayscale(1) contrast(1.06) brightness(1.03)}
  .ink-duo::after{content:"";position:absolute;inset:0;background:${INK.blue};mix-blend-mode:multiply;opacity:.78;pointer-events:none;z-index:1}
  .ink-duo::before{content:"";position:absolute;inset:0;background:#fff;mix-blend-mode:screen;opacity:.06;pointer-events:none;z-index:2}
  .ink-hatch{background-image:repeating-linear-gradient(-45deg,${INK.blue} 0 1.5px,transparent 1.5px 7px)}
  .ink-scroll{scrollbar-width:none}
  .ink-scroll::-webkit-scrollbar{display:none}
  `;
  document.head.appendChild(s);
}

// ── Hand-drawn marks ────────────────────────────────────────────────
function Scribble({ w = 360, h = 130, color = INK.blue, style }) {
  return (
    <svg viewBox="0 0 360 130" width={w} height={h} fill="none"
      style={{ position: 'absolute', pointerEvents: 'none', overflow: 'visible', ...style }}>
      <path d="M52 74 C40 40 118 22 196 24 C286 26 342 44 340 72 C338 100 250 116 158 112 C74 108 22 96 30 62 C36 38 108 26 190 28 C264 30 320 42 326 62"
        stroke={color} strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}
function Underline({ w = 300, color = INK.blue, style }) {
  return (
    <svg viewBox="0 0 300 22" width={w} height={w * 22 / 300} fill="none"
      style={{ position: 'absolute', pointerEvents: 'none', overflow: 'visible', ...style }}>
      <path d="M4 14 C70 6 150 4 232 8 C260 9 284 11 296 15 C282 13 250 12 214 13"
        stroke={color} strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
function ArrowMark({ w = 150, color = INK.blue, dir = 'right', style }) {
  const rot = { right: 0, down: 90, left: 180, up: 270 }[dir] || 0;
  return (
    <svg viewBox="0 0 160 80" width={w} height={w * 80 / 160} fill="none"
      style={{ position: 'absolute', pointerEvents: 'none', overflow: 'visible',
        transform: `rotate(${rot}deg)`, ...style }}>
      <path d="M6 30 C50 10 96 12 138 40" stroke={color} strokeWidth="2.6" strokeLinecap="round" />
      <path d="M118 22 L142 42 L112 52" stroke={color} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Small parts ─────────────────────────────────────────────────────
const Tag = ({ children, on, style }) => (
  <span style={{ fontFamily: MONO, fontSize: 10.5, letterSpacing: '0.14em', textTransform: 'uppercase',
    color: on ? INK.blue : INK.muted, ...style }}>{children}</span>
);

function DuoPhoto({ id, ratio = '3 / 2', placeholder = 'photo', label, style }) {
  return (
    <figure style={{ margin: 0, ...style }}>
      <div className="ink-duo" style={{ aspectRatio: ratio, width: '100%' }}>
        <image-slot id={id} shape="rect" placeholder={placeholder}></image-slot>
      </div>
      {label && <figcaption style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.08em',
        color: INK.muted, marginTop: 7, textTransform: 'uppercase' }}>{label}</figcaption>}
    </figure>
  );
}

// vertical running head, like the folio on a printed spread
function RunningHead({ text, side = 'right' }) {
  return (
    <div style={{ position: 'absolute', top: 0, bottom: 0, [side]: 0, width: 34,
      display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
      <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase',
        color: INK.faint, transform: 'rotate(180deg)', writingMode: 'vertical-rl' }}>{text}</span>
    </div>
  );
}

function MetaFoot({ items }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${items.length}, 1fr)`, gap: 24,
      borderTop: `1.5px solid ${INK.ruleHard}`, paddingTop: 12, marginTop: 40 }}>
      {items.map(([k, v], i) => (
        <div key={i}>
          <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase',
            fontWeight: 500, color: INK.ink }}>{k}</div>
          <div style={{ fontFamily: MONO, fontSize: 10.5, color: INK.muted, marginTop: 3 }}>{v}</div>
        </div>
      ))}
    </div>
  );
}

// ── Chrome ──────────────────────────────────────────────────────────
function InkChrome({ current, children, foot = 'maxubrq.space' }) {
  const nav = [['writing', 'Writing'], ['topics', 'Topics'], ['about', 'About the author']];
  return (
    <div className="ink-root" style={{ height: '100%', background: INK.paper, color: INK.ink,
      fontFamily: BODY, position: 'relative', overflow: 'hidden' }}>
      <header style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center',
        padding: '18px 30px', borderBottom: `1.5px solid ${INK.ruleHard}` }}>
        <a href="#" style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 19, letterSpacing: '-0.03em',
          color: INK.ink, textDecoration: 'none' }}>maxubrq<span style={{ color: INK.blue }}>.</span></a>
        <nav style={{ display: 'flex', gap: 22 }}>
          {nav.map(([k, v]) => (
            <a key={k} href="#" style={{ fontFamily: MONO, fontSize: 11.5, letterSpacing: '0.08em',
              textTransform: 'uppercase', color: current === k ? INK.blue : INK.ink,
              textDecoration: current === k ? 'none' : 'none',
              borderBottom: current === k ? `2px solid ${INK.blue}` : '2px solid transparent',
              paddingBottom: 2 }}>{v}</a>
          ))}
        </nav>
        <div style={{ justifySelf: 'end', display: 'flex', alignItems: 'center', gap: 12 }}>
          <Tag>Vol.04 / 2026</Tag>
          <span style={{ width: 20, height: 20, borderRadius: '50%', border: `1.5px solid ${INK.ink}`,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: MONO, fontSize: 10 }}>⌕</span>
        </div>
      </header>
      <div className="ink-scroll" style={{ height: 'calc(100% - 61px)', overflowY: 'auto', position: 'relative' }}>
        {children}
        <footer style={{ borderTop: `1.5px solid ${INK.ruleHard}`, margin: '0 30px', padding: '16px 0 22px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <Tag>{foot}</Tag>
          <Tag>A notebook, kept in public · est. 2024</Tag>
          <Tag>© 2026</Tag>
        </footer>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// HOME
// ═══════════════════════════════════════════════════════════════════
function InkHome() {
  const posts = [
    { n: '02', topic: 'Philosophy', title: 'On reading slowly', date: '2026 · 03 · 28', time: 6 },
    { n: '03', topic: 'Tech',       title: 'What a proof costs: notes from a week with Lean', date: '2026 · 03 · 09', time: 12 },
    { n: '04', topic: 'Art',        title: 'Agnes Martin and the grid as devotion', date: '2026 · 02 · 22', time: 7 },
    { n: '05', topic: 'Tech',       title: 'Small models, small problems', date: '2026 · 02 · 01', time: 5 },
    { n: '06', topic: 'Philosophy', title: 'Đọc chậm — và tại sao nó quan trọng', date: '2026 · 01 · 16', time: 8 },
  ];
  return (
    <InkChrome current="writing">
      {/* Masthead */}
      <section style={{ padding: '46px 30px 38px', borderBottom: `1.5px solid ${INK.ruleHard}`, position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
          <Tag>Est. 2024 — a notebook</Tag>
          <Tag>Nº 001 / index</Tag>
        </div>
        <h1 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 72, lineHeight: 0.94,
          letterSpacing: '-0.045em', margin: 0, textTransform: 'lowercase' }}>
          writing, mostly<br />about things that<br />take a <span style={{ position: 'relative', color: INK.blue, whiteSpace: 'nowrap' }}>
            while.<Scribble style={{ left: -22, top: -18 }} w={230} h={110} />
          </span>
        </h1>
        <p style={{ maxWidth: '54ch', fontSize: 16, lineHeight: 1.5, color: INK.muted, margin: '26px 0 0' }}>
          Essays on science, technology, philosophy, and art — often with something you can play with.
          Updated roughly monthly, or when I have something to say.
        </p>
      </section>

      {/* Featured — interactive */}
      <section style={{ display: 'grid', gridTemplateColumns: '1.15fr 1fr', borderBottom: `1.5px solid ${INK.ruleHard}` }}>
        <a href="#" style={{ padding: '30px 26px 34px 30px', borderRight: `1.5px solid ${INK.ruleHard}`,
          color: INK.ink, textDecoration: 'none', position: 'relative' }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 18 }}>
            <Tag on>● Interactive</Tag><Tag>Latest / Science</Tag>
          </div>
          <div style={{ fontFamily: MONO, fontSize: 44, fontWeight: 500, color: INK.blue, lineHeight: 1,
            letterSpacing: '-0.03em', marginBottom: 14 }}>01</div>
          <h2 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 34, lineHeight: 1.02,
            letterSpacing: '-0.03em', margin: '0 0 14px', textTransform: 'lowercase' }}>
            the horizon of a pendulum, and other small infinities
          </h2>
          <p style={{ fontSize: 14.5, lineHeight: 1.55, color: INK.muted, margin: '0 0 20px', maxWidth: '46ch' }}>
            On why a system so simple it fits in a single equation can still refuse to tell you where
            it will be in an hour. With a pendulum you can grab and pull.
          </p>
          <span style={{ position: 'relative', fontFamily: MONO, fontSize: 11.5, letterSpacing: '0.08em',
            textTransform: 'uppercase', color: INK.blue }}>
            read the essay
            <ArrowMark style={{ left: 130, top: -6 }} w={90} />
          </span>
        </a>
        <div className="ink-duo">
          <image-slot id="ink-home-hero" shape="rect" placeholder="cyanotype plate — drop a photo"></image-slot>
        </div>
      </section>

      {/* Archive list — brutalist rows */}
      <section style={{ padding: '10px 30px 34px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '20px 0 6px' }}>
          <Tag>Archive / recent</Tag>
          <a href="#" style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase' }}>all essays →</a>
        </div>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {posts.map((p, i) => (
            <li key={i}>
              <a href="#" style={{ display: 'grid', gridTemplateColumns: '48px 118px 1fr auto',
                alignItems: 'baseline', gap: 20, padding: '15px 0', borderTop: `1px solid ${INK.rule}`,
                color: INK.ink, textDecoration: 'none' }}
                onMouseEnter={e => e.currentTarget.style.color = INK.blue}
                onMouseLeave={e => e.currentTarget.style.color = INK.ink}>
                <span style={{ fontFamily: MONO, fontSize: 13, color: INK.faint }}>{p.n}</span>
                <Tag>{p.topic}</Tag>
                <span style={{ fontFamily: DISPLAY, fontSize: 21, fontWeight: 500, letterSpacing: '-0.02em',
                  lineHeight: 1.15 }}>{p.title}</span>
                <span style={{ fontFamily: MONO, fontSize: 11, color: INK.muted, whiteSpace: 'nowrap' }}>
                  {p.date} · {p.time}′</span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </InkChrome>
  );
}

// inline glossary mark — dotted term with a hover/click popover
function GlossaryMark({ term, kind = 'term', def, count, children }) {
  const [open, setOpen] = React.useState(false);
  return (
    <span style={{ position: 'relative' }}
      onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <span onClick={() => setOpen(o => !o)} style={{ color: INK.blue, fontWeight: 500,
        borderBottom: `2px dotted ${INK.blue}`, cursor: 'help' }}>{children || term}</span>
      {open && (
        <span style={{ position: 'absolute', left: 0, top: '135%', zIndex: 20, width: 290,
          border: `1.5px solid ${INK.ruleHard}`, background: INK.paper, padding: '14px 16px',
          boxShadow: '0 10px 30px rgba(13,13,17,0.16)', display: 'block' }}>
          <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase',
            color: INK.blue }}>{kind}</span>
          <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 18, letterSpacing: '-0.02em',
            textTransform: 'lowercase', display: 'block', margin: '5px 0 7px' }}>{term}</span>
          <span style={{ fontFamily: BODY, fontSize: 13, lineHeight: 1.5, color: INK.ink, display: 'block' }}>{def}</span>
          <span style={{ display: 'flex', justifyContent: 'space-between', borderTop: `1px solid ${INK.rule}`,
            marginTop: 10, paddingTop: 8 }}>
            <Tag>appears in {count} essays</Tag>
            <a href="#" style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.06em' }}>full entry →</a>
          </span>
        </span>
      )}
    </span>
  );
}

// ═══════════════════════════════════════════════════════════════════
// ARTICLE — the reading surface
// ═══════════════════════════════════════════════════════════════════
function InkArticle() {
  return (
    <InkChrome current="writing" foot="maxubrq.space / science">
      <RunningHead text="maxubrq · vol.04 · science" />
      <article style={{ maxWidth: 940, margin: '0 auto', padding: '0 44px' }}>
        {/* Title block */}
        <header style={{ padding: '48px 0 30px', borderBottom: `1.5px solid ${INK.ruleHard}` }}>
          <div style={{ display: 'flex', gap: 14, marginBottom: 22 }}>
            <Tag on>Science</Tag><Tag>● Interactive</Tag><Tag>Essay Nº 001</Tag>
          </div>
          <h1 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 58, lineHeight: 0.96,
            letterSpacing: '-0.04em', margin: 0, textTransform: 'lowercase' }}>
            the horizon of a<br />
            <span style={{ position: 'relative', color: INK.blue }}>pendulum
              <Underline style={{ left: 2, bottom: -10 }} w={280} /></span>, and other<br />small infinities
          </h1>
        </header>

        {/* Two-column editorial body */}
        <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: 34, padding: '32px 0 0' }}>
          {/* Margin rail */}
          <aside style={{ position: 'sticky', top: 0, alignSelf: 'start' }}>
            <div style={{ borderTop: `1.5px solid ${INK.ruleHard}`, paddingTop: 10 }}>
              {[['Author', 'maxubrq'], ['Published', 'Apr 14, 2026'], ['Reading', '9 minutes'],
                ['Section', '§ Chaos, gently'], ['Coord', '09°01′N']].map(([k, v], i) => (
                <div key={i} style={{ marginBottom: 12 }}>
                  <div style={{ fontFamily: MONO, fontSize: 9.5, letterSpacing: '0.1em', textTransform: 'uppercase',
                    color: INK.muted }}>{k}</div>
                  <div style={{ fontFamily: MONO, fontSize: 12, color: INK.ink, marginTop: 2 }}>{v}</div>
                </div>
              ))}
            </div>
          </aside>

          {/* Prose */}
          <div>
            <p style={{ fontSize: 18, lineHeight: 1.62, margin: '0 0 1.1em' }}>
              <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: '3.1em', float: 'left',
                lineHeight: 0.78, margin: '0.04em 0.12em 0 0', color: INK.blue }}>A</span>
              pendulum is the first thing you learn to trust. Pull it aside, let it go, and it keeps a promise:
              back and forth, back and forth, in a rhythm you could set a clock to. For three hundred years we did
              exactly that. The whole edifice of clockwork rested on the idea that a swinging weight is a thing
              that <em>repeats</em>.
            </p>
            <p style={{ fontSize: 18, lineHeight: 1.62, margin: '0 0 1.4em' }}>
              Add a second arm — a pendulum hanging off the end of another — and the promise dissolves. The
              motion becomes something you cannot predict beyond the next few seconds, no matter how precisely
              you measure the start. Nothing was added but a hinge. The equations did not get harder to write.
              They got impossible to <em>outrun</em>.
            </p>

            {/* Blue pull-quote plate */}
            <blockquote style={{ margin: '10px 0 34px', background: INK.blue, color: '#fff',
              padding: '30px 32px', position: 'relative' }}>
              <p style={{ fontFamily: DISPLAY, fontWeight: 500, fontSize: 26, lineHeight: 1.14,
                letterSpacing: '-0.02em', margin: 0, textTransform: 'lowercase' }}>
                a system so simple it fits in one equation can still refuse to tell you where it will be
                in an hour.
              </p>
              <div style={{ fontFamily: MONO, fontSize: 10.5, letterSpacing: '0.1em', textTransform: 'uppercase',
                marginTop: 18, opacity: 0.85 }}>— the double pendulum, §2</div>
            </blockquote>

            <p style={{ fontSize: 18, lineHeight: 1.62, margin: '0 0 1.4em' }}>
              This is the strange bargain of <GlossaryMark term="deterministic chaos" count={3}
                def="A system whose future is fully fixed by its present yet practically unpredictable, because tiny uncertainties grow without bound.">deterministic chaos</GlossaryMark>. Every future is fixed — the physics is exact,
              reversible, without a single random term — and yet the future is unknowable, because the smallest
              uncertainty in the present grows without bound. Determinism and predictability, which we quietly
              assumed were the same word, turn out to be strangers.
            </p>

            {/* Figure */}
            <DuoPhoto id="ink-article-fig" ratio="16 / 9"
              label="Fig. 1 — phase portrait of the double arm · drop your own plate"
              style={{ margin: '0 0 34px' }} />

            <h2 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 30, letterSpacing: '-0.03em',
              lineHeight: 1.05, margin: '0 0 0.5em', textTransform: 'lowercase' }}>
              you can grab and pull
            </h2>
            <p style={{ fontSize: 18, lineHeight: 1.62, margin: '0 0 1.4em' }}>
              Below this line, in the live version, is a pendulum you can drag. Set it swinging, then set it
              swinging again from a spot a hair's breadth away. Watch the two paths agree, agree, agree — and
              then, quietly, stop agreeing. That divergence is the whole essay, and no paragraph will teach it
              the way your own hand will. The horizon beyond which prediction fails has a name:{' '}
              <GlossaryMark term="Lyapunov time" kind="term" count={2}
                def="The horizon beyond which prediction fails — the timescale on which nearby trajectories diverge.">Lyapunov time</GlossaryMark>.
            </p>

            {/* Fake interactive plate */}
            <div style={{ border: `1.5px solid ${INK.ruleHard}`, padding: 0, margin: '0 0 8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '10px 14px', borderBottom: `1px solid ${INK.rule}` }}>
                <Tag on>● Live figure</Tag><Tag>drag to release · space to reset</Tag>
              </div>
              <div className="ink-hatch" style={{ height: 210, position: 'relative', opacity: 0.5 }}>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em',
                  textTransform: 'uppercase', color: INK.blue, background: 'rgba(255,255,255,0.72)' }}>
                  interactive canvas
                </div>
              </div>
            </div>

            {/* Terms in this essay — per-post glossary footnote */}
            <div style={{ margin: '38px 0 0', border: `1.5px solid ${INK.ruleHard}` }}>
              <div style={{ padding: '10px 16px', borderBottom: `1px solid ${INK.rule}`,
                display: 'flex', justifyContent: 'space-between' }}>
                <Tag on>Terms in this essay</Tag><Tag>3 marked · from the site glossary</Tag>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                {[['deterministic chaos', 'Future fixed, yet unpredictable — small errors grow without bound.'],
                  ['Lyapunov time', 'The horizon beyond which prediction fails.'],
                  ['phase space', 'The space of all possible states; each point one configuration.']].map(([t, d], i) => (
                  <div key={i} style={{ padding: '14px 16px', borderTop: `1px solid ${INK.rule}`,
                    borderRight: i % 2 === 0 ? `1px solid ${INK.rule}` : 'none' }}>
                    <div style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 15, letterSpacing: '-0.01em',
                      textTransform: 'lowercase', color: INK.blue }}>{t}</div>
                    <div style={{ fontFamily: BODY, fontSize: 12.5, lineHeight: 1.45, color: INK.muted, marginTop: 4 }}>{d}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* One sentence to remember */}
            <div style={{ margin: '38px 0 34px', border: `1.5px solid ${INK.ruleHard}`, position: 'relative' }}>
              <div style={{ padding: '10px 16px', borderBottom: `1px solid ${INK.rule}`,
                display: 'flex', justifyContent: 'space-between' }}>
                <Tag on>If you remember one sentence</Tag><Tag>the author’s pick</Tag>
              </div>
              <p style={{ fontFamily: DISPLAY, fontWeight: 500, fontSize: 27, lineHeight: 1.15,
                letterSpacing: '-0.02em', margin: 0, padding: '26px 22px', textTransform: 'lowercase', color: INK.blue }}>
                a system so simple it fits in one equation can still refuse to tell you where it will be in an hour.
              </p>
            </div>

            {/* In this neighborhood */}
            <div style={{ margin: '0 0 8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                borderBottom: `1.5px solid ${INK.ruleHard}`, paddingBottom: 10, marginBottom: 6 }}>
                <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 20, letterSpacing: '-0.02em',
                  textTransform: 'lowercase' }}>in this neighborhood</span>
                <Tag>hand-picked, by me</Tag>
              </div>
              {[['A season with phase diagrams', 'the same divergence, drawn instead of argued.'],
                ['Caching, and the limits of knowing', 'a cache is a bet the past predicts the future — this essay is the counter-bet.'],
                ['On reading slowly', 'if the pendulum made you want to sit with something.']].map(([t, note], i) => (
                <a key={i} href="#" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 4,
                  padding: '14px 0', borderBottom: `1px solid ${INK.rule}`, color: INK.ink, textDecoration: 'none' }}
                  onMouseEnter={e => e.currentTarget.querySelector('[data-t]').style.color = INK.blue}
                  onMouseLeave={e => e.currentTarget.querySelector('[data-t]').style.color = INK.ink}>
                  <span data-t style={{ fontFamily: DISPLAY, fontSize: 19, fontWeight: 500, letterSpacing: '-0.02em' }}>{t}</span>
                  <span style={{ fontFamily: BODY, fontStyle: 'italic', fontSize: 13.5, color: INK.muted, lineHeight: 1.45 }}>“{note}”</span>
                </a>
              ))}
            </div>

            <MetaFoot items={[
              ['Filed under', 'Science / dynamics'],
              ['Series', 'Small infinities · 1 of 4'],
              ['License', 'CC BY-NC 4.0'],
              ['Words', '2,140'],
            ]} />
          </div>
        </div>
      </article>
    </InkChrome>
  );
}

// ═══════════════════════════════════════════════════════════════════
// ARCHIVE
// ═══════════════════════════════════════════════════════════════════
function InkArchive() {
  const [filter, setFilter] = React.useState('All');
  const posts = [
    { y: 2026, topic: 'Science',    title: 'The horizon of a pendulum, and other small infinities', date: '04·14', time: 9, live: true },
    { y: 2026, topic: 'Philosophy', title: 'On reading slowly', date: '03·28', time: 6 },
    { y: 2026, topic: 'Tech',       title: 'What a proof costs: notes from a week with Lean', date: '03·09', time: 12 },
    { y: 2026, topic: 'Art',        title: 'Agnes Martin and the grid as devotion', date: '02·22', time: 7 },
    { y: 2026, topic: 'Tech',       title: 'Small models, small problems', date: '02·01', time: 5 },
    { y: 2026, topic: 'Philosophy', title: 'Đọc chậm — và tại sao nó quan trọng', date: '01·16', time: 8 },
    { y: 2025, topic: 'Science',    title: 'A season with phase diagrams', date: '12·04', time: 10 },
    { y: 2025, topic: 'Art',        title: 'Color is a relationship', date: '11·11', time: 6, live: true },
    { y: 2025, topic: 'Tech',       title: 'Caching, and the limits of knowing', date: '10·28', time: 9 },
    { y: 2025, topic: 'Philosophy', title: 'What I mean when I say “elegant”', date: '09·30', time: 5 },
  ];
  const topics = ['All', 'Science', 'Tech', 'Philosophy', 'Art'];
  const visible = posts.filter(p => filter === 'All' || p.topic === filter);
  const years = [...new Set(visible.map(p => p.y))];
  return (
    <InkChrome current="writing">
      <section style={{ padding: '44px 30px 24px', borderBottom: `1.5px solid ${INK.ruleHard}` }}>
        <Tag>Writing / {posts.length} essays</Tag>
        <h1 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 60, lineHeight: 0.95,
          letterSpacing: '-0.045em', margin: '14px 0 0', textTransform: 'lowercase' }}>
          everything, in<br />order of <span style={{ color: INK.blue }}>when</span>.
        </h1>
      </section>
      <div style={{ display: 'flex', gap: 0, borderBottom: `1.5px solid ${INK.ruleHard}` }}>
        {topics.map(t => (
          <button key={t} onClick={() => setFilter(t)} style={{
            flex: 1, border: 'none', borderRight: t === 'Art' ? 'none' : `1px solid ${INK.rule}`,
            background: filter === t ? INK.blue : 'transparent', color: filter === t ? '#fff' : INK.ink,
            fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase',
            padding: '14px 0', cursor: 'pointer' }}>{t}</button>
        ))}
      </div>
      <section style={{ padding: '0 30px 30px' }}>
        {years.map(year => (
          <div key={year}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, padding: '26px 0 6px' }}>
              <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 40, letterSpacing: '-0.03em',
                color: INK.faint, lineHeight: 1 }}>{year}</span>
              <span style={{ flex: 1, height: 1.5, background: INK.ruleHard }} />
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {visible.filter(p => p.y === year).map((p, i) => (
                <li key={i}>
                  <a href="#" style={{ display: 'grid', gridTemplateColumns: '64px 118px 1fr auto',
                    alignItems: 'baseline', gap: 18, padding: '14px 0', borderTop: `1px solid ${INK.rule}`,
                    color: INK.ink, textDecoration: 'none' }}
                    onMouseEnter={e => e.currentTarget.style.color = INK.blue}
                    onMouseLeave={e => e.currentTarget.style.color = INK.ink}>
                    <span style={{ fontFamily: MONO, fontSize: 12, color: INK.muted }}>{p.date}</span>
                    <Tag>{p.topic}</Tag>
                    <span style={{ fontFamily: DISPLAY, fontSize: 20, fontWeight: 500, letterSpacing: '-0.02em' }}>
                      {p.title} {p.live && <span style={{ color: INK.blue, fontSize: 13 }}>●</span>}</span>
                    <span style={{ fontFamily: MONO, fontSize: 11, color: INK.muted }}>{p.time}′</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </InkChrome>
  );
}

// ═══════════════════════════════════════════════════════════════════
// ABOUT
// ═══════════════════════════════════════════════════════════════════
function InkAbout() {
  return (
    <InkChrome current="about">
      <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: `1.5px solid ${INK.ruleHard}` }}>
        <div style={{ padding: '46px 26px 40px 30px', borderRight: `1.5px solid ${INK.ruleHard}` }}>
          <Tag>About / colophon</Tag>
          <h1 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 52, lineHeight: 0.95,
            letterSpacing: '-0.04em', margin: '14px 0 0', textTransform: 'lowercase' }}>
            a notebook,<br />kept in <span style={{ position: 'relative', color: INK.blue }}>public
              <Scribble style={{ left: -18, top: -20 }} w={210} h={104} /></span>.
          </h1>
        </div>
        <div className="ink-duo" style={{ minHeight: 260 }}>
          <image-slot id="ink-about-portrait" shape="rect" placeholder="portrait plate"></image-slot>
        </div>
      </section>
      <section style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: 34, maxWidth: 900,
        margin: '0 auto', padding: '36px 44px 0' }}>
        <aside>
          <div style={{ borderTop: `1.5px solid ${INK.ruleHard}`, paddingTop: 10 }}>
            {[['Who', 'maxubrq'], ['Since', '2024'], ['Cadence', '~monthly'], ['Type', 'Space Grotesk / Plex']].map(([k, v], i) => (
              <div key={i} style={{ marginBottom: 12 }}>
                <div style={{ fontFamily: MONO, fontSize: 9.5, letterSpacing: '0.1em', textTransform: 'uppercase', color: INK.muted }}>{k}</div>
                <div style={{ fontFamily: MONO, fontSize: 12, marginTop: 2 }}>{v}</div>
              </div>
            ))}
          </div>
        </aside>
        <div>
          <p style={{ fontSize: 18, lineHeight: 1.62, margin: '0 0 1.1em' }}>
            I'm <strong style={{ fontWeight: 600 }}>maxubrq</strong>. I write here about things that feel worth thinking
            about slowly: a physics problem that stuck with me, a piece of software I finally understood, a painting
            I kept coming back to, a sentence that would not leave me alone.
          </p>
          <p style={{ fontSize: 18, lineHeight: 1.62, margin: '0 0 1.4em' }}>
            Some essays come with a thing you can play with — a small simulation, a diagram that responds to a slider.
            I think of writing and interaction as the same craft: both are attempts to hand someone a thought in a
            form they can turn over.
          </p>

          <h2 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 24, letterSpacing: '-0.02em',
            textTransform: 'lowercase', margin: '1.4em 0 0.7em' }}>what i write about</h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.6em', display: 'grid',
            gridTemplateColumns: '1fr 1fr', gap: 0 }}>
            {[['Science', 'Mostly physics & math, sometimes biology.'],
              ['Tech', 'Software, and the shape of thinking it asks of you.'],
              ['Philosophy', 'Attention, time, what it means to know a thing.'],
              ['Art', 'Painting, music, the logic of composition.']].map(([k, v], i) => (
              <li key={k} style={{ borderTop: `1.5px solid ${INK.ruleHard}`, padding: '12px 16px 16px 0' }}>
                <Tag on>{k}</Tag>
                <div style={{ fontSize: 14.5, lineHeight: 1.45, marginTop: 6 }}>{v}</div>
              </li>
            ))}
          </ul>

          {/* Doorway to the vault — the only way in, on purpose */}
          <a href="#" style={{ display: 'block', border: `1.5px solid ${INK.ruleHard}`, textDecoration: 'none',
            color: INK.ink, margin: '1.6em 0 0' }}
            onMouseEnter={e => { e.currentTarget.style.background = INK.blue;
              e.currentTarget.querySelectorAll('[data-inv]').forEach(x => x.style.color = '#fff'); }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent';
              e.currentTarget.querySelectorAll('[data-inv]').forEach((x, i) => x.style.color = i === 0 ? INK.blue : INK.muted); }}>
            <div style={{ padding: '10px 16px', borderBottom: `1px solid ${INK.rule}`,
              display: 'flex', justifyContent: 'space-between' }}>
              <Tag on>Not in the menu</Tag><Tag>reached only from here</Tag>
            </div>
            <div style={{ padding: '20px 16px 22px', position: 'relative' }}>
              <div data-inv style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 30, letterSpacing: '-0.03em',
                textTransform: 'lowercase', color: INK.blue, lineHeight: 1 }}>the vault →</div>
              <div data-inv style={{ fontFamily: BODY, fontSize: 14, lineHeight: 1.5, color: INK.muted, marginTop: 8, maxWidth: '44ch' }}>
                A private cabinet — the books, records, papers, films and objects that belong to me,
                each with a line on why. A quieter room off this page.
              </div>
            </div>
          </a>

          {/* Doorway to the reader's own room — reader-owned, also off-menu */}
          <a href="#ink-reader-room" style={{ display: 'block', border: `1.5px solid ${INK.ruleHard}`, textDecoration: 'none',
            color: INK.ink, margin: '0.9em 0 0', borderTop: 'none' }}
            onMouseEnter={e => { e.currentTarget.style.background = INK.blue;
              e.currentTarget.querySelectorAll('[data-inv]').forEach(x => x.style.color = '#fff'); }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent';
              e.currentTarget.querySelectorAll('[data-inv]').forEach((x, i) => x.style.color = i === 0 ? INK.blue : INK.muted); }}>
            <div style={{ padding: '10px 16px', borderBottom: `1px solid ${INK.rule}`,
              display: 'flex', justifyContent: 'space-between' }}>
              <Tag on>Yours, not mine</Tag><Tag>stays on your device</Tag>
            </div>
            <div style={{ padding: '20px 16px 22px', position: 'relative' }}>
              <div data-inv style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 30, letterSpacing: '-0.03em',
                textTransform: 'lowercase', color: INK.blue, lineHeight: 1 }}>the reading room →</div>
              <div data-inv style={{ fontFamily: BODY, fontSize: 14, lineHeight: 1.5, color: INK.muted, marginTop: 8, maxWidth: '44ch' }}>
                Everything <em>you</em> made by reading here, under one roof — the constellation of what
                you’ve read, the sentences you kept, the things you got wrong. Private to you.
              </div>
            </div>
          </a>

          <h2 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 24, letterSpacing: '-0.02em',
            textTransform: 'lowercase', margin: '1.2em 0 0.7em' }}>elsewhere</h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {[['GitHub', '@maxubrq'], ['Email', 'max @ maxubrq.com'], ['RSS', '/feed.xml']].map(([k, v]) => (
              <li key={k} style={{ display: 'grid', gridTemplateColumns: '110px 1fr', gap: 20,
                padding: '11px 0', borderTop: `1px solid ${INK.rule}` }}>
                <Tag>{k}</Tag>
                <a href="#" style={{ fontFamily: MONO, fontSize: 13 }}>{v}</a>
              </li>
            ))}
          </ul>
          <p style={{ fontFamily: MONO, fontSize: 12, color: INK.muted, margin: '30px 0 0',
            borderTop: `1.5px solid ${INK.ruleHard}`, paddingTop: 16 }}>
            Cảm ơn bạn đã ghé qua. — Thanks for stopping by.
          </p>
        </div>
      </section>
    </InkChrome>
  );
}

// ═══════════════════════════════════════════════════════════════════
// TOPIC — a curated doorway
// ═══════════════════════════════════════════════════════════════════
function InkTopic() {
  const posts = [
    { title: 'The horizon of a pendulum', date: '2026·04', time: 9, live: true },
    { title: 'A season with phase diagrams', date: '2025·12', time: 10 },
    { title: 'Notes on the second law', date: '2025·08', time: 11 },
    { title: 'The shape of a soap film', date: '2025·05', time: 7 },
  ];
  return (
    <InkChrome current="topics" foot="maxubrq.space / topics">
      <section style={{ position: 'relative', padding: '46px 30px 40px', borderBottom: `1.5px solid ${INK.ruleHard}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Tag on>Topic 01 / 04</Tag><Tag>Science</Tag>
        </div>
        <h1 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 108, lineHeight: 0.9,
          letterSpacing: '-0.05em', margin: '10px 0 0', textTransform: 'lowercase', color: INK.blue }}>
          science
        </h1>
        <p style={{ maxWidth: '52ch', fontSize: 17, lineHeight: 1.5, color: INK.ink, margin: '20px 0 0',
          fontFamily: DISPLAY, fontWeight: 500 }}>
          Mostly physics and math, sometimes biology. The essays that begin with a small mechanical fact and
          end somewhere I did not expect.
        </p>
      </section>
      <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
        {posts.map((p, i) => (
          <a key={i} href="#" style={{ padding: '24px 24px 30px', color: INK.ink, textDecoration: 'none',
            borderRight: i % 2 === 0 ? `1.5px solid ${INK.ruleHard}` : 'none',
            borderBottom: `1.5px solid ${INK.ruleHard}` }}
            onMouseEnter={e => e.currentTarget.style.background = INK.paper2}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 40 }}>
              <span style={{ fontFamily: MONO, fontSize: 13, color: INK.faint }}>{String(i + 1).padStart(2, '0')}</span>
              <Tag>{p.date} · {p.time}′ {p.live && <span style={{ color: INK.blue }}>●</span>}</Tag>
            </div>
            <h3 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 26, letterSpacing: '-0.03em',
              lineHeight: 1.02, margin: 0, textTransform: 'lowercase' }}>{p.title}</h3>
          </a>
        ))}
      </section>
    </InkChrome>
  );
}

Object.assign(window, {
  InkHome, InkArticle, InkArchive, InkAbout, InkTopic,
  // shared kit for InkFeatures.jsx (separate babel scope)
  INK, DISPLAY, BODY, MONO, Tag, Scribble, Underline, ArrowMark, DuoPhoto, RunningHead, MetaFoot, InkChrome,
});
