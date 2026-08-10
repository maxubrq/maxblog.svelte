// InkToctouParts.jsx — reading instruments for the TOCTOU piece (article type: free).
// Four integrated instruments: the gap ruler, the interleaving trace, the AWS
// sticky stage, and the per-layer fix plates. Plus the prose furniture (P,
// Kicker, PullQuote, Sidenote, CodePlate) sized for a full-bleed piece.

const { useState: useTC, useRef: useTR, useEffect: useTE } = React;

const HATCH = `repeating-linear-gradient(-45deg, ${INK.ink} 0 1.5px, transparent 1.5px 7px)`;

// ── prose furniture ─────────────────────────────────────────────────
function P({ children, size = 19, w = '64ch', style }) {
  return <p style={{ fontFamily: BODY, fontSize: size, lineHeight: 1.72, color: INK.ink, maxWidth: w, margin: '0 0 22px', textWrap: 'pretty', ...style }}>{children}</p>;
}
function Kicker({ n, children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 26 }}>
      <span style={{ fontFamily: MONO, fontSize: 12, letterSpacing: '0.18em', color: INK.blue }}>{n}</span>
      <span style={{ flex: 1, height: 1.5, background: INK.ruleHard }}></span>
      <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: INK.muted }}>{children}</span>
    </div>
  );
}
function SectionTitle({ children, w = '20ch' }) {
  return <h2 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 'clamp(34px,4.4vw,62px)', lineHeight: 1.0, letterSpacing: '-0.04em', margin: '0 0 30px', maxWidth: w, textTransform: 'lowercase' }}>{children}</h2>;
}
function PullQuote({ children, mark }) {
  return (
    <blockquote style={{ margin: '10px 0 34px', padding: '26px 0 26px 28px', borderLeft: `4px solid ${INK.blue}`, maxWidth: '30ch' }}>
      <span style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 30, lineHeight: 1.18, letterSpacing: '-0.025em', color: INK.ink, display: 'block' }}>{children}</span>
      {mark && <span style={{ fontFamily: MONO, fontSize: 10.5, letterSpacing: '0.16em', textTransform: 'uppercase', color: INK.muted, display: 'block', marginTop: 14 }}>{mark}</span>}
    </blockquote>
  );
}
function Sidenote({ n, children }) {
  return (
    <div style={{ borderTop: `1.5px solid ${INK.ruleHard}`, paddingTop: 10, maxWidth: 260 }}>
      <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.16em', color: INK.blue }}>NOTE {n}</span>
      <p style={{ fontFamily: BODY, fontSize: 13.5, lineHeight: 1.6, color: INK.muted, margin: '6px 0 0' }}>{children}</p>
    </div>
  );
}
function CodePlate({ title, lines, mark }) {
  return (
    <div style={{ border: `1.5px solid ${INK.ruleHard}`, background: INK.paper }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', borderBottom: `1.5px solid ${INK.ruleHard}`, background: mark === 'bad' ? INK.ink : mark === 'good' ? INK.blue : INK.paper2 }}>
        <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: mark ? '#fff' : INK.muted }}>{title}</span>
        <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.16em', color: mark ? 'rgba(255,255,255,.7)' : INK.faint }}>{mark === 'bad' ? 'có khe hở' : mark === 'good' ? 'khe hở = 0' : ''}</span>
      </div>
      <pre style={{ margin: 0, padding: '14px 14px 16px', fontFamily: MONO, fontSize: 12.5, lineHeight: 1.65, color: INK.ink, overflowX: 'auto' }}>{lines.map((l, i) => (
        <div key={i} style={{ color: l[0] === '#' ? INK.blue : l[0] === '!' ? INK.muted : INK.ink, background: l[0] === '!' ? 'rgba(26,36,223,0.06)' : 'transparent' }}>{l[0] === '!' ? l.slice(1) : l}</div>
      ))}</pre>
    </div>
  );
}

