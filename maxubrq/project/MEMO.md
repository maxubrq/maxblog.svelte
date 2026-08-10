# maxubrq — project memo & feature backlog

_Last updated: 7 May 2026_

A running memo of design decisions, built features, and ideas for later.
Keep this with the project — it's the place to come back to when you want
to pick up the next thing.

---

## The design intent (don't lose this)

**Reading comes first.** Everything in this site is subordinate to the act
of reading a long piece of writing carefully. Interactive elements live
inside that frame, not next to it. The aesthetic is a warm, printed book —
Swiss precision in the grid, warmth in the palette and type.

**Private by default.** Engagement is captured for the author, not
performed for other readers. No public comment threads. No like counts
visible to strangers. The reader's marks are *their own trail* first,
author signal second.

**Vietnamese-safe.** Every typographic choice must hold up with Vietnamese
diacritics. Newsreader, Source Serif, Lora, and EB Garamond all pass.

---

## What's built

### Primary surfaces
- **Article** — chapter-style masthead, drop cap, fleuron section breaks,
  roman folio in the running head, sticky TOC, pullquote, pendulum sim
  framed as Plate I, end mark, reflection prompt footer.
- **Home** — quiet landing, latest posts, topic entry points.
- **Archive** — full post index with filters.
- **About** — author page.

### Technical writing surface
- **Tech article ("Debounce, Rebuilt")** with code plates (syntax
  highlighting, line numbers, captions), Mermaid diagrams themed to the
  palette, terminal blocks, callouts, inline code, footnotes collected at
  the end, section-number rail.

### Listening surface
- **Selection → react** (core 4 + extended feelings), private underline
  trail, margin glyphs, reflection prompt at article end.
- **Reader signals dashboard** — author-only view: top passages, private
  letters, retention ribbon.

### Universal search
- **⌘K anywhere.** Paper-colored index drawer. Scopes: All, Posts,
  Sections, Passages, My marks. Topic filters. Keyboard legend.

### Reading apparatus
- **★ 1. Per-section reading time** — section rail in margin shows
  `§ II · 4 min left`. Updates as the reader scrolls.
- **★ 2. Two reading modes — *study* / *flow*** — toggle in running head.
  *Flow* hides sidebars, simplifies the chapter masthead, widens the
  body, adds breathing room.
- **★ 3. "You were here" memory** — article masthead nudge + gutter glyph;
  home "Pick up where you left off" rail; archive half-read marks.
- **★ 5. In-this-neighborhood** — hand-written post recommendations from
  the author at the end of each piece.
- **★ 7. Topic pages** — Topics hub + four topic doorways (Science /
  Software / Philosophy / Art).
- **★ 8. One sentence to remember** — author-picked thesis card.
- **★ 10. Interactive inline glossary** — inline marks, hover/click
  popover, per-post footnote, site-level dictionary.
- **★ Series (volumes & chapters)** — shelf, per-series page,
  in-article chrome (`<SeriesRibbon>`, `<SeriesRail>`, `<SeriesNext>`).

### ✦ Magic — built
- **✦ M5. Fair-witness drawer** — crowd-mark heatmap revealed only after
  finishing. Three artboards: invitation (post-colophon card), drawer
  (pull-quote, retention curve, top passages, reaction tally, anonymous
  letters, footer), per-mark "share?" chip. Per-mark opt-in. Counts only.

### Tweaks
- Theme (light/dark), 5 palettes (Warm, Ink, Prussian, Slate, Oxford),
  type pairings, layout (single / margin-notes), interactive framing.

---

## Next up — features to design

### 4. Vietnamese-aware type features
- Toggle loose / tight diacritic spacing
- Optional pronunciation ruby for technical loanwords on hover

### 6. Constellation view
Simple star field of all posts, clustered by topic, lines for citations
between posts. A map for returning readers.

### 9. Margin questions
`<Question>` elements in technical posts that pause the reader:
*"Before you scroll, what do you think the state machine needs?"*
Reveal answer.

### 12. Printable view
Real print stylesheet. Book-quality PDF with proper page numbers.

### 13. Email digest design
Serif, narrow, personal. Feels like a letter, not a marketing blast.

---

## ✦ Magic — remaining

