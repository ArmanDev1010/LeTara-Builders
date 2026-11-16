"use client";

import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { TbCheck, TbFileTypePdf, TbLoader2, TbPaperclip, TbX } from "react-icons/tb";
import ArrowButton from "@/components/UI/ArrowButton";
import { ATTACH, detailQuestions } from "@/data/projectDetails";
import { phoneDisplay } from "@/data/business";
import { shrinkImage } from "@/lib/shrinkImage";
import { visitDay, visitTime } from "@/lib/visitTimes";

const focusRing = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-third";
const label = "block font-script text-[11.5px] uppercase tracking-[0.12em] text-white/55";

const kb = (bytes) => (bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`);

// What the visitor's told now that the request is in: the call booked, a
// time that couldn't be held, or no time picked.
function Received({ slot, booked }) {
  return (
    <p className="flex items-start gap-3 border border-third/35 bg-third/[0.07] px-4 py-3 text-[14px] leading-snug text-white/80 pointer-events-none">
      <span className="grid place-items-center w-5 h-5 mt-px shrink-0 bg-third text-neutral-950">
        <TbCheck aria-hidden="true" className="text-[14px]" />
      </span>
      <span>
        <strong className="text-neutral-50">Request received.</strong>{" "}
        {slot && booked
          ? `Andy will call you ${visitDay(slot)} at ${visitTime(slot)}, Pacific time.`
          : slot
            ? "We couldn't hold that time, so Andy will call you to set one."
            : "Andy will call you to set a time for your consultation."}{" "}
        Anything below helps him prepare.
      </span>
    </p>
  );
}

// One question: its options as chips, one answer or several (`many`).
function Chips({ question, value, onChange }) {
  const many = Boolean(question.many);
  const options = question.many ?? question.one;
  const picked = [].concat(value ?? []);
  const toggle = (option) => {
    if (!many) return onChange(picked[0] === option ? undefined : option);
    onChange(picked.includes(option) ? picked.filter((o) => o !== option) : [...picked, option]);
  };
  return (
    <div role="group" aria-label={question.label}>
      <p className={`${label} pointer-events-none`}>
        {question.label}
        {many && <span className="normal-case tracking-normal text-white/35"> · pick any</span>}
      </p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {options.map((option) => {
          const on = picked.includes(option);
          return (
            <button
              key={option}
              type="button"
              onClick={() => toggle(option)}
              aria-pressed={on}
              className={`h-9 px-3 border text-[13.5px] leading-none transition-colors duration-200 cursor-pointer ${focusRing} ${
                on ? "border-third bg-third/[0.12] text-third font-semibold" : "border-white/15 bg-white/[0.02] text-white/80 hover:border-white/40"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// A file in the list: its picture (or a PDF mark), name and size, and how
// its upload is going; removable until it's sent.
function FileRow({ item, onRemove, busy }) {
  return (
    <li className="flex items-center gap-3 border border-white/12 bg-white/[0.02] p-2 pr-3">
      <span className="grid place-items-center w-11 h-11 shrink-0 overflow-hidden bg-white/[0.05] text-third pointer-events-none">
        {item.preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.preview} alt="" className="w-full h-full object-cover" />
        ) : (
          <TbFileTypePdf aria-hidden="true" className="text-[22px]" />
        )}
      </span>
      <span className="min-w-0 flex-1 pointer-events-none">
        <span className="block truncate text-[13.5px] text-neutral-50">{item.file.name}</span>
        <span className="block text-[12px] text-white/45">
          {item.status === "failed" ? "Didn't go through" : item.status === "sent" ? "Sent" : kb(item.file.size)}
        </span>
      </span>
      {item.status === "sending" ? (
        <TbLoader2 aria-label="Sending" className="shrink-0 text-[18px] text-third animate-spin" />
      ) : item.status === "sent" ? (
        <TbCheck aria-label="Sent" className="shrink-0 text-[18px] text-third" />
      ) : (
        !busy && (
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Remove ${item.file.name}`}
            className={`grid place-items-center w-8 h-8 shrink-0 text-white/50 hover:text-white cursor-pointer ${focusRing}`}
          >
            <TbX className="text-[16px]" />
          </button>
        )
      )}
    </li>
  );
}

// The quote form's optional last step (Andranik, 11-16), shown once the
// request is in (the contact step sends it): what's been received, then
// questions answered with a tap, by project (data/projectDetails), the
// visitor's own words, and photos or plans to attach. "Send details" sends
// each file on its own (photos made smaller first, lib/shrinkImage), then the
// answers with the files' addresses, to the lead its first part made
// (`sent.ref`); "Skip" finishes without them. Either way the thank-you opens
// (`onDone`).
export default function DetailsStep({ project, slot, sent, onDone }) {
  const questions = detailQuestions(project);
  const [answers, setAnswers] = useState({});
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState([]);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(null);
  const previews = useRef([]);

  // the pictures' object URLs go when the step does
  useEffect(() => () => previews.current.forEach((url) => URL.revokeObjectURL(url)), []);

  const setStatus = (id, status) => setFiles((list) => list.map((f) => (f.id === id ? { ...f, status } : f)));

  const add = async (picked) => {
    const room = ATTACH.max - files.length;
    if (picked.length > room) toast.error(`Up to ${ATTACH.max} files, please.`);
    const added = [];
    for (const original of picked.slice(0, Math.max(0, room))) {
      const pdf = original.type === "application/pdf";
      let file = pdf ? original : await shrinkImage(original);
      // a photo the browser can't open (HEIC outside Safari): as it is, if
      // it's a JPEG or PNG small enough to send
      if (!file && /^image\/(jpeg|png)$/.test(original.type) && original.size <= ATTACH.maxBytes) file = original;
      if (!file) {
        toast.error(`${original.name} couldn't be opened. Please attach it as a JPG or PNG.`);
        continue;
      }
      if (file.size > ATTACH.maxBytes) {
        toast.error(`${original.name} is over 4 MB. Bring it to the call, or email it to us.`);
        continue;
      }
      const preview = pdf ? null : URL.createObjectURL(file);
      if (preview) previews.current.push(preview);
      added.push({ id: `${Date.now()}-${Math.random()}`, file, preview, status: "ready" });
    }
    setFiles((list) => [...list, ...added]);
  };

  const send = async () => {
    setBusy(true);
    const uploaded = [];
    const failed = [];
    const toSend = files.filter((f) => f.status !== "sent");
    for (const [i, item] of toSend.entries()) {
      setProgress(`Sending file ${i + 1} of ${toSend.length}…`);
      setStatus(item.id, "sending");
      try {
        const body = new FormData();
        body.append("ref", sent.ref);
        body.append("file", item.file, item.file.name);
        const res = await fetch("/api/contact/files", { method: "POST", body });
        if (!res.ok) throw new Error(String(res.status));
        const { url } = await res.json();
        uploaded.push({ name: item.file.name, url });
        setStatus(item.id, "sent");
      } catch {
        failed.push(item.file.name);
        setStatus(item.id, "failed");
      }
    }
    setProgress("Sending…");
    try {
      const res = await fetch("/api/contact/details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ref: sent.ref, answers, message, files: uploaded.filter((f) => f.url), failed }),
      });
      if (!res.ok) throw new Error(String(res.status));
    } catch {
      toast.error("Your details didn't go through, but your request did. Tell Andy on the call.");
    }
    if (failed.length) {
      toast.error(`${failed.length === 1 ? "A file" : `${failed.length} files`} didn't go through. You can text ${failed.length === 1 ? "it" : "them"} to ${phoneDisplay()}.`, { duration: 8000 });
    }
    setBusy(false);
    setProgress(null);
    onDone();
  };

  const answered = Object.values(answers).some((v) => [].concat(v ?? []).length) || message.trim() || files.length;

  return (
    <div>
      <Received slot={slot} booked={sent.booked} />

      <div className="mt-6 grid gap-x-8 gap-y-5 @min-[640px]:grid-cols-2">
        {questions.map((question) => (
          <Chips
            key={question.id}
            question={question}
            value={answers[question.id]}
            onChange={(value) => setAnswers((prev) => ({ ...prev, [question.id]: value }))}
          />
        ))}
      </div>

      <div className="mt-6 grid gap-x-8 gap-y-5 @min-[640px]:grid-cols-2">
        <label className="block">
          <span className={label}>Anything else?</span>
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            rows={4}
            maxLength={5000}
            placeholder="What you have in mind, what matters most, questions for Andy."
            className="mt-2 w-full bg-white/[0.04] border border-white/12 px-4 py-3 text-[16px] leading-relaxed text-neutral-50 outline-none resize-none placeholder:text-white/30 focus:border-third transition-colors duration-200"
          />
        </label>
        <div>
          <p className={`${label} pointer-events-none`}>Photos or plans</p>
          {files.length < ATTACH.max && !busy && (
            <label
              className={`mt-2 flex items-center gap-3 border border-dashed border-white/25 px-4 py-3.5 cursor-pointer hover:border-third transition-colors duration-200 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-third`}
            >
              <TbPaperclip aria-hidden="true" className="shrink-0 text-[20px] text-third" />
              <span className="min-w-0">
                <span className="block text-[14.5px] font-semibold text-neutral-50">Add photos or plans</span>
                <span className="block text-[12.5px] text-white/45">Up to {ATTACH.max} files: photos, or PDFs up to 4 MB</span>
              </span>
              <input
                type="file"
                multiple
                accept={ATTACH.accept}
                className="sr-only"
                onChange={(event) => {
                  add([...event.target.files]);
                  event.target.value = "";
                }}
              />
            </label>
          )}
          {files.length > 0 && (
            <ul className="mt-2 grid gap-1.5">
              {files.map((item) => (
                <FileRow key={item.id} item={item} busy={busy} onRemove={() => setFiles((list) => list.filter((f) => f.id !== item.id))} />
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* held at the dialog's foot while the questions scroll, so they're never
          out of sight */}
      <div className="sticky bottom-0 z-10 mt-6 pt-4 pb-1 flex flex-wrap items-center gap-x-6 gap-y-3 bg-[#0d0c0b] shadow-[0_-18px_18px_-6px_#0d0c0b]">
        <ArrowButton type="button" onClick={send} disabled={busy || !answered || !sent.ref} className="w-full @min-[480px]:w-auto">
          {progress ?? "Send details"}
        </ArrowButton>
        {!busy && (
          <button
            type="button"
            onClick={onDone}
            className={`font-script text-[12px] uppercase tracking-[0.12em] text-white/55 underline underline-offset-4 decoration-white/25 hover:text-white cursor-pointer ${focusRing}`}
          >
            Skip, I&apos;m done
          </button>
        )}
      </div>
    </div>
  );
}
