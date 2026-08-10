import type { Component } from 'svelte';
import { groupOf } from './group';

/** A hand-picked neighbour, as authored in frontmatter (`neighborhood:`). */
export interface Neighbour {
	slug: string;
	title: string;
	topic?: string;
	/** Reading minutes of the neighbour. */
	min?: number;
	/** `Mở đường` · `Cùng mạch` · `Next step` … */
	relation?: string;
	/** Why *this* essay, next. Shown in italics under the title. */
	reason?: string;
}

/**
 * The weather of a piece — a reading contract, not a tag. Hand-written per
 * post so the reader can decide before committing. Two rules the design is
 * strict about: `time` is the author's own estimate (never words ÷ speed), and
 * `warn` is written by hand — nothing to warn about means leave it out.
 */
export interface Weather {
	/** The author's estimate, e.g. `18–22 min`. */
	time: string;
	oneSitting?: boolean;
	/** Difficulty 1–5, drawn as squares. The number is never printed. */
	load: number;
	needFirst?: string;
	bestWhen?: string;
	warn?: string;
}

/**
 * Frontmatter contract for every file in `content/posts/`.
 * Deliberately the same shape the production (Next.js) blog uses, so posts
 * migrate across without editing their front matter.
 */
export interface PostMeta {
	/** Post title, as authored — the one string never force-lowercased. */
	title: string;
	/** Deck / standfirst under the title. */
	subtitle?: string;
	/** ISO date, e.g. `2026-04-14`. */
	date: string;
	/** One of the four doorways: Science · Tech · Philosophy · Art. */
	topic: string;
	lang?: 'en' | 'vi';
	/** Hidden from every index, but the page still builds. */
	draft?: boolean;
	/** Carries a live figure — earns the `● interactive` tag. */
	interactive?: boolean;
	/** `Chapter 8` · `GT - Chương IV` — shown as a coordinate tag. */
	chapter?: string;
	/** Series name, e.g. `OOP — From Syntax to Reflex`. */
	series?: string;
	/** Meta description + RSS summary + the deck on index pages. */
	description?: string;
	/**
	 * The cover plate — a Cloudinary delivery URL, plain, with no transformations
	 * in it (`$lib/images` adds those). Omit it for the branded default.
	 */
	coverImage?: string;
	/** The author's pick — "if you remember one sentence". */
	rememberSentence?: string;
	rememberAttribution?: string;
	/** The reading contract shown at the head of the article. */
	weather?: Weather;
	neighborhood?: Neighbour[];
	/** Word inside `title` to set in blue (§2). Must occur in the title. */
	accent?: string;
	/** Margin-rail extras (§3). */
	coord?: string;
	section?: string;
	license?: string;
	/** Injected by the reading-time remark plugin; set it to pin the number. */
	reading?: number;
	words?: number;
}

export interface Post extends PostMeta {
	slug: string;
	href: string;
	reading: number;
	words: number;
	lang: 'en' | 'vi';
	/**
	 * The slug with its language suffix stripped — `001-float-memory-vi` and
	 * `001-float-memory-en` share the group `001-float-memory`, which is how the
	 * two translations of one essay find each other.
	 */
	group: string;
}

type PostModule = { metadata: PostMeta; default: Component };

const modules = import.meta.glob<PostModule>('/content/posts/**/*.mdx');

const slugOf = (path: string) => path.replace(/^\/content\/posts\//, '').replace(/\.mdx$/, '');

function normalize(metadata: PostMeta, slug: string): Post {
	return {
		...metadata,
		slug,
		href: `/writing/${slug}`,
		reading: metadata.reading ?? 1,
		words: metadata.words ?? 0,
		lang: metadata.lang ?? 'en',
		group: groupOf(slug)
	};
}

/**
 * All posts, newest first. Loads every module, so call it from server loads
 * and prerendered endpoints only — never from a component.
 */
export async function listPosts({ includeDrafts = false } = {}): Promise<Post[]> {
	const posts = await Promise.all(
		Object.entries(modules).map(async ([path, load]) =>
			normalize((await load()).metadata, slugOf(path))
		)
	);

	return posts
		.filter((p) => includeDrafts || !p.draft)
		.sort((a, b) => b.date.localeCompare(a.date));
}

/** One post plus its rendered component. Safe inside a universal load. */
export async function loadPost(slug: string) {
	const entry = modules[`/content/posts/${slug}.mdx`];
	if (!entry) return null;
	const { metadata, default: content } = await entry();
	return { content, meta: normalize(metadata, slug) };
}

/**
 * The slug of the same essay in the other language, if that file exists.
 * Looks at glob keys only — no post module is loaded, so this is cheap enough
 * for a universal load.
 */
export function translationOf(slug: string): { slug: string; lang: 'en' | 'vi' } | null {
	const m = slug.match(/^(.*)([-_])(en|vi)$/);
	if (!m) return null;
	const [, base, sep, lang] = m;
	const other = lang === 'en' ? 'vi' : 'en';
	for (const candidate of [`${base}${sep}${other}`, `${base}-${other}`, `${base}_${other}`]) {
		if (modules[`/content/posts/${candidate}.mdx`]) {
			return { slug: candidate, lang: other as 'en' | 'vi' };
		}
	}
	return null;
}

export const allSlugs = () => Object.keys(modules).map(slugOf);
