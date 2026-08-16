// InkShelf.jsx — "kệ-đã-đọc như một vật" (T4). Only pieces read to the END
// (not merely opened) become spines on a shelf — a single printable object,
// typeset like the fore-edge and spine of real books. Counts-free: no number
// leads, no ratings, no dates shouting. Opening a thing earns it nothing;
// only finishing puts a spine on the shelf.
//
// Reads the same reading-state store the Constellation uses: a "finished"
// post becomes a spine. Colour + height vary a little by topic + length so
// the shelf reads like a real, uneven row of books.

// draws one book spine, vertical, title running bottom-to-top
function Spine({ title, by, topic, min, i }) {
  // deterministic-but-varied dimensions from the title, so the shelf looks real
  const seed = title.length + i * 7;
  const h = 300 + (seed % 5) * 22;              // 300–388
  const w = 46 + (min % 4) * 7 + (seed % 3) * 4; // ~46–74
  const tone = {
    sci: INK.blue, phi: INK.ink, art: INK.blueDeep, sw: '#2a2a30',
  }[topic] || INK.ink;
  const light = (seed % 3 === 0);               // a few cream spines break the row
  const bg = light ? INK.paper2 : tone;
  const fg = light ? INK.ink : '#fff';
  return (
    <div style={{ width: w, height: h, background: bg, alignSelf: 'flex-end', flexShrink: 0,
      border: light ? `1.5px solid ${INK.ruleHard}` : 'none', position: 'relative',
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      boxShadow: 'inset -6px 0 12px rgba(0,0,0,0.16), inset 4px 0 6px rgba(255,255,255,0.06)',
      cursor: 'default', transition: 'transform .18s ease' }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-8px)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}>
      {/* top band — two hairline rules like a bound spine */}
      <div style={{ borderTop: `1px solid ${light ? INK.rule : 'rgba(255,255,255,0.35)'}`,
        borderBottom: `1px solid ${light ? INK.rule : 'rgba(255,255,255,0.35)'}`,
        height: 16, margin: '18px 7px 0' }} />
      {/* running title */}
      <div style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', margin: '0 auto',
        fontFamily: DISPLAY, fontWeight: 600, fontSize: w > 60 ? 17 : 15, letterSpacing: '-0.01em',
        color: fg, textTransform: 'lowercase', lineHeight: 1.05, textAlign: 'left',
        maxHeight: h - 90, overflow: 'hidden', flex: 1, padding: '4px 0' }}>{title}</div>
      {/* foot — author monogram + a small ink mark */}
      <div style={{ margin: '0 7px 16px' }}>
        <div style={{ borderTop: `1px solid ${light ? INK.rule : 'rgba(255,255,255,0.35)'}`, marginBottom: 10 }} />
        <div style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', margin: '0 auto',
          fontFamily: MONO, fontSize: 8.5, letterSpacing: '0.14em', textTransform: 'uppercase',
          color: light ? INK.muted : 'rgba(255,255,255,0.7)' }}>{by}</div>
      </div>
    </div>
  );
}

function InkShelf() {
  // In a build these come from reading-state where finished === true.
  const finished = [
    { title: 'the horizon of a pendulum', by: 'maxubrq', topic: 'sci', min: 9 },
    { title: 'reactions before reading', by: 'maxubrq', topic: 'phi', min: 13 },
    { title: 'on the printed plate', by: 'maxubrq', topic: 'art', min: 8 },
    { title: 'what a proof costs', by: 'maxubrq', topic: 'sci', min: 12 },
    { title: 'on the fair witness', by: 'maxubrq', topic: 'phi', min: 7 },
    { title: 'debounce, rebuilt', by: 'maxubrq', topic: 'sw', min: 11 },
    { title: 'entropy, explained to my daughter', by: 'maxubrq', topic: 'sci', min: 6 },
    { title: 'the fleuron and the pause', by: 'maxubrq', topic: 'art', min: 4 },
    { title: 'a room of one’s reading', by: 'maxubrq', topic: 'phi', min: 6 },
    { title: 'what survives a second reading', by: 'k. trần', topic: 'phi', min: 11 },
    { title: 'on reading by weight', by: 'maxubrq', topic: 'sci', min: 9 },
    { title: 'why you forget what you read', by: 'maxubrq', topic: 'phi', min: 18 },
  ];

  return (
    <InkChrome current={null} foot="maxubrq.space / read shelf">
      <RunningHead text="maxubrq · the read shelf · a thing you can print" />
      {/* Masthead */}
      <section style={{ padding: '46px 40px 30px', borderBottom: `1.5px solid ${INK.ruleHard}`, position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
          <a href="#ink-reader-room" style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase' }}>← the reading room</a>
          <Tag>finished only · opening earns nothing</Tag>
        </div>
        <h1 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 78, lineHeight: 0.9,
          letterSpacing: '-0.05em', margin: 0, textTransform: 'lowercase' }}>
          the <span style={{ position: 'relative', color: INK.blue }}>read shelf
            <Underline style={{ left: 2, bottom: -8 }} w={260} /></span>.
        </h1>
        <p style={{ maxWidth: '58ch', fontFamily: BODY, fontStyle: 'italic', fontSize: 17, lineHeight: 1.55,
          color: INK.muted, margin: '22px 0 0' }}>
          Not everything you clicked — everything you <em>finished</em>. Each piece you carried to the last
          line becomes a spine, set the way a bound book is set. A shelf you can print and put on a real
          wall. No ratings, no dates, no tally on the board.
        </p>
      </section>

      {/* The shelf — a row of spines resting on a plank */}
      <section style={{ padding: '40px 40px 0', overflowX: 'auto' }}>
        <div className="ink-scroll" style={{ display: 'flex', alignItems: 'flex-end', gap: 4, minHeight: 400,
          paddingBottom: 0 }}>
          {finished.map((b, i) => <Spine key={i} {...b} i={i} />)}
        </div>
        {/* the plank */}
        <div style={{ height: 16, background: INK.ink, marginTop: -1 }} />
        <div style={{ height: 8, background: INK.blue }} />
      </section>

      {/* footnote */}
      <section style={{ padding: '26px 40px 34px' }}>
        <p style={{ fontFamily: MONO, fontSize: 11.5, color: INK.muted, margin: 0,
          borderTop: `1.5px solid ${INK.ruleHard}`, paddingTop: 16, lineHeight: 1.6, maxWidth: '74ch' }}>
          A spine appears the moment you reach the last line — not when you open a piece, not at some
          percent. Opening earns nothing; only finishing puts a book on the shelf. Spine width follows
          length, colour follows subject, so the row is as uneven as a real one. — Kệ này chỉ nhận sách
          bạn đã đọc hết.
        </p>
      </section>
    </InkChrome>
  );
}

Object.assign(window, { InkShelf });
