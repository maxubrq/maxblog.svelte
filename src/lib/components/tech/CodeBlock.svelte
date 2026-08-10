<script lang="ts">
	// The code plate (§7): bordered, header row `file` vs `lang`, optional caption.
	// Wrap a fenced block: <CodeBlock filename="x.ts" language="ts"> ```ts … ``` </CodeBlock>
	import type { Snippet } from 'svelte';
	import Tag from '../ink/Tag.svelte';

	let {
		filename = '',
		language = '',
		caption = '',
		children
	}: { filename?: string; language?: string; caption?: string; children: Snippet } = $props();
</script>

<div class="plate">
	{#if filename || language}
		<div class="head">
			<Tag>{filename}</Tag>
			<Tag on>{language}</Tag>
		</div>
	{/if}
	<div class="code">{@render children()}</div>
	{#if caption}
		<div class="caption"><Tag>{caption}</Tag></div>
	{/if}
</div>

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
	.code {
		overflow-x: auto;
	}
	.code :global(pre) {
		margin: 0;
		padding: 16px 14px;
		font-family: var(--mono);
		font-size: 12.5px;
		line-height: 1.66;
		background: transparent;
		color: var(--ink);
	}
	.caption {
		padding: 9px 14px;
		border-top: 1px solid var(--rule);
	}
</style>
