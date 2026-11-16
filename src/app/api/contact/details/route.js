import { NextResponse } from "next/server";
import { addNote, addTags, isGhlConfigured } from "@/lib/ghl";
import { readLeadRef } from "@/lib/leadRef";
import { DELIVER, buildDetailsText } from "@/lib/leads";
import { emailConfigured, sendOfficeEmail } from "@/lib/mail";

// The quote form's optional last step (Andranik, 11-16): the answers picked,
// the visitor's own words and the files they attached (already sent, one by
// one, to ./files, whose replies the form passes back here), added to the
// lead its first part made, as a second note on the contact. Only with a
// valid `ref` from that first part (lib/leadRef). Only the questions and
// options of data/projectDetails make it into the note.
export async function POST(req) {
  const body = await req.json().catch(() => ({}));
  const lead = readLeadRef(body.ref);
  if (!lead) return NextResponse.json({ error: "This request has expired. Please send it again" }, { status: 400 });

  const clean = (value, max) => String(value ?? "").replace(/\s+/g, " ").trim().slice(0, max);
  const files = (Array.isArray(body.files) ? body.files : [])
    .slice(0, 12)
    .map((f) => ({ name: clean(f?.name, 120), url: clean(f?.url, 600) }))
    .filter((f) => f.name && /^https:\/\/[^\s]+$/.test(f.url));
  const failed = (Array.isArray(body.failed) ? body.failed : []).slice(0, 12).map((name) => clean(name, 120)).filter(Boolean);
  const text = buildDetailsText({
    service: lead.service,
    answers: body.answers && typeof body.answers === "object" ? body.answers : {},
    message: String(body.message ?? "").trim().slice(0, 5000),
    files,
    failed,
  });
  if (!text) return NextResponse.json({ success: true });

  if (!DELIVER) {
    console.log(`Quote details for ${lead.name} (not sent: DELIVER is off):\n${text}`);
    return NextResponse.json({ success: true });
  }

  if (lead.contactId && isGhlConfigured()) {
    try {
      await addNote(lead.contactId, text);
      if (files.length) await addTags(lead.contactId, ["files attached"]).catch(() => {});
      return NextResponse.json({ success: true });
    } catch (err) {
      console.error("GoHighLevel details note failed:", err);
    }
  }

  if (!emailConfigured()) return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  try {
    await sendOfficeEmail({
      subject: `More about ${lead.name}'s request`,
      heading: `More about ${lead.name}'s request`,
      text: `${lead.name} · ${lead.phone} · ${lead.mail}\n\n${text}`,
      replyTo: lead.mail,
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Details email failed:", err);
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }
}
