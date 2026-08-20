<script lang="ts">
	/** The row a live figure is driven from — a slider, some buttons, or both. */
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
</script>

<div class="controls">{@render children()}</div>

<style>
	.controls {
		display: flex;
		align-items: center;
		gap: 14px;
		flex-wrap: wrap;
		padding: 14px 16px;
		border-bottom: 1px solid var(--rule);
	}
	.controls :global(label) {
		font-family: var(--body);
		font-size: 13px;
	}
	.controls :global(input[type='range']) {
		flex: 1;
		min-width: 160px;
		accent-color: var(--blue);
	}
	.controls :global(input[type='text']) {
		flex: 1;
		min-width: 150px;
		padding: 5px 8px;
		border: 1px solid var(--rule);
		border-radius: 0;
		background: transparent;
		color: var(--ink);
		font-family: var(--mono);
		font-size: 12px;
	}
	.controls :global(input[type='text']:focus) {
		outline: none;
		border-color: var(--blue);
	}
	.controls :global(button) {
		font-family: var(--mono);
		font-size: 10px;
		padding: 4px 9px;
		border: 1px solid var(--rule);
		border-radius: 0;
		background: transparent;
		color: var(--muted);
		cursor: pointer;
	}
	.controls :global(button:hover) {
		color: var(--blue);
		border-color: var(--blue);
	}
	.controls :global(button.on) {
		background: var(--panel-blue);
		border-color: var(--panel-blue);
		color: var(--on-blue);
	}
	.controls :global(.mono) {
		font-family: var(--mono);
		font-size: 0.9em;
		color: var(--blue);
	}
</style>
