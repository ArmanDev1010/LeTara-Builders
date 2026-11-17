// Checks the quote form's backup email (lib/mail.js): reads EMAIL_USER,
// EMAIL_PASS and RECEIVER_EMAIL from .env.local and signs in to the Gmail
// account, sending nothing. With --send it also sends one test email to
// where requests would go.
//
//   npm run email-check
//   npm run email-check -- --send

import nodemailer from "nodemailer";
import { BUSINESS } from "../src/data/business.js";

const { EMAIL_USER, EMAIL_PASS, RECEIVER_EMAIL } = process.env;
const to = RECEIVER_EMAIL || BUSINESS.email;

function fail(message) {
  console.error(`\n✗ ${message}\n`);
  process.exit(1);
}

if (!EMAIL_USER) fail("EMAIL_USER is empty in .env.local (the Gmail address the email is sent from).");
if (!EMAIL_PASS) fail("EMAIL_PASS is empty in .env.local (that account's 16-letter app password).");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: { user: EMAIL_USER, pass: EMAIL_PASS.replace(/\s+/g, "") },
});

try {
  await transporter.verify();
} catch (error) {
  if (error.responseCode === 535 || error.code === "EAUTH")
    fail(
      `Gmail didn't accept ${EMAIL_USER} with that app password. Check the address, that 2-Step Verification is on, and that EMAIL_PASS is the app password (not the account's own password).`,
    );
  fail(`Couldn't reach Gmail: ${error.message}`);
}
console.log(`\n✓ Signed in as ${EMAIL_USER}. Requests would be emailed to ${to}${RECEIVER_EMAIL ? "" : " (BUSINESS.email)"}.`);

if (process.argv.includes("--send")) {
  await transporter.sendMail({
    from: `"${BUSINESS.name} Website" <${EMAIL_USER}>`,
    to,
    subject: "Test: the website's backup email works",
    text: `This is a test from the ${BUSINESS.name} website's quote form. If GoHighLevel can't take a request, it will arrive here like this. Nothing to do.`,
  });
  console.log(`✓ Test email sent to ${to}.`);
}
console.log("");
