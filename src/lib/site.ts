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

/** The four doorways (§ topic pages). Order is the numbering on the hub. */
export const topics = [
	{
		slug: 'science',
		name: 'Science',
		blurb:
			'Mostly physics and math, sometimes biology. The essays that begin with a small mechanical fact and end somewhere I did not expect.'
	},
	{
		slug: 'tech',
		name: 'Tech',
		blurb: 'Software, and the shape of thinking it asks of you.'
	},
	{
		slug: 'philosophy',
		name: 'Philosophy',
		blurb: 'Attention, time, what it means to know a thing.'
	},
	{ slug: 'art', name: 'Art', blurb: 'Painting, music, the logic of composition.' },
	{
		slug: 'thinking',
		name: 'Thinking',
		blurb: 'Looking back, and looking at how the looking is done.'
	},
	{ slug: 'notes', name: 'Notes', blurb: 'Shorter pieces — a single idea, kept.' }
] as const;

export type TopicSlug = (typeof topics)[number]['slug'];

export const topicBySlug = (slug: string) => topics.find((t) => t.slug === slug);

/** `Science` → `science`; anything unknown keeps its lowercase form. */
export const topicSlug = (name: string) => name.trim().toLowerCase();
