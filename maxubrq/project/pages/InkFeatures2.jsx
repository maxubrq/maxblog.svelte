// InkFeatures2.jsx — Technical article, Topics hub + doorways, Series,
// Reading memory. Ink-edition vocabulary. Shared kit from window.

const { INK, DISPLAY, BODY, MONO, Tag, Scribble, Underline, ArrowMark, DuoPhoto, RunningHead, MetaFoot, InkChrome } = window;

// tiny syntax highlighter → react spans
function hl(code) {
  const out = []; let key = 0, last = 0, m;
  const push = (t, c) => out.push(<span key={key++} style={c ? { color: c } : undefined}>{t}</span>);
  const re = /(\/\/[^\n]*)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`[^`]*`)|\b(const|let|var|function|return|if|else|for|of|in|new|await|async|typeof|clearTimeout|setTimeout)\b|\b(\d+)\b/g;
  while ((m = re.exec(code))) {
    if (m.index > last) push(code.slice(last, m.index));
    if (m[1]) push(m[1], INK.faint);
    else if (m[2]) push(m[2], INK.muted);
    else if (m[3]) push(m[3], INK.blue);
    else if (m[4]) push(m[4], INK.blue);
    last = re.lastIndex;
  }
  if (last < code.length) push(code.slice(last));
  return out;
}

function InkCode({ file, lang, code, caption }) {
  const lines = code.replace(/\n$/, '').split('\n');
  return (
    <figure style={{ margin: '0 0 30px', border: `1.5px solid ${INK.ruleHard}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '9px 14px', borderBottom: `1px solid ${INK.rule}` }}>
        <Tag>{file}</Tag><Tag on>{lang}</Tag>
      </div>
      <pre style={{ margin: 0, padding: '16px 0', overflowX: 'auto', background: INK.paper }} className="ink-scroll">
        <code style={{ fontFamily: MONO, fontSize: 13, lineHeight: 1.7, display: 'block' }}>
          {lines.map((ln, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '44px 1fr', gap: 0 }}>
              <span style={{ color: INK.faint, textAlign: 'right', paddingRight: 16, userSelect: 'none' }}>{i + 1}</span>
              <span style={{ whiteSpace: 'pre', color: INK.ink }}>{hl(ln) }</span>
            </div>
          ))}
        </code>
      </pre>
      {caption && <figcaption style={{ fontFamily: MONO, fontSize: 10.5, color: INK.muted,
        letterSpacing: '0.06em', padding: '9px 14px', borderTop: `1px solid ${INK.rule}` }}>{caption}</figcaption>}
    </figure>
  );
}

