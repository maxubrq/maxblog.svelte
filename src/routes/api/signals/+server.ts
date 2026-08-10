/**
 * The author's dashboard feed — everything, across every post: reader counts,
 * reactions, the letters themselves, and per-section reach. Port of the
 * production blog's `/api/signals`.
 *
 * PRIVATE. This is the one endpoint that returns letter text together with
 * session ids, so it is behind Basic auth in `hooks.server.ts`; nothing here
 * may be reused by a public route.
 */
import { badRequest, ok, readJson, requireDatabase, serverError } from '$lib/server/api';
import { db, schema } from '$lib/server/db';
import { countDistinct, desc, eq, inArray, ne, sql } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const prerender = false;

const { reactions, pageViews, sectionReach } = schema;

const countOf = (name: string) =>
	sql<number>`SUM(CASE WHEN ${reactions.reaction} = ${name} THEN 1 ELSE 0 END)::int`;
/** A letter is a `note` or a `letter`; both are prose the reader wrote. */
const LETTER_KINDS = ['note', 'letter'];
const letterCount = sql<number>`SUM(CASE WHEN ${reactions.reaction} IN ('note','letter') THEN 1 ELSE 0 END)::int`;
const unreadCount = sql<number>`SUM(CASE WHEN ${reactions.reaction} IN ('note','letter') AND ${reactions.readAt} IS NULL THEN 1 ELSE 0 END)::int`;
const finishedCount = sql<number>`COUNT(DISTINCT CASE WHEN ${pageViews.completedAt} IS NOT NULL THEN ${pageViews.sessionId} END)::int`;

export const GET: RequestHandler = async () => {
	const denied = requireDatabase();
	if (denied) return denied;

	try {
		const [[totals], [readers], readersByPost, reactionsByPost, passages, letters, sectionRows] =
			await Promise.all([
				db()
					.select({
						resonates: countOf('resonates'),
						thinking: countOf('thinking'),
						confused: countOf('confused'),
						letters: letterCount,
						unread: unreadCount
					})
					.from(reactions),

				db()
					.select({ total: countDistinct(pageViews.sessionId), finished: finishedCount })
					.from(pageViews),

				db()
					.select({
						postSlug: pageViews.postSlug,
						readers: countDistinct(pageViews.sessionId),
						finished: finishedCount
					})
					.from(pageViews)
					.groupBy(pageViews.postSlug),

				db()
					.select({
						postSlug: reactions.postSlug,
						resonates: countOf('resonates'),
						thinking: countOf('thinking'),
						confused: countOf('confused'),
						letters: letterCount,
						unread: unreadCount
					})
					.from(reactions)
					.groupBy(reactions.postSlug),

				db()
					.select({
						passage: reactions.passage,
						postSlug: reactions.postSlug,
						resonates: countOf('resonates'),
						thinking: countOf('thinking'),
						confused: countOf('confused'),
						total: sql<number>`COUNT(*)::int`
					})
					.from(reactions)
					.where(ne(reactions.reaction, 'note'))
					.groupBy(reactions.passage, reactions.postSlug)
					.orderBy(desc(sql`COUNT(*)`))
					.limit(20),

				db()
					.select({
						id: reactions.id,
						postSlug: reactions.postSlug,
						passage: reactions.passage,
						note: reactions.note,
						createdAt: reactions.createdAt,
						kind: reactions.reaction,
						sessionId: reactions.sessionId,
						readAt: reactions.readAt
					})
					.from(reactions)
					.where(inArray(reactions.reaction, LETTER_KINDS))
					.orderBy(desc(reactions.createdAt)),

				db()
					.select({
						postSlug: sectionReach.postSlug,
						sectionId: sectionReach.sectionId,
						sessions: countDistinct(sectionReach.sessionId)
					})
					.from(sectionReach)
					.groupBy(sectionReach.postSlug, sectionReach.sectionId)
			]);

		const readerCount = Object.fromEntries(readersByPost.map((r) => [r.postSlug, r.readers]));

		const sectionsByPost: Record<string, Array<{ id: string; sessions: number; reach: number }>> =
			{};
		for (const row of sectionRows) {
			const total = Number(readerCount[row.postSlug] ?? 1);
			(sectionsByPost[row.postSlug] ??= []).push({
				id: row.sectionId,
				sessions: Number(row.sessions),
				reach: Math.round((Number(row.sessions) / total) * 100)
			});
		}

		const byReaders = Object.fromEntries(readersByPost.map((r) => [r.postSlug, r]));
		const byReactions = Object.fromEntries(reactionsByPost.map((r) => [r.postSlug, r]));
		const slugs = [...new Set([...Object.keys(byReaders), ...Object.keys(byReactions)])];

		return ok({
			totals: {
				readers: Number(readers?.total ?? 0),
				finished: Number(readers?.finished ?? 0),
				resonates: Number(totals?.resonates ?? 0),
				thinking: Number(totals?.thinking ?? 0),
				confused: Number(totals?.confused ?? 0),
				letters: Number(totals?.letters ?? 0),
				unread: Number(totals?.unread ?? 0)
			},
			posts: slugs.map((slug) => ({
				slug,
				readers: Number(byReaders[slug]?.readers ?? 0),
				finished: Number(byReaders[slug]?.finished ?? 0),
				resonates: Number(byReactions[slug]?.resonates ?? 0),
				thinking: Number(byReactions[slug]?.thinking ?? 0),
				confused: Number(byReactions[slug]?.confused ?? 0),
				letters: Number(byReactions[slug]?.letters ?? 0),
				unread: Number(byReactions[slug]?.unread ?? 0),
				sections: sectionsByPost[slug] ?? []
			})),
			passages,
			letters
		});
	} catch (err) {
		return serverError('GET /api/signals', err);
	}
};

/** Mark one letter as read. */
export const PATCH: RequestHandler = async ({ request }) => {
	const denied = requireDatabase();
	if (denied) return denied;

	try {
		const body = await readJson(request);
		const id = body?.id;
		// The column is a uuid; anything else makes Postgres throw rather than 400.
		if (typeof id !== 'string' || !UUID.test(id)) return badRequest('Missing or invalid id');

		await db().update(reactions).set({ readAt: sql`NOW()` }).where(eq(reactions.id, id));
		return ok();
	} catch (err) {
		return serverError('PATCH /api/signals', err);
	}
};

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
