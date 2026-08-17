# maxubrq — svelte edition

A personal blog in SvelteKit 2 / Svelte 5, built to the **Ink Edition** art direction
(`maxubrq/project/THEME_MANIFESTO.md`): white paper, one electric ink-blue, hairline grids,
oversized lowercase grotesque, mono fine print. Content is MDX in `content/`.

```bash
pnpm install    # also runs `svelte-kit sync` via the prepare script
pnpm dev        # http://localhost:5173
pnpm build      # prerenders the whole site
pnpm preview
pnpm check      # svelte-check
```

SvelteKit 2 · Svelte 5 (runes) · Vite 6 · mdsvex. `vite-plugin-svelte` has to move with Vite —
v4 peers only on Vite 5, so the two are upgraded as a pair.

The `prepare` script is load-bearing, not decoration: `svelte-kit sync` is what writes
`.svelte-kit/tsconfig.json`, which the root `tsconfig.json` extends. Without it a clean clone
(Vercel, CI) builds with `Cannot find base config file "./.svelte-kit/tsconfig.json"` — harmless,
but it means esbuild silently ignored the TS config for that pass, and it buries real warnings.

## Writing a post

One file per post per language in `content/posts/`, extension `.mdx`. The slug is the filename,
so `content/posts/001-float-memory-en.mdx` is served at `/en/writing/001-float-memory-en` (the
locale prefix comes from the post’s own `lang`).

The frontmatter contract is deliberately identical to the production Next.js blog
(`~/MyApps/maxblog`), so posts move across without edits:

```yaml
---
title: 'Floating point numbers'
subtitle: 'how is 0.1 held inside a computer?'
date: '2026-01-29'
topic: 'Tech' # Science · Tech · Philosophy · Art · Thinking · Notes
lang: en # en | vi
interactive: true
chapter: 'Chapter I'
series: 'OOP — From Syntax to Reflex'
description: 'Shown on index pages and in the RSS feed.'
weather: # the reading contract, hand-written
  time: '25–30 min'
  oneSitting: true
  load: 4 # 1–5, drawn as squares; the number is never printed
  needFirst: '…'
  bestWhen: '…'
  warn: '…' # only when there is something honest to warn about
rememberSentence: 'The author’s pick — one sentence to keep.'
rememberAttribution: 'from Floating point numbers'
neighborhood: # hand-picked next reads
  - slug: gt-003-vi
    title: '…'
    min: 26
    relation: 'Mở đường'
    reason: 'why this one, next'
accent: 'numbers' # the word set in blue in the title (must occur in `title`)
draft: true # unlisted, but the page still builds
---
```

`reading` (minutes) and `words` are computed at build time by
`src/lib/content/reading-time.js`; set them in frontmatter to pin them.

### Translations

Two files that differ only in a trailing `-en` / `-vi` (or `_en` / `_vi`) are treated as
translations of one essay: each is published under its own locale, and both link to each other.

### Components inside MDX

No imports needed — `src/lib/content/inject-components.js` splices the kit into every `.mdx`
file's script, and only for the components that file actually uses. The kit is
`src/lib/mdx.ts`:

`Callout` · `CodeBlock` · `DiagramPlate` · `Figure` · `Fleuron` · `Footnote` · `LinkPreview` ·
`OneSentence` · `PullQuote` · `R` · `Sidenote` · `Term` · `Terminal` · `WeatherStrip` · `Float*`

To add one: create the component, export it from `src/lib/mdx.ts`, and add its name to
`KIT_COMPONENTS` in `inject-components.js`.

Two mdsvex rules worth remembering:

- Markdown inside a component only parses when a **blank line** separates it from the tags.
- Markdown content arrives as a `<p>`, so a component must not wrap children in a `<p>`.

**An outbound link becomes a `<LinkPreview>`** — a hover card with what is behind it. Production
swaps the `a` element through MDX's components map; mdsvex has no such map, so the swap happens
while the tree is still markdown, in `src/lib/content/remark-links.js`, the same way the glossary
and citation marks are placed. Only `http:` / `https:` links are wrapped: an internal link goes
somewhere the reader can already see the shape of, and a preview of your own page is a card telling
you what you are about to be told. Anchors, `mailto:` and relative paths pass through untouched.

That pass runs **last**, and the order is load-bearing. `remarkGlossary` and `remarkResources` both
skip `link` nodes on purpose — a term should not pick up a dotted underline inside a link, and a
citation numeral should not be planted in one. Rewrite the link into HTML tags first and its text is
no longer inside a `link` node, so both passes would happily mark it.

Math is `$inline$` / `$$display$$`, rendered by KaTeX **at build time** — no KaTeX JS ships to
the reader, only its stylesheet. GFM tables come from mdsvex's own remark.

## The article page

`/[lang]/writing/[slug]` is the reading surface. Top to bottom:

1. the running head, and the fore-edge in the gutter (see The reading instruments)
2. the title block — tag row · headline · deck
3. `ReadingMemoryNudge`, when you have started this essay before
4. `WeatherStrip` — the reading contract, met on the way in
5. the prose
6. the end mark `■`
7. `OneSentence` — the author's pick, when `rememberSentence` is set
8. `GlossaryFootnote` — the words the essay marked, when it marked any (see Glossary)
9. `Bibliography` — the sources, when the post has any (see Resources)
10. the hand-picked `neighborhood`, when the frontmatter lists one

The tag row, the deck and the weather strip carry `.flow-hide`; the headline and the nudge stay
whatever the mode — see Study and flow below.

There is no meta strip at the foot, and no meta rail beside the prose: topic, licence and word
count used to print at the foot, and author/date/reading/chapter used to stand in the left
margin. Both were removed and the prose took the column back. So `MetaFoot` is unused now, as are
the `article.author` / `published` / `filedUnder` / `license` / `words` catalogue keys and the
`meta.words` / `meta.license` frontmatter this edition still parses. (`MetaRail` itself is *not*
unused — `/about` still prints one.)

The article ends on 100px of empty page (80 on mobile), set on `article` rather than on the last
block, so the gap is there whichever block closes the piece.

### The mark

`ReaderMarks` wraps the prose — and only the prose: a selection in the apparatus below it is not a
passage of the essay, and a mark drawn there would have nowhere to be redrawn.

It is built to `maxubrq/project/pages/InkMarks.jsx`, which **replaces** the reaction bar production
still ships (`SelectionReact`, ❤ ✦ ?). One primitive instead of four feelings — five gestures that
each write the same record, so what comes later reads one stream instead of five bespoke ones:
**keep** (worth carrying out of the essay) · **dissent** (the same gesture, sign reversed) ·
**snag** (an anchor to come back to, not a place to leave) · **ask** (a question pinned to the
passage) · **note** (for the author). The glyphs are proofreader's marks drawn as SVG strokes;
the design is explicit that they are *never emoji*.

**Everything is private first, and that is what makes it cheap.** Only `note` leaves the device, so
there is no consent step to design — the other four never travel. It also means `/api/react` and
the shared `reactions` table need **no change at all**: `note` is already a value the endpoint
accepts, and the four new words are never written to a table production also reads. `dev` and
`draft` are still refused (both editions write to one Postgres). `doNotTrack` is deliberately *not*
consulted, which is the opposite of `ArticleTracker`: there the site counts readers who never asked
to be counted, here the reader is writing a letter they chose to write.

The marks are **drawn, not styled** — rough.js strokes on an SVG layer above the text, seeded from
the mark's own number so a redraw is the same hand, and animated once with a stroke-dash so the pen
appears to draw it on. rough.js is `import()`ed with the first mark. Each gesture is a different
hand: a rule for keep, two rules and a strike for dissent, a wobble for snag, a rule plus an ellipse
around the numeral for ask, and for note a bracket in the margin — a note is addressed somewhere,
so the prose should not look edited by it.

**The one thing that actually blocked this**: `Selection.toString()` returns the text as the eye saw
it, one space between words, while the DOM's `textContent` still holds the newlines the markdown
source wrapped at (~80 columns). A quote taken from a selection therefore never matches the text
node it came from, and every mark failed to draw while recording perfectly — a silent, total
failure. `flatten()` collapses whitespace while keeping a map back to the original offsets, and the
search runs on that. Anything that matches prose against a selection in this repo needs the same
treatment.

**The bar is the page's two colours swapped** — an ink field with paper marks — and that has to be
said in *tokens*, not in white. The design canvas is a light-only mock, so it hardcodes white text
on a fixed dark bar; mapped straight across, the field follows `--ink` and turns *light* at night
while the text stays white, and the whole bar becomes unreadable in exactly one theme. `--bar-field`
/ `--bar-mark` are declared once on `.bar` and everything on it derives from that pair.

The same audit turned up six solid blue fields carrying white text — in the mark bar, the vault's
filters and fold, and the sky's layer toggle — that used `--blue` where `app.css` requires
`--panel-blue`. The token exists for this: at night `--blue` is brightened so it can be *text* on
paper, and white on that brightened blue does not carry, so a solid blue *field* has to drop to
`--blue-deep`. `FilterBar` had it right and was the model.

