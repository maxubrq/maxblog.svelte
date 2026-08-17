/**
 * The open draft — a piece left out in the open while it is still being
 * written, with every earlier save still reachable.
 *
 * Built to `maxubrq/project/pages/InkDraft.jsx` (SFIM §Bản nháp lộ thiên, T4).
 * The point is not a teaser: it is the one promise the feature makes, which is
 * that **nothing is edited silently**. Every change leaves a readable scar and
 * every past version can be pulled back, including the ones the author is
 * embarrassed by.
 *
 * Two halves, and the split matters:
 *
 *   - `openDraft` in a post's frontmatter is the author writing, by hand, where
 *     the piece stands *today* — the note pinned to this save, and the state of
 *     each section. It travels with the prose, in the same commit.
 *   - `DRAFTS` below is history, read out of git by `scripts/drafts.mjs` and
 *     committed as `drafts.data.js`. Each revision carries the frontmatter of
 *     its *own* commit, so a past note says what the author thought that day
 *     rather than what they would say about it now.
 *
 * Nothing here is loaded per-post: the data module holds only the posts that
 * declare `openDraft`, which is normally one.
 */
import { DRAFTS } from './drafts.data.js';

/**
 * Where a section stands. Deliberately three words and no percentage — the
 * design is explicit that a draft reports *state per section*, never progress.
 */
export type SectionState = 'settled' | 'editing' | 'notes';

export interface DraftSection {
	label: string;
	state: SectionState;
	/**
	 * A section that is still `notes` may say what is unresolved in it. This is
	 * the "mục chưa viết" block: the author admitting what they do not have yet,
	 * rather than the page pretending the section is coming.
	 */
	notes?: string[];
}

/** The frontmatter block. Hand-written, one per save. */
export interface OpenDraft {
	/** ISO date the piece was first put down. */
	startedAt: string;
	/** What the author will say about a finish date — usually a refusal. */
	promise?: string;
	/** The note pinned to this save, in the author's own voice, lowercase. */
	note: string;
	sections: DraftSection[];
}

/**
 * A run of text and what happened to it in this revision: absent means carried
 * over unchanged, `ins` arrived here, `del` was struck here. A `del` is still
 * text a reader can read — that is the whole point of keeping it.
 */
export interface Segment {
	t: string;
	s?: 'ins' | 'del';
}

/**
 * A block of a reconstructed past revision. Past revisions are not compiled
 * mdx (see `scripts/drafts.mjs`), so a component survives as the kind of block
 * it was and its text is typeset to match approximately.
 */
export interface DraftParagraph {
	kind: 'p' | 'aside' | 'quote' | 'fleuron';
	segs: Segment[];
}

export interface Revision {
	/** `r04` — the label on the rail. */
	r: string;
	/** Which edit of the piece this was, counting every commit. */
	n: number;
	/**
	 * ISO timestamp of the commit that saved it. Deliberately the only thing
	 * kept from the commit — a sha would change under `git commit --amend`, and
	 * the post-commit hook amends, so the generated file would never settle.
	 */
	date: string;
	words: number;
	note: string;
	sections: DraftSection[];
	/** The prose as of this revision, marked against the revision before it. */
	body: DraftParagraph[];
}

export interface DraftHistory {
	/** Every commit that touched the file — the rail's ticks. */
	edits: number;
	startedAt: string;
	promise: string | null;
	/** The revision the live article is at. */
	current: string;
	/** Oldest first. */
	revisions: Revision[];
}

export type Drafts = Record<string, DraftHistory>;

export { DRAFTS };

/** The history of one post, or `null` — most posts are not open drafts. */
export const draftOf = (slug: string): DraftHistory | null =>
	(DRAFTS as Drafts)[slug] ?? null;

/**
 * Has the piece stopped being a draft? Every section settled is the only
 * finish line this feature recognises — there is no `done: true` to forget to
 * set, and no date to miss. The feed uses it to decide when the piece is
 * something to push at a subscriber rather than something to leave open.
 */
export const isSettled = (open: OpenDraft): boolean =>
	open.sections.length > 0 && open.sections.every((s) => s.state === 'settled');
