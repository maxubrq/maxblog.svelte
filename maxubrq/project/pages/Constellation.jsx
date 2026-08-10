// Constellation.jsx — Plate XII. A chart of the reader's sky at maxubrq.
//
// Not a dataviz. A book plate — an 18th-c. astronomical chart in which
// the chart's shape exists because YOU have been here. Posts are stars
// in four constellations (Science / Philosophy / Art / Software). The
// reader's reading order is drawn as a single ember thread connecting
// the stars they have touched. Author-written citations are engraved
// as solid hairlines. Witness-quote kinship (passages marked by many
// readers across posts) is dotted.
//
// Visible only as a single artboard — a dedicated /constellation page.

const { useState: useStateCN, useMemo: useMemoCN } = React;

// ── Seed corpus ──────────────────────────────────────────────────────
// 32 posts (8 per topic). theta in degrees (SVG: 0°=E, 90°=S),
// r in [0..1] of chart radius. finished: true/false/half. read: nth in
// reader's order, or null. cites: ids of posts this one cites.
// witness: a tag — posts sharing a witness tag have a dotted kinship line.
const POSTS = [
  // SCIENCE — top quadrant (theta ~ 225°..315°)
  { id: 'pendulum',     t: 'sci', th: 270, r: 0.32, mag: 3.4, title: 'The horizon of a pendulum',           date: 'Apr 02, 2026', min: 9,  finished: true,  read: 1,  cites: [],                witness: 'horizon', mark: '“the long delicate motion of a system that knows what it is.”' },
  { id: 'proof',        t: 'sci', th: 250, r: 0.55, mag: 4.2, title: 'What a proof costs',                  date: 'Mar 11, 2026', min: 12, finished: true,  read: 4,  cites: ['pendulum'],      witness: null,      mark: '“proof is patience made formal.”' },
  { id: 'entropy',      t: 'sci', th: 290, r: 0.52, mag: 2.6, title: 'Entropy, explained to my daughter',   date: 'Feb 18, 2026', min: 6,  finished: true,  read: 7,  cites: ['pendulum'],      witness: 'horizon', mark: null },
  { id: 'probability',  t: 'sci', th: 235, r: 0.78, mag: 2.9, title: 'What a probability really is',        date: 'Dec 12, 2025', min: 8,  finished: 'half', read: null, cites: ['entropy'],   witness: null,      mark: null },
  { id: 'doublepend',   t: 'sci', th: 305, r: 0.78, mag: 2.4, title: 'Five hours with a double pendulum',   date: 'Nov 03, 2025', min: 4,  finished: false, read: null, cites: ['pendulum'],    witness: 'horizon', mark: null },
  { id: 'fourier',      t: 'sci', th: 263, r: 0.86, mag: 3.0, title: 'The friendliness of Fourier',         date: 'Oct 18, 2025', min: 11, finished: false, read: null, cites: [],              witness: null,      mark: null },
  { id: 'renorm',       t: 'sci', th: 245, r: 0.93, mag: 2.2, title: 'A travelogue of the renormalization group', date: 'Sep 04, 2025', min: 14, finished: false, read: null, cites: ['fourier'], witness: null, mark: null },
  { id: 'threebody',    t: 'sci', th: 282, r: 0.94, mag: 2.0, title: 'Why we say three-body',               date: 'Aug 12, 2025', min: 7,  finished: false, read: null, cites: ['pendulum', 'doublepend'], witness: null, mark: null },

  // PHILOSOPHY — right quadrant (theta ~ 315°..45°, i.e. -45°..+45°)
  { id: 'witness-essay', t: 'phi', th: 0,   r: 0.34, mag: 3.6, title: 'Reactions before reading',           date: 'May 06, 2026', min: 13, finished: true,  read: 2,  cites: ['pendulum'],      witness: 'witness', mark: '“the gate is what makes the room a room.”' },
  { id: 'fairwitness',  t: 'phi', th: 350, r: 0.55, mag: 3.0, title: 'On the fair witness',                 date: 'Apr 20, 2026', min: 7,  finished: true,  read: 5,  cites: ['witness-essay'], witness: 'witness', mark: null },
  { id: 'slow',         t: 'phi', th: 12,  r: 0.50, mag: 3.2, title: 'A slow inbox',                        date: 'Mar 28, 2026', min: 9,  finished: false, read: null, cites: [],              witness: null,      mark: null },
  { id: 'attention',    t: 'phi', th: 335, r: 0.74, mag: 2.6, title: 'The economy of attention is a lie',   date: 'Feb 09, 2026', min: 10, finished: 'half', read: null, cites: ['slow'],      witness: null,      mark: '“nobody charges admission to be bored.”' },
  { id: 'reading-room', t: 'phi', th: 25,  r: 0.72, mag: 2.8, title: 'A room of one\u2019s reading',        date: 'Jan 14, 2026', min: 6,  finished: true,  read: 9,  cites: ['slow'],          witness: 'witness', mark: null },
  { id: 'silence',      t: 'phi', th: 5,   r: 0.86, mag: 2.2, title: 'Silence is a kind of editor',         date: 'Nov 28, 2025', min: 4,  finished: false, read: null, cites: [],              witness: null,      mark: null },
  { id: 'doubt',        t: 'phi', th: 340, r: 0.93, mag: 2.0, title: 'In praise of doubt',                  date: 'Oct 04, 2025', min: 8,  finished: false, read: null, cites: ['fairwitness'], witness: null,      mark: null },
  { id: 'commonplace',  t: 'phi', th: 20,  r: 0.93, mag: 2.1, title: 'The commonplace book',                date: 'Aug 30, 2025', min: 5,  finished: false, read: null, cites: ['reading-room'],witness: null,      mark: null },

  // ART — bottom quadrant (theta ~ 45°..135°)
  { id: 'plate',        t: 'art', th: 90,  r: 0.36, mag: 3.2, title: 'On the printed plate',                date: 'Apr 28, 2026', min: 8,  finished: true,  read: 3,  cites: [],                witness: 'plate',  mark: '“the plate is honest because it cannot move.”' },
  { id: 'fleuron',      t: 'art', th: 70,  r: 0.58, mag: 2.4, title: 'The fleuron and the pause',           date: 'Mar 22, 2026', min: 4,  finished: true,  read: 8,  cites: ['plate'],         witness: null,     mark: null },
  { id: 'engraving',    t: 'art', th: 110, r: 0.56, mag: 3.0, title: 'How an engraving teaches restraint',  date: 'Feb 27, 2026', min: 9,  finished: 'half', read: null, cites: ['plate'],     witness: 'plate',  mark: null },
  { id: 'vermeer',      t: 'art', th: 60,  r: 0.78, mag: 2.6, title: 'Vermeer\u2019s window, and other small rooms', date: 'Jan 24, 2026', min: 11, finished: false, read: null, cites: [],     witness: null,     mark: null },
  { id: 'typography',   t: 'art', th: 120, r: 0.76, mag: 2.8, title: 'A walk through Vietnamese diacritics', date: 'Dec 30, 2025', min: 7,  finished: false, read: null, cites: ['fleuron'],   witness: null,     mark: null },
  { id: 'film-grain',   t: 'art', th: 85,  r: 0.90, mag: 2.0, title: 'Why film grain comforts us',          date: 'Nov 12, 2025', min: 5,  finished: false, read: null, cites: [],              witness: null,     mark: null },
  { id: 'colorcost',    t: 'art', th: 100, r: 0.94, mag: 2.0, title: 'The cost of color',                   date: 'Oct 02, 2025', min: 6,  finished: false, read: null, cites: ['engraving'],   witness: null,     mark: null },
  { id: 'noguchi',      t: 'art', th: 50,  r: 0.92, mag: 2.0, title: 'Noguchi, and the empty middle',       date: 'Sep 18, 2025', min: 5,  finished: false, read: null, cites: [],              witness: null,     mark: null },

  // SOFTWARE — left quadrant (theta ~ 135°..225°)
  { id: 'debounce',     t: 'sw',  th: 180, r: 0.32, mag: 3.5, title: 'Debounce, rebuilt',                   date: 'Apr 11, 2026', min: 11, finished: true,  read: 6,  cites: ['pendulum'],      witness: 'horizon', mark: '“a state machine without the drama.”' },
  { id: 'hash',         t: 'sw',  th: 160, r: 0.55, mag: 3.8, title: 'A hash table in a thousand lines',    date: 'Mar 02, 2026', min: 18, finished: 'half', read: null, cites: [],            witness: null,      mark: null },
  { id: 'sm',           t: 'sw',  th: 200, r: 0.55, mag: 2.8, title: 'State machines without the drama',    date: 'Feb 01, 2026', min: 9,  finished: false, read: null, cites: ['debounce'],    witness: null,      mark: null },
  { id: 'editor',       t: 'sw',  th: 145, r: 0.75, mag: 2.4, title: 'Why my editor opens in 40 ms',        date: 'Nov 22, 2025', min: 10, finished: false, read: null, cites: [],              witness: null,      mark: null },
  { id: 'calendar',     t: 'sw',  th: 215, r: 0.73, mag: 2.6, title: 'A calendar is not a database',        date: 'Jan 04, 2026', min: 7,  finished: false, read: null, cites: ['sm'],          witness: null,      mark: null },
  { id: 'smallmodel',   t: 'sw',  th: 170, r: 0.88, mag: 2.0, title: 'Small models, small problems',        date: 'Feb 01, 2026', min: 5,  finished: false, read: null, cites: [],              witness: null,      mark: null },
  { id: 'reconciler',   t: 'sw',  th: 192, r: 0.90, mag: 2.2, title: 'Rewriting the reconciler',            date: 'Dec 19, 2025', min: 16, finished: false, read: null, cites: ['sm'],          witness: null,      mark: null },
  { id: 'crdt',         t: 'sw',  th: 220, r: 0.92, mag: 2.0, title: 'CRDTs, slowly',                       date: 'Oct 21, 2025', min: 9,  finished: false, read: null, cites: [],              witness: null,      mark: null },
];

