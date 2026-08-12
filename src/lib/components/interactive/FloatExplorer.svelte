<script lang="ts">
	/**
	 * The other direction: a stored pattern, taken apart. Port of the production
	 * blog's `FloatExplorer.tsx` — the 32-bit strip, the three fields decoded,
	 * and the doubling table that shows why 0.1 never lands.
	 */
	import DiagramPlate from '$lib/components/tech/DiagramPlate.svelte';
	import Underline from '$lib/components/ink/Underline.svelte';
	import { fields, fracToBinary, showStored, toBitArray } from '$lib/float32';
	import { fill, useI18n } from '$lib/i18n';

	const i18n = useI18n();
	const t = $derived(i18n.t.floatExplorer);

	const PRESETS = [
		['0.1', '0.1'],
		['0.2', '0.2'],
		['1/3', String(1 / 3)],
		['π', String(Math.PI)],
		['1.0', '1'],
		['-1.5', '-1.5'],
		['∞', 'Infinity']
	] as const;

	let raw = $state('0.1');
	let hovered = $state<number | null>(null);
	let tab = $state<'anatomy' | 'fraction'>('anatomy');

	const num = $derived.by(() => {
		if (raw === 'Infinity') return Infinity;
		if (raw === '-Infinity') return -Infinity;
		const n = parseFloat(raw);
		return Number.isNaN(n) ? 0 : n;
	});

	const f = $derived(fields(num));
	const bitArr = $derived(toBitArray(f.bits));
	const error = $derived(
		Number.isFinite(num) && Number.isFinite(f.stored) ? num - f.stored : null
	);

	const frac = $derived(Number.isFinite(num) ? Math.abs(num) % 1 : 0);
	const fracData = $derived(frac > 0 ? fracToBinary(frac) : { digits: [], repeatAt: -1 });

	/** Which field a bit belongs to — the one rule the whole figure is coloured by. */
	const fieldOf = (i: number) => (i === 0 ? 'sign' : i <= 8 ? 'exp' : 'mant');

	const signDesc = $derived(f.sign === 0 ? t.signPositive : t.signNegative);

	const expDesc = $derived.by(() => {
		if (f.kind === 'zero') return fill(t.specialZero, { bits: f.exp });
		if (f.kind === 'subnormal') return fill(t.specialSubnormal, { bits: f.exp });
		if (f.kind === 'infinity' || f.kind === 'nan') return fill(t.specialInfNan, { bits: f.exp });
		const real = f.exp - 127;
		// Pure arithmetic — the same in every language.
		return `${f.exp} − 127 = ${real}  →  2^${real} = ${Math.pow(2, real)}`;
	});

	const mantDesc = $derived.by(() => {
		if (f.kind === 'nan') return fill(t.nanPayload, { n: f.mant });
		if (f.kind === 'zero') return t.noSignificantBits;
		return `1.${f.mantBin.slice(0, 10)}…  =  ${(1 + f.mant / 2 ** 23).toPrecision(8)}`;
	});

	const panels = $derived([
		{ field: 'sign', label: t.panelSign, bits: `bit 31 = ${f.sign}`, decoded: signDesc },
		{ field: 'exp', label: t.panelExp, bits: `bits 30–23 = ${f.expBin} = ${f.exp}`, decoded: expDesc },
		{ field: 'mant', label: t.panelMant, bits: `bits 22–0  = ${f.mantBin}`, decoded: mantDesc }
	]);

	const formulaLine = $derived.by(() => {
		if (f.kind === 'zero') return '± 0';
		if (f.kind === 'infinity') return f.sign ? '−∞' : '+∞';
		if (f.kind === 'nan') return 'NaN';
		const s = f.sign === 0 ? '+1' : '−1';
		const e = f.exp - (f.kind === 'subnormal' ? 0 : 127);
		const em = f.kind === 'subnormal' ? '2^−126' : `2^${e}`;
		const mb = f.kind === 'subnormal' ? '0' : '1';
		return `${s}  ×  ${em}  ×  ${mb}.${f.mantBin.slice(0, 10)}…`;
	});

	/**
	 * Where the stored value stops matching what was typed. Everything up to the
	 * shared prefix is what the reader asked for; the tail is what the machine
	 * added on its own, and that is what the drawn mark points at.
	 */
	const divergence = $derived.by(() => {
		const asked = String(num);
		const stored = Number.isFinite(f.stored) ? f.stored.toPrecision(10) : String(f.stored);
		let i = 0;
		while (i < asked.length && i < stored.length && asked[i] === stored[i]) i++;
		return { asked, shared: stored.slice(0, i), diverged: stored.slice(i) };
	});

	const hoveredLabel = $derived.by(() => {
		if (hovered === null) return '';
		const i = hovered;
		const which =
			i === 0 ? t.bitIsSign : i <= 8 ? fill(t.bitIsExp, { n: 8 - i }) : fill(t.bitIsMant, { n: 22 - (i - 9) });
		return `${fill(t.bitN, { n: 31 - i })}  ·  ${which}  ·  ${bitArr[i]}`;
	});
