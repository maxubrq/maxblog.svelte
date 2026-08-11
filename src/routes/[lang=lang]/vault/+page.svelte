<script lang="ts">
	/**
	 * The vault, as a timeline. Grouped by the year a thing entered the
	 * collection rather than by kind — the whole argument of the page is that a
	 * record and a paper from the same year stand next to each other.
	 *
	 * Not in the nav, on purpose: the only way in is the door on `/about`. A
	 * private cabinet with a menu entry is not private, it is a section.
	 *
	 * Dense years flow into two columns, and everything older than the newest
	 * two folds away — the shelf grows every year and the page should not.
	 */
	import Headline from '$lib/components/ink/Headline.svelte';
	import ResourceCover from '$lib/components/ink/ResourceCover.svelte';
	import Tag from '$lib/components/ink/Tag.svelte';
	import { fill, href, useI18n } from '$lib/i18n';
	import { site } from '$lib/site';
	import { VAULT, VAULT_MEDIA, getVaultCovers, getVaultLocale, type VaultMedium } from '$lib/vault';

	const i18n = useI18n();
	const t = $derived(i18n.t.vault);

	/** How many of the newest years stay open without being asked. */
	const OPEN_BY_DEFAULT = 2;

	let filter = $state<VaultMedium | 'All'>('All');
	/**
	 * Only years the reader has toggled by hand live here; the rest follow
	 * `OPEN_BY_DEFAULT`, so changing the filter re-derives sensible open state
	 * instead of stranding a year open because of a click on a different list.
	 */
	let toggled = $state<Record<number, boolean>>({});

	const media = ['All', ...VAULT_MEDIA] as const;
	const mediumLabel = (m: (typeof media)[number]) =>
		m === 'All' ? t.filterAll : t.media[m as VaultMedium];

	const visible = $derived(VAULT.filter((it) => filter === 'All' || it.medium === filter));
	const years = $derived([...new Set(visible.map((it) => it.added))].sort((a, b) => b - a));

	/** `made` is usually a year, sometimes a word ('ongoing') — only years take the prefix. */
	const madeLabel = (made: string) => (/^\d/.test(made) ? fill(t.made, { year: made }) : made);
</script>

<svelte:head>
	<title>{t.titleLead} {t.titleAccent} — {site.name}</title>
	<meta name="description" content={t.description} />
	<!-- A private cabinet, reachable but not advertised. -->
	<meta name="robots" content="noindex, follow" />
</svelte:head>

<section class="masthead">
	<div class="row">
		<a class="back" href={href(i18n.lang, '/about')}>{t.backToAbout}</a>
		<Tag>{fill(t.countLabel, { count: VAULT.length })}</Tag>
	</div>
	<Headline
		text="{t.titleLead} {t.titleAccent}."
		accent={t.titleAccent}
		mark="scribble"
		size={84}
		markWidth={240}
	/>
	<p class="deck">{t.description}</p>
</section>

