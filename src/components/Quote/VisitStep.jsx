"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { TbCalendarOff, TbCheck, TbChevronLeft, TbChevronRight } from "react-icons/tb";
import ArrowButton from "@/components/UI/ArrowButton";
import { useVisitSlots } from "@/hooks/useVisitSlots";
import { dayKey, dayTitle, laDayKey, monthTitle, parseDayKey, visitTime } from "@/lib/visitTimes";

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

// Months as one number, so they can be compared and stepped through.
const monthIndex = (year, month) => year * 12 + month - 1;
const fromMonthIndex = (index) => [Math.floor(index / 12), (index % 12) + 1];
const monthOf = (key) => {
  const [year, month] = parseDayKey(key);
  return monthIndex(year, month);
};

const focusRing = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-third";

// While the times load: the month's grid, pulsing.
function Loading() {
  return (
    <div role="status" className="pointer-events-none">
      <p className="font-script text-[11.5px] uppercase tracking-[0.14em] text-white/45">Checking Andy&apos;s calendar…</p>
      <div aria-hidden="true" className="mt-4 grid grid-cols-7 gap-1 animate-pulse">
        {Array.from({ length: 35 }, (_, i) => (
          <span key={i} className="h-10 bg-white/[0.05]" />
        ))}
      </div>
    </div>
  );
}

// No times to offer (none open, or the calendar didn't load): carry on, and
// Andy calls to set one.
function Unavailable({ failed, onCall }) {
  return (
    <div className="border border-white/12 bg-white/[0.02] p-5 550:p-6">
      <div className="pointer-events-none">
        <TbCalendarOff aria-hidden="true" className="text-[26px] text-third" />
        <p className="mt-3 text-[16px] font-semibold">
          {failed ? "The calendar didn't load just now." : "No open times online right now."}
        </p>
        <p className="mt-1.5 text-[14px] leading-relaxed text-white/55">
          Continue, and Andy will call you to set a time that works.
        </p>
      </div>
      <ArrowButton type="button" onClick={onCall} className="mt-5">
        Continue
      </ArrowButton>
    </div>
  );
}

function MonthButton({ label, disabled, onClick, children }) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={`grid place-items-center w-9 h-9 border border-white/15 text-[17px] text-white/80 transition-colors duration-200 enabled:hover:border-third enabled:hover:text-third enabled:cursor-pointer disabled:opacity-25 ${focusRing}`}
    >
      {children}
    </button>
  );
}

// One month, weeks starting on Sunday. Days with open times are outlined and
// pickable, the picked one gold; today has a dot.
function MonthGrid({ year, month, days, today, selected, onPick }) {
  const lead = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
  const count = new Date(Date.UTC(year, month, 0)).getUTCDate();
  return (
    <div className="mt-4 grid grid-cols-7 gap-1">
      {WEEKDAYS.map((letter, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="pb-1 text-center font-script text-[11px] uppercase text-white/35 pointer-events-none"
        >
          {letter}
        </span>
      ))}
      {Array.from({ length: lead }, (_, i) => (
        <span key={`lead-${i}`} aria-hidden="true" />
      ))}
      {Array.from({ length: count }, (_, i) => {
        const key = dayKey(year, month, i + 1);
        const open = days[key]?.length ?? 0;
        const picked = key === selected;
        return (
          <button
            key={key}
            type="button"
            disabled={!open}
            onClick={() => onPick(key)}
            aria-pressed={open ? picked : undefined}
            aria-label={`${dayTitle(key)}${open ? `, ${open} open ${open === 1 ? "time" : "times"}` : ", no open times"}`}
            className={`relative h-10 short:h-9 border text-[14px] font-semibold tabular-nums transition-colors duration-200 ${focusRing} ${
              picked
                ? "border-third bg-third text-neutral-950"
                : open
                  ? "border-white/15 bg-white/[0.02] text-neutral-50 hover:border-third hover:text-third cursor-pointer"
                  : "border-transparent text-white/20 cursor-default"
            }`}
          >
            {i + 1}
            {key === today && (
              <span aria-hidden="true" className="absolute bottom-1 left-1/2 -ml-0.5 w-1 h-1 bg-current" />
            )}
          </button>
        );
      })}
    </div>
  );
}

