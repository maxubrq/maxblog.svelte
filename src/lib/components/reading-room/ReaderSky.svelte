<script lang="ts">
	/**
	 * Your constellation — every essay you have opened drawn as a star, joined
	 * in the order you read them.
	 *
	 * The sky is drawn from *your* reading memory, so no two readers get the
	 * same one and nothing here has left the device. Which is also why the
	 * layout is a force simulation rather than a fixed diagram: the set of
	 * essays is different every time, so there is no arrangement to author.
	 *
	 * `d3-force` is **dynamically imported**, the way `SearchOverlay` imports
	 * MiniSearch: this edition has two runtime dependencies and a reader who
	 * never opens the reading room should not pay for a third.
	 *
	 * Two of production's layers are not here — see the note beside `layers`.
	 */
	import Tag from '$lib/components/ink/Tag.svelte';
	import { href, useI18n } from '$lib/i18n';
	import { MIN_PCT, readMemory, type ReadingMemory } from '$lib/reading-memory';
	import type { Simulation } from 'd3-force';

	export interface StarPost {
		slug: string;
		title: string;
		topic: string;
		/** Slugs this essay hand-picks as next reads — the citation edges. */
		neighbors: string[];
	}

	let { posts }: { posts: StarPost[] } = $props();

	const i18n = useI18n();
	const t = $derived(i18n.t.constellation);

	/** Simulation space (a wide plate). The SVG scales to the viewport. */
	const W = 1600;
	const H = 820;
	const PAD = 60;

	/**
	 * Domains ride an ellipse rather than sitting in fixed quadrants: the sky is
	 * drawn from what one reader has read, so *which* domains are present at all
	 * changes from reader to reader. The order is stable, so a domain does not
	 * jump across the plate between visits.
	 */
	const DOMAIN_RX = 430;
	const DOMAIN_RY = 215;
	function domainAnchor(index: number, count: number) {
		if (count <= 1) return { x: W / 2, y: H / 2 };
		const a = (index / count) * Math.PI * 2 - Math.PI / 2;
		return { x: W / 2 + Math.cos(a) * DOMAIN_RX, y: H / 2 + Math.sin(a) * DOMAIN_RY };
	}

	interface SimNode {
		slug: string;
		title: string;
		domain: string;
		read: boolean;
		finished: boolean;
		x: number;
		y: number;
	}

	/**
	 * The domain layer is the one extra reading of the sky this edition ships.
	 * Production has a second, `concepts` — ideas floating at the centroid of
	 * the essays that invoke them — and it is deliberately absent: see the note
	 * in the README. Kept as an object so adding it back is a key, not a
	 * rewrite.
	 */
	let layers = $state({ domains: false });

	let memory = $state<ReadingMemory>({});
	let mounted = $state(false);
	let hovered = $state<string | null>(null);
	/** Bumped on every tick so the markup re-reads the nodes' live positions. */
	let tick = $state(0);

	$effect(() => {
		memory = readMemory();
		mounted = true;
	});

	const bySlug = $derived(new Map(posts.map((p) => [p.slug, p])));

	/** The visible graph, derived from local reading memory. */
	const graph = $derived.by(() => {
		const entries = Object.values(memory).filter((e) => bySlug.has(e.slug) && e.pct >= MIN_PCT);
		const readSlugs = new Set(entries.map((e) => e.slug));
		const finished = new Set(entries.filter((e) => e.finished).map((e) => e.slug));

		// An essay you have read pulls its hand-picked neighbours into the sky
		// even when you have not opened them: the chart is where you have been
		// *and* what stands next to it.
		const visible = new Set(readSlugs);
		for (const slug of readSlugs) {
			for (const n of bySlug.get(slug)?.neighbors ?? []) if (bySlug.has(n)) visible.add(n);
		}

		const order = [...entries].sort((a, b) => a.lastSeenTs - b.lastSeenTs).map((e) => e.slug);

		const seen = new Set<string>();
		const cites: [string, string][] = [];
		for (const slug of visible) {
			for (const n of bySlug.get(slug)?.neighbors ?? []) {
				if (!visible.has(n)) continue;
				const key = [slug, n].sort().join('|');
				if (seen.has(key)) continue;
				seen.add(key);
				cites.push([slug, n]);
			}
		}

		return { readSlugs, finished, visible: [...visible], order, cites, readCount: readSlugs.size };
	});

	/** The domains actually present in this reader's sky, in a stable order. */
	const domains = $derived(
		[...new Set(graph.visible.map((s) => bySlug.get(s)?.topic || 'Other'))].sort()
	);

	let nodes = $state<SimNode[]>([]);
	let links = $state<[string, string][]>([]);

	/**
	 * Every position on the plate is read through here, and that is the point.
	 * `nodes` is `$state`, so its members are proxies; the simulation mutates
	 * the raw objects underneath. Keeping a second `Map` of the raw ones meant
	 * the stars rendered from the proxies and the thread was computed from the
	 * raw array, and the two drifted apart — the thread hung off its own stars.
	 * One source, reached one way.
	 */
	const pos = $derived.by(() => {
		void tick;
		return new Map(nodes.map((n) => [n.slug, n]));
	});

	$effect(() => {
		if (!mounted || graph.readCount === 0) return;

		const anchorOf = (domain: string) =>
			domainAnchor(Math.max(0, domains.indexOf(domain)), domains.length);

		const built: SimNode[] = graph.visible.map((slug) => {
			const p = bySlug.get(slug)!;
			const domain = p.topic || 'Other';
			// Seeded near its own domain, so the layout opens into regions rather
			// than one blob that slowly separates.
			const a = anchorOf(domain);
			return {
				slug,
				title: p.title,
				domain,
				read: graph.readSlugs.has(slug),
				finished: graph.finished.has(slug),
				x: a.x + (Math.random() - 0.5) * 80,
				y: a.y + (Math.random() - 0.5) * 80
			};
		});

		nodes = built;
		links = graph.cites;

		let sim: Simulation<SimNode, undefined> | null = null;
		let cancelled = false;

		// A namespace import is fine *here* — this uses seven of d3-force's nine
		// exports, so there is nothing to shake off. `d3-shape` below is the
		// opposite case and is destructured for it.
		import('d3-force').then((d3) => {
			if (cancelled) return;
			sim = d3
				.forceSimulation(built)
				.force(
					'link',
					d3
						.forceLink<SimNode, { source: string | SimNode; target: string | SimNode }>(
							graph.cites.map(([source, target]) => ({ source, target }))
						)
						.id((d) => d.slug)
						.distance(120)
						.strength(0.5)
				)
				.force('charge', d3.forceManyBody().strength(-260))
				.force('center', d3.forceCenter(W / 2, H / 2))
				.force('collide', d3.forceCollide<SimNode>().radius(30).strength(0.9))
				// Home is the domain, not the centre: essays of a kind drift
				// together and the regions become something you can read.
				.force('x', d3.forceX<SimNode>((d) => anchorOf(d.domain).x).strength(0.07))
				.force('y', d3.forceY<SimNode>((d) => anchorOf(d.domain).y).strength(0.09))
				.on('tick', () => {
					for (const n of built) {
						n.x = Math.max(PAD, Math.min(W - PAD, n.x));
						n.y = Math.max(PAD, Math.min(H - PAD, n.y));
					}
					tick++;
				});
		});

		return () => {
			cancelled = true;
			sim?.stop();
		};
	});

	/**
	 * `d3-shape`'s path generators, loaded in the same dynamic chunk as the
	 * simulation. `null` until then, which is why every path guards on it.
	 */
	let line = $state<((points: [number, number][]) => string | null) | null>(null);

	$effect(() => {
		let cancelled = false;
		// Destructured, not a namespace: `import('d3-shape').then((d3) => …)` keeps
		// the whole module alive because the bindings are reached by property
		// access, and the chunk ships every curve, arc, symbol and stack in it.
		import('d3-shape').then(({ line: d3line, curveCatmullRom }) => {
			if (cancelled) return;
			// Catmull-Rom, not a polyline. Reading order is not a spatial
			// relation, so straight hops between stars read as a route drawn on a
			// map; one continuous curve reads as a line drawn between stars.
			// `alpha: 0.5` is the centripetal variant — the one that cannot form
			// a cusp or loop when two stars land close together.
			line = d3line<[number, number]>()
				.x((p) => p[0])
				.y((p) => p[1])
				.curve(curveCatmullRom.alpha(0.5));
		});
		return () => {
			cancelled = true;
		};
	});

	/**
	 * The thread through the stars, in the order you read them — trimmed off
	 * each star's rim so it reads as joining them rather than skewering them.
	 */
	const thread = $derived.by(() => {
		void tick;
		if (!line) return null;
		const pts = graph.order
			.map((slug) => pos.get(slug))
			.filter((n): n is SimNode => Boolean(n));
		if (pts.length < 2) return null;

		const STAR_R = 9;
		const trimmed: [number, number][] = pts.map((n, i) => {
			// Pull the first and last points back along their own hop; interior
			// points stay put, or the curve would kink at every star.
			const other = i === 0 ? pts[1] : i === pts.length - 1 ? pts[pts.length - 2] : null;
			if (!other) return [n.x, n.y];
			const len = Math.hypot(other.x - n.x, other.y - n.y) || 1;
			return [n.x + ((other.x - n.x) / len) * STAR_R, n.y + ((other.y - n.y) / len) * STAR_R];
		});
		return line(trimmed);
	});

	/**
	 * A citation is drawn as a shallow arc rather than a chord: two essays that
	 * cite each other *and* sit next to each other would otherwise put their
	 * edge underneath the thread and disappear.
	 */
	function arc(a: SimNode, b: SimNode): string {
		const dx = b.x - a.x;
		const dy = b.y - a.y;
		const r = Math.hypot(dx, dy) * 1.6;
		return `M ${a.x.toFixed(1)} ${a.y.toFixed(1)} A ${r.toFixed(1)} ${r.toFixed(1)} 0 0 1 ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
	}

	/**
	 * Where each domain's essays actually ended up, and how far they spread.
	 * Measured from live positions, so a region always wraps its own stars
	 * instead of being drawn where they were expected to land.
	 */
	const regions = $derived.by(() => {
		void tick;
		return domains
			.map((domain) => {
				const own = nodes.filter((n) => n.domain === domain);
				if (own.length === 0) return null;
				const cx = own.reduce((s, n) => s + n.x, 0) / own.length;
				const cy = own.reduce((s, n) => s + n.y, 0) / own.length;
				const reach = own.reduce((m, n) => Math.max(m, Math.hypot(n.x - cx, n.y - cy)), 0);
				return { domain, cx, cy, r: reach + 54 };
			})
			.filter((r): r is NonNullable<typeof r> => r !== null);
	});

	/** `null` while the device has not been asked — not the same as empty. */
	const showEmpty = $derived(mounted && graph.readCount === 0);

	const GRID_V = Array.from({ length: Math.floor(W / 100) + 1 }, (_, i) => i * 100);
	const GRID_H = Array.from({ length: Math.floor(H / 100) + 1 }, (_, i) => i * 100);
</script>

<div class="sky">
	<!-- No header of its own: production's plate was the whole page and had to
	     name itself, but here the section above already does. What is left is
	     the legend, which the toggle belongs with — both answer "how do I read
	     this chart". -->
	{#if showEmpty}
		<div class="empty">
			<p class="empty-title">{t.emptyTitle}</p>
			<p class="empty-body">{t.emptyBody}</p>
		</div>
	{:else}
		<svg class="plate" viewBox="0 0 {W} {H}" width="100%" preserveAspectRatio="xMidYMid meet">
			{#each GRID_V as x (x)}
				<line x1={x} y1={0} x2={x} y2={H} stroke="var(--rule)" stroke-width="0.5" />
			{/each}
			{#each GRID_H as y (y)}
				<line x1={0} y1={y} x2={W} y2={y} stroke="var(--rule)" stroke-width="0.5" />
			{/each}

			<!-- Domain regions — a faint field behind each kind of essay, so the
			     sky reads as territories before it reads as points. -->
			{#if layers.domains}
				{#each regions as rg, i (rg.domain)}
					<g>
						<circle cx={rg.cx} cy={rg.cy} r={rg.r} fill="var(--ink)" opacity={i % 2 ? 0.05 : 0.025} />
						<circle
							cx={rg.cx}
							cy={rg.cy}
							r={rg.r}
							fill="none"
							stroke="var(--ink)"
							stroke-width="0.5"
							stroke-dasharray="3 6"
							opacity="0.35"
						/>
						<text
							x={rg.cx}
							y={rg.cy - rg.r - 10}
							text-anchor="middle"
							class="region-label">{rg.domain}</text
						>
					</g>
				{/each}
			{/if}

			<!-- Citation edges — the essays that name each other, engraved dotted. -->
			{#each links as [a, b], i (i)}
				{@const from = pos.get(a)}
				{@const to = pos.get(b)}
				{#if from && to}
					<path
						d={arc(from, to)}
						fill="none"
						stroke="var(--faint)"
						stroke-width="1"
						stroke-dasharray="2 5"
					/>
				{/if}
			{/each}

			<!-- The thread: your reading order, oldest to newest. -->
			{#if thread}
				<path d={thread} fill="none" stroke="var(--blue)" stroke-width="1.6" opacity="0.85" />
			{/if}

			{#each nodes as n (n.slug)}
				{@const r = n.read ? 6 : 4}
				<a
					href={href(i18n.lang, `/writing/${n.slug}`)}
					onmouseenter={() => (hovered = n.slug)}
					onmouseleave={() => (hovered = hovered === n.slug ? null : hovered)}
					onfocus={() => (hovered = n.slug)}
					onblur={() => (hovered = hovered === n.slug ? null : hovered)}
				>
					<title>{n.title}</title>
					<!-- A 16px invisible disc: a 6px star is not a tap target. -->
					<circle cx={n.x} cy={n.y} r={16} fill="transparent" />
					<circle
						cx={n.x}
						cy={n.y}
						r={hovered === n.slug ? r + 2 : r}
						fill={n.read ? 'var(--blue)' : 'none'}
						fill-opacity={n.read && !n.finished ? 0.5 : 1}
						stroke="var(--blue)"
						stroke-width="1.5"
					/>
				</a>
			{/each}

			<!-- Drawn last, so it sits above every star. -->
			{#if hovered && pos.get(hovered)}
				{@const n = pos.get(hovered)!}
				{@const flip = n.x > W - 360}
				<text
					x={flip ? n.x - 12 : n.x + 12}
					y={n.y + 4}
					text-anchor={flip ? 'end' : 'start'}
					class="star-label"
					>{n.title.length > 40 ? n.title.slice(0, 39) + '…' : n.title}</text
				>
			{/if}
		</svg>
	{/if}

	<div class="legend">
		<span>
			<svg width="30" height="10" aria-hidden="true"
				><line x1="0" y1="5" x2="30" y2="5" stroke="var(--blue)" stroke-width="1.6" /></svg
			>
			<Tag>{t.legendOrder}</Tag>
		</span>
		<span>
			<svg width="30" height="10" aria-hidden="true"
				><line
					x1="0"
					y1="5"
					x2="30"
					y2="5"
					stroke="var(--faint)"
					stroke-width="1"
					stroke-dasharray="2 5"
				/></svg
			>
			<Tag>{t.legendCitation}</Tag>
		</span>
		<span>
			<svg width="12" height="12" aria-hidden="true"
				><circle cx="6" cy="6" r="5" fill="var(--blue)" /></svg
			>
			<Tag>{t.legendRead}</Tag>
		</span>
		<span>
			<svg width="12" height="12" aria-hidden="true"
				><circle cx="6" cy="6" r="5" fill="none" stroke="var(--blue)" stroke-width="1.5" /></svg
			>
			<Tag>{t.legendAhead}</Tag>
		</span>
		<button
			type="button"
			class:on={layers.domains}
			aria-pressed={layers.domains}
			onclick={() => (layers.domains = !layers.domains)}>{t.layerDomains}</button
		>
	</div>
</div>

<style>
	.sky {
		width: 100%;
	}
	.legend button {
		border: 1.5px solid var(--rule-hard);
		background: none;
		color: var(--ink);
		font-family: var(--mono);
		font-size: 10px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		padding: 5px 10px;
		cursor: pointer;
	}
	.legend button.on {
		background: var(--blue);
		border-color: var(--blue);
		color: var(--on-blue);
	}
	/* Pushed to the far end: a control among captions has to look like a
	   control, and the gap is what says so. */
	.legend button {
		margin-left: auto;
	}

	/* Only the chart — a bare `svg` selector also catches the four 30×10
	   swatches in the legend and stretches each of them to most of the
	   viewport. */
	svg.plate {
		display: block;
		height: min(74vh, 820px);
	}
	svg.plate a {
		cursor: pointer;
	}
	.region-label {
		font-family: var(--mono);
		font-size: 11px;
		letter-spacing: 2px;
		text-transform: uppercase;
		fill: var(--muted);
		pointer-events: none;
	}
	/* A stroke of paper under the fill, painted first — a label crossing a star
	   or a thread has to stay readable without a box behind it. */
	.star-label {
		font-family: var(--mono);
		font-size: 13px;
		fill: var(--ink);
		stroke: var(--paper);
		stroke-width: 4;
		paint-order: stroke;
		pointer-events: none;
	}

	.empty {
		padding: 80px var(--pad-chrome);
		text-align: center;
	}
	.empty-title {
		font-family: var(--display);
		font-weight: 500;
		font-size: 22px;
		text-transform: lowercase;
		margin: 0 0 10px;
	}
	.empty-body {
		font-size: 14px;
		color: var(--muted);
		margin: 0;
	}

	.legend {
		display: flex;
		gap: 28px;
		padding: 14px var(--pad-chrome);
		border-top: 1.5px solid var(--rule-hard);
		flex-wrap: wrap;
	}
	.legend span {
		display: flex;
		gap: 8px;
		align-items: center;
	}

	@media (max-width: 700px) {
		.legend,
		.empty {
			padding-left: 18px;
			padding-right: 18px;
		}
	}
</style>
