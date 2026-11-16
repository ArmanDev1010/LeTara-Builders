import { COMMERCIAL_PLANS } from "./plans";

// The commercial page, /commercial-construction-los-angeles (added 11-16, at
// Andranik's request). Build-outs, tenant improvements and renovations for
// businesses, the way LeTara describes its commercial work. What it says
// about rules can be checked: LADBS issues building permits inside the City
// of Los Angeles (other cities, and the county's unincorporated areas, have
// their own building departments); the county's Department of Public Health
// reviews the plans for a food facility before it's built, except in
// Pasadena, Long Beach and Vernon, which have their own health departments;
// California Building Code Chapter 11B sets accessibility for businesses
// open to the public, and an alteration can require upgrades to the path of
// travel. No prices, durations or claims about past commercial jobs.
const commercialConstruction = {
  slug: "commercial-construction",
  title: "Commercial Construction",
  metaTitle: "Commercial Contractor in Los Angeles County",
  serviceType: "Commercial construction",
  description:
    "Commercial build-outs, tenant improvements and renovations in Los Angeles County: offices, shops, restaurants and cafés, designed, permitted and built by one licensed team.",
  asset: "commercial",
  assetLabel: "A single-story commercial building with a storefront, an awning and a unit on the roof",
  hero: "Build-outs, tenant improvements and renovations for offices, shops, restaurants and cafés. We design the space around how your business runs, take it through permits and build it.",

  // the layers of the build, as numbered on the exploded drawing (`layer`:
  // its part in Hero/studio/assets.js; none for one the drawing can't show)
  layers: {
    heading: ["Your space,", "layer by layer."],
    intro:
      "One contract covers every layer of it, from the walk to the door to the counter inside. Point at a layer to see it in the drawing.",
    items: [
      {
        layer: "site",
        title: "Site & access",
        text: "The walk to the door and the accessible route from parking, planned to the rules for businesses open to the public.",
      },
      {
        layer: "foundation",
        title: "Slab & foundation",
        text: "Footings and a slab poured to the engineer's plans, or an existing floor opened and patched for new plumbing.",
      },
      {
        layer: "walls",
        title: "Walls & structure",
        text: "The building's walls, and new walls inside it framed, insulated and finished for the way the space will be used.",
      },
      {
        layer: "storefront",
        title: "Storefront",
        text: "The storefront glass and the entry door, the awning over them and the band for your sign.",
      },
      {
        layer: "roof",
        title: "Roof & mechanical",
        text: "The roof, and the heating and cooling units on it, sized and ducted for the new layout.",
      },
      {
        layer: "interior",
        title: "The build-out",
        text: "Counters, shelving, fixtures and finishes, laid out around how your customers and staff move.",
      },
      {
        title: "Wiring, plumbing & fire",
        text: "Power, lighting and data, restrooms, and any sprinkler or alarm work, reviewed and inspected with the rest.",
      },
    ],
  },

  types: {
    label: "What we build out",
    heading: ["A space for", "every kind of business."],
    intro: "What a build-out takes depends on the business: a kitchen, a sales floor or private offices each bring their own requirements.",
    items: [
      {
        title: "Tenant improvement",
        text: "An empty or outdated space in a shopping center or office building, made into yours: walls, ceilings, lighting, restrooms and finishes.",
        plan: COMMERCIAL_PLANS.tenant,
        facts: [
          { label: "The space", value: "A shell, or a past tenant's" },
          { label: "Approvals", value: "Landlord and city" },
          { label: "Access", value: "Route to it checked" },
        ],
      },
      {
        title: "Restaurant or café",
        text: "A kitchen, a dining room and the restrooms they need, laid out for the cooks, the servers and the guests.",
        plan: COMMERCIAL_PLANS.restaurant,
        facts: [
          { label: "Kitchen", value: "Hood and plumbing" },
          { label: "Health", value: "Plan check first" },
          { label: "Restrooms", value: "Set by occupancy" },
        ],
      },
      {
        title: "Office",
        text: "Private offices, open work areas, a reception and a conference room, with the power and data each one needs.",
        plan: COMMERCIAL_PLANS.office,
        facts: [
          { label: "Layout", value: "Offices, open or both" },
          { label: "Wiring", value: "Power and data" },
          { label: "Ceilings", value: "Lights and air" },
        ],
      },
      {
        title: "Retail",
        text: "A sales floor open for display, a storefront that draws people in, and a stockroom behind it.",
        plan: COMMERCIAL_PLANS.retail,
        facts: [
          { label: "Storefront", value: "Glass, door, sign" },
          { label: "Floor", value: "Open for display" },
          { label: "Back of house", value: "Stock and restroom" },
        ],
      },
    ],
  },

  process: {
    heading: ["Five steps,", "every build-out."],
    intro: "How a commercial project goes with us, from the first call to the day you open.",
    steps: [
      "Tell us about the space and the business, and pick a time for a free phone consultation.",
      "We walk the space with you, read what the lease asks of the work and check what the city will review, before anything is drawn.",
      "We design the layout around how the business runs, then take it through plan check, and the health department's for food.",
      "A clear price for the work as designed, so you can plan the opening.",
      "We build it, schedule the inspections, keep you posted, and walk it with you before you open.",
    ],
  },

  areas: {
    heading: ["Commercial work across", "Los Angeles County."],
    intro:
      "We build out spaces throughout Los Angeles County. Pick a city to see it on the map, and if yours isn't listed, ask: we may still work there.",
  },

  faqHeading: ["Commercial questions,", "answered."],
  faqIntro: "What business owners ask most before a build-out. Don't see yours? Ask us directly.",
  faqs: [
    {
      question: "How much does a commercial build-out cost in Los Angeles County?",
      answer:
        "It depends on the space you start with, what the business needs (a kitchen, restrooms, a new storefront), what the city requires and the finishes. We price it after seeing the space. {{Get a free quote}}",
    },
    {
      question: "Do I need a permit for a tenant improvement?",
      answer:
        "Almost always. New walls, electrical, plumbing and mechanical work need building permits, and a change in how the space is used can bring more review. Inside the City of Los Angeles they come from LADBS; other cities, and the county's unincorporated areas, have their own building departments. We prepare the plans and take them through.",
    },
    {
      question: "Does a restaurant or café need a health department review?",
      answer:
        "Yes. In Los Angeles County, the Department of Public Health reviews the plans for a food facility before it's built; Pasadena, Long Beach and Vernon have health departments of their own. We plan for that review in the design.",
    },
    {
      question: "Does the space have to be accessible?",
      answer:
        "Yes. California's accessibility rules for businesses open to the public (Chapter 11B of the California Building Code) apply to new work, and remodeling a space can also mean upgrading the way to it: the entrance, the restrooms and the route from parking. We plan for it in the design.",
    },
    {
      question: "Do you work with landlords and property managers?",
      answer:
        "Yes. Most build-outs happen in a leased space, so we work to what the lease asks of the work and coordinate access, approvals and insurance with the landlord or property manager.",
    },
    {
      question: "Can my business stay open during the work?",
      answer:
        "Sometimes, depending on the work and the space. We look at it together and plan the work in phases around your business where we can.",
    },
  ],

  related: [
    { slug: "new-construction", note: "Building new instead of building out? The same team designs and builds from the ground up." },
    { slug: "adu-contractor", note: "Own rental property? An ADU adds a unit to a lot with a house on it." },
    { slug: "home-remodeling", note: "The same team remodels homes: kitchens, baths and whole floor plans." },
    { slug: "outdoor-living", note: "Patios, pergolas and outdoor kitchens, designed to go with the building." },
  ],

  quote: {
    heading: ["Building out", "a space?"],
    intro: "A few quick questions, about a minute, and you pick a time for a free phone consultation.",
  },
};

export default commercialConstruction;
