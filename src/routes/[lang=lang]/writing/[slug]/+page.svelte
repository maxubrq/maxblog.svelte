<script lang="ts">
	// The reading surface: title block, meta rail + prose, then the apparatus
	// (one sentence · sources · neighborhood) — with the reading instruments
	// standing in the gutter around it: the fore-edge, the contents, the cursor.
	import Headline from '$lib/components/ink/Headline.svelte';
	import ArticleTracker from '$lib/components/article/ArticleTracker.svelte';
	import Bibliography from '$lib/components/article/Bibliography.svelte';
	import OpenDraftHead from '$lib/components/draft/OpenDraftHead.svelte';
	import RevisionBody from '$lib/components/draft/RevisionBody.svelte';
	import UnwrittenSections from '$lib/components/draft/UnwrittenSections.svelte';
	import ForeEdge, { foreEdgeSections } from '$lib/components/article/ForeEdge.svelte';
	import GlossaryFootnote from '$lib/components/article/GlossaryFootnote.svelte';
	import MobileReadingBar from '$lib/components/article/MobileReadingBar.svelte';
	import ReadingMemoryGutter from '$lib/components/article/ReadingMemoryGutter.svelte';
	import ReadingMemoryNudge from '$lib/components/article/ReadingMemoryNudge.svelte';
	import ReadingMemoryTracker from '$lib/components/article/ReadingMemoryTracker.svelte';
	import ReadingRuler from '$lib/components/article/ReadingRuler.svelte';
	import ReaderMarks from '$lib/components/article/ReaderMarks.svelte';
	import ReflectionPrompt from '$lib/components/article/ReflectionPrompt.svelte';
	import SeriesRibbon from '$lib/components/article/SeriesRibbon.svelte';
	import RunningHead from '$lib/components/ink/RunningHead.svelte';
	import Tag from '$lib/components/ink/Tag.svelte';
	import TocDrawer from '$lib/components/article/TocDrawer.svelte';
	import OneSentence from '$lib/components/article/OneSentence.svelte';
	import WeatherStrip from '$lib/components/article/WeatherStrip.svelte';
	import { draftOf } from '$lib/drafts';
	import { replaceState } from '$app/navigation';
	import { fill, href, useI18n } from '$lib/i18n';
	import { createReadingProgress } from '$lib/reading-progress.svelte';
	import { lastSeen } from '$lib/reading-memory';
	import { reading } from '$lib/reading.svelte';
	import { site } from '$lib/site';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const i18n = useI18n();
	const t = $derived(i18n.t);

	const meta = $derived(data.meta);
	const Content = $derived(data.content);
	const toc = $derived(meta.toc ?? []);
	const sections = $derived(foreEdgeSections(toc));

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
	 * The folio. A book of about two dozen leaves, numbered the way a book is —
	 * it says where you are standing, never how far along you are as a fraction.
	 */
	const ROMAN: [string, number][] = [
		['xl', 40],
		['x', 10],
		['ix', 9],
		['v', 5],
		['iv', 4],
		['i', 1]
	];
	function romanize(n: number) {
		let out = '';
		for (const [numeral, value] of ROMAN) {
			while (n >= value) {
				out += numeral;
				n -= value;
			}
		}
		return out;
	}
	const folio = $derived(romanize(Math.max(1, Math.round(progress * 24 + 1))));

	// "N min left" — an estimate of what it costs to finish, not a score. The
	// reader can switch it off; the weight in the gutter stays either way.
	const totalMin = $derived(toc.reduce((sum, item) => sum + item.readMinutes, 0) || meta.reading);
	const minLeft = $derived(Math.max(0, Math.round(totalMin * (1 - progress))));
	const timeLeftLabel = $derived(
		minLeft <= 0 ? t.article.nearlyDone : t.article.minLeft.replace('{n}', String(minLeft))
	);

	// The running head names the section you are in, and falls back to the essay
	// itself in the opening, before the first heading.
	const activeLabel = $derived(toc.find((item) => item.id === activeSection)?.text ?? '');
	const runningHead = $derived(
		activeLabel || `${site.name} · vol.04 · ${meta.topic.toLowerCase()}`
	);
</script>