const TOPICS = {
  sci: { label: 'Sciences',   epigram: 'Small infinities. Quiet proofs.',           center: 270 },
  phi: { label: 'Philosophy', epigram: 'Slower questions. Older answers.',          center: 0   },
  art: { label: 'Arts',       epigram: 'The plate. The page. The pause.',           center: 90  },
  sw:  { label: 'Software',   epigram: 'Plainspoken engineering, rebuilt to know.', center: 180 },
};

// Concepts — abstract ideas that recur ACROSS posts. Not authored as points;
// each floats at the centroid of the posts that invoke it, and "assembles"
// (fills) as you finish those posts. Reading across the sky earns a concept.
// Concepts whose posts span two domains naturally sit between the quadrants.
const CONCEPTS = [
  { id: 'emergence',   label: 'Emergence',   posts: ['pendulum', 'doublepend', 'threebody', 'renorm'] },
  { id: 'iteration',   label: 'Iteration',   posts: ['debounce', 'sm', 'reconciler', 'crdt'] },
  { id: 'restraint',   label: 'Restraint',   posts: ['engraving', 'fleuron', 'noguchi', 'silence'] },
  { id: 'the-witness', label: 'The Witness', posts: ['witness-essay', 'fairwitness', 'reading-room', 'doubt'] },
  { id: 'attention',   label: 'Attention',   posts: ['attention', 'slow', 'silence', 'editor'] },
  { id: 'the-horizon', label: 'The Horizon', posts: ['pendulum', 'entropy', 'debounce'] },
];
window.CONCEPTS = CONCEPTS;

