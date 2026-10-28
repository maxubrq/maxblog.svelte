<script lang="ts">
	// The label — 13px text face, sentence case, muted (DESIGN.md §3.2). `on`
	// turns it blue, which is reserved for a label that is also a signal.
	import type { Snippet } from 'svelte';

	let {
		on = false,
		wrap = false,
		children,
		...rest
	}: {
		on?: boolean;
		/**
		 * Kept for callers that pass it; a label may break anywhere now. At 13px
		 * a nowrap label is wide enough to run a phone sideways (DESIGN.md D14),
		 * so `wrap` only adds the looser leading a sentence-long caption wants.
		 */
		wrap?: boolean;
		children: Snippet;
		[key: string]: unknown;
	} = $props();
</script>

<span class="tag" class:on class:wrap {...rest}>{@render children()}</span>

<style>
	.tag {
		font-family: var(--body);
		font-size: var(--t-meta);
		color: var(--muted);
		overflow-wrap: anywhere;
	}
	.on {
		color: var(--blue);
	}
	.wrap {
		line-height: 1.85;
	}
</style>
