import { TbArrowUpRight } from "react-icons/tb";
import { HexDot } from "@/components/Home/parts";
import { BUSINESS } from "@/data/business";

// A cut corner, top right, as on the services' cards.
const CHAMFER = "[clip-path:polygon(0_0,calc(100%-22px)_0,100%_22px,100%_100%,0_100%)]";

// LeTara's partner for patio covers and awnings, Vista Pergolas (Andranik,
// 11-16; data/business.js): a dark card on white, cut at the corner like the
// services' cards, with what Vista offers and a link to its site (a new
// tab). At the foot of the homepage's services, and in its own section on
// the outdoor living page. `as` is the title's element (h3, under the
// section's h2).
export default function PartnerCard({ className = "", as: Title = "h3" }) {
  const { partner } = BUSINESS;
  if (!partner) return null;
  return (
    <div className={`relative isolate overflow-hidden bg-[#0b0b0b] text-neutral-50 ${CHAMFER} ${className}`}>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_90%_at_0%_0%,rgba(233,166,72,0.14),transparent_70%)]"
      />
      <span aria-hidden="true" className="pointer-events-none absolute top-0 left-[calc(100%-22px)] w-[31px] h-[1.5px] bg-third origin-left rotate-45" />
      <div className="relative grid gap-7 p-6 700:p-8 1080:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)_auto] 1080:items-center 1080:gap-10">
        <div className="pointer-events-none">
          <p className="font-script text-[11px] uppercase tracking-[0.2em] text-third">Our partner</p>
          <Title className="mt-2 font-display uppercase leading-[0.95] tracking-[0.01em] text-[30px] 700:text-[36px]">
            Patio covers &amp; awnings <br />
            by {partner.name}
          </Title>
          <p className="mt-3 max-w-md text-[14.5px] leading-relaxed text-white/60">
            {partner.name} designs and builds aluminum patio covers and retractable awnings for homes and businesses. It
            was also founded by {BUSINESS.founder.name}.
          </p>
        </div>
        <ul className="grid grid-cols-1 400:grid-cols-2 gap-x-6 gap-y-3 pointer-events-none">
          {partner.offers.map((offer) => (
            <li key={offer} className="flex items-center gap-2.5 text-[13.5px] uppercase tracking-[0.1em] text-white/80">
              <HexDot />
              {offer}
            </li>
          ))}
        </ul>
        <a
          href={partner.url}
          target="_blank"
          rel="noopener"
          className="group inline-flex items-center justify-center gap-2 h-12 px-6 border border-white/30 uppercase text-[12px] font-semibold tracking-[0.14em] whitespace-nowrap hover:border-third hover:text-third transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-third max-1080:justify-self-start"
        >
          Visit {partner.name}
          <TbArrowUpRight aria-hidden="true" className="text-[16px] transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      </div>
    </div>
  );
}
