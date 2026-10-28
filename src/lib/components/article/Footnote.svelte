<script lang="ts">
	// Inline footnote: a blue superscript number that discloses in place.
	// Hard cut, bounded by a 2px blue top rule — no fade (§8).
	import type { Snippet } from 'svelte';

	let { n, children }: { n: number | string; children: Snippet } = $props();

	let open = $state(false);
</script>

<button
	type="button"
	class="ref"
	aria-expanded={open}
	aria-label="footnote {n}"
	onclick={() => (open = !open)}>{n}</button
>
{#if open}
	<span class="note"><span class="num">{n}</span>{@render children()}</span>
{/if}

<style>
	.ref {
		background: none;
		border: none;
		padding: 0 1px;
		font-family: var(--body);
		font-size: 0.7em;
		vertical-align: super;
		color: var(--blue);
		cursor: pointer;
	}
	.note {
		display: block;
		border-top: 2px solid var(--blue);
		margin: 14px 0 20px;
		padding-top: 10px;
		font-family: var(--body);
		font-size: var(--t-meta);
		line-height: 1.55;
		color: var(--muted);
	}
	.num {
		font-family: var(--body);
		font-size: var(--t-meta);
		color: var(--blue);
		margin-right: 8px;
	}
</style>
