import { assertLedger } from '$lib/content/numbers';
import { listPosts } from '$lib/content/posts';
import { langs, type Lang } from '$lib/i18n';
import type { EntryGenerator, PageServerLoad } from './$types';

export const entries: EntryGenerator = () => langs.map((lang) => ({ lang }));

/**
 * The home page is the archive (DESIGN.md §7.1): the newest essay set large,
 * then every other one by year. Each locale is its own edition and lists only
 * the posts written in it. The walk-in rooms stay out — see
 * `TopicData.unlisted`; their posts are reached through the room itself.
 */
export const load: PageServerLoad = async ({ params }) => {
	const lang = params.lang as Lang;
	const posts = (await listPosts({ includeUnlisted: false })).filter((p) => p.lang === lang);
	// The ledger is held to its rules here, where the listed set is known: a
	// build with an unnumbered or back-dated essay stops with the fix in hand.
	assertLedger(lang, posts);
	return { posts };
};
