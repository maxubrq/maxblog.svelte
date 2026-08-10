import { env } from '$env/dynamic/private';
import { site } from '$lib/site';
import type { Handle } from '@sveltejs/kit';

/**
 * Everything under here is the reader's own data: the letters they wrote and
 * the sessions they read in. It is guarded here, in one place, rather than on
 * the route — the production blog guards the *page* in middleware whose matcher
 * excludes `/api`, which leaves the API itself open. One rule, applied to the
 * prefix, cannot develop that gap.
 */
const PROTECTED = /^\/api\/signals(\/|$)/;
const USER = 'maxubrq';

/** Constant-time compare, so a wrong password cannot be found one byte at a time. */
function sameSecret(a: string, b: string): boolean {
	if (a.length !== b.length) return false;
	let diff = 0;
	for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
	return diff === 0;
}

function checkSignalsAuth(request: Request): Response | null {
	const expected = env.SIGNAL_PASSWORD;
	// No password configured means closed, never open. A deploy that forgets the
	// variable must not publish everyone's letters.
	if (!expected) return new Response(null, { status: 404 });

	const header = request.headers.get('authorization') ?? '';
	if (!header.startsWith('Basic ')) {
		return new Response(null, {
			status: 401,
			headers: { 'WWW-Authenticate': 'Basic realm="maxubrq"' }
		});
	}

	// Web-standard decode rather than `Buffer`: no @types/node needed, and it
	// reads the credentials as UTF-8 instead of latin1, so a non-ASCII password
	// compares as the bytes the browser actually sent.
	let decoded: string;
	try {
		const binary = atob(header.slice('Basic '.length));
		decoded = new TextDecoder().decode(Uint8Array.from(binary, (c) => c.charCodeAt(0)));
	} catch {
		return new Response(null, { status: 404 });
	}

	const colon = decoded.indexOf(':');
	const user = decoded.slice(0, colon);
	const password = decoded.slice(colon + 1);

	// Wrong credentials look like the route simply does not exist.
	if (user !== USER || !sameSecret(password, expected)) return new Response(null, { status: 404 });
	return null;
}

/**
 * Stamp `<html lang>` from the URL's locale prefix. Runs at prerender time, so
 * every static page ships with the right language attribute.
 */
export const handle: Handle = async ({ event, resolve }) => {
	if (PROTECTED.test(event.url.pathname)) {
		const denied = checkSignalsAuth(event.request);
		if (denied) return denied;
	}

	const prefix = event.url.pathname.split('/')[1];
	const lang = prefix === 'en' || prefix === 'vi' ? prefix : site.defaultLang;

	return resolve(event, {
		transformPageChunk: ({ html }) => html.replace('%lang%', lang)
	});
};
