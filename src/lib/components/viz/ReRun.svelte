<script lang="ts">
	/**
	 * "Chạy lại quý ở một chiều không thời gian khác", made literal.
	 *
	 * Every press draws two fresh quarters from a world where **nothing has
	 * changed** — same team, same spread, no improvement whatsoever — and drops
	 * the difference between their means onto the axis. The pile grows into the
	 * bell the prose asserts, and some of the dots land past the difference the
	 * essay actually observed. Those are inked in the accent: runs that would
	 * have been read as proof, from a world with nothing to prove.
	 *
	 * The generator is seeded (`stats.ts`) so the prerendered page and the
	 * hydrated one show the same opening draw.
	 */
	import DiagramPlate from '$lib/components/tech/DiagramPlate.svelte';
	import { useI18n } from '$lib/i18n';
	import Controls from './Controls.svelte';
	import Curve from './Curve.svelte';
	import Plot from './Plot.svelte';
	import Readout from './Readout.svelte';
	import Rule from './Rule.svelte';
	import Swarm from './Swarm.svelte';
	import XAxis from './XAxis.svelte';
	import { slots } from './plot';
	import { bell, draws, mean, rng } from './stats';

	let {
		mu = 40,
		sd,
		n,
		at,
		seed = 20260819,
		opening = 8,
		once,
		ten,
		clear,
		atLabel,
		axisLabel = '',
		readout,
		label,
		hint = '',
		caption = '',
		alt = ''
	}: {
		/** The team's average velocity. Only moves the dots' origin, not their spread. */
		mu?: number;
		/** One sd per quarter — the two the post measured. */
		sd: [number, number];
		/** Sprints per quarter. */
		n: number;
		/** The difference actually observed, which the dots are compared against. */
		at: number;
		seed?: number;
		/** Runs already on the plate before the reader touches anything. */
		opening?: number;
		/**
		 * Chrome. Every one of these falls back to `$lib/i18n`'s `viz.reRun`;
		 * pass one only where the post wants its own wording.
		 */
		once?: string;
		ten?: string;
		clear?: string;
		atLabel: string;
		axisLabel?: string;
		/** Template with `{runs}`, `{hits}` and `{at}`. */
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
		once: once ?? t.reRun.once,
		ten: ten ?? t.reRun.ten,
		clear: clear ?? t.reRun.clear,
		readout: readout ?? t.reRun.readout
	});

	/** The width the differences *should* scatter with, if the prose is right. */
	const se = $derived(Math.hypot(sd[0] / Math.sqrt(n), sd[1] / Math.sqrt(n)));
	const domain = $derived([-3.4 * se, 3.4 * se] as [number, number]);

	// The seed and the opening draw are read once, deliberately: a figure whose
	// dots reshuffled because a prop changed would throw away the reader's runs.
	// svelte-ignore state_referenced_locally
	let next = rng(seed);
	/** One re-run: two quarters from the same unchanged world, means subtracted. */
	const trial = () => mean(draws(next, n, mu, sd[1])) - mean(draws(next, n, mu, sd[0]));

	// svelte-ignore state_referenced_locally
	let runs = $state<number[]>(Array.from({ length: opening }, trial));

	const hits = $derived(runs.filter((v) => v >= at).length);
	const values = $derived<Record<string, string>>({
		runs: String(runs.length),
		hits: String(hits),
		at: `${at >= 0 ? '+' : ''}${at}`
	});

	function roll(k: number) {
		runs = [...runs, ...Array.from({ length: k }, trial)];
	}
	function reset() {
		next = rng(seed);
		runs = [];
	}
</script>

<DiagramPlate label={chrome.label} {hint} {caption} live>
	<Controls>
		<button onclick={() => roll(1)}>{chrome.once}</button>
		<button onclick={() => roll(10)}>{chrome.ten}</button>
		<button onclick={reset}>{chrome.clear}</button>
	</Controls>

	<!-- Shallower than the default: no bracket under this axis to make room for. -->
	<Plot
		xDomain={domain}
		yMax={1.15}
		height={286}
		margin={{ top: 26, right: 26, bottom: 46, left: 26 }}
		{alt}
	>
		<XAxis label={axisLabel} />
		<Curve f={bell(0, se)} tone="muted" />
		<Rule {at} label={atLabel} side={at >= 0 ? 'right' : 'left'} />
		<Swarm values={runs} {at} />
	</Plot>

	<Readout tone="clay">
		{#each slots(chrome.readout) as s, i (i)}
			{#if 'key' in s}
				<span class="clay">{values[s.key] ?? `{${s.key}}`}</span>
			{:else}{s.text}{/if}
		{/each}
	</Readout>
</DiagramPlate>
