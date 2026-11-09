"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { TbArrowLeft, TbArrowRight, TbCheck, TbPhone } from "react-icons/tb";

import VisitStep from "@/components/Quote/VisitStep";
import ArrowButton from "@/components/UI/ArrowButton";
import { FormLegalNote, SmsConsent } from "@/components/UI/FormConsent";
import { useContactForm } from "@/hooks/useContactForm";
import { forgetVisitSlots, loadVisitSlots } from "@/hooks/useVisitSlots";
import { EMAIL_PATTERN, STREET_PATTERN, ZIP_PATTERN, isCaliforniaZip } from "@/lib/fields";
import { PHONE_PATTERN, formatPhoneInput } from "@/lib/phone";
import { visitDay, visitNumericDay, visitTime, visitTimeShort } from "@/lib/visitTimes";
import { BUSINESS, phoneDisplay, phoneHref } from "@/data/business";
import { ESTIMATE_STEPS, findProject } from "@/data/estimate";

const EASE = [0.22, 1, 0.36, 1];

// Long enough to see the pick land before the next question slides in.
const ADVANCE_DELAY = 260;

// On the page, how far below the window's top the form is scrolled back to:
// clear of the floating navbar (as the sections' scroll-mt-24).
const PAGE_NAV_CLEAR = 96;

// `visit`: the picked slot (an ISO time), "call" for "call me to set a
// time", or null before the step's answered.
// The address and contact steps are form fields instead (react-hook-form).
const EMPTY_ANSWERS = { project: null, visit: null };

// Each field step's fields, checked before moving on from it.
const STEP_FIELDS = { location: ["street", "city", "zip"], contact: ["name", "phone", "mail"] };

const slide = {
  enter: (direction) => ({ opacity: 0, x: direction * 28 }),
  center: { opacity: 1, x: 0 },
  exit: (direction) => ({ opacity: 0, x: direction * -28 }),
};

// The nearest ancestor that scrolls on its own (the dialog's body), or null
// when the window scrolls.
function scrollParent(node) {
  for (let el = node?.parentElement; el && el !== document.body; el = el.parentElement) {
    const { overflowY } = getComputedStyle(el);
    if ((overflowY === "auto" || overflowY === "scroll") && el.scrollHeight > el.clientHeight) return el;
  }
  return null;
}

// 16px at least, on every text field: an iPhone zooms the page in on a field
// smaller than that as it's tapped, and stays zoomed when the keyboard
// closes (the user caught it: the page stuck zoomed in, swipes moving the
// page behind the dialog)
const inputClasses =
  "w-full h-12 bg-white/[0.04] border-b px-4 text-[16px] text-neutral-50 outline-none placeholder:text-white/30 transition-colors duration-200";
const borderFor = (error) => (error ? "border-red-400" : "border-white/20 focus:border-third");

function OptionCard({ option, selected, onSelect }) {
  const Icon = option.icon;
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`relative w-full flex items-center gap-4 border px-4 py-4 550:px-5 text-left transition-colors duration-200 cursor-pointer ${
        selected ? "border-third bg-third/[0.08]" : "border-white/12 bg-white/[0.02] hover:border-white/35"
      }`}
    >
      <span
        className={`grid place-items-center w-11 h-11 shrink-0 border text-[22px] transition-colors duration-200 ${
          selected ? "border-third/50 text-third" : "border-white/15 text-white/70"
        }`}
      >
        <Icon />
      </span>
      <span className="min-w-0 pr-5">
        <span className="block text-[15px] font-semibold leading-snug">{option.title}</span>
        <span className="block mt-0.5 text-[13px] leading-snug text-white/50">{option.hint}</span>
      </span>
      {selected && (
        <span className="absolute top-2.5 right-2.5 grid place-items-center w-5 h-5 bg-third text-neutral-950 text-[13px]">
          <TbCheck />
        </span>
      )}
    </button>
  );
}

// The <label> wraps its input, which ties the two together for screen
// readers without an id (the form could be on a page and in the dialog at
// once, and generated ids don't stay stable between server and client).
function Field({ label, error, className = "", children }) {
  return (
    <label className={`block min-w-0 ${className}`}>
      <span className="block font-script text-[12px] uppercase tracking-[0.12em] text-white/55">{label}</span>
      {children}
      {error && <span className="block mt-1 text-xs text-red-400">{error.message}</span>}
    </label>
  );
}

