// Studio City (/design-build-contractor-studio-city). Facts checked 11-11:
// part of the City of Los Angeles (LADBS, LADWP); from the flats north of
// Ventura Boulevard up into the Santa Monica Mountains toward Mulholland
// Drive. Properties in the Mulholland Scenic Parkway Specific Plan area go
// through its design review; projects adding more than 900 square feet go
// to its Design Review Board (Los Angeles City Planning). Hillside lots: the
// Baseline Hillside Ordinance.
const studioCity = {
  slug: "studio-city",
  description:
    "Design-build contractor in Studio City: new homes, additions, remodels, ADUs and outdoor living, in the flats and the hills, designed and built by one licensed team.",
  hero: "New homes, additions, remodels, ADUs and outdoor living in Studio City, from the flats to the hills, designed and built by one licensed team.",

  // Shown in "What we build" (Area/AreaServices), so the area pages aren't
  // alike: the intro as its line, and one line per service (by its slug) on
  // that service's card. Short and search-minded, the area's name with the
  // service, no history (11-17: the user found the first ones too long).
  // Only checkable facts (see the top); additions on the ground floor.
  // Checked 11-17: Ventura Boulevard is under the Ventura/Cahuenga Boulevard Corridor Specific Plan (Los Angeles City Planning).
  local: {
    intro:
      "Studio City design-build contractor, from remodels in the flats to new homes in the hills, with Mulholland design review handled where it applies.",
    services: {
      "new-construction":
        "Custom hillside homes in Studio City, designed for the slope and the view, through Mulholland review where it applies.",
      "home-additions":
        "Ground-floor additions in Studio City, with plans prepared for the Mulholland Design Review Board where needed.",
      "adu-contractor":
        "ADUs for Studio City lots in the flats or the hills, placed where the slope and access allow.",
      "home-remodeling":
        "Whole-home, kitchen and bath remodels for older Studio City houses that keep their character.",
      "outdoor-living":
        "Hillside patios and outdoor living spaces in Studio City, on footings engineered for the slope.",
      "commercial-construction":
        "Shop, office and restaurant build-outs on Ventura Boulevard in Studio City, permitted through LADBS.",
    },
  },

  faqs: [
    {
      question: "Does my Studio City project need Mulholland design review?",
      answer:
        "If your property is within the Mulholland Scenic Parkway Specific Plan area, yes, and projects adding more than 900 square feet go to its Design Review Board. We check your property's plan area on day one.",
    },
    {
      question: "Is building in the Studio City hills different?",
      answer:
        "Yes: hillside rules on size and grading, often fire-zone materials, and sometimes engineering for the slope and access for the crew. We account for all of it in the design and the price.",
    },
    {
      question: "Can I build an ADU in Studio City?",
      answer:
        "On most single-family lots, yes, in the flats or the hills. On a hillside, the slope and access shape where an ADU can go; we find the best spot on the site visit.",
    },
    {
      question: "Can you remodel an older house without losing its character?",
      answer:
        "Yes. We plan what stays and what changes with you: original details kept or matched, with new structure, wiring, plumbing and layout where they're needed.",
    },
    {
      question: "Does a hillside lot limit how big I can build?",
      answer:
        "It can. The Baseline Hillside Ordinance sets a maximum floor area from the lot's size and slope, and limits grading. We work out what your lot allows before design.",
    },
    {
      question: "Who issues building permits in Studio City?",
      answer:
        "The City of Los Angeles Department of Building and Safety (LADBS): Studio City is part of the City of Los Angeles. Near Mulholland, the design review comes first.",
    },
    {
      question: "What does a project in Studio City cost?",
      answer:
        "It depends on the size, the scope and the finishes you choose, so we price each project after seeing the property and talking it through with you. {{Get a free quote}}",
    },
  ],
};

export default studioCity;
