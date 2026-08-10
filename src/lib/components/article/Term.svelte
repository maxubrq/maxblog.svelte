<script lang="ts">
	// Inline dotted-blue glossary term; hover AND click open a bordered popover.
	// The only element besides print sheets allowed a drop-shadow (§7, §8).
	import type { Snippet } from 'svelte';

	let {
		term,
		kind = 'term',
		def,
		count = 0,
		href = '',
		children
	}: {
		term: string;
		kind?: string;
		def: string;
		count?: number;
		href?: string;
		children?: Snippet;
	} = $props();

	let open = $state(false);
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<span
	class="wrap"
	onmouseenter={() => (open = true)}
	onmouseleave={() => (open = false)}
>
	<button type="button" class="mark" aria-expanded={open} onclick={() => (open = !open)}>
		{#if children}{@render children()}{:else}{term}{/if}
	</button>
	{#if open}
		<span class="pop" role="tooltip">
			<span class="kind">{kind}</span>
			<span class="term">{term}</span>
			<span class="def">{def}</span>
			<span class="foot">
				<span class="count">appears in {count} essays</span>
				{#if href}<a {href}>full entry →</a>{/if}
			</span>
		</span>
	{/if}
</span>

<style>
	.wrap {
		position: relative;
	}
	.mark {
		background: none;
		border: none;
		padding: 0;
		font: inherit;
		color: var(--blue);
		font-weight: 500;
		border-bottom: 2px dotted var(--blue);
		cursor: help;
	}
	.pop {
		position: absolute;
		left: 0;
		top: 135%;
		z-index: 20;
		width: 290px;
		display: block;
		border: 1.5px solid var(--rule-hard);
		background: var(--paper);
		padding: 14px 16px;
		box-shadow: 0 10px 30px rgba(13, 13, 17, 0.16);
	}
	.kind {
		font-family: var(--mono);
		font-size: 10px;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--blue);
	}
	.term {
		font-family: var(--display);
		font-weight: 700;
		font-size: 18px;
		letter-spacing: -0.02em;
		text-transform: lowercase;
		display: block;
		margin: 5px 0 7px;
	}
	.def {
		font-family: var(--body);
		font-size: 13px;
		line-height: 1.5;
		color: var(--ink);
		display: block;
	}
	.foot {
		display: flex;
		justify-content: space-between;
		border-top: 1px solid var(--rule);
		margin-top: 10px;
		padding-top: 8px;
	}
	.count,
	.foot a {
		font-family: var(--mono);
		font-size: 10px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--muted);
	}
	.foot a {
		color: var(--blue);
		text-transform: none;
	}
</style>
