// InkVault.jsx — "the vault", an author's collection, as a timeline.
// Grouped by the year each thing entered the collection. Not in the nav;
// reached only from About. Books, music, papers, films, objects, courses,
// experiences — each with one line on why it earned a place.
//
// Handles: (1) dense years → 2-col flow + older years collapse;
// (2) multiple plates per item → a plate strip; (3) optional href → whole
// item becomes a link with a ↗ affordance on hover.

// a short strip of plates (1–4). Each gets its own drop id.
function PlateStrip({ n, plates }) {
  if (!plates || !plates.length) return null;
  const show = plates.slice(0, 4);
  return (
    <div style={{ display: 'flex', gap: 5, flexShrink: 0 }}>
      {show.map((p, i) => (
        <div key={i} className="ink-duo" style={{ width: plates.length > 1 ? 52 : 76, height: plates.length > 1 ? 66 : 98 }}>
          <image-slot id={`ink-vault-${n}-${i}`} shape="rect" placeholder={p || 'plate'}></image-slot>
        </div>
      ))}
    </div>
  );
}

function VaultEntry({ n, medium, title, by, made, place, note, plates, href, last }) {
  const linked = !!href;
  const Tag_ = linked ? 'a' : 'div';
  const meta = place || (made != null ? `made ${made}` : null);
  return (
    <div style={{ position: 'relative', paddingLeft: 30, paddingBottom: last ? 0 : 22 }}>
      {/* node on the spine */}
      <span style={{ position: 'absolute', left: -5.5, top: 6, width: 11, height: 11, borderRadius: '50%',
        background: INK.paper, border: `2px solid ${INK.blue}`, zIndex: 2 }} />
      <Tag_ {...(linked ? { href, target: '_blank', rel: 'noopener' } : {})}
        style={{ display: 'grid', gridTemplateColumns: plates && plates.length ? 'auto 1fr' : '1fr', gap: 14,
          alignItems: 'start', textDecoration: 'none', color: INK.ink,
          cursor: linked ? 'pointer' : 'default' }}
        onMouseEnter={e => { const t = e.currentTarget.querySelector('[data-vt]'); if (t) t.style.color = INK.blue;
          const a = e.currentTarget.querySelector('[data-arrow]'); if (a) a.style.opacity = 1; }}
        onMouseLeave={e => { const t = e.currentTarget.querySelector('[data-vt]'); if (t) t.style.color = INK.ink;
          const a = e.currentTarget.querySelector('[data-arrow]'); if (a) a.style.opacity = 0; }}>
        <PlateStrip n={n} plates={plates} />
        <div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'baseline', marginBottom: 5 }}>
            <Tag on>{medium}</Tag>
            {meta && <Tag>{meta}</Tag>}
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span data-vt style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 18, letterSpacing: '-0.02em',
              lineHeight: 1.1, textTransform: 'lowercase', transition: 'color .15s ease' }}>{title}</span>
            {linked && <span data-arrow style={{ fontFamily: MONO, fontSize: 13, color: INK.blue,
              opacity: 0, transition: 'opacity .15s ease', flexShrink: 0 }}>↗</span>}
          </div>
          <div style={{ fontFamily: MONO, fontSize: 11, color: INK.muted, margin: '3px 0 7px' }}>{by}</div>
          <div style={{ fontFamily: BODY, fontStyle: 'italic', fontSize: 13.5, lineHeight: 1.5, color: INK.ink }}>“{note}”</div>
        </div>
      </Tag_>
    </div>
  );
}

