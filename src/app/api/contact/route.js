import { NextResponse } from "next/server";
import { EMAIL_PATTERN, STREET_PATTERN, ZIP_PATTERN, isCaliforniaZip } from "@/lib/fields";
import { deliverToGhl, isGhlConfigured } from "@/lib/ghl";
import { createLeadRef } from "@/lib/leadRef";
import { DELIVER, buildLeadText, validSlot } from "@/lib/leads";
import { emailConfigured, sendOfficeEmail } from "@/lib/mail";

// The time the visitor opted in to texts, in the office's time zone. The lead
// carries it as the record of consent (see SmsConsent).
const consentTimestamp = () =>
  `${new Date().toLocaleString("en-US", {
    timeZone: "America/Los_Angeles",
    dateStyle: "medium",
    timeStyle: "short",
  })} PT`;

const leadEmail = (lead) =>
  sendOfficeEmail({
    subject: `Website request — ${lead.name}`,
    heading: "You've received a new request",
    text: buildLeadText(lead),
    replyTo: lead.mail,
  });

// The quote form's request, sent at its contact step (Andranik, 11-16: the
// lead goes in before the optional last step, so it's there even if the
// visitor stops). The reply is { success, booked, ref }: `booked` says
// whether the picked call time made it onto the calendar, which the form and
// the thank-you tell the visitor; `ref` lets the last step add its details
// and files to this lead (lib/leadRef, app/api/contact/details and files).
export async function POST(req) {
  const body = await req.json().catch(() => ({}));
  const { phone, smsConsent, lt_check } = body;
  // the answers as text of a sane length, whatever was sent; `name` and the
  // address are tidied once here, for the contact, the call and the note
  const text = (value, max) => String(value ?? "").replace(/\s+/g, " ").trim().slice(0, max);
  const name = text(body.name, 120);
  const mail = text(body.mail, 200);
  const street = text(body.street, 200);
  const city = text(body.city, 100);
  const zip = text(body.zip, 10);
  const service = text(body.service, 80);
  const slot = validSlot(body.slot);
  const smsConsentAt = smsConsent === true ? consentTimestamp() : null;

  // No CAPTCHA, so light spam checks instead: `lt_check` is a field people
  // never see. Only a bot fills it, and it's told the send worked so it
  // doesn't retry. And a request without a name, a usable phone number and
  // email, and the property's whole address is turned away (the form checks
  // all of them before it sends).
  if (lt_check) {
    return NextResponse.json({ success: true, booked: false, ref: null });
  }
  if (!name || String(phone ?? "").replace(/\D/g, "").length < 10 || !EMAIL_PATTERN.test(mail)) {
    return NextResponse.json({ error: "Name, phone and email are required" }, { status: 400 });
  }
  if (!STREET_PATTERN.test(street) || !city || !ZIP_PATTERN.test(zip) || !isCaliforniaZip(zip)) {
    return NextResponse.json({ error: "The property's full address is required" }, { status: 400 });
  }

  const address = `${street}, ${city}, CA ${zip}`;
  const lead = { name, phone, mail, street, city, zip, address, service, smsConsentAt, slot };
  const ref = (contactId) => createLeadRef({ contactId, name, phone, mail, service });

  if (!DELIVER) {
    console.log(`Quote request (not sent: DELIVER is off):\n${buildLeadText(lead)}`);
    return NextResponse.json({ success: true, booked: Boolean(slot), ref: ref(null) });
  }

  // GoHighLevel first: the contact, the opportunity, the call on the
  // calendar, the note. Email is the fallback when it isn't set up or fails,
  // and goes out as well when the note didn't make it in, so a lead is never
  // dropped.
  if (isGhlConfigured()) {
    try {
      const { contactId, booked, incomplete } = await deliverToGhl(lead);
      if (incomplete && emailConfigured()) {
        await leadEmail({ ...lead, booked }).catch((err) => console.error("Backup email failed:", err));
      }
      return NextResponse.json({ success: true, booked, ref: ref(contactId) });
    } catch (err) {
      console.error("GoHighLevel delivery failed:", err);
    }
  }

  try {
    await leadEmail(lead);
    return NextResponse.json({ success: true, booked: false, ref: ref(null) });
  } catch (err) {
    console.error("Email error:", err);
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }
}
