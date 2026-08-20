<script lang="ts">
	/** The baseline, its ticks, and the name of what x measures. */
	import { usePlot } from './plot';

	let {
		count = 6,
		label = '',
		format = String
	}: {
		/** A hint, not a promise — d3 picks the nearest round step to it. */
		count?: number;
		label?: string;
		format?: (v: number) => string;
	} = $props();

	const p = usePlot();
	const ticks = $derived(p.x.ticks(count));
</script>

<line x1={p.left} y1={p.base} x2={p.right} y2={p.base} class="rule" />
{#each ticks as t (t)}
	<line x1={p.x(t)} y1={p.base} x2={p.x(t)} y2={p.base + 4} class="rule" />
	<text x={p.x(t)} y={p.base + 16} text-anchor="middle" class="tick">{format(t)}</text>
{/each}
{#if label}
	<text x={(p.left + p.right) / 2} y={p.height - 4} text-anchor="middle" class="name">{label}</text>
{/if}

<style>
	.rule {
		stroke: var(--rule-hard);
		stroke-width: 1;
	}
	.tick {
		font-family: var(--mono);
		font-size: 10px;
		fill: var(--muted);
	}
	.name {
		font-family: var(--body);
		font-size: 11px;
		font-style: italic;
		fill: var(--muted);
	}
</style>
