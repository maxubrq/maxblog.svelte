// InkDraft.jsx — "Bản nháp lộ thiên" (T4, identity tác giả) + cỗ máy thời gian.
// Một bài đang còn sửa, để lộ thiên. Không phải "coming soon" câu view.
// Reader kéo được bài ngược về bất kỳ bản lưu nào: chữ đổi, trạng thái mục đổi,
// ghi chú tác giả lúc đó hiện lại. Vết sửa là một lớp bật/tắt, không phải phụ lục.
// Nguyên tắc đi kèm: không bao giờ sửa lặng.

// ── dữ liệu: 6 bản có lưu trong 23 lần sửa ──────────────────────────
// mỗi đoạn là chuỗi segment; s: undefined = giữ nguyên, 'ins' = mới ở bản này,
// 'del' = bị gạch ở bản này (vẫn đọc được khi bật lớp vết sửa)
const DRAFT_REVS = [
  {
    r: 'r01', n: 1, date: '2026 · 07 · 29', ago: '18 ngày trước', words: 310,
    note: 'chỉ là một cái tên mình thấy khó chịu. chưa biết viết gì.',
    states: [['I. Một cái tên sai', 'notes'], ['II. Cửa sổ giữa kiểm tra và dùng', 'notes'],
             ['III. Vì sao lock không cứu được', 'notes'], ['IV. Ba cách viết lại', 'notes'],
             ['V. Điều mình vẫn chưa hiểu', 'notes']],
    body: [
      [{ t: 'TOCTOU. Time-of-check to time-of-use. Cái tên dài và xấu cho một chuyện rất đơn giản: bạn hỏi, rồi bạn làm, và giữa hai việc đó có một khe hở.', s: 'ins' }],
      [{ t: '(ghi chú: tìm một ví dụ không phải code. đừng mở bài bằng syscall.)', s: 'ins' }],
    ],
  },
  {
    r: 'r05', n: 5, date: '2026 · 08 · 02', ago: '14 ngày trước', words: 890,
    note: 'có ví dụ rồi, nhưng vẫn là ví dụ của dân lập trình.',
    states: [['I. Một cái tên sai', 'editing'], ['II. Cửa sổ giữa kiểm tra và dùng', 'notes'],
             ['III. Vì sao lock không cứu được', 'notes'], ['IV. Ba cách viết lại', 'notes'],
             ['V. Điều mình vẫn chưa hiểu', 'notes']],
    body: [
      [{ t: 'TOCTOU. Time-of-check to time-of-use. ', s: 'del' },
       { t: 'Cái tên ', s: 'ins' }, { t: 'time-of-check to time-of-use ', s: 'ins' },
       { t: 'nghe như một lỗi lập trình. Thực ra nó là một lỗi về niềm tin.', s: 'ins' }],
      [{ t: 'Hãy tưởng tượng một hàm access() trả về true, và ngay sau đó một tiến trình khác thay symlink.', s: 'ins' }],
      [{ t: '(ghi chú: tìm một ví dụ không phải code. đừng mở bài bằng syscall.)', s: 'del' }],
    ],
  },
  {
    r: 'r09', n: 9, date: '2026 · 08 · 06', ago: '10 ngày trước', words: 1520,
    note: 'đọc lại thấy mình đang giảng bài chứ không đang kể.',
    states: [['I. Một cái tên sai', 'settled'], ['II. Cửa sổ giữa kiểm tra và dùng', 'editing'],
             ['III. Vì sao lock không cứu được', 'notes'], ['IV. Ba cách viết lại', 'notes'],
             ['V. Điều mình vẫn chưa hiểu', 'notes']],
    body: [
      [{ t: 'Cái tên ' }, { t: 'time-of-check to time-of-use ' },
       { t: 'nghe như một lỗi lập trình. Thực ra nó là một lỗi về niềm tin: ' },
       { t: 'bạn kiểm tra một điều kiện, rồi hành động dựa trên nó, và giữa hai khoảnh khắc đó thế giới không đứng yên chờ bạn.', s: 'ins' }],
      [{ t: 'Hãy tưởng tượng một hàm access() trả về true, và ngay sau đó một tiến trình khác thay symlink.' }],
      [{ t: 'Khe hở đó không phải lỗi của lập trình viên bất cẩn. Nó là bản chất của việc hỏi một thế giới đang chuyển động.', s: 'ins' }],
    ],
  },
  {
    r: 'r14', n: 14, date: '2026 · 08 · 11', ago: '5 ngày trước', words: 2050,
    note: 'thay ví dụ code bằng nhà ga. giữ cả hai một hôm để so.',
    states: [['I. Một cái tên sai', 'settled'], ['II. Cửa sổ giữa kiểm tra và dùng', 'settled'],
             ['III. Vì sao lock không cứu được', 'editing'], ['IV. Ba cách viết lại', 'notes'],
             ['V. Điều mình vẫn chưa hiểu', 'notes']],
    body: [
      [{ t: 'Cái tên ' }, { t: 'time-of-check to time-of-use ' },
       { t: 'nghe như một lỗi lập trình. Thực ra nó là một lỗi về niềm tin: bạn kiểm tra một điều kiện, rồi hành động dựa trên nó, và giữa hai khoảnh khắc đó thế giới không đứng yên chờ bạn.' }],
      [{ t: 'Hãy tưởng tượng một hàm access() trả về true, và ngay sau đó một tiến trình khác thay symlink. ', s: 'del' },
       { t: 'Hãy tưởng tượng bạn nhìn vào bảng giờ tàu, thấy chuyến 9:14 còn chỗ, rồi đi bộ ba phút ra sân ga.', s: 'ins' }],
      [{ t: 'Khe hở đó không phải lỗi của lập trình viên bất cẩn. Nó là bản chất của việc hỏi một thế giới đang chuyển động.' }],
    ],
  },
  {
    r: 'r19', n: 19, date: '2026 · 08 · 14', ago: '2 ngày trước', words: 2280,
    note: 'câu "tấm ảnh chụp về chỗ ngồi" — đây mới là bài.',
    states: [['I. Một cái tên sai', 'settled'], ['II. Cửa sổ giữa kiểm tra và dùng', 'settled'],
             ['III. Vì sao lock không cứu được', 'editing'], ['IV. Ba cách viết lại', 'editing'],
             ['V. Điều mình vẫn chưa hiểu', 'notes']],
    body: [
      [{ t: 'Cái tên ' }, { t: 'time-of-check to time-of-use ' },
       { t: 'nghe như một lỗi lập trình. Thực ra nó là một lỗi về niềm tin: bạn kiểm tra một điều kiện, rồi hành động dựa trên nó, và giữa hai khoảnh khắc đó thế giới không đứng yên chờ bạn.' }],
      [{ t: 'Hãy tưởng tượng bạn nhìn vào bảng giờ tàu, thấy chuyến 9:14 còn chỗ, rồi đi bộ ba phút ra sân ga. ' },
       { t: 'Cái bạn mang theo không phải chỗ ngồi. Là một tấm ảnh chụp về chỗ ngồi, chụp ba phút trước.', s: 'ins' }],
      [{ t: 'Khe hở đó không phải lỗi của lập trình viên bất cẩn. Nó là bản chất của việc hỏi một thế giới đang chuyển động.', s: 'del' }],
    ],
  },
  {
    r: 'r23', n: 23, date: '2026 · 08 · 16', ago: '41 phút trước', words: 2400, now: true,
    note: 'còn mục V. chưa tách bạch được race condition với TOCTOU.',
    states: [['I. Một cái tên sai', 'settled'], ['II. Cửa sổ giữa kiểm tra và dùng', 'settled'],
             ['III. Vì sao lock không cứu được', 'editing'], ['IV. Ba cách viết lại', 'editing'],
             ['V. Điều mình vẫn chưa hiểu', 'notes']],
    body: [
      [{ t: 'Cái tên ' }, { t: 'time-of-check to time-of-use ' },
       { t: 'nghe như một lỗi lập trình. Thực ra nó là một lỗi về niềm tin: bạn kiểm tra một điều kiện, rồi hành động dựa trên nó, và giữa hai khoảnh khắc đó thế giới không đứng yên chờ bạn.' }],
      [{ t: 'Hãy tưởng tượng bạn nhìn vào bảng giờ tàu, thấy chuyến 9:14 còn chỗ, rồi đi bộ ba phút ra sân ga. Cái bạn mang theo không phải chỗ ngồi. Là một tấm ảnh chụp về chỗ ngồi, chụp ba phút trước.' }],
      [{ t: 'Mọi hệ thống đều làm việc với ảnh chụp. Câu hỏi không phải làm sao tránh được điều đó — không tránh được — mà là ảnh của bạn cũ tới mức nào, và bạn có thừa nhận nó là ảnh hay không.', s: 'ins' }],
    ],
  },
];

