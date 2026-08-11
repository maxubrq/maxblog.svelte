<script lang="ts">
	/**
	 * Reading telemetry — the three facts `/api/track` records: a session opened
	 * this essay, reached a section, and finished it.
	 *
	 * Counts, never identities. One row per session per post (and per section),
	 * deduplicated by unique constraints in the schema, so the numbers answer
	 * "how many people got this far" and nothing else. Nothing is read back into
	 * the page — the reader is never shown a score.
	 *
	 * Ported from the production `ArticleTracker.tsx`, with its two listeners
	 * removed: that component runs its own scroll handler and its own
	 * `IntersectionObserver`, while this edition already measures the page once
	 * in `reading-progress.svelte.ts` and hands the numbers around. So the
	 * tracker takes them as props and owns no listeners at all.
	 *
	 * That swaps the definition of "reached a section" slightly. Production
	 * fires when the heading *enters* the upper 60% of the viewport; here a
	 * section counts once the reader is standing under it, which is the same
	 * signal the running head and the contents already use. One definition of
	 * "where the reader is", used everywhere.
	 */
	import { dev } from '$app/environment';
	import { sessionId } from '$lib/session';

	interface Props {
		postSlug: string;
		locale: string;
		/** Scroll fraction, 0..1, from the article's own measurement. */
		progress: number;
		/** Id of the heading the reader is under, `''` before the first one. */
		activeSection: string;
		/** A draft is a preview for the author; it is not readership. */
		draft?: boolean;
	}

	let { postSlug, locale, progress, activeSection, draft = false }: Props = $props();

	/** Finished, for the purposes of counting: production's threshold. */
	const COMPLETE_AT = 0.9;

	/**
	 * Both editions write to the same Postgres, so a `pnpm dev` session would
	 * land in the real numbers as a reader. And `doNotTrack` is a request this
	 * site has no reason to refuse — it counts to know whether an essay was
	 * finished, which is a question a reader is allowed to decline.
	 */
	function shouldTrack(): boolean {
		if (dev || draft) return false;
		return navigator.doNotTrack !== '1' && navigator.doNotTrack !== 'yes';
	}

	/** Fire and forget. A failed count must never surface to the reader. */
	function track(body: Record<string, string>) {
		fetch('/api/track', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(body)
		}).catch(() => {});
	}

	let session = $state<string | null>(null);
	let completed = false;
	const seen = new Set<string>();

	// The view, once, on arrival.
	$effect(() => {
		if (!shouldTrack()) return;
		const id = sessionId();
		if (!id) return;
		session = id;
		track({ type: 'view', postSlug, sessionId: id, locale });
	});

	// Reaching a section, and finishing — both read the measurement the rest of
	// the page is already using. `completed` and `seen` are plain, not `$state`:
	// they only guard the network, nothing renders from them, and writing rune
	// state from an effect that reads it is what stalls the whole page.
	$effect(() => {
		const id = session;
		const here = activeSection;
		const p = progress;
		if (!id) return;

		if (here && !seen.has(here)) {
			seen.add(here);
			track({ type: 'section', postSlug, sectionId: here, sessionId: id });
		}
		if (!completed && p > COMPLETE_AT) {
			completed = true;
			track({ type: 'complete', postSlug, sessionId: id });
		}
	});
</script>
