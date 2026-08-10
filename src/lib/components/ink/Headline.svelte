<script lang="ts">
	// A headline with exactly one word in blue, optionally lassoed by a
	// hand-drawn mark (§2, §5). `accent` must occur in `text`.
	import Scribble from './Scribble.svelte';
	import Underline from './Underline.svelte';

	let {
		text,
		accent = '',
		mark = 'none',
		as = 'h1',
		size = 60,
		lowercase = true,
		markWidth = 240
	}: {
		text: string;
		accent?: string;
		mark?: 'none' | 'scribble' | 'underline';
		as?: 'h1' | 'h2' | 'h3';
		size?: number;
		lowercase?: boolean;
		markWidth?: number;
	} = $props();

	// [before, accent, after] — falls back to the whole string when there's no accent.
	const parts = $derived.by(() => {
		if (!accent) return [text, '', ''];
		const at = text.toLowerCase().indexOf(accent.toLowerCase());
		if (at < 0) return [text, '', ''];
		return [text.slice(0, at), text.slice(at, at + accent.length), text.slice(at + accent.length)];
	});
</script>

<svelte:element
	this={as}
	class="headline"
	class:lower={lowercase}
	style="--size: {size}px"
>
	{parts[0]}{#if parts[1]}<span class="accent"
			>{parts[1]}{#if mark === 'scribble'}<Scribble w={markWidth} h={(markWidth * 130) / 360} left={-20} top={-18} />{:else if mark === 'underline'}<Underline
					w={markWidth}
					left={2}
					bottom={-10}
				/>{/if}</span
		>{/if}{parts[2]}
</svelte:element>

<style>
	.headline {
		font-family: var(--display);
		font-weight: 700;
		font-size: var(--size);
		line-height: 0.95;
		letter-spacing: -0.045em;
		margin: 0;
		text-wrap: balance;
	}
	.lower {
		text-transform: lowercase;
	}
	.accent {
		position: relative;
		color: var(--blue);
	}
	@media (max-width: 780px) {
		.headline {
			font-size: clamp(34px, 9vw, var(--size));
		}
	}
</style>
