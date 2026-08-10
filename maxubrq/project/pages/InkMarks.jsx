// InkMarks.jsx — "the mark": the redesigned reader-interaction layer.
//
// Replaces the old reaction bar (❤ ✦ ?) with ONE primitive: a *mark* — the
// gesture of a reader writing in the margin of a book. Five passage gestures
// (keep · dissent · snag · ask · note) plus one article-level gesture (belief)
// and one passive signal (dwell). Every gesture writes the SAME record shape,
// so downstream features read one stream instead of five bespoke ones.
//
// The record carries the article SNAPSHOT it was made against — a mark is a
// CHECK, the article can change before USE. That gap is the data that powers
// Batch V (expiry of truth, disagreement log, non-destructive edits).

const M = {
  paper: '#ffffff', paper2: '#f2f2ef', ink: '#0d0d11',
  muted: '#77777f', faint: '#a7a7ad',
  rule: 'rgba(13,13,17,0.14)', blue: '#1a24df', blueDeep: '#0f1699',
  blueWash: 'rgba(26,36,223,0.07)',
};
const M_DISPLAY = '"Space Grotesk", "IBM Plex Sans", sans-serif';
const M_BODY = '"IBM Plex Sans", -apple-system, sans-serif';
const M_MONO = '"IBM Plex Mono", monospace';

if (typeof document !== 'undefined' && !document.getElementById('ink-marks-styles')) {
  const s = document.createElement('style');
  s.id = 'ink-marks-styles';
  s.textContent = `
  .mk-root ::selection{background:${M.blue};color:#fff}
  .mk-root a{color:${M.blue};text-decoration:none}
  .mk-root a:hover{text-decoration:underline;text-underline-offset:3px}
  .mk-scroll{scrollbar-width:thin}
  .mk-keep,.mk-dissent,.mk-snag,.mk-ask,.mk-note{padding-bottom:1px}
  .mk-dissent{background:rgba(13,13,17,0.04)}
  .mk-snag{background:rgba(119,119,127,0.07)}
  .mk-ask{background:${M.blueWash}}
  .mk-note{padding-left:7px;margin-left:-2px}
  .mk-idx{font-family:${M_MONO};font-size:9px;color:${M.blue};vertical-align:super;letter-spacing:0;margin-left:3px}
  .mk-row{cursor:default;transition:background .12s}
  .mk-row:hover{background:${M.paper2}}
  .mk-layer{position:absolute;inset:0;pointer-events:none;z-index:5;overflow:visible}
  .mk-layer path{stroke-linecap:round}
  @keyframes mk-draw{from{stroke-dashoffset:var(--len)}to{stroke-dashoffset:0}}
  `;
  document.head.appendChild(s);
}

// ── the gesture vocabulary ───────────────────────────────────────────
// glyphs are editorial/proofreader marks drawn as strokes, never emoji.
function Glyph({ kind, c = 'currentColor', s = 16 }) {
  const p = { stroke: c, strokeWidth: 1.6, fill: 'none', strokeLinecap: 'round' };
  return (
    <svg width={s} height={s} viewBox="0 0 16 16" style={{ display: 'block', flex: 'none' }}>
      {kind === 'keep' && <><path d="M2 5h12" {...p} strokeWidth="1" opacity=".35" /><path d="M2 12h12" {...p} strokeWidth="2" /></>}
      {kind === 'dissent' && <><path d="M2 11h12M2 13.5h12" {...p} /><path d="M11 2.5 5 8" {...p} /></>}
      {kind === 'snag' && <path d="M2 8c1.6-3 3.2 3 4.8 0s3.2 3 4.8 0 1.6-1.5 2.4-1.5" {...p} />}
      {kind === 'ask' && <><path d="M5.2 5.4a2.8 2.8 0 1 1 2.9 2.9v2" {...p} /><circle cx="8.1" cy="13" r=".9" fill={c} stroke="none" /></>}
      {kind === 'note' && <><path d="M12.5 2.5 6 9l-1.6 3.6L8 11z" {...p} /><path d="M2.5 14h5" {...p} /></>}
      {kind === 'belief' && <><circle cx="8" cy="8" r="5.5" {...p} /><path d="M8 2.5v11" {...p} strokeDasharray="1 2.4" /></>}
      {kind === 'dwell' && <><circle cx="8" cy="8" r="5.5" {...p} opacity=".45" /><path d="M8 4.6V8l2.4 1.6" {...p} /></>}
    </svg>
  );
}

