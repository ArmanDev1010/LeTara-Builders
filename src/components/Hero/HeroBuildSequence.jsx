"use client";

import { useEffect, useRef } from "react";
import { getImageProps } from "next/image";
import HeroShade from "@/components/Hero/HeroShade";
import { CALM_QUERY, STATIC_QUERY, reachedByLink } from "@/components/Hero/arrival";
import { BUILD_END, PUSH_IN, buildTimeline, frameSrc } from "@/data/heroBuild";

// Touch screens and phones held sideways (STATIC_QUERY, see arrival.js) get
// the opening frame, the finished job, as a still instead of the scroll
// sequence. "Reduce motion" (CALM_QUERY) still gets the sequence — its frames
// only change as the visitor scrolls — but calmer: no slow push-in, and the
// picture follows the scroll exactly instead of gliding after it.

// Portrait screens (a desktop window taller than it's wide — phones and
// tablets show the still) play the phone frames, the rest the desktop ones.
// A window resized between the two starts the sequence again with the other
// set.
const PORTRAIT_QUERY = "(orientation: portrait)";

// Seconds the drawn frame takes to catch up with the scroll position, so
// mouse-wheel steps play as motion instead of jumps.
const EASE = 0.12;

// Each frame is a different day of the build, so neighbouring frames are only
// blended through the middle BLEND of each step: crisp, timelapse-style cuts,
// softened by a quick dissolve from one to the next.
const BLEND = 0.2;

// Milliseconds without a scroll event that count as the scroll resting.
const REST = 120;

// Frames kept decoded either side of the scroll position — at most WINDOW,
// fewer where frames that big would hold more than MEMORY bytes decoded (a
// full-size desktop frame is ~17 MB; each is decoded no bigger than the
// screen needs, see sizeFrames) — and the spacing of the half-size frames
// held for the whole timeline to fall back on while that window catches up
// with a fast scroll.
const WINDOW = 8;
const MEMORY = 160e6;
const THUMB_STEP = 8;

// How many frames ahead of the scroll position are downloaded (48 is about
// a screen of scroll) — half that until the visitor first scrolls — and how
// many behind, for scrolling back up.
const AHEAD = 48;
const BEHIND = 8;

// Screens of scroll the hero is pinned for, per build step of the timeline
// (desktop, then phones) — so a short timelapse scrolls by as quickly, step
// for step, as a long one.
const SCROLL_PER_STEP = { desktop: 0.0975, phone: 0.0745 };

const clamp = (value) => Math.min(1, Math.max(0, value));

// A frame's file, decoded off the main thread where the browser can —
// scaled down to `size` ({ width, height }) as it's decoded, when given.
// Safari can refuse createImageBitmap on an image Blob it would happily show
// in an <img>, so that's the fallback: decode it as an image, then turn that
// into a bitmap (or draw the image itself), full size. Either has
// width/height, and drawImage takes both.
async function decodeFrame(file, size) {
  try {
    return await createImageBitmap(
      file,
      size
        ? {
            resizeWidth: size.width,
            resizeHeight: size.height,
            resizeQuality: "high",
          }
        : undefined,
    );
  } catch {
    const url = URL.createObjectURL(file);
    try {
      const image = new Image();
      image.src = url;
      await image.decode();
      try {
        return await createImageBitmap(image);
      } catch {
        return image;
      }
    } finally {
      URL.revokeObjectURL(url);
    }
  }
}

// Frees a decoded frame (an <img> fallback has nothing to close).
const release = (frame) => frame.close?.();

