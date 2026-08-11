<script module lang="ts">
	import type { TocItem } from '$lib/content/posts';
	import type { Snippet } from 'svelte';

	/** One section's run of leaves, as fractions of the whole stack. */
	export interface ForeEdgeSection extends TocItem {
		/** Where the section starts and ends, as fractions of the whole (0..1). */
		start: number;
		end: number;
	}

	/**
	 * The contents as runs of leaves, measured in reading time — the only length
	 * a reader actually feels. This is what makes the edge of the book a table of
	 * contents.
	 */
	export function foreEdgeSections(toc: TocItem[]): ForeEdgeSection[] {
		const total = toc.reduce((sum, t) => sum + t.readMinutes, 0);
		if (total <= 0) return [];
		let run = 0;
		return toc.map((t) => {
			const start = run / total;
			run += t.readMinutes;
			return { ...t, start, end: run / total };
		});
	}
</script>

<script lang="ts">
	/**
	 * "Sức nặng còn lại" — remaining weight, and the contents, in one instrument.
	 *
	 * Instead of a progress bar, the gutter draws the fore-edge of the book: a
	 * stack of page-leaves. What you have read compresses into a thin band at the
	 * top; what remains stays a thick, generously spaced block below your place.
	 * You feel how much is left the way your thumb feels it in a paperback.
	 *
	 * The stack is also the table of contents. Each section owns a run of leaves;
	 * hovering one names it, clicking one goes there. Nothing is spelled out
	 * until you ask — the ambient state is a weight, not a list.
	 *
	 * The scroll fraction only ever sets thickness. It is never rendered as a
	 * number, and the instrument never congratulates, nudges, or fires a
	 * completion — when the block runs out, the reading is simply over.
	 *
	 * Ported from the production `ForeEdge.tsx`. One structural change: the rail
	 * is fixed against the left of the reading column rather than sticky inside a
	 * grid gutter, because this edition centres the article in a container
	 * instead of laying it out in three columns. The measurements are unchanged.
	 */

	interface Props {
		/** Scroll fraction, 0..1. Used for thickness only — never displayed. */
		progress: number;
		/** The contents, as runs of leaves. Empty means a plain weight gauge. */
		sections?: ForeEdgeSection[];
		/**
		 * `rail` — the article gutter on desktop: the fore-edge, and the contents.
		 * `edge` — a thin strip pinned to the right of the viewport on small
		 * screens, where the eye already looks for a scrollbar. Never interactive:
		 * a 10px tap target is not a control, and the mobile bar already carries
		 * the contents.
		 */
		variant?: 'rail' | 'edge';
		/** Labels for the two ends of the stack. Unset renders no text at all. */
		readLabel?: string;
		leftLabel?: string;
		/** Accessible name for the contents, e.g. "Contents". */
		contentsLabel?: string;
		/** "N min left", when the reader has asked to see it. */
		timeLeftLabel?: string;
		/**
		 * Standing above the stack in the rail: the way into the full list, for
		 * readers who want a list. It rides here rather than beside the article
		 * because the rail is the one thing already anchored to the gutter.
		 */
		children?: Snippet;
	}

	let {
		progress,
		sections = [],
		variant = 'rail',
		readLabel,
		leftLabel,
		contentsLabel = 'Contents',
		timeLeftLabel,
		children
	}: Props = $props();

	/** A read leaf and its gap; the compressed half of the stack. */
	const READ_LEAF = 1;
	const READ_GAP = 0.5;
	/** An unread leaf and its gap — wider, so the block reads as heavy. */
	const REST_LEAF = 1.5;
	const REST_GAP = 3;

	const READ_PITCH = READ_LEAF + READ_GAP;
	const REST_PITCH = REST_LEAF + REST_GAP;

	/** The reading edge and the air around it. */
	const EDGE_MARK = 2.5;
	const EDGE_MARGIN = 5;

	/**
	 * Chrome above and below the stack that the leaves must not grow into: on
	 * desktop the rail's own top offset, the way into the contents, the two
	 * vertical labels and the estimate; on mobile the reading bar and a little
	 * breathing room at the top.
	 *
	 * Production budgets 190 here because its rail carries only the two labels
	 * and sits at `top: 100`. This one starts lower and stands the contents
	 * button above the stack, so it pays for both — get this wrong and the
	 * heaviest end of the block falls off the bottom of the screen, which is
	 * the one thing the instrument must never do.
	 */
	const RAIL_CHROME = 360;
	const EDGE_CHROME = 120;

	/**
	 * How wide a leaf is drawn in the desktop rail. Narrow enough that the stack
	 * reads as an edge seen side-on rather than a second column; the band around
	 * it stays wide enough to aim at.
	 */
	const RAIL_LEAF_WIDTH = 16;

	/** Smallest run of leaves that can still be aimed at with a mouse. */
	const MIN_HIT = 16;
	/** Where the reading line sits under the sticky running head. */
	const SCROLL_OFFSET = 110;

	const isEdge = $derived(variant === 'edge');

	// Leaf count follows the height actually available: below ~10px per leaf the
	// two gap sizes stop being distinguishable and the block loses its weight, so
	// the stack is sized from the viewport rather than fixed.
	let leaves = $state(0);

	$effect(() => {
		const edge = isEdge;
		const measure = () => {
			const usable = window.innerHeight - (edge ? EDGE_CHROME : RAIL_CHROME);
			// Sized so a wholly unread stack fills the column: the heaviest the
			// book ever looks is the moment before you start.
			leaves = Math.max(8, Math.min(160, Math.floor(usable / REST_PITCH)));
		};
		measure();
		window.addEventListener('resize', measure, { passive: true });
		return () => window.removeEventListener('resize', measure);
	});

	let hovered = $state<string | null>(null);

	const p = $derived(Math.max(0, Math.min(1, progress)));
	const readLeaves = $derived(Math.round(p * leaves));

	/** Top offset of leaf `i` within the stack, in px. */
	const leafTop = (i: number) =>
		i <= readLeaves
			? i * READ_PITCH
			: readLeaves * READ_PITCH + EDGE_MARK + EDGE_MARGIN * 2 + (i - readLeaves) * REST_PITCH;

	const stackHeight = $derived(leafTop(leaves));
	/** The stack itself, as a list to iterate — each entry is one leaf's top. */
	const stack = $derived(Array.from({ length: leaves }, (_, i) => leafTop(i)));
	const interactive = $derived(!isEdge && sections.length > 0);
	const width = $derived(isEdge ? 10 : RAIL_LEAF_WIDTH);

	// Bands are laid out top-down, each starting no higher than the previous one
	// ends. Where the stack is compressed this trades a little alignment for a
	// target you can actually hit.
	const bands = $derived.by(() => {
		let cursor = 0;
		return sections.map((section) => {
			const rawTop = leafTop(Math.round(section.start * leaves));
			const rawBottom = leafTop(Math.round(section.end * leaves));
			const top = Math.max(rawTop, cursor);
			const height = Math.max(MIN_HIT, rawBottom - top);
			cursor = top + height;
			return { section, top, height };
		});
	});

	function goTo(event: MouseEvent, id: string) {
		const el = document.getElementById(id);
		if (!el) return;
		event.preventDefault();
		const top = el.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET;
		window.scrollTo({ top, behavior: 'smooth' });
		// Leave the hash behind so the position is linkable and Back works.
		history.replaceState(null, '', `#${id}`);
	}
