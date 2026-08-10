import type { ParamMatcher } from '@sveltejs/kit';

/** Only `/en/…` and `/vi/…` are locales; anything else falls through to 404. */
export const match: ParamMatcher = (param) => param === 'en' || param === 'vi';
