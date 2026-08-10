// Topics.jsx — curated topic pages + an entry-point hub.
//
// Surfaces:
//   TOPIC_CONTENT       — hand-written essays, starter posts, and scratchpads
//                         for Science / Software / Philosophy / Art.
//   TopicPage           — the curated page. Gets a topic id as a prop.
//   TopicsHub           — a site-level /topics index — four tiles, each a
//                         doorway into a topic page.
//
// Design intent:
//   - Each topic gets its own editor's-note intro, tone-matched. Not a grid
//     of posts. A page you can *read*, not just scan.
//   - Three starter posts, numbered I–III with italic "why this one" notes.
//   - A "what I'm thinking about next" scratchpad — looks like a notebook
//     page, with lines-in-progress and open questions.
//   - A chronological tail of every other post in the topic, quiet.

const TOPIC_CONTENT = {
  science: {
    id: 'science',
    name: 'Science',
    tagline: 'Small infinities. Quiet proofs. Things I only half-understand.',
    tone: 'clinical-warm',
    intro: [
      "I came late to physics — formally — and the arrival has not yet worn off. These essays are written in that particular voice: a person who still marvels that the equation behind a string and a weight is the same equation behind the weather, the heart, a planet's long fate.",
      "I try to stay honest about what I do not know. When I hedge, I hedge on purpose. When I say ‘chaos,’ I mean a specific thing; there is a glossary entry for it.",
      "If you are a physicist and you find mistakes, please tell me. That is how the archive gets better.",
    ],
    starters: [
      { id: 'pendulum', num: 'I', title: 'The horizon of a pendulum, and other small infinities', min: 9,
        why: 'If you read only one, read this one. It is the thesis for everything that follows — that determinism and predictability are not the same word.' },
      { id: 'proof', num: 'II', title: 'What a proof costs: notes from a week with Lean', min: 12,
        why: 'The companion piece to the pendulum essay. Same question — how do we know what we know — but in the language of software.' },
      { id: 'entropy', num: 'III', title: 'Entropy, explained to my daughter', min: 6,
        why: 'The shortest, most tested piece here. She is seven. If it works on her it works on most of us.' },
    ],
    scratchpad: [
      { kind: 'question', text: 'Why is the three-body problem our cultural shorthand for chaos, when the double pendulum is cleaner and lives in every physics lab?' },
      { kind: 'draft', text: 'An essay on the renormalization group, but written as a travelogue — zooming out, seeing a blur, and noticing that the blur has its own shape.' },
      { kind: 'reading', text: 'Currently reading: Strogatz, Nonlinear Dynamics and Chaos. Third time. Still finding new things.' },
      { kind: 'question', text: 'Can I write about information theory without leaning on the coin-flip metaphor even once?' },
    ],
    tail: [
      { title: 'What a probability really is', date: 'Dec 12, 2025', min: 8 },
      { title: 'Five hours with a double pendulum',     date: 'Nov 03, 2025', min: 4 },
      { title: 'The friendliness of Fourier',           date: 'Oct 18, 2025', min: 11 },
    ],
  },

  software: {
    id: 'software',
    name: 'Software',
    tagline: 'Plain-spoken engineering. Things I rebuild to understand.',
    tone: 'plainspoken',
    intro: [
      "Most of what I write here is an excuse to rebuild something from scratch. I take a primitive — debounce, a hash table, a state machine — and I write it until I understand it. Then I write it again, better.",
      "The posts are long because the point is the walk, not the destination. If you want an answer, Stack Overflow is down the hall. If you want to know why the answer is the answer, stay.",
    ],
    starters: [
      { id: 'debounce', num: 'I', title: 'Debounce, rebuilt', min: 11,
        why: 'The canonical entry. I take the simplest UI primitive and make it sing. If you like this, you will like the rest.' },
      { id: 'hash',     num: 'II', title: 'A hash table in a thousand lines',   min: 18,
        why: 'Long, patient, nothing hidden. The post I would hand to a junior engineer who asked "how do computers really work."' },
      { id: 'sm',       num: 'III', title: 'State machines without the drama',   min: 9,
        why: 'A companion to the debounce piece, generalized. Many of my bugs vanished the week I understood this.' },
    ],
    scratchpad: [
      { kind: 'draft', text: 'A rewrite of React\'s reconciler, explained one render at a time. Probably three essays long.' },
      { kind: 'question', text: 'What is the smallest useful database? I want to write one with you — as we read.' },
      { kind: 'reading', text: 'Currently reading: Designing Data-Intensive Applications. Also: the CRDT papers.' },
    ],
    tail: [
      { title: 'Small models, small problems',         date: 'Feb 01, 2026', min: 5 },
      { title: 'A calendar is not a database',          date: 'Jan 04, 2026', min: 7 },
      { title: 'Why my editor opens in 40 milliseconds', date: 'Nov 22, 2025', min: 10 },
    ],
  },

  philosophy: {
    id: 'philosophy',
    name: 'Philosophy',
    tagline: 'Slow reading. Old questions. A notebook, not a lecture.',
    tone: 'literary',
    intro: [
      "I was a philosophy student before I was anything else, and the habit has not left. These essays are my attempt to keep reading seriously — carefully, one page at a time — in a decade that would rather I skimmed.",
      "They are not arguments in the professional sense. They are closer to letters. Some of them are in Vietnamese, because some thoughts only come out clean in my first language.",
    ],
    starters: [
      { id: 'slow',    num: 'I', title: 'On reading slowly',                       min: 6,
        why: 'The manifesto, if this notebook has one. Read this first; the other essays sit downstream of it.' },
      { id: 'viet',    num: 'II', title: 'Đọc chậm — và tại sao nó quan trọng',     min: 8,
        why: 'The same argument in Vietnamese. Different words, different heart. Worth reading even if you read the first one.' },
      { id: 'negativa', num: 'III', title: 'Via negativa, or: what a good essay refuses', min: 7,
        why: 'Why I leave so much out. Why the short essay is often the truest one.' },
    ],
    scratchpad: [
      { kind: 'question', text: 'Is there a Vietnamese word that maps onto the English "slow" without any of its moral freight? I am not sure there is.' },
      { kind: 'draft', text: 'An essay on silence in reading — the space between paragraphs as the actual site of meaning.' },
      { kind: 'reading', text: 'Rereading Simone Weil, Gravity and Grace. Slower this time, the way she asked.' },
      { kind: 'question', text: 'How do you write about attention without performing attentiveness? The self-consciousness is the trap.' },
    ],
    tail: [
      { title: 'Attention as a kind of love',           date: 'Mar 12, 2026', min: 6 },
      { title: 'On not finishing books',                date: 'Feb 04, 2026', min: 4 },
      { title: 'A defense of the margin note',          date: 'Dec 28, 2025', min: 5 },
    ],
  },

  art: {
    id: 'art',
    name: 'Art',
    tagline: 'Looking, carefully. Small notes on quiet paintings.',
    tone: 'sparse',
    intro: [
      "I write about painting the way I wish people wrote about painting — without theory, without gossip, and without needing to prove that the painter is important.",
      "The goal is simpler than that. Stand in front of a thing, describe it honestly, and admit when the painting is doing something you cannot explain.",
    ],
    starters: [
      { id: 'martin',   num: 'I', title: 'Agnes Martin and the grid as devotion',       min: 7,
        why: 'The shortest way into how I look at abstraction. She is the saint of this section.' },
      { id: 'rothko',   num: 'II', title: 'The color of silence',                         min: 8,
        why: 'Complement to the Martin piece. If one is about the ruled line, the other is about the field between.' },
      { id: 'chardin',  num: 'III', title: 'Chardin and the dignity of a plum',           min: 5,
        why: 'To remind myself, and perhaps you, that quiet painting did not start in 1960.' },
    ],
    scratchpad: [
      { kind: 'draft', text: 'A slow looking at one Morandi still life, for as many paragraphs as it takes.' },
      { kind: 'reading', text: 'In my bag: Peter Schjeldahl, Hot, Cold, Heavy, Light.' },
      { kind: 'question', text: 'What would a Vietnamese Agnes Martin look like? Does the question even make sense?' },
    ],
    tail: [
      { title: 'Why I keep coming back to Hammershøi', date: 'Jan 30, 2026', min: 6 },
      { title: 'One room at the Met',                   date: 'Nov 12, 2025', min: 4 },
    ],
  },
};
window.TOPIC_CONTENT = TOPIC_CONTENT;

