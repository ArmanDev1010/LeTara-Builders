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
  services:
    "From Eichler remodels to new homes in the foothills, every kind of project on one home. Point at one to find it in the drawing.",

  // Parked, not shown (11-12): the "Building in <area>" section was
  // scrapped until the user decides what goes after the quote form. Plain
  // local descriptions, checked: who permits a project here and the rules
  // that come up, then one per service (by its slug).
  local: {
    intro:
      "Granada Hills is part of the City of Los Angeles, with permits from LADBS. It runs from ranch homes on the Valley floor up into the Santa Susana foothills, where hillside lots fall under the Baseline Hillside Ordinance and fire-zone rules can apply, and its Balboa Highlands Eichler tract is a historic district with design guidelines of its own.",
    services: {
      "new-construction":
        "A custom home in the foothills, designed for its slope and its view and built to the fire-zone code where it applies: a Class A roof, ember-resistant vents and ignition-resistant siding.",
      "home-additions":
        "Ranch homes in the flats often have room to grow at the back: a primary suite or a family room on the ground floor. On hillside lots, the Baseline Hillside Ordinance sets how much you can add; we work that out before design.",
      "adu-contractor":
        "Wide, flat lots in Granada Hills are good ground for a detached ADU, for family nearby or for rent. We design it to state ADU law and take it through LADBS.",
      "home-remodeling":
        "Kitchen, bath and whole-home remodels, Eichlers included. In Balboa Highlands, a historic district, exterior changes are reviewed against its guidelines, and we design to them from the start.",
      "outdoor-living":
        "Covered patios, pergolas and outdoor kitchens that make the most of a foothill view, built with ignition-resistant materials in a Very High Fire Hazard Severity Zone.",
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
