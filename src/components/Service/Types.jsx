"use client";

import { useState } from "react";
import Reveal from "@/components/Home/Reveal";
import { CONTAINER, H2, LEDE, LIGHT, Lines, SECTION, SectionLabel } from "@/components/Home/parts";

const GOLD = "#e9a648";
const INK = "#111111";
const TYPE = { fontFamily: "var(--font-courier-prime), 'Courier New', monospace", fontWeight: 700, letterSpacing: "0.08em" };

// A small drawing in an architect's hand (data/service-pages/plans.js): the
// lot from above, the house from the side or its rooms, with what this type
// adds in gold. Shapes: `lot` (the property line, dashed), `house` (what's
// there), `new` (what's built), `room` (a room, gold when `on`), `area`, a
// `pergola` (slatted), `old` (what was there, dashed), `circle`, `dim` (a dimension, with ticks), `ground`
// (a side view's ground line) and `text`.
function Shape({ t, x, y, w, h, x1, y1, x2, y2, cx, cy, r, label, label2, on }) {
  const lit = t === "new" || on;
  const words = (lx, ly, color = INK, size = 7) =>
    label && (
      <text x={lx} y={ly} fontSize={size} textAnchor="middle" fill={color} style={TYPE}>
        <tspan x={lx} dy={label2 ? "-0.35em" : "0.35em"}>
          {label}
        </tspan>
        {label2 && (
          <tspan x={lx} dy="1.15em">
            {label2}
          </tspan>
        )}
      </text>
    );
  switch (t) {
    case "lot":
      return (
        <g>
          <rect x={x} y={y} width={w} height={h} fill="none" stroke="rgba(0,0,0,0.35)" strokeWidth="0.8" strokeDasharray="4 3" />
          <text x={x + 4} y={y + 8} fontSize="5" fill="rgba(0,0,0,0.4)" style={TYPE}>
            PROPERTY LINE
          </text>
        </g>
      );
    case "ground":
      return (
        <g>
          <line x1="8" y1={y} x2="232" y2={y} stroke={INK} strokeWidth="1" />
          {Array.from({ length: 28 }, (_, i) => (
            <line key={i} x1={10 + i * 8} y1={y + 1} x2={6 + i * 8} y2={y + 6} stroke="rgba(0,0,0,0.3)" strokeWidth="0.6" />
          ))}
        </g>
      );
    case "dim": {
      const vertical = x1 === x2;
      const tick = (px, py) =>
        vertical ? <line x1={px - 2.5} y1={py} x2={px + 2.5} y2={py} stroke={GOLD} strokeWidth="0.8" /> : <line x1={px} y1={py - 2.5} x2={px} y2={py + 2.5} stroke={GOLD} strokeWidth="0.8" />;
      return (
        <g>
          <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={GOLD} strokeWidth="0.8" />
          {tick(x1, y1)}
          {tick(x2, y2)}
          <text
            x={vertical ? x1 + 4 : (x1 + x2) / 2}
            y={vertical ? (y1 + y2) / 2 + 2 : y1 - 3.5}
            fontSize="5.5"
            textAnchor={vertical ? "start" : "middle"}
            fill="#b0701c"
            style={TYPE}
          >
            {label}
          </text>
        </g>
      );
    }
    case "text":
      return (
        <text x={x} y={y} fontSize="5.5" textAnchor="middle" fill="rgba(0,0,0,0.45)" style={TYPE}>
          {label}
        </text>
      );
    case "circle":
      return (
        <g>
          <circle cx={cx} cy={cy} r={r} fill={lit ? "rgba(233,166,72,0.28)" : "#ffffff"} stroke={lit ? GOLD : INK} strokeWidth={lit ? 1.5 : 0.8} />
          {label && (
            <text x={cx} y={cy + r + 8} fontSize="6" textAnchor="middle" fill={lit ? "#b0701c" : INK} style={TYPE}>
              {label}
            </text>
          )}
        </g>
      );
    case "pergola":
      return (
        <g>
          <rect x={x} y={y} width={w} height={h} fill={lit ? "rgba(233,166,72,0.16)" : "#ffffff"} stroke={lit ? GOLD : INK} strokeWidth={lit ? 1.5 : 0.8} />
          {Array.from({ length: Math.floor(w / 6) }, (_, i) => (
            <line key={i} x1={x + 3 + i * 6} y1={y} x2={x + 3 + i * 6} y2={y + h} stroke={lit ? GOLD : "rgba(0,0,0,0.35)"} strokeWidth="0.7" />
          ))}
          <rect x={x + w / 2 - 22} y={y + h / 2 - 6} width="44" height="12" fill="#ffffff" />
          {words(x + w / 2, y + h / 2, lit ? "#b0701c" : INK, 6.5)}
        </g>
      );
    case "area":
      return <rect x={x} y={y} width={w} height={h} fill={lit ? "rgba(233,166,72,0.2)" : "#f4f3f0"} stroke={lit ? GOLD : "rgba(0,0,0,0.25)"} strokeWidth={lit ? 1.5 : 0.6} />;
    case "old":
      // what was there (a house coming down, or the footprint of one lost), dashed
      return (
        <g>
          <rect x={x} y={y} width={w} height={h} fill="none" stroke="rgba(0,0,0,0.45)" strokeWidth="0.9" strokeDasharray="3 2.5" />
          {label && (
            <text x={x + w / 2} y={y + h - 5} fontSize="5.5" textAnchor="middle" fill="rgba(0,0,0,0.45)" style={TYPE}>
              {label}
            </text>
          )}
        </g>
      );
    default: {
      // house, new, room
      const fill = lit ? "rgba(233,166,72,0.28)" : t === "house" ? "#efede9" : "#ffffff";
      return (
        <g>
          <rect x={x} y={y} width={w} height={h} fill={fill} stroke={lit ? GOLD : INK} strokeWidth={lit ? 1.5 : 0.9} />
          {words(x + w / 2, y + h / 2, lit ? "#8a5512" : INK)}
        </g>
      );
    }
  }
}

