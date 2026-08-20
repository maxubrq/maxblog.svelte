<script lang="ts">
	/** A measured width, called out under the axis so it can be read off. */
	import { usePlot } from './plot';

	let { from, to, label }: { from: number; to: number; label: string } = $props();

	const p = usePlot();
	const y = $derived(p.base + 26);
</script>

<line x1={p.x(from)} y1={y} x2={p.x(to)} y2={y} class="rule" />
<line x1={p.x(from)} y1={y - 4} x2={p.x(from)} y2={y + 4} class="rule" />
<line x1={p.x(to)} y1={y - 4} x2={p.x(to)} y2={y + 4} class="rule" />
<text x={(p.x(from) + p.x(to)) / 2} y={y + 16} text-anchor="middle" class="label">{label}</text>

<style>
	.rule {
		stroke: var(--ink);
		stroke-width: 1;
	}
	.label {
		font-family: var(--mono);
		font-size: 11px;
		fill: var(--ink);
	}
</style>