// ── instrument 1 · the gap ruler ────────────────────────────────────
function GapRuler() {
  const [gap, setGap] = useTC(46);
  const W = 760, H = 150;
  const checkX = 70, boxW = 128;
  const useX = checkX + boxW + gap * 4.3;
  const ms = (gap * 0.021).toFixed(3);
  const ops = Math.round(gap * 0.021 * 3400).toLocaleString('vi-VN');
  const closed = gap === 0;
  return (
    <div style={{ border: `1.5px solid ${INK.ruleHard}`, padding: '20px 22px 18px', background: INK.paper }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
        <span style={{ fontFamily: MONO, fontSize: 10.5, letterSpacing: '0.18em', textTransform: 'uppercase', color: INK.blue }}>Dụng cụ 01 · thước đo khe hở</span>
        <span style={{ fontFamily: MONO, fontSize: 10.5, color: INK.muted }}>kéo thanh trượt</span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}>
        <line x1="30" y1="112" x2={W - 20} y2="112" stroke={INK.ruleHard} strokeWidth="1.5" />
        {[0, 1, 2, 3, 4, 5, 6, 7].map(i => <line key={i} x1={30 + i * 95} y1="112" x2={30 + i * 95} y2="120" stroke={INK.rule} strokeWidth="1.5" />)}
        <text x="30" y="140" fill={INK.faint} style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.14em' }}>THỜI GIAN →</text>
        {closed ? (
          <g>
            <rect x={checkX} y="40" width={boxW + 96} height="52" fill={INK.blue} />
            <text x={checkX + 16} y="72" fill="#fff" style={{ fontFamily: MONO, fontSize: 13, letterSpacing: '0.06em' }}>CHECK + USE</text>
            <text x={checkX} y="26" fill={INK.blue} style={{ fontFamily: MONO, fontSize: 10.5, letterSpacing: '0.14em' }}>MỘT THAO TÁC, KHÔNG THỂ CHEN NGANG</text>
          </g>
        ) : (
          <g>
            <rect x={checkX} y="40" width={boxW} height="52" fill={INK.paper} stroke={INK.ruleHard} strokeWidth="1.5" />
            <text x={checkX + 16} y="72" fill={INK.ink} style={{ fontFamily: MONO, fontSize: 13 }}>CHECK</text>
            <rect x={useX} y="40" width={boxW} height="52" fill={INK.paper} stroke={INK.ruleHard} strokeWidth="1.5" />
            <text x={useX + 26} y="72" fill={INK.ink} style={{ fontFamily: MONO, fontSize: 13 }}>USE</text>
            <foreignObject x={checkX + boxW} y="40" width={Math.max(1, useX - checkX - boxW)} height="52">
              <div style={{ width: '100%', height: '100%', backgroundImage: HATCH, opacity: 0.55 }}></div>
            </foreignObject>
            <line x1={checkX + boxW} y1="26" x2={useX} y2="26" stroke={INK.blue} strokeWidth="1.5" />
            <text x={(checkX + boxW + useX) / 2} y="18" textAnchor="middle" fill={INK.blue} style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em' }}>{ms} ms</text>
          </g>
        )}
      </svg>
      <input type="range" min="0" max="100" value={gap} onChange={e => setGap(+e.target.value)}
        style={{ width: '100%', accentColor: INK.blue, marginTop: 4 }} />
      <div style={{ fontFamily: BODY, fontSize: 14.5, lineHeight: 1.55, color: closed ? INK.blue : INK.ink, marginTop: 10, minHeight: 44 }}>
        {closed
          ? 'Khe hở bằng không. Không còn chỗ nào để chen vào, vì không còn khoảng giữa nào tồn tại. Đây là toàn bộ nội dung của compare-and-swap.'
          : `Trong ${ms} mili giây đó, một tiến trình khác trên cùng máy có thể thực hiện khoảng ${ops} thao tác. Kết quả của CHECK vẫn được coi là còn đúng ở thời điểm USE, dù không ai kiểm tra lại điều đó.`}
      </div>
    </div>
  );
}

