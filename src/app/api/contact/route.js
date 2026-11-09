import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { BUSINESS } from "@/data/business";
import { EMAIL_PATTERN, STREET_PATTERN, ZIP_PATTERN, isCaliforniaZip } from "@/lib/fields";
import { DELIVER, buildLeadText, validSlot, visitStatus } from "@/lib/leads";
import { deliverToGhl, isGhlConfigured } from "@/lib/ghl";

// Server-side secrets: from .env.local locally and the host's Environment
// Variables in production. Never hardcode them here.
//
//   EMAIL_USER         Gmail account the fallback email is sent from
//   EMAIL_PASS         that account's Gmail app password
//   RECEIVER_EMAIL     where the fallback email is delivered (defaults to
//                      BUSINESS.email)
//
// GoHighLevel has its own (lib/ghl.js). Whether anything is sent at all is
// DELIVER, in lib/leads.js.

// Form values go into the notification email's HTML, so they're escaped:
// otherwise a visitor could inject markup or links into the email.
const escapeHtml = (value) =>
  String(value ?? "").replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        char
      ],
  );

// The time the visitor opted in to texts, in the office's time zone. The lead
// carries it as the record of consent (see SmsConsent).
const consentTimestamp = () =>
  `${new Date().toLocaleString("en-US", {
    timeZone: "America/Los_Angeles",
    dateStyle: "medium",
    timeStyle: "short",
  })} PT`;

const emailConfigured = () => Boolean(process.env.EMAIL_USER && process.env.EMAIL_PASS);

// The request as an email to the office. Throws if it couldn't be sent.
async function sendEmail(lead) {
  const { name, phone, mail, address, service, message, smsConsentAt, slot, booked } = lead;
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const row = (label, value) =>
    `<p style="margin: 12px 0;"><strong>${label}:</strong> ${escapeHtml(value)}</p>`;

  // Email is optional on the form, so only use it for reply-to / subject when
  // the visitor actually gave one.
  await transporter.sendMail({
    from: `"${BUSINESS.name} Website" <${process.env.EMAIL_USER}>`,
    ...(mail ? { replyTo: mail } : {}),
    to: process.env.RECEIVER_EMAIL || BUSINESS.email,
    subject: `Website request — ${mail || name || phone}`,
    html: `
  <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 32px; border-radius: 12px; max-width: 600px; margin: auto; color: #333;">
    <div style="text-align: center; margin-bottom: 24px;">
      <p style="margin: 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #666;">${escapeHtml(BUSINESS.name)} · Website Request</p>
      <h1 style="margin: 8px 0 16px; font-size: 28px; font-weight: 600; color: #222;">You've received a new request</h1>
    </div>

    <div style="background-color: #fff; padding: 24px; border-radius: 8px; box-shadow: 0 0 4px rgba(0,0,0,0.05);">
      ${row("Name", name)}
      ${row("Phone", phone)}
      ${row("Texts", smsConsentAt ? `OK — opted in on the website ${smsConsentAt}` : "Not opted in on the website — ask before texting")}
      ${mail ? row("Email", mail) : ""}
      ${address ? row("Property", address) : ""}
      ${service ? row("Project Type", service) : ""}
      ${row("Site visit", visitStatus(slot, booked ?? null))}
      ${
        message
          ? `<p style="margin: 12px 0;"><strong>Message:</strong></p>
      <div style="margin-top: 8px; padding: 16px; background-color: #f1f1f1; border-radius: 6px; border: 1px solid #ddd; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${escapeHtml(message)}</div>`
          : ""
      }
    </div>

    <div style="margin-top: 32px; text-align: center; font-size: 12px; color: #999;">
      <p>This message was sent via the ${escapeHtml(BUSINESS.name)} website.</p>
      <p style="margin-top: 4px;">© ${new Date().getFullYear()} ${escapeHtml(BUSINESS.legalName)}</p>
    </div>
  </div>
  `,
  });
}

// A quote request from the form. The reply is { success, booked }: `booked`
// says whether the picked visit time made it onto the calendar, which the
// thank-you tells the visitor.
export async function POST(req) {
  const body = await req.json();
  const { phone, smsConsent, lt_check } = body;
  // the answers as text of a sane length, whatever was sent; `name` and the
  // address are tidied once here, for the contact, the visit and the note
  const text = (value, max) => String(value ?? "").replace(/\s+/g, " ").trim().slice(0, max);
  const name = text(body.name, 120);
  const mail = text(body.mail, 200);
  const street = text(body.street, 200);
  const city = text(body.city, 100);
  const zip = text(body.zip, 10);
  const service = text(body.service, 80);
  const message = String(body.message ?? "").trim().slice(0, 5000);
  const slot = validSlot(body.slot);
  const smsConsentAt = smsConsent === true ? consentTimestamp() : null;

  // No CAPTCHA, so light spam checks instead: `lt_check` is a field people
  // never see. Only a bot fills it, and it's told the send worked so it
  // doesn't retry. And a request without a name, a usable phone number and
  // email, and the property's whole address is turned away (the form checks
  // all of them before it sends).
  if (lt_check) {
    return NextResponse.json({ success: true, booked: false });
  }
  if (!name || String(phone ?? "").replace(/\D/g, "").length < 10 || !EMAIL_PATTERN.test(mail)) {
    return NextResponse.json({ error: "Name, phone and email are required" }, { status: 400 });
  }
  if (!STREET_PATTERN.test(street) || !city || !ZIP_PATTERN.test(zip) || !isCaliforniaZip(zip)) {
    return NextResponse.json({ error: "The property's full address is required" }, { status: 400 });
  }

  const address = `${street}, ${city}, CA ${zip}`;
  const lead = { name, phone, mail, street, city, zip, address, service, message, smsConsentAt, slot };

  if (!DELIVER) {
    console.log(`Quote request (not sent: DELIVER is off):\n${buildLeadText(lead)}`);
    return NextResponse.json({ success: true, booked: Boolean(slot) });
  }

  // GoHighLevel first: the contact, the visit on the calendar, the note.
  // Email is the fallback when it isn't set up or fails, and goes out as well
  // when the note didn't make it in, so a lead is never dropped.
  if (isGhlConfigured()) {
    try {
      const { booked, incomplete } = await deliverToGhl(lead);
      if (incomplete && emailConfigured()) {
        await sendEmail({ ...lead, booked }).catch((err) => console.error("Backup email failed:", err));
      }
      return NextResponse.json({ success: true, booked });
    } catch (err) {
      console.error("GoHighLevel delivery failed:", err);
    }
  }

  try {
    await sendEmail(lead);
    return NextResponse.json({ success: true, booked: false });
  } catch (err) {
    console.error("Email error:", err);
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }
}
