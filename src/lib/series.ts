/**
 * Series — an argument built across an arc, not several posts sharing a tag.
 *
 * The data layer is the whole point of this module, and it exists because a
 * series has to be able to describe **chapters that are not written yet**. A
 * post can only ever say "I belong to a series"; it cannot say how long the arc
 * is, what order it runs in, or what a reader should carry from one part into
 * the next. So the arc is authored here and the posts are looked up from it —
 * not the other way round.
 *
 * That is what `resolveChapters` does: every chapter is a *declaration*, and
 * the fallbacks carry the promise until a post exists to replace them. An
 * unwritten chapter still prints, still holds its place in the arc, and is
 * simply not a link.
 *
 * The frontmatter `series` / `chapter` fields this edition already parses are
 * for the essay's own tag row. They are not the source of the arc.
 *
 * Shapes are production's (`~/MyApps/maxblog/src/lib/series.ts`) so a series
 * moves across without an edit; the visual treatment follows
 * `maxubrq/project/pages/InkSeries.jsx` — contract · arc · bridge · threads.
 *
 * ## `SERIES` is empty on purpose
 *
 * Nothing is finished yet, so there is no arc to describe. Everything below is
 * the machinery, and it is all written and wired: add one object to `SERIES`
 * and `/series`, `/series/[id]` and the ribbon in the article all light up
 * together. Until then every one of those surfaces renders its empty state,
 * which is the honest thing for a shelf with nothing on it.
 */

import { long } from './format';
import type { Lang } from './i18n';

export interface SeriesChapterLocale {
	fallbackTitle?: string;
	fallbackDate?: string;
	/** The handoff into this chapter, in Vietnamese. */
	bridge?: string;
}

export interface SeriesChapterRef {
	/** The roman numeral printed on the arc — I · II · III. */
	num: string;
	/**
	 * What a reader should carry into this chapter from the last one — the
	 * author's own handoff, written per chapter. A series is a bigger contract
	 * than one piece, and a "next" button is not a bridge.
	 */
	bridge?: string;
	slug: string;
	viSlug?: string;
	/** Stands in until the post exists. An unwritten chapter still has a title. */
	fallbackTitle: string;
	fallbackDate: string;
	fallbackMin?: number;
	draft?: boolean;
	vi?: SeriesChapterLocale;
}

/**
 * A leitmotif running across the arc — an idea lit in one chapter that pays off
 * in another. Kept visible so a chapter read three weeks after the last one
 * still lands where it should. `parts` holds 1-based chapter positions.
 */
export interface SeriesThread {
	label: string;
	parts: number[];
}

export interface SeriesLocale {
	title?: string;
	subtitle?: string;
	letter?: string[];
	threads?: SeriesThread[];
}

export interface SeriesData {
	id: string;
	title: string;
	subtitle: string;
	topic: string;
	state: 'in-progress' | 'complete';
	volume: string;
	started: string;
	completed?: string;
	/** `'open-ended'` when the author does not yet know how long the arc is. */
	chapterCount: number | 'open-ended';
	/** The editor's letter — why this is a series and not several posts. */
	letter: string[];
	chapters: SeriesChapterRef[];
	threads?: SeriesThread[];
	/** A plain Cloudinary delivery URL; `$lib/images` adds the transformations. */
	coverImage?: string;
	vi?: SeriesLocale;
}

/** A chapter with its post joined in — or with the promise still standing. */
export interface ResolvedChapter {
	num: string;
	slug: string;
	title: string;
	min: number;
	date: string;
	draft?: boolean;
	/** Is there a post behind this chapter yet? Unwritten chapters do not link. */
	exists: boolean;
	description?: string;
	/** The chapter's own difficulty, from its weather. Undefined when unwritten. */
	load?: number;
	remember?: string;
	bridge?: string;
}

/** What a chapter is to *this* reader. Device-local; see `seriesProgress`. */
export type ChapterState = 'read' | 'current' | 'ahead';

