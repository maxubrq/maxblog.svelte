<script lang="ts">
	// Archive — everything, in order of when. Filter bar + year sections.
	import FilterBar from '$lib/components/ink/FilterBar.svelte';
	import Headline from '$lib/components/ink/Headline.svelte';
	import IndexRow from '$lib/components/ink/IndexRow.svelte';
	import Tag from '$lib/components/ink/Tag.svelte';
	import { short, year } from '$lib/format';
	import { fill, href, useI18n } from '$lib/i18n';
	import { site } from '$lib/site';
	import { LISTED_TOPICS, TOPIC_CONTENT, getTopicLocale, type TopicId } from '$lib/topics';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const i18n = useI18n();
	const t = $derived(i18n.t);

	let filter = $state('All');

	/**
	 * The buttons carry topic *ids*, not the names on them: the id is stable
	 * across locales, so switching language mid-filter keeps the filter. A room
	 * answers to every spelling in its `frontmatterTopics`, which is what lets
	 * one button cover both `Tech` and production's `Software`.
	 */
	// A walk-in room is not offered here — the archive holds none of its posts,
	// so its button would filter the page down to nothing.
	const options = $derived(['All', ...LISTED_TOPICS]);
	const label = (o: string) =>
		o === 'All' ? t.writing.filterAll : getTopicLocale(TOPIC_CONTENT[o as TopicId], i18n.lang).name;

	const visible = $derived.by(() => {
		if (filter === 'All') return data.posts;
		const accepted = TOPIC_CONTENT[filter as TopicId].frontmatterTopics.map((x) => x.toLowerCase());
		return data.posts.filter((p) => accepted.includes(p.topic?.toLowerCase() ?? ''));
	});
	const years = $derived([...new Set(visible.map((p) => year(p.date)))]);
</script>

<svelte:head>
	<title>{t.writing.label.toLowerCase()} — {site.name}</title>
	<meta name="description" content={t.writing.title} />
</svelte:head>

<section class="head">
	<Tag
		>{t.writing.label} / {data.posts.length}
		{data.posts.length === 1 ? t.writing.essay : t.writing.essays}</Tag
	>
	<Headline text={t.writing.title} accent={t.writing.titleAccent} size={60} />
</section>

<FilterBar {options} {label} value={filter} onchange={(v) => (filter = v)} />

<section class="list">
	{#each years as y (y)}
		<div class="year">
			<span class="numeral">{y}</span>
			<span class="hair"></span>
		</div>
		<ul>
			{#each visible.filter((p) => year(p.date) === y) as p (p.slug)}
				<li>
					<IndexRow
						href={href(i18n.lang, `/writing/${p.slug}`)}
						lead={short(p.date)}
						topic={p.topic}
						title={p.title}
						meta={p.openDraft ? t.openDraft.indexMark : `${p.reading}′`}
						interactive={p.interactive}
						leadWidth="64px"
					/>
				</li>
			{/each}
		</ul>
	{/each}
	{#if visible.length === 0}
		<p class="empty"><Tag>{fill(t.writing.empty, { topic: label(filter) })}</Tag></p>
	{/if}
</section>

<style>
	.head {
		padding: 44px var(--pad-chrome) 24px;
		border-bottom: 1.5px solid var(--rule-hard);
	}
	.head :global(h1) {
		margin-top: 14px;
	}
	.list {
		padding: 0 var(--pad-chrome) 30px;
	}
	.year {
		display: flex;
		align-items: baseline;
		gap: 16px;
		padding: 26px 0 6px;
	}
	.numeral {
		font-family: var(--display);
		font-weight: 700;
		font-size: 40px;
		letter-spacing: -0.03em;
		color: var(--faint);
		line-height: 1;
	}
	.hair {
		flex: 1;
		height: 1.5px;
		background: var(--rule-hard);
	}
	ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}
	.empty {
		padding: 40px 0;
	}
	@media (max-width: 860px) {
		.head,
		.list {
			padding-left: 18px;
			padding-right: 18px;
		}
	}
</style>
