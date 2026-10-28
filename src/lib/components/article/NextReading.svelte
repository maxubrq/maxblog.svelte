<script lang="ts">
	/**
	 * What to read next (DESIGN.md §6.7): the essay's hand-picked neighbours,
	 * with the arc it belongs to first when it belongs to one. At most three
	 * rows — a title, and in a quieter line why it is here.
	 */
	import type { Neighbour } from '$lib/content/posts';
	import { fill, href, useI18n } from '$lib/i18n';
	import { getSeriesForPost, getSeriesLocale } from '$lib/series';

	let { slug, neighbours = [] }: { slug: string; neighbours?: Neighbour[] } = $props();

	const i18n = useI18n();
	const t = $derived(i18n.t);

	const found = $derived(getSeriesForPost(slug));
	const arc = $derived(found ? getSeriesLocale(found.series, i18n.lang) : null);
	const rows = $derived(neighbours.slice(0, arc ? 2 : 3));
</script>

{#if arc || rows.length > 0}
	<section class="appendix">
		<p class="appendix-head">{t.article.next}</p>
		<ul>
			{#if found && arc}
				<li>
					<a href={href(i18n.lang, `/series/${found.series.id}`)}>
						<span class="title">{arc.title}</span>
						<span class="why"
							>{t.series.label} · {fill(t.series.movementOf, {
								n: found.index + 1,
								total:
									found.series.chapterCount === 'open-ended'
										? '—'
										: String(found.series.chapterCount)
							})}</span
						>
					</a>
				</li>
			{/if}
			{#each rows as n (n.slug)}
				<li>
					<a href={href(i18n.lang, `/writing/${n.slug}`)}>
						<span class="title">{n.title}</span>
						{#if n.reason || n.relation || n.min}
							<span class="why"
								>{[n.reason ?? n.relation, n.min ? fill(t.article.readTime, { n: n.min }) : null]
									.filter(Boolean)
									.join(' · ')}</span
							>
						{/if}
					</a>
				</li>
			{/each}
		</ul>
	</section>
{/if}

<style>
	ul {
		list-style: none;
		margin: var(--s-2) 0 0;
		padding: 0;
	}
	li + li {
		border-top: 1px solid var(--rule);
	}
	a {
		display: grid;
		gap: 2px;
		padding: var(--s-2) 0;
		color: var(--ink);
		text-decoration: none;
	}
	a:hover .title {
		color: var(--blue);
	}
	.title {
		font-weight: 600;
	}
	.why {
		font-size: var(--t-meta);
		color: var(--muted);
	}
</style>
