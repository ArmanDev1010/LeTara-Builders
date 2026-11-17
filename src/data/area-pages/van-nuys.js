// Van Nuys (/design-build-contractor-van-nuys). Facts checked 11-11: part of
// the City of Los Angeles (LADBS, LADWP); LADBS's Van Nuys Development
// Services Center is at 6262 Van Nuys Blvd, in the civic center; mostly
// post-war homes on flat lots. Garage conversions: state ADU law (no
// replacement parking when a garage is converted).
const vanNuys = {
  slug: "van-nuys",
  description:
    "Design-build contractor in Van Nuys: new homes, rebuilds, additions, ADUs, remodels and outdoor living, permitted with LADBS and built by one licensed team.",
  hero: "Design-build in Van Nuys: new homes, additions, ADUs, remodels and outdoor living, by one licensed team that handles the permits too.",

  // Shown since 11-17 in "What we build" (Area/AreaServices), so the area
  // pages aren't alike (the user asked): the intro as its line, and one
  // line per service (by its slug) on that service's card. Plain local
  // descriptions, checked: who permits a project here and the rules that
  // come up. Additions are on the ground floor (Andranik, 11-16).
  // Checked 11-17: a change of use gets a new Certificate of Occupancy (LADBS); flat lots' floor area is capped by the Baseline Mansionization Ordinance.
  local: {
    intro:
      "Van Nuys is part of the City of Los Angeles, and LADBS's Valley development services center is here, at 6262 Van Nuys Boulevard. Its neighborhoods are mostly post-war homes on flat, regular lots, where a ground-floor addition, a garage conversion or a backyard ADU can often fit.",
    services: {
      "new-construction":
        "Knock down and rebuild: when an older house has reached the end of its life, we design a new home to the lot's zoning, then demolish and build it under one contract.",
      "home-additions":
        "Additions on the ground floor at the back of the house: a bedroom and bath, a primary suite or a bigger family room, sized to the floor area a flat lot is allowed under the city's Baseline Mansionization Ordinance.",
      "adu-contractor":
        "Garage conversions into ADUs, with their own kitchen and bath. State law allows the conversion on single-family lots, and the city can't require you to replace the parking.",
      "home-remodeling":
        "Kitchen and bath remodels that bring an older house's wiring, plumbing and insulation up to today's code while the walls are open.",
      "outdoor-living":
        "Outdoor kitchens with counters, a grill and a sink under a pergola, with gas, power and water run to them and permitted with the city.",
      "commercial-construction":
        "Shop, office and restaurant build-outs, permitted at LADBS's own Valley office here on Van Nuys Boulevard. When a space changes use, say from a store to a restaurant, LADBS issues a new Certificate of Occupancy.",
    },
  },

  faqs: [
    {
      question: "Where are building permits issued for Van Nuys?",
      answer:
        "By the City of Los Angeles Department of Building and Safety (LADBS), which has a development services center at 6262 Van Nuys Boulevard. We submit the plans, answer the corrections and schedule the inspections.",
    },
    {
      question: "Can I convert my garage into an ADU?",
      answer:
        "Usually, yes. State law allows garage conversions into ADUs on single-family lots, and the city can't require you to replace the parking you convert.",
    },
    {
      question: "Should I remodel my older house or rebuild it?",
      answer:
        "It depends on the house's condition, what the lot allows and what you want from it. We look at both options on the site visit and tell you plainly which makes more sense.",
    },
    {
      question: "Do you build home additions in Van Nuys?",
      answer:
        "Yes: rooms added at the back or side of the house, primary suites and bump-outs on the ground floor, where the zoning and the lot allow it. We check the setbacks and where the addition ties into the house before design.",
    },
    {
      question: "Do I have to go to the permit office myself?",
      answer:
        "No. Much of plan check happens online now, and we handle the submittal, the corrections and the inspections for you.",
    },
    {
      question: "Who provides power and water in Van Nuys?",
      answer:
        "LADWP. A rebuild, an addition or an ADU may need new service or a bigger panel; we plan it with LADWP as part of the design.",
    },
    {
      question: "What does a project in Van Nuys cost?",
      answer:
        "It depends on the size, the scope and the finishes you choose, so we price each project after seeing the property and talking it through with you. {{Get a free quote}}",
    },
  ],
};

export default vanNuys;
