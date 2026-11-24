import { ADDITION_PLANS } from "./plans";

// The home additions page, /home-additions-los-angeles, centered on
// additions on the ground floor (Andranik, 11-16; it used to lead with a
// second story): a new wing at the back or side, a bump-out. What its
// answers say about permits, zoning limits and property tax is the City of
// Los Angeles' or California's (Prop 13 reassesses new construction only).
// No prices or durations of LeTara's own until Andranik confirms them.
const homeAdditions = {
  slug: "home-additions",
  title: "Home Additions",
  metaTitle: "Home Additions Contractor in Los Angeles",
  serviceType: "Home additions",
  description:
    "Ground-floor additions in Los Angeles: rear and side wings, primary suites and bump-outs, designed, permitted and built by one licensed design-build team.",
  asset: "addition",
  assetLabel: "A one-story addition on the side of a one-story house",
  hero: "More room on one level: a new wing at the back or side of the house, a primary suite, a bigger kitchen or family room. We design the addition to look like it was always there, take it through permits and build it.",

  // the layers of the build, as numbered on the exploded drawing (`layer`:
  // its part in Hero/studio/assets.js; none for one the drawing can't show)
  layers: {
    heading: ["Your addition,", "layer by layer."],
    intro:
      "One contract covers every layer of it, from the footings to the last piece of trim. Point at a layer to see it in the drawing.",
    items: [
      {
        layer: "house",
        title: "Where it joins",
        text: "The existing house where the addition meets it: the wall opened into the new rooms, and the roof and walls tied in.",
      },
      {
        layer: "foundation",
        title: "Foundation",
        text: "New footings and a slab or raised floor, to the engineer's plans, set level with the floors of the house.",
      },
      {
        layer: "walls",
        title: "Walls & framing",
        text: "New walls framed, sheathed and insulated, and finished outside to match the house.",
      },
      {
        layer: "windows",
        title: "Windows & doors",
        text: "Windows sized for the new rooms and lined up with the house's own, and doors out to the yard if you want them.",
      },
      {
        layer: "roof",
        title: "Roof",
        text: "A new roof over the addition, flashed into the old one where they meet, with gutters and drainage.",
      },
      {
        layer: "inside",
        title: "Inside",
        text: "Wiring, plumbing, heating and cooling carried over from the house, then floors, walls and trim.",
      },
    ],
  },

  types: {
    label: "Ways to add on",
    heading: ["Back, side,", "or just a few feet?"],
    intro: "Where the house can grow depends on the yard you want to keep, the lot's setbacks and what your zone allows.",
    items: [
      {
        title: "Rear addition",
        text: "A new wing at the back of the house, opening onto the yard: a family room, a bigger kitchen or a primary suite.",
        plan: ADDITION_PLANS.rear,
        facts: [
          { label: "Footprint", value: "Grows into the yard" },
          { label: "Street view", value: "Unchanged" },
          { label: "Structure", value: "New foundation" },
        ],
      },
      {
        title: "Side addition",
        text: "A wing on the side of the house where the lot is wide enough: bedrooms or a bigger living area on the same level.",
        plan: ADDITION_PLANS.side,
        facts: [
          { label: "Footprint", value: "Grows to the side" },
          { label: "Setbacks", value: "Side yard checked" },
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
    intro: "How an addition goes with us, from the first call to the new room.",
    steps: [
      "Tell us what the house is missing, a bedroom, a bigger kitchen or a family room, and pick a time for a free phone consultation.",
      "We measure the house and the lot, look at where the addition ties in and check what your zone lets you add, before anything is drawn.",
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
        "It depends on the size, the foundation, how the new roof ties into the old one, the work where the addition joins the house, and the finishes. We price your addition after seeing the house. {{Get a free quote}}",
    },
    {
      question: "Can we live in the house during an addition?",
      answer:
        "Often, yes. With a ground-floor addition most of the work stays outside the existing rooms until the two are joined. We talk it through when we see the house.",
    },
    {
      question: "Do I need a permit for a home addition?",
      answer:
        "Yes. Every addition needs a building permit, with plans and structural engineering. We prepare them and take them through the city's plan check as part of the job.",
    },
    {
      question: "How far can my house grow on the lot?",
      answer:
        "Your lot's setbacks, how much of it buildings may cover and your zone's cap on floor area decide how far an addition can go at the back or side; easements and utility lines can too. We check them first, before anything is drawn.",
    },
    {
      question: "Will the addition match the rest of my house?",
      answer:
        "That's what the design is for: the roofline, windows, siding or stucco, floor levels and interior finishes are planned to match, so the addition reads as part of the house.",
    },
    {
      question: "Will an addition raise my property taxes?",
      answer:
        "Only by the value of the new space. The county assesses the addition and adds it to your home's current assessed value; the rest of the house isn't reassessed.",
    },
  ],

  related: [
    { slug: "new-construction", note: "If the house needs more than an addition can give, building new may be the better route." },
    { slug: "adu-contractor", note: "If the new space is for a parent, a grown child or a tenant, an ADU gives them their own front door." },
    { slug: "home-remodeling", note: "Opening up the house to meet the addition? The rooms around it can be remodeled at the same time." },
    { slug: "outdoor-living", note: "Adding on at the back? Plan the patio or deck the new rooms open onto at the same time." },
  ],

  quote: {
    heading: ["Ready to add", "more room?"],
    intro: "A few quick questions, about a minute, and you pick a time for a free phone consultation.",
  },
};

export default homeAdditions;
