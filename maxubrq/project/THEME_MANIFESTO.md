# THEME_MANIFESTO — maxubrq "Ink Edition"

> A single source of truth for the white + electric-ink-blue, brutalist
> digital-editorial theme. Hand this file to any prompt ("build X in the
> Ink Edition theme") and the result should slot in without adjustment.
> Everything below is prescriptive: match the tokens exactly, obey the
> layout laws, reuse the motifs. When in doubt, choose the more austere,
> more grid-bound, more printed-object option.

---

## 0. One-paragraph soul

A personal essayist's notebook redrawn as a **printed object seen through a
screen**. White paper, one electric ink-blue, hairline rules, an oversized
lowercase grotesque, and mono "fine print" for every label and coordinate.
Swiss-grid precision meets zine brutalism: hand-drawn scribbles and arrows
interrupt the machine grid; photographs arrive as cyanotype (blue duotone)
plates. Nothing is rounded, nothing glows, nothing gradients. The reading
always comes first; interactions live *inside* the page frame, never beside
it. Private by default — counts, never names.

---

## 1. Palette (exact tokens)

One accent only. Never introduce a second hue. Blue does everything an
accent must; ink-black does everything text must; grey is structure.

```
--paper    #fafaf7   page / card background (barely-warm off-white)
--paper2   #f2f2ef   recessed panel (Swiss-poster grey), gutters, desk
--ink      #24242c   primary text — body + headlines (reading-softened)
--muted    #77777f   secondary text, captions, fine-print values
--faint    #a7a7ad   line numbers, tertiary meta, "still ahead" states
--rule     rgba(13,13,17,0.14)   hairline dividers (1px)
--ruleHard #0d0d11   structural 1.5px borders + hard rules — PURE black
--blue     #1a24df   THE accent — headlines-accent, marks, plates, links
--blueDeep #0f1699   reserved; only if a second blue depth is unavoidable
```

**Reading-comfort softening.** Paper and text are held one notch off the
absolutes — paper `#fafaf7` (not pure white), text `#24242c` (not pure black) —
so long-form reading on a bright screen doesn't fatigue the eye (contrast ~13:1,
still AAA). The brutalist edge is preserved because **`--ruleHard` stays pure
`#0d0d11`**: every border, hard rule, and code-plate frame is drawn at full
black, only the *fields* (paper, running text) are softened. Dark mode mirrors
this: paper `#0d0d11`, text `#d8d8dd` (softened from `#e9e9ec` to cut OLED
halation), `--ruleHard` stays full `#e9e9ec`. Never soften a rule or a border;
never harden the paper or body text back to the absolutes.

Usage laws:
- **Blue is a spotlight, not a wash.** Use it for: the accented word in a
  headline, links, active states, interactive `●` dots, filled photo
  plates, the one "if you remember one sentence" card, chart strokes,
  hand-drawn marks, and solid pull-quote panels. Body copy is never blue.
- **Solid blue panels** (`background:#1a24df; color:#fff`) are for
  pull-quotes, the resume/"you were here" nudge, and the print cover only.
- **Dark plates** (`background:#0d0d11; color:#e9e9ec`) are only for
  terminals. Blue keywords inside: `#7f88ff`.
- Text on white: ink. Text on blue: white. Text on grey panel: ink.
- `::selection` = blue bg / white text.

---

## 2. Typography

Three families, loaded from Google Fonts. All are Vietnamese-safe; every
headline and body string must survive Vietnamese diacritics.

```
DISPLAY = "Space Grotesk", "IBM Plex Sans", sans-serif     // 400 500 600 700
BODY    = "IBM Plex Sans", -apple-system, sans-serif       // 400 500 600
MONO    = "IBM Plex Mono", monospace                       // 400 500
```

```html
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
```

