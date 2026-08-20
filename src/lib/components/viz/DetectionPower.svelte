<script lang="ts">
	/**
	 * Two bells and a threshold: the picture of *power*.
	 *
	 * The noise bell stands at 0 and never moves. The reader slides the second
	 * one — "suppose the improvement is real, and this big" — and the shaded
	 * tail past the threshold is the share of the time they would actually
	 * catch it. Slide onto the threshold itself and the tail is visibly half:
	 * that is the essay's "50% số lần bắt được", stated by the picture instead
	 * of by a number.
	 *
	 * Live: it carries the `● interactive` tag and its post declares
	 * `interactive: true`.
	 */
	import DiagramPlate from '$lib/components/tech/DiagramPlate.svelte';
	import { useI18n } from '$lib/i18n';
	import Band from './Band.svelte';
	import Controls from './Controls.svelte';
	import Curve from './Curve.svelte';
	import Legend from './Legend.svelte';
	import Plot from './Plot.svelte';
	import { slots } from './plot';
	import Readout from './Readout.svelte';
	import Rule from './Rule.svelte';
	import XAxis from './XAxis.svelte';
	import { bell, normalCdf } from './stats';

	let {
		se,
		z = 1.96,
		max = 0,
		start = 0,
		presets = [],
		sliderLabel,
		thresholdLabel,
		axisLabel = '',
		legendNoise,
		legendEffect,
		readout,
		label,
		hint = '',
		caption = '',
		alt = ''
	}: {
		/** The standard error of the difference — the width of both bells. */
		se: number;
		/** How far out the threshold sits, in SE. 1.96 is α = 5%, two-sided. */
		z?: number;
		/** Top of the slider. Defaults to a bit past the 80%-power point. */
		max?: number;
		/** Where the slider starts. Defaults to the threshold. */
		start?: number;
		/** Jump-to buttons: `{ label, at }`. */
		presets?: { label: string; at: number }[];
		/** Chrome — each falls back to `$lib/i18n`'s `viz.power`. */
		sliderLabel?: string;
		thresholdLabel: string;
		axisLabel?: string;
		legendNoise?: string;
		legendEffect?: string;
		/** Template with `{delta}` and `{power}`. */
		readout?: string;
		label?: string;
		hint?: string;
		caption?: string;
		alt?: string;
	} = $props();

	// `useI18n` reads context, so it must be called at init — not inside a
	// derived, which may first run later. Same shape as `FloatVsFixed`.
	const i18n = useI18n();
	const t = $derived(i18n.t.viz);
	const chrome = $derived({
		label: label ?? t.liveFigure,
		slider: sliderLabel ?? t.power.slider,
		legendNoise: legendNoise ?? t.power.legendNoise,
		legendEffect: legendEffect ?? t.power.legendEffect,
		readout: readout ?? t.power.readout
	});

	const threshold = $derived(z * se);
	const ceiling = $derived(max || Math.ceil((z + 1.2) * se));

	// Read once on purpose: this is where the slider *starts*, not where it is.
	// svelte-ignore state_referenced_locally
	let delta = $state(start || z * se);

	const noise = $derived(bell(0, se));
	const effect = $derived(bell(delta, se));
	/** The tail of the *effect* bell lying past the threshold. */
	const power = $derived(1 - normalCdf(threshold, delta, se));

	// Fixed, not fitted to `delta`: an axis that rescaled while the reader
	// dragged would move the threshold under their eye.
	const domain = $derived([-3.2 * se, ceiling + 2.6 * se] as [number, number]);

	const values = $derived<Record<string, string>>({
		delta: delta.toFixed(1),
		power: `${Math.round(power * 100)}%`
	});
</script>

<DiagramPlate label={chrome.label} {hint} {caption} live>
	<Controls>
		<label for="delta">
			{chrome.slider}
			<span class="mono">{delta.toFixed(1)}</span>
		</label>
		<input id="delta" type="range" min="0" max={ceiling} step="0.1" bind:value={delta} />
		{#each presets as p (p.label)}
			<button class:on={Math.abs(delta - p.at) < 0.05} onclick={() => (delta = p.at)}>
				{p.label}
			</button>
		{/each}
	</Controls>

	<!-- `yMax` above 1 buys a strip of headroom, so a bell's peak never reaches
	     the row the threshold's label is set on. -->
	<Plot xDomain={domain} yMax={1.15} {alt}>
		<Band f={effect} from={threshold} to={domain[1]} edges={false} />
		<XAxis label={axisLabel} />
		<Curve f={noise} tone="muted" />
		<Curve f={effect} />
		<Rule at={threshold} label={thresholdLabel} />
	</Plot>

	<Legend
		items={[
			{ label: chrome.legendNoise, tone: 'muted' },
			{ label: chrome.legendEffect, tone: 'blue' }
		]}
	/>

	<Readout>
		{#each slots(chrome.readout) as s, i (i)}
			{#if 'key' in s}
				<span class="mono">{values[s.key] ?? `{${s.key}}`}</span>
			{:else}{s.text}{/if}
		{/each}
	</Readout>
</DiagramPlate>
