"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { TbStarFilled } from "react-icons/tb";
import Reveal from "@/components/Home/Reveal";
import { CONTAINER, H2, LIGHT, SECTION, SectionLabel } from "@/components/Home/parts";
import { TESTIMONIALS } from "@/data/testimonials";

const SPEED = 28; // px a second the film runs at
const CALM_RATE = 0.5; // with Reduce Motion it runs at half that
const COPIES = 3; // the reel, written out enough times to cover a wide screen as it wraps
const HOLD_MS = 2500; // after a drag or a swipe, the wait before the film runs on

function Frame({ review, index }) {
  const { pull, text, name, area, project } = review;
  return (
    <li className="film-frame shrink-0 flex flex-col border-l border-white/10 px-7 700:px-9 py-9 pointer-events-none">
      <div className="flex items-center justify-between gap-4">
        <span className="font-script text-[11px] uppercase tracking-[0.2em] text-white/40">
          Frame {String(index + 1).padStart(2, "0")}
        </span>
        <span className="flex gap-0.5 text-third" aria-label="5 out of 5">
          {Array.from({ length: 5 }, (_, i) => (
            <TbStarFilled key={i} aria-hidden="true" className="text-[13px]" />
          ))}
        </span>
      </div>
      <blockquote className="mt-6 flex-1">
        <p className="font-display uppercase text-[26px] 700:text-[28px] leading-[1] tracking-[0.01em] text-neutral-50">
          “{pull}”
        </p>
        <p className="mt-4 text-[15px] leading-relaxed text-white/60">{text}</p>
      </blockquote>
      <div className="mt-7 flex items-center gap-3.5">
        {/* their photo, black until there are real ones */}
        <span aria-hidden="true" className="w-11 h-11 shrink-0 rounded-full bg-black border border-white/15" />
        <span>
          <span className="block text-[15px] font-semibold text-neutral-50">{name}</span>
          <span className="block mt-0.5 font-script text-[11px] uppercase tracking-[0.12em] text-white/45">
            {area} · {project}
          </span>
        </span>
      </div>
    </li>
  );
}

