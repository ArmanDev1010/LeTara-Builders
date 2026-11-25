import { googleProfileHref } from "@/data/business";

// The reviews themselves are added in the editor (/keystatic → Reviews; see
// lib/reviews.js). This is the line over them (Home/Testimonials): the rating
// and the count, then a link to LeTara's Google Business Profile.
//
// The profile is linked since 11-25 (BUSINESS.googleCid) but has no reviews
// yet, so the line shows the site's own reviews' rating and count, with no
// Google "G" and no "on Google". Once it has reviews: its reviews link in
// `readAll`, and Google's own `rating` and `count` (they must match Google's);
// the G and "N reviews on Google" then come back. Never put the rating in the
// structured data unless those reviews are on the page.
export const REVIEWS_SUMMARY = {
  rating: null,
  count: null,
  readAll: null,
  profile: googleProfileHref(),
};
