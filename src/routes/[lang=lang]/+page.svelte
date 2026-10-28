<script lang="ts">
	// Home = the archive (DESIGN.md §7.1), set as the contents page of an issue
	// (DIGITAL_EDITORIAL_DESIGN.md §9). `/writing` redirects here.
	import FilterBar from '$lib/components/ink/FilterBar.svelte';
	import IndexRow from '$lib/components/ink/IndexRow.svelte';
	import PickUpWhereYouLeftOff from '$lib/components/home/PickUpWhereYouLeftOff.svelte';
	import { formatNumber } from '$lib/content/numbers';
	import { dm, dmy, year } from '$lib/format';
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

<!-- Home is the contents page of an issue (DIGITAL_EDITORIAL_DESIGN.md §9):
     the line of the publication in the margin; the newest essay as the cover
     story; then every essay, its number hung in the margin, by year. -->
<header class="grid cover-grid">
	<p class="g-margin intro">{t.home.headline}</p>
	<div class="g-wide resume"><PickUpWhereYouLeftOff /></div>
</header>

{#if featured}
	<a class="cover-story" href={href(i18n.lang, `/writing/${featured.slug}`)}>
		<div class="grid cover-text">
			<div class="g-spread g-rule"></div>
			<ul class="hang-list g-margin">
				<li class="topic">{featured.topic}</li>
				{#if featured.number}<li>{formatNumber(featured.number)}</li>{/if}
				<li>{fill(t.article.readTime, { n: featured.reading })}</li>
				<li>{dmy(featured.date)}</li>
				{#if featured.interactive}<li>{t.home.interactive}</li>{/if}
			</ul>
			<div class="g-wide">
				<h2 class="display" class:long={featured.title.length > 64}>{featured.title}</h2>
				{#if featured.subtitle || featured.description}
					<p class="deck">{featured.subtitle ?? featured.description}</p>
				{/if}
			</div>
		</div>
		<!-- The post's cover as a one-colour halftone, across the grid at 3:1. -->
		<div class="grid">
			<div class="g-spread ink-screen plate">
				<img
					class="fill"
					src={cloudinary(cover, { width: 1600, halftone: 'screen' })}
					srcset={srcsetFor(cover, { halftone: 'screen' })}
					sizes="(min-width: 1280px) 1216px, 100vw"
					alt=""
					decoding="async"
				/>
			</div>
		</div>
	</a>
{/if}

<section class="grid contents">
	{#if options.length > 2}
		<div class="g-wide filter">
			<FilterBar {options} {label} value={filter} onchange={(v) => (filter = v)} />
		</div>
	{/if}

	{#each years as y (y)}
		<!-- The year hangs in the margin, the essays run beside it. -->
		<h3 class="g-margin year">{y}</h3>
		<ul class="g-wide">
			{#each visible.filter((p) => year(p.date) === y) as p (p.slug)}
				<li>
					<IndexRow
						href={href(i18n.lang, `/writing/${p.slug}`)}
						lead={p.number ? formatNumber(p.number) : ''}
						topic={`${p.topic} · ${dm(p.date)}`}
						title={p.title}
						meta={p.openDraft ? t.openDraft.indexMark : fill(t.article.readTime, { n: p.reading })}
						interactive={p.interactive}
						leadWidth="56px"
					/>
				</li>
			{/each}
		</ul>
	{/each}
	{#if filter !== 'All' && visible.length === 0}
		<p class="g-wide empty">{fill(t.writing.empty, { topic: label(filter) })}</p>
	{/if}
</section>

<style>
	.cover-grid {
		padding-top: var(--s-3);
		align-items: baseline;
	}
	.intro {
		grid-row: 1;
		font-size: var(--t-meta);
		line-height: 1.5;
		color: var(--muted);
		margin: 0;
	}
	.resume {
		grid-row: 1;
	}

	.cover-story {
		display: block;
		color: var(--ink);
		text-decoration: none;
		padding-top: var(--s-3);
	}
	.cover-story:hover {
		text-decoration: none;
	}
	.cover-story:hover h2 {
		color: var(--blue);
	}
	.cover-text {
		align-items: baseline;
	}
	.cover-text > .g-rule {
		grid-row: 1;
		margin-bottom: var(--s-3);
	}
	.cover-text > :not(.g-rule) {
		grid-row: 2;
	}
	.hang-list .topic {
		color: var(--ink);
		font-weight: 600;
	}
	.deck {
		color: var(--muted);
		margin: var(--s-2) 0 0;
		max-width: 52ch;
	}
	.plate {
		aspect-ratio: 3 / 1;
		margin-top: var(--s-3);
	}

	.contents {
		padding-top: var(--s-3);
		padding-bottom: var(--s-4);
		align-items: baseline;
	}
	.filter {
		margin-bottom: var(--s-2);
	}
	.year {
		font-family: var(--deck);
		font-weight: 600;
		font-size: var(--t-h2);
		line-height: 1.25;
		color: var(--ink);
		margin: var(--s-3) 0 0;
		font-variant-numeric: tabular-nums;
		align-self: start;
		padding-top: var(--s-2);
	}
	.contents ul {
		list-style: none;
		padding: 0;
		margin: var(--s-3) 0 0;
	}
	.empty {
		color: var(--muted);
		padding: var(--s-3) 0;
	}

	@media (max-width: 1279px) {
		.intro,
		.resume,
		.cover-text > :not(.g-rule) {
			grid-row: auto;
		}
		.intro {
			margin-bottom: var(--s-1);
		}
		.cover-text .hang-list {
			margin-bottom: var(--s-2);
		}
		.contents ul {
			margin-top: var(--s-1);
		}
	}
	@media (max-width: 860px) {
		.plate {
			aspect-ratio: 2 / 1;
		}
	}
</style>
