<script lang="ts">
	/**
	 * Reader signals — the author's view of what the writing did. Port of the
	 * production blog's `SignalsDashboard`.
	 *
	 * Everything it shows is either a count or something a reader deliberately
	 * wrote to the author. There is no per-person trail here: `readers` is
	 * distinct sessions, retention is sessions per section, and a letter carries
	 * the last four characters of its session id so two letters from the same
	 * reader can be recognised as one voice — nothing more.
	 *
	 * It reads `/api/signals`, which is behind the same Basic auth as this page,
	 * so the browser sends the credentials it already has.
	 */
	import Tag from '$lib/components/ink/Tag.svelte';
	import { site } from '$lib/site';
	import { onMount } from 'svelte';

	interface PostStats {
		slug: string;
		readers: number;
		finished: number;
		resonates: number;
		thinking: number;
		confused: number;
		letters: number;
		unread: number;
		sections: Array<{ id: string; sessions: number; reach: number }>;
	}
	interface Passage {
		passage: string;
		postSlug: string;
		resonates: number;
		thinking: number;
		confused: number;
		total: number;
	}
	interface Letter {
		id: string;
		postSlug: string;
		passage: string;
		note: string | null;
		createdAt: string;
		kind: string;
		sessionId: string | null;
		readAt: string | null;
	}
	interface SignalsData {
		totals: {
			readers: number;
			finished: number;
			resonates: number;
			thinking: number;
			confused: number;
			letters: number;
			unread: number;
		};
		posts: PostStats[];
		passages: Passage[];
		letters: Letter[];
	}

	let data = $state<SignalsData | null>(null);
	let status = $state<'loading' | 'ready' | 'failed'>('loading');
	let failure = $state('');
	let postFilter = $state('all');
	let expanded = $state<string | null>(null);

	async function load() {
		try {
			const res = await fetch('/api/signals');
			if (!res.ok) {
				// 503 is the honest answer of a deploy with no database, and it is
				// worth saying out loud rather than showing an empty dashboard.
				failure = res.status === 503 ? 'No database configured.' : `The feed answered ${res.status}.`;
				status = 'failed';
				return;
			}
			data = await res.json();
			status = 'ready';
		} catch {
			failure = 'The feed could not be reached.';
			status = 'failed';
		}
	}

	onMount(load);

	async function markRead(id: string) {
		await fetch('/api/signals', {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ id })
		});
		await load();
	}

	function timeAgo(iso: string): string {
		const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
		if (mins < 60) return `${mins}m ago`;
		const hrs = Math.floor(mins / 60);
		if (hrs < 24) return `${hrs}h ago`;
		return `${Math.floor(hrs / 24)}d ago`;
	}

	/** A voice, not an identity: the last four characters and nothing else. */
	const readerLabel = (id: string | null) => (id ? `reader · #${id.slice(-4).toUpperCase()}` : 'reader');

	const posts = $derived(data?.posts ?? []);
	/** The order of the picker: unread letters first, then the busiest. */
	const byReaders = $derived(
		posts.toSorted((a, b) => b.unread - a.unread || b.readers - a.readers || a.slug.localeCompare(b.slug))
	);
	const current = $derived(postFilter === 'all' ? null : (posts.find((p) => p.slug === postFilter) ?? null));
	const totals = $derived(data?.totals);

	const readers = $derived(current ? current.readers : (totals?.readers ?? 0));
	const finished = $derived(current ? current.finished : (totals?.finished ?? 0));
	const letters = $derived(current ? current.letters : (totals?.letters ?? 0));
	const unread = $derived(current ? current.unread : (totals?.unread ?? 0));
	const marks = $derived(
		current
			? current.resonates + current.thinking + current.confused
			: (totals?.resonates ?? 0) + (totals?.thinking ?? 0) + (totals?.confused ?? 0)
	);
	const finishedPct = $derived(readers > 0 ? Math.round((finished / readers) * 100) : 0);

	const stats = $derived([
		[readers.toLocaleString(), 'readers'],
		[`${finishedPct}%`, 'finished'],
		[marks.toLocaleString(), 'marks'],
		[letters.toLocaleString(), unread > 0 ? `letters · ${unread} unread` : 'letters']
	] as const);

	const sections = $derived(current?.sections ?? []);

	const passages = $derived(
		(data?.passages ?? [])
			.filter((p) => postFilter === 'all' || p.postSlug === postFilter)
			.toSorted((a, b) => b.resonates + b.thinking - (a.resonates + a.thinking))
			.slice(0, 6)
	);
	const maxPassage = $derived(Math.max(1, ...passages.map((p) => p.total)));

	const visibleLetters = $derived(
		(data?.letters ?? []).filter((l) => postFilter === 'all' || l.postSlug === postFilter)
	);

	// The retention curve, as one polyline across the sections in reach order.
	const W = 560;
	const H = 130;
	const curve = $derived(
		sections
			.map((s, i) => `${(i / (sections.length - 1)) * W},${H - (s.reach / 100) * (H - 10)}`)
			.join(' ')
	);
