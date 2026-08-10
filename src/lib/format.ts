/** Date/number formatting in the printed-document voice (§4). */

const MONTHS = [
	'Jan',
	'Feb',
	'Mar',
	'Apr',
	'May',
	'Jun',
	'Jul',
	'Aug',
	'Sep',
	'Oct',
	'Nov',
	'Dec'
];

const parts = (iso: string) => {
	const [y, m, d] = iso.split('-').map(Number);
	return { y, m: m ?? 1, d: d ?? 1 };
};

/** `2026 · 03 · 28` — the index-row date. */
export function dots(iso: string) {
	const { y, m, d } = parts(iso);
	return `${y} · ${pad(m)} · ${pad(d)}`;
}

/** `04·14` — the archive-row date, year comes from the section head. */
export function short(iso: string) {
	const { m, d } = parts(iso);
	return `${pad(m)}·${pad(d)}`;
}

/** `2026·04` — the topic-card date. */
export function yearMonth(iso: string) {
	const { y, m } = parts(iso);
	return `${y}·${pad(m)}`;
}

/** `Apr 14, 2026` · `14 thg 4, 2026` — the margin rail's `published` value. */
export function long(iso: string, lang: 'en' | 'vi' = 'en') {
	const { y, m, d } = parts(iso);
	if (lang === 'vi') return `${d} thg ${m}, ${y}`;
	return `${MONTHS[m - 1]} ${d}, ${y}`;
}

export const year = (iso: string) => parts(iso).y;

/** Zero-pad to two digits — "number everything" (§3). */
export function pad(n: number | string) {
	return String(n).padStart(2, '0');
}

/** `2,140` */
export const thousands = (n: number) => n.toLocaleString('en-US');

/** `Nº 001` */
export const essayNo = (n: number) => `Nº ${String(n).padStart(3, '0')}`;
