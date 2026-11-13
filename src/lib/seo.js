import { BUSINESS, phoneHref } from "@/data/business";

// letarabuilders.com is Andranik's — it already points at GoHighLevel, with
// nothing published on it yet (checked 2026-10-14).
export const BASE_URL = "https://letarabuilders.com";

// The site is a pitch until Andranik approves it: while this is false every
// page is noindex and robots.txt turns crawlers away, so a preview link can be
// shared without the site showing up in Google. Flip it at launch.
export const LAUNCHED = false;

// 1200x630: the logo on white until there's a photo (scripts/brand-assets.mjs)
export const DEFAULT_OG_IMAGE = "/images/brand/og.png";

// Next.js metadata does NOT deep-merge nested objects between the layout and
// a page — a page's `openGraph` replaces the layout's whole, and a page with
// none falls back to the layout's (wrong title, wrong image). So every page's
// metadata comes from here, with each field a link preview needs set.
//
// `path: null` leaves out the canonical and og:url: the root layout's
// defaults, so a page that forgets its own metadata can't claim to be the
// homepage (as on HB Links). Every page passes its own path ("" is the
// homepage).
export function buildPageMetadata({ title, description, path = "", image = DEFAULT_OG_IMAGE }) {
  const url = path === null ? null : `${BASE_URL}${path}`;
  const ogTitle = title ? `${title} | ${BUSINESS.name}` : BUSINESS.name;
  const images = image ? [{ url: image, width: 1200, height: 630, alt: ogTitle }] : undefined;

  return {
    // No " | LeTara Builders" suffix here — the root layout's title template adds it.
    ...(title && { title }),
    description,
    ...(url && { alternates: { canonical: url } }),
    openGraph: {
      title: ogTitle,
      description,
      ...(url && { url }),
      siteName: BUSINESS.name,
      locale: "en_US",
      type: "website",
      ...(images && { images }),
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title: ogTitle,
      description,
      ...(image && { images: [image] }),
    },
  };
}

// The site-wide GeneralContractor schema. Only facts that are confirmed go in
// (see data/business.js) — and no rating until there are real reviews on the
// page to back it.
export function buildBusinessSchema() {
  const phone = phoneHref();
  return {
    "@context": "https://schema.org",
    "@type": "GeneralContractor",
    name: BUSINESS.name,
    legalName: BUSINESS.legalName,
    description: BUSINESS.description,
    url: BASE_URL,
    logo: `${BASE_URL}/images/brand/letara-logo.png`,
    ...(phone && { telephone: phone.replace("tel:", "") }),
    ...(BUSINESS.email && { email: BUSINESS.email }),
    ...(BUSINESS.hours && {
      openingHoursSpecification: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: BUSINESS.hours.days,
        opens: BUSINESS.hours.opens,
        closes: BUSINESS.hours.closes,
      },
    }),
    address: {
      "@type": "PostalAddress",
      addressLocality: BUSINESS.address.locality,
      addressRegion: BUSINESS.address.region,
      addressCountry: BUSINESS.address.country,
    },
    // the target city (the page names no office town; the user's call)
    areaServed: { "@type": "City", name: "Los Angeles" },
    founder: { "@type": "Person", name: BUSINESS.founder.name },
    sameAs: [BUSINESS.instagram],
  };
}

// BreadcrumbList — `trail` is [{ name, path }], Home first.
export function buildBreadcrumbs(trail) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map(({ name, path }, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name,
      item: `${BASE_URL}${path}`,
    })),
  };
}

// An FAQ answer as plain text: "{{Get a free quote}}" (a button on the
// page, see Home/FAQ) becomes its words.
export const plainAnswer = (answer) => answer.replace(/\{\{(.+?)\}\}/g, "$1.");

// FAQPage — only for FAQs that are also shown on the page (Google's
// guidance: the structured data has to match what's visible). Null when
// there are none, so a page never renders an empty block.
export function buildFAQSchema(faqs) {
  if (!faqs?.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: plainAnswer(answer) },
    })),
  };
}

// LeTara as the provider of a page's Service.
function provider() {
  const phone = phoneHref();
  return {
    "@type": "GeneralContractor",
    name: BUSINESS.name,
    url: BASE_URL,
    ...(phone && { telephone: phone.replace("tel:", "") }),
  };
}

// A service page's Service, provided by LeTara, in the target city.
export function buildServiceSchema(page) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: page.metaTitle,
    serviceType: page.serviceType,
    description: page.description,
    url: `${BASE_URL}${page.href}`,
    provider: provider(),
    areaServed: { "@type": "City", name: "Los Angeles" },
  };
}

// An area page's Service: design-build, provided by LeTara, in that area
// (a neighborhood of Los Angeles, or a city of its own).
export function buildAreaSchema(page) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: page.metaTitle,
    serviceType: "Design-build construction",
    description: page.description,
    url: `${BASE_URL}${page.href}`,
    provider: provider(),
    areaServed: { "@type": "Place", name: `${page.name}, CA` },
  };
}
