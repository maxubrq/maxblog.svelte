<script lang="ts">
	/**
	 * A series, as the reading surface for a whole arc.
	 *
	 * Built to `maxubrq/project/pages/InkSeries.jsx`. A series is a bigger
	 * contract than one piece, so the page owes the reader four things in this
	 * order: the **shape** of the arc up front, **where they are** in it, a real
	 * **bridge** into the next part, and the **threads** that recur across it.
	 *
	 * Only the last of those is authored per-arc; the rest are derived. And only
	 * "where you are" is the reader's — it comes out of reading memory after
	 * mount, so the page is the same static HTML for everyone.
	 */
	import Headline from '$lib/components/ink/Headline.svelte';
	import Tag from '$lib/components/ink/Tag.svelte';
	import { fill, href, useI18n } from '$lib/i18n';
	import { readMemory } from '$lib/reading-memory';
	import { SERIES, getSeriesLocale, seriesProgress } from '$lib/series';
	import { site } from '$lib/site';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const i18n = useI18n();
	const t = $derived(i18n.t.series);

	const series = $derived(SERIES.find((s) => s.id === data.id)!);
	const local = $derived(getSeriesLocale(series, i18n.lang));
	const chapters = $derived(data.chapters);

	/**
	 * `null` until the device has been asked. Before that every chapter is drawn
	 * as `ahead`, which is what a first-time reader sees anyway — no flash of a
	 * wrong "you are here".
	 */
	let finished = $state<Set<string> | null>(null);
	$effect(() => {
		finished = new Set(
			Object.values(readMemory())
				.filter((e) => e.finished)
				.map((e) => e.slug)
		);
	});

	const progress = $derived(seriesProgress(chapters, finished ?? new Set()));
	const current = $derived(progress.currentIndex >= 0 ? chapters[progress.currentIndex] : null);
	const previous = $derived(progress.currentIndex > 0 ? chapters[progress.currentIndex - 1] : null);

	const stateLabel = $derived({
		read: t.stateRead,
		current: t.stateHere,
		ahead: t.stateAhead
	});
</script>

<svelte:head>
	<title>{local.title} — {site.name}</title>
	<meta name="description" content={local.subtitle} />
</svelte:head>

<section class="masthead">
	<div class="tags">
		<Tag on>{t.label}</Tag>
		<Tag
			>{series.chapterCount === 'open-ended'
				? t.openEnded
				: fill(t.movements, { n: series.chapterCount })}</Tag
		>
		<Tag>{series.volume}</Tag>
	</div>
	<Headline text={local.title} accent="" size={62} />
	<p class="deck">{local.subtitle}</p>

	<!-- The contract for the whole arc: what it costs, and how far in you are.
	     The sum of the parts is a fact the individual essays cannot state. -->
	<div class="contract">
		<div class="cell">
			<div class="k">{t.fullArc}</div>
			<div class="v">{fill(t.arcCost, { min: progress.totalMin, n: chapters.length })}</div>
		</div>
		<div class="cell">
			<div class="k">{t.readIt}</div>
			<div class="v">{t.inOrder}</div>
		</div>
		<div class="cell">
			<div class="k">{t.you}</div>
			<div class="v">
				{finished === null
					? '—'
					: fill(t.youAre, { read: progress.readMin, total: progress.totalMin })}
			</div>
		</div>
	</div>
</section>

