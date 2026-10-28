/**
 * The reader's two settings, live — see `reading-prefs.ts` for what they are
 * and where they are stored.
 *
 * Module-level state rather than a context, the same shape as
 * `search.svelte.ts` and for the same reason: there is exactly one reader.
 */
import {
	DEFAULT_PREFS,
	TEXT_SIZES,
	applyPrefs,
	loadPrefs,
	savePrefs,
	type Prefs,
	type ThemePref
} from './reading-prefs';

class ReadingState {
	/**
	 * Starts at the defaults, which is also what the blocking script in
	 * `app.html` assumes before it reads storage — so the first render agrees
	 * with the page it is hydrating, and `hydrate()` swaps in what is stored.
	 */
	prefs = $state<Prefs>({ ...DEFAULT_PREFS });

	/** Plain field, deliberately not `$state`: an `$effect` calls `hydrate()`,
	 *  and reading reactive state in there would re-trigger it. */
	#hydrated = false;

	/** Pull the stored values in. Client only — call it from an `$effect`. */
	hydrate() {
		if (this.#hydrated) return;
		this.#hydrated = true;
		this.prefs = loadPrefs();
	}

	setTheme(theme: ThemePref) {
		this.#commit({ ...this.prefs, theme });
	}

	/** One step along the size ladder; past either end it stays put. */
	stepSize(dir: -1 | 1) {
		const i = TEXT_SIZES.indexOf(this.prefs.fontSize) + dir;
		if (i < 0 || i >= TEXT_SIZES.length) return;
		this.#commit({ ...this.prefs, fontSize: TEXT_SIZES[i] });
	}

	#commit(next: Prefs) {
		this.prefs = next;
		savePrefs(next);
		applyPrefs(next);
	}
}

export const reading = new ReadingState();
