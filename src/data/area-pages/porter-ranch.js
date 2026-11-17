// Porter Ranch (/design-build-contractor-porter-ranch). Facts: part of the
// City of Los Angeles (LADBS, LADWP); the northwest corner of the Valley,
// against the Santa Susana Mountains; planned and built from the 1960s on,
// many lots on hillsides. Hillside lots: the Baseline Hillside Ordinance;
// fire zones: Chapter 7A of the California Building Code and the Fire
// Department's brush clearance. HOAs are worded as "if yours has one".
const porterRanch = {
  slug: "porter-ranch",
  description:
    "Design-build contractor in Porter Ranch: additions, remodels, ADUs, new homes and outdoor living for hillside lots, permitted with LADBS and built by one licensed team.",
  hero: "Additions, remodels, ADUs and outdoor living in Porter Ranch: designed for hillside lots, permitted with the City of Los Angeles and built by one team.",

  // Shown since 11-17 in "What we build" (Area/AreaServices), so the area
  // pages aren't alike (the user asked): the intro as its line, and one
  // line per service (by its slug) on that service's card. Plain local
  // descriptions, checked: who permits a project here and the rules that
  // come up. Additions are on the ground floor (Andranik, 11-16).
  local: {
    intro:
      "Porter Ranch is part of the City of Los Angeles, in the northwest corner of the Valley against the Santa Susana Mountains. Many of its homes sit on hillside lots under the Baseline Hillside Ordinance, much of it is in a Very High Fire Hazard Severity Zone, and if your tract has an HOA, its architectural review comes before the city's permits.",
    services: {
      "new-construction":
        "A new home on a hillside lot, designed to the Baseline Hillside Ordinance's limits on size and grading, and to the fire code where the lot is in a Very High Fire Hazard Severity Zone, as much of Porter Ranch is.",
      "home-additions":
        "A primary suite on the ground floor, with its own bath and closet, or a bigger family room. If your HOA has architectural review, its approval comes first; we prepare the drawings for it, then for LADBS.",
      "adu-contractor":
        "On a sloped lot, the grade and the access decide where an ADU can go: attached to the house, or in the garage. We find the spot that works on the site visit and design around it.",
      "home-remodeling":
        "Kitchen remodels that open a closed-off kitchen to the family room, with an island and better light, plus bathroom remodels and whole-home updates.",
      "outdoor-living":
        "Outdoor kitchens and covered patios on a sloped yard, with footings engineered for the grade, gas, power and water run to them, and ignition-resistant materials in the fire zone.",
      "commercial-construction":
        "Office and retail suites built out for a new tenant: the layout, the systems and the finishes, designed, permitted through LADBS and built by one team.",
    },
  },

  faqs: [
    {
      question: "Do I need my HOA's approval for an addition in Porter Ranch?",
      answer:
        "If your tract's association has architectural review, usually yes, and before the city's permit. We prepare the drawings for both and adjust the design if the association asks for changes.",
    },
    {
      question: "What does building in a fire zone change?",
      answer:
        "Mainly the materials: a Class A roof, ember-resistant vents, ignition-resistant siding and decking, and tempered glass, under the fire-zone chapter of the California Building Code. We design them in from the start.",
    },
    {
      question: "Can I build a pergola or outdoor kitchen on a sloped yard?",
      answer:
        "Usually, yes. On a slope, footings and retaining may need engineering, and gas, power and water need permits. We design the structure with the lot.",
    },
    {
      question: "Do you remodel newer homes too?",
      answer:
        "Yes. Newer homes are often remodeled for layout rather than age: opening a kitchen to the family room, adding a primary suite, or finishing a space the builder left plain.",
    },
    {
      question: "Does a hillside lot limit how much I can build?",
      answer:
        "It can. Hillside properties in Los Angeles follow the Baseline Hillside Ordinance, which caps a house's floor area by the lot's size and slope and limits grading. We check what your lot allows first.",
    },
    {
      question: "What is brush clearance?",
      answer:
        "In the city's fire zones, the Fire Department requires dry brush to be cleared around buildings. It applies to the whole property, so we plan new structures and landscaping with it in mind.",
    },
    {
      question: "What does a project in Porter Ranch cost?",
      answer:
        "It depends on the size, the scope and the finishes you choose, so we price each project after seeing the property and talking it through with you. {{Get a free quote}}",
    },
  ],
};

export default porterRanch;
