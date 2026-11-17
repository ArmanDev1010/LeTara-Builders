import nodemailer from "nodemailer";
import { BUSINESS } from "@/data/business";

// The email fallback for the quote form (app/api/contact and its details and
// files routes): used when GoHighLevel isn't set up or fails, so a lead is
// never dropped. Server-side secrets, from .env.local locally and the host's
// Environment Variables in production:
//
//   EMAIL_USER         Gmail account the email is sent from
//   EMAIL_PASS         that account's Gmail app password
//   RECEIVER_EMAIL     where it's delivered (defaults to BUSINESS.email)
//
// `npm run email-check` signs in with them (and `-- --send` sends a test).

export const emailConfigured = () => Boolean(process.env.EMAIL_USER && process.env.EMAIL_PASS);

// Form values go into the email's HTML, so they're escaped: otherwise a
// visitor could inject markup or links into it.
const escapeHtml = (value) =>
  String(value ?? "").replace(
    /[&<>"']/g,
    (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char],
  );

// An email to the office: a heading and `text` (the same lines as the note in
// GoHighLevel), with `replyTo` the visitor and any `attachments`
// ({ filename, content }). Throws if it couldn't be sent.
export async function sendOfficeEmail({ subject, heading, text, replyTo, attachments }) {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    // (Google shows app passwords in groups of four; pasted with the spaces
    // or without, it's the same password)
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS.replace(/\s+/g, "") },
  });
  await transporter.sendMail({
    from: `"${BUSINESS.name} Website" <${process.env.EMAIL_USER}>`,
    ...(replyTo ? { replyTo } : {}),
    to: process.env.RECEIVER_EMAIL || BUSINESS.email,
    subject,
    text,
    attachments,
    html: `
  <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 32px; border-radius: 12px; max-width: 600px; margin: auto; color: #333;">
    <p style="margin: 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #666; text-align: center;">${escapeHtml(BUSINESS.name)} · Website</p>
    <h1 style="margin: 8px 0 24px; font-size: 26px; font-weight: 600; color: #222; text-align: center;">${escapeHtml(heading)}</h1>
    <div style="background-color: #fff; padding: 24px; border-radius: 8px; box-shadow: 0 0 4px rgba(0,0,0,0.05); font-size: 15px; line-height: 1.7; white-space: pre-wrap;">${escapeHtml(text)}</div>
    <p style="margin-top: 32px; text-align: center; font-size: 12px; color: #999;">Sent from the ${escapeHtml(BUSINESS.name)} website · © ${new Date().getFullYear()} ${escapeHtml(BUSINESS.legalName)}</p>
  </div>`,
  });
}