// The forms the service comes in, on white: pick one from the list (tabs)
// and see it drawn as a small site plan or side view (`plan`), the type in
// gold, beside what it is and its facts. A switcher with drawings, not
// HB Links' row of cards. On a phone the types sit two by two above it.
export default function Types({ number, label, heading, intro, items }) {
  const [pick, setPick] = useState(0);
  const item = items[pick];
  return (
    <section id="types" className={`${SECTION} ${LIGHT}`}>
      <div className={CONTAINER}>
        <div className="grid gap-6 1080:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] 1080:items-end">
          <div>
            <Reveal>
              <SectionLabel number={number} tone="light">
                {label}
              </SectionLabel>
            </Reveal>
            <Reveal as="h2" delay={0.05} className={`mt-5 ${H2}`}>
              <Lines lines={heading} />
            </Reveal>
          </div>
          <Reveal as="p" delay={0.1} className={`${LEDE.light} max-w-xl 1080:pb-1`}>
            {intro}
          </Reveal>
        </div>

        <Reveal delay={0.1} className="mt-10 1080:mt-12 grid gap-4 1080:gap-6 1080:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)]">
          {/* every type in view at once (the user didn't want to swipe for
              the last ones): two by two on a phone, an odd one out across
              both; all in a row from 700px; down the side from 1080px */}
          <div
            role="tablist"
            aria-label={label}
            className={`grid grid-cols-2 ${items.length % 2 ? "[&>*:last-child]:col-span-2" : ""} ${
              items.length === 4 ? "700:grid-cols-4" : "700:grid-cols-3"
            } 700:[&>*:last-child]:col-span-1 1080:flex 1080:flex-col gap-2`}
          >
            {items.map(({ title }, i) => {
              const on = pick === i;
              return (
                <button
                  key={title}
                  type="button"
                  role="tab"
                  id={`type-tab-${i}`}
                  aria-selected={on}
                  aria-controls="type-panel"
                  onClick={() => setPick(i)}
                  className={`group flex items-center gap-3 1080:gap-4 border px-3.5 1080:px-5 py-3 1080:py-5 text-left cursor-pointer transition-colors duration-200 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-third ${
                    on ? "border-third bg-third/[0.07]" : "border-black/10 hover:border-black/30"
                  }`}
                >
                  <span className={`font-script text-[12px] transition-colors duration-200 ${on ? "text-third" : "text-black/35"}`}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-display uppercase text-[19px] 1080:text-[26px] leading-[1.05] tracking-[0.01em]">{title}</span>
                </button>
              );
            })}
          </div>

          <div
            role="tabpanel"
            id="type-panel"
            aria-labelledby={`type-tab-${pick}`}
            className="grid 800:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] border border-black/10 pointer-events-none"
          >
            <div className="relative bg-[#faf9f6] [background-image:linear-gradient(rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.04)_1px,transparent_1px)] [background-size:18px_18px] p-4 700:p-6 800:border-r border-b 800:border-b-0 border-black/10">
              <svg key={pick} viewBox="0 0 240 160" role="img" aria-label={`${item.title}, drawn as a small plan`} className="w-full h-auto">
                {item.plan.map((shape, i) => (
                  <Shape key={i} {...shape} />
                ))}
              </svg>
            </div>
            <div className="flex flex-col p-6 700:p-8">
              <h3 className="font-display uppercase text-[32px] 700:text-[36px] leading-none tracking-[0.01em]">{item.title}</h3>
              <p className="mt-3 text-[15.5px] leading-relaxed text-black/60">{item.text}</p>
              <dl className="mt-auto pt-6">
                <div className="border-t border-black/10">
                  {item.facts.map(({ label: name, value }) => (
                    <div key={name} className="flex items-baseline justify-between gap-4 py-2.5 border-b border-dashed border-black/12">
                      <dt className="shrink-0 font-script text-[11px] uppercase tracking-[0.16em] text-black/45">{name}</dt>
                      <dd className="text-right text-[14px] font-semibold leading-snug">{value}</dd>
                    </div>
                  ))}
                </div>
              </dl>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
