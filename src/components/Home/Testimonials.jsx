import { FcGoogle } from "react-icons/fc";
import { TbArrowUpRight, TbStar, TbStarFilled } from "react-icons/tb";
import Reveal from "@/components/Home/Reveal";
import { CONTAINER, H2, LEDE, LIGHT, SECTION, SectionLabel } from "@/components/Home/parts";
import { HEX } from "@/components/Navigation/HexButton";
import { REVIEWS_SUMMARY } from "@/data/testimonials";
import { getReviews } from "@/lib/reviews";

// A cut corner, top right, as on the services cards (the navbar's points).
const CHAMFER = "[clip-path:polygon(0_0,calc(100%-18px)_0,100%_18px,100%_100%,0_100%)]";

// From how many reviews they move: columns on a wide screen, a second row on
// a phone. With fewer, a wide screen shows them all, still, side by side
// (moving columns would show the same review twice at once), and a phone
// runs them in one row (two rows would repeat each other); one review
// stands still everywhere.
const MOVING_COLUMNS = 5;
const TWO_ROWS = 4;

// On a phone a row's copy is at least this wide, repeating the reviews if
// need be, so the loop never shows a gap (phone widths end at 700px).
const ROW_ITEM = 296; // a card's 284px and the 12px after it
const ROW_MIN = 720;

