// Checks the website's GoHighLevel connection: reads GHL_TOKEN,
// GHL_LOCATION_ID and GHL_CALENDAR_ID from .env.local, lists the calendars in
// the sub-account (to find the site-visit calendar's ID), and, once
// GHL_CALENDAR_ID is set, shows that calendar's next open times. It only
// reads; nothing is created in the account.
//
//   npm run ghl-check

const API = "https://services.leadconnectorhq.com";
const { GHL_TOKEN, GHL_LOCATION_ID, GHL_CALENDAR_ID } = process.env;

function fail(message) {
  console.error(`\n✗ ${message}\n`);
  process.exit(1);
}

async function ghl(path, query) {
  const url = new URL(path, API);
  for (const [key, value] of Object.entries(query)) url.searchParams.set(key, value);
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${GHL_TOKEN}`, Version: "2021-04-15", Accept: "application/json" },
  });
  const data = await res.json().catch(() => null);
  if (res.status === 401) fail("GoHighLevel didn't accept GHL_TOKEN. Check it was copied whole, from the right sub-account.");
  if (res.status === 403) fail(`The token is missing a scope for ${path}. It needs contacts.write, calendars.readonly and calendars/events.write.`);
  if (!res.ok) fail(`GoHighLevel answered ${res.status}: ${JSON.stringify(data)}`);
  return data;
}

if (!GHL_TOKEN) fail("GHL_TOKEN is empty in .env.local.");
if (!GHL_LOCATION_ID) fail("GHL_LOCATION_ID is empty in .env.local.");

const { calendars = [] } = await ghl("/calendars/", { locationId: GHL_LOCATION_ID });
console.log(`\n✓ Connected. ${calendars.length} calendar${calendars.length === 1 ? "" : "s"} in this sub-account:\n`);
for (const cal of calendars) {
  const chosen = cal.id === GHL_CALENDAR_ID ? "  ← GHL_CALENDAR_ID" : "";
  const length = cal.slotDuration ? `, ${cal.slotDuration} ${cal.slotDurationUnit ?? "mins"} visits` : "";
  console.log(`  ${cal.name}${cal.isActive === false ? " (inactive)" : ""}${length}`);
  console.log(`    ID: ${cal.id}${chosen}\n`);
}

if (!GHL_CALENDAR_ID) {
  console.log("Next: copy the site-visit calendar's ID into GHL_CALENDAR_ID in .env.local, then run this again.\n");
  process.exit(0);
}
if (!calendars.some((cal) => cal.id === GHL_CALENDAR_ID)) {
  fail("GHL_CALENDAR_ID doesn't match any calendar above. Copy one of the IDs listed.");
}

const now = Date.now();
const slots = await ghl(`/calendars/${GHL_CALENDAR_ID}/free-slots`, {
  startDate: now,
  endDate: now + 30 * 864e5,
  timezone: "America/Los_Angeles",
});
const times = Object.values(slots ?? {}).flatMap((day) => day?.slots ?? []);
if (!times.length) {
  console.log("⚠ The calendar has no open times in the next 30 days. Check its availability in GoHighLevel.\n");
} else {
  const show = (iso) =>
    new Date(iso).toLocaleString("en-US", { timeZone: "America/Los_Angeles", dateStyle: "full", timeStyle: "short" });
  console.log(`✓ ${times.length} open times in the next 30 days. The first few:`);
  times.slice(0, 5).forEach((iso) => console.log(`    ${show(iso)}`));
  console.log("\nThe website's visit step will offer these.\n");
}
