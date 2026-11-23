"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { TbArrowRight } from "react-icons/tb";
import { sceneFonts } from "@/components/Hero/intro/layout";
import { ASSETS } from "@/components/Hero/studio/assets";
import { drawDiagram } from "@/components/Hero/studio/studio";
import Reveal from "@/components/Home/Reveal";
import { CONTAINER, H2, LEDE, LIGHT, Lines, SECTION, SectionLabel } from "@/components/Home/parts";
import { HEX } from "@/components/Navigation/HexButton";
import PartnerCard from "@/components/UI/PartnerCard";
import { SERVICES } from "@/data/services";

const CUT_TIME = 1300; // ms the cutaway takes to open, once in view
const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";
// a cut corner, top right: the navbar's points, as on the homepage's cards
const CHAMFER = "[clip-path:polygon(0_0,calc(100%-20px)_0,100%_20px,100%_100%,0_100%)]";
// While the drawing is held above the cards on a phone or tablet, it's this
// much of its size, so more of the cards shows (the user asked, 11-23);
// sitting in its place it's full size.
const HELD_SCALE = "group-data-[stuck]/pin:[transform:scale(0.75)]";
const HELD_SCALE_Y = "group-data-[stuck]/pin:[transform:scaleY(0.75)]";

// The homepage's "What we build", on white (11-16: Andranik liked it best,
// so it moved here from the area pages, which took the homepage's bento,
// Area/AreaServices). The area pages' Craftsman home (the `property` asset)
// drawn as an architect's line drawing, whole, with a cutaway over the
// single-story wing for the remodel (its roof and the top of its walls
// dashed, the cut walls filled dark, the living room, kitchen and bath
// inside), beside a card for each service (data/services.js: its slug as the
// drawing's layer, its `home` line and its page). The cards are dark, cut at
// the corner: the service's number large in outline, its icon on a hexagon,
// its name and a line, an arrow box. The whole card opens the service's page.
// Pointing at or tabbing to one lights its part of the home gold in the
// drawing, runs a gold bar down the card's whole side and fills its hexagon
// and arrow box gold. Commercial has no part in the home: its card spans the
// foot and lights only itself. As the drawing scrolls into view the cutaway
// opens: the roof and walls over the rooms fade into their dashed outline (a
// fade, so the same with Reduce Motion). On a touch screen, with nothing to
// point with, the card at the middle of the screen lights up as it's
// scrolled to (11-23: Andranik saw the section do nothing on his phone);
// where the drawing is above the cards it's held under the navbar while
// they scroll beneath it (`services-pin`, globals.css), on white, a fade
// under it, a quarter smaller than in its place (HELD_SCALE). On a phone
// every card is as tall as the tallest, New Construction's (11-23). Under it all, LeTara's partner for
// patio covers and awnings, Vista Pergolas (UI/PartnerCard; Andranik,
// 11-16). (11-12: the user asked for the drawing whole, not pulled apart, a
// little bigger, and the rooms shown through a cut.)
const ON_THE_HOME = new Set(Object.keys(ASSETS.property.layers));
const ITEMS = SERVICES.map(({ slug, title, home, href }) => ({ layer: slug, title, text: home, href, drawn: ON_THE_HOME.has(slug) }));

