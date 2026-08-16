<script lang="ts">
	/**
	 * The mark — a reader writing in the margin of a book.
	 *
	 * Built to `maxubrq/project/pages/InkMarks.jsx`, which **replaces** the
	 * reaction bar this edition's production twin still ships (`SelectionReact`,
	 * ❤ ✦ ?). One primitive instead of four feelings: five gestures, each of
	 * which writes the same record, so what comes later reads one stream rather
	 * than five bespoke ones.
	 *
	 *   keep     a sentence worth carrying out of the essay
	 *   dissent  the same gesture with the sign reversed — I do not believe this
	 *   snag     I got lost here; an anchor to come back to, not a place to leave
	 *   ask      a question pinned to the passage rather than dropped into the air
	 *   note     for the author, privately
	 *
	 * **Everything is private first.** Only `note` leaves the device, which is
	 * why there is no consent step: the other four never travel, so there is
	 * nothing to ask permission for. That also means the existing `/api/react`
	 * needs no change — `note` is already a value it accepts, and the four new
	 * words are never sent to a table production shares.
	 *
	 * The marks are **drawn, not styled**: rough.js strokes over the passage's
	 * own client rects, so a mark looks made rather than applied. rough.js is
	 * `import()`ed with the first mark, the same discipline the reading room
	 * uses for d3.
	 */
	import { dev } from '$app/environment';
	import { fill, useI18n } from '$lib/i18n';
	import { sessionId } from '$lib/session';
	import type { Snippet } from 'svelte';

	let {
		slug,
		draft = false,
		rev,
		children
	}: { slug: string; draft?: boolean; rev?: string; children: Snippet } = $props();

	const i18n = useI18n();
	const t = $derived(i18n.t.marks);

	type Kind = 'keep' | 'dissent' | 'snag' | 'ask' | 'note';
	const KINDS: Kind[] = ['keep', 'dissent', 'snag', 'ask', 'note'];

	/** Ink per gesture. Dissent and snag step off the blue on purpose: they are
	 *  not enthusiasms, and colouring them like one would flatter them. */
	const INK: Record<Kind, string> = {
		keep: 'var(--blue)',
		dissent: 'var(--ink)',
		snag: 'var(--muted)',
		ask: 'var(--blue)',
		note: 'var(--blue)'
	};

	/**
	 * A mark, as it is kept. The anchor is the shape a W3C TextQuoteSelector
	 * uses — the quote plus a slice of context each side — so a mark survives
	 * the author editing the paragraph around it. Storing the quote alone (what
	 * production does) loses the mark silently the moment a character changes.
	 */
	interface Anchor {
		quote: string;
		prefix: string;
		suffix: string;
	}
	interface Mark {
		n: number;
		kind: Kind;
		anchor: Anchor;
		/**
		 * The revision of an open draft the mark was made at, when the piece is
		 * one. It is what lets a mark say *when* it was true rather than simply
		 * failing to appear once the author has rewritten the sentence under it.
		 */
		rev?: string;
		/** When it was made — the reader's own trail is chronological. */
		ts: number;
	}

	const key = $derived(`marks-${slug}`);
	let marks = $state<Mark[]>([]);
	let hoverN = $state<number | null>(null);

	function load(): Mark[] {
		try {
			const raw = JSON.parse(localStorage.getItem(key) ?? '[]');
			return Array.isArray(raw) ? raw : [];
		} catch {
			return [];
		}
	}
	function save(list: Mark[]) {
		try {
			localStorage.setItem(key, JSON.stringify(list));
		} catch {
			// Private mode: the marks hold for this visit and are not kept.
		}
	}

	// ── Sending, which only `note` ever does ────────────────────────────────

	/**
	 * `dev` matters because both editions write to the same Postgres, so a
	 * `pnpm dev` note would land in the author's real inbox; a draft is the
	 * author reading their own piece. `doNotTrack` is deliberately not
	 * consulted — a note is a letter the reader chose to write, not a count
	 * taken from them behind their back.
	 */
	const canSend = $derived(!dev && !draft);

	function sendNote(anchor: Anchor, text: string) {
		if (!canSend) return;
		fetch('/api/react', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				postSlug: slug,
				passage: anchor.quote,
				reaction: 'note',
				note: text,
				locale: i18n.lang,
				sessionId: sessionId()
			})
		}).catch(() => {
			// Fire and forget: the mark is already drawn, which is the part the
			// reader asked for.
		});
	}

	// ── Anchoring ───────────────────────────────────────────────────────────

	const CONTEXT = 24;

	/**
	 * Collapse every run of whitespace to one space, and keep a map back to the
	 * original offsets.
	 *
	 * This is the whole reason marking works at all here. `Selection.toString()`
	 * returns the text as the eye saw it — one space between words — while the
	 * DOM's `textContent` still holds the newlines the markdown source wrapped
	 * at. A quote pulled off a selection therefore *never* matches the text node
	 * it came from, and the mark silently fails to draw. Searching a normalised
	 * copy and mapping the hit back is what reconciles the two.
	 */
	function flatten(s: string): { text: string; map: number[] } {
		const out: string[] = [];
		const map: number[] = [];
		let wasSpace = false;
		for (let i = 0; i < s.length; i++) {
			const ch = s[i];
			if (/\s/.test(ch)) {
				if (wasSpace) continue;
				out.push(' ');
				map.push(i);
				wasSpace = true;
			} else {
				out.push(ch);
				map.push(i);
				wasSpace = false;
			}
		}
		return { text: out.join(''), map };
	}

	const flat = (s: string) => s.replace(/\s+/g, ' ').trim();

	function buildAnchor(root: Element, quote: string): Anchor {
		const q = flat(quote);
		const all = flatten(root.textContent ?? '').text;
		const at = all.indexOf(q);
		if (at < 0) return { quote: q, prefix: '', suffix: '' };
		return {
			quote: q,
			prefix: all.slice(Math.max(0, at - CONTEXT), at),
			suffix: all.slice(at + q.length, at + q.length + CONTEXT)
		};
	}

	/**
	 * Wrap `quote` where it sits, and hang its numeral off the end.
	 *
	 * The quote has to live inside one text node. A selection crossing an inline
	 * element is left unwrapped rather than reconstructed — and in this edition
	 * that is not rare, because the remark passes put `<Term>` and `<R>` inside
	 * sentences. The mark is still recorded and still listed; it simply is not
	 * drawn, which is better than rebuilding the author's markup around it.
	 */
	function wrap(root: Element, mark: Mark): boolean {
		const { quote, prefix } = mark.anchor;
		if (quote.length < 4) return false;
		if (root.querySelector(`[data-mark="${mark.n}"]`)) return true;

		const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
		let node: Node | null;
		while ((node = walker.nextNode())) {
			const tn = node as Text;
			if (tn.parentElement?.closest('[data-mark]')) continue;
			const { text: value, map } = flatten(tn.textContent ?? '');

			// Prefer the occurrence the context agrees with, so a sentence that
			// repeats marks the one the reader actually chose.
			let hit = prefix ? value.indexOf(prefix + quote) : -1;
			hit = hit >= 0 ? hit + prefix.length : value.indexOf(quote);
			if (hit < 0) continue;

			// Back to offsets in the node's real text, newlines and all.
			const from = map[hit];
			const to = map[hit + quote.length - 1] + 1;

			const match = tn.splitText(from);
			match.splitText(to - from);

			const span = document.createElement('span');
			span.className = `mk mk-${mark.kind}`;
			span.dataset.mark = String(mark.n);
			span.textContent = match.textContent;

			const sup = document.createElement('sup');
			sup.className = 'mk-idx';
			sup.dataset.idx = String(mark.n);
			sup.textContent = String(mark.n);

			match.parentNode!.replaceChild(span, match);
			span.after(sup);
			return true;
		}
		return false;
	}

	// ── The bar ─────────────────────────────────────────────────────────────

	let scope = $state<HTMLElement | null>(null);
	let bar = $state<HTMLElement | null>(null);
	let at = $state<{ x: number; y: number; text: string } | null>(null);
	let hint = $state<Kind | null>(null);
	let noting = $state<Anchor | null>(null);
	let noteText = $state('');
	let sent = $state(false);

	$effect(() => {
		if (!scope) return;
		const el = scope;

		function onRelease(event: Event) {
			if (noting) return;
			if (bar?.contains(event.target as Node)) return;
			setTimeout(() => {
				const sel = window.getSelection();
				const text = sel?.toString().trim() ?? '';
				// Six characters, not four: below that a selection is usually a
				// slip of the mouse rather than a passage.
				if (!sel || sel.isCollapsed || text.length < 6) {
					at = null;
					return;
				}
				const range = sel.getRangeAt(0);
				if (!el.contains(range.commonAncestorContainer)) {
					at = null;
					return;
				}
				const r = range.getBoundingClientRect();
				const box = el.getBoundingClientRect();
				at = { x: r.left + r.width / 2 - box.left, y: r.top - box.top - 10, text };
				hint = null;
			}, 0);
		}
		function onDismiss(event: Event) {
			if (bar?.contains(event.target as Node)) return;
			at = null;
		}

		el.addEventListener('mouseup', onRelease);
		el.addEventListener('touchend', onRelease);
		document.addEventListener('mousedown', onDismiss);
		return () => {
			el.removeEventListener('mouseup', onRelease);
			el.removeEventListener('touchend', onRelease);
			document.removeEventListener('mousedown', onDismiss);
		};
	});

	function pick(kind: Kind) {
		if (!at || !scope) return;
		const anchor = buildAnchor(scope, at.text);

		if (kind === 'note') {
			noting = anchor;
			at = null;
			return;
		}
		commit(kind, anchor);
	}

	function commit(kind: Kind, anchor: Anchor) {
		const mark: Mark = { n: (marks.at(-1)?.n ?? 0) + 1, kind, anchor, rev, ts: Date.now() };
		if (scope) wrap(scope, mark);
		marks = [...marks, mark];
		save(marks);
		window.getSelection()?.removeAllRanges();
		at = null;
	}

	function submitNote() {
		if (!noting || !noteText.trim()) return;
		commit('note', noting);
		sendNote(noting, noteText.trim());
		noting = null;
		noteText = '';
		sent = true;
		setTimeout(() => (sent = false), 1600);
	}

	// ── Redrawing what was marked before ────────────────────────────────────

	/**
	 * Marks whose sentence is no longer in the text — **fuzzy**, not gone.
	 *
	 * On a finished essay this is empty and stays empty. On an open draft it is
	 * the promise the draft makes, kept: the author rewrote the passage, so the
	 * mark cannot be drawn where it was, and the alternative to saying so is a
	 * mark that quietly disappears — which is the same as editing silently.
	 *
	 * The test is whether the quote occurs in the prose at all, deliberately not
	 * whether `wrap` succeeded: `wrap` also declines a quote that crosses an
	 * inline element, and that mark is present, merely undrawn.
	 */
	let fuzzy = $state<Mark[]>([]);

	$effect(() => {
		if (!scope) return;
		const root = scope;
		const stored = load();
		if (stored.length === 0) return;
		// A frame after hydration: the prose and its own marks have to be settled
		// before a whole quote can be found inside one text node.
		const id = requestAnimationFrame(() => {
			const prose = flatten(root.textContent ?? '').text;
			for (const m of stored) wrap(root, m);
			marks = stored;
			fuzzy = stored.filter((m) => !prose.includes(m.anchor.quote));
		});
		return () => cancelAnimationFrame(id);
	});

	// ── The rough layer: the marks are drawn ────────────────────────────────

	let layer = $state<SVGSVGElement | null>(null);
	/** Bumped when something that moves the text happens — fonts, resize, mode. */
	let geometry = $state(0);
	/** Which marks have had their draw-on animation; a redraw must not replay it. */
	let animated = new Set<number>();

	$effect(() => {
		const bump = () => geometry++;
		window.addEventListener('resize', bump);
		// Web fonts land after first paint and move every line under them.
		const id = setTimeout(bump, 300);
		return () => {
			window.removeEventListener('resize', bump);
			clearTimeout(id);
		};
	});

	$effect(() => {
		const svg = layer;
		const root = scope;
		void geometry;
		void hoverN;
		const list = marks;
		if (!svg || !root || list.length === 0) return;

		let cancelled = false;
		import('roughjs').then(({ default: rough }) => {
			if (cancelled) return;
			while (svg.firstChild) svg.removeChild(svg.firstChild);

			const box = root.getBoundingClientRect();
			const k = root.offsetWidth ? box.width / root.offsetWidth : 1;
			svg.setAttribute('viewBox', `0 0 ${root.offsetWidth} ${root.offsetHeight}`);
			const rc = rough.svg(svg);
			const local = (r: DOMRect) => ({
				left: (r.left - box.left) / k,
				right: (r.right - box.left) / k,
				top: (r.top - box.top) / k,
				bottom: (r.bottom - box.top) / k,
				width: r.width / k,
				height: r.height / k
			});

			for (const m of list) {
				const span = root.querySelector(`[data-mark="${m.n}"]`);
				if (!span) continue;
				const rects = Array.from(span.getClientRects()).map(local).filter((r) => r.width > 1);
				if (rects.length === 0) continue;
				const sup = root.querySelector(`[data-idx="${m.n}"]`);
				const g = draw(
					rc,
					svg,
					m,
					rects,
					sup ? local(sup.getBoundingClientRect()) : null,
					hoverN === m.n
				);
				if (!animated.has(m.n)) {
					animated.add(m.n);
					animate(g);
				}
			}
		});

		return () => {
			cancelled = true;
		};
	});

	/** A rect in the scope's own coordinates, not the viewport's. */
	interface Rect {
		left: number;
		right: number;
		top: number;
		bottom: number;
		width: number;
		height: number;
	}

	/** Each gesture is a different hand: a rule, a strike, a wobble, a query. */
	function draw(
		rc: import('roughjs/bin/svg').RoughSVG,
		svg: SVGSVGElement,
		mark: Mark,
		rects: Rect[],
		sup: Rect | null,
		emph: boolean
	): SVGGElement {
		const stroke = INK[mark.kind];
		const seed = mark.n * 137 + 7;
		const o = (extra: Record<string, unknown> = {}) => ({
			stroke,
			strokeWidth: emph ? 2.6 : 1.9,
			roughness: 1.5,
			bowing: 1.4,
			seed,
			...extra
		});
		const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');

		// A note is bracketed in the margin, not underlined — it is addressed
		// somewhere, and the prose should not look edited by it.
		if (mark.kind === 'note') {
			const top = Math.min(...rects.map((r) => r.top));
			const bot = Math.max(...rects.map((r) => r.bottom));
			const x = Math.min(...rects.map((r) => r.left)) - 9;
			g.appendChild(rc.line(x, top + 1, x, bot - 1, o({ strokeWidth: emph ? 3.4 : 2.6 })));
			g.appendChild(rc.line(x - 3, top + 1, x + 3, top + 1, o({ strokeWidth: 1.4 })));
			g.appendChild(rc.line(x - 3, bot - 1, x + 3, bot - 1, o({ strokeWidth: 1.4 })));
		}

		rects.forEach((r, i) => {
			const y = r.bottom - 1.5;
			const s = { seed: seed + i * 11 };
			if (mark.kind === 'keep') {
				g.appendChild(rc.line(r.left, y, r.right, y, o(s)));
			} else if (mark.kind === 'dissent') {
				g.appendChild(rc.line(r.left, y, r.right, y, o(s)));
				g.appendChild(
					rc.line(r.left, y + 3.4, r.right, y + 3.4, o({ ...s, strokeWidth: emph ? 2 : 1.4 }))
				);
				// One stroke away from the last line — the gesture of striking out.
				if (i === rects.length - 1) {
					g.appendChild(
						rc.line(r.right + 3, y + 5, r.right + 10, y - 7, o({ ...s, strokeWidth: 1.5 }))
					);
				}
			} else if (mark.kind === 'snag') {
				const pts: [number, number][] = [];
				for (let x = r.left; x <= r.right; x += 7) {
					pts.push([x, y + (pts.length % 2 ? 2.4 : -2.4)]);
				}
				if (pts.length > 1) {
					g.appendChild(rc.curve(pts, o({ ...s, strokeWidth: emph ? 2.2 : 1.6, roughness: 0.9 })));
				}
			} else if (mark.kind === 'ask') {
				g.appendChild(rc.line(r.left, y, r.right, y, o({ ...s, strokeWidth: emph ? 2.2 : 1.5 })));
			}
		});

		// A question circles its own numeral: the mark points at the margin,
		// which is where the question is kept.
		if (mark.kind === 'ask' && sup) {
			g.appendChild(
				rc.ellipse(
					sup.left + sup.width / 2,
					sup.top + sup.height / 2,
					sup.width + 9,
					sup.height + 8,
					o({ strokeWidth: 1.5, roughness: 1.8 })
				)
			);
		}

		svg.appendChild(g);
		return g;
	}

	/** The stroke draws itself on, once, the way a pen would. */
	function animate(g: SVGGElement) {
		g.querySelectorAll('path').forEach((p, i) => {
			let len = 0;
			try {
				len = p.getTotalLength();
			} catch {
				return;
			}
			if (!len) return;
			p.style.strokeDasharray = String(len);
			p.style.strokeDashoffset = String(len);
			p.style.animation = `mk-draw ${Math.min(0.62, 0.16 + len / 420)}s ease-out ${i * 0.07}s forwards`;
		});
	}
