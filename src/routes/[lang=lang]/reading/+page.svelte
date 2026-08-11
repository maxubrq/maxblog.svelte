<script lang="ts">
	/**
	 * Reading preferences — the whole set, with a sample that answers back.
	 *
	 * The header dropdown carries the four decisions worth taking mid-sentence;
	 * this is the room where the rest live. Port of the production blog's
	 * `ReadingPreferences.tsx`, in the same brutalist control language: a bar of
	 * segments for a choice between three, a square switch for a yes/no.
	 *
	 * Two rules the page holds to.
	 *
	 * Every change is live and saved at once. There is no Apply button and no
	 * unsaved state to lose — you should never have to imagine what a setting
	 * will do, which is also why the sample sits beside the controls rather than
	 * behind a preview button.
	 *
	 * And every control here reaches the essay itself, not just the sample: the
	 * settings land on `<html>` (see `applyPrefs` in `$lib/reading-prefs`) and
	 * the prose, the column and the article's instruments read them from there.
	 */
	import Headline from '$lib/components/ink/Headline.svelte';
	import Tag from '$lib/components/ink/Tag.svelte';
	import { useI18n } from '$lib/i18n';
	import {
		LINE_SPACING_STEPS,
		TEXT_SIZE_STEPS,
		type FramingPref,
		type LayoutPref,
		type MeasurePref,
		type ThemePref,
		type TypefacePref
	} from '$lib/reading-prefs';
	import { reading } from '$lib/reading.svelte';
	import { site } from '$lib/site';

	const i18n = useI18n();
	const t = $derived(i18n.t.reading);

	const prefs = $derived(reading.prefs);

	/**
	 * Snap a stored value to the nearest offered step. The store may hold
	 * anything inside the readable range — set by another edition, or by an
	 * older set of steps — and a segmented bar has to light exactly one segment.
	 */
	const nearest = (value: number, steps: readonly number[]) =>
		steps.reduce((a, b) => (Math.abs(b - value) < Math.abs(a - value) ? b : a));

	const size = $derived(nearest(prefs.fontSize, TEXT_SIZE_STEPS));
	const spacing = $derived(nearest(prefs.lineSpacing, LINE_SPACING_STEPS));

	/**
	 * The sample paints its own paper, so dusk and night can be *looked at*
	 * without the whole page flipping under the reader mid-decision. Which
	 * means these five values are the only place in the codebase outside
	 * `app.css` that names a colour — they are a picture of the palette, not a
	 * use of it.
	 */
	const PAPERS: Record<ThemePref, { bg: string; fg: string; muted: string; rule: string }> = {
		light: { bg: '#fafaf7', fg: '#24242c', muted: '#77777f', rule: 'rgba(13,13,17,.14)' },
		dusk: { bg: '#f4f1ea', fg: '#2a2620', muted: '#7d766a', rule: 'rgba(42,38,32,.16)' },
		dark: { bg: '#0d0d11', fg: '#d8d8dd', muted: '#8f8f97', rule: 'rgba(233,233,236,.16)' }
	};
	const paper = $derived(PAPERS[reading.theme]);

	const SERIF = "Georgia, 'Iowan Old Style', 'Times New Roman', serif";

	// The sample's column shows the *proportion* between the three widths, not
	// their pixels — app.css sets those at 700 / 820 / 940, and no preview panel
	// is 940px wide. The spread is the honest part; the absolute width is not.
	const SAMPLE_WIDTH: Record<MeasurePref, string> = {
		'52': '78%',
		'60': '89%',
		'72': '100%'
	};
</script>

<svelte:head>
	<title>{t.label.toLowerCase()} — {site.name}</title>
	<!-- A control panel, not a page. -->
	<meta name="robots" content="noindex" />
</svelte:head>

