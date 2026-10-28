<script lang="ts">
	// One archive row (DESIGN.md §7.1): date · title · topic and minutes. A
	// hairline above; hover turns the title blue. No ordinal — the newest essay
	// is not "01 of" anything.
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
	<span class="title">{title}{#if interactive}<span class="dot" title="interactive"></span>{/if}</span>
	<span class="meta">{[topic, meta].filter(Boolean).join(' · ')}</span>
</a>

<style>
	.row {
		display: grid;
		grid-template-columns: var(--lead-w) 1fr auto;
		align-items: baseline;
		gap: var(--s-2);
		padding: var(--s-2) 0;
		border-top: 1px solid var(--rule);
		color: var(--ink);
		text-decoration: none;
	}
	.row:hover {
		text-decoration: none;
	}
	.row:hover .title {
		color: var(--blue);
	}
	.lead,
	.meta {
		font-size: var(--t-meta);
		color: var(--muted);
		font-variant-numeric: tabular-nums;
		white-space: nowrap;
	}
	.title {
		font-size: var(--t-body);
		font-weight: 600;
		line-height: 1.3;
	}
	/* The interactive mark: a 6px dot drawn, not typed — the text face has no ● */
	.dot {
		display: inline-block;
		width: 6px;
		height: 6px;
		margin-left: 8px;
		vertical-align: middle;
		background: var(--blue);
		border-radius: 50%;
	}
	@media (max-width: 780px) {
		.row {
			grid-template-columns: 1fr auto;
			gap: 4px var(--s-2);
		}
		.title {
			grid-column: 1 / -1;
			grid-row: 2;
		}
	}
</style>
