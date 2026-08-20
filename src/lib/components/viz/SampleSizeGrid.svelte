<script lang="ts">
	/**
	 * The essay's whole argument in one table, plus the reader's own numbers.
	 *
	 * `n ≥ 2k²c² / (Δ/µ)²` has two knobs and both are squared, which is the
	 * thing a formula states and a table *shows*: halving the team's noise, or
	 * doubling the effect you are willing to look for, each cuts the wait to a
	 * quarter. Reading a row against a column is the fastest way to see that.
	 *
	 * The reader's two series are parsed, their own `c` computed, and their
	 * column lit up — so they leave with a number of their own rather than with
	 * the post's. Everything is derived; nothing is stored.
	 *
	 * HTML, not SVG. A table of numbers has to stay readable at 360px, and SVG
	 * text scales with the viewBox — see the note in `Plot`.
	 */
	import DiagramPlate from '$lib/components/tech/DiagramPlate.svelte';
	import { useI18n } from '$lib/i18n';
	import Controls from './Controls.svelte';
	import Readout from './Readout.svelte';
	import { slots } from './plot';

	let {
		k = 2.8,
		targets = [0.05, 0.1, 0.2],
		columns = [0.075, 0.1, 0.15, 0.2],
		target = 0.1,
		first,
		second,
		sprintWeeks = 2,
		firstLabel,
		secondLabel,
		targetLabel,
		unitLabel,
		cLabel,
		readoutEnough,
		readoutShort,
		invalid,
		label,
		hint = '',
		caption = '',
		alt = ''
	}: {
		/** `1.96 + 0.84` — the α = 5%, power = 80% pair the post settled on. */
		k?: number;
		/** The rows: improvements worth looking for, as a share of the mean. */
		targets?: number[];
		/** The columns: how noisy a team is, as a coefficient of variation. */
		columns?: number[];
		/** Which row starts lit. */
		target?: number;
		/** The two series the fields open with — the post's own. */
		first: string;
		second: string;
		sprintWeeks?: number;
		/** Chrome — each falls back to `$lib/i18n`'s `viz.grid`. */
		firstLabel?: string;
		secondLabel?: string;
		targetLabel?: string;
		/** What a cell counts, said once above the table. */
		unitLabel?: string;
		cLabel?: string;
		/** Templates with `{c}`, `{diff}`, `{thr}`, `{n}` and `{months}`. */
		readoutEnough?: string;
		readoutShort?: string;
		invalid?: string;
		label?: string;
		hint?: string;
		caption?: string;
		alt?: string;
	} = $props();

	// Opening values, read once: from here on the fields are the reader's, and
	// a prop change must not reach in and retype what they have entered.
	// svelte-ignore state_referenced_locally
	let a = $state(first);
	// svelte-ignore state_referenced_locally
	let b = $state(second);
	// svelte-ignore state_referenced_locally
	let pick = $state(target);

	// `useI18n` reads context, so it must be called at init — not inside a
	// derived, which may first run later. Same shape as `FloatVsFixed`.
	const i18n = useI18n();
	const t = $derived(i18n.t.viz);
	const chrome = $derived({
		label: label ?? t.liveFigure,
		first: firstLabel ?? t.grid.first,
		second: secondLabel ?? t.grid.second,
		target: targetLabel ?? t.grid.target,
		unit: unitLabel ?? t.grid.unit,
		c: cLabel ?? t.grid.variability,
		enough: readoutEnough ?? t.grid.enough,
		short: readoutShort ?? t.grid.short,
		invalid: invalid ?? t.grid.invalid
	});

	const parse = (s: string) => {
		const xs = s.trim().split(/[\s,]+/).filter(Boolean).map(Number);
		return xs.length >= 2 && xs.every((x) => Number.isFinite(x) && x > 0) ? xs : null;
	};

	/** Sample sd and mean, the `N-1` one — same as `scripts/velocity.mjs`. */
	function describe(xs: number[]) {
		const mean = xs.reduce((s, x) => s + x, 0) / xs.length;
		const variance = xs.reduce((s, x) => s + (x - mean) ** 2, 0) / (xs.length - 1);
		return { n: xs.length, mean, variance, se: Math.sqrt(variance / xs.length) };
	}

	const team = $derived.by(() => {
		const xs = parse(a);
		const ys = parse(b);
		if (!xs || !ys) return null;
		const p = describe(xs);
		const q = describe(ys);
		const sd = Math.sqrt((p.variance + q.variance) / 2);
		const mean = (p.mean + q.mean) / 2;
		const se = Math.hypot(p.se, q.se);
		return { c: sd / mean, diff: q.mean - p.mean, thr: k * se };
	});

	/** The formula, and the only place it lives. */
	const need = (c: number, t: number) => Math.ceil((2 * k ** 2 * c ** 2) / t ** 2);

	/** Which column the reader's team belongs in — nearest, not rounded down. */
	const nearest = $derived(
		team ? columns.reduce((best, c) => (Math.abs(c - team.c) < Math.abs(best - team.c) ? c : best)) : null
	);

	const pct = (x: number) => `${(x * 100).toFixed(1).replace(/\.0$/, '')}%`;
	const values = $derived.by(() => {
		if (!team) return {};
		const n = need(team.c, pick);
		return {
			c: pct(team.c),
			diff: `${team.diff >= 0 ? '+' : ''}${team.diff.toFixed(1)}`,
			thr: team.thr.toFixed(1),
			n: String(n),
			months: String(Math.round((n * sprintWeeks * 2) / 4.345))
		} as Record<string, string>;
	});
	const enough = $derived(team ? team.diff >= team.thr : false);
