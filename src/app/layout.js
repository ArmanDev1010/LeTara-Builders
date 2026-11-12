import "./globals.css";

import { Bebas_Neue, Courier_Prime, Oswald } from "next/font/google";
import { BUSINESS } from "@/data/business";
import { BASE_URL, LAUNCHED, buildPageMetadata } from "@/lib/seo";

// Bebas Neue is the face the logo is set in; Courier Prime is a screenplay's
// typewriter face. Both are CSS variables (font-display / font-script in
// globals.css), which the hero's canvas reads too.
const display = Bebas_Neue({ weight: "400", subsets: ["latin"], variable: "--font-bebas-neue" });
const script = Courier_Prime({ weight: ["400", "700"], subsets: ["latin"], variable: "--font-courier-prime" });
// Oswald Light: a lighter condensed face in Bebas' family of shapes (Bebas
// has one weight), for Andranik's quote on his portrait (font-quote; the
// user's favourite of the quote's looks).
const quote = Oswald({ weight: "300", subsets: ["latin"], variable: "--font-oswald" });

// The site-wide defaults: no canonical or og:url (path: null), so a page
// can't inherit the homepage's. Each page exports its own metadata from
// buildPageMetadata.
export const metadata = {
  metadataBase: new URL(BASE_URL),
  ...buildPageMetadata({ description: BUSINESS.description, path: null }),
  title: {
    default: `${BUSINESS.name} | Design-Build Contractor in Los Angeles`,
    template: `%s | ${BUSINESS.name}`,
  },
  authors: [{ name: BUSINESS.name }],
  // A pitch until launch: kept out of search results (see LAUNCHED).
  robots: LAUNCHED
    ? { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } }
    : { index: false, follow: false },
};

// The page itself, for everything: the site (app/(site)/layout.js adds its
// navbar, footer, quote dialog and page transition) and the projects editor
// (app/keystatic), which has none of them.
export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${display.variable} ${script.variable} ${quote.variable}`}>
      {/* Safari on iPhone turns any number that looks like a phone number
          into a tel: link before React loads; it did it to the license
          number (CSLB #1147978) and broke hydration on every page. Written
          here, in the head itself: the metadata API's formatDetection lands
          after the content while Next.js streams (in dev, at least), too
          late for Safari. The real phone links are written out. */}
      <head>
        <meta name="format-detection" content="telephone=no, email=no, address=no" />
      </head>
      <body>{children}</body>
    </html>
  );
}
