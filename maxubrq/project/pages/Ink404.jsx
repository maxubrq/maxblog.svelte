// Ink404.jsx — the missing page. A 404 is an editorial event, not an error
// screen: state the coordinate, admit what broke (a link, a mark's anchor),
// then hand the reader three real doorways. The cat plate is the one piece of
// warmth allowed — a printed plate on a solid blue field, hue-corrected to the
// theme's single accent so no second blue enters the page.

function CatPlate() {
  return (
    <div style={{ background: INK.blue, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'relative', flex: 1, overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
        <img src="uploads/404-cat-plate.png" alt="a black cat holding a hand-lettered sign reading PAGE NOT FOUND"
          style={{ width: '100%', height: 'auto', display: 'block' }} />
      </div>
      <div style={{ borderTop: `1.5px solid rgba(255,255,255,0.45)`, margin: '0 26px', padding: '12px 0 20px',
        display: 'flex', justifyContent: 'space-between', gap: 16 }}>
        <span style={{ fontFamily: MONO, fontSize: 9.5, letterSpacing: '0.08em', color: '#fff' }}>
          Plate 404 — con mèo giữ những trang đã mất
        </span>
        <span style={{ fontFamily: MONO, fontSize: 9.5, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.72)' }}>
          09°01′N
        </span>
      </div>
    </div>
  );
}

function DoorRow({ n, kind, title, meta }) {
  const [on, setOn] = React.useState(false);
  return (
    <a href="#" onMouseEnter={() => setOn(true)} onMouseLeave={() => setOn(false)}
      style={{ display: 'grid', gridTemplateColumns: '44px 112px 1fr auto', alignItems: 'baseline', gap: 14,
        borderTop: `1px solid ${INK.rule}`, padding: '13px 0', textDecoration: 'none',
        color: on ? INK.blue : INK.ink }}>
      <span style={{ fontFamily: MONO, fontSize: 10.5, letterSpacing: '0.12em', color: on ? INK.blue : INK.faint }}>{n}</span>
      <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase',
        color: on ? INK.blue : INK.muted }}>{kind}</span>
      <span style={{ fontFamily: DISPLAY, fontWeight: 500, fontSize: 20, letterSpacing: '-0.02em' }}>{title}</span>
      <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.08em', color: on ? INK.blue : INK.muted }}>{meta}</span>
    </a>
  );
}

function Ink404() {
  return (
    <InkChrome foot="maxubrq.space / 404">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 452px', minHeight: 640,
        borderBottom: `1.5px solid ${INK.ruleHard}` }}>
        {/* ── the statement ── */}
        <div style={{ borderRight: `1.5px solid ${INK.ruleHard}`, padding: '34px 40px 40px',
          display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 30 }}>
            <Tag on>HTTP 404</Tag>
            <span style={{ flex: 1, height: 1.5, background: INK.ruleHard }} />
            <Tag>không có gì ở toạ độ này</Tag>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 26 }}>
            <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 128, lineHeight: 0.82,
              letterSpacing: '-0.055em', color: INK.ink }}>404</div>
            <div style={{ paddingTop: 6, position: 'relative' }}>
              <h1 style={{ margin: 0, fontFamily: DISPLAY, fontWeight: 700, fontSize: 44, lineHeight: 1.02,
                letterSpacing: '-0.04em', textTransform: 'lowercase', color: INK.ink, maxWidth: 420 }}>
                trang này<br />không còn <span style={{ color: INK.blue, position: 'relative', whiteSpace: 'nowrap' }}>ở đây
                  <Underline w={110} style={{ position: 'absolute', left: -4, bottom: -14 }} />
                </span>
              </h1>
            </div>
          </div>

          <p style={{ marginTop: 40, maxWidth: 520, fontFamily: BODY, fontSize: 17, lineHeight: 1.64,
            color: INK.ink }}>
            Đường dẫn bạn vừa mở không trỏ tới bài nào cả. Có thể bài đã được đổi tên,
            gộp vào một series, hoặc chưa từng tồn tại ngoài một cái link gõ sai.
          </p>
          <p style={{ marginTop: 14, maxWidth: 520, fontFamily: BODY, fontSize: 15.5, lineHeight: 1.62,
            color: INK.muted }}>
            Nếu bạn tới đây từ một <em>mark</em> của mình: mark đó giờ ở trạng thái
            <span style={{ fontFamily: MONO, fontSize: 12.5, letterSpacing: '0.06em', color: INK.blue }}> orphaned</span>
            {' '}— nó vẫn được giữ trong Reading Room, chỉ mất chỗ neo.
          </p>

          <div style={{ marginTop: 34, borderTop: `1.5px solid ${INK.ruleHard}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
              padding: '12px 0 6px' }}>
              <Tag>ba cửa còn mở</Tag>
              <Tag>counts only · never names</Tag>
            </div>
            <DoorRow n="01" kind="Writing" title="Bài mới nhất" meta="2026 · 04 · 11" />
            <DoorRow n="02" kind="Archive" title="Toàn bộ, theo thứ tự thời gian" meta="61 bài" />
            <DoorRow n="03" kind="Reading room" title="Marks và những câu bạn đã giữ" meta="riêng tư" />
          </div>

          <div style={{ flex: 1 }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 30 }}>
            <a href="#" style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.14em',
              textTransform: 'uppercase', color: '#fff', background: INK.blue, textDecoration: 'none',
              padding: '11px 18px' }}>← về trang chủ</a>
            <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.08em', color: INK.muted }}>
              hoặc ⌘K để tìm trong toàn bộ index
            </span>
          </div>
        </div>

        {/* ── the plate ── */}
        <CatPlate />
      </div>
    </InkChrome>
  );
}

Object.assign(window, { Ink404 });
