import { NEW_PLANS } from "./plans";

// The new construction page, /new-construction-los-angeles: new homes from
// the ground up (added 11-10, first on Andranik's yard sign). A custom home,
// a knock-down rebuild, or a home rebuilt after a loss. What its answers say
// about permits and solar is the City of Los Angeles' or California's (the
// energy code asks most new homes for solar panels). No prices or durations
// of LeTara's own until Andranik confirms them.
const newConstruction = {
  slug: "new-construction",
  title: "New Construction",
  metaTitle: "New Home Construction in Los Angeles",
  serviceType: "New home construction",
  description:
    "New homes built from the ground up in Los Angeles: custom homes, knock-down rebuilds and rebuilds after a loss, by one licensed design-build team.",
  asset: "house",
  assetLabel: "A new two-story home",
  hero: "A new home from the ground up: on an empty lot, in place of the house you have, or rebuilt after a loss. We design it, take it through permits and build it, as one team.",

  // the layers of the build, as numbered on the exploded drawing (`layer`:
  // its part in Hero/studio/assets.js)
  layers: {
    heading: ["Your new home,", "layer by layer."],
    intro:
      "One contract covers every layer of it, from the ground it stands on to the last fixture. Point at a layer to see it in the drawing.",
    items: [
      {
        layer: "site",
        title: "Site & utilities",
        text: "The survey, the soils report, grading and drainage, with water, sewer, gas and power brought to the house.",
      },
      {
        layer: "foundation",
        title: "Foundation",
        text: "A slab or a raised foundation, engineered for the soil and the house above it.",
      },
      {
        layer: "walls",
        title: "Framing",
        text: "Both floors framed, sheathed and tied together, to the structure the engineer's plans call for.",
      },
      {
        layer: "windows",
        title: "Windows & doors",
        text: "Energy-code windows and doors, placed for light, views and privacy.",
      },
      {
        layer: "roof",
        title: "Roof",
        text: "Roof framing, roofing, gutters and drainage, and the solar panels the energy code calls for.",
      },
      {
        layer: "interior",
        title: "Inside & finishes",
        text: "Plumbing, wiring, heating and cooling, then kitchens, baths, floors and fixtures, through to the final inspection.",
      },
    ],
  },

  process: {
    heading: ["Five steps,", "every new home."],
    intro: "How a new home goes with us, from the first call to the keys.",
    steps: [
      "Tell us about the lot and the home you have in mind, and pick a time for us to come and see it.",
      "We walk the lot, look at its slope, access and utilities, and talk through what you want to build.",
      "We design the house with you, then take it through engineering, the energy code and the city's plan check.",
      "A clear price for the home as designed, site work and utilities included, before construction starts.",
      "From the foundation to the finishes, built in order, and walked with you at the final inspection.",
    ],
  },

  types: {
    label: "Ways to build new",
    heading: ["Which kind of", "new build?"],
    intro: "Every new home starts from somewhere different: an empty lot, a house that's coming down, or a loss to rebuild from.",
    items: [
      {
        title: "Custom home",
        text: "A new house designed around how you live, on an empty lot or one you've just bought.",
        plan: NEW_PLANS.custom,
        facts: [
          { label: "Starts with", value: "An empty lot" },
          { label: "Design", value: "From scratch" },
          { label: "Permits", value: "A new build" },
        ],
      },
      {
        title: "Knock-down rebuild",
        text: "The house you have taken down to the ground, and a new one built in its place, on a lot you already know.",
        plan: NEW_PLANS.rebuild,
        facts: [
          { label: "Starts with", value: "An existing house" },
          { label: "Design", value: "From scratch" },
          { label: "Permits", value: "Demolition and a new build" },
        ],
      },
      {
        title: "Rebuild after a loss",
        text: "A home rebuilt after a fire or other loss, as it was or redesigned, from the cleared lot up.",
        plan: NEW_PLANS.loss,
        facts: [
          { label: "Starts with", value: "A cleared lot" },
          { label: "Design", value: "As it was, or new" },
          { label: "Permits", value: "A rebuild" },
        ],
      },
    ],
  },

  areas: {
    heading: ["New homes across", "Los Angeles."],
    intro:
      "We build new homes throughout Los Angeles and the Valley. Pick a city to see it on the map, and if yours isn't listed, ask: we may still build there.",
  },

  faqHeading: ["New build questions,", "answered."],
  faqIntro: "What homeowners ask most before building new. Don't see yours? Ask us directly.",
  faqs: [
    {
      question: "How much does it cost to build a new home in Los Angeles?",
      answer:
        "It depends on the size of the house, the lot, the design and the finishes, and on what the site needs before building starts, from demolition to utilities. We price your home after seeing the lot and talking through the design. {{Get a free quote}}",
    },
    {
      question: "Do you handle the design and the permits?",
      answer:
        "Yes. As design-build, we design the house with you, take the plans through engineering and the city's plan check (LADBS inside the City of Los Angeles), and build it, as one team.",
    },
    {
      question: "Can you tear down my house and build a new one?",
      answer:
        "Yes. A knock-down rebuild takes the existing house down to the ground and builds a new one in its place, with the demolition and the new plans taken through the city together.",
    },
    {
      question: "Do you rebuild homes lost to a fire?",
      answer:
        "Yes. A home lost to a fire is rebuilt as new construction, as it was or redesigned, and we take it through the rebuild permits with you.",
    },
    {
      question: "Does a new home need solar panels?",
      answer:
        "Under California's energy code, most new homes do. We size the system with the design and include it in the plans.",
    },
    {
      question: "How long does it take to build a new home?",
      answer:
        "It depends on the size of the house, the design and the city's review. Design and plan check come first, then construction. We go through the schedule for your home with you before work starts.",
    },
  ],

  related: [
    { slug: "home-additions", note: "Not ready to start over? An addition can give the house you have the room it's missing." },
    { slug: "adu-contractor", note: "Building new? An ADU can go up on the same lot, designed with the main house." },
    { slug: "home-remodeling", note: "If the bones are good, a whole-house remodel may get you there without starting over." },
    { slug: "outdoor-living", note: "Finish the new home with its yard: a patio, pergola or outdoor kitchen designed with it." },
  ],

  quote: {
    heading: ["Ready to build", "something new?"],
    intro: "A few quick questions, about a minute, and you pick a time for us to come see the lot.",
  },
};

export default newConstruction;
