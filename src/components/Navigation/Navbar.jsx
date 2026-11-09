"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useModal } from "@/context/ModalContext";
import ArrowButton from "@/components/UI/ArrowButton";
import Logo from "@/components/UI/Logo";
import { HexButton, InstagramButton } from "@/components/Navigation/HexButton";
import MobileMenu from "@/components/Navigation/MobileMenu";
import { AreasPanel, Chevron, ServicesPanel } from "@/components/Navigation/NavMenus";
import { NAV_LINKS } from "@/data/navigation";

// The bar's ends come to a point at the logo hexagon's own 120°: each reaches
// in half the bar's height times tan 30°.
const tipFor = (height) => (height / 2) * Math.tan(Math.PI / 6);

// A little grace before a dropdown closes, so the pointer can cross from its
// link to its panel (or to the next link) without it flickering shut.
const CLOSE_DELAY_MS = 120;

const cancelClose = (timer) => {
  clearTimeout(timer.current);
  timer.current = null;
};
// Closes after CLOSE_DELAY_MS unless something cancels it first; a close
// already on its way isn't pushed back (the pointer moving about outside the
// menu would otherwise keep it open).
const closeSoon = (timer, close) => {
  if (timer.current) return;
  timer.current = setTimeout(() => {
    timer.current = null;
    close();
  }, CLOSE_DELAY_MS);
};

const within = (rect, x, y) => rect && x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;

