/**
 * Reading preferences — device-local, never sent anywhere.
 *
 * The Ink Edition's cut of the production blog's `lib/reading-prefs`. The
 * storage keys are the production ones on purpose, so a reader who has both
 * editions open keeps the same page.
 *
 * Two surfaces edit these: the header dropdown (`DisplaySettings.svelte`, the
 * four decisions worth taking mid-sentence) and `/reading` (all of them, with
 * a live sample). Both go through `$lib/reading.svelte` rather than touching
 * this module directly — see the note there.
 *
 * Everything here lands on `<html>`: `data-*` for the CSS switches, custom
 * properties for the numbers. So `applyPrefs()` is the only call needed to make
 * a change visible everywhere at once.
 */

export type ThemePref = 'light' | 'dusk' | 'dark';
export type LayoutPref = 'single' | 'sidenote';
export type FramingPref = 'rule' | 'bleed' | 'card';
/** `study` is the page with its apparatus; `flow` is the prose, wider, alone. */
export type ModePref = 'study' | 'flow';
export type TypefacePref = 'sans' | 'serif';
/**
 * The three column widths, named the way production names them. There the
 * numbers are literally characters per line (`680 / 800 / 920px`); this
 * edition's prose column is wider, so the same three names map to its own
 * widths in `app.css` — `60` is whatever "normal" looks like here.
 */
export type MeasurePref = '52' | '60' | '72';

export const THEMES: ThemePref[] = ['light', 'dusk', 'dark'];
export const LAYOUTS: LayoutPref[] = ['single', 'sidenote'];
export const FRAMINGS: FramingPref[] = ['rule', 'bleed', 'card'];
export const MODES: ModePref[] = ['study', 'flow'];
export const TYPEFACES: TypefacePref[] = ['sans', 'serif'];
export const MEASURES: MeasurePref[] = ['52', '60', '72'];

/** The glyph beside each theme name in the dropdown. */
export const THEME_GLYPH: Record<ThemePref, string> = {
	light: '◐',
	dusk: '◑',
	dark: '○'
};

export const FONT_SIZE_MIN = 16;
export const FONT_SIZE_MAX = 26;
export const LINE_SPACING_MIN = 1.4;
export const LINE_SPACING_MAX = 2.2;

/** The steps `/reading` offers. Stored values are free to sit between them. */
export const TEXT_SIZE_STEPS = [16, 18, 22, 26] as const;
export const LINE_SPACING_STEPS = [1.5, 1.62, 2.0] as const;

export interface Prefs {
	theme: ThemePref;
	/** Take the theme from the local clock instead of the fixed choice. */
	themeAuto: boolean;
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
	/** Prose size in px. The chrome never scales — it is not reading type. */
	fontSize: number;
	lineSpacing: number;
	measure: MeasurePref;
	typeface: TypefacePref;
}

export const DEFAULT_PREFS: Prefs = {
	theme: 'light',
	themeAuto: false,
	layout: 'sidenote',
	framing: 'card',
	mode: 'study',
	ruler: false,
	timeLeft: true,
	fontSize: 18,
	lineSpacing: 1.62,
	measure: '60',
	typeface: 'sans'
};

export const STORAGE_KEYS: Record<keyof Prefs, string> = {
	theme: 'theme',
	themeAuto: 'theme-auto',
	layout: 'layout',
	framing: 'framing',
	mode: 'reading-mode',
	ruler: 'reading-ruler',
	timeLeft: 'time-left',
	fontSize: 'font-size',
	lineSpacing: 'line-spacing',
	measure: 'measure',
	typeface: 'typeface'
};

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

/**
 * The theme the clock asks for, when `themeAuto` is on: daylight → white paper,
 * evening → warm paper, night → ink paper.
 */
export function themeForHour(hour: number): ThemePref {
	if (hour >= 6 && hour < 17) return 'light';
	if (hour >= 17 && hour < 20) return 'dusk';
	return 'dark';
}

