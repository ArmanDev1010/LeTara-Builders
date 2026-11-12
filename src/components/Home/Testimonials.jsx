import { FcGoogle } from "react-icons/fc";
import { TbArrowUpRight, TbStarFilled } from "react-icons/tb";
import Reveal from "@/components/Home/Reveal";
import { CONTAINER, H2, LEDE, LIGHT, SECTION, SectionLabel } from "@/components/Home/parts";
import { HEX } from "@/components/Navigation/HexButton";
import { REVIEWS_SUMMARY, TESTIMONIALS } from "@/data/testimonials";

// A cut corner, top right, as on the services cards (the navbar's points).
const CHAMFER = "[clip-path:polygon(0_0,calc(100%-18px)_0,100%_18px,100%_100%,0_100%)]";

function Stars({ className = "" }) {
  return (
    <span className={`flex gap-0.5 text-third ${className}`} aria-hidden="true">
      {Array.from({ length: 5 }, (_, i) => (
        <TbStarFilled key={i} />
      ))}
    </span>
  );
}

const initials = (name) =>
  name
    .split(/[\s&]+/)
    .filter((part) => /^[A-Za-z]/.test(part))
    .slice(0, 2)
    .map((part) => part[0])
    .join("");

// One review: five gold stars, the pull quote in the logo's face, the
// review, and who wrote it on a gold hexagon with their initials, the
// project and the city. `compact` (the phone's rows) is smaller, and cuts a
// long review to five lines so the rows stay short.
function Review({ review, compact }) {
  const { pull, text, name, area, project } = review;
  return (
    <figure className={`relative w-full h-full bg-white ${compact ? "p-5" : "p-6"} ${CHAMFER}`}>
      {/* a gold edge along the cut corner */}
      <span aria-hidden="true" className="absolute top-0 left-[calc(100%-18px)] w-[25px] h-[1.5px] bg-third origin-left rotate-45" />
      <Stars className="text-[15px]" />
      <blockquote className="mt-4">
        <p className={`font-display uppercase ${compact ? "text-[20px]" : "text-[23px]"} leading-[1.02] tracking-[0.01em] text-neutral-950`}>{pull}</p>
        <p className={`mt-3 leading-relaxed text-black/60 ${compact ? "text-[14px] line-clamp-5" : "text-[14.5px]"}`}>{text}</p>
      </blockquote>
      <figcaption className={`${compact ? "mt-4" : "mt-5"} flex items-center gap-3 border-t border-black/10 pt-4`}>
        <span aria-hidden="true" className="relative grid place-items-center w-9 h-[41px] shrink-0 text-third">
          <svg viewBox="0 0 40 46" className="absolute inset-0 w-full h-full">
            <polygon points={HEX} fill="none" stroke="currentColor" strokeWidth="1.6" />
          </svg>
          <span className="relative font-script text-[11px] font-bold text-neutral-950">{initials(name)}</span>
        </span>
        <span className="min-w-0">
          <span className="block text-[14.5px] font-semibold text-neutral-950">{name}</span>
          <span className="block font-script text-[10.5px] uppercase tracking-[0.16em] text-black/45">
            {project} · {area}
          </span>
        </span>
      </figcaption>
    </figure>
  );
}

// A run of reviews, written out twice and moved by a CSS animation one copy's
// length and back to the start, so it never ends; the compositor runs it, so
// it stays smooth on a phone. The space after each review is its own padding,
// so a copy is exactly half the run. `run` is the keyframes (globals.css),
// `time` how long one copy takes.
function Run({ reviews, run, time, compact, className }) {
  return (
    <div style={{ "--run": run, "--time": `${time}s` }} className={`review-run ${className}`}>
      {[0, 1].map((copy) =>
        reviews.map((review) => (
          <div key={`${copy}-${review.name}`} aria-hidden={copy === 1 || undefined} className="review-item">
            <Review review={review} compact={compact} />
          </div>
        )),
      )}
    </div>
  );
}

