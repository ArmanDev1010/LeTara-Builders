"use client";

import { useEffect, useRef } from "react";
import { CALM_QUERY, STILL_QUERY, reachedByLink } from "@/components/Hero/arrival";
import { drawScene } from "@/components/Hero/intro/scene";

// Seconds the drawn scene takes to catch up with the scroll position, so
// mouse-wheel steps play as motion instead of jumps.
const EASE = 0.12;

// The most canvas pixels (device px) the scene draws per frame: a bigger
// screen draws at a lower density rather than a slower frame rate.
const PIXEL_BUDGET = 4_200_000;

// How long the finished render holds before the hero scrolls away, in
// screens: a beat, no more (the user found longer holds too long, on a phone
// and then on desktop). The scene plays over the rest of the pinned scroll,
// 360vh: more scroll than the old hero's 240vh, so each flick of a finger or
// turn of the wheel moves it less and it reads smoother (the user compared
// it with HB Links', which plays over ~550vh). The section is 475vh tall,
// 375vh pinned (in steady --vh units, see UI/StableViewport), so it holds
// 15vh. Change the section's height and HOLD together.
const HOLD = 0.15;

// Phones and tablets get a lighter scene (`lite` in scene.js) at no more
// than 1.5 canvas px per CSS px: it's heavier to draw than HB Links', and on
// a phone that showed as a less smooth scroll.
const LITE_QUERY = "(hover: none) and (pointer: coarse)";
const LITE_DPR = 1.5;

