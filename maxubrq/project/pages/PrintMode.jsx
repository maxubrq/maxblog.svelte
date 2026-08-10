// PrintMode.jsx — "Editorial Printable" reading mode.
//
// A third reading mode (Study / Flow / Print). Unlike PrintPreview.jsx (a
// book-spread *simulation*), this is the real printable surface: content is
// re-composed onto discrete paper-sized SHEETS (A4 / Letter), laid out like a
// printed editorial — masthead, multi-column body, spanning figures & pull-
// quotes, running head + folio — so each sheet prints 1:1 onto real paper.
// Theme/palette is preserved (the sheet uses the page's own --paper/--ink).
//
// Exports: ModeSwitcher, PrintDeck, and editorial blocks:
//   EdMasthead, EdSectionHead, EdColumns, EdFigure, EdPullquote, EdLede,
//   EdNotes, EdFleuron, EdEquation

(function () {
  let injected = false;
  window.__pmInjectPrintCSS = function () {
    if (injected) return; injected = true;
    const s = document.createElement('style');
    s.id = 'pm-global-print-css';
    s.textContent = `
@media print {
  .pm-noprint { display: none !important; }
  .pm-desk { background: #fff !important; padding: 0 !important; overflow: visible !important;
    height: auto !important; display: block !important; }
  .pm-root { background: #fff !important; height: auto !important; overflow: visible !important; }
  .pm-sheet { box-shadow: none !important; margin: 0 !important; width: auto !important;
    height: auto !important; min-height: 0 !important; break-after: page; page-break-after: always; }
  .pm-sheet:last-child { break-after: auto; page-break-after: auto; }
  .pm-avoid-break { break-inside: avoid; }
  * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
}`;
    document.head.appendChild(s);
  };
  window.__pmSetPageSize = function (paper) {
    let t = document.getElementById('pm-page-size-css');
    if (!t) { t = document.createElement('style'); t.id = 'pm-page-size-css'; document.head.appendChild(t); }
    const size = paper === 'letter' ? 'letter' : 'A4';
    const margin = paper === 'letter' ? '0.85in' : '18mm';
    t.textContent = `@page { size: ${size}; margin: ${margin}; }`;
  };
})();

// Paper dimensions at 96dpi (inside-margin content box handled by padding).
const PM_PAPER = {
  a4:     { w: 794, h: 1123 },
  letter: { w: 816, h: 1056 },
};

// ── Mode switcher — Study / Flow / Print ─────────────────────────────
function ModeSwitcher({ mode, onChange, serif }) {
  const Pill = ({ id, label }) => (
    <button onClick={() => onChange(id)} style={{
      border: '1px solid var(--rule)', background: mode === id ? 'var(--ink)' : 'transparent',
      color: mode === id ? 'var(--paper)' : 'var(--muted)',
      fontFamily: serif, fontVariant: 'small-caps', letterSpacing: '0.16em',
      fontSize: 10.5, padding: '6px 13px', cursor: 'pointer', borderRadius: 2 }}>{label}</button>
  );
  return (
    <div style={{ position: 'absolute', top: 18, right: 56, zIndex: 20, display: 'flex', gap: 6 }}>
      <Pill id="study" label="Study" />
      <Pill id="flow" label="Flow" />
      <Pill id="print" label="Print" />
    </div>
  );
}