// Whether this browser can decode AVIF straight into a bitmap — a 2x2 AVIF,
// checked once. Safari (and so every iPhone browser) shows AVIF in an <img> but
// can't decode it here, so it plays a sequence's WebP copy instead.
const TINY_AVIF =
  "AAAAHGZ0eXBhdmlmAAAAAG1pZjFhdmlmbWlhZgAAANZtZXRhAAAAAAAAACFoZGxyAAAAAAAAAABwaWN0AAAAAAAAAAAAAAAAAAAAAA5waXRtAAAAAAABAAAAImlsb2MAAAAAREAAAQABAAAAAAD6AAEAAAAAAAAAFQAAACNpaW5mAAAAAAABAAAAFWluZmUCAAAAAAEAAGF2MDEAAAAAVmlwcnAAAAA4aXBjbwAAAAxhdjFDgSACAAAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAABZpcG1hAAAAAAAAAAEAAQOBAgMAAAAdbWRhdBIACgc4ADYQENBpMggYAAAAQACuIA==";
let avifCheck = null;
function canDecodeAvif() {
  avifCheck ??= (async () => {
    try {
      const bytes = Uint8Array.from(atob(TINY_AVIF), (c) => c.charCodeAt(0));
      // the fast path only: if it can't take AVIF, WebP decodes off the main
      // thread where the <img> fallback wouldn't
      release(await createImageBitmap(new Blob([bytes], { type: "image/avif" })));
      return true;
    } catch {
      return false;
    }
  })();
  return avifCheck;
}