function DraftFlag({ travelling }) {
  return (
    <div style={{ display: 'flex', alignItems: 'stretch', border: `1.5px solid ${INK.blue}` }}>
      <div className="ink-hatch" style={{ width: 46 }} />
      <div style={{ flex: 1, padding: '13px 16px', borderLeft: `1.5px solid ${INK.blue}` }}>
        <div style={{ fontFamily: MONO, fontSize: 10.5, letterSpacing: '0.14em', textTransform: 'uppercase',
          color: INK.blue, fontWeight: 500 }}>
          {travelling ? 'Bản nháp lộ thiên · một bản đã qua' : 'Bản nháp lộ thiên · đang còn sửa'}
        </div>
        <div style={{ fontFamily: BODY, fontSize: 14.5, lineHeight: 1.55, color: INK.ink, marginTop: 6, maxWidth: 560 }}>
          {travelling
            ? 'Bạn đang đứng ở một thời điểm cũ của bài. Chữ ở đây từng là chữ thật — nó chỉ không còn là chữ hiện tại.'
            : 'Bài này chưa xong. Nó nằm đây vì viết trong bóng tối lâu quá thì mình bắt đầu tự lừa mình. Bạn đọc được, nhưng đọc một thứ đang thở.'}
        </div>
      </div>
    </div>
  );
}

