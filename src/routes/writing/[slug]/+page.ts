import { allSlugs, loadPost, translationOf } from '$lib/content/posts';
import { error } from '@sveltejs/kit';
import type { EntryGenerator, PageLoad } from './$types';

// Prerender one page per file in content/posts/ — drafts included, so the
// author can preview them by URL without them showing up in any index.
export const entries: EntryGenerator = () => allSlugs().map((slug) => ({ slug }));

export const load: PageLoad = async ({ params }) => {
	const post = await loadPost(params.slug);
	if (!post) error(404, `No essay called “${params.slug}”`);

	return {
		content: post.content,
		meta: post.meta,
		translation: translationOf(params.slug),
		foot: `maxubrq.space / ${post.meta.topic.toLowerCase()}`
	};
};