// Plate has its own ink/paper regardless of site theme, but accent comes
// from the active palette (so "your path" thread responds to tweaks).
function platePaper(theme) {
  // The chart is always printed on warm cream, like the article's "Plate I".
  // In dark mode we go to a richer dark-night paper.
  if (theme === 'dark') {
    return { paper: '#0e1322', ink: '#e6dfc8', muted: 'rgba(230,223,200,0.42)',
             hair: 'rgba(230,223,200,0.32)', mark: 'rgba(230,223,200,0.10)' };
  }
  return { paper: '#f1ead7', ink: '#0f1f3a', muted: 'rgba(15,31,58,0.55)',
           hair: 'rgba(15,31,58,0.35)', mark: 'rgba(15,31,58,0.06)' };
}

window.POSTS = POSTS;
window.TOPICS = TOPICS;
window.platePaper = platePaper;

// ── Geometry helpers ─────────────────────────────────────────────────
const CHART_R = 340; // radius of outer plate ring
const CX = 0, CY = 0; // chart center; we translate the SVG group

const polar = (theta, r) => {
  const rad = (theta * Math.PI) / 180;
  return [Math.cos(rad) * r, Math.sin(rad) * r];
};
const postXY = (p) => polar(p.th, p.r * CHART_R);

// A concept has no coordinates of its own — it floats at the centroid of the
// posts that invoke it, and fills in proportion to how many you've finished.
function conceptMembers(c, posts) {
  const idx = Object.fromEntries(posts.map(p => [p.id, p]));
  return (c.posts || []).map(id => idx[id]).filter(Boolean);
}
function conceptXY(c, posts) {
  const ms = conceptMembers(c, posts);
  if (!ms.length) return [0, 0];
  const xs = ms.map(postXY);
  return [xs.reduce((s, p) => s + p[0], 0) / xs.length,
          xs.reduce((s, p) => s + p[1], 0) / xs.length];
}
function conceptAssembled(c, posts) {
  const ms = conceptMembers(c, posts);
  if (!ms.length) return 0;
  return ms.filter(p => p.finished === true).length / ms.length;
}
// diamond path of radius r, centred at origin
const dia = (r) => `M 0 ${-r} L ${r} 0 L 0 ${r} L ${-r} 0 Z`;
window.conceptXY = conceptXY;
window.conceptAssembled = conceptAssembled;

// Build path string for the reader's path — a smooth catmull-rom-ish
// curve through stars in reading order.
function readerPathD(posts) {
  const ordered = posts.filter(p => p.read != null).sort((a, b) => a.read - b.read);
  if (ordered.length < 2) return '';
  const pts = ordered.map(postXY);
  let d = `M ${pts[0][0].toFixed(2)} ${pts[0][1].toFixed(2)}`;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1];
    const [x1, y1] = pts[i];
    // a gentle quadratic bow through the chart center, biased
    const mx = (x0 + x1) / 2;
    const my = (y0 + y1) / 2;
    const bow = 0.18; // pull toward center
    const cx = mx - mx * bow;
    const cy = my - my * bow;
    d += ` Q ${cx.toFixed(2)} ${cy.toFixed(2)} ${x1.toFixed(2)} ${y1.toFixed(2)}`;
  }
  return d;
}

// ── A star glyph — sized by mag, styled by finished state ────────────
function Star({ p, ink, hair, hovered, onEnter, onLeave, dimmed }) {
  const [x, y] = postXY(p);
  const size = 1.4 + p.mag * 0.9; // base radius
  const isFin = p.finished === true;
  const isHalf = p.finished === 'half';
  const isUnread = p.finished === false;
  const op = dimmed ? 0.35 : 1;

  // Real-engraving star = small circle plus four hairline rays for bright
  // stars (mag >= 3). Unread = ring only. Half = half-fill.
  const rays = p.mag >= 3.0;

  return (
    <g
      transform={`translate(${x.toFixed(2)} ${y.toFixed(2)})`}
      style={{ cursor: 'pointer', opacity: op, transition: 'opacity 0.2s' }}
      onMouseEnter={() => onEnter(p)}
      onMouseLeave={onLeave}
    >
      {/* hit area */}
      <circle r={Math.max(10, size + 6)} fill="transparent" />

      {/* rays for bright stars */}
      {rays && (
        <g stroke={ink} strokeWidth={0.5} opacity={0.55}>
          <line x1={-(size + 4)} y1={0} x2={-(size + 1)} y2={0} />
          <line x1={size + 1} y1={0} x2={size + 4} y2={0} />
          <line x1={0} y1={-(size + 4)} x2={0} y2={-(size + 1)} />
          <line x1={0} y1={size + 1} x2={0} y2={size + 4} />
        </g>
      )}

      {/* the star body */}
      {isFin && <circle r={size} fill={ink} stroke={ink} strokeWidth={0.6} />}
      {isHalf && (
        <>
          <circle r={size} fill="none" stroke={ink} strokeWidth={0.8} />
          <path d={`M 0 ${-size} A ${size} ${size} 0 0 1 0 ${size} Z`} fill={ink} />
        </>
      )}
      {isUnread && <circle r={size} fill="none" stroke={hair} strokeWidth={0.7} />}

      {/* hover crosshair */}
      {hovered && (
        <g stroke={ink} strokeWidth={0.5} opacity={0.7}>
          <circle r={size + 7} fill="none" />
          <line x1={-(size + 11)} y1={0} x2={-(size + 8)} y2={0} />
          <line x1={size + 8} y1={0} x2={size + 11} y2={0} />
          <line x1={0} y1={-(size + 11)} x2={0} y2={-(size + 8)} />
          <line x1={0} y1={size + 8} x2={0} y2={size + 11} />
        </g>
      )}
    </g>
  );
}