// ── Editorial blocks ─────────────────────────────────────────────────
function EdMasthead({ kicker, title, subtitle, byline, meta }) {
  return (
    <header style={{ textAlign: 'center', paddingBottom: 22, marginBottom: 24,
      borderBottom: '2px solid var(--ink)' }}>
      {kicker && <div style={{ fontVariant: 'small-caps', letterSpacing: '0.34em',
        fontSize: 10, color: 'var(--muted)', marginBottom: 16 }}>{kicker}</div>}
      <h1 style={{ fontFamily: 'var(--serif)', fontWeight: 500, fontSize: 40, lineHeight: 1.06,
        letterSpacing: '-0.015em', margin: '0 0 12px' }}>{title}</h1>
      {subtitle && <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic',
        fontSize: 17, color: 'var(--muted)', margin: '0 auto 14px', maxWidth: '34ch' }}>{subtitle}</div>}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 18, flexWrap: 'wrap',
        fontVariant: 'small-caps', letterSpacing: '0.18em', fontSize: 10, color: 'var(--muted)' }}>
        {byline && <span>{byline}</span>}
        {(meta || []).map((m, i) => <span key={i} style={{ display: 'flex', gap: 18 }}><span style={{ color: 'var(--rule)' }}>·</span>{m}</span>)}
      </div>
    </header>
  );
}

function EdSectionHead({ num, children }) {
  return (
    <h2 style={{ fontFamily: 'var(--serif)', fontWeight: 500, fontSize: 16, margin: '0 0 0.5em',
      color: 'var(--ink)', letterSpacing: '-0.005em',
      breakInside: 'avoid', WebkitColumnBreakInside: 'avoid' }}>
      {num && <span style={{ fontVariant: 'small-caps', letterSpacing: '0.16em',
        color: 'var(--accent)', fontSize: 11, marginRight: 8 }}>{num}</span>}
      <span style={{ fontStyle: 'italic' }}>{children}</span>
    </h2>
  );
}

function EdLede({ dropcap, children }) {
  return (
    <p style={{ margin: '0 0 0.9em' }}>
      {dropcap && <span style={{ float: 'left', fontFamily: 'var(--serif)', fontWeight: 500,
        fontSize: '3.1em', lineHeight: 0.82, paddingRight: '0.09em', paddingTop: '0.02em',
        color: 'var(--ink)' }}>{dropcap}</span>}
      {children}
    </p>
  );
}

