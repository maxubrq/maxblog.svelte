<script lang="ts">
	/**
	 * The contents, as words, in the left margin (DESIGN.md §6.4). Only where
	 * the margin exists (≥ 1280px) and only when there is something to find
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
			{#each items as item, i (item.id)}
				<li>
					<span class="n">{String(i + 1).padStart(2, '0')}</span>
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
	/* Sticky inside the grid's margin column (DIGITAL_EDITORIAL_DESIGN.md §2):
	   it rides beside the prose, below the header, and stops where the essay
	   does. The column only exists from 1280px; below that the bar at the
	   foot of the screen carries the contents. */
	.rail {
		display: none;
		position: sticky;
		top: 88px;
		max-height: calc(100vh - 120px);
		overflow-y: auto;
		font-size: var(--t-meta);
		line-height: 1.4;
	}
	@media (min-width: 1280px) {
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
	li {
		display: grid;
		grid-template-columns: 2.2em 1fr;
	}
	li + li {
		margin-top: var(--s-1);
	}
	.n {
		color: var(--muted);
		font-variant-numeric: tabular-nums;
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
