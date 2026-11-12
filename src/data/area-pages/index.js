import { SERVICE_AREAS } from "@/data/areas";
import { SERVICES } from "@/data/services";
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
// the hero's line, a line for the services on the property, "Why build
// here?" (`local`: a line about the place, and how we'd go
// about each service there), and the local questions. HB Links' lesson: area
// pages without real local content read as doorway pages, so every fact here is one that can be checked (who
// issues permits, the utility, hillside, fire and historic rules, design
// review), and the similarity between pages is measured, not guessed. No
// prices, durations or guarantees.
//
// The areas themselves are placeholders until Andranik confirms where he
// works. Keep next.config.mjs' AREA_SLUGS in step when adding one.
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

// The services every area page shows on its property (Area/AreaBuild over
// the `property` asset): each lit in the drawing by its slug (which also
// gives it its icon there), the whole card linking to its page, in the
// services' own order. The addition is the upper floor on the house; the
// remodel the rooms seen through the drawing's cutaway.
const ON_THE_PROPERTY = {
  "new-construction":
    "A new home from the ground up, like this Craftsman: on an empty lot, in place of the house you have, or rebuilt after a loss.",
  "home-additions":
    "More room without moving: a second story like this one, a new wing, or a room added on the ground floor.",
  "adu-contractor":
    "A second home on the same lot: a cottage in the yard like this one, attached to the house, or in the garage.",
  "home-remodeling":
    "The house you have, rethought: a living room, kitchen and bath like these, or the whole floor plan.",
  "outdoor-living":
    "A patio under a pergola, an outdoor kitchen and a fire pit: the yard made into rooms.",
};
export const PROPERTY = SERVICES.map(({ slug, title, href }) => ({
  layer: slug,
  title,
  text: ON_THE_PROPERTY[slug],
  href,
}));