// ── instrument 2 · the interleaving trace ───────────────────────────
const TOC_STEPS = ['đọc số dư', 'kiểm tra đủ tiền', 'trừ tiền'];
function Interleave() {
  const [bal, setBal] = useTC(1000);
  const [pc, setPc] = useTC([0, 0]);       // program counter per actor
  const [local, setLocal] = useTC([null, null]);
  const [log, setLog] = useTC([]);
  const [locked, setLocked] = useTC(false);
  const [held, setHeld] = useTC(null);
  const names = ['A · máy ATM', 'B · app điện thoại'];

  function reset() { setBal(1000); setPc([0, 0]); setLocal([null, null]); setLog([]); setHeld(null); }
  function step(i) {
    const s = pc[i];
    if (s > 2) return;
    if (locked && held !== null && held !== i) {
      setLog(l => [...l, [i, `chờ, ${names[held].split(' · ')[0]} đang giữ khoá`]]); return;
    }
    const np = [...pc], nl = [...local];
    if (s === 0) { nl[i] = bal; np[i] = 1; if (locked) setHeld(i); setLog(l => [...l, [i, `đọc số dư, thấy ${bal}k`]]); }
    else if (s === 1) { np[i] = nl[i] >= 800 ? 2 : 9; setLog(l => [...l, [i, nl[i] >= 800 ? `${nl[i]}k ≥ 800k, cho phép rút` : `${nl[i]}k < 800k, từ chối`]]); }
    else { const nb = nl[i] - 800; setBal(nb); np[i] = 3; if (locked) setHeld(null); setLog(l => [...l, [i, `trừ 800k, ghi số dư ${nb}k`]]); }
    setPc(np); setLocal(nl);
  }
  const done = pc[0] >= 3 && pc[1] >= 3 || (pc[0] === 9 || pc[1] === 9) && pc[0] + pc[1] >= 12;
  const broke = bal < 0;
  return (
    <div style={{ border: `1.5px solid ${INK.ruleHard}`, background: INK.paper }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: `1.5px solid ${INK.ruleHard}` }}>
        <span style={{ fontFamily: MONO, fontSize: 10.5, letterSpacing: '0.18em', textTransform: 'uppercase', color: INK.blue }}>Dụng cụ 02 · bạn tự xếp thứ tự</span>
        <label style={{ fontFamily: MONO, fontSize: 10.5, letterSpacing: '0.1em', textTransform: 'uppercase', color: INK.ink, display: 'flex', gap: 8, alignItems: 'center', cursor: 'pointer' }}>
          <input type="checkbox" checked={locked} onChange={e => { setLocked(e.target.checked); reset(); }} style={{ accentColor: INK.blue }} />khoá giao dịch
        </label>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: `1.5px solid ${INK.ruleHard}` }}>
        {[0, 1].map(i => (
          <div key={i} style={{ padding: '14px 16px 16px', borderRight: i === 0 ? `1.5px solid ${INK.ruleHard}` : 'none' }}>
            <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: INK.ink, marginBottom: 10 }}>{names[i]}</div>
            {TOC_STEPS.map((s, k) => (
              <div key={k} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '6px 0', opacity: pc[i] > k ? 1 : pc[i] === k ? 1 : 0.35 }}>
                <span style={{ width: 18, height: 18, border: `1.5px solid ${pc[i] > k ? INK.blue : INK.ruleHard}`, background: pc[i] > k ? INK.blue : 'transparent', color: '#fff', fontFamily: MONO, fontSize: 10, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{pc[i] > k ? '✓' : k + 1}</span>
                <span style={{ fontFamily: MONO, fontSize: 12.5, color: INK.ink }}>{s}</span>
                {k === 0 && local[i] !== null && <span style={{ fontFamily: MONO, fontSize: 11.5, color: INK.blue }}>→ {local[i]}k</span>}
              </div>
            ))}
            <button onClick={() => step(i)} disabled={pc[i] > 2}
              style={{ marginTop: 12, width: '100%', fontFamily: MONO, fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '10px 0', border: `1.5px solid ${INK.ruleHard}`, background: pc[i] > 2 ? INK.paper2 : INK.paper, color: pc[i] > 2 ? INK.faint : INK.ink, cursor: pc[i] > 2 ? 'default' : 'pointer' }}>
              {pc[i] > 2 ? 'xong' : `chạy bước ${pc[i] + 1}`}
            </button>
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 240px' }}>
        <div style={{ padding: '12px 16px', maxHeight: 132, overflowY: 'auto' }} className="ink-scroll">
          {log.length === 0 && <span style={{ fontFamily: MONO, fontSize: 12, color: INK.faint }}>chưa có gì chạy. bấm xen kẽ hai bên xem sao.</span>}
          {log.map(([i, t], k) => (
            <div key={k} style={{ fontFamily: MONO, fontSize: 12, color: INK.muted, padding: '2px 0' }}>
              <span style={{ color: i === 0 ? INK.blue : INK.ink }}>{i === 0 ? 'A' : 'B'}</span> · {t}
            </div>
          ))}
        </div>
        <div style={{ borderLeft: `1.5px solid ${INK.ruleHard}`, padding: '14px 16px', background: broke ? INK.ink : INK.paper2 }}>
          <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: broke ? 'rgba(255,255,255,.65)' : INK.muted }}>số dư</div>
          <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 38, letterSpacing: '-0.03em', color: broke ? '#fff' : INK.ink, lineHeight: 1.1 }}>{bal}k</div>
          <div style={{ fontFamily: BODY, fontSize: 12.5, lineHeight: 1.5, color: broke ? 'rgba(255,255,255,.85)' : INK.muted, marginTop: 6 }}>
            {broke ? 'Âm 600k. Cả hai lần rút đều đã đi qua bước kiểm tra, và cả hai đều đúng ở thời điểm nó kiểm tra.' : done ? 'Không hỏng. Lần này bạn để chúng chạy nối đuôi nhau.' : 'Bắt đầu 1000k. Mỗi bên rút 800k.'}
          </div>
          <button onClick={reset} style={{ marginTop: 12, fontFamily: MONO, fontSize: 10.5, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '7px 12px', border: `1.5px solid ${broke ? '#fff' : INK.ruleHard}`, background: 'transparent', color: broke ? '#fff' : INK.ink, cursor: 'pointer' }}>đặt lại</button>
        </div>
      </div>
    </div>
  );
}

