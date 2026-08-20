<script lang="ts">
	// The MONO uppercase micro-label — the workhorse of the theme (§7).
	import type { Snippet } from 'svelte';

	let {
		on = false,
		wrap = false,
		children,
		...rest
	}: {
		on?: boolean;
		/**
		 * A tag is a micro-label and never breaks — except in a caption slot,
		 * where the "tag" is a whole sentence and nowrap would run it out past
		 * the plate's border.
		 */
		wrap?: boolean;
		children: Snippet;
		[key: string]: unknown;
	} = $props();
</script>

<span class="tag" class:on class:wrap {...rest}>{@render children()}</span>

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
	.wrap {
		white-space: normal;
		line-height: 1.85;
	}
</style>
