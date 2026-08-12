<script lang="ts">
	// The missing page (§ Ink404). A 404 is an editorial event, not an error
	// screen: say plainly what happened, then hand the reader three real
	// doorways. The cat plate is the one piece of warmth allowed.
	//
	// This is the *root* error boundary, so it renders outside the locale layout
	// — an unmatched URL never reaches `[lang]`, and a reader who mistyped one
	// would otherwise land on a page with no way out. Hence its own slim chrome:
	// wordmark and footer only, not the seven-door header, which the three doors
	// below already replace.
	import { page } from '$app/state';
	import Headline from '$lib/components/ink/Headline.svelte';
	import Tag from '$lib/components/ink/Tag.svelte';
	import { fill, href, isLang, messages } from '$lib/i18n';
	import { site } from '$lib/site';

	// The locale comes off the *path*, not `params`: an unmatched URL never
	// matched `[lang]`, so there is no param to read — /vi/gõ-sai would answer in
	// English if we trusted one. Same rule `hooks.server.ts` uses for <html lang>,
	// so the page and the document agree on the language.
	const lang = $derived.by(() => {
		const prefix = page.url.pathname.split('/')[1];
		return isLang(prefix) ? prefix : site.defaultLang;
	});
	const t = $derived(messages[lang]);

	// The cat is for 404 only. A 500 is the site's fault, not a wrong turn, and a
	// cartoon apologising for it would be the wrong register.
	const lost = $derived(page.status === 404);

	// The underline is drawn at a fixed aspect, so it has to be told how wide the
	// accented word actually is — 'here' and 'ở đây' are not the same lasso.
	const markWidth = $derived(Math.round(t.error.lost.titleAccent.length * 21));

	const doors = $derived([
		{
			path: '/writing',
			kind: t.nav.writing,
			title: t.error.lost.doorWriting,
			meta: t.error.lost.doorWritingMeta
		},
		{
			path: '/series',
			kind: t.nav.series,
			title: t.error.lost.doorSeries,
			meta: t.error.lost.doorSeriesMeta
		},
		{
			path: '/reading-room',
			kind: t.nav.readingRoom,
			title: t.error.lost.doorRoom,
			meta: t.error.lost.doorRoomMeta
		}
	]);
</script>