The anchor is the shape a W3C TextQuoteSelector uses — quote plus a slice of context each side — so
a mark survives the author editing the paragraph around it. Production stores the bare quote and
loses the mark the moment a character changes.

A passage crossing an inline element is recorded but not drawn: the remark passes put `<Term>` and
`<R>` inside sentences, so a selection over one has no single text node to wrap. Better to leave it
undrawn than to rebuild the author's markup around it.

Not built yet from that design: `belief` (an article-level gesture), `dwell` (passive, local), and
the register — the reader's own list of marks in the gutter.

### The reading instruments

Everything around the prose is one question — *where am I, and what is left?* — answered by one
measurement. `src/lib/reading-progress.svelte.ts` runs a single rAF-throttled scroll listener and
publishes `progress` · `activeSection` · `sectionProgress`; four instruments read it, so the
running head, the drawer and the bar can never disagree about where you are.

- **`ForeEdge`** — the fore-edge of the book, drawn in the gutter. Not a progress bar: what you
  have read compresses into a thin band, what remains stays a thick block, and you feel the
  weight left the way your thumb feels it in a paperback. It is *also* the contents — each
  section owns a run of leaves whose length is its reading time; hover names it, click goes
  there. The fraction only ever sets thickness and is never printed as a number. Two homes,
  never both at once: a rail in the left gutter above 1180px, a 10px strip at the right edge of
  the viewport below it (that one is inert — a 10px tap target is not a control).
- **`TocDrawer` + `TableOfContents`** — the list, for readers who want a list. Roman numerals,
  per-section minutes, a hairline gauge of how far into each you have come. A sheet from the
  bottom on a phone, a card in the middle on a desktop.
- **`MobileReadingBar`** — the section you are in and what it costs to finish, on the bottom
  edge. No progress track: the strip at the right of the screen carries that.
- **`ReadingRuler`** — the reading cursor. The block nearest the reading line holds full
  contrast, the rest fall back to 34%, and the whole thing fades out when you stop moving. Never
  a rule laid across the text, which makes the eye read the rule instead of the sentence.

### Telemetry

`ArticleTracker` records the three facts `/api/track` keeps: a session opened this essay, reached
a section, finished it. Counts, never identities — one row per session per post (and per section),
deduplicated by unique constraints in the schema, and **nothing is read back into the page**: the
reader is never shown a number about their own reading.

It owns no listeners. Production's version runs a second scroll handler and a second
`IntersectionObserver`; here it takes `progress` and `activeSection` from the page's own
measurement, which also settles what "reached a section" means — the reader is standing under it,
the same signal the running head and the contents use. One definition of where the reader is.

Three things switch it off entirely, before a session id is so much as created:

- **`dev`.** Both editions write to the same Postgres, so a `pnpm dev` session would otherwise
  land in the real numbers as a reader.
- **A draft.** That is the author previewing, not readership.
- **`navigator.doNotTrack`.** This edition's addition, not production's: the site counts in order
  to know whether an essay was finished, and that is a question a reader is allowed to decline.

#### Vercel Web Analytics · Speed Insights

The site's only third-party measurement, both injected in the root `+layout.svelte` so they also
see `/`, the 404 and `/signals`. Both are cookieless and keep no cross-site identity. What
Analytics adds over `/api/track` is traffic the essays cannot see — which routes are visited at
all, and where from; Speed Insights reports Web Vitals from real visits rather than a lab run.

They follow the same `doNotTrack` rule, and earlier: the check runs before either `inject…` call,
so a reader who has declined fetches neither script. In `pnpm dev` Analytics runs in `development`
mode (logs to the console, sends nothing) and Speed Insights in `debug`.

`$lib/session.ts` holds the id — a uuid in localStorage under production's `mx_sid`, so a reader
with both editions open is one reader. It is not an account and not a fingerprint; clearing site
data ends it.

### Reading memory

The other half of the pair, and the distinction is the point: telemetry counts readers **for the
author** and leaves the device; reading memory keeps a place **for the reader** and never does.
So it has no `dev` guard and no `doNotTrack` check — there is nothing here to opt out of.

`$lib/reading-memory.ts` holds one entry per essay under production's `reading_memory` key: how
far in, which `##`, how many minutes are left, and when. Four components touch it — one writes,
three read.

- **`ReadingMemoryTracker`** writes it. Like `ArticleTracker` it owns no scroll listener — the
  page measures itself once — and it writes on a 2s settle, so scrolling through an essay does not
  save fifty times. Two effects, not one: the settle effect re-runs on every frame and its teardown
  must *not* save (that would invert the debounce), while a second effect reads nothing reactive,
  so its teardown is the real departure. `pagehide` covers the exits no teardown sees — a closed
  tab, and a page entering the back/forward cache.
- **`ReadingMemoryNudge`** is the blue band at the head of an essay you have started. Dismissed per
  *session*, not for good: closing it deals with this visit, and a reader returning tomorrow still
  deserves to be told.
- **`ReadingMemoryGutter`** is the bookmark itself — a dot in the margin at the section, and a hard
  blue rule across its head. The heading comes from the post's markdown, so the component marks it
  with `.memory-resume` (styled in `app.css`) and unmarks it on the way out, rather than writing
  inline styles into an element it does not own.

`PickUpWhereYouLeftOff` puts the list on the home page, above the masthead — it renders nothing at
all when there is nothing to resume, which is every first visit. Production's "see your sky ✦" link
is dropped: it goes to `/constellation`, which is not a URL here — the sky is a section of
`/[lang]/reading-room`.

**An entry stores its essay's locale**, and that is not decoration. A slug belongs to exactly one
locale, so a resume link built from the *reader's* locale 404s the moment the two differ — a
Vietnamese reader resuming an English essay. `entryLang()` prefers the recorded locale, falls back
to the slug's own `-en` / `_vi` suffix (which is what entries written by production have), and only
then to the reader's.

`lastSeen()` takes its labels from the i18n catalogue rather than hardcoding two languages the way
production must, having nowhere else to put them.

**Study and flow** are a CSS switch (`data-reading-mode` on `<html>`), not a different tree:
changing your mind mid-essay must not rebuild the article under you, or you lose your place.
Flow widens the column and hides everything marked `.flow-hide` — the tag row, the deck, the
weather strip. Flow is for a reader who already committed.

The mode, the cursor and the "N min left" estimate are three of the eleven reader settings — see
**Reading preferences** below for the rest, and for how any of them reach the prose at all.

> **Deliberately unlike production.** There, the site header is *replaced* on an article by a
> fixed running head carrying contents · flow · search · theme · print · folio. This edition
> already has a real header with search and the display settings, so a second fixed bar would
> only duplicate them. Instead the vertical folio at the right page edge became live — it names
> the section you are in and the folio numeral — and the way into the contents stands at the
> head of the fore-edge rail. Production's `TableOfContents` also runs its own
> `IntersectionObserver`, which only fires once a heading *crosses* its band; open the contents
> without scrolling first and nothing is marked. Here it takes the article's `activeSection`.

**The contents are build-time data.** `src/lib/content/toc.js` is a remark pass that writes
`toc` into the frontmatter bag next to `words` and `reading`: one entry per `##`, each with its
own `readMinutes` at the same 220 wpm the post is counted at (it imports `text()` from
`reading-time.js` so the two counters cannot disagree). The length of a section is a property of
the text, not of the viewport.

The ids come from `github-slugger` fed **every** heading in document order — including the `###`s
that never become entries — because that is exactly what `rehype-slug` does to the rendered page,
and its duplicate counter has to have seen the same headings in the same order. The search
corpus holds to the same rule. Nothing in the build fails when they drift; the anchors just
scroll nowhere. So:

```bash
pnpm build && node scripts/check-anchors.mjs
```

The pass runs after `remarkMath` and before the two mark passes: after, so a heading with `$x$`
slugs off the same string `rehype-slug` will see; before, so it never reads a heading that has
picked up a `<Term>` or an `<R>`.

## The open draft

**Bản nháp lộ thiên** — a piece left out in the open while it is still being written, with every
earlier save still reachable. Built to `maxubrq/project/pages/InkDraft.jsx` (SFIM, T4). It is not a
teaser and it is not `draft: true`: those two are opposites here, and independent. `draft: true`
means *unlisted, but it still builds*; an open draft is unfinished **and** listed, on purpose.

The whole feature exists to keep one promise — **nothing is edited silently**. Every change leaves
a readable scar, and every past version can be pulled back, including the embarrassing ones.

### Where the data comes from

Two halves, and the split is the point.

`openDraft:` in a post's frontmatter is the author writing, by hand, where the piece stands *today*:
the note pinned to this save, and the state of each section (`settled` · `editing` · `notes`). It
travels with the prose, in the same commit.

```yaml
openDraft:
  startedAt: '2026-08-16'
  promise: 'chưa hứa'
  note: 'quay câu cuối về phía người đọc. còn mục V.'
  sections:
    - label: 'I. Ba nhóm trẻ và hộp bút màu'
      state: 'settled'
    - label: 'V. Vậy thì làm gì với chuyện này'
      state: 'notes'
      notes:
        - 'Cẩn thận: mục này rất dễ trượt thành một bài self-help.'
```

