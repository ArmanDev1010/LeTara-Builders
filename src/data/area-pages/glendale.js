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
  services:
    "Every kind of project on one home, designed for Glendale's review and built to its code. Point at one to find it in the drawing.",

  // Parked, not shown (11-12): the "Building in <area>" section was
  // scrapped until the user decides what goes after the quote form. Plain
  // local descriptions, checked: who permits a project here and the rules
  // that come up, then one per service (by its slug).
  local: {
    intro:
      "Glendale is its own city, with its own building department, its own design review and its own utility, Glendale Water & Power. Lots run from the flats near downtown to steep streets in the Verdugos and the San Rafael Hills, and second-story additions go through design review before building plan check.",
    services: {
      "new-construction":
        "Custom homes drawn to Glendale's code and design guidelines. On streets climbing into the Verdugos or the San Rafael Hills, steep lots can need engineering and fire-zone construction, which we plan from the start.",
      "home-additions":
        "Second-story additions go through Glendale's design review, by staff or the Design Review Board, before building plan check. We design to the city's single-family guidelines and take the plans through both.",
      "adu-contractor":
        "Attached and detached ADUs. On a hillside lot, an ADU attached to the house can use the ground that's already level, with its own entrance, kitchen and bath, and its service planned with Glendale Water & Power.",
      "home-remodeling":
        "Kitchen, bath and whole-home remodels drawn to Glendale's code and permitted through its Community Development Department, not the City of Los Angeles.",
      "outdoor-living":
        "Pergolas and solid patio covers tied into the house that make the yard usable most of the year, built with ignition-resistant materials in a fire zone.",
    },
  },

  faqs: [
    {
      question: "Does a second-story addition in Glendale need design review?",
      answer:
        "Yes. Second-story additions to single-family homes go through the city's design review, decided by staff or by the Design Review Board depending on the project, before building plan check. We prepare the drawings and take them through.",
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