// ── instrument 3 · the AWS sticky stage ─────────────────────────────
function AwsStage({ step }) {
  const W = 620, H = 470;
  const lanes = [
    { name: 'ENACTOR · AZ-1', y: 150 },
    { name: 'ENACTOR · AZ-2', y: 240 },
    { name: 'ENACTOR · AZ-3', y: 330 },
  ];
  const active = step >= 3 ? '(rỗng)' : step >= 2 ? 'v87' : step >= 1 ? 'v89' : 'v87';
  const dead = step >= 3;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block', maxHeight: '68vh' }}>
      <rect x="24" y="24" width="250" height="54" fill={INK.blue} />
      <text x="40" y="48" fill="#fff" style={{ fontFamily: MONO, fontSize: 12, letterSpacing: '0.1em' }}>DNS PLANNER</text>
      <text x="40" y="66" fill="rgba(255,255,255,.75)" style={{ fontFamily: MONO, fontSize: 10.5 }}>đang phát: v{87 + Math.min(step, 2)}</text>
      {[0, 1, 2].map(i => (
        <g key={i} opacity={step >= i ? 1 : 0.18}>
          <rect x={300 + i * 62} y="34" width="52" height="34" fill={INK.paper} stroke={INK.ruleHard} strokeWidth="1.5" />
          <text x={326 + i * 62} y="56" textAnchor="middle" fill={INK.ink} style={{ fontFamily: MONO, fontSize: 12 }}>v{87 + i}</text>
        </g>
      ))}
      {lanes.map((l, i) => (
        <g key={i}>
          <line x1="24" y1={l.y} x2={W - 24} y2={l.y} stroke={INK.rule} strokeWidth="1.5" />
          <text x="24" y={l.y - 10} fill={INK.muted} style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.14em' }}>{l.name}</text>
        </g>
      ))}
      {/* AZ-1: slow enactor carrying v87 */}
      <g>
        <rect x={step === 0 ? 60 : step === 1 ? 150 : 360} y={lanes[0].y - 22} width="56" height="34"
          fill={step >= 2 ? INK.ink : INK.paper} stroke={INK.ruleHard} strokeWidth="1.5" style={{ transition: 'x .5s ease' }} />
        <text x={(step === 0 ? 60 : step === 1 ? 150 : 360) + 28} y={lanes[0].y} textAnchor="middle"
          fill={step >= 2 ? '#fff' : INK.ink} style={{ fontFamily: MONO, fontSize: 12 }}>v87</text>
        {step === 1 && <text x="220" y={lanes[0].y + 4} fill={INK.muted} style={{ fontFamily: MONO, fontSize: 10.5 }}>chậm bất thường…</text>}
        {step >= 2 && <text x="150" y={lanes[0].y + 4} fill={INK.ink} style={{ fontFamily: MONO, fontSize: 10.5 }}>tỉnh dậy, vẫn tin v87 là mới nhất</text>}
      </g>
      {/* AZ-2: fast enactor applies v89 */}
      <g opacity={step >= 1 ? 1 : 0.2}>
        <rect x="400" y={lanes[1].y - 22} width="56" height="34" fill={INK.blue} />
        <text x="428" y={lanes[1].y} textAnchor="middle" fill="#fff" style={{ fontFamily: MONO, fontSize: 12 }}>v89</text>
        {step === 1 && <text x="150" y={lanes[1].y + 4} fill={INK.blue} style={{ fontFamily: MONO, fontSize: 10.5 }}>áp dụng xong, dọn kế hoạch cũ</text>}
      </g>
      {/* AZ-3 idle */}
      <g opacity="0.25"><rect x="60" y={lanes[2].y - 22} width="56" height="34" fill={INK.paper} stroke={INK.ruleHard} strokeWidth="1.5" />
        <text x="88" y={lanes[2].y} textAnchor="middle" fill={INK.ink} style={{ fontFamily: MONO, fontSize: 12 }}>idle</text></g>
      {/* the active DNS record */}
      <rect x="24" y="386" width={W - 48} height="60" fill={dead ? INK.ink : INK.paper} stroke={INK.ruleHard} strokeWidth="1.5" />
      <text x="42" y="410" fill={dead ? 'rgba(255,255,255,.7)' : INK.muted} style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.16em' }}>BẢN GHI DNS ĐANG SỐNG · dynamodb.us-east-1</text>
      <text x="42" y="434" fill={dead ? '#fff' : INK.ink} style={{ fontFamily: MONO, fontSize: 16 }}>{active}</text>
      {step >= 2 && !dead && <text x={W - 42} y="434" textAnchor="end" fill={INK.ink} style={{ fontFamily: MONO, fontSize: 11 }}>cũ vừa ghi đè mới</text>}
      {dead && <text x={W - 42} y="434" textAnchor="end" fill="#fff" style={{ fontFamily: MONO, fontSize: 11 }}>không endpoint nào phân giải được</text>}
      {step >= 2 && <path d={`M 386 ${lanes[0].y + 14} L 386 380`} stroke={INK.ink} strokeWidth="1.5" strokeDasharray="4 4" markerEnd="" />}
    </svg>
  );
}