const GESTURES = [
  { id: 'keep', label: 'keep', vi: 'giữ câu này', cls: 'mk-keep',
    hint: 'câu đáng mang ra khỏi bài',
    feeds: ['commonplace book', 'ấn bản in một-bài', 'câu bạn sẽ quên', 'trích dẫn mang gốc'] },
  { id: 'dissent', label: 'dissent', vi: 'mình không tin câu này', cls: 'mk-dissent',
    hint: 'song sinh ngược dấu của keep',
    feeds: ['sổ bất đồng', 'độ tự tin của tác giả', 'lớp phản biện sau khi đọc xong'] },
  { id: 'snag', label: 'snag', vi: 'mình lạc ở đây', cls: 'mk-snag',
    hint: 'neo để quay lại, không phải chỗ để bỏ đi',
    feeds: ['sổ hiểu lầm', 'bản đồ chỗ vấp (tác giả)', 'mỏ neo diễn giải lại'] },
  { id: 'ask', label: 'ask', vi: 'một câu hỏi để ở lề', cls: 'mk-ask',
    hint: 'câu hỏi bám vào đoạn văn, không rơi vào khoảng không',
    feeds: ['những câu hỏi tôi mang theo', 'margin question', 'dialogue với tác giả'] },
  { id: 'note', label: 'note', vi: 'gửi riêng cho tác giả', cls: 'mk-note',
    hint: 'không đếm, không tổng hợp, chỉ chuyển đi',
    feeds: ['hộp thư tác giả (không thống kê)'] },
];

const CLOSING = [
  { id: 'belief', label: 'belief', vi: 'điều mình đang tin sau khi đọc',
    hint: 'neo vào cả bài, không vào một câu',
    feeds: ['điều mình từng tin ở đây (6 tháng sau)', 'hạn dùng của bài', 'đọc lại theo mùa'] },
  { id: 'dwell', label: 'dwell', vi: 'chỗ bạn dừng lâu bất thường', passive: true,
    hint: 'không phải cử chỉ — site tự ghi, cục bộ, không gửi đi',
    feeds: ['lề tự thở khi bạn dừng', 'tốc độ trung thực', 'hồ sơ nhịp đọc'] },
];

const GMAP = Object.fromEntries([...GESTURES, ...CLOSING].map(g => [g.id, g]));

// ── small primitives ─────────────────────────────────────────────────
function Kicker({ children, c = M.muted, style }) {
  return <div style={{ fontFamily: M_MONO, fontSize: 10, letterSpacing: '0.2em',
    textTransform: 'uppercase', color: c, ...style }}>{children}</div>;
}
function Rule({ hard, style }) {
  return <div style={{ height: hard ? 2 : 1, background: hard ? M.ink : M.rule, ...style }} />;
}

// ── the mark bar (selection popover) ─────────────────────────────────
function MarkBar({ pos, onPick, onDismiss, barRef }) {
  const [hover, setHover] = React.useState(null);
  if (!pos) return null;
  const g = hover ? GMAP[hover] : null;
  return (
    <div ref={barRef} style={{ position: 'absolute', left: pos.x, top: pos.y,
      transform: 'translate(-50%,-100%)', zIndex: 60, filter: 'drop-shadow(0 12px 26px rgba(13,13,17,0.28))' }}>
      <div style={{ background: M.ink, display: 'flex', alignItems: 'stretch' }}>
        {GESTURES.map((gs, i) => (
          <button key={gs.id} onClick={() => onPick(gs.id)}
            onMouseEnter={() => setHover(gs.id)} onMouseLeave={() => setHover(null)}
            style={{ background: hover === gs.id ? M.blue : 'transparent', border: 'none',
              borderLeft: i ? '1px solid rgba(255,255,255,0.14)' : 'none', color: '#fff',
              padding: '9px 13px 8px', cursor: 'pointer', display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 5, minWidth: 62 }}>
            <Glyph kind={gs.id} c="#fff" s={16} />
            <span style={{ fontFamily: M_MONO, fontSize: 9, letterSpacing: '0.14em',
              textTransform: 'uppercase', opacity: hover === gs.id ? 1 : 0.72 }}>{gs.label}</span>
          </button>
        ))}
      </div>
      <div style={{ background: M.ink, borderTop: '1px solid rgba(255,255,255,0.14)',
        padding: '5px 12px 6px', color: 'rgba(255,255,255,0.62)', fontFamily: M_MONO,
        fontSize: 9.5, letterSpacing: '0.04em', textAlign: 'center', whiteSpace: 'nowrap' }}>
        {g ? g.vi : 'chọn một cử chỉ — mọi dấu đều riêng tư trước'}
      </div>
      <div style={{ position: 'absolute', left: '50%', top: '100%', transform: 'translateX(-50%)',
        width: 0, height: 0, borderLeft: '7px solid transparent', borderRight: '7px solid transparent',
        borderTop: `7px solid ${M.ink}` }} />
    </div>
  );
}