// ═══════════════════════════════════════════════════════════════════
// TECHNICAL ARTICLE
// ═══════════════════════════════════════════════════════════════════
function InkTechArticle() {
  return (
    <InkChrome current="writing" foot="maxubrq.space / tech">
      <RunningHead text="maxubrq · vol.04 · tech" />
      <article style={{ maxWidth: 940, margin: '0 auto', padding: '0 44px' }}>
        <header style={{ padding: '46px 0 28px', borderBottom: `1.5px solid ${INK.ruleHard}` }}>
          <div style={{ display: 'flex', gap: 14, marginBottom: 20 }}>
            <Tag on>Tech</Tag><Tag>Essay Nº 003</Tag><Tag>12 min</Tag>
          </div>
          <h1 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 56, lineHeight: 0.96,
            letterSpacing: '-0.04em', margin: 0, textTransform: 'lowercase' }}>
            debounce, <span style={{ position: 'relative', color: INK.blue }}>rebuilt
              <Underline style={{ left: 0, bottom: -10 }} w={200} /></span>
          </h1>
        </header>

        <div style={{ padding: '30px 0 0', maxWidth: 720 }}>
          <p style={{ fontSize: 18, lineHeight: 1.62, margin: '0 0 1.3em' }}>
            <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: '3em', float: 'left',
              lineHeight: 0.78, margin: '0.05em 0.12em 0 0', color: INK.blue }}>D</span>
            ebounce is the function everyone copies and nobody reads. It collapses a burst of rapid events into a
            single action after they stop — a bet that only the last one matters. Here is the version you have
            pasted a hundred times.
          </p>

          <InkCode file="debounce.js" lang="javascript" caption="Fig. 1 — the version from the top search result"
            code={`function debounce(fn, wait) {
  let t;
  return function (...args) {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), wait);
  };
}`} />

          {/* Callout */}
          <div style={{ border: `1.5px solid ${INK.ruleHard}`, padding: '18px 20px', margin: '0 0 30px' }}>
            <Tag on>Where it breaks</Tag>
            <p style={{ fontSize: 15, lineHeight: 1.55, margin: '8px 0 0' }}>
              It never gives you the return value, it can’t be cancelled, and the leading-edge call — the one you
              usually want — is impossible. The bet is fine. The interface is the problem.
            </p>
          </div>

          {/* Diagram plate */}
          <figure style={{ margin: '0 0 30px', border: `1.5px solid ${INK.ruleHard}` }}>
            <div style={{ padding: '9px 14px', borderBottom: `1px solid ${INK.rule}` }}><Tag>Fig. 2 — the state machine</Tag></div>
            <div style={{ padding: '26px 24px', background: INK.paper }}>
              <svg viewBox="0 0 520 90" width="100%">
                {[['idle', 40], ['waiting', 230], ['fire', 420]].map(([label, x], i) => (
                  <g key={i}>
                    <rect x={x} y={22} width={90} height={44} fill={i === 2 ? INK.blue : 'none'}
                      stroke={INK.ruleHard} strokeWidth="1.5" />
                    <text x={x + 45} y={49} textAnchor="middle" fontFamily="IBM Plex Mono" fontSize="13"
                      fill={i === 2 ? '#fff' : INK.ink}>{label}</text>
                  </g>
                ))}
                <line x1={130} y1={44} x2={228} y2={44} stroke={INK.blue} strokeWidth="1.5" />
                <polygon points="228,44 220,40 220,48" fill={INK.blue} />
                <line x1={320} y1={44} x2={418} y2={44} stroke={INK.blue} strokeWidth="1.5" />
                <polygon points="418,44 410,40 410,48" fill={INK.blue} />
                <text x={179} y={16} textAnchor="middle" fontFamily="IBM Plex Mono" fontSize="10" fill={INK.muted}>event</text>
                <text x={369} y={16} textAnchor="middle" fontFamily="IBM Plex Mono" fontSize="10" fill={INK.muted}>wait ms</text>
              </svg>
            </div>
          </figure>

          <h2 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 28, letterSpacing: '-0.03em',
            textTransform: 'lowercase', lineHeight: 1.05, margin: '0 0 0.6em' }}>rebuild it as an object</h2>
          <p style={{ fontSize: 18, lineHeight: 1.62, margin: '0 0 1.3em' }}>
            Return a callable with methods. Now leading edge, cancel, and flush are just properties of the thing
            you already have.
          </p>

          <InkCode file="debounce.v2.js" lang="javascript" caption="Fig. 3 — cancellable, with a leading edge"
            code={`function debounce(fn, wait, { leading = false } = {}) {
  let t, result;
  const debounced = (...args) => {
    if (leading && !t) result = fn(...args);
    clearTimeout(t);
    t = setTimeout(() => { t = null; if (!leading) result = fn(...args); }, wait);
    return result;
  };
  debounced.cancel = () => { clearTimeout(t); t = null; };
  return debounced;
}`} />

          {/* Terminal */}
          <figure style={{ margin: '0 0 30px', border: `1.5px solid ${INK.ruleHard}`, background: INK.ink }}>
            <div style={{ padding: '9px 14px', borderBottom: `1px solid rgba(255,255,255,0.14)`,
              display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: MONO, fontSize: 10.5, letterSpacing: '0.14em', textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.5)' }}>terminal · node</span>
              <span style={{ fontFamily: MONO, fontSize: 10.5, color: 'rgba(255,255,255,0.5)' }}>▲ ▲ ▲</span>
            </div>
            <pre style={{ margin: 0, padding: '16px 18px', fontFamily: MONO, fontSize: 13, lineHeight: 1.7,
              color: '#e9e9ec' }}>
{`$ node bench.js
`}<span style={{ color: '#7f88ff' }}>naive     </span>{`  1.00× · no cancel, no leading
`}<span style={{ color: '#7f88ff' }}>rebuilt   </span>{`  1.00× · cancel ✓ leading ✓
`}<span style={{ color: '#7f88ff' }}>✓ done</span>{` in 0.4s`}
            </pre>
          </figure>

          <MetaFoot items={[
            ['Filed under', 'Tech / patterns'],
            ['Runtime', 'Node 22'],
            ['License', 'CC BY-NC 4.0'],
            ['Words', '1,880'],
          ]} />
        </div>
      </article>
    </InkChrome>
  );
}