The history is **read out of git** by `scripts/drafts.mjs`, which writes `src/lib/drafts.data.js` —
generated, and **committed**, exactly as `scripts/halftone.mjs` commits its plates:

```bash
node scripts/drafts.mjs              # every post carrying openDraft:
node scripts/drafts.mjs 003-pure-joy-vi
```

Reading git at build time is the obvious alternative and it is a trap: Vercel clones shallow, the
history would come back empty, and the page would quietly claim the piece had never been touched.
A draft that lies about its own edits is the one bug this feature cannot ship with.

Because each revision is read from the frontmatter of *its own commit*, a past note says what the
author thought that afternoon rather than what they would say about it now, and travelling back
rolls the section table back with the prose. **Every commit is an edit; only a commit whose
frontmatter carries a `note` is a saved revision** a reader can stand on — which is why the rail
draws twenty-three ticks and six stops rather than six of each.

### The diff

Computed, never authored. `scripts/drafts.mjs` aligns two revisions paragraph by paragraph (LCS over
the paragraph text), pairs the changed ones by similarity, then diffs the pair word by word. Two
constants carry the legibility, and both were tuned against real revisions:

- `KEEP = 0.5` — below this the two paragraphs are unrelated blocks, not one paragraph edited.
- `REWRITE = 0.5` — past this share of a paragraph changing, a word-level diff reads as confetti,
  so the paragraph is shown as what it honestly is: the old one struck out, the new one whole.

A run of changed paragraphs is paired in order with a forward-only pointer, so a revision that
reworks four paragraphs in a row does not read as four deletions followed by four unrelated
blocks — and a deletion that is stepped over is printed where it stood.

### On the page

The head (`OpenDraftHead`) carries the flag, the state table, the rail, the note pinned to the save
you are standing at, and the scar layer's switch. Everything in it is read from *that* revision:
standing at an old save under today's verdict about it would be the dishonesty the feature exists to
avoid.

Where the reader is standing is **not** in the load function. The page stays prerendered static
HTML at the current text; `?r=r02` is applied and written client-side, which is all a shareable link
needs.

**Past revisions are not compiled mdx.** Six historical versions cannot be run through mdsvex, and
diffing compiled HTML is a worse problem than the one being solved, so a component survives as the
kind of block it was (`aside`, `quote`, `fleuron`) and its text is typeset to match approximately.
The current revision always renders as the real essay, components and all.

While the reader is travelling, everything that speaks about the live essay stands down: the
trackers, the reading memory, the nudge, the weather, the fore-edge and the whole apparatus
(one sentence · glossary · sources · the letter box). A nudge saying *3 minutes left* over prose
that no longer exists is measuring the wrong text. The `■` is not printed at all — an open draft
has not earned it.

### The loop, per revision

The rhythm is: write, pin a note, commit, amend. Nothing else is required, and
nothing has to be remembered — the hooks are wired by `pnpm install` (`prepare`
points `core.hooksPath` at `.githooks/`).

1. **Edit the prose** in `content/posts/<slug>.mdx`.
2. **Say where it stands** in the same file: `openDraft.note` for this save, and
   move any section whose state changed. Leaving `note` empty is a real choice —
   the commit still counts as an *edit* (a tick on the rail) but is not a *save*
   a reader can stand on. Use it for a typo pass.
3. **Commit.** The post-commit hook regenerates `src/lib/drafts.data.js` and
   stages it, then asks for one command:

   ```bash
   git commit --amend --no-edit
   ```

   The amend fires the hook again, the script produces identical bytes, and it
   goes quiet. That is why nothing generated keeps the commit's sha — a sha
   changes under an amend, and the file would never settle.
4. **Push.** The pre-commit hook refuses any *other* commit while the data module
   is behind git, so a skipped amend cannot ship. A commit that touches a post is
   exempt from that check, since its own revision cannot exist yet.

Doing it by hand is the same thing without the hooks: `pnpm drafts` after the
commit, `pnpm drafts:check` to ask whether the committed file is current.

**What the page reads live, and what it reads from history.** The head is keyed
off `openDraft:` in the frontmatter, not off the data module: a piece is an open
draft from its first line, and the flag, the state table and the unwritten
sections print before any save has been annotated. The rail waits — it appears
once there are two saved revisions, because a history of one save is not
somewhere else to stand. The newest save's note, section states and length come
from the frontmatter and the build-time word count too, never from the data
module. So an edit in progress is
already true on the page in `pnpm dev`, and a forgotten amend leaves the rail one
stop short rather than describing the prose under it wrongly. The data module is
only ever asked about the past, which is all it knows. The rail labels its last
stop **now** rather than by id for the same reason: the live prose can be an edit
or two past the last save that was annotated.

### Finishing one

There is no `done: true`. Set every section to `settled` and the piece stops
being a draft on its own: `isSettled` lets it into the feed, and the head has
nothing left to report. Delete the `openDraft` block when you want the furniture
gone as well — the history stays in git either way.

### What it costs the rest of the site

- **The archive** lists it with `still being written` where the reading minutes would be.
- **The feed leaves it out** until every section is `settled` (`isSettled` in `$lib/drafts`). A piece
  edited twenty-three times would otherwise arrive twenty-three times. Sections all settled is the
  only finish line this feature recognises — no `done: true` to forget, no date to miss.
- **Marks go fuzzy, not missing.** `ReaderMarks` records the revision a mark was made at, and a mark
  whose sentence is no longer in the prose is listed under the essay with the version it was made
  at, rather than silently failing to draw. The test is whether the quote occurs in the text at all
  — deliberately not whether `wrap` succeeded, since `wrap` also declines a quote that crosses an
  inline element, and that mark is present, merely undrawn.

## Reading preferences

Eleven settings, all device-local and never sent anywhere. `/[lang]/reading` is the room where
all of them live, with a sample that answers the moment you touch a control; the header's display
dropdown carries the six worth taking mid-sentence: theme · notes · framing · mode, and the two
in-article instruments. Both surfaces edit the same store, so neither can show a stale value.

The storage keys are production's — `font-size`, `line-spacing`, `measure`, `typeface`, `theme`,
`theme-auto`, `reading-mode`, `reading-ruler`, `time-left`, `layout`, `framing` — so a reader with
both editions open keeps one setting.

**Everything lands on `<html>`**, `data-*` for the switches and custom properties for the numbers,
which is why `applyPrefs()` is the only call needed to make a change visible everywhere at once:

| setting | lands as | read by |
| --- | --- | --- |
| text size · line spacing | `--reading-fs` · `--reading-lh` | `.prose` in `PostBody.svelte` |
| typeface | `data-typeface` → `--reading-font` | `.prose`; the chrome never changes face |
| measure | `data-measure` → `--measure` → `--article-w` | the article's column *and* the fore-edge rail, which is anchored to `--article-w` so it moves with the text |
| theme · theme by clock | `data-theme` | `app.css` |
| mode | `data-reading-mode` | `.flow-hide`, and the column |
| cursor | `data-ruler` | `.ruler-block` |
| notes | `data-layout` | `Sidenote.svelte` |
| framing | `data-framing` | `.interactive-plate` on `DiagramPlate` |

Heading sizes in the prose are `em` of the reading size, not px: at 26px body copy a fixed 22px
`h3` would be *smaller* than the paragraph under it and the hierarchy would invert.

Four things are easy to get wrong here, and all four were:

- **Never read reactive state inside `hydrate()`.** It is called from an `$effect`; an effect that
  reads a piece of state and then writes it re-triggers itself, and Svelte answers with
  `effect_update_depth_exceeded` and *stops updating the page*. Every control still works, the
  values still save, and nothing on screen ever changes again. It is guarded by a plain
  (non-`$state`) flag for the same reason.
- **"No theme chosen" is a state, not a gap.** With nothing stored, the blocking script stamps no
  `data-theme` at all so the CSS can follow `prefers-color-scheme`. `applyPrefs` therefore takes a
  `stampTheme` flag: without it, changing the *measure* would stamp `light` on a reader whose
  system is dark and flip the page under them. The controls show the system's theme in that state,
  because a `light` chip lit over a dark page is the site lying about itself.
- **`--article-w` has to follow the measure.** Fixed at 940px, the widest step was capped at 852px
  of text and the control silently did half of what it said.
- **A component's scoped rule outranks a plain one from `app.css`.** `DiagramPlate` carries no
  margin of its own precisely so `.interactive-plate` can own it; had it kept one, `framing` would
  have done nothing.

## Images

No full-colour photography anywhere (§6): an image is a **cyanotype plate** — greyscale under a
blue multiply, done in CSS by `DuoPhoto` / `.ink-duo`, so almost any photo reads as deliberate.

The one exception is the cat on the 404 page (`static/media/404-cat.webp`), and it is an exception
because §6 is about *photography*: a drawing is already a deliberate object and has nothing to be
rescued from. It keeps the hard border every plate gets, its `alt` is empty because the headline
beside it says the same thing in the reader's own language (the sign in the picture only says it in
English), and it is shown for **404 only** — a 500 is the site's fault, not a wrong turn, and a
cartoon apologising for it would be the wrong register.

