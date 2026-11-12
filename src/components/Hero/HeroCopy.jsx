import Link from "next/link";
import QuoteButton from "@/components/Quote/QuoteButton";
import { BUSINESS, phoneDisplay, phoneHref } from "@/data/business";

// The copy over a drawn hero (the homepage's and a service page's), laid out
// like HB Links' hero: on a service page the trail back (`crumbs`, each
// { label, href }, the page itself last), the title over two lines (`title`),
// the credentials (ending with the page's `place`: Los Angeles, or an area
// page's area), a line about the work (`lede`), and the buttons: the quote
// request first, then the phone, stacked full width on a phone.
export default function HeroCopy({ crumbs, title, lede, place = "Los Angeles" }) {
  const phone = phoneHref();
  return (
    <div className="max-w-4xl">
      {crumbs && (
        <nav aria-label="Breadcrumb" className="mb-5 700:mb-6">
          <ol className="flex flex-wrap items-center gap-x-2.5 gap-y-1 font-script text-[11px] 700:text-[11.5px] uppercase tracking-[0.2em] text-white/55 pointer-events-none">
            {crumbs.map(({ label, href }, i) => {
              const last = i === crumbs.length - 1;
              return (
                <li key={label} className="flex items-center gap-2.5">
                  {last ? (
                    <span aria-current="page" className="text-third">
                      {label}
                    </span>
                  ) : (
                    <>
                      <Link href={href} className="pointer-events-auto hover:text-white transition-colors duration-200">
                        {label}
                      </Link>
                      <span aria-hidden="true" className="text-white/30">
                        /
                      </span>
                    </>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      )}

      <h1
        className="font-display uppercase w-fit tracking-[0.01em] leading-[1.02] pointer-events-none
        1600:text-[4.5rem] 1080:text-[4rem] 700:text-[3.4rem] 550:text-[2.9rem] text-[9vw]"
      >
        {title}
      </h1>

      <p className="max-550:hidden font-script mt-7 text-neutral-300 900:text-[12px] text-[11px] uppercase tracking-[0.22em] flex flex-wrap gap-x-3 gap-y-1.5 items-center pointer-events-none">
        <span>Licensed &amp; Insured</span>
        {BUSINESS.license && (
          <>
            <span className="text-third 700:text-2xl text-xl max-700:hidden">/</span>
            <span className="max-700:hidden">CSLB #{BUSINESS.license}</span>
          </>
        )}
        <span className="text-third 700:text-2xl text-xl">/</span>
        <span>{place}</span>
      </p>

      <p className="550:mt-6 mt-6 font-light max-w-2xl text-neutral-200 text-[15px] 700:text-base 900:text-[17px] pointer-events-none">
        {lede}
      </p>

      <div className="mt-8 flex flex-wrap items-center gap-3 max-550:flex-col max-550:items-stretch">
        <QuoteButton />
        {phone && (
          <a
            href={phone}
            className="inline-flex items-center justify-center h-12 px-6 border border-white/35 text-neutral-50 uppercase text-[12.5px] font-semibold tracking-[0.12em] whitespace-nowrap hover:border-white hover:bg-white/10 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-third"
          >
            Call {phoneDisplay()}
          </a>
        )}
      </div>
    </div>
  );
}
