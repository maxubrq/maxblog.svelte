<script lang="ts">
	/** Any y = f(x), sampled and stroked. 2px, the one plotted line. */
	import { line } from 'd3-shape';
	import { samples, usePlot } from './plot';

	let {
		f,
		from,
		to,
		tone = 'blue',
		steps = 160
	}: {
		f: (x: number) => number;
		/** Defaults to the full width of the plot. */
		from?: number;
		to?: number;
		/** `muted` is the curve a figure compares *against* — present, not loud. */
		tone?: 'blue' | 'muted';
		steps?: number;
	} = $props();

	const p = usePlot();
	const d = $derived(
		line<number>()
			.x((v) => p.x(v))
			.y((v) => p.y(f(v)))(samples(from ?? p.x.domain[0], to ?? p.x.domain[1], steps))
	);
</script>

<path d={d ?? ''} class="curve {tone}" />

<style>
	.curve {
		fill: none;
		stroke-width: 2;
		stroke-linejoin: round;
	}
	.blue {
		stroke: var(--viz-blue);
	}
	.muted {
		stroke: var(--muted);
		stroke-width: 1.5;
	}
</style>