### Roles
- **DISPLAY** — every headline, post title, big number, pull-quote,
  section head, topic name, the "one sentence" card. Almost always
  `text-transform: lowercase`. Tight tracking. Weight 700 for hero /
  titles, 500–600 for list-item titles and quotes.
- **BODY** — prose only. 16–18px, `line-height: 1.62–1.66`. Occasional
  `font-style: italic` for editor's asides, epigraphs, recommendation notes.
- **MONO** — ALL labels, metadata, tags, coordinates, folios, captions,
  line numbers, keyboard keys, footers, code. This is the "fine print"
  voice that makes it read as a printed document.

### Type-scale anchors (px, at 1× artboard)
| use | family / weight | size | tracking | transform |
|---|---|---|---|---|
| Hero headline | DISPLAY 700 | 60–108 | -0.045em | lowercase |
| Page H1 | DISPLAY 700 | 46–64 | -0.04em | lowercase |
| Section H2 | DISPLAY 700 | 24–30 | -0.03em | lowercase |
| Post-title (list) | DISPLAY 500 | 19–22 | -0.02em | as-authored |
| Pull-quote | DISPLAY 500 | 26–27 | -0.02em | lowercase |
| Big number / folio-number | DISPLAY/MONO | 40–68 | -0.03em | — |
| Body | BODY 400 | 16–18 | — | — |
| Drop cap | DISPLAY 700, blue, float | ~3em | — | — |
| Label / Tag | MONO 400–500 | 10–11 | 0.14em | UPPERCASE |
| Caption / coord | MONO 400 | 9–11 | 0.06–0.08em | — |

- **Drop cap:** first letter of a section's lead paragraph, DISPLAY 700,
  color blue, `float:left; line-height:.78; margin:.05em .12em 0 0`.
- **Headlines** frequently wrap to 2–3 lines with one word in blue, often
  circled/underlined by a hand-drawn mark (see §5).

---

## 3. Layout laws (the grid skeleton)

- **The hairline grid is the design.** Compose with full-width `1.5px solid --ink`
  structural rules (section boundaries) and `1px solid --rule` hairlines
  (row dividers). Columns are separated by borders, not gaps+shadows.
- **Everything is a rectangle.** `border-radius: 0` everywhere. No rounded
  cards, no pills, no soft shadows in the reading UI. (Shadows appear only
  on print "sheets" floating on the desk, and on the glossary popover.)
- **Full-bleed division:** big layouts split the frame into cells with a
  shared `1.5px --ink` border between them (e.g. featured post = text cell
  `borderRight` + photo cell). Cells butt directly against each other.
- **Page padding:** chrome/section horizontal padding `30px`; article
  measure padding `44px`. Reading column `max-width` 720–780px; wide index
  pages up to 1080.
- **Margin/side-note grid:** article body = `grid-template-columns:
  150px 1fr` (meta rail + prose) or `1fr 260px` (prose + sidenotes). Rail
  items: MONO label (`--muted`) over MONO value (`--ink`).
- **Index rows:** CSS grid, e.g. `48px 118px 1fr auto` = number · topic ·
  title · date/time. Divided by `1px --rule` top-borders. Never inline flow.
- **Number everything.** Index numbers (`01`, `02`), essay numbers
  (`Nº 001`), volumes (Roman `I–IV`), coordinates (`09°01′N`), folios.
  Zero-pad to two digits.
- **Big year/section numerals** sit next to a flex-1 hairline that fills
  the row (`<span style="flex:1;height:1.5px;background:--ink">`).

---

## 4. Voice & metadata motifs (the "printed document" tells)

Sprinkle these MONO micro-texts; they carry the identity as much as type:
- Running head (vertical, rotated): `maxubrq · vol.04 · science` via
  `writing-mode: vertical-rl; transform: rotate(180deg)`, color `--faint`,
  pinned to a 34px-wide edge column.
- Footer triplet: `maxubrq.space` · `A notebook, kept in public · est. 2024`
  · `© 2026`.
