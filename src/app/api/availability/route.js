import { NextResponse } from "next/server";
import { DELIVER } from "@/lib/leads";
import { getFreeSlots, isCalendarConfigured } from "@/lib/ghl";
import { VISIT_TIMEZONE, demoSlots } from "@/lib/visitTimes";

export const dynamic = "force-dynamic";

// How far ahead the quote form offers site visits.
const DAYS_AHEAD = 60;

// Open times are kept for a short while, so a busy page doesn't call
// GoHighLevel for every visitor. Booking checks the time again anyway.
const CACHE_MS = 30_000;
let cache = null; // { at, days }

const reply = (body) => NextResponse.json(body, { headers: { "Cache-Control": "no-store" } });

// The site-visit times the quote form offers: { available, timezone, days:
// { "2026-11-12": [slot, …] } }. From Andranik's GoHighLevel calendar once
// it's connected (lib/ghl.js). Until then, sample openings while delivery is
// off, so the form can be built and shown; with delivery on and no calendar,
// `available: false`, and the form offers a call instead.
export async function GET() {
  if (!isCalendarConfigured()) {
    return reply(
      DELIVER
        ? { available: false }
        : { available: true, sample: true, timezone: VISIT_TIMEZONE, days: demoSlots(DAYS_AHEAD) },
    );
  }

  try {
    if (!cache || Date.now() - cache.at > CACHE_MS) {
      cache = { at: Date.now(), days: await getFreeSlots(DAYS_AHEAD) };
    }
    return reply({ available: true, timezone: VISIT_TIMEZONE, days: cache.days });
  } catch (error) {
    console.error("Couldn't load site-visit times:", error);
    return reply({ available: false });
  }
}
