// InkDialogue.jsx — a conversation, set as an editorial spread.
// Two voices, speaker folios in the margin, the same white + ink-blue grid.

// speakers: M = the host (ink), K = the guest (blue)
const SPK = {
  M: { name: 'maxubrq', role: 'host', color: INK.ink,  init: 'M' },
  K: { name: 'k. trần', role: 'guest — reader, translator', color: INK.blue, init: 'K' },
};

// one exchange: speaker folio in the margin rail, speech in the column
function Turn({ who, first, children }) {
  const s = SPK[who];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: 34,
      padding: '0 0 26px', alignItems: 'start' }}>
      <div style={{ position: 'sticky', top: 0, alignSelf: 'start' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <span style={{ width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
            border: `1.5px solid ${s.color}`, color: who === 'K' ? '#fff' : s.color,
            background: who === 'K' ? INK.blue : 'transparent',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: MONO, fontSize: 12, fontWeight: 500 }}>{s.init}</span>
          <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.08em',
            textTransform: 'uppercase', color: s.color, fontWeight: 500 }}>{s.name}</span>
        </div>
        {first && <div style={{ fontFamily: MONO, fontSize: 9.5, letterSpacing: '0.1em',
          textTransform: 'uppercase', color: INK.faint, marginTop: 6, paddingLeft: 35 }}>{s.role}</div>}
      </div>
      <div style={{ fontSize: 17.5, lineHeight: 1.6, color: who === 'K' ? INK.ink : INK.ink,
        borderLeft: who === 'K' ? `2px solid ${INK.blue}` : `2px solid ${INK.rule}`,
        paddingLeft: 20 }}>{children}</div>
    </div>
  );
}

