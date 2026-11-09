"use client";

import { useEffect, useRef, useState } from "react";
import { CALM_QUERY } from "@/components/Hero/arrival";
import { sceneFonts } from "@/components/Hero/intro/layout";
import { ASSETS } from "@/components/Hero/studio/assets";
import { drawDiagram } from "@/components/Hero/studio/studio";
import Reveal from "@/components/Home/Reveal";
import { CONTAINER, H2, LEDE, LIGHT, Lines, SECTION, SectionLabel } from "@/components/Home/parts";

const SPREAD_TIME = 1400; // ms the drawing takes to come apart, once in view

// What's included, as the layers of the build, on white: on the left, the
// hero's object drawn again as an architect's exploded view, in line, its
// layers pulled apart as it scrolls into view and numbered; on the right,
// each layer in words. Pointing at a layer, tapping it or tabbing to it
// lights it up in gold in the drawing. A layer with no part in the drawing
// (wiring, say) is listed without a number there. With Reduce Motion the
// drawing comes apart from part way, more gently.
export default function Layers({ number, heading, intro, items, asset: key }) {
  const [active, setActive] = useState(null);
  const canvasRef = useRef(null);
  const state = useRef({ spread: 0, active: null, draw: null });

  useEffect(() => {
    const asset = ASSETS[key];
    const canvas = canvasRef.current;
    // drawn by the processor, not the graphics card: it's simple line work,
    // and on the graphics card its first frame cost about a second the
    // moment it scrolled into view (Chrome, measured with the GPU on)
    const context = canvas.getContext("2d", { willReadFrequently: true });
    const fonts = sceneFonts();
    const calm = window.matchMedia(CALM_QUERY).matches;
    const labels = Object.fromEntries(items.map((item, i) => [item.layer, i + 1]).filter(([layer]) => layer));
    let size = null;
    let raf = 0;
    let stopped = false;
    const s = state.current;
    s.spread = calm ? 0.55 : 0;

    const draw = () => {
      if (!size || stopped) return;
      drawDiagram(context, { ...size, asset, spread: s.spread, active: s.active, labels, fonts });
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
    const from = s.spread;
    let started = 0;
    const tick = (now) => {
      if (stopped) return;
      const k = Math.min(1, (now - started) / SPREAD_TIME);
      const e = k < 0.5 ? 4 * k * k * k : 1 - (-2 * k + 2) ** 3 / 2;
      s.spread = from + (1 - from) * e;
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
  }, [key, items]);

  useEffect(() => {
    state.current.active = active;
    state.current.draw?.();
  }, [active]);

  return (
    <section id="layers" className={`${SECTION} ${LIGHT}`}>
      <div className={CONTAINER}>
        <div className="grid gap-6 1080:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] 1080:items-end">
          <div>
            <Reveal>
              <SectionLabel number={number} tone="light">
                Layer by layer
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

        <div className="mt-10 1080:mt-12 grid gap-10 1080:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] 1440:gap-16">
          <Reveal className="relative 1080:sticky 1080:top-28 1080:self-start">
            <canvas
              ref={canvasRef}
              role="img"
              aria-label="An exploded drawing of the build, its layers pulled apart and numbered to match the list."
              className="block w-full h-[340px] 550:h-[420px] 1080:h-[560px] pointer-events-none"
            />
          </Reveal>

          <ol className="border-t border-black/10" onMouseLeave={() => setActive(null)}>
            {items.map(({ layer, title, text }, i) => {
              const on = layer && active === layer;
              return (
                <li key={title} className="border-b border-black/10">
                  <button
                    type="button"
                    onMouseEnter={() => setActive(layer ?? null)}
                    onFocus={() => setActive(layer ?? null)}
                    onBlur={() => setActive(null)}
                    onClick={() => setActive(on ? null : (layer ?? null))}
                    aria-pressed={layer ? on : undefined}
                    className="relative grid w-full grid-cols-[auto_minmax(0,1fr)] gap-x-5 700:gap-x-7 py-6 pl-4 pr-2 text-left cursor-pointer outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-third"
                  >
                    {/* a gold bar down the side of the layer lit in the drawing */}
                    <span
                      aria-hidden="true"
                      className={`absolute left-0 top-0 bottom-0 w-[3px] bg-third origin-top transition-transform duration-300 ${on ? "[transform:none]" : "[transform:scaleY(0)]"}`}
                    />
                    <span className={`pt-[5px] font-script text-[12px] transition-colors duration-200 ${layer ? "text-third" : "text-black/30"}`}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>
                      <span className="block font-display uppercase text-[24px] 700:text-[27px] leading-none tracking-[0.01em]">{title}</span>
                      <span className="mt-2.5 block text-[15.5px] leading-relaxed text-black/60">{text}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
