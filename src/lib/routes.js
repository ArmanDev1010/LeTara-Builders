// The public address of each generated page, made in one place. A service
// page is served at /<slug>-los-angeles (the rewrite in next.config.mjs, as
// on HB Links): the target city in the address, where search looks for it.
export const servicePageHref = (slug) => `/${slug}-los-angeles`;

// An area page is served at /design-build-contractor-<area> (the same kind of
// rewrite): what LeTara is, then where. Los Angeles, the target city, has no
// area page: its page is the homepage, so the two never compete.
export const areaPageHref = (slug) => `/design-build-contractor-${slug}`;
