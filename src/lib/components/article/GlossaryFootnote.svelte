<script lang="ts">
	/**
	 * The words this essay marked, gathered at its foot — the glossary's twin of
	 * `Bibliography`, and built the opposite way round.
	 *
	 * A source belongs to a post by declaration: `appearsIn` names it, so the
	 * bibliography is a lookup and prints even for an essay whose prose carries
	 * no marks. A term belongs to a post only by *use* — it is here because the
	 * remark pass found the word in this prose and marked it. So the list comes
	 * from `terms`, the ids that pass recorded in reading order, and an essay
	 * that marks nothing shows nothing.
	 *
	 * Production collects the terms as they render: `GlossaryFootnote` wraps the
	 * whole article and hands a `collect(id)` down a context that every `Term`
	 * calls on mount, so the list is state that fills in as React commits. Here
	 * the pass already knows what it marked before a byte reaches the browser,
	 * so this component holds no state, wraps nothing, and renders on the server
	 * complete.
	 *
	 * The reader has met each of these once already, inline, and dismissed the
	 * card to keep reading. This is the second chance: the same short gloss, all
	 * of them together, at the point where the essay is over and there is room
	 * to look. Never the long gloss — that is what `/glossary` is for, and each
	 * row goes there, to its own letter.
	 */
	import Tag from '$lib/components/ink/Tag.svelte';
	import { TERMS, getGlossaryLocale } from '$lib/glossary';
	import { href, useI18n } from '$lib/i18n';

	let { terms }: { terms?: string[] } = $props();

	const i18n = useI18n();
	const t = $derived(i18n.t.glossary);

	/**
	 * A–Z, like production and like `/glossary` itself — not the reading order
	 * `terms` arrives in. The bibliography beneath this one *is* in reading
	 * order, and the difference is not an inconsistency: a citation carries a
	 * numeral, so its position means something and the prose can point at it. A
	 * word carries no numeral. Six unnumbered rows in the order they happened to
	 * come up read as no order at all, and a list of words has an order everyone
	 * already knows. The reading order is kept in the metadata regardless, since
	 * it is what the pass actually observed.
	 *
	 * An id the dictionary no longer carries is dropped rather than printed
	 * empty: the prose it came from is still true, the entry simply moved on.
	 */
	const list = $derived(
		(terms ?? [])
			.filter((id) => TERMS[id])
			.map((id) => ({ id, ...getGlossaryLocale(TERMS[id], i18n.lang) }))
			.sort((a, b) => a.term.localeCompare(b.term, i18n.lang))
	);

	/** `/glossary` anchors by letter, not by entry — that is where a word lives. */
	const letterHref = (term: string) =>
		href(i18n.lang, `/glossary#gl-${term[0]?.toUpperCase() ?? ''}`);
</script>

{#if list.length > 0}
	<section class="terms">
		<div class="head">
			<h3><Tag on>{t.postHeading}</Tag></h3>
			<Tag>{t.postSubhead}</Tag>
		</div>

		<dl>
			{#each list as entry (entry.id)}
				<div class="row">
					<dt>
						<a href={letterHref(entry.term)}>{entry.term}</a>
						<span class="pos">{entry.pos}</span>
					</dt>
					<dd>{entry.short}</dd>
				</div>
			{/each}
		</dl>

		<div class="all">
			{t.fullGlossaryPre}
			<a href={href(i18n.lang, '/glossary')}>{t.fullGlossaryLink}</a>
		</div>
	</section>
{/if}

<style>
	/* One rule lighter than the bibliography's: the sources are the essay's
	   evidence, the words are only its vocabulary. */
	.terms {
		margin-top: 3em;
		padding-top: 20px;
		border-top: 1px solid var(--rule-hard);
	}
	.head {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 12px;
		flex-wrap: wrap;
		margin-bottom: 18px;
	}
	h3 {
		margin: 0;
	}

	dl {
		margin: 0;
	}
	.row {
		display: grid;
		/* Wide enough for the longest part-of-speech line the dictionary prints
		   ("adjective · computer arithmetic") — a wrapped `pos` reads as a second
		   fact rather than as the tail of the first. */
		grid-template-columns: 232px 1fr;
		gap: 14px;
		padding: 14px 0;
		border-top: 1px solid var(--rule);
	}
	.row:first-child {
		border-top: none;
	}

	dt {
		min-width: 0;
	}
	dt a {
		font-family: var(--display);
		font-weight: 700;
		font-size: 17px;
		letter-spacing: -0.02em;
		line-height: 1.2;
		/* The dotted rule of the inline mark, so the foot and the sentence are
		   visibly the same object. */
		border-bottom: 2px dotted var(--blue);
		color: var(--blue);
	}
	dt a:hover {
		text-decoration: none;
		border-bottom-style: solid;
	}
	.pos {
		display: block;
		font-family: var(--mono);
		font-size: 11px;
		letter-spacing: 0.06em;
		color: var(--muted);
		margin-top: 7px;
	}

	dd {
		margin: 0;
		font-size: 13.5px;
		line-height: 1.55;
		color: var(--muted);
		max-width: 64ch;
	}

	.all {
		margin-top: 18px;
		padding-top: 12px;
		border-top: 1px solid var(--rule);
		text-align: center;
		font-family: var(--mono);
		font-size: 10.5px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--muted);
	}
	.all a {
		border-bottom: 1px solid var(--blue);
	}

	@media (max-width: 860px) {
		.row {
			grid-template-columns: 1fr;
			gap: 6px;
		}
	}
</style>
