import { listPosts } from '$lib/content/posts';
import { langs, type Lang } from '$lib/i18n';
import { topics, topicSlug } from '$lib/site';
import type { EntryGenerator, PageServerLoad } from './$types';

export const entries: EntryGenerator = () => langs.map((lang) => ({ lang }));

export const load: PageServerLoad = async ({ params }) => {
	const posts = (await listPosts()).filter((p) => p.lang === (params.lang as Lang));

	return {
		doorways: topics.map((t) => ({
			slug: t.slug,
			name: t.name,
			count: posts.filter((p) => topicSlug(p.topic) === t.slug).length
		})),
		foot: 'maxubrq.space / topics'
	};
};
