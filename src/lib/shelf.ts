/**
 * The read shelf — what you carried all the way to the end.
 *
 * Opening a piece earns nothing. A spine appears the moment you reach the last
 * line, and never because of a percentage. There are no ratings, no dates and
 * no tally: the shelf is the record, and its length is the only quantity, felt
 * rather than counted.
 *
 * Read out of `reading_memory` — the same store `PickUpWhereYouLeftOff` reads,
 * and the two are exact opposites: that one lists what you have *started* and
 * drops an essay the moment it is finished, this one lists only the finished.
 * Between them they account for every entry in the store.
 *
 * Joined against the posts that exist in the current locale, so a spine always
 * carries a live title. Client-side only; nothing here reaches a server.
 */

import { readMemory } from './reading-memory';

/** A post, as much as a spine needs to be lettered. */
export interface ShelfSource {
	slug: string;
	title: string;
	topic: string;
}

export interface Spine {
	slug: string;
	title: string;
	topic: string;
	/** Length of the piece, in minutes — sets how wide the spine is. */
	minutes: number;
	/** When you finished it. Used only to order the row, never displayed. */
	ts: number;
	/** Spine height in px, stable for the life of the piece. */
	height: number;
	/** Spine width in px. */
	width: number;
	/** A cream spine, to break up a row of dark ones. */
	light: boolean;
}

/**
 * A small stable hash of the slug. The design seeded a spine's dimensions from
 * its position in the list, which would reshuffle the whole shelf every time
 * you finished something new — a real shelf does not resize its books. Seeding
 * from the slug keeps each spine exactly as it was.
 */
function hash(s: string): number {
	let h = 0;
	for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
	return Math.abs(h);
}

export function spineOf(source: ShelfSource, minutes: number, ts: number): Spine {
	const seed = hash(source.slug) + source.title.length;
	return {
		slug: source.slug,
		title: source.title,
		topic: source.topic || 'Other',
		minutes,
		ts,
		// Uneven, the way a bound row is uneven — but uneven the same way forever.
		height: 300 + (seed % 5) * 22,
		width: 46 + (minutes % 4) * 7 + (seed % 3) * 4,
		light: seed % 3 === 0
	};
}

/**
 * The shelf, left to right in the order you finished things.
 *
 * `sources` carries only the posts published in the locale being viewed, which
 * is also what keeps the links honest: an essay belongs to exactly one locale,
 * so a Vietnamese reader's finished English essay simply does not appear on the
 * Vietnamese shelf rather than appearing with a link that 404s.
 */
export function readShelf(sources: ShelfSource[]): Spine[] {
	if (typeof window === 'undefined') return [];
	const bySlug = new Map(sources.map((s) => [s.slug, s]));

	return Object.values(readMemory())
		.filter((e) => e.finished && bySlug.has(e.slug))
		.map((e) => spineOf(bySlug.get(e.slug)!, Math.max(1, e.totalMin || 1), e.lastSeenTs))
		.sort((a, b) => a.ts - b.ts);
}

/**
 * Spine colour by subject, so the row reads as a shelf of different presses
 * rather than a chart. Only palette tokens — a spine has to survive the theme
 * switch, which a raw hex would not.
 *
 * Both spellings of the software room are here (`Tech` in this edition,
 * `Software` in production), because the store is shared between the two and a
 * spine may have been finished on either.
 */
const TONES: Record<string, string> = {
	Science: 'var(--blue)',
	Tech: 'var(--ink)',
	Software: 'var(--ink)',
	Philosophy: 'var(--blue-deep)',
	Thinking: 'var(--blue-deep)',
	Art: 'var(--blue)',
	Notes: 'var(--ink)'
};

export function toneOf(topic: string): string {
	return TONES[topic] ?? 'var(--ink)';
}
