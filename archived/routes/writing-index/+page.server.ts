import { listPosts } from '$lib/content/posts';
import { langs, type Lang } from '$lib/i18n';
import type { EntryGenerator, PageServerLoad } from './$types';

export const entries: EntryGenerator = () => langs.map((lang) => ({ lang }));

/**
 * The archive is everything the site publishes *at* a reader. The walk-in
 * rooms are not that — their posts are reached through the room itself, so
 * they are left out here and out of the filter bar (see `TopicData.unlisted`).
 */
export const load: PageServerLoad = async ({ params }) => ({
	posts: (await listPosts({ includeUnlisted: false })).filter(
		(p) => p.lang === (params.lang as Lang)
	),
	foot: `maxubrq.space / writing`
});
