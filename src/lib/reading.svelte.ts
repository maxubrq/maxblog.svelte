/**
 * The reader's settings, live.
 *
 * `reading-prefs.ts` owns the storage and the `<html>` stamping; this owns the
 * *current* values, as rune state, so anything on screen re-renders the moment
 * one changes.
 *
 * Why a store and not each surface reading localStorage on mount: two surfaces
 * edit these — the header dropdown and `/reading` — and neither remounts on a
 * client-side navigation. Change the measure on `/reading`, walk to an essay,
 * open the dropdown: without a shared store the dropdown is showing whatever it
 * read when the layout first mounted, which is now a lie.
 *
 * Module-level state rather than a context, the same shape as
 * `search.svelte.ts` and for the same reason: there is exactly one reader.
 */
import {
	DEFAULT_PREFS,
	applyPrefs,
	clearPrefs,
	effectiveTheme,
	hasStoredTheme,
	loadPrefs,
	savePref,
	type Prefs,
	type ThemePref
} from './reading-prefs';

/**
 * With no theme on record the page is following the system, so that is the
 * theme the controls have to show — a `light` chip lit over a dark page is the
 * site telling the reader something untrue about itself. Used on the way in
 * (`hydrate`) and on the way back out (`reset`), which are the two moments
 * "nothing chosen" can arise.
 */
function withSystemTheme(prefs: Prefs, chosen: boolean): Prefs {
	if (chosen || !window.matchMedia('(prefers-color-scheme: dark)').matches) return prefs;
	return { ...prefs, theme: 'dark' };
}

class ReadingState {
	/**
	 * Starts at the defaults, which is also what the blocking script in
	 * `app.html` painted before hydration — so the first render agrees with the
	 * page it is hydrating, and `hydrate()` swaps in what this device stored.
	 */
	prefs = $state<Prefs>({ ...DEFAULT_PREFS });
	/** False until the stored values have been read; the page renders either way. */
	ready = $state(false);
	/**
	 * Whether the reader has ever picked a theme. False means "following the
	 * system", which is a state to protect, not a gap to fill: every write goes
	 * through `applyPrefs` and would otherwise stamp `data-theme` as a side
	 * effect of changing something else entirely.
	 */
	themeChosen = $state(false);

	/** Plain field, deliberately not `$state`: see `hydrate()`. */
	#hydrated = false;

	/**
	 * Pull the stored values in. Client only — call it from an `$effect`.
	 *
	 * It is written as writes-only, over locals, and guarded by a *non-reactive*
	 * flag. Both matter: an `$effect` that reads a piece of state and then writes
	 * it re-triggers itself, and Svelte answers that with
	 * `effect_update_depth_exceeded` and stops updating the page — every control
	 * still works and nothing on screen ever changes again. Read nothing
	 * reactive in here.
	 */
	hydrate() {
		if (this.#hydrated) return;
		this.#hydrated = true;

		const chosen = hasStoredTheme();
		this.prefs = withSystemTheme(loadPrefs(), chosen);
		this.themeChosen = chosen;
		this.ready = true;
	}

	/** Set one preference: live on the page and saved, in that order, at once. */
	set<K extends keyof Prefs>(key: K, value: Prefs[K]) {
		this.prefs = { ...this.prefs, [key]: value };
		savePref(key, value);
		applyPrefs(this.prefs, this.themeChosen);
	}

	/**
	 * Choosing a theme by hand turns the clock off — otherwise the choice would
	 * silently expire at the next hour boundary, which reads as the site
	 * overriding the reader.
	 */
	setTheme(theme: ThemePref) {
		this.prefs = { ...this.prefs, theme, themeAuto: false };
		this.themeChosen = true;
		savePref('theme', theme);
		savePref('themeAuto', false);
		applyPrefs(this.prefs);
	}

	/** Turning the clock on is itself a choice of theme. */
	setThemeAuto(on: boolean) {
		this.prefs = { ...this.prefs, themeAuto: on };
		savePref('themeAuto', on);
		if (on) this.themeChosen = true;
		applyPrefs(this.prefs, this.themeChosen);
	}

	reset() {
		clearPrefs();
		this.prefs = withSystemTheme({ ...DEFAULT_PREFS }, false);
		this.themeChosen = false;
		// Nothing is stored any more, so hand the page back to the system rather
		// than leaving the last choice stamped on it.
		delete document.documentElement.dataset.theme;
		applyPrefs(this.prefs, false);
	}

	/** The theme in force right now — the clock's when `themeAuto` is on. */
	get theme(): ThemePref {
		return effectiveTheme(this.prefs);
	}

	// Read often enough by the article's instruments to be worth the shorthand.
	get mode() {
		return this.prefs.mode;
	}
	get ruler() {
		return this.prefs.ruler;
	}
	get timeLeft() {
		return this.prefs.timeLeft;
	}
}

export const reading = new ReadingState();
