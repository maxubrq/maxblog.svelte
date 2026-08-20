/**
 * The small amount of statistics a figure needs at *runtime*.
 *
 * `jstat` is not here on purpose: it is a devDependency for `scripts/velocity.mjs`,
 * where the author's constants are worked out. Importing it into a component
 * would post the whole library to every reader of the post to compute an erf.
 * These are the four functions the live figures actually call.
 */

/** The bell as a *drawing*: peak 1, so the y axis stays unitless (see `Plot`). */
export const bell =
  (mu: number, sd: number) =>
  (x: number): number =>
    Math.exp(-0.5 * ((x - mu) / sd) ** 2);

/** Abramowitz & Stegun 7.1.26 — |ε| < 1.5e-7, far past what a figure can show. */
function erf(x: number): number {
  const sign = Math.sign(x);
  const z = Math.abs(x);
  const t = 1 / (1 + 0.3275911 * z);
  const y =
    1 -
    ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) *
      t +
      0.254829592) *
      t *
      Math.exp(-z * z);
  return sign * y;
}

/** P(X ≤ x). The share of the bell lying left of a threshold. */
export const normalCdf = (x: number, mu = 0, sd = 1) =>
  0.5 * (1 + erf((x - mu) / (sd * Math.SQRT2)));

/**
 * A seeded generator, not `Math.random`.
 *
 * A figure that draws random numbers renders twice — once into the prerendered
 * HTML, once when Svelte hydrates it — and two different draws would make the
 * page visibly flinch. Seeded, both runs agree, and the reader's own re-rolls
 * carry on from there.
 */
export function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** `n` draws from N(mu, sd²) — Box–Muller, one pair at a time. */
export function draws(
  next: () => number,
  n: number,
  mu: number,
  sd: number,
): number[] {
  const out: number[] = [];
  while (out.length < n) {
    const u = Math.max(next(), Number.EPSILON);
    const v = next();
    const r = Math.sqrt(-2 * Math.log(u));
    out.push(mu + sd * r * Math.cos(2 * Math.PI * v));
    if (out.length < n) out.push(mu + sd * r * Math.sin(2 * Math.PI * v));
  }
  return out;
}

export const mean = (xs: number[]) => xs.reduce((s, x) => s + x, 0) / xs.length;