### ✦ M1. Read aloud, in your own voice
60-second voice clip clones timbre. "Read to me" narrates in your voice,
paragraph highlighting in sync. *(Supersedes #11 audio narration.)*

### ✦ M2. The companion — margin AI that has read everything you wrote
Gutter prompt: *"ask the margin"*. Answers cite exact paragraphs.
Refuses to invent. Uses `window.claude.complete`.

### ✦ M3. Reader's letter — auto-composed, sent on demand
"Write me a letter" drafts an anonymous letter from the reader's marks
+ reactions + a question. Reader edits and sends.

### ✦ M4. Resume on any device by holding up your phone
QR in running head; scan from another device, opens to same paragraph.
No login. 30-day code expiry.

### ✦ M6. One sentence, cited — citation graph as constellation
Click any pull-quote → star map of dependencies and rebuttals.

### ✦ M7. Gentle pacing — the page breathes with you
Reader WPM measured locally. Hard passages → fractional type-size and
line-height bump. Invisible; felt.

### ✦ M8. Receipts — annual reading list of essays *they* finished
One-page PDF in article style: "Year MMXXVI in this house", essays
finished, passages kept, one sentence they wrote.

---

## ◆ SFIM — Symbolic / Transformative / Paradigmatic tier

The Magic tier above is about *delight that resets the standard*. SFIM
upper tiers are about *behavior change and category change*. Some of
these are reframings of the Magic features with stricter constraints;
the constraints are where the tier comes from.

### T4 Symbolic — sharing it = a statement about the reader

#### T4.1 Marginalia, public-by-choice
Reader's private highlights + one-line reactions can be made into a
permanent **public margin** under their pen name. Pen-name page collects
every margin across the site — a portrait of how someone reads. Sharing
"my marginalia at maxubrq" is self-portrait.
- *Diagnostic:* Do readers link their marginalia page in their bio
  on other sites unprompted?
- *Failure:* Becomes a comments section. Defense: no chronology, no
  counts, no replies — only the marks themselves.

#### T4.2 The Reading Letter, as credential (M8 reframed)
Year-end PDF, but published at a stable URL on the reader's pen-name
page. A finished-reading PDF is a costly signal — can't be faked.
- *Diagnostic:* Do readers post the link in lieu of generic year-in-review?
- *Failure:* Looks like a stats card. Defense: typeset like the essays;
  no counts in headline; reader's own sentence leads.

#### T4.3 Witness Citation
Sentences that cross the people's-pull-quote threshold get a permanent
URL `/witness/<post>/<sentence>`. Readers cite the witness page when
they want to point at "what most of us came away with."
- *Diagnostic:* Do witness URLs appear in other writers' essays as
  citations more often than the parent article?
- *Failure:* Becomes meme generator. Defense: austere page; no OG image.

#### T4.4 Reading Path — portable curated artifact
Any reader can curate a sequence of essays as a "Path" with their own
note before each one, rendered in the same vocabulary as authored series.
Other readers can subscribe.
- *Diagnostic:* Are paths sent in DMs as recommendations? Do curators
  gain followers?
- *Failure:* Reduces to playlists. Defense: hand-curated, notes required.

### T5 Transformative — life outside the site changes, irreversibly

#### T5.1 The Slow Inbox
One letter, posted weekly. Real envelope OR digital chapbook. No links,
no "you might also like," no footer. Unsubscribe slip is *separate*
from the artifact. Re-trains the reader's relationship with arrival.
- *Diagnostic:* At 6 months, do subscribers report unmuting/uninstalling
  other newsletter sources because "this is the only one that respects me"?
- *Failure:* Normal newsletter with nicer typography. Defense: never
  attach a share or follow CTA to the artifact.

#### T5.2 The Companion's Commonplace Book (M2 + export)
After 30 days the reader's question history exports as a private
typeset PDF — every question, every cited passage, follow-ups. Reader
sees their own thinking aggregated for the first time.
- *Diagnostic:* At 90 days, do users report they've started journaling
  or filling notebooks they used to leave blank?
- *Failure:* Stays a chat sidebar. Defense: ship the PDF — JSON dump
  doesn't transform.

#### T5.3 Long-Walk Handoff (M1 + locked playback)
"Read to me" detects audio output, dims screen, locks phone to article
foreground. 50 minutes uninterrupted. Trains long walks with single
finishable artifacts instead of infinite podcast feeds.
- *Diagnostic:* At 3 months, are heavy users reporting fewer podcast
  subscriptions or switched walking time to "essays I haven't read yet"?
- *Failure:* TTS-but-nicer. Defense: enforce the lock.

#### T5.4 Receipts, no-numbers (M8 with one rule)
Year-end PDF *never* shows numerical counts. Only titles, passages,
the reader's sentence. Active de-gamification.
- *Diagnostic:* Year-two readers writing "I deleted my Goodreads
  challenge" in the reaction box?
- *Failure:* One count anywhere = T2.

### T6 Paradigmatic — possibly

#### T6.1 The Witness Standard
M5 lifted to a small open standard: any site exposes
`/.well-known/witness.json`; a browser extension reads any
participating site and shows the same gated drawer. maxubrq is the
reference implementation.
- *Diagnostic:* Within 24 months, has at least one major long-form
  publisher adopted "no reactions until you finish" *citing this work*?
- *Failure:* Stays single-site → falls back to T4. Reaching T6 requires
  a manifesto essay + at least one weighty publisher adopting.

---

## ◇ The two roads — strategy notes

When the present queue is finished, two coherent next paths. Path B is
being built now. Path A is on deck.

### Path A — Build for tier (slow, high ceiling)
**T5.1 The Slow Inbox + T6.1 Witness Standard manifesto.**

- **T5.1 build notes.** Subsume the email digest design (#13) into a
  weekly chapbook. One letter per week, posted on a quiet day. Real
  envelope OR digital chapbook PDF; reader chooses on subscribe. The
  artifact has *no links, no "you might also like," no footer, no
  share button, no unsubscribe inside the artifact* — unsubscribe lives
  on a separate slip in the same envelope (or a separate plain-text
  email for digital). Typeset like the essays themselves. The ritual
  is the product.
- **T6.1 build notes.** Two artifacts to ship in sequence:
  1. The spec page at `/witness-standard` — a small open standard for
     gated-after-finish reactions, defining `/.well-known/witness.json`,
     the gate contract, the count-only privacy rule, and a JS reference
     implementation lifted from `FairWitness.jsx`.
  2. The manifesto essay — *"Reactions before reading: how the long-form
     web learned the wrong lesson from social media."* Argue the
     principle, name the pattern, point to the spec. Republish as a
     standalone series in its own volume.
- **What success looks like.** Within 24 months, at least one weighty
  long-form publisher adopts the standard *and cites this work*. The
  manifesto becomes a referenced essay in the field. maxubrq stops
  being "a personal blog" and becomes "the reference implementation."
- **Why both together.** T5.1 makes the *reader* change behavior;
  T6.1 makes the *industry* change behavior. Shipped together, they
  position maxubrq as the locus of a small movement, not just a site.
- **What this is not.** A growth play. Both paths trade addressable
  audience for depth. Subscribers may go *down* before they go up.
  That is the price of refusing to gamify.

### Path B — Finish the reading apparatus *(building now)*
**#9 Margin questions, then ✦ M2 The Companion.**

The same primitive at two scales: a paused question is a hand-authored
interrupt; the Companion is a generative one. Building #9 first
calibrates the pattern of *interruption that earns its place* before
an LLM is allowed the same job. M2's refusal language gets written
against the rhythm #9 establishes.

---

## Open questions for later

- Sync passages/marks across devices? localStorage for now; M4 sidesteps;
  full sync TBD.
- "Confused" reaction policy — edit or annotate? Pick a rhythm.
- Topic pages: own author note or inherit About voice?
- Constellation view threshold — guess 25+ posts.
- M5 witness scope — per post is simplest and least manipulable.
- M2 refusal language — write once, reuse.
- T4.1 marginalia: pen-name auth model? Email-magic-link likely.
- T6.1 spec: what fields does `witness.json` need to be useful but
  un-gameable?

---

## Files in this project

```
index.html                    — entry point, Tweaks panel, DesignCanvas
design-canvas.jsx             — the Figma-style canvas
pages/
  ArticlePage.jsx             — the hero reading surface
  OtherPages.jsx              — Home, Archive, About
  TechArticlePage.jsx         — tech post (debounce, rebuilt)
  TechPrimitives.jsx          — CodePlate, DiagramPlate, Terminal, Callout
  Engagement.jsx              — selection → react + reflection prompt
  SignalsDashboard.jsx        — author-only reader signals
  Search.jsx                  — universal ⌘K search
  Glossary.jsx                — inline marks, popovers, /glossary page
  Topics.jsx                  — topic hub + four topic pages
  Series.jsx                  — series shelf, series pages, in-article chrome
  ReadingMemory.jsx           — "you were here" — article + home + archive
  FairWitness.jsx             — M5 fair-witness drawer
  Ideas.jsx                   — renders this memo inside the canvas
MEMO.md                       — this file
```