// A step of fields with a Continue button: Enter in any field continues too,
// and `onContinue` checks the fields before moving on.
function StepForm({ onContinue, children }) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onContinue();
      }}
      noValidate
    >
      {children}
      <ArrowButton type="submit" className="mt-6">
        Continue
      </ArrowButton>
    </form>
  );
}

// The property's whole address (the user asked for it, 11-09): street with
// the house number, city and a California ZIP, all required. The state is
// California. One row where there's room, else the street above city and ZIP.
// The names and autocomplete tokens let browsers fill it in.
function LocationStep({ form, onContinue }) {
  const {
    register,
    formState: { errors },
  } = form;
  return (
    <StepForm onContinue={onContinue}>
      <div className="grid grid-cols-[minmax(0,1fr)_7.5rem] @min-[720px]:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)_9rem] gap-x-4 gap-y-5">
        <Field label="Street address" error={errors.street} className="col-span-2 @min-[720px]:col-span-1">
          <input
            {...register("street", {
              required: "The street address is required.",
              pattern: { value: STREET_PATTERN, message: "Please start with the house number, e.g. 12345 Main St." },
            })}
            type="text"
            autoComplete="address-line1"
            placeholder="House number and street"
            className={`mt-1.5 ${inputClasses} ${borderFor(errors.street)}`}
          />
        </Field>
        <Field label="City" error={errors.city}>
          <input
            {...register("city", { required: "The city is required." })}
            type="text"
            autoComplete="address-level2"
            placeholder="City"
            className={`mt-1.5 ${inputClasses} ${borderFor(errors.city)}`}
          />
        </Field>
        <Field label="ZIP code" error={errors.zip}>
          <input
            {...register("zip", {
              required: "The ZIP code is required.",
              pattern: { value: ZIP_PATTERN, message: "Please enter a 5-digit ZIP code." },
              validate: (zip) => isCaliforniaZip(zip) || "Please enter a California ZIP code.",
            })}
            type="text"
            inputMode="numeric"
            autoComplete="postal-code"
            maxLength={10}
            placeholder="ZIP"
            className={`mt-1.5 ${inputClasses} ${borderFor(errors.zip)}`}
          />
        </Field>
      </div>
    </StepForm>
  );
}

// Name, phone and email, all required, with the optional text opt-in under
// them: three across where there's room, else the name above phone and
// email. Continue checks them before moving on; the request itself is sent
// from the last step. The phone shapes itself into (747) 777-7777 as it's
// typed (lib/phone, as on HB Links).
function ContactStep({ form, onContinue }) {
  const {
    register,
    formState: { errors },
  } = form;
  const phoneField = register("phone", {
    required: "Your phone number is required.",
    pattern: { value: PHONE_PATTERN, message: "Please enter a 10-digit phone number." },
  });
  return (
    <StepForm onContinue={onContinue}>
      <div className="grid grid-cols-1 @min-[520px]:grid-cols-2 @min-[760px]:grid-cols-3 gap-x-4 gap-y-5">
        <Field label="Name" error={errors.name} className="@min-[520px]:col-span-2 @min-[760px]:col-span-1">
          <input
            {...register("name", { required: "Your name is required." })}
            type="text"
            autoComplete="name"
            placeholder="Your name"
            className={`mt-1.5 ${inputClasses} ${borderFor(errors.name)}`}
          />
        </Field>
        <Field label="Phone" error={errors.phone}>
          <input
            {...phoneField}
            onChange={(event) => {
              formatPhoneInput(event.target);
              return phoneField.onChange(event);
            }}
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            placeholder="(818) 555-0123"
            className={`mt-1.5 ${inputClasses} ${borderFor(errors.phone)}`}
          />
        </Field>
        <Field label="Email" error={errors.mail}>
          <input
            {...register("mail", {
              required: "Your email is required.",
              pattern: { value: EMAIL_PATTERN, message: "Please enter a valid email address." },
            })}
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@example.com"
            className={`mt-1.5 ${inputClasses} ${borderFor(errors.mail)}`}
          />
        </Field>
      </div>
      <SmsConsent register={register} dark className="mt-5" />
    </StepForm>
  );
}