export const SERIES: SeriesData[] = [];

export function getAllSeries(): SeriesData[] {
	return SERIES;
}

export function getSeries(id: string): SeriesData | null {
	return SERIES.find((s) => s.id === id) ?? null;
}

/** The arc a post belongs to, found by slug in either locale. */
export function getSeriesForPost(
	slug: string
): { series: SeriesData; chapter: SeriesChapterRef; index: number } | null {
	for (const series of SERIES) {
		const index = series.chapters.findIndex((c) => c.slug === slug || c.viSlug === slug);
		if (index >= 0) return { series, chapter: series.chapters[index], index };
	}
	return null;
}

/** One arc in one locale, with the English text as the fallback per field. */
export function getSeriesLocale(
	series: SeriesData,
	lang: string
): { title: string; subtitle: string; letter: string[]; threads: SeriesThread[] } {
	if (lang === 'vi' && series.vi) {
		return {
			title: series.vi.title ?? series.title,
			subtitle: series.vi.subtitle ?? series.subtitle,
			letter: series.vi.letter ?? series.letter,
			threads: series.vi.threads ?? series.threads ?? []
		};
	}
	return {
		title: series.title,
		subtitle: series.subtitle,
		letter: series.letter,
		threads: series.threads ?? []
	};
}

/** The minimum a chapter needs from a post to stop being a promise. */
export interface ChapterPost {
	slug: string;
	title: string;
	date: string;
	reading: number;
	description?: string;
	load?: number;
	remember?: string;
}

/**
 * Join the arc to the posts that exist.
 *
 * `posts` is passed in rather than imported: post loading is async in this
 * edition (mdsvex modules behind `import.meta.glob`), and a module that reaches
 * for them would make every caller async for no reason. The route already has
 * the catalogue.
 */
export function resolveChapters(
	series: SeriesData,
	lang: Lang,
	posts: Map<string, ChapterPost>
): ResolvedChapter[] {
	return series.chapters.map((c) => {
		const slug = lang === 'vi' && c.viSlug ? c.viSlug : c.slug;
		const post = posts.get(slug);
		const bridge = (lang === 'vi' && c.vi?.bridge) || c.bridge;

		if (post) {
			return {
				num: c.num,
				slug,
				title: post.title,
				min: post.reading,
				date: long(post.date, lang),
				draft: c.draft,
				exists: true,
				description: post.description,
				load: post.load,
				remember: post.remember,
				bridge
			};
		}

		return {
			num: c.num,
			slug,
			title: (lang === 'vi' && c.vi?.fallbackTitle) || c.fallbackTitle,
			min: c.fallbackMin ?? 0,
			date: (lang === 'vi' && c.vi?.fallbackDate) || c.fallbackDate,
			draft: c.draft,
			exists: false,
			bridge
		};
	});
}

/**
 * Where the reader stands in the arc — the one thing that is not authored.
 *
 * `finished` is the set of slugs the reader carried to the end, read out of
 * reading memory by the caller (this module stays free of `localStorage` so it
 * can be used on the server). The current chapter is the first one they have
 * *not* finished: a series is read forwards, and the place to stand is the
 * first door still shut.
 */
export function seriesProgress(
	chapters: ResolvedChapter[],
	finished: Set<string>
): { states: ChapterState[]; currentIndex: number; readMin: number; totalMin: number } {
	const currentIndex = chapters.findIndex((c) => !finished.has(c.slug));
	const states = chapters.map((c, i): ChapterState => {
		if (finished.has(c.slug)) return 'read';
		return i === currentIndex ? 'current' : 'ahead';
	});
	return {
		states,
		currentIndex,
		readMin: chapters.reduce((sum, c, i) => sum + (states[i] === 'read' ? c.min : 0), 0),
		totalMin: chapters.reduce((sum, c) => sum + c.min, 0)
	};
}
