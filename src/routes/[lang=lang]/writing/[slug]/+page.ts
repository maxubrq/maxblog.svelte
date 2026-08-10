import { listPosts, loadPost, translationOf } from '$lib/content/posts';
import type { Lang } from '$lib/i18n';
import { error } from '@sveltejs/kit';
import type { EntryGenerator, PageLoad } from './$types';

/**
 * One page per post, under the locale the post is written in — an English essay
 * has no /vi/… URL, its Vietnamese twin is a separate file with its own slug.
 * Drafts are included so the author can preview them by URL.
 */
export const entries: EntryGenerator = async () =>
	(await listPosts({ includeDrafts: true })).map((p) => ({ lang: p.lang, slug: p.slug }));

export const load: PageLoad = async ({ params }) => {
	const post = await loadPost(params.slug);
	if (!post) error(404, `No essay called “${params.slug}”`);
	if (post.meta.lang !== (params.lang as Lang)) {
		error(404, `“${params.slug}” is not published in /${params.lang}`);
	}

	return {
		content: post.content,
		meta: post.meta,
		translation: translationOf(params.slug),
		foot: `maxubrq.space / ${post.meta.topic.toLowerCase()}`
	};
};
