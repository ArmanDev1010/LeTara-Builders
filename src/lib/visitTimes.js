// Site-visit times. They're shown and booked in Los Angeles time wherever the
// visitor happens to be, because the visit happens in Los Angeles. The quote
// form (in the browser) and the API routes (on the server) both use these, so
// nothing here may touch server-only code.
//
// A slot is an ISO time written in Los Angeles time with its offset, e.g.
// "2026-11-12T10:00:00-08:00", which is how GoHighLevel writes them. A day is
// a "YYYY-MM-DD" key in Los Angeles.

export const VISIT_TIMEZONE = "America/Los_Angeles";

const pad = (n) => String(n).padStart(2, "0");
export const dayKey = (year, month, day) => `${year}-${pad(month)}-${pad(day)}`;
export const parseDayKey = (key) => key.split("-").map(Number); // [year, month, day]

const PARTS = new Intl.DateTimeFormat("en-US", {
  timeZone: VISIT_TIMEZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

// The wall-clock date and time in Los Angeles at `date`.
function laParts(date) {
  const p = Object.fromEntries(PARTS.formatToParts(date).map(({ type, value }) => [type, Number(value)]));
  return { year: p.year, month: p.month, day: p.day, hour: p.hour, minute: p.minute };
}

// How far Los Angeles' clock is from UTC at `ms`, in ms (negative: behind).
function laOffset(ms) {
  const p = laParts(new Date(ms));
  return Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute) - Math.floor(ms / 60000) * 60000;
}

// The day key in Los Angeles at `date` (today, by default).
export function laDayKey(date = new Date()) {
  const p = laParts(date);
  return dayKey(p.year, p.month, p.day);
}

// The moment it's `hour`:`minute` on that day in Los Angeles. The offset is
// checked again at the answer, for days when the clocks change.
export function laTime(year, month, day, hour = 0, minute = 0) {
  const wall = Date.UTC(year, month - 1, day, hour, minute);
  let ms = wall - laOffset(wall);
  ms = wall - laOffset(ms);
  return new Date(ms);
}

// `date` written as a slot: Los Angeles time with its offset.
export function laIso(date) {
  const p = laParts(date);
  const offset = Math.round(laOffset(date.getTime()) / 60000);
  const sign = offset < 0 ? "-" : "+";
  const abs = Math.abs(offset);
  return `${dayKey(p.year, p.month, p.day)}T${pad(p.hour)}:${pad(p.minute)}:00${sign}${pad(Math.floor(abs / 60))}:${pad(abs % 60)}`;
}

// Slots sorted into Los Angeles days: { "2026-11-12": [slot, …] }, each
// rewritten in Los Angeles time, so the same moment is always the same
// string (and listed once).
export function groupByDay(slots) {
  const unique = [...new Set(slots.map((slot) => laIso(new Date(slot))))].sort(
    (a, b) => new Date(a) - new Date(b),
  );
  const days = {};
  for (const slot of unique) (days[slot.slice(0, 10)] ??= []).push(slot);
  return days;
}

// ── Showing them ──────────────────────────────────────────────────────────

const inLA = (options) => new Intl.DateTimeFormat("en-US", { timeZone: VISIT_TIMEZONE, ...options });
const TIME = inLA({ hour: "numeric", minute: "2-digit" });
const DAY = inLA({ weekday: "short", month: "short", day: "numeric" });
const DAY_LONG = inLA({ weekday: "long", month: "long", day: "numeric" });
const NUMERIC_DAY = inLA({ month: "numeric", day: "numeric" });

// A day key's own date, for naming it (noon UTC, so no zone moves it).
const keyDate = (key) => {
  const [year, month, day] = parseDayKey(key);
  return new Date(Date.UTC(year, month - 1, day, 12));
};
const inUTC = (options) => new Intl.DateTimeFormat("en-US", { timeZone: "UTC", ...options });
const KEY_LONG = inUTC({ weekday: "long", month: "long", day: "numeric" });
const MONTH_TITLE = inUTC({ month: "long", year: "numeric" });

// Some engines put a narrow no-break space before AM/PM; plain spaces read
// the same everywhere, including the lead's note and email.
const clean = (text) => text.replace(/[  ]/g, " ");

export const visitTime = (slot) => clean(TIME.format(new Date(slot))); // "10:30 AM"
export const visitDay = (slot) => clean(DAY.format(new Date(slot))); // "Tue, Nov 12"
export const visitNumericDay = (slot) => NUMERIC_DAY.format(new Date(slot)); // "11/12"
export const visitDayLong = (slot) => clean(DAY_LONG.format(new Date(slot))); // "Tuesday, November 12"
// "Tuesday, November 12 at 10:30 AM"
export const visitSentence = (slot) => `${visitDayLong(slot)} at ${visitTime(slot)}`;
// "10:30a", "10a": the shortest, for the progress tile on a phone
export const visitTimeShort = (slot) =>
  visitTime(slot)
    .replace(":00", "")
    .replace(/\s?([AP])M$/, (_, half) => half.toLowerCase());

export const dayTitle = (key) => clean(KEY_LONG.format(keyDate(key))); // "Tuesday, November 12"
export const monthTitle = (year, month) => MONTH_TITLE.format(new Date(Date.UTC(year, month - 1, 15))); // "November 2026"

// ── Sample openings ───────────────────────────────────────────────────────

// Made-up openings, for building and showing the form before Andranik's
// calendar is connected (see app/api/availability): weekdays from tomorrow,
// a few times a day, with some already "taken" so it reads like a real
// calendar. Never shown once the real calendar is connected.
export function demoSlots(days = 60) {
  const today = parseDayKey(laDayKey());
  const slots = [];
  for (let i = 1; i <= days; i++) {
    const date = new Date(Date.UTC(today[0], today[1] - 1, today[2] + i, 12));
    const weekday = date.getUTCDay();
    if (weekday === 0 || weekday === 6) continue;
    const [year, month, day] = [date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate()];
    [9, 10, 11, 13, 14, 15, 16]
      .filter((hour, j) => (day * 7 + hour * 3 + j) % 5 !== 0)
      .forEach((hour) => slots.push(laIso(laTime(year, month, day, hour))));
  }
  return groupByDay(slots);
}
