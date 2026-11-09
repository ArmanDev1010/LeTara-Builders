import { BUSINESS } from "@/data/business";

const { legalName, license } = BUSINESS;

// The homepage FAQ, shown and marked up as FAQPage (the structured data
// matches what's on the page). Every answer stays inside what's confirmed:
// no prices, timelines or guarantees until Andranik settles them.
export const FAQS = [
  {
    question: "What does design-build mean?",
    answer:
      "One company designs your project, takes it through permits and builds it, under a single contract. You have one team to talk to from the first site visit to the final walkthrough, and nothing gets lost between the drawings and the job site.",
  },
  {
    question: "Are you licensed and insured?",
    answer: license
      ? `Yes. ${legalName} is a licensed California contractor (CSLB #${license}) and is insured. You can look the license up on the Contractors State License Board's website.`
      : `Yes. ${legalName} is a licensed and insured California contractor.`,
  },
  {
    question: "Do you handle the permits?",
    answer:
      "Yes. As part of design-build we prepare the plans and take them through the city's plan check and permits, so you don't have to deal with the building department yourself.",
  },
  {
    question: "Can I build an ADU on my property?",
    answer:
      "California law allows an ADU on most single-family lots, but the lot's size, setbacks and utilities decide what fits. At the site visit we look at your property and tell you what's possible.",
  },
  {
    question: "How much will my project cost?",
    answer:
      "It depends on the size of the project, the site and the finishes you choose. After the site visit and design you get a clear quote for exactly what's been designed, before any work starts.",
  },
  {
    question: "How long does a project take?",
    answer:
      "It depends on the scope and on the city's plan check, which is often the longest wait. We walk you through the expected timeline when we quote, and keep you posted as the build goes.",
  },
  {
    question: "Which areas do you serve?",
    answer:
      "Across Los Angeles and the San Fernando Valley. If your city isn't in our list of service areas, ask: we may still build there.",
  },
  {
    question: "Do you build pergolas and outdoor living spaces?",
    answer:
      "Yes: pergolas, patios, outdoor kitchens and the rest of the backyard, designed to go with the house.",
  },
];
