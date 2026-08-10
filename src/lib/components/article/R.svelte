<script lang="ts">
	/**
	 * Inline citation mark — `<R id="ieee-754" />`.
	 *
	 * Usually placed by `remark-resources.js` rather than by hand, on the first
	 * mention of a source's title or its author's surname. Writing one manually
	 * is still allowed, and always wins over the automatic pass.
	 *
	 * The numeral is the source's position in *this post's* bibliography **in
	 * reading order**, which is where this differs from the production blog:
	 * there the number is the position in the curated list, so an essay can open
	 * with `[02]`. Both the numeral and the end-of-essay list order themselves
	 * with `bibliographyFor`, off the `citations` the remark pass recorded.
	 *
	 * Production threads the post slug through a React context; here the route
	 * already knows it — an article lives at `/[lang]/writing/[slug]`.
	 */
	import { page } from '$app/state';
	import ResourceCover from '$lib/components/ink/ResourceCover.svelte';
	import { href, useI18n } from '$lib/i18n';
	import { RESOURCES_BY_ID, bibliographyFor, getResourceNote } from '$lib/resources';
	import type { Snippet } from 'svelte';

	let { id, children }: { id: string; children?: Snippet } = $props();

	const i18n = useI18n();
	const t = $derived(i18n.t.resources);

	const resource = $derived(RESOURCES_BY_ID[id]);

	/**
	 * Position in this post's bibliography, 1-based, in reading order — the
	 * order comes from `meta.citations`, which the remark pass recorded while
	 * walking the prose. Zero when the source does not list this post in
	 * `appearsIn`: the mark still opens, it just has no number to show, which
	 * beats printing one that means nothing.
	 */
	const number = $derived.by(() => {
		const slug = page.params.slug;
		if (!slug || !resource) return 0;
		const citations = page.data?.meta?.citations as string[] | undefined;
		return bibliographyFor(slug, citations).findIndex((r) => r.id === id) + 1;
	});

	let open = $state(false);
</script>

{#if resource}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<span class="wrap" onmouseenter={() => (open = true)} onmouseleave={() => (open = false)}>
		<button type="button" class="mark" aria-expanded={open} onclick={() => (open = !open)}>
			{#if children}{@render children()}{/if}<span class="numeral"
				>[{number > 0 ? String(number).padStart(2, '0') : '·'}]</span
			>
		</button>

		{#if open}
			<span class="pop" role="tooltip">
				<span class="kind">{t.sourceTag}</span>
				<span class="head">
					<span class="title">{resource.title}</span>
					<ResourceCover src={resource.coverImage} title={resource.title} width={44} />
				</span>
				<span class="meta"
					>{resource.author}{resource.year ? ` · ${resource.year}` : ''}</span
				>
				<span class="note">{getResourceNote(resource, i18n.lang)}</span>
				<span class="foot">
					{#if resource.url}
						<a href={resource.url} target="_blank" rel="noopener noreferrer">{t.openLink}</a>
					{:else}
						<span></span>
					{/if}
					<a href={href(i18n.lang, '/resources')}>{t.fullEntry}</a>
				</span>
			</span>
		{/if}
	</span>
{:else if children}
	{@render children()}
{/if}

<style>
	.wrap {
		position: relative;
	}
	.mark {
		background: none;
		border: none;
		padding: 0;
		font: inherit;
		color: inherit;
		cursor: help;
	}
	.numeral {
		font-family: var(--mono);
		font-size: 0.62em;
		vertical-align: super;
		color: var(--blue);
		margin: 0 1px;
	}
	.mark:hover .numeral {
		text-decoration: underline;
	}
	.pop {
		position: absolute;
		left: 0;
		top: 150%;
		z-index: 20;
		width: 300px;
		display: block;
		border: 1.5px solid var(--rule-hard);
		background: var(--paper);
		padding: 14px 16px;
		box-shadow: 0 10px 30px rgba(13, 13, 17, 0.16);
		text-align: left;
	}
	.kind {
		font-family: var(--mono);
		font-size: 10px;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--blue);
	}
	.head {
		display: flex;
		gap: 12px;
		align-items: flex-start;
		margin: 6px 0;
	}
	.title {
		flex: 1;
		min-width: 0;
		font-family: var(--display);
		font-weight: 700;
		font-size: 17px;
		letter-spacing: -0.02em;
		line-height: 1.15;
	}
	.meta {
		display: block;
		font-family: var(--mono);
		font-size: 10px;
		letter-spacing: 0.06em;
		color: var(--muted);
	}
	.note {
		display: block;
		font-family: var(--body);
		font-size: 12.5px;
		line-height: 1.5;
		color: var(--ink);
		margin-top: 8px;
	}
	.foot {
		display: flex;
		justify-content: space-between;
		gap: 12px;
		border-top: 1px solid var(--rule);
		margin-top: 10px;
		padding-top: 8px;
	}
	.foot a {
		font-family: var(--mono);
		font-size: 10px;
		letter-spacing: 0.06em;
		color: var(--blue);
	}
</style>
