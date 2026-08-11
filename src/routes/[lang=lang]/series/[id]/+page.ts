import { listPosts } from '$lib/content/posts';
import { langs, type Lang } from '$lib/i18n';
import { SERIES, getSeries, resolveChapters, type ChapterPost } from '$lib/series';
import { error } from '@sveltejs/kit';
import type { EntryGenerator, PageLoad } from './$types';

/**
 * One page per arc per locale. With `SERIES` empty this generates nothing at
 * all, which is correct — there is no arc to prerender — and the route starts
 * building the moment an arc is added.
 */
export const entries: EntryGenerator = () =>
	langs.flatMap((lang) => SERIES.map((s) => ({ lang, id: s.id })));

export const load: PageLoad = async ({ params }) => {
	const series = getSeries(params.id);
	if (!series) error(404, `No series called “${params.id}”`);

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
		id: series.id,
		chapters: resolveChapters(series, lang, posts),
		foot: `maxubrq.space / ${series.id}`
	};
};
