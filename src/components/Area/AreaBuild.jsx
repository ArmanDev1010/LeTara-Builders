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
import { SERVICES } from "@/data/services";

const CUT_TIME = 1300; // ms the cutaway takes to open, once in view
const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";
// a cut corner, top right: the navbar's points, as on the homepage's cards
const CHAMFER = "[clip-path:polygon(0_0,calc(100%-20px)_0,100%_20px,100%_100%,0_100%)]";

// An area page's "What we build", on white: the hero's Craftsman home (the
// `property` asset) drawn again as an architect's line drawing, whole, with
// a cutaway over the single-story wing for the remodel (its roof and the top
// of its walls dashed, the cut walls filled dark, the living room, kitchen
// and bath inside), beside a card for each service (`items`, data/area-pages: its slug as
// the drawing's `layer`, its words and its page). The cards are dark, cut at
// the corner like the homepage's but their own: the service's number large in
// outline, its icon on a hexagon, its name and a line, an arrow box. The
// whole card opens the service's page. Pointing at or tabbing to one lights
// its part of the home gold in the drawing, runs a gold bar down the card's
// whole side and fills its hexagon and arrow box gold. As the drawing scrolls
// into view the cutaway opens: the roof and walls over the rooms fade into
// their dashed outline (a fade, so the same with Reduce Motion).
// (11-12: the user asked for the drawing whole, not pulled apart, a little
// bigger, and the rooms shown through a cut.)
export default function AreaBuild({ number, heading, intro, items }) {
  const [active, setActive] = useState(null);
  const canvasRef = useRef(null);
  const state = useRef({ cut: 0, active: null, draw: null });

  useEffect(() => {
    const asset = ASSETS.property;
    const canvas = canvasRef.current;
    // drawn by the processor: simple line work, and on the graphics card its
    // first frame cost about a second (as in Service/Layers)
    const context = canvas.getContext("2d", { willReadFrequently: true });
    const fonts = sceneFonts();
    const labels = Object.fromEntries(items.map((item, i) => [item.layer, i + 1]));
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

  return (
    <section id="build" className={`${SECTION} ${LIGHT}`}>
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
          <Reveal className="relative 1080:sticky 1080:top-28 1080:self-start">
            <canvas
              ref={canvasRef}
              role="img"
              aria-label="A Craftsman home drawn in line: the house, its two-story addition, the living room, kitchen and bath inside shown through a cutaway, an ADU in the yard and a patio under a pergola, each numbered to match the cards."
              className="block w-full h-[250px] 400:h-[290px] 550:h-[360px] 700:h-[420px] 1080:h-[440px] 1440:h-[480px] pointer-events-none"
            />
          </Reveal>

          <ul className="grid gap-3 700:grid-cols-2" onMouseLeave={() => setActive(null)}>
            {items.map(({ layer, title, text, href }, i) => {
              const service = SERVICES.find((x) => x.slug === layer);
              const Icon = service?.icon;
              const on = active === layer;
              return (
                <Reveal as="li" key={layer} delay={0.05 * i} className={i === 0 ? "700:col-span-2" : ""}>
                  <Link
                    href={href}
                    onMouseEnter={() => setActive(layer)}
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
                      <span className={`mt-2 block font-display uppercase leading-[0.95] tracking-[0.01em] ${i === 0 ? "text-[34px] 700:text-[40px]" : "text-[28px] 700:text-[30px]"}`}>
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
      </div>
    </section>
  );
}