</script>

<DiagramPlate label={chrome.label} {hint} {caption} live>
	<Controls>
		<label for="q1">{chrome.first}</label>
		<input id="q1" type="text" bind:value={a} spellcheck="false" />
		<label for="q2">{chrome.second}</label>
		<input id="q2" type="text" bind:value={b} spellcheck="false" />
	</Controls>
	<Controls>
		<label for="target">{chrome.target}</label>
		{#each targets as t (t)}
			<button id={t === targets[0] ? 'target' : undefined} class:on={t === pick} onclick={() => (pick = t)}>
				{pct(t)}
			</button>
		{/each}
	</Controls>

	<div class="grid" role="group" aria-label={alt}>
		<p class="unit">{chrome.unit}</p>
		<table class="sizes">
			<thead>
				<tr>
					<th scope="col" class="corner">{chrome.c}</th>
					{#each columns as c (c)}
						<th scope="col" class:col={c === nearest}>{pct(c)}</th>
					{/each}
				</tr>
			</thead>
			<tbody>
				{#each targets as t (t)}
					<tr class:row={t === pick}>
						<th scope="row">{pct(t)}</th>
						{#each columns as c (c)}
							<td class:hit={t === pick && c === nearest}>{need(c, t)}</td>
						{/each}
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<Readout tone={enough ? 'blue' : 'clay'}>
		{#if team}
			{#each slots(enough ? chrome.enough : chrome.short) as s, i (i)}
				{#if 'key' in s}
					<span class={enough ? 'mono' : 'clay'}>{values[s.key] ?? `{${s.key}}`}</span>
				{:else}{s.text}{/if}
			{/each}
		{:else}
			{chrome.invalid}
		{/if}
	</Readout>
</DiagramPlate>

<style>
	.grid {
		padding: 16px 16px 4px;
		overflow-x: auto;
	}
	.unit {
		margin: 0 0 10px;
		font-family: var(--mono);
		font-size: 10.5px;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--muted);
	}
	/* Every rule below is scoped under `.grid table.sizes` on purpose. PostBody
	   styles prose tables with `.prose table` — a higher specificity than a
	   plain scoped `table` — and its `display: block` (for scrolling a wide
	   markdown table) would break this one's column layout. This grid does its
	   own scrolling in `.grid`. */
	.grid table.sizes {
		display: table;
		table-layout: fixed;
		border-collapse: collapse;
		width: 100%;
		min-width: 340px;
		margin: 0;
	}
	.grid table.sizes th,
	.grid table.sizes td {
		padding: 9px 10px;
		text-align: center;
		border: 1px solid var(--rule);
		font-family: var(--mono);
		font-size: 13px;
		/* Columns of numbers: the one place tabular figures belong. */
		font-variant-numeric: tabular-nums;
		color: var(--ink);
	}
	.grid table.sizes thead th,
	.grid table.sizes tbody th {
		color: var(--muted);
		font-weight: 400;
	}
	.grid table.sizes .corner {
		border: 0;
		text-align: right;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		font-size: 10px;
	}
	/* The row the reader chose and the column their team falls in. */
	.grid table.sizes .row td,
	.grid table.sizes .row th {
		background: color-mix(in srgb, var(--blue) 8%, transparent);
	}
	.grid table.sizes thead th.col {
		color: var(--blue);
	}
	.grid table.sizes td.hit {
		background: var(--panel-blue);
		color: var(--on-blue);
	}
</style>
