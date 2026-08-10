/**
 * Reading telemetry: a session opened a post, finished it, or reached a
 * section. Port of the production blog's `/api/track`.
 *
 * Every write is idempotent per session — `onConflictDoNothing` against the
 * unique constraints — so a reader who reloads is still one reader.
 */
import { badRequest, ok, readJson, requireDatabase, serverError, str } from '$lib/server/api';
import { db, schema } from '$lib/server/db';
import { and, eq, sql } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const prerender = false;

export const POST: RequestHandler = async ({ request }) => {
	const denied = requireDatabase();
	if (denied) return denied;

	try {
		const body = await readJson(request);
		if (!body) return badRequest('Invalid payload');

		const type = str(body, 'type', 20);
		const postSlug = str(body, 'postSlug', 200);
		const sessionId = str(body, 'sessionId', 128);
		const locale = str(body, 'locale', 8);

		if (!type || !postSlug || !sessionId) return badRequest('Invalid payload');

		if (type === 'view') {
			await db()
				.insert(schema.pageViews)
				.values({ postSlug, sessionId, locale })
				.onConflictDoNothing();
		} else if (type === 'complete') {
			await db()
				.update(schema.pageViews)
				.set({ completedAt: sql`NOW()` })
				.where(
					and(eq(schema.pageViews.postSlug, postSlug), eq(schema.pageViews.sessionId, sessionId))
				);
		} else if (type === 'section') {
			const sectionId = str(body, 'sectionId', 200);
			if (!sectionId) return badRequest('Missing sectionId');
			await db()
				.insert(schema.sectionReach)
				.values({ postSlug, sectionId, sessionId })
				.onConflictDoNothing();
		} else {
			return badRequest('Unknown type');
		}

		return ok();
	} catch (err) {
		return serverError('POST /api/track', err);
	}
};
