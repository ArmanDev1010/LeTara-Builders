import { BsInstagram } from "react-icons/bs";
import { TbCertificate, TbMapPin, TbPhone } from "react-icons/tb";
import Reveal from "@/components/Home/Reveal";
import { CONTAINER, H2, LEDE, Lines, SECTION, SectionLabel } from "@/components/Home/parts";
import { HEX } from "@/components/Navigation/HexButton";
import EstimateForm from "@/components/Quote/EstimateForm";
import { BUSINESS, phoneDisplay, phoneHref } from "@/data/business";

const instagramHandle = BUSINESS.instagram?.match(/instagram\.com\/([^/?]+)/)?.[1];

// The ways to reach LeTara besides the form, each on a hexagon. Unconfirmed
// ones (null in data/business.js) are left out.
const LINES = [
  phoneHref() && { icon: TbPhone, label: "Call", value: phoneDisplay(), href: phoneHref(), big: true },
  instagramHandle && { icon: BsInstagram, label: "Instagram", value: `@${instagramHandle}`, href: BUSINESS.instagram, external: true },
  { icon: TbMapPin, label: "Building across", value: "Los Angeles, CA" },
  BUSINESS.license && { icon: TbCertificate, label: "Licensed & insured", value: `CSLB #${BUSINESS.license}` },
].filter(Boolean);

function Line({ icon: Icon, label, value, href, big, external }) {
  const body = (
    <>
      <span aria-hidden="true" className="relative grid place-items-center w-10 h-[46px] shrink-0 text-third">
        <svg viewBox="0 0 40 46" className="absolute inset-0 w-full h-full">
          <polygon points={HEX} fill="none" stroke="currentColor" strokeOpacity="0.45" strokeWidth="1.5" />
        </svg>
        <Icon className="relative text-[17px]" />
      </span>
      <span className="min-w-0">
        <span className="block font-script text-[11px] uppercase tracking-[0.18em] text-white/45">{label}</span>
        <span
          className={`block mt-1 transition-colors duration-200 ${
            big ? "font-display text-[30px] leading-none tracking-[0.02em]" : "text-[16px] font-medium"
          } ${href ? "text-neutral-50 group-hover:text-third" : "text-neutral-50"}`}
        >
          {value}
        </span>
      </span>
    </>
  );
  const row = "group flex items-center gap-4 py-5 border-b border-white/10";
  return (
    <li>
      {href ? (
        <a href={href} className={row} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
          {body}
        </a>
      ) : (
        <div className={`${row} pointer-events-none`}>{body}</div>
      )}
    </li>
  );
}

// Get a free quote: the same step-by-step form as the quote dialog, set in the
// page beside the other ways to reach us (HB Links' idea, LeTara's design),
// on black with the hero's gold glow low on the left. A sent request opens
// the same thank-you. A service page passes its own `number`, `heading`
// (its lines) and `intro`.
export default function Contact({
  number = "05",
  heading = ["Tell us what", "you're planning."],
  intro = "A few quick questions, about a minute, and you pick a time for us to come see the property.",
}) {
  return (
    <section id="contact" className={`${SECTION} section-dark overflow-hidden bg-[#070605] text-neutral-50`}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_55%_at_0%_100%,rgba(233,166,72,0.14),transparent_70%)]"
      />
      {/* on a phone the heading, then the form, then the other ways to reach
          us (the user asked for the form first); from 1080px the heading and
          those ways on the left, the form beside them */}
      <div
        className={`relative ${CONTAINER} grid gap-x-14 1440:gap-x-24 gap-y-10 [grid-template-areas:'head''form''lines'] 1080:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] 1080:grid-rows-[auto_1fr] 1080:[grid-template-areas:'head_form''lines_form']`}
      >
        <div className="[grid-area:head]">
          <Reveal>
            <SectionLabel number={number}>Get a free quote</SectionLabel>
          </Reveal>
          <Reveal as="h2" delay={0.05} className={`mt-5 ${H2}`}>
            <Lines lines={heading} />
          </Reveal>
          <Reveal as="p" delay={0.1} className={`mt-5 max-w-md ${LEDE.dark}`}>
            {intro}
          </Reveal>
        </div>
        <Reveal as="ul" delay={0.15} className="[grid-area:lines] 1080:-mt-2 border-t border-white/10 self-start">
          {LINES.map((line) => (
            <Line key={line.label} {...line} />
          ))}
        </Reveal>

        <Reveal delay={0.1} className="[grid-area:form] relative self-start border border-white/10 bg-[#0d0c0b] shadow-[0_40px_100px_-40px_rgba(0,0,0,0.9)]">
          <div aria-hidden="true" className="h-[2px] bg-gradient-to-r from-third via-third/60 to-transparent" />
          <EstimateForm talk={false} />
        </Reveal>
      </div>
    </section>
  );
}
