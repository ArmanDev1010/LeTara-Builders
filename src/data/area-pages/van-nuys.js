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
  services:
    "New, added on or made over: every kind of project on one home, for Van Nuys houses and lots. Point at one to find it in the drawing.",

  // Parked, not shown (11-12): the "Building in <area>" section was
  // scrapped until the user decides what goes after the quote form. Plain
  // local descriptions, checked: who permits a project here and the rules
  // that come up, then one per service (by its slug).
  local: {
    intro:
      "Van Nuys is part of the City of Los Angeles, and LADBS's Valley development services center is here, at 6262 Van Nuys Boulevard. Its neighborhoods are mostly post-war homes on flat, regular lots, where a second story, a garage conversion or a backyard ADU can often fit.",
    services: {
      "new-construction":
        "Knock down and rebuild: when an older house has reached the end of its life, we design a new home to the lot's zoning, then demolish and build it under one contract.",
      "home-additions":
        "Second-story additions that build up instead of out, with bedrooms and a bath upstairs and the yard kept as it is. A second story often needs new foundation work, which we check first.",
      "adu-contractor":
        "Garage conversions into ADUs, with their own kitchen and bath. State law allows the conversion on single-family lots, and the city can't require you to replace the parking.",
      "home-remodeling":
        "Kitchen and bath remodels that bring an older house's wiring, plumbing and insulation up to today's code while the walls are open.",
      "outdoor-living":
        "Outdoor kitchens with counters, a grill and a sink under a pergola, with gas, power and water run to them and permitted with the city.",
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
      question: "Do you build second-story additions in Van Nuys?",
      answer:
        "Yes, where the zoning and the existing structure allow it. A second story often needs new foundation work below, which we check before design.",
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
