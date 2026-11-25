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
    "Licensed and insured design-build general contractor for new construction, home additions, ADUs, remodels, outdoor living spaces and commercial build-outs.",
  license: 1147978,
  // Written once as digits; the printed number and the tel: link are both
  // made from it (see phoneDisplay / phoneHref).
  phone: "+1 (747) 677-1517", // confirmed by the user, 11-13
  // For now (the user, 11-13); they will confirm it with Andranik.
  email: "andranik@letarabuilders.com",
  // No opening hours on the site or in the schema: Andranik asked for them
  // to come off (11-16).
  // The SOS filing's principal office: in the schema's address only. The
  // page names no office town, only Los Angeles, the target (the
  // user's call); whether to show a street address is still to decide.
  address: { locality: "North Hills", region: "CA", country: "US" },
  instagram: "https://www.instagram.com/letarabuilders/",
  // The Google Business Profile, by its listing's CID (looked up 11-25): a
  // service-area listing, its address hidden, so Google draws its service
  // areas as an outline. The map in Where we build opens on it, the reviews
  // line and "Los Angeles, CA" link to it, and the schema names it.
  googleCid: "2847538905739951585",
  // Andranik's other company, LeTara's partner for patio covers and awnings
  // (Andranik, 11-16): a mention under the Outdoor Living card on the homepage
  // (11-24, Home/Services), a card on the outdoor living page (UI/
  // PartnerCard), and a link on its name in the About portrait. What it
  // offers is from its own site.
  partner: {
    name: "Vista Pergolas",
    url: "https://vistapergolas.com",
    offers: ["Louvered patio covers", "Solid-roof patio covers", "Lattice patio covers", "Retractable awnings"],
  },
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

// The Google listing's own address (opens it in Google Maps), or null
export function googleProfileHref(cid = BUSINESS.googleCid) {
  return cid ? `https://maps.google.com/?cid=${cid}` : null;
}

// "8180000000" -> "tel:+18180000000"
export function phoneHref(digits = BUSINESS.phone) {
  if (!digits) return null;
  return `tel:+1${String(digits).replace(/\D/g, "").slice(-10)}`;
}