// ── instrument 4 · fixes by layer ───────────────────────────────────
const FIXES = [
  {
    k: 'tầng hệ điều hành', sub: 'đường dẫn không phải là một tham chiếu',
    bad: ['if not os.path.islink(path) \\', '   and os.access(path, os.R_OK):', '!    # kẻ tấn công tráo path thành symlink', '    with open(path) as f:', '        return f.read()'],
    good: ['fd = os.open(path, os.O_RDONLY \\', '        | os.O_NOFOLLOW)', '# kiểm tra trên chính fd, không phải tên', 'st = os.fstat(fd)', 'data = os.read(fd, st.st_size)'],
    note: 'Mở một lần, rồi làm mọi việc trên descriptor đó. Cái tên có thể bị tráo, còn descriptor thì trỏ vào đúng object bạn đã mở.',
  },
  {
    k: 'tầng cơ sở dữ liệu', sub: 'đọc ở một giao dịch, ghi ở một giao dịch khác',
    bad: ['n = db.query("SELECT qty FROM stock', '              WHERE id=1")', '!# hai request cùng đọc thấy n = 1', 'if n > 0:', '    db.exec("UPDATE stock SET qty=qty-1")'],
    good: ['BEGIN;', 'SELECT qty FROM stock WHERE id=1', '  FOR UPDATE;   -- khoá dòng', 'UPDATE stock SET qty = qty - 1', '  WHERE id=1 AND qty > 0;', 'COMMIT;'],
    note: 'Hoặc optimistic locking: gắn số phiên bản vào dòng, và cho phép ghi chỉ khi phiên bản chưa đổi kể từ lúc đọc.',
  },
  {
    k: 'tầng hệ phân tán', sub: 'một tác nhân cũ vẫn nghĩ mình đang đúng',
    bad: ['plan = store.get_latest()', '!# một enactor khác ghi v89 ngay tại đây', 'apply(plan)', 'store.put_active(plan.version)'],
    good: ['plan = store.get_latest()', 'apply(plan)', '# ghi chỉ khi bản đang sống vẫn là bản', '# mình đã thấy lúc đọc', 'store.compare_and_swap(', '    expect=plan.seen_version,', '    write=plan.version)'],
    note: 'Cùng họ với fencing token (chặn một leader đã bị phế truất tiếp tục ghi) và quorum (bắt đa số đồng ý trước khi trạng thái đổi).',
  },
];
function FixPlates() {
  const [i, setI] = useTC(0);
  const f = FIXES[i];
  return (
    <div style={{ border: `1.5px solid ${INK.ruleHard}` }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', borderBottom: `1.5px solid ${INK.ruleHard}` }}>
        {FIXES.map((x, k) => (
          <button key={k} onClick={() => setI(k)}
            style={{ textAlign: 'left', padding: '12px 16px', border: 'none', borderRight: k < 2 ? `1.5px solid ${INK.ruleHard}` : 'none', background: i === k ? INK.blue : INK.paper, color: i === k ? '#fff' : INK.ink, cursor: 'pointer' }}>
            <span style={{ fontFamily: MONO, fontSize: 10.5, letterSpacing: '0.14em', textTransform: 'uppercase', display: 'block' }}>{x.k}</span>
            <span style={{ fontFamily: BODY, fontSize: 12.5, opacity: i === k ? 0.85 : 0.6, display: 'block', marginTop: 3 }}>{x.sub}</span>
          </button>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
        <div style={{ borderRight: `1.5px solid ${INK.ruleHard}` }}><CodePlate title="cách thường viết" lines={f.bad} mark="bad" /></div>
        <div><CodePlate title="cách bỏ khe hở" lines={f.good} mark="good" /></div>
      </div>
      <div style={{ borderTop: `1.5px solid ${INK.ruleHard}`, padding: '12px 16px', background: INK.paper2 }}>
        <span style={{ fontFamily: BODY, fontSize: 14, lineHeight: 1.6, color: INK.ink }}>{f.note}</span>
      </div>
    </div>
  );
}

Object.assign(window, { P, Kicker, SectionTitle, PullQuote, Sidenote, CodePlate, GapRuler, Interleave, AwsStage, FixPlates, HATCH });