// one year block: sticky year marker + entries flowed into 2 columns.
// collapsed years show only a count and expand on click.
function YearBlock({ year, rows, defaultOpen }) {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: 30, paddingTop: 8 }}>
      {/* year marker */}
      <div style={{ position: 'sticky', top: 0, alignSelf: 'start', paddingTop: 2 }}>
        <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 46, letterSpacing: '-0.03em',
          lineHeight: 0.9, color: INK.blue }}>{year}</div>
        <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase',
          color: INK.muted, marginTop: 6 }}>{rows.length} added</div>
        {!defaultOpen && (
          <button onClick={() => setOpen(o => !o)} style={{ marginTop: 10, border: `1.5px solid ${INK.ruleHard}`,
            background: open ? INK.blue : 'transparent', color: open ? '#fff' : INK.ink, fontFamily: MONO,
            fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '6px 10px',
            cursor: 'pointer' }}>{open ? 'thu gọn −' : 'mở +'}</button>
        )}
      </div>
      {/* spine + entries, in a 2-col flow */}
      <div style={{ position: 'relative', borderLeft: `1.5px solid ${INK.ruleHard}`, paddingTop: 4, paddingBottom: 26 }}>
        {open ? (
          <div style={{ columnCount: 2, columnGap: 30 }}>
            {rows.map((it, i) => (
              <div key={it.n} style={{ breakInside: 'avoid', WebkitColumnBreakInside: 'avoid' }}>
                <VaultEntry {...it} last={false} />
              </div>
            ))}
          </div>
        ) : (
          <button onClick={() => setOpen(true)} style={{ marginLeft: 30, border: 'none', background: 'transparent',
            color: INK.muted, fontFamily: BODY, fontStyle: 'italic', fontSize: 14, cursor: 'pointer',
            padding: '6px 0', textAlign: 'left' }}>
            {rows.length} things kept this year — bấm để mở
          </button>
        )}
      </div>
    </div>
  );
}

