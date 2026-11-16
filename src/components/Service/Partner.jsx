import Reveal from "@/components/Home/Reveal";
import { CONTAINER, H2, LEDE, LIGHT, Lines, SECTION, SectionLabel } from "@/components/Home/parts";
import PartnerCard from "@/components/UI/PartnerCard";

// A service page's partner section, on white (the outdoor living page:
// Vista Pergolas for patio covers and awnings, Andranik's request, 11-16):
// the heading and a line, then the partner's card (UI/PartnerCard).
export default function Partner({ number, heading, intro }) {
  return (
    <section id="partner" className={`${SECTION} ${LIGHT}`}>
      <div className={CONTAINER}>
        <div className="grid gap-6 1080:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] 1080:items-end">
          <div>
            <Reveal>
              <SectionLabel number={number} tone="light">
                Our partner
              </SectionLabel>
            </Reveal>
            <Reveal as="h2" delay={0.05} className={`mt-5 ${H2}`}>
              <Lines lines={heading} />
            </Reveal>
          </div>
          <Reveal as="p" delay={0.1} className={`${LEDE.light} max-w-xl 1080:pb-1`}>
            {intro}
          </Reveal>
        </div>
        <Reveal delay={0.1} className="mt-10 1080:mt-12">
          <PartnerCard />
        </Reveal>
      </div>
    </section>
  );
}
