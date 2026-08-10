// Pure helpers over post slugs — no import.meta.glob here, so components can
// import this without pulling every post's loader into the client bundle.

/** `001-float-memory-vi` → `001-float-memory`. Both `-vi` and `_vi` occur. */
export const groupOf = (slug: string) => slug.replace(/[-_](en|vi)$/, '');
