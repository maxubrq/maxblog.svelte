// TechArticlePage.jsx — a technical post, staged as a printed technical book.
// Reuses the same chapter masthead + running head system as ArticlePage,
// but the inner rhythm is now: section numbers in the margin, code as plates,
// diagrams as plates, terminal blocks as dark cards, callouts as margin-rule
// asides, footnotes numbered and collected at the end.

// ── Debounce, Rebuilt — printable editorial pages ────────────────────
const techP = { margin: '0 0 0.85em' };
const techPIndent = { margin: '0 0 0.85em', textIndent: '1.5em' };

function techPrintPages() {
  const page1 = (
    <React.Fragment>
      <EdMasthead kicker="Essay · Software · Runtimes" title="Debounce, Rebuilt"
        subtitle="or, why the four-line utility is almost always wrong"
        byline="By M. Ubrq" meta={['22 April 2026', '18 min read']} />
      <EdSectionHead num="I">The problem with debounce</EdSectionHead>
      <EdColumns>
        <EdLede dropcap="E">
          <span style={{ fontVariant: 'small-caps' }}>very codebase</span> I have worked in has at
          least one debounce utility, and almost none of them are correct. They all look like the
          listing below — four lines, a closure, a <code>setTimeout</code>. The bug is not in the
          snippet; the bug is in what the snippet pretends to be.
        </EdLede>
        <p style={techP}>
          It answers “how do I not call <code>fn</code> too often?” It does not answer the question
          you actually have: <em>when the user stops typing, save — unless a save is already in
          flight, in which case queue one more; and if the component unmounts, cancel.</em> That
          question has four states, not one.<sup style={{ color: 'var(--accent)', fontSize: '0.7em' }}>1</sup>
        </p>
      </EdColumns>
      <EdCode filename="bad-debounce.ts">{`export function debounce(fn: Function, ms: number) {
  let t: any;
  return (...args: any[]) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}`}</EdCode>
    </React.Fragment>
  );

  const page2 = (
    <React.Fragment>
      <EdSectionHead num="II">A mental model, in four states</EdSectionHead>
      <EdColumns>
        <p style={techP}>
          Before any implementation, draw the state machine. The whole point of debounce is that it
          <em> has</em> states; hiding them is the original sin.
        </p>
        <p style={techPIndent}>
          Four states, five transitions. If your debounce cannot answer “what state am I in?” from
          the outside, it cannot be composed with the rest of your app — you cannot disable a Save
          button while pending, or show a spinner while firing.
        </p>
      </EdColumns>
      <EdFigure height={210} label="plate i — debounce state machine"
        caption="Plate I — Idle → Pending → Firing → Idle. The self-loop on Pending is where most bugs live. Rendered live in the reading view." />
      <EdPullquote>If your debounce can’t tell you what state it’s in, it isn’t a primitive — it’s a liability.</EdPullquote>
    </React.Fragment>
  );

  const page3 = (
    <React.Fragment>
      <EdSectionHead num="III">The implementation, annotated</EdSectionHead>
      <p style={techP}>
        Here is the version I actually ship. It is longer — deliberately. Every branch corresponds
        to a transition in the diagram, and the return value exposes the state so callers can stop
        guessing.<sup style={{ color: 'var(--accent)', fontSize: '0.7em' }}>2</sup>
      </p>
      <EdCode filename="debounce.ts">{`type State = 'idle' | 'pending' | 'firing';

export function debounce<Args extends any[]>(
  fn: (...a: Args) => void | Promise<void>,
  ms: number,
) {
  let state: State = 'idle';
  let timer: ReturnType<typeof setTimeout> | null = null;
  let queued: Args | null = null;

  const schedule = (args: Args) => {
    if (timer) clearTimeout(timer);
    state = 'pending';
    timer = setTimeout(() => { timer = null; fire(args); }, ms);
  };
  const fire = async (args: Args) => {
    state = 'firing';
    try { await fn(...args); }
    finally { if (queued) { const q = queued; queued = null; schedule(q); }
              else state = 'idle'; }
  };
  const call = (...args: Args) => {
    if (state === 'firing') { queued = args; return; }
    schedule(args);
  };
  return Object.assign(call, { get state() { return state; } });
}`}</EdCode>
    </React.Fragment>
  );

  const page4 = (
    <React.Fragment>
      <EdSectionHead num="IV">Verifying with a stress test</EdSectionHead>
      <p style={techP}>
        I do not trust a primitive I have not abused. The stress test drives the debounce with
        jittered calls, a slow handler, and concurrent cancellations — the things that always expose
        a bad implementation.
      </p>
      <EdCode filename="$ node debounce.test.ts">{`calls: [ 42, 99 ]
final state: idle
# 100 calls collapsed into 2 handler invocations.
# cancel() fired mid-burst; the machine returned to idle cleanly.`}</EdCode>
      <p style={techPIndent}>
        Two fires, from a hundred calls, with a cancellation in the middle — and the machine settles
        to <code>idle</code>. The observable state is a lie detector: if it does not go back to
        idle, something is leaking, and you can see it before your users can.
      </p>
      <div style={{ textAlign: 'center', margin: '0.6em 0 1em', color: 'var(--accent)' }}>■</div>
      <EdNotes notes={[
        { n: 1, text: 'Every “why is my save firing twice” bug report I have investigated traced back to the four-line utility and a concurrent handler.' },
        { n: 2, text: 'The API surface is deliberately close to Lodash’s _.debounce with .cancel() — the additions are .state and .subscribe().' },
      ]} />
    </React.Fragment>
  );

  return [page1, page2, page3, page4];
}

