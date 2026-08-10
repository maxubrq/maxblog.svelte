<script lang="ts">
	/**
	 * The bibliography. Masthead · a demo of how a citation reads inline ·
	 * search + topic filter · a topic jump strip · the entries themselves, in
	 * two columns grouped by topic.
	 *
	 * Port of the production blog's `ResourcesContent`, and deliberately the
	 * same page as `/glossary` one level down: both share the `.ink-gloss-*`
	 * grid, the folded detail, and the availability rule. Where they differ is
	 * what a reader is looking for — a word is looked up alphabetically, a
	 * source by subject — so this one groups by topic and has no A–Z.
	 */
	import ArrowMark from '$lib/components/ink/ArrowMark.svelte';
	import ResourceCover from '$lib/components/ink/ResourceCover.svelte';
	import Tag from '$lib/components/ink/Tag.svelte';
	import { pad } from '$lib/format';
	import { fill, href, useI18n } from '$lib/i18n';
	import {
		RESOURCES,
		RESOURCE_TOPICS,
		getResourceNote,
		type Resource,
		type ResourceTopic
	} from '$lib/resources';
	import { site } from '$lib/site';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const i18n = useI18n();
	const t = $derived(i18n.t.resources);

	let query = $state('');
	let activeTopic = $state<ResourceTopic | 'All'>('All');

	const published = $derived(new Set(data.slugs));
	const cited = (r: Resource) => r.appearsIn.filter((a) => published.has(a.slug));

	/**
	 * Everything a reader can follow, in curated order. Same two-step as the
	 * glossary: narrow the citations first, then keep an entry that still has
	 * one — or that never claimed any, since a source can be listed before it
	 * has been cited.
	 */
	const available = $derived(
		RESOURCES.filter((r) => r.appearsIn.length === 0 || cited(r).length > 0)
	);

	/** The demo reads the unfiltered list, so it stays put while you filter. */
	const featured = $derived(available.find((r) => cited(r).length > 0) ?? available[0]);

	const visible = $derived(
		available
			.filter((r) => activeTopic === 'All' || r.topic === activeTopic)
			.filter((r) => {
				const q = query.trim().toLowerCase();
				if (!q) return true;
				// Match the note the reader can actually see, not the English original.
				return (
					r.title.toLowerCase().includes(q) ||
					r.author.toLowerCase().includes(q) ||
					getResourceNote(r, i18n.lang).toLowerCase().includes(q)
				);
			})
	);

	/** Grouped by topic, in the canonical topic order — never by count. */
	const grouped = $derived(
		RESOURCE_TOPICS.map((topic) => ({
			topic,
			items: visible.filter((r) => r.topic === topic)
		})).filter((g) => g.items.length > 0)
	);

	/** Running number across the whole filtered list, in display order. */
	const numbered = $derived.by(() => {
		const seen = new Map<string, number>();
		let n = 0;
		for (const g of grouped) for (const r of g.items) seen.set(r.id, ++n);
		return seen;
	});

	const topicLabel = (topic: ResourceTopic) => t.resourceTopics[topic];
	const plural = (n: number) => (n === 1 ? t.resource : t.resources);
	const essayWord = (n: number) => (n === 1 ? t.essay : t.essays);
	const counts = $derived(new Map(grouped.map((g) => [g.topic, g.items.length])));
</script>

<svelte:head>
	<title>{t.titleLead} {t.titleAccent} — {site.name}</title>
	<meta name="description" content={t.description} />
</svelte:head>