<!-- The brutalist bar, wrapping — there are more kinds than fit one row. -->
<div class="filters">
	{#each media as m, i (m)}
		<button
			type="button"
			class:active={filter === m}
			class:second-row={i >= 4}
			onclick={() => (filter = m)}>{mediumLabel(m)}</button
		>
	{/each}
</div>

{#if years.length === 0}
	<p class="empty">{t.empty}</p>
{/if}

<section class="timeline">
	{#each years as year, yi (year)}
		{@const rows = visible.filter((it) => it.added === year)}
		{@const foldable = yi >= OPEN_BY_DEFAULT}
		{@const open = toggled[year] ?? !foldable}
		<div class="year">
			<!-- The marker sticks while its own entries scroll past it. -->
			<div class="marker">
				<div class="numeral">{year}</div>
				<div class="added"><Tag>{fill(t.addedCount, { count: rows.length })}</Tag></div>
				{#if foldable}
					<button
						type="button"
						class="fold"
						class:on={open}
						aria-expanded={open}
						onclick={() => (toggled[year] = !open)}>{open ? t.collapse : t.expand}</button
					>
				{/if}
			</div>

			<div class="spine">
				{#if open}
					<div class="flow">
						{#each rows as it (it.id)}
							{@const l = getVaultLocale(it, i18n.lang)}
							{@const covers = getVaultCovers(it)}
							{@const meta = it.place || (it.made ? madeLabel(it.made) : null)}
							<div class="cell">
								<div class="entry">
									<!-- The one circle on the site, because a timeline node is
									     not a rectangle. -->
									<span class="node" aria-hidden="true"></span>
									<svelte:element
										this={it.href ? 'a' : 'div'}
										class="entry-inner"
										class:with-plates={covers.length > 0}
										href={it.href}
										target={it.href ? '_blank' : undefined}
										rel={it.href ? 'noopener noreferrer' : undefined}
									>
										{#if covers.length > 0}
											<!-- One plate is a jacket and gets the full width; two or
											     more are a glance at a place or a course and shrink. -->
											<span class="plates">
												{#each covers as src (src)}
													<ResourceCover
														{src}
														title={l.title}
														width={covers.length === 1 ? 76 : 52}
													/>
												{/each}
											</span>
										{/if}
										<span class="body">
											<span class="tags">
												<Tag on>{t.media[it.medium]}</Tag>
												{#if meta}<Tag>{meta}</Tag>{/if}
											</span>
											<span class="title-row">
												<span class="title">{l.title}</span>
												{#if it.href}<span class="arrow" aria-hidden="true">↗</span>{/if}
											</span>
											<span class="by">{l.by}</span>
											<span class="note">“{l.note}”</span>
										</span>
									</svelte:element>
								</div>
							</div>
						{/each}
					</div>
				{:else}
					<button type="button" class="folded" onclick={() => (toggled[year] = true)}
						>{fill(t.collapsed, { count: rows.length })}</button
					>
				{/if}
			</div>
		</div>
	{/each}

	<p class="colophon">{t.colophon}</p>
</section>

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
	.back {
		font-family: var(--mono);
		font-size: 11px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--blue);
	}
	.deck {
		margin: 22px 0 0;
		font-size: 16.5px;
		line-height: 1.55;
		color: var(--muted);
		max-width: 58ch;
	}

	.filters {
		display: flex;
		flex-wrap: wrap;
		border-bottom: 1.5px solid var(--rule-hard);
	}
	.filters button {
		flex: 1 1 25%;
		border: none;
		border-right: 1px solid var(--rule);
		background: none;
		color: var(--ink);
		font-family: var(--mono);
		font-size: 11px;
		letter-spacing: 0.09em;
		text-transform: uppercase;
		padding: 13px 4px;
		cursor: pointer;
	}
	.filters button.second-row {
		border-top: 1px solid var(--rule);
	}
	.filters button:hover {
		background: var(--paper2);
	}
	.filters button.active,
	.filters button.active:hover {
		background: var(--blue);
		color: var(--on-blue);
	}

	.empty {
		padding: 80px 20px;
		text-align: center;
		font-style: italic;
		color: var(--muted);
	}

	.timeline {
		padding: 22px var(--pad-chrome) 60px;
	}
	.year {
		display: grid;
		grid-template-columns: 140px 1fr;
		gap: 30px;
		padding-top: 8px;
	}
	.marker {
		position: sticky;
		top: 80px;
		align-self: start;
		padding-top: 2px;
	}
	.numeral {
		font-family: var(--display);
		font-weight: 700;
		font-size: clamp(32px, 5vw, 46px);
		letter-spacing: -0.03em;
		line-height: 0.9;
		color: var(--blue);
	}
	.added {
		margin-top: 6px;
	}
	.fold {
		margin-top: 10px;
		border: 1.5px solid var(--rule-hard);
		background: none;
		color: var(--ink);
		font-family: var(--mono);
		font-size: 10px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		padding: 6px 10px;
		cursor: pointer;
	}
	.fold.on {
		background: var(--blue);
		border-color: var(--blue);
		color: var(--on-blue);
	}

	.spine {
		position: relative;
		border-left: 1.5px solid var(--rule-hard);
		/* Half a node's width, so a node hung at `left: -11px` straddles the rule
		   rather than sitting beside it. */
		padding: 4px 0 26px 5.5px;
	}
	/**
	 * A dense year reads better as two short columns than one long one — but a
	 * second column of entries needs a second spine, or its nodes hang in the
	 * air marking a line that was never drawn (which is what production does).
	 * `column-rule` draws it, and the 11px gap is not arbitrary: the rule sits
	 * at the centre of the gap, so a gap of exactly one node's width puts it
	 * under the second column's nodes the way the border does under the first.
	 * The visible gutter is 11px plus the 30px each entry already holds clear
	 * for its own spine.
	 */
	.flow {
		column-count: 2;
		column-gap: 11px;
		column-rule: 1.5px solid var(--rule-hard);
	}
	.cell {
		break-inside: avoid;
	}
	.entry {
		position: relative;
		padding: 0 0 22px 30px;
	}
	.node {
		position: absolute;
		left: -11px;
		top: 6px;
		width: 11px;
		height: 11px;
		border-radius: 50%;
		background: var(--paper);
		border: 2px solid var(--blue);
		z-index: 2;
	}
	.entry-inner {
		display: grid;
		gap: 14px;
		align-items: start;
		color: var(--ink);
	}
	.entry-inner.with-plates {
		grid-template-columns: auto 1fr;
	}
	a.entry-inner:hover {
		text-decoration: none;
	}
	.plates {
		display: flex;
		gap: 5px;
		flex-shrink: 0;
	}
	.body {
		min-width: 0;
	}
	.tags {
		display: flex;
		gap: 10px;
		align-items: baseline;
		flex-wrap: wrap;
		margin-bottom: 5px;
	}
	.title-row {
		display: flex;
		align-items: baseline;
		gap: 8px;
	}
	.title {
		font-family: var(--display);
		font-weight: 600;
		font-size: 18px;
		letter-spacing: -0.02em;
		line-height: 1.1;
		text-transform: lowercase;
		transition: color 0.12s ease;
	}
	.entry:hover .title {
		color: var(--blue);
	}
	/* The ↗ only shows up once you are on the entry that carries the link. */
	.arrow {
		font-family: var(--mono);
		font-size: 13px;
		color: var(--blue);
		flex-shrink: 0;
		opacity: 0;
		transition: opacity 0.15s ease;
	}
	.entry:hover .arrow,
	.entry:focus-within .arrow {
		opacity: 1;
	}
	.by {
		display: block;
		font-family: var(--mono);
		font-size: 11px;
		color: var(--muted);
		margin: 3px 0 7px;
	}
	.note {
		display: block;
		font-style: italic;
		font-size: 13.5px;
		line-height: 1.5;
		max-width: 56ch;
	}

	.folded {
		margin-left: 30px;
		border: none;
		background: none;
		color: var(--muted);
		font-style: italic;
		font-size: 14px;
		cursor: pointer;
		padding: 6px 0;
		text-align: left;
	}
	.folded:hover {
		color: var(--blue);
	}

	.colophon {
		margin: 10px 0 0;
		padding-top: 16px;
		border-top: 1.5px solid var(--rule-hard);
		font-family: var(--mono);
		font-size: 11.5px;
		line-height: 1.6;
		color: var(--muted);
	}

	/* Two columns of 13.5px prose is a squeeze before the gutter even goes. */
	@media (max-width: 1000px) {
		.flow {
			column-count: 1;
			column-rule: none;
		}
	}
	@media (max-width: 700px) {
		/* Stacked, a 140px gutter is just dead space. */
		.year {
			grid-template-columns: 1fr;
			gap: 12px;
		}
		.marker {
			position: static;
		}
		.masthead,
		.timeline {
			padding-left: 18px;
			padding-right: 18px;
		}
	}
</style>