// The optional message, and the button that sends the request. `lt_check`
// is a field people never see or reach: only a bot fills it in, and the API
// route quietly drops those requests (there's no CAPTCHA).
function DetailsStep({ form }) {
  const { register, handleFormSubmit, isSubmitting } = form;
  return (
    <form onSubmit={handleFormSubmit} noValidate>
      <textarea
        {...register("message")}
        aria-label="Anything else we should know? (optional)"
        rows={4}
        placeholder="Lot size, budget, timing, ideas you have in mind: whatever helps."
        className="w-full bg-white/[0.04] border border-white/12 px-4 py-3 text-[16px] leading-relaxed text-neutral-50 outline-none resize-none placeholder:text-white/30 focus:border-third transition-colors duration-200"
      />
      <div aria-hidden="true" className="sr-only">
        <input type="text" tabIndex={-1} autoComplete="off" {...register("lt_check")} />
      </div>
      <ArrowButton type="submit" disabled={isSubmitting} className="mt-5 w-full @min-[480px]:w-auto">
        {isSubmitting ? "Sending…" : "Request my free quote"}
      </ArrowButton>
      <FormLegalNote dark className="mt-4" />
    </form>
  );
}

// The visit's answer in its tile, on two lines (day, then time) so the time
// is never cut off: "11/12 / 10:30a" in a narrow tile, "Tue, Nov 12 /
// 10:30 AM" where there's room.
function VisitTileValue({ visit }) {
  if (visit === "call") {
    return (
      <>
        <span className="@min-[480px]:hidden">Call me</span>
        <span className="@max-[480px]:hidden">We&apos;ll call</span>
      </>
    );
  }
  return (
    <>
      <span className="block truncate">
        <span className="@min-[580px]:hidden">{visitNumericDay(visit)}</span>
        <span className="@max-[580px]:hidden">{visitDay(visit)}</span>
      </span>
      <span className="block truncate">
        <span className="@min-[580px]:hidden">{visitTimeShort(visit)}</span>
        <span className="@max-[580px]:hidden">{visitTime(visit)}</span>
      </span>
    </>
  );
}

