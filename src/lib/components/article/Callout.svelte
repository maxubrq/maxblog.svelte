<script lang="ts">
	// A plain 1.5px box with a Tag header line. Never a left-accent card (§7, §9).
	import type { Snippet } from 'svelte';
	import Tag from '../ink/Tag.svelte';

	let { label = 'Note', note = '', children }: { label?: string; note?: string; children: Snippet } =
		$props();
</script>

<div class="callout">
	<div class="head">
		<Tag on>{label}</Tag>
		{#if note}<Tag>{note}</Tag>{/if}
	</div>
	<div class="body">{@render children()}</div>
</div>

<style>
	.callout {
		border: 1.5px solid var(--rule-hard);
		margin: 0 0 34px;
	}
	.head {
		display: flex;
		justify-content: space-between;
		gap: 16px;
		padding: 10px 16px;
		border-bottom: 1px solid var(--rule);
	}
	.body {
		padding: 18px 16px 20px;
		font-family: var(--body);
		font-size: 16px;
		line-height: 1.6;
	}
	.body :global(> :first-child) {
		margin-top: 0;
	}
	.body :global(> :last-child) {
		margin-bottom: 0;
	}
</style>
