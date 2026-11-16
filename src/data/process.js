import { TbHammer, TbMessageCircle, TbPencil, TbPhoneCall, TbRulerMeasure } from "react-icons/tb";

// How a project goes, design-build style: the homepage's "How we work"
// section and the thank-you's step tracker (components/Quote/ThanksModal),
// so the two always tell the same story. Andranik's way (11-16): a free phone
// consultation first, then, if the project's a fit, a free site visit; the
// design and the quote were two steps until then. No promised times or
// prices: none are settled with Andranik yet.
export const PROCESS = [
  {
    label: "Reach out",
    icon: TbMessageCircle,
    text: "Call or send a quote request. Tell us what you're planning, and pick a time for a free phone consultation.",
  },
  {
    label: "Phone call",
    icon: TbPhoneCall,
    text: "We talk through the project, the property and your budget. If it's a fit, we set a free site visit.",
  },
  {
    label: "Site visit",
    icon: TbRulerMeasure,
    text: "We walk the property with you, measure it, and talk through what you want and what the lot allows.",
  },
  {
    label: "Design & quote",
    icon: TbPencil,
    text: "We draw the plans around your space and budget, price exactly what's designed, and take them through the city's permits.",
  },
  {
    label: "Build",
    icon: TbHammer,
    text: "One team builds it, keeps you posted as it goes, and walks it with you at the end.",
  },
];
