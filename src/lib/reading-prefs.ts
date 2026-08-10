/**
 * Reading preferences — device-local, never sent anywhere.
 *
 * This is the Ink Edition's cut of the production blog's `lib/reading-prefs`:
 * only the three settings the header dropdown offers. The storage keys are the
 * production ones on purpose, so a reader who has both editions open keeps the
 * same page. The rest (type size, measure, reading cursor) arrives with the
 * /reading page.
 */

export type ThemePref = 'light' | 'dusk' | 'dark';
export type LayoutPref = 'single' | 'sidenote';
export type FramingPref = 'rule' | 'bleed' | 'card';

export const THEMES: ThemePref[] = ['light', 'dusk', 'dark'];
export const LAYOUTS: LayoutPref[] = ['single', 'sidenote'];
export const FRAMINGS: FramingPref[] = ['rule', 'bleed', 'card'];

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
}

export const DEFAULT_PREFS: Prefs = { theme: 'light', layout: 'sidenote', framing: 'card' };

export const STORAGE_KEYS: Record<keyof Prefs, string> = {
	theme: 'theme',
	layout: 'layout',
	framing: 'framing'
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
}
