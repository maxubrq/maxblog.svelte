<script lang="ts">
	/**
	 * Reading cursor — "dải sáng".
	 *
	 * The block nearest the reading line keeps full contrast; everything else
	 * recedes to 34%. No line is drawn across the text: a hard rule makes the eye
	 * read the rule instead of the sentence.
	 *
	 * It fades out entirely when the reader stops moving — you have found your
	 * place, so the guide steps back — and returns on the next scroll or move.
	 *
	 * The dimming itself is CSS (`[data-ruler]` in app.css); this component only
	 * marks the candidate blocks and moves `.ruler-focus` between them.
	 *
	 * Ported from the production `ReadingRuler.tsx`; the scope selector follows
	 * this edition's `.prose` wrapper (`PostBody.svelte`) instead of
	 * `.article-prose`.
	 */
	let { enabled }: { enabled: boolean } = $props();

	const IDLE_MS = 1400;
	/** The reading line sits a third of the way down, where the eye already is. */
	const READ_LINE_RATIO = 0.38;

	$effect(() => {
		const root = document.documentElement;
		if (!enabled) return;

		// Prose blocks only — figures, interactive plates and the chapter opener
		// are left alone, since dimming a diagram reads as a bug, not a hint.
		const blocks = Array.from(
			document.querySelectorAll<HTMLElement>(
				'.prose > p, .prose > ul, .prose > ol, .prose > blockquote, .prose > h2, .prose > h3'
			)
		);
		if (blocks.length === 0) return;
		for (const b of blocks) b.classList.add('ruler-block');

		let focused: HTMLElement | null = null;
		let idle: ReturnType<typeof setTimeout> | undefined;
		let frame = 0;

		const update = () => {
			frame = 0;
			const line = window.innerHeight * READ_LINE_RATIO;
			let best: HTMLElement | null = null;
			let bestD = Infinity;
			for (const b of blocks) {
				const r = b.getBoundingClientRect();
				// Distance from the reading line to the block, zero while it straddles it.
				const d = r.top > line ? r.top - line : r.bottom < line ? line - r.bottom : 0;
				if (d < bestD) {
					bestD = d;
					best = b;
				}
			}
			if (best !== focused) {
				focused?.classList.remove('ruler-focus');
				best?.classList.add('ruler-focus');
				focused = best;
			}
			root.dataset.rulerLive = 'on';
			clearTimeout(idle);
			idle = setTimeout(() => delete root.dataset.rulerLive, IDLE_MS);
		};

		const onActivity = () => {
			if (!frame) frame = requestAnimationFrame(update);
		};

		window.addEventListener('scroll', onActivity, { passive: true });
		window.addEventListener('mousemove', onActivity, { passive: true });
		update();

		return () => {
			window.removeEventListener('scroll', onActivity);
			window.removeEventListener('mousemove', onActivity);
			clearTimeout(idle);
			if (frame) cancelAnimationFrame(frame);
			focused?.classList.remove('ruler-focus');
			for (const b of blocks) b.classList.remove('ruler-block');
			delete root.dataset.rulerLive;
		};
	});
</script>
