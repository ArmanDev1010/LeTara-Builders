// Pieces the homepage sections share.

// The page's width and side gutters, the same as the hero copy's.
export const CONTAINER = "mx-auto w-full max-w-[1600px] px-6 700:px-8";

// Every section's padding, the same top and bottom everywhere (about HB
// Links' spacing). A white section after another white one drops its top
// padding (`.section-light`, globals.css), so the distance between the two
// stays one padding, not two. On a big screen each section grows whole
// (`wide-zoom`, globals.css): nothing inside one may be sized in vh/svh/dvh.
export const SECTION = "wide-zoom relative scroll-mt-24 py-20 1080:py-28";
export const LIGHT = "section-light bg-white text-neutral-950";

// A section's heading: Bebas, the logo's face. Sized so a section's heading
// and what it introduces fit on one screen.
export const H2 =
  "font-display uppercase leading-[0.95] tracking-[0.01em] text-[36px] 550:text-[42px] 1080:text-[48px] 1440:text-[56px] pointer-events-none";

// A section's body text, on dark or on white.
export const LEDE = {
  dark: "text-[16px] 900:text-[17px] leading-relaxed text-white/60 pointer-events-none",
  light: "text-[16px] 900:text-[17px] leading-relaxed text-black/60 pointer-events-none",
};

// A small hexagon (the logo's shape) in gold, filled or outlined.
export function HexDot({ filled = true, className = "" }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 12 14" className={`w-[10px] h-[11.5px] shrink-0 text-third pointer-events-none ${className}`}>
      <polygon
        points="6,1 11,4 11,10 6,13 1,10 1,4"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.3"
      />
    </svg>
  );
}

// A section's label, like a scene number: a gold hexagon, then "02 · What
// we build" in the typewriter face.
export function SectionLabel({ number, tone = "dark", children }) {
  return (
    <p
      className={`flex items-center gap-3 font-script uppercase text-[11.5px] 550:text-[12px] tracking-[0.22em] pointer-events-none ${
        tone === "dark" ? "text-white/55" : "text-black/50"
      }`}
    >
      <HexDot />
      {number && <span className="text-third">{number}</span>}
      {number && <span aria-hidden="true">·</span>}
      {children}
    </p>
  );
}

// A camera's viewfinder corners around a picture (the film story the hero
// tells). Sits just outside the box it's put in; color with `className`.
export function Viewfinder({ className = "text-third" }) {
  const corner = "absolute w-5 h-5 border-current";
  return (
    <span aria-hidden="true" className={`pointer-events-none absolute -inset-[7px] z-10 ${className}`}>
      <span className={`${corner} top-0 left-0 border-t-2 border-l-2`} />
      <span className={`${corner} top-0 right-0 border-t-2 border-r-2`} />
      <span className={`${corner} bottom-0 left-0 border-b-2 border-l-2`} />
      <span className={`${corner} bottom-0 right-0 border-b-2 border-r-2`} />
    </span>
  );
}

// Black, where a project photo goes until there are real ones (the user's
// call; never AI imagery): a faint glow, and the service's icon or the
// logo's hexagon, very faint, so it isn't a dead square.
export function PhotoStandIn({ icon: Icon, className = "" }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden bg-[#0b0b0b] bg-[radial-gradient(ellipse_80%_70%_at_75%_20%,rgba(233,166,72,0.07),transparent_70%)] ${className}`}
    >
      {Icon ? (
        <Icon className="absolute -top-[6%] -right-[6%] w-[58%] h-auto max-w-[260px] text-white/[0.05]" strokeWidth={1} />
      ) : (
        <svg viewBox="0 0 40 46" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[22%] text-white/[0.07]">
          <polygon points="20,1.5 38.5,12 38.5,34 20,44.5 1.5,34 1.5,12" fill="none" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      )}
    </div>
  );
}
