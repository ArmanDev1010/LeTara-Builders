"use client";

import { useEffect, useState } from "react";

const pad = (n) => String(n).padStart(2, "0");

// A legal page's sections as numbered links, then "Contact us"
// (`contactId`). The one being read (the last whose top has passed the upper
// third of the screen) is marked in gold, and the mark follows the scroll.
export function OnThisPage({ sections, contactId }) {
  const [active, setActive] = useState(null);
  const ids = [...sections.map(({ id }) => id), contactId].join(" ");

  useEffect(() => {
    const targets = ids.split(" ");
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = Math.max(180, window.innerHeight * 0.3);
      let current = null;
      for (const id of targets) {
        const top = document.getElementById(id)?.getBoundingClientRect().top;
        if (top !== undefined && top <= line) current = id;
      }
      setActive(current);
    };
    const onScroll = () => (frame ||= requestAnimationFrame(update));
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [ids]);

  const item = (on) =>
    `group -ml-px flex gap-3 border-l-2 py-1.5 pl-4 text-[14px] leading-snug transition-colors duration-200 ${
      on ? "border-third text-neutral-950" : "border-transparent text-black/55 hover:text-neutral-950"
    }`;

  return (
    <ol className="flex flex-col border-l border-black/10">
      {sections.map(({ id, heading }, i) => {
        const on = active === id;
        return (
          <li key={id}>
            <a href={`#${id}`} aria-current={on ? "location" : undefined} className={item(on)}>
              <span className={`w-6 shrink-0 font-script text-[12px] pt-[1px] transition-colors duration-200 ${on ? "text-third" : "text-black/35 group-hover:text-third"}`}>
                {pad(i + 1)}
              </span>
              {heading}
            </a>
          </li>
        );
      })}
      <li>
        <a href={`#${contactId}`} aria-current={active === contactId ? "location" : undefined} className={`${item(active === contactId)} !pl-[52px]`}>
          Contact us
        </a>
      </li>
    </ol>
  );
}