// The site-visit step of the quote request: a month on the left and the
// picked day's open times on the right, with the time-zone note and "call me
// instead" at that column's foot (all stacked on a phone), from Andranik's
// GoHighLevel calendar (hooks/useVisitSlots). A time moves straight on, like
// a project pick. Times are Los Angeles time, wherever the visitor is.
// "Call me instead" skips it, and so does the note shown when there are no
// times to offer. `value` is the picked slot, "call", or null.
export default function VisitStep({ value, onPick, onCall }) {
  const { status, days } = useVisitSlots();
  const [chosenDay, setChosenDay] = useState(null);
  const [shownMonth, setShownMonth] = useState(null);
  const timesRef = useRef(null);

  if (status === "loading") return <Loading />;
  if (status !== "ready") return <Unavailable failed={status === "error"} onCall={onCall} />;

  const openDays = Object.keys(days).sort();
  const pickedDay = value && value !== "call" ? laDayKey(new Date(value)) : null;
  const day = [chosenDay, pickedDay, openDays[0]].find((key) => key && days[key]);
  const today = laDayKey();
  const first = Math.min(monthOf(today), monthOf(openDays[0]));
  const last = monthOf(openDays.at(-1));
  const shown = Math.min(last, Math.max(first, shownMonth ?? monthOf(day)));
  const [year, month] = fromMonthIndex(shown);

  const pickDay = (key) => {
    setChosenDay(key);
    // stacked, the times sit under the month: bring them into view
    requestAnimationFrame(() => timesRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" }));
  };
  // a new month opens on its first open day
  const goToMonth = (index) => {
    setShownMonth(index);
    const [y, m] = fromMonthIndex(index);
    const firstOpen = openDays.find((key) => monthOf(key) === monthIndex(y, m));
    if (firstOpen) setChosenDay(firstOpen);
  };

  return (
    <div>
      <div className="grid gap-7 @min-[560px]:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] @min-[860px]:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] @min-[560px]:gap-0">
        <div className="@min-[560px]:pr-7">
          <div className="flex items-center justify-between gap-3">
            <p aria-live="polite" className="font-display uppercase text-[24px] leading-none tracking-[0.03em] pointer-events-none">
              {monthTitle(year, month)}
            </p>
            <div className="flex gap-1.5">
              <MonthButton label="Previous month" disabled={shown <= first} onClick={() => goToMonth(shown - 1)}>
                <TbChevronLeft />
              </MonthButton>
              <MonthButton label="Next month" disabled={shown >= last} onClick={() => goToMonth(shown + 1)}>
                <TbChevronRight />
              </MonthButton>
            </div>
          </div>
          <MonthGrid year={year} month={month} days={days} today={today} selected={day} onPick={pickDay} />
        </div>

        <div ref={timesRef} className="flex flex-col scroll-mb-6 @min-[560px]:pl-7 @min-[560px]:border-l border-white/10">
          <div className="pointer-events-none">
            <p className="font-script text-[11.5px] font-bold uppercase tracking-[0.14em] text-third">Open times</p>
            <p className="mt-2 font-display uppercase text-[24px] leading-none tracking-[0.03em]">{dayTitle(day)}</p>
          </div>
          <motion.ul
            key={day}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
            aria-label={`Open times on ${dayTitle(day)}`}
            className="mt-4 grid grid-cols-3 @min-[680px]:grid-cols-4 @min-[860px]:grid-cols-5 gap-1.5"
          >
            {days[day].map((slot) => {
              const picked = slot === value;
              return (
                <li key={slot}>
                  <button
                    type="button"
                    onClick={() => onPick(slot)}
                    aria-pressed={picked}
                    className={`w-full h-11 @min-[560px]:h-10 short:h-9 border px-1 text-[14px] font-semibold tabular-nums whitespace-nowrap transition-colors duration-200 cursor-pointer ${focusRing} ${
                      picked
                        ? "border-third bg-third text-neutral-950"
                        : "border-white/15 bg-white/[0.02] text-neutral-50 hover:border-third hover:text-third"
                    }`}
                  >
                    {visitTime(slot)}
                  </button>
                </li>
              );
            })}
          </motion.ul>

          {/* at the column's foot beside the month (at least a gap below the times) */}
          <div aria-hidden="true" className="flex-1 min-h-6" />
          <div className="pt-4 border-t border-white/10 flex flex-col items-start gap-2.5">
            <p className="font-script text-[11px] uppercase tracking-[0.14em] text-white/40 pointer-events-none">
              Times are Los Angeles (Pacific) time
            </p>
            <button
              type="button"
              onClick={onCall}
              aria-pressed={value === "call"}
              className={`inline-flex items-center gap-1.5 text-[13.5px] underline underline-offset-4 transition-colors duration-200 cursor-pointer ${focusRing} ${
                value === "call"
                  ? "text-third decoration-third/50"
                  : "text-white/60 decoration-white/25 hover:text-third hover:decoration-third/50"
              }`}
            >
              {value === "call" ? (
                <>
                  <TbCheck aria-hidden="true" /> We&apos;ll call you to set a time
                </>
              ) : (
                "None of these work? Call me instead"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
