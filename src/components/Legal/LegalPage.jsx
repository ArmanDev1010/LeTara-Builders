import Link from "next/link";
import { TbMail, TbPhone } from "react-icons/tb";
import { CONTAINER, HexDot } from "@/components/Home/parts";
import { HEX } from "@/components/Navigation/HexButton";
import { BUSINESS, emailHref, phoneDisplay, phoneHref } from "@/data/business";
import { LEGAL_DOCUMENTS } from "@/data/legal";
import { LEGAL_PAGES } from "@/data/legalPages";
import { buildPageMetadata } from "@/lib/seo";
import { OnThisPage } from "./OnThisPage";

const CONTACT_ID = "contact-us";

// A section reached from "On this page" stops clear of the floating navbar.
const SCROLL_MARGIN = "scroll-mt-32";

// A cut corner, top right, as on the services cards (the navbar's points).
const CHAMFER = "[clip-path:polygon(0_0,calc(100%-22px)_0,100%_22px,100%_100%,0_100%)]";

const pad = (n) => String(n).padStart(2, "0");

// "2026-11-13" -> "November 13, 2026", read as UTC so it can't slip a day
const formatDate = (iso) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", { timeZone: "UTC", month: "long", day: "numeric", year: "numeric" });

const pageOf = (slug) => LEGAL_PAGES.find((p) => p.slug === slug);

// Each legal page's metadata: its route (app/(site)/(legal)/<slug>/page.js)
// exports `metadata = legalMetadata("<slug>")`.
export function legalMetadata(slug) {
  const page = pageOf(slug);
  return buildPageMetadata({ title: page.label, description: page.description, path: `/${slug}` });
}

