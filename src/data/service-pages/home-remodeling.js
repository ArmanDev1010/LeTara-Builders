import { REMODEL_PLANS } from "./plans";

// The remodeling page, /home-remodeling-los-angeles: kitchens, bathrooms and
// whole houses on one page (LeTara's "Full Remodels"; HB Links splits
// kitchens and baths out). What its answers say about permits is the
// building code's (finish work needs none; walls, plumbing, wiring and gas
// do). No claims about LeTara's certifications, prices or durations until
// Andranik confirms them.
const homeRemodeling = {
  slug: "home-remodeling",
  title: "Home Remodeling",
  metaTitle: "Home Remodeling Contractor in Los Angeles",
  serviceType: "Home remodeling",
  description:
    "Kitchen, bathroom and whole-house remodels in Los Angeles, designed, permitted and built by one licensed design-build team. Free on-site quote.",
  asset: "remodel",
  assetLabel: "A remodeled kitchen with an island and pendant lights",
  hero: "Kitchens, bathrooms or the whole house: walls moved, layouts reworked and every finish chosen with you. One team designs the remodel, handles the permits and builds it.",

  // the layers of the build, as numbered on the exploded drawing (`layer`:
  // its part in Hero/studio/assets.js; none for one the drawing can't show)
  layers: {
    heading: ["Your remodel,", "layer by layer."],
    intro:
      "One contract covers every layer of it, from the floor up to the lights. Point at a layer to see it in the drawing.",
    items: [
      {
        layer: "floors",
        title: "Floors",
        text: "Tile, wood or vinyl, laid over a flat, solid subfloor.",
      },
      {
        layer: "walls",
        title: "Walls & structure",
        text: "Walls opened up or moved, with a beam sized by an engineer wherever a wall carries weight, then new drywall.",
      },
      {
        title: "Plumbing & wiring",
        text: "Sinks, appliances, outlets and switches moved for the new layout, to today's code.",
      },
      {
        layer: "cabinets",
        title: "Cabinetry",
        text: "Base, upper and tall cabinets, and an island where the room allows one.",
      },
      {
        layer: "counters",
        title: "Counters & tile",
        text: "Countertops, backsplashes and shower walls, templated and installed.",
      },
      {
        layer: "lighting",
        title: "Lighting",
        text: "Recessed, pendant and under-cabinet lighting, with the energy code's efficient fixtures.",
      },
    ],
  },

  types: {
    label: "Remodel types",
    heading: ["Which rooms", "come first?"],
    intro: "Some remodels stay in one room; others rethink how the whole house works. We plan for both.",
    items: [
      {
        title: "Kitchen",
        text: "New cabinets, counters and appliances, or a new layout with walls opened up, an island added and plumbing moved.",
        plan: REMODEL_PLANS.kitchen,
        facts: [
          { label: "Scope", value: "Cabinets to a new layout" },
          { label: "Permit", value: "When plumbing, wiring or walls move" },
          { label: "Pairs with", value: "Dining and living rooms" },
        ],
      },
      {
        title: "Bathroom",
        text: "From new tile and fixtures to a reworked layout: a walk-in shower, a double vanity or a bigger primary bath.",
        plan: REMODEL_PLANS.bathroom,
        facts: [
          { label: "Scope", value: "Fixtures to a new layout" },
          { label: "Permit", value: "When plumbing or wiring moves" },
          { label: "Pairs with", value: "Closets and bedrooms" },
        ],
      },
      {
        title: "Whole house",
        text: "Several rooms or the whole floor plan reworked at once: walls moved, rooms combined, systems updated throughout.",
        plan: REMODEL_PLANS.whole,
        facts: [
          { label: "Scope", value: "Floor plan and systems" },
          { label: "Permit", value: "Almost always" },
          { label: "Pairs with", value: "An addition" },
        ],
      },
    ],
  },

  process: {
    heading: ["Five steps,", "every remodel."],
    intro: "How a remodel goes with us, one room or the whole house, from the first call to the reveal.",
    steps: [
      "Tell us which rooms you want to change and what isn't working in them, and pick a time for us to come by.",
      "We look at the rooms, the structure behind them and the plumbing and wiring, and talk through what you'd like.",
      "We draw the new layout, choose finishes and fixtures with you, and get permits where the work needs them.",
      "A clear price for the remodel as designed and selected, before any demolition starts.",
      "We build it room by room, keep the rest of the house livable where we can, and walk it with you at the end.",
    ],
  },

  areas: {
    heading: ["Remodels across", "Los Angeles."],
    intro:
      "We remodel homes throughout Los Angeles and the Valley. Pick a city to see it on the map, and if yours isn't listed, ask: we may still work there.",
  },

  faqHeading: ["Remodel questions,", "answered."],
  faqIntro: "What homeowners ask most before a remodel. Don't see yours? Ask us directly.",
  faqs: [
    {
      question: "How much does a home remodel cost in Los Angeles?",
      answer:
        "It depends on the rooms, how much the layout changes, what's behind the walls and the finishes you choose. Keeping plumbing and walls where they are costs less than moving them. We price your remodel after seeing the house and talking through your plans. {{Get a free quote}}",
    },
    {
      question: "Do I need a permit to remodel a kitchen or bathroom?",
      answer:
        "Not for finish work alone, like new cabinets, counters, tile or paint. You do once plumbing, wiring, gas lines or walls are moved or added. We tell you which parts of your plans need one, and get it.",
    },
    {
      question: "Can you take out a wall to open up my kitchen?",
      answer:
        "Usually, yes. If the wall carries the floor or roof above, an engineer sizes a beam to take its place and the work goes through a permit. We look at the wall on the site visit.",
    },
    {
      question: "Can I stay in my house during the remodel?",
      answer:
        "For a kitchen or bathroom most people do, with a temporary setup while the room is out of use. A whole-house remodel may mean moving out for part of the work. We plan the order of the job around how you'll live.",
    },
    {
      question: "Do you help choose finishes and fixtures?",
      answer:
        "Yes. Selections are part of the design: cabinetry, counters, tile, fixtures and lighting are chosen with you and drawn into the plans before the work starts.",
    },
    {
      question: "What if you find problems behind the walls?",
      answer:
        "Older houses can hide old wiring, leaks or damaged framing. We look for the signs on the site visit, and if something turns up during the work, we show you what we found and talk through the options before going on.",
    },
  ],

  related: [
    { slug: "home-additions", note: "If the house needs more room, not just better rooms, an addition can be planned with the remodel." },
    { slug: "outdoor-living", note: "Opening the kitchen to the yard? A patio, pergola or outdoor kitchen can be planned with it." },
    { slug: "adu-contractor", note: "Converting the garage or building out back can add the room a remodel can't." },
  ],

  quote: {
    heading: ["Ready to remodel", "your home?"],
    intro: "A few quick questions, about a minute, and you pick a time for us to come see the house.",
  },
};

export default homeRemodeling;