<svelte:head>
	<title>{page.status} · {site.name}</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="shell">
	<header>
		<a class="wordmark" href={href(lang)}>{site.name}<span class="dot">.</span></a>
	</header>

	{#if lost}
		<main class="lost">
			<!-- ── the statement ── -->
			<div class="said">
				<div class="col">
					<div class="statement">
						<span class="numeral" aria-hidden="true">404</span>
						<Headline
							text={t.error.lost.title}
							accent={t.error.lost.titleAccent}
							mark="underline"
							{markWidth}
							size={44}
						/>
					</div>

					<p class="lede">{t.error.lost.lede}</p>

					<div class="doors">
						<div class="head">
							<Tag>{t.error.lost.doors}</Tag>
						</div>
						{#each doors as door, i (door.path)}
							<a class="door" href={href(lang, door.path)}>
								<span class="n">{String(i + 1).padStart(2, '0')}</span>
								<Tag>{door.kind}</Tag>
								<span class="title">{door.title}</span>
								<span class="meta">{door.meta}</span>
							</a>
						{/each}
					</div>

					<div class="spacer"></div>
					<div class="out">
						<a class="button" href={href(lang)}>{t.error.lost.home}</a>
						<span class="hint">{t.error.lost.hint}</span>
					</div>
				</div>
			</div>

			<!-- ── the plate ──
			     A printed plate, not an illustration dropped on the page: its blue
			     field is in the file itself, so the panel is that exact ink in every
			     theme rather than the theme's own --blue, which moves at night. -->
			<div class="plate">
				<img
					src="/media/404-cat-plate.webp"
					alt={t.error.lost.alt}
					width="944"
					height="610"
					fetchpriority="high"
				/>
			</div>
		</main>
	{:else}
		<main class="plain">
			<Tag on>{fill(t.error.status, { status: page.status })}</Tag>
			<Headline text={t.error.title} accent={t.error.titleAccent} size={52} />
			{#if page.error?.message}
				<p class="message">{page.error.message}</p>
			{/if}
			<a class="back" href={href(lang, '/writing')}>{t.error.back}</a>
		</main>
	{/if}

	<footer>
		<Tag>{site.domain} / {page.status}</Tag>
		<Tag>{t.footer.tagline}</Tag>
		<Tag>{site.copyright}</Tag>
	</footer>
</div>

<style>
	.shell {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		background: var(--paper);
		color: var(--ink);
	}

	/* The chrome, cut down to what a lost reader needs: a way home and the rule
	   that says this is still the same site. */
	header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 20px;
		padding: 18px var(--pad-chrome);
		border-bottom: 1.5px solid var(--rule-hard);
	}
	.wordmark {
		font-family: var(--display);
		font-weight: 700;
		font-size: 19px;
		letter-spacing: -0.03em;
		color: var(--ink);
		text-decoration: none;
	}
	.wordmark:hover {
		text-decoration: none;
		color: var(--blue);
	}
	.dot {
		color: var(--blue);
	}

	/* Words and plate, split by a hard rule — the seam runs the full height. */
	.lost {
		flex: 1;
		display: grid;
		/* Fractional, like the home division: the plate is a share of the page,
		   not a fixed slab that turns into a stripe on a wide screen. */
		grid-template-columns: 1.2fr 1fr;
		border-bottom: 1.5px solid var(--rule-hard);
	}
	.said {
		display: flex;
		padding: 34px var(--pad-chrome) 40px;
		border-right: 1.5px solid var(--rule-hard);
	}
	/* The seam is full-bleed, the words are not: on a wide screen the column
	   keeps its measure and the extra room stays as air before the rule, rather
	   than stretching a door row across half a metre of desk. */
	.col {
		flex: 1;
		display: flex;
		flex-direction: column;
		max-width: 680px;
	}

	.statement {
		display: flex;
		align-items: flex-start;
		gap: 26px;
	}
	/* The status set as a numeral, at plate size: the page says what happened
	   before it says anything else. */
	.numeral {
		font-family: var(--display);
		font-weight: 700;
		font-size: clamp(72px, 11vw, 128px);
		line-height: 0.82;
		letter-spacing: -0.055em;
	}
	.statement :global(h1) {
		padding-top: 6px;
		max-width: 420px;
	}

	.lede {
		margin: 40px 0 0;
		max-width: 520px;
		font-family: var(--body);
		font-size: 17px;
		line-height: 1.64;
	}
	.doors {
		margin-top: 34px;
		border-top: 1.5px solid var(--rule-hard);
	}
	/* The MONO label that names a division (§7). */
	.head {
		padding: 12px 0 6px;
	}
	/* Same row as the archive index: hairline top, hover flips the whole row to
	   blue, nothing moves (§3, §8). */
	.door {
		display: grid;
		grid-template-columns: 44px 112px 1fr auto;
		align-items: baseline;
		gap: 14px;
		padding: 13px 0;
		border-top: 1px solid var(--rule);
		color: var(--ink);
		text-decoration: none;
	}
	.door:hover {
		color: var(--blue);
		text-decoration: none;
	}
	.door:hover :global(.tag),
	.door:hover .n,
	.door:hover .meta {
		color: inherit;
	}
	.n {
		font-family: var(--mono);
		font-size: 10.5px;
		letter-spacing: 0.12em;
		color: var(--faint);
	}
	.title {
		font-family: var(--display);
		font-weight: 500;
		font-size: 20px;
		letter-spacing: -0.02em;
		line-height: 1.15;
	}
	.meta {
		font-family: var(--mono);
		font-size: 10px;
		letter-spacing: 0.08em;
		color: var(--muted);
		white-space: nowrap;
	}

	.spacer {
		flex: 1;
		min-height: 30px;
	}
	.out {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 12px;
	}
	.button {
		font-family: var(--mono);
		font-size: 11px;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--on-blue);
		background: var(--panel-blue);
		padding: 11px 18px;
		text-decoration: none;
	}
	.button:hover {
		text-decoration: none;
		background: var(--blue-deep);
	}
	.hint {
		font-family: var(--mono);
		font-size: 11px;
		letter-spacing: 0.08em;
		color: var(--muted);
	}

	/* The plate fills its column, and the field is the picture's own ink. */
	.plate {
		margin: 0;
		display: flex;
		flex-direction: column;
		background: #1a24df;
	}
	/* Centred in whatever height the words leave, and capped at its own printed
	   size — past that it stops being a plate on a field and becomes a poster. */
	.plate img {
		display: block;
		width: 100%;
		max-width: 452px;
		height: auto;
		margin: auto;
	}
	/* Anything that is not a 404 gets the plain statement — no cat. */
	.plain {
		flex: 1;
		padding: 60px var(--pad-chrome) 80px;
		max-width: 780px;
	}
	.plain :global(h1) {
		margin-top: 14px;
	}
	.message {
		font-family: var(--mono);
		font-size: 12.5px;
		color: var(--muted);
		margin: 24px 0 20px;
	}
	.back {
		font-family: var(--mono);
		font-size: 11.5px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	footer {
		border-top: 1.5px solid var(--rule-hard);
		padding: 16px var(--pad-chrome) 22px;
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 16px;
	}

	/* One column: the sentence is the answer, the cat is the consolation, so it
	   goes below the words rather than above them. */
	@media (max-width: 860px) {
		.lost {
			grid-template-columns: 1fr;
		}
		.said {
			border-right: none;
			border-bottom: 1.5px solid var(--rule-hard);
			padding: 26px 18px 32px;
		}
		.statement {
			flex-direction: column;
			gap: 10px;
		}
		.statement :global(h1) {
			padding-top: 0;
		}
		.plate {
			padding: 18px 0;
		}
		header,
		footer {
			padding-left: 18px;
			padding-right: 18px;
		}
		footer {
			flex-direction: column;
			gap: 6px;
		}
	}
	@media (max-width: 620px) {
		.door {
			grid-template-columns: 1fr auto;
			gap: 4px 14px;
		}
		.title {
			grid-column: 1 / -1;
			font-size: 19px;
		}
	}
</style>
