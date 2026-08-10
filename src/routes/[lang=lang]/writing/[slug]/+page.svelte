<script lang="ts">
	// The reading surface: title block, meta rail + prose, then the apparatus
	// (one sentence · sources · neighborhood).
	import Headline from '$lib/components/ink/Headline.svelte';
	import Bibliography from '$lib/components/article/Bibliography.svelte';
	import MetaRail from '$lib/components/ink/MetaRail.svelte';
	import RunningHead from '$lib/components/ink/RunningHead.svelte';
	import Tag from '$lib/components/ink/Tag.svelte';
	import OneSentence from '$lib/components/article/OneSentence.svelte';
	import WeatherStrip from '$lib/components/article/WeatherStrip.svelte';
	import { long } from '$lib/format';
	import { href, useI18n } from '$lib/i18n';
	import { site } from '$lib/site';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const i18n = useI18n();
	const t = $derived(i18n.t);

	const meta = $derived(data.meta);
	const Content = $derived(data.content);

	const rail = $derived(
		[
			[t.article.author, site.author],
			[t.article.published, long(meta.date, meta.lang)],
			[t.article.reading, `${meta.reading} ${t.article.minutes}`],
			meta.section ? [t.article.section, meta.section] : null,
			meta.chapter ? [t.article.chapter, meta.chapter] : null,
			meta.coord ? [t.article.coord, meta.coord] : null
		].filter(Boolean) as [string, string][]
	);
</script>

<svelte:head>
	<title>{meta.title} — {site.name}</title>
	{#if meta.description}<meta name="description" content={meta.description} />{/if}
	<meta property="og:title" content={meta.title} />
	<meta property="og:type" content="article" />
	{#if meta.description}<meta property="og:description" content={meta.description} />{/if}
</svelte:head>

<RunningHead text={`${site.name} · vol.04 · ${meta.topic.toLowerCase()}`} />

<article lang={meta.lang}>
	<header>
		<div class="tags">
			<Tag on>{meta.topic}</Tag>
			{#if meta.interactive}<Tag>● {t.article.interactive}</Tag>{/if}
			{#if meta.chapter}<Tag>{meta.chapter}</Tag>{/if}
			{#if meta.draft}<Tag>{t.article.draft}</Tag>{/if}
			{#if data.translation}
				<a
					class="translation"
					hreflang={data.translation.lang}
					rel="alternate"
					href={href(data.translation.lang, `/writing/${data.translation.slug}`)}
					>{t.article.readInOther}</a
				>
			{/if}
		</div>
		<Headline
			text={meta.title}
			accent={meta.accent}
			mark={meta.accent ? 'underline' : 'none'}
			size={58}
			lowercase={false}
			markWidth={280}
		/>
		{#if meta.subtitle}
			<p class="deck">{meta.subtitle}</p>
		{/if}
	</header>

	<div class="body">
		<MetaRail items={rail} />

		<div class="measure">
			{#if meta.weather}
				<WeatherStrip weather={meta.weather} />
			{/if}

			<Content />

			{#if meta.rememberSentence}
				<OneSentence
					sentence={meta.rememberSentence}
					attribution={meta.rememberAttribution ?? t.article.authorsPick}
				/>
			{/if}

			<!-- The sources this essay cites. Built from `appearsIn`, so it needs
			     no marks in the prose — see $lib/resources. -->
			<Bibliography slug={meta.slug} citations={meta.citations} />

			{#if meta.neighborhood?.length}
				<section class="hood">
					<div class="hood-head">
						<span class="hood-title">{t.article.neighborhood}</span>
						<Tag>{t.article.handPicked}</Tag>
					</div>
					{#each meta.neighborhood as n (n.slug)}
						<a class="hood-row" href={href(i18n.lang, `/writing/${n.slug}`)}>
							<span class="hood-row-head">
								<span class="hood-row-title">{n.title}</span>
								<Tag>{[n.relation, n.min ? `${n.min}′` : null].filter(Boolean).join(' · ')}</Tag>
							</span>
							{#if n.reason}<span class="hood-reason">“{n.reason}”</span>{/if}
						</a>
					{/each}
				</section>
			{/if}
		</div>
	</div>
</article>

<style>
	article {
		max-width: 940px;
		margin: 0 auto;
		/* Room to stop reading. The apparatus ends where the page ends
		   otherwise, and the footer rule arrives too soon after the last line. */
		padding: 0 var(--pad-measure) 100px;
	}
	header {
		padding: 48px 0 30px;
		border-bottom: 1.5px solid var(--rule-hard);
	}
	.tags {
		display: flex;
		gap: 14px;
		flex-wrap: wrap;
		margin-bottom: 22px;
	}
	.translation {
		font-family: var(--mono);
		font-size: 10.5px;
		letter-spacing: 0.14em;
		text-transform: uppercase;
	}
	.deck {
		font-family: var(--display);
		font-weight: 500;
		font-size: 20px;
		line-height: 1.3;
		letter-spacing: -0.02em;
		color: var(--muted);
		margin: 18px 0 0;
		max-width: 52ch;
	}

	.body {
		display: grid;
		grid-template-columns: 150px 1fr;
		gap: 34px;
		padding: 32px 0 0;
	}
	.measure {
		max-width: var(--measure);
		min-width: 0;
	}

	.hood {
		margin: 40px 0 8px;
	}
	.hood-head {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 16px;
		border-bottom: 1.5px solid var(--rule-hard);
		padding-bottom: 10px;
		margin-bottom: 6px;
	}
	.hood-title {
		font-family: var(--display);
		font-weight: 700;
		font-size: 20px;
		letter-spacing: -0.02em;
		text-transform: lowercase;
	}
	.hood-row {
		display: grid;
		gap: 4px;
		padding: 14px 0;
		border-bottom: 1px solid var(--rule);
		color: var(--ink);
		text-decoration: none;
	}
	.hood-row:hover {
		text-decoration: none;
	}
	.hood-row:hover .hood-row-title {
		color: var(--blue);
	}
	.hood-row-head {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 16px;
	}
	.hood-row-title {
		font-family: var(--display);
		font-size: 19px;
		font-weight: 500;
		letter-spacing: -0.02em;
	}
	.hood-reason {
		font-family: var(--body);
		font-style: italic;
		font-size: 13.5px;
		color: var(--muted);
		line-height: 1.45;
	}

	@media (max-width: 900px) {
		article {
			padding: 0 18px 80px;
		}
		.body {
			grid-template-columns: 1fr;
			gap: 20px;
		}
	}
</style>