Images are **served from Cloudinary**, the same account and the same contract as the production
blog. A post names its cover in frontmatter as a plain delivery URL — no transformations in the
URL an author writes:

```yaml
coverImage: 'https://res.cloudinary.com/dmsb4anlx/image/upload/v1784555137/maxubrq.space/x.jpg'
```

`src/lib/images.ts` adds the rest. Production does this through `next/image`'s custom loader;
this edition has no image component to hook, so the same rewrite is explicit:

```svelte
import { cloudinary, coverImageFor, srcsetFor } from '$lib/images';

const cover = coverImageFor(post.coverImage);   // → the branded default when unset
cloudinary(cover, { width: 1080 })              // → …/upload/f_auto,q_auto,w_1080,c_limit/v1/x.jpg
srcsetFor(cover)                                // → the same at every width in IMAGE_WIDTHS
cloudinary(cover, { width: 1080, halftone: 'screen' })   // → … + /e_grayscale/e_ordered_dither:8/
```

`f_auto` picks the format per browser, `q_auto` the quality, `c_limit` never upscales and keeps
the aspect ratio (`object-fit: cover` does the visual crop). Anything that is **not** a
Cloudinary delivery URL passes through both helpers untouched, and `srcsetFor` returns
`undefined` for it — a local plate has one size and must not claim others. `DuoPhoto` calls both
for you; pass it a `sizes` and, for a cover above the fold, `priority`.

Nothing is proxied and nothing is resized at build time: the browser fetches Cloudinary directly,
which is why the whole site can stay prerendered static HTML.

### Halftones

The other treatment is a **1-bit halftone**: dots instead of a duotone (§2). There are two ways
to get one, and they are not interchangeable.

**At the CDN — the default.** Pass `halftone` and Cloudinary screens the image with its own
ordered-dither, after the resize, so the pitch is in final pixels:

```svelte
<DuoPhoto src={cover} halftone="screen" />   <!-- or "coarse" · "fine" -->
```

`screen` is 8×8 at 45°, the offset plate; `coarse` is the same angle with bigger dots; `fine` is
a 6×6 round dot, orthogonal, closest to newsprint.

A halftone plate uses `.ink-screen` instead of `.ink-duo` — no blue multiply, because the screen
is already the whole treatment. **The colour is put on in CSS, not at the CDN**: Cloudinary
returns one 1-bit black-on-white plate, and two blend modes ink it per theme, so switching theme
re-colours the plate without fetching anything.

| token | day / dusk | night |
| --- | --- | --- |
| `--screen-ink` | `--blue` | violet `#a97ef0` — on ink paper the blue is already spent on text |
| `--screen-blend` | `multiply` | `screen` |
| `--screen-ink-blend` | `lighten` | `darken` |

The container's background is `--paper`, so the plate's field is the page's own paper — never a
white rectangle pasted onto warm or ink stock. The `::after` floods the plate with the ink and
the second blend admits it on the dots only. Both blends need `isolation: isolate`, which
`.ink-screen` sets; without it the page behind joins the blend.

It costs nothing: the screened output is *smaller* than the photo it came from (≈24 KB vs 381 KB
for the default cover at 700px), and it reaches images that only exist on Cloudinary.

Two things it cannot do, which is why the script still exists: the dot pitch is per-`srcset`-width,
so a 1× and a 2× screen do not match dot for dot, and the plate lives only in the browser — no
fixed artefact for an OG image, a feed, or print.

**Offline — for a fixed plate.** `scripts/halftone.mjs` screens a local PNG once, by hand, and
the result is committed. Same idea, exact and reproducible.

```bash
node scripts/halftone.mjs in.png static/media/out.png [--pitch 9] [--scale 3]
                                                      [--gamma 1] [--contrast 1]
```

It turns a PNG into a 45°-rotated dot screen the way an offset plate does: one dot per grid
cell, dot radius tracking the cell's darkness, no intermediate grey surviving. Output is a
1-bit greyscale PNG, and it prints the new dimensions, file size, and ink coverage.

| flag | default | what it does |
| --- | --- | --- |
| `--pitch` | `9` | grid step in **output** pixels — larger is a coarser, more visible screen |
| `--scale` | `3` | output size relative to the source; the dots need pixels to stay round |
| `--gamma` | `1` | `<1` opens the shadows, `>1` deepens them, before screening |
| `--contrast` | `1` | pushes tones away from mid-grey, before screening |

Two things to hold on to:

- **Run it once, by hand, when preparing the asset — never at build time.** Commit the result to
  `static/media/`, so Vercel needs no image library and the prerendered HTML ships the final PNG.
  A halftone is already 1-bit and tiny; it gains nothing from Cloudinary's pipeline.
- It only depends on `node:zlib`, and only reads 8-bit non-interlaced RGB/RGBA/greyscale PNG (no
  palette). `sips -s format png in.jpg --out in.png` on macOS produces an acceptable input.

## i18n

Every page lives under a locale prefix — `/en/…` and `/vi/…`, matched by `src/params/lang.ts`.
`/` carries no content — it decides which edition the reader gets, in `src/routes/+page.server.ts`:
the locale they last read in (a `lang` cookie, written by the `[lang]` layout on every locale
page), then `Accept-Language`, then `site.defaultLang`. It is the one page that cannot be
prerendered, and it answers **307, never 308** — a permanent redirect is cached by the browser
forever, which would let the very first visit decide a reader's language for good. Each locale is its own
edition: it lists only the posts whose frontmatter `lang` matches, has its own feed
(`/en/feed.xml`, `/vi/feed.xml`), and stamps `<html lang>` via `src/hooks.server.ts`.

UI strings live in `src/lib/i18n/messages.ts`, two catalogs of the same shape (TypeScript enforces
it: `vi` is typed as `typeof en`). Most values are lifted verbatim from the production blog's
`messages/{en,vi}.json`; keys marked `// ink` are this edition's additions — the accent words the
hand-drawn marks lasso, and the footer triplet.

Read the active locale in any component, including ones used inside MDX:

```svelte
import { useI18n } from '$lib/i18n';
const i18n = useI18n();
const t = $derived(i18n.t);   // i18n.lang · i18n.other
```

Build links with `href(lang, '/writing')` — paths are always authored locale-less, and
`swapLocale()` moves the current path to the other locale. The context holds *getters*, not
values, because the `[lang]` layout instance survives a client-side navigation from `/en` to
`/vi`.

Topic slugs and `topic` names stay canonical English (they key the frontmatter and the URLs);
only their blurbs are translated, in `topicBlurbs`.

## Search

Universal search over the whole locale, opened by the header button or **⌘K / Ctrl-K** anywhere.
Three kinds of hit, the same three the production blog indexes: an **essay** (title, excerpt,
topic), a **section** (one `##`/`###` heading), a **passage** (one paragraph, first six per post).
Arrows move, `↵` opens, `esc` closes; a section hit lands on that heading's anchor.

Nothing runs on a server here, so the corpus is a **build artefact**: `src/lib/content/search.ts`
globs every post's raw `.mdx` and `/{lang}/search-index.json` prerenders it, next to `feed.xml`.
Post metadata comes from the compiled modules (mdsvex already parsed the frontmatter); only the
body is re-read, to split it into sections and passages.

Two costs kept off the critical path: the JSON is fetched the first time search opens, and
`SearchOverlay.svelte` is itself dynamically imported by the layout — so MiniSearch reaches the
browser only for readers who actually search. The built index is cached per locale in module
scope, so reopening does not refetch.

**Anchors.** `rehype-slug` stamps every heading id at build time, and the corpus runs the same
`github-slugger` over the same headings in the same order — including headings that never become
results, because the slugger's duplicate counter has to see what rehype-slug saw. If they drift, a
section hit scrolls nowhere. Worth re-checking after changing either side:

```bash
# every section anchor in the index must exist in the rendered page
node -e "const j=require('./.svelte-kit/output/prerendered/pages/en/search-index.json'),fs=require('fs');
console.log(j.sections.filter(s=>!fs.readFileSync('.svelte-kit/output/prerendered/pages/en/writing/'+s.slug+'.html','utf8').includes('id=\"'+s.anchor+'\"')).length + ' broken')"
```

