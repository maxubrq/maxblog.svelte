<script lang="ts">
	/** A hairline from the baseline up to the curve — an edge you can sight along. */
	import { usePlot } from './plot';

	let { f, at }: { f: (x: number) => number; at: number } = $props();

	const p = usePlot();
</script>

<line x1={p.x(at)} y1={p.y(f(at))} x2={p.x(at)} y2={p.base} class="hair" />

<style>
	.hair {
		stroke: var(--rule);
		stroke-width: 1;
	}
</style>
