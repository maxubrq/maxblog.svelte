# archived/

Code taken off the site by the reader-edition redesign (2026-10-28), kept rather
than deleted. The decisions behind each cut are in `DESIGN.md` §4, §6, §7 and §10.

Nothing here is built: SvelteKit and `svelte-check` only read `src/`, so the
`$lib/…` imports inside these files resolve to nothing and that is fine. Paths
mirror where each file used to live, so restoring one is a move back.

| Here | Was | Why it was cut |
| --- | --- | --- |
| `lib/components/article/ForeEdge.svelte` | `src/lib/components/article/` | The fore-edge rail and strip. Replaced by the 2px progress line and the contents in the margin (§6.4, §10.1). |
| `lib/components/article/ReaderMarks.svelte` | same | The five reader gestures and rough.js strokes. Hidden entirely by the author's decision (§10.1). |
| `lib/components/article/ReadingRuler.svelte` | same | The reading cursor setting (§4). |
| `lib/components/article/ReadingMemoryNudge.svelte`, `ReadingMemoryGutter.svelte` | same | "You were here" band and margin pin. Replaced by `ResumeToast` (§6.3). |
| `lib/components/article/WeatherStrip.svelte` | same | The reading-contract box above the prose (§6.2). |
| `lib/components/article/SeriesRibbon.svelte` | same | Folded into `NextReading` at the end of an essay (§6.7). |
| `lib/components/ink/RunningHead.svelte` | `src/lib/components/ink/` | The rotated running head and roman folio (§6.4). |
| `lib/components/ink/Scribble.svelte`, `ArrowMark.svelte` | same | Hand-drawn marks on titles and calls to action (§3.1, §7.1). |
| `lib/components/ink/MetaFoot.svelte` | same | Already unused before the redesign. |
| `lib/components/chrome/Placeholder.svelte` | `src/lib/components/chrome/` | Every room has content now; nothing rendered it. |
| `lib/components/reading-room/ReaderSky.svelte` | `src/lib/components/reading-room/` | The constellation. Try again when the archive is thick enough (§7.3). |
| `routes/reading/` | `src/routes/[lang=lang]/reading/` | The preferences page: settings cut from 11 to 2 (§4). |
| `routes/reading-room/` | `src/routes/[lang=lang]/reading-room/` | The previous reading room (shelf of spines + sky), for reference. |
| `routes/writing-index/` | `src/routes/[lang=lang]/writing/+page.*` | The archive page. It is the home page now; `/writing` redirects (§10.2). |
| `css/article-instruments.css` | `src/app.css` | Styles for the fore-edge, cursor, flow mode, memory pin, marks and the three framings. |

To restore a component: move it back under `src/lib/components/…`, put its CSS
back from `css/article-instruments.css` if it had any, re-add its strings to
`src/lib/i18n/messages.ts` (they were cut as orphans — see git history of that
file), and render it again in `src/routes/[lang=lang]/writing/[slug]/+page.svelte`.

Data is untouched: the localStorage keys these features wrote (`reading-ruler`,
`layout`, `framing`, `measure`, marks, …) are no longer read, and nothing deletes them.
