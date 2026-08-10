// InkWeather.jsx — "thời tiết của bài" (T2 → T3). A reading contract.
// TWO forms, because the feature exists to prepare you BEFORE you read:
//   1) WeatherStrip — compact meta row at the head of the article.
//   2) WeatherLine  — one condensed line on a listing/home card.
// Not a dense table — a scannable strip. Honesty even when unflattering.

// difficulty as filled/empty squares, not a number-out-of
function Load({ n, of = 5, small }) {
  const s = small ? 8 : 11;
  return (
    <span style={{ display: 'inline-flex', gap: 2.5, verticalAlign: 'middle' }}>
      {Array.from({ length: of }).map((_, i) => (
        <span key={i} style={{ width: s, height: s, background: i < n ? INK.blue : 'transparent',
          border: `1.5px solid ${i < n ? INK.blue : INK.rule}` }} />
      ))}
    </span>
  );
}

// a mono chip: tiny label above, value below
function Chip({ k, children, border }) {
  return (
    <div style={{ padding: '0 16px', borderLeft: border ? `1px solid ${INK.rule}` : 'none' }}>
      <div style={{ fontFamily: MONO, fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase',
        color: INK.faint, marginBottom: 4 }}>{k}</div>
      <div style={{ fontFamily: MONO, fontSize: 13, color: INK.ink, whiteSpace: 'nowrap' }}>{children}</div>
    </div>
  );
}

// ── FORM 1: the compact contract strip at an article head ────────────
function WeatherStrip() {
  return (
    <div style={{ border: `1.5px solid ${INK.ruleHard}` }}>
      {/* one scannable row of facts */}
      <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', padding: '13px 0',
        rowGap: 12 }}>
        <Chip k="◔ read time">18–22 min · one sitting</Chip>
        <Chip k="load" border><Load n={4} /></Chip>
        <Chip k="need first" border>a vague sense of “spaced repetition”</Chip>
        <Chip k="best when" border>morning · head still fresh</Chip>
      </div>
      {/* the honest warning — one line, calm blue, not an alarm */}
      <div style={{ borderTop: `1px solid ${INK.rule}`, padding: '10px 16px', background: INK.blue,
        display: 'flex', gap: 10, alignItems: 'baseline' }}>
        <span style={{ fontFamily: MONO, fontSize: 9.5, letterSpacing: '0.12em', textTransform: 'uppercase',
          color: '#fff', opacity: 0.85, flexShrink: 0 }}>honest ↴</span>
        <span style={{ fontFamily: MONO, fontSize: 12.5, lineHeight: 1.45, color: '#fff' }}>
          The middle will annoy you — it denies something you believe about memory. That’s intended. Leaving is fine; nothing breaks.
        </span>
      </div>
    </div>
  );
}

// ── FORM 2: one weather line for a listing card ──────────────────────
function WeatherLine({ time, load, when, warn }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
      fontFamily: MONO, fontSize: 11, color: INK.muted, marginTop: 10 }}>
      <span style={{ color: INK.ink }}>◔ {time}</span>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>load <Load n={load} small /></span>
      <span>· {when}</span>
      {warn && <span style={{ color: INK.blue, fontWeight: 500 }}>· ⚠ {warn}</span>}
    </div>
  );
}

function InkWeather() {
  const listing = [
    { tag: 'Essay', title: 'why you forget almost everything you read', time: '18 min', load: 4,
      when: 'morning', warn: 'denies a memory belief' },
    { tag: 'Note', title: 'the clean copy is a control group', time: '6 min', load: 2,
      when: 'anytime', warn: null },
    { tag: 'Conversation', title: 'what survives a second reading', time: '11 min', load: 3,
      when: 'unhurried', warn: null },
    { tag: 'Essay', title: 'on reading by weight', time: '9 min', load: 3,
      when: 'evening ok', warn: 'no numbers, may unsettle' },
  ];
  return (
    <InkChrome current="writing" foot="maxubrq.space / reading contract">
      <RunningHead text="maxubrq · the weather of the piece · T2→T3" />
      <div style={{ padding: '36px 40px 34px', maxWidth: 900, margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
          <Tag on>Reading contract</Tag><Tag>● Two forms</Tag><Tag>prepare before you read</Tag>
        </div>

        {/* FORM 1 in context: an article head */}
        <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase',
          color: INK.muted, marginBottom: 12 }}>1 — at the head of the article</div>
        <h1 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 46, lineHeight: 0.99,
          letterSpacing: '-0.04em', margin: '0 0 18px', textTransform: 'lowercase' }}>
          why you forget almost<br />everything <span style={{ color: INK.blue }}>you read</span>.
        </h1>
        <WeatherStrip />
        <p style={{ fontFamily: BODY, fontSize: 18, lineHeight: 1.7, color: INK.ink, maxWidth: '60ch',
          margin: '22px 0 0' }}>
          <span style={{ float: 'left', fontFamily: DISPLAY, fontWeight: 700, fontSize: 60, lineHeight: 0.8,
            color: INK.blue, margin: '4px 12px 0 0' }}>Y</span>
          ou did not forget the book because you are careless. You forgot it because remembering was never the
          deal your brain agreed to — the habit this essay is about to argue you should fight.
        </p>

        {/* FORM 2 in context: a listing */}
        <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase',
          color: INK.muted, margin: '40px 0 0', borderTop: `1.5px solid ${INK.ruleHard}`, paddingTop: 22 }}>
          2 — on the home / index, one line per piece
        </div>
        <div style={{ marginTop: 14 }}>
          {listing.map((a, i) => (
            <a key={i} href="#" style={{ display: 'block', textDecoration: 'none', color: INK.ink,
              padding: '18px 0', borderTop: i ? `1px solid ${INK.rule}` : 'none' }}
              onMouseEnter={e => { const t = e.currentTarget.querySelector('[data-t]'); if (t) t.style.color = INK.blue; }}
              onMouseLeave={e => { const t = e.currentTarget.querySelector('[data-t]'); if (t) t.style.color = INK.ink; }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'baseline' }}>
                <Tag>{a.tag}</Tag>
                <span data-t style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 21, letterSpacing: '-0.02em',
                  textTransform: 'lowercase', transition: 'color .15s ease' }}>{a.title}</span>
              </div>
              <WeatherLine {...a} />
            </a>
          ))}
        </div>

        {/* why */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 0, borderTop: `1.5px solid ${INK.ruleHard}`,
          paddingTop: 18, marginTop: 30 }}>
          {[
            ['Mechanism', 'Hạ bất định TRƯỚC khi cam kết — ở cả listing lẫn đầu bài. Biết mình bước vào gì thì ít bỏ giữa chừng.'],
            ['Diagnostic', 'Tỉ lệ bắt-đầu-rồi-đọc-hết tăng? Và: click từ listing có “đúng người” hơn không.'],
            ['Defense', 'Trung thực cả khi bất lợi — “sẽ làm bạn khó chịu”, “bỏ giữa chừng tệ hơn không đọc”. In xanh bình thản, không tô đỏ báo động.'],
          ].map(([h, b], i) => (
            <div key={i} style={{ padding: '0 18px', borderRight: i < 2 ? `1px solid ${INK.rule}` : 'none' }}>
              <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase',
                color: INK.blue, marginBottom: 8 }}>{h}</div>
              <p style={{ fontFamily: BODY, fontSize: 13, lineHeight: 1.5, color: INK.ink, margin: 0 }}>{b}</p>
            </div>
          ))}
        </div>
      </div>
    </InkChrome>
  );
}

Object.assign(window, { InkWeather });
