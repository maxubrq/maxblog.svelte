// Pure helpers over post lists — no import.meta.glob here, so components can
// import this without pulling every post's loader into the client bundle.
import type { Post } from './posts';

/** `001-float-memory-vi` → `001-float-memory`. Both `-vi` and `_vi` occur. */
export const groupOf = (slug: string) => slug.replace(/[-_](en|vi)$/, '');

/**
 * One row per essay, not per file: of the translations of the same piece, the
 * one in `lang` wins; the other is offered as a switch on the article page.
 */
export function preferLang(posts: Post[], lang: 'en' | 'vi'): Post[] {
	const byGroup = new Map<string, Post>();
	for (const p of posts) {
		const held = byGroup.get(p.group);
		if (!held || (held.lang !== lang && p.lang === lang)) byGroup.set(p.group, p);
	}
	return [...byGroup.values()].sort((a, b) => b.date.localeCompare(a.date));
}