</script>

<DiagramPlate label="Live figure" hint="IEEE 754 · float32" live caption={t.spec}>
	<div class="controls">
		<input bind:value={raw} aria-label="IEEE 754 · float32" spellcheck="false" />
		<div class="presets">
			{#each PRESETS as [label, value] (label)}
				<button class:on={raw === value} onclick={() => (raw = value)}>{label}</button>
			{/each}
		</div>
	</div>

	<div class="pad">
		<!-- ── the 32 bits, as they are laid down ── -->
		<div class="strip-labels">
			<span class="sign">{t.fieldSign}</span>
			<span class="exp">{t.fieldExp}</span>
			<span class="mant">{t.fieldMant}</span>
		</div>
		<div class="strip">
			{#each bitArr as bit, i (i)}
				<span
					class="bit {fieldOf(i)}"
					class:set={bit === 1}
					class:hot={hovered === i}
					role="presentation"
					onmouseenter={() => (hovered = i)}
					onmouseleave={() => (hovered = null)}>{bit}</span
				>
			{/each}
		</div>
		<div class="strip-labels ends">
			<span>31</span>
			<span>30 ──────── 23</span>
			<span>22 ─────────────── 0</span>
		</div>

		<!-- Reserved whether or not a bit is hovered, so nothing below jumps. -->
		<div class="hovered {hovered === null ? '' : fieldOf(hovered)}" aria-live="polite">
			{#if hovered !== null}<span>{hoveredLabel}</span>{/if}
		</div>

		<div class="tabs">
			<button class:on={tab === 'anatomy'} onclick={() => (tab = 'anatomy')}>{t.tabAnatomy}</button>
			<button class:on={tab === 'fraction'} onclick={() => (tab = 'fraction')}
				>{t.tabFraction}</button
			>
		</div>

		{#if tab === 'anatomy'}
			<div class="anatomy">
				<div class="fieldsCol">
					{#each panels as panel (panel.label)}
						<div class="panel {panel.field}">
							<div class="panel-label">{panel.label}</div>
							<div class="panel-bits">{panel.bits}</div>
							<div class="panel-decoded">{panel.decoded}</div>
						</div>
					{/each}
				</div>

				<div class="cards">
					<div class="card">
						<div class="label">{t.reconstructedAs}</div>
						<div class="formula">
							{#if f.kind === 'normal'}
								<span class="sign">(-1)^{f.sign}</span>
								×
								<span class="exp">2^{f.exp - 127}</span>
								×
								<span class="mant">1.{f.mantBin.slice(0, 8)}…</span>
							{:else}
								<span class="quiet">{formulaLine}</span>
							{/if}
						</div>
						<div class="equals">= {showStored(f.stored)}</div>
					</div>

					<div class="card">
						<div class="label">{t.representationError}</div>
						{#if error === null}
							<p class="quiet">{t.noErrorSpecial}</p>
						{:else if error === 0}
							<p class="quiet">{t.exactValue}</p>
						{:else}
							<div class="err" class:loud={Math.abs(error) > 1e-5}>
								{error > 0 ? '+' : ''}{error.toExponential(4)}
							</div>
							<dl class="compare">
								<dt>{t.asked}</dt>
								<dd>{divergence.asked}</dd>
								<dt>{t.got}</dt>
								<dd>
									{divergence.shared}{#if divergence.diverged}<span class="diverged"
											>{divergence.diverged}<Underline w={38} left={0} bottom={-6} /></span
										>{/if}
								</dd>
							</dl>
							<p class="quiet">{t.gapUnavoidable}</p>
						{/if}
					</div>
				</div>
			</div>
		{:else}
			<div class="fraction">
				{#if fracData.digits.length === 0}
					<p class="quiet big">
						{Number.isFinite(num) ? fill(t.fractionInteger, { n: num }) : t.fractionSpecial}
					</p>
				{:else}
					<p class="quiet big">
						{t.algorithm}{fracData.repeatAt >= 0 ? t.algorithmRepeat : ''}
					</p>
					<div class="scroll">
						<table>
							<thead>
								<tr>
									<th>{t.colStep}</th>
									<th>{t.colValue}</th>
									<th>× 2</th>
									<th>{t.colBit}</th>
									<th></th>
								</tr>
							</thead>
							<tbody>
								{#each fracData.digits as d, i (i)}
									<!-- Two rows in this table carry the whole argument: where the
									     cycle starts, and where the mantissa runs out. -->
									<tr class:cycle={fracData.repeatAt === i} class:cut={i === 23}>
										<td class="quiet">{i + 1}</td>
										<td>{d.frac.toFixed(8)}</td>
										<td>{d.doubled.toFixed(8)}</td>
										<td class="digit" class:one={d.bit === 1}>{d.bit}</td>
										<td class="mark">
											{#if fracData.repeatAt === i}
												<span class="exp">{t.cycleStarts}</span>
											{:else if i === 23}
												<span class="mant">{t.cutoff}</span>
											{/if}
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
					{#if fracData.repeatAt >= 0}
						<p class="note">{fill(t.repeatNote, { n: num.toPrecision(4) })}</p>
					{/if}
				{/if}
			</div>
		{/if}
	</div>
</DiagramPlate>

<style>
	.controls {
		display: flex;
		align-items: center;
		gap: 16px;
		flex-wrap: wrap;
		padding: 14px 16px;
		border-bottom: 1px solid var(--rule);
	}
	input {
		font-family: var(--mono);
		font-size: 16px;
		width: 180px;
		background: transparent;
		border: none;
		border-bottom: 1.5px solid var(--rule);
		border-radius: 0;
		color: var(--ink);
		padding: 2px 0;
	}
	input:focus {
		outline: none;
		border-bottom-color: var(--blue);
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

	.pad {
		padding: 16px;
	}

	/* 1 : 8 : 23 — the strip's own proportions, so the labels stand over the
	   bits they name. */
	.strip-labels {
		display: grid;
		grid-template-columns: 1fr 8fr 23fr;
		gap: 2px;
		font-family: var(--mono);
		font-size: 9px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		text-align: center;
		margin-bottom: 5px;
	}
	.strip-labels.ends {
		margin: 4px 0 0;
		font-size: 8px;
		letter-spacing: 0;
		text-transform: none;
		color: var(--muted);
	}
	.strip {
		display: flex;
		gap: 2px;
	}
	.bit {
		flex: 1;
		min-width: 0;
		height: 34px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: var(--mono);
		font-size: 10.5px;
		font-weight: 700;
		background: var(--paper);
		border: 1px solid currentColor;
		opacity: 0.78;
		user-select: none;
		transition:
			transform 0.1s,
			opacity 0.1s;
	}
	/* A set bit is the field's colour filled in; a clear one is the outline. */
	.bit.set {
		background: currentColor;
		color: var(--paper);
	}
	.bit.set.sign {
		background: var(--viz-red);
	}
	.bit.set.exp {
		background: var(--viz-gold);
	}
	.bit.set.mant {
		background: var(--blue);
	}
	.bit.hot {
		opacity: 1;
		transform: scaleY(1.12);
	}

	.hovered {
		min-height: 34px;
		padding: 8px 0 4px;
		font-family: var(--mono);
		font-size: 11px;
		letter-spacing: 0.05em;
		color: var(--muted);
	}
	.hovered span {
		border: 1px solid currentColor;
		padding: 4px 10px;
	}

	.tabs {
		display: flex;
		border-bottom: 1px solid var(--rule);
		margin-bottom: 18px;
	}
	.tabs button {
		border: none;
		border-bottom: 2px solid transparent;
		background: transparent;
		cursor: pointer;
		font-family: var(--mono);
		font-size: 10.5px;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		padding: 7px 16px 9px;
		margin-bottom: -1px;
		color: var(--muted);
	}
	.tabs button:hover {
		color: var(--blue);
	}
	.tabs button.on {
		color: var(--blue);
		border-bottom-color: var(--blue);
	}

	.anatomy {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 20px;
	}
	.fieldsCol {
		display: flex;
		flex-direction: column;
		gap: 14px;
	}
	.panel {
		border-left: 2px solid currentColor;
		padding-left: 14px;
	}
	.panel-label {
		font-family: var(--mono);
		font-size: 9.5px;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		margin-bottom: 3px;
	}
	.panel-bits {
		font-family: var(--mono);
		font-size: 10px;
		color: var(--muted);
		word-break: break-all;
		margin-bottom: 4px;
	}
	.panel-decoded {
		font-family: var(--body);
		font-size: 13.5px;
		line-height: 1.4;
		color: var(--ink);
	}

	.cards {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}
	.card {
		background: var(--paper);
		border: 1.5px solid var(--rule-hard);
		padding: 14px 16px;
	}
	.label {
		font-family: var(--mono);
		font-size: 9px;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: var(--muted);
		margin-bottom: 8px;
	}
	.formula {
		font-family: var(--body);
		font-size: 14px;
		line-height: 1.8;
	}
	.equals {
		margin-top: 10px;
		font-family: var(--mono);
		font-size: 13px;
		font-weight: 600;
		word-break: break-all;
	}
	.err {
		font-family: var(--mono);
		font-size: 13px;
		color: var(--muted);
		margin-bottom: 6px;
	}
	.err.loud {
		color: var(--viz-gold);
	}
	.compare {
		display: grid;
		grid-template-columns: auto 1fr;
		column-gap: 12px;
		row-gap: 9px;
		align-items: baseline;
		font-family: var(--mono);
		font-size: 12.5px;
		margin: 0 0 18px;
	}
	dt {
		font-size: 9px;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--muted);
	}
	dd {
		margin: 0;
		word-break: break-all;
	}
	/* The drawn line lands exactly where the machine stopped agreeing with you —
	   the one place in this figure where a mark says what the grid cannot. */
	.diverged {
		position: relative;
		display: inline-block;
	}

	.fraction .scroll {
		overflow-x: auto;
	}
	/* The prose stylesheet turns every table in an article into its own
	   scrolling block (PostBody's `.prose table`). This one already lives in a
	   scroller of its own, so it is put back to being a table — otherwise it
	   shrink-wraps to a third of the plate and carries the prose's margins. */
	.fraction table {
		display: table;
		width: 100%;
		border-collapse: collapse;
		font-family: var(--mono);
		font-size: 12px;
		margin: 0;
		white-space: nowrap;
	}
	.fraction th {
		padding: 4px 12px 8px;
		text-align: left;
		font-weight: 400;
		font-size: 9.5px;
		letter-spacing: 0.15em;
		text-transform: uppercase;
		color: var(--muted);
		border-bottom: 1px solid var(--rule);
	}
	.fraction td {
		padding: 5px 12px;
		border-top: 1px solid var(--rule);
		border-bottom: none;
		vertical-align: baseline;
	}
	tr.cycle td {
		border-top: 2px solid var(--viz-gold);
		background: color-mix(in srgb, var(--viz-gold) 8%, transparent);
	}
	tr.cut td {
		border-top: 2px solid var(--blue);
		background: color-mix(in srgb, var(--blue) 7%, transparent);
	}
	.digit {
		font-weight: 700;
		font-size: 14px;
		color: var(--viz-red);
	}
	.digit.one {
		color: var(--blue);
	}
	.mark {
		font-family: var(--body);
		font-size: 11px;
		white-space: nowrap;
	}
	.note {
		margin: 16px 0 0;
		padding: 12px 16px;
		border-left: 2px solid var(--viz-gold);
		background: color-mix(in srgb, var(--viz-gold) 6%, transparent);
		font-family: var(--body);
		font-size: 13.5px;
		line-height: 1.65;
	}

	.quiet {
		color: var(--muted);
		font-family: var(--body);
		font-size: 13px;
		margin: 0;
	}
	.quiet.big {
		font-size: 13.5px;
		line-height: 1.7;
		margin-bottom: 18px;
	}

	.sign {
		color: var(--viz-red);
	}
	.exp {
		color: var(--viz-gold);
	}
	.mant {
		color: var(--blue);
	}

	@media (max-width: 720px) {
		.anatomy {
			grid-template-columns: 1fr;
		}
		.bit {
			height: 26px;
			font-size: 8px;
		}
		.strip-labels {
			font-size: 8px;
		}
	}
</style>
