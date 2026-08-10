import { listPosts } from '$lib/content/posts';
import { langs, type Lang } from '$lib/i18n';
import type { EntryGenerator, PageServerLoad } from './$types';

export const entries: EntryGenerator = () => langs.map((lang) => ({ lang }));

export const load: PageServerLoad = async ({ params }) => ({
	posts: (await listPosts()).filter((p) => p.lang === (params.lang as Lang)),
	foot: `maxubrq.space / writing`
});