<svelte:head>
	<title>{meta.title} — {site.name}</title>
	{#if meta.description}<meta name="description" content={meta.description} />{/if}
	<meta property="og:title" content={meta.title} />
	<meta property="og:type" content="article" />
	{#if meta.description}<meta property="og:description" content={meta.description} />{/if}
</svelte:head>

<RunningHead text={runningHead} {folio} />

<ReadingRuler enabled={reading.ruler} />

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
     revision is not reading the essay, so nothing about it is remembered:
     scrolling a version from three edits ago must not move where you were. -->
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
{/if}

{#if toc.length > 0 && !travelling}
	<!-- The gutter, one instrument. The fore-edge carries the weight left in
	     your hand and the contents at once: a section is a run of leaves, hover
	     names it, click goes there. The full list is one tap away in the drawer,
	     for readers who want a list. -->
	<ForeEdge
		{progress}
		{sections}
		readLabel={t.article.read}
		leftLabel={t.article.left}
		contentsLabel={t.article.contents}
		timeLeftLabel={reading.timeLeft ? timeLeftLabel : undefined}
	>
		<button class="contents" onclick={() => (tocOpen = true)} aria-label={t.article.openContents}
			>{t.article.contents}</button
		>
	</ForeEdge>

	<!-- On a phone the gutter is gone; the strip takes the weight and the bar at
	     the foot takes the contents. -->
	<ForeEdge {progress} variant="edge" />

	<MobileReadingBar
		items={toc}
		{activeSection}
		{progress}
		showTimeLeft={reading.timeLeft}
		onopen={() => (tocOpen = true)}
	/>

	<TocDrawer
		open={tocOpen}
		onclose={() => (tocOpen = false)}
		items={toc}
		{activeSection}
		{progress}
		sectionProgress={scroll?.sectionProgress ?? {}}
		showTimeLeft={reading.timeLeft}
	/>
{/if}

<article lang={meta.lang}>
	<header>
		<div class="tags flow-hide">
			<Tag on>{meta.topic}</Tag>
			{#if meta.interactive}<Tag>● {t.article.interactive}</Tag>{/if}
			{#if meta.chapter}<Tag>{meta.chapter}</Tag>{/if}
			{#if meta.draft}<Tag>{t.article.draft}</Tag>{/if}
			{#if history && revision}
				<Tag on>{fill(t.openDraft.lastTouched, { ago: touchedAgo })}</Tag>
			{/if}
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
			<p class="deck flow-hide">{meta.subtitle}</p>
		{/if}
		{#if history && revision}
			<!-- The draft's own head: what it is, where each section stands, the rail
			     of saves, and the scar layer's switch. Inside <header> so it sits
			     above the title block's rule, in the article's full width rather than
			     in the measure — the state table needs a column of its own. -->
			<OpenDraftHead
				{history}
				index={revIndex}
				{scars}
				onpick={pickRevision}
				onscars={(on) => (scars = on)}
			/>
		{/if}
	</header>

	<div class="body">
		<div class="measure">
			<!-- All three speak about the live essay: which arc it belongs to, where
			     you stopped in it, what it costs to read. None of that is a fact
			     about a version from three edits ago, so they stand down while the
			     reader is back there — a nudge saying "3 minutes left" over prose
			     that no longer exists is measuring the wrong text. -->
			{#if !travelling}
				<!-- The arc this piece belongs to, when it belongs to one. Above the
				     nudge because "which series is this" is a fact about the essay,
				     while "where were you in it" is a fact about the reader. -->
				<SeriesRibbon slug={meta.slug} />

				<!-- "You were here", for an essay already started — and the pin in the
				     margin at the section itself. -->
				<ReadingMemoryNudge slug={meta.slug} />
				<ReadingMemoryGutter slug={meta.slug} />

				<!-- The weather of the piece — the reading contract, met on the way in.
				     Hidden in flow: flow is for a reader who already committed. -->
				{#if meta.weather}
					<div class="flow-hide"><WeatherStrip weather={meta.weather} /></div>
				{/if}
			{/if}

			<!-- Wraps the prose and nothing else: a selection in the apparatus below
			     — a source's title, a glossary line — is not a passage of the essay,
			     and a mark drawn there would have nowhere to be redrawn. -->
			{#if travelling && revision}
				<!-- A past save, rebuilt from git. Not wrapped in <ReaderMarks>: a mark
				     anchors into the live text, and one drawn over a version that no
				     longer exists would have nowhere to be redrawn tomorrow. -->
				<RevisionBody body={revision.body} {scars} />
			{:else}
				<ReaderMarks slug={meta.slug} draft={meta.draft} rev={history?.current}>
					<Content />
				</ReaderMarks>
			{/if}

			{#if revision}
				<!-- What is still only notes, printed as notes. -->
				<UnwrittenSections sections={revision.sections} at={revision.r} {travelling} />
			{/if}

			<!-- Finis. The mark a printed essay ends on, before the apparatus — an
			     open draft has not earned it and does not print it. -->
			{#if !history}
				<div class="end-mark" aria-hidden="true">■</div>
			{/if}

			<!-- The apparatus belongs to the essay as it stands now: its sentence to
			     remember, the words it marked, the sources it stands on, the letter
			     box. None of that is true of a version from three edits ago, so
			     while the reader is back there the page shows the prose and the
			     draft's own furniture, and nothing else. -->
			{#if !travelling}
				{#if meta.rememberSentence}
					<OneSentence
						sentence={meta.rememberSentence}
						attribution={meta.rememberAttribution ?? t.article.authorsPick}
					/>
				{/if}

				<!-- The words the essay marked, then the sources it cites — the
				     apparatus of a printed book, in its order: glossary, then
				     bibliography. The first is what the prose used, the second is
				     what it stands on. -->
				<GlossaryFootnote terms={meta.terms} />

				<!-- The sources this essay cites. Built from `appearsIn`, so it needs
				     no marks in the prose — see $lib/resources. -->
				<Bibliography slug={meta.slug} citations={meta.citations} />

				<!-- The reader's turn. Last of the apparatus and before the
				     neighbourhood, the way production orders it: the essay has
				     finished saying what it had to say, and nothing else is asked of
				     the reader after this. -->
				<ReflectionPrompt slug={meta.slug} draft={meta.draft} />
			{/if}

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
		/* The column plus its margins — see --article-w in app.css. Fixed at
		   940px this capped the widest measure at 852px of text. */
		max-width: var(--article-w);
		margin: 0 auto;
		/* Room to stop reading. The apparatus ends where the page ends
		   otherwise, and the footer rule arrives too soon after the last line. */
		padding: 0 var(--pad-measure) 100px;
	}
	/* The rule under the title is a hard one, and a hard rule needs air on both
	   sides or the headline sits on it. The gap below (`.body`) is the larger of
	   the two, so the rule reads as the floor of the title block rather than as
	   the ceiling of the prose. */
	header {
		padding: 48px 0 44px;
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
		margin: 24px 0 0;
		max-width: 52ch;
	}

	.body {
		padding: 56px 0 0;
	}
	/* The essay has no margin rail — author, date and chapter are already in the
	   tag row and the fore-edge — so the prose takes the whole column back.
	   The width is the reader's, from `measure` on /reading; `--measure`
	   defaults to the 820px this page shipped with. */
	.measure {
		max-width: var(--measure);
		min-width: 0;
		margin: 0 auto;
		/* The reading-memory pin is absolute against this column. */
		position: relative;
	}

	/* The way into the full list, standing at the head of the fore-edge rail.
	   Vertical, because the rail is. */
	.contents {
		background: transparent;
		border: none;
		padding: 0;
		cursor: pointer;
		font-family: var(--mono);
		font-size: 9px;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--muted);
	}
	.contents:hover {
		color: var(--blue);
	}

	.end-mark {
		text-align: center;
		margin: 2em 0 0;
		color: var(--blue);
		font-size: 16px;
	}

	/* Flow: the prose, wider and alone. `.flow-hide` is the switch (app.css);
	   what is left here is the room the hidden chrome gives back. The selector
	   reaches <html>, which is outside this component, hence :global. */
	/* Flow gives the column a little more room than the reader asked for —
	   it is the mode for someone who wants the text and nothing else. */
	:global([data-reading-mode='flow']) .measure {
		max-width: calc(var(--measure) + 80px);
	}
	:global([data-reading-mode='flow']) header {
		border-bottom: none;
		padding-bottom: 6px;
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
		/* The same proportion, one size down — 100px of air above the first
		   line is generous on a desktop and a wasted screen on a phone. */
		header {
			padding: 36px 0 32px;
		}
		.body {
			padding: 38px 0 64px;
		}
	}
</style>
