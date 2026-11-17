// The reviews themselves are added in the editor (/keystatic → Reviews; see
// lib/reviews.js). This is the line over them: with LeTara's Google Business
// Profile, the Google "G", the rating, the count, and links to the reviews
// and the profile; without one, the rating and the count of the reviews on
// the site, with no Google name or links (Home/Testimonials).
//
// The profile isn't set up yet, so the line is the plain one (11-17, the
// user's call). Once it exists: its link in `profile`, its reviews link in
// `readAll`, and its own rating and count (they must match Google's). Never
// put the rating in the structured data unless those reviews are on the page.
export const REVIEWS_SUMMARY = {
  rating: null,
  count: null,
  readAll: null,
  profile: null,
};