// A legal page, in LeTara's own design (HB Links has the same pages; their
// look stays there):
//   a dark header: the breadcrumb, the title in the logo's face, the date it
//     last changed and the company with its license, and the other legal
//     pages as a row of typewriter links (this one gold, on a hexagon);
//   then on white the document: numbered sections, with "On this page"
//     beside them from 1080px (sticky, marking the section being read) and
//     folded above them on a phone;
//   and a dark card to reach us, with the phone and the email.
// Its text is in data/legal; its date and description in data/legalPages.js.
export default function LegalPage({ slug }) {
  const page = pageOf(slug);
  const doc = LEGAL_DOCUMENTS[slug];
  const toc = doc.sections.map(({ id, heading }) => ({ id, heading }));
  const phone = phoneHref();

  return (
    <main>
      <section id="hero" className="relative overflow-hidden bg-[#030303] text-neutral-50">
        <span aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_80%_at_12%_0%,rgba(233,166,72,0.14),transparent_70%)]" />
        <div className={`${CONTAINER} relative pt-36 pb-12 700:pt-44 700:pb-14`}>
          <div className="wide-zoom">
            <nav aria-label="Breadcrumb" className="font-script text-[11px] uppercase tracking-[0.2em] text-white/50">
              <Link href="/" className="hover:text-third transition-colors duration-200">
                Home
              </Link>
              <span aria-hidden="true" className="mx-2.5 pointer-events-none">
                /
              </span>
              <span className="text-third pointer-events-none">{page.label}</span>
            </nav>
            <h1 className="mt-6 font-display uppercase leading-[0.92] tracking-[0.01em] text-[52px] 400:text-[60px] 700:text-[80px] 1080:text-[96px] pointer-events-none">
              {page.label}
            </h1>
            <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-2 font-script text-[11.5px] uppercase tracking-[0.18em] pointer-events-none">
              <div className="flex gap-2.5">
                <dt className="text-white/45">Last updated</dt>
                <dd className="text-white/85">
                  <time dateTime={page.updated}>{formatDate(page.updated)}</time>
                </dd>
              </div>
              <div className="flex gap-2.5">
                <dt className="sr-only">Company</dt>
                <dd className="text-white/85">
                  {BUSINESS.legalName} · CSLB #{BUSINESS.license}
                </dd>
              </div>
            </dl>

            {/* the other legal pages; they wrap on a phone rather than scroll */}
            <nav aria-label="Legal pages" className="mt-10 700:mt-12 border-t border-white/10 pt-6">
              <ul className="flex flex-wrap gap-x-7 gap-y-3">
                {LEGAL_PAGES.map(({ label, slug: s }) => {
                  const on = s === slug;
                  return (
                    <li key={s}>
                      <Link
                        href={`/${s}`}
                        aria-current={on ? "page" : undefined}
                        className={`inline-flex items-center gap-2.5 font-script text-[11.5px] uppercase tracking-[0.18em] transition-colors duration-200 ${
                          on ? "text-third" : "text-white/55 hover:text-white"
                        }`}
                      >
                        <HexDot filled={on} className={on ? "" : "opacity-40"} />
                        {label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        </div>
      </section>

      <section className="wide-zoom relative bg-white text-neutral-950 pt-14 pb-28 700:pt-16 1080:pt-20 1080:pb-32">
        <div className={`${CONTAINER} 1080:grid 1080:grid-cols-[260px_minmax(0,1fr)] 1080:gap-x-16 1280:gap-x-24`}>
          <aside className="max-1080:hidden">
            <nav aria-label="On this page" className="sticky top-32 max-h-[calc(100vh-10rem)] overflow-y-auto">
              <p className="mb-5 flex items-center gap-3 font-script text-[11px] uppercase tracking-[0.22em] text-black/50 pointer-events-none">
                <HexDot />
                On this page
              </p>
              <OnThisPage sections={toc} contactId={CONTACT_ID} />
            </nav>
          </aside>

          <div className="min-w-0 max-w-[780px]">
            <details className="group 1080:hidden mb-12 border border-black/12">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 [&::-webkit-details-marker]:hidden">
                <span className="flex items-center gap-3 font-script text-[11.5px] uppercase tracking-[0.2em] text-black/70">
                  <HexDot />
                  On this page
                </span>
                <span aria-hidden="true" className="text-[20px] leading-none text-third transition-transform duration-200 group-open:rotate-45">
                  +
                </span>
              </summary>
              <nav aria-label="On this page" className="border-t border-black/10 px-5 py-4">
                <OnThisPage sections={toc} contactId={CONTACT_ID} />
              </nav>
            </details>

            <div className="text-[18px] 700:text-[20px] leading-[1.6] text-neutral-900 pointer-events-none [&_a]:pointer-events-auto">
              {doc.intro}
            </div>

            {doc.sections.map(({ id, heading, body }, i) => (
              <section key={id} id={id} aria-labelledby={`${id}-heading`} className={`${SCROLL_MARGIN} mt-14 pt-10 border-t border-black/10`}>
                <h2 id={`${id}-heading`} className="flex items-baseline gap-4 pointer-events-none">
                  <span className="font-script text-[13px] text-third tracking-[0.1em]">{pad(i + 1)}</span>
                  <span className="font-display uppercase text-[30px] 700:text-[36px] leading-[0.95] tracking-[0.01em]">{heading}</span>
                </h2>
                <div className="legal-prose mt-5">{body}</div>
              </section>
            ))}

            {/* reach us */}
            <section id={CONTACT_ID} aria-labelledby={`${CONTACT_ID}-heading`} className={`${SCROLL_MARGIN} relative mt-16 bg-[#0b0b0b] text-neutral-50 ${CHAMFER}`}>
              <span aria-hidden="true" className="absolute top-0 left-[calc(100%-22px)] w-[31px] h-[1.5px] bg-third origin-left rotate-45" />
              <div aria-hidden="true" className="h-[2px] bg-gradient-to-r from-third via-third/50 to-transparent" />
              <div className="p-7 700:p-10">
                <h2 id={`${CONTACT_ID}-heading`} className="font-display uppercase text-[32px] 700:text-[40px] leading-[0.95] tracking-[0.01em] pointer-events-none">
                  Questions about this page?
                </h2>
                <p className="mt-3 max-w-lg text-[15.5px] leading-relaxed text-white/60 pointer-events-none">
                  Or a request about your information? Reach us directly.
                </p>
                <ul className="mt-7 border-t border-white/10">
                  {phone && <Way icon={TbPhone} label="Call" value={phoneDisplay()} href={phone} big />}
                  {BUSINESS.email && <Way icon={TbMail} label="Email" value={BUSINESS.email} href={emailHref()} />}
                </ul>
                <p className="mt-6 font-script text-[11px] uppercase tracking-[0.18em] text-white/45 pointer-events-none">
                  {BUSINESS.legalName} · Licensed California contractor · CSLB #{BUSINESS.license}
                </p>
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}

// a way to reach us, on a hexagon (as in the homepage's contact section)
function Way({ icon: Icon, label, value, href, big }) {
  return (
    <li>
      <a href={href} className="group flex items-center gap-4 py-5 border-b border-white/10">
        <span aria-hidden="true" className="relative grid place-items-center w-10 h-[46px] shrink-0 text-third">
          <svg viewBox="0 0 40 46" className="absolute inset-0 w-full h-full">
            <polygon points={HEX} fill="none" stroke="currentColor" strokeOpacity="0.45" strokeWidth="1.5" />
          </svg>
          <Icon className="relative text-[17px]" />
        </span>
        <span className="min-w-0">
          <span className="block font-script text-[11px] uppercase tracking-[0.18em] text-white/45">{label}</span>
          <span
            className={`block mt-1 break-words transition-colors duration-200 group-hover:text-third ${
              big ? "font-display text-[30px] leading-none tracking-[0.02em]" : "text-[16px] font-medium"
            }`}
          >
            {value}
          </span>
        </span>
      </a>
    </li>
  );
}