// Testimonials as a strip of film running edge to edge across the white:
// each review a frame, with the sprocket holes punched through above and
// below. The film runs on its own, slowly and without end: the reel is
// written out three times, and each time it has run one reel's length it
// steps back by exactly that, onto the same frame, so the seam never shows.
// Each frame is a whole number of sprocket holes wide (.film-frame) so the
// holes line up across the wrap too.
//
// The running is a Web Animation of the track's transform, one reel long and
// repeating, which the browser plays off the main thread, so it stays smooth
// on a phone. Its time is the film's position: a drag or a fling pauses it
// and sets that time by hand, and when the film runs on it carries on from
// there.
//
// It can be dragged or swiped either way (a fling glides on), after which
// it waits a moment before running on. No buttons and no stopping on hover
// (the user's call). It stops while it's off screen. With Reduce Motion it
// runs at half the speed and a swipe doesn't glide on: calmer, but it still
// runs, because the user's own iPhone has Reduce Motion on, and on HB Links
// they reported testimonials that didn't move there as broken.
//
// The film's own px and the screen's can differ: on a big screen the section
// is zoomed (wide-zoom, globals.css). Its reel is measured and moved in its
// own px; pointer and wheel distances, in the screen's, are divided by
// `scale` to match.
//
// The reviews are placeholders for now (data/testimonials.js).
export default function Testimonials() {
  const headRef = useRef(null);
  const viewRef = useRef(null);
  const trackRef = useRef(null);
  const calm = useReducedMotion();
  const calmRef = useRef(false);
  const updateRef = useRef(null);

  useEffect(() => {
    calmRef.current = !!calm;
    updateRef.current?.();
  }, [calm]);

  useEffect(() => {
    const view = viewRef.current;
    const track = trackRef.current;

    let reel = 0; // one copy of the reel's width (the film's px)
    let scale = 1; // screen px per film px
    let run = null; // the running film (a Web Animation)
    let glide = 0; // what's left of a swipe's speed, px a second
    let drag = null;
    let visible = false;
    let holdUntil = 0;
    let holdTimer = 0;
    let raf = 0;
    let last = 0;

    const wrap = (v) => (reel ? ((v % reel) + reel) % reel : v);
    // how far the film has run, in px within one reel, and setting it
    const at = () => wrap(((run?.currentTime ?? 0) / 1000) * SPEED);
    const seek = (x) => {
      if (run) run.currentTime = (wrap(x) / SPEED) * 1000;
    };

    // it runs while it's on screen, unless held: dragged, gliding or just
    // let go; slower with Reduce Motion
    const update = () => {
      if (!run) return;
      run.playbackRate = calmRef.current ? CALM_RATE : 1;
      const go = visible && !drag && !glide && performance.now() >= holdUntil;
      if (go && run.playState !== "running") run.play();
      if (!go && run.playState === "running") run.pause();
    };
    updateRef.current = update;
    const hold = () => {
      holdUntil = performance.now() + HOLD_MS;
      clearTimeout(holdTimer);
      holdTimer = setTimeout(update, HOLD_MS);
      update();
    };

    const measure = () => {
      if (view.offsetWidth) scale = view.getBoundingClientRect().width / view.offsetWidth || 1;
      const width = track.querySelector("ol")?.getBoundingClientRect().width / scale;
      if (!width || width === reel) return;
      let x;
      if (run) {
        x = (at() / reel) * width; // the same place in the resized reel
        run.cancel();
      } else {
        // the first time, frame one starts on the page's left gutter
        const head = headRef.current;
        x =
          -(head.getBoundingClientRect().left - view.getBoundingClientRect().left) / scale -
          parseFloat(getComputedStyle(head).paddingLeft);
      }
      reel = width;
      run = track.animate([{ transform: "translate3d(0,0,0)" }, { transform: `translate3d(${-reel}px,0,0)` }], {
        duration: (reel / SPEED) * 1000,
        iterations: Infinity,
      });
      run.pause();
      seek(x);
      update();
    };

    // a fling coasting to a stop
    const coast = (now) => {
      const dt = Math.min(0.05, Math.max(0, now - last) / 1000);
      last = now;
      seek(at() + glide * dt);
      glide *= 0.03 ** dt;
      if (Math.abs(glide) < 8) {
        glide = 0;
        raf = 0;
        hold();
      } else {
        raf = requestAnimationFrame(coast);
      }
    };

    const onDown = (e) => {
      if (e.button !== 0 || !run) return;
      cancelAnimationFrame(raf);
      raf = 0;
      glide = 0;
      const x = e.clientX / scale;
      drag = { id: e.pointerId, startX: x, from: at(), lastX: x, lastT: e.timeStamp, speed: 0 };
      update();
      view.setPointerCapture(e.pointerId);
    };
    const onMove = (e) => {
      if (!drag || e.pointerId !== drag.id) return;
      const x = e.clientX / scale;
      seek(drag.from - (x - drag.startX));
      const dt = e.timeStamp - drag.lastT;
      if (dt > 0) drag.speed = 0.8 * (((drag.lastX - x) / dt) * 1000) + 0.2 * drag.speed;
      drag.lastX = x;
      drag.lastT = e.timeStamp;
    };
    const onUp = (e) => {
      if (!drag || e.pointerId !== drag.id) return;
      // a swipe carries on a little and slows to a stop
      const fling = e.type === "pointerup" && !calmRef.current && e.timeStamp - drag.lastT < 80;
      glide = fling ? Math.max(-2400, Math.min(2400, drag.speed)) : 0;
      drag = null;
      if (glide) {
        last = performance.now();
        raf = requestAnimationFrame(coast);
      } else {
        hold();
      }
    };
    // a sideways swipe on a trackpad moves the film; an up-and-down one
    // scrolls the page as usual
    const onWheel = (e) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY) || !run) return;
      e.preventDefault();
      cancelAnimationFrame(raf);
      raf = 0;
      glide = 0;
      seek(at() + e.deltaX / scale);
      hold();
    };

    view.addEventListener("pointerdown", onDown);
    view.addEventListener("pointermove", onMove);
    view.addEventListener("pointerup", onUp);
    view.addEventListener("pointercancel", onUp);
    view.addEventListener("wheel", onWheel, { passive: false });

    // it only runs while it's on screen
    const seen = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      update();
    });
    seen.observe(view);
    const resized = new ResizeObserver(measure);
    resized.observe(view);
    measure();

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(holdTimer);
      run?.cancel();
      updateRef.current = null;
      seen.disconnect();
      resized.disconnect();
      view.removeEventListener("pointerdown", onDown);
      view.removeEventListener("pointermove", onMove);
      view.removeEventListener("pointerup", onUp);
      view.removeEventListener("pointercancel", onUp);
      view.removeEventListener("wheel", onWheel);
    };
  }, []);

  return (
    <section id="reviews" className={`${SECTION} ${LIGHT} overflow-hidden`}>
      <div ref={headRef} className={CONTAINER}>
        <Reveal>
          <SectionLabel number="04" tone="light">
            In their words
          </SectionLabel>
        </Reveal>
        <Reveal as="h2" delay={0.05} className={`mt-5 ${H2}`}>
          Reviews from <br />
          the homes we&apos;ve built.
        </Reveal>
      </div>

      <Reveal delay={0.1} className="mt-10 1080:mt-12 bg-[#0a0a0a] text-neutral-50">
        <div ref={viewRef} className="overflow-hidden touch-pan-y select-none cursor-grab active:cursor-grabbing">
          <div ref={trackRef} className="relative flex w-max py-8 will-change-transform">
            <span aria-hidden="true" className="film-holes absolute inset-x-0 top-3 h-3 pointer-events-none" />
            <span aria-hidden="true" className="film-holes absolute inset-x-0 bottom-3 h-3 pointer-events-none" />
            {Array.from({ length: COPIES }, (_, copy) => (
              <ol
                key={copy}
                aria-label={copy === 0 ? "Reviews" : undefined}
                aria-hidden={copy > 0 ? true : undefined}
                className="flex"
              >
                {TESTIMONIALS.map((review, i) => (
                  <Frame key={review.name} review={review} index={i} />
                ))}
              </ol>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
