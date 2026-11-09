// Where LeTara builds: the navbar's Service Areas menu and the homepage's
// service-areas section (whose map shows the one picked). Los Angeles is
// the target city, first and wide everywhere it's listed, as on HB Links,
// and its map shows the whole city (`zoom`). The rest are placeholders in
// the Valley until Andranik confirms where he works; deliberately not HB
// Links' list (see CLAUDE.md).
export const SERVICE_AREAS = [
  { name: "Los Angeles", zoom: 10 },
  { name: "North Hills" },
  { name: "Granada Hills" },
  { name: "Porter Ranch" },
  { name: "Mission Hills" },
  { name: "Van Nuys" },
  { name: "Studio City" },
  { name: "Burbank" },
  { name: "Glendale" },
].map((area) => ({ zoom: 12, ...area, href: "/#service-areas" }));
