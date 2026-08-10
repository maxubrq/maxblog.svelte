/**
 * A reader's reaction to one passage — the marginal note of this notebook.
 * Port of the production blog's `/api/react`.
 */
import { badRequest, ok, readJson, requireDatabase, serverError, str } from '$lib/server/api';
import { db, schema } from '$lib/server/db';
import type { RequestHandler } from './$types';

// The root layout prerenders everything; this route has to opt out.
export const prerender = false;

const VALID = new Set(['resonates', 'thinking', 'confused', 'note', 'letter']);

export const POST: RequestHandler = async ({ request }) => {
	const denied = requireDatabase();
	if (denied) return denied;

	try {
		const body = await readJson(request);
		if (!body) return badRequest('Invalid payload');

		const postSlug = str(body, 'postSlug', 200);
		const passage = str(body, 'passage', 1000);
		const reaction = str(body, 'reaction', 20);

		if (!postSlug || !passage || !reaction || !VALID.has(reaction)) {
			return badRequest('Invalid payload');
		}

		await db().insert(schema.reactions).values({
			postSlug,
			passage,
			reaction,
			note: str(body, 'note', 2000),
			locale: str(body, 'locale', 8),
			sessionId: str(body, 'sessionId', 128)
		});

		return ok();
	} catch (err) {
		return serverError('POST /api/react', err);
	}
};
