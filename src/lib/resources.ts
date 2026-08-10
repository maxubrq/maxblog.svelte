/**
 * The bibliography — every book, paper, standard and talk cited anywhere in the
 * writing, with a note on why it earned a place.
 *
 * Same relationship to `/resources` that `$lib/glossary` has to `/glossary`:
 * one module, read both by the index page and by the inline `<R>` citation
 * mark, so a source is described once. Entries are copied from the production
 * blog (`~/MyApps/maxblog/src/lib/resources.ts`); only the appearance links
 * differ, since essays are served from `/writing/` here.
 */

export type ResourceType =
	'book' | 'paper' | 'article' | 'documentation' | 'standard' | 'report' | 'talk';

export type ResourceTopic = 'Philosophy' | 'Science' | 'Software';

export interface ResourceAppearance {
	slug: string;
	title: string;
	locale: 'en' | 'vi';
}

/**
 * The Vietnamese reading of a resource — the note, and only the note.
 *
 * A book keeps its published title and an author keeps their name; those are
 * how you find the thing. The note is different: it is the author's own prose
 * explaining why the resource earned a place, so it needs both languages.
 */
export interface ResourceLocale {
	note: string;
}

export interface Resource {
	id: string;
	title: string;
	author: string;
	year?: string;
	type: ResourceType;
	topic: ResourceTopic;
	note: string;
	url?: string;
	/**
	 * Optional cover art — a book jacket, a paper's first page, a talk's still.
	 * Any URL; Cloudinary ones go through `$lib/images`. Unset means no image is
	 * shown, with no fallback: a wrong cover is worse than none.
	 */
	coverImage?: string;
	vi?: ResourceLocale;
	appearsIn: ResourceAppearance[];
}

/** The note as it should read in `lang`, falling back to English. */
export function getResourceNote(resource: Resource, lang: string): string {
	if (lang === 'vi' && resource.vi) return resource.vi.note;
	return resource.note;
}

import { getResourcesForSlug } from './resources.data.js';

export { RESOURCES, RESOURCES_BY_ID } from './resources.data.js';
export { getResourcesForSlug };

export const RESOURCE_TOPICS: ResourceTopic[] = ['Philosophy', 'Science', 'Software'];

/**
 * One post's bibliography, in the order the reader meets the sources.
 *
 * `citations` is written onto the post's metadata by the remark pass — the ids
 * of every `<R>` mark, in document order. Sources cited in `appearsIn` but
 * never mentioned in the prose still belong in the list, so they follow, in the
 * curated order.
 *
 * `<R>` and the end-of-essay bibliography both number off this one function, so
 * a numeral in the prose cannot disagree with the list below it.
 */
export function bibliographyFor(slug: string, citations?: string[]): Resource[] {
	// The data module types itself against this file, so TS widens the return
	// to `any` here; name the type back.
	const all: Resource[] = getResourcesForSlug(slug);
	if (!citations?.length) return all;

	const byId = new Map(all.map((r) => [r.id, r]));
	const mentioned = citations.map((id) => byId.get(id)).filter((r): r is Resource => Boolean(r));
	const rest = all.filter((r) => !citations.includes(r.id));
	return [...mentioned, ...rest];
}
