<script lang="ts">
	/**
	 * The series shelf — the arcs, and how much of each one exists.
	 *
	 * A row says two different things and keeps them apart: what the author has
	 * promised (the arc, its length, its state) and what is actually written.
	 * "III of VIII" is not a progress bar for the reader; it is the author being
	 * honest about a contract they are still fulfilling.
	 */
	import Headline from '$lib/components/ink/Headline.svelte';
	import Tag from '$lib/components/ink/Tag.svelte';
	import { pad } from '$lib/format';
	import { fill, href, useI18n } from '$lib/i18n';
	import { SERIES, getSeriesLocale } from '$lib/series';
	import { site } from '$lib/site';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const i18n = useI18n();
	const t = $derived(i18n.t.series);

	const rows = $derived(
		data.shelf.map((row, i) => {
			const s = SERIES.find((x) => x.id === row.id)!;
			return {
				...getSeriesLocale(s, i18n.lang),
				id: s.id,
				index: i + 1,
				state: s.state,
				volume: s.volume,
				written: row.chapters.filter((c) => c.exists && !c.draft).length,
				promised: s.chapterCount === 'open-ended' ? null : s.chapterCount,
				minutes: row.chapters.reduce((sum, c) => sum + c.min, 0)
			};
		})
	);
</script>

<svelte:head>
	<title>{t.titleLead} {t.titleAccent} — {site.name}</title>
	<meta name="description" content={t.description} />
</svelte:head>

<section class="masthead">
	<div class="row">
		<Tag on>{t.label}</Tag>
		<Tag>{fill(t.count, { n: rows.length })}</Tag>
	</div>
	<Headline text="{t.titleLead} {t.titleAccent}" accent={t.titleAccent} mark="underline" size={72} />
	<p class="deck">{t.description}</p>
</section>

{#if rows.length === 0}
	<!-- Nothing is finished yet, so there is no arc to describe. See the note in
	     $lib/series: the machinery is wired, the shelf is simply empty. -->
	<div class="empty">
		<p class="empty-title">{t.emptyTitle}</p>
		<p class="empty-body">{t.emptyBody}</p>
	</div>
{:else}
	<section class="shelf">
		{#each rows as s (s.id)}
			<a class="arc" href={href(i18n.lang, `/series/${s.id}`)}>
				<span class="numeral">{pad(s.index)}</span>
				<span class="body">
					<span class="tags">
						<Tag on>{s.volume}</Tag>
						<Tag>{s.state === 'complete' ? t.stateComplete : t.stateInProgress}</Tag>
					</span>
					<span class="title">{s.title}</span>
					<span class="subtitle">{s.subtitle}</span>
				</span>
				<span class="counts">
					<span class="written"
						>{s.promised
							? fill(t.writtenOf, { n: s.written, total: s.promised })
							: fill(t.writtenOpen, { n: s.written })}</span
					>
					<span class="minutes">{s.minutes}′</span>
				</span>
			</a>
		{/each}
	</section>
{/if}

<style>
	.masthead {
		padding: 44px var(--pad-chrome) 32px;
		border-bottom: 1.5px solid var(--rule-hard);
	}
	.row {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 12px;
		flex-wrap: wrap;
		margin-bottom: 14px;
	}
	.deck {
		margin: 22px 0 0;
		font-size: 16.5px;
		line-height: 1.55;
		color: var(--muted);
		max-width: 58ch;
	}

	.empty {
		padding: 90px var(--pad-chrome) 120px;
		text-align: center;
	}
	.empty-title {
		font-family: var(--display);
		font-weight: 500;
		font-size: 24px;
		text-transform: lowercase;
		margin: 0 0 10px;
	}
	.empty-body {
		font-size: 14.5px;
		line-height: 1.6;
		color: var(--muted);
		margin: 0 auto;
		max-width: 52ch;
	}

	.shelf {
		padding: 0 0 80px;
	}
	.arc {
		display: grid;
		grid-template-columns: 64px 1fr auto;
		gap: 24px;
		align-items: baseline;
		padding: 26px var(--pad-chrome) 28px;
		border-bottom: 1.5px solid var(--rule-hard);
		color: var(--ink);
	}
	.arc:hover {
		background: var(--paper2);
		text-decoration: none;
	}
	.numeral {
		font-family: var(--mono);
		font-size: 13px;
		color: var(--faint);
	}
	.body {
		min-width: 0;
	}
	.tags {
		display: flex;
		gap: 10px;
		flex-wrap: wrap;
		margin-bottom: 8px;
	}
	.title {
		display: block;
		font-family: var(--display);
		font-weight: 700;
		font-size: 30px;
		letter-spacing: -0.03em;
		line-height: 1.05;
		text-transform: lowercase;
	}
	.arc:hover .title {
		color: var(--blue);
	}
	.subtitle {
		display: block;
		margin-top: 8px;
		font-size: 14.5px;
		line-height: 1.5;
		color: var(--muted);
		max-width: 62ch;
	}
	.counts {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 5px;
		font-family: var(--mono);
		font-size: 11px;
		white-space: nowrap;
	}
	.written {
		color: var(--blue);
	}
	.minutes {
		color: var(--muted);
	}

	@media (max-width: 700px) {
		.masthead,
		.empty {
			padding-left: 18px;
			padding-right: 18px;
		}
		.arc {
			grid-template-columns: 1fr;
			gap: 10px;
			padding-left: 18px;
			padding-right: 18px;
		}
		.counts {
			flex-direction: row;
			align-items: baseline;
			gap: 14px;
		}
	}
</style>
