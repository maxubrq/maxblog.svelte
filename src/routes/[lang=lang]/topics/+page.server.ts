import { listPosts } from '$lib/content/posts';
import { langs, type Lang } from '$lib/i18n';
import { TOPICS_ORDER, TOPIC_CONTENT } from '$lib/topics';
import type { EntryGenerator, PageServerLoad } from './$types';

export const entries: EntryGenerator = () => langs.map((lang) => ({ lang }));

/**
 * The count under each doorway. A post files itself by writing a `topic` in its
 * frontmatter, and `frontmatterTopics` is the room's list of spellings it
 * answers to — `tech` takes both `Tech` and production's `Software`, which is
 * how an essay crosses between the two editions without an edit. Matched
 * case-insensitively for the same reason: the author is writing prose, not
 * keys.
 */
export const load: PageServerLoad = async ({ params }) => {
	const posts = (await listPosts()).filter((p) => p.lang === (params.lang as Lang));

	return {
		doorways: TOPICS_ORDER.map((id) => {
			const accepted = TOPIC_CONTENT[id].frontmatterTopics.map((t) => t.toLowerCase());
			return {
				id,
				count: posts.filter((p) => accepted.includes(p.topic?.toLowerCase() ?? '')).length
			};
		}),
		foot: 'maxubrq.space / topics'
	};
};
