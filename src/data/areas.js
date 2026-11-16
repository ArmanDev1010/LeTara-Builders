import { areaPageHref } from "@/lib/routes";

// Where LeTara builds: the navbar's Service Areas menu and the homepage's
// service-areas section (whose map shows the one picked). Los Angeles
// County is the target (Andranik, 11-16; it was the city of Los Angeles),
// first and wide everywhere it's listed, as on HB Links, and its map shows
// the whole county (`zoom`); its page is the homepage (`home`). Every
// other area has a page of its own (data/area-pages) at
// /design-build-contractor-<slug>. The rest, in and around the Valley, were
// approved by Andranik (11-17); deliberately not HB Links' list (see
// CLAUDE.md).
export const SERVICE_AREAS = [
  { name: "Los Angeles County", zoom: 9, home: true },
  { name: "North Hills" },
  { name: "Granada Hills" },
  { name: "Porter Ranch" },
  { name: "Mission Hills" },
  { name: "Van Nuys" },
  { name: "Studio City" },
  { name: "Burbank" },
  { name: "Glendale" },
].map((area) => {
  const slug = area.name.toLowerCase().replaceAll(" ", "-");
  return { zoom: 12, ...area, slug, href: area.home ? "/" : areaPageHref(slug) };
});
