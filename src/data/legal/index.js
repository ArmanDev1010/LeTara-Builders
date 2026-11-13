import accessibility from "./accessibility";
import disclaimer from "./disclaimer";
import privacyPolicy from "./privacy-policy";
import smsTerms from "./sms-terms";
import termsOfService from "./terms-of-service";

// Each legal page's text, by its slug in data/legalPages.js. A document is an
// `intro` and numbered `sections` ({ id, heading, body }); a section's id is
// its anchor in the page's "On this page" list.
export const LEGAL_DOCUMENTS = {
  "privacy-policy": privacyPolicy,
  "terms-of-service": termsOfService,
  "sms-terms": smsTerms,
  disclaimer,
  accessibility,
};
