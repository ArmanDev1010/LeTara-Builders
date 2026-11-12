import { Toaster } from "react-hot-toast";
import { ModalProvider } from "@/context/ModalContext";
import MotionPreferences from "@/components/UI/MotionPreferences";
import Footer from "@/components/Footer/Footer";
import Navbar from "@/components/Navigation/Navbar";
import PageTransition from "@/components/UI/PageTransition";
import StableViewport from "@/components/UI/StableViewport";
import QuoteModals from "@/components/Quote/QuoteModals";
import { buildBusinessSchema } from "@/lib/seo";

// The website around a page: the navbar, the footer, the quote dialog and
// thank-you (mounted once here), the page transition, the business schema.
// Used by the site's layout (app/(site)/layout.js) and the 404 page
// (app/not-found.js), which sits outside it; the projects editor
// (app/keystatic) has none of it.
export default function SiteShell({ children }) {
  return (
    <>
      {/* without JavaScript, show what the scroll reveals (Home/Reveal) would fade in */}
      <noscript>
        <style>{"[data-reveal]{opacity:1!important}"}</style>
      </noscript>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildBusinessSchema()) }} />
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
    </>
  );
}
