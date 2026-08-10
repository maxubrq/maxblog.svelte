import { site } from '$lib/site';
import type { Handle } from '@sveltejs/kit';

/**
 * Stamp `<html lang>` from the URL's locale prefix. Runs at prerender time, so
 * every static page ships with the right language attribute.
 */
export const handle: Handle = async ({ event, resolve }) => {
	const prefix = event.url.pathname.split('/')[1];
	const lang = prefix === 'en' || prefix === 'vi' ? prefix : site.defaultLang;

	return resolve(event, {
		transformPageChunk: ({ html }) => html.replace('%lang%', lang)
	});
};
