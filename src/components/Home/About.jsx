import Image from "next/image";
import Link from "next/link";
import { TbArrowRight } from "react-icons/tb";
import Reveal from "@/components/Home/Reveal";
import { CONTAINER, H2, HexDot, LEDE, LIGHT, PhotoStandIn, SECTION, SectionLabel, Viewfinder } from "@/components/Home/parts";
import { BUSINESS } from "@/data/business";
import portrait from "@/../public/images/about/andranik-emmy.jpg";

const { founder } = BUSINESS;

// The middle card was the Emmy® until 11-09 (Andranik doesn't want the site
// to revolve around it): how LeTara works instead, a business fact like the
// other two. (Tried and rejected: "Visualized first", "15+ years in VFX".)
const CREDENTIALS = [
  BUSINESS.license && { kicker: "Licensed", title: `CSLB #${BUSINESS.license}`, note: "California contractor" },
  { kicker: "How we work", title: "Design-build", note: "one team, sketch to walkthrough" },
  { kicker: "Building across", title: "Los Angeles", note: "and the San Fernando Valley" },
].filter(Boolean);

// Andranik's own words, from his LinkedIn, on his portrait: the setup, then
// the line that lands (gold).
const QUOTE = {
  lines: ["I used to build worlds for the screen.", "Now I design and build spaces in the physical world!"],
  close: "The tools changed — the standards didn’t.",
};

// Who we are, on white after the dark hero (laid out after an example the
// user liked): the heading, three credentials, then a project photo beside
// a short story of the company, and Andranik down the right in a
// viewfinder's corners, his quote over the foot of his portrait. On a phone
// the portrait comes right after the heading. The project photo is a black
// stand-in until there are real ones.
//
// The portrait is the user's photo of Andranik at the 65th Emmy Awards. It
// shows the statuette and the Academy's backdrop, the one exception to the
// no-statuette rule (CLAUDE.md), at the user's request; confirm its rights
// before launch.
export default function About() {
  return (
    <section id="about" className={`${SECTION} ${LIGHT}`}>
      <div
        className={`${CONTAINER} grid gap-x-12 1440:gap-x-16 gap-y-8 grid-cols-1 [grid-template-areas:'head''portrait''creds''body'] 1080:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] 1080:grid-rows-[auto_auto_1fr] 1080:[grid-template-areas:'head_portrait''creds_portrait''body_portrait']`}
      >
        <div className="[grid-area:head]">
          <Reveal>
            <SectionLabel number="01" tone="light">
              Who we are
            </SectionLabel>
          </Reveal>
          <Reveal as="h2" delay={0.05} className={`mt-5 ${H2}`}>
            From the Emmy® stage <br className="max-550:hidden" />
            to your job site.
          </Reveal>
        </div>

        <ul className="[grid-area:creds] grid grid-cols-1 550:grid-cols-3 gap-3">
          {CREDENTIALS.map((item, i) => (
            <Reveal as="li" key={item.kicker} delay={0.08 * i} className="border border-black/10 px-5 py-4 pointer-events-none">
              <p className="flex items-center gap-2 font-script text-[10.5px] uppercase tracking-[0.2em] text-black/45">
                <HexDot className="!w-2 !h-[9px]" />
                {item.kicker}
              </p>
              <p className="mt-2.5 font-display text-[22px] leading-none tracking-[0.01em]">{item.title}</p>
              <p className="mt-1.5 text-[13px] text-black/50">{item.note}</p>
            </Reveal>
          ))}
        </ul>

        {/* the photo as tall as the story beside it (on a phone, under it) */}
        <div className="[grid-area:body] grid gap-8 700:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)] 700:items-stretch 1080:pt-2">
          <Reveal className="relative aspect-[16/9] 700:aspect-auto 700:min-h-[320px] max-700:order-2">
            <PhotoStandIn />
            <Viewfinder className="text-black/25" />
          </Reveal>
          <Reveal delay={0.1}>
            <p className={LEDE.light}>
              LeTara Builders is a licensed general contractor in Los Angeles, building ADUs, home additions,
              full remodels and outdoor living spaces. Every project is design-build: careful planning, clear
              communication and precise execution, from one team.
            </p>
            <p className={`mt-4 ${LEDE.light}`}>
              Founder Andranik Taranyan spent more than {founder.vfxYears} years in visual effects, on more than{" "}
              {founder.episodes} episodes of television, where his work earned an Emmy® Award. The industry
              changed, the mindset didn&apos;t: vision, planning, problem solving, attention to detail and
              execution.
            </p>
            <Link
              href="#process"
              className="group mt-7 inline-flex items-center gap-2.5 uppercase text-[12.5px] font-semibold tracking-[0.14em] text-neutral-950 border-b border-third pb-1 hover:text-black/70 transition-colors duration-200"
            >
              See how we work
              <TbArrowRight aria-hidden="true" className="text-third transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </Reveal>
        </div>

        <Reveal as="figure" delay={0.1} className="[grid-area:portrait] relative min-h-[500px] 550:min-h-[600px] 1080:min-h-0 pointer-events-none">
          <div className="absolute inset-0 overflow-hidden bg-neutral-900">
            <Image
              src={portrait}
              alt="Andranik Taranyan, founder of LeTara Builders, holding his Emmy® at the 65th Emmy Awards"
              fill
              sizes="(min-width: 1080px) 40vw, 100vw"
              placeholder="blur"
              className="object-cover object-[60%_16%]"
            />
            <div className="absolute inset-x-0 bottom-0 h-[62%] bg-gradient-to-t from-black/95 via-black/70 to-transparent" />
            {/* his words in Oswald Light, uppercase, with air between the
                lines: gold marks (the opening one hung in the margin, so the
                words line up with his name), the last line gold, then who
                said it */}
            <figcaption className="absolute inset-x-0 bottom-0 p-6 700:p-8 text-white">
              <blockquote className="font-quote uppercase text-[18px] 550:text-[21px] 1280:text-[23px] leading-[1.3] tracking-[0.02em]">
                {QUOTE.lines.map((line, i) => (
                  <p key={line} className={`text-balance ${i ? "mt-3" : ""}`}>
                    {i === 0 && (
                      <span aria-hidden="true" className="inline-block -ml-[0.32em] w-[0.32em] text-third">
                        “
                      </span>
                    )}
                    {line}
                  </p>
                ))}
                <p className="mt-3 text-third text-balance">
                  {QUOTE.close}
                  <span aria-hidden="true">”</span>
                </p>
              </blockquote>
              <p className="mt-10 flex items-center gap-3">
                <span aria-hidden="true" className="h-px w-8 bg-third" />
                <span className="font-display text-[24px] leading-none tracking-[0.02em]">{founder.name}</span>
              </p>
              <p className="mt-2 font-script text-[11px] uppercase tracking-[0.18em] text-white/60">
                Founder · Licensed contractor
              </p>
            </figcaption>
          </div>
          <Viewfinder />
        </Reveal>
      </div>
    </section>
  );
}