// ── rough.js: the marks are DRAWN, not styled ─────────────────────
const MK_COLOR = { keep: M.blue, dissent: M.ink, snag: M.muted, ask: M.blue, note: M.blue };

function animatePaths(g, delay = 0) {
  g.querySelectorAll('path').forEach((p, i) => {
    let len = 0; try { len = p.getTotalLength(); } catch (_) { return; }
    if (!len) return;
    p.style.setProperty('--len', len);
    p.style.strokeDasharray = len;
    p.style.strokeDashoffset = len;
    p.style.animation = `mk-draw ${Math.min(0.62, 0.16 + len / 420)}s ease-out ${delay + i * 0.07}s forwards`;
  });
}

function drawOneMark(rc, svg, mark, rects, supRect, emph, blockLeft) {
  const c = MK_COLOR[mark.kind] || M.blue;
  const seed = mark.n * 137 + 7;
  const o = (extra) => ({ stroke: c, strokeWidth: emph ? 2.6 : 1.9, roughness: 1.5,
    bowing: 1.4, seed, ...extra });
  const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  const put = (el) => g.appendChild(el);

  if (mark.kind === 'note') {
    const top = Math.min(...rects.map(r => r.top)), bot = Math.max(...rects.map(r => r.bottom));
    const x = (blockLeft != null ? blockLeft : Math.min(...rects.map(r => r.left))) - 9;
    put(rc.line(x, top + 1, x, bot - 1, o({ strokeWidth: emph ? 3.4 : 2.6 })));
    put(rc.line(x - 3, top + 1, x + 3, top + 1, o({ strokeWidth: 1.4 })));
    put(rc.line(x - 3, bot - 1, x + 3, bot - 1, o({ strokeWidth: 1.4 })));
  }
  rects.forEach((r, i) => {
    const y = r.bottom - 1.5, s = { seed: seed + i * 11 };
    if (mark.kind === 'keep') {
      put(rc.line(r.left, y, r.right, y, o(s)));
    } else if (mark.kind === 'dissent') {
      put(rc.line(r.left, y, r.right, y, o(s)));
      put(rc.line(r.left, y + 3.4, r.right, y + 3.4, o({ ...s, strokeWidth: emph ? 2 : 1.4 })));
      if (i === rects.length - 1) put(rc.line(r.right + 3, y + 5, r.right + 10, y - 7, o({ ...s, strokeWidth: 1.5 })));
    } else if (mark.kind === 'snag') {
      const pts = []; const amp = 2.4, step = 7;
      for (let x = r.left; x <= r.right; x += step) pts.push([x, y + (pts.length % 2 ? amp : -amp)]);
      if (pts.length > 1) put(rc.curve(pts, o({ ...s, strokeWidth: emph ? 2.2 : 1.6, roughness: 0.9 })));
    } else if (mark.kind === 'ask') {
      put(rc.line(r.left, y, r.right, y, o({ ...s, strokeWidth: emph ? 2.2 : 1.5 })));
    }
  });
  if (mark.kind === 'ask' && supRect) {
    put(rc.ellipse(supRect.left + supRect.width / 2, supRect.top + supRect.height / 2,
      supRect.width + 9, supRect.height + 8, o({ strokeWidth: 1.5, roughness: 1.8 })));
  }
  svg.appendChild(g);
  return g;
}

function RoughLayer({ marks, hoverN, scopeRef, tick }) {
  const svgRef = React.useRef(null);
  const drawn = React.useRef(new Set());
  React.useEffect(() => {
    const svg = svgRef.current, scope = scopeRef.current;
    if (!svg || !scope || !window.rough) return;
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    const box = scope.getBoundingClientRect();
    const k = scope.offsetWidth ? box.width / scope.offsetWidth : 1;
    svg.setAttribute('viewBox', `0 0 ${scope.offsetWidth} ${scope.offsetHeight}`);
    const rc = window.rough.svg(svg);
    const local = (r) => ({ left: (r.left - box.left) / k, right: (r.right - box.left) / k,
      top: (r.top - box.top) / k, bottom: (r.bottom - box.top) / k,
      width: r.width / k, height: r.height / k });
    marks.forEach(m => {
      const span = scope.querySelector(`[data-mark="${m.n}"]`);
      if (!span) return;
      const rects = Array.from(span.getClientRects()).map(local).filter(r => r.width > 1);
      if (!rects.length) return;
      const sup = scope.querySelector(`[data-idx="${m.n}"]`);
      const blk = span.closest('[data-block]');
      const g = drawOneMark(rc, svg, m, rects, sup ? local(sup.getBoundingClientRect()) : null,
        hoverN === m.n, blk ? local(blk.getBoundingClientRect()).left : null);
      if (!drawn.current.has(m.n)) { drawn.current.add(m.n); animatePaths(g); }
    });
    if (!marks.length) drawn.current.clear();
  }, [marks, hoverN, tick]);
  return <svg ref={svgRef} className="mk-layer" />;
}

