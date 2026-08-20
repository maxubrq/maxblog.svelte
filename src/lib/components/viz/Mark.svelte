<script lang="ts">
	/** One value called out on the curve: a rule, a dot, and its own label. */
	import { usePlot } from './plot';

	let {
		f,
		at,
		label,
		side
	}: {
		f: (x: number) => number;
		at: number;
		label: string;
		/** Which way the label reads. Defaults to away from the plot's middle. */
		side?: 'left' | 'right';
	} = $props();

	const p = usePlot();
	const mid = $derived((p.x.domain[0] + p.x.domain[1]) / 2);
	const right = $derived((side ?? (at >= mid ? 'right' : 'left')) === 'right');
</script>

<line x1={p.x(at)} y1={p.y(f(at))} x2={p.x(at)} y2={p.base} class="mark" />
<circle cx={p.x(at)} cy={p.y(f(at))} r="4" class="dot" />
<text
	x={p.x(at) + (right ? 10 : -10)}
	y={p.y(f(at)) - 10}
	text-anchor={right ? 'start' : 'end'}
	class="label">{label}</text
>

<style>
	/* One plotted accent besides the curve — §11's sanctioned viz exception. */
	.mark {
		stroke: var(--viz-clay);
		stroke-width: 2;
	}
	/* A 2px ring in the paper colour, so the dot survives crossing the curve. */
	.dot {
		fill: var(--viz-clay);
		stroke: var(--paper);
		stroke-width: 2;
	}
	.label {
		font-family: var(--body);
		font-size: 12px;
		fill: var(--ink);
	}
</style>