{#snippet seg<T extends string>(
	label: string,
	value: T,
	options: [T, string][],
	choose: (v: T) => void
)}
	<div class="seg" role="radiogroup" aria-label={label}>
		{#each options as [id, text] (id)}
			<button
				role="radio"
				aria-checked={value === id}
				class:on={value === id}
				onclick={() => choose(id)}>{text}</button
			>
		{/each}
	</div>
{/snippet}

{#snippet toggle(label: string, on: boolean, choose: (v: boolean) => void)}
	<button
		class="switch"
		class:on
		role="switch"
		aria-checked={on}
		aria-label={label}
		onclick={() => choose(!on)}
	>
		<span class="knob"></span>
	</button>
{/snippet}

<section class="masthead">
	<div class="masthead-tags">
		<Tag on>{t.label}</Tag>
		<Tag>{t.deviceOnly}</Tag>
	</div>
	<Headline text={`${t.headingLead} ${t.headingAccent}`} accent={t.headingAccent} size={66} />
	<p class="intro">{t.intro}</p>
</section>

<section class="grid">
	<div class="controls">
		<h2>{t.sectionPage}</h2>

		<div class="row">
			<div class="label">
				<span class="name">{t.textSize}</span>
				<p class="hint">{t.textSizeHint}</p>
			</div>
			<div class="control">
				{@render seg(
					t.textSize,
					String(size),
					TEXT_SIZE_STEPS.map((px, i) => [String(px), ['S', 'M', 'L', 'XL'][i]]) as [
						string,
						string
					][],
					(v) => reading.set('fontSize', Number(v))
				)}
			</div>
		</div>

		<div class="row">
			<div class="label">
				<span class="name">{t.lineSpacing}</span>
				<p class="hint">{t.lineSpacingHint}</p>
			</div>
			<div class="control">
				{@render seg(
					t.lineSpacing,
					String(spacing),
					[
						[String(LINE_SPACING_STEPS[0]), t.spacingTight],
						[String(LINE_SPACING_STEPS[1]), t.spacingNormal],
						[String(LINE_SPACING_STEPS[2]), t.spacingAiry]
					],
					(v) => reading.set('lineSpacing', Number(v))
				)}
			</div>
		</div>

		<div class="row">
			<div class="label">
				<span class="name">{t.measure}</span>
				<p class="hint">{t.measureHint}</p>
			</div>
			<div class="control">
				{@render seg(
					t.measure,
					prefs.measure,
					[
						['52', '52'],
						['60', '60'],
						['72', '72']
					] as [MeasurePref, string][],
					(v) => reading.set('measure', v)
				)}
			</div>
		</div>

		<div class="row">
			<div class="label">
				<span class="name">{t.typeface}</span>
				<p class="hint">{t.typefaceHint}</p>
			</div>
			<div class="control">
				{@render seg(
					t.typeface,
					prefs.typeface,
					[
						['sans', t.typefaceSans],
						['serif', t.typefaceSerif]
					] as [TypefacePref, string][],
					(v) => reading.set('typeface', v)
				)}
			</div>
		</div>

		<h2>{t.sectionLight}</h2>

		<div class="row">
			<div class="label">
				<span class="name">{t.theme}</span>
				<p class="hint">{t.themeHint}</p>
			</div>
			<div class="control">
				{@render seg(
					t.theme,
					prefs.themeAuto ? ('' as ThemePref) : prefs.theme,
					[
						['light', t.themeDay],
						['dusk', t.themeDusk],
						['dark', t.themeNight]
					] as [ThemePref, string][],
					(v) => reading.setTheme(v)
				)}
			</div>
		</div>

		<div class="row">
			<div class="label">
				<span class="name">{t.themeAuto}</span>
				<p class="hint">{t.themeAutoHint}</p>
			</div>
			<div class="control">
				{@render toggle(t.themeAuto, prefs.themeAuto, (v) => reading.setThemeAuto(v))}
			</div>
		</div>

		<h2>{t.sectionReading}</h2>

		<div class="row">
			<div class="label">
				<span class="name">{t.flowMode}</span>
				<p class="hint">{t.flowModeHint}</p>
			</div>
			<div class="control">
				{@render toggle(t.flowMode, prefs.mode === 'flow', (v) =>
					reading.set('mode', v ? 'flow' : 'study')
				)}
			</div>
		</div>

		<div class="row">
			<div class="label">
				<span class="name">{t.cursor}</span>
				<p class="hint">{t.rulerHint}</p>
			</div>
			<div class="control">
				{@render toggle(t.cursor, prefs.ruler, (v) => reading.set('ruler', v))}
			</div>
		</div>

		<div class="row">
			<div class="label">
				<span class="name">{t.timeLeft}</span>
				<p class="hint">{t.timeLeftHint}</p>
			</div>
			<div class="control">
				{@render toggle(t.timeLeft, prefs.timeLeft, (v) => reading.set('timeLeft', v))}
			</div>
		</div>

		<h2>{t.sectionArticle}</h2>

		<div class="row">
			<div class="label">
				<span class="name">{t.sidenotes}</span>
				<p class="hint">{t.sidenotesHint}</p>
			</div>
			<div class="control">
				{@render seg(
					t.sidenotes,
					prefs.layout,
					[
						['single', t.layoutSingle],
						['sidenote', t.layoutSidenote]
					] as [LayoutPref, string][],
					(v) => reading.set('layout', v)
				)}
			</div>
		</div>

		<div class="row">
			<div class="label">
				<span class="name">{t.framing}</span>
				<p class="hint">{t.framingHint}</p>
			</div>
			<div class="control">
				{@render seg(
					t.framing,
					prefs.framing,
					[
						['rule', t.framingRule],
						['bleed', t.framingBleed],
						['card', t.framingCard]
					] as [FramingPref, string][],
					(v) => reading.set('framing', v)
				)}
			</div>
		</div>
	</div>

	<div class="preview">
		<div class="preview-inner">
			<div class="preview-head">
				<Tag on>{t.livePreview}</Tag>
				<Tag>{size}px / {spacing}× / {prefs.measure}</Tag>
			</div>

			<div class="sheet" style="background:{paper.bg}">
				<div style="max-width:{SAMPLE_WIDTH[prefs.measure]}">
					<div class="sheet-label" style="color:{paper.muted}; border-color:{paper.rule}">
						{prefs.mode === 'flow' ? t.previewFlow : t.previewStudy}
					</div>
					{#each t.previewLines as line, i (i)}
						<!-- The second line stands in for the row you are reading, so the
						     cursor has something to hold in contrast. -->
						{@const focus = i === 1}
						<p
							class="sample"
							style="opacity:{prefs.ruler && !focus ? 0.34 : 1};
							       font-family:{prefs.typeface === 'serif' ? SERIF : 'var(--body)'};
							       font-size:{size}px; line-height:{spacing}; color:{paper.fg};
							       font-weight:{focus && prefs.ruler ? 500 : 400}"
						>
							{line}
						</p>
					{/each}
				</div>
			</div>

			<div class="preview-foot">
				<span class="saved">{reading.ready ? t.savedNote : ''}</span>
				<button class="reset" onclick={() => reading.reset()}>{t.reset}</button>
			</div>
		</div>
	</div>
</section>

<style>
	.masthead {
		padding: 42px var(--pad-chrome) 30px;
		border-bottom: 1.5px solid var(--rule-hard);
	}
	.masthead-tags {
		display: flex;
		justify-content: space-between;
		gap: 16px;
		flex-wrap: wrap;
		margin-bottom: 14px;
	}
	.intro {
		font-family: var(--body);
		max-width: 58ch;
		font-size: 16px;
		line-height: 1.55;
		color: var(--muted);
		margin: 18px 0 0;
	}

	.grid {
		display: grid;
		grid-template-columns: 1fr 440px;
	}
	.controls {
		padding: 10px var(--pad-chrome) 60px;
		border-right: 1.5px solid var(--rule-hard);
	}

	h2 {
		font-family: var(--display);
		font-weight: 700;
		font-size: 22px;
		letter-spacing: -0.02em;
		text-transform: lowercase;
		line-height: 1.2;
		margin: 30px 0 2px;
	}

	.row {
		display: grid;
		grid-template-columns: 1fr 220px;
		gap: 24px;
		align-items: center;
		padding: 18px 0;
		border-top: 1px solid var(--rule);
	}
	.name {
		font-family: var(--display);
		font-weight: 600;
		font-size: 16px;
		letter-spacing: -0.01em;
		text-transform: lowercase;
	}
	.hint {
		font-family: var(--body);
		font-size: 13px;
		line-height: 1.45;
		color: var(--muted);
		margin: 4px 0 0;
		max-width: 52ch;
	}
	.control {
		display: flex;
		justify-content: flex-end;
	}

	/* A bar of segments — the brutalist radio group: one hard frame, hairlines
	   between, the chosen one filled with ink-blue. */
	.seg {
		display: flex;
		border: 1.5px solid var(--rule-hard);
		width: 100%;
	}
	.seg button {
		flex: 1;
		border: none;
		border-right: 1px solid var(--rule);
		background: transparent;
		color: var(--ink);
		font-family: var(--mono);
		font-size: 11px;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		padding: 11px 4px;
		cursor: pointer;
		white-space: nowrap;
		transition:
			background 0.12s,
			color 0.12s;
	}
	.seg button:last-child {
		border-right: none;
	}
	.seg button.on {
		background: var(--panel-blue);
		color: var(--on-blue);
	}

	/* A switch, drawn as a rectangle sliding inside a rectangle — §3 forbids
	   the pill shape the rest of the web uses for this. */
	.switch {
		width: 52px;
		height: 28px;
		flex-shrink: 0;
		border: 1.5px solid var(--rule-hard);
		background: transparent;
		padding: 2px;
		cursor: pointer;
		display: flex;
		justify-content: flex-start;
		transition:
			background 0.15s,
			border-color 0.15s;
	}
	.switch.on {
		border-color: var(--panel-blue);
		background: var(--panel-blue);
		justify-content: flex-end;
	}
	.knob {
		width: 20px;
		height: 20px;
		background: var(--rule-hard);
		display: block;
	}
	.switch.on .knob {
		background: var(--on-blue);
	}

	.preview-inner {
		position: sticky;
		top: 72px;
	}
	.preview-head {
		padding: 14px 20px;
		border-bottom: 1px solid var(--rule);
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 10px;
	}
	.sheet {
		padding: 28px 22px;
		transition: background 0.35s ease;
		min-height: 480px;
	}
	.sheet-label {
		font-family: var(--mono);
		font-size: 10px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		padding-bottom: 12px;
		margin-bottom: 18px;
		border-bottom: 1px solid;
	}
	.sample {
		margin: 0;
		transition: opacity 0.3s ease;
	}
	.preview-foot {
		padding: 14px 20px;
		border-top: 1.5px solid var(--rule-hard);
		display: flex;
		gap: 10px;
		align-items: center;
	}
	.saved {
		flex: 1;
		font-family: var(--mono);
		font-size: 10px;
		letter-spacing: 0.06em;
		line-height: 1.5;
		color: var(--muted);
	}
	.reset {
		border: 1.5px solid var(--rule-hard);
		background: transparent;
		color: var(--ink);
		font-family: var(--mono);
		font-size: 11px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		padding: 11px 16px;
		cursor: pointer;
	}
	.reset:hover {
		border-color: var(--blue);
		color: var(--blue);
	}

	@media (max-width: 900px) {
		/* The sample goes first: on a phone it would otherwise sit below every
		   control it is meant to be answering. */
		.grid {
			grid-template-columns: 1fr;
		}
		.controls {
			border-right: none;
			order: 2;
		}
		.preview {
			order: 1;
			border-bottom: 1.5px solid var(--rule-hard);
		}
		.preview-inner {
			position: static;
		}
	}
	@media (max-width: 560px) {
		.row {
			grid-template-columns: 1fr;
			gap: 12px;
		}
		.control {
			justify-content: flex-start;
		}
	}
</style>