// một thanh trạng thái theo *mục*, không phải phần trăm
function SectionState({ label, state, note }) {
  const map = {
    settled: { t: 'đã yên', bg: INK.blue },
    editing: { t: 'đang sửa', bg: null },
    notes:   { t: 'mới là ghi chú', bg: null },
  }[state];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 92px 128px', alignItems: 'center', gap: 14,
      borderTop: `1px solid ${INK.rule}`, padding: '10px 0' }}>
      <span style={{ fontFamily: BODY, fontSize: 15, color: state === 'notes' ? INK.muted : INK.ink }}>{label}</span>
      <div className={state === 'notes' ? 'ink-hatch' : ''} style={{ height: 9,
        border: `1.5px solid ${state === 'notes' ? INK.faint : INK.blue}`,
        background: map.bg || 'transparent', opacity: state === 'notes' ? 0.55 : 1,
        transition: 'background .2s, border-color .2s' }} />
      <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase',
        color: state === 'notes' ? INK.faint : INK.blue }}>{map.t}{note ? ` · ${note}` : ''}</span>
    </div>
  );
}

// ── cỗ máy thời gian: 23 lần sửa, 6 bản có lưu ──────────────────────
function TimeRail({ idx, onPick }) {
  const total = 23;
  const pos = (n) => ((n - 1) / (total - 1)) * 100;
  const cur = DRAFT_REVS[idx];
  return (
    <div style={{ position: 'relative', paddingTop: 26, paddingBottom: 4 }}>
      {/* nhịp của 23 lần sửa */}
      <div style={{ position: 'relative', height: 30 }}>
        {Array.from({ length: total }, (_, i) => i + 1).map((n) => {
          const saved = DRAFT_REVS.some((r) => r.n === n);
          const passed = n <= cur.n;
          return (
            <span key={n} style={{ position: 'absolute', left: `${pos(n)}%`, top: saved ? 6 : 12,
              width: 1.5, height: saved ? 18 : 8, marginLeft: -0.75,
              background: passed ? INK.blue : INK.rule,
              opacity: saved ? 1 : 0.9, transition: 'background .2s' }} />
          );
        })}
        <div style={{ position: 'absolute', left: 0, right: 0, top: 24, height: 1.5, background: INK.rule }} />
        <div style={{ position: 'absolute', left: 0, top: 24, height: 1.5, width: `${pos(cur.n)}%`,
          background: INK.blue, transition: 'width .22s' }} />
        {/* con trỏ hiện tại */}
        <div style={{ position: 'absolute', left: `${pos(cur.n)}%`, top: 20, width: 9, height: 9,
          marginLeft: -4.5, background: INK.blue, transition: 'left .22s' }} />
      </div>
      {/* nút chọn bản lưu */}
      <div style={{ position: 'relative', height: 34 }}>
        {DRAFT_REVS.map((r, i) => (
          <button key={r.r} onClick={() => onPick(i)}
            style={{ position: 'absolute', left: `${pos(r.n)}%`, top: 0,
              transform: i === 0 ? 'none' : i === DRAFT_REVS.length - 1 ? 'translateX(-100%)' : 'translateX(-50%)',
              cursor: 'pointer', border: 'none', background: 'transparent', padding: '4px 6px',
              fontFamily: MONO, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase',
              color: i === idx ? INK.blue : INK.faint, fontWeight: i === idx ? 500 : 400,
              whiteSpace: 'nowrap' }}>
            {r.now ? 'hiện tại' : r.r}
          </button>
        ))}
      </div>
    </div>
  );
}

