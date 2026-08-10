<script lang="ts">
	/**
	 * The per-post bibliography, at the foot of an essay.
	 *
	 * It needs no authoring pass and no collection pass: `appearsIn` in
	 * `$lib/resources` already maps every source to the posts that cite it, so
	 * a post's sources are a lookup. This is why an essay shows its sources
	 * even when its prose carries no `<R>` marks at all.
	 *
	 * The order is reading order: `citations` is the list of `<R>` ids the remark
	 * pass recorded while walking the prose. Sources cited in `appearsIn` but
	 * never named in the text follow, in the curated order. `<R>` numbers off the
	 * same `bibliographyFor`, so a numeral cannot disagree with the list under
	 * it. Each entry carries `id="res-<id>"`, which is what a mark links to.
	 */
	import ResourceCover from '$lib/components/ink/ResourceCover.svelte';
	import Tag from '$lib/components/ink/Tag.svelte';
	import { pad } from '$lib/format';
	import { href, useI18n } from '$lib/i18n';
	import { bibliographyFor, getResourceNote } from '$lib/resources';

	let { slug, citations }: { slug: string; citations?: string[] } = $props();

	const i18n = useI18n();
	const t = $derived(i18n.t.resources);
	const list = $derived(bibliographyFor(slug, citations));
</script>

{#if list.length > 0}
	<section class="sources">
		<div class="head">
			<h3><Tag on>{t.postHeading}</Tag></h3>
			<Tag>{t.postSubhead}</Tag>
		</div>

		<ol>
			{#each list as r, i (r.id)}
				<li id="res-{r.id}" class:with-cover={r.coverImage}>
					<span class="num">{pad(i + 1)}</span>
					<div class="body">
						<div class="title-row">
							<span class="title">
								{#if r.url}
									<a href={r.url} target="_blank" rel="noopener noreferrer">{r.title}</a>
								{:else}
									{r.title}
								{/if}
							</span>
							<Tag>{t.types[r.type]}</Tag>
						</div>

						{#if r.author || r.year}
							<div class="meta">{r.author}{r.year ? ` · ${r.year}` : ''}</div>
						{/if}

						<p class="note">{getResourceNote(r, i18n.lang)}</p>
					</div>
					<ResourceCover src={r.coverImage} title={r.title} width={56} />
				</li>
			{/each}
		</ol>

		<div class="all">
			{t.fullResourcesPre}
			<a href={href(i18n.lang, '/resources')}>{t.fullResourcesLink}</a>
		</div>
	</section>
{/if}

<style>
	.sources {
		margin-top: 3em;
		padding-top: 20px;
		border-top: 1.5px solid var(--rule-hard);
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

	ol {
		margin: 0;
		padding: 0;
		list-style: none;
	}
	li {
		display: grid;
		grid-template-columns: 28px 1fr;
		gap: 14px;
		padding: 16px 0;
		border-top: 1px solid var(--rule);
		/* An inline mark links here; clear the sticky header when it lands. */
		scroll-margin-top: 90px;
	}
	li.with-cover {
		grid-template-columns: 28px 1fr 56px;
	}
	li:first-child {
		border-top: none;
	}

	.num {
		font-family: var(--mono);
		font-size: 12px;
		color: var(--blue);
		padding-top: 3px;
	}
	.body {
		min-width: 0;
	}
	.title-row {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 12px;
		flex-wrap: wrap;
	}
	.title {
		font-family: var(--display);
		font-weight: 700;
		font-size: 17px;
		letter-spacing: -0.02em;
		line-height: 1.2;
	}
	.title a {
		color: inherit;
		border-bottom: 2px solid var(--blue);
	}
	.title a:hover {
		color: var(--blue);
		text-decoration: none;
	}
	.meta {
		font-family: var(--mono);
		font-size: 11px;
		letter-spacing: 0.06em;
		color: var(--muted);
		margin-top: 7px;
	}
	.note {
		margin: 8px 0 0;
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
		li.with-cover {
			grid-template-columns: 28px 1fr;
		}
	}
</style>
