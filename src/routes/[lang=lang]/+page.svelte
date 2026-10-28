<script lang="ts">
	// Home = the archive (DESIGN.md §7.1). What you are in the middle of, one
	// line; the newest essay, set large; then everything, by year, with the
	// topic filter. `/writing` redirects here.
	import FilterBar from '$lib/components/ink/FilterBar.svelte';
	import IndexRow from '$lib/components/ink/IndexRow.svelte';
	import PickUpWhereYouLeftOff from '$lib/components/home/PickUpWhereYouLeftOff.svelte';
	import { dmy, short, year } from '$lib/format';
	import { fill, href, useI18n } from '$lib/i18n';
	import { cloudinary, coverImageFor, srcsetFor } from '$lib/images';
	import { site } from '$lib/site';
	import { LISTED_TOPICS, TOPIC_CONTENT, getTopicLocale, type TopicId } from '$lib/topics';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const i18n = useI18n();
	const t = $derived(i18n.t);

	let filter = $state('All');

	/**
	 * The buttons carry topic *ids*, not the names on them: the id is stable
	 * across locales, so switching language mid-filter keeps the filter. Only
	 * topics with at least one essay here are offered — six buttons over four
	 * essays would misstate the size of the archive.
	 */
	const matches = (id: TopicId, topic: string | undefined) =>
		TOPIC_CONTENT[id].frontmatterTopics
			.map((x) => x.toLowerCase())
			.includes(topic?.toLowerCase() ?? '');
	const options = $derived([
		'All',
		...LISTED_TOPICS.filter((id) => data.posts.some((p) => matches(id, p.topic)))
	]);
	const label = (o: string) =>
		o === 'All' ? t.writing.filterAll : getTopicLocale(TOPIC_CONTENT[o as TopicId], i18n.lang).name;

	const featured = $derived(data.posts[0] ?? null);
	const cover = $derived(coverImageFor(featured?.coverImage));

	// Unfiltered, the newest essay is already set large above; filtered, the
	// list is the whole answer and has to include it.
	const visible = $derived.by(() => {
		if (filter === 'All') return data.posts.slice(1);
		return data.posts.filter((p) => matches(filter as TopicId, p.topic));
	});
	const years = $derived([...new Set(visible.map((p) => year(p.date)))]);
</script>

<svelte:head>
	<title>{site.name} — {t.footer.tagline}</title>
	<meta name="description" content={t.home.description} />
</svelte:head>

<div class="page">
	<p class="intro">{t.home.headline}</p>

	<PickUpWhereYouLeftOff />

	{#if featured}
		<a class="featured" href={href(i18n.lang, `/writing/${featured.slug}`)}>
			<div class="text">
				<h2>{featured.title}</h2>
				{#if featured.subtitle || featured.description}
					<p class="deck">{featured.subtitle ?? featured.description}</p>
				{/if}
				<p class="meta">
					{[
						featured.topic,
						fill(t.article.readTime, { n: featured.reading }),
						dmy(featured.date),
						featured.interactive ? t.home.interactive : null
					]
						.filter(Boolean)
						.join(' · ')}
				</p>
			</div>
			<!-- The post's cover as a one-colour halftone, or the branded default. -->
			<div class="ink-screen plate">
				<img
					class="fill"
					src={cloudinary(cover, { width: 1080, halftone: 'screen' })}
					srcset={srcsetFor(cover, { halftone: 'screen' })}
					sizes="(max-width: 860px) 100vw, 40vw"
					alt=""
					decoding="async"
				/>
			</div>
		</a>
	{/if}

	{#if options.length > 2}
		<div class="filter">
			<FilterBar {options} {label} value={filter} onchange={(v) => (filter = v)} />
		</div>
	{/if}

	<section class="list">
		{#each years as y (y)}
			<h3 class="year">{y}</h3>
			<ul>
				{#each visible.filter((p) => year(p.date) === y) as p (p.slug)}
					<li>
						<IndexRow
							href={href(i18n.lang, `/writing/${p.slug}`)}
							lead={short(p.date)}
							topic={p.topic}
							title={p.title}
							meta={p.openDraft ? t.openDraft.indexMark : fill(t.article.readTime, { n: p.reading })}
							interactive={p.interactive}
							leadWidth="48px"
						/>
					</li>
				{/each}
			</ul>
		{/each}
		{#if filter !== 'All' && visible.length === 0}
			<p class="empty">{fill(t.writing.empty, { topic: label(filter) })}</p>
		{/if}
	</section>
</div>

<style>
	.page {
		max-width: var(--index-max);
		margin: 0 auto;
		padding: var(--s-3) var(--pad-chrome) var(--s-4);
	}
	.intro {
		font-size: var(--t-body);
		color: var(--muted);
		margin: 0 0 var(--s-2);
	}

	.featured {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--s-3);
		padding: var(--s-3) 0;
		border-top: 1.5px solid var(--rule-hard);
		border-bottom: 1.5px solid var(--rule-hard);
		color: var(--ink);
		text-decoration: none;
	}
	.featured:hover {
		text-decoration: none;
	}
	.featured:hover h2 {
		color: var(--blue);
	}
	h2 {
		font-family: var(--display);
		font-weight: 700;
		font-size: var(--t-title);
		line-height: 1.1;
		margin: 0;
		text-wrap: balance;
	}
	.deck {
		color: var(--muted);
		margin: var(--s-2) 0 0;
	}
	.meta {
		font-size: var(--t-meta);
		color: var(--muted);
		font-variant-numeric: tabular-nums;
		margin: var(--s-2) 0 0;
	}
	.plate {
		min-height: 280px;
	}

	.filter {
		padding: var(--s-3) 0 0;
	}
	.year {
		font-size: var(--t-meta);
		font-weight: 600;
		color: var(--muted);
		margin: var(--s-3) 0 0;
		padding-bottom: var(--s-1);
		font-variant-numeric: tabular-nums;
	}
	ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}
	.empty {
		color: var(--muted);
		padding: var(--s-3) 0;
	}

	@media (max-width: 860px) {
		.page {
			padding: var(--s-2) var(--s-2) var(--s-4);
		}
		.featured {
			grid-template-columns: 1fr;
		}
		h2 {
			font-size: 32px;
		}
		.plate {
			min-height: 200px;
		}
	}
</style>
