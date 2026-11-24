import { TbBuildingStore, TbCrane, TbHelp, TbHomeEdit, TbHomePlus, TbStairsUp, TbTrees } from "react-icons/tb";

// The step-by-step quote request (components/Quote/EstimateForm). Each
// project's `title` is also the value sent with the request, so the lead
// reads exactly what the visitor picked. The services of data/services.js,
// in Andranik's order (his yard sign); no "Design-Build" option, since every
// project is design-build.
export const PROJECT_OPTIONS = [
  { title: "New Construction", hint: "a new home from the ground up, or a rebuild", icon: TbCrane },
  { title: "Home Addition", hint: "more room on one level: a new wing or a bigger room", icon: TbStairsUp },
  { title: "ADU", hint: "a second home on your lot, attached or detached", icon: TbHomePlus },
  { title: "Home Remodel", hint: "kitchen, baths or the whole house", icon: TbHomeEdit },
  { title: "Outdoor Living", hint: "pergolas, patios and outdoor kitchens", icon: TbTrees },
  { title: "Commercial", hint: "a build-out for an office, shop or restaurant", icon: TbBuildingStore },
  { title: "Not Sure Yet", hint: "we'll help you work out what fits", icon: TbHelp },
];

// `label` names the step in its progress tile under the question, one short
// word so five tiles fit a phone; `optional` adds a light "(optional)" after
// the question; `lede` is a line under it. The call step books the free
// phone consultation on Andranik's GoHighLevel calendar
// (components/Quote/VisitStep): he calls first, then sets a site visit
// (11-16; the form used to book the site visit). The contact step sends the
// request, so the lead is in before the optional last step (Andranik's
// request, 11-16), whose questions are in data/projectDetails.js.
export const ESTIMATE_STEPS = [
  { id: "project", label: "What", question: "What are you planning?", options: PROJECT_OPTIONS },
  { id: "location", label: "Where", question: "Where's the property?" },
  {
    id: "call",
    label: "When",
    question: "When can we call you?",
    lede: "A free phone consultation with our team. If your project's a fit, we set a free site visit after.",
  },
  { id: "contact", label: "Who", question: "How can we reach you?" },
  { id: "details", label: "More", question: "Tell us more", optional: true },
];

export const findProject = (title) => PROJECT_OPTIONS.find((option) => option.title === title) ?? null;