// A hero pinned for a few screens of scroll over a build timelapse
// (`sequence`, see data/heroBuild), behind the hero copy (`children`): it
// opens on the finished job, wipes to the first day, then plays the build
// forward (see buildTimeline). The frames are drawn to a canvas; under it,
// the opening frame is a plain image, so the hero is never empty while they
// load (and is all static mode shows).
export default function HeroBuildSequence({ sequence, children }) {
  const trackRef = useRef(null);
  const panelRef = useRef(null);
  const canvasRef = useRef(null);
  const arrivalRef = useRef(null);

  useEffect(() => {
    // Reached by a link: start at the very top, so the hero opens on the
    // finished job rather than partway into the wipe (see also `lead` in
    // playSequence). Next.js resets the scroll itself; this backs it up.
    // Back/Forward and links to a section (#…) keep their own position.
    // Asked once per hero — React runs this twice in development.
    if (!arrivalRef.current) {
      arrivalRef.current = {
        arrived: reachedByLink() && !window.location.hash,
      };
      if (arrivalRef.current.arrived && window.scrollY > 0)
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
    let { arrived } = arrivalRef.current;

    const media = window.matchMedia(STATIC_QUERY);
    const calm = window.matchMedia(CALM_QUERY);
    const portrait = window.matchMedia(PORTRAIT_QUERY);
    let stop = null;
    const sync = () => {
      stop?.();
      stop = media.matches
        ? null
        : playSequence({
            track: trackRef.current,
            panel: panelRef.current,
            canvas: canvasRef.current,
            sequence,
            calm: calm.matches,
            arrived,
          });
      arrived = false;
    };
    sync();
    media.addEventListener("change", sync);
    calm.addEventListener("change", sync);
    portrait.addEventListener("change", sync);
    return () => {
      media.removeEventListener("change", sync);
      calm.removeEventListener("change", sync);
      portrait.removeEventListener("change", sync);
      stop?.();
    };
  }, [sequence]);

  const { order, weights } = buildTimeline(
    sequence.desktop.count,
    sequence.openOn,
  );
  // The opening frame covers the hero: on a portrait screen (a phone or
  // tablet, where it's all the hero shows) at the screen's full height, so
  // the frame's own shape sets how wide it's drawn.
  const aspect = sequence.desktop.width / sequence.desktop.height;
  const { props: openingFrame } = getImageProps({
    alt: "",
    width: sequence.desktop.width,
    height: sequence.desktop.height,
    sizes: `(orientation: portrait) ${Math.ceil(aspect * 100)}vh, 100vw`,
    priority: true,
    src: frameSrc(sequence, "desktop", order[0]),
  });
  // the scroll the timeline takes, in build steps, plus the hold at its end
  const steps = weights.reduce((sum, weight) => sum + weight, 0) / BUILD_END;
  // On portrait screens the canvas shows the middle of the phone frames —
  // each a square slice of the scene, cut at `mobile.focus` (see
  // scripts/hero-frames.mjs) — at the hero's full height. The image under
  // it is lined up on the same spot: the slice's centre, as a fraction of
  // the frame's width, held in the middle of the hero. (Measured on the
  // image itself, not the screen: a phone's toolbar hiding as you scroll
  // changes the screen's height, which used to slide the still sideways.)
  const sliceCenter =
    ((aspect - 1) * (sequence.mobile.focus ?? 0.5) + 0.5) / aspect;

  return (
    <section
      ref={trackRef}
      id="hero"
      style={{
        "--hero-scroll": `${Math.round(steps * SCROLL_PER_STEP.desktop * 100)}vh`,
        "--hero-scroll-phone": `${Math.round(steps * SCROLL_PER_STEP.phone * 100)}vh`,
      }}
      className="relative h-[calc(100vh+var(--hero-scroll))] max-700:h-[calc(100vh+var(--hero-scroll-phone))] hero-static:h-auto bg-black text-neutral-50"
    >
      {/* the still on phones is 85% of the screen tall — 90% under 550px
          wide, 95% under 400px (taller only if the copy needs it) — so the
          next section shows below it */}
      <div
        ref={panelRef}
        style={{ "--slice-center": `${(sliceCenter * 100).toFixed(2)}%` }}
        className="sticky top-0 h-dvh overflow-hidden flex items-end pt-28 sm:pt-22 hero-static:relative hero-static:h-auto hero-static:min-h-[calc(100*var(--vh))] hero-static:max-700:min-h-[calc(85*var(--svh))] hero-static:max-550:min-h-[calc(90*var(--svh))] hero-static:max-400:min-h-[calc(95*var(--svh))]"
      >
        <img
          {...openingFrame}
          className="absolute inset-0 h-full w-full object-cover portrait:right-auto portrait:left-1/2 portrait:w-auto portrait:max-w-none portrait:-translate-x-(--slice-center)"
        />
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="absolute inset-0 h-full w-full hero-static:hidden"
        />

        <HeroShade />

        <div className="wide-zoom relative z-20 900:pb-16 pb-20 mx-auto w-full 700:px-[32px] px-[24px]">
          {children}
        </div>
      </div>
    </section>
  );
}

// Pins the timeline to the scroll: draws the frame for how far the hero has
// been scrolled through. Positions are places along the timeline (`order`),
// each showing one frame. Returns a function that stops it.
function playSequence({ track, panel, canvas, sequence, calm, arrived }) {
  const set = window.matchMedia(PORTRAIT_QUERY).matches
    ? "mobile"
    : "desktop";
  const { count, width: frameWidth, height: frameHeight } = sequence[set];
  const focus = sequence.focus[set];
  const { order, weights } = buildTimeline(count, sequence.openOn);
  const last = order.length - 1;
  // the scroll (in build steps) at which each position is reached
  const at = [0];
  weights.forEach((weight, step) => at.push(at[step] + weight));
  const context = canvas.getContext("2d");
  const abort = new AbortController();

  // Every frame's file as it arrives; decoded frames (ImageBitmaps, decoded
  // off the main thread, at `decodeSize`) only within `reach` positions of
  // where the scroll is headed; and every THUMB_STEPth frame, the last and the
  // opening one decoded at half that size for the whole timeline. (`index` is
  // a frame.)
  const files = new Array(count);
  const decoded = new Map();
  const decoding = new Set();
  const failed = new Set(); // frames that won't decode — never retried
  const thumbs = new Array(count);
  const isThumb = (index) =>
    index % THUMB_STEP === 0 || index === count - 1 || index === order[0];
  let decodeSize = null;
  let reach = WINDOW;

  // Reached by a link, the hero opens at the start of its timeline: until
  // the visitor first touches, scrolls or presses a key, wherever the
  // browser leaves the page counts as the start (`lead`, px into the hero).
  // iOS Safari, its toolbar collapsed by scrolling the last page, can land a
  // new one a little way down — partway into the wipe.
  let lead = 0;
  let leading = arrived;
  if (leading) {
    const done = () => (leading = false);
    for (const type of ["touchstart", "wheel", "keydown", "pointerdown"])
      window.addEventListener(type, done, {
        once: true,
        passive: true,
        signal: abort.signal,
      });
  }

  let stopped = false;
  let target = 0; // scroll progress through the hero, 0-1
  let shown = 0; // the progress drawn, easing toward `target`
  let center = 0; // the position `target` is on
  let raf = 0;
  let lastTick = 0;
  let drawn = "";
  let lastScroll = 0;
  let settle = 0; // positions added to the drawn one, see tick()

  // scroll progress (0-1) -> timeline position
  const toPosition = (progress) => {
    const run = Math.min(progress / BUILD_END, 1) * at[last];
    let step = 0;
    while (step < last - 1 && at[step + 1] <= run) step++;
    return Math.min(last, step + (run - at[step]) / weights[step]);
  };
  // whether frame `index` shows within `reach` positions of `center`
  const nearCenter = (index, reach) => {
    const end = Math.min(last, center + reach);
    for (let p = Math.max(0, center - reach); p <= end; p++)
      if (order[p] === index) return true;
    return false;
  };

  // The nearest positions `get` has a frame for at or below and at or above
  // `position`, within `reach` positions (-1 where there's none).
  const bracket = (position, get, reach) => {
    let low = -1;
    let high = -1;
    for (let i = Math.floor(position); i >= 0 && position - i <= reach; i--) {
      if (get(i)) {
        low = i;
        break;
      }
    }
    for (let i = Math.ceil(position); i <= last && i - position <= reach; i++) {
      if (get(i)) {
        high = i;
        break;
      }
    }
    return [low, high];
  };

  const draw = (position) => {
    // The decoded frames either side of `position`, crossfaded — so the
    // build plays smoothly between frames. Where the decoded window hasn't
    // caught up (a fast scroll, frames still loading), the half-size
    // frames stand in.
    let tier = "full";
    let get = (i) => decoded.get(order[i]);
    let [low, high] = bracket(position, get, reach);
    if (low < 0 && high < 0) {
      tier = "thumb";
      get = (i) => thumbs[order[i]];
      [low, high] = bracket(position, get, last);
    }
    if (low < 0 && high < 0) return; // nothing decoded yet
    if (low < 0) low = high;
    if (high < 0) high = low;
    // At the very start the opening frame is already on screen, full size,
    // as the image under the canvas: no half-size stand-in over it.
    if (tier === "thumb" && position < 0.001) {
      if (drawn) context.clearRect(0, 0, canvas.width, canvas.height);
      drawn = "";
      return;
    }

    const step = high === low ? 0 : (position - low) / (high - low);
    const zoom = 1 + (calm ? 0 : PUSH_IN) * clamp(position / last);

    // The first step is a before/after wipe: day one revealed from the left
    // under the finished job, behind a moving divider.
    if (low === 0 && high === 1) {
      const key = `${tier}:wipe:${step.toFixed(4)}:${zoom.toFixed(4)}`;
      if (key === drawn) return;
      drawn = key;
      drawWipe(context, get(1), get(0), step, zoom, focus);
      return;
    }

    const blend = clamp((step - 0.5) / BLEND + 0.5);
    const mix = blend * blend * (3 - 2 * blend);
    const key = `${tier}:${low}:${high}:${mix.toFixed(3)}:${zoom.toFixed(4)}`;
    if (key === drawn) return;
    drawn = key;

    context.globalAlpha = 1;
    drawCover(context, get(mix < 0.999 ? low : high), zoom, focus);
    if (mix > 0.001 && mix < 0.999) {
      context.globalAlpha = mix;
      drawCover(context, get(high), zoom, focus);
    }
  };

  // Keeps the frames around `center` decoded, nearest first, and lets go of
  // the ones the scroll has left behind.
  const decodeWindow = () => {
    for (const [index, bitmap] of decoded) {
      if (!nearCenter(index, reach + 2)) {
        release(bitmap);
        decoded.delete(index);
      }
    }
    for (let d = 0; d <= reach && decoding.size < 3; d++) {
      for (const position of d ? [center + d, center - d] : [center]) {
        const index = order[position];
        if (decoding.size >= 3 || index === undefined || !files[index]) continue;
        if (decoded.has(index) || decoding.has(index) || failed.has(index)) continue;
        decoding.add(index);
        const size = decodeSize;
        decodeFrame(files[index], size)
          .then((bitmap) => {
            // (a frame decoded for a smaller screen than the window now is
            // dropped, see sizeFrames)
            if (stopped || size !== decodeSize || !nearCenter(index, reach + 2)) {
              release(bitmap);
              return;
            }
            decoded.set(index, bitmap);
            drawn = "";
            play();
          })
          .catch(() => failed.add(index))
          .finally(() => {
            decoding.delete(index);
            if (!stopped) decodeWindow();
          });
      }
    }
  };

  const makeThumb = (index) => {
    const size = {
      width: Math.round((decodeSize?.width ?? frameWidth) / 2),
      height: Math.round((decodeSize?.height ?? frameHeight) / 2),
    };
    return decodeFrame(files[index], size)
      .then((bitmap) => {
        if (stopped) {
          release(bitmap);
          return;
        }
        // copied onto a canvas of the half size, in case the browser
        // decoded it full size anyway
        const thumb = document.createElement("canvas");
        thumb.width = size.width;
        thumb.height = size.height;
        thumb
          .getContext("2d")
          .drawImage(bitmap, 0, 0, thumb.width, thumb.height);
        release(bitmap);
        thumbs[index] = thumb;
        drawn = "";
        play();
      })
      .catch(() => {});
  };

  // `nudge` (in positions) moves the picture off the scroll position a
  // little: see `settle` in tick().
  const render = (progress, nudge = 0) => draw(toPosition(progress) + nudge);

  const tick = (now) => {
    // rAF's timestamp can be a little older than the performance.now() that
    // started the loop, so never step backwards.
    const seconds = Math.min(Math.max(0, (now - lastTick) / 1000), 0.1);
    lastTick = now;
    const ease = calm ? 1 : 1 - Math.exp(-seconds / EASE);
    shown += (target - shown) * ease;
    if (Math.abs(target - shown) < 0.0005) shown = target;
    // Once the scroll has rested a moment, glide onto the nearest whole
    // frame, so the picture never stops on a blend of two; scrolling again
    // glides back. Not in the wipe: it stays wherever the scroll stops, like
    // a before/after slider.
    const resting = shown === target && performance.now() - lastScroll > REST;
    const position = toPosition(shown);
    const goal = resting && position >= 1 ? Math.round(position) - position : 0;
    settle += (goal - settle) * ease;
    if (Math.abs(goal - settle) < 0.001) settle = goal;
    render(shown, settle);
    raf = resting && settle === goal ? 0 : requestAnimationFrame(tick);
  };

  const play = () => {
    if (raf || stopped) return;
    lastTick = performance.now();
    raf = requestAnimationFrame(tick);
  };

  const measure = () => {
    const distance = track.offsetHeight - panel.offsetHeight;
    const into = -track.getBoundingClientRect().top;
    // (more than a little way down is a real scroll position, not a landing)
    if (leading) lead = into > 0 && into < distance / 4 ? into : 0;
    else if (into <= 0) lead = 0;
    const run = distance - lead;
    target = run > 0 ? clamp((into - lead) / run) : 0;
    const next = Math.round(toPosition(target));
    if (next !== center) {
      center = next;
      decodeWindow();
      load();
    }
  };

  // No more canvas pixels than the frames have to fill them.
  const resize = () => {
    const { clientWidth: width, clientHeight: height } = canvas;
    if (!width || !height) return;
    const cover = Math.max(width / frameWidth, height / frameHeight);
    const density = Math.min(
      window.devicePixelRatio || 1,
      Math.max(1, 1 / cover),
    );
    canvas.width = Math.round(width * density);
    canvas.height = Math.round(height * density);
    // canvas state resets with its size
    context.imageSmoothingQuality = "high";
    sizeFrames();
    drawn = "";
    render(shown, settle);
  };

  // Frames are decoded no bigger than the canvas needs them, the push-in
  // included — every pixel on a big or high-density screen, less to hold on
  // a smaller one — and as many are kept decoded as fit in MEMORY. A window
  // made noticeably bigger decodes them again at the new size.
  const sizeFrames = () => {
    const cover = Math.max(
      canvas.width / frameWidth,
      canvas.height / frameHeight,
    );
    const scale = Math.min(1, cover * (1 + (calm ? 0 : PUSH_IN)));
    const width = Math.round(frameWidth * scale);
    const height = Math.round(frameHeight * scale);
    const grew = decodeSize && width > decodeSize.width * 1.1;
    if (decodeSize && !grew) return;
    decodeSize = { width, height };
    const fits = Math.floor(MEMORY / (width * height * 4));
    reach = Math.max(3, Math.min(WINDOW, Math.floor((fits - 1) / 2) - 2));
    if (grew) {
      for (const bitmap of decoded.values()) release(bitmap);
      decoded.clear();
      decodeWindow();
    }
  };

  // Frames are fetched around where the scroll is — a few positions behind,
  // AHEAD in front — the thumbnail ones first and then the gaps, nearest first,
  // so a fast scroll always has something to show and the rest sharpens in
  // behind it. A visitor who stops scrolling stops downloading. Save-Data
  // and slow connections only get every THUMB_STEPth frame.
  const connection = navigator.connection;
  const finest =
    connection?.saveData || /2g|3g/.test(connection?.effectiveType ?? "")
      ? THUMB_STEP
      : 1;
  const requested = new Set();
  let loading = 0;
  let started = false;
  let scrolled = false;
  const nextWanted = () => {
    const ahead = scrolled ? AHEAD : AHEAD / 2;
    for (let gap = THUMB_STEP; gap >= finest; gap /= 2) {
      for (let d = 0; d <= ahead; d++) {
        for (const position of d && d <= BEHIND
          ? [center + d, center - d]
          : [center + d]) {
          const index = order[position];
          if (index === undefined || requested.has(index)) continue;
          if (index % gap === 0 || (gap === THUMB_STEP && isThumb(index)))
            return index;
        }
      }
    }
    return -1;
  };
  // the file type to fetch: the sequence's own, or its WebP copy where AVIF
  // won't decode (see canDecodeAvif); fetching waits until that's known
  let ext = null;
  (sequence.ext === "avif" && sequence.fallback
    ? canDecodeAvif().then((ok) => (ok ? "avif" : sequence.fallback))
    : Promise.resolve(sequence.ext)
  ).then((type) => {
    ext = type;
    load();
  });
  const load = () => {
    while (ext && started && !stopped && loading < 4) {
      const index = nextWanted();
      if (index < 0) return;
      requested.add(index);
      loading++;
      fetch(frameSrc(sequence, set, index, ext), { signal: abort.signal })
        .then((response) => (response.ok ? response.blob() : null))
        .then((file) => {
          if (!file || stopped) return;
          files[index] = file;
          if (isThumb(index)) makeThumb(index);
          if (nearCenter(index, reach)) decodeWindow();
        })
        .catch(() => {})
        .finally(() => {
          loading--;
          load();
        });
    }
  };
  const start = () => {
    if (started || stopped) return;
    started = true;
    load();
  };

  const onScroll = () => {
    scrolled = true;
    lastScroll = performance.now();
    start();
    measure();
    play();
  };

  // (sized now, so no frame is decoded for the canvas's default size)
  resize();
  measure();
  shown = target;
  // For the first second, re-read the scroll every frame and jump straight to
  // it, in case the browser resets it for a new page without a scroll event
  // reaching us.
  const settleUntil = performance.now() + 1000;
  let watching = requestAnimationFrame(function watch(now) {
    if (stopped) return;
    measure();
    if (!scrolled) shown = target;
    play();
    watching = now < settleUntil ? requestAnimationFrame(watch) : 0;
  });
  const resizeObserver = new ResizeObserver(() => {
    measure();
    resize();
  });
  resizeObserver.observe(canvas);
  // The first frames start coming once the hero is within a screen of the
  // viewport and the page has loaded and gone quiet — the page's own images,
  // fonts and scripts first — or as soon as the visitor scrolls.
  let idle = 0;
  const whenIdle = () => {
    idle = window.requestIdleCallback
      ? window.requestIdleCallback(start, { timeout: 3000 })
      : window.setTimeout(start, 1500);
  };
  const intersectionObserver = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) return;
      intersectionObserver.disconnect();
      if (document.readyState === "complete") whenIdle();
      else window.addEventListener("load", whenIdle, { once: true });
    },
    { rootMargin: "100% 0px" },
  );
  intersectionObserver.observe(track);
  window.addEventListener("scroll", onScroll, { passive: true });

  return () => {
    stopped = true;
    abort.abort();
    cancelAnimationFrame(raf);
    cancelAnimationFrame(watching);
    if (window.requestIdleCallback) window.cancelIdleCallback(idle);
    else window.clearTimeout(idle);
    window.removeEventListener("load", whenIdle);
    window.removeEventListener("scroll", onScroll);
    resizeObserver.disconnect();
    intersectionObserver.disconnect();
    for (const bitmap of decoded.values()) release(bitmap);
    decoded.clear();
    context.clearRect(0, 0, canvas.width, canvas.height);
  };
}

