<script lang="ts">
	/**
	 * Display settings — one button in the header's right slot, two rows inside
	 * (DESIGN.md §4): the theme, and the size of the prose. Everything else
	 * the page used to ask is decided by the page.
	 */
	import SettingsMark from '$lib/components/ink/SettingsMark.svelte';
	import { useI18n } from '$lib/i18n';
	import { TEXT_SIZES, THEMES, type ThemePref } from '$lib/reading-prefs';
	import { reading } from '$lib/reading.svelte';

	const i18n = useI18n();
	const t = $derived(i18n.t.reading);

	let open = $state(false);
	let root = $state<HTMLDivElement>();

	const prefs = $derived(reading.prefs);
	const themeLabel = $derived<Record<ThemePref, string>>({
		system: t.themeSystem,
		light: t.themeDay,
		dark: t.themeNight
	});
	const atMin = $derived(prefs.fontSize === TEXT_SIZES[0]);
	const atMax = $derived(prefs.fontSize === TEXT_SIZES[TEXT_SIZES.length - 1]);

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
		aria-haspopup="true"
		title={t.displaySettings}
	>
		<SettingsMark size={15} color={open ? 'var(--blue)' : 'var(--ink)'} />
	</button>

	{#if open}
		<div class="menu" role="group" aria-label={t.displaySettings}>
			<div class="section">
				<div class="section-label">{t.theme}</div>
				<div class="chips">
					{#each THEMES as id (id)}
						<button
							class="chip"
							class:active={prefs.theme === id}
							aria-pressed={prefs.theme === id}
							onclick={() => reading.setTheme(id)}>{themeLabel[id]}</button
						>
					{/each}
				</div>
			</div>

			<div class="section">
				<div class="section-label">{t.textSize}</div>
				<div class="chips">
					<button
						class="chip"
						disabled={atMin}
						aria-label={t.smaller}
						onclick={() => reading.stepSize(-1)}>A−</button
					>
					<span class="size" aria-live="polite">{prefs.fontSize}px</span>
					<button
						class="chip"
						disabled={atMax}
						aria-label={t.larger}
						onclick={() => reading.stepSize(1)}>A+</button
					>
				</div>
			</div>
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
		min-width: 260px;
		padding: var(--s-2);
		background: var(--paper);
		border: 1.5px solid var(--rule-hard);
		color: var(--ink);
		z-index: 200;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
	}

	.section + .section {
		margin-top: var(--s-2);
	}
	.section-label {
		font-family: var(--body);
		font-size: var(--t-meta);
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
		font-family: var(--body);
		font-size: var(--t-meta);
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

	.chip:disabled {
		color: var(--muted);
		border-color: var(--rule);
		cursor: default;
	}
	.size {
		min-width: 3em;
		text-align: center;
		font-size: var(--t-meta);
		font-variant-numeric: tabular-nums;
		align-self: center;
	}
</style>
