"use client";

import { useEffect } from "react";

// A touch screen, where the browser's toolbars slide in and out as the page
// scrolls.
const TOUCH_QUERY = "(hover: none) and (pointer: coarse)";

// One `unit` (vh, svh) in px, read off a hidden element 100 of them tall.
function measure(unit) {
  const probe = document.createElement("div");
  probe.style.cssText = `position:fixed;top:0;left:0;width:0;height:100${unit};visibility:hidden;pointer-events:none`;
  document.body.appendChild(probe);
  const px = probe.getBoundingClientRect().height / 100;
  probe.remove();
  return px;
}

// Pins --vh and --svh (globals.css) at their size when the page opens, in px,
// so a block sized with them keeps its height while the toolbars move.
// Safari holds vh and svh steady itself, but Chrome, the Google app and
// other iPhone browsers resize them each time their bottom bar slides in or
// out, and the homepage hero is 475 of them tall (Hero/HeroIntro): it grew
// and shrank by hundreds of px and everything below it jumped (found on HB
// Links). They're measured again only when the width changes, which means
// the phone was turned or a desktop window resized. Off a touch screen,
// where no toolbar slides, a change of height counts too.
export default function StableViewport() {
  useEffect(() => {
    const root = document.documentElement;
    const touch = window.matchMedia(TOUCH_QUERY);
    let width = 0;
    let height = 0;

    const pin = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      if (w === width && (h === height || touch.matches)) return;
      width = w;
      height = h;
      root.style.setProperty("--vh", `${measure("vh")}px`);
      root.style.setProperty("--svh", `${measure("svh")}px`);
    };

    pin();
    window.addEventListener("resize", pin);
    return () => window.removeEventListener("resize", pin);
  }, []);

  return null;
}
