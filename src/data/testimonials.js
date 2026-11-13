// The reviews themselves are added in the editor (/keystatic → Reviews; see
// lib/reviews.js). This is the line over them for a Google Business Profile:
// the Google "G", the rating, the count, and links to the reviews and the
// profile. LeTara has no profile yet (11-13), so it's all null and the line
// isn't shown. Once the profile exists, fill in its link (`profile`), its
// reviews link (`readAll`), and, from the profile itself, the rating and the
// count (a null rating or count shows the line without that number). Never
// put the rating in the structured data unless those reviews are on the page.
export const REVIEWS_SUMMARY = {
  rating: null,
  count: null,
  readAll: null,
  profile: null,
};