// The homepage hero: pinned for a few screens of scroll over the intro scene
// (intro/scene.js), "The Render": a house comes to life pass by pass, the way
// a visual-effects shot does, to the tagline. Dream: its pieces, in gold
// glass, hang apart as in an exploded view and come together; Design: a
// blueprint-blue wireframe draws over them; Build: it fills in, solid, and
// its windows light up. The copy (`children`) sits at
// the bottom left, as on HB Links' hero; the scene puts the house beside it
// or above it, never under it. Phones held sideways get the finished scene
// as a still; Reduce Motion plays a calmer version (see `calm` in scene.js)
// that follows the scroll exactly instead of gliding after it.
export default function HeroIntro({ children }) {
  const trackRef = useRef(null);
  const panelRef = useRef(null);
  const canvasRef = useRef(null);
  const copyRef = useRef(null);
  const arrivalRef = useRef(null);

  useEffect(() => {
    // Reached by a link: start at the very top, so the scene opens on its
    // first frame. Next.js resets the scroll itself; this backs it up.
    // Back/Forward and links to a section (#…) keep their own position.
    // Asked once per hero — React runs this twice in development.
    if (!arrivalRef.current) {
      arrivalRef.current = { arrived: reachedByLink() && !window.location.hash };
      if (arrivalRef.current.arrived && window.scrollY > 0)
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
    let { arrived } = arrivalRef.current;

    const still = window.matchMedia(STILL_QUERY);
    const calm = window.matchMedia(CALM_QUERY);
    let stop = null;
    const sync = () => {
      stop?.();
      stop = playScene({
        track: trackRef.current,
        panel: panelRef.current,
        canvas: canvasRef.current,
        copy: copyRef.current,
        still: still.matches,
        calm: calm.matches,
        arrived,
      });
      arrived = false;
    };
    sync();
    still.addEventListener("change", sync);
    calm.addEventListener("change", sync);
    return () => {
      still.removeEventListener("change", sync);
      calm.removeEventListener("change", sync);
      stop?.();
    };
  }, []);

  return (
    // Until the scene's first frame is drawn, the section shows its gold glow,
    // so the hero doesn't flash black. Phones held sideways show the finished
    // scene as a still, the headline below it (it's too short for both).
    <section
      ref={trackRef}
      id="hero"
      className="relative h-[calc(475*var(--vh))] intro-still:h-auto bg-[#030303] bg-[radial-gradient(ellipse_80%_45%_at_60%_18%,rgba(255,170,58,0.26),rgba(196,92,16,0.08)_45%,transparent_75%)] portrait:bg-[radial-gradient(ellipse_80%_35%_at_100%_25%,rgba(255,170,58,0.28),rgba(196,92,16,0.08)_45%,transparent_75%)] text-neutral-50"
    >
      <div
        ref={panelRef}
        className="sticky top-0 h-dvh overflow-hidden flex items-end pt-28 sm:pt-22 intro-still:static intro-still:h-auto intro-still:block intro-still:pt-0"
      >
        <canvas
          ref={canvasRef}
          role="img"
          aria-label="A house takes shape in the dark, pass by pass: its pieces, in gold glass, float down into place, blue lines draw it as a blueprint, and it fills in, solid, until its windows light up. A modern home with a pool, a pergola and an ADU. Behind it, in outline: Dream. Design. Build."
          className="absolute inset-0 h-full w-full intro-still:relative intro-still:h-[calc(100*var(--vh))]"
        />
        {/* shade under the copy; on a wide screen it eases off to the right,
            where the house can come down beside the copy */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] max-700:h-[62%] bg-gradient-to-t from-black/75 via-black/35 to-transparent 1080:[mask-image:linear-gradient(to_right,#000_40%,rgba(0,0,0,0.3)_75%)] intro-still:hidden" />
        <div
          ref={copyRef}
          className="wide-zoom relative z-20 900:pb-16 pb-20 mx-auto w-full 700:px-[32px] px-[24px] intro-still:pt-10"
        >
          {children}
        </div>
      </div>
    </section>
  );
}

// Draws the scene for how far the hero has been scrolled through (or, when
// `still`, its finished frame once). Returns a function that stops it.
function playScene({ track, panel, canvas, copy, still, calm, arrived }) {
  const context = canvas.getContext("2d");
  const lite = window.matchMedia(LITE_QUERY).matches;
  const abort = new AbortController();
  // the site's display and typewriter faces (next/font, see app/layout.js),
  // for the outline title, the notes and the pass label
  const root = getComputedStyle(document.documentElement);
  const family = (name, fallback) => {
    const value = root.getPropertyValue(name).trim();
    return value ? `${value}, ${fallback}` : fallback;
  };
  const fonts = {
    display: family("--font-bebas-neue", "'Arial Narrow', sans-serif"),
    mono: family("--font-courier-prime", "'Courier New', monospace"),
  };

  let stopped = false;
  let size = null; // { width, height, dpr, portrait, layout }
  let drawn = "";
  let target = 0; // scroll progress through the hero, 0-1
  let shown = 0; // the progress drawn, easing toward `target`
  let raf = 0;
  let lastTick = 0;
  let idle = 0; // seconds the finished scene has spent drifting (see drift)

  const draw = (t) => {
    if (!size) return;
    const { copyTop, copyRight, titleRight, navZoom, navBottom, head } = size.layout;
    const key = [t.toFixed(4), size.width, size.height, size.dpr, copyTop, copyRight, titleRight, navZoom, navBottom, head?.top, idle.toFixed(3)].join(":");
    if (key === drawn) return;
    drawn = key;
    drawScene(context, { ...size, t, calm, fonts, idle, lite });
    // the page transition waits for this before it opens (UI/PageTransition)
    canvas.dataset.drawn = "1";
  };

  // No more canvas pixels than the screen has (within PIXEL_BUDGET); the
  // scene is laid out for the canvas's shape (portrait on a tall screen) and
  // around the copy (see sceneLayout).
  const resize = () => {
    const { clientWidth: width, clientHeight: height } = canvas;
    if (!width || !height) return;
    const dpr = Math.min(window.devicePixelRatio || 1, lite ? LITE_DPR : 2, Math.sqrt(PIXEL_BUDGET / (width * height)));
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    const portrait = height > width;
    size = { width, height, dpr, portrait, layout: sceneLayout({ canvas, copy, width, height, portrait, still }) };
    drawn = "";
    if (!still) measure();
    draw(still ? 1 : shown);
  };
  const resizeObserver = new ResizeObserver(resize);
  // redraw once the faces have loaded
  document.fonts?.ready.then(() => {
    if (stopped) return;
    resize();
  });

  if (still) {
    resizeObserver.observe(canvas);
    return () => {
      stopped = true;
      resizeObserver.disconnect();
    };
  }

  // Reached by a link, the hero opens at the start of the scene: until the
  // visitor first touches, scrolls or presses a key, wherever the browser
  // leaves the page counts as the start (`lead`, px into the hero). iOS
  // Safari, its toolbar collapsed by scrolling the last page, can land a new
  // one a little way down.
  let lead = 0;
  let leading = arrived;
  if (leading) {
    const done = () => (leading = false);
    for (const type of ["touchstart", "wheel", "keydown", "pointerdown"])
      window.addEventListener(type, done, { once: true, passive: true, signal: abort.signal });
  }

  const measure = () => {
    const distance = track.offsetHeight - panel.offsetHeight;
    const into = -track.getBoundingClientRect().top;
    // (more than a little way down is a real scroll position, not a landing)
    if (leading) lead = into > 0 && into < distance / 4 ? into : 0;
    else if (into <= 0) lead = 0;
    const run = distance - lead;
    const progress = run > 0 ? Math.min(1, Math.max(0, (into - lead) / run)) : 0;
    // the share of the pinned scroll that plays the scene (see HOLD)
    const hold = HOLD * panel.offsetHeight;
    const play = distance > 0 ? Math.min(1, Math.max(0.5, (distance - hold) / distance)) : 1;
    target = Math.min(1, progress / play);
  };

  const tick = (now) => {
    // rAF's timestamp can be a little older than the performance.now() that
    // started the loop, so never step backwards.
    const seconds = Math.min(Math.max(0, (now - lastTick) / 1000), 0.1);
    lastTick = now;
    shown += (target - shown) * (calm ? 1 : 1 - Math.exp(-seconds / EASE));
    if (Math.abs(target - shown) < 0.0005) shown = target;
    draw(shown);
    raf = shown === target ? 0 : requestAnimationFrame(tick);
    if (!raf) drift();
  };

  // Once the scene has finished, the dust keeps drifting and the pool
  // shimmering (30 frames a second is plenty for them) until the hero
  // scrolls out of view. Not with Reduce Motion: it's only atmosphere.
  let drifting = 0;
  let lastDrift = 0;
  const driftTick = (now) => {
    drifting = 0;
    if (stopped || shown < 1) return;
    const { top, bottom } = track.getBoundingClientRect();
    if (bottom <= 0 || top >= window.innerHeight) return;
    const seconds = (now - lastDrift) / 1000;
    if (seconds >= 1 / 30) {
      idle += Math.min(seconds, 0.1);
      lastDrift = now;
      draw(1);
    }
    drifting = requestAnimationFrame(driftTick);
  };
  const drift = () => {
    if (calm || drifting || stopped || shown < 1) return;
    lastDrift = performance.now();
    drifting = requestAnimationFrame(driftTick);
  };
  const play = () => {
    if (raf || stopped) return;
    lastTick = performance.now();
    raf = requestAnimationFrame(tick);
  };

  let scrolled = false;
  const onScroll = () => {
    scrolled = true;
    measure();
    play();
    drift();
  };

  measure();
  shown = target;
  resizeObserver.observe(canvas);
  resizeObserver.observe(copy);
  // For the first second, re-read the scroll every frame and jump straight to
  // it, in case the browser resets it for a new page without a scroll event
  // reaching us.
  const settleUntil = performance.now() + 1000;
  let watching = requestAnimationFrame(function watch(now) {
    if (stopped) return;
    measure();
    if (!scrolled) shown = target;
    draw(shown);
    watching = now < settleUntil ? requestAnimationFrame(watch) : 0;
    if (!watching) drift();
  });
  window.addEventListener("scroll", onScroll, { passive: true, signal: abort.signal });

  return () => {
    stopped = true;
    abort.abort();
    cancelAnimationFrame(raf);
    cancelAnimationFrame(watching);
    cancelAnimationFrame(drifting);
    resizeObserver.disconnect();
  };
}

// Where the copy is, for the scene to keep the house clear of it, as
// fractions of the screen: `copyTop` (where the copy starts), `copyRight`
// (how far right its text reaches) and `titleRight` (the headline's). The
// scene puts the house beside the copy or above it, whichever lets it be
// bigger (see room in scene.js); on a phone, above it. The still (a phone
// held sideways, the copy below it) has the screen to itself. `navZoom` is
// how much the navbar has grown on a big screen (--wide-zoom, globals.css),
// so the scene keeps clear of it.
//
// For "DREAM. DESIGN. BUILD.", spaced evenly between the navbar and what's
// under it: `navBottom` (px; the bar is fixed at the top, and the canvas is
// there too while the hero is pinned), and the headline's box top, font size
// and line height (`head`, px), so the scene can find the top of its letters.
function sceneLayout({ canvas, copy, width, height, portrait, still }) {
  const box = canvas.getBoundingClientRect();
  const navZoom = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--wide-zoom")) || 1;
  const navBottom = document.querySelector("nav")?.getBoundingClientRect().bottom ?? null;
  if (still) return { copyTop: 1, copyRight: 0, titleRight: 0, navZoom, navBottom, head: null };
  const copyTop = (copy.getBoundingClientRect().top - box.top) / height;
  const h1 = copy.querySelector("h1");
  const title = h1?.getBoundingClientRect();
  const style = h1 && getComputedStyle(h1);
  const head = title ? { top: title.top - box.top, size: parseFloat(style.fontSize), line: parseFloat(style.lineHeight) } : null;
  if (portrait) return { copyTop, copyRight: 0, titleRight: 0, navZoom, navBottom, head };
  return {
    copyTop,
    copyRight: (textRight(copy) - box.left) / width,
    titleRight: title ? (title.right - box.left) / width : 0.5,
    navZoom,
    navBottom,
    head,
  };
}

// The right edge of an element's text, line by line (its blocks run wider
// than their lines do).
function textRight(element) {
  const range = document.createRange();
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  let right = 0;
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    if (!node.textContent.trim()) continue;
    range.selectNodeContents(node);
    right = Math.max(right, range.getBoundingClientRect().right);
  }
  return right;
}
