import { createHash, createHmac, timingSafeEqual } from "node:crypto";

// The quote form sends a request in two parts (Andranik, 11-16): the lead
// itself at the contact step, so it's in GoHighLevel even if the visitor
// stops there, then the optional details and files. The first reply carries
// this reference, and the second part must bring it back: it names the lead
// (the GoHighLevel contact, and who it is for the email fallback), is signed
// with a key only the server has, and lasts a day. So the details and files
// routes add to a lead only the form itself created, never to a contact
// someone names.

const LIFETIME_MS = 24 * 60 * 60 * 1000;

// The signing key, made from a server secret that's already there (the
// GoHighLevel token, or the email password); while nothing is set up (the
// site being built, DELIVER off), a fixed key, since nothing is delivered.
const key = () =>
  createHash("sha256")
    .update(`letara-lead-ref:${process.env.GHL_TOKEN || process.env.EMAIL_PASS || "not-delivering"}`)
    .digest();

const sign = (body) => createHmac("sha256", key()).update(body).digest("base64url");

// { contactId, name, phone, mail, service } -> "<body>.<signature>"
export function createLeadRef(lead) {
  const body = Buffer.from(JSON.stringify({ ...lead, at: Date.now() })).toString("base64url");
  return `${body}.${sign(body)}`;
}

// The lead a reference names, or null if it's forged, mangled or too old.
export function readLeadRef(ref) {
  if (typeof ref !== "string" || ref.length > 2000) return null;
  const [body, signature] = ref.split(".");
  if (!body || !signature) return null;
  const expected = Buffer.from(sign(body));
  const given = Buffer.from(signature);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
  try {
    const lead = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
    return Date.now() - lead.at < LIFETIME_MS ? lead : null;
  } catch {
    return null;
  }
}
