<script lang="ts">
	/**
	 * A Mux stream, played in the site's own chrome.
	 *
	 * Two decisions carry this component.
	 *
	 * **Nothing is fetched until the reader asks.** `preload="none"`, no `src` on
	 * the element, and hls.js is `import()`ed by the first press of play — the
	 * same discipline `ReaderMarks` uses for rough.js and the reading room for
	 * d3. A reader who scrolls past a video pays for one poster image.
	 *
	 * **The controls are ours.** Mux ships a player with its own look (rounded,
	 * gradients, a brand hue) and this edition is a printed object: every corner
	 * square, one blue. So the browser's controls are off and the bar below the
	 * stage is built here — play, a scrub rail whose cursor is the same 9px
	 * square the draft's time rail uses, MONO time, sound, full screen.
	 *
	 * Safari and iOS play HLS natively and never load hls.js at all.
	 */
	import VideoPlate from './VideoPlate.svelte';
	import { useI18n } from '$lib/i18n';

	let {
		playbackId,
		label = '',
		hint = '',
		caption = '',
		ratio = '16 / 9',
		/** Override the auto thumbnail with any image URL. */
		poster = '',
		/** Which second of the video the auto thumbnail is taken from. */
		posterTime = 0,
		/** Spoken description of the clip, for anyone who cannot see it. */
		title = '',
		loop = false
	}: {
		playbackId: string;
		label?: string;
		hint?: string;
		caption?: string;
		ratio?: string;
		poster?: string;
		posterTime?: number;
		title?: string;
		loop?: boolean;
	} = $props();

	const i18n = useI18n();
	const t = $derived(i18n.t.video);

	const stream = $derived(`https://stream.mux.com/${playbackId}.m3u8`);
	const thumbnail = $derived(
		poster || `https://image.mux.com/${playbackId}/thumbnail.jpg?width=1080&time=${posterTime}`
	);

	let video = $state<HTMLVideoElement | null>(null);
	let stage = $state<HTMLElement | null>(null);
	/** Has the reader asked for the stream yet? Nothing is fetched before this. */
	let started = $state(false);
	let loading = $state(false);
	let failed = $state(false);
	let posterFailed = $state(false);
	let playing = $state(false);
	let muted = $state(false);
	let elapsed = $state(0);
	let duration = $state(0);
	/** True while the reader drags the rail, so `timeupdate` stops fighting them. */
	let scrubbing = $state(false);

	/** Whatever hls.js attached, so it can be detached on teardown. */
	let hls: { destroy(): void } | null = null;

	const clock = (s: number) => {
		if (!Number.isFinite(s) || s < 0) s = 0;
		const m = Math.floor(s / 60);
		return `${m}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
	};

	/**
	 * Attach the stream, natively where the browser can and through hls.js where
	 * it cannot. Called once, by the reader.
	 */
	async function attach(el: HTMLVideoElement) {
		// `'probably'`, not merely truthy. Chrome answers `'maybe'` for the HLS
		// MIME type and then cannot play a playlist at all — trusting that answer
		// leaves the element at readyState 0 for ever, playing nothing, with no
		// error to report. Safari and iOS answer `'probably'` and are the only
		// engines that mean it, which is also what keeps hls.js off those devices.
		if (el.canPlayType('application/vnd.apple.mpegurl') === 'probably') {
			el.src = stream;
			return;
		}
		const { default: Hls } = await import('hls.js');
		if (!Hls.isSupported()) {
			// Neither route works — an old browser, or media extensions disabled.
			failed = true;
			return;
		}
		const instance = new Hls({ enableWorker: true });
		instance.on(Hls.Events.ERROR, (_event, data) => {
			// Only a fatal error is the reader's problem; hls.js recovers the rest.
			if (data.fatal) failed = true;
		});
		instance.attachMedia(el);
		instance.loadSource(stream);
		hls = instance;
	}

	async function start() {
		const el = video;
		if (!el || started) return;
		started = true;
		loading = true;
		try {
			// `preload="none"` is what kept the plate free until this press; lifting
			// it here is the press itself, and it has to happen before the stream is
			// attached so the element is willing to load what arrives.
			el.preload = 'auto';
			await attach(el);
			if (!failed) await el.play();
		} catch {
			// A refused autoplay is not a failure: the element is ready and the
			// reader can press play again. A missing stream is, and `attach`
			// has already said so.
			playing = false;
		} finally {
			loading = false;
		}
	}

	function toggle() {
		const el = video;
		if (!el) return;
		if (!started) return void start();
		if (el.paused) void el.play();
		else el.pause();
	}

	function seek(to: number) {
		if (video && Number.isFinite(to)) video.currentTime = to;
	}

	function fullscreen() {
		const el = stage;
		if (!el) return;
		if (document.fullscreenElement) void document.exitFullscreen();
		else void el.requestFullscreen?.();
	}

	$effect(() => () => {
		hls?.destroy();
		hls = null;
	});
</script>

<VideoPlate label={label || t.mux} {hint} {ratio} {caption}>
	<div class="stage" bind:this={stage}>
		<!-- svelte-ignore a11y_media_has_caption -->
		<video
			bind:this={video}
			preload="none"
			playsinline
			{loop}
			aria-label={title || undefined}
			class:shown={started && !failed}
			onplay={() => (playing = true)}
			onpause={() => (playing = false)}
			onwaiting={() => (loading = true)}
			onplaying={() => (loading = false)}
			ontimeupdate={() => {
				if (!scrubbing && video) elapsed = video.currentTime;
			}}
			onloadedmetadata={() => {
				if (video) duration = video.duration;
			}}
			onvolumechange={() => {
				if (video) muted = video.muted;
			}}
			onerror={() => (failed = true)}
		></video>

		{#if failed}
			<div class="ink-hatch note">
				<span>{t.failed}</span>
			</div>
		{:else if !started}
			<!-- The way in. One press fetches the stream and, off Safari, hls.js. -->
			<button class="cover" onclick={start} aria-label={title ? `${t.play} — ${title}` : t.play}>
				{#if thumbnail && !posterFailed}
					<img
						src={thumbnail}
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

		{#if loading && started && !failed}
			<span class="loading">{t.loading}</span>
		{/if}
	</div>

	{#snippet foot()}
		{#if !failed}
			<!-- Below the stage rather than over it: full screen shows the video and
			     nothing else, and the controls never cover the last line of a shot. -->
			<div class="bar" class:idle={!started}>
				<button class="key" onclick={toggle} aria-label={playing ? t.pause : t.play}>
					{playing ? '❙❙' : '▶'}
				</button>

				<span class="time">{clock(elapsed)}</span>

				<input
					class="rail"
					type="range"
					min="0"
					max={duration || 0}
					step="0.1"
					value={elapsed}
					disabled={!duration}
					aria-label={t.seek}
					oninput={(e) => {
						scrubbing = true;
						elapsed = e.currentTarget.valueAsNumber;
					}}
					onchange={(e) => {
						scrubbing = false;
						seek(e.currentTarget.valueAsNumber);
					}}
				/>

				<span class="time">{duration ? clock(duration) : '—:—'}</span>

				<button
					class="key"
					onclick={() => video && (video.muted = !video.muted)}
					aria-label={muted ? t.unmute : t.mute}
				>
					{muted ? t.soundOff : t.soundOn}
				</button>

				<button class="key" onclick={fullscreen} aria-label={t.fullscreen}>⤢</button>
			</div>
		{/if}
	{/snippet}
</VideoPlate>

<style>
	.stage {
		position: absolute;
		inset: 0;
	}
	video {
		width: 100%;
		height: 100%;
		display: block;
		background: var(--paper2);
		/* Hidden rather than absent: the element has to exist to be attached to,
		   and a black box before the first press would read as a broken plate. */
		visibility: hidden;
	}
	video.shown {
		visibility: visible;
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
		/* The one photographic treatment this edition allows (§6). */
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

	.note {
		position: absolute;
		inset: 0;
		display: grid;
		place-items: center;
	}
	.note span {
		font-family: var(--mono);
		font-size: 11px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--blue);
		background: color-mix(in srgb, var(--paper) 82%, transparent);
		padding: 8px 12px;
	}
	.loading {
		position: absolute;
		left: 12px;
		bottom: 10px;
		font-family: var(--mono);
		font-size: 10px;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--blue);
		background: color-mix(in srgb, var(--paper) 82%, transparent);
		padding: 4px 7px;
	}

	.bar {
		display: flex;
		align-items: center;
		gap: 12px;
		margin-top: -1.5px;
		border: 1.5px solid var(--rule-hard);
		border-top: none;
		padding: 8px 12px;
	}
	/* Before the first press the bar is present but plainly inert — the poster
	   carries the invitation, and two play buttons is one too many. */
	.bar.idle {
		opacity: 0.55;
	}
	.key {
		flex: none;
		border: 1.5px solid var(--rule);
		background: transparent;
		color: var(--ink);
		cursor: pointer;
		font-family: var(--mono);
		font-size: 11px;
		line-height: 1;
		padding: 6px 8px;
		min-width: 30px;
	}
	.key:hover {
		border-color: var(--blue);
		color: var(--blue);
	}
	.time {
		flex: none;
		font-family: var(--mono);
		font-size: 10.5px;
		letter-spacing: 0.08em;
		color: var(--muted);
		font-variant-numeric: tabular-nums;
	}

	/* The rail is the draft's time rail again: a hairline, a blue run, and a
	   9px square where you are standing. */
	.rail {
		flex: 1;
		min-width: 60px;
		appearance: none;
		background: transparent;
		height: 18px;
		cursor: pointer;
	}
	.rail::-webkit-slider-runnable-track {
		height: 1.5px;
		background: var(--rule);
	}
	.rail::-moz-range-track {
		height: 1.5px;
		background: var(--rule);
	}
	.rail::-moz-range-progress {
		height: 1.5px;
		background: var(--blue);
	}
	.rail::-webkit-slider-thumb {
		appearance: none;
		width: 9px;
		height: 9px;
		margin-top: -3.75px;
		border: none;
		border-radius: 0;
		background: var(--blue);
	}
	.rail::-moz-range-thumb {
		width: 9px;
		height: 9px;
		border: none;
		border-radius: 0;
		background: var(--blue);
	}
	.rail:disabled {
		cursor: default;
	}

	@media (max-width: 560px) {
		.bar {
			gap: 8px;
			padding: 7px 9px;
		}
		.mark {
			width: 48px;
			height: 48px;
			font-size: 16px;
		}
	}
</style>
