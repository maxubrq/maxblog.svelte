// InkPrint.jsx — the print / book edition, ink vocabulary. A4 sheets on a
// desk: full-bleed blue cover, contents, two-column body, endnotes.
// Shared kit from window.

const { INK, DISPLAY, BODY, MONO, Tag } = window;

function Sheet({ children, folio, run, cover, style }) {
  return (
    <div style={{ width: 620, aspectRatio: '1 / 1.414', background: cover ? INK.blue : INK.paper,
      color: cover ? '#fff' : INK.ink, boxShadow: '0 10px 30px rgba(13,13,17,0.14)', position: 'relative',
      overflow: 'hidden', margin: '0 auto', ...style }}>
      {run !== undefined && (
        <div style={{ position: 'absolute', top: 26, left: 40, right: 40, display: 'flex',
          justifyContent: 'space-between', borderBottom: `1px solid ${cover ? 'rgba(255,255,255,0.3)' : INK.rule}`,
          paddingBottom: 8 }}>
          <span style={{ fontFamily: MONO, fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase',
            color: cover ? 'rgba(255,255,255,0.7)' : INK.muted }}>maxubrq — small infinities</span>
          <span style={{ fontFamily: MONO, fontSize: 9, letterSpacing: '0.14em',
            color: cover ? 'rgba(255,255,255,0.7)' : INK.muted }}>{run}</span>
        </div>
      )}
      <div style={{ position: 'absolute', inset: 0, padding: cover ? 0 : '64px 40px 56px' }}>{children}</div>
      {folio && (
        <div style={{ position: 'absolute', bottom: 24, left: 40, right: 40, display: 'flex',
          justifyContent: 'space-between', fontFamily: MONO, fontSize: 9.5,
          color: cover ? 'rgba(255,255,255,0.7)' : INK.muted }}>
          <span>{folio[0]}</span><span>{folio[1]}</span>
        </div>
      )}
    </div>
  );
}

