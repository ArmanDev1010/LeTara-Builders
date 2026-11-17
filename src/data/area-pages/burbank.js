// Burbank (/design-build-contractor-burbank). Facts checked 11-11: its own
// city; building permits from the Community Development Department's
// Building & Safety Division, and a project may also be reviewed by Public
// Works, the Fire Department and Burbank Water and Power, which has its own
// ADU requirements (City of Burbank). State ADU law applies alongside the
// city's own rules. Fire zones toward the Verdugo Mountains, worded as "can".
const burbank = {
  slug: "burbank",
  description:
    "Design-build contractor in Burbank: new homes, additions, ADUs, remodels and outdoor living, permitted with the City of Burbank and built by one licensed team.",
  hero: "Design-build in Burbank: new homes, additions, ADUs, remodels and outdoor living, permitted with the City of Burbank and built by one licensed team.",

  // Shown in "What we build" (Area/AreaServices), so the area pages aren't
  // alike: the intro as its line, and one line per service (by its slug) on
  // that service's card. Short and search-minded, the area's name with the
  // service, no history (11-17: the user found the first ones too long).
  // Only checkable facts (see the top); additions on the ground floor.
  // Checked 11-17: downtown along San Fernando Boulevard, and Magnolia Park.
  local: {
    intro:
      "Burbank design-build contractor for new homes, additions, ADUs, remodels and outdoor living, permitted with the City of Burbank, not Los Angeles.",
    services: {
      "new-construction":
        "Custom homes in Burbank, from the flats to fire-zone lots below the Verdugo Mountains.",
      "home-additions":
        "Ground-floor additions that open a Burbank home onto its yard: a family room or a primary suite.",
      "adu-contractor":
        "Backyard ADUs in Burbank, with power and water planned with Burbank Water and Power.",
      "home-remodeling":
        "Kitchen, bath and whole-home remodeling in Burbank, drawn to the city's own code.",
      "outdoor-living":
        "Outdoor kitchens and patio covers in Burbank, with gas, power and water run to them.",
      "commercial-construction":
        "Build-outs for shops, offices and restaurants in downtown Burbank and Magnolia Park.",
    },
  },

  faqs: [
    {
      question: "Is Burbank's permit process different from Los Angeles'?",
      answer:
        "Yes. Burbank has its own Building & Safety Division and its own zoning code, so plans are drawn and reviewed to Burbank's rules, sometimes with Public Works, the Fire Department or BWP reviewing too. We handle all of it.",
    },
    {
      question: "Who provides power and water for an ADU in Burbank?",
      answer:
        "Burbank Water and Power. It has its own requirements for ADUs, so we plan the electrical and water service with BWP as part of the design.",
    },
    {
      question: "Do you build ADUs in Burbank?",
      answer:
        "Yes: detached and attached ADUs, junior ADUs and garage conversions. State ADU law applies in Burbank alongside the city's own rules.",
    },
    {
      question: "Can you add on to a Burbank home?",
      answer:
        "Where Burbank's zoning and the lot allow it, yes: a new wing at the back or side, a primary suite or a bump-out on the ground floor. Burbank's own zoning sets the setbacks and how much of the lot can be built on; we check them for your lot before design.",
    },
    {
      question: "Is my Burbank home in a fire zone?",
      answer:
        "Homes on the streets climbing toward the Verdugo Mountains can be. If yours is in a Very High Fire Hazard Severity Zone, the build uses ignition-resistant roofing, vents, siding and windows.",
    },
    {
      question: "Which city departments review a project in Burbank?",
      answer:
        "Building & Safety always; depending on the project, Public Works, the Fire Department and Burbank Water and Power as well. We coordinate every review.",
    },
    {
      question: "What does a project in Burbank cost?",
      answer:
        "It depends on the size, the scope and the finishes you choose, so we price each project after seeing the property and talking it through with you. {{Get a free quote}}",
    },
  ],
};

export default burbank;
