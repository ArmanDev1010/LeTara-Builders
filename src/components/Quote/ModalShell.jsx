"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { TbX } from "react-icons/tb";

const EASE = [0.22, 1, 0.36, 1];
const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

// How the dialog looks on each ground: the quote request is dark, its
// thank-you white.
const TONES = {
  dark: {
    panel: "bg-[#0d0c0b] border-white/10 text-neutral-50",
    rule: "border-white/10",
    aside: "text-white/45",
    close: "border-white/15 text-white/80 hover:border-third hover:text-third",
    scroll: "modal-scroll",
  },
  light: {
    panel: "bg-white border-black/10 text-neutral-900",
    rule: "border-black/10",
    aside: "text-black/45",
    close: "border-black/15 text-black/70 hover:bg-neutral-950 hover:border-neutral-950 hover:text-white",
    scroll: "modal-scroll modal-scroll-light",
  },
};

// The dialog the quote request and its thank-you share: the page dimmed and
// blurred behind it, a gold rule across the top, the title in the logo's
// face with a typewritten aside, and a close button. Only the body scrolls.
// Escape and the backdrop close it; focus moves into it, stays in it, and
// goes back where it was when it closes.
export default function ModalShell({ title, aside, labelId, onClose, tone = "dark", className = "", children }) {
  const look = TONES[tone];
  const panelRef = useRef(null);
  const scrollRef = useRef(null);
  const closeRef = useRef(onClose);
  useEffect(() => {
    closeRef.current = onClose;
  });

  useEffect(() => {
    const panel = panelRef.current;
    const previous = document.activeElement;
    panel?.focus();
    const onKey = (event) => {
      if (event.key === "Escape") closeRef.current();
      if (event.key !== "Tab" || !panel) return;
      const items = [...panel.querySelectorAll(FOCUSABLE)].filter((el) => el.offsetParent !== null);
      if (!items.length) return;
      const first = items[0], last = items[items.length - 1];
      if (event.shiftKey && (document.activeElement === first || document.activeElement === panel)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      previous?.focus?.();
    };
  }, []);

  // A finger moves only what can scroll inside the dialog (its body, or a
  // text box with more in it), never the page: with the keyboard up an
  // iPhone otherwise lets a swipe move the page behind, which the page's
  // lock can't stop (the user caught it). Two fingers still zoom.
  useEffect(() => {
    let lastY = 0;
    const scrolls = (node, dy) => {
      for (; node && node !== document.body; node = node.parentElement) {
        if (node.scrollHeight <= node.clientHeight + 1) continue;
        const { overflowY } = getComputedStyle(node);
        if (overflowY !== "auto" && overflowY !== "scroll") continue;
        if (dy > 0 ? node.scrollTop > 0 : node.scrollTop + node.clientHeight < node.scrollHeight - 1) return true;
        if (node === scrollRef.current) return false;
      }
      return false;
    };
    const onStart = (event) => {
      lastY = event.touches[0].clientY;
    };
    const onMove = (event) => {
      if (event.touches.length > 1) return;
      const y = event.touches[0].clientY;
      const inside = panelRef.current?.contains(event.target);
      if (!inside || !scrolls(event.target, y - lastY)) event.preventDefault();
      lastY = y;
    };
    document.addEventListener("touchstart", onStart, { passive: true });
    document.addEventListener("touchmove", onMove, { passive: false });
    return () => {
      document.removeEventListener("touchstart", onStart);
      document.removeEventListener("touchmove", onMove);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[100000]">
      {/* the dimmed page reaches a screen past the top and the bottom: with
          the keyboard up an iPhone shortens the screen to above it, and the
          page showed, undimmed, through its see-through keyboard */}
      <motion.div
        className="fixed inset-x-0 -top-[100vh] -bottom-[100vh] bg-black/70 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      {/* On a phone, as HB Links' is: 16px round it and at most 90% of the
          height, only as tall as the step (the user found it too tall). From
          550px, 12px above and below, so a tall step (the visit calendar)
          uses the whole height before it has to scroll. */}
      <div className="relative z-10 h-full w-full flex items-center justify-center p-4 550:px-6 550:py-3 pointer-events-none">
        <motion.div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={labelId}
          tabIndex={-1}
          className={`pointer-events-auto flex flex-col w-full max-h-[90dvh] 550:max-h-full border shadow-[0_40px_100px_-30px_rgba(0,0,0,0.9)] outline-none ${look.panel} ${className}`}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 18 }}
          transition={{ duration: 0.35, ease: EASE }}
        >
          <div className="h-[2px] shrink-0 bg-gradient-to-r from-third via-third/60 to-transparent" />
          <div className={`flex items-center justify-between gap-4 px-5 550:px-8 py-4 short:py-3 border-b shrink-0 ${look.rule}`}>
            <div className="flex items-baseline gap-3 min-w-0">
              <span id={labelId} className="font-display text-[22px] 550:text-[24px] leading-none tracking-[0.04em] uppercase">
                {title}
              </span>
              {aside && <span className={`max-400:hidden font-script text-[11.5px] truncate ${look.aside}`}>{aside}</span>}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className={`w-9 h-9 shrink-0 grid place-items-center border transition-colors duration-200 cursor-pointer ${look.close}`}
            >
              <TbX className="text-lg" />
            </button>
          </div>
          {/* a swipe that reaches its end stops there, never scrolling the page */}
          <div ref={scrollRef} className={`overflow-y-auto overscroll-contain ${look.scroll}`}>{children}</div>
        </motion.div>
      </div>
    </div>
  );
}
