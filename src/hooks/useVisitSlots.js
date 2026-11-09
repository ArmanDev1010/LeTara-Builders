"use client";

import { useEffect, useState } from "react";

// The site-visit times the quote form offers (app/api/availability), loaded
// once and shared: the form starts loading them as soon as a project is
// picked, so they're usually there by the time the visit step opens. They're
// loaded again after a couple of minutes, and after a request is sent (the
// booked time is gone).
const FRESH_MS = 2 * 60 * 1000;
let cache = null; // { at, promise }

export function loadVisitSlots() {
  if (cache && Date.now() - cache.at < FRESH_MS) return cache.promise;
  const promise = fetch("/api/availability", { cache: "no-store" })
    .then((res) => (res.ok ? res.json() : Promise.reject(new Error(`availability ${res.status}`))))
    .then((data) => {
      const days = Object.fromEntries(
        Object.entries(data.days ?? {}).filter(([, slots]) => Array.isArray(slots) && slots.length),
      );
      return { available: Boolean(data.available) && Object.keys(days).length > 0, days };
    });
  cache = { at: Date.now(), promise };
  // a failed load isn't kept, so the next try asks again
  promise.catch(() => {
    if (cache?.promise === promise) cache = null;
  });
  return promise;
}

export const forgetVisitSlots = () => {
  cache = null;
};

// { status: "loading" | "ready" | "none" | "error", days }
export function useVisitSlots() {
  const [state, setState] = useState({ status: "loading", days: {} });
  useEffect(() => {
    let live = true;
    loadVisitSlots().then(
      (data) => live && setState({ status: data.available ? "ready" : "none", days: data.days }),
      () => live && setState({ status: "error", days: {} }),
    );
    return () => {
      live = false;
    };
  }, []);
  return state;
}
