// The public address of each generated page, made in one place. A service
// page is served at /<slug>-los-angeles (the rewrite in next.config.mjs, as
// on HB Links): the target city in the address, where search looks for it.
export const servicePageHref = (slug) => `/${slug}-los-angeles`;
