// What the two drawn heroes share: the homepage's (HeroIntro, played by the
// scroll) and a service page's (ServiceHero, the finished frame). How big
// the canvas may be, the faces the scene letters in, and where the copy sits
// for the scene to keep the house clear of it.

// The most canvas pixels (device px) the scene draws per frame: a bigger
// screen draws at a lower density rather than a slower frame rate.
export const PIXEL_BUDGET = 4_200_000;

// Phones and tablets get a lighter scene (`lite` in scene.js) at no more
// than 1.5 canvas px per CSS px: it's heavier to draw than HB Links', and on
// a phone that showed as a less smooth scroll.
export const LITE_QUERY = "(hover: none) and (pointer: coarse)";
export const LITE_DPR = 1.5;

// The canvas's density for a box of `width` x `height` CSS px.
export const sceneDpr = (width, height, lite) =>
  Math.min(window.devicePixelRatio || 1, lite ? LITE_DPR : 2, Math.sqrt(PIXEL_BUDGET / (width * height)));

// The site's display and typewriter faces (next/font, see app/layout.js),
// for the outline title and the notes.
export function sceneFonts() {
  const root = getComputedStyle(document.documentElement);
  const family = (name, fallback) => {
    const value = root.getPropertyValue(name).trim();
    return value ? `${value}, ${fallback}` : fallback;
  };
  return {
    display: family("--font-bebas-neue", "'Arial Narrow', sans-serif"),
    mono: family("--font-courier-prime", "'Courier New', monospace"),
  };
}

// Where the copy is, for the scene to keep the house clear of it, as
// fractions of the screen: `copyTop` (where the copy starts), `copyRight`
// (how far right its text reaches) and `titleRight` (the headline's). The
// scene puts the house beside the copy or above it, whichever lets it be
// bigger (see placeScene in scene.js); on a phone, above it. The still (a
// phone held sideways, the copy below it) has the screen to itself.
// `navZoom` is how much the navbar has grown on a big screen (--wide-zoom,
// globals.css), so the scene keeps clear of it.
//
// For "DREAM. DESIGN. BUILD.", spaced evenly between the navbar and what's
// under it: `navBottom` (px; the bar is fixed at the top), and the
// headline's box top, font size and line height (`head`, px), so the scene
// can find the top of its letters.
export function sceneLayout({ canvas, copy, width, height, portrait, still }) {
  const box = canvas.getBoundingClientRect();
  const navZoom = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--wide-zoom")) || 1;
  // (fixed to the screen, so where it is over the hero when the hero is at
  // the top, wherever the page is scrolled)
  const navBottom = document.querySelector("nav")?.getBoundingClientRect().bottom ?? null;
  if (still) return { copyTop: 1, copyRight: 0, titleRight: 0, navZoom, navBottom, head: null };
  const copyTop = (copy.getBoundingClientRect().top - box.top) / height;
  const h1 = copy.querySelector("h1");
  const title = h1?.getBoundingClientRect();
  const style = h1 && getComputedStyle(h1);
  const head = title ? { top: title.top - box.top, size: parseFloat(style.fontSize), line: parseFloat(style.lineHeight) } : null;
  // a service page's breadcrumb, over the headline: the top of its letters
  // (px), which the scene keeps clear of and spaces the title against
  const crumbs = copy.querySelector("nav[aria-label='Breadcrumb'] ol");
  const lead = crumbs ? leadTop(crumbs) - box.top : null;
  if (portrait) return { copyTop, copyRight: 0, titleRight: 0, navZoom, navBottom, head, lead };
  return {
    copyTop,
    copyRight: (textRight(copy) - box.left) / width,
    titleRight: title ? (title.right - box.left) / width : 0.5,
    navZoom,
    navBottom,
    head,
    lead,
  };
}

// The top of a line of capitals: its box, less the half-leading above the
// letters (cap height taken as 0.7 of the size, near enough for a line of
// small typewritten capitals).
function leadTop(element) {
  const style = getComputedStyle(element);
  const size = parseFloat(style.fontSize);
  const line = parseFloat(style.lineHeight) || size * 1.5;
  return element.getBoundingClientRect().top + (line - size * 0.7) / 2;
}

// The right edge of an element's text, line by line (its blocks run wider
// than their lines do).
function textRight(element) {
  const range = document.createRange();
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  let right = 0;
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    if (!node.textContent.trim()) continue;
    range.selectNodeContents(node);
    right = Math.max(right, range.getBoundingClientRect().right);
  }
  return right;
}