// Whether (x, y) falls inside a polygon of [x, y] points (ray casting).
function inPolygon(x, y, points) {
  let inside = false;
  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    const [xi, yi] = points[i];
    const [xj, yj] = points[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

// The safe zone between an open dropdown's link and its panel, after the
// shape the user drew on HB Links: tight around the link at the top, flaring
// out below it and down to the panel across about its middle half (21% to
// 73% of its width), not the whole width. Inside it the menu stays open and
// the links it crosses don't react, so the pointer can cut diagonally from
// "Service Areas" to the left of its panel, across "Services", without the
// menu switching on the way (on HB Links it closed, crossing "Home").
function safeZone(trigger, panel) {
  const flare = trigger.top + trigger.height * 0.55;
  return [
    [trigger.left - 10, trigger.top],
    [trigger.right + 10, trigger.top],
    [trigger.right + 40, flare],
    [panel.left + panel.width * 0.73, panel.top + 4],
    [panel.left + panel.width * 0.21, panel.top + 4],
    [trigger.left - 45, flare],
  ];
}

// Whether (x, y) is over dropdown `name`: its link (the <li>), its panel, or
// the safe zone between them.
function overMenu(name, triggers, x, y) {
  const trigger = triggers[name]?.getBoundingClientRect();
  const panel = document.getElementById(`nav-${name}`)?.getBoundingClientRect();
  if (!trigger || !panel) return false;
  return within(trigger, x, y) || within(panel, x, y) || inPolygon(x, y, safeZone(trigger, panel));
}

function useSize(ref) {
  const [size, setSize] = useState(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) =>
      setSize({ width: entry.contentRect.width, height: entry.contentRect.height }),
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);
  return size;
}

// The navbar: a long hexagon of dark frosted glass floating over the top of
// the page, its ends pointed like the logo's mark (the user's sketch). The
// logo on the left, the links in the middle, Instagram and "Get My Free
// Quote" on the right. "Services" and "Service Areas" open dropdowns: on
// hover or their chevron on a wide screen, as on HB Links. Under 1080px the
// links, Instagram and the button move into the full-screen menu
// (MobileMenu).
export default function Navbar() {
  const pathname = usePathname();
  const { toggleModal, menuActive, setMenuActive } = useModal();
  const [menu, setMenu] = useState(null); // the open dropdown, wide screen
  const barRef = useRef(null);
  const closeTimer = useRef(null);
  const triggerEls = useRef({}); // the dropdowns' <li>s, by menu name
  const size = useSize(barRef);

  // `event` is the mouseenter that asked: one on another link inside the open
  // dropdown's safe zone (crossed on the way to its panel) is ignored.
  const openMenu = (name, event) => {
    if (event && menu && menu !== name && overMenu(menu, triggerEls.current, event.clientX, event.clientY)) return;
    cancelClose(closeTimer);
    setMenu(name);
  };
  const closeMenuSoon = () => closeSoon(closeTimer, () => setMenu(null));
  const closeAll = () => {
    cancelClose(closeTimer);
    setMenu(null);
    setMenuActive(false);
  };

  // While a dropdown is open, follow the pointer: over the open menu (its
  // link, its panel or the safe zone between) it stays open; over the other
  // dropdown's link, outside the safe zone, that one opens; anywhere else it
  // closes.
  useEffect(() => {
    if (!menu) return;
    const onMove = ({ clientX: x, clientY: y }) => {
      if (overMenu(menu, triggerEls.current, x, y)) return cancelClose(closeTimer);
      const other = NAV_LINKS.find(
        ({ menu: name }) => name && name !== menu && within(triggerEls.current[name]?.getBoundingClientRect(), x, y),
      );
      if (other) {
        cancelClose(closeTimer);
        setMenu(other.menu);
        return;
      }
      closeSoon(closeTimer, () => setMenu(null));
    };
    document.addEventListener("pointermove", onMove);
    return () => document.removeEventListener("pointermove", onMove);
  }, [menu]);
  const openQuote = () => {
    closeAll();
    toggleModal();
  };

  // Escape closes whatever's open; so does scrolling, for a dropdown.
  useEffect(() => {
    if (!menu && !menuActive) return;
    const onKey = (event) => {
      if (event.key !== "Escape") return;
      setMenu(null);
      setMenuActive(false);
    };
    const onScroll = () => setMenu(null);
    window.addEventListener("keydown", onKey);
    if (menu) window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll);
    };
  }, [menu, menuActive, setMenuActive]);
  // A new page closes them.
  useEffect(() => {
    setMenu(null);
    setMenuActive(false);
  }, [pathname, setMenuActive]);
  useEffect(() => () => clearTimeout(closeTimer.current), []);

  const tip = size ? tipFor(size.height) : 18;
  const shape = `polygon(${tip}px 0, calc(100% - ${tip}px) 0, 100% 50%, calc(100% - ${tip}px) 100%, ${tip}px 100%, 0 50%)`;
  const isActive = (href) => href === pathname;
  const linkTone = (href) => (isActive(href) ? "text-neutral-50" : "text-white/70");

  // (On a big screen the bar, its spacing and its contents grow by
  // --wide-zoom, globals.css. The links' <li>s aren't zoomed themselves: the
  // dropdowns are placed and hover-tracked from their boxes.)
  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 top-0 z-[999] px-3 400:px-4 700:px-6 1080:px-[calc(2rem*var(--wide-zoom))] pt-3 700:pt-4 1080:pt-[calc(1.25rem*var(--wide-zoom))]"
    >
      <div className="relative">
        <div ref={barRef} className="relative h-[60px] 1080:h-[calc(68px*var(--wide-zoom))]">
          {/* the glass, cut to the bar's shape, and its outline */}
          <div
            aria-hidden="true"
            style={{ clipPath: shape }}
            className="absolute inset-0 bg-[#0d0c0b]/55 backdrop-blur-xl backdrop-saturate-150"
          />
          {size && (
            <svg aria-hidden="true" width={size.width} height={size.height} className="absolute inset-0 pointer-events-none">
              <polygon
                points={[
                  [tip, 0.5],
                  [size.width - tip, 0.5],
                  [size.width - 0.5, size.height / 2],
                  [size.width - tip, size.height - 0.5],
                  [tip, size.height - 0.5],
                  [0.5, size.height / 2],
                ]
                  .map(([x, y]) => `${Math.round(x * 100) / 100},${Math.round(y * 100) / 100}`)
                  .join(" ")}
                fill="none"
                stroke="rgba(255,255,255,0.16)"
                strokeWidth="1"
              />
            </svg>
          )}

          <div className="relative flex items-center justify-between h-full pl-[34px] pr-[30px] 1080:pl-[calc(40px*var(--wide-zoom))] 1080:pr-[calc(36px*var(--wide-zoom))]">
            <Link href="/" className="wide-zoom shrink-0 text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-third">
              <Logo layout="horizontal" className="h-[32px] 700:h-[35px] 1080:h-[40px]" />
            </Link>

            <ul className="max-1080:hidden absolute inset-y-0 left-1/2 -translate-x-1/2 flex gap-6 1280:gap-[calc(2.75rem*var(--wide-zoom))]">
              {NAV_LINKS.map(({ title, href, menu: name }) => {
                const link = `uppercase text-[12px] font-semibold tracking-[0.16em] transition-colors duration-200 hover:text-third focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-third ${linkTone(href)}`;
                if (!name)
                  return (
                    <li key={href} className="flex items-center" onMouseEnter={(event) => openMenu(null, event)}>
                      <Link href={href} aria-current={isActive(href) ? "page" : undefined} className={`wide-zoom ${link}`}>
                        {title}
                      </Link>
                    </li>
                  );
                const open = menu === name;
                return (
                  <li
                    key={href}
                    ref={(el) => {
                      triggerEls.current[name] = el;
                    }}
                    className="relative flex items-center"
                    onMouseEnter={(event) => openMenu(name, event)}
                    onMouseLeave={closeMenuSoon}
                    onBlur={(event) => !event.currentTarget.contains(event.relatedTarget) && setMenu(null)}
                  >
                    <div className="wide-zoom flex items-center gap-2">
                      <Link href={href} onClick={closeAll} className={`${link} ${open ? "!text-third" : ""}`}>
                        {title}
                      </Link>
                      <button
                        type="button"
                        aria-label={`${title} menu`}
                        aria-expanded={open}
                        aria-controls={`nav-${name}`}
                        onClick={() => setMenu(open ? null : name)}
                        className={`grid place-items-center w-5 h-5 cursor-pointer transition-colors duration-200 hover:text-third focus-visible:outline-2 focus-visible:outline-third ${
                          open ? "text-third" : "text-white/55"
                        }`}
                      >
                        <Chevron open={open} />
                      </button>
                    </div>
                    {/* a gold mark under the open link, meeting its panel's gold rule */}
                    <span
                      aria-hidden="true"
                      className={`absolute inset-x-0 -bottom-px h-[2px] bg-third transition-opacity duration-200 ${open ? "opacity-100" : "opacity-0"}`}
                    />
                    {/* The fade is on the glass itself: while anything around a
                        backdrop blur is see-through, browsers can't blur
                        behind it, so a fading wrapper made the frost pop in
                        at the end. */}
                    <div
                      id={`nav-${name}`}
                      inert={!open}
                      className={`absolute top-full left-1/2 -translate-x-1/2 pt-2 transition-[translate] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
                        open ? "translate-y-0 duration-[380ms]" : "-translate-y-1.5 pointer-events-none duration-200"
                      }`}
                    >
                      <div
                        className={`wide-zoom relative bg-[#0d0c0b]/85 backdrop-blur-xl backdrop-saturate-150 border border-white/10 shadow-[0_28px_60px_-24px_rgba(0,0,0,0.9)] transition-opacity ease-[cubic-bezier(0.22,1,0.36,1)] ${
                          open ? "opacity-100 duration-[380ms]" : "opacity-0 duration-200"
                        }`}
                      >
                        <span aria-hidden="true" className="absolute inset-x-[-1px] -top-px h-[2px] bg-third" />
                        {name === "services" ? (
                          <ServicesPanel onNavigate={closeAll} onQuote={openQuote} />
                        ) : (
                          <AreasPanel onNavigate={closeAll} />
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="wide-zoom flex items-center gap-3 1280:gap-4">
              <InstagramButton
                className="max-700:hidden w-[42px] h-[48px] 1080:w-[46px] 1080:h-[53px]"
                iconClassName="w-4 h-4 1080:w-[17px] 1080:h-[17px]"
              />
              <ArrowButton type="button" size="sm" onClick={openQuote} aria-haspopup="dialog" className="max-550:hidden">
                Get My Free Quote
              </ArrowButton>
              <HexButton
                type="button"
                onClick={() => setMenuActive(!menuActive)}
                aria-label={menuActive ? "Close menu" : "Open menu"}
                aria-expanded={menuActive}
                aria-controls="site-menu"
                className="1080:hidden w-[42px] h-[48px]"
              >
                {/* three 2px lines on whole pixels (1.5px lines on half
                    pixels blurred unevenly, the last one looking thinner);
                    open, the outer two cross and the middle one goes */}
                <span className="relative block w-4 h-3">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className={`absolute left-0 w-full h-[2px] bg-current transition-[top,rotate,opacity] duration-300 motion-reduce:transition-none ${
                        menuActive
                          ? `top-[5px] ${["rotate-45", "opacity-0", "-rotate-45"][i]}`
                          : ["top-0", "top-[5px]", "top-[10px]"][i]
                      }`}
                    />
                  ))}
                </span>
              </HexButton>
            </div>
          </div>
        </div>

        <MobileMenu open={menuActive} pathname={pathname} onNavigate={closeAll} onQuote={openQuote} />
      </div>
    </nav>
  );
}
