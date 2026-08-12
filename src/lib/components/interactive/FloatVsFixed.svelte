<script lang="ts">
	/**
	 * The two philosophies, plotted against each other. Port of the production
	 * blog's `FloatVsFixed.tsx`.
	 *
	 * Both axes are log2: x = log2(value), y = log2(ULP). Fixed-point Q16.16 has
	 * one spacing everywhere — a flat line that simply stops at 2^16, where the
	 * format runs out of numbers. float32's doubles every binade, so it is a
	 * staircase: finer than fixed below 128, coarser above it. That crossing is
	 * the whole figure.
	 */
	import DiagramPlate from '$lib/components/tech/DiagramPlate.svelte';
	import { fill, useI18n } from '$lib/i18n';

	const i18n = useI18n();
	const t = $derived(i18n.t.floatVsFixed);

	const X_MIN = -10; // 2^-10 ≈ 0.001
	const X_MAX = 30; // 2^30 ≈ 1.07e9
	const Y_MIN = -34;
	const Y_MAX = 10;
	const FIXED_Y = -16; // log2 of the Q16.16 ULP
	const FIXED_MAX_X = 16; // 2^16 = 65,536, the Q16.16 ceiling

	const W = 600;
	const H = 320;
	const M = { top: 18, right: 20, bottom: 42, left: 52 };
	const PW = W - M.left - M.right;
	const PH = H - M.top - M.bottom;

	const sx = (x: number) => M.left + ((x - X_MIN) / (X_MAX - X_MIN)) * PW;
	const sy = (y: number) => M.top + (1 - (y - Y_MIN) / (Y_MAX - Y_MIN)) * PH;
	/** float32 keeps 23 fraction bits, so within binade 2^E the step is 2^(E−23). */
	const floatUlpExp = (E: number) => E - 23;

	const PRESETS = [
		['~0.001', -10],
		['~1', 0],
		['128', 7],
		['~65K', 16],
		['~1B', 30]
	] as const;

	let e = $state(0);

	const value = $derived(Math.pow(2, e));
	const floatUlp = $derived(Math.pow(2, floatUlpExp(e)));
	const fixedUlp = Math.pow(2, FIXED_Y);
	const inRange = $derived(e < FIXED_MAX_X);
	const finerIsFloat = $derived(floatUlp < fixedUlp);
	const ratio = $derived(floatUlp / fixedUlp);

	const staircase = (() => {
		const seg: string[] = [];
		for (let E = X_MIN; E <= X_MAX; E++) {
			const y = floatUlpExp(E);
			seg.push(`${E === X_MIN ? 'M' : 'L'} ${sx(E).toFixed(1)} ${sy(y).toFixed(1)}`);
			seg.push(`L ${sx(E + 1).toFixed(1)} ${sy(y).toFixed(1)}`);
		}
		return seg.join(' ');
	})();

	const X_TICKS = [-10, 0, 7, 16, 23, 30];
	const Y_TICKS = [-33, -23, -16, -8, 0, 7];

	function fmt(n: number): string {
		if (n === 0) return '0';
		const a = Math.abs(n);
		if (a >= 1e5 || a < 1e-3) return n.toExponential(2);
		if (Number.isInteger(n)) return n.toLocaleString('en-US');
		return n.toPrecision(4).replace(/\.?0+$/, '');
	}
</script>

