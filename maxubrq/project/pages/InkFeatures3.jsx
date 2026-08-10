// InkFeatures3.jsx — Margin questions, Long-form, and the ✦ magic tier:
// Fair-witness drawer, Constellation, The Companion. Shared kit from window.

const { INK, DISPLAY, BODY, MONO, Tag, Scribble, Underline, ArrowMark, DuoPhoto, RunningHead, MetaFoot, InkChrome } = window;

// ═══════════════════════════════════════════════════════════════════
// MARGIN QUESTION — a pause to think, never a test
// ═══════════════════════════════════════════════════════════════════
function InkMarginQuestion() {
  const [revealed, setRevealed] = React.useState(false);
  return (
    <InkChrome current="writing" foot="maxubrq.space / tech">
      <RunningHead text="a pause to think" />
      <article style={{ maxWidth: 760, margin: '0 auto', padding: '0 44px' }}>
        <header style={{ padding: '46px 0 26px', borderBottom: `1.5px solid ${INK.ruleHard}` }}>
          <div style={{ display: 'flex', gap: 14, marginBottom: 18 }}><Tag on>Tech</Tag><Tag>Essay Nº 003</Tag></div>
          <h1 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 48, lineHeight: 0.97,
            letterSpacing: '-0.04em', margin: 0, textTransform: 'lowercase' }}>debounce, rebuilt</h1>
        </header>
        <div style={{ padding: '30px 0 0' }}>
          <p style={{ fontSize: 18, lineHeight: 1.64, margin: '0 0 1.3em' }}>
            The naive debounce keeps a single timer and resets it on every call. That much you can read off the
            code. But before we make it cancellable, it’s worth stopping — because the interface you’d reach for
            depends entirely on one decision.
          </p>

          {/* The pause */}
          <div style={{ border: `1.5px solid ${INK.ruleHard}`, margin: '4px 0 30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '11px 18px', background: INK.blue, color: '#fff' }}>
              <span style={{ fontFamily: MONO, fontSize: 10.5, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                Before you scroll</span>
              <span style={{ fontFamily: MONO, fontSize: 10.5, letterSpacing: '0.1em', opacity: 0.8 }}>a pause · not a test</span>
            </div>
            <div style={{ padding: '22px 20px' }}>
              <p style={{ fontFamily: DISPLAY, fontWeight: 500, fontSize: 23, lineHeight: 1.2,
                letterSpacing: '-0.02em', margin: '0 0 18px', textTransform: 'lowercase' }}>
                what does the return value of a debounced function even mean, if the real call happens later?
              </p>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <div style={{ flex: 1, border: `1px solid ${INK.rule}`, padding: '10px 14px',
                  fontFamily: MONO, fontSize: 12.5, color: INK.faint }}>your guess…</div>
                <button onClick={() => setRevealed(v => !v)} style={{ border: `1.5px solid ${INK.ruleHard}`,
                  background: revealed ? INK.ink : 'transparent', color: revealed ? '#fff' : INK.ink,
                  fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase',
                  padding: '11px 16px', cursor: 'pointer' }}>{revealed ? 'hide' : 'reveal'}</button>
              </div>
              {revealed && (
                <div style={{ marginTop: 18, paddingTop: 16, borderTop: `2px solid ${INK.blue}` }}>
                  <Tag on>The thought</Tag>
                  <p style={{ fontSize: 15, lineHeight: 1.6, margin: '8px 0 0' }}>
                    It can only return the value from the <em>previous</em> settled call — never the current one.
                    That single fact is why the honest interface returns an object with <code style={{ fontFamily: MONO,
                    fontSize: 13, color: INK.blue }}>.cancel()</code> and <code style={{ fontFamily: MONO, fontSize: 13,
                    color: INK.blue }}>.flush()</code>, rather than pretending to be a normal function.
                  </p>
                </div>
              )}
            </div>
          </div>

          <p style={{ fontSize: 18, lineHeight: 1.64, margin: 0, color: revealed ? INK.ink : INK.faint }}>
            With that settled, the rebuild almost writes itself. Return a callable, hang the controls off it as
            properties, and the leading edge becomes one more option rather than a rewrite.
          </p>
        </div>
      </article>
    </InkChrome>
  );
}

// ═══════════════════════════════════════════════════════════════════
// LONG-FORM — front matter + named movements + journey rail
// ═══════════════════════════════════════════════════════════════════
function InkLongForm() {
  const movements = [
    ['I', 'The promise that repeats', 'read'],
    ['II', 'The hinge', 'reading'],
    ['III', 'Two strangers: determinism & prediction', 'unread'],
    ['IV', 'What the hand knows', 'unread'],
  ];
  return (
    <InkChrome current="writing" foot="maxubrq.space / long-form">
      <RunningHead text="an essay in four movements" />
      {/* Front matter */}
      <section style={{ padding: '56px 30px 46px', borderBottom: `1.5px solid ${INK.ruleHard}`, textAlign: 'center', position: 'relative' }}>
        <Tag>Long-form · 8,200 words · 34 min</Tag>
        <h1 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 72, lineHeight: 0.94,
          letterSpacing: '-0.045em', margin: '18px auto 0', maxWidth: '16ch', textTransform: 'lowercase' }}>
          the horizon of a <span style={{ color: INK.blue }}>pendulum</span>
        </h1>
        <p style={{ fontFamily: DISPLAY, fontWeight: 500, fontSize: 20, color: INK.muted, margin: '18px auto 0',
          maxWidth: '40ch', textTransform: 'lowercase' }}>
          and other small infinities — an essay in four movements
        </p>
        <p style={{ fontFamily: BODY, fontStyle: 'italic', fontSize: 15, color: INK.muted, margin: '30px auto 0',
          maxWidth: '46ch', lineHeight: 1.6, borderTop: `1px solid ${INK.rule}`, paddingTop: 20 }}>
          “Prediction is very difficult, especially about the future.” — attributed, wrongly, to almost everyone
        </p>
      </section>

      {/* Journey rail + body */}
      <section style={{ display: 'grid', gridTemplateColumns: '230px 1fr' }}>
        <aside style={{ borderRight: `1.5px solid ${INK.ruleHard}`, padding: '26px 22px', position: 'sticky', top: 0, alignSelf: 'start' }}>
          <Tag>The journey · 34 min</Tag>
          <div style={{ marginTop: 18 }}>
            {movements.map(([n, title, state], i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '22px 1fr', gap: 12,
                padding: '12px 0', borderTop: i ? `1px solid ${INK.rule}` : 'none',
                opacity: state === 'unread' ? 0.5 : 1 }}>
                <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 15,
                  color: state === 'reading' ? INK.blue : INK.faint }}>{n}</span>
                <div>
                  <div style={{ fontFamily: DISPLAY, fontWeight: 500, fontSize: 14.5, lineHeight: 1.25,
                    color: state === 'reading' ? INK.blue : INK.ink }}>{title}</div>
                  <div style={{ marginTop: 5 }}>
                    <Tag on={state === 'reading'}>{state === 'read' ? '✓ read' : state === 'reading' ? '● you are here' : '— ahead'}</Tag>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 18, paddingTop: 14, borderTop: `1.5px solid ${INK.ruleHard}` }}>
            <div style={{ height: 6, background: INK.rule }}>
              <div style={{ height: '100%', width: '38%', background: INK.blue }} />
            </div>
            <div style={{ fontFamily: MONO, fontSize: 10.5, color: INK.muted, marginTop: 8 }}>38% · 21 min left</div>
          </div>
        </aside>

        <div style={{ padding: '30px 44px', maxWidth: 720 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 20 }}>
            <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 30, color: INK.blue, letterSpacing: '-0.03em' }}>II</span>
            <h2 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 30, letterSpacing: '-0.03em',
              margin: 0, textTransform: 'lowercase' }}>the hinge</h2>
          </div>
          <p style={{ fontSize: 18, lineHeight: 1.66, margin: '0 0 1.3em' }}>
            <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: '3em', float: 'left',
              lineHeight: 0.78, margin: '0.05em 0.12em 0 0', color: INK.blue }}>A</span>
            dd a second arm — a pendulum hanging off the end of another — and the promise dissolves. The motion
            becomes something you cannot predict beyond the next few seconds, no matter how precisely you measure
            the start.
          </p>
          <p style={{ fontSize: 18, lineHeight: 1.66, margin: '0 0 1.3em' }}>
            Nothing was added but a hinge. The equations did not get harder to write. They got impossible to
            outrun. This is the moment the essay turns, and the three movements ahead all live in its shadow.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, margin: '10px 0 0' }}>
            <span style={{ flex: 1, height: 1.5, background: INK.rule }} />
            <span style={{ fontFamily: DISPLAY, fontSize: 20, color: INK.faint }}>❧</span>
            <span style={{ flex: 1, height: 1.5, background: INK.rule }} />
          </div>
        </div>
      </section>
    </InkChrome>
  );
}

