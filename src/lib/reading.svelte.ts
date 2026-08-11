/**
 * The three reading settings an *article* has to react to while it is open:
 * the mode, the reading cursor, and whether the "N min left" estimate shows.
 *
 * Module-level rune state, the same shape as `search.svelte.ts` and for the
 * same reason: the control lives in the header dropdown and the instruments
 * live inside the page, and a context would be ceremony for three fields. The
 * store is the live copy; `localStorage` is the durable one, and `reading-prefs`
 * owns the reading and writing of it.
 *
 * Theme, layout and framing are *not* here — nothing needs to observe them,
 * because their whole effect is a data attribute the CSS already watches.
 */
import { loadPrefs, savePref, type ModePref } from './reading-prefs';

class ReadingState {
	mode = $state<ModePref>('study');
	ruler = $state(false);
	timeLeft = $state(true);

	/** Pull the stored values in. Client only — call it from an `$effect`. */
	hydrate() {
		const p = loadPrefs();
		this.mode = p.mode;
		this.ruler = p.ruler;
		this.timeLeft = p.timeLeft;
	}

	setMode(next: ModePref) {
		this.mode = next;
		savePref('mode', next);
		document.documentElement.dataset.readingMode = next;
	}

	setRuler(next: boolean) {
		this.ruler = next;
		savePref('ruler', next);
		if (next) document.documentElement.dataset.ruler = 'on';
		else delete document.documentElement.dataset.ruler;
	}

	setTimeLeft(next: boolean) {
		this.timeLeft = next;
		savePref('timeLeft', next);
	}
}

export const reading = new ReadingState();
