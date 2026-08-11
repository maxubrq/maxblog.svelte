<script lang="ts">
	/**
	 * Display settings — one button in the header's right slot (§4).
	 *
	 * Theme, notes layout, interactive framing, reading mode and the two
	 * in-article instruments live in the same dropdown: they are one decision
	 * ("how should this page look"), so they get one control. Everything here
	 * writes a data attribute on <html>, or a store the article reads.
	 */
	import SettingsMark from '$lib/components/ink/SettingsMark.svelte';
	import { href, useI18n } from '$lib/i18n';
	import {
		FRAMINGS,
		LAYOUTS,
		MODES,
		THEMES,
		THEME_GLYPH,
		type FramingPref,
		type LayoutPref,
		type ModePref,
		type ThemePref
	} from '$lib/reading-prefs';
	import { reading } from '$lib/reading.svelte';

	const i18n = useI18n();
	const t = $derived(i18n.t.reading);

	let open = $state(false);
	let root = $state<HTMLDivElement>();

	// The values live in the store, not here: `/reading` edits the same settings
	// and neither surface remounts on a client-side navigation, so a local copy
	// would go stale the moment the reader used the other one.
	const prefs = $derived(reading.prefs);

	const themeLabel = $derived<Record<ThemePref, string>>({
		light: t.themeDay,
		dusk: t.themeDusk,
		dark: t.themeNight
	});
	const layoutLabel = $derived<Record<LayoutPref, string>>({
		single: t.layoutSingle,
		sidenote: t.layoutSidenote
	});
	const framingLabel = $derived<Record<FramingPref, string>>({
		rule: t.framingRule,
		bleed: t.framingBleed,
		card: t.framingCard
	});
	const modeLabel = $derived<Record<ModePref, string>>({
		study: t.modeStudy,
		flow: t.modeFlow
	});

	function onPointerDown(e: MouseEvent) {
		if (open && root && !root.contains(e.target as Node)) open = false;
	}
	function onKeyDown(e: KeyboardEvent) {
		if (e.key === 'Escape') open = false;
	}
</script>

<svelte:window onmousedown={onPointerDown} onkeydown={onKeyDown} />

<div class="wrap" bind:this={root}>
	<button
		class="trigger"
		onclick={() => (open = !open)}
		aria-label={t.displaySettings}
		aria-expanded={open}
		aria-haspopup="menu"
		title={t.displaySettings}
	>
		<SettingsMark size={15} color={open ? 'var(--blue)' : 'var(--ink)'} />
	</button>

	{#if open}
		<div class="menu" role="menu">
			<div class="section">
				<div class="section-label">{t.theme}</div>
				<div class="chips">
					{#each THEMES as id (id)}
						<button
							class="chip"
							class:active={prefs.theme === id && !prefs.themeAuto}
							aria-pressed={prefs.theme === id && !prefs.themeAuto}
							onclick={() => reading.setTheme(id)}>{THEME_GLYPH[id]} {themeLabel[id]}</button
						>
					{/each}
				</div>
			</div>

			<div class="section">
				<div class="section-label">{t.sidenotes}</div>
				<div class="chips">
					{#each LAYOUTS as id (id)}
						<button
							class="chip"
							class:active={prefs.layout === id}
							aria-pressed={prefs.layout === id}
							onclick={() => reading.set('layout', id)}>{layoutLabel[id]}</button
						>
					{/each}
				</div>
			</div>

			<div class="section">
				<div class="section-label">{t.framing}</div>
				<div class="chips">
					{#each FRAMINGS as id (id)}
						<button
							class="chip"
							class:active={prefs.framing === id}
							aria-pressed={prefs.framing === id}
							onclick={() => reading.set('framing', id)}>{framingLabel[id]}</button
						>
					{/each}
				</div>
			</div>

			<div class="section">
				<div class="section-label">{t.mode}</div>
				<div class="chips">
					{#each MODES as id (id)}
						<button
							class="chip"
							class:active={prefs.mode === id}
							aria-pressed={prefs.mode === id}
							onclick={() => reading.set('mode', id)}>{modeLabel[id]}</button
						>
					{/each}
				</div>
			</div>

			<!-- Two instruments the reader can put away. Each chip is its own
			     switch: the label names the thing, and `active` says whether it
			     is on — there is no "off" to press instead. -->
			<div class="section">
				<div class="section-label">{t.inArticle}</div>
				<div class="chips">
					<button
						class="chip"
						class:active={prefs.ruler}
						aria-pressed={prefs.ruler}
						onclick={() => reading.set('ruler', !prefs.ruler)}>{t.cursor}</button
					>
					<button
						class="chip"
						class:active={prefs.timeLeft}
						aria-pressed={prefs.timeLeft}
						onclick={() => reading.set('timeLeft', !prefs.timeLeft)}>{t.timeLeft}</button
					>
				</div>
			</div>

			<a class="all" href={href(i18n.lang, '/reading')} onclick={() => (open = false)}
				>{t.allPreferences} →</a
			>
			<p class="hint">{t.dropdownHint}</p>
		</div>
	{/if}
</div>

<style>
	.wrap {
		position: relative;
		display: flex;
		align-items: center;
	}

	.trigger {
		background: transparent;
		border: none;
		cursor: pointer;
		padding: 4px 6px;
		display: flex;
		align-items: center;
		line-height: 1;
	}

	.menu {
		position: absolute;
		top: calc(100% + 8px);
		right: 0;
		/* Wide enough for the three theme chips to sit on one row. */
		min-width: 300px;
		padding: 16px 16px 10px;
		background: var(--paper);
		border: 1.5px solid var(--rule-hard);
		color: var(--ink);
		/* The article running head is uppercase + letter-spaced; the menu must
		   read the same there as it does in the site header. */
		text-transform: none;
		letter-spacing: normal;
		z-index: 200;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
	}

	.section {
		margin-bottom: 14px;
	}
	.section-label {
		font-family: var(--mono);
		font-size: 9px;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--muted);
		margin-bottom: 7px;
	}
	.chips {
		display: flex;
		flex-wrap: wrap;
		gap: 4px;
	}
	.chip {
		border: 1px solid var(--rule);
		background: transparent;
		color: var(--ink);
		font-family: var(--mono);
		font-size: 10.5px;
		letter-spacing: 0.03em;
		padding: 4px 9px;
		cursor: pointer;
		transition:
			background 0.12s,
			color 0.12s;
	}
	.chip:hover {
		border-color: var(--rule-hard);
	}
	.chip.active {
		background: var(--panel-blue);
		border-color: var(--panel-blue);
		color: var(--on-blue);
	}

	.all {
		display: block;
		margin-top: 4px;
		padding-top: 10px;
		border-top: 1px solid var(--rule);
		font-family: var(--mono);
		font-size: 10px;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--blue);
	}
	.hint {
		font-family: var(--mono);
		font-size: 9px;
		letter-spacing: 0.03em;
		line-height: 1.5;
		color: var(--muted);
		margin: 6px 0 0;
	}
</style>