// ═══════════════════════════════════════════════════════════════════
// FAIR-WITNESS DRAWER — the crowd, only after you finish. Counts only.
// ═══════════════════════════════════════════════════════════════════
function InkWitness() {
  const ret = [1, .99, .96, .92, .9, .85, .82, .8, .77, .7, .66, .63, .6, .58, .56];
  const W = 520, H = 120;
  const pts = ret.map((v, i) => `${(i / (ret.length - 1)) * W},${H - v * (H - 8)}`).join(' ');
  const passages = [['a system so simple it fits in one equation can still refuse to tell you where it will be', 34],
    ['determinism and predictability turn out to be strangers', 28], ['nothing was added but a hinge', 19]];
  const reactions = [['stayed with me', 51], ['changed my mind', 22], ['already knew', 14], ['confused', 6]];
  return (
    <div className="ink-root" style={{ height: '100%', background: INK.paper, color: INK.ink,
      fontFamily: BODY, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '18px 30px', borderBottom: `1.5px solid ${INK.ruleHard}` }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
          <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 20, letterSpacing: '-0.03em' }}>the witness</span>
          <Tag on>✦ opens only after you finish</Tag>
        </div>
        <Tag>counts only · never names</Tag>
      </div>
      <div className="ink-scroll" style={{ overflowY: 'auto', flex: 1 }}>
        {/* Count + pull quote */}
        <section style={{ display: 'grid', gridTemplateColumns: '260px 1fr', borderBottom: `1.5px solid ${INK.ruleHard}` }}>
          <div style={{ padding: '28px 26px', borderRight: `1.5px solid ${INK.ruleHard}` }}>
            <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 68, letterSpacing: '-0.04em',
              lineHeight: 0.9, color: INK.blue }}>214</span>
            <Tag style={{ display: 'block', marginTop: 10 }}>readers reached the end-mark</Tag>
            <p style={{ fontSize: 13, lineHeight: 1.5, color: INK.muted, margin: '14px 0 0' }}>
              You are one of them. Everything below stayed hidden until you finished.
            </p>
          </div>
          <div style={{ padding: '28px 30px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Tag>What most of us came away with</Tag>
            <p style={{ fontFamily: DISPLAY, fontWeight: 500, fontSize: 27, lineHeight: 1.15,
              letterSpacing: '-0.02em', margin: '12px 0 0', textTransform: 'lowercase' }}>
              “determinism and predictability, which we assumed were one word, turn out to be strangers.”
            </p>
          </div>
        </section>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
          {/* Retention */}
          <div style={{ padding: '24px 26px', borderRight: `1.5px solid ${INK.ruleHard}`, borderBottom: `1.5px solid ${INK.ruleHard}` }}>
            <Tag on>Where the crowd slowed</Tag>
            <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block', marginTop: 16 }}>
              <polyline points={`0,${H} ${pts} ${W},${H}`} fill={INK.blue} opacity="0.1" />
              <polyline points={pts} fill="none" stroke={INK.blue} strokeWidth="2.5" />
            </svg>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
              <Tag>§I</Tag><Tag>§II · the hinge</Tag><Tag>end</Tag>
            </div>
          </div>
          {/* Reactions — ribbons, counts only */}
          <div style={{ padding: '24px 26px', borderBottom: `1.5px solid ${INK.ruleHard}` }}>
            <Tag on>How it landed</Tag>
            <div style={{ marginTop: 16 }}>
              {reactions.map(([r, n], i) => (
                <div key={i} style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                    <span style={{ fontFamily: DISPLAY, fontSize: 14, fontWeight: 500 }}>{r}</span>
                    <span style={{ fontFamily: MONO, fontSize: 12, color: INK.blue }}>{n}</span>
                  </div>
                  <div style={{ height: 3, background: INK.rule }}>
                    <div style={{ height: '100%', width: `${n / 51 * 100}%`, background: INK.blue }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top passages */}
        <section style={{ padding: '24px 26px', borderBottom: `1.5px solid ${INK.ruleHard}` }}>
          <Tag on>The sentences we kept</Tag>
          <ul style={{ listStyle: 'none', padding: 0, margin: '14px 0 0' }}>
            {passages.map(([t, n], i) => (
              <li key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 48px', gap: 14, alignItems: 'baseline',
                padding: '12px 0', borderTop: i ? `1px solid ${INK.rule}` : 'none' }}>
                <span style={{ fontFamily: DISPLAY, fontSize: 17, fontWeight: 500, lineHeight: 1.3 }}>“{t}”</span>
                <span style={{ fontFamily: MONO, fontSize: 12, color: INK.blue, textAlign: 'right' }}>{n}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Anonymous letters */}
        <section style={{ padding: '24px 26px' }}>
          <Tag on>Letters, left anonymously</Tag>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginTop: 16 }}>
            {[['I read this on a train and missed my stop.', 'anon'],
              ['Tôi đã đọc lại đoạn về sự phân kỳ ba lần.', 'anon']].map(([t, m], i) => (
              <div key={i} style={{ border: `1.5px solid ${INK.ruleHard}`, padding: '18px 20px' }}>
                <p style={{ fontFamily: DISPLAY, fontWeight: 500, fontSize: 16, lineHeight: 1.4, margin: '0 0 10px' }}>“{t}”</p>
                <Tag>{m}</Tag>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// CONSTELLATION — a chart of your reading
// ═══════════════════════════════════════════════════════════════════
function InkConstellation() {
  // stars: [x, y, r, topic, label, read]
  const stars = [
    [120, 120, 9, 'sci', 'pendulum', true], [220, 200, 6, 'sci', 'phase diagrams', true],
    [80, 260, 5, 'sci', 'second law', false], [300, 110, 7, 'tech', 'debounce', true],
    [420, 180, 5, 'tech', 'caching', true], [380, 300, 6, 'tech', 'small models', false],
    [540, 130, 6, 'phi', 'reading slowly', true], [620, 240, 5, 'phi', 'elegant', false],
    [560, 340, 5, 'phi', 'đọc chậm', true], [720, 150, 7, 'art', 'agnes martin', true],
    [780, 280, 6, 'art', 'colour', true], [700, 360, 5, 'art', 'negative space', false],
  ];
  const readOrder = [0, 3, 6, 9, 4, 10, 1, 8]; // ember thread through visited
  const cites = [[0, 4], [3, 4], [6, 8], [9, 10], [0, 1]];
  const pos = i => `${stars[i][0]},${stars[i][1]}`;
  const topicColor = { sci: INK.blue, tech: INK.ink, phi: INK.blue, art: INK.ink };

  // DOMAINS — the four regions, drawn as the bounding box of their stars.
  const domains = { sci: 'Sciences', tech: 'Software', phi: 'Philosophy', art: 'Arts' };
  const domainBox = key => {
    const ms = stars.filter(s => s[3] === key);
    const pad = 34;
    const xs = ms.map(s => s[0]), ys = ms.map(s => s[1]);
    return { x: Math.min(...xs) - pad, y: Math.min(...ys) - pad,
      w: Math.max(...xs) - Math.min(...xs) + pad * 2, h: Math.max(...ys) - Math.min(...ys) + pad * 2 };
  };

  // CONCEPTS — abstract ideas that recur across posts. No coordinates of their
  // own: each floats at the centroid of its member stars and "assembles"
  // (fills) as you read them. Cross-domain concepts sit between the regions.
  const concepts = [
    { label: 'Emergence', members: [0, 1, 5] },
    { label: 'Iteration', members: [3, 4, 5] },
    { label: 'Slowness', members: [6, 8, 11] },
    { label: 'The Horizon', members: [0, 6] },
  ];
  const conceptXY = m => [m.reduce((s, i) => s + stars[i][0], 0) / m.length,
                          m.reduce((s, i) => s + stars[i][1], 0) / m.length];
  const conceptFill = m => m.filter(i => stars[i][5]).length / m.length;
  const dia = (cx, cy, r) => `M ${cx} ${cy - r} L ${cx + r} ${cy} L ${cx} ${cy + r} L ${cx - r} ${cy} Z`;

  const [showConcepts, setShowConcepts] = React.useState(true);
  const [showDomains, setShowDomains] = React.useState(true);
  const assembled = concepts.filter(c => conceptFill(c.members) === 1).length;

  const ToggleBtn = ({ on, onClick, children }) => (
    <button onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: 7, border: 'none',
      background: 'transparent', cursor: 'pointer', padding: 0, fontFamily: MONO, fontSize: 11,
      color: on ? INK.ink : INK.faint, letterSpacing: '0.04em' }}>
      <span style={{ width: 11, height: 11, borderRadius: '50%', border: `1.5px solid ${on ? INK.blue : INK.rule}`,
        background: on ? INK.blue : 'transparent' }} />{children}</button>
  );

  return (
    <div className="ink-root" style={{ height: '100%', background: INK.paper, color: INK.ink,
      fontFamily: BODY, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
        padding: '20px 30px', borderBottom: `1.5px solid ${INK.ruleHard}` }}>
        <div>
          <Tag>Plate XII</Tag>
          <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 24, letterSpacing: '-0.03em',
            marginTop: 4, textTransform: 'lowercase' }}>the reader’s sky</div>
        </div>
        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          <ToggleBtn on={showConcepts} onClick={() => setShowConcepts(v => !v)}>Concepts</ToggleBtn>
          <ToggleBtn on={showDomains} onClick={() => setShowDomains(v => !v)}>Domains</ToggleBtn>
        </div>
      </div>

      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <svg viewBox="0 0 860 440" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
          {/* faint grid */}
          {Array.from({ length: 9 }).map((_, i) => (
            <line key={'v' + i} x1={i * 100} y1="0" x2={i * 100} y2="440" stroke={INK.rule} strokeWidth="0.5" />
          ))}
          {Array.from({ length: 5 }).map((_, i) => (
            <line key={'h' + i} x1="0" y1={i * 100} x2="860" y2={i * 100} stroke={INK.rule} strokeWidth="0.5" />
          ))}
          {/* DOMAIN regions — faint bounding boxes with a name */}
          {showDomains && Object.entries(domains).map(([key, name], i) => {
            const b = domainBox(key);
            return (
              <g key={'dom' + key}>
                <rect x={b.x} y={b.y} width={b.w} height={b.h} fill={INK.blue}
                  opacity={i % 2 ? 0.04 : 0.025} stroke={INK.rule} strokeWidth="0.5" strokeDasharray="3 5" />
                <text x={b.x + 6} y={b.y + 15} fontFamily="IBM Plex Mono" fontSize="9.5"
                  letterSpacing="2" fill={INK.muted} style={{ textTransform: 'uppercase' }}>{name}</text>
              </g>
            );
          })}
          {/* citation lines — engraved dotted */}
          {cites.map(([a, b], i) => (
            <line key={'c' + i} x1={stars[a][0]} y1={stars[a][1]} x2={stars[b][0]} y2={stars[b][1]}
              stroke={INK.faint} strokeWidth="1" strokeDasharray="2 4" />
          ))}
          {/* CONCEPT tethers — each concept to its member stars */}
          {showConcepts && concepts.flatMap((c, ci) => {
            const [cx, cy] = conceptXY(c.members);
            return c.members.map((i, k) => (
              <line key={'ct' + ci + '-' + k} x1={cx} y1={cy} x2={stars[i][0]} y2={stars[i][1]}
                stroke={INK.blue} strokeWidth="0.6" strokeDasharray="1 4" opacity="0.4" />
            ));
          })}
          {/* ember thread — your reading order */}
          <polyline points={readOrder.map(pos).join(' ')} fill="none" stroke={INK.blue} strokeWidth="1.6" opacity="0.85" />
          {/* stars */}
          {stars.map(([x, y, r, topic, label, read], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r={r} fill={read ? topicColor[topic] : 'none'}
                stroke={topicColor[topic]} strokeWidth="1.5" />
              <text x={x + r + 6} y={y + 4} fontFamily="IBM Plex Mono" fontSize="10.5"
                fill={read ? INK.ink : INK.muted}>{label}</text>
            </g>
          ))}
          {/* CONCEPT nodes — open diamonds at the centroid, filled by how assembled */}
          {showConcepts && concepts.map((c, ci) => {
            const [cx, cy] = conceptXY(c.members);
            const a = conceptFill(c.members);
            const s = 9;
            return (
              <g key={'cn' + ci}>
                {a === 1 && <path d={dia(cx, cy, s + 4)} fill="none" stroke={INK.blue} strokeWidth="0.6" opacity="0.7" />}
                <path d={dia(cx, cy, s)} fill={INK.paper} stroke={INK.blue} strokeWidth="1.4" />
                {a > 0 && <path d={dia(cx, cy, s * a)} fill={INK.blue} opacity="0.9" />}
                <text x={cx} y={cy + s + 15} textAnchor="middle" fontFamily="IBM Plex Mono" fontSize="9"
                  letterSpacing="1.6" fill={INK.ink} style={{ textTransform: 'uppercase' }}>{c.label}</text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 24, padding: '14px 30px', borderTop: `1.5px solid ${INK.ruleHard}`, flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <svg width="30" height="10"><line x1="0" y1="5" x2="30" y2="5" stroke={INK.blue} strokeWidth="1.6" /></svg>
          <Tag>your reading order</Tag></span>
        <span style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <svg width="30" height="10"><line x1="0" y1="5" x2="30" y2="5" stroke={INK.faint} strokeWidth="1" strokeDasharray="2 4" /></svg>
          <Tag>citation</Tag></span>
        <span style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <svg width="12" height="12"><circle cx="6" cy="6" r="5" fill={INK.blue} /></svg><Tag>read</Tag></span>
        <span style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <svg width="16" height="16"><path d="M 8 1 L 15 8 L 8 15 L 1 8 Z" fill="none" stroke={INK.blue} strokeWidth="1.4" /><path d="M 8 4.5 L 11.5 8 L 8 11.5 L 4.5 8 Z" fill={INK.blue} /></svg>
          <Tag>concept (fills as you read)</Tag></span>
        <span style={{ marginLeft: 'auto' }}><Tag on>{assembled} of {concepts.length} concepts assembled</Tag></span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// THE COMPANION — margin AI that cites, and refuses to invent
// ═══════════════════════════════════════════════════════════════════
function InkCompanion() {
  const Cite = ({ children }) => (
    <span style={{ fontFamily: MONO, fontSize: 11, color: INK.blue, border: `1px solid ${INK.blue}`,
      padding: '1px 5px', margin: '0 2px', whiteSpace: 'nowrap' }}>{children}</span>
  );
  return (
    <InkChrome current="writing" foot="maxubrq.space / companion">
      <section style={{ display: 'grid', gridTemplateColumns: '1fr 400px', minHeight: '100%' }}>
        {/* Reading column */}
        <div style={{ padding: '40px 44px', borderRight: `1.5px solid ${INK.ruleHard}` }}>
          <Tag on>Science · §III</Tag>
          <h1 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 34, letterSpacing: '-0.03em',
            lineHeight: 1.02, margin: '12px 0 24px', textTransform: 'lowercase' }}>two strangers</h1>
          <p style={{ fontSize: 18, lineHeight: 1.66, margin: '0 0 1.3em' }}>
            Every future is fixed — the physics is exact, reversible, without a single random term — and yet the
            future is unknowable, because the smallest uncertainty in the present grows without bound.
          </p>
          <p style={{ fontSize: 18, lineHeight: 1.66, margin: 0, color: INK.muted }}>
            Determinism and predictability, which we quietly assumed were the same word, turn out to be strangers.
          </p>
        </div>

        {/* Companion gutter */}
        <aside style={{ background: INK.paper2, padding: '24px 24px 30px', display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 16, letterSpacing: '-0.02em' }}>ask the margin</span>
            <Tag on>✦ reads only this site</Tag>
          </div>

          {/* the ask */}
          <div style={{ border: `1.5px solid ${INK.ruleHard}`, background: INK.paper, padding: '14px 16px' }}>
            <Tag>you asked</Tag>
            <p style={{ fontFamily: DISPLAY, fontWeight: 500, fontSize: 16, lineHeight: 1.3, margin: '6px 0 0' }}>
              is a double pendulum actually random?
            </p>
          </div>

          {/* the answer with citations */}
          <div style={{ border: `1.5px solid ${INK.blue}`, padding: '14px 16px' }}>
            <Tag on>the margin answers</Tag>
            <p style={{ fontSize: 14, lineHeight: 1.6, margin: '8px 0 0' }}>
              No — it’s fully deterministic. The essay is explicit that the physics has
              <Cite>§III ¶1</Cite> “not a single random term.” What makes it feel random is sensitivity: the
              smallest uncertainty <Cite>§II ¶2</Cite> “grows without bound.”
            </p>
            <div style={{ borderTop: `1px solid ${INK.rule}`, marginTop: 12, paddingTop: 10, display: 'flex', gap: 8 }}>
              <Tag>2 citations</Tag><Tag>from this essay only</Tag>
            </div>
          </div>

          {/* the refusal */}
          <div style={{ border: `1.5px dashed ${INK.ruleHard}`, padding: '14px 16px' }}>
            <Tag>when it can’t find it</Tag>
            <p style={{ fontSize: 14, lineHeight: 1.6, margin: '8px 0 0', color: INK.muted }}>
              You asked about the <em>Lyapunov exponent’s exact value</em>. I can’t find that in what you’ve read
              — this essay names the idea but never gives a number. I won’t invent one.
            </p>
          </div>

          <div style={{ marginTop: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
            <div style={{ flex: 1, border: `1px solid ${INK.rule}`, background: INK.paper, padding: '10px 12px',
              fontFamily: MONO, fontSize: 12, color: INK.faint }}>ask about what you’ve read…</div>
            <span style={{ fontFamily: MONO, fontSize: 12, color: INK.blue }}>↵</span>
          </div>
        </aside>
      </section>
    </InkChrome>
  );
}

Object.assign(window, { InkMarginQuestion, InkLongForm, InkWitness, InkConstellation, InkCompanion });
