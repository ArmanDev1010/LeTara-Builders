// The quote form's last, optional step (components/Quote/EstimateForm,
// "Tell us more"): questions answered with a tap, by project, so Andranik
// knows the job before he calls (Andranik, 11-16: the lead goes in first, at
// the contact step, and these come after). Each question is `one` answer or
// `many`. The budget ranges are what the visitor has in mind, not prices of
// LeTara's. The API route (app/api/contact/details) accepts only these
// questions and options, by the same lists, so nothing else lands in the
// note. No icons here: the server reads this file too.

const TIMELINE = {
  id: "timeline",
  note: "Start",
  label: "When would you like to start?",
  one: ["As soon as possible", "In 1–3 months", "In 3–6 months", "In 6+ months", "Just exploring"],
};

const PLANS = {
  id: "plans",
  note: "Plans",
  label: "Do you have plans or drawings?",
  one: ["Not yet", "Ideas or sketches", "Architect's plans", "Approved plans"],
};

const OWNER = {
  id: "owner",
  note: "Property",
  label: "Is the property yours?",
  one: ["I own it", "I'm buying it", "I lease it", "Other"],
};

const LOT = {
  id: "lot",
  note: "Lot size",
  label: "Lot size, if you know it",
  one: ["Under 5,000 sq ft", "5,000–7,500 sq ft", "7,500–10,000 sq ft", "Over 10,000 sq ft", "Not sure"],
};

const budget = (...ranges) => ({ id: "budget", note: "Budget", label: "Budget in mind?", one: [...ranges, "Not sure yet"] });

// by the project picked in the first step (data/estimate.js' titles)
const BY_PROJECT = {
  "New Construction": [
    { id: "lotNow", note: "On the lot now", label: "What's on the lot now?", one: ["An empty lot", "A house to replace", "Rebuilding after a loss"] },
    budget("Under $500k", "$500k–$1M", "$1M–$2M", "Over $2M"),
    TIMELINE,
    LOT,
    PLANS,
    OWNER,
  ],
  "Home Addition": [
    { id: "rooms", note: "New space for", label: "What's the new space for?", many: ["Primary suite", "Bedroom", "Kitchen", "Family room", "Bathroom", "Other"] },
    budget("Under $100k", "$100k–$200k", "$200k–$400k", "Over $400k"),
    TIMELINE,
    LOT,
    PLANS,
    OWNER,
  ],
  ADU: [
    { id: "kind", note: "ADU type", label: "What kind of ADU?", one: ["Detached", "Attached", "Garage conversion", "Junior ADU", "Not sure"] },
    budget("Under $150k", "$150k–$250k", "$250k–$400k", "Over $400k"),
    TIMELINE,
    LOT,
    PLANS,
    OWNER,
  ],
  "Home Remodel": [
    { id: "rooms", note: "Rooms", label: "Which rooms?", many: ["Kitchen", "Bathrooms", "Whole house", "Living areas", "Other"] },
    budget("Under $50k", "$50k–$100k", "$100k–$250k", "Over $250k"),
    TIMELINE,
    PLANS,
    OWNER,
  ],
  "Outdoor Living": [
    { id: "list", note: "Wants", label: "What's on the list?", many: ["Pergola or patio cover", "Outdoor kitchen", "Patio or deck", "Fire feature", "Lighting"] },
    budget("Under $25k", "$25k–$50k", "$50k–$100k", "Over $100k"),
    TIMELINE,
    LOT,
    OWNER,
  ],
  Commercial: [
    { id: "business", note: "Business", label: "What kind of business?", one: ["Restaurant or café", "Retail", "Office", "Other"] },
    { id: "space", note: "Space size", label: "Size of the space", one: ["Under 1,500 sq ft", "1,500–3,000 sq ft", "3,000–5,000 sq ft", "Over 5,000 sq ft", "Not sure"] },
    budget("Under $100k", "$100k–$250k", "$250k–$500k", "Over $500k"),
    TIMELINE,
    PLANS,
    OWNER,
  ],
};
const ANY = [budget("Under $50k", "$50k–$150k", "$150k–$400k", "Over $400k"), TIMELINE, PLANS, OWNER];

export const detailQuestions = (project) => BY_PROJECT[project] ?? ANY;

// What the visitor can attach (photos of the property, plans, a sketch):
// photos are made smaller in the browser before they're sent (lib/shrinkImage),
// PDFs go as they are. Each file is sent on its own, under the host's 4.5 MB
// limit for a request.
export const ATTACH = {
  max: 8,
  maxBytes: 4 * 1024 * 1024,
  accept: "image/jpeg,image/png,image/heic,image/heif,image/webp,application/pdf",
};

// The answers as "Question: answer" lines, keeping only the questions and
// options this project has (anything else is dropped), each under its
// short `note` name. `answers` is
// { [id]: "option" | ["option", ...] }.
export function answerLines(project, answers = {}) {
  return detailQuestions(project)
    .map((q) => {
      const options = q.one ?? q.many;
      const given = [].concat(answers?.[q.id] ?? []).filter((a) => options.includes(a));
      const picked = q.one ? given.slice(0, 1) : options.filter((o) => given.includes(o));
      return picked.length ? `${q.note}: ${picked.join(", ")}` : null;
    })
    .filter(Boolean);
}
