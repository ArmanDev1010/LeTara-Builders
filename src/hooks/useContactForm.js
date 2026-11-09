"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useModal } from "@/context/ModalContext";

// `extraData` is sent along with the form's own fields (the estimate form's
// answers, which aren't inputs); `onSuccess` runs after a successful send.
// `thanksFor(result)` adds to what the thank-you is told, from the API's
// reply (whether the visit was booked).
export function useContactForm({ defaultValues, extraData, thanksFor, onSuccess } = {}) {
  const { openThanks } = useModal();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({ defaultValues });
  const {
    handleSubmit,
    reset,
    formState: { errors },
  } = form;

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, ...extraData }),
      });

      if (res.ok) {
        const result = await res.json().catch(() => ({}));
        const thanks = { name: data.name ?? "", ...thanksFor?.(result) };
        reset();
        onSuccess?.();
        openThanks(thanks);
      } else if (res.status === 400) {
        // turned away (something missing): say what
        const { error } = await res.json().catch(() => ({}));
        toast.error(error ? `${error}.` : "Please check the form and try again.");
      } else {
        toast.error("Delivery failed. Please try again.");
      }
    } catch (err) {
      console.error("Submission error:", err);
      toast.error("Something went wrong. Try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onInvalid = (formErrors) => {
    const firstError = Object.values(formErrors)[0];
    toast.error(
      firstError?.message || "Please fill out all required fields correctly.",
    );
  };

  const fieldStyle = (clean) => ({
    borderBottom: errors[clean]
      ? "1px solid red"
      : "1px solid hsla(0, 0%, 83.9%, .3)",
  });

  return {
    ...form,
    isSubmitting,
    handleFormSubmit: handleSubmit(onSubmit, onInvalid),
    fieldStyle,
  };
}
