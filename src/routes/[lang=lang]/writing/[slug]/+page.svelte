<script lang="ts">
	// The reading surface (DESIGN.md §6): title, one sentence, one meta line,
	// the prose, a rule, then the appendix. The instruments stand outside the
	// column — a 2px progress line, the contents in the margin (or a bar at the
	// foot on a phone) — and nothing stands between the title and the text.
	import Headline from '$lib/components/ink/Headline.svelte';
	import ArticleTracker from '$lib/components/article/ArticleTracker.svelte';
	import Bibliography from '$lib/components/article/Bibliography.svelte';
	import ContentsRail from '$lib/components/article/ContentsRail.svelte';
	import OpenDraftHead from '$lib/components/draft/OpenDraftHead.svelte';
	import RevisionBody from '$lib/components/draft/RevisionBody.svelte';
	import UnwrittenSections from '$lib/components/draft/UnwrittenSections.svelte';
	import GlossaryFootnote from '$lib/components/article/GlossaryFootnote.svelte';
	import MobileReadingBar from '$lib/components/article/MobileReadingBar.svelte';
	import NextReading from '$lib/components/article/NextReading.svelte';
	import ProgressLine from '$lib/components/article/ProgressLine.svelte';
	import ReadingMemoryTracker from '$lib/components/article/ReadingMemoryTracker.svelte';
	import ReflectionPrompt from '$lib/components/article/ReflectionPrompt.svelte';
	import ResumeToast from '$lib/components/article/ResumeToast.svelte';
	import TocDrawer from '$lib/components/article/TocDrawer.svelte';
	import OneSentence from '$lib/components/article/OneSentence.svelte';
	import { draftOf } from '$lib/drafts';
	import { replaceState } from '$app/navigation';
	import { dmy } from '$lib/format';
	import { fill, href, useI18n } from '$lib/i18n';
	import { createReadingProgress } from '$lib/reading-progress.svelte';
	import { lastSeen } from '$lib/reading-memory';
	import { site } from '$lib/site';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const i18n = useI18n();
	const t = $derived(i18n.t);

	const meta = $derived(data.meta);
	const Content = $derived(data.content);
	const toc = $derived(meta.toc ?? []);

	// One measurement of the page, shared by every instrument on it.
	let scroll = $state<ReturnType<typeof createReadingProgress> | null>(null);
	$effect(() => {
		const s = createReadingProgress();
		scroll = s;
		return () => {
			s.stop();
			scroll = null;
		};
	});
	const progress = $derived(scroll?.progress ?? 0);
	const activeSection = $derived(scroll?.activeSection ?? '');

	let tocOpen = $state(false);

	/**
	 * The open draft, if this piece is one — see `$lib/drafts`.
	 *
	 * `picked` is the revision the reader is standing at and is a *label*, not
	 * an index: navigating to another essay must not carry a position from this
	 * one, and a label that does not belong to the new piece simply falls back
	 * to its newest save.
	 *
	 * Everything below stays out of the load function on purpose. The page is
	 * prerendered, and where a reader stands in the history is not a fact about
	 * the page — it is a fact about this visit, so `?r=` is applied and written
	 * client-side and the served HTML is always the current text.
	 */
	const history = $derived(draftOf(meta.slug));
	let picked = $state<string | null>(null);
	let scars = $state(true);

	const revIndex = $derived.by(() => {
		if (!history) return 0;
		const i = history.revisions.findIndex((rev) => rev.r === picked);
		return i === -1 ? history.revisions.length - 1 : i;
	});
	const revision = $derived(history ? history.revisions[revIndex] : null);
	/** Standing anywhere but the newest save. The live prose is not what is shown. */
	const travelling = $derived(!!history && !!revision && revision.r !== history.current);

	// A shared `?r=` link has to land where it says it does.
	$effect(() => {
		if (!history) return;
		const asked = new URL(location.href).searchParams.get('r');
		if (asked && history.revisions.some((rev) => rev.r === asked)) picked = asked;
	});

	/** How long ago the piece was last handled — the newest save, not the one
	 *  the reader happens to be standing at. */
	const touchedAgo = $derived(
		history
			? lastSeen(
					Date.parse(history.revisions[history.revisions.length - 1].date),
					t.readingMemory,
					i18n.lang
				)
			: ''
	);

	function pickRevision(i: number) {
		if (!history) return;
		const rev = history.revisions[i];
		picked = rev.r;
		const url = new URL(location.href);
		if (rev.r === history.current) url.searchParams.delete('r');
		else url.searchParams.set('r', rev.r);
		replaceState(url, {});
	}

	/** Above the title: where the piece is filed. */
	const kicker = $derived([meta.topic, meta.chapter].filter(Boolean).join(' · '));
</script>

