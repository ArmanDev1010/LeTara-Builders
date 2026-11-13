// The legal pages (/privacy-policy, /terms-of-service, ...; routes in
// app/(site)/(legal)): the footer's legal links, the sitemap, the page
// transition (no wall from one legal page to another), and each page's
// switcher, title and meta description. `updated` (YYYY-MM-DD) is the page's
// "Last updated" date: change it whenever that page's wording changes. A new
// page also needs its own route and its text in data/legal/.
// The text lives in data/legal/, kept out of here so the page transition (a
// client component) doesn't pull it into the browser.
export const LEGAL_PAGES = [
  {
    label: "Privacy Policy",
    slug: "privacy-policy",
    updated: "2026-11-13",
    description:
      "What LeTara Builders collects through letarabuilders.com and when you contact us, how we use and share it, and the choices you have.",
  },
  {
    label: "Terms of Service",
    slug: "terms-of-service",
    updated: "2026-11-13",
    description:
      "The terms for using letarabuilders.com, the website of LeTara Builders, Inc., a licensed California general contractor.",
  },
  {
    label: "SMS Terms",
    slug: "sms-terms",
    updated: "2026-11-13",
    description:
      "How LeTara Builders' text messages work: what we send, how often, what it costs, and how to stop them (reply STOP) or get help (reply HELP).",
  },
  {
    label: "Disclaimer",
    slug: "disclaimer",
    updated: "2026-11-13",
    description:
      "What to keep in mind when relying on letarabuilders.com: permit and zoning information, costs and timelines, drawings and photos, and reviews.",
  },
  {
    label: "Accessibility",
    slug: "accessibility",
    updated: "2026-11-13",
    description:
      "LeTara Builders' commitment to an accessible website, the standard we work toward, and how to reach us if something on the site doesn't work for you.",
  },
];

export const legalHref = (slug) => `/${slug}`;
