import { listPosts } from '$lib/content/posts';
import { langs, type Lang } from '$lib/i18n';
import type { EntryGenerator, PageServerLoad } from './$types';

export const entries: EntryGenerator = () => langs.map((lang) => ({ lang }));

/**
 * Same availability rule as the glossary: a resource belongs here only if an
 * essay a reader can actually open cites it. The page is given the slugs that
 * publish in this locale and narrows each entry's citations to those.
 */
export const load: PageServerLoad = async ({ params }) => ({
	slugs: (await listPosts()).filter((p) => p.lang === (params.lang as Lang)).map((p) => p.slug),
	foot: 'maxubrq.space / resources'
});
