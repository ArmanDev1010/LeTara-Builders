"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { TbArrowLeft, TbArrowRight, TbPhone } from "react-icons/tb";
import ArrowButton from "@/components/UI/ArrowButton";
import { HEX, InstagramButton } from "@/components/Navigation/HexButton";
import { AreasList, ServicesList } from "@/components/Navigation/NavMenus";
import { phoneDisplay, phoneHref } from "@/data/business";
import { NAV_LINKS } from "@/data/navigation";

const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";

// The phone menu (under 1080px), opened from the bar's menu button. Not HB
// Links' panel of rows (the user asked for a design of its own): the whole
// screen under the bar, like a title card. The links are big and numbered
// like the quote dialog's scenes, rising in one after another; "Services"
// and "Service Areas" each open a screen of their own, sliding in, with a
// way back. At the foot: the number to call, Instagram and the quote
// button. Behind it all, the logo's hexagon, faint, and the hero's gold
// glow. With Reduce Motion it fades instead of rising and sliding.
export default function MobileMenu({ open, pathname, onNavigate, onQuote }) {
  const [section, setSection] = useState("services"); // the section screen's content
  const [deep, setDeep] = useState(false); // showing it, rather than the links
  const backRef = useRef(null);
  const triggers = useRef({});
  const wasDeep = useRef(false);
  const phone = phoneHref();

  // it opens on the links
  useEffect(() => {
    if (open) setDeep(false);
  }, [open]);
  // focus follows the slide: to "Back" going in, to the section's link coming out
  useEffect(() => {
    if (deep) backRef.current?.focus();
    else if (wasDeep.current && open) triggers.current[section]?.focus();
    wasDeep.current = deep;
  }, [deep, open, section]);

  const rise = (i) => ({ transitionDelay: open ? `${100 + i * 70}ms` : "0ms" });
  const riseClass = `transition-[opacity,translate] duration-500 ${EASE} motion-reduce:translate-y-0 ${
    open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
  }`;
  // the screen not showing is lifted out of the flow, so the foot sits under
  // the one that is
  const slide = (shown, from) =>
    `transition-[opacity,translate] duration-300 ${EASE} motion-reduce:translate-x-0 ${
      shown ? "opacity-100 translate-x-0" : `absolute inset-x-0 top-0 opacity-0 ${from} pointer-events-none`
    }`;
  const current = NAV_LINKS.find((link) => link.menu === section);

  return (
    <div
      id="site-menu"
      inert={!open}
      className={`1080:hidden fixed inset-0 -z-10 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
    >
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden bg-[#070605]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_95%_55%_at_90%_108%,rgba(233,166,72,0.2),transparent_70%)]" />
        <svg viewBox="0 0 40 46" className="absolute -right-[24%] top-[16%] w-[90%] max-w-[560px] text-third/[0.1]">
          <polygon points={HEX} fill="none" stroke="currentColor" strokeWidth="0.3" />
        </svg>
      </div>

      <div className="relative h-full overflow-y-auto overscroll-contain">
        <div className="min-h-full flex flex-col px-6 700:px-10 pt-[104px] pb-[max(28px,env(safe-area-inset-bottom))]">
          <div className="relative">
            {/* the links */}
            <ol inert={deep} className={slide(!deep, "-translate-x-8")}>
              {NAV_LINKS.map(({ title, href, menu }, i) => {
                const active = href === pathname;
                const row = "group flex w-full items-baseline gap-4 py-2 text-left cursor-pointer outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-third";
                const inner = (
                  <>
                    <span className="w-7 shrink-0 font-script text-[12px] text-third/70">{String(i + 1).padStart(2, "0")}</span>
                    <span
                      className={`font-display uppercase text-[46px] 400:text-[54px] 700:text-[64px] leading-[0.95] tracking-[0.01em] transition-colors duration-200 group-hover:text-third ${
                        active ? "text-neutral-50" : "text-white/75"
                      }`}
                    >
                      {title}
                    </span>
                    {menu && (
                      <TbArrowRight aria-hidden="true" className="ml-auto self-center shrink-0 text-[22px] text-white/35 transition-colors duration-200 group-hover:text-third" />
                    )}
                  </>
                );
                return (
                  <li key={href} style={rise(i)} className={riseClass}>
                    {menu ? (
                      <button
                        type="button"
                        ref={(el) => (triggers.current[menu] = el)}
                        onClick={() => {
                          setSection(menu);
                          setDeep(true);
                        }}
                        className={row}
                      >
                        {inner}
                      </button>
                    ) : (
                      <Link href={href} onClick={onNavigate} aria-current={active ? "page" : undefined} className={row}>
                        {inner}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ol>

            {/* a section's own screen */}
            <div inert={!deep} className={slide(deep, "translate-x-8")}>
              <button
                ref={backRef}
                type="button"
                onClick={() => setDeep(false)}
                className="flex items-center gap-2 font-script text-[12px] uppercase tracking-[0.16em] text-white/55 hover:text-white transition-colors duration-200 cursor-pointer outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-third"
              >
                <TbArrowLeft aria-hidden="true" /> Menu
              </button>
              <p className="mt-6 font-script text-[11px] uppercase tracking-[0.22em] text-third pointer-events-none">
                {section === "services" ? "What we build" : "Serving Los Angeles"}
              </p>
              <p className="mt-2 font-display uppercase text-[46px] 400:text-[54px] leading-[0.95] tracking-[0.01em] text-neutral-50 pointer-events-none">
                {current?.title}
              </p>
              {section === "services" ? (
                <ServicesList onNavigate={onNavigate} />
              ) : (
                <>
                  <AreasList onNavigate={onNavigate} />
                  <Link
                    href="/#service-areas"
                    onClick={onNavigate}
                    className="group mt-2 inline-flex items-center gap-2 uppercase text-[12px] font-semibold tracking-[0.14em] text-third hover:text-white transition-colors duration-200"
                  >
                    See all service areas
                    <TbArrowRight aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5" />
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* the foot: call, Instagram, the quote */}
          <div style={rise(NAV_LINKS.length)} className={`mt-auto pt-12 ${riseClass}`}>
            <div className="pt-6 border-t border-white/10">
              {phone && (
                <>
                  <p className="font-script text-[11px] uppercase tracking-[0.2em] text-white/45 pointer-events-none">Rather talk it through?</p>
                  <a
                    href={phone}
                    className="mt-2 inline-flex items-center gap-3 font-display text-[34px] leading-none tracking-[0.03em] text-neutral-50 hover:text-third transition-colors duration-200"
                  >
                    <TbPhone aria-hidden="true" className="text-[24px] text-third" />
                    {phoneDisplay()}
                  </a>
                </>
              )}
              <div className="mt-6 flex items-center gap-3">
                <InstagramButton className="w-[44px] h-[51px]" iconClassName="w-[17px] h-[17px]" />
                <ArrowButton type="button" onClick={onQuote} aria-haspopup="dialog" className="flex-1">
                  Get My Free Quote
                </ArrowButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
