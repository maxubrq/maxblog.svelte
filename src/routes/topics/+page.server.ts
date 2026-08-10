import { listPosts, preferLang } from '$lib/content/posts';
import { site, topics, topicSlug } from '$lib/site';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const posts = preferLang(await listPosts(), site.defaultLang);

	return {
		doorways: topics.map((t) => ({
			...t,
			count: posts.filter((p) => topicSlug(p.topic) === t.slug).length
		})),
		foot: 'maxubrq.space / topics'
	};
};
