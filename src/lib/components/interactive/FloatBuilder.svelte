<script lang="ts">
	/**
	 * Building a float32 by hand — the essay's worked example, done live for
	 * whatever number the reader types. Port of the production blog's
	 * `FloatBuilder.tsx`.
	 *
	 * It goes the *encoding* way: decimal in, 32 bits out, one numbered step at
	 * a time. `FloatExplorer` beside it goes the other way, decoding a stored
	 * pattern — that is why both figures exist.
	 */
	import DiagramPlate from '$lib/components/tech/DiagramPlate.svelte';
	import { binaryExpansion, fields, showStored } from '$lib/float32';
	import { fill, useI18n } from '$lib/i18n';
	import Rich from './Rich.svelte';
	import { parseRich } from './rich';

	const i18n = useI18n();
	const t = $derived(i18n.t.floatBuilder);

	const PRESETS = [
		['-13.756', '-13.756'],
		['0.1', '0.1'],
		['12', '12'],
		['0', '0'],
		['∞', 'Infinity'],
		['NaN', 'NaN']
	] as const;

	let raw = $state('-13.756');

	const num = $derived.by(() => {
		const s = raw.trim();
		if (s === 'Infinity' || s === '+Infinity' || s === '∞') return Infinity;
		if (s === '-Infinity' || s === '-∞') return -Infinity;
		if (s === 'NaN' || s === 'nan') return NaN;
		const n = Number(s);
		return Number.isNaN(n) && s !== '' ? NaN : n || 0;
	});

	const f = $derived(fields(num));
	const abs = $derived(Number.isFinite(num) ? Math.abs(num) : 0);
	const expansion = $derived(
		f.kind === 'normal' || f.kind === 'subnormal' ? binaryExpansion(abs) : null
	);

	/**
	 * The normalised form, as the reader would write it before any rounding:
	 * the exponent is where the point had to move to, and the significand is
	 * what follows the hidden 1.
	 */
	const normalized = $derived.by(() => {
		if (!expansion || f.kind !== 'normal') return null;
		const { intBits, fracBits } = expansion;
		if (Math.floor(abs) >= 1) {
			return { e: intBits.length - 1, sig: (intBits.slice(1) + fracBits).replace(/0+$/, '') };
		}
		const k = fracBits.indexOf('1');
		if (k < 0) return null;
		return { e: -(k + 1), sig: fracBits.slice(k + 1).replace(/0+$/, '') };
	});

	const error = $derived(
		Number.isFinite(num) && Number.isFinite(f.stored) ? num - f.stored : null
	);

	type Step = { n: string; title: string; body: string };

	const steps = $derived.by<Step[]>(() => {
		if (f.kind === 'zero') return [{ n: '—', title: t.zeroTitle, body: t.zeroBody }];
		if (f.kind === 'infinity') return [{ n: '—', title: t.infTitle, body: t.infBody }];
		if (f.kind === 'nan') return [{ n: '—', title: t.nanTitle, body: t.nanBody }];

		const out: Step[] = [
			{
				n: '1',
				title: t.step1Title,
				body: fill(t.step1Body, {
					signWord: num < 0 ? t.signNegative : t.signPositive,
					signBit: f.sign,
					num: String(num),
					abs: String(abs)
				})
			}
		];

		if (expansion) {
			out.push({
				n: '2',
				title: t.step2Title,
				body: fill(t.step2Body, {
					int: Math.floor(abs),
					intBits: expansion.intBits,
					frac: expansion.fracBits.slice(0, 20),
					ell: expansion.truncated ? '…' : '',
					note: expansion.truncated ? t.step2Truncated : ''
				})
			});
		}

		if (normalized) {
			out.push({
				n: '3',
				title: t.step3Title,
				body: fill(t.step3Body, {
					sig: normalized.sig.slice(0, 20),
					ell: normalized.sig.length > 20 ? '…' : '',
					e: normalized.e
				})
			});
		}

		out.push(
			{
				n: '4',
				title: t.step4Title,
				body: fill(t.step4Body, { e: f.exp - 127, expBits: f.exp, expBin: f.expBin })
			},
			{ n: '5', title: t.step5Title, body: fill(t.step5Body, { mantBin: f.mantBin }) },
			{ n: '6', title: t.step6Title, body: '' }
		);
		return out;
	});
