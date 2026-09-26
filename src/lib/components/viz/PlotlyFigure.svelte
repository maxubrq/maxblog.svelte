<script lang="ts">
	/**
	 * A Plotly chart in the house plate.
	 *
	 * Plotly is heavy, so nothing loads until the plate is about to scroll into
	 * view — and then only the bundle the traces need: `plotly.js-basic`
	 * (scatter, bar, pie) when that is enough, the full build otherwise. The
	 * prerendered page carries only the empty plate at its final height, so the
	 * column does not jump when the chart arrives.
	 *
	 * Colours, fonts and grid come from the site's tokens, read off <html> at
	 * draw time and re-read whenever the theme changes — a trace or layout that
	 * sets its own colour still wins. A post can name a token itself, as the
	 * whole string `'var(--viz-clay)'`, anywhere in `data` or `layout`; it is
	 * swapped for the live value on every draw, so it follows the theme too.
	 */
	import { onMount } from 'svelte';
	import type { Config, Data, Layout } from 'plotly.js';
	import DiagramPlate from '$lib/components/tech/DiagramPlate.svelte';

	let {
		data,
		layout = {},
		config = {},
		height = 360,
		label = 'Figure',
		hint = '',
		caption = '',
		alt = ''
	}: {
		data: Partial<Data>[];
		layout?: Partial<Layout>;
		config?: Partial<Config>;
		height?: number;
		label?: string;
		hint?: string;
		caption?: string;
		/** What the chart shows, for a reader who cannot see it. */
		alt?: string;
	} = $props();

	type Plotly = typeof import('plotly.js');

	const BASIC = new Set(['scatter', 'bar', 'pie']);
	const needsFull = (traces: Partial<Data>[]) =>
		traces.some((t) => !BASIC.has((t as { type?: string }).type ?? 'scatter'));

	let el: HTMLDivElement;
	let Plotly = $state.raw<Plotly>(); // raw: the library is not state to proxy
	let theme = $state(0); // bumped on every theme change, to re-run the draw

	/** The house style as a Plotly layout, from the live CSS tokens. */
	function houseLayout(): Partial<Layout> {
		const css = getComputedStyle(document.documentElement);
		const v = (name: string) => css.getPropertyValue(name).trim();
		const axis = {
			gridcolor: v('--rule'),
			linecolor: v('--rule-hard'),
			zerolinecolor: v('--rule'),
			tickfont: { family: v('--mono'), size: 11, color: v('--muted') },
			title: { font: { family: v('--mono'), size: 11, color: v('--muted') } }
		};
		return {
			paper_bgcolor: 'rgba(0,0,0,0)',
			plot_bgcolor: 'rgba(0,0,0,0)',
			font: { family: v('--body'), color: v('--ink'), size: 13 },
			colorway: ['--viz-blue', '--viz-clay', '--viz-moss', '--viz-gold', '--viz-plum', '--viz-red'].map(v),
			margin: { t: 24, r: 20, b: 52, l: 56 },
			xaxis: axis,
			yaxis: axis,
			legend: { font: { family: v('--mono'), size: 11, color: v('--muted') }, orientation: 'h', y: -0.2 },
			hoverlabel: { font: { family: v('--mono'), size: 12 }, bgcolor: v('--paper'), bordercolor: v('--rule-hard') },
			height
		};
	}

	/** Plain objects merge all the way down, so a post can set `xaxis.title.text` and keep the house font. */
	function merge(base: Record<string, any>, over: Record<string, any>): Record<string, any> {
		const plain = (x: unknown) => !!x && typeof x === 'object' && !Array.isArray(x);
		const out = { ...base };
		for (const [k, val] of Object.entries(over)) {
			out[k] = plain(val) && plain(base[k]) ? merge(base[k], val) : val;
		}
		return out;
	}

	/** Plotly cannot read CSS, so `'var(--token)'` strings are resolved here. */
	function tokens<T>(x: T, css: CSSStyleDeclaration): T {
		if (typeof x === 'string') {
			const m = x.match(/^var\((--[\w-]+)\)$/);
			return (m ? css.getPropertyValue(m[1]).trim() || x : x) as T;
		}
		if (Array.isArray(x)) return x.map((y) => tokens(y, css)) as T;
		if (x && typeof x === 'object') {
			return Object.fromEntries(Object.entries(x).map(([k, y]) => [k, tokens(y, css)])) as T;
		}
		return x;
	}

	onMount(() => {
		let gone = false;
		const load = async () => {
			const mod = needsFull(data)
				? await import('plotly.js-dist-min')
				: await import('plotly.js-basic-dist-min');
			if (!gone) Plotly = (mod.default ?? mod) as Plotly;
		};

		const seen = new IntersectionObserver(
			(entries) => {
				if (entries.some((e) => e.isIntersecting)) {
					seen.disconnect();
					load();
				}
			},
			{ rootMargin: '400px' }
		);
		seen.observe(el);

		// The theme lives on <html> as `data-theme`, or in the OS setting when unset.
		const bump = () => theme++;
		const attrs = new MutationObserver(bump);
		attrs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
		const os = matchMedia('(prefers-color-scheme: dark)');
		os.addEventListener('change', bump);

		// `responsive: true` only listens to the window; the column can change
		// width on its own (the reader's measure and framing settings).
		const resize = new ResizeObserver(() => {
			if (Plotly && el.dataset.drawn) Plotly.Plots.resize(el);
		});
		resize.observe(el);

		return () => {
			gone = true;
			seen.disconnect();
			attrs.disconnect();
			os.removeEventListener('change', bump);
			resize.disconnect();
			Plotly?.purge(el);
		};
	});

	$effect(() => {
		if (!Plotly) return;
		theme;
		const css = getComputedStyle(document.documentElement);
		// Plotly writes into what it is given — hand it copies, never a post's live state.
		const traces = tokens($state.snapshot(data) as Partial<Data>[], css);
		const look = tokens(merge(houseLayout(), $state.snapshot(layout)), css);
		Plotly.react(el, traces, look, {
			displaylogo: false,
			displayModeBar: false,
			responsive: true,
			...config
		}).then(() => (el.dataset.drawn = '1'));
	});
</script>

<DiagramPlate {label} {hint} {caption} live>
	<div
		bind:this={el}
		class="chart"
		style:height="{layout.height ?? height}px"
		role="img"
		aria-label={alt || caption || label}
	></div>
</DiagramPlate>

<style>
	/* Not `.plotly`: Plotly puts that class on its own inner div. */
	.chart {
		width: 100%;
	}
</style>
