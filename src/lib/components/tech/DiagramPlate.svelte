<script lang="ts">
	// A bordered frame for an austere diagram or a live figure (§7).
	// Chrome stays chrome: MONO labels, hairline rules, blue only for the live dot.
	import type { Snippet } from 'svelte';
	import Tag from '../ink/Tag.svelte';

	let {
		label = 'Figure',
		hint = '',
		live = false,
		caption = '',
		children
	}: {
		label?: string;
		hint?: string;
		live?: boolean;
		caption?: string;
		children?: Snippet;
	} = $props();
</script>

<figure class="plate">
	<div class="head">
		<Tag on={live}>{live ? `● ${label}` : label}</Tag>
		{#if hint}<Tag>{hint}</Tag>{/if}
	</div>
	<div class="body">
		{#if children}
			{@render children()}
		{:else}
			<div class="ink-hatch stub"><span>interactive canvas</span></div>
		{/if}
	</div>
	{#if caption}
		<figcaption><Tag>{caption}</Tag></figcaption>
	{/if}
</figure>

<style>
	.plate {
		border: 1.5px solid var(--rule-hard);
		margin: 0 0 34px;
	}
	.head {
		display: flex;
		justify-content: space-between;
		gap: 16px;
		padding: 10px 14px;
		border-bottom: 1px solid var(--rule);
	}
	.body {
		overflow-x: auto;
	}
	.stub {
		height: 210px;
		position: relative;
		opacity: 0.5;
	}
	.stub span {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: var(--mono);
		font-size: 11px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--blue);
		background: color-mix(in srgb, var(--paper) 72%, transparent);
	}
	figcaption {
		padding: 9px 14px;
		border-top: 1px solid var(--rule);
	}
</style>
