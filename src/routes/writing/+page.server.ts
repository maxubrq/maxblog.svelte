import { listPosts } from '$lib/content/posts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => ({
	posts: await listPosts(),
	foot: 'maxubrq.space / writing'
});