</script>

<div class="scope" bind:this={scope}>
	{@render children()}

	<svg class="mk-layer" bind:this={layer} aria-hidden="true"></svg>

	{#if at}
		<!-- The bar is ink, not paper: it is an instrument laid over the page,
		     and it should read as belonging to the reader rather than to the
		     essay. -->
		<div class="bar" bind:this={bar} style:left="{at.x}px" style:top="{at.y}px">
			<div class="row">
				{#each KINDS as kind (kind)}
					<button
						type="button"
						onclick={() => pick(kind)}
						onmouseenter={() => (hint = kind)}
						onmouseleave={() => (hint = hint === kind ? null : hint)}
					>
						{@render glyph(kind, 16)}
						<span class="name">{t.labels[kind]}</span>
					</button>
				{/each}
			</div>
			<div class="hint">{hint ? t.hints[hint] : t.pickOne}</div>
			<span class="caret" aria-hidden="true"></span>
		</div>
	{/if}

	{#if noting}
		<div class="note-sheet" bind:this={bar}>
			<div class="note-head">{t.labels.note}</div>
			<p class="note-quote">“{noting.quote.slice(0, 90)}{noting.quote.length > 90 ? '…' : ''}”</p>
			<!-- svelte-ignore a11y_autofocus -->
			<textarea
				autofocus
				rows="3"
				bind:value={noteText}
				placeholder={t.notePlaceholder}
				onkeydown={(e) => {
					if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) submitNote();
				}}
			></textarea>
			<div class="note-foot">
				<span class="reach">{t.reachAuthor}</span>
				<span class="note-actions">
					<button type="button" class="ghost" onclick={() => ((noting = null), (noteText = ''))}
						>{t.cancel}</button
					>
					<button type="button" class="solid" onclick={submitNote}>{t.send}</button>
				</span>
			</div>
		</div>
	{/if}

	{#if sent}
		<div class="sent">{t.sent}</div>
	{/if}

	{#if fuzzy.length > 0}
		<!-- Nothing is drawn over the prose for these: the sentence they were
		     made on is not there to draw on. They are listed instead, with the
		     revision each was made at, so the reader can see what they marked
		     rather than wonder where it went. -->
		<aside class="fuzzy">
			<span class="fuzzy-head">{t.fuzzyTitle}</span>
			<ul>
				{#each fuzzy as m (m.n)}
					<li>
						<span class="fuzzy-quote"
							>“{m.anchor.quote.slice(0, 90)}{m.anchor.quote.length > 90 ? '…' : ''}”</span
						>
						<span class="fuzzy-at">
							{t.labels[m.kind]}{m.rev ? ` · ${fill(t.fuzzyAt, { r: m.rev })}` : ''}
						</span>
					</li>
				{/each}
			</ul>
		</aside>
	{/if}
</div>

{#snippet glyph(kind: Kind, size: number)}
	<!-- Editorial marks drawn as strokes, never emoji (InkMarks, line 47). -->
	<svg width={size} height={size} viewBox="0 0 16 16" class="glyph" aria-hidden="true">
		{#if kind === 'keep'}
			<path d="M2 5h12" stroke-width="1" opacity="0.35" />
			<path d="M2 12h12" stroke-width="2" />
		{:else if kind === 'dissent'}
			<path d="M2 11h12M2 13.5h12" />
			<path d="M11 2.5 5 8" />
		{:else if kind === 'snag'}
			<path d="M2 8c1.6-3 3.2 3 4.8 0s3.2 3 4.8 0 1.6-1.5 2.4-1.5" />
		{:else if kind === 'ask'}
			<path d="M5.2 5.4a2.8 2.8 0 1 1 2.9 2.9v2" />
			<circle cx="8.1" cy="13" r="0.9" fill="currentColor" stroke="none" />
		{:else if kind === 'note'}
			<path d="M12.5 2.5 6 9l-1.6 3.6L8 11z" />
			<path d="M2.5 14h5" />
		{/if}
	</svg>
{/snippet}

<style>
	.scope {
		position: relative;
	}

	.fuzzy {
		margin-top: 34px;
		border-top: 1px solid var(--rule);
		padding-top: 14px;
	}
	.fuzzy-head {
		font-family: var(--mono);
		font-size: 10.5px;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--faint);
	}
	.fuzzy ul {
		margin: 10px 0 0;
		padding: 0;
		list-style: none;
		display: grid;
		gap: 10px;
	}
	.fuzzy li {
		display: grid;
		gap: 3px;
	}
	.fuzzy-quote {
		font-family: var(--body);
		font-size: 15px;
		line-height: 1.5;
		color: var(--muted);
		/* Faded rather than struck: the mark is uncertain, not cancelled. */
		opacity: 0.75;
	}
	.fuzzy-at {
		font-family: var(--mono);
		font-size: 10px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--faint);
	}

	.mk-layer {
		position: absolute;
		inset: 0;
		pointer-events: none;
		z-index: 5;
		overflow: visible;
	}

	.glyph {
		display: block;
		flex: none;
		fill: none;
		stroke: currentColor;
		stroke-width: 1.6;
		stroke-linecap: round;
	}

	/**
	 * The bar is the page's own two colours, swapped: an ink field with paper
	 * marks on it. That is what makes it read as an instrument laid over the
	 * essay rather than as part of it — and it has to be expressed in *tokens*,
	 * because `--ink` and `--paper` trade places at night. The design canvas
	 * hardcodes white on a fixed dark, which is right for a light-only mock and
	 * unreadable here the moment the field turns light.
	 */
	.bar {
		--bar-field: var(--ink);
		--bar-mark: var(--paper);
		position: absolute;
		transform: translate(-50%, -100%);
		z-index: 60;
		filter: drop-shadow(0 12px 26px rgba(13, 13, 17, 0.28));
	}
	.row {
		display: flex;
		align-items: stretch;
		background: var(--bar-field);
	}
	.row button {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 5px;
		min-width: 62px;
		padding: 9px 13px 8px;
		background: none;
		border: none;
		border-left: 1px solid color-mix(in srgb, var(--bar-mark) 16%, transparent);
		color: var(--bar-mark);
		cursor: pointer;
	}
	.row button:first-child {
		border-left: none;
	}
	.row button:hover {
		background: var(--panel-blue);
		color: var(--on-blue);
	}
	.name {
		font-family: var(--mono);
		font-size: 9px;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		opacity: 0.72;
	}
	.row button:hover .name {
		opacity: 1;
	}
	/* The bar explains itself rather than relying on a tooltip: five words the
	   reader has never seen before need saying, not hovering over. */
	.hint {
		background: var(--bar-field);
		border-top: 1px solid color-mix(in srgb, var(--bar-mark) 16%, transparent);
		padding: 5px 12px 6px;
		color: color-mix(in srgb, var(--bar-mark) 68%, transparent);
		font-family: var(--mono);
		font-size: 9.5px;
		letter-spacing: 0.04em;
		text-align: center;
		white-space: nowrap;
	}
	.caret {
		position: absolute;
		left: 50%;
		top: 100%;
		transform: translateX(-50%);
		width: 0;
		height: 0;
		border-left: 7px solid transparent;
		border-right: 7px solid transparent;
		border-top: 7px solid var(--bar-field);
	}

	.note-sheet {
		position: fixed;
		right: 24px;
		bottom: 24px;
		z-index: 70;
		width: 320px;
		background: var(--paper);
		border: 1.5px solid var(--rule-hard);
		box-shadow: 0 10px 30px rgba(13, 13, 17, 0.16);
		padding: 14px 16px 13px;
	}
	.note-head {
		font-family: var(--mono);
		font-size: 9.5px;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--blue);
	}
	.note-quote {
		margin: 8px 0 10px;
		font-size: 13px;
		font-style: italic;
		line-height: 1.5;
		color: var(--muted);
	}
	textarea {
		display: block;
		width: 100%;
		box-sizing: border-box;
		background: var(--paper2);
		border: 1px solid var(--rule);
		color: var(--ink);
		font-family: var(--body);
		font-size: 13px;
		line-height: 1.55;
		padding: 8px 10px;
		resize: none;
	}
	textarea:focus {
		outline: none;
		border-color: var(--blue);
	}
	.note-foot {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 10px;
		margin-top: 9px;
	}
	.reach {
		font-family: var(--mono);
		font-size: 9px;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--muted);
	}
	.note-actions {
		display: flex;
		gap: 6px;
	}
	.ghost,
	.solid {
		border: none;
		cursor: pointer;
		font-family: var(--mono);
		font-size: 9.5px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		padding: 6px 12px;
	}
	.ghost {
		background: none;
		color: var(--muted);
	}
	.ghost:hover {
		color: var(--blue);
	}
	.solid {
		background: var(--panel-blue);
		color: var(--on-blue);
	}

	.sent {
		position: fixed;
		right: 24px;
		bottom: 24px;
		z-index: 70;
		background: var(--ink);
		color: var(--paper);
		font-family: var(--mono);
		font-size: 10px;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		padding: 10px 14px;
	}
</style>