- Chrome right slot: `Vol.04 / 2026` + a 20px circled `⌕` glyph.
- Coordinate/issue tags: `Essay Nº 001`, `STEP Nº010`, `§2`, `09°01′N`.
- Interactive marker: a blue `●` + `interactive` / `live figure`.
- Section marks: `§ I of IV`, `❧` fleuron between paragraphs, `■`/`✓`/`—`
  for read-state.
- Privacy line, always present where crowd data shows: `counts only ·
  never names`.

---

## 5. Signature marks (hand-drawn, SVG, always blue)

The brutalist interruption of the machine grid. Inline `position:absolute`,
`pointer-events:none`, `overflow:visible`, `stroke #1a24df`, round caps,
`stroke-width 2.4–3`, `fill:none`. Never more than one per headline.

- **`Scribble`** — a rough ~1.2-loop ellipse lassoing a word (or a year).
  viewBox `0 0 360 130`. Sits behind/around the accented headline word.
- **`Underline`** — a hand-drawn wobble underline under an accented word.
  viewBox `0 0 300 22`, placed `bottom:-10`.
- **`ArrowMark`** — a curved arrow with a hand-drawn head; `dir` rotates it
  (right/down/left/up). Points from a CTA to its target, or from a popover
  to its referent.

Rule: marks annotate meaning (the key word, the "read the essay" CTA, the
glossary referent). Never decorative-only, never on body text.

---

## 6. Imagery — cyanotype plates

No full-colour photography. Every image is a **blue duotone (cyanotype)**
plate, delivered through a user-fillable `<image-slot>` so the author drops
real photos that persist. The treatment:

```css
.ink-duo{position:relative;overflow:hidden;background:#f2f2ef}
.ink-duo image-slot{display:block;width:100%;height:100%;
  filter:grayscale(1) contrast(1.06) brightness(1.03)}
.ink-duo::after{content:"";position:absolute;inset:0;background:#1a24df;
  mix-blend-mode:multiply;opacity:.78;pointer-events:none;z-index:1}
.ink-duo::before{content:"";position:absolute;inset:0;background:#fff;
  mix-blend-mode:screen;opacity:.06;pointer-events:none;z-index:2}
```

- Always wrap the slot in `.ink-duo`; give each slot a **distinct `id`** and
  `shape="rect"`. Overlays are `pointer-events:none` so the drop still works.
- Captions below in MONO: `Fig. 1 — …` .
- A decorative fill alternative (no photo): `.ink-hatch` = 45° repeating
  blue hairlines (`repeating-linear-gradient(-45deg,#1a24df 0 1.5px,transparent 1.5px 7px)`),
  used at low opacity for "interactive canvas" placeholders.

---

## 7. Component catalogue (canonical building blocks)

Reusable kit (exported to `window` from `pages/InkEdition.jsx`):
`INK, DISPLAY, BODY, MONO, Tag, Scribble, Underline, ArrowMark, DuoPhoto,
RunningHead, MetaFoot, InkChrome, GlossaryMark`.

- **`Tag`** — the MONO uppercase micro-label. `on` prop turns it blue.
  The workhorse; use for every kind/topic/status/coordinate.
- **`InkChrome`** — page shell: 3-col header (wordmark `maxubrq.` with blue
  dot · centered MONO nav with blue underline on active · vol/search slot),
  scroll body, footer triplet. `current` highlights nav; `foot` overrides
  the left footer string.
- **`RunningHead`** — vertical rotated folio on a page edge.
- **`MetaFoot`** — end-of-article grid of `[key, value]` under a `1.5px --ink`
  top rule; keys ink MONO uppercase, values muted MONO.
- **`DuoPhoto`** — `.ink-duo` figure + optional MONO caption.
- **`GlossaryMark`** — inline dotted-blue term; hover/click opens a bordered
  popover (kind, term in DISPLAY, def in BODY, "appears in N essays",
  "full entry →"). The only element allowed a drop-shadow besides sheets.
