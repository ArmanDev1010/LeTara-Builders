import { NextResponse } from "next/server";
import { isGhlConfigured, uploadFile } from "@/lib/ghl";
import { readLeadRef } from "@/lib/leadRef";
import { DELIVER } from "@/lib/leads";
import { emailConfigured, sendOfficeEmail } from "@/lib/mail";

// One file the visitor attached in the quote form's last step (a photo, made
// smaller in the browser, or a PDF), for the lead its first part made (a
// valid `ref`, lib/leadRef). Into GoHighLevel's media storage; the reply's
// `url` goes into the details note (./details). One file a request: the host
// takes at most 4.5 MB a request. By email instead when GoHighLevel isn't set
// up or fails.
const MAX_BYTES = 4.4 * 1024 * 1024;
const TYPES = new Set(["image/jpeg", "image/png", "image/webp", "application/pdf"]);

export async function POST(req) {
  const form = await req.formData().catch(() => null);
  const lead = readLeadRef(form?.get("ref"));
  if (!lead) return NextResponse.json({ error: "This request has expired. Please send it again" }, { status: 400 });
  const file = form.get("file");
  if (!file || typeof file === "string" || !TYPES.has(file.type) || file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Photos (JPG or PNG) or PDFs up to 4 MB" }, { status: 400 });
  }

  if (!DELIVER) {
    console.log(`Quote file for ${lead.name} (not sent: DELIVER is off): ${file.name}, ${Math.round(file.size / 1024)} KB`);
    return NextResponse.json({ success: true, url: null });
  }

  if (lead.contactId && isGhlConfigured()) {
    try {
      const url = await uploadFile(file, lead);
      return NextResponse.json({ success: true, url });
    } catch (err) {
      console.error("GoHighLevel file upload failed:", err);
    }
  }

  if (!emailConfigured()) return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  try {
    await sendOfficeEmail({
      subject: `A file from ${lead.name}'s request`,
      heading: `A file from ${lead.name}'s request`,
      text: `${lead.name} · ${lead.phone} · ${lead.mail}\n\nAttached: ${file.name}`,
      replyTo: lead.mail,
      attachments: [{ filename: file.name, content: Buffer.from(await file.arrayBuffer()) }],
    });
    return NextResponse.json({ success: true, url: null });
  } catch (err) {
    console.error("File email failed:", err);
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }
}
