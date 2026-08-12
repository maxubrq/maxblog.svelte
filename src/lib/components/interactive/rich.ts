/**
 * The little markup the float figures' catalog strings are written in.
 *
 * Production writes those steps as next-intl *rich* messages — `<m>` for a mono
 * span, `<ms>/<me>/<mm>` for one tinted by field, plus `<b> <i> <sup>` — so a
 * translator can move the numbers around inside the sentence without touching
 * any code. The strings are lifted verbatim, so the same markup has to be
 * understood here. It is parsed into a tree and rendered as real elements by
 * `Rich.svelte`; nothing is ever handed to `{@html}`.
 */

export type RichNode = string | { tag: string; children: RichNode[] };

const TAG = /<(\/?)([a-z]+)>/g;

/** The tags a message may use. Anything else is left as literal text. */
const KNOWN = new Set(['m', 'ms', 'me', 'mm', 'b', 'i', 'sup']);

export function parseRich(input: string): RichNode[] {
	const root: RichNode[] = [];
	const stack: RichNode[][] = [root];
	const open: string[] = [];
	let last = 0;

	const push = (node: RichNode) => stack[stack.length - 1].push(node);

	TAG.lastIndex = 0;
	for (let m = TAG.exec(input); m; m = TAG.exec(input)) {
		const [whole, slash, tag] = m;
		if (!KNOWN.has(tag)) continue;

		if (m.index > last) push(input.slice(last, m.index));
		last = m.index + whole.length;

		if (!slash) {
			const node = { tag, children: [] as RichNode[] };
			push(node);
			stack.push(node.children);
			open.push(tag);
		} else if (open[open.length - 1] === tag) {
			stack.pop();
			open.pop();
		}
		// A stray closing tag is dropped rather than unwinding someone else's
		// element: a mistyped translation should lose a mark, not the sentence.
	}
	if (last < input.length) push(input.slice(last));
	return root;
}
