// Shared by the heroes: the drawn ones (HeroIntro, ServiceHero) and the
// scroll-played timelapse (HeroBuildSequence).

// Whether this hero's page was reached by a link inside the site — not
// loaded, reloaded, or come back to with Back/Forward. Asked once per page:
// a link followed since the last hero, or, for the first hero shown (it may
// load with a later page), a page other than the one loaded.
let followedLink = false;
let firstHero = true;
if (typeof window !== "undefined") {
  window.addEventListener(
    "click",
    (event) => event.target.closest?.("a[href]") && (followedLink = true),
    true,
  );
  window.addEventListener("popstate", () => (followedLink = false));
}
export function reachedByLink() {
  const page = (url) => url?.split("#")[0];
  const loaded = performance.getEntriesByType?.("navigation")[0]?.name;
  const answer =
    followedLink || (firstHero && page(loaded) !== page(location.href));
  followedLink = false;
  firstHero = false;
  return answer;
}

// The drawn heroes (HeroIntro, ServiceHero) on a screen held sideways too
// short for the scene and the copy together: the scene a screen tall, the
// copy below it. The same query as the `intro-still` variant in
// globals.css.
export const STILL_QUERY = "(max-height: 500px) and (orientation: landscape)";

// The timelapse heroes (HeroBuildSequence) show their opening frame, the
// finished job, as a still on touch screens too: phones and tablets,
// scrolled with a finger, where scrubbing through frames felt off (the
// user's call on HB Links). A laptop with a touchscreen still has a mouse or
// trackpad as its main pointer, and plays. The same query as the
// `hero-static` variant in globals.css.
export const STATIC_QUERY =
  "(max-height: 500px) and (orientation: landscape), (hover: none) and (pointer: coarse)";

// "Reduce motion": the heroes still play as the visitor scrolls, but calmer.
export const CALM_QUERY = "(prefers-reduced-motion: reduce)";
