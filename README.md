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

`Callout` · `CodeBlock` · `DiagramPlate` · `Figure` · `Fleuron` · `Footnote` · `OneSentence` ·
`PullQuote` · `R` · `Sidenote` · `Term` · `Terminal` · `WeatherStrip` · `Float*` (live figures)

To add one: create the component, export it from `src/lib/mdx.ts`, and add its name to
`KIT_COMPONENTS` in `inject-components.js`.

Two mdsvex rules worth remembering:

- Markdown inside a component only parses when a **blank line** separates it from the tags.
- Markdown content arrives as a `<p>`, so a component must not wrap children in a `<p>`.

Math is `$inline$` / `$$display$$`, rendered by KaTeX **at build time** — no KaTeX JS ships to
the reader, only its stylesheet. GFM tables come from mdsvex's own remark.

## The article page

`/[lang]/writing/[slug]` is the reading surface. Top to bottom: running head · title block ·
the prose · then the apparatus, in this order:

1. the end mark `■`
2. `OneSentence` — the author's pick, when `rememberSentence` is set
3. `Bibliography` — the sources, when the post has any (see Resources)
4. the hand-picked `neighborhood`, when the frontmatter lists one

There is no meta strip at the foot, and no meta rail beside the prose: topic, licence and word
count used to print at the foot, and author/date/reading/chapter used to stand in the left
margin. Both were removed and the prose took the column back. `meta.words` is still computed and
`meta.license` still parsed — nothing reads them now, so `MetaRail`, `MetaFoot` and the
`article.author` / `published` / `filedUnder` / `license` / `words` catalogue keys are unused.

The article ends on 100px of empty page (80 on mobile), set on `article` rather than on the last
block, so the gap is there whichever block closes the piece.

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

`$lib/session.ts` holds the id — a uuid in localStorage under production's `mx_sid`, so a reader
with both editions open is one reader. It is not an account and not a fingerprint; clearing site
data ends it.

### Reading memory

The other half of the pair, and the distinction is the point: telemetry counts readers **for the
author** and leaves the device; reading memory keeps a place **for the reader** and never does.
So it has no `dev` guard and no `doNotTrack` check — there is nothing here to opt out of.

`$lib/reading-memory.ts` holds one entry per essay under production's `reading_memory` key: how
far in, which `##`, how many minutes are left, and when. Three surfaces read it.

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
is dropped: it goes to `/constellation`, a room this edition has not built.

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

## Reading preferences

Eleven settings, all device-local and never sent anywhere. `/[lang]/reading` is the room where
all of them live, with a sample that answers the moment you touch a control; the header's display
dropdown carries the four worth taking mid-sentence (theme · notes · framing · mode, plus the two
in-article instruments). Both edit the same store, so neither can show a stale value.

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
static/media/             committed 1-bit halftone plates (everything else is on Cloudinary)
scripts/halftone.mjs      offline halftone screener; run by hand, never at build
scripts/check-anchors.mjs every TOC anchor must exist in the rendered page; run after a build
src/app.css               the tokens — palette, type, layout constants, dark mirror
src/lib/images.ts         Cloudinary delivery — the cover default + the URL/srcset rewrite
src/lib/site.ts           name, volume, topics, links, default language
src/lib/i18n/             the en/vi catalogs + the locale context
src/lib/content/search.ts the search corpus builder (build-time only)
src/lib/glossary.ts       the site dictionary (data in glossary.data.js)
src/lib/resources.ts      the bibliography (data in resources.data.js)
src/lib/content/remark-*.js  the passes that auto-mark terms and citations while compiling
src/lib/server/db/        drizzle schema + the lazy Postgres client (never client-side)
src/lib/server/api.ts     shared endpoint guards: 503 / 400 / opaque 500
src/routes/api/           the five prerender-exempt endpoints
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
                             WeatherStrip · Term and R (the marks) · Bibliography ·
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
serverless function while the rest of the site stays static HTML. The five endpoints below are the
only ones that do.

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

### /api/signals is private

It returns every letter a reader has written, with session ids. Auth lives in
`src/hooks.server.ts`, guarding the whole `/api/signals` prefix: no credentials → `401`, wrong
credentials → `404` (a wrong password should not confirm the route exists), and **no
`SIGNAL_PASSWORD` configured → `404`**, so a deploy that forgets the variable stays shut rather
than falling open.

> Worth knowing when comparing the two editions: production guards the *page* `/[locale]/signals`
> in `middleware.ts`, but that middleware's matcher excludes `api`, so `/api/signals` there is
> reachable without credentials — GET returns all letters, PATCH mutates. Guarding the prefix in
> hooks, as here, is what closes that gap.

### A note on the migration history

`drizzle/0000_*` came from production and describes only three tables: `poll_votes` was added
there with `drizzle-kit push`, which writes no migration. `drizzle/0001_*` (generated here)
reconciles that, so a fresh database can be built from history alone. It is `CREATE TABLE IF NOT
EXISTS`, because against the existing database the table is already there and the migration must
be a no-op rather than a failure.

## Hosting

`@sveltejs/adapter-vercel`, with `prerender = true` on the root layout: every page is static
HTML at build time, and the only serverless functions are the five endpoints above (which opt out
per route). Import the repo on Vercel — the
framework preset and `pnpm` are detected, no `vercel.json` needed. The adapter's runtime is
pinned to `nodejs22.x` so local builds don't depend on the machine's Node version.

## Not ported yet

- **The live figures.** `FloatBuilder`, `FloatExplorer`, `FloatVsFixed`, `FloatSpacing` render a
  labelled placeholder plate; the real sims are ~1,500 lines of React in
  `~/MyApps/maxblog/src/components/interactive/`.
- The rooms behind `/series` and `/reading-room` are placeholder pages — a door in the nav, and a
  page that says it is not built yet. The designs exist in `maxubrq/project/pages/` and in
  production.
- **`GlossaryFootnote`** — the terms-used-in-this-piece block at the foot of an essay, the
  glossary's twin of `Bibliography`. Production collects terms as they render; here the remark
  pass already knows which it marked, so the same `file.data.fm` trick would do it.
- The reader-facing features behind three of the four tables still have endpoints but no UI —
  see Database & endpoints. In production these are `SelectionReact` (reactions),
  `ReflectionPrompt` (polls) and `WitnessInviteCard` / `FairWitnessDrawer` (the public record).
  `ArticleTracker` is done — see The article page.
- **Series** — `SeriesRibbon`, `SeriesNavDrawer`, `SeriesNext`. Needs a series data layer this
  edition does not have yet; the frontmatter already carries `series` and `chapter`.
- **`Dialogue`** — the `format: conversation` posts, where the topic/date row becomes a cast list.
- The rest of the design surfaces (constellation, commonplace book, print edition) are not here
  at all yet.

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

- The glossary holds exactly one entry, `flow`, and the word **appears in no post** — so no
  `<Term>` mark is ever placed. The entry's `appearances` claims otherwise. Either the prose or
  the entry needs to move.
- The bibliography's GAO report is never auto-cited: its author is an organisation (no surname to
  match) and its English title does not appear in either language's prose. It still lists in the
  essay's sources, just without a numeral pointing at it.
- `content/posts/` holds 4 files against production's 432 (both languages, 14 of them still
  `[xxx]`-prefixed drafts). The frontmatter contract is identical, so the rest copy across
  unchanged.

The dictionary and the bibliography are copied whole from production, and they are this sparse
there too — one term and four sources. Neither page is waiting on a port; they are waiting on
someone to write entries.
