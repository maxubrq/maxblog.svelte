/**
 * IEEE 754 single precision, by hand — the arithmetic behind the three live
 * figures in the float essay (`FloatBuilder`, `FloatExplorer`, `FloatVsFixed`).
 * Ported from the production blog's `src/components/interactive/Float*.tsx`,
 * where each component carried its own copy; there is one copy here because
 * the three figures must agree on every bit they show.
 */

/** The 32 bits a float32 is stored as, as an unsigned integer. */
export function encodeF32(n: number): number {
	const view = new DataView(new ArrayBuffer(4));
	view.setFloat32(0, n, false);
	return view.getUint32(0, false) >>> 0;
}

/** The number those 32 bits mean — the round trip that loses the difference. */
export function decodeF32(bits: number): number {
	const view = new DataView(new ArrayBuffer(4));
	view.setUint32(0, bits >>> 0, false);
	return view.getFloat32(0, false);
}

/** Bit 31 first, so the array reads left to right like the printed strip. */
export function toBitArray(bits: number): number[] {
	return Array.from({ length: 32 }, (_, i) => (bits >>> (31 - i)) & 1);
}

export type FloatKind = 'zero' | 'subnormal' | 'normal' | 'infinity' | 'nan';

export function getKind(exp: number, mant: number): FloatKind {
	if (exp === 0) return mant === 0 ? 'zero' : 'subnormal';
	if (exp === 255) return mant === 0 ? 'infinity' : 'nan';
	return 'normal';
}

/** The fields of a float32, decoded once and shared by every panel. */
export function fields(n: number) {
	const bits = encodeF32(n);
	const sign = (bits >>> 31) & 1;
	const exp = (bits >>> 23) & 0xff;
	const mant = bits & 0x7fffff;
	return {
		bits,
		sign,
		exp,
		mant,
		expBin: exp.toString(2).padStart(8, '0'),
		mantBin: mant.toString(2).padStart(23, '0'),
		kind: getKind(exp, mant),
		stored: decodeF32(bits)
	};
}

/**
 * The binary expansion of a positive finite number, written the way the essay
 * writes it: integer part in binary, then the fraction obtained by doubling.
 * `truncated` is the whole point — it says the expansion had not finished when
 * we ran out of digits, which is where the error is born.
 */
export function binaryExpansion(abs: number, maxFracDigits = 30) {
	const intPart = Math.floor(abs);
	let frac = abs - intPart;
	let fracBits = '';
	for (let i = 0; i < maxFracDigits && frac > 0; i++) {
		frac *= 2;
		const bit = Math.floor(frac);
		fracBits += bit;
		frac -= bit;
	}
	return { intBits: intPart.toString(2), fracBits, truncated: frac > 0 };
}

/**
 * Doubling, step by step, with the repeat detected: each row is one line of the
 * long multiplication a reader would do on paper. `repeatAt` is the step whose
 * value came back — from there the digits cycle forever, which is why 0.1
 * cannot be stored.
 *
 * The cycle is found on a value snapped to 1e-10, because the doubling is
 * itself done in floating point: exact equality would miss a cycle that drifts
 * in the last bits.
 */
export function fracToBinary(frac: number, maxSteps = 32) {
	const digits: Array<{ frac: number; doubled: number; bit: 0 | 1 }> = [];
	const seen = new Map<number, number>();
	let cur = frac;
	let repeatAt = -1;

	for (let i = 0; i < maxSteps; i++) {
		const key = Math.round(cur * 1e10) / 1e10;
		const before = seen.get(key);
		if (before !== undefined) {
			repeatAt = before;
			break;
		}
		seen.set(key, i);
		const doubled = cur * 2;
		const bit = Math.floor(doubled) as 0 | 1;
		digits.push({ frac: cur, doubled, bit });
		cur = doubled - Math.floor(doubled);
		if (cur === 0) break;
	}
	return { digits, repeatAt };
}

/** How a stored value is printed everywhere in these figures. */
export function showStored(stored: number, precision = 9): string {
	if (Number.isNaN(stored)) return 'NaN';
	if (!Number.isFinite(stored)) return stored > 0 ? '+Infinity' : '-Infinity';
	return stored.toPrecision(precision);
}