// a rough flourish for the masthead
function RoughUnderline({ w = 260, h = 22, color = M.blue, seed = 42 }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const svg = ref.current; if (!svg || !window.rough) return;
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    const rc = window.rough.svg(svg);
    svg.appendChild(rc.curve([[2, 13], [w * 0.3, 7], [w * 0.62, 11], [w - 4, 6]],
      { stroke: color, strokeWidth: 3, roughness: 1.7, bowing: 2, seed }));
    svg.appendChild(rc.curve([[w * 0.12, 18], [w * 0.5, 14], [w * 0.86, 17]],
      { stroke: color, strokeWidth: 1.6, roughness: 2.2, bowing: 2, seed: seed + 5 }));
  }, []);
  return <svg ref={ref} width={w} height={h} viewBox={`0 0 ${w} ${h}`}
    style={{ display: 'block', marginTop: 2, overflow: 'visible' }} />;
}

// ── the passage under the mark bar ───────────────────────────────────
const PARAS = [
  { id: 'p1', text: 'Mọi quyết định đều đứng trên một ảnh chụp. Bạn kiểm tra một điều là đúng, rồi bạn hành động dựa trên điều đó, và giữa hai khoảnh khắc ấy luôn có một khe hở mà thế giới có thể lách qua.' },
  { id: 'p2', text: 'Khe hở đó không cần một kẻ tấn công nào cả. Nó chỉ cần thời gian, và thời gian thì luôn có sẵn. Đây là lý do những lỗi loại này sống sót qua mọi lớp review: không có dòng code nào sai, chỉ có khoảng cách giữa hai dòng.' },
  { id: 'p3', text: 'Một dấu gạch chân cũng là một ảnh chụp. Bạn giữ lại câu này, hôm nay, khi bài viết còn đang nói điều nó đang nói. Nếu tác giả sửa đoạn văn vào tháng sau, dấu của bạn vẫn ở đó, trỏ vào một câu không còn tồn tại.' },
];

// build a stable, edit-resilient anchor from a DOM range: the quote plus a
// slice of context on each side (the shape W3C TextQuoteSelector uses).
function buildAnchor(blockText, quote) {
  const start = blockText.indexOf(quote);
  return {
    quote,
    prefix: start > 0 ? blockText.slice(Math.max(0, start - 24), start) : '',
    suffix: blockText.slice(start + quote.length, start + quote.length + 24),
    start, end: start + quote.length,
  };
}

function ReadingColumn({ marks, onAdd, hoverN }) {
  const scopeRef = React.useRef(null);
  const barRef = React.useRef(null);
  const [pos, setPos] = React.useState(null);
  const [tick, setTick] = React.useState(0);
  React.useEffect(() => {
    const r = () => setTick(t => t + 1);
    window.addEventListener('resize', r);
    const id = setTimeout(r, 300); // fonts settle
    return () => { window.removeEventListener('resize', r); clearTimeout(id); };
  }, []);
  React.useEffect(() => {
    const scope = scopeRef.current; if (!scope) return;
    const onUp = () => setTimeout(() => {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed) return setPos(null);
      const text = sel.toString().trim();
      if (text.length < 6) return setPos(null);
      const range = sel.getRangeAt(0);
      if (!scope.contains(range.commonAncestorContainer)) return setPos(null);
      let node = range.commonAncestorContainer;
      while (node && node !== scope && !(node.dataset && node.dataset.block)) node = node.parentNode;
      const block = node && node.dataset ? node.dataset.block : null;
      const r = range.getBoundingClientRect(), sr = scope.getBoundingClientRect();
      setPos({ x: r.left + r.width / 2 - sr.left, y: r.top - sr.top - 10, text, block,
        blockText: node && node.textContent ? node.textContent : '', range: range.cloneRange() });
    }, 0);
    const onDown = (e) => { if (barRef.current && barRef.current.contains(e.target)) return; setPos(null); };
    scope.addEventListener('mouseup', onUp);
    document.addEventListener('mousedown', onDown);
    return () => { scope.removeEventListener('mouseup', onUp); document.removeEventListener('mousedown', onDown); };
  }, []);

  const pick = (kind) => {
    const n = marks.length + 1;
    try {
      const span = document.createElement('span');
      span.className = GMAP[kind].cls;
      span.dataset.mark = n;
      pos.range.surroundContents(span);
      const sup = document.createElement('sup');
      sup.className = 'mk-idx'; sup.textContent = n; sup.dataset.idx = n;
      span.after(sup);
    } catch (_) { /* range across nodes — record it anyway */ }
    window.getSelection().removeAllRanges();
    onAdd({ n, kind, block: pos.block, anchor: buildAnchor(pos.blockText, pos.text) });
    setPos(null);
  };

  return (
    <div ref={scopeRef} style={{ position: 'relative', padding: '0 34px 0 0' }}>
      <Kicker style={{ marginBottom: 12 }}>đoạn thử · bôi đen một câu bất kỳ</Kicker>
      {PARAS.map((p, i) => (
        <p key={p.id} data-block={p.id} style={{ fontFamily: M_BODY, fontSize: 16.5, lineHeight: 1.72,
          color: M.ink, margin: i ? '1.05em 0 0' : 0, letterSpacing: '-0.005em', textWrap: 'pretty' }}>
          {p.text}
        </p>
      ))}
      <MarkBar pos={pos} onPick={pick} barRef={barRef} />
      <RoughLayer marks={marks} hoverN={hoverN} scopeRef={scopeRef} tick={tick} />
    </div>
  );
}

