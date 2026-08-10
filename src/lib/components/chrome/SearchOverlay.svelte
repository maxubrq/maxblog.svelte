<script lang="ts" module>
	/**
	 * Index cache, module scope: the overlay is mounted only while it is open,
	 * so without this every ⌘K would refetch the corpus and rebuild the index.
	 * Keyed by locale — the two editions are separate indexes.
	 */
	const cache = new Map<string, { corpus: SearchCorpus; mini: MiniSearch }>();
</script>

<script lang="ts">
	/**
	 * Universal search — the whole site behind one field (⌘K, or the header
	 * button). Three kinds of hit: an essay, a section inside one, a passage of
	 * its prose. Same shape as the production blog's `SearchContent`.
	 *
	 * Two things it does differently. The corpus is a prerendered JSON file
	 * fetched the first time search opens, and this component is itself
	 * dynamically imported by the layout — so a reader who never searches loads
	 * neither the index nor MiniSearch. And matching is MiniSearch rather than a
	 * substring scan, which buys prefix matching while you type, tolerance for a
	 * typo, diacritic folding, and results ordered by relevance.
	 */
	import { goto } from '$app/navigation';
	import Tag from '$lib/components/ink/Tag.svelte';
	import type { SearchCorpus, SearchPassage, SearchPost, SearchSection } from '$lib/content/search';
	import { EMPTY_CORPUS } from '$lib/content/search';
	import { fill, href, useI18n } from '$lib/i18n';
	import { search } from '$lib/search.svelte';
	import MiniSearch from 'minisearch';

	const i18n = useI18n();
	const t = $derived(i18n.t.search);

	type Scope = 'all' | 'posts' | 'sections' | 'passages';
	type Hit =
		| { kind: 'post'; data: SearchPost }
		| { kind: 'section'; data: SearchSection }
		| { kind: 'passage'; data: SearchPassage };

	// `raw`, both of them: these are replaced wholesale, never mutated, and a
	// deep proxy around MiniSearch would wrap its internal maps — which makes
	// `search()` answer differently on each call, so counts and results stop
	// agreeing with each other.
	let corpus = $state.raw<SearchCorpus>(EMPTY_CORPUS);
	let status = $state<'idle' | 'loading' | 'ready' | 'failed'>('idle');
	let q = $state('');
	let scope = $state<Scope>('all');
	let topic = $state<string | null>(null);
	let cursor = $state(0);
	let field = $state<HTMLInputElement>();
	let list = $state<HTMLElement>();

	/** One index over all three kinds; `kind` is stored so scoping is a filter. */
	let mini = $state.raw<MiniSearch | null>(null);

	function indexOf(c: SearchCorpus): MiniSearch {
		const ms = new MiniSearch({
			fields: ['title', 'excerpt', 'topic', 'label', 'text', 'postTitle'],
			storeFields: ['kind'],
			// A hyphen inside a slug or an em dash mid-sentence should not weld
			// two words into one token.
			tokenize: (s) => s.split(/[\s\-—–_/()[\]{}"'“”‘’.,;:!?]+/u).filter(Boolean),
			// Fold diacritics on both sides, so `cong ty` finds `Công ty`. Half
			// the corpus is Vietnamese and typing it unaccented is normal; leaving
			// this to `fuzzy` would make it luck rather than a rule.
			processTerm: (term) =>
				term
					.normalize('NFD')
					.replace(/\p{Diacritic}/gu, '')
					.replace(/đ/gi, 'd')
					.toLowerCase(),
			searchOptions: {
				prefix: true,
				// Enough to survive a slip; more than this and unrelated essays
				// start answering.
				fuzzy: 0.2,
				// Every word must appear. Vietnamese syllables are short, and once
				// diacritics are folded an OR query on `cong ty` matches half the
				// corpus on `ty` alone. AND is also nearer the production blog,
				// which substring-matched the query whole.
				combineWith: 'AND',
				boost: { title: 4, label: 2.5, topic: 2, postTitle: 1.5 }
			}
		});

		ms.addAll([
			...c.posts.map((p) => ({ ...p, id: `post:${p.slug}`, kind: 'post' })),
			...c.sections.map((s) => ({ ...s, id: `section:${s.id}`, kind: 'section' })),
			...c.passages.map((p) => ({ ...p, id: `passage:${p.id}`, kind: 'passage' }))
		]);
		return ms;
	}

	async function loadCorpus() {
		const hit = cache.get(i18n.lang);
		if (hit) {
			({ corpus, mini } = hit);
			status = 'ready';
			return;
		}
		status = 'loading';
		try {
			const res = await fetch(href(i18n.lang, '/search-index.json'));
			if (!res.ok) throw new Error(String(res.status));
			corpus = await res.json();
			mini = indexOf(corpus);
			cache.set(i18n.lang, { corpus, mini });
			status = 'ready';
		} catch {
			status = 'failed';
		}
	}

	// Mounted only while open (the layout gates it), so this runs per opening.
	$effect(() => {
		loadCorpus();
		field?.focus();

		const previous = document.body.style.overflow;
		document.body.style.overflow = 'hidden';
		return () => {
			document.body.style.overflow = previous;
		};
	});

	const byId = $derived(new Map(corpus.posts.map((p) => [p.slug, p])));
	const inTopic = (slug: string) => !topic || byId.get(slug)?.topic === topic;

	/** Every hit for the current query, in MiniSearch's relevance order. */
	const hits = $derived.by<Hit[]>(() => {
		const query = q.trim();
		if (!query || !mini) return [];

		const posts = new Map(corpus.posts.map((p) => [p.slug, p]));
		const sections = new Map(corpus.sections.map((s) => [s.id, s]));
		const passages = new Map(corpus.passages.map((p) => [p.id, p]));

		const out: Hit[] = [];
		for (const r of mini.search(query)) {
			const [kind, id] = String(r.id).split(/:(.*)/s);
			if (kind === 'post') {
				const data = posts.get(id);
				if (data && inTopic(data.slug)) out.push({ kind: 'post', data });
			} else if (kind === 'section') {
				const data = sections.get(id);
				if (data && inTopic(data.slug)) out.push({ kind: 'section', data });
			} else {
				const data = passages.get(id);
				if (data && inTopic(data.slug)) out.push({ kind: 'passage', data });
			}
		}
		return out;
	});

	const counts = $derived({
		posts: hits.filter((h) => h.kind === 'post').length,
		sections: hits.filter((h) => h.kind === 'section').length,
		passages: hits.filter((h) => h.kind === 'passage').length
	});
	const total = $derived(hits.length);

	/** The flat list the cursor walks — grouped by kind, so it matches the layout. */
	const shown = $derived.by<Hit[]>(() => {
		const order = ['post', 'section', 'passage'] as const;
		const keep = (k: (typeof order)[number]) => scope === 'all' || scope === `${k}s`;
		return order.filter(keep).flatMap((k) => hits.filter((h) => h.kind === k));
	});

	const topics = $derived([...new Set(corpus.posts.map((p) => p.topic).filter(Boolean))].sort());

	/** The chips on the empty state: every topic, then a couple of title openings. */
	const suggestions = $derived.by(() => {
		const words = corpus.posts.flatMap((p) => [
			p.topic,
			p.title.split(/\s+/).slice(0, 2).join(' ').toLowerCase()
		]);
		return [...new Set(words.filter(Boolean))].slice(0, 6);
	});

	// A changed query or filter invalidates wherever the cursor was.
	$effect(() => {
		void q;
		void scope;
		void topic;
		cursor = 0;
	});

	$effect(() => {
		void cursor;
		list?.querySelector('[data-cursor="true"]')?.scrollIntoView({ block: 'nearest' });
	});

	function urlFor(hit: Hit): string {
		const anchor =
			hit.kind === 'section'
				? hit.data.anchor
				: hit.kind === 'passage' && hit.data.anchor
					? hit.data.anchor
					: '';
		return href(i18n.lang, `/writing/${hit.data.slug}${anchor ? `#${anchor}` : ''}`);
	}

	function openHit(hit: Hit) {
		search.hide();
		goto(urlFor(hit));
	}

	function onKeyDown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			e.preventDefault();
			search.hide();
		} else if (e.key === 'ArrowDown') {
			e.preventDefault();
			cursor = Math.min(shown.length - 1, cursor + 1);
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			cursor = Math.max(0, cursor - 1);
		} else if (e.key === 'Enter' && shown[cursor]) {
			e.preventDefault();
			openHit(shown[cursor]);
		}
	}

	/**
	 * Split `text` around the query's terms so they can be marked. Prefix
	 * matching means a term matches the *start* of a word, which is what the
	 * index does too — highlighting the whole word would over-claim.
	 */
	function segments(text: string): Array<{ s: string; hit: boolean }> {
		const terms = q
			.trim()
			.split(/\s+/)
			.filter((w) => w.length > 1)
			.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
		if (terms.length === 0) return [{ s: text, hit: false }];

		// The split regex is global; the test regex must not be — a /g regex
		// carries `lastIndex` between calls and would flip its answer on
		// alternate pieces.
		const split = new RegExp(`(${terms.join('|')})`, 'gi');
		const isTerm = new RegExp(`^(?:${terms.join('|')})$`, 'i');
		return text
			.split(split)
			.filter(Boolean)
			.map((s) => ({ s, hit: isTerm.test(s) }));
	}

	const plural = (n: number) => (n === 1 ? t.result : t.results);
</script>

<svelte:window onkeydown={onKeyDown} />

<div class="overlay" role="dialog" aria-modal="true" aria-label={t.open}>
		<header>
			<span class="glyph">⌕</span>
			<!-- svelte-ignore a11y_autofocus -->
			<input
				bind:this={field}
				bind:value={q}
				class="field"
				type="text"
				placeholder={t.placeholder}
				autocomplete="off"
				autocapitalize="off"
				spellcheck="false"
			/>
			{#if q}
				<Tag>{total} {plural(total)}</Tag>
			{/if}
			<button class="esc" onclick={() => search.hide()}>{t.close}</button>
		</header>

		<div class="body">
			<aside>
				<div class="rail-label"><Tag>{t.scope}</Tag></div>
				{#each [['all', t.all, total], ['posts', t.posts, counts.posts], ['sections', t.sections, counts.sections], ['passages', t.passages, counts.passages]] as const as [id, label, count] (id)}
					<button
						class="scope"
						class:on={scope === id}
						onclick={() => (scope = id as Scope)}
						aria-pressed={scope === id}
					>
						<span>{label}</span>
						{#if count > 0}<span class="count">{count}</span>{/if}
					</button>
				{/each}

				{#if topics.length > 0}
					<div class="topics">
						<Tag>{t.filterTopic}</Tag>
						<div class="chips">
							{#each topics as name (name)}
								<button
									class="chip"
									class:on={topic === name}
									onclick={() => (topic = topic === name ? null : name)}
									aria-pressed={topic === name}>{name}</button
								>
							{/each}
						</div>
					</div>
				{/if}
			</aside>

			<main bind:this={list}>
				{#if status === 'failed'}
					<p class="notice">{t.failed}</p>
				{:else if status !== 'ready'}
					<p class="notice">{t.loading}</p>
				{:else if !q}
					<div class="empty">
						<div class="empty-head"><Tag>{t.startTyping}</Tag></div>
						<div class="chips wide">
							{#each suggestions as s (s)}
								<button class="chip big" onclick={() => (q = s)}>{s}</button>
							{/each}
						</div>

						<div class="all-head"><Tag>{t.allPosts}</Tag></div>
						{#each corpus.posts as p, i (p.slug)}
							<button class="all-row" onclick={() => openHit({ kind: 'post', data: p })}>
								<span class="num">{String(i + 1).padStart(2, '0')}</span>
								<span class="all-title">{p.title}</span>
								<Tag>{p.topic}</Tag>
							</button>
						{/each}
					</div>
				{:else if total === 0}
					<div class="none">
						<p class="none-title">{fill(t.nothingFound, { q })}</p>
						<button class="clear" onclick={() => (q = '')}>{t.clear}</button>
					</div>
				{:else}
					{#each shown as hit, i (hit.kind + hit.data.slug + ('id' in hit.data ? hit.data.id : ''))}
						{@const first = i === 0 || shown[i - 1].kind !== hit.kind}
						{#if first}
							<div class="group">
								<Tag
									>{hit.kind === 'post'
										? t.posts
										: hit.kind === 'section'
											? t.sections
											: t.passages}</Tag
								>
								<Tag>{counts[`${hit.kind}s` as keyof typeof counts]}</Tag>
							</div>
						{/if}

						<div
							class="row"
							class:cursor={cursor === i}
							data-cursor={cursor === i ? 'true' : undefined}
							role="button"
							tabindex="-1"
							onclick={() => openHit(hit)}
							onmouseenter={() => (cursor = i)}
							onkeydown={(e) => e.key === 'Enter' && openHit(hit)}
						>
							{#if hit.kind === 'post'}
								<div class="tags">
									<Tag>{t.essay}</Tag>
									<Tag>{hit.data.topic}</Tag>
								</div>
								<h3>
									{#each segments(hit.data.title) as seg}{#if seg.hit}<mark
											>{seg.s}</mark
										>{:else}{seg.s}{/if}{/each}
								</h3>
								{#if hit.data.excerpt}
									<p class="excerpt">
										{#each segments(hit.data.excerpt) as seg}{#if seg.hit}<mark
												>{seg.s}</mark
											>{:else}{seg.s}{/if}{/each}
									</p>
								{/if}
								<p class="meta">
									{hit.data.topic}{hit.data.date ? ` · ${hit.data.date}` : ''} · {hit.data
										.readMin}′
								</p>
							{:else if hit.kind === 'section'}
								<div class="tags"><Tag>{t.section}</Tag></div>
								<div class="section-row">
									<div>
										<h3>
											<span class="mark-glyph">{hit.data.level === 3 ? '§§' : '§'}</span>
											{#each segments(hit.data.label) as seg}{#if seg.hit}<mark
													>{seg.s}</mark
												>{:else}{seg.s}{/if}{/each}
										</h3>
										<p class="meta">{fill(t.inPost, { title: hit.data.postTitle })}</p>
									</div>
									<span class="arrow">→</span>
								</div>
							{:else}
								<div class="tags"><Tag on>{t.passage}</Tag></div>
								<blockquote>
									{#each segments(hit.data.text) as seg}{#if seg.hit}<mark
											>{seg.s}</mark
										>{:else}{seg.s}{/if}{/each}
								</blockquote>
								<p class="meta">
									{fill(t.fromPost, { title: hit.data.postTitle })}{hit.data.section
										? ` · § ${hit.data.section}`
										: ''}
								</p>
							{/if}
						</div>
					{/each}
				{/if}
			</main>
		</div>

		<footer>
			<div class="legend">
				<span><kbd>↑</kbd><kbd>↓</kbd><Tag>{t.navigate}</Tag></span>
				<span><kbd>↵</kbd><Tag>{t.openResult}</Tag></span>
				<span><kbd>⌘</kbd><kbd>K</kbd><Tag>{t.reopen}</Tag></span>
				<span><kbd>esc</kbd><Tag>{t.closeKey}</Tag></span>
			</div>
			<Tag>{q ? `${total} ${plural(total)}` : t.typeToSearch}</Tag>
		</footer>
</div>

<style>
	.overlay {
		position: fixed;
		inset: 0;
		z-index: 300;
		display: grid;
		grid-template-rows: auto 1fr auto;
		overflow: hidden;
		background: var(--paper);
		color: var(--ink);
		font-family: var(--body);
	}

	header {
		display: flex;
		align-items: center;
		gap: 18px;
		padding: 24px var(--pad-chrome);
		border-bottom: 1.5px solid var(--rule-hard);
	}
	.glyph {
		font-family: var(--mono);
		font-size: 16px;
		letter-spacing: 0.1em;
		color: var(--blue);
	}
	.field {
		flex: 1;
		min-width: 0;
		border: none;
		outline: none;
		background: transparent;
		font-family: var(--display);
		font-weight: 500;
		font-size: clamp(24px, 3.4vw, 40px);
		letter-spacing: -0.03em;
		color: var(--ink);
	}
	.field::placeholder {
		color: var(--faint);
	}
	.esc {
		flex-shrink: 0;
		background: transparent;
		border: 1px solid var(--rule);
		padding: 4px 9px;
		font-family: var(--mono);
		font-size: 10.5px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--muted);
		cursor: pointer;
	}
	.esc:hover {
		color: var(--blue);
		border-color: var(--blue);
	}

	.body {
		display: grid;
		grid-template-columns: 220px 1fr;
		min-height: 0;
	}
	aside {
		border-right: 1.5px solid var(--rule-hard);
		padding: 18px 0;
		overflow-y: auto;
	}
	.rail-label {
		padding: 0 22px 10px;
	}
	.scope {
		display: flex;
		width: 100%;
		justify-content: space-between;
		align-items: center;
		gap: 10px;
		padding: 10px 22px;
		background: transparent;
		border: none;
		cursor: pointer;
		text-align: left;
		font-family: var(--mono);
		font-size: 12px;
		letter-spacing: 0.05em;
		color: var(--ink);
	}
	.scope:hover {
		color: var(--blue);
	}
	.scope.on {
		background: var(--panel-blue);
		color: var(--on-blue);
	}
	.count {
		opacity: 0.6;
		font-size: 11px;
	}

	.topics {
		margin-top: 8px;
		padding: 18px 22px 0;
		border-top: 1px solid var(--rule);
	}
	.chips {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		margin-top: 12px;
	}
	.chip {
		font-family: var(--mono);
		font-size: 10.5px;
		letter-spacing: 0.06em;
		border: 1px solid var(--rule);
		background: transparent;
		color: var(--muted);
		padding: 4px 8px;
		cursor: pointer;
	}
	.chip:hover {
		border-color: var(--blue);
		color: var(--blue);
	}
	.chip.on {
		background: var(--panel-blue);
		border-color: var(--panel-blue);
		color: var(--on-blue);
	}
	.chip.big {
		font-size: 12px;
		padding: 7px 14px;
		color: var(--ink);
	}

	main {
		overflow-y: auto;
	}
	.notice,
	.none {
		padding: 60px var(--pad-chrome);
		font-family: var(--mono);
		font-size: 12px;
		color: var(--muted);
	}
	.none {
		text-align: center;
	}
	.none-title {
		font-family: var(--display);
		font-weight: 500;
		font-size: 24px;
		letter-spacing: -0.02em;
		text-transform: lowercase;
		color: var(--muted);
		margin: 0 0 18px;
	}
	.clear {
		background: transparent;
		border: none;
		padding: 0;
		font-family: var(--mono);
		font-size: 12px;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--blue);
		cursor: pointer;
	}

	.empty {
		padding: 20px var(--pad-chrome) 40px;
	}
	.empty-head {
		margin-bottom: 16px;
	}
	.chips.wide {
		margin-bottom: 36px;
	}
	.all-head {
		padding-bottom: 8px;
		border-bottom: 1.5px solid var(--rule-hard);
	}
	.all-row {
		display: grid;
		grid-template-columns: 34px 1fr auto;
		gap: 18px;
		align-items: baseline;
		width: 100%;
		padding: 16px 0;
		border: none;
		border-bottom: 1px solid var(--rule);
		background: transparent;
		text-align: left;
		cursor: pointer;
	}
	.all-row:hover .all-title {
		color: var(--blue);
	}
	.num {
		font-family: var(--mono);
		font-size: 12px;
		color: var(--faint);
	}
	.all-title {
		font-family: var(--display);
		font-weight: 500;
		font-size: 18px;
		letter-spacing: -0.02em;
		color: var(--ink);
	}

	.group {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		padding: 20px var(--pad-chrome) 8px;
	}
	.row {
		padding: 16px var(--pad-chrome);
		border-top: 1px solid var(--rule);
		cursor: pointer;
		transition: background 0.1s;
	}
	.row.cursor {
		background: var(--paper2);
		box-shadow: inset 2px 0 0 var(--blue);
	}
	.tags {
		display: flex;
		gap: 10px;
		margin-bottom: 8px;
	}
	.row h3 {
		font-family: var(--display);
		font-weight: 600;
		font-size: 20px;
		letter-spacing: -0.02em;
		line-height: 1.1;
		text-transform: none;
		margin: 0 0 6px;
	}
	.mark-glyph {
		color: var(--blue);
		margin-right: 8px;
	}
	.excerpt {
		font-size: 13.5px;
		line-height: 1.5;
		color: var(--muted);
		max-width: 62ch;
		margin: 0 0 8px;
	}
	.meta {
		font-family: var(--mono);
		font-size: 10.5px;
		letter-spacing: 0.06em;
		color: var(--faint);
		margin: 0;
	}
	.section-row {
		display: grid;
		grid-template-columns: 1fr auto;
		align-items: baseline;
		gap: 20px;
	}
	.section-row h3 {
		font-size: 18px;
		margin-bottom: 4px;
	}
	.arrow {
		font-family: var(--mono);
		font-size: 14px;
		color: var(--blue);
	}
	blockquote {
		margin: 0 0 8px;
		border-left: 2px solid var(--blue);
		padding-left: 14px;
		font-size: 15px;
		line-height: 1.55;
		color: var(--ink);
	}
	mark {
		background: color-mix(in oklab, var(--blue) 18%, transparent);
		color: var(--ink);
		padding: 0 1px;
		font-weight: 600;
	}

	footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 24px;
		padding: 12px var(--pad-chrome);
		border-top: 1.5px solid var(--rule-hard);
	}
	.legend {
		display: flex;
		flex-wrap: wrap;
		gap: 22px;
		align-items: center;
	}
	.legend span {
		display: flex;
		gap: 6px;
		align-items: center;
	}
	kbd {
		display: inline-block;
		font-family: var(--mono);
		font-size: 11px;
		border: 1px solid var(--rule);
		padding: 2px 7px;
		min-width: 14px;
		text-align: center;
		color: var(--ink);
	}

	@media (max-width: 860px) {
		header {
			padding: 16px 18px;
			gap: 12px;
		}
		.body {
			grid-template-columns: 1fr;
		}
		aside {
			border-right: none;
			border-bottom: 1.5px solid var(--rule-hard);
			display: flex;
			align-items: center;
			gap: 4px;
			padding: 10px 18px;
			overflow-x: auto;
		}
		.rail-label,
		.topics {
			display: none;
		}
		.scope {
			width: auto;
			padding: 6px 12px;
		}
		.row,
		.group,
		.empty,
		.notice,
		.none {
			padding-left: 18px;
			padding-right: 18px;
		}
		.legend span:nth-child(3) {
			display: none;
		}
	}
</style>
