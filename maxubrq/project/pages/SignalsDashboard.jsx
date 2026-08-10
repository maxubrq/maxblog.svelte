// SignalsDashboard.jsx — author-only view of reader engagement.
// What maxubrq sees after publishing: what landed, what confused, what
// people wanted to say but didn't want to say out loud.

function SignalsDashboard({ palette = 'warm', theme = 'light' }) {
  const vars = window.PALETTES
    ? window.PALETTES[palette][theme === 'dark' ? 'dark' : 'light']
    : { '--paper': '#faf6ec', '--ink': '#1a1814', '--muted': 'rgba(26,24,20,0.55)',
        '--rule': 'rgba(26,24,20,0.22)', '--accent': '#a1432b', '--paper2': '#f3ecdc' };

  const SERIF = '"Newsreader", Georgia, serif';
  const SANS = '"IBM Plex Sans", -apple-system, sans-serif';
  const MONO = '"IBM Plex Mono", monospace';

  // fake data — what would actually be captured
  const passages = [
    { text: 'Determinism gives you the equation. It does not give you the future.',
      resonant: 47, thinking: 22, confused: 1, section: 'chaos' },
    { text: '…past a certain horizon, the pendulum and you are both free.',
      resonant: 38, thinking: 9, confused: 0, section: 'closing' },
    { text: 'Two identical double pendulums, started from angles that differ by a thousandth of a degree, will be in entirely different places a minute later.',
      resonant: 21, thinking: 28, confused: 3, section: 'chaos' },
    { text: 'the same pendulum becomes unpredictable. Not statistically — actually.',
      resonant: 14, thinking: 19, confused: 2, section: 'opening' },
    { text: 'sin(θ) ≈ θ, and the equation becomes a spring',
      resonant: 2, thinking: 5, confused: 11, section: 'chaos' },
    { text: 'The rate at which two nearby trajectories pull apart has a name: the Lyapunov exponent.',
      resonant: 8, thinking: 12, confused: 7, section: 'lyapunov' },
  ];

  const reflections = [
    { when: '2h ago',   snippet: 'I read this right after the news today and it hit very differently than I think it was supposed to. The bit about the horizon being a fog, not a wall. I keep thinking about that in the context of…', reader: 'reader · #2841' },
    { when: '5h ago',   snippet: 'Đã đọc lại ba lần. Phần về double pendulum làm mình nhớ về một bài toán hồi đại học mà mình không bao giờ hiểu.', reader: 'reader · #2840' },
    { when: '9h ago',   snippet: 'The small-angle bit lost me. Is θ in radians here? I think it is but the text doesn\'t say and I got confused at the figure.', reader: 'reader · #2838' },
    { when: '14h ago',  snippet: 'Reading this made me want to rebuild the double pendulum I had as a screen saver in 2011. Thanks.', reader: 'reader · #2835' },
    { when: '1d ago',   snippet: 'Would love a follow-up on how chaos relates (or doesn\'t) to the three-body problem. Is the Lyapunov exponent the right lens?', reader: 'reader · #2830' },
  ];

  const sections = [
    { id: 'opening',      label: 'Opening',                     reach: 100 },
    { id: 'the-pendulum', label: 'The pendulum',                reach: 94  },
    { id: 'chaos',        label: 'When the small angle breaks', reach: 78  },
    { id: 'lyapunov',     label: 'Lyapunov, or: the horizon',   reach: 61  },
    { id: 'closing',      label: 'A closing note',              reach: 52  },
  ];

  const totals = passages.reduce((a, p) => ({
    resonant: a.resonant + p.resonant, thinking: a.thinking + p.thinking, confused: a.confused + p.confused
  }), { resonant: 0, thinking: 0, confused: 0 });

  const [tab, setTab] = React.useState('passages');

  const Card = ({ children, pad = '20px 24px' }) => (
    <div style={{ border: '1px solid var(--rule)', padding: pad, background: 'var(--paper)' }}>
      {children}
    </div>
  );

  const Label = ({ children, muted }) => (
    <div style={{ fontFamily: SERIF, fontVariant: 'small-caps', letterSpacing: '0.22em',
      fontSize: 10.5, color: muted ? 'var(--muted)' : 'var(--ink)' }}>{children}</div>
  );

  const Num = ({ v, small }) => (
    <span style={{ fontFamily: SERIF, fontVariantNumeric: 'oldstyle-nums tabular-nums',
      fontSize: small ? 14 : 28, color: 'var(--ink)', fontWeight: small ? 400 : 500 }}>{v}</span>
  );

  return (
    <div style={{ ...vars, height: '100%', overflow: 'hidden', background: 'var(--paper2)',
      color: 'var(--ink)', fontFamily: SERIF, position: 'relative' }}>

      {/* Header */}
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '22px 40px 18px', borderBottom: '1px solid var(--rule)',
        background: 'var(--paper)' }}>
        <div>
          <div style={{ fontVariant: 'small-caps', letterSpacing: '0.3em', fontSize: 10,
            color: 'var(--muted)', marginBottom: 4 }}>
            Author · private
          </div>
          <div style={{ fontSize: 18, fontWeight: 500, letterSpacing: '-0.01em' }}>
            Reader signals
            <span style={{ fontStyle: 'italic', color: 'var(--muted)', fontWeight: 400, fontSize: 15 }}>
              {' '}— The Horizon of a Pendulum
            </span>
          </div>
        </div>
        <div style={{ fontFamily: SERIF, fontSize: 12, fontStyle: 'italic', color: 'var(--muted)' }}>
          Published 14 April · 8 days ago
        </div>
      </header>

      <div style={{ height: '100%', overflowY: 'auto', padding: '28px 40px 80px',
        boxSizing: 'border-box' }}>

        {/* Topline numbers */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 16, marginBottom: 32 }}>
          <Card>
            <Label muted>Readers</Label>
            <div style={{ marginTop: 8 }}><Num v="2,847" /></div>
            <div style={{ fontFamily: SERIF, fontSize: 12, fontStyle: 'italic',
              color: 'var(--muted)', marginTop: 4 }}>
              of whom <Num v="1,482" small /> finished
            </div>
          </Card>
          <Card>
            <Label muted>❤ Resonated</Label>
            <div style={{ marginTop: 8 }}><Num v={totals.resonant * 6 + 12} /></div>
            <div style={{ fontFamily: SERIF, fontSize: 12, fontStyle: 'italic',
              color: 'var(--muted)', marginTop: 4 }}>
              reactions on passages
            </div>
          </Card>
          <Card>
            <Label muted>✦ Made them think</Label>
            <div style={{ marginTop: 8 }}><Num v={totals.thinking * 4 + 7} /></div>
            <div style={{ fontFamily: SERIF, fontSize: 12, fontStyle: 'italic',
              color: 'var(--muted)', marginTop: 4 }}>
              across {passages.length} passages
            </div>
          </Card>
          <Card>
            <Label muted>Private letters</Label>
            <div style={{ marginTop: 8 }}><Num v="34" /></div>
            <div style={{ fontFamily: SERIF, fontSize: 12, fontStyle: 'italic',
              color: 'var(--muted)', marginTop: 4 }}>
              <span style={{ color: 'var(--accent)' }}>5 unread</span>
            </div>
          </Card>
        </div>

        {/* Retention line */}
        <div style={{ marginBottom: 32 }}>
          <Label muted>How far readers traveled</Label>
          <div style={{ marginTop: 16, display: 'grid',
            gridTemplateColumns: `repeat(${sections.length}, 1fr)`, gap: 0,
            border: '1px solid var(--rule)', background: 'var(--paper)' }}>
            {sections.map((s, i) => (
              <div key={s.id} style={{ padding: '14px 16px',
                borderRight: i < sections.length - 1 ? '1px solid var(--rule)' : 'none',
                position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0,
                  width: `${s.reach}%`, background: 'var(--accent)', opacity: 0.08 }} />
                <div style={{ position: 'relative' }}>
                  <div style={{ fontVariant: 'small-caps', letterSpacing: '0.15em',
                    fontSize: 10, color: 'var(--muted)', marginBottom: 6 }}>§ {i + 1}</div>
                  <div style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: 13,
                    marginBottom: 8, color: 'var(--ink)', lineHeight: 1.3 }}>{s.label}</div>
                  <Num v={`${s.reach}%`} small />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 24, borderBottom: '1px solid var(--rule)',
          marginBottom: 0 }}>
          {[
            ['passages', `Most-reacted passages · ${passages.length}`],
            ['reflections', `Private letters · ${reflections.length}`],
          ].map(([id, lbl]) => (
            <button key={id} onClick={() => setTab(id)}
              style={{ border: 'none', background: 'transparent', cursor: 'pointer',
                padding: '0 0 12px', fontFamily: SERIF, fontSize: 14,
                color: tab === id ? 'var(--ink)' : 'var(--muted)',
                fontStyle: tab === id ? 'normal' : 'italic',
                borderBottom: tab === id ? '2px solid var(--accent)' : '2px solid transparent',
                marginBottom: -1 }}>{lbl}</button>
          ))}
        </div>

        {/* Passages list */}
        {tab === 'passages' && (
          <div style={{ marginTop: 24 }}>
            {passages.sort((a, b) => (b.resonant + b.thinking) - (a.resonant + a.thinking)).map((p, i) => {
              const total = p.resonant + p.thinking + p.confused;
              const confuseRatio = p.confused / total;
              const note = confuseRatio > 0.3 ? 'This confused some readers' : null;
              return (
                <div key={i} style={{ padding: '22px 0',
                  borderBottom: i < passages.length - 1 ? '1px solid var(--rule)' : 'none',
                  display: 'grid', gridTemplateColumns: '1fr 180px', gap: 40, alignItems: 'start' }}>
                  <div>
                    <blockquote style={{ margin: 0, fontFamily: SERIF, fontSize: 17,
                      lineHeight: 1.5, color: 'var(--ink)', fontStyle: 'italic',
                      borderLeft: '2px solid var(--accent)', paddingLeft: 16 }}>
                      “{p.text}”
                    </blockquote>
                    <div style={{ marginTop: 10, fontFamily: SERIF, fontSize: 12,
                      fontStyle: 'italic', color: 'var(--muted)' }}>
                      from § {p.section}
                      {note && <span style={{ color: 'var(--accent)', marginLeft: 14 }}>
                        · {note}</span>}
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6,
                    fontFamily: SERIF, fontSize: 13 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--muted)' }}>❤ resonated</span>
                      <Num v={p.resonant} small />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--muted)' }}>✦ made them think</span>
                      <Num v={p.thinking} small />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--muted)' }}>? lost them</span>
                      <Num v={p.confused} small />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Reflections list */}
        {tab === 'reflections' && (
          <div style={{ marginTop: 24 }}>
            {reflections.map((r, i) => (
              <div key={i} style={{ padding: '22px 0',
                borderBottom: i < reflections.length - 1 ? '1px solid var(--rule)' : 'none',
                display: 'grid', gridTemplateColumns: '120px 1fr auto', gap: 28,
                alignItems: 'baseline' }}>
                <div style={{ fontFamily: SERIF, fontSize: 12, fontStyle: 'italic',
                  color: 'var(--muted)' }}>{r.when}</div>
                <div style={{ fontFamily: SERIF, fontSize: 15, lineHeight: 1.55,
                  color: 'var(--ink)' }}>
                  “{r.snippet}”
                </div>
                <button style={{ border: 'none', background: 'transparent', cursor: 'pointer',
                  fontFamily: SERIF, fontSize: 12, fontStyle: 'italic', color: 'var(--accent)',
                  padding: 0, borderBottom: '1px solid var(--accent)' }}>
                  read full →
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

window.SignalsDashboard = SignalsDashboard;
