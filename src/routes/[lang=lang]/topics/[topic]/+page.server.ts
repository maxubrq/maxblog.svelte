import { listPosts } from '$lib/content/posts';
import { langs, type Lang } from '$lib/i18n';
import { TOPICS_ORDER, TOPIC_CONTENT, getTopicLocale, type TopicId } from '$lib/topics';
import { error } from '@sveltejs/kit';
import type { EntryGenerator, PageServerLoad } from './$types';

export const entries: EntryGenerator = () =>
	langs.flatMap((lang) => TOPICS_ORDER.map((topic) => ({ lang, topic })));

export const load: PageServerLoad = async ({ params }) => {
	const id = params.topic as TopicId;
	const data = TOPIC_CONTENT[id];
	if (!data) error(404, `No topic called “${params.topic}”`);

	const lang = params.lang as Lang;
	const accepted = data.frontmatterTopics.map((t) => t.toLowerCase());
	const filed = (await listPosts()).filter(
		(p) => p.lang === lang && accepted.includes(p.topic?.toLowerCase() ?? '')
	);

	/**
	 * The three hand-picked ways in are already printed at the top, so the
	 * chronological tail leaves them out — the same essay twice on one page
	 * reads as a bug, and the count in the masthead still says how many the
	 * room holds altogether. A starter with no slug is an essay not written
	 * yet and excludes nothing.
	 */
	const starters = new Set(
		getTopicLocale(data, lang)
			.starters.map((s) => s.slug)
			.filter((s): s is string => s !== null)
	);

	return {
		id,
		index: TOPICS_ORDER.indexOf(id) + 1,
		of: TOPICS_ORDER.length,
		total: filed.length,
		posts: filed.filter((p) => !starters.has(p.slug)),
		foot: `maxubrq.space / ${id}`
	};
};
