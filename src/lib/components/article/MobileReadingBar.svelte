<script lang="ts">
	/**
	 * The contents, on a screen with no margin for them (DESIGN.md §6.4, §6.8):
	 * one bar at the foot that names the section you are in and opens the
	 * drawer. Progress is the 2px line at the top; time left is not shown.
	 */
	import type { TocItem } from '$lib/content/posts';
	import { useI18n } from '$lib/i18n';

	interface Props {
		items: TocItem[];
		activeSection: string;
		onopen: () => void;
	}

	let { items, activeSection, onopen }: Props = $props();

	const i18n = useI18n();
	const t = $derived(i18n.t.article);

	// Before the first heading the opening belongs to the first section.
	const active = $derived(items.find((item) => item.id === activeSection) ?? items[0]);
</script>

{#if items.length > 0}
	<button class="bar" onclick={onopen} aria-label={t.openContents}>
		<span class="open">{t.contents}</span>
		<span class="name">{active?.text ?? ''}</span>
	</button>
{/if}

<style>
	.bar {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 45;
		display: none;
		gap: var(--s-2);
		align-items: baseline;
		width: 100%;
		padding: 12px var(--s-2) calc(12px + env(safe-area-inset-bottom));
		background: var(--paper);
		border: none;
		border-top: 1.5px solid var(--rule-hard);
		color: var(--ink);
		font-size: var(--t-meta);
		text-align: left;
		cursor: pointer;
	}
	@media (max-width: 1179px) {
		.bar {
			display: flex;
		}
	}
	.open {
		font-weight: 600;
		color: var(--blue);
		flex: none;
	}
	.name {
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		color: var(--muted);
	}
	@media print {
		.bar {
			display: none;
		}
	}
</style>
