// InkSettings.jsx — "reading preferences", the config page for the reading
// experience. Live: every control re-renders the preview passage beside it.
// Ink kit off window (INK, DISPLAY, BODY, MONO, Tag, InkChrome, RunningHead...).

// ── small controls, in the brutalist bar language ────────────────────
function Seg({ options, value, onChange }) {
  return (
    <div style={{ display: 'flex', border: `1.5px solid ${INK.ruleHard}` }}>
      {options.map(([k, label], i) => (
        <button key={k} onClick={() => onChange(k)} style={{
          flex: 1, border: 'none', borderRight: i === options.length - 1 ? 'none' : `1px solid ${INK.rule}`,
          background: value === k ? INK.blue : 'transparent', color: value === k ? '#fff' : INK.ink,
          fontFamily: MONO, fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase',
          padding: '11px 4px', cursor: 'pointer', whiteSpace: 'nowrap' }}>{label}</button>
      ))}
    </div>
  );
}
function Switch({ on, onChange }) {
  return (
    <button onClick={() => onChange(!on)} style={{ width: 52, height: 28, flexShrink: 0,
      border: `1.5px solid ${on ? INK.blue : INK.ruleHard}`, background: on ? INK.blue : 'transparent',
      padding: 2, cursor: 'pointer', display: 'flex', justifyContent: on ? 'flex-end' : 'flex-start' }}>
      <span style={{ width: 20, height: 20, background: on ? '#fff' : INK.ruleHard, display: 'block' }} />
    </button>
  );
}
function Row({ label, hint, children, tier }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px', gap: 24, alignItems: 'center',
      padding: '18px 0', borderTop: `1px solid ${INK.rule}` }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
          <span style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 16, letterSpacing: '-0.01em',
            textTransform: 'lowercase' }}>{label}</span>
          {tier && <Tag>{tier}</Tag>}
        </div>
        {hint && <div style={{ fontFamily: BODY, fontSize: 13, lineHeight: 1.45, color: INK.muted, marginTop: 4,
          maxWidth: '52ch' }}>{hint}</div>}
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>{children}</div>
    </div>
  );
}