<!-- The arc: the shape of the whole, with the reader's place marked. -->
<section class="arc">
	<div class="kicker">{t.theArc}</div>
	{#each chapters as c, i (c.slug)}
		{@const state = progress.states[i]}
		<div class="part" class:is-current={state === 'current'} class:is-ahead={state === 'ahead'}>
			<div class="spine">
				{#if i > 0}<span class="thread" class:lit={state !== 'ahead'}></span>{/if}
				<!-- The one other circle on the site, for the same reason as the
				     vault's: a position in a sequence is not a rectangle. -->
				<span class="node" class:read={state === 'read'} class:here={state === 'current'}
					>{c.num}</span
				>
				{#if i < chapters.length - 1}<span class="thread grow" class:lit={state === 'read'}></span>{/if}
			</div>

			<svelte:element
				this={c.exists ? 'a' : 'div'}
				class="card"
				href={c.exists ? href(i18n.lang, `/writing/${c.slug}`) : undefined}
			>
				<span class="card-head">
					<span class="where">{fill(t.movement, { n: i + 1 })} · {stateLabel[state]}</span>
					<span class="cost">
						{#if c.min}◔ {c.min} {t.min}{:else}{t.unwritten}{/if}
					</span>
				</span>
				<span class="card-body">
					<span class="part-title">{c.title}</span>
					{#if c.description}<span class="note">{c.description}</span>{/if}
				</span>
			</svelte:element>
		</div>
	{/each}
</section>

<!-- The bridge: a handoff into the part you are on, not a "next" button. It
     only appears once there is something to hand *over* — the reader has to
     have finished a part for there to be a bank to cross from. -->
{#if current && previous && current.bridge}
	<section class="bridge-wrap">
		<div class="bridge">
			<div class="bridge-head">
				<span>{fill(t.bridge, { from: previous.num, to: current.num })}</span>
				<span class="carry">{t.carryThisIn}</span>
			</div>
			<div class="bridge-body">
				{#if previous.remember}
					<div>
						<div class="k">{t.whereYouLeftOff}</div>
						<p class="left-off">{previous.remember}</p>
					</div>
				{/if}
				<div>
					<div class="k">{t.holdThisGoingIn}</div>
					<p class="carry-text">{current.bridge}</p>
					{#if current.exists}
						<a class="enter" href={href(i18n.lang, `/writing/${current.slug}`)}
							>{fill(t.enterMovement, { n: progress.currentIndex + 1 })}</a
						>
					{/if}
				</div>
			</div>
		</div>
	</section>
{/if}

<section class="tail">
	{#if local.threads.length > 0}
		<div class="threads">
			<div class="kicker">{t.threadsLabel}</div>
			{#each local.threads as th (th.label)}
				{@const inside = progress.currentIndex >= 0 && th.parts.includes(progress.currentIndex + 1)}
				<div class="thread-row">
					<span class="thread-label" class:inside>{th.label}</span>
					<span class="ticks">
						{#each chapters as _, i (i)}
							<span class="tick" class:on={th.parts.includes(i + 1)} class:inside></span>
						{/each}
					</span>
				</div>
			{/each}
		</div>
	{/if}

	<!-- The editor's letter: why this is a series and not several posts. -->
	<div class="letter">
		<div class="kicker">{t.whySeries}</div>
		{#each local.letter as para, i (i)}
			<p>{para}</p>
		{/each}
	</div>
</section>

<style>
	.masthead {
		padding: 46px var(--pad-chrome) 32px;
		border-bottom: 1.5px solid var(--rule-hard);
	}
	.tags {
		display: flex;
		gap: 12px;
		flex-wrap: wrap;
		margin-bottom: 18px;
	}
	.deck {
		max-width: 56ch;
		font-size: 17px;
		line-height: 1.55;
		color: var(--muted);
		margin: 20px 0 24px;
	}

	.contract {
		display: flex;
		flex-wrap: wrap;
		border: 1.5px solid var(--rule-hard);
	}
	.cell {
		flex: 1 1 auto;
		padding: 11px 18px;
		border-left: 1px solid var(--rule);
	}
	.cell:first-child {
		border-left: none;
	}
	.k {
		font-family: var(--mono);
		font-size: 9px;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--faint);
		margin-bottom: 4px;
	}
	.v {
		font-family: var(--mono);
		font-size: 13px;
	}

	.kicker {
		font-family: var(--mono);
		font-size: 10px;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--muted);
		margin-bottom: 20px;
	}

	.arc {
		padding: 30px var(--pad-chrome) 10px;
	}
	.part {
		display: grid;
		grid-template-columns: 54px 1fr;
	}
	.spine {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.thread {
		width: 2px;
		height: 22px;
		background: var(--rule);
	}
	.thread.grow {
		flex: 1;
		min-height: 22px;
	}
	.thread.lit {
		background: var(--blue);
	}
	.node {
		width: 34px;
		height: 34px;
		border-radius: 50%;
		flex-shrink: 0;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		font-family: var(--display);
		font-weight: 700;
		font-size: 14px;
		border: 2px solid var(--rule);
		color: var(--muted);
	}
	.node.read {
		background: var(--ink);
		border-color: var(--ink);
		color: var(--paper);
	}
	.node.here {
		background: var(--panel-blue);
		border-color: var(--panel-blue);
		color: var(--on-blue);
	}

	.card {
		display: block;
		border: 1.5px solid var(--rule-hard);
		margin: 0 0 14px 16px;
		color: var(--ink);
	}
	.is-current .card {
		border-color: var(--blue);
		background: color-mix(in srgb, var(--blue) 4%, transparent);
	}
	/* A part still ahead is dimmed, not hidden: the arc has to be legible whole,
	   and the reader is allowed to look forward. */
	.is-ahead .card {
		opacity: 0.72;
	}
	.is-ahead .card:hover {
		opacity: 1;
	}
	a.card:hover {
		text-decoration: none;
	}
	.card-head {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 12px;
		padding: 8px 14px;
		border-bottom: 1px solid var(--rule);
	}
	.where {
		font-family: var(--mono);
		font-size: 10px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--muted);
	}
	.is-current .where {
		color: var(--blue);
	}
	.cost {
		font-family: var(--mono);
		font-size: 10.5px;
		color: var(--faint);
		white-space: nowrap;
	}
	.card-body {
		display: block;
		padding: 13px 14px 15px;
	}
	.part-title {
		display: block;
		font-family: var(--display);
		font-weight: 600;
		font-size: 22px;
		letter-spacing: -0.02em;
		text-transform: lowercase;
		line-height: 1.05;
	}
	a.card:hover .part-title {
		color: var(--blue);
	}
	.note {
		display: block;
		font-size: 14px;
		line-height: 1.5;
		color: var(--muted);
		margin-top: 7px;
	}

	.bridge-wrap {
		padding: 8px var(--pad-chrome) 30px;
	}
	.bridge {
		border: 1.5px solid var(--rule-hard);
		background: var(--panel-blue);
		color: var(--on-blue);
	}
	.bridge-head {
		display: flex;
		justify-content: space-between;
		gap: 12px;
		flex-wrap: wrap;
		padding: 10px 16px;
		border-bottom: 1px solid color-mix(in srgb, var(--on-blue) 25%, transparent);
		font-family: var(--mono);
		font-size: 10px;
		letter-spacing: 0.14em;
		text-transform: uppercase;
	}
	.carry {
		opacity: 0.8;
	}
	.bridge-body {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 24px;
		padding: 20px 18px 22px;
	}
	.bridge-body .k {
		color: color-mix(in srgb, var(--on-blue) 75%, transparent);
	}
	.left-off {
		font-family: var(--display);
		font-weight: 500;
		font-size: 19px;
		line-height: 1.25;
		letter-spacing: -0.01em;
		margin: 0;
		text-transform: lowercase;
	}
	.carry-text {
		font-size: 15px;
		line-height: 1.55;
		margin: 0;
		opacity: 0.95;
	}
	.enter {
		display: inline-block;
		margin-top: 14px;
		font-family: var(--mono);
		font-size: 11px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--panel-blue);
		background: var(--on-blue);
		padding: 11px 16px;
	}
	.enter:hover {
		text-decoration: none;
	}

	.tail {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 30px;
		padding: 20px var(--pad-chrome) 60px;
		border-top: 1.5px solid var(--rule-hard);
		margin: 4px var(--pad-chrome) 0;
		padding-left: 0;
		padding-right: 0;
	}
	.thread-row {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 5px 0;
	}
	.thread-label {
		font-family: var(--mono);
		font-size: 11px;
		color: var(--muted);
		min-width: 130px;
	}
	/* A thread lit in blue is one the reader is currently inside — it started
	   earlier and pays off later. */
	.thread-label.inside {
		color: var(--blue);
	}
	.ticks {
		display: flex;
		gap: 3px;
	}
	.tick {
		width: 16px;
		height: 4px;
		background: var(--rule);
	}
	.tick.on {
		background: var(--rule-hard);
	}
	.tick.on.inside {
		background: var(--blue);
	}
	.letter p {
		font-size: 14.5px;
		line-height: 1.6;
		margin: 0 0 12px;
	}
	.letter p:last-child {
		margin-bottom: 0;
		color: var(--muted);
	}

	@media (max-width: 860px) {
		.bridge-body,
		.tail {
			grid-template-columns: 1fr;
		}
	}
	@media (max-width: 700px) {
		.masthead,
		.arc,
		.bridge-wrap {
			padding-left: 18px;
			padding-right: 18px;
		}
		.tail {
			margin-left: 18px;
			margin-right: 18px;
		}
	}
</style>
