/**
 * Two velocity series in, the whole comparison out.
 *
 * Every number in `004-AI-empowerment-counting-by-SP-vi.mdx` — the sample sd,
 * the coefficient of variation, the standard error of the difference, the
 * detection threshold and the minimum improvement worth calling one — comes
 * from here. They were computed by hand once and one of them was wrong (σ₁ was
 * printed as 6.32 and 6.28 in the same paragraph; it is 6.23), which is the
 * whole argument for a script.
 *
 * `jstat` is a devDependency and stays one. The quantiles it supplies (1.96,
 * 0.84, and the t equivalents) are *authoring* work: they belong in the prose
 * as constants the author chose, not in a bundle the reader downloads.
 *
 *   pnpm velocity "38 45 31 42 36 48" "41 49 36 47 40 51"
 *   pnpm velocity … … --alpha 0.01 --power 0.9
 */
// jstat ships CommonJS, so it arrives as a default export under ESM.
import jstat from "jstat";

const { jStat } = jstat;

const argv = process.argv.slice(2);
const opt = (name, fallback) => {
  const i = argv.indexOf(`--${name}`);
  return i === -1 ? fallback : Number(argv[i + 1]);
};
const series = argv
  .filter((a) => !a.startsWith("--"))
  .slice(0, 2)
  .map((s) =>
    s
      .trim()
      .split(/[\s,]+/)
      .map(Number),
  );

if (
  series.length !== 2 ||
  series.some((s) => s.length < 2 || s.some(Number.isNaN))
) {
  console.error(
    'usage: pnpm velocity "<sprint points>" "<sprint points>" [--alpha .05] [--power .8]',
  );
  process.exit(1);
}

const alpha = opt("alpha", 0.05);
const power = opt("power", 0.8);

/** Sample sd — the `N-1` one, because a quarter is a sample of the team's work. */
const describe = (xs) => {
  const n = xs.length;
  const mean = jStat.mean(xs);
  const sd = jStat.stdev(xs, true);
  return {
    n,
    mean,
    sd,
    variance: sd ** 2,
    cv: sd / mean,
    se: sd / Math.sqrt(n),
  };
};

const [a, b] = series.map(describe);
const diff = b.mean - a.mean;
const se = Math.hypot(a.se, b.se);

// Welch: the two quarters are not assumed to have the same spread, so the
// degrees of freedom are fractional and usually well under n1 + n2 - 2.
const df = se ** 4 / (a.se ** 4 / (a.n - 1) + b.se ** 4 / (b.n - 1));

const z = {
  crit: jStat.normal.inv(1 - alpha / 2, 0, 1),
  beta: jStat.normal.inv(power, 0, 1),
};
const t = {
  crit: jStat.studentt.inv(1 - alpha / 2, df),
  beta: jStat.studentt.inv(power, df),
};

const f = (x, d = 2) => x.toFixed(d);
const line = (label, value) => console.log(`  ${label.padEnd(34)}${value}`);

for (const [name, q] of [
  ["Quý 1", a],
  ["Quý 2", b],
]) {
  console.log(`\n${name}  [${series[name === "Quý 1" ? 0 : 1].join(" ")}]`);
  line("N", q.n);
  line("trung bình  µ", f(q.mean, 1));
  line("phương sai mẫu  s²", f(q.variance, 1));
  line("độ lệch chuẩn mẫu  σ", f(q.sd));
  line("hệ số biến thiên  c", `${f(q.cv, 3)}  (${f(q.cv * 100, 1)}%)`);
  line("sai số chuẩn  SE", f(q.se));
}

console.log("\nSo sánh");
line("chênh lệch quan sát  Δ", `${diff >= 0 ? "+" : ""}${f(diff, 1)}`);
line("SE của chênh lệch", f(se));
line("bậc tự do (Welch)", f(df, 1));

for (const [name, k] of [
  ["chuẩn (z)", z],
  [`t (df ${f(df, 1)})`, t],
]) {
  console.log(`\nNgưỡng — ${name},  α=${alpha}, power=${power}`);
  line("hệ số", `${f(k.crit)} / ${f(k.beta)}`);
  line(
    `ngưỡng kết luận  ${f(k.crit)}·SE`,
    `${f(k.crit * se)}  →  ${Math.ceil(k.crit * se)}`,
  );
  line(
    "Δ tối thiểu  (crit+beta)·SE",
    `${f((k.crit + k.beta) * se)}  →  ${Math.ceil((k.crit + k.beta) * se)}`,
  );
}
console.log();
