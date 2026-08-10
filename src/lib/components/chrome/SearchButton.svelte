<script lang="ts">
	/**
	 * The header's `search ⌘K` trigger. Only opens the thing — the overlay and
	 * the hotkey live in the locale layout, so search can also be opened from
	 * anywhere else that imports `$lib/search.svelte`.
	 */
	import { useI18n } from '$lib/i18n';
	import { search } from '$lib/search.svelte';

	const i18n = useI18n();
	const t = $derived(i18n.t.search);
</script>

<button class="trigger" onclick={() => search.show()} aria-label={t.open} title={t.hint}>
	<span>{t.label}</span>
	<span class="kbd">⌘K</span>
</button>

<style>
	.trigger {
		display: flex;
		align-items: center;
		gap: 6px;
		background: transparent;
		border: 1px solid var(--rule);
		color: var(--muted);
		font-family: var(--body);
		font-size: 13px;
		line-height: 1;
		padding: 4px 10px;
		cursor: pointer;
		transition:
			color 0.15s,
			border-color 0.15s;
	}
	.trigger:hover {
		color: var(--ink);
		border-color: var(--rule-hard);
	}
	.kbd {
		font-family: var(--mono);
		font-size: 10px;
		letter-spacing: 0.05em;
	}
</style>
