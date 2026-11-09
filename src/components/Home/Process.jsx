"use client";

import { useInView } from "framer-motion";
import { useRef } from "react";
import Reveal from "@/components/Home/Reveal";
import { CONTAINER, H2, LEDE, LIGHT, SECTION, SectionLabel } from "@/components/Home/parts";
import { HEX } from "@/components/Navigation/HexButton";
import QuoteButton from "@/components/Quote/QuoteButton";
import { phoneDisplay, phoneHref } from "@/data/business";
import { PROCESS } from "@/data/process";

const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";
const STEP_DELAY = 320; // ms between one step lighting up and the next

// A step in its own bordered box, its hexagon set on the box's edge: the
// top edge on a wide screen, the left on a phone, where the line runs.
function Step({ step, index, lit }) {
  const { label, icon: Icon, text } = step;
  const delay = { transitionDelay: lit ? `${index * STEP_DELAY}ms` : "0ms" };
  return (
    <li className="relative border border-black/10 bg-white pl-12 pr-5 py-6 1080:px-4 1280:px-6 1080:pt-12 1080:pb-8 1080:text-center pointer-events-none">
      <span className="absolute z-[2] left-0 top-5 -translate-x-1/2 1080:left-1/2 1080:top-0 1080:-translate-y-1/2 grid place-items-center w-12 h-[55px]">
        <svg aria-hidden="true" viewBox="0 0 40 46" className="absolute inset-0 w-full h-full">
          <polygon
            points={HEX}
            strokeWidth="1.5"
            style={delay}
            className={`transition-[fill,stroke] duration-500 ${lit ? "fill-third stroke-third" : "fill-white stroke-black/20"}`}
          />
        </svg>
        <Icon
          aria-hidden="true"
          style={delay}
          className={`relative text-[20px] transition-colors duration-500 ${lit ? "text-neutral-950" : "text-black/55"}`}
        />
      </span>
      <div
        style={delay}
        className={`transition-[opacity,transform] duration-700 ${EASE} ${
          lit ? "opacity-100 [transform:none]" : "opacity-0 [transform:translateY(12px)] motion-reduce:[transform:translateY(4px)]"
        }`}
      >
        <p className="font-script text-[11px] uppercase tracking-[0.2em] text-black/45">Step {String(index + 1).padStart(2, "0")}</p>
        <h3 className="mt-1.5 font-display uppercase text-[26px] leading-none tracking-[0.01em]">{label}</h3>
        <p className="mt-3 text-[15px] 1080:text-[14px] 1280:text-[15px] leading-relaxed text-black/60">{text}</p>
      </div>
    </li>
  );
}

// How we work, on white: the five steps (data/process.js, the same as the
// thank-you's tracker), each in a bordered box. A line along the boxes'
// edge draws itself in gold as it comes into view and each hexagon lights
// up as it goes: across their tops on a wide screen, down their left side
// on a phone. Not HB Links' grid of cards. With Reduce Motion it all
// lights at once, the steps rising only a little. The moving parts use
// `transform` (not Tailwind's `translate`/`scale` properties), which every
// browser animates off the main thread, so it stays smooth on a phone.
export default function Process() {
  const listRef = useRef(null);
  const lit = useInView(listRef, { once: true, margin: "0px 0px -20% 0px" });
  const phone = phoneHref();
  return (
    <section id="process" className={`${SECTION} ${LIGHT}`}>
      <div className={CONTAINER}>
        <div className="flex flex-col items-start 1080:items-center 1080:text-center">
          <Reveal>
            <SectionLabel number="03" tone="light">
              How we work
            </SectionLabel>
          </Reveal>
          <Reveal as="h2" delay={0.05} className={`mt-5 ${H2}`}>
            Five steps, <br />
            one team.
          </Reveal>
          <Reveal as="p" delay={0.1} className={`mt-5 max-w-xl ${LEDE.light}`}>
            How a project goes with us, from the first call to the final walkthrough.
          </Reveal>
        </div>

        <ol ref={listRef} className="relative mt-10 1080:mt-12 grid gap-3 pl-6 1080:pl-0 1080:pt-[27px] 1080:grid-cols-5">
          {/* the line, over the boxes' edge: down their left side on a
              phone, across their tops on a wide screen */}
          <span
            aria-hidden="true"
            className="absolute z-[1] left-6 top-0 bottom-0 w-px bg-black/10 1080:left-0 1080:right-0 1080:top-[27px] 1080:bottom-auto 1080:w-auto 1080:h-px"
          >
            <span
              className={`absolute inset-0 bg-third origin-top 1080:origin-left transition-transform duration-[1800ms] ${EASE} motion-reduce:duration-0 ${
                lit ? "[transform:none]" : "[transform:scaleY(0)] 1080:[transform:scaleX(0)]"
              }`}
            />
          </span>
          {PROCESS.map((step, i) => (
            <Step key={step.label} step={step} index={i} lit={lit} />
          ))}
        </ol>

        <Reveal className="mt-12 1080:mt-16 flex flex-col 900:flex-row 900:items-center justify-between gap-6 border-t border-black/10 pt-8">
          <p className="font-display uppercase text-[28px] 700:text-[32px] leading-none tracking-[0.01em] pointer-events-none">
            Step one takes a minute.
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
            <QuoteButton tone="light" />
            {phone && (
              <a
                href={phone}
                className="font-script text-[12.5px] uppercase tracking-[0.14em] text-black/55 hover:text-black transition-colors duration-200"
              >
                or call <span className="text-neutral-950">{phoneDisplay()}</span>
              </a>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
