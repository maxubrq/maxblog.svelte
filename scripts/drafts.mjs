#!/usr/bin/env node
/**
 * The open draft's revisions, read out of git.
 *
 *     node scripts/drafts.mjs            # every post carrying `openDraft:`
 *     node scripts/drafts.mjs 003-pure-joy-vi
 *
 * Writes `src/lib/drafts.data.js` and expects the result to be **committed**,
 * exactly like `scripts/halftone.mjs` commits its plates. Reading git at build
 * time would be the obvious alternative and it is a trap: Vercel clones
 * shallow, so the history would come back empty and the page would quietly
 * claim the draft had never been touched. A draft that lies about its own
 * edits is the one bug this feature cannot ship with.
 *
 * Nothing here is hand-written except the author's own words. A revision's
 * note and the state of its sections are read from the frontmatter *of that
 * commit*, so they say what the author thought that afternoon rather than what
 * they remember now. The diff between two revisions is computed, never
 * authored.
 *
 * Only committed history is seen. Uncommitted edits in the working tree are
 * not a revision yet — that is what "saved" means here.
 *
 * No dependencies, like the other scripts in this folder: the frontmatter
 * parser below reads the small YAML subset `openDraft` is written in and
 * throws on anything it does not recognise.
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';

const POSTS = 'content/posts';
const OUT = 'src/lib/drafts.data.js';

const git = (...args) =>
	execFileSync('git', args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });

/* ── frontmatter ─────────────────────────────────────────────────────────── */

/** `--- … ---` off the top. Returns the raw block and the body after it. */
function splitFrontmatter(source) {
	const m = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
	if (!m) return { fm: '', body: source };
	return { fm: m[1], body: source.slice(m[0].length) };
}

