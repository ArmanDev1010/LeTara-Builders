"use client";

import { motion, useReducedMotion } from "framer-motion";
import { TbCalendarEvent, TbCheck, TbPhone } from "react-icons/tb";
import { HEX } from "@/components/Navigation/HexButton";
import ModalShell from "@/components/Quote/ModalShell";
import { visitDayLong, visitTime } from "@/lib/visitTimes";
import { BUSINESS, phoneDisplay, phoneHref } from "@/data/business";
import { PROCESS as STEPS } from "@/data/process";

const EASE = [0.22, 1, 0.36, 1];

// The road from request to finished project (data/process.js, the same
// steps as the homepage's "How we work"). Sending the form completes the
// first (DONE steps are done); the one after is up next.
const DONE = 1;

// The steps side by side, joined by a line, each on a hexagon: the done ones
// gold with a check, the next one outlined in black with a gold hexagon
// breathing around it (still, with Reduce Motion), the rest pale. The line
// into the next step draws itself in.
function StepTracker() {
  const calm = useReducedMotion();
  return (
    <ol className="grid grid-cols-5 pointer-events-none">
      {STEPS.map((step, index) => {
        const done = index < DONE;
        const next = index === DONE;
        const Icon = done ? TbCheck : step.icon;
        return (
          <motion.li
            key={step.label}
            aria-current={next ? "step" : undefined}
            className="relative flex flex-col items-center text-center"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 + index * 0.07, ease: EASE }}
          >
            {index > 0 && (
              <span aria-hidden="true" className="absolute top-[23px] right-1/2 w-full h-px bg-black/10">
                {index <= DONE && (
                  <motion.span
                    className="absolute inset-0 origin-left bg-third"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.7, delay: 0.5, ease: EASE }}
                  />
                )}
              </span>
            )}
            <span className="relative z-10 grid place-items-center w-10 h-[46px]">
              {next && (
                <motion.svg
                  aria-hidden="true"
                  viewBox="0 0 40 46"
                  className="absolute -inset-2 w-[calc(100%+16px)] h-[calc(100%+16px)] overflow-visible"
                  animate={calm ? undefined : { opacity: [0.25, 0.8, 0.25], scale: [0.94, 1.06, 0.94] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <polygon points={HEX} fill="rgba(233,166,72,0.18)" stroke="#e9a648" strokeWidth="1" />
                </motion.svg>
              )}
              <svg aria-hidden="true" viewBox="0 0 40 46" className="absolute inset-0 w-full h-full">
                <polygon
                  points={HEX}
                  fill={done ? "#e9a648" : "#ffffff"}
                  stroke={done ? "#e9a648" : next ? "#0a0a0a" : "rgba(0,0,0,0.15)"}
                  strokeWidth={next ? 2 : 1.5}
                />
              </svg>
              <Icon className={`relative text-[18px] ${done || next ? "text-neutral-950" : "text-black/30"}`} />
            </span>
            <span
              className={`mt-3 text-[11px] 550:text-[12.5px] leading-tight ${
                done ? "text-black/55" : next ? "text-neutral-950 font-semibold" : "text-black/35"
              }`}
            >
              {step.label}
              {done && <span className="sr-only"> (done)</span>}
            </span>
          </motion.li>
        );
      })}
    </ol>
  );
}

// What happens next with the site visit: booked on the calendar (`visit.booked`),
// picked but not booked (taken in the meantime, or the calendar didn't
// answer), or no time picked ("call me").
function nextVisitText(visit) {
  if (visit?.booked) {
    return "Andy comes out to the property, walks it with you, takes measurements and looks at what's there, so the design and your quote start from the real thing.";
  }
  const then =
    "Then we come out, walk the property with you, take measurements and look at what's there, so the design and your quote start from the real thing.";
  if (visit) return `We couldn't hold that time on the calendar, so Andy will call the number you gave us to set one that works. ${then}`;
  return `Andy will call the number you gave us to set a time that works for you. ${then}`;
}