// ── A label for a star — italic serif, set just outside ──────────────
function StarLabel({ p, ink, dimmed }) {
  const [x, y] = postXY(p);
  // place label radially outward unless near outer ring
  const [lx, ly] = polar(p.th, p.r * CHART_R + 12);
  const outer = p.r > 0.7;
  const anchor = outer
    ? (Math.cos((p.th * Math.PI) / 180) > 0.3 ? 'start'
       : Math.cos((p.th * Math.PI) / 180) < -0.3 ? 'end' : 'middle')
    : 'middle';
  // For inner stars, label below; for outer stars, label radially out.
  const px = outer ? lx : x;
  const py = outer ? ly : y + 14 + 1.4 + p.mag * 0.9;
  return (
    <text
      x={px} y={py}
      textAnchor={anchor}
      fill={ink}
      style={{
        fontFamily: 'Newsreader, "Source Serif 4", Georgia, serif',
        fontStyle: 'italic',
        fontSize: outer ? 10.5 : 9.5,
        opacity: dimmed ? 0.3 : 0.85,
        letterSpacing: 0.1,
        pointerEvents: 'none',
        fontFeatureSettings: '"liga", "kern"',
      }}
    >
      {p.title}
    </text>
  );
}

// ── The chart proper ─────────────────────────────────────────────────
function ChartPlate({ theme, palette, layers, hovered, setHovered, posts }) {
  const ink = platePaper(theme).ink;
  const muted = platePaper(theme).muted;
  const hair = platePaper(theme).hair;
  const accent = (window.getPalette ? window.getPalette(palette || 'slate', theme === 'dark' ? 'dark' : 'light')['--accent'] : '#a1432b');
  const margin = 60;
  const size = CHART_R * 2 + margin * 2;

  // Citation lines (author-written)
  const citationLines = useMemoCN(() => {
    const idx = Object.fromEntries(posts.map(p => [p.id, p]));
    const lines = [];
    posts.forEach(p => {
      (p.cites || []).forEach(cid => {
        const q = idx[cid]; if (!q) return;
        const [x1, y1] = postXY(p);
        const [x2, y2] = postXY(q);
        lines.push({ x1, y1, x2, y2, key: `${p.id}->${cid}` });
      });
    });
    return lines;
  }, [posts]);

  // Witness kinship — group by witness tag, connect within group
  const witnessLines = useMemoCN(() => {
    const groups = {};
    posts.forEach(p => { if (p.witness) (groups[p.witness] ||= []).push(p); });
    const lines = [];
    Object.entries(groups).forEach(([tag, ps]) => {
      for (let i = 0; i < ps.length; i++) {
        for (let j = i + 1; j < ps.length; j++) {
          const [x1, y1] = postXY(ps[i]);
          const [x2, y2] = postXY(ps[j]);
          lines.push({ x1, y1, x2, y2, key: `w-${tag}-${i}-${j}` });
        }
      }
    });
    return lines;
  }, [posts]);

  const pathD = useMemoCN(() => readerPathD(posts), [posts]);

  const hoveredId = hovered?.id;
  const someHover = hoveredId != null;

  return (
    <svg width={size} height={size} viewBox={`${-CHART_R - margin} ${-CHART_R - margin} ${size} ${size}`}
      style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <filter id="emberGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <pattern id="paperGrain" width="3" height="3" patternUnits="userSpaceOnUse">
          <rect width="3" height="3" fill={platePaper(theme).paper} />
        </pattern>
      </defs>

      {/* Outer double ring */}
      <circle cx={0} cy={0} r={CHART_R + 18} fill="none" stroke={ink} strokeWidth={0.6} opacity={0.65} />
      <circle cx={0} cy={0} r={CHART_R + 14} fill="none" stroke={ink} strokeWidth={0.3} opacity={0.5} />
      <circle cx={0} cy={0} r={CHART_R} fill="none" stroke={ink} strokeWidth={0.55} opacity={0.7} />

      {/* Declination rings */}
      {[0.33, 0.66].map(f => (
        <circle key={f} cx={0} cy={0} r={CHART_R * f} fill="none" stroke={ink} strokeWidth={0.35} strokeDasharray="1 4" opacity={0.55} />
      ))}

      {/* DOMAIN regions — faint wedges + boundary rays between quadrants */}
      {layers.domains && Object.entries(TOPICS).map(([id, t], i) => {
        const [ax, ay] = polar(t.center - 45, CHART_R);
        const [bx, by] = polar(t.center + 45, CHART_R);
        return (
          <g key={`dom-${id}`}>
            <path d={`M 0 0 L ${ax.toFixed(1)} ${ay.toFixed(1)} A ${CHART_R} ${CHART_R} 0 0 1 ${bx.toFixed(1)} ${by.toFixed(1)} Z`}
              fill={ink} opacity={i % 2 ? 0.05 : 0.025} />
            <line x1={0} y1={0} x2={polar(t.center - 45, CHART_R)[0]} y2={polar(t.center - 45, CHART_R)[1]}
              stroke={ink} strokeWidth={0.4} strokeDasharray="3 5" opacity={0.4} />
          </g>
        );
      })}

      {/* Tick marks every 15° on the outer ring */}
      {Array.from({ length: 24 }, (_, i) => {
        const a = i * 15;
        const [x1, y1] = polar(a, CHART_R - 4);
        const [x2, y2] = polar(a, CHART_R + 4);
        const major = a % 90 === 0;
        return <line key={a} x1={x1} y1={y1} x2={x2} y2={y2} stroke={ink} strokeWidth={major ? 0.9 : 0.45} opacity={major ? 0.85 : 0.55} />;
      })}

      {/* Cardinal quadrant divider hairlines */}
      {[0, 90, 180, 270].map(a => {
        const [x2, y2] = polar(a, CHART_R - 2);
        return <line key={a} x1={0} y1={0} x2={x2} y2={y2} stroke={ink} strokeWidth={0.3} strokeDasharray="2 6" opacity={0.35} />;
      })}

      {/* Topic cartouches around the perimeter */}
      {Object.entries(TOPICS).map(([id, t]) => {
        const [lx, ly] = polar(t.center, CHART_R + 36);
        return (
          <g key={id} transform={`translate(${lx} ${ly})`}>
            <text textAnchor="middle" y={0}
              fill={ink}
              style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 9,
                letterSpacing: 3.4, textTransform: 'uppercase' }}>
              {t.label.toUpperCase()}
            </text>
            <text textAnchor="middle" y={16}
              fill={ink}
              style={{ fontFamily: 'Newsreader, serif', fontStyle: 'italic',
                fontSize: 10.5, opacity: 0.7 }}>
              {t.epigram}
            </text>
          </g>
        );
      })}

      {/* Witness kinship — dotted hairlines (bottom layer) */}
      {layers.witness && witnessLines.map(l => (
        <line key={l.key} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
          stroke={ink} strokeWidth={0.45} strokeDasharray="1 3" opacity={0.32} />
      ))}

      {/* Author citations — solid hairlines */}
      {layers.cites && citationLines.map(l => (
        <line key={l.key} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
          stroke={ink} strokeWidth={0.55} opacity={0.55} />
      ))}

      {/* CONCEPT tethers — each concept to the posts that invoke it (accent) */}
      {layers.concepts && CONCEPTS.flatMap(c => {
        const [cx, cy] = conceptXY(c, posts);
        return conceptMembers(c, posts).map((p, i) => {
          const [x, y] = postXY(p);
          return <line key={`ct-${c.id}-${i}`} x1={cx} y1={cy} x2={x} y2={y}
            stroke={accent} strokeWidth={0.4} strokeDasharray="1 4" opacity={0.3} />;
        });
      })}

      {/* Reader's path — the ember thread */}
      {layers.path && pathD && (
        <g filter="url(#emberGlow)">
          <path d={pathD} fill="none" stroke={accent} strokeWidth={1.6}
            opacity={0.85} strokeLinecap="round" />
        </g>
      )}

      {/* Numbered nodes along the reader's path */}
      {layers.path && posts.filter(p => p.read != null).sort((a, b) => a.read - b.read).map(p => {
        const [x, y] = postXY(p);
        return (
          <g key={`n-${p.id}`} transform={`translate(${x} ${y})`}>
            <circle r={9} fill={platePaper(theme).paper} stroke={accent} strokeWidth={0.9} />
            <text textAnchor="middle" dy="3.4"
              fill={accent}
              style={{ fontFamily: 'Newsreader, serif', fontStyle: 'italic',
                fontSize: 11, fontWeight: 500, pointerEvents: 'none' }}>
              {p.read}
            </text>
          </g>
        );
      })}

      {/* Stars */}
      {posts.map(p => (
        <Star key={p.id} p={p} ink={ink} hair={hair}
          hovered={hoveredId === p.id}
          dimmed={someHover && hoveredId !== p.id}
          onEnter={setHovered} onLeave={() => setHovered(null)} />
      ))}

      {/* Star labels */}
      {posts.map(p => (
        <StarLabel key={`l-${p.id}`} p={p} ink={ink}
          dimmed={someHover && hoveredId !== p.id} />
      ))}

      {/* CONCEPT nodes — open diamonds at the centroid, filled by how assembled */}
      {layers.concepts && CONCEPTS.map(c => {
        const [cx, cy] = conceptXY(c, posts);
        const a = conceptAssembled(c, posts);
        const s = 7;
        return (
          <g key={`c-${c.id}`} transform={`translate(${cx.toFixed(1)} ${cy.toFixed(1)})`}>
            {a === 1 && <path d={dia(s + 4)} fill="none" stroke={accent} strokeWidth={0.5} opacity={0.7} />}
            <path d={dia(s)} fill={platePaper(theme).paper} stroke={accent} strokeWidth={1} />
            {a > 0 && <path d={dia(s * a)} fill={accent} opacity={0.9} />}
            <text y={s + 14} textAnchor="middle" fill={ink}
              style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 8.5, letterSpacing: 1.8,
                textTransform: 'uppercase', opacity: 0.85, pointerEvents: 'none' }}>{c.label}</text>
          </g>
        );
      })}

      {/* Center cartouche — small compass rose */}
      <g>
        <circle r={20} fill={platePaper(theme).paper} stroke={ink} strokeWidth={0.4} opacity={0.85} />
        <text textAnchor="middle" dy="-2"
          fill={ink}
          style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 7,
            letterSpacing: 2.4, textTransform: 'uppercase', opacity: 0.7 }}>
          MAXUBRQ
        </text>
        <text textAnchor="middle" dy="9"
          fill={ink}
          style={{ fontFamily: 'Newsreader, serif', fontStyle: 'italic',
            fontSize: 9, opacity: 0.55 }}>
          mmxxvi
        </text>
      </g>
    </svg>
  );
}

