import { TbCrane, TbHomeEdit, TbHomePlus, TbStairsUp, TbTrees } from "react-icons/tb";
import { servicePageHref } from "@/lib/routes";

// What LeTara builds: the navbar's Services menu, the homepage's services
// section, the footer, and the service pages (data/service-pages, one each,
// at /<slug>-los-angeles). The list and its order are Andranik's own, from
// his yard sign (11-10): New Construction, Additions, ADUs, Remodels,
// Outdoor Living Spaces. "Home" goes before Additions and Remodels, which
// alone don't say what's being added to or remodeled (and "home additions",
// "home remodel" are what people search). Design-build isn't one of them:
// it's what LeTara is (the H1's "Design-Build Contractor") and how every one
// of these is delivered. The first's `text` is its homepage card's longer
// paragraph (the lead card has room for it).
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
    icon: TbCrane,
  },
  {
    slug: "home-additions",
    title: "Home Additions",
    kicker: "More room",
    blurb: "More room: a new wing or a second story",
    icon: TbStairsUp,
  },
  {
    slug: "adu-contractor",
    title: "ADUs",
    kicker: "On your lot",
    blurb: "A second home on your lot, attached or detached",
    icon: TbHomePlus,
  },
  {
    slug: "home-remodeling",
    title: "Home Remodels",
    kicker: "Inside",
    blurb: "Kitchens, baths or the whole house",
    icon: TbHomeEdit,
  },
  {
    slug: "outdoor-living",
    title: "Outdoor Living Spaces",
    kicker: "Outside",
    blurb: "Pergolas, patios and outdoor kitchens",
    icon: TbTrees,
  },
].map((service) => ({ ...service, href: servicePageHref(service.slug) }));
