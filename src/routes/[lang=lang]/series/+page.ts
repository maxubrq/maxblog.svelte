import { listPosts } from '$lib/content/posts';
import { langs, type Lang } from '$lib/i18n';
import { SERIES, resolveChapters, type ChapterPost } from '$lib/series';
import type { EntryGenerator, PageLoad } from './$types';

export const entries: EntryGenerator = () => langs.map((lang) => ({ lang }));

/**
 * The shelf resolves every arc, because a series row has to say how much of it
 * exists — and "3 of 8 written" is a fact about the posts, not about the arc.
 */
export const load: PageLoad = async ({ params }) => {
	const lang = params.lang as Lang;
	const posts = new Map<string, ChapterPost>(
		(await listPosts({ includeDrafts: true })).map((p) => [
			p.slug,
			{
				slug: p.slug,
				title: p.title,
				date: p.date,
				reading: p.reading,
				description: p.description,
				load: p.weather?.load,
				remember: p.rememberSentence
			}
		])
	);

	return {
		shelf: SERIES.map((s) => ({ id: s.id, chapters: resolveChapters(s, lang, posts) })),
		foot: 'maxubrq.space / series'
	};
};
