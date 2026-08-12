<script lang="ts">
	// Root shell: stylesheets, and the one piece of third-party measurement the
	// site carries. The page chrome lives in [lang]/+layout.svelte so it can
	// speak the active locale.
	import 'katex/dist/katex.min.css';
	import '../app.css';
	import { browser, dev } from '$app/environment';
	import { injectAnalytics } from '@vercel/analytics/sveltekit';
	import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();

	/**
	 * Vercel Web Analytics and Speed Insights — page views per route and the
	 * Web Vitals of real visits. Both are cookieless and keep no cross-site
	 * identity. They sit here rather than in the locale layout so they also see
	 * `/`, the 404 and `/signals`.
	 *
	 * `doNotTrack` switches both off before either script is fetched, the same
	 * rule `ArticleTracker` follows: this site counts in order to know whether
	 * an essay was read, and that is a question a reader is allowed to decline.
	 * The check needs the browser — on the prerender pass there is no navigator
	 * and nothing to inject.
	 */
	const declined = () => navigator.doNotTrack === '1' || navigator.doNotTrack === 'yes';

	if (browser && !declined()) {
		// `development` keeps a `pnpm dev` session out of the real numbers: the
		// script logs to the console instead of sending anything. Speed Insights
		// takes `debug` for the same purpose — it has nothing to measure on
		// localhost anyway.
		injectAnalytics({ mode: dev ? 'development' : 'production' });
		injectSpeedInsights({ debug: dev });
	}
</script>

{@render children()}
