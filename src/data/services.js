import { TbHomeEdit, TbHomePlus, TbStairsUp, TbTrees } from "react-icons/tb";

// What LeTara builds: the navbar's Services menu, the homepage's services
// section and the footer. Design-build isn't one of them: it's what LeTara
// is (the H1's "Design-Build Contractor") and how every one of these is
// delivered, the way "Home Builder" is HB Links' umbrella over its
// services. ADUs lead, as they do on HB Links. The first's `text` is its
// homepage card's longer paragraph (the lead card has room for it).
//
// There are no service pages yet, so `href` lands on the homepage's
// services section. `image` stays null (a black stand-in) until there are
// real project photos; never use AI imagery. The card shows `icon` either
// way. `kicker` heads its card on the homepage.
export const SERVICES = [
  {
    title: "ADUs",
    kicker: "On your lot",
    blurb: "A second home on your lot, attached or detached",
    text: "A second home on your lot, attached or detached: for family, for rent or for room to work. We find what your lot allows, design it, take it through permits and build it.",
    icon: TbHomePlus,
  },
  { title: "Home Additions", kicker: "More room", blurb: "More room: a new wing or a second story", icon: TbStairsUp },
  { title: "Full Remodels", kicker: "Inside", blurb: "Kitchens, baths or the whole house", icon: TbHomeEdit },
  { title: "Outdoor Living", kicker: "Outside", blurb: "Pergolas, patios and outdoor kitchens", icon: TbTrees },
].map((service) => ({ ...service, href: "/#services", image: null }));
