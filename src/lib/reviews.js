import { createReader } from "@keystatic/core/reader";
import config from "../../keystatic.config";
import { LAUNCHED } from "@/lib/seo";

// The reviews, as the editor saved them (keystatic.config.js: one file each
// in src/content/reviews), read on the server and shaped for the homepage's
// reviews section (Home/Testimonials):
//   slug, name, headline (may be ""), text, stars (1–5), project (the
//   service, in the singular: "ADU", "Home Addition"; may be ""), city.
// Real reviews only. The samples (made up while the site was built) show
// only while there's no real review yet, and never once the site launches.
// Never mark these up as reviews in the structured data: Google's rules.
const reader = createReader(process.cwd(), config);

// how a service reads under a client's name: "ADU · Granada Hills"
const PROJECT = {
  "new-construction": "New Construction",
  "home-additions": "Home Addition",
  "adu-contractor": "ADU",
  "home-remodeling": "Home Remodel",
  "outdoor-living": "Outdoor Living",
};

function shape({ slug, entry }) {
  const text = (entry.review ?? "").trim();
  const headline = (entry.headline ?? "").trim();
  return {
    slug,
    name: (entry.name ?? "").trim(),
    // a headline that is the whole review (a one-line review) shows once
    headline: headline.toLowerCase() === text.toLowerCase() ? "" : headline,
    text,
    stars: Number(entry.stars) || 5,
    project: PROJECT[entry.service] ?? "",
    city: (entry.city ?? "").trim(),
    sample: Boolean(entry.sample),
  };
}

export async function getReviews() {
  const reviews = (await reader.collections.reviews.all()).map(shape).sort((a, b) => a.name.localeCompare(b.name));
  const real = reviews.filter((r) => !r.sample);
  if (real.length || LAUNCHED) return real;
  return reviews;
}