const unquote = (v) => v.replace(/^['"]|['"]$/g, '').trim();

/**
 * The `openDraft:` block, and only it — the rest of the frontmatter is mdsvex's
 * business. The shape is fixed (see `OpenDraft` in `src/lib/drafts.ts`), so the
 * parser handles just what that shape uses: scalars, a list of `- label:` maps,
 * and a nested list of scalar strings.
 */
function parseOpenDraft(fm) {
	const lines = fm.split(/\r?\n/);
	const start = lines.findIndex((l) => /^openDraft:\s*$/.test(l));
	if (start === -1) return null;

	const out = { sections: [] };
	let section = null;
	let list = null; // the key whose scalar list we are inside

	for (const line of lines.slice(start + 1)) {
		if (line.trim() === '') continue;
		const indent = line.length - line.trimStart().length;
		if (indent === 0) break; // out of the block
		const text = line.trim();

		if (list && list.scalar && text.startsWith('- ') && indent > list.indent) {
			list.target.push(unquote(text.slice(2)));
			continue;
		}
		if (!text.startsWith('- ')) list = null;

		if (text.startsWith('- ')) {
			// a new section: `- label: '…'`
			const [, key, value] = text.slice(2).match(/^(\w+):\s*(.*)$/) ?? [];
			if (key !== 'label') throw new Error(`openDraft: a section must open with label:, got “${text}”`);
			section = { label: unquote(value), state: 'notes' };
			out.sections.push(section);
			continue;
		}

		const [, key, value] = text.match(/^(\w+):\s*(.*)$/) ?? [];
		if (!key) throw new Error(`openDraft: cannot read “${text}”`);

		// Inside a section (indented past the `-`) or at the block's top level.
		const target = section && indent >= 6 ? section : out;
		if (value === '') {
			target[key] = [];
			// `sections:` is a list of maps and is read by the branch above;
			// anything else opening a list holds plain strings.
			list = { target: target[key], indent, scalar: key !== 'sections' };
			if (key === 'sections') section = null;
		} else {
			target[key] = unquote(value);
		}
	}

	if (out.sections.some((s) => !['settled', 'editing', 'notes'].includes(s.state))) {
		throw new Error('openDraft: a section state must be settled · editing · notes');
	}
	return out;
}

/* ── the body, as paragraphs ─────────────────────────────────────────────── */

/**
 * A past revision is shown as reconstructed prose, not as compiled mdx — six
 * historical versions cannot be run through mdsvex, and diffing compiled HTML
 * is a worse problem than the one being solved. So the components are reduced
 * to the kind of block they were: their text survives and is typeset roughly
 * the way the real page sets it. The current revision never comes through here
 * — it renders as the real article, components and all.
 */
const BLOCKS = [
	[/^<Sidenote>([\s\S]*)<\/Sidenote>$/, 'aside'],
	[/^<PullQuote>([\s\S]*)<\/PullQuote>$/, 'quote'],
	[/^<Callout[^>]*>([\s\S]*)<\/Callout>$/, 'quote']
];

function paragraphs(body) {
	return body
		.split(/\r?\n\s*\r?\n/)
		.map((block) => block.trim())
		.filter(Boolean)
		.map((block) => {
			if (/^<Fleuron\s*\/>$/.test(block)) return { kind: 'fleuron', text: '' };
			for (const [re, kind] of BLOCKS) {
				const m = block.match(re);
				if (m) return { kind, text: m[1].trim().replace(/\s*\n\s*/g, ' ') };
			}
			return { kind: 'p', text: block.replace(/\s*\n\s*/g, ' ') };
		})
		.filter((p) => p.kind === 'fleuron' || p.text !== '');
}

const words = (paras) =>
	paras.reduce((n, p) => n + (p.text ? p.text.split(/\s+/).length : 0), 0);

/* ── diff ────────────────────────────────────────────────────────────────── */

/** Longest common subsequence over two arrays, by a key function. */
function lcs(a, b, key = (x) => x) {
	const n = a.length;
	const m = b.length;
	const table = Array.from({ length: n + 1 }, () => new Uint32Array(m + 1));
	for (let i = n - 1; i >= 0; i--) {
		for (let j = m - 1; j >= 0; j--) {
			table[i][j] =
				key(a[i]) === key(b[j])
					? table[i + 1][j + 1] + 1
					: Math.max(table[i + 1][j], table[i][j + 1]);
		}
	}
	// Walk it back into a list of ops.
	const ops = [];
	let i = 0;
	let j = 0;
	while (i < n && j < m) {
		if (key(a[i]) === key(b[j])) ops.push({ op: 'same', a: a[i], b: b[j], i, j }), i++, j++;
		else if (table[i + 1][j] >= table[i][j + 1]) ops.push({ op: 'del', a: a[i], i }), i++;
		else ops.push({ op: 'ins', b: b[j], j }), j++;
	}
	while (i < n) ops.push({ op: 'del', a: a[i], i }), i++;
	while (j < m) ops.push({ op: 'ins', b: b[j], j }), j++;
	return ops;
}

/** Words *and* the whitespace between them, so a rebuilt paragraph is exact. */
const tokenize = (text) => text.split(/(\s+)/).filter((t) => t !== '');

/** Adjacent tokens of the same fate collapse into one readable segment. */
function coalesce(pieces) {
	const segs = [];
	for (const { t, s } of pieces) {
		const last = segs[segs.length - 1];
		// `s` is absent rather than null on an untouched run, so both sides are
		// normalised before they are compared — otherwise nothing ever merges and
		// every single word comes out as its own segment.
		if (last && (last.s ?? null) === (s ?? null)) last.t += t;
		else segs.push(s ? { t, s } : { t });
	}
	return segs;
}

/** Two versions of one paragraph → the segments the scar layer draws. */
function diffText(before, after) {
	if (before === after) return [{ t: after }];
	const pieces = [];
	for (const op of lcs(tokenize(before), tokenize(after))) {
		if (op.op === 'same') pieces.push({ t: op.b, s: null });
		else if (op.op === 'del') pieces.push({ t: op.a, s: 'del' });
		else pieces.push({ t: op.b, s: 'ins' });
	}
	return coalesce(pieces);
}

/** How much two paragraphs still have in common, 0..1. */
function similarity(a, b) {
	const ta = tokenize(a).filter((t) => t.trim());
	const tb = tokenize(b).filter((t) => t.trim());
	if (!ta.length || !tb.length) return 0;
	const common = lcs(ta, tb).filter((o) => o.op === 'same').length;
	return (2 * common) / (ta.length + tb.length);
}

/**
 * Align two revisions paragraph by paragraph, then diff the pairs.
 *
 * The alignment is the part that can look wrong to a reader: an untouched
 * paragraph must match itself exactly (it does — the LCS runs on the text), and
 * a rewritten one must pair with what it was rather than reading as one
 * deletion beside one insertion. `KEEP` is the threshold for "this is the same
 * paragraph, edited"; below it the two really are unrelated blocks.
 */
const KEEP = 0.5;

/**
 * Past that share of a paragraph changing, a word-level diff stops being
 * readable: alternating one-word strikeouts and underlines read as confetti
 * rather than as an edit. Such a paragraph is shown as what it honestly is —
 * the old one struck out, the new one whole.
 */
const REWRITE = 0.5;

/** The share of a diffed paragraph that is not carried over unchanged. */
function changed(segs) {
	let same = 0;
	let total = 0;
	for (const seg of segs) {
		const n = seg.t.length;
		total += n;
		if (!seg.s) same += n;
	}
	return total === 0 ? 0 : 1 - same / total;
}

const removed = (p) => ({ kind: p.kind, segs: [{ t: p.text, s: 'del' }] });
const added = (p) => ({ kind: p.kind, segs: [{ t: p.text, s: 'ins' }] });

/**
 * One run of changed paragraphs. The LCS hands back every deletion in the run
 * before every insertion, so pairing only the two that happen to be adjacent
 * misses the common case entirely — a revision that reworks four paragraphs in
 * a row would read as four deletions followed by four unrelated new blocks.
 *
 * Each insertion instead takes the best surviving match among the deletions
 * still ahead of it. The pointer only moves forward, so paragraphs keep the
 * order they were written in, and a deletion that is stepped over is printed
 * where it stood rather than swept to the end of the run.
 */
function pairRun(dels, inss) {
	const out = [];
	let d = 0;
	for (const ins of inss) {
		let best = -1;
		let bestSim = KEEP;
		for (let i = d; i < dels.length; i++) {
			if (dels[i].kind !== ins.kind) continue;
			const sim = similarity(dels[i].text, ins.text);
			if (sim >= bestSim) {
				bestSim = sim;
				best = i;
			}
		}
		if (best === -1) {
			out.push(added(ins));
			continue;
		}
		for (let i = d; i < best; i++) out.push(removed(dels[i]));
		const segs = diffText(dels[best].text, ins.text);
		if (changed(segs) > REWRITE) {
			out.push(removed(dels[best]), added(ins));
		} else {
			out.push({ kind: ins.kind, segs });
		}
		d = best + 1;
	}
	for (let i = d; i < dels.length; i++) out.push(removed(dels[i]));
	return out;
}

function diffParagraphs(before, after) {
	const ops = lcs(before, after, (p) => `${p.kind} ${p.text}`);
	const out = [];
	let dels = [];
	let inss = [];

	const flush = () => {
		if (dels.length || inss.length) out.push(...pairRun(dels, inss));
		dels = [];
		inss = [];
	};

	for (const op of ops) {
		if (op.op === 'same') {
			flush();
			out.push({ kind: op.b.kind, segs: [{ t: op.b.text }] });
		} else if (op.op === 'del') dels.push(op.a);
		else inss.push(op.b);
	}
	flush();
	return out;
}

/* ── walking one post's history ──────────────────────────────────────────── */

function revisionsOf(slug) {
	const path = `${POSTS}/${slug}.mdx`;
	const log = git('log', '--follow', '--reverse', '--format=%H\t%aI', '--', path)
		.trim()
		.split('\n')
		.filter(Boolean)
		.map((line) => {
			const [sha, date] = line.split('\t');
			return { sha, date };
		});

	if (!log.length) return null;

	const revisions = [];
	let previous = [];
	let n = 0;

	for (const { sha, date } of log) {
		n++;
		let source;
		try {
			source = git('show', `${sha}:${path}`);
		} catch {
			continue; // the commit that deleted or renamed it; --follow handles the rest
		}
		const { fm, body } = splitFrontmatter(source);
		const open = parseOpenDraft(fm);
		const paras = paragraphs(body);

		// Every commit counts as an edit; only the ones the author annotated are
		// a *saved* revision the reader can be sent back to.
		if (!open?.note) {
			previous = paras;
			continue;
		}

		revisions.push({
			r: `r${String(n).padStart(2, '0')}`,
			n,
			sha: sha.slice(0, 9),
			date,
			words: words(paras),
			note: open.note,
			sections: open.sections,
			body: diffParagraphs(previous, paras)
		});
		previous = paras;
	}

	if (!revisions.length) return null;
	const last = revisions[revisions.length - 1];
	const head = splitFrontmatter(git('show', `HEAD:${path}`));
	const open = parseOpenDraft(head.fm) ?? {};

	return {
		edits: n,
		startedAt: open.startedAt ?? log[0].date.slice(0, 10),
		promise: open.promise ?? null,
		/** The newest saved revision is the one the live article is at. */
		current: last.r,
		revisions
	};
}

/* ── run ─────────────────────────────────────────────────────────────────── */

const asked = process.argv.slice(2);
const slugs = asked.length
	? asked.map((s) => s.replace(/\.mdx$/, ''))
	: fs
			.readdirSync(POSTS)
			.filter((f) => f.endsWith('.mdx'))
			.filter((f) => /^openDraft:\s*$/m.test(fs.readFileSync(`${POSTS}/${f}`, 'utf8')))
			.map((f) => f.replace(/\.mdx$/, ''));

const drafts = {};
for (const slug of slugs) {
	const data = revisionsOf(slug);
	if (!data) {
		console.warn(`· ${slug}: no saved revision in git yet — skipped`);
		continue;
	}
	drafts[slug] = data;
	console.log(`· ${slug}: ${data.revisions.length} saved of ${data.edits} edits`);
}

const banner = `/**
 * The open drafts, as git remembers them.
 *
 * GENERATED by \`node scripts/drafts.mjs\` — do not edit. The author's words in
 * here (a revision's note, its section states) come from the frontmatter of the
 * commit that saved it; everything else is computed.
 *
 * Plain \`.js\` for the same reason as \`glossary.data.js\`: the types live next
 * door in \`drafts.ts\`, which re-exports this, and JSDoc keeps checking.
 *
 * @type {import('./drafts').Drafts}
 */
`;

fs.writeFileSync(OUT, `${banner}export const DRAFTS = ${JSON.stringify(drafts, null, '\t')};\n`);
console.log(`→ ${OUT}`);
