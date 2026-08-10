<script lang="ts">
	// The MONO uppercase micro-label — the workhorse of the theme (§7).
	import type { Snippet } from 'svelte';

	let {
		on = false,
		children,
		...rest
	}: { on?: boolean; children: Snippet; [key: string]: unknown } = $props();
</script>

<span class="tag" class:on {...rest}>{@render children()}</span>

<style>
	.tag {
		font-family: var(--mono);
		font-size: 10.5px;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--muted);
		white-space: nowrap;
	}
	.on {
		color: var(--blue);
	}
</style>
