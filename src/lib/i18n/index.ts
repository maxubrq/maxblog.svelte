import { getContext, setContext } from 'svelte';
import { langs, messages, type Lang, type Messages } from './messages';

export { fill, langs, messages, type Lang, type Messages } from './messages';

const KEY = Symbol('i18n');

export interface I18n {
	readonly lang: Lang;
	readonly t: Messages;
	/** The other locale — what the switcher offers. */
	readonly other: Lang;
}

/**
 * Publish the active locale from the `[lang]` layout. `getLang` is a getter, not
 * a value: the layout component survives a navigation from /en to /vi, so the
 * context has to read the current param each time rather than capture it once.
 */
export function setI18n(getLang: () => Lang): I18n {
	const ctx: I18n = {
		get lang() {
			return getLang();
		},
		get t() {
			return messages[getLang()];
		},
		get other() {
			return getLang() === 'en' ? 'vi' : 'en';
		}
	};
	setContext(KEY, ctx);
	return ctx;
}

/** Read the active locale from any descendant, including components used in MDX. */
export function useI18n(): I18n {
	const ctx = getContext<I18n | undefined>(KEY);
	// Fall back to English rather than crash a component rendered outside a locale.
	return (
		ctx ?? {
			lang: 'en' as Lang,
			t: messages.en,
			other: 'vi' as Lang
		}
	);
}

/**
 * Where the reader's own choice of locale is remembered. Written in the browser
 * by the `[lang]` layout on every locale page, read on the server by `/` to
 * decide where to send them. A cookie rather than localStorage because the
 * decision has to be made before any JavaScript runs.
 */
export const LANG_COOKIE = 'lang';
export const LANG_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export const isLang = (value: unknown): value is Lang =>
	typeof value === 'string' && (langs as readonly string[]).includes(value);

/**
 * Pick a locale from an `Accept-Language` header — the reader's browser
 * preference, used when they have no choice on record yet. Returns `null` when
 * the header names nothing this site publishes, so the caller can fall back to
 * the site default rather than guess.
 *
 * `vi-VN` counts as `vi`: the header carries regions, the site does not.
 */
export function negotiateLang(header: string | null): Lang | null {
	if (!header) return null;

	const ranked = header
		.split(',')
		.map((part) => {
			const [tag, ...params] = part.trim().split(';');
			const q = params.find((p) => p.trim().startsWith('q='));
			return { tag: tag.trim().toLowerCase(), q: q ? Number(q.split('=')[1]) : 1 };
		})
		.filter((entry) => entry.tag && !Number.isNaN(entry.q) && entry.q > 0)
		.sort((a, b) => b.q - a.q);

	for (const { tag } of ranked) {
		if (tag === '*') return null;
		const base = tag.split('-')[0];
		if (isLang(base)) return base;
	}
	return null;
}

/** `/writing` → `/vi/writing`. Paths are always authored locale-less. */
export const href = (lang: Lang, path = '/') => `/${lang}${path === '/' ? '' : path}`;

/** Swap the locale prefix on a full pathname: `/en/topics` → `/vi/topics`. */
export function swapLocale(pathname: string, lang: Lang) {
	const rest = pathname.replace(/^\/(en|vi)(?=\/|$)/, '');
	return href(lang, rest || '/');
}
