"use client";

import { useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { useModal } from "@/context/ModalContext";
import ModalShell from "@/components/Quote/ModalShell";
import EstimateForm from "@/components/Quote/EstimateForm";
import ThanksModal from "@/components/Quote/ThanksModal";

// The quote request and, once it's sent, the thank-you in its place (see
// openThanks in context/ModalContext). Mounted once, in the root layout, so
// any "Get a Free Quote" button anywhere opens the same one. The page
// underneath doesn't scroll while either is open, or while the navbar's phone
// menu is (this is the one place that locks it).
//
// Even locked, an iPhone scrolls the page under the dialog to bring a field
// above its keyboard, and leaves it there when the keyboard goes down; so
// once no field has focus, the page goes back to where it was. (The body's
// overflow, not the root's: on both, the body would become a scroll box of
// its own and the hero's sticky panel would jump.)
export default function QuoteModals() {
  const { showModal, toggleModal, thanks, closeThanks, menuActive } = useModal();
  const showThanks = thanks !== null;
  const locked = showModal || showThanks || menuActive;

  useEffect(() => {
    if (!locked) return;
    const y = window.scrollY;
    let timer;
    const settle = () => {
      clearTimeout(timer);
      // after the keyboard has gone (moving to the next field keeps it up)
      timer = setTimeout(() => {
        if (document.activeElement?.matches("input, textarea, select")) return;
        if (Math.abs(window.scrollY - y) > 1) window.scrollTo({ top: y, behavior: "instant" });
      }, 350);
    };
    document.body.style.overflow = "hidden";
    document.addEventListener("focusout", settle);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("focusout", settle);
      document.body.style.overflow = "";
    };
  }, [locked]);

  // "wait" lets the request finish closing before the thank-you opens.
  return (
    <AnimatePresence mode="wait">
      {showModal && (
        <ModalShell
          key="quote"
          title="Get a Free Quote"
          aside="Takes about a minute"
          labelId="quote-title"
          onClose={toggleModal}
          className="max-w-[1000px]"
        >
          <EstimateForm />
        </ModalShell>
      )}
      {showThanks && <ThanksModal key="thanks" name={thanks.name} visit={thanks.visit} onClose={closeThanks} />}
    </AnimatePresence>
  );
}