// The progress, as a tile per step under the question (the user's design):
// each one's top edge is the progress line, gold up to the step being
// answered, and inside is that step's answer as it comes in, a gold check
// once it's done. A tile already reached goes back to that step. The tiles
// size themselves by the row's own width (@container), not the screen's: the
// form is also in the homepage's narrower contact column. Narrow, the answers
// truncate (a tap still opens the step), the check sits on the tile's top
// edge, and "Optional" is a dash.
function StepTiles({ values, step, reached, onJump }) {
  return (
    <ol aria-label="Your request" className="@container mt-5 short:mt-4 grid grid-cols-5 gap-1.5 550:gap-2">
      {ESTIMATE_STEPS.map((s, i) => {
        const value = values[s.id];
        const current = i === step;
        const done = !current && i < reached && (Boolean(value) || s.optional);
        const twoLines = s.id === "visit" && value;
        return (
          <li key={s.id} className="min-w-0">
            <button
              type="button"
              onClick={() => onJump(i)}
              disabled={i > reached || current}
              aria-current={current ? "step" : undefined}
              className={`group relative flex flex-col justify-start w-full h-full text-left border px-1.5 @min-[400px]:px-2 @min-[480px]:px-3.5 pt-3 pb-2.5 transition-colors duration-300 disabled:cursor-default enabled:cursor-pointer ${
                current
                  ? "border-third/45 bg-third/[0.07]"
                  : done
                    ? "border-white/15 bg-white/[0.03] enabled:hover:border-white/35"
                    : "border-white/[0.08]"
              }`}
            >
              <span
                aria-hidden="true"
                className={`absolute -inset-x-px -top-px h-[3px] transition-colors duration-500 ${
                  i <= step || done ? "bg-third" : "bg-white/12"
                }`}
              />
              {/* narrow, the check sits on the tile's top edge, leaving the label room */}
              {done && (
                <span
                  aria-hidden="true"
                  className="@min-[480px]:hidden absolute -top-[6px] right-1.5 grid place-items-center w-[14px] h-[14px] bg-third text-neutral-950"
                >
                  <TbCheck className="text-[11px]" />
                </span>
              )}
              <span className="flex items-center justify-between gap-1 font-script uppercase text-[9.5px] tracking-[0.06em] @min-[480px]:text-[11px] @min-[480px]:tracking-[0.14em] text-white/45">
                <span className="truncate">
                  {s.label}
                  {done && <span className="sr-only"> (done)</span>}
                </span>
                {done && <TbCheck aria-hidden="true" className="@max-[480px]:hidden shrink-0 text-third text-[14px]" />}
              </span>
              <span
                className={`mt-1 break-words text-[12px] leading-tight @min-[480px]:text-[14px] @min-[480px]:leading-normal transition-colors duration-200 ${
                  twoLines ? "" : "line-clamp-2 @min-[480px]:[-webkit-line-clamp:1]"
                } ${value ? "font-semibold text-neutral-50 group-enabled:group-hover:text-third" : "text-white/25"}`}
              >
                {value ||
                  (current ? (
                    <>
                      <span className="@max-[480px]:hidden">Answering…</span>
                      <span className="@min-[480px]:hidden">Now</span>
                    </>
                  ) : s.optional ? (
                    <>
                      <span className="@max-[480px]:hidden">Optional</span>
                      <span className="@min-[480px]:hidden">—</span>
                    </>
                  ) : (
                    "—"
                  ))}
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}

// On a phone, in place of the tiles (the user preferred HB Links' phone
// version, with nothing showing what's still to come): the answers so far on
// one line across the top, each tappable to go back to its step. Hidden
// until there's a first answer.
function YourPicks({ picks, step, onJump }) {
  if (!picks.length) return null;
  return (
    <div className="550:hidden px-5 py-3 border-b border-white/10 bg-white/[0.03]">
      <p className="font-script text-[10.5px] uppercase tracking-[0.16em] text-white/45 pointer-events-none">
        Your picks <span className="normal-case tracking-normal text-white/30">· tap one to change it</span>
      </p>
      <p className="mt-1 text-[14px] font-semibold leading-relaxed">
        {picks.map((pick, i) => (
          <span key={pick.index}>
            {i > 0 && <span className="font-normal text-white/30 pointer-events-none"> · </span>}
            <button
              type="button"
              onClick={() => onJump(pick.index)}
              aria-current={pick.index === step ? "step" : undefined}
              className={`inline text-left break-words underline decoration-dotted underline-offset-4 transition-colors duration-200 cursor-pointer hover:text-third hover:decoration-third ${
                pick.index === step ? "text-third decoration-third" : "text-neutral-50 decoration-white/30"
              }`}
            >
              {pick.value}
            </button>
          </span>
        ))}
      </p>
    </div>
  );
}

// Along the foot of the dialog: the number, for anyone who'd rather talk,
// and the license (on a phone, just the number, on one line).
function TalkStrip() {
  const phone = phoneHref();
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 px-5 550:px-8 1080:px-10 py-4 short:py-3 border-t border-white/10 bg-white/[0.03]">
      {phone && (
        <p className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[13.5px] text-white/50 pointer-events-none">
          Rather talk it through?
          <a
            href={phone}
            className="pointer-events-auto inline-flex items-center gap-1.5 text-[15px] font-semibold text-neutral-50 hover:text-third transition-colors duration-200"
          >
            <TbPhone aria-hidden="true" className="text-third" /> {phoneDisplay()}
          </a>
        </p>
      )}
      <p className="max-550:hidden font-script text-[11px] uppercase tracking-[0.14em] text-white/35 pointer-events-none">
        Licensed &amp; insured{BUSINESS.license ? ` · CSLB #${BUSINESS.license}` : ""}
      </p>
    </div>
  );
}

// The five-step quote request (what, where, when, who, anything else), the
// same mechanics as HB Links' estimate form in LeTara's dress: each question
// is a "scene", a pick moves straight on, and the tiles under the question
// fill in with the answers as they come. "When" books the site visit on
// Andranik's GoHighLevel calendar; its times start loading as soon as a
// project is picked. Steps and options live in data/estimate.js. The quote
// dialog and the homepage's contact section both use it; the section sets
// `talk={false}`, its phone number already being beside it.
export default function EstimateForm({ talk = true }) {
  const [step, setStep] = useState(0);
  const [reached, setReached] = useState(0); // the furthest step reached
  const [direction, setDirection] = useState(1);
  const [answers, setAnswers] = useState(EMPTY_ANSWERS);
  const cardRef = useRef(null);
  const advanceTimer = useRef(null);
  const hasMoved = useRef(false);

  const total = ESTIMATE_STEPS.length;
  const current = ESTIMATE_STEPS[step];
  const project = findProject(answers.project);

  const goTo = (index) => {
    clearTimeout(advanceTimer.current);
    hasMoved.current = true;
    setDirection(index > step ? 1 : -1);
    setStep(index);
    setReached((r) => Math.max(r, index));
  };

  const slot = answers.visit && answers.visit !== "call" ? answers.visit : null;
  const form = useContactForm({
    extraData: { service: answers.project, slot },
    // the thank-you names the visit when it made it onto the calendar
    thanksFor: (result) => ({ visit: slot ? { slot, booked: Boolean(result?.booked) } : null }),
    onSuccess: () => {
      forgetVisitSlots();
      setAnswers(EMPTY_ANSWERS);
      setReached(0);
      goTo(0);
    },
  });
  const watched = (field) => (form.watch(field) ?? "").trim().replace(/\s+/g, " ");
  const [name, phone, message] = [watched("name"), watched("phone"), watched("message")];
  const values = {
    project: project?.title,
    location: [watched("street"), watched("city")].filter(Boolean).join(", "),
    visit: answers.visit ? <VisitTileValue visit={answers.visit} /> : null,
    contact: [name, phone].filter(Boolean).join(" · "),
    details: message,
  };

  // a pick (a project, a visit time) shows, then moves on
  const pickAndAdvance = (key, value) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
    clearTimeout(advanceTimer.current);
    advanceTimer.current = setTimeout(() => goTo(step + 1), ADVANCE_DELAY);
  };
  const choose = (value) => {
    // the visit times load while the next questions are answered
    loadVisitSlots().catch(() => {});
    pickAndAdvance("project", value);
  };
  // Moving forward (Continue, or a tile further on) checks the fields of the
  // step being left, so a field emptied on coming back can't be skipped past.
  const goForward = async (index) => {
    const fields = STEP_FIELDS[current.id];
    if (!fields || (await form.trigger(fields))) goTo(index);
  };
  const jump = (index) => (index < step ? goTo(index) : goForward(index));

  useEffect(() => () => clearTimeout(advanceTimer.current), []);

  // Once the next question has settled, bring the form's top back into view
  // if it scrolled away: in the dialog on a phone, where the options sit below
  // the fold, and on the page, where the visit step is tall and the one after
  // it short. On the page it stops below the floating navbar.
  useEffect(() => {
    if (!hasMoved.current) return;
    const id = setTimeout(() => {
      const card = cardRef.current;
      if (!card) return;
      const scroller = scrollParent(card);
      if (scroller) {
        const top = card.getBoundingClientRect().top - scroller.getBoundingClientRect().top;
        if (top < 0) scroller.scrollTo({ top: scroller.scrollTop + top - 12, behavior: "smooth" });
      } else if (!card.closest('[role="dialog"]')) {
        const top = card.getBoundingClientRect().top - PAGE_NAV_CLEAR;
        if (top < 0) window.scrollTo({ top: window.scrollY + top, behavior: "smooth" });
      }
    }, 420);
    return () => clearTimeout(id);
  }, [step]);

  let body;
  if (current.id === "project") {
    // two columns when there's room; an odd last option ("Not Sure Yet") spans both
    body = (
      <div className="grid gap-2.5 grid-cols-1 @min-[540px]:grid-cols-2 @min-[540px]:[&>*:last-child:nth-child(odd)]:col-span-2">
        {current.options.map((option) => (
          <OptionCard
            key={option.title}
            option={option}
            selected={answers.project === option.title}
            onSelect={() => choose(option.title)}
          />
        ))}
      </div>
    );
  } else if (current.id === "location") {
    body = <LocationStep form={form} onContinue={() => goForward(step + 1)} />;
  } else if (current.id === "visit") {
    body = (
      <VisitStep
        value={answers.visit}
        onPick={(visit) => pickAndAdvance("visit", visit)}
        onCall={() => pickAndAdvance("visit", "call")}
      />
    );
  } else if (current.id === "contact") {
    body = <ContactStep form={form} onContinue={() => goForward(step + 1)} />;
  } else {
    body = <DetailsStep form={form} />;
  }

  // the picking steps' footer: Continue once answered (to move on again
  // after coming back), a hint on the project step before that
  const picked = current.id === "project" ? answers.project : current.id === "visit" ? answers.visit : undefined;

  // the answers so far as text, for "Your picks" on a phone
  const picks = [
    project?.title,
    values.location,
    answers.visit && (answers.visit === "call" ? "We'll call to set a time" : `${visitDay(answers.visit)}, ${visitTime(answers.visit)}`),
    name,
  ]
    .map((value, index) => ({ value, index }))
    .filter((pick) => pick.value);

  // From 550px a steady height, so the dialog doesn't jump about as the steps
  // change; on a phone only as tall as the step, as HB Links' is.
  return (
    <div ref={cardRef} className="flex flex-col 550:min-h-[min(560px,82dvh)]">
      <YourPicks picks={picks} step={step} onJump={jump} />
      <div className="flex-1 flex flex-col">
        <div className="flex-1 min-w-0 px-5 550:px-8 1080:px-10 pt-5 550:pt-8 short:pt-5 pb-5 550:pb-6 short:pb-4 flex flex-col">
          <div className="pointer-events-none">
            <p className="font-script text-[12px] font-bold uppercase tracking-[0.14em] text-third">
              Scene {step + 1} of {total}
            </p>
            <AnimatePresence mode="wait" initial={false}>
              <motion.h2
                key={current.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="mt-2 font-display uppercase text-[28px] 550:text-[36px] 700:text-[40px] short:700:text-[36px] leading-none tracking-[0.01em]"
              >
                {current.question}
                {current.optional && <span className="text-white/35"> (optional)</span>}
              </motion.h2>
            </AnimatePresence>
            {/* on a phone, a progress line in place of the tiles */}
            <div
              role="progressbar"
              aria-label="Progress"
              aria-valuemin={1}
              aria-valuemax={total}
              aria-valuenow={step + 1}
              className="550:hidden mt-4 h-[3px] bg-white/10 overflow-hidden"
            >
              <div
                className="h-full bg-third origin-left transition-transform duration-500 ease-out"
                style={{ transform: `scaleX(${(step + 1) / total})` }}
              />
            </div>
          </div>
          <div className="max-550:hidden">
            <StepTiles values={values} step={step} reached={reached} onJump={jump} />
          </div>

          {/* @container: the steps lay themselves out by this column's width */}
          <div className="@container pt-6 pb-6 short:pt-4 short:pb-4 overflow-hidden">
            <AnimatePresence mode="wait" initial={false} custom={direction}>
              <motion.div
                key={current.id}
                custom={direction}
                variants={slide}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.28, ease: EASE }}
              >
                {body}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-auto flex items-center justify-between gap-4 font-script text-[12px] uppercase tracking-[0.12em]">
            {step > 0 ? (
              <button
                type="button"
                onClick={() => goTo(step - 1)}
                className="flex items-center gap-1.5 text-white/50 hover:text-white transition-colors duration-200 cursor-pointer"
              >
                <TbArrowLeft /> Back
              </button>
            ) : (
              <span />
            )}
            {picked ? (
              <button
                type="button"
                onClick={() => goTo(step + 1)}
                className="flex items-center gap-1.5 text-third hover:text-white transition-colors duration-200 cursor-pointer"
              >
                Continue <TbArrowRight />
              </button>
            ) : (
              current.options && <span className="text-white/40 pointer-events-none">Tap to continue</span>
            )}
          </div>
        </div>
      </div>
      {talk && <TalkStrip />}
    </div>
  );
}
