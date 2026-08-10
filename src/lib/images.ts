/**
 * Images — Cloudinary delivery, same account and same contract as the
 * production blog (`~/MyApps/maxblog/src/lib/images.ts` + `cloudinary-loader.ts`).
 *
 * Images are *primarily* loaded from Cloudinary: a post's `coverImage` is a
 * Cloudinary delivery URL, and the transformations that make it responsive are
 * inserted here rather than baked into the URL an author writes. Production
 * does this through `next/image`'s custom loader; this edition has no image
 * component to hook, so `cloudinary()` and `srcsetFor()` do it explicitly and
 * `DuoPhoto` calls them.
 *
 * Anything that is not a Cloudinary delivery URL — a local `/media/…` halftone
 * plate, another host — passes through untouched, so both helpers stay safe to
 * call on any `src`.
 */

/**
 * The branded fallback shown whenever a post has no `coverImage`. Served
 * through the same pipeline, so it is format/quality/width-optimised too.
 */
export const DEFAULT_COVER_IMAGE =
	'https://res.cloudinary.com/dmsb4anlx/image/upload/v1784555137/maxubrq.space/default_cwbybq.jpg';

/**
 * The portrait plate on /about. Duotoned by `.ink-duo`, so almost any photo
 * reads as deliberate — swap this for a real portrait when there is one.
 */
export const AUTHOR_PORTRAIT = 'https://res.cloudinary.com/dmsb4anlx/image/upload/v1786366184/maxubrq.space/avatar_1_hr4ica.png';

/** The cover for a post: its own `coverImage`, or the branded default. */
export function coverImageFor(coverImage?: string): string {
	return coverImage && coverImage.trim() ? coverImage : DEFAULT_COVER_IMAGE;
}

/** The widths a plate is offered in. Fewer than Next's defaults — every one is a build-time string, not a resize. */
export const IMAGE_WIDTHS = [480, 640, 828, 1080, 1440, 1920] as const;

/**
 * Halftone screens, done by Cloudinary's own ordered-dither at the CDN (§2).
 *
 * Same idea as `scripts/halftone.mjs` — one dot per cell, dot size tracking the
 * cell's darkness, nothing grey surviving — but it reaches images we only ever
 * host remotely, which the script cannot: it needs the file on disk.
 *
 * The named screens are the ones worth having; the level numbers are
 * Cloudinary's `e_ordered_dither` table.
 *   · `screen` — 8×8 at 45°, the offset plate the script imitates
 *   · `coarse` — 6×6 at 45°, bigger dots, the screen reads as a texture
 *   · `fine`   — 6×6 round dots, orthogonal, closest to newsprint
 */
export const HALFTONE_SCREENS = { screen: 8, coarse: 7, fine: 15 } as const;
export type Halftone = keyof typeof HALFTONE_SCREENS;

const MARKER = '/upload/';

/** Is this a Cloudinary delivery URL we can rewrite? */
function isCloudinary(src: string): boolean {
	return src.includes('res.cloudinary.com') && src.includes(MARKER);
}

/**
 * Insert responsive transformations right after `/upload/`:
 *
 *   https://res.cloudinary.com/<cloud>/image/upload/v123/foo.jpg
 *     → …/upload/f_auto,q_auto,w_1080,c_limit/v123/foo.jpg
 *
 * `f_auto` = best format per browser, `q_auto` = let Cloudinary pick the
 * quality, `w_<width>` = the size asked for, `c_limit` = never upscale and keep
 * the aspect ratio (CSS `object-fit` handles the visual crop).
 *
 * `halftone` appends a second chained component, so the screen is applied to
 * the *resized* image — dot pitch is in final pixels, and scaling a screened
 * image afterwards would just moiré it.
 */
export function cloudinary(
	src: string,
	{
		width,
		quality,
		halftone
	}: { width?: number; quality?: number | 'auto'; halftone?: Halftone } = {}
): string {
	if (!isCloudinary(src)) return src;

	const transforms = ['f_auto', `q_${quality ?? 'auto'}`];
	if (width) transforms.push(`w_${width}`);
	transforms.push('c_limit');

	const chain = [transforms.join(',')];
	if (halftone) chain.push('e_grayscale', `e_ordered_dither:${HALFTONE_SCREENS[halftone]}`);

	const at = src.indexOf(MARKER) + MARKER.length;
	return `${src.slice(0, at)}${chain.join('/')}/${src.slice(at)}`;
}

/**
 * A `srcset` across `IMAGE_WIDTHS`, or `undefined` for anything not on
 * Cloudinary — a local plate has exactly one size and must not claim others.
 */
export function srcsetFor(
	src: string,
	{ widths = IMAGE_WIDTHS, halftone }: { widths?: readonly number[]; halftone?: Halftone } = {}
): string | undefined {
	if (!isCloudinary(src)) return undefined;
	return widths.map((w) => `${cloudinary(src, { width: w, halftone })} ${w}w`).join(', ');
}
