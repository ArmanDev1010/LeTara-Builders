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
  services:
    "Every kind of project on one home, drawn to the City of Burbank's code and planned with its utility. Point at one to find it in the drawing.",

  // Parked, not shown (11-12): the "Building in <area>" section was
  // scrapped until the user decides what goes after the quote form. Plain
  // local descriptions, checked: who permits a project here and the rules
  // that come up, then one per service (by its slug).
  local: {
    intro:
      "Burbank is its own city: building permits come from its Building & Safety Division, and a project may also be reviewed by Public Works, the Fire Department and Burbank Water and Power, which has its own requirements for ADUs. Homes run from the flats around downtown to the streets below the Verdugo Mountains.",
    services: {
      "new-construction":
        "New homes drawn to Burbank's zoning and, on streets toward the Verdugo Mountains where a lot is in a fire zone, to the fire code: ignition-resistant roofing, vents and siding.",
      "home-additions":
        "Second-story additions that keep the yard. Burbank's own zoning sets the height and setbacks; we check them for your lot, and the foundation, before design.",
      "adu-contractor":
        "Backyard ADUs designed to Burbank's rules and state ADU law, with power and water planned with Burbank Water and Power, which has its own ADU requirements.",
      "home-remodeling":
        "Kitchen, bath and whole-home remodels drawn to Burbank's code and reviewed by its Building & Safety Division, with Public Works or the Fire Department where the project needs them.",
      "outdoor-living":
        "Outdoor kitchens and patio covers, with gas, power and water run to them, permitted with the City of Burbank.",
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
      question: "Can you add a second story to a Burbank home?",
      answer:
        "Where Burbank's zoning and the existing structure allow it, yes. We check the height and setback rules for your lot and the foundation on the site visit.",
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
