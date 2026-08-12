<script lang="ts">
	// Renders one parsed rich message (see `rich.ts`). Recursive, because a
	// message may put a <sup> inside a <m>.
	import Rich from './Rich.svelte';
	import type { RichNode } from './rich';

	let { nodes }: { nodes: RichNode[] } = $props();
</script>

{#each nodes as node, i (i)}
	{#if typeof node === 'string'}{node}
	{:else if node.tag === 'b'}<strong><Rich nodes={node.children} /></strong>
	{:else if node.tag === 'i'}<em><Rich nodes={node.children} /></em>
	{:else if node.tag === 'sup'}<sup><Rich nodes={node.children} /></sup>
	{:else}<span
			class="mono"
			class:sign={node.tag === 'ms'}
			class:exp={node.tag === 'me'}
			class:mant={node.tag === 'mm'}><Rich nodes={node.children} /></span
		>{/if}
{/each}

<style>
	.mono {
		font-family: var(--mono);
		font-size: 0.9em;
		color: var(--ink);
	}
	/* The three fields keep their colour wherever they are named — the strip,
	   the panels and the prose all point at the same thing (§11: the viz palette
	   is the sanctioned exception, and these are plotted bits). */
	.sign {
		color: var(--viz-red);
	}
	.exp {
		color: var(--viz-gold);
	}
	.mant {
		color: var(--blue);
		word-break: break-all;
	}
	sup {
		font-size: 0.75em;
	}
</style>