function InkVault() {
  const [filter, setFilter] = React.useState('All');
  const media = ['All', 'Books', 'Music', 'Papers', 'Films', 'Objects', 'Courses', 'Experiences'];
  // `added` = year it entered the vault; `made` = when the work was made (nullable);
  // `place` = for courses/experiences; `plates` = 1–4 drop slots; `href` = optional link
  const items = [
    { added: 2026, medium: 'Books', title: 'the rings of saturn', by: 'w. g. sebald', made: 1995, plates: ['cover'],
      href: 'https://maxubrq.space', note: 'I reread it every winter and it is a different book each time. The one that taught me a digression can be the argument.' },
    { added: 2026, medium: 'Films', title: 'la jetée', by: 'chris marker', made: 1962,
      note: 'A film made almost entirely of still photographs. Proof that a constraint can be the whole voice.' },
    { added: 2026, medium: 'Experiences', title: 'a week at the móng cái coast', by: 'solo, off-season', place: 'quảng ninh · vn',
      plates: ['shore', 'room', 'fog'], note: 'Read four books with the sea in the window and no signal. The clearest my head has been in a year.' },
    { added: 2026, medium: 'Courses', title: 'writing the personal essay', by: 'v. gornick · online', place: 'remote · 8 wks',
      href: 'https://maxubrq.space', plates: ['syllabus'], note: 'Taught me the difference between the situation and the story. I re-listen to week three often.' },
    { added: 2026, medium: 'Objects', title: 'muji a5 notebook, dotted', by: '—', made: 'ongoing',
      note: 'Whatever survives from the reading ends up here first, before it becomes anything else.' },
    { added: 2025, medium: 'Papers', title: 'a mathematical theory of communication', by: 'c. e. shannon', made: 1948, plates: ['fig-1'],
      href: 'https://maxubrq.space', note: 'The paper that made "information" a quantity. Still the cleanest thing I have ever read.' },
    { added: 2025, medium: 'Music', title: 'the köln concert', by: 'keith jarrett', made: 1975, plates: ['sleeve'],
      note: 'An hour improvised on a piano he did not want to play. What I put on to write to, every time.' },
    { added: 2025, medium: 'Experiences', title: 'reading room, quốc tử giám', by: 'a slow afternoon', place: 'hà nội · vn',
      plates: ['court', 'stele'], note: 'Sat where scholars memorised whole canons on stone. Made my own notebooks feel small, in a good way.' },
    { added: 2025, medium: 'Books', title: 'the poetics of space', by: 'gaston bachelard', made: 1958,
      note: 'Why a drawer, a corner, a shell can hold a whole interior life. It rearranged how I read rooms.' },
    { added: 2024, medium: 'Films', title: 'stalker', by: 'andrei tarkovsky', made: 1979, plates: ['still'],
      note: 'Three men walk toward a room that grants your deepest wish, and never go in. Patience as a subject.' },
    { added: 2024, medium: 'Courses', title: 'the ancient greeks', by: 'coursera · wesleyan', place: 'remote', made: null,
      href: 'https://maxubrq.space', note: 'A whole worldview where reading aloud was the only reading. Reframed what "silent reading" even is.' },
    { added: 2024, medium: 'Music', title: 'music for 18 musicians', by: 'steve reich', made: 1976,
      note: 'A grid that breathes. The closest music comes to the kind of pattern I chase in prose.' },
    { added: 2024, medium: 'Books', title: 'six memos for the next millennium', by: 'italo calvino', made: 1988,
      note: 'Lightness, quickness, exactitude — I keep this list taped above the desk.' },
    { added: 2023, medium: 'Papers', title: 'as we may think', by: 'vannevar bush', made: 1945,
      note: 'The memex, before any of this existed. I come back to it whenever I forget what tools are for.' },
    { added: 2023, medium: 'Objects', title: 'a lamy 2000, medium nib', by: 'gerd a. müller', made: 1966,
      note: 'The pen every marginal note in my books is written with. Bauhaus that fits the hand.' },
  ].map((it, i) => ({ ...it, n: i + 1 }));

  const visible = items.filter(it => filter === 'All' || it.medium === filter);
  const years = [...new Set(visible.map(it => it.added))].sort((a, b) => b - a);

  return (
    <InkChrome current={null} foot="maxubrq.space / the vault">
      <RunningHead text="maxubrq · the vault · a timeline" />
      {/* Masthead */}
      <section style={{ padding: '44px 30px 32px', borderBottom: `1.5px solid ${INK.ruleHard}`, position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
          <a href="#" style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase' }}>← about the author</a>
          <Tag>{items.length} things · by year acquired</Tag>
        </div>
        <h1 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 84, lineHeight: 0.9,
          letterSpacing: '-0.05em', margin: 0, textTransform: 'lowercase' }}>
          the <span style={{ position: 'relative', color: INK.blue }}>vault
            <Scribble style={{ left: -20, top: -22 }} w={230} h={112} /></span>.
        </h1>
        <p style={{ maxWidth: '58ch', fontSize: 16.5, lineHeight: 1.55, color: INK.muted, margin: '22px 0 0' }}>
          A cabinet of things that belong to me — books, records, papers, films, courses, a few places —
          laid out <em>in the order they entered my life</em>, not by kind. Each kept because it changed
          the way I think. One line on why, in my own words.
        </p>
      </section>

      {/* Medium filter — wraps to two rows now that there are more kinds */}
      <div style={{ display: 'flex', flexWrap: 'wrap', borderBottom: `1.5px solid ${INK.ruleHard}` }}>
        {media.map((m, i) => (
          <button key={m} onClick={() => setFilter(m)} style={{
            flex: '1 1 25%', border: 'none', borderRight: `1px solid ${INK.rule}`, borderTop: i >= 4 ? `1px solid ${INK.rule}` : 'none',
            background: filter === m ? INK.blue : 'transparent', color: filter === m ? '#fff' : INK.ink,
            fontFamily: MONO, fontSize: 11, letterSpacing: '0.09em', textTransform: 'uppercase',
            padding: '13px 0', cursor: 'pointer' }}>{m}</button>
        ))}
      </div>

      {/* Timeline — newest two years open, older years collapsed */}
      <section style={{ padding: '22px 30px 34px' }}>
        {years.map((year, yi) => (
          <YearBlock key={year} year={year} rows={visible.filter(it => it.added === year)} defaultOpen={yi < 2} />
        ))}
        <p style={{ fontFamily: MONO, fontSize: 11.5, color: INK.muted, margin: '10px 0 0',
          borderTop: `1.5px solid ${INK.ruleHard}`, paddingTop: 16, lineHeight: 1.6 }}>
          Kept privately, shared quietly. No ratings, no affiliate links, no “buy” button. Dated by when it
          reached me, not when it was made. Older years fold away — bấm để mở. — Còn giữ, tức là còn quan trọng.
        </p>
      </section>
    </InkChrome>
  );
}

Object.assign(window, { InkVault });
