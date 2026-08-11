<script lang="ts">
	/**
	 * The reading bar — where you are, and what it costs to finish, on a phone.
	 *
	 * There is no progress track here: the fore-edge strip at the right of the
	 * screen carries that, without a percentage. The bar names the section and
	 * opens the contents, which is what a thumb wants from it.
	 *
	 * Ported from the production `MobileReadingBar.tsx`.
	 */
	import type { TocItem } from '$lib/content/posts';
	import { useI18n } from '$lib/i18n';

	interface Props {
		items: TocItem[];
		activeSection: string;
		progress: number;
		onopen: () => void;
		showTimeLeft?: boolean;
	}

	let { items, activeSection, progress, onopen, showTimeLeft = true }: Props = $props();

	const i18n = useI18n();
	const t = $derived(i18n.t.article);

	const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

	// Before the first heading there is no active section, and the bar still has
	// to say something — the opening belongs to the first station.
	const idx = $derived(Math.max(0, items.findIndex((item) => item.id === activeSection)));
	const active = $derived(items[idx]);
	const roman = $derived(ROMAN[idx] ?? String(idx + 1));

	const totalMin = $derived(items.reduce((sum, item) => sum + item.readMinutes, 0));
	const minLeft = $derived(Math.max(0, Math.round(totalMin * (1 - progress))));
	const minLabel = $derived(minLeft <= 0 ? t.nearlyDone : t.minLeft.replace('{n}', String(minLeft)));
</script>

{#if items.length > 0}
	<button class="bar" onclick={onopen} aria-label={t.openContents}>
		<span class="top">
			<span class="where">
				<span class="roman">§ {roman}</span>
				<span class="name">{active?.text ?? ''}</span>
			</span>
			<span class="open">{t.contents} ▸</span>
		</span>

		{#if showTimeLeft}
			<span class="min">{minLabel}</span>
		{/if}
	</button>
{/if}

<style>
	.bar {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		display: flex;
		flex-direction: column;
		gap: 4px;
		width: 100%;
		background: var(--paper);
		border: none;
		border-top: 1.5px solid var(--rule-hard);
		/* 26px on the right clears the fore-edge strip pinned to the viewport
		   edge, so the label never sits under the leaves. */
		padding: 10px 26px calc(12px + env(safe-area-inset-bottom, 0px)) 18px;
		z-index: 50;
		text-align: left;
		cursor: pointer;
		font-family: var(--body);
		color: var(--ink);
		appearance: none;
	}

	.top {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 10px;
	}
	.where {
		display: flex;
		align-items: baseline;
		gap: 8px;
		min-width: 0;
		flex: 1;
	}
	.roman {
		font-family: var(--mono);
		text-transform: uppercase;
		letter-spacing: 0.1em;
		font-size: 10.5px;
		color: var(--blue);
		/* The section name is what gives way on a narrow screen; the numeral is
		   two characters and must never break across lines. */
		flex-shrink: 0;
		white-space: nowrap;
	}
	.name {
		font-size: 13.5px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.open {
		font-family: var(--mono);
		text-transform: uppercase;
		letter-spacing: 0.12em;
		font-size: 10px;
		color: var(--muted);
		flex-shrink: 0;
	}
	.min {
		font-family: var(--mono);
		font-size: 10px;
		letter-spacing: 0.04em;
		color: var(--muted);
		font-variant-numeric: tabular-nums;
	}

	/* The desktop rail carries all of this, with room to spare. */
	@media (min-width: 768px) {
		.bar {
			display: none;
		}
	}

	@media print {
		.bar {
			display: none;
		}
	}
</style>
