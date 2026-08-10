// InkWeight.jsx — "sức nặng còn lại" (T2, anti-gamification).
// A live demo: instead of a % progress bar, the gutter shows the fore-edge
// of a book — a stack of page-leaves. What you've read compresses to a thin
// band at the top; what remains stays a thick block below. You FEEL the
// weight left, you don't count it. No numbers, ever.

function InkWeight() {
  const scRef = React.useRef(null);
  const [p, setP] = React.useState(0);   // 0..1 scroll fraction, internal only

  function onScroll() {
    const el = scRef.current; if (!el) return;
    const max = el.scrollHeight - el.clientHeight;
    setP(max > 0 ? Math.min(1, Math.max(0, el.scrollTop / max)) : 0);
  }

  const LEAVES = 46;                       // total "pages" drawn as hairlines
  const readLeaves = Math.round(p * LEAVES);

  const paras = [
    'Every reader knows the feeling in the hand before the eye admits it: the right side of the book has gone thin. You are near the end. Nobody told you a number. Your thumb did the counting.',
    'A progress bar throws that away. It replaces a felt quantity with a measured one, and the moment a thing is measured it invites you to optimise it — to read for the number climbing rather than for the page in front of you. Eighty percent done is a nudge, not a fact you needed.',
    'So this reader has no bar and no percent. It has a gutter, and in the gutter it draws the edge of the book: a stack of leaves. The part you have read folds up into a thin compressed band at the top. The part still to come stays a full, heavy block beneath your place.',
    'As you move down the page the block below thins and the band above thickens, exactly the way a real book trades weight from the right hand to the left. You can glance at it and know, in your body, that there is a lot left — or almost none — without a single digit entering your head.',
    'It never congratulates you. It never says keep going, you are so close. It simply is as heavy as it is, the way an object is heavy. When the block runs out, the reading is over, and the page lets you go quietly instead of firing a completion.',
    'This is the whole idea of the tier it belongs to. The best reading instruments are felt, not seen; sensed, not counted. Give a person a number and they will chase it. Give them a weight and they will simply read until it is light.',
  ];

  return (
    <InkChrome current="writing" foot="maxubrq.space / lab / remaining weight">
      <RunningHead text="maxubrq · lab · sức nặng còn lại · T2" />
      <section style={{ padding: '38px 30px 24px', borderBottom: `1.5px solid ${INK.ruleHard}` }}>
        <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
          <Tag on>Lab</Tag><Tag>● T2 — anti-gamification</Tag><Tag>no numbers</Tag>
        </div>
        <h1 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 54, lineHeight: 0.94,
          letterSpacing: '-0.04em', margin: 0, textTransform: 'lowercase' }}>
          sức nặng <span style={{ color: INK.blue }}>còn lại</span>.
        </h1>
        <p style={{ maxWidth: '58ch', fontSize: 15.5, lineHeight: 1.55, color: INK.muted, margin: '16px 0 0' }}>
          Cuộn đoạn văn bên dưới. Không có thanh %, không con số — chỉ có cạnh sách trong gutter:
          phần đã đọc nén thành dải mỏng ở trên, phần còn lại vẫn là khối dày ở dưới. Bạn <em>cảm</em>
          {' '}được còn bao nhiêu.
        </p>
      </section>

      {/* the reader: page-block gutter | scrolling text */}
      <section style={{ display: 'grid', gridTemplateColumns: '86px 1fr', minHeight: 560 }}>
        {/* gutter: fore-edge of the book */}
        <div style={{ borderRight: `1.5px solid ${INK.ruleHard}`, display: 'flex', flexDirection: 'column',
          alignItems: 'center', padding: '22px 0', gap: 0, position: 'relative' }}>
          <div style={{ fontFamily: MONO, fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase',
            color: INK.faint, writingMode: 'vertical-rl', position: 'absolute', top: 20, left: 8 }}>read</div>
          {/* read band — compressed leaves, tight */}
          <div style={{ width: 40, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            {Array.from({ length: readLeaves }).map((_, i) => (
              <span key={i} style={{ height: 1, background: INK.rule }} />
            ))}
          </div>
          {/* the reading edge — your place */}
          <div style={{ width: 54, height: 2.5, background: INK.blue, margin: '5px 0' }} />
          {/* remaining block — full-weight leaves, generous spacing = feels thick */}
          <div style={{ width: 40, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', gap: 3 }}>
            {Array.from({ length: LEAVES - readLeaves }).map((_, i) => (
              <span key={i} style={{ height: 1.5, background: INK.ruleHard, opacity: 0.82 }} />
            ))}
          </div>
          <div style={{ fontFamily: MONO, fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase',
            color: INK.blue, writingMode: 'vertical-rl', position: 'absolute', bottom: 20, left: 8 }}>còn lại</div>
        </div>

        {/* the passage — scroll container */}
        <div ref={scRef} onScroll={onScroll} className="ink-scroll"
          style={{ maxHeight: 560, overflowY: 'auto', padding: '30px 42px 40px' }}>
          <div style={{ maxWidth: '60ch' }}>
            <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase',
              color: INK.muted, marginBottom: 18 }}>on reading by weight — an essay in six turns</div>
            {paras.map((t, i) => (
              <p key={i} style={{ fontFamily: BODY, fontSize: 18, lineHeight: 1.72, color: INK.ink, margin: '0 0 20px' }}>{t}</p>
            ))}
            <div style={{ fontFamily: MONO, fontSize: 11, color: INK.blue, borderTop: `1.5px solid ${INK.ruleHard}`,
              paddingTop: 14, marginTop: 6 }}>— hết. đóng lại nhẹ nhàng, không có completion nào bắn ra.</div>
          </div>
        </div>
      </section>

      {/* why it's built this way */}
      <section style={{ padding: '2px 30px 34px', borderTop: `1.5px solid ${INK.ruleHard}`, marginTop: 22 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 0 }}>
          {[
            ['01 — Weight, not percent', 'Gutter vẽ cạnh sách: khối dày = còn nhiều, khối mỏng = sắp hết. Không một chữ số nào lọt vào đầu bạn.'],
            ['02 — Trade of weight', 'Đọc tới đâu, leaves dồn lên dải "read" mỏng ở trên; khối "còn lại" ở dưới thưa dần — như sang trang từ tay phải qua tay trái.'],
            ['03 — Never nudges', 'Không "80% done", không "sắp xong rồi cố lên". Nó chỉ nặng đúng như nó nặng. Hết khối là hết bài, kết thúc lặng.'],
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

Object.assign(window, { InkWeight });