</script>

<svelte:head>
	<title>reader signals — {site.name}</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="shell">
	<header>
		<div class="who">
			<span class="wordmark">reader signals</span>
			<Tag on>● author only · private</Tag>
		</div>
		<Tag>{postFilter === 'all' ? `all posts · ${readers.toLocaleString()} readers` : postFilter}</Tag>
	</header>

	{#if posts.length > 0}
		<!-- One line, whatever the archive grows to: a list of chips was already
		     four rows deep at twenty posts. Busiest first, because the post you
		     want to look at is almost always one people are reading. -->
		<div class="filters">
			<Tag>post</Tag>
			<span class="picker">
				<select bind:value={postFilter} aria-label="Filter by post">
					<option value="all">all posts · {posts.length} filed</option>
					{#each byReaders as p (p.slug)}
						<option value={p.slug}>
							{p.slug} · {p.readers} {p.readers === 1 ? 'reader' : 'readers'}{p.unread > 0
								? ` · ${p.unread} unread`
								: ''}
						</option>
					{/each}
				</select>
				<span class="caret" aria-hidden="true">▾</span>
			</span>
			{#if postFilter !== 'all'}
				<button class="link muted" onclick={() => (postFilter = 'all')}>clear</button>
			{/if}
		</div>
	{/if}

	{#if status === 'loading'}
		<p class="quiet">loading…</p>
	{:else if status === 'failed'}
		<p class="quiet">{failure}</p>
	{:else}
		<!-- The strip: four numbers, and every one of them is a count. -->
		<div class="strip">
			{#each stats as [n, label] (label)}
				<div class="stat">
					<div class="n">{n}</div>
					<Tag>{label}</Tag>
				</div>
			{/each}
		</div>

		<div class="halves">
			<section class="half">
				<Tag on>retention ribbon</Tag>
				<p class="note">Where readers slow, stop, or leave — measured locally, never per-person.</p>
				{#if sections.length >= 2}
					<svg viewBox="0 0 {W} {H}" width="100%" aria-hidden="true">
						<polyline points="0,{H} {curve} {W},{H}" fill="var(--blue)" opacity="0.1" />
						<polyline points={curve} fill="none" stroke="var(--blue)" stroke-width="2.5" />
					</svg>
					<div class="axis">
						<Tag>§I</Tag>
						{#if sections.length > 2}<Tag>§{sections.length}</Tag>{/if}
						<Tag>end</Tag>
					</div>
				{:else}
					<p class="quiet inline">
						{postFilter === 'all'
							? 'Select a single post to see its retention.'
							: 'Not enough section data yet.'}
					</p>
				{/if}
			</section>

			<section class="half">
				<Tag on>most-kept passages</Tag>
				<p class="note">Sentences readers underlined for themselves. Counts only — never names.</p>
				{#if passages.length === 0}
					<p class="quiet inline">No reactions yet.</p>
				{:else}
					{#each passages as p (p.postSlug + p.passage)}
						{@const ratio = p.total > 0 ? p.confused / p.total : 0}
						<div class="passage">
							<div class="passage-head">
								<span class="quote"
									>“{p.passage.length > 120 ? p.passage.slice(0, 118) + '…' : p.passage}”</span
								>
								<span class="count">{p.total}</span>
							</div>
							<div class="bar"><div class="fill" style="width: {(p.total / maxPassage) * 100}%"></div></div>
							{#if ratio > 0.3}
								<div class="warn">⚠ confused {Math.round(ratio * 100)}% of readers</div>
							{/if}
						</div>
					{/each}
				{/if}
			</section>
		</div>

		<section class="post">
			<Tag on>letters left for you</Tag>
			{#if visibleLetters.length === 0}
				<p class="quiet inline">No letters yet.</p>
			{:else}
				<div class="letters">
					{#each visibleLetters as l (l.id)}
						{@const text = l.note ?? l.passage ?? ''}
						<article class="letter" class:unread={!l.readAt}>
							<!-- A mark's note was written *against* a sentence; the letter at
							     the end of an essay was not. Only the first has a passage to
							     quote above it. -->
							{#if l.kind === 'note' && l.passage && l.note}
								<p class="against">“{l.passage}”</p>
							{/if}
							<p class="said" class:clamped={expanded !== l.id}>“{text}”</p>
							<div class="foot">
								<Tag
									>{readerLabel(l.sessionId)} · {timeAgo(l.createdAt)}{l.readAt ? '' : ' · unread'}</Tag
								>
								<div class="acts">
									{#if text.length > 200}
										<button
											class="link"
											onclick={() => (expanded = expanded === l.id ? null : l.id)}
										>
											{expanded === l.id ? 'collapse' : 'read full →'}
										</button>
									{/if}
									{#if !l.readAt}
										<button class="link muted" onclick={() => markRead(l.id)}>mark read</button>
									{/if}
								</div>
							</div>
						</article>
					{/each}
				</div>
			{/if}
		</section>
	{/if}
</div>

<style>
	.shell {
		min-height: 100vh;
		background: var(--paper);
		color: var(--ink);
		font-family: var(--body);
	}

	header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		flex-wrap: wrap;
		padding: 20px var(--pad-chrome);
		border-bottom: 1.5px solid var(--rule-hard);
	}
	.who {
		display: flex;
		align-items: baseline;
		gap: 14px;
		flex-wrap: wrap;
	}
	.wordmark {
		font-family: var(--display);
		font-weight: 700;
		font-size: 22px;
		letter-spacing: -0.03em;
		text-transform: lowercase;
	}

	.filters {
		display: flex;
		align-items: center;
		gap: 14px;
		flex-wrap: wrap;
		padding: 14px var(--pad-chrome);
		border-bottom: 1.5px solid var(--rule-hard);
	}
	/* A native select, dressed as a hairline field: the list is long and only
	   the platform's own menu handles that well — type-ahead, keyboard, and a
	   sheet rather than a wall of chips on a phone. */
	.picker {
		position: relative;
		display: inline-flex;
		align-items: center;
	}
	select {
		appearance: none;
		border: 1.5px solid var(--rule);
		border-radius: 0;
		background: transparent;
		color: var(--ink);
		font-family: var(--mono);
		font-size: 11px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		padding: 6px 30px 6px 11px;
		max-width: min(70vw, 460px);
		cursor: pointer;
	}
	select:hover,
	select:focus-visible {
		border-color: var(--blue);
		color: var(--blue);
		outline: none;
	}
	.caret {
		position: absolute;
		right: 11px;
		font-size: 10px;
		color: var(--muted);
		pointer-events: none;
	}
	select:hover + .caret {
		color: var(--blue);
	}

	.strip {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		border-bottom: 1.5px solid var(--rule-hard);
	}
	.stat {
		padding: 22px 24px;
		border-right: 1px solid var(--rule);
	}
	.stat:last-child {
		border-right: none;
	}
	.n {
		font-family: var(--display);
		font-weight: 700;
		font-size: 40px;
		line-height: 1;
		letter-spacing: -0.03em;
		color: var(--blue);
		margin-bottom: 8px;
	}

	/* Two panes split by the same hard rule the rest of the site uses. */
	.halves {
		display: grid;
		grid-template-columns: 1fr 1fr;
	}
	.half {
		padding: 24px 26px;
		border-bottom: 1.5px solid var(--rule-hard);
	}
	.half:first-child {
		border-right: 1.5px solid var(--rule-hard);
	}
	.note {
		font-size: 13px;
		line-height: 1.4;
		color: var(--muted);
		margin: 8px 0 14px;
	}
	svg {
		display: block;
		margin-top: 4px;
	}
	.axis {
		display: flex;
		justify-content: space-between;
		gap: 8px;
		margin-top: 8px;
	}

	.passage {
		margin-bottom: 14px;
	}
	.passage-head {
		display: flex;
		justify-content: space-between;
		gap: 12px;
		margin-bottom: 5px;
	}
	.quote {
		font-family: var(--display);
		font-size: 13.5px;
		line-height: 1.3;
		max-width: 34ch;
	}
	.count {
		font-family: var(--mono);
		font-size: 12px;
		color: var(--blue);
	}
	.bar {
		height: 3px;
		background: var(--rule);
	}
	.fill {
		height: 100%;
		background: var(--blue);
	}
	.warn {
		font-family: var(--mono);
		font-size: 9.5px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--muted);
		margin-top: 4px;
	}

	.post {
		padding: 24px 26px 60px;
	}
	.letters {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 18px;
		margin-top: 16px;
	}
	.letter {
		border: 1.5px solid var(--rule-hard);
		padding: 18px 20px;
	}
	/* Unread wears the blue edge — the only thing on the page asking for anything. */
	.letter.unread {
		border-left: 3px solid var(--blue);
	}
	.against {
		font-size: 12.5px;
		line-height: 1.5;
		color: var(--muted);
		border-left: 1px solid var(--rule);
		padding-left: 10px;
		margin: 0 0 10px;
	}
	.said {
		font-family: var(--display);
		font-weight: 500;
		font-size: 16px;
		line-height: 1.4;
		margin: 0 0 12px;
		text-wrap: pretty;
	}
	.clamped {
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 4;
		line-clamp: 4;
		overflow: hidden;
	}
	.foot {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 10px;
		flex-wrap: wrap;
	}
	.acts {
		display: flex;
		align-items: center;
		gap: 14px;
	}
	.link {
		border: none;
		background: transparent;
		padding: 0;
		cursor: pointer;
		font-family: var(--mono);
		font-size: 10px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--blue);
	}
	.link.muted {
		color: var(--muted);
	}
	.link:hover {
		color: var(--blue);
	}

	.quiet {
		font-family: var(--mono);
		font-size: 12px;
		color: var(--muted);
		padding: 60px var(--pad-chrome);
	}
	.quiet.inline {
		padding: 8px 0 0;
		font-size: 11.5px;
	}

	@media (max-width: 860px) {
		.strip {
			grid-template-columns: 1fr 1fr;
		}
		.stat:nth-child(2) {
			border-right: none;
		}
		.stat:nth-child(-n + 2) {
			border-bottom: 1px solid var(--rule);
		}
		.halves,
		.letters {
			grid-template-columns: 1fr;
		}
		.half:first-child {
			border-right: none;
		}
		header,
		.filters,
		.quiet {
			padding-left: 18px;
			padding-right: 18px;
		}
		.half,
		.post {
			padding-left: 18px;
			padding-right: 18px;
		}
	}
</style>
