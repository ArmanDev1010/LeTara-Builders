import LOGO from "@/data/logo.json";
import { BUSINESS } from "@/data/business";

const r = (v) => Math.round(v * 100) / 100;

// The horizontal lockup, worked out once from the stacked logo's parts: the
// mark a little taller than the two lines of the wordmark, beside them.
const H = (() => {
  const [mx, my, mw, mh] = LOGO.mark.box;
  const [wx, wy, , wh] = LOGO.wordmark.box;
  const s = (wh * 1.18) / mh;
  const gap = wh * 0.3;
  const height = mh * s;
  return {
    width: r(mw * s + gap + LOGO.wordmark.box[2]),
    height: r(height),
    mark: `translate(${r(-mx * s)} ${r(-my * s)}) scale(${r(s * 1000) / 1000})`,
    wordmark: `translate(${r(mw * s + gap - wx)} ${r((height - wh) / 2 - wy)})`,
  };
})();

// LeTara's logo: the hexagon mark with the T, and "LeTara / BUILDERS", drawn
// in currentColor so it takes the text color around it (text-white on a dark
// surface). Stacked (the mark over the wordmark) or `horizontal` (the mark
// beside it, for the navbar). Size it by height (h-[...]); the width
// follows. The paths live in data/logo.json, which scripts/brand-assets.mjs
// also draws the favicon, home-screen icon and link-preview image from.
export default function Logo({ layout = "stacked", className = "", title = BUSINESS.name, ...props }) {
  const horizontal = layout === "horizontal";
  const width = horizontal ? H.width : LOGO.width;
  const height = horizontal ? H.height : LOGO.height;
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
      <path d={LOGO.mark.d} transform={horizontal ? H.mark : undefined} />
      <path d={LOGO.wordmark.d} transform={horizontal ? H.wordmark : undefined} />
    </svg>
  );
}
