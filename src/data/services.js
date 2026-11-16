import { TbBuildingStore, TbCrane, TbHomeEdit, TbHomePlus, TbStairsUp, TbTrees } from "react-icons/tb";
import { servicePageHref } from "@/lib/routes";

// What LeTara builds: the navbar's Services menu, the homepage's services
// section, the footer, and the service pages (data/service-pages, one each,
// at /<slug>-los-angeles). The list and its order are Andranik's own, from
// his yard sign (11-10): New Construction, Additions, ADUs, Remodels,
// Outdoor Living Spaces, then Commercial (added 11-16, at Andranik's
// request). "Home" goes before Additions and Remodels, which
// alone don't say what's being added to or remodeled (and "home additions",
// "home remodel" are what people search). Design-build isn't one of them:
// it's what LeTara is (the H1's "Design-Build Contractor") and how every one
// of these is delivered. The first's `text` is the area pages' lead card's
// longer paragraph (it has room for it). `home` is the line on its card
// beside the homepage's drawing of a home (Home/Services): the home shows the
// first five, so theirs point at it ("like this one"); commercial has no part
// in it. Home additions center on the ground floor (Andranik, 11-16).
//
// The cards have no photos (the user's call, 11-11, after trying stock
// photos): the black stand-in with the service's `icon`. `kicker` heads its
// card on the homepage. The slugs are LeTara's own, not HB Links' (its are adu-builder,
// home-remodel, deck-and-patio...).
export const SERVICES = [
  {
    slug: "new-construction",
    title: "New Construction",
    kicker: "From the ground up",
    blurb: "A new home from the ground up, or a rebuild",
    text: "A new home from the ground up: on an empty lot, in place of the house you have, or rebuilt after a loss. We design it, take it through permits and build it, as one team.",
    home: "A new home from the ground up, like this Craftsman: on an empty lot, in place of the house you have, or rebuilt after a loss.",
    icon: TbCrane,
  },
  {
    slug: "home-additions",
    title: "Home Additions",
    kicker: "More room",
    blurb: "More room on one level: a new wing or a bigger room",
    home: "More room without moving: a new wing on the ground floor like this one, a room added at the back, or a bump-out.",
    icon: TbStairsUp,
  },
  {
    slug: "adu-contractor",
    title: "ADUs",
    kicker: "On your lot",
    blurb: "A second home on your lot, attached or detached",
    home: "A second home on the same lot: a cottage in the yard like this one, attached to the house, or in the garage.",
    icon: TbHomePlus,
  },
  {
    slug: "home-remodeling",
    title: "Home Remodels",
    kicker: "Inside",
    blurb: "Kitchens, baths or the whole house",
    home: "The house you have, rethought: a living room, kitchen and bath like these, or the whole floor plan.",
    icon: TbHomeEdit,
  },
  {
    slug: "outdoor-living",
    title: "Outdoor Living Spaces",
    kicker: "Outside",
    blurb: "Pergolas, patios and outdoor kitchens",
    home: "A patio under a pergola, an outdoor kitchen and a fire pit: the yard made into rooms.",
    icon: TbTrees,
  },
  {
    slug: "commercial-construction",
    title: "Commercial",
    kicker: "For business",
    blurb: "Build-outs for offices, shops and restaurants",
    home: "Build-outs, tenant improvements and renovations for offices, shops, restaurants and cafés, designed around how the business runs.",
    icon: TbBuildingStore,
  },
].map((service) => ({ ...service, href: servicePageHref(service.slug) }));
