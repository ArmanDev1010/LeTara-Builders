// North Hills (/design-build-contractor-north-hills). Facts checked 11-11:
// part of the City of Los Angeles (LADBS permits, LADWP); called Sepulveda
// until 1991, when its residents voted for the new name; mostly post-war
// homes on the flat Valley floor. ADU figures are the state law's.
const northHills = {
  slug: "north-hills",
  description:
    "Design-build contractor in North Hills, Los Angeles: new homes, additions, ADUs, remodels and outdoor living, designed, permitted with LADBS and built by one licensed team.",
  hero: "New homes, additions, ADUs and remodels in North Hills: designed, taken through the City of Los Angeles' permits and built by one licensed team.",

  // Shown in "What we build" (Area/AreaServices), so the area pages aren't
  // alike: the intro as its line, and one line per service (by its slug) on
  // that service's card. Short and search-minded, the area's name with the
  // service, no history (11-17: the user found the first ones too long).
  // Only checkable facts (see the top); additions on the ground floor.
  // Checked 11-17: flat lots' floor area is capped by the city's Baseline Mansionization Ordinance.
  local: {
    intro:
      "Design-build in North Hills: one licensed team designs, permits and builds your project, from a backyard ADU to a brand-new home.",
    services: {
      "new-construction":
        "Custom homes and knock-down rebuilds on North Hills lots, designed, permitted and built under one contract.",
      "home-additions":
        "Ground-floor home additions in North Hills: a family room, a primary suite or a bigger kitchen.",
      "adu-contractor":
        "Detached ADUs on flat North Hills lots, for family or rental income, permits included.",
      "home-remodeling":
        "Kitchen remodels, bathroom remodels and open floor plans that make a North Hills house feel new.",
      "outdoor-living":
        "Covered patios, pergolas and outdoor kitchens for deep, flat North Hills backyards.",
      "commercial-construction":
        "Storefront, office and restaurant build-outs on Sepulveda Boulevard and across North Hills.",
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
