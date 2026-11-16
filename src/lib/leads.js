import { BUSINESS } from "@/data/business";
import { answerLines } from "@/data/projectDetails";
import { visitSentence } from "@/lib/visitTimes";

// Off while the site is being built: a request is checked as usual, then
// logged to the server's console instead of sent anywhere, and the visitor
// sees the thank-you (a picked time shows as booked). The calendar shows
// sample openings unless GoHighLevel is connected (app/api/availability).
// Turn it on, with GoHighLevel connected (lib/ghl.js), once leads should
// actually reach Andranik.
export const DELIVER = false;

// How far ahead a picked call time may be; anything outside it is treated as
// "call me to set a time".
const MAX_AHEAD_DAYS = 120;

const ISO_SLOT = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d+)?)?([+-]\d{2}:\d{2}|Z)$/;

// The call time the form sent, if it's a real, upcoming one; otherwise null.
export function validSlot(slot) {
  if (typeof slot !== "string" || !ISO_SLOT.test(slot)) return null;
  const ms = new Date(slot).getTime();
  const now = Date.now();
  return ms > now && ms < now + MAX_AHEAD_DAYS * 864e5 ? slot : null;
}

// "(818) 555-0123" -> "+18185550123"
export const e164 = (phone) => `+1${String(phone ?? "").replace(/\D/g, "").slice(-10)}`;

const collapse = (value) => String(value ?? "").replace(/\s+/g, " ").trim();

// What happened with the free phone consultation, in a line (11-16: Andranik
// calls first, then sets a site visit; the form used to book the visit).
// `booked` is true when it's on the calendar, false when booking it failed,
// and null when nothing tried to book it (delivery off, or the email
// fallback).
export function callStatus(slot, booked = null) {
  if (!slot) return "Asked us to call to set a time";
  const when = `${visitSentence(slot)} PT`;
  if (booked === true) return `Booked for ${when}`;
  if (booked === false) return `Picked ${when}, but it couldn't be booked on the calendar. Call to set a time.`;
  return `Picked ${when}. Not on the calendar yet: book it, or call to confirm.`;
}

// "Label: value", or null when there's nothing to show so the line is dropped.
const line = (label, value) => {
  const text = collapse(value);
  return text ? `${label}: ${text}` : null;
};

// The plain-text summary of a request: the note on the contact in
// GoHighLevel, and what's logged while delivery is off. The texts line is the
// record of whether this lead agreed to texts on the website, and when.
export function buildLeadText({ name, phone, mail, address, service, smsConsentAt, slot, booked = null }) {
  return [
    `New ${BUSINESS.name} website request`,
    line("Name", name),
    line("Phone", phone),
    smsConsentAt
      ? `Texts: OK, opted in on the website ${smsConsentAt}`
      : "Texts: not opted in on the website, ask before texting",
    line("Email", mail),
    line("Property", address),
    line("Project", service),
    `Phone consultation: ${callStatus(slot, booked)}`,
  ]
    .filter(Boolean)
    .join("\n");
}

// The second note, from the form's optional last step: the answers picked,
// the visitor's own words, and the files (links to them in GoHighLevel's
// media storage, or the names of any that couldn't be saved). Null when
// there's nothing in it.
export function buildDetailsText({ service, answers, message, files = [], failed = [] }) {
  const lines = answerLines(service, answers);
  const words = String(message ?? "").trim();
  if (!lines.length && !words && !files.length && !failed.length) return null;
  return [
    "More about the project (from the website form)",
    ...lines,
    words && `In their words: ${words}`,
    files.length && ["Files they attached:", ...files.map(({ name, url }) => `- ${name}: ${url}`)].join("\n"),
    failed.length && `Files that didn't come through (ask them to send these): ${failed.join(", ")}`,
  ]
    .filter(Boolean)
    .join("\n");
}
