"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { TbArrowRight } from "react-icons/tb";
import Reveal from "@/components/Home/Reveal";
import { CONTAINER, H2, HexDot, LEDE, LIGHT, Lines, SECTION, SectionLabel, Viewfinder } from "@/components/Home/parts";
import { SERVICE_AREAS } from "@/data/areas";
import { BUSINESS } from "@/data/business";

const { region } = BUSINESS.address;

// A Google map of an area, embedded (no API key), darkened (gray, inverted,
// softened) in a dark card, on black or on white.
const mapSrc = ({ name, zoom }) =>
  `https://maps.google.com/maps?q=${encodeURIComponent(`${name}, ${region}`)}&z=${zoom}&output=embed`;

// The embed always shows Google's place card in its top left, and North
// Hills' says "No reviews" (the neighborhood's), which reads as LeTara's. So
// the map runs this far above its frame and the card stays out of sight;
// Google's logo and attribution along the bottom stay in view.
const CARD_CROP = 140;

// Where we build, laid out like HB Links' section (in LeTara's
// own design): the heading and a line about it, the areas (data/areas.js,
// placeholders for now) in a grid, then the map across the foot, under a
// bar naming the city it shows. Los Angeles, the target city, leads, wide
// on a phone and on a wide screen. Pick a city and the map goes to it; it
// opens on Los Angeles. A service page passes its own `number`, `heading`
// (its lines) and `intro`.
//
// `tone="light"` puts the section on white (the homepage, 11-10: after the
// black contact form); the map keeps its dark card
// either way (the user asked for the dark map back). The service pages keep
// the section black, between two white sections.
const TONES = {
  dark: {
    section: "section-dark bg-[#0a0a0a] text-neutral-50",
    lede: LEDE.dark,
    idle: "border-white/10 text-white/75 hover:border-white/30 hover:text-white",
    picked: "border-third bg-third/[0.06] text-third",
  },
  light: {
    section: LIGHT,
    lede: LEDE.light,
    idle: "border-black/10 text-black/70 hover:border-black/30 hover:text-black",
    picked: "border-third bg-third/[0.08] text-neutral-950",
  },
};

// `initial` names the area the map opens on (an area page's own); the bar
// over the map links to the picked area's page, unless it's this page or Los
// Angeles (whose page is the homepage).
export default function ServiceAreas({
  number = "06",
  tone = "dark",
  initial,
  heading = ["Building across", "Los Angeles."],
  intro = "From the Valley to the hills around it. Pick a city to see it on the map, and if yours isn't here, ask: we may still build there.",
}) {
  const [active, setActive] = useState(() => Math.max(0, SERVICE_AREAS.findIndex(({ name }) => name === initial)));
  const area = SERVICE_AREAS[active];
  const pathname = usePathname();
  const pageLink = area.zoom !== 10 && area.href !== pathname;
  const c = TONES[tone];
  return (
    <section id="service-areas" className={`${SECTION} ${c.section}`}>
      <div className={CONTAINER}>
        <div className="grid gap-6 1080:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] 1080:items-end">
          <div>
            <Reveal>
              <SectionLabel number={number} tone={tone}>
                Where we build
              </SectionLabel>
            </Reveal>
            <Reveal as="h2" delay={0.05} className={`mt-5 ${H2}`}>
              <Lines lines={heading} />
            </Reveal>
          </div>
          <Reveal as="p" delay={0.1} className={`max-w-xl 1080:pb-1 ${c.lede}`}>
            {intro}
          </Reveal>
        </div>

        <Reveal as="ul" delay={0.1} className="mt-10 1080:mt-12 grid grid-cols-2 550:grid-cols-3 1080:grid-cols-5 gap-2">
          {SERVICE_AREAS.map(({ name }, i) => (
            <li key={name} className="first:col-span-2 550:first:col-span-1 1080:first:col-span-2">
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-pressed={active === i}
                className={`flex w-full h-full items-center gap-2.5 550:gap-3 border px-3 550:px-4 py-3.5 text-left uppercase text-[12px] 550:text-[12.5px] leading-tight tracking-[0.1em] 550:tracking-[0.14em] font-medium cursor-pointer transition-colors duration-200 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-third ${
                  active === i ? c.picked : c.idle
                }`}
              >
                <HexDot filled={active === i} />
                <span>{name}</span>
              </button>
            </li>
          ))}
        </Reveal>

        <Reveal delay={0.15} className="relative mt-8">
          <div className="border border-white/10 bg-[#111]">
            <div className="flex items-center justify-between gap-4 px-5 py-3.5 border-b border-white/10 font-script text-[11px] uppercase tracking-[0.18em] pointer-events-none">
              <span className="flex items-center gap-3 min-w-0">
                <HexDot />
                <span className="text-neutral-50">Map</span>
                <span aria-hidden="true" className="h-3 w-px bg-white/20" />
                <span className="truncate text-white/60">
                  {area.name}, {region}
                </span>
              </span>
              {pageLink ? (
                <Link
                  href={area.href}
                  className="group shrink-0 inline-flex items-center gap-1.5 text-third pointer-events-auto hover:text-white transition-colors duration-200"
                >
                  <span className="max-550:hidden">Visit</span> {area.name}
                  <TbArrowRight aria-hidden="true" className="text-[13px] transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>
              ) : (
                <span className="max-700:hidden shrink-0 text-white/35">Los Angeles County</span>
              )}
            </div>
            <div className="p-2">
              <div className="relative h-[280px] 400:h-[300px] 550:h-[340px] 800:h-[420px] 1280:h-[460px] overflow-hidden bg-[#141414]">
                <iframe
                  key={area.name}
                  title={`Map of ${area.name}, ${region}`}
                  src={mapSrc(area)}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  style={{ top: -CARD_CROP, height: `calc(100% + ${CARD_CROP}px)` }}
                  className="absolute left-0 w-full border-0 [filter:grayscale(1)_invert(0.92)_contrast(0.85)]"
                />
              </div>
            </div>
          </div>
          <Viewfinder />
        </Reveal>
      </div>
    </section>
  );
}
