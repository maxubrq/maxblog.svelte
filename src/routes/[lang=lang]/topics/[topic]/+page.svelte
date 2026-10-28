<script lang="ts">
	/**
	 * A topic as a chapter opener (DIGITAL_EDITORIAL_DESIGN.md §7). On the page
	 * grid, top to bottom:
	 *
	 *   1. the opener — the room's name at display size, its line, its plate
	 *   2. the editor's note — why the room exists, signed
	 *   3. the hand-picked three and the scratchpad, when they exist
	 *   4. every essay filed here, as the home page lists them
	 *   5. the other rooms, at the foot, like the contents at a chapter's end
	 *
	 * Labels hang in the margin column; the text column is the essays' own.
	 * Sections 2–3 are authored in `$lib/topics`; `starters` and `scratchpad`
	 * are empty on purpose until the archive is thicker (decided 2026-08-11).
	 */
	import DuoPhoto from '$lib/components/ink/DuoPhoto.svelte';
	import IndexRow from '$lib/components/ink/IndexRow.svelte';
	import { formatNumber } from '$lib/content/numbers';
	import { dm, year } from '$lib/format';
	import { href, fill, useI18n } from '$lib/i18n';
	import { site } from '$lib/site';
	import { TOPICS_ORDER, TOPIC_CONTENT, TONE_STYLES, getTopicLocale } from '$lib/topics';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const i18n = useI18n();
	const t = $derived(i18n.t);

	const room = $derived(TOPIC_CONTENT[data.id]);
	const local = $derived(getTopicLocale(room, i18n.lang));
	/** The voice of the note survives as italic and a narrower measure only;
	 *  its size, leading and centring were cut — one body size, flush left. */
	const tone = $derived(TONE_STYLES[room.tone]);

	/**
	 * The inverted opener is on trial in one room before it goes to all six
	 * (DIGITAL_EDITORIAL_DESIGN.md §12.2). Add an id here to widen the trial.
	 */
	const INVERTED_TRIAL = new Set(['tech']);
	const inverted = $derived(INVERTED_TRIAL.has(data.id));

	const siblings = $derived(
		TOPICS_ORDER.filter((id) => id !== data.id).map((id) => ({
			id,
			name: getTopicLocale(TOPIC_CONTENT[id], i18n.lang).name
		}))
	);

	const kindLabel = $derived({
		question: t.topics.kindQuestion,
		draft: t.topics.kindDraft,
		reading: t.topics.kindReading
	});

	const years = $derived([...new Set(data.posts.map((p) => year(p.date)))]);
</script>

<svelte:head>
	<title>{local.name} — {site.name}</title>
	<meta name="description" content={local.tagline} />
</svelte:head>

