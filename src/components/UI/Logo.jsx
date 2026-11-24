import LOGO from "@/data/logo.json";
import { BUSINESS } from "@/data/business";

const r = (v) => Math.round(v * 100) / 100;

// The stacked lockup, worked out once from the horizontal one (Andranik's
// own file): the mark centred over the wordmark, at the same scale, with a
// gap of 0.3 of the wordmark's height between them.
const STACKED = (() => {
  const [mx, my, mw, mh] = LOGO.mark.box;
  const [wx, wy, ww, wh] = LOGO.wordmark.box;
  const gap = wh * 0.3;
  const width = Math.max(mw, ww);
  return {
    width: r(width),
    height: r(mh + gap + wh),
    mark: `translate(${r((width - mw) / 2 - mx)} ${r(-my)})`,
    wordmark: `translate(${r((width - ww) / 2 - wx)} ${r(mh + gap - wy)})`,
  };
})();

// LeTara's logo: the hexagon mark with the T, and "LeTara / BUILDERS", drawn
// in currentColor so it takes the text color around it (text-white on a dark
// surface). `horizontal` (the mark beside the wordmark, as in Andranik's own
// file: the navbar, the footer) or stacked (the mark over it). Size it by
// height (h-[...]); the width follows. The paths live in data/logo.json,
// traced from his file (11-24), which scripts/brand-assets.mjs also draws the
// favicon, home-screen icon and link-preview image from.
export default function Logo({ layout = "stacked", className = "", title = BUSINESS.name, ...props }) {
  const horizontal = layout === "horizontal";
  const width = horizontal ? LOGO.width : STACKED.width;
  const height = horizontal ? LOGO.height : STACKED.height;
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      fill="currentColor"
      role="img"
      aria-label={title}
      className={className}
      style={{ aspectRatio: `${width} / ${height}` }}
      {...props}
    >
      {/* traced: the letters' insides are holes by the even-odd rule */}
      <path fillRule="evenodd" d={LOGO.mark.d} transform={horizontal ? undefined : STACKED.mark} />
      <path fillRule="evenodd" d={LOGO.wordmark.d} transform={horizontal ? undefined : STACKED.wordmark} />
    </svg>
  );
}
