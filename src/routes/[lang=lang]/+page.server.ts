import { listPosts } from '$lib/content/posts';
import { langs, type Lang } from '$lib/i18n';
import type { EntryGenerator, PageServerLoad } from './$types';

export const entries: EntryGenerator = () => langs.map((lang) => ({ lang }));

export const load: PageServerLoad = async ({ params }) => {
	// Each locale is its own edition: it lists only the posts written in it.
	const posts = (await listPosts()).filter((p) => p.lang === (params.lang as Lang));
	const [featured, ...rest] = posts;

	return {
		featured: featured ?? null,
		recent: rest.slice(0, 5),
		total: posts.length
	};
};
