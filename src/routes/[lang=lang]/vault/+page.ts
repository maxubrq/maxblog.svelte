import { langs } from '$lib/i18n';
import type { EntryGenerator, PageLoad } from './$types';

/**
 * One page per locale, prerendered like every other. The shelf is a static
 * module, so there is nothing to load — but the entry generator still has to
 * name both locales, or only the default one gets built.
 */
export const entries: EntryGenerator = () => langs.map((lang) => ({ lang }));

export const load: PageLoad = () => ({ foot: 'maxubrq.space / vault' });