<DiagramPlate label="Live figure" hint={t.label} live>
	<div class="controls">
		<label for="binade">
			{t.around}
			<span class="mant">2^{e}</span> ≈ <span class="mono">{fmt(value)}</span>
		</label>
		<input id="binade" type="range" min={X_MIN} max={X_MAX} step="1" bind:value={e} />
		<div class="presets">
			{#each PRESETS as [label, at] (label)}
				<button class:on={e === at} onclick={() => (e = at)}>{label}</button>
			{/each}
		</div>
	</div>

	<div class="chart">
		<svg viewBox="0 0 {W} {H}" role="img" aria-label={t.label}>
			{#each Y_TICKS as y (y)}
				<line x1={M.left} y1={sy(y)} x2={W - M.right} y2={sy(y)} class="grid" />
				<text x={M.left - 8} y={sy(y) + 3} text-anchor="end" class="tick">2^{y}</text>
			{/each}
			{#each X_TICKS as x (x)}
				<text x={sx(x)} y={H - M.bottom + 16} text-anchor="middle" class="tick">2^{x}</text>
			{/each}
			<text x={M.left + PW / 2} y={H - 4} text-anchor="middle" class="axis">{t.axis}</text>

			<!-- Fixed-point: solid where the format reaches, dashed past its ceiling. -->
			<line x1={sx(X_MIN)} y1={sy(FIXED_Y)} x2={sx(FIXED_MAX_X)} y2={sy(FIXED_Y)} class="fixed" />
			<line
				x1={sx(FIXED_MAX_X)}
				y1={sy(FIXED_Y)}
				x2={sx(X_MAX)}
				y2={sy(FIXED_Y)}
				class="fixed gone"
			/>

			<path d={staircase} class="float" />

			<!-- Where the two spacings are equal: 2^(7−23) = 2^−16. -->
			<circle cx={sx(7)} cy={sy(FIXED_Y)} r="3.5" class="tiemark" />
			<text x={sx(7)} y={sy(FIXED_Y) - 9} text-anchor="middle" class="tielabel">{t.tie}</text>

			<line x1={sx(e)} y1={M.top} x2={sx(e)} y2={H - M.bottom} class="cursor" />
			<circle cx={sx(e)} cy={sy(floatUlpExp(e))} r="3.5" class="dot float-dot" />
			{#if inRange}
				<circle cx={sx(e)} cy={sy(FIXED_Y)} r="3.5" class="dot fixed-dot" />
			{/if}
		</svg>

		<div class="legend">
			<span><span class="swatch fixed-sw"></span>{t.legendFixed}</span>
			<span><span class="swatch float-sw"></span>{t.legendFloat}</span>
		</div>
	</div>

	<p class="readout" class:float-lead={finerIsFloat}>
		{t.readAround}
		<span class="mono">{fmt(value)}</span>, {t.readFloat}
		<span class="mant">{floatUlp.toExponential(2)}</span>, {t.readFixed}
		{#if inRange}
			<span class="clay">{fixedUlp.toExponential(2)}</span>.
			{fill(t.readRatio, {
				word: finerIsFloat ? t.finer : t.coarser,
				ratio: ratio >= 1 ? `${fmt(ratio)}×` : `${fmt(1 / ratio)}×`
			})}
		{:else}
			<span class="clay out">{t.outOfRange}</span>
		{/if}
	</p>
</DiagramPlate>

<style>
	.controls {
		display: flex;
		align-items: center;
		gap: 14px;
		flex-wrap: wrap;
		padding: 14px 16px;
		border-bottom: 1px solid var(--rule);
	}
	label {
		font-family: var(--body);
		font-size: 13px;
	}
	input[type='range'] {
		flex: 1;
		min-width: 160px;
		accent-color: var(--blue);
	}
	.presets {
		display: flex;
		gap: 6px;
		flex-wrap: wrap;
	}
	.presets button {
		font-family: var(--mono);
		font-size: 10px;
		padding: 4px 9px;
		border: 1px solid var(--rule);
		border-radius: 0;
		background: transparent;
		color: var(--muted);
		cursor: pointer;
	}
	.presets button:hover {
		color: var(--blue);
		border-color: var(--blue);
	}
	.presets button.on {
		background: var(--panel-blue);
		border-color: var(--panel-blue);
		color: var(--on-blue);
	}

	.chart {
		padding: 16px 16px 4px;
	}
	svg {
		display: block;
		width: 100%;
		height: auto;
	}
	.grid {
		stroke: var(--rule);
		stroke-width: 0.5;
	}
	.tick {
		font-family: var(--mono);
		font-size: 9px;
		fill: var(--muted);
	}
	.axis {
		font-family: var(--body);
		font-size: 11px;
		font-style: italic;
		fill: var(--muted);
	}
	/* Two plotted lines, two viz colours — §11's sanctioned exception. */
	.fixed {
		stroke: var(--viz-clay);
		stroke-width: 2;
	}
	.fixed.gone {
		stroke-width: 1.5;
		stroke-dasharray: 3 4;
		opacity: 0.5;
	}
	.float {
		fill: none;
		stroke: var(--blue);
		stroke-width: 2;
	}
	.tiemark {
		fill: none;
		stroke: var(--ink);
		stroke-width: 1.2;
	}
	.tielabel {
		font-family: var(--body);
		font-size: 10px;
		font-style: italic;
		fill: var(--ink);
	}
	.cursor {
		stroke: var(--ink);
		stroke-width: 0.75;
		stroke-dasharray: 2 3;
		opacity: 0.6;
	}
	.float-dot {
		fill: var(--blue);
	}
	.fixed-dot {
		fill: var(--viz-clay);
	}

	.legend {
		display: flex;
		justify-content: center;
		gap: 18px;
		flex-wrap: wrap;
		margin-top: 4px;
		font-family: var(--body);
		font-size: 11.5px;
		color: var(--muted);
	}
	.legend span {
		display: inline-flex;
		align-items: center;
		gap: 6px;
	}
	.swatch {
		width: 16px;
		height: 2px;
	}
	.fixed-sw {
		background: var(--viz-clay);
	}
	.float-sw {
		background: var(--blue);
	}

	.readout {
		margin: 4px 16px 18px;
		padding: 12px 16px;
		border-left: 2px solid var(--viz-clay);
		background: var(--paper);
		font-family: var(--body);
		font-size: 13.5px;
		line-height: 1.65;
	}
	/* The edge takes the colour of whichever format is finer here. */
	.readout.float-lead {
		border-left-color: var(--blue);
	}
	.mono,
	.mant,
	.clay {
		font-family: var(--mono);
		font-size: 0.9em;
	}
	.mant {
		color: var(--blue);
	}
	.clay {
		color: var(--viz-clay);
	}
	.out {
		font-family: var(--body);
		font-size: 1em;
		font-style: italic;
	}
</style>
