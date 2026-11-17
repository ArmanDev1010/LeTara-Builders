// Granada Hills (/design-build-contractor-granada-hills). Facts checked
// 11-11: part of the City of Los Angeles (LADBS, LADWP); runs up into the
// foothills of the Santa Susana Mountains; Balboa Highlands, an Eichler
// tract built 1962-64, is a Historic Preservation Overlay Zone (HPOZ) and
// the only Eichler development in Los Angeles County (Los Angeles City
// Planning). Hillside lots fall under the Baseline Hillside Ordinance;
// fire-zone construction is Chapter 7A of the California Building Code.
const granadaHills = {
  slug: "granada-hills",
  description:
    "Design-build contractor in Granada Hills: new homes, additions, ADUs, remodels and outdoor living, from Eichlers to foothill lots, designed and built by one licensed team.",
  hero: "Design-build in Granada Hills: new homes, additions, ADUs, remodels and outdoor living, from the flats to the foothills, by one licensed team.",

  // Shown in "What we build" (Area/AreaServices), so the area pages aren't
  // alike: the intro as its line, and one line per service (by its slug) on
  // that service's card. Short and search-minded, the area's name with the
  // service, no history (11-17: the user found the first ones too long).
  // Only checkable facts (see the top); additions on the ground floor.
  local: {
    intro:
      "Granada Hills' design-build contractor for ranch homes, Eichlers and foothill lots, with every project designed and built by one licensed team.",
    services: {
      "new-construction":
        "Custom homes in the Granada Hills foothills, designed for the slope, the view and the fire code.",
      "home-additions":
        "Ground-floor additions for Granada Hills ranch homes: a primary suite or a family room at the back.",
      "adu-contractor":
        "Detached ADUs on wide Granada Hills lots, designed to state ADU law and permitted with LADBS.",
      "home-remodeling":
        "Kitchen, bath and whole-home remodeling in Granada Hills, Eichlers in Balboa Highlands included.",
      "outdoor-living":
        "Covered patios, pergolas and outdoor kitchens that make the most of a foothill view.",
      "commercial-construction":
        "Build-outs for shops, offices and restaurants on Granada Hills' commercial streets.",
    },
  },

  faqs: [
    {
      question: "Can I remodel or add on to an Eichler in Balboa Highlands?",
      answer:
        "Yes, within the HPOZ's guidelines. Changes to the outside of the house are reviewed by the city's historic preservation staff before the building permit. We design to the guidelines and prepare the review for you.",
    },
    {
      question: "Is my Granada Hills home in a fire zone?",
      answer:
        "Some are, mostly toward the foothills. If yours is in a Very High Fire Hazard Severity Zone, the build follows the fire-zone rules for roofing, vents, siding and windows. We check the map for your address before design.",
    },
    {
      question: "Does a hillside lot limit how much I can add?",
      answer:
        "It can. The Baseline Hillside Ordinance sets a maximum floor area from the lot's size and slope, and limits grading. We work out what your lot allows before designing an addition.",
    },
    {
      question: "Do you build ADUs in Granada Hills?",
      answer:
        "Yes. Many lots in the flats have room for a detached ADU, and a garage conversion works on most. We design it and permit it through LADBS.",
    },
    {
      question: "Who issues building permits in Granada Hills?",
      answer:
        "The City of Los Angeles Department of Building and Safety (LADBS): Granada Hills is part of the City of Los Angeles. In Balboa Highlands, the historic review comes before the building permit.",
    },
    {
      question: "Can an Eichler's look be kept in a remodel?",
      answer:
        "Yes. Post-and-beam framing, walls of glass and open plans can be kept or brought back, with new systems, insulation and finishes around them.",
    },
    {
      question: "What does a project in Granada Hills cost?",
      answer:
        "It depends on the size, the scope and the finishes you choose, so we price each project after seeing the property and talking it through with you. {{Get a free quote}}",
    },
  ],
};

export default granadaHills;
