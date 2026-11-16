"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

// The quote form's fields (react-hook-form) and its send to /api/contact.
// `extraData` is sent along with the fields (the answers that aren't inputs:
// the project, the call time); `onSent(result, data)` runs once it's in,
// with the API's reply ({ booked, ref }). Since 11-16 the form sends at its
// contact step and carries on to an optional last step, so the thank-you is
// the form's to open, not this hook's.
export function useContactForm({ defaultValues, extraData, onSent } = {}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({ defaultValues });
  const { handleSubmit } = form;

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
        onSent?.(result, data);
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
    toast.error(firstError?.message || "Please fill out all required fields correctly.");
  };

  return {
    ...form,
    isSubmitting,
    handleFormSubmit: handleSubmit(onSubmit, onInvalid),
  };
}