// Two-column editorial body via CSS grid (deterministic — no multicol
// fragmentation). Children are split by count into balanced columns.
function EdColumns({ children, count = 2, gap = 30 }) {
  const kids = React.Children.toArray(children).filter(Boolean);
  let groups;
  if (count === 2) {
    const mid = Math.ceil(kids.length / 2);
    groups = [kids.slice(0, mid), kids.slice(mid)];
  } else groups = [kids];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${count}, 1fr)`, columnGap: gap,
      textAlign: 'justify', hyphens: 'auto', WebkitHyphens: 'auto', alignItems: 'start' }}>
      {groups.map((g, i) => (
        <div key={i} style={{ position: 'relative',
          borderLeft: i > 0 ? '1px solid var(--rule)' : 'none',
          paddingLeft: i > 0 ? gap / 2 : 0 }}>{g}</div>
      ))}
    </div>
  );
}

function EdFigure({ label, caption, height = 190 }) {
  return (
    <figure className="pm-avoid-break" style={{ margin: '0 0 1.1em', breakInside: 'avoid' }}>
      <div style={{ border: '1px solid var(--ink)', height,
        background: 'repeating-linear-gradient(135deg, var(--paper2), var(--paper2) 7px, var(--paper) 7px, var(--paper) 14px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 10.5, color: 'var(--muted)',
          background: 'var(--paper)', padding: '4px 10px', border: '1px solid var(--rule)' }}>{label}</span>
      </div>
      {caption && <figcaption style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 11.5,
        color: 'var(--muted)', marginTop: 7, lineHeight: 1.45 }}>{caption}</figcaption>}
    </figure>
  );
}

function EdPullquote({ children }) {
  return (
    <blockquote className="pm-avoid-break" style={{ margin: '0.2em auto 1.1em', padding: '16px 0',
      maxWidth: '32ch', borderTop: '1px solid var(--rule)', borderBottom: '1px solid var(--rule)',
      fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 21, lineHeight: 1.3,
      textAlign: 'center', color: 'var(--ink)', letterSpacing: '-0.005em', breakInside: 'avoid' }}>
      {children}
    </blockquote>
  );
}

function EdEquation({ children }) {
  return <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', textAlign: 'center',
    fontSize: 16, margin: '0.4em 0 1em', color: 'var(--ink)',
    breakInside: 'avoid' }}>{children}</div>;
}

function EdCode({ filename, children }) {
  return (
    <figure className="pm-avoid-break" style={{ margin: '0 0 1em', breakInside: 'avoid' }}>
      {filename && <div style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 10,
        color: 'var(--muted)', marginBottom: 5 }}>{filename}</div>}
      <pre style={{ margin: 0, border: '1px solid var(--rule)', background: 'var(--paper2)',
        padding: '11px 14px', fontFamily: '"IBM Plex Mono", monospace', fontSize: 10.5,
        lineHeight: 1.5, color: 'var(--ink)', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{children}</pre>
    </figure>
  );
}

function EdFleuron() {
  return <div style={{ textAlign: 'center', margin: '0.4em 0 1em', color: 'var(--muted)',
    fontFamily: 'var(--serif)', fontSize: 14, letterSpacing: '0.6em' }}>❦</div>;
}

function EdNotes({ notes }) {
  if (!notes || !notes.length) return null;
  return (
    <section className="pm-avoid-break" style={{ marginTop: '0.6em', paddingTop: 14,
      borderTop: '1px solid var(--rule)' }}>
      <div style={{ fontFamily: 'var(--serif)', fontVariant: 'small-caps', letterSpacing: '0.26em',
        fontSize: 10, color: 'var(--muted)', marginBottom: 10 }}>Notes</div>
      <ol style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid',
        gridTemplateColumns: '1fr 1fr', columnGap: 30, rowGap: 7 }}>
        {notes.map((n) => (
          <li key={n.n} style={{ display: 'grid', gridTemplateColumns: '16px 1fr', gap: 7,
            breakInside: 'avoid',
            fontFamily: 'var(--serif)', fontSize: 10.5, lineHeight: 1.5, color: 'var(--muted)' }}>
            <span style={{ textAlign: 'right', fontStyle: 'italic', color: 'var(--accent)' }}>{n.n}.</span>
            <span>{n.text}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

// ── The print deck — sheets on a desk ────────────────────────────────
function PrintDeck({ theme, palette, serif, sans, title, mode, onModeChange, pages }) {
  const { useState, useEffect } = React;
  const [paper, setPaper] = useState('a4');
  const [showHead, setShowHead] = useState(true);
  const [showFolio, setShowFolio] = useState(true);

  useEffect(() => { window.__pmInjectPrintCSS(); }, []);
  useEffect(() => { window.__pmSetPageSize(paper); }, [paper]);

  const vars = (window.getPalette || (() => ({})))(palette, theme);
  const dim = PM_PAPER[paper];
  const total = pages.length;

  const Check = ({ v, on, label }) => (
    <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer',
      fontFamily: sans, fontSize: 11.5, color: 'var(--muted)' }}>
      <input type="checkbox" checked={v} onChange={(e) => on(e.target.checked)} /> {label}
    </label>
  );

  return (
    <div className="pm-root" style={{ ...vars, '--serif': serif, height: '100%', overflow: 'hidden',
      position: 'relative', background: 'var(--paper2)', fontFamily: serif }}>

      {/* Toolbar — screen only */}
      <div className="pm-noprint" style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10,
        padding: '13px 24px', display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap',
        background: 'var(--paper)', borderBottom: '1px solid var(--rule)' }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {['study', 'flow'].map((id) => (
            <button key={id} onClick={() => onModeChange(id)} style={{ border: '1px solid var(--rule)',
              background: 'transparent', color: 'var(--muted)', fontFamily: serif, fontVariant: 'small-caps',
              letterSpacing: '0.16em', fontSize: 10.5, padding: '6px 13px', cursor: 'pointer',
              borderRadius: 2, textTransform: 'capitalize' }}>{id}</button>
          ))}
          <button style={{ border: '1px solid var(--ink)', background: 'var(--ink)', color: 'var(--paper)',
            fontFamily: serif, fontVariant: 'small-caps', letterSpacing: '0.16em', fontSize: 10.5,
            padding: '6px 13px', borderRadius: 2 }}>Print</button>
        </div>
        <div style={{ width: 1, height: 18, background: 'var(--rule)' }} />
        <div style={{ display: 'flex', gap: 4, fontFamily: sans, fontSize: 11 }}>
          {['a4', 'letter'].map((p) => (
            <button key={p} onClick={() => setPaper(p)} style={{ border: '1px solid var(--rule)',
              background: paper === p ? 'var(--ink)' : 'transparent',
              color: paper === p ? 'var(--paper)' : 'var(--muted)', padding: '5px 10px', borderRadius: 2,
              cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{p}</button>
          ))}
        </div>
        <div style={{ width: 1, height: 18, background: 'var(--rule)' }} />
        <Check v={showHead} on={setShowHead} label="Running head" />
        <Check v={showFolio} on={setShowFolio} label="Folios" />
        <span style={{ fontFamily: sans, fontSize: 11, color: 'var(--muted)' }}>{total} pp.</span>
        <button onClick={() => window.print()} style={{ marginLeft: 'auto', border: 'none',
          background: 'var(--accent)', color: '#fff', fontFamily: sans, fontSize: 11.5, fontWeight: 500,
          letterSpacing: '0.04em', padding: '8px 16px', borderRadius: 2, cursor: 'pointer' }}>
          Print / Save as PDF
        </button>
      </div>

      {/* Desk — sheets stacked */}
      <div className="pm-desk" style={{ position: 'absolute', top: 50, left: 0, right: 0, bottom: 0,
        overflowY: 'auto', overflowX: 'auto', padding: '40px 0 70px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 34 }}>
        {pages.map((render, i) => (
          <div key={i} className="pm-sheet" style={{ width: dim.w, minHeight: dim.h, flex: '0 0 auto',
            background: 'var(--paper)', color: 'var(--ink)', boxShadow: '0 6px 34px rgba(0,0,0,0.22)',
            position: 'relative', overflow: 'visible',
            padding: paper === 'letter' ? '64px 68px' : '62px 64px', boxSizing: 'border-box' }}>

            {showHead && (
              <div style={{ position: 'absolute', top: 26, left: 0, right: 0,
                padding: paper === 'letter' ? '0 68px' : '0 64px',
                display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'baseline',
                fontFamily: serif, fontVariant: 'small-caps', letterSpacing: '0.2em', fontSize: 9,
                color: 'var(--muted)' }}>
                <span style={{ justifySelf: 'start' }}>maxubrq</span>
                <span style={{ justifySelf: 'center', fontVariant: 'normal', fontStyle: 'italic',
                  letterSpacing: 0, fontSize: 10 }}>{i === 0 ? '' : title}</span>
                <span style={{ justifySelf: 'end', fontVariant: 'normal', letterSpacing: 0,
                  fontVariantNumeric: 'oldstyle-nums', fontStyle: 'italic',
                  visibility: showFolio ? 'visible' : 'hidden' }}>{i + 1}</span>
              </div>
            )}

            <div style={{ fontSize: 12, lineHeight: 1.55,
              fontFeatureSettings: '"liga","onum","kern"' }}>
              {render}
            </div>
          </div>
        ))}
        <div className="pm-noprint" style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 10,
          color: 'var(--muted)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
          {paper.toUpperCase()} · {total} pages · prints as-is
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ModeSwitcher, PrintDeck, EdMasthead, EdSectionHead, EdLede,
  EdColumns, EdFigure, EdPullquote, EdEquation, EdCode, EdFleuron, EdNotes });
