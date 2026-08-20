<script lang="ts">
	/**
	 * An interval of the curve, washed in. This is the mark that carries "this
	 * much is ordinary": the shaded width IS the claim, so it gets edges you
	 * can sight along and room for one sentence inside it.
	 */
	import { area } from 'd3-shape';
	import Hair from './Hair.svelte';
	import { samples, usePlot } from './plot';

	let {
		f,
		from,
		to,
		label = '',
		edges = true,
		steps = 80
	}: {
		f: (x: number) => number;
		from: number;
		to: number;
		/** The hairlines at the interval's ends. Off when the wash is a tail. */
		edges?: boolean;
		/** Set inside the wash — say what share of the time the interval holds. */
		label?: string;
		steps?: number;
	} = $props();

	const p = usePlot();
	const d = $derived(
		area<number>()
			.x((v) => p.x(v))
			.y0(p.base)
			.y1((v) => p.y(f(v)))(samples(from, to, steps))
	);
</script>

<path d={d ?? ''} class="wash" />
{#if edges}
	<Hair {f} at={from} />
	<Hair {f} at={to} />
{/if}
{#if label}
	<text x={(p.x(from) + p.x(to)) / 2} y={p.y(0.34)} text-anchor="middle" class="label">{label}</text>
{/if}

<style>
	/* A wash, not a block: the shaded interval is still the same one curve. */
	.wash {
		fill: var(--viz-blue);
		opacity: 0.1;
	}
	.label {
		font-family: var(--body);
		font-size: 12px;
		fill: var(--ink);
	}
</style>