**Matching** is [MiniSearch](https://lucaong.github.io/minisearch/), not the substring scan
production uses: prefix matching while you type, `fuzzy: 0.2` for a typo, and field boosts so a
title outranks a paragraph. Two settings are there for Vietnamese specifically — `processTerm`
folds diacritics on both sides so `cong ty` finds `Công ty`, and `combineWith: 'AND'` keeps that
from matching half the corpus (folded Vietnamese syllables are short, and an OR query on `ty`
matches nearly everything).

## Layout of the code

```
content/posts/            the posts (.mdx)
static/media/             committed plates — the halftones, and the 404 cat
scripts/halftone.mjs      offline halftone screener; run by hand, never at build
scripts/check-anchors.mjs every TOC anchor must exist in the rendered page; run after a build
src/app.css               the tokens — palette, type, layout constants, dark mirror
src/lib/images.ts         Cloudinary delivery — the cover default + the URL/srcset rewrite
src/lib/site.ts           name, volume, topics, links, default language
src/lib/i18n/             the en/vi catalogs + the locale context
src/lib/content/search.ts the search corpus builder (build-time only)
src/lib/glossary.ts       the site dictionary (data in glossary.data.js)
src/lib/resources.ts      the bibliography (data in resources.data.js)
src/lib/content/remark-*.js  the passes that mark terms, citations and outbound links
src/lib/server/db/        drizzle schema + the lazy Postgres client (never client-side)
src/lib/server/api.ts     shared endpoint guards: 503 / 400 / opaque 500
src/routes/api/           the six prerender-exempt endpoints
src/lib/search.svelte.ts  whether the search overlay is open, + the ⌘K binding
src/lib/reading.svelte.ts the reader's settings, live — the store both surfaces edit
src/lib/reading-prefs.ts  every device-local reader setting + the <html> stamping
src/lib/reading-progress.svelte.ts  one scroll listener: progress · active section · per-section
src/lib/session.ts        the reader's session id (a uuid, for deduplicating counts)
src/lib/reading-memory.ts where you stopped, per essay — device-local, never sent anywhere
src/lib/content/toc.js    the contents, with per-section reading minutes (build-time only)
src/lib/components/chrome/  SearchButton, SearchOverlay, DisplaySettings, Placeholder
src/params/lang.ts        the /en · /vi route matcher
src/lib/format.ts         the printed-document date/number voice
src/lib/content/          post loading, frontmatter contract, mdsvex layout + plugins
src/lib/components/ink/   the theme kit: Tag, Scribble, Underline, ArrowMark, DuoPhoto,
                          ResourceCover, RunningHead, MetaRail, MetaFoot, Headline,
                          IndexRow, FilterBar
src/lib/components/article/  PullQuote, Callout, Sidenote, Footnote, Fleuron, OneSentence,
                             WeatherStrip · Term and R (the marks) ·
                             Bibliography and GlossaryFootnote (the apparatus) ·
                             the reading instruments: ForeEdge, TableOfContents,
                             TocDrawer, MobileReadingBar, ReadingRuler · ArticleTracker ·
                             ReadingMemoryTracker / Nudge / Gutter
src/lib/components/home/     PickUpWhereYouLeftOff
src/lib/components/tech/     CodeBlock, Terminal, DiagramPlate
src/routes/[lang=lang]/   /{en,vi} · /writing · /writing/[slug] · /topics · /topics/[topic] ·
                          /glossary · /resources · /reading · /about · /feed.xml ·
                          /search-index.json · placeholder rooms
                          (/ negotiates the locale — the only non-prerendered page)
```

Design tokens live only in `src/app.css` as CSS custom properties, so dark mode is a token swap
and components never hardcode a colour. Two laws from the manifesto that are easy to break:
the *fields* are softened (paper `#fafaf7`, ink `#24242c`) but **rules stay pure black**, and
everything is a rectangle — `border-radius: 0` is set globally.

## Topics

A topic is a **room with an editor in it**, not a filter over the archive. `src/lib/topics.ts`
holds all six — name, tagline, an editor's note, three hand-picked ways in, and a scratchpad of
what is being thought about — copied from the production blog so both editions say the same thing
about the same room. `/[lang]/topics` is the hub of doorways; `/[lang]/topics/[topic]` is the room:
siblings strip · masthead · editor's note · starters · scratchpad · everything else filed here,
newest first.

**`id` is not `name`.** The id keys the URL and the frontmatter match and is never translated; the
name is printed and always is. That separation is what lets `/vi/topics/science` be titled *Khoa
học* without a Vietnamese essay having to write `topic: 'Khoa học'`, and it is the one place this
edition changed its mind — the names used to stay English on the grounds that they key the URLs,
which conflated the two jobs. The archive's filter bar carries ids for the same reason: switching
language mid-filter keeps the filter.

A post files itself by writing `topic` in its frontmatter, and `frontmatterTopics` is the list of
spellings a room answers to, matched case-insensitively. This edition's `tech` is production's
`software` and accepts both words, so an essay crosses between the editions without an edit.

The editor's note is set by the room's own `tone` (`clinical-warm` · `plainspoken` · `literary` ·
`sparse`), which is the **only** body size on the site that is a property of the subject rather
than of the reader's settings. One measure governs the paragraphs and the signature both: a "— m."
set to the edge of a wider box than the prose it signs belongs to the page, not to the note.

`site.ts` used to carry a `topics` list with its blurbs off in the i18n catalogs; both are gone,
and `topicBlurbs` with them. Nothing about a topic belongs in the chrome's own config.

### The department plate

On a wide screen the whole page was a left-aligned column on a 1568px canvas — the masthead's
title stops around 345px, the note's measure around 500px — so the right of the page read as
unfinished rather than as margin. `plate` in `$lib/topics` fills it: **a cell of the page's grid,
divided by the same 1.5px hairline the hub's doorways are divided by**, not a picture floated into
a gap. That is why the masthead and the note are wrapped in one `.room` grid — a plate beside the
note alone has only the note's height to work with, and no honest ratio fills a page that wide from
a 380px column. Spanning both gives it the vertical run a department page actually needs.

The picture **fills its cell rather than setting it**: `aspect-ratio` is dropped and `object-fit:
cover` does the crop, which is what makes the plate's rule and the note's rule land on the same
line (the note is `flex: 1` in its column for the same reason). Any aspect can be dropped in
without the layout caring. Below 1080px the plate stands down and the note takes the width back —
it is the one element on the page that is atmosphere rather than reading, and a magazine drops its
department art on a narrow page too.

**No `alt`, on purpose** — the same reasoning as the 404 cat: the note beside it already says what
the room is, in the reader's own language. That also settles what would otherwise be awkward, since
an image is not translated but a description of one would have to be.

All six rooms currently declare a plate with **no `src`**, so each draws `DuoPhoto`'s labelled
placeholder naming the picture it is waiting for — the slot is visibly reserved, the way the
unported live figures are. To fill one, add a plain Cloudinary delivery URL (no transformations;
`$lib/images` adds those) and optionally `halftone: 'screen' | 'coarse' | 'fine'` for newsprint
instead of the cyanotype. Delete a room's `plate` entirely to take the column back.

### `starters` and `scratchpad` are empty on purpose

Every room's arrays are `[]`, and that is a decision, not an unfinished port — they go back in once
the archive is thick enough to choose from. Both sections claim something four posts cannot support
honestly: *if you read three* implies there were more than three to pick from, and a scratchpad of
six drafts beside four published essays advertises a backlog rather than a body of work. **Each
section renders nothing while its array is empty**, so a room today is masthead · note · what is
filed here, and reads as finished rather than as scaffolding. The tail's heading follows the same
rule — `also filed under X` only when the starters stand above it, plain `filed under X` otherwise.

Production's text is what to start from when they return: `~/MyApps/maxblog/src/lib/topics.ts`,
three starters and about five scratchpad items per room, each with a `vi` twin. Nothing else has to
change — the types, the components, and the tail's de-duplication (a starter's essay is not
repeated below it) are all still wired.

## The reading room

**Deliberately unlike production**, and this is the one page where the two editions disagree about
what the room *is*. There it is a hub: six doors with counts printed on them, each leading to its
own page. Here everything is shown, one section after another, on a single page — a door that only
says how many things are behind it makes the reader click to find out what they are, and the room
is the reader's own, so there is nothing to tease. `/shelf` is therefore not a URL in this edition;
the shelf is a section of `/[lang]/reading-room`. None of production's door/blurb/count strings
apply, so only the masthead and the colophon were lifted.

**The room is empty on the server.** The loader hands over the catalogue — every post in this
locale — so a spine can be lettered with a live title; *which* of them you finished is read out of
your own device after mount. Nothing about a reader is ever rendered on a server, which is what
lets the page stay prerendered static HTML like every other.

`spines` is `null` until the device has been asked, and that is not the same as empty: rendering
"your shelf is still empty" on the first frame would tell a reader with a full shelf they had read
nothing.

**One closing line for the whole room, not one per section.** Production gives the shelf its own
colophon; here the section's deck and its `finished only · opening earns nothing` tag already say
how a spine is earned, so repeating it below the plank was the same sentence twice. The room's line
— how any of this got here, and where it lives — runs the **full width** of the page rather than to
a measure, because it closes the page instead of belonging to the section above it. Each new
section adds its own deck, not its own colophon.

### The read shelf

Opening a piece earns nothing. A spine appears the moment you reach the last line, never at a
percentage — `$lib/shelf` reads `reading_memory` and keeps only `finished` entries, which makes it
the exact opposite of `PickUpWhereYouLeftOff`: that lists what you have *started* and drops an
essay the moment it is finished. Between them they account for every entry in the store.

A spine's dimensions are seeded from a **hash of its slug**, not from its position in the list. The
design did the latter, which would reshuffle the whole shelf every time you finished something new
— a real shelf does not resize its books.

Two details fall out of the join rather than needing a rule. The catalogue is one locale's posts,
so an essay finished in the other locale simply does not appear rather than appearing with a link
that 404s. And in dark mode the palette inverts the `light` flag by itself: `--paper2` spines go
dark and `--ink` spines go light, so the row still breaks up, just the other way round.

