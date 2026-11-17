// North Hills (/design-build-contractor-north-hills). Facts checked 11-11:
// part of the City of Los Angeles (LADBS permits, LADWP); called Sepulveda
// until 1991, when its residents voted for the new name; mostly post-war
// homes on the flat Valley floor. ADU figures are the state law's.
const northHills = {
  slug: "north-hills",
  description:
    "Design-build contractor in North Hills, Los Angeles: new homes, additions, ADUs, remodels and outdoor living, designed, permitted with LADBS and built by one licensed team.",
  hero: "New homes, additions, ADUs and remodels in North Hills: designed, taken through the City of Los Angeles' permits and built by one licensed team.",

  // Shown since 11-17 in "What we build" (Area/AreaServices), so the area
  // pages aren't alike (the user asked): the intro as its line, and one
  // line per service (by its slug) on that service's card. Plain local
  // descriptions, checked: who permits a project here and the rules that
  // come up. Additions are on the ground floor (Andranik, 11-16).
  // Checked 11-17: flat lots' floor area is capped by the city's Baseline Mansionization Ordinance.
  local: {
    intro:
      "North Hills is part of the City of Los Angeles, so building permits come from LADBS and power and water from LADWP. Most of its homes are single-story houses on flat Valley lots, which leaves room to build out at the back or side, or to put an ADU in the yard.",
    services: {
      "new-construction":
        "When an older house would cost more to fix than to replace, we design and build a new home on the same lot: drawn to its zoning, permitted through LADBS, with the demolition and the construction under one contract.",
      "home-additions":
        "Flat lots leave room to build out on one level: a family room at the back, a primary suite, a bigger kitchen. Before anything is drawn, we check your lot's setbacks and how much floor area the city allows on it.",
      "adu-contractor":
        "Flat North Hills lots suit a detached ADU, for family or for rental income. State law allows one ADU and one junior ADU on most single-family lots, and the city has 60 days to act on a complete application; we handle the design and the permits.",
      "home-remodeling":
        "Kitchen remodels, bathroom remodels and open floor plans. Taking out the wall between the kitchen and the living room makes a house feel new without adding a foot, and it's the time to update the wiring and plumbing too.",
      "outdoor-living":
        "Deep, flat backyards take a covered patio, a pergola and an outdoor kitchen, usually without the retaining walls a sloped yard needs. We design it, permit it and build it.",
      "commercial-construction":
        "Storefronts, offices and restaurants along Sepulveda Boulevard and the neighborhood's other commercial streets, designed around how the business runs and permitted through LADBS.",
    },
  },

  faqs: [
    {
      question: "Do you build ADUs in North Hills?",
      answer:
        "Yes: detached ADUs, attached ADUs, junior ADUs and garage conversions, designed for your lot and permitted through the City of Los Angeles.",
    },
    {
      question: "Who issues building permits in North Hills?",
      answer:
        "The City of Los Angeles Department of Building and Safety (LADBS). North Hills is a neighborhood of the City of Los Angeles, not a city of its own, so the city's codes apply. We prepare the plans and handle the permit as part of the job.",
    },
    {
      question: "Can I add on to my single-story house?",
      answer:
        "Often, yes. Many North Hills lots have room at the back or side for a ground-floor addition: a family room, a bigger kitchen or a primary suite. The lot's setbacks and the zone's limits decide how far it can go, and we check them before anything is designed.",
    },
    {
      question: "Can I build an ADU and a junior ADU on the same lot?",
      answer:
        "On most single-family lots, yes: state law allows one ADU and one junior ADU. A junior ADU is up to 500 square feet and sits inside the house.",
    },
    {
      question: "How long does the city take to review an ADU?",
      answer:
        "Under state law, the city has 60 days to act on a complete ADU application. The design and the drawings come first; we tell you where your project stands at every step.",
    },
    {
      question: "Is North Hills the same as Sepulveda?",
      answer:
        "Yes. The area was called Sepulveda until 1991, when its residents voted to rename it North Hills. It's still part of the City of Los Angeles.",
    },
    {
      question: "What does a project in North Hills cost?",
      answer:
        "It depends on the size, the scope and the finishes you choose, so we price each project after seeing the property and talking it through with you. {{Get a free quote}}",
    },
  ],
};

export default northHills;
