<script lang="ts">
	/**
	 * Where this essay sits in its arc, at the head of the piece.
	 *
	 * An essay in a series has a debt the tag row cannot state: there is
	 * something before it, and something after. The ribbon is the smallest
	 * honest form of that — the arc's name, this chapter's position, and the way
	 * back to the whole. The shape of the arc itself belongs on `/series/[id]`,
	 * not stacked on top of the prose.
	 *
	 * Renders nothing when the post is not in an arc, which is every post today.
	 */
	import Tag from '$lib/components/ink/Tag.svelte';
	import { fill, href, useI18n } from '$lib/i18n';
	import { getSeriesForPost, getSeriesLocale } from '$lib/series';

	let { slug }: { slug: string } = $props();

	const i18n = useI18n();
	const t = $derived(i18n.t.series);

	const found = $derived(getSeriesForPost(slug));
	const local = $derived(found ? getSeriesLocale(found.series, i18n.lang) : null);
</script>

{#if found && local}
	<a class="ribbon" href={href(i18n.lang, `/series/${found.series.id}`)}>
		<span class="left">
			<Tag on>{t.label}</Tag>
			<span class="title">{local.title}</span>
		</span>
		<span class="right">
			<Tag
				>{fill(t.movementOf, {
					n: found.index + 1,
					total:
						found.series.chapterCount === 'open-ended' ? '—' : String(found.series.chapterCount)
				})}</Tag
			>
			<span class="arrow" aria-hidden="true">→</span>
		</span>
	</a>
{/if}

<style>
	.ribbon {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		flex-wrap: wrap;
		padding: 10px 0 11px;
		margin: 0 0 24px;
		border-top: 1.5px solid var(--rule-hard);
		border-bottom: 1px solid var(--rule);
		color: var(--ink);
	}
	.ribbon:hover {
		text-decoration: none;
	}
	.left,
	.right {
		display: flex;
		align-items: center;
		gap: 12px;
		min-width: 0;
	}
	.title {
		font-family: var(--display);
		font-weight: 600;
		font-size: 15px;
		letter-spacing: -0.02em;
		text-transform: lowercase;
	}
	.ribbon:hover .title {
		color: var(--blue);
	}
	.arrow {
		font-family: var(--mono);
		font-size: 12px;
		color: var(--blue);
	}
</style>
