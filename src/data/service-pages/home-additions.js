import { ADDITION_PLANS } from "./plans";

// The home additions page, /home-additions-los-angeles. What its answers
// say about permits, zoning limits and property tax is the City of Los
// Angeles' or California's (Prop 13 reassesses new construction only). No
// prices or durations of LeTara's own until Andranik confirms them.
const homeAdditions = {
  slug: "home-additions",
  title: "Home Additions",
  metaTitle: "Home Additions Contractor in Los Angeles",
  serviceType: "Home additions",
  description:
    "Second stories, room additions and bump-outs in Los Angeles, designed, permitted and built by one licensed design-build team. Free on-site quote.",
  asset: "addition",
  assetLabel: "A second-story addition on a one-story house",
  hero: "More room without moving: a second story, a new wing, or a bigger kitchen or bedroom. We design the addition to look like it was always there, take it through permits and build it.",

  // the layers of the build, as numbered on the exploded drawing (`layer`:
  // its part in Hero/studio/assets.js; none for one the drawing can't show)
  layers: {
    heading: ["Your addition,", "layer by layer."],
    intro:
      "One contract covers every layer of it, from the house it stands on to the last piece of trim. Point at a layer to see it in the drawing.",
    items: [
      {
        layer: "house",
        title: "The house below",
        text: "An engineer checks the existing foundation and walls, and we reinforce whatever the new floor needs.",
      },
      {
        layer: "floor",
        title: "New floor",
        text: "Floor framing tied into the existing walls, sheathed and leveled for the rooms above.",
      },
      {
        layer: "walls",
        title: "Walls & framing",
        text: "New walls framed, sheathed and insulated, and finished outside to match the house.",
      },
      {
        layer: "windows",
        title: "Windows",
        text: "Windows sized for the new rooms and lined up with the house's own.",
      },
      {
        layer: "roof",
        title: "Roof",
        text: "A new roof over the addition, flashed into the old one where they meet, with gutters and drainage.",
      },
      {
        layer: "inside",
        title: "Inside",
        text: "Stairs, wiring, plumbing, heating and cooling carried up, then floors, walls and trim.",
      },
    ],
  },

  types: {
    label: "Ways to add on",
    heading: ["Up, out,", "or a little of both?"],
    intro: "Which way to grow depends on the yard you want to keep, what your zone allows and what the house can carry.",
    items: [
      {
        title: "Second story",
        text: "A new floor on top of the house: room for bedrooms and a bathroom without giving up any of the yard.",
        plan: ADDITION_PLANS.second,
        facts: [
          { label: "Footprint", value: "Stays the same" },
          { label: "Yard", value: "Kept" },
          { label: "Structure", value: "House below checked" },
        ],
      },
      {
        title: "Ground-floor addition",
        text: "A new wing at the back or side of the house, for a bigger kitchen, a family room or a primary suite on one level.",
        plan: ADDITION_PLANS.ground,
        facts: [
          { label: "Footprint", value: "Grows" },
          { label: "Yard", value: "Some of it" },
          { label: "Structure", value: "New foundation" },
        ],
      },
      {
        title: "Bump-out",
        text: "A smaller extension of a single room, often a kitchen, a dining area or a bathroom, for the few feet that make the room work.",
        plan: ADDITION_PLANS.bumpout,
        facts: [
          { label: "Footprint", value: "Grows a little" },
          { label: "Yard", value: "Barely touched" },
          { label: "Structure", value: "Small new foundation" },
        ],
      },
    ],
  },

  process: {
    heading: ["Five steps,", "every addition."],
    intro: "How an addition goes with us, up or out, from the first call to the new room.",
    steps: [
      "Tell us what the house is missing, a bedroom, a bigger kitchen or a second floor, and pick a time for us to see it.",
      "We measure the house, look at its structure and check what your zone lets you add, before anything is drawn.",
      "We design the addition to match the house, refine it with you, and take it through engineering and plan check.",
      "A clear price for the addition as designed, including the work where it joins the existing house.",
      "We build it, tie it in, keep you posted as it goes, and walk it with you at the final inspection.",
    ],
  },

  areas: {
    heading: ["Additions across", "Los Angeles."],
    intro:
      "We build additions throughout Los Angeles and the Valley. Pick a city to see it on the map, and if yours isn't listed, ask: we may still build there.",
  },

  faqHeading: ["Addition questions,", "answered."],
  faqIntro: "What homeowners ask most before adding on. Don't see yours? Ask us directly.",
  faqs: [
    {
      question: "How much does a home addition cost in Los Angeles?",
      answer:
        "It depends on the size, whether it goes up or out, what the existing structure needs and the finishes. A second story usually costs more than the same room on the ground, because of the engineering and the work on the house below it. We price your addition after seeing the house. {{Get a free quote}}",
    },
    {
      question: "Can we live in the house during an addition?",
      answer:
        "Often, yes, especially with a ground-floor addition, where most of the work stays outside the existing rooms until the two are joined. A second story is more disruptive, and some families move out for part of it. We talk it through on the site visit.",
    },
    {
      question: "Do I need a permit for a home addition?",
      answer:
        "Yes. Every addition needs a building permit, with plans and structural engineering. We prepare them and take them through the city's plan check as part of the job.",
    },
    {
      question: "Should I add a second story or build out?",
      answer:
        "Building up keeps your yard and often suits a smaller lot; building out avoids work on the existing roof and structure and keeps everything on one level. Your lot's setbacks, height limit and floor-area cap often decide it, and we check those first.",
    },
    {
      question: "Will the addition match the rest of my house?",
      answer:
        "That's what the design is for: the roofline, windows, siding or stucco and interior finishes are planned to match, so the addition reads as part of the house.",
    },
    {
      question: "Will an addition raise my property taxes?",
      answer:
        "Only by the value of the new space. The county assesses the addition and adds it to your home's current assessed value; the rest of the house isn't reassessed.",
    },
  ],

  related: [
    { slug: "adu-contractor", note: "If the new space is for a parent, a grown child or a tenant, an ADU gives them their own front door." },
    { slug: "home-remodeling", note: "Opening up the house to meet the addition? The rooms around it can be remodeled at the same time." },
    { slug: "outdoor-living", note: "Adding on at the back? Plan the patio or deck the new rooms open onto at the same time." },
  ],

  quote: {
    heading: ["Ready to add", "more room?"],
    intro: "A few quick questions, about a minute, and you pick a time for us to come see the house.",
  },
};

export default homeAdditions;