<!-- The opener: a chapter's title page. -->
<section class="opener" class:inverse={inverted}>
	<div class="grid opener-grid">
		<ul class="hang-list g-margin facts">
			<li class="where">{t.topics.topicLabel} {data.index} / {data.of}</li>
			<li>{data.total} {data.total === 1 ? t.topics.essay : t.topics.essays}</li>
		</ul>
		<div class="title-cell" class:with-plate={room.plate}>
			<h1 class="display">{local.name}</h1>
			<p class="tagline">{local.tagline}</p>
		</div>
		{#if room.plate}
			<!-- Atmospheric, so `alt` is empty by design: the name beside it says
			     what the room is, in the reader's own language. -->
			<div class="plate">
				<DuoPhoto
					src={room.plate.src ?? ''}
					alt=""
					placeholder={room.plate.placeholder ?? 'plate'}
					halftone={room.plate.halftone}
					sizes="(min-width: 1280px) 280px, 1px"
				/>
			</div>
		{/if}
	</div>
</section>

<!-- The editor's note, in the text column, signed. -->
<section class="grid block">
	<h2 class="hang g-margin">{t.topics.editorNote}</h2>
	<div class="g-text note" class:italic={tone.italic} style:--note-w={tone.maxW}>
		{#each local.intro as paragraph, i (i)}
			<p>{paragraph}</p>
		{/each}
		<p class="sign">— m.</p>
	</div>
</section>

{#if local.starters.length > 0}
	<section class="grid block ruled">
		<h2 class="hang g-margin">{t.topics.readThree}</h2>
		<ul class="g-wide plain">
			{#each local.starters as s (s.num)}
				{@const link = s.slug ? href(i18n.lang, `/writing/${s.slug}`) : null}
				<li>
					<svelte:element
						this={link ? 'a' : 'div'}
						class="starter"
						class:unwritten={!link}
						href={link ?? undefined}
					>
						<span class="starter-title">
							{s.title}
							<!-- Printed, not hidden: a room is also a promise about what is coming. -->
							{#if !link}<span class="forthcoming">{t.topics.forthcoming}</span>{/if}
						</span>
						<span class="why">{s.why} · {s.min} {t.topics.min}</span>
					</svelte:element>
				</li>
			{/each}
		</ul>
	</section>
{/if}

{#if local.scratchpad.length > 0}
	<section class="grid block ruled">
		<h2 class="hang g-margin">{t.topics.scratchpadLabel}</h2>
		<ul class="g-text plain pad">
			{#each local.scratchpad as item, i (i)}
				<li>
					<span class="kind">{kindLabel[item.kind]}</span>
					<p>{item.text}</p>
				</li>
			{/each}
		</ul>
	</section>
{/if}

{#if data.posts.length > 0}
	<!-- Every essay filed here, set exactly as the home page sets them. -->
	<section class="grid block ruled">
		<h2 class="hang g-margin">
			{fill(local.starters.length > 0 ? t.topics.alsoIn : t.topics.filedIn, { name: local.name })}
		</h2>
		<div class="g-wide">
			{#each years as y (y)}
				<ul class="plain">
					{#each data.posts.filter((p) => year(p.date) === y) as p (p.slug)}
						<li>
							<IndexRow
								href={href(i18n.lang, `/writing/${p.slug}`)}
								lead={p.number ? formatNumber(p.number) : ''}
								topic={`${dm(p.date)}.${y}`}
								title={p.title}
								meta={p.openDraft ? t.openDraft.indexMark : fill(t.article.readTime, { n: p.reading })}
								interactive={p.interactive}
								leadWidth="56px"
							/>
						</li>
					{/each}
				</ul>
			{/each}
		</div>
	</section>
{/if}

<!-- The other rooms, at the foot — the contents at the end of a chapter. -->
<nav class="grid block ruled siblings" aria-label={t.nav.topics}>
	<h2 class="hang g-margin">{t.nav.topics}</h2>
	<p class="g-wide">
		{#each siblings as s, i (s.id)}
			{#if i > 0}<span class="sep" aria-hidden="true"> · </span>{/if}<a
				href={href(i18n.lang, `/topics/${s.id}`)}>{s.name}</a
			>
		{/each}
	</p>
</nav>

<style>
	/* ── The opener ── */
	.opener {
		padding: var(--s-4) 0 var(--s-3);
		border-bottom: 1.5px solid var(--rule-hard);
	}
	.inverse {
		background: var(--paper);
		color: var(--ink);
		border-bottom: none;
		padding-bottom: var(--s-4);
	}
	.opener-grid {
		align-items: baseline;
	}
	.facts {
		grid-row: 1;
	}
	.facts .where {
		color: var(--ink);
		font-weight: 600;
	}
	.title-cell {
		grid-column: 4 / 13;
		grid-row: 1;
	}
	.title-cell.with-plate {
		grid-column: 4 / 10;
	}
	.tagline {
		font-size: var(--t-body);
		line-height: 1.5;
		color: var(--muted);
		margin: var(--s-2) 0 0;
		max-width: 40ch;
	}
	.plate {
		grid-column: 10 / 13;
		grid-row: 1;
		align-self: start;
		aspect-ratio: 4 / 5;
	}
	.plate :global(figure),
	.plate :global(.ink-screen),
	.plate :global(.ink-duo) {
		height: 100%;
		margin: 0;
	}

	/* ── Blocks: a label hung in the margin, the content beside it ── */
	.block {
		padding: var(--s-3) 0 0;
		align-items: baseline;
	}
	.block > .hang {
		grid-row: 1;
		font-family: var(--body);
	}
	.block > :not(.hang) {
		grid-row: 1;
	}
	.ruled {
		margin-top: var(--s-3);
	}
	.ruled::before {
		content: '';
		grid-column: 1 / -1;
		grid-row: 1;
		align-self: start;
		margin-top: calc(var(--s-3) * -1);
		border-top: 1.5px solid var(--rule-hard);
	}
	.plain {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.note {
		max-width: var(--note-w, none);
	}
	.note p {
		margin: 0 0 1em;
	}
	.note.italic p {
		font-style: italic;
	}
	.note .sign {
		text-align: right;
		color: var(--muted);
		font-style: normal;
	}

	.starter {
		display: grid;
		gap: 2px;
		padding: var(--s-2) 0;
		border-top: 1px solid var(--rule);
		color: var(--ink);
		text-decoration: none;
	}
	a.starter:hover .starter-title {
		color: var(--blue);
	}
	.starter-title {
		font-weight: 600;
	}
	.unwritten .starter-title {
		color: var(--muted);
	}
	.forthcoming,
	.why,
	.kind {
		font-size: var(--t-meta);
		color: var(--muted);
	}
	.pad li + li {
		margin-top: var(--s-2);
	}
	.pad p {
		margin: 0;
	}

	.siblings {
		padding-bottom: var(--s-4);
	}
	.siblings p {
		margin: 0;
		font-size: var(--t-meta);
	}
	.siblings a {
		color: var(--muted);
	}
	.siblings a:hover {
		color: var(--blue);
	}
	.sep {
		color: var(--muted);
	}

	@media (max-width: 1279px) {
		.facts,
		.title-cell,
		.title-cell.with-plate,
		.plate,
		.block > .hang,
		.block > :not(.hang) {
			grid-column: 1 / -1;
			grid-row: auto;
		}
		.facts {
			margin-bottom: var(--s-2);
		}
		.plate {
			display: none;
		}
		.ruled::before {
			grid-row: 1;
		}
	}
	@media (max-width: 900px) {
		.opener {
			padding-top: var(--s-3);
		}
		.inverse {
			max-height: none;
		}
	}
</style>