<svelte:head>
	<title>{meta.title} — {site.name}</title>
	{#if meta.description}<meta name="description" content={meta.description} />{/if}
	<meta property="og:title" content={meta.title} />
	<meta property="og:type" content="article" />
	{#if meta.description}<meta property="og:description" content={meta.description} />{/if}
</svelte:head>

<ProgressLine {progress} />

<!-- Counts, never identities: opened · reached a section · finished. It takes
     the page's own measurement rather than listening again. -->
<ArticleTracker
	postSlug={meta.slug}
	locale={meta.lang}
	{progress}
	{activeSection}
	draft={meta.draft || travelling}
/>

<!-- Where *you* stopped — device-local, and never leaves it. Reading an old
     revision is not reading the essay, so nothing about it is remembered. -->
{#if !travelling}
	<ReadingMemoryTracker
		slug={meta.slug}
		title={meta.title}
		topic={meta.topic}
		lang={meta.lang}
		reading={meta.reading}
		{toc}
		{progress}
		{activeSection}
	/>
	<ResumeToast slug={meta.slug} />
{/if}

{#if toc.length > 0 && !travelling}
	<ContentsRail items={toc} {activeSection} />
	<MobileReadingBar items={toc} {activeSection} onopen={() => (tocOpen = true)} />
	<TocDrawer
		open={tocOpen}
		onclose={() => (tocOpen = false)}
		items={toc}
		{activeSection}
		{progress}
		sectionProgress={scroll?.sectionProgress ?? {}}
		showTimeLeft={false}
	/>
{/if}

<article lang={meta.lang}>
	<header>
		{#if kicker}<p class="kicker">{kicker}</p>{/if}
		<Headline text={meta.title} />
		{#if meta.subtitle}
			<p class="deck">{meta.subtitle}</p>
		{/if}
		<p class="meta">
			<span>{fill(t.article.readTime, { n: meta.reading })}</span>
			<span>{dmy(meta.date)}</span>
			{#if meta.interactive}<span>{t.article.interactive}</span>{/if}
			{#if meta.draft}<span class="flag">{t.article.draft}</span>{/if}
			{#if meta.openDraft}
				<span class="flag"
					>{history ? fill(t.openDraft.lastTouched, { ago: touchedAgo }) : t.openDraft.indexMark}</span
				>
			{/if}
			{#if data.translation}
				<a
					hreflang={data.translation.lang}
					rel="alternate"
					href={href(data.translation.lang, `/writing/${data.translation.slug}`)}
					>{t.article.readInOther}</a
				>
			{/if}
		</p>
		{#if meta.openDraft}
			<!-- The draft's own head: what it is, where each section stands, the rail
			     of saves, and the scar layer's switch. Keyed off the frontmatter,
			     not the history: the piece is an open draft from its first line. -->
			<OpenDraftHead
				open={meta.openDraft}
				words={meta.words}
				{history}
				index={revIndex}
				{scars}
				onpick={pickRevision}
				onscars={(on) => (scars = on)}
			/>
		{/if}
	</header>

	<div class="measure">
		{#if travelling && revision}
			<!-- A past save, rebuilt from git. -->
			<RevisionBody body={revision.body} {scars} />
		{:else}
			<Content />
		{/if}

		{#if meta.openDraft}
			<!-- What is still only notes, printed as notes. -->
			<UnwrittenSections
				sections={travelling && revision ? revision.sections : meta.openDraft.sections}
				at={revision?.r ?? ''}
				{travelling}
			/>
		{/if}

		<!-- The appendix belongs to the essay as it stands now; none of it is true
		     of a version from three edits ago, so it stands down while the reader
		     is back there. One shape for every block — see `.appendix`. -->
		{#if !travelling}
			{#if meta.rememberSentence}
				<OneSentence sentence={meta.rememberSentence} attribution={meta.rememberAttribution} />
			{/if}
			<NextReading slug={meta.slug} neighbours={meta.neighborhood ?? []} />
			<Bibliography slug={meta.slug} citations={meta.citations} />
			<GlossaryFootnote terms={meta.terms} draft={meta.draft} />
			<ReflectionPrompt slug={meta.slug} draft={meta.draft} />
		{/if}
	</div>
</article>

<style>
	article {
		max-width: var(--article-w);
		margin: 0 auto;
		/* Room to stop reading before the footer rule arrives. */
		padding: 0 var(--pad-measure) var(--s-4);
	}
	header,
	.measure {
		max-width: var(--measure);
		margin: 0 auto;
	}
	/* The title block ends on a hard rule; the prose starts a full 64px below
	   it, so the rule reads as the floor of the title, not the roof of the text. */
	header {
		padding: var(--s-4) 0 var(--s-3);
		border-bottom: 1.5px solid var(--rule-hard);
	}
	.kicker {
		font-size: var(--t-meta);
		color: var(--muted);
		margin: 0 0 var(--s-2);
	}
	.deck {
		font-size: var(--t-body);
		line-height: 1.5;
		color: var(--muted);
		margin: var(--s-2) 0 0;
	}
	.meta {
		display: flex;
		flex-wrap: wrap;
		gap: 0 var(--s-2);
		font-size: var(--t-meta);
		color: var(--muted);
		font-variant-numeric: tabular-nums;
		margin: var(--s-2) 0 0;
	}
	.flag {
		color: var(--blue);
	}
	.measure {
		padding-top: var(--s-4);
		min-width: 0;
		/* The essay's last line must not sit under the phone's contents bar. */
		padding-bottom: var(--s-3);
	}

	@media (max-width: 900px) {
		article {
			padding: 0 var(--s-2) var(--s-4);
		}
		header {
			padding-top: var(--s-3);
		}
		.measure {
			padding-top: var(--s-3);
		}
	}
</style>
