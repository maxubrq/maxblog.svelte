// InkSeries.jsx — the series reading surface. Single-article pages already
// exist; this is the missing multi-part experience. A series is a bigger
// contract than one piece, so it needs: the SHAPE of the whole arc up front,
// WHERE YOU ARE in it, the THREADS that recur across parts, and a real BRIDGE
// between parts (a handoff, not a "next" button).

// a recurring motif that threads through several parts
function ThreadChip({ label, parts, active }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0' }}>
      <span style={{ fontFamily: MONO, fontSize: 11, color: active ? INK.blue : INK.muted,
        minWidth: 130, letterSpacing: '0.02em' }}>{label}</span>
      <div style={{ display: 'flex', gap: 3 }}>
        {[1, 2, 3, 4, 5].map(n => (
          <span key={n} style={{ width: 16, height: 4,
            background: parts.includes(n) ? (active ? INK.blue : INK.ruleHard) : INK.rule }} />
        ))}
      </div>
    </div>
  );
}

function InkSeries() {
  const parts = [
    { n: 1, title: 'the illusion of knowing', min: 12, load: 2, state: 'read',
      note: 'Why finishing a book feels like understanding it — and why the feeling lies.' },
    { n: 2, title: 'weather and map', min: 16, load: 3, state: 'read',
      note: 'The first read versus the second. What each one is actually for.' },
    { n: 3, title: 'the shape of forgetting', min: 18, load: 4, state: 'current',
      note: 'How memory decays on a curve — and what timing does to that curve.' },
    { n: 4, title: 'the clean copy', min: 11, load: 3, state: 'ahead',
      note: 'Keeping a control group for your own reading. The book without you in it.' },
    { n: 5, title: 'reading by weight', min: 9, load: 2, state: 'ahead',
      note: 'Letting go of the count. Reading until the thing is light in the hand.' },
  ];
  const totalMin = parts.reduce((s, p) => s + p.min, 0);
  const readMin = parts.filter(p => p.state === 'read').reduce((s, p) => s + p.min, 0);
  const current = parts.find(p => p.state === 'current');

  const stateTag = { read: 'read', current: 'you are here', ahead: 'ahead' };

  return (
    <InkChrome current="writing" foot="maxubrq.space / series">
      <RunningHead text="maxubrq · a series · a reading in five movements" />
      {/* Masthead — the series as a whole, its full contract */}
      <section style={{ padding: '46px 44px 32px', borderBottom: `1.5px solid ${INK.ruleHard}`, position: 'relative' }}>
        <div style={{ display: 'flex', gap: 12, marginBottom: 18 }}>
          <Tag on>Series</Tag><Tag>● 5 movements</Tag><Tag>Nº 003</Tag>
        </div>
        <h1 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 62, lineHeight: 0.94,
          letterSpacing: '-0.045em', margin: 0, textTransform: 'lowercase' }}>
          how reading<br /><span style={{ color: INK.blue }}>actually works</span>.
        </h1>
        <p style={{ maxWidth: '56ch', fontFamily: BODY, fontSize: 17, lineHeight: 1.55, color: INK.muted, margin: '20px 0 24px' }}>
          Five pieces that only fully land in order — a single argument built across an arc, not five posts
          that happen to share a tag. Read them apart or together; the site carries the thread between them.
        </p>
        {/* the whole-series contract — sum of weathers */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 0, border: `1.5px solid ${INK.ruleHard}` }}>
          {[['◔ full arc', `${totalMin} min · ~5 sittings`], ['load', 'builds 2 → 4 → down'],
            ['read it', 'in order, first time'], ['you', `${readMin} of ${totalMin} min in`]].map(([k, v], i) => (
            <div key={k} style={{ flex: '1 1 auto', padding: '11px 18px', borderLeft: i ? `1px solid ${INK.rule}` : 'none' }}>
              <div style={{ fontFamily: MONO, fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase',
                color: INK.faint, marginBottom: 4 }}>{k}</div>
              <div style={{ fontFamily: MONO, fontSize: 13, color: INK.ink }}>{v}</div>
            </div>
          ))}
        </div>
      </section>

      {/* THE ARC — the shape of the whole, your place marked */}
      <section style={{ padding: '30px 44px 10px' }}>
        <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase',
          color: INK.muted, marginBottom: 20 }}>the arc · where you are</div>
        <div style={{ display: 'grid', gridTemplateColumns: '54px 1fr', gap: 0 }}>
          {parts.map((p, i) => {
            const isCur = p.state === 'current';
            const isRead = p.state === 'read';
            return (
              <React.Fragment key={p.n}>
                {/* spine column: number + connective thread */}
                <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  {i > 0 && <span style={{ width: 2, height: 22, background: isRead || isCur ? INK.blue : INK.rule }} />}
                  <span style={{ width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: DISPLAY, fontWeight: 700, fontSize: 16,
                    background: isCur ? INK.blue : isRead ? INK.ink : 'transparent',
                    color: isCur || isRead ? '#fff' : INK.muted,
                    border: `2px solid ${isCur ? INK.blue : isRead ? INK.ink : INK.rule}` }}>{p.n}</span>
                  {i < parts.length - 1 && <span style={{ width: 2, flex: 1, minHeight: 22,
                    background: isRead ? INK.blue : INK.rule }} />}
                </div>
                {/* part card */}
                <a href={isCur ? '#ink-weight' : '#'} style={{ display: 'block', textDecoration: 'none', color: INK.ink,
                  border: `1.5px solid ${isCur ? INK.blue : INK.ruleHard}`, margin: '0 0 14px 16px',
                  background: isCur ? 'rgba(26,36,223,0.04)' : INK.paper, opacity: p.state === 'ahead' ? 0.72 : 1,
                  transition: 'opacity .15s ease' }}
                  onMouseEnter={e => { if (p.state === 'ahead') e.currentTarget.style.opacity = 1;
                    const t = e.currentTarget.querySelector('[data-pt]'); if (t) t.style.color = INK.blue; }}
                  onMouseLeave={e => { if (p.state === 'ahead') e.currentTarget.style.opacity = 0.72;
                    const t = e.currentTarget.querySelector('[data-pt]'); if (t) t.style.color = INK.ink; }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '8px 14px', borderBottom: `1px solid ${INK.rule}` }}>
                    <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase',
                      color: isCur ? INK.blue : INK.muted }}>movement {p.n} · {stateTag[p.state]}</span>
                    <span style={{ fontFamily: MONO, fontSize: 10.5, color: INK.faint }}>◔ {p.min} min</span>
                  </div>
                  <div style={{ padding: '13px 14px 15px' }}>
                    <div data-pt style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 22, letterSpacing: '-0.02em',
                      textTransform: 'lowercase', lineHeight: 1.02, transition: 'color .15s ease' }}>{p.title}</div>
                    <p style={{ fontFamily: BODY, fontSize: 14, lineHeight: 1.5, color: INK.muted, margin: '7px 0 0' }}>{p.note}</p>
                  </div>
                </a>
              </React.Fragment>
            );
          })}
        </div>
      </section>

      {/* THE BRIDGE — a real handoff into the current part, not a "next" button */}
      <section style={{ padding: '8px 44px 30px' }}>
        <div style={{ border: `1.5px solid ${INK.ruleHard}`, background: INK.blue, color: '#fff' }}>
          <div style={{ padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.25)',
            display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase' }}>the bridge · movement 2 → 3</span>
            <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.8 }}>carry this in</span>
          </div>
          <div style={{ padding: '20px 18px 22px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <div>
              <div style={{ fontFamily: MONO, fontSize: 9.5, letterSpacing: '0.12em', textTransform: 'uppercase',
                opacity: 0.75, marginBottom: 8 }}>where you left off</div>
              <p style={{ fontFamily: DISPLAY, fontWeight: 500, fontSize: 19, lineHeight: 1.25, letterSpacing: '-0.01em',
                margin: 0, textTransform: 'lowercase' }}>the second read is the map — you stop watching the road and watch how it was built.</p>
            </div>
            <div>
              <div style={{ fontFamily: MONO, fontSize: 9.5, letterSpacing: '0.12em', textTransform: 'uppercase',
                opacity: 0.75, marginBottom: 8 }}>hold this going in</div>
              <p style={{ fontFamily: BODY, fontSize: 15, lineHeight: 1.55, margin: 0, opacity: 0.95 }}>
                Movement 3 will argue the map fades too — on a curve you can measure. Keep the “weather vs
                map” image close; the next piece puts a clock on it.</p>
              <a href="#ink-weight" style={{ display: 'inline-block', marginTop: 14, fontFamily: MONO, fontSize: 11,
                letterSpacing: '0.08em', textTransform: 'uppercase', color: INK.blue, background: '#fff',
                padding: '11px 16px', textDecoration: 'none' }}>enter movement 3 →</a>
            </div>
          </div>
        </div>
      </section>

      {/* RECURRING THREADS — the leitmotifs running across the arc */}
      <section style={{ padding: '4px 44px 36px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 30, borderTop: `1.5px solid ${INK.ruleHard}`, paddingTop: 20 }}>
          <div>
            <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase',
              color: INK.muted, marginBottom: 12 }}>threads that recur · which movements they run through</div>
            <ThreadChip label="the gist survives" parts={[1, 2, 3]} active />
            <ThreadChip label="reading twice" parts={[2, 4]} />
            <ThreadChip label="timing over effort" parts={[3, 5]} active />
            <ThreadChip label="the self vs the text" parts={[2, 4]} />
          </div>
          <div style={{ fontFamily: BODY, fontSize: 14.5, lineHeight: 1.6, color: INK.ink }}>
            <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase',
              color: INK.muted, marginBottom: 12 }}>why a series, not five posts</div>
            <p style={{ margin: '0 0 12px' }}>
              A thread lit in <strong style={{ color: INK.blue }}>blue</strong> is one you’re currently inside —
              it started earlier and pays off later. The site keeps them visible so a part read three weeks
              after the last still lands where it should.
            </p>
            <p style={{ margin: 0, color: INK.muted }}>
              Finish all five and the arc closes into a synthesis page — what the whole reading added up to,
              in your own kept sentences.</p>
          </div>
        </div>
      </section>
    </InkChrome>
  );
}

Object.assign(window, { InkSeries });