// Tone-tuned display for the intro essay.
const TONE_STYLES = {
  'clinical-warm': { size: 18, lh: 1.7, italic: false, align: 'left',  maxW: '54ch' },
  'plainspoken':   { size: 17.5, lh: 1.7, italic: false, align: 'left', maxW: '54ch' },
  'literary':      { size: 19, lh: 1.75, italic: true,  align: 'left', maxW: '48ch' },
  'sparse':        { size: 21, lh: 1.6,  italic: false, align: 'center', maxW: '34ch' },
};

// ── Topic Page ────────────────────────────────────────────────────────
function TopicPage({ topic = 'science', palette = 'warm', theme = 'light' }) {
  const data = TOPIC_CONTENT[topic] || TOPIC_CONTENT.science;
  const tone = TONE_STYLES[data.tone] || TONE_STYLES['clinical-warm'];

  const vars = window.getPalette
    ? window.getPalette(palette, theme)
    : { '--paper': '#faf8f4', '--ink': '#1a1814',
        '--paper2': '#f1ece2', '--muted': 'rgba(26,24,20,0.55)',
        '--rule': 'rgba(26,24,20,0.12)', '--accent': '#c96442' };

  const serif = '"Newsreader", Georgia, serif';
  const mono  = '"IBM Plex Mono", monospace';

  const TOPICS_ORDER = ['science', 'software', 'philosophy', 'art'];

  return (
    <div style={{ ...vars, height: '100%', overflow: 'hidden',
      background: 'var(--paper)', color: 'var(--ink)',
      fontFamily: serif, position: 'relative' }}>

      {/* Header */}
      <header style={{ position: 'absolute', top: 0, left: 0, right: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '22px 48px 0', zIndex: 5,
        fontFamily: '"IBM Plex Sans", sans-serif', fontSize: 13 }}>
        <a href="#" style={{ color: 'var(--ink)', textDecoration: 'none',
          fontWeight: 600, letterSpacing: '-0.01em' }}>maxubrq</a>
        <nav style={{ display: 'flex', gap: 24, color: 'var(--muted)' }}>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Writing</a>
          <a href="#" style={{ color: 'var(--ink)', fontWeight: 500, textDecoration: 'none' }}>Topics</a>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Glossary</a>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>About</a>
        </nav>
      </header>

      <div style={{ height: '100%', overflowY: 'auto',
        paddingTop: 72, paddingBottom: 140 }}>
        <div style={{ maxWidth: 920, margin: '0 auto', padding: '0 48px' }}>

          {/* Topic strip — siblings navigation */}
          <div style={{ display: 'flex', gap: 0, alignItems: 'center',
            padding: '18px 0 32px',
            borderBottom: '1px solid var(--rule)' }}>
            {TOPICS_ORDER.map((id, i) => {
              const T = TOPIC_CONTENT[id];
              const active = id === data.id;
              return (
                <React.Fragment key={id}>
                  {i > 0 && <span style={{ width: 1, height: 14,
                    background: 'var(--rule)', margin: '0 16px' }} />}
                  <a href="#" style={{
                    color: active ? 'var(--accent)' : 'var(--muted)',
                    textDecoration: 'none',
                    fontFamily: serif, fontVariant: 'small-caps',
                    letterSpacing: '0.22em', fontSize: 12,
                    fontStyle: active ? 'italic' : 'normal',
                    borderBottom: active ? '1px solid var(--accent)' : 'none',
                    paddingBottom: 2 }}>
                    {T.name}
                  </a>
                </React.Fragment>
              );
            })}
          </div>

          {/* Masthead */}
          <section style={{ padding: '36px 0 30px' }}>
            <div style={{ fontFamily: mono, fontSize: 11, letterSpacing: 0.8,
              textTransform: 'uppercase', color: 'var(--muted)',
              marginBottom: 18 }}>
              Topic · {data.starters.length + data.tail.length} essays
            </div>
            <h1 style={{ fontFamily: serif, fontWeight: 500,
              fontSize: 'clamp(2.8em, 5vw, 4em)', lineHeight: 1.0,
              margin: '0 0 0.3em', letterSpacing: '-0.02em' }}>
              {data.name}
            </h1>
            <p style={{ margin: 0, fontFamily: serif,
              fontStyle: 'italic', fontSize: 18, lineHeight: 1.5,
              color: 'var(--muted)', maxWidth: '42ch' }}>
              {data.tagline}
            </p>
          </section>

          {/* Intro essay — editor's note */}
          <section style={{ padding: '30px 0 48px',
            borderTop: '1px solid var(--rule)',
            borderBottom: '1px solid var(--rule)' }}>
            <div style={{ fontFamily: serif, fontVariant: 'small-caps',
              letterSpacing: '0.3em', fontSize: 10.5,
              color: 'var(--muted)', marginBottom: 22, textAlign: 'center' }}>
              An editor&rsquo;s note
            </div>
            <div style={{ maxWidth: tone.maxW, margin: '0 auto',
              textAlign: tone.align }}>
              {data.intro.map((p, i) => (
                <p key={i} style={{
                  margin: i === 0 ? '0 0 1em' : '0 0 1em',
                  fontFamily: serif,
                  fontSize: tone.size, lineHeight: tone.lh,
                  fontStyle: tone.italic ? 'italic' : 'normal',
                  color: 'var(--ink)' }}>
                  {i === 0 && !tone.italic && (
                    <span style={{ float: 'left', fontFamily: serif,
                      fontSize: tone.size * 3, lineHeight: 0.9,
                      padding: '6px 10px 0 0', color: 'var(--accent)',
                      fontWeight: 500 }}>
                      {p.charAt(0)}
                    </span>
                  )}
                  {(i === 0 && !tone.italic) ? p.slice(1) : p}
                </p>
              ))}
              <div style={{ marginTop: 20, fontFamily: serif,
                fontStyle: 'italic', fontSize: 13.5,
                color: 'var(--muted)', textAlign: 'right' }}>
                — m.
              </div>
            </div>
          </section>

          {/* Starter posts — I / II / III */}
          <section style={{ padding: '48px 0 48px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline',
              justifyContent: 'space-between', marginBottom: 26 }}>
              <h2 style={{ margin: 0, fontFamily: serif, fontWeight: 500,
                fontSize: 22, fontStyle: 'italic',
                letterSpacing: '-0.005em' }}>
                If you read these three, in order
              </h2>
              <span style={{ fontFamily: serif, fontStyle: 'italic',
                fontSize: 12.5, color: 'var(--muted)' }}>
                hand-picked
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {data.starters.map((s, i) => (
                <a key={s.id} href="#" style={{
                  display: 'grid',
                  gridTemplateColumns: '80px 1fr auto',
                  gap: 28, alignItems: 'baseline',
                  padding: '24px 0',
                  borderTop: '1px solid var(--rule)',
                  borderBottom: i === data.starters.length - 1 ? '1px solid var(--rule)' : 'none',
                  textDecoration: 'none', color: 'inherit',
                  transition: 'background 0.12s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--paper2)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}>
                  <div style={{ fontFamily: serif,
                    fontSize: 52, fontStyle: 'italic',
                    color: 'var(--accent)', lineHeight: 1,
                    fontVariant: 'small-caps',
                    letterSpacing: '-0.01em' }}>{s.num}</div>
                  <div>
                    <div style={{ fontFamily: serif,
                      fontSize: 22, color: 'var(--ink)', fontWeight: 500,
                      marginBottom: 8, letterSpacing: '-0.005em' }}>
                      {s.title}
                    </div>
                    <p style={{ margin: 0, fontFamily: serif,
                      fontStyle: 'italic', fontSize: 15,
                      lineHeight: 1.55, color: 'var(--muted)',
                      maxWidth: '54ch' }}>
                      &ldquo;{s.why}&rdquo;
                    </p>
                  </div>
                  <div style={{ fontFamily: serif,
                    fontSize: 12, color: 'var(--muted)',
                    fontVariant: 'small-caps',
                    letterSpacing: '0.2em', whiteSpace: 'nowrap' }}>
                    {s.min} min
                  </div>
                </a>
              ))}
            </div>
          </section>

          {/* What I'm thinking about next — scratchpad */}
          <section style={{ padding: '48px 56px',
            background: 'var(--paper2)',
            border: '1px solid var(--rule)',
            borderLeft: '2px solid var(--accent)',
            position: 'relative' }}>
            {/* Notebook feel — faint baseline rules as a subtle background */}
            <div aria-hidden="true" style={{ position: 'absolute',
              top: 80, left: 20, right: 20, bottom: 20,
              backgroundImage: 'repeating-linear-gradient(0deg, transparent 0 27px, var(--rule) 27px 28px)',
              opacity: 0.35, pointerEvents: 'none' }} />

            <div style={{ position: 'relative' }}>
              <div style={{ fontFamily: serif,
                fontVariant: 'small-caps', letterSpacing: '0.3em',
                fontSize: 10.5, color: 'var(--muted)', marginBottom: 8 }}>
                A scratchpad &middot; work in progress
              </div>
              <h3 style={{ margin: '0 0 24px', fontFamily: serif,
                fontSize: 26, fontWeight: 500, fontStyle: 'italic',
                letterSpacing: '-0.005em' }}>
                What I&rsquo;m thinking about next
              </h3>

              <ul style={{ margin: 0, padding: 0, listStyle: 'none',
                display: 'flex', flexDirection: 'column', gap: 18 }}>
                {data.scratchpad.map((s, i) => (
                  <li key={i} style={{ display: 'grid',
                    gridTemplateColumns: '70px 1fr', gap: 16,
                    alignItems: 'baseline' }}>
                    <span style={{ fontFamily: serif,
                      fontVariant: 'small-caps', letterSpacing: '0.24em',
                      fontSize: 9.5,
                      color: s.kind === 'question' ? 'var(--accent)' :
                             s.kind === 'draft'    ? 'var(--ink)'    :
                             'var(--muted)',
                      fontStyle: s.kind === 'question' ? 'italic' : 'normal',
                      paddingTop: 4 }}>
                      {s.kind === 'question' ? 'Question' :
                       s.kind === 'draft'    ? 'Draft' :
                       'Reading'}
                    </span>
                    <p style={{ margin: 0, fontFamily: serif,
                      fontSize: 16.5, lineHeight: 1.6,
                      color: 'var(--ink)',
                      fontStyle: s.kind === 'reading' ? 'italic' : 'normal' }}>
                      {s.text}
                    </p>
                  </li>
                ))}
              </ul>

              <div style={{ marginTop: 26, paddingTop: 16,
                borderTop: '1px dotted var(--rule)',
                fontFamily: serif, fontStyle: 'italic',
                fontSize: 12.5, color: 'var(--muted)',
                display: 'flex', justifyContent: 'space-between' }}>
                <span>— these are the lines before the lines.</span>
                <span>updated 21 Apr</span>
              </div>
            </div>
          </section>

          {/* Chronological tail */}
          <section style={{ padding: '48px 0 0' }}>
            <div style={{ display: 'flex', alignItems: 'baseline',
              justifyContent: 'space-between', marginBottom: 18,
              paddingBottom: 10, borderBottom: '1px solid var(--rule)' }}>
              <h3 style={{ margin: 0, fontFamily: serif,
                fontVariant: 'small-caps', letterSpacing: '0.28em',
                fontSize: 11, color: 'var(--muted)', fontWeight: 400 }}>
                Also in {data.name}
              </h3>
              <a href="#" style={{ fontFamily: serif, fontStyle: 'italic',
                fontSize: 12.5, color: 'var(--accent)',
                textDecoration: 'none',
                borderBottom: '1px solid var(--accent)' }}>
                every essay, chronologically →
              </a>
            </div>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
              {data.tail.map((p, i) => (
                <li key={i}>
                  <a href="#" style={{ display: 'grid',
                    gridTemplateColumns: '1fr auto auto', gap: 20,
                    alignItems: 'baseline',
                    padding: '14px 0',
                    borderBottom: '1px dotted var(--rule)',
                    textDecoration: 'none', color: 'inherit' }}>
                    <span style={{ fontFamily: serif, fontSize: 16,
                      color: 'var(--ink)', fontStyle: 'italic',
                      letterSpacing: '-0.005em' }}>{p.title}</span>
                    <span style={{ fontFamily: serif, fontSize: 11.5,
                      color: 'var(--muted)',
                      fontVariant: 'small-caps',
                      letterSpacing: '0.2em' }}>{p.date}</span>
                    <span style={{ fontFamily: serif, fontSize: 12,
                      color: 'var(--muted)' }}>{p.min} min</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}

// ── Topics Hub ────────────────────────────────────────────────────────
// A site-level /topics page. Four large tiles, each a doorway.

function TopicsHub({ palette = 'warm', theme = 'light' }) {
  const vars = window.getPalette
    ? window.getPalette(palette, theme)
    : { '--paper': '#faf8f4', '--ink': '#1a1814',
        '--paper2': '#f1ece2', '--muted': 'rgba(26,24,20,0.55)',
        '--rule': 'rgba(26,24,20,0.12)', '--accent': '#c96442' };

  const serif = '"Newsreader", Georgia, serif';
  const mono  = '"IBM Plex Mono", monospace';
  const order = ['science', 'software', 'philosophy', 'art'];
  const romans = ['I', 'II', 'III', 'IV'];

  return (
    <div style={{ ...vars, height: '100%', overflow: 'hidden',
      background: 'var(--paper)', color: 'var(--ink)',
      fontFamily: serif, position: 'relative' }}>
      <header style={{ position: 'absolute', top: 0, left: 0, right: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '22px 48px 0', zIndex: 5,
        fontFamily: '"IBM Plex Sans", sans-serif', fontSize: 13 }}>
        <a href="#" style={{ color: 'var(--ink)', textDecoration: 'none',
          fontWeight: 600, letterSpacing: '-0.01em' }}>maxubrq</a>
        <nav style={{ display: 'flex', gap: 24, color: 'var(--muted)' }}>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Writing</a>
          <a href="#" style={{ color: 'var(--ink)', fontWeight: 500, textDecoration: 'none' }}>Topics</a>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Glossary</a>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>About</a>
        </nav>
      </header>

      <div style={{ height: '100%', overflowY: 'auto',
        paddingTop: 72, paddingBottom: 80 }}>
        <div style={{ maxWidth: 980, margin: '0 auto', padding: '0 48px' }}>

          <section style={{ padding: '32px 0 28px' }}>
            <div style={{ fontFamily: mono, fontSize: 11, letterSpacing: 0.8,
              textTransform: 'uppercase', color: 'var(--muted)',
              marginBottom: 18 }}>
              Four doors
            </div>
            <h1 style={{ fontFamily: serif, fontWeight: 500,
              fontSize: 'clamp(2.6em, 4.8vw, 3.6em)', lineHeight: 1.05,
              margin: '0 0 0.25em', letterSpacing: '-0.02em' }}>
              Topics
            </h1>
            <p style={{ margin: 0, fontFamily: serif,
              fontStyle: 'italic', fontSize: 17, lineHeight: 1.55,
              color: 'var(--muted)', maxWidth: '44ch' }}>
              Each door has a letter from me. Pick the one that sounds like
              the week you are having.
            </p>
          </section>

          <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr',
            gap: 0, borderTop: '1px solid var(--rule)' }}>
            {order.map((id, i) => {
              const T = TOPIC_CONTENT[id];
              const isRight = i % 2 === 1;
              const isBottom = i >= 2;
              return (
                <a key={id} href="#" style={{
                  position: 'relative',
                  display: 'block',
                  padding: '40px 36px 36px',
                  borderRight: isRight ? 'none' : '1px solid var(--rule)',
                  borderBottom: isBottom ? 'none' : '1px solid var(--rule)',
                  textDecoration: 'none', color: 'inherit',
                  transition: 'background 0.15s',
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--paper2)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}>
                  <div style={{ fontFamily: serif,
                    fontSize: 13, fontStyle: 'italic', color: 'var(--muted)',
                    fontVariantNumeric: 'oldstyle-nums', marginBottom: 6 }}>
                    № {romans[i]}
                  </div>
                  <h2 style={{ margin: '0 0 10px', fontFamily: serif,
                    fontSize: 38, fontWeight: 500,
                    letterSpacing: '-0.015em', lineHeight: 1 }}>
                    {T.name}
                  </h2>
                  <p style={{ margin: '0 0 20px', fontFamily: serif,
                    fontStyle: 'italic', fontSize: 15.5,
                    lineHeight: 1.5, color: 'var(--muted)',
                    maxWidth: '34ch' }}>
                    {T.tagline}
                  </p>

                  <div style={{ display: 'flex', gap: 18, alignItems: 'baseline',
                    fontFamily: serif, fontSize: 12, color: 'var(--muted)',
                    fontVariant: 'small-caps', letterSpacing: '0.2em' }}>
                    <span>{T.starters.length + T.tail.length} essays</span>
                    <span style={{ flex: 1, height: 1, background: 'var(--rule)' }} />
                    <span style={{ color: 'var(--accent)',
                      fontStyle: 'italic', fontVariant: 'normal',
                      letterSpacing: 0, fontSize: 13 }}>
                      enter →
                    </span>
                  </div>

                  {/* A single starter title, to hint at the content */}
                  <div style={{ marginTop: 22, paddingTop: 16,
                    borderTop: '1px dotted var(--rule)',
                    fontFamily: serif, fontSize: 12.5,
                    color: 'var(--muted)', fontStyle: 'italic' }}>
                    start with &ldquo;{T.starters[0].title}&rdquo;
                  </div>
                </a>
              );
            })}
          </section>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { TopicPage, TopicsHub, TOPIC_CONTENT });
