// Mission Hills (/design-build-contractor-mission-hills). Facts: part of the
// City of Los Angeles (LADBS, LADWP); grew up around Mission San Fernando
// Rey de España, founded in 1797; mostly single-family homes, many from the
// mid-century. ADU figures are the state law's.
const missionHills = {
  slug: "mission-hills",
  description:
    "Design-build contractor in Mission Hills, Los Angeles: new homes, additions, ADUs, remodels and outdoor living, permitted with LADBS and built by one licensed team.",
  hero: "New homes, additions, ADUs and remodels in Mission Hills, designed, permitted with the City of Los Angeles and built by one licensed team.",

  // Shown in "What we build" (Area/AreaServices), so the area pages aren't
  // alike: the intro as its line, and one line per service (by its slug) on
  // that service's card. Short and search-minded, the area's name with the
  // service, no history (11-17: the user found the first ones too long).
  // Only checkable facts (see the top); additions on the ground floor.
  local: {
    intro:
      "Mission Hills design-build contractor for mid-century homes: a new house, an addition, an ADU or a remodel, designed and built by one licensed team.",
    services: {
      "new-construction":
        "New homes in Mission Hills in place of a house past fixing, with the demolition in the same contract.",
      "home-additions":
        "Single-story additions at the back of Mission Hills homes: a bigger family room or a bedroom suite.",
      "adu-contractor":
        "Backyard ADUs and junior ADUs in Mission Hills, both allowed on the same lot under state law.",
      "home-remodeling":
        "Kitchen and bathroom remodels for mid-century Mission Hills homes, wiring and plumbing brought up to code.",
      "outdoor-living":
        "Pergolas and patio covers with lights and fans that make a Mission Hills yard usable all summer.",
      "commercial-construction":
        "Office, clinic and shop build-outs in Mission Hills, from bare space to finished, through LADBS.",
    },
  },

  faqs: [
    {
      question: "Can I build an ADU and a junior ADU on my lot?",
      answer:
        "On most single-family lots, state law allows one ADU and one junior ADU. A junior ADU is up to 500 square feet, inside the house; we look at which combination fits your lot on the site visit.",
    },
    {
      question: "Will a remodel mean updating old wiring or plumbing?",
      answer:
        "Often, at least where the work opens walls: new work has to meet today's code, and older systems may need updating for the new layout. We check them on the site visit, so the price includes what's needed.",
    },
    {
      question: "Who handles permits in Mission Hills?",
      answer:
        "The City of Los Angeles Department of Building and Safety (LADBS): Mission Hills is a neighborhood of the City of Los Angeles. We prepare the plans, submit them and handle the corrections and inspections.",
    },
    {
      question: "Do you build outdoor living spaces in Mission Hills?",
      answer:
        "Yes: pergolas, patio covers, outdoor kitchens, patios and fire features, designed with the house and permitted where they need it.",
    },
    {
      question: "Who provides power and water for a new ADU?",
      answer:
        "LADWP. A new ADU may need its own service or an upgraded panel; we plan it with LADWP as part of the design.",
    },
    {
      question: "Can a rear addition connect to the yard?",
      answer:
        "Yes. A rear addition can open onto the yard with wide doors, and a patio or pergola can be designed with it, so the room and the yard work together.",
    },
    {
      question: "What does a project in Mission Hills cost?",
      answer:
        "It depends on the size, the scope and the finishes you choose, so we price each project after seeing the property and talking it through with you. {{Get a free quote}}",
    },
  ],
};

export default missionHills;
