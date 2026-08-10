/**
 * What one essay's readers did with it — the public side of the record: how
 * many finished, which passages they marked, the anonymous letters, and how far
 * down the page the room thinned out. Port of the production blog's
 * `/api/witness`.
 *
 * Public on purpose, unlike `/api/signals`: it is scoped to one post, carries no
 * session ids, and returns at most five letters.
 */
import { badRequest, ok, requireDatabase, serverError } from '$lib/server/api';
import { db, schema } from '$lib/server/db';
import { and, eq, isNotNull, sql } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const prerender = false;

const { reactions, pageViews, sectionReach } = schema;

/** `SUM(CASE WHEN reaction = x THEN 1 ELSE 0 END)::int`, once. */
const countOf = (name: string) =>
	sql<number>`SUM(CASE WHEN ${reactions.reaction} = ${name} THEN 1 ELSE 0 END)::int`;

export const GET: RequestHandler = async ({ url }) => {
	const denied = requireDatabase();
	if (denied) return denied;

	try {
		const slug = url.searchParams.get('slug');
		if (!slug) return badRequest('slug required');

		// Section ids in article order, for the retention sparkline.
		const ordered = (url.searchParams.get('sections') ?? '').split(',').filter(Boolean);

		const [passages, [readersRow], [totals], letterRows, reachRows] = await Promise.all([
			db()
				.select({
					passage: reactions.passage,
					resonates: countOf('resonates'),
					thinking: countOf('thinking'),
					confused: countOf('confused'),
					note: countOf('note'),
					total: sql<number>`COUNT(*)::int`
				})
				.from(reactions)
				.where(eq(reactions.postSlug, slug))
				.groupBy(reactions.passage)
				.orderBy(sql`COUNT(*) DESC`)
				.limit(30),

			db()
				.select({
					readers: sql<number>`COUNT(DISTINCT CASE WHEN ${pageViews.completedAt} IS NOT NULL THEN ${pageViews.sessionId} END)::int`
				})
				.from(pageViews)
				.where(eq(pageViews.postSlug, slug)),

			db()
				.select({
					resonates: countOf('resonates'),
					thinking: countOf('thinking'),
					confused: countOf('confused'),
					total: sql<number>`COUNT(*)::int`
				})
				.from(reactions)
				.where(eq(reactions.postSlug, slug)),

			db()
				.select({ text: reactions.note, createdAt: reactions.createdAt })
				.from(reactions)
				.where(
					and(
						eq(reactions.postSlug, slug),
						eq(reactions.reaction, 'note'),
						isNotNull(reactions.note)
					)
				)
				.orderBy(reactions.createdAt)
				.limit(5),

			db()
				.select({
					sectionId: sectionReach.sectionId,
					count: sql<number>`COUNT(DISTINCT ${sectionReach.sessionId})::int`
				})
				.from(sectionReach)
				.where(eq(sectionReach.postSlug, slug))
				.groupBy(sectionReach.sectionId)
		]);

		const readers = readersRow?.readers ?? 0;
		const reach = Object.fromEntries(reachRows.map((r) => [r.sectionId, r.count]));

		return ok({
			readers,
			passages,
			reactionTotals: {
				resonates: totals?.resonates ?? 0,
				thinking: totals?.thinking ?? 0,
				confused: totals?.confused ?? 0,
				total: totals?.total ?? 0
			},
			letters: letterRows
				.filter((l) => l.text && l.text.trim())
				.map((l) => ({ text: l.text!, createdAt: l.createdAt.toISOString() })),
			sections: ordered.map((id) => ({
				sectionId: id,
				pct: readers > 0 ? (reach[id] ?? 0) / readers : 0
			}))
		});
	} catch (err) {
		return serverError('GET /api/witness', err);
	}
};
