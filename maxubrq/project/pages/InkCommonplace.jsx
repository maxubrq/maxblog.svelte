// InkCommonplace.jsx — "commonplace của riêng bạn" (T4 → T5).
// Every sentence you underlined, gathered into a typeset commonplace book in
// the Ink Edition voice — print-ready. No stats, no chronology, no counts on
// the title. The reader's sentences lead; the source only whispers underneath.
// Bonus: export the whole book to Markdown (Obsidian) or a Notion-friendly form.

// grouped by a THREAD the reader made — a facet of how they read — not by date.
const THREADS = [
  { thread: 'on memory & forgetting',
    marks: [
      { text: 'You forgot it because remembering was never the deal your brain agreed to.', src: 'why you forget almost everything you read', by: 'maxubrq' },
      { text: 'The gist is kept and the pages are thrown away, which is exactly what it is built to do.', src: 'why you forget almost everything you read', by: 'maxubrq' },
      { text: 'A mind that forgot nothing would never generalise; forgetting is the cost of meaning.', src: 'the ancient art of memory', by: 'f. yates' },
    ] },
  { thread: 'on rereading',
    marks: [
      { text: 'The first read is weather. The second read is the map.', src: 'what survives a second reading', by: 'k. trần' },
      { text: 'Keep one copy you never write in — it is the only way to tell the book apart from yourself.', src: 'what survives a second reading', by: 'k. trần' },
      { text: 'You already know where the road bends, so you stop watching the road and start watching how it was built.', src: 'what survives a second reading', by: 'k. trần' },
    ] },
  { thread: 'on attention',
    marks: [
      { text: 'The best reading instruments are felt, not seen; sensed, not counted.', src: 'on reading by weight', by: 'maxubrq' },
      { text: 'Give a person a number and they will chase it; give them a weight and they will read until it is light.', src: 'on reading by weight', by: 'maxubrq' },
      { text: 'Lightness, quickness, exactitude.', src: 'six memos for the next millennium', by: 'i. calvino' },
    ] },
];

// ── the export: generate Markdown from the marks ─────────────────────
function toMarkdown(kind) {
  const isObs = kind === 'obsidian';
  const L = [];
  if (isObs) {
    L.push('---', 'title: commonplace book', 'source: maxubrq.space',
      'tags: [reading, commonplace]', '---', '');
  }
  L.push('# commonplace book', '', '> A portrait of how I read. Sentences I kept, gathered by thread.', '');
  THREADS.forEach(t => {
    L.push(`## ${t.thread}`, '');
    t.marks.forEach(m => {
      L.push(`> ${m.text}`);
      // Obsidian: source as a wiki-link; Notion/plain: italic attribution
      L.push(isObs ? `> — [[${m.src}]] · ${m.by}` : `> — *${m.src}* · ${m.by}`, '');
    });
  });
  return L.join('\n');
}

function ExportPanel({ onClose }) {
  const [kind, setKind] = React.useState('obsidian');
  const md = toMarkdown(kind);
  const kinds = [['obsidian', 'Obsidian (.md + wiki-links)'], ['notion', 'Notion / plain markdown']];
  function copy() { navigator.clipboard && navigator.clipboard.writeText(md); }
  function download() {
    const blob = new Blob([md], { type: 'text/markdown' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = 'commonplace.md'; a.click();
  }
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(13,13,17,0.5)', zIndex: 50,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 30 }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background: INK.paper, border: `1.5px solid ${INK.ruleHard}`,
        width: 'min(680px, 100%)', maxHeight: '86%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px',
          borderBottom: `1.5px solid ${INK.ruleHard}` }}>
          <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 20, letterSpacing: '-0.02em',
            textTransform: 'lowercase' }}>export your commonplace</span>
          <button onClick={onClose} style={{ border: 'none', background: 'transparent', fontFamily: MONO,
            fontSize: 16, cursor: 'pointer', color: INK.muted }}>✕</button>
        </div>
        <div style={{ display: 'flex', borderBottom: `1px solid ${INK.rule}` }}>
          {kinds.map(([k, label], i) => (
            <button key={k} onClick={() => setKind(k)} style={{ flex: 1, border: 'none',
              borderRight: i === 0 ? `1px solid ${INK.rule}` : 'none',
              background: kind === k ? INK.blue : 'transparent', color: kind === k ? '#fff' : INK.ink,
              fontFamily: MONO, fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase',
              padding: '11px 6px', cursor: 'pointer' }}>{label}</button>
          ))}
        </div>
        <pre className="ink-scroll" style={{ margin: 0, padding: '16px 18px', overflow: 'auto', flex: 1,
          fontFamily: MONO, fontSize: 12, lineHeight: 1.55, color: INK.ink, background: INK.paper2,
          whiteSpace: 'pre-wrap' }}>{md}</pre>
        <div style={{ display: 'flex', gap: 10, padding: '14px 18px', borderTop: `1.5px solid ${INK.ruleHard}` }}>
          <button onClick={download} style={{ flex: 1, border: 'none', background: INK.blue, color: '#fff',
            fontFamily: MONO, fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase',
            padding: '13px 0', cursor: 'pointer' }}>Download .md</button>
          <button onClick={copy} style={{ border: `1.5px solid ${INK.ruleHard}`, background: 'transparent',
            color: INK.ink, fontFamily: MONO, fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase',
            padding: '13px 18px', cursor: 'pointer' }}>Copy</button>
        </div>
      </div>
    </div>
  );
}