export default function Services({
  number = "02",
  heading = ["Design-Build,", "under one roof."],
  intro = "Every project here is design-build: one team designs it, takes it through permits and builds it. Each card lights up its part of the home.",
  items = ITEMS,
}) {
  const [active, setActive] = useState(null);
  const canvasRef = useRef(null);
  const listRef = useRef(null);
  const touchRef = useRef(false); // no hover: the scroll picks the card
  const state = useRef({ cut: 0, active: null, draw: null });

  useEffect(() => {
    const asset = ASSETS.property;
    const canvas = canvasRef.current;
    // drawn by the processor: simple line work, and on the graphics card its
    // first frame cost about a second (as in Service/Layers)
    const context = canvas.getContext("2d", { willReadFrequently: true });
    const fonts = sceneFonts();
    const labels = Object.fromEntries(items.filter((item) => item.drawn).map((item, i) => [item.layer, i + 1]));
    let size = null;
    let raf = 0;
    let stopped = false;
    const s = state.current;
    s.cut = 0;

    const draw = () => {
      if (!size || stopped) return;
      drawDiagram(context, { ...size, asset, spread: 0, cut: s.cut, active: s.active, labels, fonts });
    };
    s.draw = draw;
    const resize = () => {
      const { clientWidth: width, clientHeight: height } = canvas;
      if (!width || !height) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      size = { width, height, dpr };
      draw();
    };
    let started = 0;
    const tick = (now) => {
      if (stopped) return;
      const k = Math.min(1, (now - started) / CUT_TIME);
      s.cut = k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2;
      draw();
      raf = k < 1 ? requestAnimationFrame(tick) : 0;
    };
    const seen = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        seen.disconnect();
        started = performance.now();
        raf = requestAnimationFrame(tick);
      },
      { rootMargin: "0px 0px -25% 0px" },
    );
    seen.observe(canvas);
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    document.fonts?.ready.then(() => !stopped && resize());
    return () => {
      stopped = true;
      cancelAnimationFrame(raf);
      seen.disconnect();
      observer.disconnect();
    };
  }, [items]);

  useEffect(() => {
    state.current.active = active;
    state.current.draw?.();
  }, [active]);

  // The scroll's pick, on a touch screen: of the cards in the part of the
  // screen the drawing leaves free (below it where it's above them, else
  // below the navbar), the one at its middle. In a row of two (a tablet),
  // each card has half the row's height, so both get their turn as the row
  // passes. The drawing is also marked `data-stuck` while it's held (and
  // once it's gone past, so it doesn't grow as it leaves), for its smaller
  // size, the white above it and the fade below it.
  useEffect(() => {
    const panel = canvasRef.current.closest("[data-pin]");
    const list = listRef.current;
    const touch = window.matchMedia("(hover: none)");
    const gap = (r, y) => (y < r.top ? r.top - y : y > r.bottom ? y - r.bottom : 0);
    let raf = 0;
    let settle = 0;
    const update = () => {
      raf = 0;
      const above = window.innerWidth < 1080; // the drawing over the cards
      const p = panel.getBoundingClientRect();
      const style = getComputedStyle(panel);
      const held = above && style.position === "sticky" && p.top - parseFloat(style.top) < 1;
      if (held !== panel.hasAttribute("data-stuck")) {
        panel.toggleAttribute("data-stuck", held);
        // the drawing's size eases in; look again once it has
        clearTimeout(settle);
        settle = setTimeout(schedule, 560);
      }
      touchRef.current = touch.matches;
      if (!touch.matches) return;
      const nav = document.querySelector("nav")?.getBoundingClientRect().bottom ?? 0;
      // (the drawing as it's shown, smaller while it's held)
      const top = above ? Math.max(canvasRef.current.getBoundingClientRect().bottom, nav) : nav;
      const bottom = window.innerHeight;
      const line = (top + bottom) / 2;
      const cards = [...list.children].map((li) => ({ li, r: li.getBoundingClientRect() })).filter(({ r }) => r.bottom > top && r.top < bottom);
      let next = null;
      if (cards.length && bottom - top > 60) {
        const near = cards.reduce((a, b) => (gap(b.r, line) < gap(a.r, line) ? b : a));
        const row = cards.filter(({ r }) => Math.abs(r.top - near.r.top) < 4).sort((a, b) => a.r.left - b.r.left);
        const k = Math.min(0.999, Math.max(0, (line - near.r.top) / near.r.height));
        next = row[Math.floor(k * row.length)].li.dataset.layer;
      }
      setActive(next);
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    touch.addEventListener("change", schedule);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(settle);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      touch.removeEventListener("change", schedule);
    };
  }, []);

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

        <div className="mt-10 1080:mt-12 grid gap-8 1080:gap-10 1080:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] 1440:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] 1440:gap-14">
          {/* held under the navbar while the cards scroll beneath it (on a
              phone or tablet, the drawing above them; beside them from
              1080px), on white: white up behind the navbar too, and a fade
              under it, while it's held. Held, the drawing and its white are
              a quarter smaller (by transform: its place in the page keeps
              its size, so nothing below it moves), and the cards show
              through what it leaves, so the panel lets taps through. */}
          <Reveal
            data-pin=""
            className="group/pin relative pointer-events-none 1080:sticky 1080:top-28 1080:self-start services-pin:sticky services-pin:top-[84px] 700:services-pin:top-[88px] services-pin:z-10 before:absolute before:inset-x-0 before:bottom-full before:h-[88px] before:bg-white before:opacity-0 data-[stuck]:before:opacity-100"
          >
            <span aria-hidden="true" className={`absolute inset-0 origin-top bg-white transition-transform duration-500 ${EASE} ${HELD_SCALE_Y}`}>
              <span className="absolute inset-x-0 top-full h-6 bg-gradient-to-b from-white to-transparent opacity-0 transition-opacity group-data-[stuck]/pin:opacity-100" />
            </span>
            <div className={`relative origin-top transition-transform duration-500 ${EASE} ${HELD_SCALE}`}>
              <canvas
                ref={canvasRef}
                role="img"
                aria-label="A Craftsman home drawn in line: the house, a one-story addition on its side, the living room, kitchen and bath inside shown through a cutaway, an ADU in the yard and a patio under a pergola, each numbered to match the cards."
                className="block w-full h-[250px] 400:h-[290px] 550:h-[360px] 700:h-[420px] 1080:h-[440px] 1440:h-[480px] services-pin:max-h-[calc(40*var(--svh))] pointer-events-none"
              />
            </div>
          </Reveal>

          <ul ref={listRef} className="grid gap-3 max-700:auto-rows-fr 700:grid-cols-2" onMouseLeave={() => !touchRef.current && setActive(null)}>
            {items.map(({ layer, title, text, href, drawn }, i) => {
              const service = SERVICES.find((x) => x.slug === layer);
              const Icon = service?.icon;
              const on = active === layer;
              const wide = i === 0 || !drawn;
              return (
                <Reveal as="li" key={layer} data-layer={layer} delay={0.05 * i} className={wide ? "700:col-span-2" : ""}>
                  <Link
                    href={href}
                    onMouseEnter={() => !touchRef.current && setActive(layer)}
                    onFocus={() => setActive(layer)}
                    onBlur={() => setActive(null)}
                    className={`group relative flex h-full min-h-[230px] 700:min-h-[260px] flex-col overflow-hidden bg-[#0b0b0b] text-neutral-50 p-6 700:p-7 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-third ${CHAMFER}`}
                  >
                    {/* a warm glow from the top, stronger when lit */}
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_30%_0%,rgba(233,166,72,0.16),transparent_70%)] transition-opacity duration-300 ${on ? "opacity-100" : "opacity-40"}`}
                    />
                    {/* the gold bar down the card's whole side */}
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none absolute left-0 top-0 bottom-0 w-[3px] bg-third origin-top transition-transform duration-500 ${EASE} ${on ? "[transform:none]" : "[transform:scaleY(0)]"}`}
                    />
                    {/* a gold edge along the cut corner */}
                    <span aria-hidden="true" className="pointer-events-none absolute top-0 left-[calc(100%-20px)] w-[28px] h-[1.5px] bg-third origin-left rotate-45" />
                    {/* the number, large in outline */}
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none absolute top-3 right-7 font-display leading-none text-[84px] 700:text-[96px] text-transparent transition-[-webkit-text-stroke-color] duration-300 [-webkit-text-stroke:1.5px_rgba(255,255,255,0.12)] ${on ? "[-webkit-text-stroke-color:rgba(233,166,72,0.6)]" : ""}`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    <span aria-hidden="true" className="pointer-events-none relative grid place-items-center w-12 h-[55px] text-third">
                      <svg viewBox="0 0 40 46" className="absolute inset-0 w-full h-full">
                        <polygon
                          points={HEX}
                          stroke="currentColor"
                          strokeWidth="1.5"
                          className={`transition-[fill] duration-300 ${on ? "fill-third" : "fill-white/[0.04]"}`}
                        />
                      </svg>
                      {Icon && <Icon className={`relative text-[22px] transition-colors duration-300 ${on ? "text-neutral-950" : ""}`} />}
                    </span>

                    <span className="pointer-events-none relative mt-auto pt-10 pr-14 block">
                      <span className="block font-script text-[11px] uppercase tracking-[0.2em] text-third">
                        {String(i + 1).padStart(2, "0")} / {service?.kicker}
                      </span>
                      <span className={`mt-2 block font-display uppercase leading-[0.95] tracking-[0.01em] ${wide ? "text-[34px] 700:text-[40px]" : "text-[28px] 700:text-[30px]"}`}>
                        {title}
                      </span>
                      <span className="mt-2.5 block max-w-md text-[14.5px] leading-relaxed text-white/60">{text}</span>
                    </span>

                    {/* the arrow: the card opens the service's page */}
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none absolute right-6 bottom-6 700:right-7 700:bottom-7 grid place-items-center w-10 h-10 border transition-colors duration-300 ${
                        on ? "bg-third border-third text-neutral-950" : "border-white/25 text-neutral-50"
                      }`}
                    >
                      <TbArrowRight className={`text-[18px] transition-transform duration-300 ${EASE} ${on ? "motion-safe:[transform:translateX(2px)]" : ""}`} />
                    </span>
                  </Link>
                </Reveal>
              );
            })}
          </ul>
        </div>

        <Reveal delay={0.1} className="mt-12 1080:mt-16">
          <PartnerCard />
        </Reveal>
      </div>
    </section>
  );
}
