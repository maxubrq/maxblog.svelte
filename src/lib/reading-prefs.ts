/**
 * Reading preferences — device-local, never sent anywhere.
 *
 * Two, and only two (DESIGN.md §4): the theme, and the size of the prose.
 * Everything else the page used to ask the reader is now decided by the page.
 *
 * The storage keys are the ones this site has always written (`theme`,
 * `font-size`), so a reader's earlier choice survives the cut. Every other key
 * an older version left behind is simply never read again.
 *
 * Both land on `<html>`: `data-theme` for the CSS, `--reading-fs` for the
 * prose. `applyPrefs()` is the only call needed to make a change visible.
 */

/** `system` is stored as no value at all, so the CSS follows the OS. */
export type ThemePref = 'system' | 'light' | 'dark';
export type TextSizePref = 17 | 18 | 20;

export const THEMES: ThemePref[] = ['system', 'light', 'dark'];
export const TEXT_SIZES: TextSizePref[] = [17, 18, 20];

export interface Prefs {
	theme: ThemePref;
	/** Prose size in px. The chrome never scales — it is not reading type. */
	fontSize: TextSizePref;
}

export const DEFAULT_PREFS: Prefs = { theme: 'system', fontSize: 18 };

const KEY = { theme: 'theme', fontSize: 'font-size' } as const;

/** The nearest step to a stored size, so an old free-form value still lands. */
export function nearestSize(px: number): TextSizePref {
	return TEXT_SIZES.reduce((best, s) => (Math.abs(s - px) < Math.abs(best - px) ? s : best));
}

export function loadPrefs(): Prefs {
	const p = { ...DEFAULT_PREFS };
	try {
		const theme = localStorage.getItem(KEY.theme);
		// `dusk` is gone; a reader who chose it chose a light page.
		if (theme === 'light' || theme === 'dusk') p.theme = 'light';
		else if (theme === 'dark') p.theme = 'dark';

		const size = parseFloat(localStorage.getItem(KEY.fontSize) ?? '');
		if (!Number.isNaN(size)) p.fontSize = nearestSize(size);
	} catch {
		// Private mode, or storage disabled — the defaults are a fine page.
	}
	return p;
}

export function savePrefs(p: Prefs) {
	try {
		if (p.theme === 'system') localStorage.removeItem(KEY.theme);
		else localStorage.setItem(KEY.theme, p.theme);
		if (p.fontSize === DEFAULT_PREFS.fontSize) localStorage.removeItem(KEY.fontSize);
		else localStorage.setItem(KEY.fontSize, String(p.fontSize));
	} catch {
		// A setting that cannot be remembered still applies for this visit.
	}
}

/** Push both preferences onto <html>, where the CSS reads them. */
export function applyPrefs(p: Prefs) {
	const el = document.documentElement;
	if (p.theme === 'system') delete el.dataset.theme;
	else el.dataset.theme = p.theme;
	if (p.fontSize === DEFAULT_PREFS.fontSize) el.style.removeProperty('--reading-fs');
	else el.style.setProperty('--reading-fs', `${p.fontSize}px`);
}
