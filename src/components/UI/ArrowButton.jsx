import { TbArrowRight } from "react-icons/tb";

// `lead`: the room before the label (inside the 4px padding); `tail`: the
// room after it, the gap and the arrow's box together.
const SIZES = {
  md: { button: "h-12 text-[12.5px]", lead: "min-w-5", tail: "min-w-15", box: "w-10", arrow: "text-[18px]" },
  // the navbar's, a little tighter below 1280px where the bar is crowded
  sm: {
    button: "h-11 text-[12px]",
    lead: "min-w-4 1280:min-w-6",
    tail: "min-w-14 1280:min-w-17",
    box: "w-9",
    arrow: "text-[17px]",
  },
};

// The hover, by the surface it sits on: on dark the gold goes white; on
// white it would vanish, so there the button turns black and the arrow's
// box gold.
const TONES = {
  dark: { button: "hover:bg-white", box: "" },
  light: {
    button: "hover:bg-neutral-950 hover:text-white",
    box: "transition-colors duration-200 group-hover:bg-third group-hover:text-neutral-950",
  },
};

// LeTara's main button: gold, its label, and the arrow in a black box the
// button's full height inside its padding. On hover the arrow nudges
// forward. A <button> unless `as` says otherwise; `tone="light"` on white.
//
// Stretched wider than it needs (full width on a phone), the label stays in
// the middle of the button, the arrow at its right end: the room before the
// label and the room after it grow alike from their minimums, so it's
// centered exactly; at its own width they're just the padding and the gap.
export default function ArrowButton({ as: Tag = "button", size = "md", tone = "dark", className = "", children, ...props }) {
  const s = SIZES[size];
  const t = TONES[tone];
  return (
    <Tag
      {...props}
      className={`group inline-flex items-stretch p-1 bg-third text-neutral-950 uppercase font-semibold tracking-[0.12em] transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-third disabled:opacity-40 disabled:hover:bg-third disabled:cursor-not-allowed cursor-pointer ${t.button} ${s.button} ${className}`}
    >
      <span aria-hidden="true" className={`flex-1 basis-0 ${s.lead}`} />
      <span className="self-center whitespace-nowrap">{children}</span>
      <span aria-hidden="true" className={`flex-1 basis-0 flex justify-end ${s.tail}`}>
        <span className={`grid place-items-center shrink-0 bg-neutral-950 text-third ${t.box} ${s.box}`}>
          <TbArrowRight className={`${s.arrow} transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none`} />
        </span>
      </span>
    </Tag>
  );
}