function MarginHand({ children, top }) {
  return (
    <div style={{ position: 'absolute', left: -218, top, width: 196, textAlign: 'right' }}>
      <div style={{ fontFamily: MONO, fontSize: 11.5, lineHeight: 1.5, color: INK.blue, fontStyle: 'italic' }}>{children}</div>
    </div>
  );
}

function Seg({ seg, scars }) {
  if (seg.s === 'del') {
    if (!scars) return null;
    return <span style={{ textDecoration: 'line-through', textDecorationColor: INK.blue,
      textDecorationThickness: 1.5, color: INK.faint }}>{seg.t}</span>;
  }
  if (seg.s === 'ins' && scars) {
    return <span style={{ boxShadow: `inset 0 -2px 0 ${INK.blue}`, color: INK.ink }}>{seg.t}</span>;
  }
  return <span>{seg.t}</span>;
}

function InkDraft() {
  const [idx, setIdx] = React.useState(DRAFT_REVS.length - 1);
  const [scars, setScars] = React.useState(true);
  const rev = DRAFT_REVS[idx];
  const travelling = !rev.now;

  return (
    <InkChrome current="writing" foot="maxubrq.space / draft">
      {/* ── head ── */}
      <section style={{ padding: '38px 30px 30px', borderBottom: `1.5px solid ${INK.ruleHard}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 22 }}>
          <Tag on>Nº 07 — draft</Tag>
          <Tag>chạm lần cuối 41 phút trước</Tag>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 44, alignItems: 'start' }}>
          <div>
            <h1 style={{ margin: 0, fontFamily: DISPLAY, fontWeight: 700, fontSize: 54, lineHeight: 1.02,
              letterSpacing: '-0.04em', textTransform: 'lowercase', maxWidth: 600 }}>
              cái giá của một lời hứa <span style={{ color: INK.blue }}>chưa viết xong</span>
            </h1>
            <p style={{ marginTop: 20, maxWidth: 560, fontFamily: BODY, fontSize: 17, lineHeight: 1.62, color: INK.muted }}>
              Về những API hứa hẹn tính nguyên tử mà không giữ được, và về việc mình
              đã tin vào chúng bao lâu trước khi đọc kỹ.
            </p>
            <div style={{ marginTop: 26 }}><DraftFlag travelling={travelling} /></div>
          </div>

          <div style={{ borderLeft: `1.5px solid ${INK.ruleHard}`, paddingLeft: 22 }}>
            <Tag>bài đang ở đâu{travelling ? ` · ${rev.r}` : ''}</Tag>
            <div style={{ marginTop: 12, borderBottom: `1px solid ${INK.rule}` }}>
              {rev.states.map(([label, st]) => (
                <SectionState key={label} label={label} state={st} />
              ))}
            </div>
            <div style={{ marginTop: 16, display: 'grid', gap: 7 }}>
              {[['bắt đầu', '2026 · 07 · 29'], ['số lần sửa', String(rev.n)],
                ['dài lúc này', `~${rev.words.toLocaleString('vi-VN')} từ`],
                ['dự tính xong', 'chưa hứa']].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Tag>{k}</Tag>
                  <span style={{ fontFamily: MONO, fontSize: 11, color: INK.ink }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── cỗ máy thời gian ── */}
      <section style={{ padding: '18px 30px 12px', borderBottom: `1.5px solid ${INK.ruleHard}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <Tag on>Kéo bài về một thời điểm</Tag>
          <Tag>23 lần sửa · 6 bản được lưu</Tag>
        </div>
        <TimeRail idx={idx} onPick={setIdx} />
        <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr auto', gap: 20, alignItems: 'baseline',
          borderTop: `1px solid ${INK.rule}`, paddingTop: 12, marginTop: 4 }}>
          <div>
            <div style={{ fontFamily: MONO, fontSize: 12, letterSpacing: '0.08em', color: INK.blue }}>
              {rev.r} · {rev.date}
            </div>
            <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.08em', color: INK.faint, marginTop: 3 }}>
              {rev.ago}
            </div>
          </div>
          <div style={{ fontFamily: BODY, fontSize: 15, lineHeight: 1.55, color: INK.ink, fontStyle: 'italic' }}>
            “{rev.note}”
            <span style={{ fontStyle: 'normal', fontFamily: MONO, fontSize: 10, letterSpacing: '0.1em',
              textTransform: 'uppercase', color: INK.faint, marginLeft: 10 }}>ghi lúc sửa</span>
          </div>
          {travelling && (
            <button onClick={() => setIdx(DRAFT_REVS.length - 1)}
              style={{ cursor: 'pointer', border: `1.5px solid ${INK.blue}`, background: 'transparent',
                color: INK.blue, fontFamily: MONO, fontSize: 10.5, letterSpacing: '0.12em',
                textTransform: 'uppercase', padding: '8px 14px' }}>
              về hiện tại →
            </button>
          )}
        </div>
      </section>

      {/* ── the scars toggle ── */}
      <section style={{ padding: '14px 30px', borderBottom: `1.5px solid ${INK.ruleHard}`,
        display: 'flex', alignItems: 'center', gap: 16 }}>
        <button onClick={() => setScars(!scars)} style={{ cursor: 'pointer', border: `1.5px solid ${INK.blue}`,
          background: scars ? INK.blue : 'transparent', color: scars ? '#fff' : INK.blue,
          fontFamily: MONO, fontSize: 10.5, letterSpacing: '0.14em', textTransform: 'uppercase',
          padding: '8px 14px' }}>
          lớp vết sửa · {scars ? 'đang bật' : 'đang tắt'}
        </button>
        <span style={{ fontFamily: BODY, fontSize: 14, color: INK.muted }}>
          {scars
            ? <>Câu <span style={{ textDecoration: 'line-through', textDecorationColor: INK.blue,
                textDecorationThickness: 1.5, color: INK.faint }}>bị gạch</span> và câu <span
                style={{ boxShadow: `inset 0 -2px 0 ${INK.blue}` }}>mới thêm</span> ở bản {rev.r} đều đang hiện.</>
            : `Chỉ còn văn bản của bản ${rev.r}. Vết sửa vẫn nằm đó, chỉ là không hiện.`}
        </span>
      </section>

      {/* ── body ── */}
      <section style={{ padding: '38px 30px 44px' }}>
        <div style={{ maxWidth: 620, margin: '0 0 0 260px', position: 'relative' }}>
          {rev.body.map((para, i) => {
            const changed = scars && para.some((s) => s.s);
            return (
              <div key={`${rev.r}-${i}`} style={{ position: 'relative', marginTop: i ? 22 : 0 }}>
                {changed && i === 1 && rev.n === 23 && null}
                {changed && i === 1 && travelling && rev.n === 14 &&
                  <MarginHand top={4}>bỏ ví dụ code<br />— quá kỹ thuật,<br />mất người đọc</MarginHand>}
                <p style={{ margin: 0, fontFamily: BODY, fontSize: 18.5, lineHeight: 1.72,
                  borderLeft: changed ? `2px solid ${INK.blue}` : '2px solid transparent',
                  paddingLeft: changed ? 16 : 0, marginLeft: changed ? -18 : 0,
                  color: para.every((s) => s.s === 'del') ? INK.faint : INK.ink }}>
                  {para.map((seg, j) => <Seg key={j} seg={seg} scars={scars} />)}
                </p>
              </div>
            );
          })}

          {/* mục chưa viết — khai thẳng, không giả vờ */}
          <div style={{ marginTop: 34, border: `1.5px solid ${INK.rule}`, padding: '22px 24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <Tag on>V. Điều mình vẫn chưa hiểu</Tag>
              <Tag>mới là ghi chú{travelling ? ` · như ở ${rev.r}` : ''}</Tag>
            </div>
            <div className="ink-hatch" style={{ height: 3, margin: '12px 0 16px', opacity: 0.5 }} />
            <ul style={{ margin: 0, paddingLeft: 20, display: 'grid', gap: 9,
              fontFamily: BODY, fontSize: 16, lineHeight: 1.6, color: INK.muted }}>
              <li>Vì sao các thư viện vẫn giữ API kiểm-rồi-dùng khi ai cũng biết nó hỏng?</li>
              <li>Có ngôn ngữ nào làm cho kiểu lỗi này <em>không viết được</em> chưa? (Rust? chưa đọc kỹ)</li>
              <li>Chỗ này mình đang lẫn giữa race condition và TOCTOU. Cần tách bạch trước khi phát hành.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ── contract ── */}
      <section style={{ margin: '0 30px 40px', borderTop: `1.5px solid ${INK.ruleHard}`, paddingTop: 20,
        display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 30 }}>
        <div>
          <Tag on>Giao kèo</Tag>
          <p style={{ marginTop: 8, fontFamily: BODY, fontSize: 14.5, lineHeight: 1.6, color: INK.ink }}>
            Không bao giờ sửa lặng. Mọi thay đổi nội dung để lại một vết đọc được, và
            mọi bản cũ vẫn kéo lại được — kể cả bản mình thấy ngượng.
          </p>
        </div>
        <div>
          <Tag>Bạn có thể</Tag>
          <p style={{ marginTop: 8, fontFamily: BODY, fontSize: 14.5, lineHeight: 1.6, color: INK.muted }}>
            Đánh <em>mark</em> lên bản nháp như lên bài đã xong. Khi bài đổi, mark của
            bạn sẽ báo là <span style={{ fontFamily: MONO, fontSize: 12.5, color: INK.blue }}>fuzzy</span> chứ
            không biến mất — và nó nhớ mình được đánh ở bản nào.
          </p>
        </div>
        <div>
          <Tag>Khi nào xong</Tag>
          <p style={{ marginTop: 8, fontFamily: BODY, fontSize: 14.5, lineHeight: 1.6, color: INK.muted }}>
            Không hứa ngày. Nếu muốn biết lúc nó yên, để lại một dấu — site nhắc đúng
            một lần, không nhắc lại.
          </p>
        </div>
      </section>
    </InkChrome>
  );
}

Object.assign(window, { InkDraft });
