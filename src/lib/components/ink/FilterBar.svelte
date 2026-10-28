<script lang="ts">
	// The topic filter as a line of words (DESIGN.md §7.2): the chosen one is
	// in ink with a blue rule under it. No cells, no filled field.
	// `value` stays canonical; `label` translates it for display only.
	let {
		options,
		value,
		onchange,
		label = (o: string) => o
	}: {
		options: string[];
		value: string;
		onchange: (v: string) => void;
		label?: (option: string) => string;
	} = $props();
</script>

<div class="bar">
	{#each options as opt (opt)}
		<button
			type="button"
			class:active={opt === value}
			aria-pressed={opt === value}
			onclick={() => onchange(opt)}>{label(opt)}</button
		>
	{/each}
</div>

<style>
	.bar {
		display: flex;
		flex-wrap: wrap;
		gap: var(--s-1) var(--s-2);
	}
	button {
		border: none;
		border-bottom: 1.5px solid transparent;
		background: transparent;
		color: var(--muted);
		font-size: var(--t-meta);
		padding: 2px 0;
		cursor: pointer;
	}
	button:hover {
		color: var(--blue);
	}
	.active,
	.active:hover {
		color: var(--ink);
		border-bottom-color: var(--blue);
	}
</style>
