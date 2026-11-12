"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { TbArrowRight, TbChevronDown, TbPhone } from "react-icons/tb";
import ArrowButton from "@/components/UI/ArrowButton";
import { HEX, InstagramButton } from "@/components/Navigation/HexButton";
import { AreasList, ServicesList } from "@/components/Navigation/NavMenus";
import { phoneDisplay, phoneHref } from "@/data/business";
import { NAV_LINKS } from "@/data/navigation";

const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";

// The phone menu (under 1080px), opened from the bar's menu button. Not HB
// Links' panel of rows (the user asked for a design of its own): the whole
// screen under the bar, like a title card. The links are numbered like the
// quote dialog's scenes, rising in one after another. "Services" and
// "Service Areas" drop their list open right under them, one at a time, a
// chevron turning (11-10: the user found the links too big, and sliding to
// a screen of their own felt like going to another page). The list's height
// opens smoothly and its rows fade and rise in one after another
// (.menu-drop in globals.css; the user asked for a transition), with Reduce
// Motion too, the rows then only fading. At the foot: the
// number to call, Instagram and the quote button. Behind it all, the logo's
// hexagon, faint, and the hero's gold glow. With Reduce Motion it fades
// instead of rising.
export default function MobileMenu({ open, pathname, onNavigate, onQuote }) {
  const [expanded, setExpanded] = useState(null); // the dropdown open, if any
  const phone = phoneHref();

  // it opens with every dropdown closed
  useEffect(() => {
    if (open) setExpanded(null);
  }, [open]);

  const rise = (i) => ({ transitionDelay: open ? `${100 + i * 70}ms` : "0ms" });
  const riseClass = `transition-[opacity,translate] duration-500 ${EASE} motion-reduce:translate-y-0 ${
    open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
  }`;
  const row =
    "group flex w-full items-center gap-4 py-3 text-left cursor-pointer outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-third";

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
        <div className="min-h-full flex flex-col px-6 700:px-10 pt-[100px] pb-[max(28px,env(safe-area-inset-bottom))]">
          <ol className="border-t border-white/10">
            {NAV_LINKS.map(({ title, href, menu }, i) => {
              const active = href === pathname;
              const isOpen = menu && expanded === menu;
              const word = (
                <>
                  <span className="w-7 shrink-0 font-script text-[12px] text-third/70">{String(i + 1).padStart(2, "0")}</span>
                  <span
                    className={`font-display uppercase text-[32px] 400:text-[36px] 700:text-[42px] leading-none tracking-[0.02em] transition-colors duration-200 group-hover:text-third ${
                      active || isOpen ? "text-neutral-50" : "text-white/75"
                    }`}
                  >
                    {title}
                  </span>
                </>
              );
              return (
                <li key={href} style={rise(i)} className={`border-b border-white/10 ${riseClass}`}>
                  {menu ? (
                    <>
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls={`menu-${menu}`}
                        onClick={() => setExpanded(isOpen ? null : menu)}
                        className={row}
                      >
                        {word}
                        <TbChevronDown
                          aria-hidden="true"
                          className={`ml-auto shrink-0 text-[22px] transition-[transform,color] duration-300 ${EASE} ${
                            isOpen ? "[transform:rotate(180deg)] text-third" : "text-white/40 group-hover:text-third"
                          }`}
                        />
                      </button>
                      {/* its list, dropping open under it */}
                      <div
                        id={`menu-${menu}`}
                        inert={!isOpen}
                        data-open={isOpen || undefined}
                        className={`menu-drop grid transition-[grid-template-rows] duration-500 ${EASE} ${
                          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                        }`}
                      >
                        <div className="overflow-hidden">
                          <div className="pl-11 pb-4 -mt-2">
                            {menu === "services" ? (
                              <ServicesList onNavigate={onNavigate} />
                            ) : (
                              <>
                                <AreasList onNavigate={onNavigate} />
                                <Link
                                  href="/#service-areas"
                                  onClick={onNavigate}
                                  className="menu-drop-more group mt-1 inline-flex items-center gap-2 uppercase text-[12px] font-semibold tracking-[0.14em] text-third hover:text-white transition-colors duration-200"
                                >
                                  See all service areas
                                  <TbArrowRight aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5" />
                                </Link>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <Link href={href} onClick={onNavigate} aria-current={active ? "page" : undefined} className={row}>
                      {word}
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>

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
