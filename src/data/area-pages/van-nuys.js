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

  // Shown in "What we build" (Area/AreaServices), so the area pages aren't
  // alike: the intro as its line, and one line per service (by its slug) on
  // that service's card. Short and search-minded, the area's name with the
  // service, no history (11-17: the user found the first ones too long).
  // Only checkable facts (see the top); additions on the ground floor.
  // Checked 11-17: a change of use gets a new Certificate of Occupancy (LADBS); flat lots' floor area is capped by the Baseline Mansionization Ordinance.
  local: {
    intro:
      "Van Nuys design-build contractor for homes and businesses: ADUs, garage conversions, additions, remodels and build-outs, permitted with LADBS.",
    services: {
      "new-construction":
        "Knock-down rebuilds in Van Nuys: a new home designed for your lot, demolition and construction under one contract.",
      "home-additions":
        "Ground-floor additions at the back of Van Nuys homes: a bedroom and bath or a primary suite.",
      "adu-contractor":
        "Garage conversions into ADUs in Van Nuys, with no replacement parking required under state law.",
      "home-remodeling":
        "Kitchen and bath remodeling in Van Nuys, with an older home's wiring and plumbing brought up to code.",
      "outdoor-living":
        "Outdoor kitchens under a pergola for Van Nuys backyards, with gas, power and water run to them.",
      "commercial-construction":
        "Shop, office and restaurant build-outs on Van Nuys Boulevard, change-of-use permits included.",
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
