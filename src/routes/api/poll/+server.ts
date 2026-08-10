/**
 * Polls inside interactive figures: one vote per session, and the tally.
 * Port of the production blog's `/api/poll`.
 */
import { badRequest, ok, readJson, requireDatabase, serverError } from '$lib/server/api';
import { db, schema } from '$lib/server/db';
import { eq, sql } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const prerender = false;

// Ids are authored in MDX, so they are known shapes, not free text.
const POLL_ID = /^[a-z0-9][a-z0-9-]{1,79}$/i;
const OPTION_ID = /^[A-Za-z0-9_-]{1,20}$/;

export const POST: RequestHandler = async ({ request }) => {
	const denied = requireDatabase();
	if (denied) return denied;

	try {
		const body = await readJson(request);
		if (!body) return badRequest('Invalid payload');

		const { pollId, optionId, sessionId, locale } = body;

		if (typeof pollId !== 'string' || !POLL_ID.test(pollId)) return badRequest('Invalid pollId');
		if (typeof optionId !== 'string' || !OPTION_ID.test(optionId)) {
			return badRequest('Invalid optionId');
		}
		if (typeof sessionId !== 'string' || sessionId.length < 6 || sessionId.length > 128) {
			return badRequest('Invalid sessionId');
		}

		await db()
			.insert(schema.pollVotes)
			.values({
				pollId,
				optionId,
				sessionId,
				locale: typeof locale === 'string' ? locale.slice(0, 8) : null
			})
			// Second vote from the same session is a no-op, not an error.
			.onConflictDoNothing({ target: [schema.pollVotes.pollId, schema.pollVotes.sessionId] });

		return ok();
	} catch (err) {
		return serverError('POST /api/poll', err);
	}
};

export const GET: RequestHandler = async ({ url }) => {
	const denied = requireDatabase();
	if (denied) return denied;

	try {
		const pollId = url.searchParams.get('pollId');
		if (!pollId || !POLL_ID.test(pollId)) return badRequest('Invalid pollId');

		const rows = await db()
			.select({ optionId: schema.pollVotes.optionId, count: sql<number>`count(*)::int` })
			.from(schema.pollVotes)
			.where(eq(schema.pollVotes.pollId, pollId))
			.groupBy(schema.pollVotes.optionId);

		const counts: Record<string, number> = {};
		let total = 0;
		for (const row of rows) {
			counts[row.optionId] = row.count;
			total += row.count;
		}

		return ok({ pollId, total, counts });
	} catch (err) {
		return serverError('GET /api/poll', err);
	}
};
