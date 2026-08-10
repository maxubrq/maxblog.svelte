<script lang="ts">
	// Cyanotype plate (§6). No full-colour photography anywhere on the site.
	let {
		src = '',
		alt = '',
		ratio = '3 / 2',
		caption = '',
		placeholder = 'cyanotype plate'
	}: {
		src?: string;
		alt?: string;
		ratio?: string;
		caption?: string;
		placeholder?: string;
	} = $props();
</script>

<figure>
	<div class="ink-duo" style="aspect-ratio: {ratio}">
		{#if src}
			<img {src} {alt} loading="lazy" decoding="async" />
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
	.ink-duo {
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
