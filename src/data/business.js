// LeTara Builders' business facts — the one place the name, license, phone,
// email, address and profiles are written. The structured data, metadata,
// contact links, the form's text-message consent and (later) the legal pages
// all read from here, so no two of them can disagree. Vista Pergolas' listings
// show what happens otherwise: two street addresses, and a phone link that
// dials a different number from the one printed on it.
//
// `null` means not confirmed yet — ask Andranik. Anything null is left out of
// the page and the structured data rather than guessed.
export const BUSINESS = {
  name: "LeTara Builders",
  legalName: "LeTara Builders, Inc.", // CA Secretary of State entity #6532559
  tagline: "Dream. Design. Build.",
  description:
    "Licensed and insured design-build general contractor for new construction, home additions, ADUs, remodels and outdoor living spaces.",
  license: 1147978,
  // Written once as digits; the printed number and the tel: link are both
  // made from it (see phoneDisplay / phoneHref).
  phone: "+1 (747) 677-1517", // confirmed by the user, 11-13
  // For now (the user, 11-13); they will confirm it with Andranik.
  email: "andranik@letarabuilders.com",
  // Every day, 9 AM to 5 PM (the user, 11-13). Shown with the ways to reach
  // us and in the schema (openingHoursSpecification); see hoursDisplay.
  hours: {
    days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    opens: "09:00",
    closes: "17:00",
  },
  // The SOS filing's principal office: in the schema's address only. The
  // page names no office town, only Los Angeles, the target city (the
  // user's call); whether to show a street address is still to decide.
  address: { locality: "North Hills", region: "CA", country: "US" },
  instagram: "https://www.instagram.com/letarabuilders/",
  founder: {
    name: "Andranik Taranyan",
    instagram: "https://www.instagram.com/andranikvfx/",
    // From his own Instagram post (June 19): "more than 15 years in the
    // world of visual effects" and "more than 200 episodes of television".
    vfxYears: 15,
    episodes: 200,
    // From his own "Meet the contractor" graphic (Instagram), shown under
    // his name on the About portrait.
    titles: ["Founder, LeTara Builders & Vista Pergolas", "Licensed General Contractor"],
    awards: ["Emmy® Award Winner", "Multiple Emmy® Nominee", "Multiple Leo Award Winner"],
  },
};

// "8180000000" -> "(818) 000-0000"
export function phoneDisplay(digits = BUSINESS.phone) {
  if (!digits) return null;
  const d = String(digits).replace(/\D/g, "").slice(-10);
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

// "mailto:andranik@…", or null while there is no email
export function emailHref(email = BUSINESS.email) {
  return email ? `mailto:${email}` : null;
}

// "09:00" -> "9 AM", "17:30" -> "5:30 PM"
function clock(hhmm) {
  const [h, m] = hhmm.split(":").map(Number);
  return `${h % 12 || 12}${m ? `:${String(m).padStart(2, "0")}` : ""} ${h < 12 ? "AM" : "PM"}`;
}

// { days: all seven, opens: "09:00", closes: "17:00" } -> "Every day, 9 AM – 5 PM"
export function hoursDisplay(hours = BUSINESS.hours) {
  if (!hours) return null;
  const days = hours.days.length === 7 ? "Every day" : hours.days.map((d) => d.slice(0, 3)).join(", ");
  return `${days}, ${clock(hours.opens)} – ${clock(hours.closes)}`;
}

// "8180000000" -> "tel:+18180000000"
export function phoneHref(digits = BUSINESS.phone) {
  if (!digits) return null;
  return `tel:+1${String(digits).replace(/\D/g, "").slice(-10)}`;
}
