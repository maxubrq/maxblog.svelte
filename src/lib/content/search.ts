/**
 * The search corpus — posts, sections, passages.
 *
 * Same three-level shape as the production blog (`~/MyApps/maxblog/src/lib/search.ts`):
 * a post matches on its title/excerpt/topic, a section is one heading, a passage
 * is one paragraph of the body. Searching titles alone finds the essay you
 * already remember; passages find the sentence you only half-remember, which is
 * the point of a notebook kept in public.
 *
 * Two things differ from production. It builds the corpus per request in an API
 * route; nothing runs on a server here, so this is built at *build* time and
 * prerendered to `/{lang}/search-index.json`. And post metadata comes from the
 * compiled modules rather than a second frontmatter parse — mdsvex already did
 * that work, including the reading-time plugin's `reading` and `words`.
 *
 * Import this from the prerendered endpoint only: it globs every post's raw
 * source, and none of that text should reach the browser except as finished JSON.
 */

import GithubSlugger from 'github-slugger';
import { listPosts } from './posts';

export interface SearchPost {
	slug: string;
	title: string;
	topic: string;
	date: string;
	readMin: number;
	excerpt: string;
}

export interface SearchSection {
	id: string;
	slug: string;
	postTitle: string;
	label: string;
	anchor: string;
	/** 2 or 3 — a chapter head or a subhead under it. */
	level: number;
}

export interface SearchPassage {
	id: string;
	slug: string;
	postTitle: string;
	section: string;
	/** Anchor of the section this paragraph sits under, so a hit lands near it. */
	anchor: string;
	text: string;
}

export interface SearchCorpus {
	posts: SearchPost[];
	sections: SearchSection[];
	passages: SearchPassage[];
}

export const EMPTY_CORPUS: SearchCorpus = { posts: [], sections: [], passages: [] };

/** Paragraphs shorter than this are captions and asides, not passages. */
const MIN_PASSAGE = 50;
/** A result row shows about this much; the rest is elision. */
const MAX_PASSAGE = 200;
/** Per post, so one long essay cannot crowd out every other result. */
const PASSAGES_PER_POST = 6;

/** Raw source, read at build time only — compiled modules carry `metadata`, not the markdown. */
const raw = import.meta.glob<string>('/content/posts/**/*.mdx', {
	query: '?raw',
	import: 'default',
	eager: true
});

/** Strip the leading `---` frontmatter block; return the body only. */
function body(source: string): string {
	const m = source.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/);
	return m ? source.slice(m[0].length) : source;
}

/** Markdown syntax a reader should not see in a result row. */
function cleanMarkdown(text: string): string {
	return text
		.replace(/`([^`]+)`/g, '$1')
		.replace(/\*\*([^*]+)\*\*/g, '$1')
		.replace(/\*([^*]+)\*/g, '$1')
		.replace(/~~([^~]+)~~/g, '$1')
		.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
		// `$0.1$` reads as prose once the delimiters go; the formula does not.
		.replace(/\$([^$]{1,40})\$/g, '$1')
		.replace(/\s+/g, ' ')
		.trim();
}

interface Parsed {
	sections: Array<{ label: string; anchor: string; level: number }>;
	passages: Array<{ section: string; anchor: string; text: string }>;
}

/**
 * Walk the markdown line by line. Deliberately not a full parser: it has to
 * agree with what the reader sees, and what the reader sees is headings and
 * paragraphs. Code plates, tables and component blocks are skipped — nobody
 * searches for a line of a `<FloatBuilder />`.
 *
 * The slugger is fed *every* heading, not only the ones that become sections,
 * because that is what rehype-slug does on the rendered page: its duplicate
 * counter has to see the same headings in the same order or the anchors drift.
 */
function parse(source: string): Parsed {
	const sections: Parsed['sections'] = [];
	const passages: Parsed['passages'] = [];
	const slugger = new GithubSlugger();

	let section = '';
	let anchor = '';
	let paragraph: string[] = [];
	let inCode = false;

	const flush = () => {
		if (paragraph.length === 0) return;
		const clean = cleanMarkdown(paragraph.join(' '));
		paragraph = [];
		if (clean.length < MIN_PASSAGE) return;
		passages.push({
			section,
			anchor,
			text: clean.length > MAX_PASSAGE ? `${clean.slice(0, MAX_PASSAGE)}…` : clean
		});
	};

	for (const line of body(source).split('\n')) {
		const trimmed = line.trim();

		if (trimmed.startsWith('```')) {
			inCode = !inCode;
			flush();
			continue;
		}
		if (inCode) continue;

		const heading = trimmed.match(/^(#{1,6})\s+(.*)$/);
		if (heading) {
			flush();
			const level = heading[1].length;
			const label = cleanMarkdown(heading[2]);
			// Every heading advances the slugger, only h2/h3 become results.
			const slug = slugger.slug(label);
			if (level === 2 || level === 3) {
				section = label;
				anchor = slug;
				sections.push({ label, anchor: slug, level });
			}
			continue;
		}

		// A component tag, a table row, a blockquote marker, a list bullet, or a
		// blank line: not running prose.
		if (/^[<|>]/.test(trimmed) || /^[-*+]\s/.test(trimmed) || /^\d+\.\s/.test(trimmed) || !trimmed) {
			flush();
			continue;
		}

		paragraph.push(trimmed);
	}

	flush();
	return { sections, passages };
}

/**
 * The corpus for one locale. Drafts are left out: a post unlisted everywhere
 * else should not turn up in search either.
 */
export async function buildCorpus(lang: string): Promise<SearchCorpus> {
	const all = (await listPosts()).filter((p) => p.lang === lang);

	const posts: SearchPost[] = [];
	const sections: SearchSection[] = [];
	const passages: SearchPassage[] = [];

	for (const post of all) {
		const source = raw[`/content/posts/${post.slug}.mdx`];
		if (!source) continue;

		posts.push({
			slug: post.slug,
			title: post.title,
			topic: post.topic,
			date: post.date,
			readMin: post.reading,
			excerpt: post.description ?? post.subtitle ?? ''
		});

		const parsed = parse(source);
		parsed.sections.forEach((s, i) =>
			sections.push({ id: `${post.slug}-s${i}`, slug: post.slug, postTitle: post.title, ...s })
		);
		parsed.passages
			.slice(0, PASSAGES_PER_POST)
			.forEach((p, i) =>
				passages.push({ id: `${post.slug}-p${i}`, slug: post.slug, postTitle: post.title, ...p })
			);
	}

	return { posts, sections, passages };
}
