<script lang="ts">
	/**
	 * A topic as a room with an editor in it, not a filter over the archive.
	 * Top to bottom, the same order production reads in:
	 *
	 *   1. the siblings strip — the other five doors, from inside this one
	 *   2. the masthead — oversized blue name, and the tagline
	 *   3. the editor's note — why the room exists, signed
	 *   4. the three hand-picked ways in
	 *   5. the scratchpad — what is being thought about and not yet written
	 *   6. everything else filed here, newest first
	 *
	 * Sections 3–5 are authored: they come from `$lib/topics`, not from the
	 * posts, and a room stands up before a single essay is filed in it. That is
	 * the point of the port — this edition's topic page used to be the masthead
	 * and a grid, which says nothing a `topic` tag does not already say.
	 */
	import DuoPhoto from '$lib/components/ink/DuoPhoto.svelte';
	import Tag from '$lib/components/ink/Tag.svelte';
	import { long, pad } from '$lib/format';
	import { href, fill, useI18n } from '$lib/i18n';
	import { site } from '$lib/site';
	import { TOPICS_ORDER, TOPIC_CONTENT, TONE_STYLES, getTopicLocale } from '$lib/topics';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const i18n = useI18n();
	const t = $derived(i18n.t);

	const room = $derived(TOPIC_CONTENT[data.id]);
	const local = $derived(getTopicLocale(room, i18n.lang));
	const tone = $derived(TONE_STYLES[room.tone]);

	const siblings = $derived(
		TOPICS_ORDER.map((id) => ({ id, name: getTopicLocale(TOPIC_CONTENT[id], i18n.lang).name }))
	);

	const kindLabel = $derived({
		question: t.topics.kindQuestion,
		draft: t.topics.kindDraft,
		reading: t.topics.kindReading
	});
</script>

<svelte:head>
	<title>{local.name.toLowerCase()} — {site.name}</title>
	<meta name="description" content={local.tagline} />
</svelte:head>

<!-- The other doors, from inside this one. A room you cannot leave sideways
     makes the reader go back to the hub to do what is one click of work. -->
