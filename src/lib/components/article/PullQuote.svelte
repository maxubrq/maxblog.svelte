<script lang="ts">
	// A passage set at section size, in ink, between two rules (DESIGN.md §6.5):
	// it stays inside the column and says "this one" by size and air, not by a
	// blue field. The size sits on `.q` alone — set on the inner <p> as well it
	// compounds (1.7em × 1.7em was 52px, and ran a long word off a phone).
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
		margin: 2.4em 0;
		padding: var(--s-2) 0;
		border: none;
		border-top: 1.5px solid var(--rule-hard);
		border-bottom: 1.5px solid var(--rule-hard);
		font-style: normal;
	}
	.q {
		font-family: var(--deck);
		font-weight: 600;
		font-size: 1.444em;
		line-height: 1.25;
		color: var(--ink);
		overflow-wrap: break-word;
		text-wrap: pretty;
	}
	.q :global(p) {
		font: inherit;
		color: inherit;
		margin: 0;
	}
	/* Emphasis inside a quote stays italic — that is the author's, not the theme's. */
	.q :global(em) {
		font-style: italic;
	}
	.q :global(p + p) {
		margin-top: 0.5em;
	}
	.from {
		font-size: var(--t-meta);
		color: var(--muted);
		margin-top: var(--s-1);
	}
</style>
