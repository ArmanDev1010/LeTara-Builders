import HeroIntro from "@/components/Hero/HeroIntro";
import About from "@/components/Home/About";
import Contact from "@/components/Home/Contact";
import FAQ from "@/components/Home/FAQ";
import Process from "@/components/Home/Process";
import ServiceAreas from "@/components/Home/ServiceAreas";
import Services from "@/components/Home/Services";
import Testimonials from "@/components/Home/Testimonials";
import QuoteButton from "@/components/Quote/QuoteButton";
import { BUSINESS, phoneDisplay, phoneHref } from "@/data/business";
import { buildPageMetadata } from "@/lib/seo";

// The homepage's own canonical and og:url (the layout sets none); its title
// is the layout's default.
export const metadata = buildPageMetadata({ description: BUSINESS.description });

export default function Home() {
  const phone = phoneHref();
  return (
    <main>
      {/* laid out like HB Links' hero: the title over two lines, the
          credentials, a line about the work, the buttons */}
      <HeroIntro>
        <div className="max-w-4xl">
          <h1
            className="font-display uppercase w-fit tracking-[0.01em] leading-[1.02] pointer-events-none
            1600:text-[4.5rem] 1080:text-[4rem] 700:text-[3.4rem] 550:text-[2.9rem] text-[9vw]"
          >
            Design-Build Contractor <br /> in <span className="italic">Los Angeles.</span>
          </h1>

          <p className="max-550:hidden font-script mt-7 text-neutral-300 900:text-[12px] text-[11px] uppercase tracking-[0.22em] flex flex-wrap gap-x-3 gap-y-1.5 items-center pointer-events-none">
            <span>Licensed &amp; Insured</span>
            {BUSINESS.license && (
              <>
                <span className="text-third 700:text-2xl text-xl max-700:hidden">/</span>
                <span className="max-700:hidden">CSLB #{BUSINESS.license}</span>
              </>
            )}
            <span className="text-third 700:text-2xl text-xl">/</span>
            <span>Los Angeles</span>
          </p>

          <p className="550:mt-6 mt-6 font-light max-w-2xl text-neutral-200 text-[15px] 700:text-base 900:text-[17px] pointer-events-none">
            One team from the first sketch to the final walkthrough: ADUs, home additions, full-scale
            remodels and outdoor living spaces.
          </p>

          {/* the quote request first, then the phone; stacked full width on a phone */}
          <div className="mt-8 flex flex-wrap items-center gap-3 max-550:flex-col max-550:items-stretch">
            <QuoteButton />
            {phone && (
              <a
                href={phone}
                className="inline-flex items-center justify-center h-12 px-6 border border-white/35 text-neutral-50 uppercase text-[12.5px] font-semibold tracking-[0.12em] whitespace-nowrap hover:border-white hover:bg-white/10 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-third"
              >
                Call {phoneDisplay()}
              </a>
            )}
          </div>
        </div>
      </HeroIntro>

      {/* the rest of the story, in the order the sections read best: who,
          what, how, who says so, where, what else, then the form to close */}
      <About />
      <Services />
      <Process />
      <Testimonials />
      <ServiceAreas />
      <FAQ />
      <Contact />
    </main>
  );
}