- **Code plate (`InkCode`)** — bordered; header row `file` (Tag) vs `lang`
  (Tag on); body `pre` with a `44px 1fr` grid per line (faint MONO line
  number · highlighted code). Highlighter: keywords/numbers blue, strings
  muted, comments faint. Optional caption footer.
- **Terminal** — dark `--ink` plate, MONO, blue-`#7f88ff` prompt tokens,
  header `terminal · node` in translucent white.
- **Callout** — plain `1.5px --ink` box, `Tag on` header line, body BODY.
  (Never a left-accent-border card — that trope is banned.)
- **Pull-quote** — solid blue panel, white DISPLAY 500 lowercase, MONO
  attribution beneath at 0.85 opacity.
- **Index list / archive row** — grid rows, hairline top-borders, hover
  flips row text to blue.
- **Filter bar** — full-width row of equal MONO buttons divided by hairlines;
  active button = solid blue, white text.
- **Charts (retention / bars)** — inline SVG, blue polyline `stroke-width 2.5`
  + `opacity:.1` area fill; dashed `--rule` guide lines; MONO axis tags.
  Progress/tally bars: 3–8px track `--rule` with a blue fill; count in blue
  MONO. **Counts only.**
- **Star chart (constellation)** — faint 100px SVG grid; blue polyline =
  reading order ("ember thread"); dashed `--faint` = citations; filled blue
  circle = read, ink outline circle = unread; MONO labels; legend row.
- **Print `Sheet`** — white A4 (`aspect-ratio:1/1.414`, ~620px wide) with
  soft shadow on a `--paper2` desk; running header + folio; content padded
  `64px 40px 56px`. Cover variant = full blue. Two-column body via
  `column-count:2; column-gap:26px; column-rule:1px --rule; text-align:justify`.

---

## 8. Interaction laws

Motion is minimal, mechanical, instant. No easing spectacle, no fades on
content, no parallax, no bounce.

- **Hover = colour flip, not movement.** Rows/links flip their text to
  `--blue` on `mouseenter` (set back on leave). Topic doorways flip the
  whole cell to solid blue with white text. No transforms, no scaling.
- **Active/selected = solid blue fill** (filter buttons, nav underline,
  scope rail, A4/Letter toggle).
- **Reveals are hard cuts** bounded by a `2px solid --blue` top rule
  (margin question answer, "you were here" continuation). Content that is
  "ahead"/locked is dimmed to `--faint`/`--muted`, not hidden with effects.
- **Popovers** (glossary) open on hover AND click, bordered `1.5px --ink`,
  with the only permitted content drop-shadow.
- **Gate, don't nag.** Crowd/witness data is hidden until the reader hits
  the end-mark; the reveal is a drawer, never a modal. Reading memory is a
  quiet nudge bar + a gutter glyph, never an interstitial.
- **Keyboard-first surfaces** (search) show a MONO legend: `↑ ↓ navigate ·
  ↵ open · ⌘K toggle · esc close`, keys boxed in `1px --rule`.
- The AI companion **cites exact paragraphs** (`§III ¶1` chips, bordered
  blue) and **refuses to invent** (dashed-border card, muted text).

---

## 9. Hard bans (AI-slop guardrails)

- No gradients, no glows, no glassmorphism, no rounded corners in-page.
- No second accent colour **in page chrome**. No warm colours **in chrome**.
  The *only* place additional hues are allowed is inside a data
  visualization, and only from the sanctioned viz palette — see §11. Chrome
  (labels, buttons, borders, links, nav, cards) stays blue+ink+grey, always.
- No emoji (the `●■✓❧⌕↵` glyphs and `§ Nº ° ′` marks are the entire ornament
  vocabulary).
