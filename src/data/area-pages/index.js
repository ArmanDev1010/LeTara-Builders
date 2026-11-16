import { SERVICE_AREAS } from "@/data/areas";
import burbank from "./burbank";
import glendale from "./glendale";
import granadaHills from "./granada-hills";
import missionHills from "./mission-hills";
import northHills from "./north-hills";
import porterRanch from "./porter-ranch";
import studioCity from "./studio-city";
import vanNuys from "./van-nuys";

// One page per service area (data/areas.js), Los Angeles excepted (its page
// is the homepage), served at /design-build-contractor-<slug> and rendered
// by components/Area/AreaPage. Each file holds what makes its page its own:
// the hero's line, a line over the services' cards, "Why build
// here?" (`local`: a line about the place, and how we'd go
// about each service there), and the local questions. HB Links' lesson: area
// pages without real local content read as doorway pages, so every fact here is one that can be checked (who
// issues permits, the utility, hillside, fire and historic rules, design
// review), and the similarity between pages is measured, not guessed. No
// prices, durations or guarantees.
//
// The areas were approved by Andranik (11-17). Keep next.config.mjs'
// AREA_SLUGS in step when adding one.
const PAGES = [
  northHills,
  granadaHills,
  porterRanch,
  missionHills,
  vanNuys,
  studioCity,
  burbank,
  glendale,
];

export const AREA_PAGES = PAGES.map((page) => {
  const area = SERVICE_AREAS.find((a) => a.slug === page.slug);
  return {
    ...page,
    name: area.name,
    href: area.href,
    metaTitle: `Design-Build Contractor in ${area.name}`,
  };
});

export const getAreaPage = (slug) =>
  AREA_PAGES.find((page) => page.slug === slug) ?? null;

