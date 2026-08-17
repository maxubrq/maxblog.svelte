<script lang="ts">
	/**
	 * The frame both players stand in — the same plate `DiagramPlate` is, so a
	 * video reads as one more figure in the essay rather than as an embed dropped
	 * into it: 1.5px border, MONO head, hairline rules, one blue.
	 *
	 * `.interactive-plate` carries the spacing, which is the reader's `framing`
	 * setting in `app.css`. That is why nothing here sets a margin — a scoped
	 * rule would outrank the setting and quietly disable it.
	 */
	import Tag from '$lib/components/ink/Tag.svelte';
	import type { Snippet } from 'svelte';

	let {
		label,
		hint = '',
		ratio = '16 / 9',
		caption = '',
		foot,
		children
	}: {
		label: string;
		hint?: string;
		/** The box the video sits in. A plate never reflows while it loads. */
		ratio?: string;
		caption?: string;
		/** The controls row, inside the plate so it shares its border. */
		foot?: Snippet;
		children: Snippet;
	} = $props();
</script>

<figure class="plate interactive-plate">
	<div class="head">
		<Tag on>{label}</Tag>
		{#if hint}<Tag>{hint}</Tag>{/if}
	</div>
	<div class="stage" style="aspect-ratio: {ratio}">
		{@render children()}
	</div>
	{#if foot}
		<div class="foot">{@render foot()}</div>
	{/if}
	{#if caption}
		<figcaption><Tag>{caption}</Tag></figcaption>
	{/if}
</figure>

<style>
	.plate {
		border: 1.5px solid var(--rule-hard);
	}
	.head {
		display: flex;
		justify-content: space-between;
		gap: 16px;
		padding: 10px 14px;
		border-bottom: 1px solid var(--rule);
	}
	/* The video, its poster and its facade all fill this box, so the plate is
	   the same height before and after anything loads. */
	.stage {
		position: relative;
		width: 100%;
		background: var(--paper2);
		overflow: hidden;
	}
	.foot {
		border-top: 1px solid var(--rule);
	}
	figcaption {
		padding: 9px 14px;
		border-top: 1px solid var(--rule);
	}
</style>
