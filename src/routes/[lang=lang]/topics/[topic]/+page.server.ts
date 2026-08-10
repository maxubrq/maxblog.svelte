import { listPosts } from '$lib/content/posts';
import { langs, type Lang } from '$lib/i18n';
import { topicBySlug, topics, topicSlug } from '$lib/site';
import { error } from '@sveltejs/kit';
import type { EntryGenerator, PageServerLoad } from './$types';

export const entries: EntryGenerator = () =>
	langs.flatMap((lang) => topics.map((t) => ({ lang, topic: t.slug })));

export const load: PageServerLoad = async ({ params }) => {
	const topic = topicBySlug(params.topic);
	if (!topic) error(404, `No topic called “${params.topic}”`);

	const all = (await listPosts()).filter((p) => p.lang === (params.lang as Lang));
	return {
		topic: { slug: topic.slug, name: topic.name },
		index: topics.findIndex((t) => t.slug === topic.slug) + 1,
		of: topics.length,
		posts: all.filter((p) => topicSlug(p.topic) === topic.slug),
		foot: `maxubrq.space / ${topic.slug}`
	};
};