// `before` over the canvas left of a divider `amount` (0-1) of the way
// across, `after` right of it, and the divider itself while it's on screen.
function drawWipe(context, before, after, amount, zoom, focus) {
  const { width, height } = context.canvas;
  const x = Math.round(amount * width);
  context.globalAlpha = 1;
  drawCover(context, after, zoom, focus);
  if (x <= 0) return;
  context.save();
  context.beginPath();
  context.rect(0, 0, x, height);
  context.clip();
  drawCover(context, before, zoom, focus);
  context.restore();
  if (x >= width) return;
  const line = Math.max(2, Math.round(width / 600));
  context.save();
  context.shadowColor = "rgba(0, 0, 0, 0.45)";
  context.shadowBlur = line * 6;
  context.fillStyle = "#fff";
  context.fillRect(x - line / 2, 0, line, height);
  context.restore();
}

// `image` (an ImageBitmap or a canvas) scaled to cover the canvas, centred
// (CSS object-fit: cover), then zoomed in by `zoom` around `focus` — a point
// of the image, as x/y fractions, held still on screen (kept on the canvas,
// so the zoomed image still covers it).
function drawCover(context, image, zoom = 1, focus = [0.5, 0.5]) {
  const { width, height } = context.canvas;
  const scale = Math.max(width / image.width, height / image.height);
  const w = image.width * scale;
  const h = image.height * scale;
  const x = (width - w) / 2;
  const y = (height - h) / 2;
  const fx = Math.min(width, Math.max(0, x + focus[0] * w));
  const fy = Math.min(height, Math.max(0, y + focus[1] * h));
  context.drawImage(
    image,
    fx + (x - fx) * zoom,
    fy + (y - fy) * zoom,
    w * zoom,
    h * zoom,
  );
}

