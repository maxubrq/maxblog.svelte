/**
 * `/` has no content of its own — it decides which edition the reader gets.
 *
 * In order: the locale they last read in (cookie), then what their browser
 * asks for (`Accept-Language`), then the site default. This is the one route
 * that cannot be prerendered, because the answer is different per reader.
 *
 * It used to be a prerendered `308 → /en`, which was wrong twice over: it
 * ignored the reader entirely, and a 308 is cached by the browser *forever*,
 * so the very first visit decided the language permanently.
 */
import { LANG_COOKIE, isLang, negotiateLang } from '$lib/i18n';
import { site } from '$lib/site';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const prerender = false;

export const load: PageServerLoad = ({ cookies, request, setHeaders }) => {
	const remembered = cookies.get(LANG_COOKIE);
	const lang = isLang(remembered)
		? remembered
		: (negotiateLang(request.headers.get('accept-language')) ?? site.defaultLang);

	// The answer varies per reader, so no shared cache may keep it — and 307,
	// never 308: this decision must stay revisitable.
	setHeaders({
		'cache-control': 'no-store',
		vary: 'Cookie, Accept-Language'
	});

	redirect(307, `/${lang}`);
};