`TONES` carries both `Tech` and `Software`, because the store is shared with production and a spine
may have been finished on either edition.

It prints: the row wraps into stacked shelves instead of being guillotined at the margin, and the
blue plank edge goes black — a colour cartridge should not be spent saying what the rule already
says.

### Your constellation

Every essay you have opened drawn as a star, joined by a thread in the order you read them, with an
essay's hand-picked `neighborhood` as the citation edges. The layout is a **force simulation**
rather than an authored diagram, and it has to be: the set of essays is different for every reader,
so there is no arrangement to draw in advance. Domains ride a stable ellipse and each star is
pulled toward its own, so the sky opens into regions instead of one blob that slowly separates.

`d3-force` positions the stars and `d3-shape` draws the lines between them; both are `import()`ed
inside their effects — the same discipline `SearchOverlay` uses for MiniSearch — so a reader who
never opens the reading room pays for neither. They land as two chunks, 15.3 KB and 6.2 KB.

That second number is the reason **`d3-shape` is destructured** rather than taken as a namespace:
`import('d3-shape').then((d3) => …)` reaches its bindings by property access, which defeats
tree-shaking and shipped the whole module — every curve, arc, symbol and stack — at **32.2 KB**.
Naming the two imports brought it to 6.2 KB. `d3-force` keeps the namespace form on purpose: seven
of its nine exports are used, so there is nothing to shake off.

**A library that did layout *and* edges was considered and rejected.** Cytoscape.js, vis-network
and Sigma.js all do both, and all render to canvas or WebGL — which cannot read the CSS custom
properties this site's theming is built on, prints as a bitmap, weighs 10–300× the two d3 modules,
and arrives with rounded, arrow-headed, shadowed defaults that argue with the manifesto. The
deciding point is narrower than any of that: the line that looked wrong is the **reading-order
thread**, which is not a graph edge at all — no graph library models a path through nodes in the
order a person visited them, only relations between them. The one thing that needed fixing is the
one thing they do not own.

The thread is a **centripetal Catmull-Rom spline**, not a polyline. Reading order is not a spatial
relation, so straight hops between stars read as a route drawn on a map; one continuous curve reads
as a line drawn between stars. `alpha(0.5)` is the variant that cannot form a cusp or a loop when
two stars land close together. Its ends are trimmed back by a star's radius so it joins the stars
rather than skewering them, and a citation is a shallow arc rather than a chord — two essays that
cite each other *and* sit next to each other would otherwise hide their edge under the thread.

**Every position is read through one derived `Map`**, and that is not tidiness. `nodes` is `$state`,
so its members are proxies, while the simulation mutates the raw objects underneath. An earlier
version also kept a `Map` of the raw ones: the stars rendered from the proxies, the thread was
computed from the raw array, and the two drifted apart — the thread hung several pixels off its own
stars and stayed there once the simulation settled.

An essay you have read pulls its neighbours into the sky even when you have not opened them: the
chart is where you have been *and* what stands next to it. That is what the open circles are.

**The concepts layer is not here**, and this is a data judgement rather than an unfinished port.
Production floats a concept at the centroid of the essays that invoke it and fills it as you finish
them, hiding any concept with fewer than two members present. Checked against this edition's
corpus, all four of production's concepts have **at most one** member here — so the layer would
render nothing at all, while still costing a data file, a toggle, a legend row and a tally.
Production's own `concepts.ts` header calls its membership "a STARTER SET… treat this as a first
pass to correct, not as a finding", so porting it would also be publishing someone's uncorrected
guesses as the author's concept map. `layers` is an object rather than a boolean so putting it back
is a key, not a rewrite.

Two things read as sparse rather than broken today, and both are corpus, not code: with no post
carrying `neighborhood` in its frontmatter there are no citation edges yet, and with two posts per
locale a full sky is two stars and a thread.

Production's plate carries its own title because it *was* the whole page; here the section above it
does the naming, so the plate keeps only its chart and its legend — and the domains toggle moved
into the legend, since both answer "how do I read this chart".

### A note on the scribble

`Headline`'s scribble is an ellipse of fixed proportions, so it only wraps an accent of about the
width it was tuned for. On a wide accent it lassoes the air above the word and strikes through the
letters. `markTop` / `markLeft` are now props (defaulting to the old hardcoded values, so no
existing headline moved) — but this room's accent is `room.` in one locale and `đọc.` in the other,
and one geometry strikes through one of them whichever way it is set, so it uses `mark="underline"`
instead. An underline hangs off the baseline: a width that is a little wrong over- or under-runs
the word rather than crossing it.



## About, and the vault

`/[lang]/about` was already close to production; what it was missing is the **door**.

Its content column is production's proportions — a 270px rail and the rest, at 90% of the page —
and deliberately **not tied to `--measure`**. That token is the *reader's* article width
(700/820/940 by preference), so letting it govern here made a colophon obey a setting meant for
prose: the page got narrower because someone chose a narrow measure for reading essays. Two things
that follow from the same cascade are worth knowing, because both were bugs: `.measure p` sets
18px, so the sign-off has to be qualified as `.measure p.thanks` or it prints at body size (the
`!important` that used to sit on its margin was the tell), and the page ends on 120px of air rather
than on its last rule.

The vault is
deliberately **not in the nav** — the only way in is the panel at the foot of `/about`, and a
private cabinet with a menu entry is not private, it is a section. The page also carries
`robots: noindex, follow`: reachable, not advertised.

`/[lang]/vault` is a **timeline grouped by the year a thing entered the collection, not by kind**,
and that ordering is the whole argument. Sorted by kind it is a list of favourites, which every
site has; sorted by arrival, a record and a paper from the same year stand next to each other and
the shelf becomes a chronology of what changed the author's mind, and when. `added` is when it
reached me, `made` is when the work was made — never the same axis, and the page is built on the
first.

The newest two years stay open and the rest fold away; `toggled` records only the years the reader
has clicked, so changing the medium filter re-derives sensible open/closed state rather than
stranding a year open because of a click on a different list.

**The spine takes one change from production.** A dense year flows into two columns, but a second
column of entries needs a second spine — otherwise its nodes hang in the air marking a line that
was never drawn, which is what production ships. `column-rule` draws it, and the 11px `column-gap`
is not arbitrary: the rule sits at the centre of the gap, so a gap of exactly one node's width puts
it under the second column's nodes the way the border does under the first. The visible gutter is
that 11px plus the 30px each entry already holds clear for its own spine. The node is the one
circle on the site — a timeline node is not a rectangle.

Covers go through `ResourceCover` like the bibliography's, so the vault's mixed shelf (jackets,
album art, film posters) lines up on the same fixed 2:3 crop. One plate is a jacket and gets the
full width; two or more are a glance at a place or a course and shrink to fit the row, capped at
four — past that the strip stops being a glance and starts being a gallery.

**One data fix.** In production, *On Writing Well* carries the overjustification paper's `id`, a
copy-paste slip two entries apart. React only warns about a duplicate key; Svelte's keyed `{#each}`
throws, so it is `on_writing_well` here — worth mending upstream, since the two editions are
otherwise the same shelf. Two of the seven media (`Objects`, `Experience`) have no entries yet;
their filter buttons print the empty state, which is honest rather than hidden.

No entry carries a `vi` block, and that is not an oversight waiting to be fixed: the notes are
already written in whichever language the author thought the thought in, and translating a private
note would be writing a new one. `getVaultLocale` is there for the day one genuinely needs both.

## Series

A series is an argument built across an arc, not several posts sharing a tag. `src/lib/series.ts`
is the data layer the rest of the site was missing, and it exists for one reason: **a series has to
describe chapters that are not written yet.** A post can say "I belong to a series"; it cannot say
how long the arc is, what order it runs in, or what a reader should carry from one part into the
next. So the arc is authored in the module and the posts are looked up *from* it — not the other
way round. The frontmatter `series` / `chapter` fields are for the essay's own tag row and are not
the source of the arc.

`resolveChapters` is the whole idea in one function: every chapter is a **declaration**, and its
`fallbackTitle` / `fallbackDate` / `fallbackMin` carry the promise until a post exists to replace
them. An unwritten chapter still prints, still holds its place in the arc, and is simply not a link.
Posts are passed *in* rather than imported — loading them is async here (mdsvex behind
`import.meta.glob`), and reaching for them inside the module would make every caller async for
nothing.

Four surfaces, all wired:

- `/[lang]/series` — the shelf. A row keeps two facts apart: what the author promised (the arc, its
  length, its state) and what is actually written. "2 of 3 written" is the author being honest about
  a contract still being fulfilled, not a progress bar for the reader.
- `/[lang]/series/[id]` — the arc, following `maxubrq/project/pages/InkSeries.jsx`: the **contract**
  for the whole (a sum the individual essays cannot state), the **arc** with the reader's place
  marked, the **bridge**, and the **threads** that recur.
- `SeriesRibbon` at the head of an essay — the smallest honest form of "there is something before
  this and something after". The shape of the arc belongs on the series page, not stacked on the
  prose.

**The bridge is the point of the page.** It is a handoff, not a "next" button: on one side the
`rememberSentence` of the part just finished, on the other the author's own line on what to carry
in, written per chapter in the arc. It only draws once there is something to hand *over* — the
reader has to have finished a part for there to be a bank to cross from.

