<script lang="ts">
	/** A threshold: a full-height vertical rule with its name at the top. */
	import { usePlot } from './plot';

	let {
		at,
		label = '',
		side = 'right'
	}: { at: number; label?: string; side?: 'left' | 'right' } = $props();

	const p = usePlot();
</script>

<line x1={p.x(at)} y1={p.top} x2={p.x(at)} y2={p.base} class="rule" />
{#if label}
	<text
		x={p.x(at) + (side === 'right' ? 8 : -8)}
		y={p.top + 10}
		text-anchor={side === 'right' ? 'start' : 'end'}
		class="label">{label}</text
	>
{/if}

<style>
	.rule {
		stroke: var(--viz-clay);
		stroke-width: 1.5;
	}
	.label {
		font-family: var(--body);
		font-size: 12px;
		fill: var(--ink);
	}
</style>
