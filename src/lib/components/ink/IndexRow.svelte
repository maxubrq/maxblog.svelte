<script lang="ts">
	// One archive/index row: grid, hairline top-border, hover flips to blue (§3, §8).
	import Tag from './Tag.svelte';

	let {
		href,
		lead,
		topic,
		title,
		meta,
		interactive = false,
		leadWidth = '48px'
	}: {
		href: string;
		lead: string;
		topic: string;
		title: string;
		meta: string;
		interactive?: boolean;
		leadWidth?: string;
	} = $props();
</script>

<a {href} class="row" style="--lead-w: {leadWidth}">
	<span class="lead">{lead}</span>
	<Tag>{topic}</Tag>
	<span class="title"
		>{title}{#if interactive}<span class="dot" title="interactive"> ●</span>{/if}</span
	>
	<span class="meta">{meta}</span>
</a>

<style>
	.row {
		display: grid;
		grid-template-columns: var(--lead-w) 118px 1fr auto;
		align-items: baseline;
		gap: 20px;
		padding: 15px 0;
		border-top: 1px solid var(--rule);
		color: var(--ink);
		text-decoration: none;
	}
	.row:hover {
		color: var(--blue);
		text-decoration: none;
	}
	.lead {
		font-family: var(--mono);
		font-size: 12.5px;
		color: var(--faint);
	}
	.row:hover .lead,
	.row:hover .meta {
		color: inherit;
	}
	.title {
		font-family: var(--display);
		font-size: 21px;
		font-weight: 500;
		letter-spacing: -0.02em;
		line-height: 1.15;
	}
	.dot {
		color: var(--blue);
		font-size: 13px;
	}
	.meta {
		font-family: var(--mono);
		font-size: 11px;
		color: var(--muted);
		white-space: nowrap;
	}
	@media (max-width: 780px) {
		.row {
			grid-template-columns: 1fr auto;
			gap: 4px 14px;
			padding: 14px 0;
		}
		.lead {
			grid-row: 1;
		}
		.title {
			grid-column: 1 / -1;
			font-size: 19px;
		}
	}
</style>
