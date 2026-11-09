"use client";

import Link from "next/link";
import { TbArrowRight } from "react-icons/tb";
import { SERVICE_AREAS } from "@/data/areas";
import { SERVICES } from "@/data/services";

// The navbar's two dropdowns: a panel under the bar on a wide screen, a
// list that opens in place in the phone menu. HB Links' menus are plain
// rows on white; these are LeTara's: dark glass, numbered like the quote
// dialog's scenes, hexagons (the logo's shape) for bullets.

export function Chevron({ open, className = "" }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 12 12"
      className={`w-[10px] h-[10px] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
        open ? "rotate-180" : ""
      } ${className}`}
    >
      <path d="M2 4.5 L6 8.5 L10 4.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function HexBullet() {
  return (
    <svg aria-hidden="true" viewBox="0 0 12 14" className="w-[9px] h-[10.5px] shrink-0 text-third/70 group-hover:text-third transition-colors duration-200">
      <polygon
        points="6,1 11,4 11,10 6,13 1,10 1,4"
        fill="currentColor"
        fillOpacity="0"
        stroke="currentColor"
        strokeWidth="1.3"
        className="transition-[fill-opacity] duration-200 group-hover:[fill-opacity:1]"
      />
    </svg>
  );
}

const label = "font-script uppercase text-[10.5px] tracking-[0.22em] text-third pointer-events-none";
const footerLink =
  "group inline-flex items-center gap-2 uppercase text-[11.5px] font-semibold tracking-[0.14em] text-third hover:text-white transition-colors duration-200 cursor-pointer";
const focusRing = "outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-third";
const number = (i) => String(i + 1).padStart(2, "0");

// ---- wide screen: the panels --------------------------------------------------

export function ServicesPanel({ onNavigate, onQuote }) {
  return (
    <div className="w-[470px] py-3">
      <p className={`${label} px-6 pt-2 pb-3`}>What we build</p>
      <ul>
        {SERVICES.map(({ title, blurb, href }, i) => (
          <li key={title}>
            <Link
              href={href}
              onClick={onNavigate}
              className={`group flex items-start gap-4 px-6 py-3 transition-colors duration-200 hover:bg-white/[0.04] ${focusRing}`}
            >
              <span className="font-script text-[11px] text-third/60 pt-[5px] group-hover:text-third transition-colors duration-200">
                {number(i)}
              </span>
              <span className="flex-1">
                <span className="block font-display text-[22px] leading-none tracking-[0.03em] text-neutral-50 group-hover:text-third transition-colors duration-200">
                  {title}
                </span>
                <span className="block mt-1.5 text-[12.5px] text-neutral-400">{blurb}</span>
              </span>
              <TbArrowRight
                aria-hidden="true"
                className="self-center text-third opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition duration-200 motion-reduce:transition-none"
              />
            </Link>
          </li>
        ))}
      </ul>
      <div className="mx-6 mt-2 pt-4 pb-1 border-t border-white/10 flex items-center justify-between gap-4">
        <span className="text-[12.5px] text-neutral-400 pointer-events-none">Not sure what fits?</span>
        <button type="button" onClick={onQuote} aria-haspopup="dialog" className={`${footerLink} ${focusRing}`}>
          Get a free quote
          <TbArrowRight aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5" />
        </button>
      </div>
    </div>
  );
}

export function AreasPanel({ onNavigate }) {
  return (
    <div className="w-[410px] py-3">
      <p className={`${label} px-6 pt-2 pb-3`}>Serving Los Angeles</p>
      <ul className="grid grid-cols-2 px-3">
        {SERVICE_AREAS.map(({ name, href }) => (
          <li key={name} className="first:col-span-2">
            <Link
              href={href}
              onClick={onNavigate}
              className={`group flex items-center gap-3 px-3 py-2.5 uppercase text-[12px] font-medium tracking-[0.14em] text-neutral-300 hover:text-white hover:bg-white/[0.04] transition-colors duration-200 ${focusRing}`}
            >
              <HexBullet />
              {name}
            </Link>
          </li>
        ))}
      </ul>
      <div className="mx-6 mt-2 pt-4 pb-1 border-t border-white/10">
        <Link href="/#service-areas" onClick={onNavigate} className={`${footerLink} ${focusRing}`}>
          See all service areas
          <TbArrowRight aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}

// ---- phone menu: a section's screen (MobileMenu) -------------------------------

export function ServicesList({ onNavigate }) {
  return (
    <ul className="mt-6">
      {SERVICES.map(({ title, blurb, href }, i) => (
        <li key={title}>
          <Link href={href} onClick={onNavigate} className={`group flex items-baseline gap-4 py-2.5 ${focusRing}`}>
            <span className="w-7 shrink-0 font-script text-[11px] text-third/60">{number(i)}</span>
            <span>
              <span className="block font-display text-[28px] leading-none tracking-[0.03em] text-neutral-50 group-hover:text-third transition-colors duration-200">
                {title}
              </span>
              <span className="block mt-1 text-[13px] text-white/45">{blurb}</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function AreasList({ onNavigate }) {
  return (
    <ul className="mt-6 grid grid-cols-2 gap-x-4 pb-3">
      {SERVICE_AREAS.map(({ name, href }) => (
        <li key={name} className="first:col-span-2">
          <Link
            href={href}
            onClick={onNavigate}
            className={`group flex items-center gap-3 py-3 uppercase text-[13px] tracking-[0.14em] font-medium text-neutral-200 hover:text-white transition-colors duration-200 ${focusRing}`}
          >
            <HexBullet />
            {name}
          </Link>
        </li>
      ))}
    </ul>
  );
}
