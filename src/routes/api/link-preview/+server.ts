/**
 * What is behind an outbound link — title, description, host.
 *
 * This exists on the server for one reason: a browser cannot read another
 * origin's `<head>`. It is the sixth prerender-exempt route on an otherwise
 * fully static site, and the only one that is not about the reader — it fetches
 * a *public* page on their behalf and returns three strings from it.
 *
 * Port of the production blog's `/api/link-preview`, hardened. That version
 * checks the protocol and nothing else, which leaves the server willing to
 * fetch anything the caller names — including addresses only the server can
 * reach. On a cloud host that is a live SSRF: `http://169.254.169.254/…` is the
 * instance metadata service. The guard below is the substantive difference.
 */
import { badRequest } from '$lib/server/api';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// The root layout prerenders everything; this route has to opt out.
export const prerender = false;

/** A page's own `<head>` is rarely near the top of a big document, but it is
 *  never megabytes in. Stop reading once we have plausibly passed it. */
const MAX_BYTES = 512 * 1024;
const TIMEOUT_MS = 5000;
const MAX_REDIRECTS = 3;

/**
 * Hosts the server can reach but the public cannot.
 *
 * Matched on the literal hostname, which is the honest limit of this check: a
 * name that *resolves* to a private address still passes, and so does DNS
 * rebinding between this check and the fetch. Closing those needs resolution
 * plus a pinned-IP connection, which the platform's fetch does not expose. What
 * this does close is the whole class of attacks that simply names the address.
 */
const BLOCKED = [
	/^localhost$/i,
	/\.localhost$/i,
	/^\[?::1\]?$/,
	/^0\.0\.0\.0$/,
	/^127\./,
	/^10\./,
	/^192\.168\./,
	/^172\.(1[6-9]|2\d|3[01])\./,
	/^169\.254\./, // link-local — the cloud metadata service lives here
	/^\[?f[cd][0-9a-f]{2}:/i, // IPv6 unique-local
	/^\[?fe80:/i, // IPv6 link-local
	/\.internal$/i,
	/\.local$/i
];

function allowed(u: URL): boolean {
	if (u.protocol !== 'http:' && u.protocol !== 'https:') return false;
	const host = u.hostname.replace(/^\[|\]$/g, '');
	return !BLOCKED.some((re) => re.test(host));
}

function decodeEntities(s: string): string {
	return s
		.replace(/&amp;/g, '&')
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'")
		.replace(/&apos;/g, "'")
		.replace(/&nbsp;/g, ' ');
}

function meta(html: string, ...patterns: RegExp[]): string | null {
	for (const p of patterns) {
		const m = html.match(p);
		if (m?.[1]) return decodeEntities(m[1].trim()).slice(0, 400);
	}
	return null;
}

/**
 * Follow redirects by hand, so every hop is checked. `redirect: 'follow'` would
 * let a public URL bounce the server onto a private one — the guard has to
 * apply to where it lands, not only to where it was pointed.
 */
async function fetchHead(start: URL, signal: AbortSignal): Promise<{ url: URL; html: string }> {
	let url = start;
	for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
		const res = await fetch(url.href, {
			signal,
			redirect: 'manual',
			headers: { 'User-Agent': 'maxubrq-blog/1.0 (link preview)', Accept: 'text/html' }
		});

		if (res.status >= 300 && res.status < 400) {
			const location = res.headers.get('location');
			if (!location) throw new Error('redirect without location');
			const next = new URL(location, url);
			if (!allowed(next)) throw new Error('redirect to a blocked host');
			url = next;
			continue;
		}

		if (!res.ok) throw new Error(`HTTP ${res.status}`);
		if (!res.headers.get('content-type')?.includes('text/html')) throw new Error('not html');

		// Read to the cap rather than buffering whatever is served.
		const reader = res.body?.getReader();
		if (!reader) return { url, html: '' };
		const chunks: Uint8Array[] = [];
		let size = 0;
		while (size < MAX_BYTES) {
			const { done, value } = await reader.read();
			if (done) break;
			chunks.push(value);
			size += value.length;
		}
		await reader.cancel().catch(() => {});
		return { url, html: new TextDecoder().decode(concat(chunks, size)) };
	}
	throw new Error('too many redirects');
}

function concat(chunks: Uint8Array[], size: number): Uint8Array {
	const out = new Uint8Array(size);
	let at = 0;
	for (const c of chunks) {
		out.set(c.subarray(0, Math.min(c.length, size - at)), at);
		at += c.length;
		if (at >= size) break;
	}
	return out;
}

export const GET: RequestHandler = async ({ url: request }) => {
	const raw = request.searchParams.get('url');
	if (!raw) return badRequest('Missing url');

	let target: URL;
	try {
		target = new URL(raw);
	} catch {
		return badRequest('Invalid url');
	}
	if (!allowed(target)) return badRequest('Invalid url');

	/**
	 * A failure is not an error the reader should see: the card falls back to
	 * the bare host, which is still true and still useful. So every path below
	 * answers 200 — only the cache header says how much to trust it.
	 */
	const nothing = {
		title: null,
		description: null,
		url: target.href,
		hostname: target.hostname
	};

	const controller = new AbortController();
	const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
	try {
		const { url: final, html } = await fetchHead(target, controller.signal);

		const title = meta(
			html,
			/<meta\s+property=["']og:title["']\s+content=["']([^"']+)["']/i,
			/<meta\s+content=["']([^"']+)["']\s+property=["']og:title["']/i,
			/<title[^>]*>([^<]{1,200})<\/title>/i
		);
		const description = meta(
			html,
			/<meta\s+property=["']og:description["']\s+content=["']([^"']+)["']/i,
			/<meta\s+content=["']([^"']+)["']\s+property=["']og:description["']/i,
			/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i,
			/<meta\s+content=["']([^"']+)["']\s+name=["']description["']/i
		);

		return json(
			{ title, description, url: final.href, hostname: final.hostname },
			{ headers: { 'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800' } }
		);
	} catch {
		// Short cache on a miss: the site may simply have been down for a minute.
		return json(nothing, { headers: { 'Cache-Control': 'public, max-age=300' } });
	} finally {
		clearTimeout(timer);
	}
};
