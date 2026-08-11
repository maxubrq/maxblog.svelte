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
 * The doorways used to be listed here, as `{ slug, name }` pairs with their
 * blurbs off in the i18n catalogs. They now live in `$lib/topics`, which holds
 * the whole room — the editor's note, the three ways in, the scratchpad — and
 * translates the printed name while keeping the id canonical. Nothing about a
 * topic belongs in the chrome's own config.
 */