function InkPrint() {
  const [paper, setPaper] = React.useState('A4');
  return (
    <div className="ink-root" style={{ height: '100%', background: INK.paper2, color: INK.ink,
      fontFamily: BODY, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      {/* Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '14px 26px', background: INK.paper, borderBottom: `1.5px solid ${INK.ruleHard}` }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Tag on>Print / book edition</Tag>
          {['study', 'flow', 'print'].map(m => (
            <span key={m} style={{ fontFamily: MONO, fontSize: 10.5, letterSpacing: '0.08em', textTransform: 'uppercase',
              padding: '4px 9px', border: `1px solid ${m === 'print' ? INK.blue : INK.rule}`,
              background: m === 'print' ? INK.blue : 'transparent', color: m === 'print' ? '#fff' : INK.muted }}>{m}</span>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{ display: 'flex', border: `1px solid ${INK.rule}` }}>
            {['A4', 'Letter'].map(p => (
              <button key={p} onClick={() => setPaper(p)} style={{ border: 'none', cursor: 'pointer',
                fontFamily: MONO, fontSize: 10.5, letterSpacing: '0.08em', padding: '6px 12px',
                background: paper === p ? INK.ink : 'transparent', color: paper === p ? '#fff' : INK.ink }}>{p}</button>
            ))}
          </div>
          <button onClick={() => window.print && window.print()} style={{ border: `1.5px solid ${INK.ruleHard}`,
            background: INK.ink, color: '#fff', fontFamily: MONO, fontSize: 10.5, letterSpacing: '0.08em',
            textTransform: 'uppercase', padding: '7px 14px', cursor: 'pointer' }}>Save as PDF →</button>
        </div>
      </div>

      {/* Sheets on the desk */}
      <div className="ink-scroll" style={{ overflowY: 'auto', flex: 1, padding: '30px 0 40px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>

          {/* Cover */}
          <Sheet cover run="cover" folio={['maxubrq.space', '2026']}>
            <div style={{ position: 'absolute', inset: 0 }}>
              <div className="ink-duo" style={{ position: 'absolute', inset: 0, opacity: 0.5 }}>
                <image-slot id="ink-print-cover" shape="rect" placeholder=""></image-slot>
              </div>
              <div style={{ position: 'absolute', inset: 0, padding: '80px 40px', display: 'flex',
                flexDirection: 'column', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase' }}>Volume III</span>
                  <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.16em' }}>№ 001</span>
                </div>
                <h1 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 62, lineHeight: 0.92,
                  letterSpacing: '-0.045em', margin: 0, textTransform: 'lowercase' }}>
                  the horizon<br />of a<br />pendulum
                </h1>
                <div style={{ fontFamily: DISPLAY, fontWeight: 500, fontSize: 17, textTransform: 'lowercase',
                  opacity: 0.9 }}>and other small infinities · an essay in four movements</div>
              </div>
            </div>
          </Sheet>

          {/* Contents */}
          <Sheet run="ii" folio={['ii', 'Contents']}>
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <h2 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 30, letterSpacing: '-0.03em',
                margin: '0 0 30px', textTransform: 'lowercase' }}>contents</h2>
              {[['I', 'The promise that repeats', '01'], ['II', 'The hinge', '05'],
                ['III', 'Two strangers', '11'], ['IV', 'What the hand knows', '17']].map(([n, t, p], i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '30px 1fr auto', gap: 14,
                  alignItems: 'baseline', padding: '16px 0', borderTop: `1px solid ${INK.rule}` }}>
                  <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 18, color: INK.blue }}>{n}</span>
                  <span style={{ fontFamily: DISPLAY, fontSize: 19, fontWeight: 500, letterSpacing: '-0.02em',
                    textTransform: 'lowercase' }}>{t}</span>
                  <span style={{ fontFamily: MONO, fontSize: 12, color: INK.muted }}>{p}</span>
                </div>
              ))}
              <p style={{ fontFamily: BODY, fontStyle: 'italic', fontSize: 12.5, color: INK.muted,
                marginTop: 'auto', borderTop: `1px solid ${INK.rule}`, paddingTop: 14, lineHeight: 1.6 }}>
                “Prediction is very difficult, especially about the future.”
              </p>
            </div>
          </Sheet>

          {/* Body — two columns */}
          <Sheet run="05" folio={['05', 'II · The hinge']}>
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 20 }}>
                <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 24, color: INK.blue, letterSpacing: '-0.03em' }}>II</span>
                <h2 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 24, letterSpacing: '-0.03em',
                  margin: 0, textTransform: 'lowercase' }}>the hinge</h2>
              </div>
              <div style={{ columnCount: 2, columnGap: 26, columnRule: `1px solid ${INK.rule}`,
                fontSize: 11.5, lineHeight: 1.62, textAlign: 'justify', flex: 1 }}>
                <p style={{ margin: '0 0 1em' }}>
                  <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: '2.6em', float: 'left',
                    lineHeight: 0.72, margin: '0.04em 0.1em 0 0', color: INK.blue }}>A</span>
                  dd a second arm — a pendulum hanging off the end of another — and the promise dissolves. The
                  motion becomes something you cannot predict beyond the next few seconds, no matter how precisely
                  you measure the start.
                </p>
                <p style={{ margin: '0 0 1em' }}>
                  Nothing was added but a hinge. The equations did not get harder to write. They got impossible to
                  outrun. Determinism and predictability, which we quietly assumed were the same word, turn out to
                  be strangers.
                </p>
                <p style={{ margin: '0 0 1em' }}>
                  This is the strange bargain of deterministic chaos. Every future is fixed — the physics exact,
                  reversible, without a single random term — and yet the future is unknowable, because the
                  smallest uncertainty in the present grows without bound.
                </p>
                <div className="ink-duo" style={{ aspectRatio: '4 / 3', margin: '0 0 8px', breakInside: 'avoid' }}>
                  <image-slot id="ink-print-fig" shape="rect" placeholder=""></image-slot>
                </div>
                <p style={{ fontFamily: MONO, fontSize: 8.5, color: INK.muted, letterSpacing: '0.06em',
                  margin: '0 0 1em', breakInside: 'avoid' }}>Fig. 1 — phase portrait of the double arm.</p>
                <p style={{ margin: 0 }}>
                  For three hundred years the whole edifice of clockwork rested on the idea that a swinging weight
                  is a thing that repeats. One hinge unmakes that certainty entirely.
                </p>
              </div>
            </div>
          </Sheet>

          {/* Endnotes + colophon */}
          <Sheet run="24" folio={['24', 'Notes & colophon']}>
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <h2 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 26, letterSpacing: '-0.03em',
                margin: '0 0 22px', textTransform: 'lowercase' }}>notes</h2>
              <ol style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: 11, lineHeight: 1.55, flex: 1 }}>
                {[['1', 'Huygens built the first pendulum clock in 1656; error about one minute a day.'],
                  ['2', 'Lorenz, “Deterministic Nonperiodic Flow,” J. Atmos. Sci. 20 (1963).'],
                  ['3', 'The growth is exponential; its rate is the Lyapunov exponent.']].map(([n, t]) => (
                  <li key={n} style={{ display: 'grid', gridTemplateColumns: '24px 1fr', gap: 10,
                    padding: '10px 0', borderTop: `1px solid ${INK.rule}` }}>
                    <span style={{ fontFamily: MONO, fontSize: 11, color: INK.blue }}>{n}</span>
                    <span style={{ color: INK.muted }}>{t}</span>
                  </li>
                ))}
              </ol>
              <div style={{ borderTop: `1.5px solid ${INK.ruleHard}`, paddingTop: 14 }}>
                <Tag on>Colophon</Tag>
                <p style={{ fontSize: 11, lineHeight: 1.6, color: INK.muted, margin: '8px 0 0' }}>
                  Set in Space Grotesk and IBM Plex. Printed in ink blue on paper white. Cyanotype plates by the
                  author. © 2026 maxubrq — CC BY-NC 4.0.
                </p>
              </div>
            </div>
          </Sheet>

        </div>
      </div>
    </div>
  );
}

Object.assign(window, { InkPrint });
