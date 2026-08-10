<script lang="ts">
	// Solid blue panel, white DISPLAY 500 lowercase, MONO attribution (§7).
	// Geometry matches the production blog: 2.4em margin, 38px/40px padding,
	// 1.7em quote at line-height 1.22.
	import type { Snippet } from 'svelte';

	let { from = '', children }: { from?: string; children: Snippet } = $props();
</script>

<!-- `.pull` marks this as a component-owned blockquote: the prose stylesheet
     skips it, so its own rules are not overridden by the plain-quote styling. -->
<blockquote class="pull">
	<!-- div, not p: markdown inside a component already arrives as a <p>. -->
	<div class="q">{@render children()}</div>
	{#if from}
		<div class="from">— {from}</div>
	{/if}
</blockquote>

<style>
	blockquote.pull {
		background: var(--panel-blue);
		color: var(--on-blue);
		padding: 38px 40px;
		margin: 2.4em 0;
		border: none;
		font-style: normal;
	}
	.q,
	.q :global(p) {
		font-family: var(--display);
		font-weight: 500;
		font-size: 1.7em;
		line-height: 1.22;
		letter-spacing: -0.02em;
		text-transform: lowercase;
		color: var(--on-blue);
		font-style: normal;
		margin: 0;
		text-wrap: pretty;
	}
	/* Emphasis inside a quote stays italic — that is the author's, not the theme's. */
	.q :global(em) {
		font-style: italic;
	}
	.q :global(p + p) {
		margin-top: 0.5em;
	}
	.from {
		font-family: var(--mono);
		font-size: 10.5px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--on-blue);
		margin-top: 18px;
		opacity: 0.85;
	}
	@media (max-width: 720px) {
		blockquote.pull {
			padding: 26px 22px;
		}
		.q,
		.q :global(p) {
			font-size: 1.45em;
		}
	}
</style>
