# Super-long-form posts (8,000+ words)

_Design notes for posts that need to read like a book, not a scroll._

---

## Principle

An 8,000+ word piece must read like a **book**, not a **scroll**.
Front matter, movements with their own identity, durable orientation,
generous resumption. The vocabulary the site already speaks — chapter
masthead, drop cap, fleuron, roman folio, per-section reading time,
study/flow modes, series chrome — is necessary but not sufficient at
this length. The thing that breaks at 8k+ words isn't *reading*, it's
everything around the reading: **orientation, fatigue, memory,
resumption.**

Turn the existing vocabulary up; don't invent a new one.

---

## The 8 moves

### 1. Front matter card
A real book-style colophon at the very top, before the drop cap.

> *"8,240 words · 4 movements · 1 plate · 18 footnotes · 32 min ·
> written across Nov–Feb."*

Optionally a one-sentence **argument** — the thesis-as-overture, so the
reader reads with the map. Sets expectation; gives them permission to
plan.

### 2. Movements, not sections
Anything ≥6k breaks into 3–5 *named* movements (not "II", but
**"II · The Pendulum"**), each with its own micro-masthead:

- section title
- one-line abstract
- "12 min"

A movement start feels like a chapter opening, not a heading. The
fleuron stays as the break *inside* a movement; movement starts get a
quieter title page.

### 3. The journey rail
Extend the existing `§ II · 4 min left` margin tag into the *whole
shape* — a thin vertical rail in the right margin with all four
movements as ticks, the current one filled, current paragraph as a
dot. Doesn't scroll; doesn't compete with TOC. Lets the reader feel
*where they are in the arc* without thinking about it.

### 4. Recurrence marks
When a term, person, or idea from an earlier movement re-appears,
append a quiet superscript `(↑§II)` linked to its first mention.
Solves the *"wait, who?"* problem without a glossary popover for every
recurring noun.

**Author-marked, not automatic.** These are the load-bearing
recurrences — the ones the argument leans on.

### 5. End-of-movement pulse
At each movement's close, a single italic line above the fleuron:

> *"You've just read about the pendulum's slow decay. Next: why the
> same shape governs grief."*

A heartbeat. Tells the reader the movement **ended on purpose**, not
because you ran out of breath.

### 6. The interlude
Once per piece, somewhere near the middle: a real *pause page* — a
Plate, a long pull-quote, or a single sentence in a generous frame.
No body text. The reader can stop here without guilt — and the page
tells them so.

> *"Good place to stop. The piece will keep your spot."*

### 7. Resumption with context
"You were here" is already built. For 8k pieces it upgrades to:

> *"You were here. You were 7 minutes into Movement III · 'The
> Pendulum.' The previous sentence ended: '…and the air, very
> slightly, fights back.'"*

The cost of leaving needs to be zero; the cost of returning needs to
be lower than the cost of starting.

### 8. Personal index at the end
A closing leaf — not the colophon, *after* it — titled:

> **What you marked in this piece.**

Their highlights, their reactions, their margin questions, in reading
order. Becomes the artifact they'd actually return to. Pairs naturally
with the future **T5.2 Commonplace Book**.

---

## What we are NOT doing

Flag these early — they look helpful, they aren't:

- **Reading progress bar at the top.** Gym equipment, not a book.
- **Auto-collapsing sections.** Hides the shape.
- **Chapter-end quizzes.** This isn't Coursera.
- **Live time-left ticker** that updates by the second. Anxiety machine.
- **"% read" anywhere.** Reading is not a completion percentage.

---

## Build order

1. **Front matter + Movements + Journey rail** — one artboard,
   *Article — long-form (8k)*. These three establish the format
   together; designing them separately is harder than designing them
   as one system.
2. **End-of-movement pulse + Interlude** — small additions on top of
   (1).
3. **Recurrence marks** — adds inside body type; low risk once the
   movement structure is in.
4. **Resumption with context** — extends `ReadingMemory.jsx`.
5. **Personal index** — closes the piece; depends on Engagement.

---

## Open questions

- Movement count: hard cap (≤5) or scale with length?
- Should the front matter card render in the running head when the
  reader is deep in the piece, as a tiny breadcrumb?
- Does the interlude get a permalink? (Probably yes — it's the most
  shareable single moment in the piece.)
- Does the personal index become a stable URL once the reader is
  signed in? (Connects to T4.1 marginalia.)