Only "where you are" is the reader's, and it comes out of reading memory after mount, so the page
is the same static HTML for everyone. `seriesProgress` takes the finished set as an argument and
touches no `localStorage`, so it stays usable on the server. The current chapter is the first one
*not* finished: a series is read forwards, and the place to stand is the first door still shut.

**A chapter only counts in the locale it publishes under.** `viSlug` is optional, so a chapter
without one falls back to the English slug — and `posts` holds every locale, so the lookup *would*
find the English post, mark the chapter as existing, and link to `/vi/writing/<en-slug>`, which
404s: an essay lives at exactly one locale. `resolveChapters` therefore checks the post's own `lang`
before accepting it. An untranslated chapter is simply one that does not exist here yet, and prints
as the promise it still is. Without that check the *build* fails rather than the page, because
`handleHttpError: 'fail'` catches the dead link while prerendering — which is how it was found.

### `SERIES` is empty on purpose

Nothing is finished yet, so there is no arc to describe — the same call as the topics' starters and
scratchpad. Everything above is written and wired; adding one object to `SERIES` lights up the
shelf, the arc page and the ribbon together, and `/series/[id]` starts prerendering (with the list
empty it generates no pages at all, which is correct). Until then each surface draws its empty
state. This was verified with a temporary three-chapter fixture — read / current / unwritten, with
a bridge — and the fixture removed afterwards.

That empty list costs one line of build config. A prerenderable route that produces no pages is
normally a bug (an `entries` export that quietly returned nothing), so SvelteKit fails the build —
and `/series/[id]` generates nothing while `SERIES` is empty, with no link to it to crawl either.
`handleUnseenRoutes` in `svelte.config.js` names that one route and still throws for any other, so
the check keeps its value everywhere else. It cannot go stale: add a series and the route *is*
prerendered, so it stops being reported and the branch is never taken again.

## Glossary

`src/lib/glossary.ts` is the site dictionary: one entry per marked term, with a short gloss, a
long one, a topic, and the essays it appears in — each with the heading it was first used under.
Entries carry a `vi` block; `getGlossaryLocale(entry, lang)` returns one locale with the English
text as the fallback for every field.

**The marks are not written by hand.** `src/lib/content/remark-glossary.js` runs while mdsvex
compiles a post and wraps the *first* mention of each dictionary term in a `<Term>` — later
mentions are left plain, so a page is not a field of dotted underlines. An author writes prose.

```svelte
<Term id="flow" />                          <!-- explicit, when you want it somewhere precise -->
<Term term="widget" def="a small thing" />  <!-- ad-hoc, not in the dictionary -->
```

**The pass records what it marked**, in reading order, onto the post's `terms` metadata — the same
`file.data.fm` handoff `remark-resources` uses for `citations`. `GlossaryFootnote` gathers them at
the foot of the essay: the same short glosses the reader dismissed inline, together, at the point
where there is room to look. Production's `GlossaryFootnote` wraps the whole article and hands a
`collect(id)` down a React context that every `Term` calls on mount, so the list is state that
fills in as the tree commits; here the pass knew before a byte reached the browser, so the
component holds no state, wraps nothing, and server-renders complete.

It prints **A–Z**, like production and like `/glossary` itself — not the reading order `terms`
arrives in. The bibliography directly beneath it *is* in reading order, and the difference is not
an inconsistency: a citation carries a numeral, so its position means something and the prose can
point at it. A word carries no numeral, six unnumbered rows in the order they happened to come up
read as no order at all, and a list of words has an order everyone already knows. The metadata
keeps reading order regardless, because that is what the pass actually observed.

It is the glossary's twin of `Bibliography`, and built the opposite way round. A source belongs to
a post by *declaration* — `appearsIn` names it — so a bibliography prints even for an essay whose
prose carries no marks. A term belongs by *use*: it is in the list because the pass found the word.
An essay that marks nothing shows nothing. Each row links to `/glossary#gl-<letter>`, which is the
only anchor that page has — it is sectioned by letter, not by entry.

The pass also reads hand-placed `<Term id="…">` marks before it starts, and seeds its `seen` set
with them: a word the author placed deliberately must not pick up a second mark somewhere else in
the same essay. Those ids count as first mentions, in the position the author put them.

`/glossary` prints the same entries as an A–Z index. Its loader passes the slugs that actually
publish in that locale, and the page narrows each entry's appearances to those before deciding
what to show: an entry is listed if it still has a live citation, or if it never claimed one (a
word may be defined before it is used, but a word whose every use is a draft has nothing to show).
This is stricter than production, which keeps citations to unpublished posts.

The two-column seam, the folded long gloss and the mark demo are `.ink-gloss-*` in `app.css`
rather than component styles — `/resources` uses the same grid.

## Resources

`src/lib/resources.ts` is the bibliography — books, papers, standards, talks — each with an
author, a type, a topic, an optional cover, and a note on why it earned a place. Only the *note*
has a `vi` translation: a book keeps its published title and an author keeps their name, because
that is how you find the thing.

**Citations are auto-placed too**, by `src/lib/content/remark-resources.js`: it marks the first
mention of a source's title, its main title before a colon, or the first author's surname. What
makes a bare surname safe here is the candidate set — only sources that already name *this* post
in `appearsIn` are considered, so "Sennett" is unambiguous inside one essay even though it would
not be across the library. Organisation authors ("…Accountability Office") contribute no surname.
A hand-placed `<R id="…" />` always wins: the author knows which sentence carries the claim.

```svelte
<R id="ieee-754" />          <!-- explicit, when the auto-match would land elsewhere -->
```

The numeral is the source's position in **this post's** bibliography, so two citations of one work
in an essay share a number and the order follows the curated order in `RESOURCES`. Production
threads the post slug through a React context; here the route already knows it, so `<R>` reads
`page.params.slug` — the article lives at `/[lang]/writing/[slug]`. A source that does not list
the current post shows `[·]` rather than a number that means nothing.

`Bibliography.svelte` puts the sources at the foot of every essay that has any. It needs no
authoring — `appearsIn` already maps sources to posts, so a post's bibliography is a lookup.

**Numbering follows reading order**, and this is the one place the port deliberately diverges
from production. There the numeral is a source's position in the *curated* list, so an essay can
open at `[02]`; here the remark pass records the ids of the marks it placed, in document order,
onto the post's `citations` metadata, and both `<R>` and the end-of-essay list order themselves
with `bibliographyFor(slug, citations)`. Sources cited in `appearsIn` but never named in the prose
follow, in curated order. One function orders both, so a numeral cannot disagree with its list.

`/resources` prints the same entries as an index. It is `/glossary` one level down and shares its
`.ink-gloss-*` grid, folded detail and availability rule; what differs is how a reader looks
things up, so this one groups by **topic** and has no A–Z. Search matches the note *in the
current locale*, not the English original, and citation links are narrowed to the essays that
publish in that locale — a resource citing both `…-en` and `…-vi` shows only the relevant half.

Covers go through the Cloudinary pipeline like every other image; `ResourceCover` renders nothing
when there is no `coverImage`, which is the normal case — a wrong cover is worse than none.

### Why the data lives in `.js`

Both passes run inside `svelte.config.js`, which SvelteKit loads with plain Node — no TypeScript
step. So the entries themselves sit in `glossary.data.js` / `resources.data.js`, JSDoc-typed
against the interfaces next door, and the `.ts` modules re-export them with the types. Same reason
`reading-time.js` is not `.ts`.

One consequence worth knowing: `inject-components.js` decides a post's imports *before* mdsvex
runs, so it cannot see marks that do not exist yet. It asks the two passes in advance —
`mentionsTerm(content)` and `citesAnything(filename)` — and imports `Term` / `R` for them.

## Database & endpoints

Every *page* is prerendered, but that is a per-route default, not a property of the build: the
adapter is `adapter-vercel`, and a route that sets `export const prerender = false` becomes a real
serverless function while the rest of the site stays static HTML. The six endpoints below are the
only ones that do — plus one page, `/signals`, the author's dashboard.

Same Postgres, same schema, same driver as the production blog — `src/lib/server/db/schema.ts` is
a copy of `~/MyApps/maxblog/src/db/schema.ts`, so both editions read and write the same four
tables: `reactions`, `page_views`, `section_reach`, `poll_votes`.

| route | method | what it does | who may call it |
| --- | --- | --- | --- |
| `/api/react` | POST | one reader's reaction to one passage | public |
| `/api/track` | POST | `view` / `complete` / `section` telemetry | public |
| `/api/poll` | POST · GET | cast a vote · read the tally | public |
| `/api/witness` | GET | one post's public record: counts, ≤5 letters, retention | public |
| `/api/signals` | GET · PATCH | everything, across every post, incl. letter text | **Basic auth** |
| `/api/link-preview` | GET | title · description · host of an outbound link | public |

```bash
cp .env.example .env.local     # DATABASE_URL, DIRECT_URL, SIGNAL_PASSWORD
pnpm drizzle-kit generate      # after editing schema.ts
pnpm drizzle-kit migrate       # or `push` to diff against the live database
```

