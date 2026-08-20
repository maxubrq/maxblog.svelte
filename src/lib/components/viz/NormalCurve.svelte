<script lang="ts">
	/**
	 * A normal curve drawn at a stated width — the picture behind a standard
	 * error, a standard deviation, any "±this much is just noise" claim.
	 *
	 * Static on purpose. The blue ● and the `interactive` tag belong to figures
	 * the reader can move (§4); this one is a printed plate that happens to be
	 * computed, so it stands in `DiagramPlate` with `live` off and ships no
	 * behaviour. Everything it says is in its props, which is also why it has no
	 * i18n entry: the labels are the post's own sentences, in the post's language.
	 *
	 * The y axis is deliberately unlabelled and untick'd. Density on a bell has
	 * no unit a reader wants; the figure is about *width on x*, and a y scale
	 * would invite reading heights against each other.
	 *
	 * Geometry is `Plot` and the marks around it; all this file decides is the
	 * curve, the interval, and how wide to stand back.
	 */
	import DiagramPlate from '$lib/components/tech/DiagramPlate.svelte';
	import { useI18n } from '$lib/i18n';
	import Band from './Band.svelte';
	import Bracket from './Bracket.svelte';
	import Curve from './Curve.svelte';
	import Hair from './Hair.svelte';
	import Mark from './Mark.svelte';
	import Plot from './Plot.svelte';
	import XAxis from './XAxis.svelte';

	interface CurveMark {
		/** Where on the x axis, in the same unit as `sd`. */
		at: number;
		label: string;
		side?: 'left' | 'right';
	}

	let {
		sd,
		center = 0,
		band = true,
		bandLabel = '',
		bandTick = '',
		marks = [],
		axisLabel = '',
		label,
		hint = '',
		caption = '',
		alt = ''
	}: {
		/** The width of the curve — one SE, one σ, whatever the prose just computed. */
		sd: number;
		center?: number;
		/** Shade ±1 sd, the interval the prose is usually talking about. */
		band?: boolean;
		/** Set inside the shaded interval — say what share of the time it holds. */
		bandLabel?: string;
		/** Rides the bracket under the axis, e.g. `±SE = 3.49`. */
		bandTick?: string;
		/** Vertical rules with a direct label: an observation, a threshold. */
		marks?: CurveMark[];
		axisLabel?: string;
		/** The plate's name. Falls back to `viz.figure` in the reader's locale. */
		label?: string;
		hint?: string;
		caption?: string;
		/** Screen-reader sentence. Falls back to the caption. */
		alt?: string;
	} = $props();

	// `useI18n` reads context, so it must be called at init — not inside a
	// derived, which may first run later. Same shape as `FloatVsFixed`.
	const i18n = useI18n();
	const plateLabel = $derived(label ?? i18n.t.viz.figure);

	/** Density normalised to a peak of 1 — see the note about the y axis above. */
	const pdf = $derived((x: number) => Math.exp(-0.5 * ((x - center) / sd) ** 2));

	/** Wide enough for the tails to flatten, and for every mark to stay inside. */
	const span = $derived(
		Math.max(3.2 * sd, ...marks.map((m) => Math.abs(m.at - center) * 1.25))
	);
	const domain = $derived([center - span, center + span] as [number, number]);
</script>

<DiagramPlate label={plateLabel} {hint} {caption}>
	<Plot xDomain={domain} alt={alt || caption}>
		{#if band}
			<Band f={pdf} from={center - sd} to={center + sd} label={bandLabel} />
		{/if}

		<XAxis label={axisLabel} />

		<!-- The centre: where the difference sits when nothing has changed. -->
		<Hair f={pdf} at={center} />

		<Curve f={pdf} />

		{#if band && bandTick}
			<Bracket from={center - sd} to={center + sd} label={bandTick} />
		{/if}

		{#each marks as m (m.at)}
			<Mark f={pdf} at={m.at} label={m.label} side={m.side} />
		{/each}
	</Plot>
</DiagramPlate>
