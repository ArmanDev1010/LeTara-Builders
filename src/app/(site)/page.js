import HeroCopy from "@/components/Hero/HeroCopy";
import HeroIntro from "@/components/Hero/HeroIntro";
import About from "@/components/Home/About";
import Contact from "@/components/Home/Contact";
import FAQ from "@/components/Home/FAQ";
import Process from "@/components/Home/Process";
import ServiceAreas from "@/components/Home/ServiceAreas";
import Services from "@/components/Home/Services";
import Testimonials from "@/components/Home/Testimonials";
import { BUSINESS } from "@/data/business";
import { buildPageMetadata } from "@/lib/seo";

// The homepage's own canonical and og:url (the layout sets none); its title
// is the layout's default.
export const metadata = buildPageMetadata({ description: BUSINESS.description });

export default function Home() {
  return (
    <main>
      <HeroIntro>
        <HeroCopy
          title={
            <>
              Design-Build Contractor <br /> in <span className="italic">Los Angeles.</span>
            </>
          }
          lede="One team from the first sketch to the final walkthrough: new construction, home additions, ADUs, remodels and outdoor living spaces."
        />
      </HeroIntro>

      {/* the rest of the story, in the user's order (11-10): who, what, how,
          who says so, then the form, where we build (on white, after the black
          form) and the questions last */}
      <About />
      <Services />
      <Process />
      <Testimonials />
      <Contact />
      <ServiceAreas tone="light" />
      <FAQ />
    </main>
  );
}