/** The theme actually in force — the clock's, or the reader's fixed choice. */
export const effectiveTheme = (p: Prefs): ThemePref =>
	p.themeAuto ? themeForHour(new Date().getHours()) : p.theme;

/**
 * Has this reader ever chosen a theme?
 *
 * "No" is a real state, not the absence of one: with nothing stored the CSS
 * follows `prefers-color-scheme`, and the blocking script in `app.html` is
 * careful to stamp no `data-theme` at all so it can. Anything that writes the
 * attribute has to ask this first — otherwise changing the *measure* would
 * stamp `light` on a reader whose system is dark and flip the page under them.
 */
export function hasStoredTheme(): boolean {
	try {
		return (
			localStorage.getItem(STORAGE_KEYS.theme) !== null ||
			localStorage.getItem(STORAGE_KEYS.themeAuto) === 'true'
		);
	} catch {
		return false;
	}
}

export function loadPrefs(): Prefs {
	const p = { ...DEFAULT_PREFS };
	try {
		const get = (k: keyof Prefs) => localStorage.getItem(STORAGE_KEYS[k]);
		const oneOf = <T extends string>(value: string | null, allowed: T[]) =>
			value && (allowed as string[]).includes(value) ? (value as T) : undefined;

		p.theme = oneOf(get('theme'), THEMES) ?? p.theme;
		p.layout = oneOf(get('layout'), LAYOUTS) ?? p.layout;
		p.framing = oneOf(get('framing'), FRAMINGS) ?? p.framing;
		p.mode = oneOf(get('mode'), MODES) ?? p.mode;
		p.measure = oneOf(get('measure'), MEASURES) ?? p.measure;
		p.typeface = oneOf(get('typeface'), TYPEFACES) ?? p.typeface;

		// Booleans are stored as the strings production writes, and only an
		// explicit value overrides the default — a missing key is not a `false`.
		const bool = (value: string | null) =>
			value === 'true' ? true : value === 'false' ? false : undefined;
		p.themeAuto = bool(get('themeAuto')) ?? p.themeAuto;
		p.ruler = bool(get('ruler')) ?? p.ruler;
		p.timeLeft = bool(get('timeLeft')) ?? p.timeLeft;

		// Clamped rather than validated against the steps: a value stored by
		// another edition (or an older set of steps) is still a real setting,
		// and anything outside the readable range is the only thing to refuse.
		const size = parseFloat(get('fontSize') ?? '');
		if (!Number.isNaN(size)) p.fontSize = clamp(size, FONT_SIZE_MIN, FONT_SIZE_MAX);
		const spacing = parseFloat(get('lineSpacing') ?? '');
		if (!Number.isNaN(spacing)) {
			p.lineSpacing = clamp(spacing, LINE_SPACING_MIN, LINE_SPACING_MAX);
		}
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

/** Forget every setting, so the reader gets the page as it ships. */
export function clearPrefs() {
	try {
		for (const key of Object.values(STORAGE_KEYS)) localStorage.removeItem(key);
	} catch {
		// Nothing was stored to begin with.
	}
}

/**
 * Push every preference onto <html>, where the CSS and the components read it.
 *
 * `stampTheme` false leaves `data-theme` alone, for the reader who has never
 * picked one and is following their system — see `hasStoredTheme()`.
 */
export function applyPrefs(p: Prefs, stampTheme = true) {
	const el = document.documentElement;
	if (stampTheme) el.dataset.theme = effectiveTheme(p);
	el.dataset.layout = p.layout;
	el.dataset.framing = p.framing;
	el.dataset.readingMode = p.mode;
	el.dataset.measure = p.measure;
	el.dataset.typeface = p.typeface;
	// Present-or-absent rather than on/off: the CSS only ever asks whether the
	// cursor is on, and an absent attribute cannot half-match.
	if (p.ruler) el.dataset.ruler = 'on';
	else delete el.dataset.ruler;
	el.style.setProperty('--reading-fs', `${p.fontSize}px`);
	el.style.setProperty('--reading-lh', String(p.lineSpacing));
}
