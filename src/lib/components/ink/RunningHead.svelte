<script lang="ts">
	/**
	 * The running head — the vertical rotated folio pinned to a page edge (§4).
	 *
	 * It is *running*: fixed to the viewport, not to the document, because what
	 * it carries changes as you read — the section you are standing in, and the
	 * folio. A label that scrolled away with the page would only ever describe
	 * the top of the essay.
	 */
	let {
		text,
		folio,
		side = 'right'
	}: { text: string; folio?: string; side?: 'left' | 'right' } = $props();
</script>

<div class="rail no-print" style={side === 'left' ? 'left:0' : 'right:0'} aria-hidden="true">
	<span class="text">{text}</span>
	{#if folio}<span class="folio">{folio}</span>{/if}
</div>

<style>
	.rail {
		position: fixed;
		top: 0;
		bottom: 0;
		width: 34px;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 14px;
		pointer-events: none;
		z-index: 20;
	}
	span {
		font-family: var(--mono);
		font-size: 10px;
		letter-spacing: 0.22em;
		text-transform: uppercase;
		writing-mode: vertical-rl;
		transform: rotate(180deg);
	}
	.text {
		color: var(--faint);
		/* A long section title is cut rather than run off the top of the screen. */
		max-height: 46vh;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	/* The folio is where you are standing, so it is set in ink, not in air. */
	.folio {
		color: var(--blue);
		letter-spacing: 0.14em;
		font-variant-numeric: tabular-nums;
	}
	@media (max-width: 1100px) {
		.rail {
			display: none;
		}
	}
</style>
