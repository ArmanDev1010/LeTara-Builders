import { TbHelp, TbHomeEdit, TbHomePlus, TbStairsUp, TbTrees } from "react-icons/tb";

// The step-by-step quote request (components/Quote/EstimateForm). Each
// project's `title` is also the value sent with the request, so the lead
// reads exactly what the visitor picked. The services of data/services.js;
// no "Design-Build" option, since every project is design-build.
export const PROJECT_OPTIONS = [
  { title: "ADU", hint: "a second home on your lot, attached or detached", icon: TbHomePlus },
  { title: "Home Addition", hint: "more room: a new wing or a second story", icon: TbStairsUp },
  { title: "Full Remodel", hint: "kitchen, baths or the whole house", icon: TbHomeEdit },
  { title: "Outdoor Living", hint: "pergolas, patios and outdoor kitchens", icon: TbTrees },
  { title: "Not Sure Yet", hint: "we'll help you work out what fits", icon: TbHelp },
];

// `label` names the step in its progress tile under the question, one short
// word so five tiles fit a phone; `optional` adds a light "(optional)" after
// the question. The visit step books the site visit on Andranik's
// GoHighLevel calendar (components/Quote/VisitStep).
export const ESTIMATE_STEPS = [
  { id: "project", label: "What", question: "What are you planning?", options: PROJECT_OPTIONS },
  { id: "location", label: "Where", question: "Where's the property?" },
  { id: "visit", label: "When", question: "When can we come see it?" },
  { id: "contact", label: "Who", question: "How can we reach you?" },
  { id: "details", label: "Notes", question: "Anything else we should know?", optional: true },
];

export const findProject = (title) => PROJECT_OPTIONS.find((option) => option.title === title) ?? null;
