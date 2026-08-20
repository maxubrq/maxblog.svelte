/**
 * The frame a figure's marks share: two scales and the box they live in.
 *
 * The scale is four lines of arithmetic — but `ticks`, which picks the round
 * numbers a reader recognises, is not, so it comes from `d3-array`. Paths come
 * from `d3-shape`. That is the whole dependency: the same à-la-carte habit
 * `ReaderSky` already has with `d3-force`.
 *
 * `d3-scale` would give the same two functions wrapped in a scale object, and
 * drag in `d3-interpolate`, `d3-format` and `d3-time` behind them — about
 * 10KB gzipped into the chunk of any post that draws a figure. A blog that
 * renders its maths at build time to keep KaTeX off the wire should not pay
 * that to map a number onto an axis.
 */
import { ticks } from "d3-array";
import { getContext, setContext } from "svelte";

export interface Scale {
  /** Data → px. */
  (v: number): number;
  readonly domain: [number, number];
  /** Round values inside the domain — `count` is a hint, not a promise. */
  ticks(count?: number): number[];
}

export function linear(
  domain: [number, number],
  range: [number, number],
  { tickCount = 6 } = {},
): Scale {
  // The domain is NOT rounded out to whole ticks. `ticks` already lands on
  // round numbers inside it, and widening the domain instead pushes the
  // figure's own shape into a corner of the box to buy an axis end nobody
  // reads — the tails of a bell need to reach the edge to look flat.
  const [d0, d1] = domain;
  const [r0, r1] = range;
  const at = (v: number) => r0 + ((v - d0) / (d1 - d0)) * (r1 - r0);
  return Object.assign(at, {
    domain: [d0, d1] as [number, number],
    ticks: (count = tickCount) => ticks(d0, d1, count),
  });
}

export interface PlotFrame {
  readonly x: Scale;
  readonly y: Scale;
  /** The baseline, `y(0)` — where marks stand and the axis is drawn. */
  readonly base: number;
  readonly left: number;
  readonly right: number;
  readonly top: number;
  readonly height: number;
}

const KEY = Symbol("viz.plot");

export const setPlot = (frame: PlotFrame) => setContext(KEY, frame);

/** Marks call this at init to read the frame their parent `Plot` set up. */
export const usePlot = () => getContext<PlotFrame>(KEY);

/** `n + 1` evenly spaced x values — what every curve here is sampled on. */
export function samples(from: number, to: number, n = 120): number[] {
  return Array.from({ length: n + 1 }, (_, i) => from + ((to - from) * i) / n);
}

/**
 * Split a `{key}` template into literal text and slots, so a figure's sentence
 * can be authored in the post while the numbers in it stay live — and stay
 * *elements*, not `{@html}`.
 */
export function slots(
  template: string,
): ({ text: string } | { key: string })[] {
  return template
    .split(/(\{\w+\})/g)
    .filter(Boolean)
    .map((part) =>
      /^\{\w+\}$/.test(part) ? { key: part.slice(1, -1) } : { text: part },
    );
}
