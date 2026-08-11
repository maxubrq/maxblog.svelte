<script lang="ts">
	// Margin note. Sits in the 260px side column on wide screens (§3);
	// folds inline under a hairline on narrow ones.
	import type { Snippet } from 'svelte';

	// `n` is the production API (a numbered note); `label` is the ink variant.
	let {
		label = '',
		n = '',
		children
	}: { label?: string; n?: string | number; children: Snippet } = $props();
</script>

<aside class="sidenote">
	{#if label}<span class="label">{label}</span>{/if}
	{#if n}<span class="n">{n}.</span>{/if}
	<!-- div, not span: markdown inside a component becomes a <p>. -->
	<div class="body">{@render children()}</div>
</aside>

<style>
	.sidenote {
		font-family: var(--body);
		font-size: 13.5px;
		line-height: 1.5;
		color: var(--muted);
		border-top: 1px solid var(--rule);
		padding-top: 8px;
		margin: 0 0 24px;
	}
	.body {
		display: inline;
	}
	.body :global(p) {
		margin: 0 0 0.7em;
	}
	.body :global(p:last-child) {
		margin-bottom: 0;
	}
	.n {
		font-family: var(--mono);
		font-size: 11px;
		color: var(--blue);
		margin-right: 6px;
	}
	.label {
		display: block;
		font-family: var(--mono);
		font-size: 9.5px;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--blue);
		margin-bottom: 4px;
	}
	/* Wide, and only if the reader wants notes in the margin: hang it there
	   without disturbing the measure. `layout: single` keeps it in the column,
	   which is also what every narrow screen gets. The attribute is on <html>,
	   outside this component, hence :global. */
	@media (min-width: 1180px) {
		:global([data-layout='sidenote']) .sidenote {
			float: right;
			clear: right;
			width: 240px;
			margin-right: -284px;
			margin-bottom: 18px;
		}
	}
</style>
