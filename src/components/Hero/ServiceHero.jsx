"use client";

import { useEffect, useRef } from "react";
import { CALM_QUERY, STILL_QUERY } from "@/components/Hero/arrival";
import { LITE_QUERY, sceneDpr, sceneFonts, sceneLayout } from "@/components/Hero/intro/layout";
import { ASSETS } from "@/components/Hero/studio/assets";
import { drawStudio } from "@/components/Hero/studio/studio";

// The object starts coming together this long after the first frame, so a
// visitor arriving through the page transition sees it happen once the wall
// has opened (UI/PageTransition), and takes this long.
const BUILD_DELAY = 650;
const BUILD_TIME = 2400;

// A service page's hero: the service itself as the star. Its object (Hero/
// studio/assets.js: the ADU, the addition, the kitchen, the outdoor room)
// alone on a turntable, the way a visual-effects asset is shown for review,
// with the service's name in huge outline behind it (studio.js), in the
// homepage hero's look (its blue-hour sky and drafting grid, 11-24).
// It comes together as the page opens, its layers coming down into place and
// its lights coming on, then turns a little as the hero scrolls away. The
// copy (`children`) sits at the bottom left as on the homepage, the object
// beside it or above it. With Reduce Motion it comes together from half as
// far without swinging round, and still turns with the scroll, as the
// homepage's does. A phone held sideways shows it with the copy below, as
// the homepage does. An area page shows its home (the `property` asset)
// with the area's name as the `word`.
export default function ServiceHero({ asset: key, label, word, children }) {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const copyRef = useRef(null);

  useEffect(() => {
    const asset = word ? { ...ASSETS[key], word: word.toUpperCase() } : ASSETS[key];
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    const copy = copyRef.current;
    const context = canvas.getContext("2d");
    const lite = window.matchMedia(LITE_QUERY).matches;
    const still = window.matchMedia(STILL_QUERY);
    const calm = window.matchMedia(CALM_QUERY);
    const fonts = sceneFonts();
    let size = null;
    let build = 0;
    let spin = 0;
    let started = 0;
    let raf = 0;
    let queued = 0;
    let stopped = false;

    const draw = () => {
      queued = 0;
      if (!size || stopped) return;
      drawStudio(context, { ...size, asset, build, spin, calm: calm.matches, lite, fonts });
      // the page transition waits for this before it opens (UI/PageTransition)
      canvas.dataset.drawn = "1";
    };
    const redraw = () => {
      if (!queued) queued = requestAnimationFrame(draw);
    };
    const resize = () => {
      const { clientWidth: width, clientHeight: height } = canvas;
      if (!width || !height) return;
      const dpr = sceneDpr(width, height, lite);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      const portrait = height > width;
      size = { width, height, dpr, portrait, layout: sceneLayout({ canvas, copy, width, height, portrait, still: still.matches }) };
      draw();
    };
    // it comes together once, then turns with the scroll while in view
    const tick = (now) => {
      if (stopped) return;
      build = Math.min(1, (now - started) / BUILD_TIME);
      draw();
      raf = build < 1 ? requestAnimationFrame(tick) : 0;
    };
    const timer = setTimeout(() => {
      started = performance.now();
      raf = requestAnimationFrame(tick);
    }, BUILD_DELAY);
    const onScroll = () => {
      const { top, height } = section.getBoundingClientRect();
      if (top > window.innerHeight || top + height < 0) return;
      const next = Math.min(1, Math.max(0, -top / height));
      if (next === spin) return;
      spin = next;
      if (!raf) redraw();
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    observer.observe(copy);
    document.fonts?.ready.then(() => !stopped && resize());
    window.addEventListener("scroll", onScroll, { passive: true });
    still.addEventListener("change", resize);
    calm.addEventListener("change", redraw);
    return () => {
      stopped = true;
      clearTimeout(timer);
      cancelAnimationFrame(raf);
      cancelAnimationFrame(queued);
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      still.removeEventListener("change", resize);
      calm.removeEventListener("change", redraw);
    };
  }, [key, word]);

  return (
    // As tall as the screen (in steady --svh, see UI/StableViewport), never
    // too short for the object and the copy: on a phone the object sits above
    // the copy, and in Safari, its bars showing (about 664px tall), there
    // wasn't room for both at screen height. There it runs a little past the
    // screen, the quote button still on the first screen. Until the first
    // frame, the sky's blue, so it doesn't flash.
    <section
      ref={sectionRef}
      id="hero"
      className="relative flex items-end overflow-hidden h-[calc(100*var(--svh))] min-h-[760px] 700:min-h-[600px] pt-28 intro-still:block intro-still:h-auto intro-still:min-h-0 intro-still:pt-0 bg-[#050b1b] text-neutral-50"
    >
      <canvas
        ref={canvasRef}
        role="img"
        aria-label={`${label}, drawn on a turntable under a dusk sky, coming together piece by piece.`}
        className="absolute inset-0 h-full w-full intro-still:relative intro-still:h-[calc(100*var(--vh))]"
      />
      {/* shade under the copy, easing off to the right on a wide screen */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] max-700:h-[62%] bg-gradient-to-t from-[#02050d]/80 via-[#02050d]/35 to-transparent 1080:[mask-image:linear-gradient(to_right,#000_40%,rgba(0,0,0,0.3)_75%)] intro-still:hidden" />
      <div ref={copyRef} className="wide-zoom relative z-20 900:pb-16 pb-20 mx-auto w-full 700:px-[32px] px-[24px] intro-still:pt-10">
        {children}
      </div>
    </section>
  );
}
