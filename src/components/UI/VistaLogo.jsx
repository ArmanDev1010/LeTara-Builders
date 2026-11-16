import LOGO from "@/data/vistaLogo.json";

// Vista Pergolas' green.
const GREEN = "#a9d04f";

// Vista Pergolas' logo (LeTara's partner, data/business.js), a vector rebuild
// (11-16): the only copy on its site is a 160×60 PNG. The V mark is measured
// from a 598px copy of it, the lettering is Jost fitted to the small logo's
// letters. Its dark parts take currentColor (text-white on a dark surface),
// the green stays its own. Size it by height (h-[...]); the width follows.
// Decorative unless given a `title`.
export default function VistaLogo({ className = "", title }) {
  return (
    <svg
      viewBox={LOGO.viewBox}
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : "true"}
      focusable="false"
    >
      {title && <title>{title}</title>}
      <path d={LOGO.back} fill={GREEN} />
      <path d={LOGO.front} fill="currentColor" />
      <path d={LOGO.word} fill="currentColor" />
      <path d={LOGO.tag} fill={GREEN} />
    </svg>
  );
}