- No rounded-card-with-left-accent-border callouts.
- No Inter/Roboto/Arial. No drawn SVG illustration of subjects (photos are
  cyanotype slots; diagrams are austere boxes+arrows only).
- No public like-counts or named social proof. Counts only, after finishing.
- No decorative motion; no inline layout via whitespace — always flex/grid + gap.

---

## 10. Reference implementation

```
maxubrq — ink edition.html    host: DesignCanvas of every surface below
image-slot.js                 user-fillable cyanotype plates
pages/
  InkEdition.jsx    kit (INK, fonts, marks, Tag, InkChrome, GlossaryMark,
                    DuoPhoto, RunningHead, MetaFoot) + Home, Article,
                    Archive, About, Topic(Science). ⟵ import shared kit from here.
  InkFeatures.jsx   Search (⌘K), Glossary (inline mark + dictionary),
                    Side notes, Reader signals dashboard.
  InkFeatures2.jsx  InkCode + highlighter, Tech article, Topics hub + doorways,
                    Series shelf + page, Reading memory (article + home).
  InkFeatures3.jsx  Margin question, Long-form, Fair-witness drawer,
                    Constellation, The Companion.
  InkPrint.jsx      Print/book edition — A4 sheets, cover/contents/body/notes.
```

To build a new component in this theme: import the kit from `window`
(`const { INK, DISPLAY, BODY, MONO, Tag, ... } = window;`), compose on the
hairline grid, label everything in MONO, accent exactly one thing in blue,
keep it a rectangle, and make hover a colour flip. If it could be printed
and still look right, it belongs.
```

---

## 11. Visualization & interactive palette (the one sanctioned exception)

Charts, simulations, and diagrams sometimes need to tell **categories
apart**, and blue-alone can't carry a 4-way distinction legibly. So data
viz — and *only* the plotted marks inside a figure — may draw from a small
flat "riso-editorial" ink set. Everything around the figure (frame, caption,
axis labels, legend text, buttons, sliders) stays pure chrome: MONO labels,
`--ink`/`--muted`/`--faint` text, hairline `--rule` / `1.5px --ink` borders,
zero radius, blue for the active/interactive state.

### Tokens (declared in `globals.css`, theme-aware)

```
--viz-blue  = --blue   series 1 · doubles as active / "read" / primary
--viz-clay  #cf4b1a    series 2 · burnt vermillion   (dark #f0794a)
--viz-gold  #b5820c    series 3 · ochre / amber       (dark #e0aa2e)
--viz-moss  #2c7a54    series 4 · deep green          (dark #5bb98a)
--viz-plum  #6a34b8    series 5 · violet              (dark #a97ef0)
--viz-red   #bf2626    semantic · warn / error / danger (dark #f0645c)
--viz-ink   = --ink    series 0 · structural / neutral category
```

### Laws

- **Flat fills only.** No gradients, no glows, no opacity ramps for depth. A
  category is one solid ink. (Area fills under a line may use the same ink at
  `~0.08–0.12` alpha — that is the sole translucency allowed, per §7 charts.)
- **Assign in order** blue → clay → gold → moss → plum for series 1..5; use
  `--viz-ink` for a neutral/baseline series and `--viz-red` only for a
  genuinely semantic warn/error/danger state (never as "just another
  colour").
- **Blue keeps its meaning.** In any figure, blue is the primary / selected /
  "you are here" / interactive series. Don't spend blue on a secondary
  category if the figure also has an active state.
- **Legibility over count.** Prefer ≤3 hues; distinguish further with MONO
  labels, hairline borders, hatching, or position — not a sixth colour.
- **Canvas components** that can't read CSS vars for every fill should read
  the token once via `getComputedStyle(el).getPropertyValue('--viz-…')` (so
  dark-mode values apply), or mirror the exact hex above. Never hardcode a
  warm hue that isn't in this table.
- Still banned inside figures: rounded corners, drop-shadows, decorative
  motion, a second *blue*, and any hue outside this table.