function Stars({ count = 5, className = "" }) {
  return (
    <span className={`flex gap-0.5 text-third ${className}`} aria-hidden="true">
      {Array.from({ length: 5 }, (_, i) => (i < count ? <TbStarFilled key={i} /> : <TbStar key={i} />))}
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

// One review: its stars, the headline in the logo's face (if it has one),
// the review, and who wrote it on a gold hexagon with their initials, the
// project and the city. `compact` (the phone's rows) is smaller, and cuts a
// long review to five lines so the rows stay short.
function Review({ review, compact }) {
  const { headline, text, name, city, project, stars, sample } = review;
  const meta = [project, city].filter(Boolean).join(" · ");
  return (
    <figure className={`relative w-full h-full bg-white ${compact ? "p-5" : "p-6"} ${CHAMFER}`}>
      {/* a gold edge along the cut corner */}
      <span aria-hidden="true" className="absolute top-0 left-[calc(100%-18px)] w-[25px] h-[1.5px] bg-third origin-left rotate-45" />
      <div className="flex items-center justify-between gap-3">
        <Stars count={stars} className="text-[15px]" />
        {sample && <span className="mr-4 border border-black/20 px-2 py-0.5 font-script text-[10px] uppercase tracking-[0.16em] text-black/55">Sample</span>}
      </div>
      <span className="sr-only">{stars} out of 5 stars.</span>
      <blockquote className="mt-4">
        {headline && (
          <p className={`font-display uppercase ${compact ? "text-[20px]" : "text-[23px]"} leading-[1.02] tracking-[0.01em] text-neutral-950`}>{headline}</p>
        )}
        <p className={`${headline ? "mt-3" : ""} leading-relaxed text-black/60 ${compact ? "text-[14px] line-clamp-5" : "text-[14.5px]"}`}>{text}</p>
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
          {meta && <span className="block font-script text-[10.5px] uppercase tracking-[0.16em] text-black/45">{meta}</span>}
        </span>
      </figcaption>
    </figure>
  );
}

// A run of reviews, written out twice and moved by a CSS animation one copy's
// length and back to the start, so it never ends; the compositor runs it, so
// it stays smooth on a phone. The space after each review is its own padding,
// so a copy is exactly half the run. `run` is the keyframes (globals.css),
// `time` how long one copy takes; `repeat` writes the reviews that many
// times into each copy (a phone row with only a few).
function Run({ reviews, run, time, repeat = 1, compact, className }) {
  const copy = Array.from({ length: repeat }, () => reviews).flat();
  return (
    <div style={{ "--run": run, "--time": `${time}s` }} className={`review-run ${className}`}>
      {[0, 1].map((half) =>
        copy.map((review, i) => (
          <div key={`${half}-${i}-${review.slug}`} aria-hidden={half === 1 || i >= reviews.length || undefined} className="review-item">
            <Review review={review} compact={compact} />
          </div>
        )),
      )}
    </div>
  );
}

// What clients say, on white: the heading and a line (and, once LeTara has a
// Google Business Profile, its rating and links, data/testimonials.js), then
// a black canvas across the whole width with the white reviews inside it
// (the user asked for that too), several in view at once (HB Links shows
// one at a time). With enough reviews (MOVING_COLUMNS) they move: three
// columns drifting up and down at their own pace on a wide screen, fading
// into the black at the top and bottom; on a phone one row sliding across,
// and a second the other way from TWO_ROWS. With fewer, a wide screen shows
// them still, side by side. Nothing to press and no stopping on hover (the
// user's call). Reduce Motion runs them at half speed.
//
// The reviews come from the editor (lib/reviews.js); with none, no section.
export default async function Testimonials({ number = "04" }) {
  const reviews = await getReviews();
  if (!reviews.length) return null;
  const n = reviews.length;
  const { rating, count, readAll, profile } = REVIEWS_SUMMARY;
  const shift = (k) => [...reviews.slice(k % n), ...reviews.slice(0, k % n)];
  const moving = n >= MOVING_COLUMNS;
  const rows = n === 1 ? 0 : n >= TWO_ROWS ? 2 : 1;
  const repeat = Math.max(1, Math.ceil(ROW_MIN / (n * ROW_ITEM)));
  const link =
    "group inline-flex items-center gap-1 text-[14.5px] font-semibold text-neutral-950 underline decoration-third decoration-2 underline-offset-[5px] hover:text-black/60 transition-colors duration-200";
  const column = "flex flex-col [&>.review-item]:pb-4";
  const row = "flex w-max [&>.review-item]:w-[284px] [&>.review-item]:pr-3";
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

          {/* the rating on Google and the way to the reviews, once there's a profile */}
          {profile && (
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
                  <span className="block mt-1 text-[13.5px] text-black/55">{count ? `${count} reviews on Google` : "Reviews on Google"}</span>
                </span>
              </div>
              <span aria-hidden="true" className="max-550:hidden h-11 w-px bg-black/10" />
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                {readAll && (
                  <a href={readAll} target="_blank" rel="noopener noreferrer" className={link}>
                    Read all reviews
                    <TbArrowUpRight aria-hidden="true" className="text-third" />
                  </a>
                )}
                <a href={profile} target="_blank" rel="noopener noreferrer" className={link}>
                  See us on Google
                  <TbArrowUpRight aria-hidden="true" className="text-third" />
                </a>
              </div>
            </Reveal>
          )}
        </div>
      </div>

      {/* the black canvas the reviews are in, edge to edge */}
      <Reveal delay={0.1} className="relative mt-12 1080:mt-14 overflow-hidden bg-[#0a0a0a] pointer-events-none">
        <span aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_60%_45%_at_50%_0%,rgba(233,166,72,0.1),transparent_70%)]" />

        {/* a wide screen: moving columns, as wide as the page's content, or
            with only a few, every review still, side by side */}
        <div className={`${CONTAINER} max-700:hidden`}>
          {moving ? (
            <div className="relative h-[640px] grid grid-cols-2 1080:grid-cols-3 gap-4 [mask-image:linear-gradient(to_bottom,transparent,#000_14%,#000_86%,transparent)]">
              <Run reviews={reviews} run="review-up" time={n * 9.2} className={column} />
              <Run reviews={shift(Math.round(n / 3))} run="review-down" time={n * 10.8} className={column} />
              <Run reviews={shift(Math.round((2 * n) / 3))} run="review-up" time={n * 10} className={`max-1080:hidden ${column}`} />
            </div>
          ) : (
            <ul className="relative flex flex-wrap justify-center gap-4 py-12 1080:py-14">
              {reviews.map((review) => (
                <li key={review.slug} className={n === 4 ? "w-[calc(50%-8px)] 1280:w-[calc((100%-48px)/4)]" : "w-[calc(50%-8px)] 1080:w-[calc((100%-32px)/3)]"}>
                  <Review review={review} />
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* a phone: rows across the whole width, or one review, still */}
        <div className="700:hidden relative">
          {rows === 0 ? (
            <div className={`${CONTAINER} py-6`}>
              <Review review={reviews[0]} compact />
            </div>
          ) : (
            <div className="grid gap-3 py-6">
              <Run reviews={reviews} run="review-left" time={n * repeat * 9.2} repeat={repeat} compact className={row} />
              {rows === 2 && (
                <Run reviews={shift(Math.floor(n / 2))} run="review-right" time={n * repeat * 10.4} repeat={repeat} compact className={row} />
              )}
            </div>
          )}
        </div>
      </Reveal>
    </section>
  );
}
