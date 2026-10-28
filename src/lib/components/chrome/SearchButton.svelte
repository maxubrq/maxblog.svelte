<script lang="ts">
	/**
	 * The header's search trigger — a magnifier in a 32px square (DESIGN.md
	 * §7.7). The ⌘K hint lives in the tooltip, not on the button: it is noise on
	 * a phone and wrong on anything that is not a Mac. Only opens the thing —
	 * the overlay and the hotkey live in the locale layout.
	 */
	import { useI18n } from '$lib/i18n';
	import { search } from '$lib/search.svelte';

	const i18n = useI18n();
	const t = $derived(i18n.t.search);
</script>

<button class="trigger" onclick={() => search.show()} aria-label={t.open} title={t.hint}>
	<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
		<circle cx="6.5" cy="6.5" r="5" fill="none" stroke="currentColor" stroke-width="1.5" />
		<line x1="10.2" y1="10.2" x2="15" y2="15" stroke="currentColor" stroke-width="1.5" />
	</svg>
</button>

<style>
	.trigger {
		display: grid;
		place-items: center;
		width: 32px;
		height: 32px;
		background: transparent;
		border: none;
		color: var(--ink);
		padding: 0;
		cursor: pointer;
	}
	.trigger:hover {
		color: var(--blue);
	}
</style>
