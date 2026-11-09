"use client";

import { useEffect, useRef } from "react";

// One observer for every Reveal on the page: it marks each one revealed the
// first time it's in view (10% up from the bottom edge) and lets it go.
let observer;
function observe(el) {
  observer ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.setAttribute("data-revealed", "");
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: "0px 0px -10% 0px" },
  );
  observer.observe(el);
  return () => observer.unobserve(el);
}

// Rises and fades in the first time it scrolls into view. The motion itself
// is a CSS animation (`[data-reveal]` in globals.css), which the browser runs
// off the main thread, so it stays smooth on a phone while the page scrolls
// and everything else is busy; this only says when. With Reduce Motion it
// rises a third as far. `as` picks the element (div, h2, li, ...); `delay`
// (seconds) staggers a group.
export default function Reveal({ as: Tag = "div", delay = 0, style, children, ...props }) {
  const ref = useRef(null);
  useEffect(() => observe(ref.current), []);
  return (
    <Tag ref={ref} data-reveal="" style={delay ? { ...style, "--reveal-delay": `${delay}s` } : style} {...props}>
      {children}
    </Tag>
  );
}
