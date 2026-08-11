<script lang="ts">
	/**
	 * Writes the reader's place in this essay to `$lib/reading-memory`.
	 *
	 * Twin of `ArticleTracker`, and the distinction between them is the point:
	 * that one counts readers for the author and leaves the device; this one
	 * remembers a place for the reader and never does. So it has no `dev` guard
	 * and no `doNotTrack` check — there is nothing here to opt out of.
	 *
	 * Ported from the production `ReadingMemoryTracker.tsx`, with its scroll
	 * listener and its heading scan dropped: the page already measures itself
	 * once in `reading-progress.svelte.ts`, and the "top < 160px" rule that
	 * production re-implements here to find the current section is the same rule
	 * that produced `activeSection`.
	 */
	import type { TocItem } from '$lib/content/posts';
	import { FINISHED_PCT, writeEntry } from '$lib/reading-memory';

	interface Props {
		slug: string;
		title: string;
		topic: string;
		/** The essay's own locale — see `entryLang` in $lib/reading-memory. */
		lang: 'en' | 'vi';
		/** The whole essay's reading time, for the "N min left" on the way back. */
		reading: number;
		toc: TocItem[];
		progress: number;
		activeSection: string;
	}

	let { slug, title, topic, lang, reading, toc, progress, activeSection }: Props = $props();

	const ROMAN = [
		'I',
		'II',
		'III',
		'IV',
		'V',
		'VI',
		'VII',
		'VIII',
		'IX',
		'X',
		'XI',
		'XII',
		'XIII',
		'XIV',
		'XV'
	];

	/**
	 * Long enough that scrolling through an essay does not write fifty times,
	 * short enough that a reader who wanders off mid-paragraph is still
	 * remembered where they actually stopped.
	 */
	const SETTLE_MS = 2000;

	function save() {
		const index = toc.findIndex((item) => item.id === activeSection);
		writeEntry({
			slug,
			title,
			topic,
			lang,
			pct: progress,
			sectionId: activeSection,
			sectionNum: index >= 0 ? (ROMAN[index] ?? String(index + 1)) : '',
			sectionTitle: index >= 0 ? toc[index].text : '',
			minLeft: Math.max(0, Math.round(reading * (1 - progress))),
			totalMin: reading,
			lastSeenTs: Date.now(),
			finished: progress > FINISHED_PCT
		});
	}

	/**
	 * The settle. Reading `progress` re-runs this on every scroll frame, and each
	 * run cancels the pending write — so it lands only once the reader has been
	 * still for `SETTLE_MS`. Its teardown must *not* save: it fires constantly,
	 * and saving there would write on every frame, which is the debounce
	 * inverted.
	 */
	$effect(() => {
		progress;
		activeSection;
		const timer = setTimeout(save, SETTLE_MS);
		return () => clearTimeout(timer);
	});

	/**
	 * Leaving. This effect reads nothing reactive, so it runs once on mount and
	 * its teardown is the real departure — a client-side navigation away from the
	 * essay, where the last few seconds of reading would otherwise be lost.
	 * `pagehide` covers the other exits: a closed tab, and a page entering the
	 * back/forward cache, where no teardown runs at all.
	 *
	 * Both call `save()`, which reads the props live rather than the values this
	 * effect saw when it ran.
	 */
	$effect(() => {
		window.addEventListener('pagehide', save);
		return () => {
			window.removeEventListener('pagehide', save);
			save();
		};
	});
</script>
