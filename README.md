# maxubrq — svelte edition

A personal blog in SvelteKit 2 / Svelte 5, built to the **Ink Edition** art direction
(`maxubrq/project/THEME_MANIFESTO.md`): white paper, one electric ink-blue, hairline grids,
oversized lowercase grotesque, mono fine print. Content is MDX in `content/`.

```bash
pnpm install
pnpm dev        # http://localhost:5173
pnpm build      # prerenders the whole site
pnpm preview
pnpm check      # svelte-check
```

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
`PullQuote` · `Sidenote` · `Term` · `Terminal` · `WeatherStrip` · `Float*` (live figures)

To add one: create the component, export it from `src/lib/mdx.ts`, and add its name to
`KIT_COMPONENTS` in `inject-components.js`.

Two mdsvex rules worth remembering:

- Markdown inside a component only parses when a **blank line** separates it from the tags.
- Markdown content arrives as a `<p>`, so a component must not wrap children in a `<p>`.

Math is `$inline$` / `$$display$$`, rendered by KaTeX **at build time** — no KaTeX JS ships to
the reader, only its stylesheet. GFM tables come from mdsvex's own remark.

## i18n

Every page lives under a locale prefix — `/en/…` and `/vi/…`, matched by `src/params/lang.ts`.
`/` is a 308 to `site.defaultLang`, emitted at the edge by the adapter. Each locale is its own
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

## Layout of the code

```
content/posts/            the posts (.mdx)
src/app.css               the tokens — palette, type, layout constants, dark mirror
src/lib/site.ts           name, volume, topics, links, default language
src/lib/i18n/             the en/vi catalogs + the locale context
src/params/lang.ts        the /en · /vi route matcher
src/lib/format.ts         the printed-document date/number voice
src/lib/content/          post loading, frontmatter contract, mdsvex layout + plugins
src/lib/components/ink/   the theme kit: Tag, Scribble, Underline, ArrowMark, DuoPhoto,
                          RunningHead, MetaRail, MetaFoot, Headline, IndexRow, FilterBar
src/lib/components/article/  PullQuote, Callout, Sidenote, Footnote, Fleuron, Term,
                             OneSentence, WeatherStrip
src/lib/components/tech/     CodeBlock, Terminal, DiagramPlate
src/routes/[lang=lang]/   /{en,vi} · /writing · /writing/[slug] · /topics · /topics/[topic] ·
                          /about · /feed.xml   (/ redirects to the default locale)
```

Design tokens live only in `src/app.css` as CSS custom properties, so dark mode is a token swap
and components never hardcode a colour. Two laws from the manifesto that are easy to break:
the *fields* are softened (paper `#fafaf7`, ink `#24242c`) but **rules stay pure black**, and
everything is a rectangle — `border-radius: 0` is set globally.

## Hosting

`@sveltejs/adapter-vercel`, with `prerender = true` on the root layout: every page is static
HTML at build time and nothing runs on a serverless function. Import the repo on Vercel — the
framework preset and `pnpm` are detected, no `vercel.json` needed. The adapter's runtime is
pinned to `nodejs22.x` so local builds don't depend on the machine's Node version.

## Not ported yet

- **The live figures.** `FloatBuilder`, `FloatExplorer`, `FloatVsFixed`, `FloatSpacing` render a
  labelled placeholder plate; the real sims are ~1,500 lines of React in
  `~/MyApps/maxblog/src/components/interactive/`.
- The rest of the design surfaces (search ⌘K, glossary, constellation, commonplace book, print
  edition, reader room, series, signals) exist in `maxubrq/project/pages/` and in production, but
  not here yet.
