// InkFeatures.jsx — the reading apparatus, in the ink edition vocabulary.
// Universal search (⌘K), interactive glossary, margin side-notes, and the
// author-only reader-signals dashboard. Shared kit pulled from window
// (exported by InkEdition.jsx — separate babel scope).

const { INK, DISPLAY, BODY, MONO, Tag, Scribble, Underline, ArrowMark, DuoPhoto, RunningHead, MetaFoot, InkChrome } = window;

// ═══════════════════════════════════════════════════════════════════
// UNIVERSAL SEARCH — ⌘K, a brutalist index-card drawer
// ═══════════════════════════════════════════════════════════════════
function InkSearch() {
  const scopes = [['All', 42], ['Posts', 28], ['Sections', 9], ['Passages', 4], ['My marks', 1]];
  const [scope, setScope] = React.useState('All');
  const results = [
    { topic: 'Science', kind: 'Essay', title: 'The horizon of a pendulum', snip: 'a system so simple it fits in a single equation can still refuse to tell you where it will be…', coord: '§2 · Apr 2026', live: true },
    { topic: 'Science', kind: 'Section', title: '§ You can grab and pull', snip: 'set it swinging, then set it swinging again from a spot a hair’s breadth away…', coord: 'in “pendulum”' },
    { topic: 'Science', kind: 'Passage', title: '“divergence is the whole essay”', snip: 'a passage you underlined on Apr 16', coord: 'your mark · private' },
    { topic: 'Tech', kind: 'Essay', title: 'Caching, and the limits of knowing', snip: 'a cache is a bet that the past predicts the future. the pendulum says otherwise…', coord: '§4 · Oct 2025' },
  ];
  return (
    <div className="ink-root" style={{ height: '100%', background: INK.paper, color: INK.ink,
      fontFamily: BODY, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Search field */}
      <div style={{ borderBottom: `1.5px solid ${INK.ruleHard}`, padding: '26px 30px',
        display: 'flex', alignItems: 'center', gap: 18 }}>
        <span style={{ fontFamily: MONO, fontSize: 12, color: INK.blue, letterSpacing: '0.1em' }}>⌕</span>
        <div style={{ flex: 1, display: 'flex', alignItems: 'baseline' }}>
          <span style={{ fontFamily: DISPLAY, fontWeight: 500, fontSize: 40, letterSpacing: '-0.03em',
            color: INK.ink }}>pendulum</span>
          <span style={{ width: 2, height: 38, background: INK.blue, marginLeft: 4,
            animation: 'none', display: 'inline-block' }} />
        </div>
        <Tag>esc to close</Tag>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '210px 1fr', flex: 1, minHeight: 0 }}>
        {/* Scopes rail */}
        <aside style={{ borderRight: `1.5px solid ${INK.ruleHard}`, padding: '18px 0' }}>
          <div style={{ padding: '0 22px 10px' }}><Tag>Scope</Tag></div>
          {scopes.map(([s, n]) => (
            <button key={s} onClick={() => setScope(s)} style={{ display: 'flex', width: '100%',
              justifyContent: 'space-between', alignItems: 'center', border: 'none', cursor: 'pointer',
              background: scope === s ? INK.blue : 'transparent', color: scope === s ? '#fff' : INK.ink,
              fontFamily: MONO, fontSize: 12, letterSpacing: '0.05em', padding: '10px 22px', textAlign: 'left' }}>
              <span>{s}</span>
              <span style={{ opacity: 0.6, fontSize: 11 }}>{n}</span>
            </button>
          ))}
          <div style={{ padding: '18px 22px 0', marginTop: 8, borderTop: `1px solid ${INK.rule}` }}>
            <Tag>Filter by topic</Tag>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
              {['Science', 'Tech', 'Philosophy', 'Art'].map(t => (
                <span key={t} style={{ fontFamily: MONO, fontSize: 10.5, letterSpacing: '0.06em',
                  border: `1px solid ${INK.rule}`, padding: '4px 8px', color: INK.muted }}>{t}</span>
              ))}
            </div>
          </div>
        </aside>
        {/* Results */}
        <div className="ink-scroll" style={{ overflowY: 'auto' }}>
          <div style={{ padding: '14px 30px 6px' }}><Tag>4 results · sorted by relevance</Tag></div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {results.map((r, i) => (
              <li key={i}>
                <a href="#" style={{ display: 'block', padding: '16px 30px', textDecoration: 'none',
                  color: INK.ink, borderTop: `1px solid ${INK.rule}`, position: 'relative' }}
                  onMouseEnter={e => e.currentTarget.style.background = INK.paper2}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 8 }}>
                    <Tag on={r.kind === 'Passage'}>{r.kind}</Tag><Tag>{r.topic}</Tag>
                    {r.live && <Tag on>● interactive</Tag>}
                  </div>
                  <div style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 20, letterSpacing: '-0.02em',
                    lineHeight: 1.1, marginBottom: 6 }}>{r.title}</div>
                  <div style={{ fontSize: 13.5, lineHeight: 1.5, color: INK.muted, maxWidth: '62ch' }}>{r.snip}</div>
                  <div style={{ fontFamily: MONO, fontSize: 10.5, color: INK.faint, marginTop: 8,
                    letterSpacing: '0.06em' }}>{r.coord}</div>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/* Keyboard legend */}
      <div style={{ borderTop: `1.5px solid ${INK.ruleHard}`, padding: '12px 30px', display: 'flex', gap: 24 }}>
        {[['↑ ↓', 'navigate'], ['↵', 'open'], ['⌘ K', 'toggle'], ['esc', 'close']].map(([k, v]) => (
          <span key={k} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ fontFamily: MONO, fontSize: 11, border: `1px solid ${INK.rule}`, padding: '2px 7px' }}>{k}</span>
            <Tag>{v}</Tag>
          </span>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// GLOSSARY — inline mark + popover, and the site-level dictionary
// ═══════════════════════════════════════════════════════════════════
function InkGlossary() {
  const terms = [
    ['Deterministic chaos', 'A system whose future is fully fixed by its present yet practically unpredictable, because tiny uncertainties grow without bound.', 3],
    ['Phase space', 'The abstract space of all possible states of a system; every point is one complete configuration.', 5],
    ['Lyapunov time', 'The horizon beyond which prediction fails — the timescale on which nearby trajectories diverge.', 2],
    ['Attractor', 'A shape in phase space that a system settles toward, no matter where it starts.', 4],
    ['Debounce', 'Collapsing a burst of rapid events into a single action after they stop — a bet that only the last one matters.', 6],
    ['Idempotent', 'An operation you can apply many times with the same result as applying it once.', 3],
    ['Cyanotype', 'A cameraless photographic print in Prussian blue; the blueprint’s ancestor.', 2],
    ['Fleuron', 'A typographic ornament used to mark a pause between sections without a heading.', 4],
  ];
  return (
    <InkChrome current="topics" foot="maxubrq.space / glossary">
      <section style={{ padding: '44px 30px 30px', borderBottom: `1.5px solid ${INK.ruleHard}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Tag>Reference / site dictionary</Tag><Tag>{terms.length} terms · {terms.reduce((a, t) => a + t[2], 0)} uses</Tag>
        </div>
        <h1 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 64, lineHeight: 0.94,
          letterSpacing: '-0.045em', margin: '12px 0 0', textTransform: 'lowercase' }}>
          the <span style={{ color: INK.blue }}>glossary</span>.
        </h1>
        <p style={{ maxWidth: '58ch', fontSize: 16, lineHeight: 1.5, color: INK.muted, margin: '18px 0 0' }}>
          Every marked term across the site, defined once and linked back to the essays it lives in. Hover a
          mark while reading to see the card without leaving your place.
        </p>
      </section>

      {/* Inline mark demo */}
      <section style={{ padding: '30px 30px 34px', borderBottom: `1.5px solid ${INK.ruleHard}`,
        background: INK.paper2, position: 'relative' }}>
        <div style={{ marginBottom: 16 }}><Tag on>How a mark reads inline</Tag></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 36, alignItems: 'start' }}>
          <p style={{ fontSize: 20, lineHeight: 1.62, margin: 0, maxWidth: '46ch' }}>
            Add a second arm and the motion becomes something you cannot predict beyond a few seconds. This is the
            strange bargain of{' '}
            <span style={{ color: INK.blue, borderBottom: `2px dotted ${INK.blue}`, cursor: 'help', fontWeight: 500 }}>
              deterministic chaos</span>: every future is fixed, yet the future is unknowable.
          </p>
          {/* Popover card */}
          <div style={{ border: `1.5px solid ${INK.ruleHard}`, background: INK.paper, padding: '18px 20px',
            position: 'relative' }}>
            <div style={{ position: 'absolute', left: -34, top: 26 }}><ArrowMark w={30} dir="left" /></div>
            <Tag on>term</Tag>
            <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 22, letterSpacing: '-0.02em',
              margin: '6px 0 8px', textTransform: 'lowercase' }}>deterministic chaos</div>
            <p style={{ fontSize: 13.5, lineHeight: 1.5, color: INK.ink, margin: '0 0 12px' }}>
              A system whose future is fully fixed by its present yet practically unpredictable, because tiny
              uncertainties grow without bound.
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: `1px solid ${INK.rule}`,
              paddingTop: 10 }}>
              <Tag>appears in 3 essays</Tag>
              <a href="#" style={{ fontFamily: MONO, fontSize: 10.5, letterSpacing: '0.06em' }}>full entry →</a>
            </div>
          </div>
        </div>
      </section>

      {/* Dictionary — A–Z grid */}
      <section style={{ padding: '4px 30px 30px' }}>
        <div style={{ padding: '20px 0 4px' }}><Tag>A — Z / all terms</Tag></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
          {terms.map(([term, def, n], i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '28px 1fr', gap: 16,
              padding: '20px 24px 20px 0', borderTop: `1.5px solid ${INK.ruleHard}`,
              borderRight: i % 2 === 0 ? `1.5px solid ${INK.ruleHard}` : 'none',
              paddingLeft: i % 2 === 1 ? 24 : 0 }}>
              <span style={{ fontFamily: MONO, fontSize: 12, color: INK.faint, paddingTop: 4 }}>
                {String(i + 1).padStart(2, '0')}</span>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
                  <h3 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 21, letterSpacing: '-0.02em',
                    margin: 0, textTransform: 'lowercase' }}>{term}</h3>
                  <Tag>×{n}</Tag>
                </div>
                <p style={{ fontSize: 13.5, lineHeight: 1.5, color: INK.muted, margin: '8px 0 0', maxWidth: '40ch' }}>{def}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </InkChrome>
  );
}

// ═══════════════════════════════════════════════════════════════════
// SIDE NOTES — the margin-notes reading layout
// ═══════════════════════════════════════════════════════════════════
function InkSidenotes() {
  const Note = ({ n, children }) => (
    <span style={{ position: 'relative', color: INK.blue, fontWeight: 500,
      fontFamily: MONO, fontSize: '0.62em', verticalAlign: 'super', margin: '0 1px' }}>[{n}]</span>
  );
  return (
    <InkChrome current="writing" foot="maxubrq.space / science">
      <RunningHead text="margin notes · study mode" />
      <article style={{ maxWidth: 1000, margin: '0 auto', padding: '0 44px' }}>
        <header style={{ padding: '44px 0 26px', borderBottom: `1.5px solid ${INK.ruleHard}` }}>
          <div style={{ display: 'flex', gap: 14, marginBottom: 18 }}>
            <Tag on>Study mode</Tag><Tag>Margin notes on</Tag><Tag>Science</Tag>
          </div>
          <h1 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 46, lineHeight: 0.98,
            letterSpacing: '-0.035em', margin: 0, textTransform: 'lowercase' }}>
            reading with the margin open
          </h1>
        </header>

        {/* text column + margin */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: 40, padding: '30px 0 0' }}>
          <div>
            <p style={{ fontSize: 18, lineHeight: 1.66, margin: '0 0 1.3em' }}>
              A pendulum is the first thing you learn to trust. Pull it aside, let it go, and it keeps a
              promise<Note n={1} />: back and forth, in a rhythm you could set a clock to. For three hundred
              years we did exactly that.
            </p>
            <p style={{ fontSize: 18, lineHeight: 1.66, margin: '0 0 1.3em' }}>
              Add a second arm and the promise dissolves. The motion becomes something you cannot predict beyond
              the next few seconds<Note n={2} />, no matter how precisely you measure the start. Nothing was added
              but a hinge — the equations did not get harder to write, they got impossible to outrun.
            </p>
            <p style={{ fontSize: 18, lineHeight: 1.66, margin: '0 0 1.3em' }}>
              This is deterministic chaos. Every future is fixed, and yet unknowable, because the smallest
              uncertainty in the present grows without bound<Note n={3} />. Determinism and predictability, which
              we quietly assumed were one word, turn out to be strangers.
            </p>
            <p style={{ fontSize: 18, lineHeight: 1.66, margin: 0 }}>
              The margin is where the second voice lives — a source, an aside, a doubt. In study mode it stays
              open beside you; in flow mode it folds away and the notes become quiet superscripts you can tap.
            </p>
          </div>

          {/* Sidenotes rail */}
          <aside style={{ borderLeft: `1.5px solid ${INK.ruleHard}`, paddingLeft: 22 }}>
            {[
              [1, 'Note', 'Christiaan Huygens built the first pendulum clock in 1656. Error: about one minute a day.'],
              [2, 'Source', 'Lorenz, “Deterministic Nonperiodic Flow” (1963) — the paper that named the effect.'],
              [3, 'Aside', 'The growth is exponential; the exponent is the Lyapunov number. Small at first, then all at once.'],
            ].map(([n, kind, text]) => (
              <div key={n} style={{ marginBottom: 26 }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', marginBottom: 6 }}>
                  <span style={{ fontFamily: MONO, fontSize: 12, color: INK.blue, fontWeight: 500 }}>[{n}]</span>
                  <Tag>{kind}</Tag>
                </div>
                <p style={{ fontSize: 12.5, lineHeight: 1.5, color: INK.muted, margin: 0 }}>{text}</p>
              </div>
            ))}
            <div style={{ borderTop: `1px solid ${INK.rule}`, paddingTop: 12, marginTop: 4 }}>
              <Tag>3 notes · this section</Tag>
            </div>
          </aside>
        </div>

        <MetaFoot items={[
          ['Layout', 'Margin notes'],
          ['Toggle', 'Study ⇄ Flow'],
          ['Notes', '3 open'],
          ['Section', '§ I of IV'],
        ]} />
      </article>
    </InkChrome>
  );
}

// ═══════════════════════════════════════════════════════════════════
// READER SIGNALS — author-only dashboard (private by default)
// ═══════════════════════════════════════════════════════════════════
function InkSignals() {
  const passages = [
    ['a system so simple it fits in one equation can still refuse to tell you where it will be', 34],
    ['determinism and predictability turn out to be strangers', 28],
    ['nothing was added but a hinge', 19],
    ['no paragraph will teach it the way your own hand will', 12],
  ];
  const max = 34;
  // retention points (0..1) across the essay
  const ret = [1, .98, .95, .9, .88, .82, .8, .78, .74, .66, .62, .6, .58, .55, .52];
  const W = 560, H = 130;
  const pts = ret.map((v, i) => `${(i / (ret.length - 1)) * W},${H - v * (H - 10)}`).join(' ');
  return (
    <div className="ink-root" style={{ height: '100%', background: INK.paper, color: INK.ink,
      fontFamily: BODY, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '20px 30px', borderBottom: `1.5px solid ${INK.ruleHard}` }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
          <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 22, letterSpacing: '-0.03em' }}>
            reader signals</span>
          <Tag on>● author only · private</Tag>
        </div>
        <Tag>“the horizon of a pendulum” · 1,204 readers</Tag>
      </div>

      <div className="ink-scroll" style={{ overflowY: 'auto', flex: 1 }}>
        {/* Stat strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', borderBottom: `1.5px solid ${INK.ruleHard}` }}>
          {[['1,204', 'readers'], ['58%', 'finished'], ['214', 'private marks'], ['31', 'letters']].map(([n, l], i) => (
            <div key={i} style={{ padding: '22px 24px', borderRight: i < 3 ? `1px solid ${INK.rule}` : 'none' }}>
              <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 40, letterSpacing: '-0.03em',
                lineHeight: 1, color: INK.blue }}>{n}</div>
              <Tag style={{ display: 'block', marginTop: 8 }}>{l}</Tag>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
          {/* Retention ribbon */}
          <div style={{ padding: '24px 26px', borderRight: `1.5px solid ${INK.ruleHard}`, borderBottom: `1.5px solid ${INK.ruleHard}` }}>
            <Tag on>Retention ribbon</Tag>
            <div style={{ fontSize: 13, color: INK.muted, margin: '8px 0 18px', lineHeight: 1.4 }}>
              Where readers slow, stop, or leave — measured locally, never per-person.
            </div>
            <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}>
              <polyline points={`0,${H} ${pts} ${W},${H}`} fill={INK.blue} opacity="0.1" />
              <polyline points={pts} fill="none" stroke={INK.blue} strokeWidth="2.5" />
              {[0.33, 0.66].map((x, i) => (
                <line key={i} x1={x * W} y1="0" x2={x * W} y2={H} stroke={INK.rule} strokeDasharray="3 3" />
              ))}
            </svg>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
              <Tag>§I</Tag><Tag>§II · the plate</Tag><Tag>§III</Tag><Tag>end</Tag>
            </div>
          </div>

          {/* Top passages */}
          <div style={{ padding: '24px 26px', borderBottom: `1.5px solid ${INK.ruleHard}` }}>
            <Tag on>Most-kept passages</Tag>
            <div style={{ fontSize: 13, color: INK.muted, margin: '8px 0 18px', lineHeight: 1.4 }}>
              Sentences readers underlined for themselves. Counts only — never names.
            </div>
            {passages.map(([t, n], i) => (
              <div key={i} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 5 }}>
                  <span style={{ fontFamily: DISPLAY, fontSize: 13.5, lineHeight: 1.3, maxWidth: '34ch' }}>“{t}”</span>
                  <span style={{ fontFamily: MONO, fontSize: 12, color: INK.blue }}>{n}</span>
                </div>
                <div style={{ height: 3, background: INK.rule }}>
                  <div style={{ height: '100%', width: `${n / max * 100}%`, background: INK.blue }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Private letters */}
        <div style={{ padding: '24px 26px' }}>
          <Tag on>Letters left for you</Tag>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginTop: 16 }}>
            {[
              ['I read this on a train and missed my stop. The hinge line stayed with me.', 'anon · Apr 17'],
              ['Tôi đã đọc lại đoạn về sự phân kỳ ba lần. Cảm ơn tác giả.', 'anon · Apr 18'],
            ].map(([t, m], i) => (
              <div key={i} style={{ border: `1.5px solid ${INK.ruleHard}`, padding: '18px 20px' }}>
                <p style={{ fontFamily: DISPLAY, fontWeight: 500, fontSize: 16, lineHeight: 1.4,
                  margin: '0 0 12px' }}>“{t}”</p>
                <Tag>{m}</Tag>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { InkSearch, InkGlossary, InkSidenotes, InkSignals });
