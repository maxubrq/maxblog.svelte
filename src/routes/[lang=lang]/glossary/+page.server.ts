import { listPosts } from '$lib/content/posts';
import { langs, type Lang } from '$lib/i18n';
import type { EntryGenerator, PageServerLoad } from './$types';

export const entries: EntryGenerator = () => langs.map((lang) => ({ lang }));

/**
 * The glossary itself is static data, but which *appearances* are real is not:
 * an entry may cite an essay that is still a draft, or that only exists in the
 * other language. The page is given the slugs that actually publish in this
 * locale, and drops links to anything else.
 */
export const load: PageServerLoad = async ({ params }) => ({
	slugs: (await listPosts()).filter((p) => p.lang === (params.lang as Lang)).map((p) => p.slug),
	foot: 'maxubrq.space / glossary'
});
