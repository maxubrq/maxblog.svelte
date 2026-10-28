<script lang="ts">
	// The reading surface (DESIGN.md §6): title, one sentence, one meta line,
	// the prose, a rule, then the appendix. The instruments stand outside the
	// column — a 2px progress line, the contents in the margin (or a bar at the
	// foot on a phone) — and nothing stands between the title and the text.
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
	import { formatNumber } from '$lib/content/numbers';
	import { cloudinary, srcsetFor } from '$lib/images';
	import { runningHead } from '$lib/running-head.svelte';
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

	/**
	 * A title that would run past three lines at 80px steps down to 64px
	 * (DIGITAL_EDITORIAL_DESIGN.md §6.1), so the first screen still holds the
	 * opening of the prose. Measured in characters, not rendered lines: at 80px
	 * Display sets about 23 characters across the 928px it may use.
	 */
	const longTitle = $derived(meta.title.length > 64);

	/** The cover, only when the essay names one — no branded stand-in here. */
	const cover = $derived(meta.coverImage ?? null);

	// The running head (§4): the essay's name and the section you are in,
	// shown in the header once the opener has scrolled away.
	let opener = $state<HTMLElement>();
	$effect(() => {
		runningHead.open(meta.title, toc.length);
		return () => runningHead.close();
	});
	$effect(() => {
		const i = toc.findIndex((item) => item.id === activeSection);
		runningHead.at(i === -1 ? 0 : i + 1);
	});
	$effect(() => {
		if (!opener) return;
		const io = new IntersectionObserver(([e]) => runningHead.past(!e.isIntersecting), {
			rootMargin: '-56px 0px 0px 0px'
		});
		io.observe(opener);
		return () => io.disconnect();
	});
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
	<!-- The opener (§6.1): the facts hang in the margin on the title's first
	     baseline, and the title stands alone. Folded below 1280px the facts are
	     one line above the title. -->
	<header class="grid opener" bind:this={opener}>
		<ul class="hang-list g-margin kicker">
			<li class="topic">{meta.topic}</li>
			{#if meta.number}<li>{formatNumber(meta.number)}</li>{/if}
			<li>{fill(t.article.readTime, { n: meta.reading })}</li>
			<li>{dmy(meta.date)}</li>
			{#if meta.chapter}<li>{meta.chapter}</li>{/if}
			{#if meta.interactive}<li>{t.article.interactive}</li>{/if}
			{#if meta.draft}<li class="flag">{t.article.draft}</li>{/if}
			{#if meta.openDraft}
				<li class="flag">
					{history ? fill(t.openDraft.lastTouched, { ago: touchedAgo }) : t.openDraft.indexMark}
				</li>
			{/if}
			{#if data.translation}
				<li>
					<a
						hreflang={data.translation.lang}
						rel="alternate"
						href={href(data.translation.lang, `/writing/${data.translation.slug}`)}
						>{t.article.readInOther}</a
					>
				</li>
			{/if}
		</ul>
		<h1 class="display g-wide" class:long={longTitle}>{meta.title}</h1>
		{#if meta.subtitle}
			<p class="deck g-text">{meta.subtitle}</p>
		{/if}
		{#if meta.openDraft}
			<!-- The draft's own head: what it is, where each section stands, the rail
			     of saves, and the scar layer's switch. Keyed off the frontmatter,
			     not the history: the piece is an open draft from its first line. -->
			<div class="g-wide draft-head">
				<OpenDraftHead
					open={meta.openDraft}
					words={meta.words}
					{history}
					index={revIndex}
					{scars}
					onpick={pickRevision}
					onscars={(on) => (scars = on)}
				/>
			</div>
		{/if}
		<div class="g-spread g-rule"></div>
	</header>

	{#if cover}
		<!-- The cover, across the grid at 3:1, only when the essay has one. -->
		<div class="grid">
			<div class="g-spread ink-screen cover">
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
	{/if}

	<div class="grid body">
		<!-- The contents in the margin, sticky, from the first section down. -->
		<aside class="g-margin rail-cell">
			{#if toc.length > 0 && !travelling}<ContentsRail items={toc} {activeSection} />{/if}
		</aside>

		<div class="g-text measure">
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

		</div>
	</div>

	<!-- The appendix belongs to the essay as it stands now; none of it is true
	     of a version from three edits ago, so it stands down while the reader
	     is back there. One shape for every block — see `.appendix`.

	     Its own row of the grid, after the prose, on purpose: the contents in
	     the margin are sticky inside the row above and so stop at the essay's
	     last line, leaving the margin free for the labels the appendix hangs
	     there. Inside one row, a long contents list rode down over them. -->
	{#if !travelling}
		<div class="grid appendix-row">
			<div class="g-text measure">
				{#if meta.rememberSentence}
					<OneSentence sentence={meta.rememberSentence} attribution={meta.rememberAttribution} />
				{/if}
				<NextReading slug={meta.slug} neighbours={meta.neighborhood ?? []} />
				<Bibliography slug={meta.slug} citations={meta.citations} />
				<GlossaryFootnote terms={meta.terms} draft={meta.draft} />
				<ReflectionPrompt slug={meta.slug} draft={meta.draft} />
			</div>
		</div>
	{/if}
</article>

<style>
	/* The opener: facts and title share their first baseline (§2.3). */
	.opener {
		align-items: baseline;
		padding-top: var(--s-4);
	}
	.opener > .g-rule {
		margin-top: var(--s-3);
	}
	.kicker {
		grid-row: 1;
	}
	.kicker .topic {
		color: var(--ink);
		font-weight: 600;
	}
	.kicker .flag {
		color: var(--blue);
	}
	.opener h1 {
		grid-row: 1;
	}
	.deck {
		font-size: var(--t-body);
		line-height: 1.5;
		color: var(--muted);
		margin: var(--s-2) 0 0;
	}
	.draft-head {
		margin-top: var(--s-3);
	}
	.cover {
		aspect-ratio: 3 / 1;
		margin-top: var(--s-3);
	}
	.body {
		padding-top: var(--s-4);
	}
	/* Room to stop reading before the footer rule arrives. */
	.appendix-row {
		padding-bottom: var(--s-4);
	}
	/* With no appendix (an old revision), the prose row ends the page. */
	.body:last-child {
		padding-bottom: var(--s-4);
	}
	.measure {
		min-width: 0;
	}
	/* The contents ride in the margin, below the opener, while you read. */
	.rail-cell {
		position: relative;
	}
	@media (max-width: 1279px) {
		.kicker,
		.opener h1 {
			grid-row: auto;
		}
		.kicker {
			margin-bottom: var(--s-2);
		}
		.rail-cell {
			display: none;
		}
	}
	/* On a phone the opener gives back its air so the prose still starts in
	   the first screen (DESIGN.md §9: first line above y = 420 at 390 × 844). */
	@media (max-width: 900px) {
		.opener {
			padding-top: var(--s-2);
		}
		.kicker {
			margin-bottom: var(--s-1);
		}
		.opener > .g-rule {
			margin-top: var(--s-2);
		}
		.body {
			padding-top: var(--s-3);
		}
	}
</style>
