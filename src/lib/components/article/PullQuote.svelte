<script lang="ts">
	// Solid blue panel, white DISPLAY 500 lowercase, MONO attribution (§7).
	import type { Snippet } from 'svelte';

	let { from = '', children }: { from?: string; children: Snippet } = $props();
</script>

<blockquote>
	<!-- div, not p: markdown inside a component already arrives as a <p>. -->
	<div class="q">{@render children()}</div>
	{#if from}
		<div class="from">— {from}</div>
	{/if}
</blockquote>

<style>
	blockquote {
		background: var(--blue);
		color: var(--on-blue);
		padding: 30px 32px;
		margin: 10px 0 34px;
	}
	.q,
	.q :global(p) {
		font-family: var(--display);
		font-weight: 500;
		font-size: 26px;
		line-height: 1.14;
		letter-spacing: -0.02em;
		text-transform: lowercase;
		margin: 0;
		text-wrap: pretty;
	}
	.q :global(p + p) {
		margin-top: 0.5em;
	}
	.from {
		font-family: var(--mono);
		font-size: 10.5px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		margin-top: 18px;
		opacity: 0.85;
	}
</style>
