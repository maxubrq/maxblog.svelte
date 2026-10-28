/**
 * The catalogue number of an essay — `№ 005` — per locale (DIGITAL_EDITORIAL
 * DESIGN.md §4, decision §12.1).
 *
 * `content/numbers.json` is the ledger and the only source: a number, once
 * printed, is something a reader can cite, so it is written down rather than
 * recomputed. Each locale is its own edition with its own run of numbers, and
 * only essays that are public and listed carry one.
 *
 * `assertLedger()` holds the ledger to three rules at build time (and in dev,
 * from the home page's load), failing loudly with the exact fix:
 *   1. every listed essay has a number;
 *   2. the numbers run 1…n with no gap and no repeat;
 *   3. number order is date order — so an essay published with a date older
 *      than one already numbered cannot slip in and renumber the rest.
 */
import ledger from '../../../content/numbers.json';
import type { Post } from './posts';

type Lang = 'en' | 'vi';
const LEDGER = ledger as Record<Lang, Record<string, number>>;

/** The essay's number in its own locale, or null if it has none. */
export function numberOf(slug: string, lang: Lang): number | null {
	return LEDGER[lang]?.[slug] ?? null;
}

/** `№ 005` */
export const formatNumber = (n: number) => `№ ${String(n).padStart(3, '0')}`;

/**
 * Check the ledger against the listed essays of one locale — the same list the
 * home page shows. Throws with what to write, never fixes it silently.
 */
export function assertLedger(lang: Lang, listed: Post[]) {
	const own = LEDGER[lang] ?? {};
	const problems: string[] = [];

	const missing = listed.filter((p) => own[p.slug] === undefined);
	if (missing.length) {
		const next = Object.keys(own).length;
		const lines = [...missing]
			.sort((a, b) => a.date.localeCompare(b.date))
			.map((p, i) => `    "${p.slug}": ${next + i + 1}`);
		problems.push(`these essays have no number yet; add them to "${lang}":\n${lines.join(',\n')}`);
	}

	const numbers = Object.values(own).sort((a, b) => a - b);
	if (numbers.some((n, i) => n !== i + 1)) {
		problems.push(`the "${lang}" numbers must run 1…${numbers.length} with no gap or repeat`);
	}

	const byNumber = listed
		.filter((p) => own[p.slug] !== undefined)
		.sort((a, b) => own[a.slug] - own[b.slug]);
	for (let i = 1; i < byNumber.length; i++) {
		const [prev, cur] = [byNumber[i - 1], byNumber[i]];
		if (cur.date < prev.date) {
			problems.push(
				`"${cur.slug}" (${cur.date}) is numbered after "${prev.slug}" (${prev.date}) but dated ` +
					`before it. Numbers follow publication order: give the newer essay a date on or after ${prev.date}.`
			);
		}
	}

	if (problems.length) {
		throw new Error(`content/numbers.json:\n  - ${problems.join('\n  - ')}`);
	}
}
