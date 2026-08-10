/**
 * Shared bits for the write/read endpoints.
 *
 * All of them are prerender-exempt routes on an otherwise fully static site, so
 * they carry two rules the rest of the code does not need: never let a missing
 * database take the site down, and never echo a driver error to the caller.
 */
import { hasDatabase } from '$lib/server/db';
import { json } from '@sveltejs/kit';

/** No DB configured (a preview deploy, a fresh clone) — say so, do not throw. */
export function requireDatabase(): Response | null {
	return hasDatabase()
		? null
		: json({ error: 'Database not configured' }, { status: 503, headers: NO_STORE });
}

export const NO_STORE = { 'Cache-Control': 'no-store' };

export function badRequest(message: string): Response {
	return json({ error: message }, { status: 400, headers: NO_STORE });
}

/**
 * Log the real error, return an opaque one. A Postgres message can name tables,
 * columns and the host — none of that belongs in a public response body.
 */
export function serverError(where: string, err: unknown): Response {
	console.error(`[${where}]`, err);
	return json({ error: 'Internal error' }, { status: 500, headers: NO_STORE });
}

export function ok(body: Record<string, unknown> = { ok: true }): Response {
	return json(body, { headers: NO_STORE });
}

/** Parse a JSON body, or `null` when it is absent or malformed. */
export async function readJson(request: Request): Promise<Record<string, unknown> | null> {
	try {
		const body = await request.json();
		return body && typeof body === 'object' ? (body as Record<string, unknown>) : null;
	} catch {
		return null;
	}
}

/** A required string field, trimmed and length-capped. */
export function str(
	body: Record<string, unknown>,
	key: string,
	max: number
): string | null {
	const v = body[key];
	if (typeof v !== 'string') return null;
	const trimmed = v.trim();
	return trimmed ? trimmed.slice(0, max) : null;
}
