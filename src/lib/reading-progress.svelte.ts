/**
 * Where the reader is in the page — one scroll listener for the whole article.
 *
 * Four instruments want this number (the fore-edge, the drawer, the mobile bar,
 * the running head), and four listeners measuring the same document on every
 * scroll frame is three too many. The article creates one of these and hands
 * the values down.
 *
 * Ported from `handleScroll` in the production `ArticleLayout`, with the
 * measurement moved into a rAF: the DOM reads here (`scrollHeight`, a
 * `getBoundingClientRect` per heading) are exactly the kind that stall a scroll
 * if they run synchronously on every event.
 */

/** The reading line: where a heading counts as "the section you are in". */
const ACTIVE_LINE = 160;
/** The line per-section progress is measured against, under the running head. */
const READ_LINE = 200;

export interface ReadingProgress {
	/** Scroll fraction, 0..1. Thickness only — never printed as a percentage. */
	readonly progress: number;
	/** Id of the `##` the reader is under, `''` before the first one. */
	readonly activeSection: string;
	/** Per-section fraction scrolled past the reading line, keyed by heading id. */
	readonly sectionProgress: Record<string, number>;
}

/**
 * Start measuring. Call from an `$effect` in the article page and return the
 * teardown, so the listener dies with the page.
 */
export function createReadingProgress(): ReadingProgress & { stop: () => void } {
	let progress = $state(0);
	let activeSection = $state('');
	let sectionProgress = $state<Record<string, number>>({});

	let frame = 0;

	const measure = () => {
		frame = 0;
		const scrollTop = window.scrollY;
		const docHeight = document.documentElement.scrollHeight - window.innerHeight;
		progress = docHeight > 0 ? Math.max(0, Math.min(1, scrollTop / docHeight)) : 0;

		const headings = Array.from(document.querySelectorAll<HTMLElement>('h2[id]'));
		let active = '';
		for (const h of headings) {
			if (h.getBoundingClientRect().top < ACTIVE_LINE) active = h.id;
		}
		activeSection = active;

		// How much of each section has passed the reading line. A section runs
		// from its own heading to the next one; the last runs to the end of the
		// document, apparatus included — that is where the reading actually ends.
		const line = scrollTop + READ_LINE;
		const docBottom = document.documentElement.scrollHeight;
		const tops = headings.map((h) => h.getBoundingClientRect().top + scrollTop);
		const map: Record<string, number> = {};
		for (let i = 0; i < headings.length; i++) {
			const start = tops[i];
			const end = i + 1 < headings.length ? tops[i + 1] : docBottom;
			const span = Math.max(1, end - start);
			map[headings[i].id] = Math.max(0, Math.min(1, (line - start) / span));
		}
		sectionProgress = map;
	};

	const onScroll = () => {
		if (!frame) frame = requestAnimationFrame(measure);
	};

	window.addEventListener('scroll', onScroll, { passive: true });
	window.addEventListener('resize', onScroll, { passive: true });
	measure();

	return {
		get progress() {
			return progress;
		},
		get activeSection() {
			return activeSection;
		},
		get sectionProgress() {
			return sectionProgress;
		},
		stop() {
			window.removeEventListener('scroll', onScroll);
			window.removeEventListener('resize', onScroll);
			if (frame) cancelAnimationFrame(frame);
		}
	};
}
