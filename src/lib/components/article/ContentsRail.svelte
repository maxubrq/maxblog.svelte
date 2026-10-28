<script lang="ts">
	/**
	 * The contents, as words, in the left margin (DESIGN.md §6.4). Only where
	 * the margin exists (≥ 1180px) and only when there is something to find
	 * your way through — three sections or more. The section you are in is
	 * the one in blue; that is the whole of the "where am I" answer.
	 */
	import type { TocItem } from '$lib/content/posts';
	import { useI18n } from '$lib/i18n';

	let { items, activeSection }: { items: TocItem[]; activeSection: string } = $props();

	const i18n = useI18n();
	const t = $derived(i18n.t.article);
</script>

{#if items.length >= 3}
	<nav class="rail" aria-label={t.contents}>
		<p class="head">{t.contents}</p>
		<ol>
			{#each items as item (item.id)}
				<li>
					<a
						href="#{item.id}"
						class:active={item.id === activeSection}
						aria-current={item.id === activeSection ? 'location' : undefined}>{item.text}</a
					>
				</li>
			{/each}
		</ol>
	</nav>
{/if}

<style>
	/* Anchored to the left edge of the centred article, the way the fore-edge
	   was: the gutter is whatever the screen leaves on either side of it. */
	.rail {
		display: none;
		position: fixed;
		top: 120px;
		right: calc(50% + var(--article-w) / 2 + var(--s-3));
		width: min(220px, calc((100vw - var(--article-w)) / 2 - 48px));
		max-height: calc(100vh - 160px);
		overflow-y: auto;
		font-size: var(--t-meta);
		line-height: 1.4;
		z-index: 20;
	}
	@media (min-width: 1180px) {
		.rail {
			display: block;
		}
	}
	.head {
		font-weight: 600;
		margin: 0 0 var(--s-1);
	}
	ol {
		list-style: none;
		margin: 0;
		padding: 0;
	}
	li + li {
		margin-top: var(--s-1);
	}
	a {
		color: var(--muted);
		text-decoration: none;
	}
	a:hover {
		color: var(--blue);
	}
	a.active {
		color: var(--blue);
		font-weight: 600;
	}
	@media print {
		.rail {
			display: none;
		}
	}
</style>
