/**
 * Reading preferences — device-local, never sent anywhere.
 *
 * This is the Ink Edition's cut of the production blog's `lib/reading-prefs`:
 * the settings the header dropdown offers. The storage keys are the production
 * ones on purpose, so a reader who has both editions open keeps the same page.
 * The rest (type size, measure) arrives with the /reading page.
 */

export type ThemePref = 'light' | 'dusk' | 'dark';
export type LayoutPref = 'single' | 'sidenote';
export type FramingPref = 'rule' | 'bleed' | 'card';
/** `study` is the page with its apparatus; `flow` is the prose, wider, alone. */
export type ModePref = 'study' | 'flow';

export const THEMES: ThemePref[] = ['light', 'dusk', 'dark'];
export const LAYOUTS: LayoutPref[] = ['single', 'sidenote'];
export const FRAMINGS: FramingPref[] = ['rule', 'bleed', 'card'];
export const MODES: ModePref[] = ['study', 'flow'];

/** The glyph beside each theme name in the dropdown. */
export const THEME_GLYPH: Record<ThemePref, string> = {
	light: '◐',
	dusk: '◑',
	dark: '○'
};

export interface Prefs {
	theme: ThemePref;
	layout: LayoutPref;
	framing: FramingPref;
	mode: ModePref;
	/** Reading cursor — the block being read holds contrast, the rest recede. */
	ruler: boolean;
	/**
	 * Show the "N min left" estimate beside the contents. The fore-edge is the
	 * primary instrument either way; this is for readers who want the number
	 * back, and for readers who want it gone.
	 */
	timeLeft: boolean;
}

export const DEFAULT_PREFS: Prefs = {
	theme: 'light',
	layout: 'sidenote',
	framing: 'card',
	mode: 'study',
	ruler: false,
	timeLeft: true
};

export const STORAGE_KEYS: Record<keyof Prefs, string> = {
	theme: 'theme',
	layout: 'layout',
	framing: 'framing',
	mode: 'reading-mode',
	ruler: 'reading-ruler',
	timeLeft: 'time-left'
};

export function loadPrefs(): Prefs {
	const p = { ...DEFAULT_PREFS };
	try {
		const theme = localStorage.getItem(STORAGE_KEYS.theme);
		if (theme && (THEMES as string[]).includes(theme)) p.theme = theme as ThemePref;
		const layout = localStorage.getItem(STORAGE_KEYS.layout);
		if (layout && (LAYOUTS as string[]).includes(layout)) p.layout = layout as LayoutPref;
		const framing = localStorage.getItem(STORAGE_KEYS.framing);
		if (framing && (FRAMINGS as string[]).includes(framing)) p.framing = framing as FramingPref;
		const mode = localStorage.getItem(STORAGE_KEYS.mode);
		if (mode && (MODES as string[]).includes(mode)) p.mode = mode as ModePref;
		// Booleans are stored as the strings production writes, and only an
		// explicit value overrides the default — a missing key is not a `false`.
		const ruler = localStorage.getItem(STORAGE_KEYS.ruler);
		if (ruler === 'true' || ruler === 'false') p.ruler = ruler === 'true';
		const timeLeft = localStorage.getItem(STORAGE_KEYS.timeLeft);
		if (timeLeft === 'true' || timeLeft === 'false') p.timeLeft = timeLeft === 'true';
	} catch {
		// Private mode, or storage disabled — the defaults are a fine page.
	}
	return p;
}

export function savePref<K extends keyof Prefs>(key: K, value: Prefs[K]) {
	try {
		localStorage.setItem(STORAGE_KEYS[key], String(value));
	} catch {
		// Same: a setting that cannot be remembered still applies for this visit.
	}
}

/** Write every preference onto <html> as a data attribute. */
export function applyPrefs(p: Prefs) {
	const el = document.documentElement;
	el.dataset.theme = p.theme;
	el.dataset.layout = p.layout;
	el.dataset.framing = p.framing;
	el.dataset.readingMode = p.mode;
	// Present-or-absent rather than on/off: the CSS only ever asks whether the
	// cursor is on, and an absent attribute cannot half-match.
	if (p.ruler) el.dataset.ruler = 'on';
	else delete el.dataset.ruler;
}
