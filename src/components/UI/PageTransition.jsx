"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { MotionConfig, motion, useReducedMotion } from "framer-motion";
import Logo from "@/components/UI/Logo";

// Between pages, a gold line opens into the wall, like a projector's
// shutter: a thin gold line (the site's gold rule) draws across the middle
// of the screen from the left, then splits in two, one half gliding to the
// top and the other to the bottom, opening the wall between them (PANELS
// dark stripes) until they're its top and bottom edges. On the wall the
// logo, a gold line sweeping under it while the next page loads. Once that
// page is in (its hero image painted, or a drawn hero its first frame), the
// logo fades and it all plays back: the two lines glide back together,
// closing the wall into one line, and the line draws off to the right.
// Simple, and nothing comes at the visitor.
//
// How it got here (11-09): the panels rose in a wave as on HB Links (too
// close to HB's; the user liked the wall's look, not its motion), then a
// hexagon iris opening from the middle ("jumps in your face"), a plain fade
// ("boring") and slanted blades sweeping across, all rejected.
//
// It takes over clicks on links to other pages of the site (any <a>, so
// next/link everywhere): covers first, then navigates. New tabs, other
// sites, files, links within the page, and Back/Forward are left alone. A
// link to one of the homepage's sections (/#services) that this page also
// has scrolls to this page's own instead: once there are service or area
// pages with their own sections, "Services" on one stays on it. With
// "reduce motion" on it plays the same, a quarter slower: the user's iPhone
// has it on, and the fade it used to get there read as the lines missing.
// (MotionConfig reducedMotion="never" here, or the site-wide "user" setting
// would skip the lines' and the wall's transforms.)
const PANELS = 5;
const EASE = [0.76, 0, 0.24, 1];
const LINE = 0.3; // the gold line drawing across, and drawing off (s)
const OPEN = 0.45; // the wall opening from it, and closing back
const AFTER = 0.15; // the way back starts once the logo has faded
const MIN_SHUT_MS = 250; // the wall stays shut at least this long, so the logo reads
const IMAGE_WAIT_MS = 700; // the longest it waits for the new page's hero image
const MAX_WAIT_MS = 10000; // opens anyway if the page never arrives

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Resolves once the page's hero image is decoded — or, for the homepage's
// drawn hero (Hero/HeroIntro), once its canvas has its first frame — or after
// `wait` ms.
async function heroReady(wait) {
  const image = document.querySelector("#hero img");
  const canvas = !image && document.querySelector("#hero canvas[role='img']");
  const drawn =
    canvas &&
    new Promise((resolve) => {
      const check = () => (canvas.dataset.drawn ? resolve() : requestAnimationFrame(check));
      check();
    });
  await Promise.race([image ? image.decode?.().catch(() => {}) : drawn, sleep(wait)]);
}

