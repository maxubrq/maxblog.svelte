<script lang="ts">
	// Full-width row of equal MONO buttons divided by hairlines;
	// active = solid blue fill (§7, §8).
	let {
		options,
		value,
		onchange
	}: { options: string[]; value: string; onchange: (v: string) => void } = $props();
</script>

<div class="bar">
	{#each options as opt (opt)}
		<button type="button" class:active={opt === value} onclick={() => onchange(opt)}>{opt}</button>
	{/each}
</div>

<style>
	.bar {
		display: flex;
		border-bottom: 1.5px solid var(--rule-hard);
	}
	button {
		flex: 1;
		border: none;
		border-right: 1px solid var(--rule);
		background: transparent;
		color: var(--ink);
		font-family: var(--mono);
		font-size: 11px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		padding: 14px 4px;
		cursor: pointer;
	}
	button:last-child {
		border-right: none;
	}
	button:hover {
		color: var(--blue);
	}
	.active,
	.active:hover {
		background: var(--blue);
		color: var(--on-blue);
	}
</style>