// What clients say, on white: the heading, a line, and the rating on Google
// with links to the reviews, all under the heading (11-10, the user asked),
// then a black canvas across the whole width with the white reviews moving
// inside it (the user asked for that too), several in view at once (HB Links shows one at a
// time): three columns drifting up and down at their own pace on a wide
// screen, fading into the black at the top and bottom, and two rows sliding
// opposite ways on a phone, running off the screen's edges. Nothing to press and no stopping on hover, as with the film
// strip this replaced (the user's call). Reduce Motion runs it at half speed.
//
// The reviews and the rating are placeholders (data/testimonials.js).
export default function Testimonials({ number = "04" }) {
  const { rating, count, readAll, profile } = REVIEWS_SUMMARY;
  const shift = (k) => [...TESTIMONIALS.slice(k), ...TESTIMONIALS.slice(0, k)];
  const link =
    "group inline-flex items-center gap-1 text-[14.5px] font-semibold text-neutral-950 underline decoration-third decoration-2 underline-offset-[5px] hover:text-black/60 transition-colors duration-200";
  return (
    <section id="testimonials" className={`${SECTION} ${LIGHT} overflow-hidden`}>
      <div className={CONTAINER}>
        <div className="max-w-2xl">
          <Reveal>
            <SectionLabel number={number} tone="light">
              What clients say
            </SectionLabel>
          </Reveal>
          <Reveal as="h2" delay={0.05} className={`mt-5 ${H2}`}>
            Built for homeowners, <br />
            in their own words.
          </Reveal>
          <Reveal as="p" delay={0.1} className={`mt-5 ${LEDE.light} max-w-xl`}>
            From the first site visit to the final walkthrough, here&apos;s what building with us is like, from the people
            we&apos;ve built for.
          </Reveal>

          {/* the rating, on Google, and the way to the reviews */}
          <Reveal delay={0.15} className="mt-7 flex flex-wrap items-center gap-x-7 gap-y-5">
            <div className="flex items-center gap-3.5 pointer-events-none">
              <span className="grid place-items-center w-12 h-12 shrink-0 rounded-full border border-black/10 bg-white">
                <FcGoogle aria-hidden="true" className="text-[26px]" />
              </span>
              <span>
                <span className="flex items-center gap-2.5">
                  {rating ? <span className="font-display text-[30px] leading-none tracking-[0.02em] text-neutral-950">{rating.toFixed(1)}</span> : null}
                  <Stars className="text-[16px]" />
                </span>
                <span className="block mt-1 text-[13.5px] text-black/55">
                  {count ? `${count} reviews on Google` : "Reviews on Google"}
                </span>
              </span>
            </div>
            <span aria-hidden="true" className="max-550:hidden h-11 w-px bg-black/10" />
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <a href={readAll} target="_blank" rel="noopener noreferrer" className={link}>
                Read all reviews
                <TbArrowUpRight aria-hidden="true" className="text-third" />
              </a>
              <a href={profile} target="_blank" rel="noopener noreferrer" className={link}>
                See us on Google
                <TbArrowUpRight aria-hidden="true" className="text-third" />
              </a>
            </div>
          </Reveal>
        </div>
      </div>

      {/* the black canvas the reviews move in, edge to edge */}
      <Reveal delay={0.1} className="relative mt-12 1080:mt-14 overflow-hidden bg-[#0a0a0a] pointer-events-none">
        <span aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_60%_45%_at_50%_0%,rgba(233,166,72,0.1),transparent_70%)]" />
        {/* columns on a wide screen, as wide as the page's content */}
        <div className={`${CONTAINER} max-700:hidden`}>
          <div className="relative h-[640px] grid grid-cols-2 1080:grid-cols-3 gap-4 [mask-image:linear-gradient(to_bottom,transparent,#000_14%,#000_86%,transparent)]">
            <Run reviews={TESTIMONIALS} run="review-up" time={46} className="flex flex-col [&>.review-item]:pb-4" />
            <Run reviews={shift(2)} run="review-down" time={54} className="flex flex-col [&>.review-item]:pb-4" />
            <Run reviews={shift(4)} run="review-up" time={50} className="max-1080:hidden flex flex-col [&>.review-item]:pb-4" />
          </div>
        </div>
        {/* rows on a phone, across the whole width */}
        <div className="700:hidden relative grid gap-3 py-6">
          <Run reviews={TESTIMONIALS} run="review-left" time={46} compact className="flex w-max [&>.review-item]:w-[284px] [&>.review-item]:pr-3" />
          <Run reviews={shift(2)} run="review-right" time={52} compact className="flex w-max [&>.review-item]:w-[284px] [&>.review-item]:pr-3" />
        </div>
      </Reveal>
    </section>
  );
}
