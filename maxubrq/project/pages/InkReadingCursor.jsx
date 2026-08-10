// InkReadingCursor.jsx — a live demo of "con trỏ đọc / reading ruler" (T2).
// Three variants, toggle live. The point: guide the eye, stay nearly invisible.
// Uses the shared ink kit off window (INK, DISPLAY, BODY, MONO, Tag, InkChrome...).

function InkReadingCursor() {
  const [mode, setMode] = React.useState('band');   // band | rule | both | off — dải sáng chốt làm mặc định
  const [active, setActive] = React.useState(4);
  const [idle, setIdle] = React.useState(false);
  const idleTimer = React.useRef(null);
  const wrapRef = React.useRef(null);

  // pre-broken lines, so we can address each one (in a real build the ruler
  // snaps to the line-box nearest the viewport centre)
  const lines = [
    'A reading ruler is the rare interface element whose success is measured',
    'by how little you notice it. Put a hard line across the text and the eye',
    'starts reading the line instead of the sentence — a foreign object laid',
    'over the page. So the ruler here is not a line at all. It is a band of',
    'attention: the row you are on holds full contrast, and everything else',
    'falls back by a breath. The eye is pulled toward the clearest place on',
    'the page without ever being told where to look. On a long paragraph, in',
    'flow mode, that is enough to stop the eye from slipping a line — the one',
    'failure that makes you read a sentence twice and lose the thread of it.',
    'When you stop moving, the ruler fades: you have found your place, so the',
    'guide steps back. Move again and it returns. Nothing to dismiss, nothing',
    'to configure past the single switch that turned flow mode on.',
  ];

  function onMove(e) {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const rows = [...wrap.querySelectorAll('[data-line]')];
    const y = e.clientY;
    let best = 0, bestD = Infinity;
    rows.forEach((r, i) => {
      const b = r.getBoundingClientRect();
      const d = Math.abs((b.top + b.bottom) / 2 - y);
      if (d < bestD) { bestD = d; best = i; }
    });
    setActive(best);
    setIdle(false);
    clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => setIdle(true), 1400);
  }

  const showRuler = mode !== 'off' && !idle;
  const modes = [['band', 'Dải sáng'], ['rule', 'Hairline lề'], ['both', 'Cả hai'], ['off', 'Tắt']];

  return (
    <InkChrome current="writing" foot="maxubrq.space / lab / reading ruler">
      <RunningHead text="maxubrq · lab · con trỏ đọc · T2" />
      <section style={{ padding: '40px 30px 26px', borderBottom: `1.5px solid ${INK.ruleHard}`, position: 'relative' }}>
        <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
          <Tag on>Lab</Tag><Tag>● T2 — Felt, not seen</Tag><Tag>Flow mode</Tag>
        </div>
        <h1 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 58, lineHeight: 0.94,
          letterSpacing: '-0.04em', margin: 0, textTransform: 'lowercase' }}>
          con trỏ <span style={{ color: INK.blue }}>đọc</span>.
        </h1>
        <p style={{ maxWidth: '56ch', fontSize: 16, lineHeight: 1.55, color: INK.muted, margin: '18px 0 0' }}>
          Di chuột lên đoạn văn — thước bám dòng gần con trỏ nhất. Đứng yên ~1.4s, nó tự mờ đi
          (bạn đã định vị được rồi). Ba biến thể để so:
        </p>
      </section>

      {/* Variant switch — same brutalist bar as the rest of the kit */}
      <div style={{ display: 'flex', borderBottom: `1.5px solid ${INK.ruleHard}` }}>
        {modes.map(([k, label], i) => (
          <button key={k} onClick={() => setMode(k)} style={{
            flex: 1, border: 'none', borderRight: i === modes.length - 1 ? 'none' : `1px solid ${INK.rule}`,
            background: mode === k ? INK.blue : 'transparent', color: mode === k ? '#fff' : INK.ink,
            fontFamily: MONO, fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase',
            padding: '13px 0', cursor: 'pointer' }}>{label}</button>
        ))}
      </div>

      {/* The passage */}
      <section style={{ padding: '38px 30px 20px' }}>
        <div ref={wrapRef} onMouseMove={onMove} onMouseLeave={() => setIdle(true)}
          style={{ maxWidth: 720, margin: '0 auto', position: 'relative', cursor: 'crosshair' }}>
          {lines.map((ln, i) => {
            const on = i === active;
            const dim = showRuler && (mode === 'band' || mode === 'both') && !on;
            const railOn = showRuler && (mode === 'rule' || mode === 'both') && on;
            return (
              <div key={i} data-line style={{ position: 'relative', padding: '3px 0 3px 18px',
                transition: 'opacity .28s ease, color .28s ease',
                opacity: dim ? 0.32 : 1 }}>
                {/* hairline at the left margin — a pencil rule, never across the text */}
                <span style={{ position: 'absolute', left: 0, top: 4, bottom: 4, width: 3,
                  background: INK.blue, transition: 'opacity .2s ease',
                  opacity: railOn ? 1 : 0 }} />
                <span style={{ fontFamily: BODY, fontSize: 19, lineHeight: 1.75,
                  color: (showRuler && (mode === 'band' || mode === 'both') && on) ? INK.ink : INK.ink,
                  fontWeight: on && showRuler ? 500 : 400 }}>{ln}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Design notes — three rules of the thing */}
      <section style={{ padding: '10px 30px 34px', borderTop: `1.5px solid ${INK.ruleHard}`, marginTop: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 0 }}>
          {[
            ['01 — Band, not line', 'Dòng đang đọc giữ tương phản đầy; phần còn lại lùi 32%. Không có vật thể lạ đè lên chữ.'],
            ['02 — Snap to centre', 'Thước neo vào dòng gần tâm viewport, không chạy theo tốc độ cuộn. Hairline chỉ ở mép trái, như lề bút chì.'],
            ['03 — Fades when idle', 'Đứng yên → mờ sau 1.4s. Di chuyển → hiện lại. Chỉ trong flow mode, opt-in, không có gì để tắt thủ công.'],
          ].map(([h, b], i) => (
            <div key={i} style={{ padding: '2px 20px 0', borderRight: i < 2 ? `1px solid ${INK.rule}` : 'none' }}>
              <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase',
                color: INK.blue, marginBottom: 8 }}>{h}</div>
              <p style={{ fontFamily: BODY, fontSize: 13.5, lineHeight: 1.5, color: INK.ink, margin: 0 }}>{b}</p>
            </div>
          ))}
        </div>
      </section>
    </InkChrome>
  );
}

Object.assign(window, { InkReadingCursor });