function TechArticlePage({ theme = 'light', palette = 'warm', fontPair = 'newsreader' }) {
  const { useState, useEffect, useRef, useMemo } = React;
  const [mode, setMode] = useState('flow');
  const [progress, setProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('intro');
  const scrollerRef = useRef(null);

  const vars = window.PALETTES
    ? window.PALETTES[palette][theme === 'dark' ? 'dark' : 'light']
    : window.PALETTES.warm.light;

  const fonts = {
    newsreader: '"Newsreader", Georgia, serif',
    source:     '"Source Serif 4", "Source Serif Pro", Georgia, serif',
    lora:       '"Lora", Georgia, serif',
    garamond:   '"EB Garamond", "Garamond", Georgia, serif',
  };
  const serif = fonts[fontPair] || fonts.newsreader;

  // ── Scroll progress + active section tracking
  useEffect(() => {
    const el = scrollerRef.current; if (!el) return;
    const onScroll = () => {
      const p = el.scrollTop / Math.max(1, el.scrollHeight - el.clientHeight);
      setProgress(Math.max(0, Math.min(1, p)));
      const sections = el.querySelectorAll('[data-tech-section]');
      let current = 'intro';
      sections.forEach((s) => {
        if (s.getBoundingClientRect().top < 120) current = s.dataset.techSection;
      });
      setActiveSection(current);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  // ── Load Mermaid once
  useEffect(() => {
    if (window.mermaid) { window.mermaid.initialize({ startOnLoad: false, theme: 'base',
      themeVariables: {
        primaryColor: vars['--paper2'],
        primaryTextColor: vars['--ink'],
        primaryBorderColor: vars['--rule'].replace('rgba', 'rgba'),
        lineColor: vars['--ink'],
        fontFamily: serif,
      }}); return; }
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/mermaid@10.9.1/dist/mermaid.min.js';
    s.onload = () => {
      window.mermaid.initialize({ startOnLoad: false, theme: 'base',
        themeVariables: {
          primaryColor: vars['--paper2'],
          primaryTextColor: vars['--ink'],
          primaryBorderColor: 'rgba(0,0,0,0.2)',
          lineColor: vars['--ink'],
          fontFamily: serif,
        }});
    };
    document.head.appendChild(s);
  }, [palette, theme, fontPair]);

  const romanFolio = useMemo(() => {
    const total = 48; // imaginary book
    const n = Math.max(1, Math.round(progress * total));
    return toRoman(n).toLowerCase();
  }, [progress]);

  const sections = [
    { id: 'intro',   num: '1.0', label: 'The problem with debounce' },
    { id: 'model',   num: '2.0', label: 'A mental model, in four states' },
    { id: 'impl',    num: '3.0', label: 'The implementation, annotated' },
    { id: 'verify',  num: '4.0', label: 'Verifying with a stress test' },
    { id: 'refs',    num: '—',   label: 'References' },
  ];

  const mermaidChart = `stateDiagram-v2
  direction LR
  [*] --> Idle
  Idle --> Pending: call()
  Pending --> Pending: call()\\n(reset timer)
  Pending --> Firing: timer expires
  Firing --> Idle: handler done
  Firing --> Pending: call()\\n(during handler)
`;

  return (
    <div data-screen-label="Tech article"
      style={{ ...vars, height: '100%', overflow: 'hidden', background: 'var(--paper)',
        color: 'var(--ink)', position: 'relative', fontFamily: serif,
        '--serif': serif }}>
      {mode !== 'print' && <ModeSwitcher mode={mode} onChange={setMode} serif={serif} />}
      {mode === 'print' ? (
        <PrintDeck theme={theme} palette={palette} serif={serif} sans='"IBM Plex Sans", sans-serif'
          title="Debounce, Rebuilt" mode={mode} onModeChange={setMode} pages={techPrintPages()} />
      ) : (
      <React.Fragment>

      {/* Progress hairline */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1,
        background: 'var(--rule)', zIndex: 40 }}>
        <div style={{ width: `${progress * 100}%`, height: '100%',
          background: 'var(--accent)', transition: 'width 90ms' }} />
      </div>

      {/* Running head */}
      <header style={{ position: 'absolute', top: 14, left: 0, right: 0,
        display: 'flex', justifyContent: 'space-between', padding: '0 56px',
        fontFamily: serif, fontVariant: 'small-caps', letterSpacing: '0.25em',
        fontSize: 10, color: 'var(--muted)', zIndex: 30, pointerEvents: 'none' }}>
        <span>maxubrq · essays in software</span>
        <span style={{ letterSpacing: '0.15em' }}>
          debounce, rebuilt · <span style={{ fontVariant: 'normal', fontStyle: 'italic',
            letterSpacing: 'normal', textTransform: 'lowercase' }}>{romanFolio}</span>
        </span>
      </header>

      {/* Body scroller */}
      <div ref={scrollerRef} style={{ height: '100%', overflowY: 'auto',
        padding: '60px 0 80px', boxSizing: 'border-box',
        scrollBehavior: 'smooth' }}>

        <div style={{ display: 'grid',
          gridTemplateColumns: '90px minmax(0, 1fr) 90px',
          maxWidth: 1080, margin: '0 auto', padding: '0 40px', columnGap: 24 }}>

          {/* Section number rail (left) — shows current section */}
          <div style={{ gridColumn: 1 }}>
            <div style={{ position: 'sticky', top: 60,
              fontFamily: serif, fontVariantNumeric: 'oldstyle-nums',
              fontSize: 12, color: 'var(--muted)',
              borderRight: '1px solid var(--rule)', paddingRight: 14, paddingTop: 2,
              textAlign: 'right' }}>
              {sections.map(s => (
                <div key={s.id} style={{
                  padding: '5px 0',
                  color: activeSection === s.id ? 'var(--accent)' : 'var(--muted)',
                  fontStyle: activeSection === s.id ? 'normal' : 'italic',
                  letterSpacing: 0.5,
                }}>
                  {s.num}
                </div>
              ))}
            </div>
          </div>

          {/* Column 2 — the body */}
          <article style={{ gridColumn: 2, fontSize: 17, lineHeight: 1.72,
            color: 'var(--ink)', textRendering: 'optimizeLegibility',
            fontFeatureSettings: '"liga","kern","onum","calt"',
            hyphens: 'auto', WebkitHyphens: 'auto' }}>

            {/* Masthead */}
            <div style={{ textAlign: 'center', margin: '10px 0 44px' }}>
              <div style={{ fontVariant: 'small-caps', letterSpacing: '0.35em',
                fontSize: 11, color: 'var(--muted)', marginBottom: 18 }}>
                Essay · Software · Runtimes
              </div>
              <div style={{ height: 1, background: 'var(--rule)', margin: '0 auto 3px',
                width: '58%' }} />
              <div style={{ height: 1, background: 'var(--rule)', margin: '0 auto 26px',
                width: '42%' }} />
              <h1 style={{ fontSize: 'clamp(34px, 4vw, 48px)', lineHeight: 1.05,
                margin: '0 0 14px', fontWeight: 500, letterSpacing: '-0.01em' }}>
                Debounce, Rebuilt
              </h1>
              <div style={{ fontStyle: 'italic', color: 'var(--muted)', fontSize: 20,
                marginBottom: 22, letterSpacing: '-0.005em' }}>
                or, why the four-line utility is almost always wrong
              </div>
              <div style={{ fontVariant: 'small-caps', letterSpacing: '0.25em',
                fontSize: 11, color: 'var(--muted)' }}>
                By M. Ubrq &nbsp;·&nbsp; Posted 22 April mmxxvi &nbsp;·&nbsp; 18 min read
              </div>
            </div>

            {/* § 1 — Intro */}
            <section data-tech-section="intro">
              <h2 style={h2Style}>§ I &nbsp; The problem with debounce</h2>

              <p style={{ margin: '0 0 1em' }}>
                <span style={{ float: 'left', fontSize: '4em', lineHeight: 0.86,
                  fontFamily: serif, fontWeight: 500, color: 'var(--accent)',
                  padding: '4px 10px 0 0', marginTop: 4 }}>E</span>
                <span style={{ fontVariant: 'small-caps', letterSpacing: '0.15em',
                  fontSize: '1.02em' }}>very codebase</span>
                {' '}I have worked in has at least one debounce utility, and
                almost none of them are correct. They all look like the snippet below —
                four lines, a closure, a <InlineCode>setTimeout</InlineCode>. The bug
                is not in the snippet; the bug is in what the snippet pretends to be.
              </p>

              <CodePlate lang="ts" filename="bad-debounce.ts"
                caption="Listing 1 — the canonical four-line debounce. Ships in a thousand codebases."
                note="Listing I"
                highlight={[4]}>
{`export function debounce(fn: Function, ms: number) {
  let t: any;
  return (...args: any[]) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}`}
              </CodePlate>

              <p style={pStyle}>
                This function answers the question &ldquo;how do I not call
                <InlineCode>fn</InlineCode> too often?&rdquo; It does not answer the
                question you actually have, which is some version of:
                <em> when the user stops typing, save — unless a save is already in
                flight, in which case queue one more; and if the component
                unmounts, cancel.</em> That question has four states, not one. The
                four-line utility has one state, and so every time you reach for it
                you end up writing the other three by hand, poorly, next to it.
                <sup style={supStyle}>1</sup>
              </p>

              <Callout kind="caveat" title="Read this before you yell">
                I am not saying <InlineCode>setTimeout</InlineCode> is wrong. I am
                saying the <em>abstraction</em> is wrong — it hides exactly the
                states you most need to reason about.
              </Callout>
            </section>

            {/* § 2 — Model */}
            <section data-tech-section="model" style={{ marginTop: '2.5em' }}>
              <h2 style={h2Style}>§ II &nbsp; A mental model, in four states</h2>

              <p style={pStyle}>
                Before any implementation, draw the state machine. The whole
                point of debounce is that it <em>has</em> states; hiding them
                is the original sin. Here is the smallest machine that does what
                a real product needs:
              </p>

              <DiagramPlate
                caption="Plate I — Debounce as a state machine. The self-loop on Pending is where most bugs live."
                note="Plate I">
                <Mermaid chart={mermaidChart} id="debounce-sm" />
              </DiagramPlate>

              <p style={pStyle}>
                Four states, five transitions. If your debounce implementation
                cannot answer &ldquo;what state am I in right now?&rdquo; from the
                outside, it cannot be composed with the rest of your app — you
                cannot disable a Save button while <em>Pending</em>, you cannot
                show a spinner while <em>Firing</em>, and you certainly cannot
                test it.
              </p>

              <blockquote style={{ margin: '2em 0', textAlign: 'center',
                fontFamily: serif, fontStyle: 'italic', fontSize: '1.25em',
                lineHeight: 1.4, color: 'var(--ink)',
                paddingTop: 24, paddingBottom: 24,
                borderTop: '1px solid var(--rule)',
                borderBottom: '1px solid var(--rule)',
                position: 'relative', maxWidth: '42ch', margin: '2em auto' }}>
                <span style={{ color: 'var(--accent)',
                  fontFamily: serif, fontSize: '2.6em', lineHeight: 0,
                  position: 'absolute', left: '-0.25em', top: '0.55em',
                  fontStyle: 'normal' }}>“</span>
                If your debounce can&rsquo;t tell you what state it&rsquo;s in,
                it isn&rsquo;t a primitive — it&rsquo;s a liability.
              </blockquote>
            </section>

            {/* § 3 — Impl */}
            <section data-tech-section="impl" style={{ marginTop: '2.5em' }}>
              <h2 style={h2Style}>§ III &nbsp; The implementation, annotated</h2>

              <p style={pStyle}>
                Here is the version I actually ship. It is longer — deliberately.
                Every branch corresponds to a transition in the diagram above,
                and the return value exposes the state so callers can stop
                guessing. <sup style={supStyle}>2</sup>
              </p>

              <CodePlate lang="ts" filename="debounce.ts" startLine={1}
                caption="Listing 2 — a debounce that knows what state it's in, and tells you."
                note="Listing II"
                highlight={[12, 13, 14]}>
{`type State = 'idle' | 'pending' | 'firing';

export function debounce<Args extends any[]>(
  fn: (...a: Args) => void | Promise<void>,
  ms: number,
) {
  let state: State = 'idle';
  let timer: ReturnType<typeof setTimeout> | null = null;
  let queued: Args | null = null;
  const subs = new Set<(s: State) => void>();

  const setState = (s: State) => {
    state = s;
    subs.forEach((cb) => cb(s));
  };

  const fire = async (args: Args) => {
    setState('firing');
    try { await fn(...args); }
    finally {
      if (queued) { const q = queued; queued = null; schedule(q); }
      else setState('idle');
    }
  };

  const schedule = (args: Args) => {
    if (timer) clearTimeout(timer);
    setState('pending');
    timer = setTimeout(() => { timer = null; fire(args); }, ms);
  };

  const call = (...args: Args) => {
    if (state === 'firing') { queued = args; return; }
    schedule(args);
  };

  return Object.assign(call, {
    cancel: () => { if (timer) clearTimeout(timer); queued = null; setState('idle'); },
    get state() { return state; },
    subscribe: (cb: (s: State) => void) => { subs.add(cb); return () => subs.delete(cb); },
  });
}`}
              </CodePlate>

              <p style={pStyle}>
                The highlighted lines are the part people forget: a state
                setter with an observer set. Without this, you cannot build a
                Save button that correctly reflects what the debounce is doing,
                and any loading spinner you build on top will lie on exactly
                the transitions your user notices.
              </p>

              <Callout kind="note" title="Why not RxJS?">
                You can, and RxJS&rsquo;s <InlineCode>debounceTime</InlineCode> is
                excellent. This essay is about the eighty percent of codebases
                that do not already depend on Rx and should not start
                for this one problem.
              </Callout>
            </section>

            {/* § 4 — Verify */}
            <section data-tech-section="verify" style={{ marginTop: '2.5em' }}>
              <h2 style={h2Style}>§ IV &nbsp; Verifying with a stress test</h2>

              <p style={pStyle}>
                I do not trust a primitive I have not abused. The stress test
                below drives the debounce with jittered calls, a slow handler,
                and concurrent cancellations — the things that always expose a
                bad implementation.
              </p>

              <CodePlate lang="ts" filename="debounce.test.ts"
                caption="Listing 3 — stress test. Run with vitest or node:test."
                note="Listing III">
{`import { debounce } from './debounce';
import { setTimeout as sleep } from 'node:timers/promises';

const calls: number[] = [];
const slowSave = async (n: number) => {
  await sleep(50); // handler takes 50ms
  calls.push(n);
};

const save = debounce(slowSave, 20);

// jittered burst of 100 calls over ~200ms
for (let i = 0; i < 100; i++) {
  save(i);
  await sleep(Math.random() * 4);
}
// cancel mid-flight every so often
setTimeout(() => save.cancel(), 30);

await sleep(400);
console.log('calls:', calls, 'final state:', save.state);
`}
              </CodePlate>

              <Terminal host="max@pendulum" cwd="~/debounce">
{`$ node --experimental-strip-types debounce.test.ts
calls: [ 42, 99 ]
final state: idle
# 100 calls collapsed into 2 handler invocations.
# cancel() fired mid-burst; the machine returned to idle cleanly.`}
              </Terminal>

              <p style={pStyle}>
                Two fires, from a hundred calls, with a cancellation in the
                middle — and the machine settles to <InlineCode>idle</InlineCode>.
                That last line of the terminal output is the thing I care about:
                the observable state is a lie detector. If it does not go back
                to <InlineCode>idle</InlineCode>, something is leaking, and you
                can see it before your users can.
              </p>
            </section>

            {/* End mark */}
            <div style={{ textAlign: 'center', margin: '2.2em 0 0',
              color: 'var(--accent)', fontSize: 14 }}>■</div>

            {/* References */}
            <section data-tech-section="refs" style={{ marginTop: '3em',
              borderTop: '1px solid var(--rule)', paddingTop: 28 }}>
              <h2 style={{ ...h2Style, fontSize: '1.1em' }}>References & notes</h2>
              <ol style={{ fontFamily: serif, fontSize: 14, lineHeight: 1.6,
                color: 'var(--muted)', paddingLeft: 22, margin: 0,
                fontVariantNumeric: 'oldstyle-nums' }}>
                <li style={refLi}>
                  A case study of this phenomenon: every &ldquo;why is my save
                  firing twice&rdquo; bug report I have ever investigated has
                  traced back to the four-line utility and a concurrent handler.
                </li>
                <li style={refLi}>
                  The API surface is deliberately close to Lodash&rsquo;s
                  <InlineCode>_.debounce</InlineCode> with
                  <InlineCode>.cancel()</InlineCode> — the additions are
                  <InlineCode>.state</InlineCode> and
                  <InlineCode>.subscribe()</InlineCode>. If you already use
                  Lodash, you can keep your call sites and replace the import.
                </li>
              </ol>

              <div style={{ textAlign: 'center', marginTop: 36,
                fontFamily: serif, fontVariant: 'small-caps',
                letterSpacing: '0.3em', fontSize: 10, color: 'var(--muted)' }}>
                Finis
              </div>

              {/* Reflection prompt — reuse the listening surface */}
              {window.ReflectionPrompt && <window.ReflectionPrompt />}
            </section>
          </article>

          <div style={{ gridColumn: 3 }} />
        </div>
      </div>
      </React.Fragment>
      )}
    </div>
  );
}

// ── helpers ─────────────────────────────────────────────────────────
const h2Style = {
  fontFamily: 'var(--serif)',
  fontSize: '1.25em',
  fontWeight: 500,
  letterSpacing: '-0.005em',
  margin: '0 0 1em',
  color: 'var(--ink)',
  fontVariant: 'small-caps',
  letterSpacing: '0.1em',
};

const pStyle = {
  margin: '0 0 1em',
  textIndent: 0,
};

const supStyle = {
  fontFamily: 'var(--serif)',
  fontSize: '0.6em',
  color: 'var(--accent)',
  padding: '0 1px 0 2px',
  verticalAlign: 'super',
  lineHeight: 0,
};

const refLi = { marginBottom: 10 };

function toRoman(n) {
  const map = [ ['m', 1000], ['cm', 900], ['d', 500], ['cd', 400],
    ['c', 100], ['xc', 90], ['l', 50], ['xl', 40],
    ['x', 10], ['ix', 9], ['v', 5], ['iv', 4], ['i', 1] ];
  let out = '';
  for (const [ch, val] of map) while (n >= val) { out += ch; n -= val; }
  return out;
}

window.TechArticlePage = TechArticlePage;
