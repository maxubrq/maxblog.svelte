import { getContext, setContext } from 'svelte';
import { messages, type Lang, type Messages } from './messages';

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

/** `/writing` → `/vi/writing`. Paths are always authored locale-less. */
export const href = (lang: Lang, path = '/') => `/${lang}${path === '/' ? '' : path}`;

/** Swap the locale prefix on a full pathname: `/en/topics` → `/vi/topics`. */
export function swapLocale(pathname: string, lang: Lang) {
	const rest = pathname.replace(/^\/(en|vi)(?=\/|$)/, '');
	return href(lang, rest || '/');
}