function InkCommonplace() {
  const [exporting, setExporting] = React.useState(false);
  return (
    <InkChrome current={null} foot="maxubrq.space / commonplace">
      <RunningHead text="maxubrq · commonplace · a portrait of how you read" />
      {/* Masthead — reader's own book, no count, no dates */}
      <section style={{ padding: '46px 40px 30px', borderBottom: `1.5px solid ${INK.ruleHard}`, position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
          <Tag on>Your commonplace</Tag>
          <button onClick={() => setExporting(true)} style={{ border: `1.5px solid ${INK.ruleHard}`,
            background: 'transparent', color: INK.ink, fontFamily: MONO, fontSize: 10.5, letterSpacing: '0.08em',
            textTransform: 'uppercase', padding: '7px 12px', cursor: 'pointer' }}>export ↗ obsidian · notion</button>
        </div>
        <h1 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 74, lineHeight: 0.92,
          letterSpacing: '-0.05em', margin: 0, textTransform: 'lowercase' }}>
          the sentences<br />you <span style={{ position: 'relative', color: INK.blue }}>kept
            <Underline style={{ left: 2, bottom: -8 }} w={190} /></span>.
        </h1>
        <p style={{ maxWidth: '56ch', fontFamily: BODY, fontStyle: 'italic', fontSize: 17, lineHeight: 1.55,
          color: INK.muted, margin: '22px 0 0' }}>
          Not a reading log. Not a streak. Every line you underlined, typeset the way it deserves and gathered
          by the threads it belongs to — a portrait of how you read, in your own choice of sentences.
        </p>
      </section>

      {/* The book — threads of excerpts, the reader's sentences leading */}
      <section style={{ padding: '0 40px 20px' }}>
        {THREADS.map((t, ti) => (
          <div key={ti} style={{ padding: '34px 0 6px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 20 }}>
              <h2 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 24, letterSpacing: '-0.02em',
                textTransform: 'lowercase', margin: 0, whiteSpace: 'nowrap' }}>{t.thread}</h2>
              <span style={{ flex: 1, height: 1.5, background: INK.ruleHard }} />
            </div>
            <div style={{ display: 'grid', gap: 0 }}>
              {t.marks.map((m, mi) => (
                <figure key={mi} style={{ margin: 0, padding: '20px 0', borderTop: mi ? `1px solid ${INK.rule}` : 'none',
                  display: 'grid', gridTemplateColumns: '26px 1fr', gap: 18 }}>
                  <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 30, lineHeight: 0.7,
                    color: INK.blue }}>“</span>
                  <div>
                    <blockquote style={{ margin: 0, fontFamily: DISPLAY, fontWeight: 500, fontSize: 23,
                      lineHeight: 1.28, letterSpacing: '-0.02em', color: INK.ink, textWrap: 'pretty' }}>
                      {m.text}
                    </blockquote>
                    <figcaption style={{ fontFamily: MONO, fontSize: 11, color: INK.muted, marginTop: 10 }}>
                      — {m.src} · {m.by}
                    </figcaption>
                  </div>
                </figure>
              ))}
            </div>
          </div>
        ))}
        <p style={{ fontFamily: MONO, fontSize: 11.5, color: INK.muted, margin: '20px 0 0',
          borderTop: `1.5px solid ${INK.ruleHard}`, paddingTop: 16, lineHeight: 1.6 }}>
          Kept privately. No dates on the page, no tally in the title — the sentences you chose are the whole
          portrait. Print it, or carry it out to Obsidian or Notion. — Bạn là những câu bạn giữ lại.
        </p>
      </section>

      {exporting && <ExportPanel onClose={() => setExporting(false)} />}
    </InkChrome>
  );
}

Object.assign(window, { InkCommonplace });
