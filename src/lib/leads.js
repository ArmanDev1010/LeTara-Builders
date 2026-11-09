import { BUSINESS } from "@/data/business";
import { visitSentence } from "@/lib/visitTimes";

// Off while the site is being built: a request is checked as usual, then
// logged to the server's console instead of sent anywhere, and the visitor
// sees the thank-you (a picked time shows as booked). The visit calendar shows
// sample openings unless GoHighLevel is connected (app/api/availability).
// Turn it on, with GoHighLevel connected (lib/ghl.js), once leads should
// actually reach Andranik.
export const DELIVER = false;

// How far ahead a picked visit time may be; anything outside it is treated as
// "call me to set a time".
const MAX_AHEAD_DAYS = 120;

const ISO_SLOT = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d+)?)?([+-]\d{2}:\d{2}|Z)$/;

// The visit time the form sent, if it's a real, upcoming one; otherwise null.
export function validSlot(slot) {
  if (typeof slot !== "string" || !ISO_SLOT.test(slot)) return null;
  const ms = new Date(slot).getTime();
  const now = Date.now();
  return ms > now && ms < now + MAX_AHEAD_DAYS * 864e5 ? slot : null;
}

// "(818) 555-0123" -> "+18185550123"
export const e164 = (phone) => `+1${String(phone ?? "").replace(/\D/g, "").slice(-10)}`;

const collapse = (value) => String(value ?? "").replace(/\s+/g, " ").trim();

// What happened with the site visit, in a line. `booked` is true when it's on
// the calendar, false when booking it failed, and null when nothing tried to
// book it (delivery off, or the email fallback).
export function visitStatus(slot, booked = null) {
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
// GoHighLevel, and what's logged while delivery is off. Optional fields are
// left out entirely when blank. The texts line is the record of whether this
// lead agreed to texts on the website, and when.
export function buildLeadText({ name, phone, mail, address, service, message, smsConsentAt, slot, booked = null }) {
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
    `Site visit: ${visitStatus(slot, booked)}`,
    line("Details", message),
  ]
    .filter(Boolean)
    .join("\n");
}
