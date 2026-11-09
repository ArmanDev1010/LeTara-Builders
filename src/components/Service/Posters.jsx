import Link from "next/link";
import { TbArrowRight } from "react-icons/tb";
import Reveal from "@/components/Home/Reveal";
import { CONTAINER, H2, LEDE, LIGHT, SECTION, SectionLabel } from "@/components/Home/parts";
import { HEX } from "@/components/Navigation/HexButton";

const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";

// The other services as film posters, on white ("Also showing"): tall and
// dark, a credit line at the top, the service's icon on a big gold hexagon,
// its name large, and a line on why it goes with this one (`related` in the
// page's data). The whole poster opens its page; on hover the hexagon fills
// gold and the poster lifts. Not the homepage's cards, nor HB Links'.
export default function Posters({ number, services }) {
  return (
    <section id="more-services" className={`${SECTION} ${LIGHT}`}>
      <div className={CONTAINER}>
        <div className="grid gap-6 1080:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] 1080:items-end">
          <div>
            <Reveal>
              <SectionLabel number={number} tone="light">
                Also showing
              </SectionLabel>
            </Reveal>
            <Reveal as="h2" delay={0.05} className={`mt-5 ${H2}`}>
              One team, <br />
              the whole property.
            </Reveal>
          </div>
          <Reveal as="p" delay={0.1} className={`${LEDE.light} max-w-xl 1080:pb-1`}>
            Projects rarely stop at one thing. The same team can plan the rest with it, on the same site visit.
          </Reveal>
        </div>

        <ul className="mt-10 1080:mt-12 grid gap-4 700:grid-cols-3">
          {services.map(({ service, note }, i) => {
            const { title, icon: Icon, href, slug } = service;
            return (
              <Reveal as="li" key={slug} delay={0.07 * i}>
                <Link
                  href={href}
                  className={`group relative flex h-full min-h-[320px] 700:min-h-[460px] flex-col overflow-hidden bg-[#0b0b0b] text-neutral-50 border border-white/5 p-6 1080:p-8 transition-[transform,border-color] duration-500 ${EASE} hover:border-third/60 motion-safe:hover:[transform:translateY(-6px)] outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-third`}
                >
                  {/* the poster's glow, from the top */}
                  <span aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_55%_at_50%_0%,rgba(233,166,72,0.16),transparent_70%)]" />
                  <span className="relative font-script text-[10.5px] uppercase tracking-[0.24em] text-white/45">LeTara Builders presents</span>
                  <span aria-hidden="true" className="relative mx-auto mt-10 grid place-items-center w-[104px] h-[120px] text-third">
                    <svg viewBox="0 0 40 46" className="absolute inset-0 w-full h-full">
                      <polygon points={HEX} stroke="currentColor" strokeWidth="1" className="fill-transparent transition-[fill] duration-300 group-hover:fill-third" />
                    </svg>
                    <Icon className="relative text-[40px] transition-colors duration-300 group-hover:text-neutral-950" strokeWidth={1.4} />
                  </span>
                  <span className="relative mt-auto pt-10 font-display uppercase text-[44px] 1080:text-[52px] leading-[0.9] tracking-[0.01em]">{title}</span>
                  <span className="relative mt-3 text-[14.5px] leading-relaxed text-white/60">{note}</span>
                  <span className="relative mt-6 flex items-center justify-between border-t border-white/10 pt-4 font-script text-[11.5px] uppercase tracking-[0.18em] text-third">
                    Now showing
                    <TbArrowRight aria-hidden="true" className={`text-[18px] transition-transform duration-300 ${EASE} motion-safe:group-hover:[transform:translateX(3px)]`} />
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
