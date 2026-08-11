import type { StarPost } from '$lib/components/reading-room/ReaderSky.svelte';
import { listPosts } from '$lib/content/posts';
import { langs, type Lang } from '$lib/i18n';
import type { ShelfSource } from '$lib/shelf';
import type { EntryGenerator, PageLoad } from './$types';

export const entries: EntryGenerator = () => langs.map((lang) => ({ lang }));

/**
 * The catalogue, and only the catalogue. The server hands over every post in
 * this locale so a spine can be lettered and a star can be named with a live
 * title; *which* of them you have read is taken from your own device after
 * mount and stays there. Nothing about a reader is ever rendered on a server —
 * which is also why this page can stay prerendered static HTML like every
 * other.
 *
 * Both sections read the same list, but they want different fields, so each
 * gets its own shape rather than one union that half-fits both.
 */
export const load: PageLoad = async ({ params }) => {
	const mine = (await listPosts()).filter((p) => p.lang === (params.lang as Lang));

	const sources: ShelfSource[] = mine.map((p) => ({
		slug: p.slug,
		title: p.title,
		topic: p.topic
	}));

	const stars: StarPost[] = mine.map((p) => ({
		slug: p.slug,
		title: p.title,
		topic: p.topic,
		// The hand-picked next reads become the citation edges of the sky.
		neighbors: (p.neighborhood ?? []).map((n) => n.slug)
	}));

	return { sources, stars, foot: 'maxubrq.space / reading room' };
};