<nav class="siblings">
	{#each siblings as s (s.id)}
		<a class:on={s.id === data.id} href={href(i18n.lang, `/topics/${s.id}`)}>{s.name}</a>
	{/each}
</nav>

<!-- Masthead and note share a row with the plate, which is why they are wrapped:
     a plate beside the note alone has only the note's height to fill, and no
     honest ratio fills a 1568px page from a 380px column. Spanning both gives it
     the vertical run a department plate actually needs. -->
<div class="room" class:with-plate={room.plate}>
	<div class="room-main">
		<section class="cover">
			<div class="row">
			<Tag on>{t.topics.topicLabel} {pad(data.index)} / {pad(data.of)}</Tag>
				<Tag>{data.total} {data.total === 1 ? t.topics.essay : t.topics.essays}</Tag>
			</div>
			<h1>{local.name}</h1>
			<p class="tagline">{local.tagline}</p>
		</section>

		<!-- Why the room exists, in the editor's voice. The type is set by the room's
		     own `tone` rather than by the reader's settings — this is the one place on
		     the site where a body size is a property of the subject. -->
		<section
			class="note"
			style:--note-size="{tone.size}px"
			style:--note-lh={tone.lh}
			style:--note-w={tone.maxW}
		>
			<div class="note-head"><Tag on>{t.topics.editorNote}</Tag></div>
			<!-- One measure governs the paragraphs *and* the signature: a "— m." set to
			     the edge of a wider box than the prose it signs reads as belonging to
			     the page rather than to the note. -->
			<div class="note-body" class:italic={tone.italic} class:centred={tone.align === 'center'}>
				{#each local.intro as paragraph, i (i)}
					<p>
						{#if i === 0}<span class="drop">{paragraph.charAt(0)}</span>{paragraph.slice(1)}{:else}{paragraph}{/if}
					</p>
				{/each}
				<div class="sign">— m.</div>
			</div>
		</section>
	</div>

	<!-- The department plate — a cell in the grid, divided by the same hairline the
	     hub's doorways are divided by, rather than a picture floated into a gap.
	     Atmospheric, so `alt` is empty by design: the note beside it already says
	     what the room is, in the reader's own language. See $lib/topics. -->
	{#if room.plate}
		<div class="plate">
			<DuoPhoto
				src={room.plate.src ?? ''}
				alt=""
				placeholder={room.plate.placeholder ?? 'plate'}
				halftone={room.plate.halftone}
				sizes="(min-width: 1080px) 34vw, 1px"
			/>
		</div>
	{/if}
</div>

<!-- Both this and the scratchpad below stand down when their array is empty —
     which is every room today, on purpose; see the note in $lib/topics. An
     empty "if you read three" is a heading that promises and then does not
     deliver, and that is worse than a shorter page. -->
{#if local.starters.length > 0}
	<section class="starters">
		<div class="section-head">
			<h2>{t.topics.readThree}</h2>
			<Tag>{t.topics.handPicked}</Tag>
		</div>

		{#each local.starters as s (s.num)}
			{@const link = s.slug ? href(i18n.lang, `/writing/${s.slug}`) : null}
			<svelte:element
				this={link ? 'a' : 'div'}
				class="starter"
				class:unwritten={!link}
				href={link ?? undefined}
			>
				<span class="numeral">{s.num}</span>
				<span class="starter-body">
					<span class="starter-title">
						{s.title}
						<!-- Printed, not hidden: a room is also a promise about what is coming. -->
						{#if !link}<span class="forthcoming">{t.topics.forthcoming}</span>{/if}
					</span>
					<span class="why">“{s.why}”</span>
				</span>
				<span class="mins">{s.min} {t.topics.min}</span>
			</svelte:element>
		{/each}
	</section>
{/if}

<!-- The desk, left open. Questions and drafts are not a roadmap and carry no
     dates: they say what the room is thinking about, and nothing is promised.
     An empty desk is not a desk, so the box does not draw at all. -->
{#if local.scratchpad.length > 0}
	<section class="pad-wrap">
		<section class="pad">
			<div class="pad-head">
				<Tag on>{t.topics.scratchpadLabel}</Tag>
				<Tag>{t.topics.updatedNote}</Tag>
			</div>
			<div class="pad-body">
				<h3>{t.topics.scratchpadTitle}</h3>
				<ul>
					{#each local.scratchpad as item, i (i)}
						<li>
							<span class="kind" class:question={item.kind === 'question'}
								>{kindLabel[item.kind]}</span
							>
							<p>{item.text}</p>
						</li>
					{/each}
				</ul>
			</div>
		</section>
	</section>
{/if}

{#if data.posts.length > 0}
	<section class="tail">
		<div class="tail-head">
			<!-- "also" is only true when the hand-picked three stand above. -->
			<h3>
				{fill(local.starters.length > 0 ? t.topics.alsoIn : t.topics.filedIn, {
					name: local.name
				})}
			</h3>
			<a href={href(i18n.lang, '/writing')}>{t.topics.everyEssay}</a>
		</div>
		<ul>
			{#each data.posts as p (p.slug)}
				<li>
					<a href={href(i18n.lang, `/writing/${p.slug}`)}>
						<span class="tail-title">{p.title}</span>
						<span class="tail-meta">{long(p.date, i18n.lang)}</span>
						<span class="tail-meta">{p.reading} {t.topics.min}</span>
					</a>
				</li>
			{/each}
		</ul>
	</section>
{/if}

<style>
	.siblings {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 18px;
		padding: 16px var(--pad-chrome);
		border-bottom: 1px solid var(--rule);
	}
	.siblings a {
		font-family: var(--mono);
		font-size: 10.5px;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--muted);
	}
	.siblings a.on {
		color: var(--blue);
	}
	.siblings a:hover {
		color: var(--blue);
		text-decoration: none;
	}

	.cover {
		padding: 40px var(--pad-chrome) 34px;
		border-bottom: 1.5px solid var(--rule-hard);
	}
	.row {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 16px;
	}
	h1 {
		font-family: var(--display);
		font-weight: 700;
		font-size: clamp(52px, 11vw, 108px);
		line-height: 0.9;
		letter-spacing: -0.05em;
		margin: 10px 0 0;
		text-transform: lowercase;
		color: var(--blue);
	}
	.tagline {
		max-width: 52ch;
		font-family: var(--display);
		font-weight: 500;
		font-size: 17px;
		line-height: 1.5;
		letter-spacing: -0.01em;
		margin: 18px 0 0;
	}

	.note {
		padding: 30px var(--pad-chrome) 40px;
		border-bottom: 1.5px solid var(--rule-hard);
	}
	.note-head {
		margin-bottom: 22px;
	}
	/**
	 * Masthead and note on the left, the plate as its own cell on the right. The
	 * note keeps its own measure inside that left column, so a room with no
	 * plate reads exactly as it did before — the plate is never what sets the
	 * width of the text.
	 */
	.room.with-plate {
		display: grid;
		grid-template-columns: 1fr minmax(0, 34%);
	}
	.room-main {
		min-width: 0;
		display: flex;
		flex-direction: column;
	}
	/* The note takes up whatever the row's height turns out to be, so its rule
	   and the plate's land on the same line. Without this the taller of the two
	   sets the row and the shorter one's border stops short of it. */
	.note {
		flex: 1;
	}
	.note-body {
		max-width: var(--note-w);
	}
	/* Divided by the hairline, not by a gap: this is the same rule the hub's
	   doorways are divided by, so the plate reads as a cell of the page's grid
	   rather than as a picture dropped into a hole. */
	.plate {
		border-left: 1.5px solid var(--rule-hard);
		border-bottom: 1.5px solid var(--rule-hard);
		padding: 30px 26px;
		display: flex;
		flex-direction: column;
		/* A floor, so a room whose editor was brief still gets a picture rather
		   than a letterbox. */
		min-height: 520px;
	}
	/* The picture fills the cell instead of dictating its height — which is what
	   makes the two rules line up, and means any aspect can be dropped in
	   without the layout caring. `object-fit: cover` in app.css does the crop. */
	.plate :global(figure) {
		flex: 1;
		display: flex;
	}
	.plate :global(.ink-duo),
	.plate :global(.ink-screen) {
		flex: 1;
		aspect-ratio: auto;
	}
	/* The masthead's rule stops at the plate's cell instead of crossing it. */
	.room.with-plate .cover {
		border-bottom-color: var(--rule);
	}
	.note-body.centred {
		margin: 0 auto;
		text-align: center;
	}
	.note-body p {
		margin: 0 0 1em;
		font-size: var(--note-size);
		line-height: var(--note-lh);
	}
	.note-body.italic p {
		font-style: italic;
	}
	.note-body.centred p {
		margin-left: auto;
		margin-right: auto;
	}
	/* The initial, set in the display face and in blue — the one ornament the
	   room gets. It floats, so the first line wraps around it. */
	.drop {
		float: left;
		font-family: var(--display);
		font-weight: 700;
		font-size: calc(var(--note-size) * 3);
		line-height: 0.8;
		padding: 4px 10px 0 0;
		color: var(--blue);
	}
	.note-body.centred .drop {
		float: none;
		padding: 0;
	}
	.sign {
		margin-top: 20px;
		font-family: var(--mono);
		font-size: 11px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--muted);
		text-align: right;
	}

	.starters {
		padding: 34px var(--pad-chrome);
	}
	.section-head {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 12px;
		margin-bottom: 8px;
	}
	.section-head h2 {
		margin: 0;
		font-family: var(--display);
		font-weight: 700;
		font-size: 22px;
		letter-spacing: -0.02em;
		text-transform: lowercase;
	}

	.starter {
		display: grid;
		grid-template-columns: 56px 1fr auto;
		gap: 24px;
		align-items: baseline;
		padding: 20px 0;
		border-top: 1px solid var(--rule);
		color: var(--ink);
	}
	a.starter:hover {
		background: var(--paper2);
		text-decoration: none;
	}
	.numeral {
		font-family: var(--display);
		font-weight: 700;
		font-size: 34px;
		line-height: 1;
		letter-spacing: -0.02em;
		color: var(--faint);
	}
	.starter-body {
		min-width: 0;
	}
	.starter-title {
		display: block;
		font-family: var(--display);
		font-size: 22px;
		font-weight: 500;
		letter-spacing: -0.02em;
		line-height: 1.15;
		margin-bottom: 8px;
	}
	.unwritten .starter-title {
		opacity: 0.5;
	}
	.forthcoming {
		margin-left: 10px;
		font-family: var(--mono);
		font-size: 10px;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--muted);
	}
	.why {
		display: block;
		font-style: italic;
		font-size: 14.5px;
		line-height: 1.5;
		color: var(--muted);
		max-width: 54ch;
	}
	.mins {
		font-family: var(--mono);
		font-size: 11px;
		color: var(--muted);
		white-space: nowrap;
	}

	.pad-wrap {
		padding: 0 var(--pad-chrome) 40px;
	}
	/* A plain 1.5px box. No left-accent card — that trope is banned (§8). */
	.pad {
		border: 1.5px solid var(--rule-hard);
	}
	.pad-head {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 12px;
		padding: 11px 16px;
		border-bottom: 1px solid var(--rule);
	}
	.pad-body {
		padding: 20px 16px;
	}
	.pad-body h3 {
		margin: 0 0 20px;
		font-family: var(--display);
		font-weight: 700;
		font-size: 24px;
		letter-spacing: -0.02em;
		text-transform: lowercase;
	}
	.pad-body ul {
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.pad-body li {
		display: grid;
		grid-template-columns: 92px 1fr;
		gap: 16px;
		align-items: baseline;
		padding: 12px 0;
		border-top: 1px solid var(--rule);
	}
	.pad-body li:first-child {
		border-top: none;
	}
	.kind {
		font-family: var(--mono);
		font-size: 9.5px;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--muted);
		padding-top: 4px;
	}
	/* A question is the only kind that is not work in progress. */
	.kind.question {
		color: var(--blue);
	}
	.pad-body p {
		margin: 0;
		font-size: 15.5px;
		line-height: 1.55;
	}

	.tail {
		padding: 0 var(--pad-chrome) 60px;
	}
	/* With the starters and the desk both empty, the tail follows the masthead
	   block directly and has to bring its own top margin — the gap used to
	   belong to whichever of the two stood between them. */
	.room + .tail {
		padding-top: 34px;
	}
	.tail-head {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 12px;
		padding-bottom: 10px;
		border-bottom: 1.5px solid var(--rule-hard);
	}
	.tail-head h3 {
		margin: 0;
		font-family: var(--display);
		font-weight: 700;
		font-size: 20px;
		letter-spacing: -0.02em;
		text-transform: lowercase;
	}
	.tail-head a {
		font-family: var(--mono);
		font-size: 10.5px;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--blue);
		white-space: nowrap;
	}
	.tail ul {
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.tail li a {
		display: grid;
		grid-template-columns: 1fr auto auto;
		gap: 20px;
		align-items: baseline;
		padding: 14px 0;
		border-bottom: 1px solid var(--rule);
		color: var(--ink);
	}
	.tail li a:hover {
		background: var(--paper2);
		text-decoration: none;
	}
	.tail-title {
		font-family: var(--display);
		font-size: 18px;
		font-weight: 500;
		letter-spacing: -0.02em;
	}
	.tail-meta {
		font-family: var(--mono);
		font-size: 11px;
		color: var(--muted);
		white-space: nowrap;
	}

	/* Below this the two columns would each be too narrow to be either a
	   readable measure or a picture, so the note takes the width back and the
	   plate stands down. A magazine drops the department art on a narrow page
	   too — it is the one element here that is atmosphere rather than reading. */
	@media (max-width: 1080px) {
		.room.with-plate {
			display: block;
		}
		.plate {
			display: none;
		}
		.room.with-plate .cover {
			border-bottom-color: var(--rule-hard);
		}
	}

	@media (max-width: 860px) {
		.siblings,
		.cover,
		.note,
		.starters {
			padding-left: 18px;
			padding-right: 18px;
		}
		.pad-wrap,
		.tail {
			padding-left: 18px;
			padding-right: 18px;
		}
		.starter {
			grid-template-columns: 40px 1fr;
			gap: 14px;
		}
		/* The minutes move under the reason rather than off the edge. */
		.mins {
			grid-column: 2;
		}
		.pad-body li {
			grid-template-columns: 1fr;
			gap: 6px;
		}
		.tail li a {
			grid-template-columns: 1fr auto;
			row-gap: 6px;
		}
		.tail-title {
			grid-column: 1 / -1;
		}
	}
</style>