// Opens in place of the quote request once it's sent (openThanks in
// context/ModalContext), on white: the thanks and how far along they are;
// then the steps, and what the next one involves, with the visit's day and
// time when it's booked. From 1080px the thanks sits left of the steps, the
// direct line at its foot; below that it all stacks, the direct line last.
export default function ThanksModal({ name, visit, onClose }) {
  const first = name.trim().split(/\s+/)[0];
  const phone = phoneHref();
  const booked = Boolean(visit?.booked);
  return (
    <ModalShell
      title="Request received"
      aside="LeTara Builders"
      labelId="thanks-title"
      tone="light"
      onClose={onClose}
      className="max-w-[720px] 1080:max-w-[1000px]"
    >
      <div className="px-5 550:px-8 1080:px-10 pt-8 pb-9 grid gap-y-9 1080:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] 1080:grid-rows-[auto_1fr] 1080:gap-x-14">
        <div>
          <p className="flex items-center gap-2.5 font-script text-[12px] font-bold uppercase tracking-[0.14em] text-black/60 pointer-events-none">
            <motion.span
              className="relative grid place-items-center w-6 h-7 shrink-0"
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              <svg aria-hidden="true" viewBox="0 0 40 46" className="absolute inset-0 w-full h-full">
                <polygon points={HEX} fill="#e9a648" />
              </svg>
              <TbCheck className="relative text-[13px] text-neutral-950" />
            </motion.span>
            Request received
          </p>
          <h2 className="mt-5 font-display uppercase text-[44px] 700:text-[52px] leading-none tracking-[0.01em] pointer-events-none">
            Thanks{first ? `, ${first}` : ""}.
          </h2>
          <p className="mt-4 text-[15.5px] 700:text-[17px] leading-relaxed text-black/55 pointer-events-none">
            {booked ? "Your site visit is on the calendar." : `Step ${DONE} of ${STEPS.length} is done.`} Here&apos;s
            how the rest goes.
          </p>
        </div>

        <div className="1080:col-start-2 1080:row-start-1 1080:row-span-2">
          <StepTracker />
          <motion.div
            className="mt-8 bg-[#f6f4ef] border-l-[3px] border-third p-6 700:p-7 pointer-events-none"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.45, ease: EASE }}
          >
            <p className="flex items-center gap-2.5 font-script text-[11.5px] font-bold uppercase tracking-[0.14em] text-black/50">
              <span className="w-1.5 h-1.5 shrink-0 bg-third" />
              Up next
            </p>
            <h3 className="mt-3 font-display uppercase text-[28px] 700:text-[32px] leading-none tracking-[0.01em]">
              {STEPS[DONE].label}
            </h3>
            {booked && (
              <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="flex items-center gap-2 text-[16px] 700:text-[17px] font-semibold text-neutral-950">
                  <TbCalendarEvent aria-hidden="true" className="shrink-0 text-[20px] text-third" />
                  <span>
                    {visitDayLong(visit.slot)} at <span className="whitespace-nowrap">{visitTime(visit.slot)}</span>
                  </span>
                </span>
                <span className="font-script text-[11px] uppercase tracking-[0.14em] text-black/45">Pacific time</span>
              </p>
            )}
            <p className="mt-3 text-[15px] 700:text-[16px] leading-relaxed text-black/65">{nextVisitText(visit)}</p>
          </motion.div>
        </div>

        <div className="1080:col-start-1 1080:row-start-2 1080:self-end pt-6 1080:pt-0 border-t border-black/10 1080:border-t-0">
          {phone && (
            <p className="text-[14.5px] text-black/55 pointer-events-none">
              Rather talk now?{" "}
              <a
                href={phone}
                className="pointer-events-auto inline-flex items-center gap-1.5 font-semibold text-neutral-950 whitespace-nowrap underline decoration-black/25 underline-offset-4 hover:decoration-third transition-colors duration-200"
              >
                <TbPhone className="text-third" /> {phoneDisplay()}
              </a>
            </p>
          )}
          <p className="mt-2 font-script text-[11px] uppercase tracking-[0.14em] text-black/40 pointer-events-none">
            Licensed &amp; insured{BUSINESS.license ? ` · CSLB #${BUSINESS.license}` : ""}
          </p>
        </div>
      </div>
    </ModalShell>
  );
}
