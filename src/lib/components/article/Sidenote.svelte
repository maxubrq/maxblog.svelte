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
		font-size: var(--t-meta);
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
		font-family: var(--body);
		font-size: var(--t-meta);
		color: var(--blue);
		margin-right: 6px;
	}
	.label {
		display: block;
		font-family: var(--body);
		font-size: var(--t-meta);
		color: var(--blue);
		margin-bottom: 4px;
	}
	/* Wide enough: hang it in the margin without disturbing the measure.
	   Narrower screens keep it in the column. The screen decides, not a
	   setting (DESIGN.md §4). */
	@media (min-width: 1180px) {
		.sidenote {
			float: right;
			clear: right;
			width: 240px;
			margin-right: -284px;
			margin-bottom: var(--s-2);
		}
	}
</style>
