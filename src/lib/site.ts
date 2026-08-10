/** Everything the chrome says about itself. One place to edit. */
export const site = {
	name: 'maxubrq',
	url: 'https://maxubrq.space',
	domain: 'maxubrq.space',
	tagline: 'A notebook, kept in public · est. 2024',
	description:
		'Essays on science, technology, philosophy, and art — often with something you can play with.',
	volume: 'Vol.04 / 2026',
	/** Which translation indexes show when an essay exists in both languages. */
	defaultLang: 'en' as 'en' | 'vi',
	copyright: '© 2026',
	author: 'maxubrq',
	license: 'CC BY-NC 4.0',
	elsewhere: [
		['GitHub', '@maxubrq', 'https://github.com/maxubrq'],
		['Email', 'max @ maxubrq.com', 'mailto:max@maxubrq.com'],
		['RSS', '/feed.xml', '/feed.xml']
	] as const
};

/**
 * The doorways (§ topic pages). Order is the numbering on the hub. `name` is
 * canonical — it must match `topic` in frontmatter — and is not translated;
 * the blurbs live in the i18n catalogs (`topicBlurbs`).
 */
export const topics = [
	{ slug: 'science', name: 'Science' },
	{ slug: 'tech', name: 'Tech' },
	{ slug: 'philosophy', name: 'Philosophy' },
	{ slug: 'art', name: 'Art' },
	{ slug: 'thinking', name: 'Thinking' },
	{ slug: 'notes', name: 'Notes' }
] as const;

export type TopicSlug = (typeof topics)[number]['slug'];

export const topicBySlug = (slug: string) => topics.find((t) => t.slug === slug);

/** `Science` → `science`; anything unknown keeps its lowercase form. */
export const topicSlug = (name: string) => name.trim().toLowerCase();
