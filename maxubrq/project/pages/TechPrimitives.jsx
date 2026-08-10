// TechPrimitives.jsx — typographic primitives for technical writing.
// Everything is designed to sit inside the same book-page grid as ArticlePage,
// so code and diagrams feel like "plates" in a printed technical book
// rather than web-app UI.
//
// Exports:
//   CodePlate     — syntax-highlighted code block with caption
//   DiagramPlate  — wraps arbitrary SVG/DOM (incl. Mermaid) with caption
//   Terminal      — prompt-style output
//   Callout       — info/warn/note sidebar within column
//   InlineCode    — <code> tuned to serif rhythm
//   Footnote      — superscript ref that links to the References list
//   SectionNum    — margin-numbered section headers (1.0, 1.1)
//
// Syntax highlighting is done by a tiny hand-rolled tokenizer — we do not
// want Prism's CSS to fight our palette. Keywords/strings/comments are the
// only categories. That's enough for a designed feel without overreach.

// ── Tiny syntax tokenizer ─────────────────────────────────────────────
const TOKEN_RULES = {
  ts: [
    [/(\/\/[^\n]*|\/\*[\s\S]*?\*\/)/g, 'comment'],
    [/(['"`])(?:\\.|(?!\1).)*\1/g, 'string'],
    [/\b(import|export|from|const|let|var|function|return|if|else|for|while|async|await|class|interface|type|extends|implements|new|this|typeof|as|null|undefined|true|false)\b/g, 'keyword'],
    [/\b([A-Z][A-Za-z0-9]*)\b/g, 'type'],
    [/\b(\d+(?:\.\d+)?)\b/g, 'number'],
  ],
  py: [
    [/(#[^\n]*)/g, 'comment'],
    [/(['"])(?:\\.|(?!\1).)*\1/g, 'string'],
    [/\b(def|class|import|from|return|if|elif|else|for|while|in|is|not|and|or|lambda|with|as|try|except|raise|yield|None|True|False|self)\b/g, 'keyword'],
    [/\b(\d+(?:\.\d+)?)\b/g, 'number'],
  ],
  sh: [
    [/(#[^\n]*)/g, 'comment'],
    [/(['"])(?:\\.|(?!\1).)*\1/g, 'string'],
    [/\$[A-Za-z_][A-Za-z0-9_]*/g, 'type'],
    [/^(\s*)(sudo|cd|npm|pnpm|yarn|git|curl|cat|echo|mkdir|rm|mv|cp|ls|grep|awk|sed|chmod|chown|docker|kubectl)\b/gm, 'keyword'],
    [/\s(--?[a-z-]+)/g, 'type'],
  ],
};

function tokenize(src, lang) {
  const rules = TOKEN_RULES[lang] || [];
  const marks = [];
  for (const [re, kind] of rules) {
    // fresh regex per scan
    const r = new RegExp(re.source, re.flags);
    let m;
    while ((m = r.exec(src))) {
      const start = m.index + (m[0].length - m[0].trimStart().length - (m[0].length - m[0].trimStart().length));
      marks.push({ start: m.index, end: m.index + m[0].length, kind });
    }
  }
  // sort, resolve overlaps (first-wins)
  marks.sort((a, b) => a.start - b.start || b.end - a.end);
  const resolved = [];
  let cursor = 0;
  for (const mk of marks) {
    if (mk.start < cursor) continue;
    resolved.push(mk);
    cursor = mk.end;
  }
  // build parts
  const parts = [];
  let i = 0;
  for (const mk of resolved) {
    if (mk.start > i) parts.push({ text: src.slice(i, mk.start), kind: null });
    parts.push({ text: src.slice(mk.start, mk.end), kind: mk.kind });
    i = mk.end;
  }
  if (i < src.length) parts.push({ text: src.slice(i), kind: null });
  return parts;
}

// ── CodePlate ────────────────────────────────────────────────────────
function CodePlate({ lang = 'ts', caption, filename, children, highlight = [], startLine = 1, note }) {
  const src = (typeof children === 'string' ? children : String(children)).replace(/\n$/, '');
  const lines = src.split('\n');
  const [copied, setCopied] = React.useState(false);

  const tokenColor = {
    keyword: 'var(--accent)',
    string:  'var(--accent-soft, var(--accent))',
    comment: 'var(--muted)',
    number:  'var(--ink)',
    type:    'var(--accent)',
  };

  const copy = () => {
    navigator.clipboard && navigator.clipboard.writeText(src);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <figure style={{ margin: '1.8em 0', fontFamily: 'inherit' }}>
      {/* Plate frame */}
      <div style={{
        background: 'var(--paper2)',
        border: '1px solid var(--rule)',
        borderLeft: '2px solid var(--accent)',
        position: 'relative',
      }}>
        {/* filename bar */}
        {filename && (
          <div style={{ borderBottom: '1px solid var(--rule)',
            padding: '7px 14px', display: 'flex', justifyContent: 'space-between',
            alignItems: 'center',
            fontFamily: '"IBM Plex Mono", monospace', fontSize: 11,
            color: 'var(--muted)', letterSpacing: 0.2 }}>
            <span>{filename}</span>
            <button onClick={copy}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer',
                fontFamily: 'var(--serif)', fontVariant: 'small-caps',
                letterSpacing: '0.2em', fontSize: 10, color: 'var(--muted)' }}>
              {copied ? 'copied' : 'copy'}
            </button>
          </div>
        )}

        {/* Code body */}
        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr',
          fontFamily: '"IBM Plex Mono", monospace', fontSize: 13.5,
          lineHeight: 1.65, overflow: 'auto' }}>
          {/* gutter */}
          <div style={{ padding: '14px 10px 14px 14px', textAlign: 'right',
            borderRight: '1px solid var(--rule)', color: 'var(--muted)',
            userSelect: 'none', fontVariantNumeric: 'tabular-nums' }}>
            {lines.map((_, i) => (
              <div key={i} style={{ opacity: 0.7 }}>{startLine + i}</div>
            ))}
          </div>
          {/* code */}
          <div style={{ padding: '14px 16px', color: 'var(--ink)', whiteSpace: 'pre',
            minWidth: 0 }}>
            {lines.map((ln, i) => {
              const isHL = highlight.includes(startLine + i);
              const parts = tokenize(ln, lang);
              return (
                <div key={i} style={{
                  background: isHL ? 'color-mix(in oklab, var(--accent) 14%, transparent)' : 'transparent',
                  marginLeft: isHL ? -16 : 0, paddingLeft: isHL ? 16 : 0,
                  marginRight: isHL ? -16 : 0, paddingRight: isHL ? 16 : 0,
                  borderLeft: isHL ? '2px solid var(--accent)' : '2px solid transparent',
                  paddingLeft: isHL ? 14 : 0,
                }}>
                  {parts.length === 0 ? '\u200b' : parts.map((p, j) => (
                    <span key={j} style={{ color: p.kind ? tokenColor[p.kind] : 'var(--ink)',
                      fontStyle: p.kind === 'comment' ? 'italic' : 'normal' }}>{p.text}</span>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Caption */}
      {(caption || note) && (
        <figcaption style={{ marginTop: 10, display: 'flex',
          justifyContent: 'space-between', alignItems: 'baseline',
          gap: 20, borderTop: '1px solid var(--rule)', paddingTop: 8 }}>
          <div style={{ fontFamily: 'var(--serif)', fontSize: 13,
            fontStyle: 'italic', color: 'var(--ink)', flex: 1 }}>
            {caption}
          </div>
          {note && (
            <div style={{ fontFamily: 'var(--serif)', fontVariant: 'small-caps',
              letterSpacing: '0.22em', fontSize: 10, color: 'var(--muted)' }}>
              {note}
            </div>
          )}
        </figcaption>
      )}
    </figure>
  );
}

// ── Terminal ────────────────────────────────────────────────────────
function Terminal({ children, host = 'max@pendulum', cwd = '~/blog' }) {
  const lines = String(children).replace(/\n$/, '').split('\n');
  return (
    <div style={{ margin: '1.6em 0', background: '#0c0f14',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 3, padding: '16px 18px',
      fontFamily: '"IBM Plex Mono", monospace', fontSize: 13,
      lineHeight: 1.65, color: '#d5d9e0', overflow: 'auto' }}>
      {lines.map((ln, i) => {
        const isCmd = ln.startsWith('$ ');
        const isComment = ln.startsWith('# ');
        return (
          <div key={i} style={{ color: isComment ? '#6b7280' : (isCmd ? '#e8ebf0' : '#9aa3b1'),
            fontStyle: isComment ? 'italic' : 'normal', whiteSpace: 'pre' }}>
            {isCmd && (
              <span style={{ color: '#7fa9d8', marginRight: 8, userSelect: 'none' }}>
                <span style={{ color: '#6b7280' }}>{host}</span>
                <span style={{ color: '#4b5563' }}>:</span>
                <span style={{ color: '#9aa3b1' }}>{cwd}</span>
                <span style={{ color: '#e0a46a' }}>$</span>
              </span>
            )}
            {isCmd ? ln.slice(2) : ln || '\u200b'}
          </div>
        );
      })}
    </div>
  );
}

// ── DiagramPlate ────────────────────────────────────────────────────
function DiagramPlate({ caption, note, children, tall }) {
  return (
    <figure style={{ margin: '2em 0' }}>
      <div style={{ background: 'var(--paper2)', border: '1px solid var(--rule)',
        padding: '32px 24px', display: 'flex', justifyContent: 'center',
        alignItems: 'center', minHeight: tall ? 380 : 240, overflow: 'auto' }}>
        {children}
      </div>
      {(caption || note) && (
        <figcaption style={{ marginTop: 10, display: 'flex',
          justifyContent: 'space-between', alignItems: 'baseline',
          gap: 20, borderTop: '1px solid var(--rule)', paddingTop: 8 }}>
          <div style={{ fontFamily: 'var(--serif)', fontSize: 13,
            fontStyle: 'italic', color: 'var(--ink)', flex: 1 }}>{caption}</div>
          {note && (
            <div style={{ fontFamily: 'var(--serif)', fontVariant: 'small-caps',
              letterSpacing: '0.22em', fontSize: 10, color: 'var(--muted)' }}>
              {note}
            </div>
          )}
        </figcaption>
      )}
    </figure>
  );
}

// ── Callout ─────────────────────────────────────────────────────────
function Callout({ kind = 'note', title, children }) {
  const glyphs = { note: '§', warn: '⚠', info: 'i', caveat: '✎' };
  return (
    <aside style={{ margin: '1.6em 0', padding: '14px 18px 14px 16px',
      background: 'transparent', borderLeft: '2px solid var(--accent)',
      fontFamily: 'var(--serif)', fontSize: 15, lineHeight: 1.6,
      color: 'var(--ink)' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 6 }}>
        <span style={{ fontVariant: 'small-caps', letterSpacing: '0.22em',
          fontSize: 10, color: 'var(--accent)' }}>
          {glyphs[kind]} &nbsp; {kind}
        </span>
        {title && <span style={{ fontStyle: 'italic', color: 'var(--muted)', fontSize: 13 }}>
          — {title}</span>}
      </div>
      <div>{children}</div>
    </aside>
  );
}

// ── Inline code ─────────────────────────────────────────────────────
function InlineCode({ children }) {
  return (
    <code style={{ fontFamily: '"IBM Plex Mono", monospace',
      fontSize: '0.86em',
      background: 'color-mix(in oklab, var(--accent) 10%, transparent)',
      padding: '1px 5px', borderRadius: 2, color: 'var(--ink)',
      whiteSpace: 'nowrap' }}>{children}</code>
  );
}

// ── Mermaid wrapper ─────────────────────────────────────────────────
function Mermaid({ chart, id }) {
  const ref = React.useRef(null);
  const [svg, setSvg] = React.useState(null);

  React.useEffect(() => {
    if (!window.mermaid) return;
    const theme = getComputedStyle(document.documentElement);
    try {
      window.mermaid.render(id || ('m' + Math.random().toString(36).slice(2)), chart)
        .then(({ svg }) => setSvg(svg))
        .catch(() => setSvg(null));
    } catch (_) {}
  }, [chart, id]);

  if (!svg) return (
    <div style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 12,
      color: 'var(--muted)' }}>rendering diagram…</div>
  );
  return <div ref={ref} style={{ width: '100%' }} dangerouslySetInnerHTML={{ __html: svg }} />;
}

Object.assign(window, {
  CodePlate, Terminal, DiagramPlate, Callout, InlineCode, Mermaid,
});
