import { listPosts, preferLang } from '$lib/content/posts';
import { site } from '$lib/site';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	// One row per essay: the site's default language wins, the translation is
	// offered on the article page itself.
	const posts = preferLang(await listPosts(), site.defaultLang);
	const [featured, ...rest] = posts;

	return {
		featured: featured ?? null,
		recent: rest.slice(0, 5),
		total: posts.length
	};
};
