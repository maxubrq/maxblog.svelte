import { listPosts, preferLang } from '$lib/content/posts';
import { site, topicBySlug, topics, topicSlug } from '$lib/site';
import { error } from '@sveltejs/kit';
import type { EntryGenerator, PageServerLoad } from './$types';

export const entries: EntryGenerator = () => topics.map((t) => ({ topic: t.slug }));

export const load: PageServerLoad = async ({ params }) => {
	const topic = topicBySlug(params.topic);
	if (!topic) error(404, `No topic called “${params.topic}”`);

	const all = preferLang(await listPosts(), site.defaultLang);
	return {
		topic,
		index: topics.findIndex((t) => t.slug === topic.slug) + 1,
		of: topics.length,
		posts: all.filter((p) => topicSlug(p.topic) === topic.slug),
		foot: `maxubrq.space / ${topic.slug}`
	};
};
