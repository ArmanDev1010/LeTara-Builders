import Link from "next/link";
import { TbArrowRight } from "react-icons/tb";
import Reveal from "@/components/Home/Reveal";
import { CONTAINER, H2, LEDE, LIGHT, Lines, PhotoStandIn, SECTION, SectionLabel } from "@/components/Home/parts";
import { HEX } from "@/components/Navigation/HexButton";
import { SERVICES } from "@/data/services";

const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";

// A cut corner, top right: the navbar's pointed ends, on a card.
const CHAMFER = "[clip-path:polygon(0_0,calc(100%-22px)_0,100%_22px,100%_100%,0_100%)]";

// The service's icon on a hexagon in the card's top left, dark-filled with
// a gold edge. It fills gold when the card is hovered.
function ServiceIcon({ icon: Icon }) {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute z-[2] top-5 left-5 700:top-7 700:left-7 grid place-items-center w-11 h-[50px] text-third"
    >
      <svg viewBox="0 0 40 46" className="absolute inset-0 w-full h-full">
        <polygon
          points={HEX}
          stroke="currentColor"
          strokeWidth="1.5"
          className="fill-black/60 transition-[fill] duration-300 card-on:fill-third"
        />
      </svg>
      <Icon className="relative text-[20px] transition-colors duration-300 card-on:text-neutral-950" />
    </span>
  );
}

// The bento's spans: the lead card tall on the left (across the top below
// 1080px), the other four two by two beside it (under it below 1080px).
const LEAD = "700:col-span-2 1080:col-span-1 1080:row-span-2 min-h-[380px] 700:min-h-[340px] 1080:min-h-0";
const CARD = "min-h-[220px] 700:min-h-[240px] 1080:min-h-0";

// A service as a card that opens its page. The whole card is the link: it
// lies over the card, under the text, and the text lets clicks through.
// (The lead card's quote button came off on 11-10, at the user's request.)
//
// On hover (or the link's keyboard focus) the stand-in eases in closer, the
// icon's hexagon and the arrow box fill gold, the arrow nudges on, the text
// lifts a little and a gold rule draws in along the foot. With Reduce
// Motion only the colors change and the rule fades in. The arrow box is
// always there, so a phone shows the card opens too.
function ServiceCard({ service, index }) {
  const { title, kicker, blurb, text, icon, href, slug } = service;
  const main = index === 0;
  const titleId = `card-${slug}`;
  return (
    <Reveal
      as="li"
      delay={0.06 * index}
      className={`service-card relative isolate overflow-hidden bg-[#0b0b0b] text-neutral-50 ${CHAMFER} ${index === 0 ? LEAD : CARD}`}
    >
      <div className={`pointer-events-none absolute inset-0 transition-[scale] duration-[900ms] ${EASE} motion-safe:card-on:scale-[1.05]`}>
        <PhotoStandIn icon={icon} />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />
      <ServiceIcon icon={icon} />
      {/* a gold edge along the cut corner */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-[calc(100%-22px)] w-[31px] h-[1.5px] bg-third origin-left rotate-45"
      />
      {/* a gold rule along the foot, drawn in on hover */}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute z-[2] inset-x-0 bottom-0 h-[3px] bg-third origin-left transition-[scale,opacity] duration-500 ${EASE} motion-safe:scale-x-0 motion-safe:card-on:scale-x-100 motion-reduce:opacity-0 motion-reduce:card-on:opacity-100`}
      />

      <Link
        href={href}
        aria-labelledby={titleId}
        className="service-link absolute inset-0 z-[1] outline-none focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-third"
      />

      <div
        className={`relative z-[2] h-full flex flex-col justify-end p-5 pt-24 700:p-7 700:pt-24 pointer-events-none transition-[translate] duration-500 ${EASE} motion-safe:card-on:-translate-y-1 ${
          main ? "max-700:pr-16" : "pr-16 700:pr-20"
        }`}
      >
        <p className="font-script text-[11px] uppercase tracking-[0.2em] text-third">
          {String(index + 1).padStart(2, "0")} / {kicker}
        </p>
        <h3
          id={titleId}
          className={`mt-2 font-display uppercase leading-[0.95] tracking-[0.01em] ${
            main ? "text-[40px] 1440:text-[46px]" : "text-[28px] 1440:text-[32px]"
          }`}
        >
          {title}
        </h3>
        {main ? (
          <p className="mt-3 max-w-md text-[15.5px] leading-relaxed text-white/70">{text}</p>
        ) : (
          <p className="mt-2 text-[14px] leading-snug text-white/60">{blurb}</p>
        )}
      </div>

      {/* the arrow: the card opens */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute z-[2] right-5 bottom-5 700:right-7 700:bottom-7 grid place-items-center w-10 h-10 border border-white/25 text-neutral-50 transition-colors duration-300 card-on:bg-third card-on:border-third card-on:text-neutral-950"
      >
        <TbArrowRight className={`text-[18px] transition-[translate] duration-300 ${EASE} motion-safe:card-on:translate-x-0.5`} />
      </span>
    </Reveal>
  );
}

// What we build, on white. Design-build is the umbrella (the heading), not
// a card: every project is designed and built by the one team. The five
// services in Andranik's order (his yard sign), New Construction leading as
// the big card, the other four beside it (after a bento layout the user
// liked). Each card is black, with the service's icon large and faint in
// its top right and on a hexagon in its top left, and its name over it (no
// photos: the user's call, 11-11).
// An area page passes its own `number`, `heading` (its lines) and `intro`.
export default function Services({
  number = "02",
  heading = ["Design-Build,", "under one roof."],
  intro = "Every project here is design-build: one team designs it, takes it through permits and builds it, so nothing gets lost between the drawings and the job site.",
}) {
  return (
    <section id="services" className={`${SECTION} ${LIGHT}`}>
      <div className={CONTAINER}>
        <div className="grid gap-6 1080:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] 1080:items-end">
          <div>
            <Reveal>
              <SectionLabel number={number} tone="light">
                What we build
              </SectionLabel>
            </Reveal>
            <Reveal as="h2" delay={0.05} className={`mt-5 ${H2}`}>
              <Lines lines={heading} />
            </Reveal>
          </div>
          <Reveal as="p" delay={0.1} className={`${LEDE.light} max-w-xl 1080:pb-1`}>
            {intro}
          </Reveal>
        </div>

        <ul className="mt-10 1080:mt-12 grid gap-3 700:grid-cols-2 1080:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)_minmax(0,1fr)] 1080:grid-rows-[repeat(2,minmax(230px,auto))] 1440:grid-rows-[repeat(2,minmax(250px,auto))]">
          {SERVICES.map((service, i) => (
            <ServiceCard key={service.title} service={service} index={i} />
          ))}
        </ul>
      </div>
    </section>
  );
}
