// Engagement.jsx — a quiet listening surface.
//
// Two primitives for readers:
//   1. SelectionReact — select any passage in the article → floating reaction
//      bar appears. Reactions are sent privately to the author, not shown to
//      other readers. Leaves a thin warm underline behind so the reader sees
//      their own trail.
//   2. ReflectionPrompt — end-of-article open question. Single textarea,
//      private, no submit affirmation beyond a quiet line of thanks.
//
// One primitive for the author:
//   3. ReaderSignalsDashboard — shows what a reader never sees: which passages
//      were highlighted most, the mix of reactions, recent private reflections,
//      a retention line (% who reached each section).

const { useState, useEffect, useRef } = React;

// ── Selection-to-react popover ───────────────────────────────────────
function SelectionReact({ scopeRef, onReact }) {
  const [pos, setPos] = useState(null); // {x, y, text}
  const popRef = useRef(null);

  useEffect(() => {
    const scope = scopeRef.current; if (!scope) return;

    const onUp = () => {
      setTimeout(() => {
        const sel = window.getSelection();
        if (!sel || sel.isCollapsed) return setPos(null);
        const text = sel.toString().trim();
        if (text.length < 4) return setPos(null);
        const range = sel.getRangeAt(0);
        // must be inside scope
        if (!scope.contains(range.commonAncestorContainer)) return setPos(null);
        const rect = range.getBoundingClientRect();
        const scopeRect = scope.getBoundingClientRect();
        setPos({
          x: rect.left + rect.width / 2 - scopeRect.left,
          y: rect.top - scopeRect.top - 8,
          text,
          range: range.cloneRange(),
        });
      }, 0);
    };

    const onDown = (e) => {
      if (popRef.current && popRef.current.contains(e.target)) return;
      setPos(null);
    };

    scope.addEventListener('mouseup', onUp);
    scope.addEventListener('touchend', onUp);
    document.addEventListener('mousedown', onDown);
    return () => {
      scope.removeEventListener('mouseup', onUp);
      scope.removeEventListener('touchend', onUp);
      document.removeEventListener('mousedown', onDown);
    };
  }, [scopeRef]);

  if (!pos) return null;

  const react = (kind) => {
    // wrap the selected range in a marker span so the reader sees their trail
    try {
      const mark = document.createElement('span');
      mark.style.borderBottom = '1.5px solid var(--accent)';
      mark.style.paddingBottom = '1px';
      mark.dataset.reaction = kind;
      pos.range.surroundContents(mark);
    } catch (_) { /* cross-node ranges fail; fine */ }
    window.getSelection().removeAllRanges();
    onReact && onReact(kind, pos.text);
    setPos(null);
  };

  const Btn = ({ kind, label, children }) => (
    <button onClick={() => react(kind)} title={label}
      onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.color = 'var(--paper)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--paper)'; }}
      style={{ background: 'transparent', border: 'none', color: 'var(--paper)',
        fontFamily: 'var(--serif)', fontSize: 13, fontStyle: 'italic',
        padding: '7px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center',
        gap: 6, borderRight: '1px solid rgba(255,255,255,0.12)' }}>
      <span style={{ fontStyle: 'normal', fontSize: 13 }}>{children}</span>
      <span>{label}</span>
    </button>
  );

  return (
    <div ref={popRef} style={{
      position: 'absolute', left: pos.x, top: pos.y,
      transform: 'translate(-50%, -100%)',
      background: 'var(--ink)', color: 'var(--paper)',
      display: 'flex', alignItems: 'stretch',
      boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
      zIndex: 50, borderRadius: 2, whiteSpace: 'nowrap',
      fontFamily: 'var(--serif)',
    }}>
      <Btn kind="resonant" label="resonates">❤</Btn>
      <Btn kind="thinking" label="made me think">✦</Btn>
      <Btn kind="confused" label="lost me here">?</Btn>
      <button onClick={() => react('note')}
        style={{ background: 'transparent', border: 'none', color: 'var(--paper)',
          fontFamily: 'var(--serif)', fontSize: 13, fontStyle: 'italic',
          padding: '7px 14px', cursor: 'pointer' }}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--accent)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}>
        note to author
      </button>
      {/* caret */}
      <div style={{ position: 'absolute', left: '50%', top: '100%', transform: 'translateX(-50%)',
        width: 0, height: 0, borderLeft: '6px solid transparent', borderRight: '6px solid transparent',
        borderTop: '6px solid var(--ink)' }} />
    </div>
  );
}

// ── End-of-article reflection prompt ─────────────────────────────────
function ReflectionPrompt() {
  const [text, setText] = useState('');
  const [sent, setSent] = useState(false);

  const prompts = [
    'What did this change your mind about — if anything?',
    'Was there a sentence you read twice?',
    'What would you have asked the author?',
  ];
  const [promptIdx] = useState(() => Math.floor(Math.random() * prompts.length));

  if (sent) {
    return (
      <div style={{ margin: '3.5em 0 0', padding: '2em 0', textAlign: 'center',
        borderTop: '1px solid var(--rule)', borderBottom: '1px solid var(--rule)',
        fontFamily: 'var(--serif)', fontStyle: 'italic', color: 'var(--muted)', fontSize: 15 }}>
        Received. Only the author will read this. — Thank you for reading so carefully.
      </div>
    );
  }

  return (
    <div style={{ margin: '3.5em 0 0', padding: '2.4em 0 2em',
      borderTop: '1px solid var(--rule)', borderBottom: '1px solid var(--rule)' }}>
      <div style={{ textAlign: 'center', marginBottom: 18 }}>
        <div style={{ fontFamily: 'var(--serif)', fontVariant: 'small-caps',
          letterSpacing: '0.3em', fontSize: 11, color: 'var(--muted)', marginBottom: 14 }}>
          A private question from the author
        </div>
        <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: '1.3em',
          lineHeight: 1.35, color: 'var(--ink)', maxWidth: '28ch',
          margin: '0 auto', letterSpacing: '-0.005em' }}>
          {prompts[promptIdx]}
        </div>
      </div>
      <textarea value={text} onChange={(e) => setText(e.target.value)}
        placeholder="Write a sentence, or a paragraph. No one else will see this."
        rows={4}
        style={{ width: '100%', background: 'transparent',
          border: 'none', borderBottom: '1px solid var(--rule)',
          fontFamily: 'var(--serif)', fontSize: 16, lineHeight: 1.6, color: 'var(--ink)',
          padding: '8px 0', resize: 'none', outline: 'none', boxSizing: 'border-box' }}
        onFocus={(e) => (e.currentTarget.style.borderBottomColor = 'var(--accent)')}
        onBlur={(e) => (e.currentTarget.style.borderBottomColor = 'var(--rule)')} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginTop: 16, fontFamily: 'var(--serif)', fontSize: 12, color: 'var(--muted)' }}>
        <span style={{ fontStyle: 'italic' }}>Private. Optional. No reply expected.</span>
        <button onClick={() => text.trim() && setSent(true)}
          disabled={!text.trim()}
          style={{ background: 'transparent', border: 'none',
            color: text.trim() ? 'var(--accent)' : 'var(--muted)',
            fontFamily: 'var(--serif)', fontSize: 13, fontStyle: 'italic',
            cursor: text.trim() ? 'pointer' : 'default', padding: 0,
            borderBottom: text.trim() ? '1px solid var(--accent)' : '1px solid transparent' }}>
          send to author →
        </button>
      </div>
    </div>
  );
}

window.SelectionReact = SelectionReact;
window.ReflectionPrompt = ReflectionPrompt;
