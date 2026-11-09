"use client";

import { useState } from "react";
import { TbPhone } from "react-icons/tb";
import Reveal from "@/components/Home/Reveal";
import { CONTAINER, H2, LEDE, LIGHT, SECTION, SectionLabel } from "@/components/Home/parts";
import { HEX } from "@/components/Navigation/HexButton";
import QuoteButton from "@/components/Quote/QuoteButton";
import { phoneDisplay, phoneHref } from "@/data/business";
import { FAQS } from "@/data/faq";
import { buildFAQSchema } from "@/lib/seo";

function Item({ faq, index, open, onToggle }) {
  const id = `faq-${index}`;
  return (
    <li className="border-b border-black/10">
      <h3>
        <button
          type="button"
          id={`${id}-q`}
          aria-expanded={open}
          aria-controls={id}
          onClick={onToggle}
          className="group flex w-full items-start gap-4 700:gap-6 py-6 text-left cursor-pointer outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-third"
        >
          <span className="w-9 shrink-0 pt-[5px] pointer-events-none font-script text-[12px] text-black/35 transition-colors duration-200 group-hover:text-third">
            Q.{String(index + 1).padStart(2, "0")}
          </span>
          <span
            className={`flex-1 text-[17.5px] 700:text-[20px] font-semibold leading-snug pointer-events-none transition-colors duration-200 ${
              open ? "text-neutral-950" : "text-black/75 group-hover:text-neutral-950"
            }`}
          >
            {faq.question}
          </span>
          {/* a hexagon with a plus that turns to a minus, gold when open */}
          <span aria-hidden="true" className="relative grid place-items-center w-[30px] h-[34px] shrink-0 pointer-events-none">
            <svg viewBox="0 0 40 46" className="absolute inset-0 w-full h-full">
              <polygon
                points={HEX}
                strokeWidth="2"
                className={`transition-[fill,stroke] duration-300 ${open ? "fill-third stroke-third" : "fill-transparent stroke-black/20 group-hover:stroke-black/50"}`}
              />
            </svg>
            <span className="relative block w-3 h-3">
              <span className="absolute left-0 top-[5px] w-3 h-[2px] bg-neutral-950" />
              <span
                className={`absolute left-[5px] top-0 w-[2px] h-3 bg-neutral-950 transition-transform duration-300 motion-reduce:transition-none ${
                  open ? "rotate-90 scale-y-0" : ""
                }`}
              />
            </span>
          </span>
        </button>
      </h3>
      <div
        id={id}
        role="region"
        aria-labelledby={`${id}-q`}
        inert={!open}
        className={`grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <p className="pl-[52px] 700:pl-[60px] pr-2 700:pr-12 pb-7 text-[15.5px] leading-relaxed text-black/60 pointer-events-none">{faq.answer}</p>
        </div>
      </div>
    </li>
  );
}

// The FAQ, on white: the heading, and a way to ask anything else, held in
// place on the left while the questions open on the right, one at a time,
// numbered in the typewriter face. Its FAQPage markup comes from the same
// list, so it always matches what's shown (data/faq.js).
export default function FAQ() {
  const [open, setOpen] = useState(0);
  const phone = phoneHref();
  return (
    <section id="faq" className={`${SECTION} ${LIGHT}`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildFAQSchema(FAQS)) }} />
      <div className={`${CONTAINER} grid gap-12 1080:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] 1440:gap-24`}>
        <div className="1080:sticky 1080:top-32 1080:self-start">
          <Reveal>
            <SectionLabel number="06" tone="light">
              Questions
            </SectionLabel>
          </Reveal>
          <Reveal as="h2" delay={0.05} className={`mt-5 ${H2}`}>
            Questions, <br />
            answered.
          </Reveal>
          <Reveal as="p" delay={0.1} className={`mt-5 max-w-sm ${LEDE.light}`}>
            Don&apos;t see yours? Ask us directly. There&apos;s no such thing as a small question when it&apos;s
            your home.
          </Reveal>
          <Reveal delay={0.15} className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
            <QuoteButton tone="light" />
            {phone && (
              <a
                href={phone}
                className="inline-flex items-center gap-2 text-[15px] font-semibold text-neutral-950 hover:text-black/60 transition-colors duration-200"
              >
                <TbPhone aria-hidden="true" className="text-third text-[18px]" />
                {phoneDisplay()}
              </a>
            )}
          </Reveal>
        </div>

        <Reveal as="ol" delay={0.1} className="border-t border-black/10">
          {FAQS.map((faq, i) => (
            <Item key={faq.question} faq={faq} index={i} open={open === i} onToggle={() => setOpen(open === i ? null : i)} />
          ))}
        </Reveal>
      </div>
    </section>
  );
}
