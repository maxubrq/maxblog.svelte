// InkReaderRoom.jsx — "the reading room". One private roof over everything
// that belongs to the reader: the constellation of what they've read, the
// commonplace of sentences they kept, the book of their misreadings, their
// reading appointments, the shelf of the finished. Not in the global nav —
// reached from About and from a persistent monogram. Local-only, on purpose.
//
// Each panel is a DOOR to its own full page; the hub only previews + counts
// lightly (counts live here, never on the individual pages' titles).

// a door into one reader-owned room
function Room({ plate, kind, title, blurb, meta, accent, wide, children, href }) {
  return (
    <a href={href || '#'} style={{ display: 'flex', flexDirection: 'column', textDecoration: 'none',
      color: INK.ink, border: `1.5px solid ${INK.ruleHard}`, background: accent ? INK.blue : INK.paper,
      gridColumn: wide ? 'span 2' : 'span 1', minHeight: 210, position: 'relative', overflow: 'hidden' }}
      onMouseEnter={e => { const a = e.currentTarget.querySelector('[data-arrow]'); if (a) a.style.transform = 'translateX(4px)';
        if (!accent) e.currentTarget.style.background = INK.paper2; }}
      onMouseLeave={e => { const a = e.currentTarget.querySelector('[data-arrow]'); if (a) a.style.transform = 'translateX(0)';
        if (!accent) e.currentTarget.style.background = INK.paper; }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 16px',
        borderBottom: `1px solid ${accent ? 'rgba(255,255,255,0.25)' : INK.rule}` }}>
        <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase',
          color: accent ? 'rgba(255,255,255,0.85)' : INK.muted }}>{kind}</span>
        <span data-arrow style={{ fontFamily: MONO, fontSize: 14, color: accent ? '#fff' : INK.blue,
          transition: 'transform .15s ease' }}>→</span>
      </div>
      <div style={{ padding: '18px 16px 16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 27, letterSpacing: '-0.03em',
          lineHeight: 0.98, textTransform: 'lowercase', color: accent ? '#fff' : INK.ink }}>{title}</div>
        <div style={{ fontFamily: BODY, fontSize: 13.5, lineHeight: 1.5, color: accent ? 'rgba(255,255,255,0.85)' : INK.muted,
          marginTop: 8, maxWidth: '42ch' }}>{blurb}</div>
        {children}
        <div style={{ marginTop: 'auto', paddingTop: 14, fontFamily: MONO, fontSize: 10.5,
          letterSpacing: '0.06em', color: accent ? 'rgba(255,255,255,0.75)' : INK.faint }}>{meta}</div>
      </div>
    </a>
  );
}

function InkReaderRoom() {
  return (
    <InkChrome current={null} foot="maxubrq.space / the reading room">
      <RunningHead text="maxubrq · the reading room · everything that is yours" />
      {/* Masthead */}
      <section style={{ padding: '46px 40px 30px', borderBottom: `1.5px solid ${INK.ruleHard}`, position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
          <a href="#" style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase' }}>← about the author</a>
          <Tag>private · stays on this device</Tag>
        </div>
        <h1 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 78, lineHeight: 0.9,
          letterSpacing: '-0.05em', margin: 0, textTransform: 'lowercase' }}>
          the <span style={{ position: 'relative', color: INK.blue }}>reading room
            <Underline style={{ left: 2, bottom: -8 }} w={330} /></span>.
        </h1>
        <p style={{ maxWidth: '58ch', fontFamily: BODY, fontStyle: 'italic', fontSize: 17, lineHeight: 1.55,
          color: INK.muted, margin: '22px 0 0' }}>
          Not a dashboard. A room off the side of the site where everything you’ve made by reading
          is kept together — the map of where you’ve been, the sentences you underlined, the things
          you got wrong, the appointments you set with what’s next. No one else can see it.
        </p>
      </section>

      {/* The rooms */}
      <section style={{ padding: '26px 40px 18px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Room wide accent kind="the chart" title="your constellation"
            href="#ink-constellation"
            blurb="Every essay drawn as a star; the ones you finished lit, an ember thread through them in the order you read. A portrait of where your attention has travelled."
            meta="◍ 12 of 32 lit · 1 thread drawn · redrawn each visit">
          </Room>
          <Room kind="kept sentences" title="commonplace"
            href="#ink-commonplace"
            blurb="Everything you underlined, typeset and gathered by thread. Print it, or carry it to Obsidian / Notion."
            meta="✎ 9 marks · 3 threads · export ready" />
          <Room kind="what you got wrong" title="the misreading book"
            href="#"
            blurb="Every time your opening guess clashed with what a piece actually said — kept as the history of how you read, not a scoreboard."
            meta="↯ 4 entries · private by design" />
          <Room kind="appointments" title="reading, scheduled"
            href="#"
            blurb="Not a save-for-later graveyard. Real dates you set to meet a piece — the site keeps the appointment, then lets it go."
            meta="⏱ 2 upcoming · next: sun 9:00" />
          <Room kind="the finished" title="read shelf"
            href="#ink-shelf"
            blurb="A quiet shelf of what you carried all the way to the end. No ratings, no streak — just the spines."
            meta="▤ 12 spines · by nothing but memory" />
          <Room kind="what the site noticed" title="reading profile"
            href="#ink-profile"
            blurb="The one honest surface for how the site quietly adapts to you — every guess in plain words, with the evidence, yours to correct or switch off."
            meta="◑ 4 guesses · learned on this device only" />
        </div>
        <p style={{ fontFamily: MONO, fontSize: 11.5, color: INK.muted, margin: '22px 0 0',
          borderTop: `1.5px solid ${INK.ruleHard}`, paddingTop: 16, lineHeight: 1.6 }}>
          Counts live here in the room, never on the pages themselves — a page leads with your sentences,
          not a tally. Everything is computed on your device from what you’ve read; nothing is uploaded.
          — Chỉ mình bạn có thể thấy căn phòng này.
        </p>
      </section>
    </InkChrome>
  );
}

Object.assign(window, { InkReaderRoom });
