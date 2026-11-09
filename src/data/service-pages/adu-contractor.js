import { ADU_PLANS } from "./plans";

// The ADU page, /adu-contractor-los-angeles. Every rule here is California's
// or the City of Los Angeles' (the state's ADU law, Gov. Code 66314 on, and
// LA's ADU ordinance); no prices, durations or numbers of LeTara's own until
// Andranik confirms them. Garage conversions stay on this page: LeTara has no
// page of its own for them (HB Links does).
const aduContractor = {
  slug: "adu-contractor",
  title: "ADU Contractor",
  metaTitle: "ADU Contractor in Los Angeles, CA",
  serviceType: "Accessory dwelling unit construction",
  description:
    "Detached, attached and junior ADUs in Los Angeles, designed, permitted and built by one licensed design-build team. Free on-site quote.",
  asset: "adu",
  assetLabel: "A modern backyard ADU",
  hero: "A second home on your lot: detached, attached, or made from the garage or a part of the house you already have. We find what your lot allows, design it, take it through permits and build it, as one team.",

  // the layers of the build, as numbered on the exploded drawing (`layer`:
  // its part in Hero/studio/assets.js)
  layers: {
    heading: ["Your ADU,", "layer by layer."],
    intro:
      "One contract covers every layer of it, from the ground it stands on to the last fixture. Point at a layer to see it in the drawing.",
    items: [
      {
        layer: "site",
        title: "Site & utilities",
        text: "The lot surveyed and the pad graded, with water, sewer, gas and power run out to the unit, and a bigger electrical panel if the house needs one.",
      },
      {
        layer: "foundation",
        title: "Foundation",
        text: "A concrete slab or a raised foundation, engineered for your soil and set inside the setbacks.",
      },
      {
        layer: "walls",
        title: "Framing & walls",
        text: "Wood framing, sheathing and insulation, then stucco or siding chosen to sit well beside the main house.",
      },
      {
        layer: "windows",
        title: "Windows & doors",
        text: "Energy-code windows and doors, placed for light and for privacy from the main house.",
      },
      {
        layer: "roof",
        title: "Roof",
        text: "Roof framing, roofing and gutters, and solar panels where the energy code calls for them.",
      },
      {
        layer: "interior",
        title: "Kitchen, bath & finishes",
        text: "Cabinets, counters, a full bathroom, floors and fixtures, then the final inspection and the keys.",
      },
    ],
  },

  process: {
    heading: ["Five steps,", "every ADU."],
    intro: "How an ADU goes with us, from the first call to move-in day.",
    steps: [
      "Tell us about the lot and who the ADU is for, and pick a time for us to come and see it.",
      "We walk the property, measure it and check it against the ADU rules, so you know what fits before paying for plans.",
      "We draw the unit, refine it with you, and take the plans through engineering and the city's plan check.",
      "A clear price for the ADU as designed, with the utilities and site work in it, before construction starts.",
      "Foundation to finishes, built in order, and walked with you at the final inspection.",
    ],
  },

  types: {
    label: "ADU types",
    heading: ["Which ADU", "fits your lot?"],
    intro:
      "Most single-family lots in Los Angeles can take an ADU. Which kind comes down to the room you have, what's already standing and how the space will be used.",
    items: [
      {
        title: "Detached ADU",
        text: "A small house of its own in the backyard, on its own foundation. The most privacy, and the most freedom in the layout.",
        plan: ADU_PLANS.detached,
        facts: [
          { label: "Size", value: "Up to 1,200 sq ft" },
          { label: "Where", value: "Freestanding, new" },
          { label: "Kitchen", value: "Full" },
        ],
      },
      {
        title: "Attached ADU",
        text: "Built onto the side or back of the house, with its own entrance, kitchen and bathroom. Its size is tied to the main home's.",
        plan: ADU_PLANS.attached,
        facts: [
          { label: "Size", value: "Tied to the house" },
          { label: "Where", value: "Shares a wall" },
          { label: "Kitchen", value: "Full" },
        ],
      },
      {
        title: "Garage conversion",
        text: "The garage you already have, made into a legal home. The walls, roof and slab are there, and the parking it gives up doesn't have to be replaced.",
        plan: ADU_PLANS.garage,
        facts: [
          { label: "Size", value: "The garage's footprint" },
          { label: "Where", value: "Existing garage" },
          { label: "Kitchen", value: "Full" },
        ],
      },
      {
        title: "Junior ADU",
        text: "A space inside the house with its own entrance and a small kitchen. It can share a bathroom with the main home, and the owner lives on the property.",
        plan: ADU_PLANS.junior,
        facts: [
          { label: "Size", value: "Up to 500 sq ft" },
          { label: "Where", value: "Inside the house" },
          { label: "Kitchen", value: "Efficiency" },
        ],
      },
    ],
  },

  areas: {
    heading: ["ADUs across", "Los Angeles."],
    intro:
      "We build ADUs throughout Los Angeles and the Valley. Pick a city to see it on the map, and if yours isn't listed, ask: we may still build there.",
  },

  faqHeading: ["ADU questions,", "answered."],
  faqIntro: "What homeowners ask most before building an ADU. Don't see yours? Ask us directly.",
  faqs: [
    {
      question: "How much does an ADU cost in Los Angeles?",
      answer:
        "It depends on the kind of ADU, its size, the lot and the finishes. A garage conversion or a junior ADU usually costs the least, since the structure is already there; a detached ADU costs the most, with a new foundation and utilities run across the yard. We price your ADU after seeing the lot, not per square foot over the phone. {{Get a free quote}}",
    },
    {
      question: "How long does it take to build an ADU?",
      answer:
        "It depends on the type and on the city's review. Design and plan check come first, and the state gives the city 60 days to act on a complete application. Construction follows, shortest for a junior ADU or a conversion and longest for a detached unit. We go through the schedule for your project with you before work starts.",
    },
    {
      question: "Do I need a permit to build an ADU?",
      answer:
        "Yes. Every ADU needs a building permit, a garage conversion included. We prepare the plans, file them with the city (LADBS inside the City of Los Angeles) and answer the plan checker's corrections as part of the job.",
    },
    {
      question: "Can I have an ADU and a junior ADU on the same lot?",
      answer:
        "On most single-family lots, yes: state law allows one ADU and one junior ADU together. Whether both fit depends on the lot and the house, which we check on the site visit.",
    },
    {
      question: "Can I rent out my ADU?",
      answer:
        "Yes. An ADU can be rented, and you don't have to live on the property. A junior ADU needs the owner living in the house or the JADU. Cities can require rentals to run longer than 30 days, so plan on longer-term tenants.",
    },
    {
      question: "Will an ADU raise my property taxes?",
      answer:
        "Only by the value the ADU adds. The county assesses the new unit and adds it to your home's current assessed value; the house itself isn't reassessed.",
    },
  ],

  related: [
    { slug: "home-additions", note: "Not sure whether to build an ADU or add on to the house? We'll look at both on the same visit." },
    { slug: "outdoor-living", note: "Finish the yard around the new unit with a patio or pergola while the crew is already there." },
    { slug: "home-remodeling", note: "Updating the main house too? It can be remodeled while the ADU goes up." },
  ],

  quote: {
    heading: ["Ready to plan", "your ADU?"],
    intro: "A few quick questions, about a minute, and you pick a time for us to come see the lot.",
  },
};

export default aduContractor;
