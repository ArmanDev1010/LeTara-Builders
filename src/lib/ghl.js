import { BUSINESS } from "@/data/business";
import { buildLeadText, e164 } from "@/lib/leads";
import { VISIT_TIMEZONE, groupByDay } from "@/lib/visitTimes";

// Andranik runs his business on GoHighLevel (Vista Pergolas' site and
// calendar are built there), so the website's leads and site visits go
// straight into his account through its API (v2, "LeadConnector"): each
// request becomes a contact with a note, and a picked time becomes an
// appointment on his site-visit calendar.
//
// Server-side secrets, from .env.local locally and the host's Environment
// Variables in production. Never hardcoded, and never NEXT_PUBLIC_:
//
//   GHL_TOKEN        a Private Integration token made in the LeTara
//                    sub-account (Settings → Private Integrations), with the
//                    scopes contacts.write, calendars.readonly and
//                    calendars/events.write
//   GHL_LOCATION_ID  that sub-account's ID (in the dashboard's web address,
//                    after /location/)
//   GHL_CALENDAR_ID  the site-visit calendar's ID (`npm run ghl-check`
//                    lists them and tests the connection)

const API = "https://services.leadconnectorhq.com";
const TIMEOUT_MS = 8000;

// Each part of the API names the version it speaks.
const CONTACTS = "2021-07-28";
const CALENDARS = "2021-04-15";

// The free-slots call takes at most 31 days at a time.
const SLOT_WINDOW_DAYS = 30;

export const isGhlConfigured = () => Boolean(process.env.GHL_TOKEN && process.env.GHL_LOCATION_ID);
export const isCalendarConfigured = () => isGhlConfigured() && Boolean(process.env.GHL_CALENDAR_ID);

// One API call. Throws on anything but success; the error carries the status
// and GoHighLevel's message, never the token.
async function ghl(path, { method = "GET", version, query, body } = {}) {
  const url = new URL(path, API);
  for (const [key, value] of Object.entries(query ?? {})) url.searchParams.set(key, value);
  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${process.env.GHL_TOKEN}`,
      Version: version,
      Accept: "application/json",
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(TIMEOUT_MS),
    cache: "no-store",
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const error = new Error(`GoHighLevel ${method} ${url.pathname} responded ${res.status}: ${JSON.stringify(data)?.slice(0, 300)}`);
    error.status = res.status;
    throw error;
  }
  return data;
}

// The calendar's open times over the next `days` days, sorted into Los
// Angeles days: { "2026-11-12": [slot, …] }. GoHighLevel applies the
// calendar's own settings (open hours, buffers, notice, visits per day).
export async function getFreeSlots(days = 60) {
  const now = Date.now();
  const windows = [];
  for (let start = 0; start < days; start += SLOT_WINDOW_DAYS) {
    windows.push([now + start * 864e5, now + Math.min(start + SLOT_WINDOW_DAYS, days) * 864e5]);
  }
  const results = await Promise.all(
    windows.map(([startDate, endDate]) =>
      ghl(`/calendars/${process.env.GHL_CALENDAR_ID}/free-slots`, {
        version: CALENDARS,
        query: { startDate, endDate, timezone: VISIT_TIMEZONE },
      }),
    ),
  );
  // { "2026-11-12": { slots: [...] }, …, traceId: "…" }
  const slots = results.flatMap((result) =>
    Object.values(result ?? {}).flatMap((day) => (Array.isArray(day?.slots) ? day.slots : [])),
  );
  return groupByDay(slots);
}

// Finds the contact by phone or email, or makes a new one, and returns its
// ID. The address goes in GoHighLevel's own fields; the state is California
// (the form takes California ZIP codes only). Tags are added separately: on
// an upsert they'd replace the contact's existing tags.
async function upsertContact({ name, phone, mail, street, city, zip }) {
  const [firstName, ...rest] = name.split(" ");
  const data = await ghl("/contacts/upsert", {
    method: "POST",
    version: CONTACTS,
    body: {
      locationId: process.env.GHL_LOCATION_ID,
      name,
      firstName,
      lastName: rest.join(" ") || undefined,
      phone: e164(phone),
      email: mail,
      address1: street,
      city,
      state: "CA",
      postalCode: zip,
      country: "US",
      source: `${BUSINESS.name} website`,
    },
  });
  const id = data?.contact?.id;
  if (!id) throw new Error(`GoHighLevel upsert returned no contact: ${JSON.stringify(data)?.slice(0, 300)}`);
  return id;
}

// Tags Andranik can filter by or start workflows from.
function tagsFor({ service, smsConsentAt }, booked) {
  return [
    "website lead",
    service && `project: ${service.toLowerCase()}`,
    booked && "site visit booked",
    smsConsentAt && "sms opt-in",
  ].filter(Boolean);
}

// Books the visit. Never throws: whether it worked comes back as `booked`, so
// the lead goes through either way. GoHighLevel checks the time is still free
// (two people can pick the same one) and runs the calendar's own automations,
// such as confirmations and reminders (toNotify).
async function bookVisit(contactId, { name, address, service, slot }) {
  try {
    await ghl("/calendars/events/appointments", {
      method: "POST",
      version: CALENDARS,
      body: {
        calendarId: process.env.GHL_CALENDAR_ID,
        locationId: process.env.GHL_LOCATION_ID,
        contactId,
        startTime: slot,
        title: `Site visit: ${name}${service ? ` (${service})` : ""}`,
        appointmentStatus: "confirmed",
        ...(address ? { address, meetingLocationType: "custom", overrideLocationConfig: true } : {}),
        toNotify: true,
      },
    });
    return true;
  } catch (error) {
    console.error("GoHighLevel booking failed:", error);
    return false;
  }
}

// Sends a request to GoHighLevel: the contact first (if that fails, this
// throws and the API route falls back to email), then the visit, then the
// note and tags. `incomplete` means the note or tags didn't go in, so the
// route emails the request as well.
export async function deliverToGhl(lead) {
  const contactId = await upsertContact(lead);
  const booked = lead.slot && isCalendarConfigured() ? await bookVisit(contactId, lead) : null;

  const extras = await Promise.allSettled([
    ghl(`/contacts/${contactId}/notes`, {
      method: "POST",
      version: CONTACTS,
      body: { body: buildLeadText({ ...lead, booked }) },
    }),
    ghl(`/contacts/${contactId}/tags`, {
      method: "POST",
      version: CONTACTS,
      body: { tags: tagsFor(lead, booked) },
    }),
  ]);
  const failed = extras.filter((result) => result.status === "rejected");
  failed.forEach((result) => console.error("GoHighLevel note/tags failed:", result.reason));

  return { booked: booked === true, incomplete: failed.length > 0 };
}