window.ChartPlate = ChartPlate;
window.readerPathD = readerPathD;

// ── Top-level page ───────────────────────────────────────────────────
function ConstellationPage({ theme = 'light', palette = 'slate' }) {
  const [layers, setLayers] = useStateCN({ path: true, cites: true, witness: false, concepts: false, domains: false });
  const [hovered, setHovered] = useStateCN(null);
  const [pen, setPen] = useStateCN('reader · gmnd');
  const paper = platePaper(theme);
  const accent = (window.getPalette ? window.getPalette(palette, theme === 'dark' ? 'dark' : 'light')['--accent'] : '#a1432b');

  const finished = POSTS.filter(p => p.finished === true).length;
  const half = POSTS.filter(p => p.finished === 'half').length;
  const ordered = POSTS.filter(p => p.read != null).sort((a, b) => a.read - b.read);
  const marked = POSTS.filter(p => p.mark);
  const conceptsDone = CONCEPTS.filter(c => conceptAssembled(c, POSTS) === 1).length;

  return (
    <div style={{
      width: '100%', height: '100%', overflow: 'auto',
      background: paper.paper, color: paper.ink,
      fontFamily: 'Newsreader, "Source Serif 4", Georgia, serif',
      fontFeatureSettings: '"liga", "kern", "onum"',
    }}>
      {/* Masthead — book-plate style */}
      <div style={{ padding: '54px 80px 32px', borderBottom: `0.5px solid ${paper.hair}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <div style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 10,
            letterSpacing: 3.2, textTransform: 'uppercase', opacity: 0.6 }}>
            Plate XII &nbsp;·&nbsp; A chart of the reader&rsquo;s sky
          </div>
          <div style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 10,
            letterSpacing: 2.4, textTransform: 'uppercase', opacity: 0.55 }}>
            maxubrq · constellation
          </div>
        </div>
        <h1 style={{
          fontFamily: 'Newsreader, serif', fontWeight: 400, fontStyle: 'italic',
          fontSize: 52, letterSpacing: -0.4, lineHeight: 1.05,
          margin: '20px 0 10px', textWrap: 'pretty',
        }}>
          A chart of your reading
        </h1>
        <div style={{ fontFamily: 'Newsreader, serif', fontStyle: 'italic',
          fontSize: 16, opacity: 0.65, maxWidth: 620, lineHeight: 1.55 }}>
          Drawn afresh each time you return. The hand that traced the ember thread is yours;
          the engraved hairlines belong to the author. <br />
          <span style={{ fontVariant: 'small-caps', letterSpacing: '0.22em', fontSize: 11, opacity: 0.7 }}>
            drawn for&nbsp;
            <span style={{ borderBottom: `1px dotted ${paper.hair}`, paddingBottom: 1 }}>{pen}</span>
            &nbsp;· may&nbsp;mmxxvi
          </span>
        </div>
      </div>

      {/* Body — three columns */}
      <div style={{ display: 'grid', gridTemplateColumns: '230px 1fr 250px', gap: 32,
        padding: '36px 60px 24px', alignItems: 'start' }}>

        {/* LEFT — layer toggles + reading totals */}
        <div style={{ position: 'sticky', top: 24 }}>
          <SectionLabel paper={paper}>Engraver&rsquo;s key</SectionLabel>
          <LegendItem paper={paper}>
            <Glyph kind="filled" paper={paper} /> <span>read to the end</span>
          </LegendItem>
          <LegendItem paper={paper}>
            <Glyph kind="half" paper={paper} /> <span>half-read</span>
          </LegendItem>
          <LegendItem paper={paper}>
            <Glyph kind="ring" paper={paper} /> <span>not yet opened</span>
          </LegendItem>
          <div style={{ height: 16 }} />
          <LegendItem paper={paper}>
            <GlyphLine paper={paper} accent={accent} kind="ember" /> <span>your reading order</span>
          </LegendItem>
          <LegendItem paper={paper}>
            <GlyphLine paper={paper} kind="solid" /> <span>author&rsquo;s citation</span>
          </LegendItem>
          <LegendItem paper={paper}>
            <GlyphLine paper={paper} kind="dotted" /> <span>witness kinship</span>
          </LegendItem>
          <LegendItem paper={paper}>
            <svg width={20} height={16} viewBox="-10 -8 20 16" style={{ flexShrink: 0 }}>
              <path d="M 0 -6 L 6 0 L 0 6 L -6 0 Z" fill="none" stroke={accent} strokeWidth={1} />
              <path d="M 0 -3 L 3 0 L 0 3 L -3 0 Z" fill={accent} />
            </svg> <span>a concept (fills as you read)</span>
          </LegendItem>

          <div style={{ height: 28 }} />
          <SectionLabel paper={paper}>Layers</SectionLabel>
          <LayerToggle paper={paper} on={layers.path} accent={accent}
            onClick={() => setLayers(l => ({ ...l, path: !l.path }))}>
            Your reading thread
          </LayerToggle>
          <LayerToggle paper={paper} on={layers.cites}
            onClick={() => setLayers(l => ({ ...l, cites: !l.cites }))}>
            Author&rsquo;s citations
          </LayerToggle>
          <LayerToggle paper={paper} on={layers.witness}
            onClick={() => setLayers(l => ({ ...l, witness: !l.witness }))}>
            Witness kinship
          </LayerToggle>
          <LayerToggle paper={paper} on={layers.concepts} accent={accent}
            onClick={() => setLayers(l => ({ ...l, concepts: !l.concepts }))}>
            Concepts
          </LayerToggle>
          <LayerToggle paper={paper} on={layers.domains}
            onClick={() => setLayers(l => ({ ...l, domains: !l.domains }))}>
            Domains
          </LayerToggle>

          <div style={{ height: 28 }} />
          <SectionLabel paper={paper}>Drawn for</SectionLabel>
          <input value={pen} onChange={e => setPen(e.target.value)}
            style={{ background: 'transparent', border: 'none',
              borderBottom: `0.5px solid ${paper.hair}`, padding: '4px 0',
              fontFamily: 'Newsreader, serif', fontStyle: 'italic',
              fontSize: 14, color: paper.ink, width: '100%', outline: 'none' }} />
          <div style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 9.5,
            letterSpacing: 0.4, opacity: 0.5, marginTop: 8, lineHeight: 1.45 }}>
            change your pen name and the chart&rsquo;s dedication redraws.
          </div>
        </div>

        {/* CENTER — the plate */}
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
          <ChartPlate theme={theme} palette={palette}
            layers={layers} hovered={hovered} setHovered={setHovered}
            posts={POSTS} />

          {/* Hover detail card */}
          {hovered && (
            <HoverCard post={hovered} paper={paper} accent={accent} />
          )}
        </div>

        {/* RIGHT — counts cartouche + legend of the year */}
        <div style={{ position: 'sticky', top: 24 }}>
          <SectionLabel paper={paper}>Tally</SectionLabel>
          <Tally paper={paper} label="essays in the corpus" n={POSTS.length} />
          <Tally paper={paper} label="finished by you"      n={finished} />
          <Tally paper={paper} label="half-read"            n={half} />
          <Tally paper={paper} label="marked in your hand"  n={marked.length} accent={accent} />
          <Tally paper={paper} label="concepts assembled"   n={conceptsDone} accent={accent} />

          <div style={{ height: 28 }} />
          <SectionLabel paper={paper}>Constellations</SectionLabel>
          {Object.entries(TOPICS).map(([id, t]) => {
            const inTopic = POSTS.filter(p => p.t === id);
            const fin = inTopic.filter(p => p.finished === true).length;
            return (
              <div key={id} style={{ display: 'flex', justifyContent: 'space-between',
                fontFamily: 'Newsreader, serif', fontSize: 13.5,
                padding: '7px 0', borderBottom: `0.5px dotted ${paper.hair}` }}>
                <span style={{ fontStyle: 'italic' }}>{t.label}</span>
                <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 11,
                  opacity: 0.7, fontVariantNumeric: 'tabular-nums' }}>
                  {fin}<span style={{ opacity: 0.45 }}> / {inTopic.length}</span>
                </span>
              </div>
            );
          })}

          <div style={{ height: 28 }} />
          <Cartouche paper={paper} accent={accent} pen={pen} />
        </div>
      </div>

      {/* Reading-order strip — the path, in words */}
      <ReadingOrderStrip ordered={ordered} paper={paper} accent={accent} />

      {/* Personal index */}
      <PersonalIndex marked={marked} paper={paper} accent={accent} />

      {/* Colophon */}
      <div style={{ padding: '40px 80px 60px', textAlign: 'center',
        fontFamily: 'Newsreader, serif', fontStyle: 'italic',
        fontSize: 13, opacity: 0.55, lineHeight: 1.6 }}>
        ❦ &nbsp; this plate is redrawn on every visit. nothing leaves your machine.<br />
        <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 9.5,
          letterSpacing: 2.2, textTransform: 'uppercase', opacity: 0.7 }}>
          set in newsreader · engraved on paper · maxubrq mmxxvi
        </span>
      </div>
    </div>
  );
}

// ── Sub-pieces ───────────────────────────────────────────────────────
function SectionLabel({ children, paper }) {
  return (
    <div style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 9.5,
      letterSpacing: 3, textTransform: 'uppercase', opacity: 0.55,
      paddingBottom: 8, marginBottom: 10,
      borderBottom: `0.5px solid ${paper.hair}` }}>
      {children}
    </div>
  );
}

function LegendItem({ children, paper }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12,
      fontFamily: 'Newsreader, serif', fontStyle: 'italic',
      fontSize: 12.5, padding: '5px 0', color: paper.ink, opacity: 0.85 }}>
      {children}
    </div>
  );
}

function Glyph({ kind, paper }) {
  // tiny inline SVG glyph for legend
  const size = 8;
  return (
    <svg width={20} height={16} viewBox="-10 -8 20 16" style={{ flexShrink: 0 }}>
      {kind === 'filled' && <circle r={size / 2} fill={paper.ink} />}
      {kind === 'half' && (
        <>
          <circle r={size / 2} fill="none" stroke={paper.ink} strokeWidth={0.8} />
          <path d={`M 0 ${-size / 2} A ${size / 2} ${size / 2} 0 0 1 0 ${size / 2} Z`} fill={paper.ink} />
        </>
      )}
      {kind === 'ring' && <circle r={size / 2} fill="none" stroke={paper.hair} strokeWidth={0.8} />}
    </svg>
  );
}

function GlyphLine({ kind, paper, accent }) {
  return (
    <svg width={22} height={16} viewBox="0 0 22 16" style={{ flexShrink: 0 }}>
      {kind === 'solid' && <line x1={1} y1={8} x2={21} y2={8} stroke={paper.ink} strokeWidth={0.7} opacity={0.7} />}
      {kind === 'dotted' && <line x1={1} y1={8} x2={21} y2={8} stroke={paper.ink} strokeWidth={0.7} strokeDasharray="1 3" opacity={0.7} />}
      {kind === 'ember' && (
        <g>
          <line x1={1} y1={8} x2={21} y2={8} stroke={accent} strokeWidth={2} opacity={0.4} />
          <line x1={1} y1={8} x2={21} y2={8} stroke={accent} strokeWidth={1} />
        </g>
      )}
    </svg>
  );
}

function LayerToggle({ on, onClick, children, paper, accent }) {
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 10, width: '100%',
      background: 'transparent', border: 'none', padding: '6px 0',
      fontFamily: 'Newsreader, serif', fontStyle: 'italic',
      fontSize: 13.5, color: paper.ink, opacity: on ? 1 : 0.4,
      cursor: 'pointer', textAlign: 'left',
    }}>
      <span style={{
        display: 'inline-block', width: 12, height: 12, borderRadius: '50%',
        border: `0.8px solid ${paper.ink}`,
        background: on ? (accent || paper.ink) : 'transparent',
        flexShrink: 0,
      }} />
      {children}
    </button>
  );
}

function Tally({ paper, label, n, accent }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
      padding: '7px 0', borderBottom: `0.5px dotted ${paper.hair}` }}>
      <span style={{ fontFamily: 'Newsreader, serif', fontStyle: 'italic',
        fontSize: 13, opacity: 0.85 }}>{label}</span>
      <span style={{
        fontFamily: 'Newsreader, serif', fontSize: 22, lineHeight: 1,
        fontVariantNumeric: 'oldstyle-nums', color: accent || paper.ink,
      }}>{n}</span>
    </div>
  );
}

function Cartouche({ paper, accent, pen }) {
  return (
    <div style={{
      border: `0.5px solid ${paper.hair}`,
      padding: '16px 16px 14px',
      position: 'relative',
      textAlign: 'center',
    }}>
      <div style={{ position: 'absolute', inset: 4, border: `0.4px solid ${paper.hair}`, pointerEvents: 'none' }} />
      <div style={{ fontFamily: 'Newsreader, serif', fontStyle: 'italic', fontSize: 11,
        opacity: 0.6, marginBottom: 8 }}>
        drawn for
      </div>
      <div style={{ fontFamily: 'Newsreader, serif', fontStyle: 'italic',
        fontSize: 19, lineHeight: 1.1, color: accent }}>
        {pen}
      </div>
      <div style={{ fontFamily: 'Newsreader, serif', fontStyle: 'italic', fontSize: 11,
        opacity: 0.55, marginTop: 8 }}>
        ❦ may, the year mmxxvi
      </div>
    </div>
  );
}

function HoverCard({ post, paper, accent }) {
  const [x, y] = postXY(post);
  // Card always pinned to top-right of the chart container
  return (
    <div style={{
      position: 'absolute', top: 8, right: 8, width: 260,
      background: paper.paper, border: `0.5px solid ${paper.hair}`,
      boxShadow: `0 12px 30px ${paper.mark}`,
      padding: '14px 16px 14px', pointerEvents: 'none',
    }}>
      <div style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 9,
        letterSpacing: 2.4, textTransform: 'uppercase', opacity: 0.55,
        marginBottom: 6 }}>
        {TOPICS[post.t].label} &nbsp;·&nbsp; {post.date}
      </div>
      <div style={{ fontFamily: 'Newsreader, serif', fontStyle: 'italic',
        fontSize: 17, lineHeight: 1.25, color: paper.ink, textWrap: 'pretty' }}>
        {post.title}
      </div>
      <div style={{ display: 'flex', gap: 12, marginTop: 10,
        fontFamily: '"IBM Plex Mono", monospace', fontSize: 9.5, opacity: 0.6,
        letterSpacing: 0.5 }}>
        <span>{post.min} min</span>
        <span>·</span>
        <span>{post.finished === true ? 'finished' : post.finished === 'half' ? 'half-read' : 'not opened'}</span>
        {post.read != null && <><span>·</span><span style={{ color: accent }}>#{post.read} in your order</span></>}
      </div>
      {post.mark && (
        <div style={{ marginTop: 12, paddingTop: 10, borderTop: `0.5px dotted ${paper.hair}`,
          fontFamily: 'Newsreader, serif', fontStyle: 'italic', fontSize: 13,
          lineHeight: 1.5, color: paper.ink, opacity: 0.85 }}>
          {post.mark}
          <div style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 8.5,
            letterSpacing: 2, textTransform: 'uppercase',
            opacity: 0.5, marginTop: 6, fontStyle: 'normal' }}>
            ✎ from your underlines
          </div>
        </div>
      )}
    </div>
  );
}

function ReadingOrderStrip({ ordered, paper, accent }) {
  if (!ordered.length) return null;
  return (
    <div style={{ padding: '24px 60px 8px', borderTop: `0.5px solid ${paper.hair}`,
      marginTop: 16 }}>
      <div style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 9.5,
        letterSpacing: 3, textTransform: 'uppercase', opacity: 0.55,
        marginBottom: 14 }}>
        Your reading thread &nbsp;·&nbsp; in the order it was drawn
      </div>
      <div style={{ display: 'flex', gap: 0, alignItems: 'stretch',
        overflowX: 'auto', paddingBottom: 12 }}>
        {ordered.map((p, i) => (
          <div key={p.id} style={{ display: 'flex', alignItems: 'stretch', flexShrink: 0 }}>
            <div style={{ minWidth: 220, padding: '6px 22px 6px 0' }}>
              <div style={{ fontFamily: 'Newsreader, serif', fontStyle: 'italic',
                fontSize: 22, color: accent, lineHeight: 1,
                fontVariantNumeric: 'oldstyle-nums' }}>{p.read}.</div>
              <div style={{ fontFamily: 'Newsreader, serif', fontStyle: 'italic',
                fontSize: 14.5, lineHeight: 1.3, color: paper.ink,
                marginTop: 5, textWrap: 'pretty' }}>
                {p.title}
              </div>
              <div style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 9,
                letterSpacing: 1.8, textTransform: 'uppercase',
                opacity: 0.55, marginTop: 6 }}>
                {TOPICS[p.t].label} · {p.date}
              </div>
            </div>
            {i < ordered.length - 1 && (
              <div style={{ width: 18, display: 'flex', alignItems: 'center',
                marginRight: 8 }}>
                <div style={{ flex: 1, height: 1, background: accent, opacity: 0.45 }} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function PersonalIndex({ marked, paper, accent }) {
  if (!marked.length) return null;
  return (
    <div style={{ padding: '36px 60px 16px', borderTop: `0.5px solid ${paper.hair}` }}>
      <div style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 9.5,
        letterSpacing: 3, textTransform: 'uppercase', opacity: 0.55,
        marginBottom: 22 }}>
        What you marked &nbsp;·&nbsp; a personal index
      </div>
      <div style={{ columnCount: 2, columnGap: 48, columnRule: `0.5px solid ${paper.hair}` }}>
        {marked.map(p => (
          <div key={p.id} style={{ breakInside: 'avoid', marginBottom: 22 }}>
            <div style={{ fontFamily: 'Newsreader, serif', fontStyle: 'italic',
              fontSize: 19, lineHeight: 1.35, color: paper.ink, textWrap: 'pretty' }}>
              &ldquo;{p.mark.replace(/^[\u201C\u201D"]|[\u201C\u201D"]$/g, '')}&rdquo;
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8,
              marginTop: 8, paddingTop: 6, borderTop: `0.5px dotted ${paper.hair}` }}>
              <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 9,
                letterSpacing: 2, textTransform: 'uppercase',
                opacity: 0.55 }}>
                from
              </span>
              <span style={{ fontFamily: 'Newsreader, serif', fontStyle: 'italic',
                fontSize: 13, color: accent }}>
                {p.title}
              </span>
              <span style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 9,
                letterSpacing: 1.6, textTransform: 'uppercase', opacity: 0.45,
                marginLeft: 'auto' }}>
                {p.date}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

window.ConstellationPage = ConstellationPage;

