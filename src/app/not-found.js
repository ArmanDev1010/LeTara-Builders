import Link from "next/link";
import QuoteButton from "@/components/Quote/QuoteButton";
import SiteShell from "@/components/UI/SiteShell";
import { CONTAINER } from "@/components/Home/parts";

export const metadata = { title: "Page not found" };

// Any address that isn't a page (and an unknown project, area or service),
// inside the site's navbar and footer: it sits above the site's layout, so
// it brings them itself (UI/SiteShell). Kept small until HB Links' 404 page
// is ported in LeTara's look (CLAUDE.md).
export default function NotFound() {
  return (
    <SiteShell>
      <main>
        <section id="hero" className="relative overflow-hidden bg-[#030303] text-neutral-50">
          <span aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_70%_at_15%_0%,rgba(233,166,72,0.16),transparent_70%)]" />
          <div className={`${CONTAINER} wide-zoom relative pt-40 pb-24 700:pt-48 700:pb-32`}>
            <p className="font-script text-[11px] uppercase tracking-[0.2em] text-third pointer-events-none">404</p>
            <h1 className="mt-5 font-display uppercase leading-[0.92] tracking-[0.01em] text-[48px] 700:text-[76px] 1080:text-[92px] pointer-events-none">
              This page <br />
              isn&apos;t here.
            </h1>
            <p className="mt-6 max-w-xl text-[16px] 700:text-[18px] leading-relaxed text-white/65 pointer-events-none">
              The address may be mistyped, or the page has moved. Start from the homepage, see our projects, or tell us what you&apos;re planning.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5">
              <QuoteButton />
              <Link href="/" className="uppercase text-[12px] font-semibold tracking-[0.14em] border-b border-third pb-1 hover:text-third transition-colors duration-200">
                Homepage
              </Link>
              <Link href="/projects" className="uppercase text-[12px] font-semibold tracking-[0.14em] border-b border-third pb-1 hover:text-third transition-colors duration-200">
                Our projects
              </Link>
            </div>
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