function InkDialogue() {
  return (
    <InkChrome current="writing" foot="maxubrq.space / conversations">
      <RunningHead text="maxubrq · vol.04 · a conversation" />
      <article style={{ maxWidth: 940, margin: '0 auto', padding: '0 44px' }}>
        {/* Title block */}
        <header style={{ padding: '48px 0 28px', borderBottom: `1.5px solid ${INK.ruleHard}` }}>
          <div style={{ display: 'flex', gap: 14, marginBottom: 22 }}>
            <Tag on>Conversation</Tag><Tag>● Dialogue</Tag><Tag>Nº 007</Tag>
          </div>
          <h1 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 56, lineHeight: 0.96,
            letterSpacing: '-0.04em', margin: 0, textTransform: 'lowercase' }}>
            what survives a<br />
            <span style={{ position: 'relative', color: INK.blue }}>second reading
              <Underline style={{ left: 2, bottom: -10 }} w={340} /></span>?
          </h1>
          <p style={{ maxWidth: '58ch', fontSize: 16.5, lineHeight: 1.55, color: INK.muted,
            margin: '24px 0 0' }}>
            A conversation with <strong style={{ color: INK.ink, fontWeight: 600 }}>K. Trần</strong> —
            translator, and a reader who keeps two copies of everything: one to mark up, one to keep clean.
            Recorded over tea; lightly edited, kept in the order it happened.
          </p>
        </header>

        {/* Interlocutors legend */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: `1.5px solid ${INK.ruleHard}` }}>
          {['M', 'K'].map((w, i) => {
            const s = SPK[w];
            return (
              <div key={w} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 0',
                borderRight: i === 0 ? `1px solid ${INK.rule}` : 'none', paddingRight: 20,
                paddingLeft: i === 1 ? 24 : 0 }}>
                <span style={{ width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
                  border: `1.5px solid ${s.color}`, color: w === 'K' ? '#fff' : s.color,
                  background: w === 'K' ? INK.blue : 'transparent',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: MONO, fontSize: 13, fontWeight: 500 }}>{s.init}</span>
                <div>
                  <div style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 16, letterSpacing: '-0.01em',
                    textTransform: 'lowercase', color: s.color }}>{s.name}</div>
                  <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.08em',
                    textTransform: 'uppercase', color: INK.muted, marginTop: 2 }}>{s.role}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* The conversation */}
        <div style={{ padding: '34px 0 0' }}>
          <Turn who="M" first>
            You told me once that you never trust a book until the second time through. I've thought about
            that for a year. What happens on the first read that you don't trust?
          </Turn>
          <Turn who="K" first>
            The first read is weather. You're inside it — the plot, the argument, the momentum. You feel a
            lot and understand almost nothing. It's honest, but it isn't <em>knowledge</em> yet. It's the
            shape of the thing seen from inside a moving car.
          </Turn>
          <Turn who="M">
            And the second read is the map.
          </Turn>
          <Turn who="K">
            The second read is you standing still. You already know where the road bends, so you stop
            watching the road and start watching how it was built. That's when the sentences start to
            answer for themselves.
          </Turn>

          {/* Blue pull-quote plate — the exchange that anchors the piece */}
          <blockquote style={{ margin: '10px 0 34px', background: INK.blue, color: '#fff',
            padding: '30px 32px', position: 'relative' }}>
            <p style={{ fontFamily: DISPLAY, fontWeight: 500, fontSize: 25, lineHeight: 1.16,
              letterSpacing: '-0.02em', margin: 0, textTransform: 'lowercase' }}>
              the first read is weather. the second read is the map. most of what people call
              “understanding” is just the distance between them.
            </p>
            <div style={{ fontFamily: MONO, fontSize: 10.5, letterSpacing: '0.1em', textTransform: 'uppercase',
              marginTop: 18, opacity: 0.85 }}>— k. trần, on rereading</div>
          </blockquote>

          <Turn who="M">
            But most people read a thing once and move on. If the first read is only weather, are they
            getting anything that lasts?
          </Turn>
          <Turn who="K">
            They get an <em>impression</em>, and impressions are not nothing — they're what makes you come
            back. But if you never come back, the book stays weather forever. It rained on you once. That's
            the whole relationship.
          </Turn>

          {/* A figure, mid-conversation */}
          <DuoPhoto id="ink-dialogue-fig" ratio="16 / 9"
            label="Plate — K.'s two copies of the same novel · one marked, one kept clean"
            style={{ margin: '8px 0 34px' }} />

          <Turn who="M">
            You keep two copies of everything. One you write in, one you leave clean. Isn't the clean one
            just… vanity? A book you're afraid to touch?
          </Turn>
          <Turn who="K">
            <em>[laughs]</em> Maybe. But I think of it differently. The marked copy is my reading — it's
            covered in me. The clean copy is the book without me in it. When I want to check whether I
            understood the author or just understood myself, I need the one I haven't touched.
          </Turn>
          <Turn who="M">
            That's the most exact thing anyone's said to me about rereading. The clean copy is a control
            group.
          </Turn>
          <Turn who="K">
            It's a control group. You run the experiment on the marked one and keep the other one honest.
          </Turn>

          {/* One line to remember — carried over from the reading kit */}
          <div style={{ margin: '32px 0 34px', border: `1.5px solid ${INK.ruleHard}`, position: 'relative' }}>
            <div style={{ padding: '10px 16px', borderBottom: `1px solid ${INK.rule}`,
              display: 'flex', justifyContent: 'space-between' }}>
              <Tag on>If you remember one line from this</Tag><Tag>the editor’s pick</Tag>
            </div>
            <p style={{ fontFamily: DISPLAY, fontWeight: 500, fontSize: 26, lineHeight: 1.16,
              letterSpacing: '-0.02em', margin: 0, padding: '26px 22px', textTransform: 'lowercase', color: INK.blue }}>
              keep one copy you never write in. it's the only way to tell the book apart from yourself.
            </p>
          </div>

          <Turn who="M">
            Last one. If someone reads this and only does one thing differently tomorrow — what should it be?
          </Turn>
          <Turn who="K">
            Reread the thing you already think you know. Not something new — something you're sure of. That's
            where the second read pays. The new book will always be weather. The one you reread becomes yours.
          </Turn>

          <MetaFoot items={[
            ['Filed under', 'Philosophy / reading'],
            ['Format', 'Conversation · 1 of 3'],
            ['Recorded', 'Apr 2026 · Hà Nội'],
            ['Words', '1,180'],
          ]} />
        </div>
      </article>
    </InkChrome>
  );
}

Object.assign(window, { InkDialogue });
