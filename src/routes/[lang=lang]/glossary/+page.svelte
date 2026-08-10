<script lang="ts">
	/**
	 * The site dictionary. Masthead · a demo of how a mark reads inline ·
	 * search + topic filter · an A–Z jump strip · the entries themselves, in two
	 * columns grouped by letter.
	 *
	 * Port of the production blog's `GlossaryPageContent`. The entries come from
	 * `$lib/glossary`, the same module `<Term>` reads, so a definition is
	 * written once and shown in both places.
	 */
	import ArrowMark from '$lib/components/ink/ArrowMark.svelte';
	import Tag from '$lib/components/ink/Tag.svelte';
	import { pad } from '$lib/format';
	import { GLOSSARY_TOPICS, TERMS, getGlossaryLocale, type GlossaryTopic } from '$lib/glossary';
	import { fill, href, useI18n } from '$lib/i18n';
	import { site } from '$lib/site';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const i18n = useI18n();
	const t = $derived(i18n.t.glossary);

	let query = $state('');
	let topic = $state<GlossaryTopic>('All');

	const topicLabel = $derived<Record<GlossaryTopic, string>>({
		All: t.filterAll,
		Science: t.topicScience,
		Software: t.topicSoftware,
		Philosophy: t.topicPhilosophy,
		Art: t.topicArt
	});

	const published = $derived(new Set(data.slugs));

	/**
	 * The dictionary in this locale, in dictionary order.
	 *
	 * Two passes, and the order matters. First each entry's appearances are
	 * narrowed to essays that actually publish here — a citation the reader
	 * cannot open is worse than no citation. Then an entry is kept if it either
	 * still has one, or never claimed any: a word can be defined before it has
	 * been used, but a word whose every use is still a draft has nothing to show.
	 */
	const available = $derived(
		Object.entries(TERMS)
			.map(([id, entry]) => ({ id, ...getGlossaryLocale(entry, i18n.lang), topic: entry.topic }))
			.map((e) => ({
				...e,
				claimed: e.appearances.length,
				appearances: e.appearances.filter((a) => published.has(a.slug))
			}))
			.filter((e) => e.claimed === 0 || e.appearances.length > 0)
			.sort((a, b) => a.term.localeCompare(b.term, i18n.lang))
	);

	/**
	 * The demo reads from the unfiltered list, so it stays put while you filter.
	 * It prefers a term that is actually used somewhere — the card shows a
	 * citation count, and "appears in 0 essays" is a poor advertisement.
	 */
	const featured = $derived(available.find((e) => e.appearances.length > 0) ?? available[0]);

	const entries = $derived(
		available
			.filter((e) => topic === 'All' || e.topic === topic)
			.filter((e) => {
				const q = query.trim().toLowerCase();
				return !q || e.term.toLowerCase().includes(q) || e.short.toLowerCase().includes(q);
			})
	);

	const totalUses = $derived(entries.reduce((n, e) => n + e.appearances.length, 0));

	/** Entries bucketed by first letter, and the letters that have any. */
	const byLetter = $derived.by(() => {
		const map = new Map<string, typeof entries>();
		for (const e of entries) {
			const letter = e.term[0].toUpperCase();
			if (!map.has(letter)) map.set(letter, []);
			map.get(letter)!.push(e);
		}
		return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]));
	});

	const letters = $derived(new Set(byLetter.map(([l]) => l)));
	const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

	/** Running number across the whole filtered list, in display order. */
	const numbered = $derived.by(() => {
		const seen = new Map<string, number>();
		let n = 0;
		for (const [, group] of byLetter) for (const e of group) seen.set(e.id, ++n);
		return seen;
	});

	const plural = (n: number) => (n === 1 ? t.entry : t.entries);
	const essayWord = (n: number) => (n === 1 ? t.essay : t.essays);
</script>

<svelte:head>
	<title>{t.titleLead} {t.titleAccent} — {site.name}</title>
	<meta name="description" content={t.description} />
</svelte:head>

<section class="masthead">
	<div class="labels">
		<Tag>{t.indexLabel}</Tag>
		<Tag>{entries.length} {plural(entries.length)} · {totalUses} {t.usesLabel}</Tag>
	</div>
	<h1>{t.titleLead} <span class="accent">{t.titleAccent}</span></h1>
	<p class="deck">{t.description}</p>
</section>

