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

  // Shown since 11-17 in "What we build" (Area/AreaServices), so the area
  // pages aren't alike (the user asked): the intro as its line, and one
  // line per service (by its slug) on that service's card. Plain local
  // descriptions, checked: who permits a project here and the rules that
  // come up. Additions are on the ground floor (Andranik, 11-16).
  // Checked 11-17: downtown along San Fernando Boulevard, and Magnolia Park.
  local: {
    intro:
      "Burbank is its own city: building permits come from its Building & Safety Division, and a project may also be reviewed by Public Works, the Fire Department and Burbank Water and Power, which has its own requirements for ADUs. Homes run from the flats around downtown to the streets below the Verdugo Mountains.",
    services: {
      "new-construction":
        "New homes drawn to Burbank's zoning and, on streets toward the Verdugo Mountains where a lot is in a fire zone, to the fire code: ignition-resistant roofing, vents and siding.",
      "home-additions":
        "Ground-floor additions that open a Burbank home onto its yard: a family room, a primary suite or a bigger kitchen, measured against the city's own setbacks before anything is drawn.",
      "adu-contractor":
        "Backyard ADUs designed to Burbank's rules and state ADU law, with power and water planned with Burbank Water and Power, which has its own ADU requirements.",
      "home-remodeling":
        "Kitchen, bath and whole-home remodels drawn to Burbank's code and reviewed by its Building & Safety Division, with Public Works or the Fire Department where the project needs them.",
      "outdoor-living":
        "Outdoor kitchens and patio covers, with gas, power and water run to them, permitted with the City of Burbank.",
      "commercial-construction":
        "Shop, office and restaurant build-outs, from downtown's San Fernando Boulevard to Magnolia Park, reviewed by Burbank's Building & Safety Division, with the Fire Department and Burbank Water and Power where the space needs them.",
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
