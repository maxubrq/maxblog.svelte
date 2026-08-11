import { listPosts } from '$lib/content/posts';
import { langs, type Lang } from '$lib/i18n';
import type { ShelfSource } from '$lib/shelf';
import type { EntryGenerator, PageLoad } from './$types';

export const entries: EntryGenerator = () => langs.map((lang) => ({ lang }));

/**
 * The catalogue, and only the catalogue. The server hands over every post in
 * this locale so a spine can be lettered with a live title; *which* of them you
 * finished is read from your own device after mount and stays there. Nothing
 * about a reader is ever rendered on a server — which is also why this page can
 * stay prerendered static HTML like every other.
 */
export const load: PageLoad = async ({ params }) => {
	const sources: ShelfSource[] = (await listPosts())
		.filter((p) => p.lang === (params.lang as Lang))
		.map((p) => ({ slug: p.slug, title: p.title, topic: p.topic }));

	return { sources, foot: 'maxubrq.space / reading room' };
};