<section class="masthead">
	<div class="labels">
		<Tag>{t.indexLabel}</Tag>
		<Tag>{visible.length} {plural(visible.length)}</Tag>
	</div>
	<h1>
		{#if t.titleLead}{t.titleLead}{' '}{/if}<span class="accent">{t.titleAccent}</span>
	</h1>
	<p class="deck">{t.description}</p>
</section>

{#if featured}
	<!-- The card, shown beside the sentence that cites it. Built from a real
	     entry so the page never demonstrates a source it does not hold. -->
	<section class="demo">
		<div class="demo-label"><Tag on>{t.demoLabel}</Tag></div>
		<div class="ink-gloss-demo">
			<p class="sentence">
				{t.demoLead}
				<span class="cite">{featured.title}<span class="numeral">[01]</span></span>{t.demoTail}
			</p>

			<div class="card">
				<ArrowMark dir="left" class="ink-gloss-arrow" left={-46} top={18} w={42} />
				<Tag on>{t.sourceTag}</Tag>
				<div class="card-head">
					<div class="card-title">{featured.title}</div>
					<ResourceCover src={featured.coverImage} title={featured.title} width={54} />
				</div>
				<div class="card-meta">
					{featured.author}{featured.year ? ` · ${featured.year}` : ''}
				</div>
				<div class="card-foot">
					<Tag>
						{fill(t.citedInCount, {
							count: cited(featured).length,
							essays: essayWord(cited(featured).length)
						})}
					</Tag>
					<a href="#res-{featured.topic}">{t.fullEntry}</a>
				</div>
			</div>
		</div>
	</section>
{/if}

<section class="controls">
	<input class="search" type="search" bind:value={query} placeholder={t.searchPlaceholder} />
	<div class="topics">
		<button class="topic" class:on={activeTopic === 'All'} onclick={() => (activeTopic = 'All')}
			>{t.filterAll}</button
		>
		{#each RESOURCE_TOPICS as tp (tp)}
			<button class="topic" class:on={activeTopic === tp} onclick={() => (activeTopic = tp)}
				>{topicLabel(tp)}</button
			>
		{/each}
	</div>
</section>

<!-- The topic strip is this page's answer to the glossary's A–Z. -->
<section class="jump">
	<Tag>{t.topicsLabel}</Tag>
	{#each RESOURCE_TOPICS as tp (tp)}
		{#if counts.has(tp)}
			<a href="#res-{tp}">{topicLabel(tp)}<span class="n">{counts.get(tp)}</span></a>
		{:else}
			<span class="off">{topicLabel(tp)}</span>
		{/if}
	{/each}
</section>

{#if grouped.length === 0}
	<p class="empty">{t.noResources}</p>
{/if}

{#each grouped as group (group.topic)}
	<section class="group" id="res-{group.topic}">
		<div class="group-head">
			<h2>{topicLabel(group.topic)}</h2>
			<span class="rule"></span>
			<Tag>{group.items.length} {plural(group.items.length)}</Tag>
		</div>

		<div class="ink-res-grid">
			{#each group.items as r (r.id)}
				{@const appearances = cited(r)}
				<article
					class="ink-res-cell"
					class:with-cover={r.coverImage}
					style={r.coverImage ? 'grid-template-columns: 28px 1fr 68px' : undefined}
				>
					<span class="num">{pad(numbered.get(r.id) ?? 0)}</span>
					<div class="body">
						<h3>
							{#if r.url}
								<a class="title" href={r.url} target="_blank" rel="noopener noreferrer"
									>{r.title}</a
								>
							{:else}
								{r.title}
							{/if}
						</h3>

						<div class="meta">
							<Tag on>{t.types[r.type]}</Tag>
							{#if r.year}<Tag>{r.year}</Tag>{/if}
						</div>

						{#if r.author}
							<div class="author">{r.author}</div>
						{/if}

						<p class="note">{getResourceNote(r, i18n.lang)}</p>

						{#if appearances.length > 0}
							<!-- Folded, like the glossary's long gloss: the grid has to
							     stay a grid once the shelf gets long. -->
							<details class="ink-gloss-more">
								<summary><Tag>{t.appearsIn} ×{appearances.length}</Tag></summary>
								<div class="appears">
									{#each appearances as a (a.slug)}
										<a href={href(i18n.lang, `/writing/${a.slug}`)}>{a.title}</a>
									{/each}
								</div>
							</details>
						{/if}
					</div>
					<ResourceCover src={r.coverImage} title={r.title} width={68} />
				</article>
			{/each}
		</div>
	</section>
{/each}

<p class="colophon">{t.colophon}</p>

<style>
	.masthead {
		padding: 44px var(--pad-chrome) 30px;
		border-bottom: 1.5px solid var(--rule-hard);
	}
	.labels {
		display: flex;
		justify-content: space-between;
		gap: 12px;
	}
	h1 {
		font-size: clamp(40px, 7vw, 64px);
		line-height: 0.94;
		letter-spacing: -0.045em;
		margin: 12px 0 0;
	}
	.accent {
		color: var(--blue);
	}
	.deck {
		max-width: 58ch;
		font-size: 16px;
		line-height: 1.5;
		color: var(--muted);
		margin: 18px 0 0;
	}

	.demo {
		padding: 30px var(--pad-chrome) 34px;
		border-bottom: 1.5px solid var(--rule-hard);
		background: var(--paper2);
	}
	.demo-label {
		margin-bottom: 16px;
	}
	.sentence {
		margin: 0;
		font-size: 20px;
		line-height: 1.62;
		max-width: 46ch;
	}
	.cite {
		font-weight: 500;
	}
	.numeral {
		font-family: var(--mono);
		font-size: 0.62em;
		vertical-align: super;
		color: var(--blue);
		margin: 0 1px;
	}
	.card {
		position: relative;
		border: 1.5px solid var(--rule-hard);
		background: var(--paper);
		padding: 18px 20px;
	}
	.card-head {
		display: flex;
		gap: 14px;
		align-items: flex-start;
		margin: 6px 0;
	}
	.card-title {
		flex: 1;
		min-width: 0;
		font-family: var(--display);
		font-weight: 700;
		font-size: 20px;
		letter-spacing: -0.02em;
		line-height: 1.1;
	}
	.card-meta {
		font-family: var(--mono);
		font-size: 10.5px;
		letter-spacing: 0.06em;
		color: var(--muted);
		margin-bottom: 10px;
	}
	.card-foot {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 12px;
		flex-wrap: wrap;
		border-top: 1px solid var(--rule);
		padding-top: 10px;
	}
	.card-foot a {
		font-family: var(--mono);
		font-size: 10.5px;
		letter-spacing: 0.06em;
	}

	.controls {
		display: flex;
		align-items: center;
		gap: 24px;
		flex-wrap: wrap;
		padding: 18px var(--pad-chrome);
		border-bottom: 1.5px solid var(--rule-hard);
	}
	.search {
		flex: 1;
		min-width: 220px;
		background: transparent;
		border: none;
		border-bottom: 1.5px solid var(--rule);
		padding: 8px 0;
		font-family: var(--body);
		font-size: 16px;
		color: var(--ink);
		outline: none;
	}
	.search:focus {
		border-bottom-color: var(--blue);
	}
	.topics {
		display: flex;
		gap: 18px;
		flex-wrap: wrap;
	}
	.topic {
		background: transparent;
		border: none;
		padding: 0;
		cursor: pointer;
		font-family: var(--mono);
		font-size: 11px;
		font-weight: 500;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--muted);
	}
	.topic:hover,
	.topic.on {
		color: var(--blue);
	}

	.jump {
		display: flex;
		align-items: baseline;
		gap: 4px;
		flex-wrap: wrap;
		padding: 18px var(--pad-chrome);
		border-bottom: 1.5px solid var(--rule-hard);
		font-family: var(--mono);
		font-size: 13px;
	}
	.jump :global(.tag) {
		margin-right: 14px;
	}
	.jump a,
	.jump .off {
		padding: 2px 8px;
		letter-spacing: 0.06em;
	}
	.jump .off {
		color: var(--faint);
	}
	.n {
		color: var(--faint);
		margin-left: 6px;
	}

	.empty {
		padding: 80px;
		text-align: center;
		font-style: italic;
		color: var(--muted);
	}

	.group {
		padding: 0 var(--pad-chrome);
	}
	.group-head {
		display: flex;
		align-items: center;
		gap: 20px;
		padding: 30px 0 8px;
	}
	.group-head h2 {
		margin: 0;
		font-size: clamp(34px, 6vw, 56px);
		color: var(--faint);
		line-height: 0.9;
	}
	.rule {
		flex: 1;
		height: 1.5px;
		background: var(--rule-hard);
	}

	.num {
		font-family: var(--mono);
		font-size: 12px;
		color: var(--faint);
		padding-top: 4px;
	}
	.body {
		min-width: 0;
	}
	h3 {
		margin: 0;
		font-size: 19px;
		letter-spacing: -0.02em;
		line-height: 1.15;
		text-transform: none;
	}
	.title {
		color: inherit;
		border-bottom: 2px solid var(--blue);
	}
	.title:hover {
		color: var(--blue);
		text-decoration: none;
	}
	.meta {
		display: flex;
		gap: 12px;
		align-items: baseline;
		flex-wrap: wrap;
		margin-top: 8px;
	}
	.author {
		font-family: var(--mono);
		font-size: 11px;
		letter-spacing: 0.06em;
		color: var(--muted);
		margin-top: 8px;
	}
	.note {
		margin: 8px 0 0;
		font-size: 13.5px;
		line-height: 1.5;
		color: var(--muted);
		max-width: 44ch;
	}
	.appears {
		margin-top: 8px;
		display: flex;
		gap: 14px;
		flex-wrap: wrap;
		align-items: baseline;
	}
	.appears a {
		font-size: 13px;
		color: var(--ink);
		border-bottom: 1.5px solid var(--blue);
		padding-bottom: 1px;
	}
	.appears a:hover {
		color: var(--blue);
		text-decoration: none;
	}

	.colophon {
		margin: 48px var(--pad-chrome) 0;
		padding: 24px 0 80px;
		border-top: 1.5px solid var(--rule-hard);
		font-family: var(--mono);
		font-size: 11px;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--muted);
	}

	@media (max-width: 860px) {
		.masthead,
		.demo,
		.controls,
		.jump,
		.group {
			padding-left: 18px;
			padding-right: 18px;
		}
		.colophon {
			margin-left: 18px;
			margin-right: 18px;
		}
		/* The cover column would squeeze the note to nothing at this width. */
		.ink-res-cell.with-cover {
			grid-template-columns: 28px 1fr !important;
		}
	}
</style>
