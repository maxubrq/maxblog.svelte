<script lang="ts">
	/**
	 * The box a figure is drawn in. Owns the `<svg>`, the margins and the two
	 * scales; the marks inside read them from context, so none of them has to
	 * agree with any other about where the baseline is.
	 */
	import type { Snippet } from 'svelte';
	import { linear, setPlot } from './plot';

	let {
		xDomain,
		yMax = 1,
		width = 620,
		height = 318,
		margin = { top: 30, right: 26, bottom: 70, left: 26 },
		alt = '',
		children
	}: {
		xDomain: [number, number];
		/** The top of the y scale. Unlabelled by design — see `NormalCurve`. */
		yMax?: number;
		width?: number;
		height?: number;
		margin?: { top: number; right: number; bottom: number; left: number };
		/** The sentence a screen reader gets instead of the picture. */
		alt?: string;
		children: Snippet;
	} = $props();

	const base = $derived(height - margin.bottom);
	const x = $derived(linear(xDomain, [margin.left, width - margin.right]));
	const y = $derived(linear([0, yMax], [base, margin.top]));

	setPlot({
		get x() {
			return x;
		},
		get y() {
			return y;
		},
		get base() {
			return base;
		},
		get left() {
			return margin.left;
		},
		get right() {
			return width - margin.right;
		},
		get top() {
			return margin.top;
		},
		get height() {
			return height;
		}
	});
</script>

<div class="chart">
	<svg viewBox="0 0 {width} {height}" role="img" aria-label={alt}>
		{@render children()}
	</svg>
</div>

<style>
	.chart {
		padding: 14px 16px 6px;
	}
	svg {
		display: block;
		width: 100%;
		height: auto;
	}
</style>
