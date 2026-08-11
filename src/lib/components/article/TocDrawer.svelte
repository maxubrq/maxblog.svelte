<script lang="ts">
	/**
	 * The contents, one tap away. The fore-edge is the ambient instrument; this
	 * is for the moment a reader actually wants the list — a sheet from the
	 * bottom on a phone, a card in the middle of the page on a desktop.
	 *
	 * Ported from the production `TocDrawer.tsx`.
	 */
	import type { TocItem } from '$lib/content/posts';
	import { useI18n } from '$lib/i18n';
	import TableOfContents from './TableOfContents.svelte';

	interface Props {
		open: boolean;
		onclose: () => void;
		items: TocItem[];
		activeSection: string;
		progress: number;
		sectionProgress?: Record<string, number>;
		showTimeLeft?: boolean;
	}

	let {
		open,
		onclose,
		items,
		activeSection,
		progress,
		sectionProgress = {},
		showTimeLeft = true
	}: Props = $props();

	const i18n = useI18n();
	const t = $derived(i18n.t.article);

	// The page behind must not scroll while the sheet is up — on a phone the
	// two scrollers fight and the reader loses their place.
	$effect(() => {
		if (!open) return;
		const previous = document.body.style.overflow;
		document.body.style.overflow = 'hidden';
		return () => {
			document.body.style.overflow = previous;
		};
	});

	function onkeydown(event: KeyboardEvent) {
		if (open && event.key === 'Escape') onclose();
	}
</script>

<svelte:window {onkeydown} />

{#if open}
	<!-- A button, so clicking the page behind closes the sheet; hidden from the
	     keyboard and from assistive tech, which are served by Escape and the ✕. -->
	<button class="scrim" onclick={onclose} aria-hidden="true" tabindex="-1"></button>

	<div class="panel" role="dialog" aria-modal="true" aria-label={t.contents}>
		<div class="close-row">
			<button onclick={onclose} aria-label={t.closeContents}>✕</button>
		</div>

		<TableOfContents
			{items}
			{activeSection}
			{progress}
			{sectionProgress}
			{showTimeLeft}
			onnavigate={onclose}
		/>
	</div>
{/if}

<style>
	.scrim {
		position: fixed;
		inset: 0;
		border: none;
		padding: 0;
		cursor: default;
		background: color-mix(in srgb, var(--paper) 70%, transparent);
		backdrop-filter: blur(2px);
		-webkit-backdrop-filter: blur(2px);
		z-index: 90;
		animation: scrim 0.18s ease;
	}

	.panel {
		position: fixed;
		left: 50%;
		transform: translateX(-50%);
		background: var(--paper);
		border: 1.5px solid var(--rule-hard);
		box-shadow: 0 -8px 32px color-mix(in srgb, var(--ink) 12%, transparent);
		z-index: 91;
		overflow-y: auto;
		padding: 20px 24px 28px;

		/* Phone: a full-width sheet standing on the bottom edge. */
		bottom: 0;
		width: 100%;
		max-height: 85vh;
		animation: sheet 0.22s ease;
	}

	.close-row {
		display: flex;
		justify-content: flex-end;
		margin-bottom: 4px;
	}
	.close-row button {
		background: transparent;
		border: none;
		cursor: pointer;
		color: var(--muted);
		font-family: var(--mono);
		font-size: 16px;
		line-height: 1;
		padding: 4px;
	}
	.close-row button:hover {
		color: var(--ink);
	}

	@keyframes scrim {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
	@keyframes sheet {
		from {
			opacity: 0;
			transform: translate(-50%, 12px);
		}
		to {
			opacity: 1;
			transform: translate(-50%, 0);
		}
	}

	@media (min-width: 768px) {
		.panel {
			/* Desktop: a card in the middle of the page. */
			top: 50%;
			bottom: auto;
			transform: translate(-50%, -50%);
			width: min(480px, 90vw);
			max-height: 80vh;
			animation: card 0.22s ease;
		}
		@keyframes card {
			from {
				opacity: 0;
				transform: translate(-50%, calc(-50% + 12px));
			}
			to {
				opacity: 1;
				transform: translate(-50%, -50%);
			}
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.scrim,
		.panel {
			animation: none;
		}
	}
</style>
