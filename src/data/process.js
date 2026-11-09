import { TbFileDollar, TbHammer, TbMessageCircle, TbPencil, TbRulerMeasure } from "react-icons/tb";

// How a project goes, design-build style: the homepage's "How we work"
// section and the thank-you's step tracker (components/Quote/ThanksModal),
// so the two always tell the same story. No promised times or prices: none
// are settled with Andranik yet.
export const PROCESS = [
  {
    label: "Reach out",
    icon: TbMessageCircle,
    text: "Call or send a quote request. Tell us what you're planning, and pick a time for us to see the property.",
  },
  {
    label: "Site visit",
    icon: TbRulerMeasure,
    text: "We walk the property with you, measure it, and talk through what you want and what the lot allows.",
  },
  {
    label: "Design",
    icon: TbPencil,
    text: "We draw the plans around your space and budget, refine them with you, and take them through the city's permits.",
  },
  {
    label: "Your quote",
    icon: TbFileDollar,
    text: "A clear price for exactly what's been designed, so you know the number before any work starts.",
  },
  {
    label: "Build",
    icon: TbHammer,
    text: "One team builds it, keeps you posted as it goes, and walks it with you at the end.",
  },
];
