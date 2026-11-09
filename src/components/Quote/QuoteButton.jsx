"use client";

import { useModal } from "@/context/ModalContext";
import ArrowButton from "@/components/UI/ArrowButton";

// "Get a Free Quote": opens the quote request (QuoteModals). `tone="light"`
// on a white section.
export default function QuoteButton({ tone, className = "" }) {
  const { toggleModal } = useModal();
  return (
    <ArrowButton type="button" onClick={toggleModal} aria-haspopup="dialog" tone={tone} className={className}>
      Get a Free Quote
    </ArrowButton>
  );
}
