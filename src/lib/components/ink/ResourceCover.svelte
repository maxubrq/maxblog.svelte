<script lang="ts">
	/**
	 * Cover art for a resource — a rectangle with a hard rule around it, like
	 * every other frame on the site. Renders nothing when `src` is unset, which
	 * is the normal case: most entries are papers with no jacket, and a wrong
	 * cover is worse than none.
	 *
	 * The box is a fixed 2:3 crop so a shelf of mixed sources (jackets, PDF
	 * first pages, talk stills) still lines up; `object-fit: cover` trims.
	 * Cloudinary URLs go through the same transform pipeline as every other
	 * image on the site — asked for at 2× the box, because it is small.
	 */
	import { cloudinary, srcsetFor } from '$lib/images';

	let {
		src = '',
		/** Alt text — the resource title, never a description of the artwork. */
		title,
		/** Box width in px; height follows the 2:3 book-jacket ratio. */
		width = 68
	}: { src?: string; title: string; width?: number } = $props();

	const height = $derived(Math.round((width * 3) / 2));
	const url = $derived(cloudinary(src, { width: width * 2 }));
	const srcset = $derived(srcsetFor(src, { widths: [width, width * 2, width * 3] }));
</script>

{#if src}
	<span class="cover" style="width:{width}px; height:{height}px">
		<img src={url} {srcset} sizes="{width}px" alt={title} loading="lazy" decoding="async" />
	</span>
{/if}

<style>
	.cover {
		display: block;
		position: relative;
		flex-shrink: 0;
		border: 1.5px solid var(--rule-hard);
		background: var(--paper2);
		overflow: hidden;
	}
	img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
</style>
