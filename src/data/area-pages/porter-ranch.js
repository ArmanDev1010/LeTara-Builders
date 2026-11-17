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

  // Shown in "What we build" (Area/AreaServices), so the area pages aren't
  // alike: the intro as its line, and one line per service (by its slug) on
  // that service's card. Short and search-minded, the area's name with the
  // service, no history (11-17: the user found the first ones too long).
  // Only checkable facts (see the top); additions on the ground floor.
  local: {
    intro:
      "Design-build for Porter Ranch homes, hillside lots included: one licensed team takes your project through any HOA review, the permits and the build.",
    services: {
      "new-construction":
        "New custom homes on Porter Ranch hillside lots, designed within the city's hillside limits and the fire code.",
      "home-additions":
        "Ground-floor primary suites and family rooms for Porter Ranch homes, drawn for your HOA and for LADBS.",
      "adu-contractor":
        "ADUs on sloped Porter Ranch lots, attached, detached or in the garage, placed where the grade allows.",
      "home-remodeling":
        "Kitchens opened up to the family room, plus bath and whole-home remodeling in Porter Ranch.",
      "outdoor-living":
        "Outdoor kitchens and covered patios on sloped Porter Ranch yards, on footings engineered for the grade.",
      "commercial-construction":
        "Office and retail suite build-outs in Porter Ranch, designed, permitted and built by one team.",
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