{#if featured}
	<!-- The popover, shown beside the sentence it belongs to. Built from a real
	     entry so the page never demonstrates a word it does not hold. -->
	<section class="demo">
		<div class="demo-label"><Tag on>{t.demoLabel}</Tag></div>
		<div class="ink-gloss-demo">
			<p class="sentence">
				{t.demoLead}
				<span class="mark">{featured.term}</span>
				{t.demoTail}
			</p>

			<div class="card">
				<ArrowMark dir="left" class="ink-gloss-arrow" left={-46} top={18} w={42} />
				<Tag on>{t.termTag}</Tag>
				<div class="card-term">{featured.term}</div>
				<p class="card-def">{featured.short}</p>
				<div class="card-foot">
					<Tag>
						{fill(t.appearsInCount, {
							count: featured.appearances.length,
							essays: essayWord(featured.appearances.length)
						})}
					</Tag>
					<a href="#gl-{featured.term[0].toUpperCase()}">{t.fullEntry}</a>
				</div>
			</div>
		</div>
	</section>
{/if}

<section class="controls">
	<input class="search" type="search" bind:value={query} placeholder={t.searchPlaceholder} />
	<div class="topics">
		{#each GLOSSARY_TOPICS as tp (tp)}
			<button class="topic" class:on={topic === tp} onclick={() => (topic = tp)}
				>{topicLabel[tp]}</button
			>
		{/each}
	</div>
</section>

<section class="az">
	<Tag>{t.azLabel}</Tag>
	{#each ALPHABET as letter (letter)}
		{#if letters.has(letter)}
			<a href="#gl-{letter}">{letter}</a>
		{:else}
			<span>{letter}</span>
		{/if}
	{/each}
</section>

{#if byLetter.length === 0}
	<p class="empty">{t.noEntries}</p>
{/if}

{#each byLetter as [letter, group] (letter)}
	<section class="letter" id="gl-{letter}">
		<div class="letter-head">
			<h2>{letter}</h2>
			<span class="rule"></span>
			<Tag>{group.length} {plural(group.length)}</Tag>
		</div>

		<div class="ink-gloss-grid">
			{#each group as e (e.id)}
				<article class="ink-gloss-cell">
					<span class="num">{pad(numbered.get(e.id) ?? 0)}</span>
					<div class="body">
						<div class="head">
							<h3>{e.term}</h3>
							{#if e.appearances.length > 0}<Tag>×{e.appearances.length}</Tag>{/if}
						</div>
						<div class="meta">
							<Tag>{e.pos}</Tag>
							<Tag on>{e.topic}</Tag>
						</div>
						<p class="short">{e.short}</p>

						{#if e.long}
							<!-- Folded: a dictionary only scans if the grid stays a grid. -->
							<details class="ink-gloss-more">
								<summary><Tag>{t.inDetail}</Tag></summary>
								<p class="long">{e.long}</p>
							</details>
						{/if}

						{#if e.appearances.length > 0}
							<div class="appears">
								<Tag>{t.appearsIn}</Tag>
								{#each e.appearances as a (a.slug + a.section)}
									<a href={href(i18n.lang, `/writing/${a.slug}`)} title={a.section}>{a.title}</a>
								{/each}
							</div>
						{/if}
					</div>
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
	.mark {
		color: var(--blue);
		font-weight: 500;
		border-bottom: 2px dotted var(--blue);
		cursor: help;
	}
	.card {
		position: relative;
		border: 1.5px solid var(--rule-hard);
		background: var(--paper);
		padding: 18px 20px;
	}
	.card-term {
		font-family: var(--display);
		font-weight: 700;
		font-size: 22px;
		letter-spacing: -0.02em;
		line-height: 1.05;
		text-transform: lowercase;
		margin: 6px 0 8px;
	}
	.card-def {
		margin: 0 0 12px;
		font-size: 13.5px;
		line-height: 1.5;
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

	.az {
		display: flex;
		align-items: baseline;
		gap: 4px;
		flex-wrap: wrap;
		padding: 18px var(--pad-chrome);
		border-bottom: 1.5px solid var(--rule-hard);
		font-family: var(--mono);
		font-size: 13px;
	}
	.az :global(.tag) {
		margin-right: 14px;
	}
	.az a,
	.az span {
		padding: 2px 5px;
		letter-spacing: 0.06em;
	}
	.az span {
		color: var(--faint);
	}

	.empty {
		padding: 80px;
		text-align: center;
		font-style: italic;
		color: var(--muted);
	}

	.letter {
		padding: 0 var(--pad-chrome);
	}
	.letter-head {
		display: flex;
		align-items: center;
		gap: 20px;
		padding: 30px 0 8px;
	}
	.letter-head h2 {
		margin: 0;
		font-size: clamp(48px, 8vw, 80px);
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
	.head {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 12px;
	}
	.head h3 {
		margin: 0;
		font-size: 21px;
		letter-spacing: -0.02em;
		line-height: 1.05;
	}
	.meta {
		display: flex;
		gap: 12px;
		align-items: baseline;
		flex-wrap: wrap;
		margin-top: 8px;
	}
	.short {
		margin: 8px 0 0;
		font-size: 13.5px;
		line-height: 1.5;
		color: var(--muted);
		max-width: 44ch;
	}
	.long {
		margin: 8px 0 0;
		font-size: 12.5px;
		line-height: 1.5;
		color: var(--muted);
		max-width: 44ch;
	}
	.appears {
		margin-top: 12px;
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
		.az,
		.letter {
			padding-left: 18px;
			padding-right: 18px;
		}
		.colophon {
			margin-left: 18px;
			margin-right: 18px;
		}
	}
</style>