export default function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const calm = useReducedMotion();
  const [isPending, startTransition] = useTransition();
  // idle → cover (panels rising) → shut (navigating) → reveal (lifting) → idle
  const [phase, setPhase] = useState("idle");
  const phaseRef = useRef(phase);
  phaseRef.current = phase;
  const target = useRef(null); // { href, pathname }
  const shutAt = useRef(0);
  const half = useRef(0); // half the screen's height, how far each line glides

  useEffect(() => {
    const onClick = (event) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      const link = event.target.closest?.("a[href]");
      if (!link || link.hasAttribute("download")) return;
      if (link.target && link.target !== "_self") return;
      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin) return; // other sites, tel:, mailto:
      if (/\.[a-z0-9]+$/i.test(url.pathname)) return; // files (sitemap.xml, a PDF)
      // one of the homepage's sections that this page has too: go to this
      // page's own (once a menu the link was in has closed)
      if (url.pathname === "/" && url.hash) {
        const section = document.getElementById(decodeURIComponent(url.hash.slice(1)));
        if (section) {
          event.preventDefault();
          requestAnimationFrame(() => section.scrollIntoView({ block: "start" }));
          return;
        }
      }
      // the same page (or a section of it): no wall
      if (url.pathname === window.location.pathname && url.search === window.location.search)
        return;
      // next/link sees this and leaves the navigating to us
      event.preventDefault();
      if (phaseRef.current !== "idle") return;
      target.current = { href: url.pathname + url.search + url.hash, pathname: url.pathname };
      half.current = window.innerHeight / 2;
      router.prefetch(target.current.href);
      setPhase("cover");
    };
    window.addEventListener("click", onClick, true);
    return () => window.removeEventListener("click", onClick, true);
  }, [router]);

  // The wall is shut: go to the page.
  const shut = () => {
    shutAt.current = performance.now();
    setPhase("shut");
    startTransition(() => router.push(target.current.href));
  };

  // Open once the new page is in and its hero image is ready.
  useEffect(() => {
    if (phase !== "shut") return;
    let cancelled = false;
    const open = async () => {
      await heroReady(IMAGE_WAIT_MS);
      const shutFor = performance.now() - shutAt.current;
      if (shutFor < MIN_SHUT_MS) await sleep(MIN_SHUT_MS - shutFor);
      if (!cancelled) setPhase("reveal");
    };
    if (!isPending && pathname === target.current.pathname) {
      open();
      return () => (cancelled = true);
    }
    const giveUp = setTimeout(() => setPhase("reveal"), MAX_WAIT_MS);
    return () => {
      cancelled = true;
      clearTimeout(giveUp);
    };
  }, [phase, isPending, pathname]);

  if (phase === "idle") return null;

  const revealing = phase === "reveal";
  const k = calm ? 1.25 : 1; // Reduce Motion: the same, slower
  const line = LINE * k, open = OPEN * k;

  return (
    <MotionConfig reducedMotion="never">
    <div aria-hidden="true" className="fixed inset-0 z-[100002] overflow-hidden">
      {/* the wall, opening up and down from the middle as the lines part
          (by scale, so the compositor runs it while the next page loads) */}
      <motion.div
        initial={{ scaleY: 0 }}
        animate={{ scaleY: revealing ? 0 : 1 }}
        transition={revealing ? { duration: open, delay: AFTER, ease: EASE } : { duration: open, delay: line, ease: EASE }}
        onAnimationComplete={() => {
          if (phaseRef.current === "cover") shut();
        }}
        className="absolute inset-0 flex"
      >
        {Array.from({ length: PANELS }, (_, i) => (
          <div key={i} className={`relative h-full flex-1 ${i % 2 ? "bg-primary" : "bg-secondary"}`}>
            <span className="absolute inset-y-0 right-0 w-px bg-white/[0.06]" />
          </div>
        ))}
      </motion.div>
      {/* the gold line: drawn across as one (two lines, one over the
          other), then parting to the top and bottom edges; back together
          and drawn off the other way to finish */}
      {[-1, 1].map((dir) => (
        <motion.div
          key={dir}
          initial={{ scaleX: 0, y: 0 }}
          animate={revealing ? { scaleX: 0, y: 0 } : { scaleX: 1, y: dir * (half.current - 1.5) }}
          style={{ originX: revealing ? 1 : 0 }}
          transition={
            revealing
              ? { y: { duration: open, delay: AFTER, ease: EASE }, scaleX: { duration: line, delay: AFTER + open, ease: EASE } }
              : { scaleX: { duration: line, ease: EASE }, y: { duration: open, delay: line, ease: EASE } }
          }
          onAnimationComplete={() => {
            if (dir === 1 && phaseRef.current === "reveal") setPhase("idle");
          }}
          className="absolute inset-x-0 top-1/2 -mt-[1.5px] h-[3px] bg-third"
        />
      ))}

      {/* on the shut wall: the logo and the loading line */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: revealing ? 0 : 1 }}
        transition={revealing ? { duration: 0.15 } : { duration: 0.35, delay: line + open * 0.6 }}
        className="pointer-events-none absolute inset-0 grid place-items-center"
      >
        <div className="flex flex-col items-center">
          <Logo className="h-[140px] 700:h-[170px] text-white" />
          <div className="mt-8 h-px w-[120px] 700:w-[150px] overflow-hidden bg-white/15">
            {/* draws across, then slides off; with reduce motion, pulses
                (.laser-line, globals.css — CSS, so it keeps moving while the
                next page's script runs) */}
            <div className="laser-line h-full w-full bg-third" />
          </div>
        </div>
      </motion.div>
    </div>
    </MotionConfig>
  );
}
