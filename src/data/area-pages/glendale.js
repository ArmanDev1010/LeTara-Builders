// Glendale (/design-build-contractor-glendale). Facts checked 11-11: its own
// city, between the Verdugo Mountains and the San Rafael Hills; building
// permits from its Community Development Department; second-story
// additions to single-family homes go through design review, decided by
// staff or by the Design Review Board, before building plan check (City of
// Glendale decision letters under Municipal Code Chapter 30.47); power and
// water from Glendale Water & Power. Fire zones worded as "can".
const glendale = {
  slug: "glendale",
  description:
    "Design-build contractor in Glendale: new homes, additions, ADUs, remodels and outdoor living, taken through Glendale's design review and permits by one licensed team.",
  hero: "New homes, additions, ADUs, remodels and outdoor living in Glendale, designed to the city's own rules and built by one licensed team.",

  // Shown in "What we build" (Area/AreaServices), so the area pages aren't
  // alike: the intro as its line, and one line per service (by its slug) on
  // that service's card. Short and search-minded, the area's name with the
  // service, no history (11-17: the user found the first ones too long).
  // Only checkable facts (see the top); additions on the ground floor.
  // Brand Boulevard is its main commercial street.
  local: {
    intro:
      "Glendale design-build contractor for homes on the flats and in the hills, with plans drawn for the city's design review and code, then built by one team.",
    services: {
      "new-construction":
        "Custom homes in Glendale, steep lots in the Verdugos and the San Rafael Hills included.",
      "home-additions":
        "Ground-floor additions for Glendale homes, drawn to the city's single-family design guidelines.",
      "adu-contractor":
        "Attached and detached ADUs in Glendale, with service planned with Glendale Water & Power.",
      "home-remodeling":
        "Kitchen, bath and whole-home remodeling in Glendale, permitted through the city's own building department.",
      "outdoor-living":
        "Pergolas and patio covers that make a Glendale yard usable most of the year.",
      "commercial-construction":
        "Tenant improvements for shops, offices and restaurants on Brand Boulevard and across Glendale.",
    },
  },

  faqs: [
    {
      question: "Does a home addition in Glendale need design review?",
      answer:
        "It can. Glendale reviews the design of some additions to single-family homes, second stories among them, by staff or by the Design Review Board, before building plan check. We check what yours needs, prepare the drawings and take them through.",
    },
    {
      question: "Who issues building permits in Glendale?",
      answer:
        "The City of Glendale, through its Community Development Department. Glendale isn't part of the City of Los Angeles, so its own codes and reviews apply.",
    },
    {
      question: "Who provides power and water in Glendale?",
      answer:
        "Glendale Water & Power (GWP). We plan any new service or panel upgrade with GWP as part of the project.",
    },
    {
      question: "Do you build ADUs in Glendale?",
      answer:
        "Yes. State ADU law applies in Glendale alongside the city's own standards; we design the ADU to both and handle the permits.",
    },
    {
      question: "Is my Glendale home in a fire zone?",
      answer:
        "Homes on the streets climbing into the Verdugos and the San Rafael Hills can be. If yours is in a Very High Fire Hazard Severity Zone, the build follows the fire-zone rules for materials.",
    },
    {
      question: "What happens if the design changes after review?",
      answer:
        "Changes to plans that Glendale's design review has approved may need to go back for approval. We settle the design before review, so changes later are rare.",
    },
    {
      question: "What does a project in Glendale cost?",
      answer:
        "It depends on the size, the scope and the finishes you choose, so we price each project after seeing the property and talking it through with you. {{Get a free quote}}",
    },
  ],
};

export default glendale;
