// Mission Hills (/design-build-contractor-mission-hills). Facts: part of the
// City of Los Angeles (LADBS, LADWP); grew up around Mission San Fernando
// Rey de España, founded in 1797; mostly single-family homes, many from the
// mid-century. ADU figures are the state law's.
const missionHills = {
  slug: "mission-hills",
  description:
    "Design-build contractor in Mission Hills, Los Angeles: new homes, additions, ADUs, remodels and outdoor living, permitted with LADBS and built by one licensed team.",
  hero: "New homes, additions, ADUs and remodels in Mission Hills, designed, permitted with the City of Los Angeles and built by one licensed team.",
  services:
    "New homes, room to grow and updates for mid-century houses: every kind of project on one home. Point at one to find it in the drawing.",

  // Parked, not shown (11-12): the "Building in <area>" section was
  // scrapped until the user decides what goes after the quote form. Plain
  // local descriptions, checked: who permits a project here and the rules
  // that come up, then one per service (by its slug).
  local: {
    intro:
      "In Mission Hills, a City of Los Angeles neighborhood, LADBS issues the permits and LADWP supplies the power and water. The houses here are mostly single-family homes, many from the mid-century, on lots with room for an addition at the back, a backyard ADU or a junior ADU inside the house.",
    services: {
      "new-construction":
        "If an older house would take more to fix than to replace, we design a new home for the lot, take it through LADBS and build it, demolition included, under one contract.",
      "home-additions":
        "A single-story addition at the back of the house: a bigger family room or a bedroom suite opening onto the yard through wide doors, designed to match the house.",
      "adu-contractor":
        "Junior ADUs and backyard ADUs. A junior ADU turns part of the house into a small home of up to 500 square feet with its own entrance, and it can sit alongside a backyard ADU on the same lot.",
      "home-remodeling":
        "Kitchen and bathroom remodels for mid-century homes, with the wiring, plumbing and insulation brought up to today's code while the walls are open.",
      "outdoor-living":
        "Pergolas and solid patio covers tied into the house, with lights and fans overhead, that make a Mission Hills yard usable all summer.",
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
