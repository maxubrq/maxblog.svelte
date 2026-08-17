<script lang="ts">
	/**
	 * A YouTube video, embedded only once the reader asks for it.
	 *
	 * The plate you see before pressing play is **ours**: no iframe, no script,
	 * no image from a Google host, so a post carrying a video costs a reader who
	 * scrolls past it nothing and tells Google nothing. The embed is built on the
	 * press, against `youtube-nocookie.com`.
	 *
	 * That is also why the poster is a hatch plate rather than YouTube's own
	 * thumbnail: `i.ytimg.com` is a request to Google, which would break the
	 * promise the facade exists to keep. Pass `poster` to put a real image there
	 * — your own frame grab, served from where the rest of the media is.
	 *
	 * Nothing about the player itself can be styled once the iframe is in; the
	 * plate around it is what keeps a video looking like part of the essay.
	 */
	import VideoPlate from './VideoPlate.svelte';
	import { useI18n } from '$lib/i18n';

	let {
		id,
		label = '',
		hint = '',
		caption = '',
		ratio = '16 / 9',
		/** Your own still. Left empty, the facade is a hatch plate. */
		poster = '',
		/** What the video is, for the button's accessible name. */
		title = '',
		/** Start this many seconds in. */
		start = 0
	}: {
		id: string;
		label?: string;
		hint?: string;
		caption?: string;
		ratio?: string;
		poster?: string;
		title?: string;
		start?: number;
	} = $props();

	const i18n = useI18n();
	const t = $derived(i18n.t.video);

	let playing = $state(false);
	let posterFailed = $state(false);

	/**
	 * `rel=0` keeps the end screen to this channel, `modestbranding=1` drops the
	 * logo overlay, and `autoplay=1` is honest here: the press *was* the consent.
	 */
	const embed = $derived(
		`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1` +
			(start > 0 ? `&start=${Math.floor(start)}` : '')
	);
	const watch = $derived(
		`https://www.youtube.com/watch?v=${id}${start > 0 ? `&t=${Math.floor(start)}` : ''}`
	);
</script>

<VideoPlate label={label || t.youtube} hint={hint || (playing ? '' : t.notLoaded)} {ratio} {caption}>
	<div class="stage">
		{#if playing}
			<iframe
				src={embed}
				title={title || t.youtube}
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
				referrerpolicy="strict-origin-when-cross-origin"
				allowfullscreen
			></iframe>
		{:else}
			<button
				class="cover"
				onclick={() => (playing = true)}
				aria-label={title ? `${t.facadePlay} — ${title}` : t.facadePlay}
			>
				{#if poster && !posterFailed}
					<img
						src={poster}
						alt=""
						loading="lazy"
						decoding="async"
						onerror={() => (posterFailed = true)}
					/>
				{:else}
					<span class="ink-hatch fill" aria-hidden="true"></span>
				{/if}
				<span class="mark" aria-hidden="true">▶</span>
			</button>
		{/if}
	</div>

	{#snippet foot()}
		<div class="say">
			{#if playing}
				<span class="note">{t.loadedFrom}</span>
			{:else}
				<span class="note">{t.facadeNote}</span>
			{/if}
			<!-- A way out for anyone who would rather not load the embed at all. -->
			<a class="out" href={watch} target="_blank" rel="noreferrer noopener">{t.watchOn}</a>
		</div>
	{/snippet}
</VideoPlate>

<style>
	.stage {
		position: absolute;
		inset: 0;
	}
	iframe {
		width: 100%;
		height: 100%;
		border: none;
		display: block;
	}

	.cover {
		position: absolute;
		inset: 0;
		width: 100%;
		padding: 0;
		border: none;
		background: transparent;
		cursor: pointer;
		display: grid;
		place-items: center;
	}
	.cover img {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		filter: grayscale(1) contrast(1.06);
	}
	.fill {
		position: absolute;
		inset: 0;
		opacity: 0.5;
	}
	.mark {
		position: relative;
		display: grid;
		place-items: center;
		width: 62px;
		height: 62px;
		border: 1.5px solid var(--blue);
		background: color-mix(in srgb, var(--paper) 82%, transparent);
		color: var(--blue);
		font-size: 20px;
		line-height: 1;
		padding-left: 3px;
	}
	.cover:hover .mark {
		background: var(--panel-blue);
		color: var(--on-blue);
	}

	.say {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 16px;
		padding: 9px 14px;
	}
	.note {
		font-family: var(--body);
		font-size: 13px;
		line-height: 1.5;
		color: var(--muted);
	}
	.out {
		flex: none;
		font-family: var(--mono);
		font-size: 10px;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		white-space: nowrap;
	}

	@media (max-width: 560px) {
		.say {
			flex-direction: column;
			gap: 8px;
		}
		.mark {
			width: 48px;
			height: 48px;
			font-size: 16px;
		}
	}
</style>
