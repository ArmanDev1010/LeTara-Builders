import "./globals.css";

import { Bebas_Neue, Courier_Prime, Oswald } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { ModalProvider } from "@/context/ModalContext";
import MotionPreferences from "@/components/UI/MotionPreferences";
import Footer from "@/components/Footer/Footer";
import Navbar from "@/components/Navigation/Navbar";
import PageTransition from "@/components/UI/PageTransition";
import StableViewport from "@/components/UI/StableViewport";
import QuoteModals from "@/components/Quote/QuoteModals";
import { BUSINESS } from "@/data/business";
import { BASE_URL, LAUNCHED, buildBusinessSchema, buildPageMetadata } from "@/lib/seo";

// Bebas Neue is the face the logo is set in; Courier Prime is a screenplay's
// typewriter face. Both are CSS variables (font-display / font-script in
// globals.css), which the hero's canvas reads too.
const display = Bebas_Neue({ weight: "400", subsets: ["latin"], variable: "--font-bebas-neue" });
const script = Courier_Prime({ weight: ["400", "700"], subsets: ["latin"], variable: "--font-courier-prime" });
// Oswald Light: a lighter condensed face in Bebas' family of shapes (Bebas
// has one weight), for Andranik's quote on his portrait (font-quote; the
// user asked for it a weight lighter).
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

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${display.variable} ${script.variable} ${quote.variable}`}>
      <body>
        {/* without JavaScript, show what the scroll reveals (Home/Reveal) would fade in */}
        <noscript>
          <style>{"[data-reveal]{opacity:1!important}"}</style>
        </noscript>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildBusinessSchema()) }}
        />
        <MotionPreferences>
          <ModalProvider>
            <Toaster position="top-center" containerStyle={{ zIndex: 100001 }} />
            <Navbar />
            {children}
            <Footer />
            <QuoteModals />
            <PageTransition />
          </ModalProvider>
        </MotionPreferences>
        <StableViewport />
      </body>
    </html>
  );
}
