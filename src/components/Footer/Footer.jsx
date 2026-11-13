import Link from "next/link";
import { CONTAINER, HexDot } from "@/components/Home/parts";
import QuoteButton from "@/components/Quote/QuoteButton";
import Logo from "@/components/UI/Logo";
import { BUSINESS, emailHref, hoursDisplay, phoneDisplay, phoneHref } from "@/data/business";
import { LEGAL_PAGES } from "@/data/legalPages";
import { SERVICES } from "@/data/services";

const EXPLORE = [
  { label: "Home", href: "/" },
  { label: "About", href: "/#about" },
  { label: "Services", href: "/#services" },
  { label: "How we work", href: "/#process" },
  { label: "Service Areas", href: "/#service-areas" },
  { label: "Projects", href: "/projects" },
  { label: "FAQ", href: "/#faq" },
  { label: "Get a free quote", href: "/#contact" },
];

// the legal pages (data/legalPages.js)
const LEGAL = LEGAL_PAGES.map(({ label, slug }) => ({ label, href: `/${slug}` }));

const heading = "font-script text-[11px] uppercase tracking-[0.2em] text-black/45 pointer-events-none";
const link = "text-[15px] text-black/65 hover:text-black transition-colors duration-200";

// The footer, on white (the user asked), after the black of the contact
// section: the logo and tagline with the quote button, the links, the ways
// to reach us and the credentials, the tagline again in outline across the
// bottom (the hero's outline title, closing the page), and the copyright,
// legal links and the developer's credit (as on HB Links: plain text, no
// link — the user asked for that there).
export default function Footer() {
  const phone = phoneHref();
  return (
    <footer className="wide-zoom relative overflow-hidden bg-white text-neutral-950">
      <div aria-hidden="true" className="h-[2px] bg-gradient-to-r from-transparent via-third to-transparent" />
      <div className={`${CONTAINER} pt-20 1080:pt-28 pb-8`}>
        <div className="grid grid-cols-2 gap-x-8 gap-y-12 1080:grid-cols-[minmax(0,1.5fr)_repeat(3,minmax(0,1fr))]">
          <div className="col-span-2 1080:col-span-1">
            <Link href="/" className="inline-block text-neutral-950" aria-label={`${BUSINESS.name}, home`}>
              <Logo layout="horizontal" className="h-12" title={BUSINESS.name} />
            </Link>
            {BUSINESS.tagline && (
              <p className="mt-6 flex items-center gap-2.5 font-script text-[12px] uppercase tracking-[0.24em] text-neutral-950 pointer-events-none">
                <HexDot />
                {BUSINESS.tagline}
              </p>
            )}
            <p className="mt-4 max-w-xs text-[14.5px] leading-relaxed text-black/55 pointer-events-none">{BUSINESS.description}</p>
            <QuoteButton tone="light" className="mt-8" />
          </div>

          <nav aria-label="Footer">
            <p className={heading}>Explore</p>
            <ul className="mt-5 space-y-3">
              {EXPLORE.map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className={link}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className={heading}>Services</p>
            <ul className="mt-5 space-y-3">
              {SERVICES.map(({ title, href }) => (
                <li key={title}>
                  <Link href={href} className={link}>
                    {title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 700:col-span-1">
            <p className={heading}>Contact</p>
            <ul className="mt-5 space-y-3">
              {phone && (
                <li>
                  <a href={phone} className={link}>
                    {phoneDisplay()}
                  </a>
                </li>
              )}
              {BUSINESS.email && (
                <li>
                  <a href={emailHref()} className={`${link} break-words`}>
                    {BUSINESS.email}
                  </a>
                </li>
              )}
              {BUSINESS.instagram && (
                <li>
                  <a href={BUSINESS.instagram} target="_blank" rel="noopener noreferrer" className={link}>
                    Instagram
                  </a>
                </li>
              )}
              <li className="text-[15px] text-black/65 pointer-events-none">
                Los Angeles, CA
              </li>
              {BUSINESS.hours && <li className="text-[15px] text-black/65 pointer-events-none">{hoursDisplay()}</li>}
            </ul>
            <p className={`mt-9 ${heading}`}>Credentials</p>
            <ul className="mt-5 space-y-2 text-[14px] text-black/55 pointer-events-none">
              <li>Licensed &amp; insured</li>
              {BUSINESS.license && <li>CSLB #{BUSINESS.license}</li>}
            </ul>
          </div>
        </div>

        {/* Sized to the screen's width, but never wider than its column
            (cqw, the @container): vw counts a desktop scrollbar, so in a
            narrow desktop window, like DevTools' phone view, it ran into
            the gutter (on HB Links the hero title did the same). */}
        <div className="@container mt-20">
          <p
            aria-hidden="true"
            className="select-none pointer-events-none whitespace-nowrap text-center font-display uppercase leading-[0.85] text-transparent [-webkit-text-stroke:1px_rgba(0,0,0,0.13)] text-[min(12.6vw,14.3cqw)] 700:text-[min(13.1vw,14.3cqw)] 1600:text-[216px]"
          >
            {BUSINESS.tagline}
          </p>
        </div>

        {/* centered under each other on a phone (the user asked), in a row from
            1280px: with five legal links, 1080px was too narrow for one line */}
        <div className="mt-10 pt-6 border-t border-black/10 flex flex-col items-center text-center 1280:flex-row 1280:items-center 1280:justify-between 1280:text-left gap-5 text-black/50">
          <p className="font-script text-[11px] uppercase tracking-[0.16em] pointer-events-none">
            © {new Date().getFullYear()} {BUSINESS.legalName} All rights reserved.
          </p>
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[13px]">
            {LEGAL.map(({ label, href }) => (
              <li key={href}>
                <Link href={href} className="hover:text-black transition-colors duration-200">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="font-script text-[11px] uppercase tracking-[0.16em] pointer-events-none">
            Built by <span className="font-bold text-black/80">Arman Manukyan</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
