<script lang="ts">
	/**
	 * Display settings — one button in the header's right slot (§4).
	 *
	 * Theme, notes layout and interactive framing live in the same dropdown:
	 * they are one decision ("how should this page look"), so they get one
	 * control. Theme is wired through; layout and framing write their attribute
	 * and wait for the components that will read it.
	 */
	import SettingsMark from '$lib/components/ink/SettingsMark.svelte';
	import { href, useI18n } from '$lib/i18n';
	import {
		FRAMINGS,
		LAYOUTS,
		THEMES,
		THEME_GLYPH,
		loadPrefs,
		savePref,
		type FramingPref,
		type LayoutPref,
		type ThemePref
	} from '$lib/reading-prefs';

	const i18n = useI18n();
	const t = $derived(i18n.t.reading);

	let open = $state(false);
	let theme = $state<ThemePref>('light');
	let layout = $state<LayoutPref>('sidenote');
	let framing = $state<FramingPref>('card');
	let root = $state<HTMLDivElement>();

	$effect(() => {
		const p = loadPrefs();
		// With no stored theme the page is following the system; show *that* as
		// the active chip rather than a "light" the reader never picked.
		const stamped = document.documentElement.dataset.theme as ThemePref | undefined;
		theme =
			stamped ??
			(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : p.theme);
		layout = p.layout;
		framing = p.framing;
	});

	function chooseTheme(next: ThemePref) {
		theme = next;
		savePref('theme', next);
		document.documentElement.dataset.theme = next;
	}
	function chooseLayout(next: LayoutPref) {
		layout = next;
		savePref('layout', next);
		document.documentElement.dataset.layout = next;
	}
	function chooseFraming(next: FramingPref) {
		framing = next;
		savePref('framing', next);
		document.documentElement.dataset.framing = next;
	}

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
							class:active={theme === id}
							aria-pressed={theme === id}
							onclick={() => chooseTheme(id)}>{THEME_GLYPH[id]} {themeLabel[id]}</button
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
							class:active={layout === id}
							aria-pressed={layout === id}
							onclick={() => chooseLayout(id)}>{layoutLabel[id]}</button
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
							class:active={framing === id}
							aria-pressed={framing === id}
							onclick={() => chooseFraming(id)}>{framingLabel[id]}</button
						>
					{/each}
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
