// InkProfile.jsx — "hồ sơ nhịp đọc" (T5). The feature itself is INVISIBLE:
// the site quietly adapts suggestion order, default length, and pacing to how
// you read. An invisible system needs exactly one honest surface — a mirror —
// where you can see what's been inferred, correct it, and switch it off.
// Otherwise "learning you" becomes surveillance. Everything is local.

// confidence expressed in WORDS, never a percent
function conf(level) {
  return ['a hunch', 'fairly sure', 'quite sure', 'certain'][level] || 'a hunch';
}

// one inferred trait: plain sentence + evidence + what it changes + controls
function Trait({ id, sentence, level, evidence, adapts, state, onSet }) {
  const off = state === 'off';
  const wrong = state === 'wrong';
  return (
    <div style={{ border: `1.5px solid ${INK.ruleHard}`, marginBottom: 16, opacity: off ? 0.5 : 1,
      transition: 'opacity .2s ease' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 16px',
        borderBottom: `1px solid ${INK.rule}` }}>
        <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase',
          color: INK.muted }}>the site thinks · {conf(level)}</span>
        {off && <Tag>not in use</Tag>}
        {wrong && <Tag on>you said no</Tag>}
      </div>
      <div style={{ padding: '18px 16px 16px' }}>
        <div style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 25, letterSpacing: '-0.02em',
          lineHeight: 1.08, textTransform: 'lowercase', color: wrong ? INK.muted : INK.ink,
          textDecoration: wrong ? 'line-through' : 'none' }}>{sentence}</div>
        <div style={{ fontFamily: MONO, fontSize: 11.5, color: INK.muted, margin: '12px 0 0', lineHeight: 1.5 }}>
          <span style={{ color: INK.faint }}>because&nbsp;</span>{evidence}
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', marginTop: 10 }}>
          <span style={{ fontFamily: MONO, fontSize: 9.5, letterSpacing: '0.1em', textTransform: 'uppercase',
            color: INK.blue, flexShrink: 0 }}>so →</span>
          <span style={{ fontFamily: BODY, fontSize: 14, lineHeight: 1.5, color: off || wrong ? INK.faint : INK.ink }}>{adapts}</span>
        </div>
        {/* controls — correct or disable, per trait */}
        <div style={{ display: 'flex', gap: 0, marginTop: 16, borderTop: `1px solid ${INK.rule}`, paddingTop: 12 }}>
          {[['ok', "that's me"], ['wrong', 'not me'], ['off', off ? 'turn on' : 'stop using']].map(([k, label], i) => {
            const activeBtn = (k === 'wrong' && wrong) || (k === 'off' && off);
            return (
              <button key={k} onClick={() => onSet(id, k === 'off' ? (off ? 'ok' : 'off') : k)} style={{
                border: 'none', background: activeBtn ? INK.blue : 'transparent', color: activeBtn ? '#fff' : INK.ink,
                fontFamily: MONO, fontSize: 10.5, letterSpacing: '0.06em', textTransform: 'uppercase',
                padding: '7px 14px', cursor: 'pointer', borderRight: i < 2 ? `1px solid ${INK.rule}` : 'none' }}>{label}</button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function InkProfile() {
  const [master, setMaster] = React.useState(true);
  const [states, setStates] = React.useState({ morning: 'ok', slow: 'ok', reread: 'ok', evening: 'off' });
  const set = (id, v) => setStates(s => ({ ...s, [id]: v }));

  const traits = [
    { id: 'morning', sentence: 'you read in the morning.', level: 2,
      evidence: '14 of your last 18 reads began before noon.',
      adapts: 'New pieces surface first thing; reading appointments default to a morning slot.' },
    { id: 'slow', sentence: 'you read slowly, and finish.', level: 3,
      evidence: 'Your pace runs ~30% under the length estimate, yet you reach the last line 9 times in 10.',
      adapts: 'Time estimates lengthen to match your real pace; the breathing pacer stays available on long pieces.' },
    { id: 'reread', sentence: 'you are a re-reader.', level: 1,
      evidence: 'You have opened 6 finished pieces a second time in the last month.',
      adapts: 'Finished pieces you might revisit are kept easy to reach, not buried under new ones.' },
    { id: 'evening', sentence: 'in the evening you prefer short pieces.', level: 0,
      evidence: 'Only a hunch — 3 short reads after 9pm is not much to go on yet.',
      adapts: 'After dark, shorter pieces would surface first. Off until the site is more sure.' },
  ];

  return (
    <InkChrome current={null} foot="maxubrq.space / reading profile">
      <RunningHead text="maxubrq · reading profile · the mirror" />
      {/* Masthead */}
      <section style={{ padding: '46px 40px 28px', borderBottom: `1.5px solid ${INK.ruleHard}`, position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
          <a href="#ink-reader-room" style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase' }}>← the reading room</a>
          <Tag>learned on this device · never sent anywhere</Tag>
        </div>
        <h1 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 66, lineHeight: 0.92,
          letterSpacing: '-0.045em', margin: 0, textTransform: 'lowercase' }}>
          what the site<br />has <span style={{ color: INK.blue }}>noticed</span>.
        </h1>
        <p style={{ maxWidth: '58ch', fontFamily: BODY, fontStyle: 'italic', fontSize: 17, lineHeight: 1.55,
          color: INK.muted, margin: '20px 0 0' }}>
          The site quietly shapes itself to how you read — the order it suggests things, how long it says a
          piece will take, when it offers to pace you. That happens invisibly. This page is the one place it
          shows its hand: everything it has guessed, why, and a way to tell it it’s wrong.
        </p>
      </section>

      {/* Master switch — the whole thing is opt-out in one move */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 40px',
        borderBottom: `1.5px solid ${INK.ruleHard}`, background: master ? INK.paper : INK.paper2 }}>
        <div>
          <div style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 18, letterSpacing: '-0.01em',
            textTransform: 'lowercase' }}>let the site adapt to me</div>
          <div style={{ fontFamily: MONO, fontSize: 11, color: INK.muted, marginTop: 2 }}>
            {master ? 'on — adapting quietly from local signals only' : 'off — the site treats you like a first-time visitor'}
          </div>
        </div>
        <button onClick={() => setMaster(m => !m)} style={{ width: 58, height: 30, flexShrink: 0,
          border: `1.5px solid ${master ? INK.blue : INK.ruleHard}`, background: master ? INK.blue : 'transparent',
          padding: 3, cursor: 'pointer', display: 'flex', justifyContent: master ? 'flex-end' : 'flex-start' }}>
          <span style={{ width: 22, height: 22, background: master ? '#fff' : INK.ruleHard, display: 'block' }} />
        </button>
      </div>

      {/* The traits */}
      <section style={{ padding: '26px 40px 14px', opacity: master ? 1 : 0.45, pointerEvents: master ? 'auto' : 'none',
        transition: 'opacity .2s ease' }}>
        <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase',
          color: INK.muted, marginBottom: 18 }}>guesses · in plain words, with the evidence</div>
        {traits.map(t => <Trait key={t.id} {...t} state={states[t.id]} onSet={set} />)}
      </section>

      {/* how it works — the honesty note */}
      <section style={{ padding: '4px 40px 36px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 0, borderTop: `1.5px solid ${INK.ruleHard}`, paddingTop: 18 }}>
          {[
            ['Signals', 'Time of day, your real pace vs length, reread rate, completion by length. Read from the same local store as your shelf.'],
            ['Confidence in words', 'A hunch → certain, never a percent. Low-confidence guesses stay off until the evidence is real.'],
            ['Yours to correct', 'Say “not me” and the guess is struck and stops adapting. Turn the whole thing off and the site forgets it ever noticed.'],
          ].map(([h, b], i) => (
            <div key={i} style={{ padding: '0 18px', borderRight: i < 2 ? `1px solid ${INK.rule}` : 'none' }}>
              <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase',
                color: INK.blue, marginBottom: 8 }}>{h}</div>
              <p style={{ fontFamily: BODY, fontSize: 13, lineHeight: 1.5, color: INK.ink, margin: 0 }}>{b}</p>
            </div>
          ))}
        </div>
        <p style={{ fontFamily: MONO, fontSize: 11.5, color: INK.muted, margin: '22px 0 0', lineHeight: 1.6 }}>
          Nothing here is uploaded, scored, or shown to anyone. The site adapts in the background; this mirror
          is the only time it speaks about it. — Nó học bạn, và bạn luôn được quyền nói “không phải vậy”.
        </p>
      </section>
    </InkChrome>
  );
}

Object.assign(window, { InkProfile });