// ═══════════════════════════════════════════════════════════════════
// TOPICS HUB + doorways
// ═══════════════════════════════════════════════════════════════════
const TOPICS = {
  science:    { blurb: 'Mostly physics and math, sometimes biology. Essays that begin with a small mechanical fact and end somewhere I did not expect.', n: 14 },
  software:   { blurb: 'Software, and the shape of thinking it asks of you. Patterns rebuilt from first principles; the cost of abstraction.', n: 11 },
  philosophy: { blurb: 'Attention, time, what it means to know a thing. Reading slowly as a practice, not a nostalgia.', n: 9 },
  art:        { blurb: 'Painting, music, the logic of composition. Why a grid can be devotion and colour is always a relationship.', n: 8 },
};
function InkTopicHub() {
  const order = ['science', 'software', 'philosophy', 'art'];
  return (
    <InkChrome current="topics" foot="maxubrq.space / topics">
      <section style={{ padding: '44px 30px 34px', borderBottom: `1.5px solid ${INK.ruleHard}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Tag>Four doorways</Tag><Tag>Index of subjects</Tag>
        </div>
        <h1 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 72, lineHeight: 0.92,
          letterSpacing: '-0.045em', margin: '12px 0 0', textTransform: 'lowercase' }}>
          pick a <span style={{ position: 'relative', color: INK.blue }}>doorway
            <Scribble style={{ left: -18, top: -16 }} w={280} h={110} /></span>.
        </h1>
      </section>
      <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
        {order.map((t, i) => (
          <a key={t} href="#" style={{ padding: '28px 26px 30px', color: INK.ink, textDecoration: 'none',
            borderRight: i % 2 === 0 ? `1.5px solid ${INK.ruleHard}` : 'none',
            borderBottom: i < 2 ? `1.5px solid ${INK.ruleHard}` : 'none', position: 'relative', minHeight: 200 }}
            onMouseEnter={e => { e.currentTarget.style.background = INK.blue; e.currentTarget.querySelectorAll('[data-h]').forEach(n => n.style.color = '#fff'); }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.querySelectorAll('[data-h]').forEach(n => n.style.color = n.dataset.h); }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
              <span data-h={INK.faint} style={{ fontFamily: MONO, fontSize: 13, color: INK.faint }}>0{i + 1}</span>
              <span data-h={INK.muted} style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em',
                textTransform: 'uppercase', color: INK.muted }}>{TOPICS[t].n} essays</span>
            </div>
            <h2 data-h={INK.blue} style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 46, letterSpacing: '-0.04em',
              lineHeight: 1, margin: '0 0 14px', textTransform: 'lowercase', color: INK.blue }}>{t}</h2>
            <p data-h={INK.muted} style={{ fontSize: 14, lineHeight: 1.5, color: INK.muted, margin: 0, maxWidth: '42ch' }}>
              {TOPICS[t].blurb}</p>
          </a>
        ))}
      </section>
    </InkChrome>
  );
}

function InkTopicPage({ topic = 'software' }) {
  const idx = ['science', 'software', 'philosophy', 'art'].indexOf(topic);
  const data = {
    software:   [['What a proof costs: a week with Lean', '2026·03', 12, false], ['Small models, small problems', '2026·02', 5, false], ['Caching, and the limits of knowing', '2025·10', 9, false], ['Debounce, rebuilt', '2025·07', 12, false]],
    philosophy: [['On reading slowly', '2026·03', 6, false], ['Đọc chậm — và tại sao nó quan trọng', '2026·01', 8, false], ['What I mean when I say “elegant”', '2025·09', 5, false]],
    art:        [['Agnes Martin and the grid as devotion', '2026·02', 7, false], ['Color is a relationship', '2025·11', 6, true], ['On negative space', '2025·06', 5, false]],
  }[topic];
  return (
    <InkChrome current="topics" foot={`maxubrq.space / ${topic}`}>
      <section style={{ position: 'relative', padding: '46px 30px 38px', borderBottom: `1.5px solid ${INK.ruleHard}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Tag on>Topic 0{idx + 1} / 04</Tag><Tag>{TOPICS[topic].n} essays</Tag>
        </div>
        <h1 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 100, lineHeight: 0.9,
          letterSpacing: '-0.05em', margin: '8px 0 0', textTransform: 'lowercase', color: INK.blue }}>{topic}</h1>
        <p style={{ maxWidth: '52ch', fontSize: 17, lineHeight: 1.5, margin: '18px 0 0',
          fontFamily: DISPLAY, fontWeight: 500 }}>{TOPICS[topic].blurb}</p>
      </section>
      <section style={{ padding: '0 30px 30px' }}>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {data.map(([title, date, time, live], i) => (
            <li key={i}>
              <a href="#" style={{ display: 'grid', gridTemplateColumns: '52px 1fr auto', gap: 20,
                alignItems: 'baseline', padding: '18px 0', borderTop: `1px solid ${INK.rule}`,
                color: INK.ink, textDecoration: 'none' }}
                onMouseEnter={e => e.currentTarget.style.color = INK.blue}
                onMouseLeave={e => e.currentTarget.style.color = INK.ink}>
                <span style={{ fontFamily: MONO, fontSize: 13, color: INK.faint }}>0{i + 1}</span>
                <span style={{ fontFamily: DISPLAY, fontSize: 22, fontWeight: 500, letterSpacing: '-0.02em' }}>
                  {title} {live && <span style={{ color: INK.blue, fontSize: 14 }}>●</span>}</span>
                <span style={{ fontFamily: MONO, fontSize: 11, color: INK.muted, whiteSpace: 'nowrap' }}>{date} · {time}′</span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </InkChrome>
  );
}

// ═══════════════════════════════════════════════════════════════════
// SERIES — shelf + page
// ═══════════════════════════════════════════════════════════════════
function InkSeriesShelf() {
  const vols = [
    { n: 'I',   title: 'TypeScript for the Strong Engineer', total: 8, done: 5, status: 'ongoing' },
    { n: 'II',  title: 'How I Learn Philosophy', total: 6, done: 2, status: 'ongoing' },
    { n: 'III', title: 'Small Infinities', total: 4, done: 1, status: 'ongoing' },
    { n: 'IV',  title: 'Mathematics for Developers', total: 7, done: 7, status: 'closed' },
  ];
  return (
    <InkChrome current="writing" foot="maxubrq.space / series">
      <section style={{ padding: '44px 30px 34px', borderBottom: `1.5px solid ${INK.ruleHard}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Tag>The shelf</Tag><Tag>{vols.length} volumes · some still open</Tag>
        </div>
        <h1 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 64, lineHeight: 0.94,
          letterSpacing: '-0.045em', margin: '12px 0 0', textTransform: 'lowercase' }}>
          essays that come in <span style={{ color: INK.blue }}>volumes</span>.
        </h1>
      </section>
      <section style={{ padding: '0 30px 30px' }}>
        {vols.map((v, i) => (
          <a key={i} href="#" style={{ display: 'grid', gridTemplateColumns: '90px 1fr 220px', gap: 24,
            alignItems: 'center', padding: '26px 0', borderBottom: `1.5px solid ${INK.ruleHard}`,
            color: INK.ink, textDecoration: 'none' }}
            onMouseEnter={e => e.currentTarget.querySelector('[data-t]').style.color = INK.blue}
            onMouseLeave={e => e.currentTarget.querySelector('[data-t]').style.color = INK.ink}>
            <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 44, letterSpacing: '-0.03em',
              color: INK.faint, lineHeight: 1 }}>{v.n}</span>
            <div>
              <div style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
                <Tag on={v.status === 'ongoing'}>{v.status === 'closed' ? '■ complete' : '● in progress'}</Tag>
                <Tag>{v.done} of {v.total} chapters</Tag>
              </div>
              <h2 data-t style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 26, letterSpacing: '-0.02em',
                margin: 0, textTransform: 'lowercase' }}>{v.title}</h2>
            </div>
            <div>
              <div style={{ display: 'flex', gap: 3 }}>
                {Array.from({ length: v.total }).map((_, k) => (
                  <div key={k} style={{ flex: 1, height: 8, border: `1px solid ${INK.ruleHard}`,
                    background: k < v.done ? INK.blue : 'transparent' }} />
                ))}
              </div>
              <div style={{ fontFamily: MONO, fontSize: 10.5, color: INK.muted, marginTop: 8, textAlign: 'right' }}>
                {Math.round(v.done / v.total * 100)}% read</div>
            </div>
          </a>
        ))}
      </section>
    </InkChrome>
  );
}

function InkSeriesPage() {
  const chapters = [
    ['Types are propositions', 8, 'read'],
    ['Narrowing, and the shape of a guard', 11, 'read'],
    ['The cost of any', 9, 'read'],
    ['Generics as functions on types', 14, 'read'],
    ['Variance, without the jargon', 12, 'reading'],
    ['Conditional types', 13, 'unread'],
    ['The type-level interpreter', 16, 'unread'],
    ['When to stop', 6, 'unread'],
  ];
  return (
    <InkChrome current="writing" foot="maxubrq.space / series">
      <RunningHead text="volume I · typescript" />
      <section style={{ display: 'grid', gridTemplateColumns: '1fr 320px', borderBottom: `1.5px solid ${INK.ruleHard}` }}>
        <div style={{ padding: '46px 26px 38px 30px', borderRight: `1.5px solid ${INK.ruleHard}` }}>
          <div style={{ display: 'flex', gap: 12, marginBottom: 18 }}>
            <Tag on>● Volume I · in progress</Tag><Tag>5 of 8 read</Tag>
          </div>
          <h1 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 48, lineHeight: 0.96,
            letterSpacing: '-0.04em', margin: 0, textTransform: 'lowercase' }}>
            typescript for the<br />strong engineer
          </h1>
          <p style={{ maxWidth: '48ch', fontSize: 16, lineHeight: 1.5, color: INK.muted, margin: '20px 0 0' }}>
            Eight chapters that treat the type system as a small language of its own — one worth learning
            deliberately, in order.
          </p>
        </div>
        <div className="ink-duo"><image-slot id="ink-series-cover" shape="rect" placeholder="volume plate"></image-slot></div>
      </section>
      <section style={{ padding: '0 30px 30px' }}>
        <div style={{ padding: '20px 0 4px' }}><Tag>Contents / 8 chapters</Tag></div>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {chapters.map(([title, time, state], i) => (
            <li key={i}>
              <a href="#" style={{ display: 'grid', gridTemplateColumns: '52px 1fr 130px auto', gap: 18,
                alignItems: 'baseline', padding: '16px 0', borderTop: `1px solid ${INK.rule}`,
                color: state === 'unread' ? INK.muted : INK.ink, textDecoration: 'none' }}
                onMouseEnter={e => e.currentTarget.style.color = INK.blue}
                onMouseLeave={e => e.currentTarget.style.color = state === 'unread' ? INK.muted : INK.ink}>
                <span style={{ fontFamily: MONO, fontSize: 13, color: INK.faint }}>{String(i + 1).padStart(2, '0')}</span>
                <span style={{ fontFamily: DISPLAY, fontSize: 21, fontWeight: 500, letterSpacing: '-0.02em' }}>{title}</span>
                <Tag on={state === 'reading'}>
                  {state === 'read' ? '✓ read' : state === 'reading' ? '● reading' : '— unread'}</Tag>
                <span style={{ fontFamily: MONO, fontSize: 11, color: INK.muted }}>{time}′</span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </InkChrome>
  );
}

// ═══════════════════════════════════════════════════════════════════
// READING MEMORY — article nudge, home rail, archive marks
// ═══════════════════════════════════════════════════════════════════
function InkMemoryArticle() {
  return (
    <InkChrome current="writing" foot="maxubrq.space / science">
      <RunningHead text="you were here · 62%" />
      {/* Return nudge */}
      <div style={{ background: INK.blue, color: '#fff', display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', padding: '14px 30px' }}>
        <div style={{ display: 'flex', gap: 14, alignItems: 'baseline' }}>
          <Tag style={{ color: 'rgba(255,255,255,0.7)' }}>You were here</Tag>
          <span style={{ fontFamily: DISPLAY, fontWeight: 500, fontSize: 16 }}>
            picking up in §III — 3 minutes to the end.</span>
        </div>
        <a href="#" style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase',
          color: '#fff', borderBottom: '2px solid #fff', paddingBottom: 2 }}>jump back →</a>
      </div>
      <article style={{ maxWidth: 780, margin: '0 auto', padding: '0 44px' }}>
        <header style={{ padding: '38px 0 26px', borderBottom: `1.5px solid ${INK.ruleHard}` }}>
          <div style={{ display: 'flex', gap: 14, marginBottom: 18 }}><Tag on>Science</Tag><Tag>62% read</Tag></div>
          <h1 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 46, lineHeight: 0.98,
            letterSpacing: '-0.035em', margin: 0, textTransform: 'lowercase' }}>
            the horizon of a pendulum
          </h1>
        </header>
        <div style={{ padding: '28px 0 0', position: 'relative' }}>
          {/* gutter glyph marking last position */}
          <div style={{ position: 'absolute', left: -34, top: 96, display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: 6 }}>
            <span style={{ width: 10, height: 10, background: INK.blue, borderRadius: '50%' }} />
            <span style={{ fontFamily: MONO, fontSize: 9, color: INK.blue, writingMode: 'vertical-rl',
              letterSpacing: '0.14em' }}>LAST HERE</span>
          </div>
          <p style={{ fontSize: 18, lineHeight: 1.64, margin: '0 0 1.3em', color: INK.muted }}>
            …the whole edifice of clockwork rested on the idea that a swinging weight is a thing that repeats.
          </p>
          <p style={{ fontSize: 18, lineHeight: 1.64, margin: '0 0 1.3em', paddingTop: 6, borderTop: `2px solid ${INK.blue}` }}>
            Add a second arm and the promise dissolves. The motion becomes something you cannot predict beyond
            the next few seconds — and this is exactly where you stopped last time. Determinism and predictability,
            which we assumed were one word, turn out to be strangers.
          </p>
          <p style={{ fontSize: 18, lineHeight: 1.64, margin: 0 }}>
            The smallest uncertainty in the present grows without bound. No paragraph teaches it the way your own
            hand will.
          </p>
        </div>
      </article>
    </InkChrome>
  );
}

function InkMemoryHome() {
  const resume = { topic: 'Science', title: 'The horizon of a pendulum', pct: 62, left: '3 min left' };
  const posts = [
    ['Philosophy', 'On reading slowly', '2026·03·28', 6, 0],
    ['Tech', 'What a proof costs: a week with Lean', '2026·03·09', 12, 40],
    ['Art', 'Agnes Martin and the grid as devotion', '2026·02·22', 7, 0],
    ['Tech', 'Small models, small problems', '2026·02·01', 5, 100],
  ];
  return (
    <InkChrome current="writing">
      <section style={{ padding: '40px 30px 26px', borderBottom: `1.5px solid ${INK.ruleHard}` }}>
        <Tag>Welcome back</Tag>
        <h1 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 52, lineHeight: 0.95,
          letterSpacing: '-0.04em', margin: '12px 0 0', textTransform: 'lowercase' }}>
          pick up where you<br />left <span style={{ color: INK.blue }}>off</span>.
        </h1>
      </section>
      {/* Resume card */}
      <a href="#" style={{ display: 'grid', gridTemplateColumns: '1fr 260px', borderBottom: `1.5px solid ${INK.ruleHard}`,
        color: INK.ink, textDecoration: 'none' }}>
        <div style={{ padding: '26px 26px 28px 30px', borderRight: `1.5px solid ${INK.ruleHard}` }}>
          <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
            <Tag on>● resume</Tag><Tag>{resume.topic}</Tag><Tag>{resume.left}</Tag>
          </div>
          <h2 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 32, letterSpacing: '-0.03em',
            lineHeight: 1.02, margin: '0 0 20px', textTransform: 'lowercase' }}>{resume.title}</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ flex: 1, height: 6, background: INK.rule }}>
              <div style={{ height: '100%', width: `${resume.pct}%`, background: INK.blue }} />
            </div>
            <span style={{ fontFamily: MONO, fontSize: 12, color: INK.blue }}>{resume.pct}%</span>
          </div>
        </div>
        <div className="ink-duo"><image-slot id="ink-memory-hero" shape="rect" placeholder="plate"></image-slot></div>
      </a>
      {/* rest */}
      <section style={{ padding: '10px 30px 30px' }}>
        <div style={{ padding: '18px 0 4px' }}><Tag>Also unread</Tag></div>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {posts.map(([topic, title, date, time, pct], i) => (
            <li key={i}>
              <a href="#" style={{ display: 'grid', gridTemplateColumns: '118px 1fr 90px auto', gap: 18,
                alignItems: 'center', padding: '15px 0', borderTop: `1px solid ${INK.rule}`,
                color: INK.ink, textDecoration: 'none' }}
                onMouseEnter={e => e.currentTarget.style.color = INK.blue}
                onMouseLeave={e => e.currentTarget.style.color = INK.ink}>
                <Tag>{topic}</Tag>
                <span style={{ fontFamily: DISPLAY, fontSize: 20, fontWeight: 500, letterSpacing: '-0.02em' }}>{title}</span>
                <span style={{ height: 4, background: INK.rule, position: 'relative' }}>
                  {pct > 0 && <span style={{ position: 'absolute', inset: 0, width: `${pct}%`, background: pct === 100 ? INK.faint : INK.blue }} />}
                </span>
                <span style={{ fontFamily: MONO, fontSize: 11, color: INK.muted, whiteSpace: 'nowrap' }}>
                  {pct === 100 ? 'done' : pct > 0 ? `${pct}%` : `${time}′`}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </InkChrome>
  );
}

Object.assign(window, { InkTechArticle, InkTopicHub, InkTopicPage, InkSeriesShelf, InkSeriesPage, InkMemoryArticle, InkMemoryHome });
