/**
 * The site dictionary — one entry per marked term, shared by two readers of it:
 * the `/glossary` page, and the inline `<Term id="…">` mark inside an essay.
 * The definition lives here once; nothing restates it in an MDX file.
 *
 * The entries are copied from the production blog (`~/MyApps/maxblog/src/lib/glossary.ts`)
 * so both editions say the same thing about the same word. Only the appearance
 * links differ: essays are served from `/writing/` here, `/posts/` there.
 */

export interface GlossaryAppearance {
	title: string;
	slug: string;
	/** The heading the term was first used under — shown as context. */
	section: string;
}

/** The Vietnamese half of an entry. `term`/`pos` fall back to the English. */
export interface GlossaryLocale {
	term?: string;
	pos?: string;
	short: string;
	long: string;
	appearances?: GlossaryAppearance[];
}

export interface GlossaryEntry {
	term: string;
	/** `noun \u00b7 psychology` — part of speech and field, as printed. */
	pos: string;
	short: string;
	long: string;
	topic: string;
	appearances: GlossaryAppearance[];
	vi?: GlossaryLocale;
}

export type GlossaryTerms = Record<string, GlossaryEntry>;

export interface LocalizedEntry {
	term: string;
	pos: string;
	short: string;
	long: string;
	appearances: GlossaryAppearance[];
}

/** One entry in one locale, with the English text as the fallback throughout. */
export function getGlossaryLocale(entry: GlossaryEntry, lang: string): LocalizedEntry {
	if (lang === 'vi' && entry.vi) {
		return {
			term: entry.vi.term ?? entry.term,
			pos: entry.vi.pos ?? entry.pos,
			short: entry.vi.short,
			long: entry.vi.long,
			appearances: entry.vi.appearances ?? entry.appearances,
		};
	}
	return {
		term: entry.term,
		pos: entry.pos,
		short: entry.short,
		long: entry.long,
		appearances: entry.appearances,
	};
}

export { TERMS } from './glossary.data.js';

export const GLOSSARY_TOPICS = ['All', 'Science', 'Software', 'Philosophy', 'Art'] as const;
export type GlossaryTopic = (typeof GLOSSARY_TOPICS)[number];
