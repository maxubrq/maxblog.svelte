// ReadingExtras.jsx — end-of-article surfaces that carry the reader forward.
//
// Exports (window globals):
//   RememberCard    — author-picked thesis sentence, typeset as a keepsake
//   Neighborhood    — 2–3 hand-written post recommendations from the author
//
// Both are designed to sit *after* the end mark (■) and the ReflectionPrompt,
// inside the same book grid. The order is deliberate:
//   1. end mark — the article is done
//   2. remember card — here is the one thing to hold
//   3. reflection prompt — what are you carrying?
//   4. neighborhood — where would you like to go next?
// This sequence treats the reader like a guest being walked to the door.

// ── One sentence to remember ─────────────────────────────────────────
function RememberCard({ sentence, attribution }) {
  const [copied, setCopied] = React.useState(false);
  const [saved, setSaved] = React.useState(false);

  const copy = () => {
    const line = `"${sentence}"${attribution ? '\n— ' + attribution : ''}`;
    navigator.clipboard && navigator.clipboard.writeText(line);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const save = () => {
    setSaved((s) => !s);
    // production: persist to reader's personal library
  };

  return (
    <figure style={{ margin: '3.4em 0 0', padding: '0' }}>
      <div style={{ fontFamily: 'var(--serif)', fontVariant: 'small-caps',
        letterSpacing: '0.3em', fontSize: 10.5, color: 'var(--muted)',
        textAlign: 'center', marginBottom: 22 }}>
        One sentence to remember
      </div>

      {/* The card — designed to look like a typeset keepsake */}
      <div style={{ position: 'relative',
        background: 'var(--paper2)',
        border: '1px solid var(--rule)',
        padding: '48px 56px 42px',
        textAlign: 'center' }}>

        {/* Corner ornaments — very subtle */}
        {['tl','tr','bl','br'].map((c) => (
          <span key={c} style={{ position: 'absolute',
            top:    (c[0] === 't') ? 10 : 'auto',
            bottom: (c[0] === 'b') ? 10 : 'auto',
            left:   (c[1] === 'l') ? 10 : 'auto',
            right:  (c[1] === 'r') ? 10 : 'auto',
            width: 14, height: 14,
            borderTop:    (c[0] === 't') ? '1px solid var(--rule)' : 'none',
            borderBottom: (c[0] === 'b') ? '1px solid var(--rule)' : 'none',
            borderLeft:   (c[1] === 'l') ? '1px solid var(--rule)' : 'none',
            borderRight:  (c[1] === 'r') ? '1px solid var(--rule)' : 'none',
          }} />
        ))}

        {/* Drop quote */}
        <span style={{ position: 'absolute', left: 18, top: 6,
          fontFamily: 'var(--serif)', fontSize: 72, lineHeight: 1,
          color: 'var(--accent)', opacity: 0.18, fontStyle: 'normal',
          userSelect: 'none' }}>“</span>

        <blockquote style={{ margin: 0, padding: 0,
          fontFamily: 'var(--serif)', fontStyle: 'italic',
          fontSize: 'clamp(20px, 2.3vw, 26px)',
          lineHeight: 1.35,
          color: 'var(--ink)',
          maxWidth: '26ch', margin: '0 auto',
          letterSpacing: '-0.005em',
          fontVariantNumeric: 'oldstyle-nums' }}>
          {sentence}
        </blockquote>

        <div style={{ margin: '20px auto 0', width: 36, height: 1,
          background: 'var(--rule)' }} />

        {attribution && (
          <div style={{ marginTop: 14, fontFamily: 'var(--serif)',
            fontVariant: 'small-caps', letterSpacing: '0.25em',
            fontSize: 10.5, color: 'var(--muted)' }}>
            {attribution}
          </div>
        )}
      </div>

      {/* Caption row — actions in small-caps, no buttons-that-look-like-buttons */}
      <figcaption style={{ marginTop: 12, display: 'flex',
        justifyContent: 'space-between', alignItems: 'baseline',
        fontFamily: 'var(--serif)', fontSize: 12, color: 'var(--muted)' }}>
        <span style={{ fontStyle: 'italic' }}>
          the author&rsquo;s choice &middot; not an algorithm
        </span>
        <div style={{ display: 'flex', gap: 22 }}>
          <button onClick={save}
            style={{ background: 'transparent', border: 'none',
              padding: 0, cursor: 'pointer',
              fontFamily: 'var(--serif)', fontVariant: 'small-caps',
              letterSpacing: '0.22em', fontSize: 10.5,
              color: saved ? 'var(--accent)' : 'var(--muted)',
              borderBottom: saved ? '1px solid var(--accent)' : '1px solid transparent' }}>
            {saved ? 'saved to your shelf' : 'save to shelf'}
          </button>
          <button onClick={copy}
            style={{ background: 'transparent', border: 'none',
              padding: 0, cursor: 'pointer',
              fontFamily: 'var(--serif)', fontVariant: 'small-caps',
              letterSpacing: '0.22em', fontSize: 10.5,
              color: copied ? 'var(--accent)' : 'var(--muted)' }}>
            {copied ? 'copied' : 'copy'}
          </button>
          <button style={{ background: 'transparent', border: 'none',
              padding: 0, cursor: 'pointer',
              fontFamily: 'var(--serif)', fontVariant: 'small-caps',
              letterSpacing: '0.22em', fontSize: 10.5,
              color: 'var(--muted)' }}>
            download as image
          </button>
        </div>
      </figcaption>
    </figure>
  );
}

// ── In this neighborhood ─────────────────────────────────────────────
// Author-written recommendations. Each item has: post, reason (italic),
// relation (e.g. "argues the opposite", "companion piece", "the prequel").
// Reason is a short sentence FROM THE AUTHOR, not an excerpt.

function Neighborhood({ items }) {
  return (
    <section style={{ margin: '3.8em 0 0' }}>
      <div style={{ display: 'flex', alignItems: 'baseline',
        justifyContent: 'space-between', marginBottom: 22,
        paddingBottom: 10, borderBottom: '1px solid var(--rule)' }}>
        <h3 style={{ margin: 0, fontFamily: 'var(--serif)',
          fontVariant: 'small-caps', letterSpacing: '0.28em',
          fontSize: 11, color: 'var(--muted)', fontWeight: 400 }}>
          In this neighborhood
        </h3>
        <span style={{ fontFamily: 'var(--serif)', fontStyle: 'italic',
          fontSize: 12, color: 'var(--muted)' }}>
          hand-picked by the author
        </span>
      </div>

      <div style={{ display: 'grid', gap: 0 }}>
        {items.map((it, i) => (
          <a key={it.id} href={`#${it.id}`}
            style={{ display: 'grid',
              gridTemplateColumns: '60px 1fr auto',
              gap: 24, alignItems: 'baseline',
              padding: '20px 0',
              borderBottom: i < items.length - 1 ? '1px solid var(--rule)' : 'none',
              textDecoration: 'none', color: 'inherit',
              transition: 'background 0.15s' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--paper2)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}>

            {/* Relation chip */}
            <div style={{ fontFamily: 'var(--serif)',
              fontVariant: 'small-caps', letterSpacing: '0.18em',
              fontSize: 9.5, color: 'var(--accent)',
              paddingTop: 6, lineHeight: 1.3 }}>
              {it.relation}
            </div>

            {/* Body */}
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline',
                gap: 12, marginBottom: 6 }}>
                <span style={{ fontFamily: 'var(--serif)',
                  fontSize: 20, color: 'var(--ink)',
                  letterSpacing: '-0.005em', fontWeight: 500 }}>
                  {it.title}
                </span>
                <span style={{ fontFamily: 'var(--serif)',
                  fontVariant: 'small-caps', letterSpacing: '0.2em',
                  fontSize: 10, color: 'var(--muted)' }}>
                  {it.topic} &middot; {it.min} min
                </span>
              </div>
              <p style={{ margin: 0, fontFamily: 'var(--serif)',
                fontStyle: 'italic', fontSize: 15,
                lineHeight: 1.55, color: 'var(--muted)',
                maxWidth: '56ch' }}>
                &ldquo;{it.reason}&rdquo;
              </p>
            </div>

            {/* Arrow */}
            <span style={{ fontFamily: 'var(--serif)',
              fontSize: 20, color: 'var(--accent)',
              alignSelf: 'center' }}>→</span>
          </a>
        ))}
      </div>

      <div style={{ marginTop: 18, fontFamily: 'var(--serif)',
        fontSize: 12, fontStyle: 'italic', color: 'var(--muted)',
        textAlign: 'center' }}>
        If you&rsquo;d rather wander, the <a href="#archive"
          style={{ color: 'var(--accent)', borderBottom: '1px solid var(--accent)',
            textDecoration: 'none' }}>full archive</a> is here.
      </div>
    </section>
  );
}

Object.assign(window, { RememberCard, Neighborhood });
