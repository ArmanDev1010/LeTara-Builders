import Link from "next/link";
import { FORM_CARD, FORM_RULE, LINES, Line } from "@/components/Home/Contact";
import { CONTAINER, HexDot, LEDE } from "@/components/Home/parts";
import { HEX } from "@/components/Navigation/HexButton";
import EstimateForm from "@/components/Quote/EstimateForm";
import { CONTACT_HREF } from "@/lib/routes";
import { buildBreadcrumbs, buildContactPageSchema } from "@/lib/seo";

export const CONTACT_PAGE = {
  title: "Contact Us",
  description:
    "Call, email or send a few details to LeTara Builders, a licensed design-build contractor in Los Angeles: a free phone consultation first, then a free site visit.",
};

// The /contact page (11-25, the user asked for one), in LeTara's own design
// (HB Links has one too; its look stays there):
//   the top, on black: the trail back, the title ("Your project / starts
//     here.", 11-28: the user asked for a new title and line), a line, the
//     two free first steps as typewriter facts, and the form
//     beside the other ways to reach us (the homepage's contact section's
//     pieces, Home/Contact); on a phone the form comes right after the
//     title, as there. Nothing rises in: it's the first thing the page shows.
// Only that (the user, 11-25: How we work and the map after it came out),
// then the footer. Its schema: a ContactPage and the trail.
export default function ContactPage() {
  const schemas = [
    buildContactPageSchema({ ...CONTACT_PAGE, path: CONTACT_HREF }),
    buildBreadcrumbs([
      { name: "Home", path: "" },
      { name: "Contact", path: CONTACT_HREF },
    ]),
  ];

  return (
    <main>
      {schemas.map((schema) => (
        <script key={schema["@type"]} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}

      {/* overflow clip, not hidden: hidden makes the section a scroll box,
          and the form's held Send button would stop sticking to the screen */}
      <section id="hero" className="relative overflow-clip bg-[#070605] text-neutral-50">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <span className="absolute inset-0 bg-[radial-gradient(ellipse_55%_60%_at_8%_0%,rgba(233,166,72,0.13),transparent_70%)]" />
          <span className="absolute inset-0 bg-[radial-gradient(ellipse_60%_45%_at_0%_100%,rgba(233,166,72,0.1),transparent_70%)]" />
          {/* the logo's hexagon, faint, behind the title */}
          <svg viewBox="0 0 40 46" className="absolute -left-[18%] 1080:-left-[8%] top-[4%] w-[80%] 1080:w-[38%] max-w-[620px] text-third/[0.07]">
            <polygon points={HEX} fill="none" stroke="currentColor" strokeWidth="0.3" />
          </svg>
        </div>

        <div
          className={`wide-zoom relative ${CONTAINER} pt-36 700:pt-44 pb-20 1080:pb-28 grid gap-x-14 1440:gap-x-24 gap-y-10 [grid-template-areas:'head''form''lines'] 1080:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] 1080:grid-rows-[auto_1fr] 1080:[grid-template-areas:'head_form''lines_form']`}
        >
          <div className="[grid-area:head]">
            <nav aria-label="Breadcrumb" className="font-script text-[11px] 700:text-[11.5px] uppercase tracking-[0.2em] text-white/55">
              <Link href="/" className="hover:text-white transition-colors duration-200">
                Home
              </Link>
              <span aria-hidden="true" className="mx-2.5 text-white/30 pointer-events-none">
                /
              </span>
              <span aria-current="page" className="text-third pointer-events-none">
                Contact
              </span>
            </nav>
            <h1 className="mt-6 font-display uppercase w-fit leading-[1.02] tracking-[0.01em] pointer-events-none text-[9vw] 550:text-[2.9rem] 700:text-[3.4rem] 1280:text-[4rem] 1600:text-[4.5rem]">
              Your project <br />
              <span className="italic whitespace-nowrap">starts here.</span>
            </h1>
            <p className={`mt-5 max-w-md ${LEDE.dark}`}>
              Tell us what you&apos;re planning, and we&apos;ll take it from there, from the first call to the final
              walkthrough.
            </p>
            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2.5 font-script text-[11.5px] uppercase tracking-[0.18em] text-white/80 pointer-events-none">
              <li className="flex items-center gap-2.5">
                <HexDot />
                Free phone consultation
              </li>
              <li className="flex items-center gap-2.5">
                <HexDot />
                Free site visit
              </li>
            </ul>
          </div>

          <ul className="[grid-area:lines] 1080:-mt-2 border-t border-white/10 self-start">
            {LINES.map((line) => (
              <Line key={line.label} {...line} />
            ))}
          </ul>

          <div className={`[grid-area:form] ${FORM_CARD}`}>
            <div aria-hidden="true" className={FORM_RULE} />
            <EstimateForm talk={false} />
          </div>
        </div>
      </section>

    </main>
  );
}
