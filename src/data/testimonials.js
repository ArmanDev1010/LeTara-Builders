// The reviews themselves are added in the editor (/keystatic → Reviews; see
// lib/reviews.js). This is the line over them for LeTara's Google Business
// Profile: the Google "G", the rating, the count, and links to the reviews
// and the profile. The profile isn't set up yet, but the user wants the line
// on the site already (11-16): until then the links are a Google search and
// a Google Maps search for the name, and with no rating or count here the
// line shows the reviews on the site (their average and how many).
//
// Once the profile exists: its link in `profile`, its reviews link in
// `readAll`, and its own rating and count (they must match Google's at
// launch). Never put the rating in the structured data unless those reviews
// are on the page.
export const REVIEWS_SUMMARY = {
  rating: null,
  count: null,
  readAll: "https://www.google.com/search?q=LeTara+Builders+reviews",
  profile: "https://www.google.com/maps/search/?api=1&query=LeTara+Builders",
};