</script>

{#if leaves > 0}
	<div
		aria-hidden={isEdge ? 'true' : undefined}
		class="fore-edge {isEdge ? 'fore-edge-mobile' : 'fore-edge-rail'}"
	>
		{#if !isEdge && children}
			<div class="top-slot">{@render children()}</div>
		{/if}
		{#if !isEdge && readLabel}
			<span class="vertical faint">{readLabel}</span>
		{/if}

		<!-- The stack. Leaves are positioned rather than flowed, so a section
		     knows exactly which slice of the edge belongs to it. -->
		<nav
			aria-label={interactive ? contentsLabel : undefined}
			class="stack"
			class:inert={isEdge}
			style="width:{isEdge ? width : width + 14}px; height:{stackHeight}px"
		>
			{#each stack as top, i (i)}
				{@const isRead = i < readLeaves}
				<span
					class="leaf"
					class:read={isRead}
					style="top:{top}px; left:{isEdge ? 0 : 7}px; width:{width}px; height:{isRead
						? READ_LEAF
						: REST_LEAF}px"
				></span>
			{/each}

			<!-- The reading edge — where you are standing. -->
			<span
				class="here"
				style="top:{readLeaves * READ_PITCH + EDGE_MARGIN}px; width:{isEdge
					? width
					: width + 14}px; height:{EDGE_MARK}px"
			></span>

			<!-- One target per section, spanning its run of leaves. The band is a
			     link, so the keyboard and a screen reader get the contents too.
			     Sections already read are only a leaf or two thick, so each band is
			     floored at a usable height and pushed clear of the one above rather
			     than overlapping it — an unaimable target is not a table of
			     contents. -->
			{#if interactive}
				{#each bands as { section, top, height }, i (section.id)}
					{@const on = hovered === section.id}
					<a
						href="#{section.id}"
						data-toc-id={section.id}
						class="fore-edge-band"
						style="top:{top}px; height:{height}px"
						onclick={(e) => goTo(e, section.id)}
						onmouseenter={() => (hovered = section.id)}
						onmouseleave={() => (hovered = hovered === section.id ? null : hovered)}
						onfocus={() => (hovered = section.id)}
						onblur={() => (hovered = hovered === section.id ? null : hovered)}
					>
						<!-- The section's own leaves, lit while it is being aimed at. -->
						<span aria-hidden="true" class="fore-edge-band-wash" style="opacity:{on ? 1 : 0}"
						></span>
						<!-- The name, only once asked for. -->
						<span class="fore-edge-flag" style="opacity:{on ? 1 : 0}">
							<span class="fore-edge-flag-num">§ {i + 1}</span>
							<span class="fore-edge-flag-text">{section.text}</span>
							<span class="fore-edge-flag-min">{section.readMinutes}m</span>
						</span>
					</a>
				{/each}
			{/if}
		</nav>

		{#if !isEdge && leftLabel}
			<span class="vertical blue">{leftLabel}</span>
		{/if}
		{#if !isEdge && timeLeftLabel}
			<span class="time-left">{timeLeftLabel}</span>
		{/if}
	</div>
{/if}

<style>
	.fore-edge {
		flex-direction: column;
	}

	.top-slot {
		margin-bottom: 12px;
		writing-mode: vertical-rl;
	}

	.stack {
		position: relative;
	}
	.stack.inert {
		pointer-events: none;
	}

	.leaf {
		position: absolute;
		background: var(--rule-hard);
		opacity: 0.82;
	}
	.leaf.read {
		background: var(--rule);
		opacity: 1;
	}

	.here {
		position: absolute;
		left: 0;
		background: var(--blue);
	}

	.vertical {
		font-family: var(--mono);
		font-size: 9px;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		writing-mode: vertical-rl;
	}
	.faint {
		color: var(--faint);
		margin-bottom: 8px;
	}
	.blue {
		color: var(--blue);
		margin-top: 8px;
	}

	.time-left {
		font-family: var(--mono);
		font-size: 9.5px;
		letter-spacing: 0.04em;
		color: var(--muted);
		font-variant-numeric: tabular-nums;
		writing-mode: vertical-rl;
		margin-top: 10px;
	}
</style>