`DATABASE_URL` is the pooled connection (pgbouncer, transaction mode — hence `prepare: false`);
`DIRECT_URL` is the unpooled one, because DDL cannot run over the pool.

Three rules this port holds to:

- **The client is lazy.** `db()` opens no connection until an endpoint asks, so `pnpm build`
  works with no database reachable at all — prerendering must never depend on one. With
  `DATABASE_URL` unset the endpoints answer `503`, they do not crash.
- **`$lib/server/` is enforced, not a convention.** Importing the db module into anything that
  reaches the browser is a *build error* (`Cannot import $lib/server/… into code that runs in the
  browser`), so the connection string cannot leak into a bundle by accident.
- **Errors are opaque.** A Postgres message names tables, columns and the host; endpoints log the
  real error and return a bare `Internal error`.

### /api/link-preview, and why it is on the server at all

Hovering an outbound link in an essay opens a card with the page's host, title and description —
enough to decide whether to spend a page-load on it. That has to be fetched on the server because a
browser cannot read another origin's `<head>`, which is the one thing on this list that is not
about the reader: it fetches a *public* page on their behalf and returns three strings from it.

The link is never blocked on the fetch. It is a real anchor from the first paint, and a slow
endpoint, an unreachable site or a page with no metadata all fall back to the bare host — still
true, still useful. Results are cached in module scope, so a URL mentioned twice on a page costs one
request, and the response carries a day's `Cache-Control` so the CDN carries the rest.

**The SSRF guard is the substantive difference from production.** That version validates the
protocol and nothing else, which leaves the server willing to fetch any address the caller names —
including ones only the server can reach. On a cloud host `http://169.254.169.254/…` is the instance
metadata service. This one blocks loopback, private, link-local, unique-local and `.internal` hosts,
**re-checks every redirect hop** (following redirects automatically would let a public URL bounce
the server onto a private one), refuses non-HTML content types, caps the read at 512 KB and times
out at 5s. Verified: the metadata IP, `localhost:5432`, `10.0.0.1` and `file://` all answer 400,
where production would have fetched all four.

Its honest limit is in the code: the check is on the literal hostname, so a *name* that resolves to
a private address still passes, as does rebinding between the check and the fetch. Closing those
needs DNS resolution plus a pinned-IP connection, which the platform's `fetch` does not expose.

### /signals and /api/signals are private

Between them they return every letter a reader has written, with session ids. Auth lives in
`src/hooks.server.ts`, guarding both prefixes — the dashboard page and the feed it reads: no
credentials → `401`, wrong credentials → `404` (a wrong password should not confirm the route
exists), and **no `SIGNAL_PASSWORD` configured → `404`**, so a deploy that forgets the variable
stays shut rather than falling open. Page and feed share one realm, so the browser asks once and
then sends the same credentials with the dashboard's own `fetch`.

> Worth knowing when comparing the two editions: production guards the *page* `/[locale]/signals`
> in `middleware.ts`, but that middleware's matcher excludes `api`, so `/api/signals` there is
> reachable without credentials — GET returns all letters, PATCH mutates. Guarding both prefixes
> in hooks, as here, is what closes that gap.

### A note on the migration history

`drizzle/0000_*` came from production and describes only three tables: `poll_votes` was added
there with `drizzle-kit push`, which writes no migration. `drizzle/0001_*` (generated here)
reconciles that, so a fresh database can be built from history alone. It is `CREATE TABLE IF NOT
EXISTS`, because against the existing database the table is already there and the migration must
be a no-op rather than a failure.

## Hosting

`@sveltejs/adapter-vercel`, with `prerender = true` on the root layout: every page is static
HTML at build time, and the only serverless functions are the six endpoints above (which opt out
per route). Import the repo on Vercel — the
framework preset and `pnpm` are detected, no `vercel.json` needed. The adapter's runtime is
pinned to `nodejs22.x` so local builds don't depend on the machine's Node version.

## Not ported yet

- **The live figures.** `FloatBuilder`, `FloatExplorer`, `FloatVsFixed`, `FloatSpacing` render a
  labelled placeholder plate; the real sims are ~1,500 lines of React in
  `~/MyApps/maxblog/src/components/interactive/`.
- Every room in the nav is built. `/series` is real but its shelf is empty by design — see Series.
- Two of the four tables still have endpoints but no UI — see Database & endpoints. In production
  these are `ReflectionPrompt` (polls) and `WitnessInviteCard` / `FairWitnessDrawer` (the public
  record). `ArticleTracker` is done, and `reactions` is now written by the mark — see The article
  page.
- **Series**, the rest of it — `SeriesNavDrawer` (the arc as a drawer inside a chapter) and
  `SeriesNext` (the bridge out, at the foot of a chapter). The data layer and `SeriesRibbon` are
  done — see Series.
- **`Dialogue`** — the `format: conversation` posts, where the topic/date row becomes a cast list.
- The rest of the reading room: the commonplace book, the misreading book, appointments and the
  reading profile. In production each is its own page behind a door; here each becomes another
  section of the one room. The **concepts layer** of the constellation is also outstanding — see
  Your constellation for why it is not in yet.
- The print edition is not here at all yet.

## Ideas on the shelf

Researched, not decided. The findings are written down so the next person does not have to
re-read someone's source to get back to this point.

### Lenis for smooth scrolling — [lenis.dev](https://lenis.dev)

**Feasible, and cheaper to integrate than it looks.** Lenis (`1.3.26`, 5.4 KB gzip + 513 B CSS)
does not translate the page: `grep -c transform` over its bundle is `0`. It intercepts
wheel/touch, interpolates a number, and calls the browser's *real* scroll every frame —

```js
setScroll(scroll) { this.options.wrapper.scrollTo({ top: scroll, behavior: 'instant' }) }
```

— so `window.scrollY`, `getBoundingClientRect()`, the native `scroll` event and
`IntersectionObserver` all stay truthful, and every reading instrument keeps working untouched.
`respectReducedMotion` is on by default. There is no official Svelte package (react/vue/framer
only), but the vanilla API in an `$effect` on the root layout is about fifteen lines.

Four things in this repo would have to change:

1. `ForeEdge`'s `goTo()` uses `window.scrollTo({ behavior: 'smooth' })` — two interpolators
   writing one number. It becomes `lenis.scrollTo(el, { offset: -110 })`.
2. `TocDrawer` and `SearchOverlay` lock the page with `body.style.overflow = 'hidden'`, and
   **Lenis cannot see that**: its `checkOverflow()` reads `getComputedStyle(this.rootElement)`,
   which is `<html>`, not `<body>`. Scroll accumulates behind the open sheet and lands in one
   jump when it closes. They would call `lenis.stop()` / `lenis.start()` instead.
3. Client-side navigation: `onNativeScroll` only re-syncs while Lenis is idle, so a link clicked
   mid-glide fights SvelteKit's scroll reset. Needs `stopInertiaOnNavigate: true` and a
   `lenis.resize()` in `afterNavigate`, since the page height changes.
4. `anchors: { offset: -110 }`, so a `#id` link from the contents or from search glides the same
   way the fore-edge does instead of jumping.

**Two reasons it is on the shelf and not in the build.**

The page is full of `position: fixed` — the fore-edge rail, the running head, the reading bar,
the header, the sidenotes — and Lenis documents fixed elements lagging on pre-M1 macOS Safari.
For decoration a dropped frame is invisible; the fore-edge is a **measuring instrument standing
next to the text it measures**, and one frame out of step with that text reads as a bug rather
than as an effect. The risk points straight at the newest work.

And it argues with the art direction. This edition is a printed object: everything a rectangle,
`border-radius: 0` set globally, rules pure black, one blue. The fore-edge exists so a reader
*feels* the weight left the way a paperback gives it to the hand. Paper has no inertia. (A
smaller version of the same seam: `ReadingRuler` fades the cursor after 1.4s of stillness, and
Lenis's tail runs ~1.2s, so the band would linger past the moment the reader actually stopped.)

**If it is ever tried**, the cheap way is a `smoothScroll` key in `reading-prefs.ts` and a row in
the display dropdown beside the reading cursor, with `import('lenis')` fired only when a reader
turns it on — nobody pays the 5.4 KB by default, and backing it out is one line.

## Known gaps in the data

Not bugs in the code, but they make the site look emptier than it is:

- The bibliography's GAO report is never auto-cited: its author is an organisation (no surname to
  match) and its English title does not appear in either language's prose. It still lists in the
  essay's sources, just without a numeral pointing at it.
- `content/posts/` holds 4 files against production's 432 (both languages, 14 of them still
  `[xxx]`-prefixed drafts). The frontmatter contract is identical, so the rest copy across
  unchanged.

The bibliography is copied whole from production and is this sparse there too — four sources. The
dictionary is not a copy: production's single entry (`flow`) was dropped, because the essay it
claimed a use in never says the word — in either edition — and a dictionary that describes prose
that does not exist is worse than a shorter one. The six that replace it were each checked against
essay 001 in both languages before being written down, which is why that essay's foot carries a
`GlossaryFootnote` and 002's does not. Neither page is waiting on a port; they are waiting on
someone to write entries.