// ── the record: what one mark actually writes ────────────────────────
function RecordPanel({ marks, onClear }) {
  const last = marks[marks.length - 1];
  const line = (k, v, blue) => (
    <div style={{ display: 'flex', gap: 10, fontFamily: M_MONO, fontSize: 10.5, lineHeight: 1.75 }}>
      <span style={{ color: M.faint, width: 62, flex: 'none' }}>{k}</span>
      <span style={{ color: blue ? M.blue : M.ink, wordBreak: 'break-word' }}>{v}</span>
    </div>
  );
  return (
    <div style={{ border: `1px solid ${M.rule}`, background: M.paper2, padding: '16px 18px 18px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
        <Kicker c={M.ink}>bản ghi được viết ra</Kicker>
        {marks.length > 0 && (
          <button onClick={onClear} style={{ background: 'none', border: 'none', cursor: 'pointer',
            fontFamily: M_MONO, fontSize: 9.5, letterSpacing: '0.14em', textTransform: 'uppercase',
            color: M.muted, padding: 0 }}>reset</button>
        )}
      </div>
      {!last ? (
        <div style={{ fontFamily: M_BODY, fontSize: 13.5, lineHeight: 1.6, color: M.muted, fontStyle: 'italic' }}>
          Chưa có dấu nào. Bôi đen một câu bên trái để xem một cử chỉ trở thành dữ liệu như thế nào.
        </div>
      ) : (
        <div>
          {line('id', `mk_${String(last.n).padStart(3, '0')}`)}
          {line('article', 'tocttou')}
          {line('snapshot', 'v2026-07-12', true)}
          {line('gesture', last.kind, true)}
          {line('block', last.block || '—')}
          {line('quote', `"${last.anchor.quote.slice(0, 68)}${last.anchor.quote.length > 68 ? '…' : ''}"`)}
          {line('prefix', last.anchor.prefix ? `…${last.anchor.prefix}` : '∅')}
          {line('suffix', last.anchor.suffix ? `${last.anchor.suffix}…` : '∅')}
          {line('phase', 'first-read')}
          {line('reach', last.kind === 'note' ? 'author' : 'private')}
          <Rule style={{ margin: '13px 0 11px' }} />
          <Kicker style={{ marginBottom: 8 }}>bản ghi này nuôi</Kicker>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {GMAP[last.kind].feeds.map(f => (
              <span key={f} style={{ fontFamily: M_MONO, fontSize: 9.5, letterSpacing: '0.04em',
                color: M.blue, border: `1px solid ${M.blue}`, padding: '3px 7px' }}>{f}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── the register: the reader's own trail, in the gutter ──────────────
function Register({ marks, onHover, hoverN }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
        <Kicker c={M.ink}>sổ dấu của bạn trong bài này</Kicker>
        <span style={{ fontFamily: M_MONO, fontSize: 10, color: M.faint }}>
          {marks.length ? `${marks.length} dấu · rê chuột để soi` : '—'}
        </span>
      </div>
      <Rule hard />
      {marks.length === 0 && (
        <div style={{ fontFamily: M_BODY, fontSize: 13, color: M.faint, fontStyle: 'italic', padding: '12px 0' }}>
          Trống. Không có con số nào cần lấp đầy.
        </div>
      )}
      {marks.map(m => (
        <div key={m.n} className="mk-row"
          onMouseEnter={() => onHover && onHover(m.n)} onMouseLeave={() => onHover && onHover(null)}
          style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '10px 0',
            borderBottom: `1px solid ${M.rule}`, background: hoverN === m.n ? M.paper2 : 'transparent' }}>
          <span style={{ fontFamily: M_MONO, fontSize: 9.5, color: M.faint, width: 16, flex: 'none', paddingTop: 2 }}>
            {String(m.n).padStart(2, '0')}
          </span>
          <span style={{ paddingTop: 1, color: m.kind === 'dissent' || m.kind === 'snag' ? M.ink : M.blue }}>
            <Glyph kind={m.kind} s={14} />
          </span>
          <span style={{ fontFamily: M_BODY, fontSize: 13, lineHeight: 1.55, color: M.ink, flex: 1 }}>
            {m.anchor.quote.length > 92 ? m.anchor.quote.slice(0, 92) + '…' : m.anchor.quote}
          </span>
        </div>
      ))}
    </div>
  );
}

// ── gesture reference table ──────────────────────────────────────────
function GestureTable() {
  const Row = ({ g, passive }) => (
    <div style={{ display: 'grid', gridTemplateColumns: '26px 128px 1fr 1.15fr',
      gap: 16, alignItems: 'start', padding: '13px 0', borderBottom: `1px solid ${M.rule}` }}>
      <span style={{ color: passive ? M.faint : (g.id === 'dissent' || g.id === 'snag' ? M.ink : M.blue), paddingTop: 2 }}>
        <Glyph kind={g.id} s={17} />
      </span>
      <div>
        <div style={{ fontFamily: M_MONO, fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase',
          color: passive ? M.muted : M.ink }}>{g.label}</div>
        <div style={{ fontFamily: M_BODY, fontSize: 11.5, color: M.muted, marginTop: 3 }}>{g.vi}</div>
      </div>
      <div style={{ fontFamily: M_BODY, fontSize: 12.5, lineHeight: 1.55, color: M.ink }}>
        {g.hint}
        {passive && <span style={{ fontFamily: M_MONO, fontSize: 9, letterSpacing: '0.12em',
          textTransform: 'uppercase', color: M.faint, marginLeft: 8, border: `1px solid ${M.rule}`, padding: '1px 5px' }}>passive</span>}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
        {g.feeds.map(f => (
          <span key={f} style={{ fontFamily: M_MONO, fontSize: 9.5, color: M.muted,
            border: `1px solid ${M.rule}`, padding: '2px 6px' }}>{f}</span>
        ))}
      </div>
    </div>
  );
  return (
    <div>
      <Rule hard />
      <div style={{ display: 'grid', gridTemplateColumns: '26px 128px 1fr 1.15fr', gap: 16, padding: '8px 0 9px' }}>
        <span /><Kicker>cử chỉ</Kicker><Kicker>nó nghĩa là gì</Kicker><Kicker>nó nuôi tính năng nào</Kicker>
      </div>
      <Rule />
      {GESTURES.map(g => <Row key={g.id} g={g} />)}
      {CLOSING.map(g => <Row key={g.id} g={g} passive={g.passive} />)}
    </div>
  );
}

// ── the snapshot argument ────────────────────────────────────────────
function SnapshotNote() {
  const Cell = ({ t, sub, strike }) => (
    <div style={{ border: `1px solid ${M.rule}`, background: M.paper, padding: '12px 14px' }}>
      <div style={{ fontFamily: M_BODY, fontSize: 12.5, lineHeight: 1.5, color: strike ? M.muted : M.ink,
        textDecoration: strike ? 'line-through' : 'none' }}>{t}</div>
      <div style={{ fontFamily: M_MONO, fontSize: 9.5, letterSpacing: '0.1em', textTransform: 'uppercase',
        color: M.blue, marginTop: 8 }}>{sub}</div>
    </div>
  );
  return (
    <div style={{ background: M.paper2, border: `1px solid ${M.rule}`, padding: '20px 22px 22px' }}>
      <Kicker c={M.ink} style={{ marginBottom: 10 }}>vì sao mỗi dấu phải mang theo ảnh chụp</Kicker>
      <div style={{ fontFamily: M_BODY, fontSize: 14.5, lineHeight: 1.66, color: M.ink, maxWidth: '62ch',
        marginBottom: 18, textWrap: 'pretty' }}>
        Người đọc gạch chân một câu là một lần <em>check</em>. Tính năng đọc lại câu đó, sáu tháng sau, là một lần <em>use</em>.
        Giữa hai lần đó tác giả có thể đã sửa bài. Nếu bản ghi chỉ giữ toạ độ ký tự, cái dấu sẽ trỏ vào chỗ sai mà không ai biết.
        Vì thế mỗi dấu giữ nguyên văn câu, hai bên ngữ cảnh, và số hiệu bản dựng của bài.
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
        <Cell t="Câu vẫn nguyên vẹn ở đúng chỗ." sub="anchor · exact" />
        <Cell t="Đoạn văn đã đổi nhưng câu còn — tìm lại bằng ngữ cảnh." sub="anchor · fuzzy" />
        <Cell t="Câu bạn giữ không còn tồn tại." sub="anchor · orphaned → hết hạn" strike />
      </div>
      <div style={{ fontFamily: M_BODY, fontSize: 12.5, lineHeight: 1.6, color: M.muted, marginTop: 14,
        maxWidth: '72ch', fontStyle: 'italic' }}>
        Trường hợp thứ ba không phải là lỗi cần giấu. Nó là tín hiệu: bài đã đổi kể từ lần bạn đọc, và đúng
        chỗ bạn từng quan tâm. Đó là đầu vào của <span style={{ color: M.blue, fontStyle: 'normal' }}>Batch V</span> — hạn dùng, changelog như một lớp, và câu hỏi
        &ldquo;điều mình từng tin ở đây&rdquo;.
      </div>
    </div>
  );
}

// ── the closing mark (replaces the old reflection textarea) ──────────
function ClosingMark() {
  const [text, setText] = React.useState('');
  const [sent, setSent] = React.useState(false);
  return (
    <div style={{ border: `1px solid ${M.rule}`, padding: '20px 22px 20px' }}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 12 }}>
        <span style={{ color: M.blue }}><Glyph kind="belief" s={16} /></span>
        <Kicker c={M.ink}>dấu cuối bài · belief</Kicker>
      </div>
      {sent ? (
        <div style={{ fontFamily: M_BODY, fontSize: 14, lineHeight: 1.6, color: M.ink }}>
          Đã ghi vào sổ của bạn.
          <div style={{ fontFamily: M_MONO, fontSize: 10, color: M.muted, marginTop: 8, letterSpacing: '0.04em' }}>
            neo vào cả bài · snapshot v2026-07-12 · trả lại sau 6 tháng kèm bản đã sửa
          </div>
        </div>
      ) : (
        <>
          <div style={{ fontFamily: M_DISPLAY, fontSize: 20, lineHeight: 1.3, color: M.ink,
            letterSpacing: '-0.02em', marginBottom: 12, maxWidth: '30ch' }}>
            Sau bài này, bạn đang tin điều gì?
          </div>
          <textarea value={text} onChange={e => setText(e.target.value)} rows={3}
            placeholder="Một câu là đủ. Sáu tháng nữa nó sẽ quay lại, kèm bản bài đã sửa."
            style={{ width: '100%', background: 'transparent', border: 'none',
              borderBottom: `1px solid ${M.rule}`, fontFamily: M_BODY, fontSize: 14.5, lineHeight: 1.65,
              color: M.ink, padding: '6px 0', resize: 'none', outline: 'none', boxSizing: 'border-box' }}
            onFocus={e => (e.currentTarget.style.borderBottomColor = M.blue)}
            onBlur={e => (e.currentTarget.style.borderBottomColor = M.rule)} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
            <span style={{ fontFamily: M_MONO, fontSize: 9.5, letterSpacing: '0.1em',
              textTransform: 'uppercase', color: M.faint }}>riêng tư · không gửi đi đâu cả</span>
            <button onClick={() => text.trim() && setSent(true)} disabled={!text.trim()}
              style={{ background: text.trim() ? M.ink : 'transparent', color: text.trim() ? '#fff' : M.faint,
                border: text.trim() ? 'none' : `1px solid ${M.rule}`, fontFamily: M_MONO, fontSize: 10,
                letterSpacing: '0.14em', textTransform: 'uppercase', padding: '8px 14px',
                cursor: text.trim() ? 'pointer' : 'default' }}>ghi dấu</button>
          </div>
        </>
      )}
    </div>
  );
}

// ── what the author sees (counts only, never quotes) ─────────────────
function AuthorSide() {
  const rows = [
    { k: 'snag', where: '§ khe hở không cần kẻ tấn công', n: 14, note: 'chỗ vấp dày nhất bài' },
    { k: 'dissent', where: '§ mọi quyết định đứng trên ảnh chụp', n: 6, note: 'sáu người không đồng ý' },
    { k: 'keep', where: '§ không dòng code nào sai', n: 41, note: 'câu được mang đi nhiều nhất' },
  ];
  return (
    <div>
      <Kicker c={M.ink} style={{ marginBottom: 10 }}>phía tác giả · chỉ số đếm, không bao giờ là nội dung</Kicker>
      <Rule hard />
      {rows.map(r => (
        <div key={r.k} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '11px 0',
          borderBottom: `1px solid ${M.rule}` }}>
          <span style={{ color: r.k === 'keep' ? M.blue : M.ink }}><Glyph kind={r.k} s={15} /></span>
          <span style={{ fontFamily: M_MONO, fontSize: 15, color: M.ink, width: 30 }}>{r.n}</span>
          <span style={{ fontFamily: M_BODY, fontSize: 13, color: M.ink, flex: 1 }}>{r.where}</span>
          <span style={{ fontFamily: M_BODY, fontSize: 11.5, color: M.muted, fontStyle: 'italic' }}>{r.note}</span>
        </div>
      ))}
      <div style={{ fontFamily: M_BODY, fontSize: 12, color: M.muted, marginTop: 12, lineHeight: 1.6,
        fontStyle: 'italic', maxWidth: '54ch' }}>
        Tác giả thấy bản đồ, không thấy người. Nội dung của dấu chỉ rời máy người đọc khi cử chỉ là
        <span style={{ fontFamily: M_MONO, fontStyle: 'normal', fontSize: 11 }}> note</span> — thứ được viết để gửi đi.
      </div>
    </div>
  );
}

// ── the artboard ─────────────────────────────────────────────────────
function InkMarks() {
  const [marks, setMarks] = React.useState([]);
  const [hoverN, setHoverN] = React.useState(null);
  const add = (m) => setMarks(ms => [...ms, m]);
  const clear = () => {
    setMarks([]); setHoverN(null);
    document.querySelectorAll('.mk-idx').forEach(n => n.remove());
    document.querySelectorAll('.mk-keep,.mk-dissent,.mk-snag,.mk-ask,.mk-note').forEach(n => {
      const p = n.parentNode; if (!p) return;
      while (n.firstChild) p.insertBefore(n.firstChild, n);
      p.removeChild(n); p.normalize();
    });
  };
  return (
    <div className="mk-root" style={{ width: '100%', minHeight: '100%', background: M.paper,
      overflow: 'visible', fontFamily: M_BODY, color: M.ink }}>
      <div style={{ padding: '38px 56px 56px', maxWidth: 1080, boxSizing: 'border-box' }}>
        {/* masthead */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 14 }}>
          <div>
            <Kicker style={{ marginBottom: 12 }}>reader interaction · thay cho reaction bar cũ</Kicker>
            <h1 style={{ fontFamily: M_DISPLAY, fontSize: 58, lineHeight: 0.94, fontWeight: 500,
              letterSpacing: '-0.045em', margin: 0, textTransform: 'lowercase' }}>
              the mark
            </h1>
            <RoughUnderline w={236} />
          </div>
          <div style={{ fontFamily: M_BODY, fontSize: 13.5, lineHeight: 1.6, color: M.muted,
            maxWidth: '34ch', textAlign: 'right' }}>
            Một nguyên thuỷ duy nhất: <span style={{ color: M.ink }}>dấu</span>. Không phải nút cảm xúc.
            Cử chỉ của một người viết vào lề sách mình đang đọc.
          </div>
        </div>
        <Rule hard style={{ marginBottom: 26 }} />

        {/* live demo */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.35fr 1fr', gap: 34, marginBottom: 34 }}>
          <ReadingColumn marks={marks} onAdd={add} hoverN={hoverN} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
            <RecordPanel marks={marks} onClear={clear} />
            <Register marks={marks} onHover={setHoverN} hoverN={hoverN} />
          </div>
        </div>

        <SnapshotNote />

        <div style={{ height: 34 }} />
        <Kicker c={M.ink} style={{ marginBottom: 12 }}>bảng cử chỉ</Kicker>
        <GestureTable />

        <div style={{ height: 34 }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 30, alignItems: 'start' }}>
          <ClosingMark />
          <AuthorSide />
        </div>

        <div style={{ marginTop: 34, paddingTop: 12, borderTop: `1px solid ${M.rule}`,
          display: 'flex', justifyContent: 'space-between', fontFamily: M_MONO, fontSize: 9.5,
          letterSpacing: '0.14em', textTransform: 'uppercase', color: M.faint }}>
          <span>one record shape · six streams</span>
          <span>SFIM · trong + sau · T3 → T5</span>
        </div>
      </div>
    </div>
  );
}

window.InkMarks = InkMarks;
