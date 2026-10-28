import { listPosts } from '$lib/content/posts';
import { langs, type Lang } from '$lib/i18n';
import type { ShelfSource } from '$lib/shelf';
import type { EntryGenerator, PageLoad } from './$types';

export const entries: EntryGenerator = () => langs.map((lang) => ({ lang }));

/**
 * The catalogue, and only the catalogue: every post in this locale, so a row
 * can carry a live title. *Which* of them you have read is taken from your own
 * device after mount and stays there — nothing about a reader is rendered on a
 * server, which is why this page can stay prerendered like every other.
 */
export const load: PageLoad = async ({ params }) => {
	const sources: ShelfSource[] = (await listPosts())
		.filter((p) => p.lang === (params.lang as Lang))
		.map((p) => ({ slug: p.slug, title: p.title, topic: p.topic }));
	return { sources };
};
