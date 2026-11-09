import { OUTDOOR_PLANS } from "./plans";

// The outdoor living page, /outdoor-living-los-angeles: pergolas and patio
// covers, outdoor kitchens, decks, patios and fire features. Its search
// title leads with "Outdoor Living", not "Pergolas", on purpose: ask before
// changing it. What
// its answers say about permits is the building code's (covers, raised or
// attached decks, gas, power and water) and the fire code's in the Very
// High Fire Hazard Severity Zones. No prices or durations until Andranik
// confirms them.
const outdoorLiving = {
  slug: "outdoor-living",
  title: "Outdoor Living",
  metaTitle: "Outdoor Living Contractor in Los Angeles",
  serviceType: "Outdoor living construction",
  description:
    "Pergolas, patio covers, outdoor kitchens, decks and patios in Los Angeles, designed, permitted and built by one licensed team. Free on-site quote.",
  asset: "outdoor",
  assetLabel: "A patio under a louvered pergola, with an outdoor kitchen and a fire pit",
  hero: "Pergolas, patio covers, outdoor kitchens, decks and patios: the yard made into rooms you'll use most of the year. Designed with the house, permitted and built by one team.",

  // the layers of the build, as numbered on the exploded drawing (`layer`:
  // its part in Hero/studio/assets.js; none for one the drawing can't show)
  layers: {
    heading: ["Your yard,", "layer by layer."],
    intro:
      "One contract covers every layer of it, from the ground under the patio to the lights overhead. Point at a layer to see it in the drawing.",
    items: [
      {
        layer: "hardscape",
        title: "Patio & hardscape",
        text: "The ground graded and drained, then concrete, pavers or stone for the patio, paths and steps.",
      },
      {
        layer: "frame",
        title: "Footings, posts & beams",
        text: "Concrete footings, posts and beams for the pergola or cover, anchored, and tied into the house where it attaches.",
      },
      {
        layer: "roof",
        title: "Louvers or roof",
        text: "Open slats, adjustable louvers or a solid roof, for as much shade as you want.",
      },
      {
        layer: "kitchen",
        title: "Outdoor kitchen",
        text: "Counters, a grill and storage, with gas, power and water run to it.",
      },
      {
        layer: "fire",
        title: "Fire feature",
        text: "A gas fire pit or fireplace on its own permitted gas line.",
      },
      {
        layer: "lighting",
        title: "Lighting & power",
        text: "String, step and overhead lighting, fans and outlets, on outdoor-rated circuits.",
      },
    ],
  },

  types: {
    label: "What we build outside",
    heading: ["Shade, fire", "and a place to cook."],
    intro: "Most yards end up with more than one of these. We design them together, so they work as one space.",
    items: [
      {
        title: "Pergolas & patio covers",
        text: "Shade over a patio or deck: an open pergola, a louvered roof, or a solid patio cover tied into the house.",
        plan: OUTDOOR_PLANS.pergola,
        facts: [
          { label: "Gives you", value: "Shade and a ceiling" },
          { label: "Permit", value: "Usually" },
          { label: "Pairs with", value: "Lights and fans" },
        ],
      },
      {
        title: "Outdoor kitchens",
        text: "A grill, counters and storage, with a sink, a refrigerator or a pizza oven if you want them.",
        plan: OUTDOOR_PLANS.kitchen,
        facts: [
          { label: "Gives you", value: "A place to cook" },
          { label: "Permit", value: "For gas, power and water" },
          { label: "Pairs with", value: "A covered patio" },
        ],
      },
      {
        title: "Decks & patios",
        text: "A raised deck off the house or a patio on the ground, in wood, composite, concrete, pavers or stone.",
        plan: OUTDOOR_PLANS.patio,
        facts: [
          { label: "Gives you", value: "A floor for the yard" },
          { label: "Permit", value: "For raised or attached decks" },
          { label: "Pairs with", value: "Steps and paths" },
        ],
      },
      {
        title: "Fire features",
        text: "A gas fire pit or an outdoor fireplace to gather around once the sun goes down.",
        plan: OUTDOOR_PLANS.fire,
        facts: [
          { label: "Gives you", value: "Warmth and light" },
          { label: "Permit", value: "For the gas line" },
          { label: "Pairs with", value: "Seating walls" },
        ],
      },
    ],
  },

  process: {
    heading: ["Five steps,", "every outdoor build."],
    intro: "How an outdoor project goes with us, from the first call to the first evening out.",
    steps: [
      "Tell us how you'd like to use the yard, and pick a time for us to come and see it.",
      "We walk the yard, note its sun, slope and access, and talk through where each space should go.",
      "We design the spaces, choose materials with you, and get permits for the structures and lines that need them.",
      "A clear price for the outdoor spaces as designed, structures, utilities and hardscape included.",
      "We build it, from the footings to the lighting, and walk it with you when it's ready to use.",
    ],
  },

  areas: {
    heading: ["Outdoor living", "across Los Angeles."],
    intro:
      "We build outdoor spaces throughout Los Angeles and the Valley. Pick a city to see it on the map, and if yours isn't listed, ask: we may still build there.",
  },

  faqHeading: ["Outdoor questions,", "answered."],
  faqIntro: "What homeowners ask most before building outside. Don't see yours? Ask us directly.",
  faqs: [
    {
      question: "How much does a pergola or outdoor kitchen cost in Los Angeles?",
      answer:
        "It depends on the size, the materials and the utilities involved: an outdoor kitchen with gas, power and water costs more than a pergola over an existing patio. We price your project after seeing the yard. {{Get a free quote}}",
    },
    {
      question: "Do I need a permit for a pergola or patio cover?",
      answer:
        "Usually, yes, especially when it's attached to the house or has a solid roof. We prepare the plans and handle the permit as part of the job.",
    },
    {
      question: "Can a patio cover be attached to my house?",
      answer:
        "Yes. An attached patio cover is tied into the house's framing, flashed against leaks, and designed around the roof's drainage.",
    },
    {
      question: "What's the difference between a pergola and a patio cover?",
      answer:
        "A pergola has an open or louvered roof that lets light through; a patio cover has a solid roof that keeps out the sun and the rain. Either can be attached to the house or stand on its own.",
    },
    {
      question: "Can an outdoor kitchen have a sink and a refrigerator?",
      answer:
        "Yes. With water, a drain and power run to it, an outdoor kitchen can have a sink, a refrigerator and lighting along with the grill.",
    },
    {
      question: "What materials can a deck or patio be built from?",
      answer:
        "Wood or composite for a deck, and concrete, pavers or natural stone for a patio. In a fire zone, the choice narrows to ignition-resistant materials. We go through the options with you during design.",
    },
  ],

  related: [
    { slug: "home-remodeling", note: "Opening the kitchen to the yard? A remodel and an outdoor kitchen can be planned as one." },
    { slug: "adu-contractor", note: "Building an ADU out back? We can design the yard around it." },
    { slug: "home-additions", note: "A new family room or kitchen addition can open straight onto the patio we build." },
  ],

  quote: {
    heading: ["Ready to use", "your yard?"],
    intro: "A few quick questions, about a minute, and you pick a time for us to come see the yard.",
  },
};

export default outdoorLiving;
