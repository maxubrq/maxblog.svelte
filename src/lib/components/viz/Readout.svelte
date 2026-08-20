<script lang="ts">
	/** What the figure currently says, in a sentence, under a coloured edge. */
	import type { Snippet } from 'svelte';

	let { tone = 'blue', children }: { tone?: 'blue' | 'clay'; children: Snippet } = $props();
</script>

<p class="readout {tone}">{@render children()}</p>

<style>
	.readout {
		margin: 4px 16px 18px;
		padding: 12px 16px;
		border-left: 2px solid var(--blue);
		background: var(--paper);
		font-family: var(--body);
		font-size: 13.5px;
		line-height: 1.65;
	}
	.clay {
		border-left-color: var(--viz-clay);
	}
	.readout :global(.mono) {
		font-family: var(--mono);
		font-size: 0.9em;
		color: var(--blue);
	}
	.readout :global(.clay) {
		font-family: var(--mono);
		font-size: 0.9em;
		color: var(--viz-clay);
	}
</style>
