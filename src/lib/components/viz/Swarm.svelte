<script lang="ts">
	/**
	 * One dot per observation, stacked where they land — the histogram a reader
	 * builds by watching rather than by being shown. Bins are px-wide, not
	 * data-wide, so the pile is the same shape whatever the axis measures.
	 */
	import { usePlot } from './plot';

	let {
		values,
		r = 3.5,
		at = null
	}: {
		values: number[];
		r?: number;
		/** Dots at or beyond this get the accent — the "as big as observed" ones. */
		at?: number | null;
	} = $props();

	const p = usePlot();

	const dots = $derived.by(() => {
		const step = r * 2 + 1;
		const counts = new Map<number, number>();
		return values.map((v) => {
			const px = p.x(v);
			const bin = Math.round(px / step);
			const stack = counts.get(bin) ?? 0;
			counts.set(bin, stack + 1);
			return { cx: bin * step, cy: p.base - r - 1 - stack * step, hit: at !== null && v >= at };
		});
	});
</script>

{#each dots as d, i (i)}
	<circle cx={d.cx} cy={d.cy} {r} class="dot" class:hit={d.hit} />
{/each}

<style>
	.dot {
		fill: var(--viz-blue);
		opacity: 0.55;
	}
	/* The draws that would have been mistaken for a real improvement. */
	.hit {
		fill: var(--viz-clay);
		opacity: 1;
	}
</style>