function InkSettings() {
  const [size, setSize] = React.useState('m');       // s m l xl
  const [spacing, setSpacing] = React.useState('normal');
  const [measure, setMeasure] = React.useState('60');
  const [theme, setTheme] = React.useState('day');   // day dusk night
  const [flow, setFlow] = React.useState(true);
  const [ruler, setRuler] = React.useState(true);    // dải sáng
  const [serif, setSerif] = React.useState(false);
  const [autoTheme, setAutoTheme] = React.useState(false);
  const [pace, setPace] = React.useState('off');
  const [hover, setHover] = React.useState(3);

  const sizePx = { s: 16, m: 19, l: 22, xl: 26 }[size];
  const lh = { tight: 1.5, normal: 1.75, airy: 2.0 }[spacing];
  const themes = {
    day:   { bg: '#ffffff', fg: INK.ink,   mut: INK.muted },
    dusk:  { bg: '#f4f1ea', fg: '#2a2620', mut: '#7d766a' },
    night: { bg: '#12131a', fg: '#e7e7ea', mut: '#8a8a95' },
  }[theme];
  const preview = [
    'A reading ruler is the rare interface element whose success is measured',
    'by how little you notice it. The row you are on holds full contrast, and',
    'everything else falls back by a breath — a band of attention, not a line',
    'laid across the page. On a long paragraph, that is enough to keep the eye',
    'from slipping, the one failure that makes you read a sentence twice.',
  ];

  return (
    <InkChrome current={null} foot="maxubrq.space / reading preferences">
      <RunningHead text="maxubrq · reading preferences" />
      <section style={{ padding: '42px 30px 30px', borderBottom: `1.5px solid ${INK.ruleHard}`, position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
          <Tag on>Preferences</Tag><Tag>saved to this device only</Tag>
        </div>
        <h1 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 66, lineHeight: 0.92,
          letterSpacing: '-0.045em', margin: 0, textTransform: 'lowercase' }}>
          read it <span style={{ color: INK.blue }}>your way</span>.
        </h1>
        <p style={{ maxWidth: '58ch', fontSize: 16, lineHeight: 1.55, color: INK.muted, margin: '18px 0 0' }}>
          Every control changes the sample on the right as you touch it — nothing is applied blind.
          Defaults are deliberately gentle; the site never nudges you toward more reading.
        </p>
      </section>

      {/* two columns: controls | sticky live preview */}
      <section style={{ display: 'grid', gridTemplateColumns: '1fr 400px' }}>
        {/* controls */}
        <div style={{ padding: '10px 28px 34px', borderRight: `1.5px solid ${INK.ruleHard}` }}>
          <h2 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 22, letterSpacing: '-0.02em',
            textTransform: 'lowercase', margin: '24px 0 2px' }}>the page</h2>
          <Row label="text size" hint="Từ 16 đến 26px. Không bao giờ dưới ngưỡng đọc được.">
            <Seg value={size} onChange={setSize} options={[['s','S'],['m','M'],['l','L'],['xl','XL']]} />
          </Row>
          <Row label="line spacing" hint="Khoảng dòng chọn theo chiều cao dấu tiếng Việt, không theo mặc định Latin.">
            <Seg value={spacing} onChange={setSpacing} options={[['tight','Chặt'],['normal','Vừa'],['airy','Thoáng']]} />
          </Row>
          <Row label="measure" hint="Số ký tự mỗi dòng. Hàng ngắn đọc nhanh hơn, ít tụt dòng.">
            <Seg value={measure} onChange={setMeasure} options={[['52','52'],['60','60'],['72','72']]} />
          </Row>
          <Row label="typeface" hint="Grotesque cho màn hình, hay serif cho đọc dài.">
            <Seg value={serif ? 'serif' : 'sans'} onChange={v => setSerif(v === 'serif')}
              options={[['sans','Sans'],['serif','Serif']]} />
          </Row>

          <h2 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 22, letterSpacing: '-0.02em',
            textTransform: 'lowercase', margin: '30px 0 2px' }}>light</h2>
          <Row label="theme" hint="Ngày, chạng vạng, đêm — nền và tương phản đổi theo.">
            <Seg value={theme} onChange={setTheme} options={[['day','Ngày'],['dusk','Chạng vạng'],['night','Đêm']]} />
          </Row>
          <Row label="theme theo thời khắc" tier="T5" hint="Chữ tự ấm dần, dịu tương phản về đêm theo giờ trong ngày.">
            <Switch on={autoTheme} onChange={setAutoTheme} />
          </Row>

          <h2 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 22, letterSpacing: '-0.02em',
            textTransform: 'lowercase', margin: '30px 0 2px' }}>flow mode</h2>
          <Row label="flow mode" tier="T2" hint="Ẩn mọi thứ ngoài chữ: không nav, không chân trang, chỉ còn đoạn văn.">
            <Switch on={flow} onChange={setFlow} />
          </Row>
          <Row label="con trỏ đọc — dải sáng" tier="T2" hint="Dòng đang đọc giữ tương phản đầy, phần còn lại lùi nhẹ. Tự mờ khi bạn đứng yên.">
            <Switch on={ruler} onChange={setRuler} />
          </Row>
          <Row label="mỏ neo cho chỗ vấp" tier="T3" hint="Dừng lâu ở một câu → lề lặng hiện một cách nói lại. Chỉ khi thật sự khựng.">
            <Switch on={hover > 0} onChange={v => setHover(v ? 3 : 0)} />
          </Row>
          <Row label="nhịp đọc gợi ý" tier="T5" hint="Ở đoạn tác giả đánh dấu 'chậm', chữ hiện khớp một chu kỳ thở ~5.5s. Vô hình, tắt được.">
            <Seg value={pace} onChange={setPace} options={[['off','Tắt'],['calm','Chậm'],['auto','Tự động']]} />
          </Row>
        </div>

        {/* live preview — sticky */}
        <div style={{ padding: 0 }}>
          <div style={{ position: 'sticky', top: 0 }}>
            <div style={{ padding: '14px 20px', borderBottom: `1px solid ${INK.rule}`,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Tag on>Live preview</Tag>
              <Tag>{sizePx}px / {lh}× / {measure}ch</Tag>
            </div>
            <div style={{ background: themes.bg, padding: '30px 26px', transition: 'background .35s ease',
              minHeight: 520 }}>
              <div style={{ maxWidth: `${measure}ch`, position: 'relative' }}>
                <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase',
                  color: themes.mut, marginBottom: 18 }}>
                  {flow ? 'flow mode · chrome hidden' : 'standard view'}
                </div>
                {preview.map((ln, i) => {
                  const on = i === 1;             // pretend this is the row being read
                  const dim = ruler && !on;
                  return (
                    <div key={i} style={{ transition: 'opacity .3s ease', opacity: dim ? 0.34 : 1,
                      padding: '2px 0' }}>
                      <span style={{
                        fontFamily: serif ? '"Newsreader", Georgia, serif' : BODY,
                        fontSize: sizePx, lineHeight: lh, color: themes.fg,
                        fontWeight: on && ruler ? 500 : 400 }}>{ln}</span>
                    </div>
                  );
                })}
                {pace !== 'off' && (
                  <div style={{ marginTop: 22, height: 2, background: INK.blue, borderRadius: 2,
                    animation: 'inkBreath 5.5s ease-in-out infinite', transformOrigin: 'left' }} />
                )}
              </div>
            </div>
            <div style={{ padding: '14px 20px', borderTop: `1.5px solid ${INK.ruleHard}`,
              display: 'flex', gap: 10 }}>
              <button style={{ flex: 1, border: 'none', background: INK.blue, color: '#fff',
                fontFamily: MONO, fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase',
                padding: '13px 0', cursor: 'pointer' }}>Lưu cho thiết bị này</button>
              <button style={{ border: `1.5px solid ${INK.ruleHard}`, background: 'transparent', color: INK.ink,
                fontFamily: MONO, fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase',
                padding: '13px 16px', cursor: 'pointer' }}>Mặc định</button>
            </div>
          </div>
        </div>
      </section>

      <style>{`@keyframes inkBreath{0%,100%{transform:scaleX(.15)}50%{transform:scaleX(1)}}`}</style>
    </InkChrome>
  );
}

Object.assign(window, { InkSettings });
