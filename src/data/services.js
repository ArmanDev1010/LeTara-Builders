import { TbHomeEdit, TbHomePlus, TbStairsUp, TbTrees } from "react-icons/tb";
import { servicePageHref } from "@/lib/routes";

// What LeTara builds: the navbar's Services menu, the homepage's services
// section, the footer, and the service pages (data/service-pages, one each,
// at /<slug>-los-angeles). Design-build isn't one of them: it's what LeTara
// is (the H1's "Design-Build Contractor") and how every one of these is
// delivered, the way "Home Builder" is HB Links' umbrella over its
// services. ADUs lead, as they do on HB Links. The first's `text` is its
// homepage card's longer paragraph (the lead card has room for it).
//
// `image` stays null (a black stand-in) until there are real project
// photos; never use AI imagery. The card shows `icon` either way. `kicker`
// heads its card on the homepage. The slugs are LeTara's own, not HB
// Links' (its are adu-builder, home-remodel, deck-and-patio...).
export const SERVICES = [
  {
    slug: "adu-contractor",
    title: "ADUs",
    kicker: "On your lot",
    blurb: "A second home on your lot, attached or detached",
    text: "A second home on your lot, attached or detached: for family, for rent or for room to work. We find what your lot allows, design it, take it through permits and build it.",
    icon: TbHomePlus,
  },
  { slug: "home-additions", title: "Home Additions", kicker: "More room", blurb: "More room: a new wing or a second story", icon: TbStairsUp },
  { slug: "home-remodeling", title: "Full Remodels", kicker: "Inside", blurb: "Kitchens, baths or the whole house", icon: TbHomeEdit },
  { slug: "outdoor-living", title: "Outdoor Living", kicker: "Outside", blurb: "Pergolas, patios and outdoor kitchens", icon: TbTrees },
].map((service) => ({ ...service, href: servicePageHref(service.slug), image: null }));
