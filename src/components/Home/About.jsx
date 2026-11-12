import Image from "next/image";
import Link from "next/link";
import { TbArrowRight } from "react-icons/tb";
import Reveal from "@/components/Home/Reveal";
import { CONTAINER, H2, HexDot, LEDE, LIGHT, PhotoStandIn, SECTION, SectionLabel, Viewfinder } from "@/components/Home/parts";
import { BUSINESS } from "@/data/business";
import portrait from "@/../public/images/about/andranik-emmy.jpg";

const { founder } = BUSINESS;

// The middle card was the Emmy® until 11-09 (Andranik doesn't want the site
// to revolve around it): how LeTara works instead, a business fact like the
// other two. (Tried and rejected: "Visualized first", "15+ years in VFX".)
const CREDENTIALS = [
  BUSINESS.license && { kicker: "Licensed", title: `CSLB #${BUSINESS.license}`, note: "California contractor" },
  { kicker: "How we work", title: "Design-build", note: "one team, sketch to walkthrough" },
  { kicker: "Building across", title: "Los Angeles", note: "and the San Fernando Valley" },
].filter(Boolean);

// Andranik's own words, from his LinkedIn: the setup, then the line that
// lands (gold).
const QUOTE = {
  lines: ["I used to build worlds for the screen.", "Now I design and build spaces in the physical world!"],
  close: "The tools changed — the standards didn’t.",
};

// His awards (BUSINESS.founder.awards, from his own graphic) set as a film
// festival's laurels: the main words large between two gold branches, what
// they are in small capitals over and under them. Read as "Emmy® Award
// winner", "Multiple Emmy® nominee", "Multiple Leo Award winner"; screen
// readers get the plain list.
const LAURELS = [
  { top: "Winner", main: "Emmy® Award" },
  { top: "Multiple", main: "Emmy®", bottom: "Nominee" },
  { top: "Multiple", main: "Leo Award", bottom: "Winner" },
];

// One branch of a laurel (the left; the right is its mirror), worked out once
// from a curved stem: pairs of full leaves along it, getting smaller toward
// the top, the outer ones larger, and a leaf at the tip. Rounded so the
// server's numbers and the browser's agree.
const BRANCH = (() => {
  const r = (n) => Math.round(n * 100) / 100;
  const p0 = [17, 59];
  const p1 = [0, 32];
  const p2 = [14, 3];
  const at = (t) => [0, 1].map((k) => (1 - t) ** 2 * p0[k] + 2 * (1 - t) * t * p1[k] + t * t * p2[k]);
  const tangent = (t) => {
    const d = [0, 1].map((k) => 2 * (1 - t) * (p1[k] - p0[k]) + 2 * t * (p2[k] - p1[k]));
    const len = Math.hypot(d[0], d[1]);
    return [d[0] / len, d[1] / len];
  };
  const deg = (x, y) => (Math.atan2(y, x) * 180) / Math.PI;
  // a leaf drawn along +x from its base, half as wide as it's long
  const leaf = ([x, y], angle, length) => {
    const [a, b, w] = [r(length * 0.25), r(length * 0.7), r(length * 0.31)];
    return {
      d: `M0 0C${a} ${-w} ${b} ${-w} ${r(length)} 0C${b} ${w} ${a} ${w} 0 0Z`,
      transform: `translate(${r(x)} ${r(y)}) rotate(${r(angle)})`,
    };
  };
  const spread = 0.5; // how far a leaf turns off the stem, in radians
  const [c, sn] = [Math.cos(spread), Math.sin(spread)];
  const leaves = [];
  const n = 6;
  for (let i = 0; i < n; i++) {
    const t = 0.06 + (i / (n - 1)) * 0.78;
    const [tx, ty] = tangent(t);
    const [nx, ny] = [ty, -tx]; // the outer side, away from the middle
    const size = 10.5 - i * 0.7;
    leaves.push(leaf(at(t), deg(tx * c + nx * sn, ty * c + ny * sn), size));
    leaves.push(leaf(at(t), deg(tx * c - nx * sn, ty * c - ny * sn), size * 0.72));
  }
  const [tx, ty] = tangent(1);
  leaves.push(leaf(p2, deg(tx, ty), 6.5));
  return { stem: `M${p0.join(" ")}Q${p1.join(" ")} ${p2.join(" ")}`, leaves };
})();

function Branch({ className = "" }) {
  return (
    <svg viewBox="0 0 20 60" aria-hidden="true" className={`h-full w-auto shrink-0 text-third [filter:drop-shadow(0_1px_2px_rgba(0,0,0,0.6))] ${className}`}>
      <path d={BRANCH.stem} fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      {BRANCH.leaves.map(({ d, transform }) => (
        <path key={transform} d={d} transform={transform} fill="currentColor" />
      ))}
    </svg>
  );
}

