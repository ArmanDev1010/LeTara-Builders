"use client";

import { useEffect, useRef } from "react";
import { CALM_QUERY, STILL_QUERY } from "@/components/Hero/arrival";
import { LITE_QUERY, sceneDpr, sceneFonts, sceneLayout } from "@/components/Hero/intro/layout";
import { drawScene } from "@/components/Hero/intro/scene";

// It plays by itself as the page opens (11-23: Andranik asked for it to play "as soon as you open the page,
// maybe with a little bit of a pause"). The pause: the first frame, the
// house in pieces, holds this long, so a visitor arriving through the page
// transition sees it play once the wall has opened (UI/PageTransition takes
// about 0.85s from the first frame), and one landing on the site has a beat
// to take it in.
const START_DELAY = 900;

// How long it plays, in seconds: all three passes, quick enough to finish
// while the headline is read, not so quick the notes can't be (see T in
// intro/scene.js; 6.5s at first, which the user found a little slow).
// Reduce Motion plays it a little slower.
const PLAY = 5;
const CALM_PLAY = 6.5;

// The homepage hero, one screen tall: "The Render" (intro/scene.js), a house
// coming to life pass by pass, the way a visual-effects shot does, to the
// tagline. Dream: its pieces, in gold glass, hang apart as in an exploded
// view and come together; Design: a blueprint-blue wireframe draws over
// them; Build: it fills in, solid, and its windows light up. Then, as the
// hero scrolls away, the camera turns a little further (`spin`), as on the
// service pages' heroes: a touch, nothing to scroll through. The copy
// (`children`) sits at the bottom left; the scene puts the house beside it
// or above it, never under it. A phone held sideways shows the scene with
// the copy below it.
export default function HeroIntro({ children }) {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const copyRef = useRef(null);
  // how far it has played, 0-1, kept if the scene restarts (a phone turned
  // sideways, Reduce Motion switched)
  const playedRef = useRef(0);

  useEffect(() => {
    const still = window.matchMedia(STILL_QUERY);
    const calm = window.matchMedia(CALM_QUERY);
    let stop = null;
    const sync = () => {
      stop?.();
      stop = playScene({
        section: sectionRef.current,
        canvas: canvasRef.current,
        copy: copyRef.current,
        still: still.matches,
        calm: calm.matches,
        played: playedRef,
      });
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
    // As tall as the screen (in steady --svh, see UI/StableViewport), never
    // too short for the house and the copy, as a service page's hero (Hero/
    // ServiceHero). A phone held sideways shows the scene a screen tall, the
    // headline below it (it's too short for both).
    <section
      ref={sectionRef}
      id="hero"
      className="relative flex items-end overflow-hidden h-[calc(100*var(--svh))] min-h-[700px] 700:min-h-[600px] pt-28 intro-still:block intro-still:h-auto intro-still:min-h-0 intro-still:pt-0 bg-[#050b1b] text-neutral-50"
    >
      <canvas
        ref={canvasRef}
        role="img"
        aria-label="A house takes shape in the dark, pass by pass: its pieces, in gold glass, come down into place, blue lines draw it as a blueprint, and it fills in, solid, until its windows light up. A modern home with a pool, a pergola and an ADU, on a drafting grid. Behind it, in outline: Dream. Design. Build."
        className="absolute inset-0 h-full w-full intro-still:relative intro-still:h-[calc(100*var(--vh))]"
      />
      {/* shade under the copy; on a wide screen it eases off to the right,
          where the house can come down beside the copy */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] max-700:h-[62%] bg-gradient-to-t from-[#02050d]/80 via-[#02050d]/35 to-transparent 1080:[mask-image:linear-gradient(to_right,#000_40%,rgba(0,0,0,0.3)_75%)] intro-still:hidden" />
      <div ref={copyRef} className="wide-zoom relative z-20 900:pb-16 pb-20 mx-auto w-full 700:px-[32px] px-[24px] intro-still:pt-10">
        {children}
      </div>
    </section>
  );
}

// Plays the scene once, from where it got to (`played`), then keeps it
// turning with the scroll. Returns a function that stops it.
function playScene({ section, canvas, copy, still, calm, played }) {
  const context = canvas.getContext("2d");
  const lite = window.matchMedia(LITE_QUERY).matches;
  const fonts = sceneFonts();
  const duration = calm ? CALM_PLAY : PLAY;

  let stopped = false;
  let size = null; // { width, height, dpr, portrait, layout }
  let drawn = "";
  let spin = 0; // how far the hero has scrolled away, 0-1
  let raf = 0;
  let queued = 0;
  let lastTick = 0;
  let started = played.current > 0;

  const inView = () => {
    const { top, bottom } = section.getBoundingClientRect();
    return bottom > 0 && top < window.innerHeight;
  };

  const draw = () => {
    queued = 0;
    if (!size || stopped) return;
    const t = ease(played.current);
    const { copyTop, copyRight, titleRight, navZoom, navBottom, head } = size.layout;
    const key = [t.toFixed(4), spin.toFixed(4), size.width, size.height, size.dpr, copyTop, copyRight, titleRight, navZoom, navBottom, head?.top].join(":");
    if (key === drawn) return;
    drawn = key;
    drawScene(context, { ...size, t, spin, calm, fonts, lite });
    // the page transition waits for this before it opens (UI/PageTransition)
    canvas.dataset.drawn = "1";
  };
  const redraw = () => {
    if (!queued && !raf) queued = requestAnimationFrame(draw);
  };

  // No more canvas pixels than the screen has (within PIXEL_BUDGET, see
  // intro/layout.js); the scene is laid out for the canvas's shape (portrait
  // on a tall screen) and around the copy (see sceneLayout).
  const resize = () => {
    const { clientWidth: width, clientHeight: height } = canvas;
    if (!width || !height) return;
    const dpr = sceneDpr(width, height, lite);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    const portrait = height > width;
    size = { width, height, dpr, portrait, layout: sceneLayout({ canvas, copy, width, height, portrait, still }) };
    drawn = "";
    draw();
  };

  // It plays only while the hero is on screen (a page opened further down,
  // by Back or a link to a section, plays it when it's scrolled up to), and
  // by the frames it's shown (a tab in the background holds it).
  const tick = (now) => {
    raf = 0;
    if (stopped) return;
    if (!inView()) return;
    played.current = Math.min(1, played.current + Math.min(Math.max(0, (now - lastTick) / 1000), 0.1) / duration);
    lastTick = now;
    draw();
    if (played.current < 1) raf = requestAnimationFrame(tick);
  };
  const play = () => {
    if (raf || stopped || !started || played.current >= 1) return;
    lastTick = performance.now();
    raf = requestAnimationFrame(tick);
  };
  const timer = started
    ? 0
    : setTimeout(() => {
        started = true;
        play();
      }, START_DELAY);

  const onScroll = () => {
    const { top, height } = section.getBoundingClientRect();
    if (!inView()) return;
    spin = Math.min(1, Math.max(0, -top / height));
    play();
    redraw();
  };

  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  observer.observe(copy);
  // redraw once the faces have loaded
  document.fonts?.ready.then(() => !stopped && resize());
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  play();

  return () => {
    stopped = true;
    clearTimeout(timer);
    cancelAnimationFrame(raf);
    cancelAnimationFrame(queued);
    observer.disconnect();
    window.removeEventListener("scroll", onScroll);
  };
}

// The play's time to the scene's progress: easing in over its first moment,
// so it starts from the still first frame without a jolt, then steady (the
// scene's passes have their own easing).
const EASE_IN = 0.08;
function ease(u) {
  const c = 1 / (1 - EASE_IN / 2);
  return u < EASE_IN ? (c * u * u) / (2 * EASE_IN) : c * (u - EASE_IN / 2);
}
