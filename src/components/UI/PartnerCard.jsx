import { TbArrowUpRight } from "react-icons/tb";
import { HexDot } from "@/components/Home/parts";
import { BUSINESS } from "@/data/business";
import VistaLogo from "@/components/UI/VistaLogo";

// A cut corner, top right, as on the services' cards.
const CHAMFER = "[clip-path:polygon(0_0,calc(100%-22px)_0,100%_22px,100%_100%,0_100%)]";

const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-vista-dark";

// LeTara's partner for patio covers and awnings, Vista Pergolas (Andranik,
// 11-16; data/business.js), in Vista's own colors (11-17, the user asked;
// --color-vista* in globals.css): its pale green, as its site's header, with
// its logo in its own green and charcoal, and its green button. Cut at the
// corner like the services' cards: its logo (a link to its site, 11-16: the
// user asked for the logo in place of the name), what Vista offers and a
// button to its site (both a new tab). At the foot of the homepage's
// services, and in its own section on the outdoor living page. `as` is the
// title's element (h3, under the section's h2).
export default function PartnerCard({ className = "", as: Title = "h3" }) {
  const { partner } = BUSINESS;
  if (!partner) return null;
  return (
    <div className={`relative isolate overflow-hidden bg-vista-tint text-vista-dark ${CHAMFER} ${className}`}>
      {/* lighter toward the right, as Vista's header fades to white */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(100deg,transparent_30%,rgba(255,255,255,0.45))]"
      />
      {/* its green along the foot and the cut corner */}
      <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-[3px] bg-vista" />
      <span aria-hidden="true" className="pointer-events-none absolute top-0 left-[calc(100%-22px)] w-[31px] h-[2px] bg-vista origin-left rotate-45" />
      <div className="relative grid gap-7 p-6 700:p-8 1080:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)_auto] 1080:items-center 1080:gap-10">
        <div className="pointer-events-none">
          <p className="font-script text-[11px] uppercase tracking-[0.2em] text-vista-dark/60">Our partner</p>
          {/* its logo, a link to its site */}
          <a
            href={partner.url}
            target="_blank"
            rel="noopener"
            className={`group/logo pointer-events-auto mt-4 inline-flex items-start gap-1.5 ${FOCUS}`}
          >
            <VistaLogo className="h-12 700:h-14 w-auto text-vista-dark" />
            <TbArrowUpRight
              aria-hidden="true"
              className="text-[18px] text-vista-dark/35 transition-[color,transform] duration-200 group-hover/logo:text-vista-dark group-hover/logo:[transform:translate(2px,-2px)]"
            />
            <span className="sr-only">{partner.name} (opens in a new tab)</span>
          </a>
          <Title className="mt-4 font-display uppercase leading-[0.95] tracking-[0.01em] text-[30px] 700:text-[36px]">
            Patio covers &amp; awnings
            <span className="sr-only"> by {partner.name}</span>
          </Title>
          <p className="mt-3 max-w-md text-[14.5px] leading-relaxed text-vista-dark/70">
            {partner.name} designs and builds aluminum patio covers and retractable awnings for homes and businesses. It
            was also founded by {BUSINESS.founder.name}.
          </p>
        </div>
        <ul className="grid grid-cols-1 700:grid-cols-2 gap-x-6 gap-y-3 pointer-events-none">
          {partner.offers.map((offer) => (
            <li key={offer} className="flex items-center gap-2.5 text-[13.5px] uppercase tracking-[0.1em] text-vista-dark/85">
              <HexDot className="!text-vista" />
              {offer}
            </li>
          ))}
        </ul>
        {/* its button, as on its site: green with charcoal words */}
        <a
          href={partner.url}
          target="_blank"
          rel="noopener"
          className={`group inline-flex items-center justify-center gap-2 h-12 px-6 bg-vista text-vista-dark uppercase text-[12px] font-semibold tracking-[0.14em] whitespace-nowrap hover:bg-vista-dark hover:text-white transition-colors duration-200 ${FOCUS} max-1080:justify-self-start`}
        >
          Visit {partner.name}
          <TbArrowUpRight aria-hidden="true" className="text-[16px] transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      </div>
    </div>
  );
}