function Laurel({ top, main, bottom }) {
  const small = "block text-[6.5px] 550:text-[7px] font-semibold uppercase tracking-[0.12em] leading-none";
  return (
    <li className="flex items-stretch justify-between h-[32px] w-[74px] 550:h-[34px] 550:w-[82px] [text-shadow:0_1px_3px_rgba(0,0,0,0.75),0_0_10px_rgba(0,0,0,0.55)]">
      <Branch />
      <span className="flex flex-col items-center justify-center text-center">
        {top && <span className={`${small} text-third`}>{top}</span>}
        <span className="block my-[2px] font-display text-[10px] 550:text-[11.5px] leading-none tracking-[0.03em] text-white whitespace-nowrap">
          {main}
        </span>
        {bottom && <span className={`${small} text-white/70`}>{bottom}</span>}
      </span>
      <Branch className="-scale-x-100" />
    </li>
  );
}

// Who we are, on white after the dark hero (laid out after an example the
// user liked): the heading, three credentials, then a project photo beside
// a short story of the company, and Andranik down the right in a
// viewfinder's corners, carrying what his own "Meet the contractor" graphic
// says, all within the photo: the label at its top left with his awards
// under it, small festival laurels, low key; at its foot, on a gradient that
// fades gradually and stays see-through, his words in Oswald Light with air
// between the lines, then his name and titles. He's the star: his face, the
// statuette and his hands stay clear. On a phone the portrait comes right
// after the heading. The project photo is a black stand-in until there are
// real ones.
//
// (11-10: copying his graphic, the quote large in a serif over a dark
// gradient most of the way up, hid him; then a clean photo with a plain
// black card under it; then small words over a gradient on the photo, too
// plain and the words too small; then the poster with its billing block
// below the photo, too long, the name too big; then everything centered at
// the foot on a gradient black most of the way up, the quote lost against
// the name.)
//
// The portrait is the user's photo of Andranik at the 65th Emmy Awards. It
// shows the statuette and the Academy's backdrop, the one exception to the
// no-statuette rule (CLAUDE.md), at the user's request; confirm its rights
// before launch.
export default function About() {
  return (
    <section id="about" className={`${SECTION} ${LIGHT}`}>
      <div
        className={`${CONTAINER} grid gap-x-12 1440:gap-x-16 gap-y-8 grid-cols-1 [grid-template-areas:'head''portrait''creds''body'] 1080:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] 1080:grid-rows-[auto_auto_1fr] 1080:[grid-template-areas:'head_portrait''creds_portrait''body_portrait']`}
      >
        <div className="[grid-area:head]">
          <Reveal>
            <SectionLabel number="01" tone="light">
              Who we are
            </SectionLabel>
          </Reveal>
          <Reveal as="h2" delay={0.05} className={`mt-5 ${H2}`}>
            From the Emmy® stage <br className="max-550:hidden" />
            to your job site.
          </Reveal>
        </div>

        <ul className="[grid-area:creds] grid grid-cols-1 550:grid-cols-3 gap-3">
          {CREDENTIALS.map((item, i) => (
            <Reveal as="li" key={item.kicker} delay={0.08 * i} className="border border-black/10 px-5 py-4 pointer-events-none">
              <p className="flex items-center gap-2 font-script text-[10.5px] uppercase tracking-[0.2em] text-black/45">
                <HexDot className="!w-2 !h-[9px]" />
                {item.kicker}
              </p>
              <p className="mt-2.5 font-display text-[22px] leading-none tracking-[0.01em]">{item.title}</p>
              <p className="mt-1.5 text-[13px] text-black/50">{item.note}</p>
            </Reveal>
          ))}
        </ul>

        {/* the photo as tall as the story beside it (on a phone, under it) */}
        <div className="[grid-area:body] grid gap-8 700:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)] 700:items-stretch 1080:pt-2">
          <Reveal className="relative aspect-[16/9] 700:aspect-auto 700:min-h-[320px] max-700:order-2">
            <PhotoStandIn />
            <Viewfinder className="text-black/25" />
          </Reveal>
          <Reveal delay={0.1}>
            <p className={LEDE.light}>
              LeTara Builders is a licensed general contractor in Los Angeles, building new homes, home
              additions, ADUs, remodels and outdoor living spaces. Every project is design-build: careful
              planning, clear communication and precise execution, from one team.
            </p>
            <p className={`mt-4 ${LEDE.light}`}>
              Founder Andranik Taranyan spent more than {founder.vfxYears} years in visual effects, on more than{" "}
              {founder.episodes} episodes of television, where his work earned an Emmy® Award. The industry
              changed, the mindset didn&apos;t: vision, planning, problem solving, attention to detail and
              execution.
            </p>
            <Link
              href="#process"
              className="group mt-7 inline-flex items-center gap-2.5 uppercase text-[12.5px] font-semibold tracking-[0.14em] text-neutral-950 border-b border-third pb-1 hover:text-black/70 transition-colors duration-200"
            >
              See how we work
              <TbArrowRight aria-hidden="true" className="text-third transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </Reveal>
        </div>

        {/* a 2:3 crop on a phone (below the knees; the whole photo was taller
            than the screen), then 3:4 and 4:5 (to the knees); on a wide screen
            as tall as the column beside it. Everything sits inside it. */}
        <Reveal
          as="figure"
          delay={0.1}
          className="[grid-area:portrait] relative aspect-[2/3] 550:aspect-[3/4] 700:aspect-[4/5] 1080:aspect-auto 1080:min-h-[620px] pointer-events-none"
        >
          <div className="absolute inset-0 overflow-hidden bg-neutral-900">
            <Image
              src={portrait}
              alt="Andranik Taranyan, founder of LeTara Builders, holding his Emmy® at the 65th Emmy Awards"
              fill
              sizes="(min-width: 1080px) 40vw, 100vw"
              placeholder="blur"
              className="object-cover object-[62%_6%]"
            />
            {/* dark only in the top left corner, under the label and the awards */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_50%_at_0%_0%,rgba(0,0,0,0.8),rgba(0,0,0,0.6)_40%,rgba(0,0,0,0.32)_62%,rgba(0,0,0,0.1)_80%,transparent_92%)]" />
            {/* from the foot, dark fading gradually to clear, see-through all
                the way; a little darker toward the bottom left, under the
                words, away from him */}
            <div className="absolute inset-x-0 bottom-0 h-[70%] 700:h-[60%] bg-[linear-gradient(to_top,rgba(10,10,10,0.8)_0%,rgba(10,10,10,0.68)_20%,rgba(10,10,10,0.48)_40%,rgba(10,10,10,0.26)_60%,rgba(10,10,10,0.09)_80%,transparent_100%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_90%_at_0%_100%,rgba(10,10,10,0.62),rgba(10,10,10,0.44)_50%,rgba(10,10,10,0.16)_72%,transparent_88%)]" />
            <figcaption className="absolute inset-0 flex flex-col p-5 550:p-7 1440:p-8 text-white">
              <div className="[text-shadow:0_1px_10px_rgba(0,0,0,0.35)]">
                <p className="font-semibold text-[11.5px] 700:text-[12.5px] uppercase tracking-[0.26em]">
                  Meet the contractor
                  <span aria-hidden="true" className="mt-2.5 block h-[2px] w-8 bg-third" />
                </p>
                {/* his awards, low key: small laurels under the label, the two
                    Emmys side by side and the Leo Award centred under them (the
                    user's layout; three in a row also reached his head) */}
                <ul aria-hidden="true" className="mt-6 1440:mt-7 flex flex-wrap justify-center gap-x-1 gap-y-1.5 w-[152px] 550:w-[168px]">
                  {LAURELS.map((laurel) => (
                    <Laurel key={laurel.top + laurel.main} {...laurel} />
                  ))}
                </ul>
                <ul className="sr-only">
                  {founder.awards.map((award) => (
                    <li key={award}>{award}</li>
                  ))}
                </ul>
              </div>

              {/* at the foot: his words, the way the user liked them first
                  (Oswald Light, uppercase, the opening mark hung in the margin
                  so the words line up with his name, the last line gold), with
                  air between the lines and before his name */}
              <div className="mt-auto [text-shadow:0_1px_2px_rgba(0,0,0,0.45),0_0_22px_rgba(0,0,0,0.4)]">
                <blockquote className="max-w-[24em] font-quote uppercase text-[16px] 550:text-[20px] 1080:text-[19px] 1280:text-[21px] 1440:text-[22px] leading-[1.3] tracking-[0.02em]">
                  {QUOTE.lines.map((line, i) => (
                    <p key={line} className={`text-balance ${i ? "mt-4" : ""}`}>
                      {i === 0 && (
                        <span aria-hidden="true" className="inline-block -ml-[0.36em] w-[0.36em] text-third">
                          “
                        </span>
                      )}
                      {line}
                    </p>
                  ))}
                  <p className="mt-4 text-third text-balance">
                    {QUOTE.close}
                    <span aria-hidden="true">”</span>
                  </p>
                </blockquote>
                <p className="mt-10 550:mt-12 1440:mt-16 flex items-center gap-3">
                  <span aria-hidden="true" className="h-px w-8 bg-third" />
                  <span className="font-display text-[26px] 1440:text-[30px] leading-none tracking-[0.03em]">{founder.name}</span>
                </p>
                <div className="mt-2 text-[12.5px] 1440:text-[13.5px] leading-snug text-white/75">
                  {founder.titles.map((title) => (
                    <p key={title}>{title}</p>
                  ))}
                </div>
              </div>
            </figcaption>
          </div>
          <Viewfinder />
        </Reveal>
      </div>
    </section>
  );
}
