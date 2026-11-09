// What the quote form's email and address fields accept. The form checks
// them as they're filled in, and app/api/contact checks them again, so a
// lead always arrives with a usable email and the property's whole address.
// (The phone's rules are in lib/phone.js.)

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// A street address starts with its house number: "12345 Main St", "880B Elm Ave".
export const STREET_PATTERN = /^\s*\d+[A-Za-z]?(-\d+)?\s+\S+/;

export const ZIP_PATTERN = /^\d{5}(-\d{4})?$/;

// LeTara builds in California, whose ZIP codes run 90001 to 96162.
export const isCaliforniaZip = (zip) => {
  const n = Number(String(zip).slice(0, 5));
  return n >= 90001 && n <= 96162;
};
