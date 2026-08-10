<script lang="ts">
	// Cyanotype plate (§6). No full-colour photography anywhere on the site.
	//
	// `src` is a Cloudinary delivery URL for anything that comes from the media
	// library; the responsive transformations are added here (see $lib/images),
	// so an author only ever writes the plain delivery URL. A local plate — a
	// halftone in /media — passes through with no srcset.
	import { cloudinary, srcsetFor, type Halftone } from '$lib/images';

	let {
		src = '',
		alt = '',
		ratio = '3 / 2',
		caption = '',
		placeholder = 'cyanotype plate',
		/** How wide the plate renders — the browser picks a width from this. */
		sizes = '100vw',
		/** Above the fold (a cover plate) — skip lazy loading. */
		priority = false,
		/**
		 * Screen the plate to 1-bit dots at the CDN instead of duotoning it —
		 * the other half of §2/§6. Drops the blue multiply, because a halftone
		 * is already the whole treatment.
		 */
		halftone
	}: {
		src?: string;
		alt?: string;
		ratio?: string;
		caption?: string;
		placeholder?: string;
		sizes?: string;
		priority?: boolean;
		halftone?: Halftone;
	} = $props();

	// The fallback `src` for browsers that ignore srcset: a middle width.
	const url = $derived(cloudinary(src, { width: 1080, halftone }));
	const srcset = $derived(srcsetFor(src, { halftone }));
</script>

<figure>
	<div class:ink-duo={!halftone} class:ink-screen={halftone} style="aspect-ratio: {ratio}">
		{#if src}
			<img
				src={url}
				{srcset}
				{sizes}
				{alt}
				loading={priority ? 'eager' : 'lazy'}
				fetchpriority={priority ? 'high' : 'auto'}
				decoding="async"
			/>
		{:else}
			<span class="placeholder">{placeholder}</span>
		{/if}
	</div>
	{#if caption}
		<figcaption>{caption}</figcaption>
	{/if}
</figure>

<style>
	figure {
		margin: 0;
	}
	.ink-duo,
	.ink-screen {
		width: 100%;
	}
	.placeholder {
		position: absolute;
		inset: 0;
		z-index: 3;
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: var(--mono);
		font-size: 10.5px;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--on-blue);
		opacity: 0.7;
	}
	figcaption {
		font-family: var(--mono);
		font-size: 10px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--muted);
		margin-top: 7px;
	}
</style>
