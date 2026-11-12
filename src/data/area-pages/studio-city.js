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
  services:
    "From remodels in the flats to new homes in the hills, every kind of project on one home. Point at one to find it in the drawing.",

  // Parked, not shown (11-12): the "Building in <area>" section was
  // scrapped until the user decides what goes after the quote form. Plain
  // local descriptions, checked: who permits a project here and the rules
  // that come up, then one per service (by its slug).
  local: {
    intro:
      "Studio City is part of the City of Los Angeles, with permits from LADBS. It runs from older homes on the flats north of Ventura Boulevard to hillside lots toward Mulholland Drive, where the Baseline Hillside Ordinance applies and properties in the Mulholland Scenic Parkway Specific Plan area go through its design review.",
    services: {
      "new-construction":
        "Custom homes in the hills, designed for the slope and the view, within the Baseline Hillside Ordinance's limits and through Mulholland design review where it applies.",
      "home-additions":
        "Additions near Mulholland Drive that add more than 900 square feet go before the Mulholland Design Review Board. We plan the addition for that review and prepare the plans for it.",
      "adu-contractor":
        "Most single-family lots in Studio City can take an ADU, in the flats or the hills. On a hillside, the slope and access shape where it can go; we find the best spot on the site visit.",
      "home-remodeling":
        "Whole-home, kitchen and bath remodels for older houses in the flats that keep their character, with new structure, systems and a layout for today.",
      "outdoor-living":
        "Patios and outdoor living spaces on hillside lots, with footings engineered for the slope, that turn the view into a room.",
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
