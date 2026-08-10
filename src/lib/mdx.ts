/**
 * The MDX kit — every component a post may use without importing it.
 * The `injectComponents` preprocessor splices these names into each `.mdx`
 * file's script, so keep this barrel and KIT_COMPONENTS in sync.
 */
export { default as Callout } from './components/article/Callout.svelte';
export { default as Fleuron } from './components/article/Fleuron.svelte';
export { default as Footnote } from './components/article/Footnote.svelte';
export { default as OneSentence } from './components/article/OneSentence.svelte';
export { default as PullQuote } from './components/article/PullQuote.svelte';
export { default as Sidenote } from './components/article/Sidenote.svelte';
export { default as Term } from './components/article/Term.svelte';
export { default as WeatherStrip } from './components/article/WeatherStrip.svelte';
export { default as Figure } from './components/ink/DuoPhoto.svelte';
// Live figures. The Float* four are placeholders until the production React
// sims are rewritten in Svelte.
export { default as FloatBuilder } from './components/interactive/FloatBuilder.svelte';
export { default as FloatExplorer } from './components/interactive/FloatExplorer.svelte';
export { default as FloatSpacing } from './components/interactive/FloatSpacing.svelte';
export { default as FloatVsFixed } from './components/interactive/FloatVsFixed.svelte';
export { default as CodeBlock } from './components/tech/CodeBlock.svelte';
export { default as DiagramPlate } from './components/tech/DiagramPlate.svelte';
export { default as Terminal } from './components/tech/Terminal.svelte';