</script>

<DiagramPlate label="Live figure" hint={t.label} live>
	<div class="controls">
		<input bind:value={raw} aria-label={t.label} spellcheck="false" />
		<div class="presets">
			{#each PRESETS as [label, value] (label)}
				<button class:on={raw === value} onclick={() => (raw = value)}>{label}</button>
			{/each}
		</div>
	</div>

	<div class="steps">
		<ol>
			{#each steps as step (step.n + step.title)}
				<li>
					<span class="n">{step.n}</span>
					<div>
						<div class="title">{step.title}</div>
						<div class="body">
							{#if step.n === '6'}
								<!-- The last step is the assembly itself: three fields, in the
								     colours they have worn since the strip above. -->
								<span class="assembled">
									<span class="sign">{f.sign}</span>
									<span class="exp">{f.expBin}</span>
									<span class="mant">{f.mantBin}</span>
								</span>
							{:else}
								<Rich nodes={parseRich(step.body)} />
							{/if}
						</div>
					</div>
				</li>
			{/each}
		</ol>

		<div class="result">
			<div class="label">{t.storedLabel}</div>
			<div class="stored">{showStored(f.stored)}</div>
			{#if error !== null && error !== 0}
				<p class="aside">
					<Rich
						nodes={parseRich(
							fill(t.errorLine, {
								asked: String(num),
								stored: f.stored.toPrecision(10),
								err: `${error > 0 ? '+' : ''}${error.toExponential(3)}`
							})
						)}
					/>
				</p>
			{:else if error === 0}
				<p class="aside">{t.exactLine}</p>
			{/if}
		</div>
	</div>

	<div class="key">
		<span><span class="swatch sign">■</span> {t.keySign}</span>
		<span><span class="swatch exp">■</span> {t.keyExp}</span>
		<span><span class="swatch mant">■</span> {t.keyMant}</span>
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
		width: 160px;
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
		letter-spacing: 0.08em;
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

	.steps {
		padding: 16px;
	}
	ol {
		list-style: none;
		margin: 0;
		padding: 0;
	}
	li {
		display: grid;
		grid-template-columns: 30px 1fr;
		gap: 14px;
		padding: 12px 0;
		border-top: 1px solid var(--rule);
	}
	li:first-child {
		border-top: none;
	}
	.n {
		font-family: var(--mono);
		font-size: 14px;
		font-weight: 700;
		color: var(--blue);
		text-align: center;
	}
	.title {
		font-family: var(--body);
		font-size: 14px;
		font-weight: 600;
		margin-bottom: 4px;
	}
	.body {
		font-family: var(--body);
		font-size: 13.5px;
		line-height: 1.65;
		color: var(--muted);
	}
	.assembled {
		font-family: var(--mono);
		font-size: 13px;
		word-break: break-all;
		display: inline-flex;
		gap: 8px;
		flex-wrap: wrap;
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

	.result {
		margin-top: 16px;
		padding: 14px 16px;
		border: 1px solid var(--rule);
		background: var(--paper);
	}
	.label {
		font-family: var(--mono);
		font-size: 9px;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: var(--muted);
		margin-bottom: 8px;
	}
	.stored {
		font-family: var(--mono);
		font-size: 15px;
		font-weight: 600;
		word-break: break-all;
	}
	.aside {
		margin: 8px 0 0;
		font-family: var(--body);
		font-size: 12.5px;
		font-style: italic;
		line-height: 1.5;
		color: var(--muted);
	}

	/* The key closes the plate: it names the three colours, and it is the same
	   three in every figure of this essay. */
	.key {
		display: flex;
		gap: 18px;
		flex-wrap: wrap;
		padding: 10px 16px;
		border-top: 1px solid var(--rule);
		font-family: var(--mono);
		font-size: 10px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--muted);
	}
	.swatch {
		margin-right: 4px;
	}

	@media (max-width: 720px) {
		li {
			grid-template-columns: 22px 1fr;
			gap: 10px;
		}
	}
</style>
