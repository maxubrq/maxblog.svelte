<script lang="ts">
	/**
	 * Two or more curves means a legend — identity never rests on colour alone.
	 * A figure with one curve has its name in the plate's head instead.
	 */
	let { items }: { items: { label: string; tone: 'blue' | 'muted' | 'clay' }[] } = $props();
</script>

<div class="legend">
	{#each items as it (it.label)}
		<span><span class="swatch {it.tone}"></span>{it.label}</span>
	{/each}
</div>

<style>
	.legend {
		display: flex;
		justify-content: center;
		gap: 18px;
		flex-wrap: wrap;
		margin: 0 16px 4px;
		font-family: var(--body);
		font-size: 11.5px;
		color: var(--muted);
	}
	span {
		display: inline-flex;
		align-items: center;
		gap: 6px;
	}
	.swatch {
		width: 16px;
		height: 2px;
	}
	.blue {
		background: var(--viz-blue);
	}
	.muted {
		background: var(--muted);
	}
	.clay {
		background: var(--viz-clay);
	}
</style>
