import Image from "next/image";
import Link from "next/link";
import Contact from "@/components/Home/Contact";
import Reveal from "@/components/Home/Reveal";
import { CONTAINER, H2, LIGHT, PhotoStandIn, SECTION, SectionLabel } from "@/components/Home/parts";
import ProjectCard from "@/components/Projects/ProjectCard";
import { SERVICES } from "@/data/services";

// One project's page (/projects/<slug>), kept simple until we know what
// Andranik has for each (the user, 11-12):
//   the hero: its main photo across the screen (a stand-in until it has
//     one), darkened at the foot, with the breadcrumb, its place and year,
//     its name and its services;
//   the story (the description) beside its facts: where (its area's page),
//     the services (their pages), the status, the year;
//   its photos, with their captions, if it has more;
//   more projects (those sharing a service first), and the quote form.
export default function ProjectPage({ project, more }) {
  const services = project.services.map((slug) => SERVICES.find((s) => s.slug === slug)).filter(Boolean);
  const order = ["story", project.gallery.length && "photos", more.length && "more", "quote"].filter(Boolean);
  const number = (id) => String(order.indexOf(id) + 1).padStart(2, "0");
  const [lede, ...rest] = project.paragraphs.length ? project.paragraphs : [project.summary];

  return (
    <main>
      {/* the hero; its height follows the screen through --svh (StableViewport) */}
      <section id="hero" className="relative h-[calc(78*var(--svh))] min-h-[520px] max-h-[900px] overflow-hidden bg-[#030303] text-neutral-50">
        {project.cover ? (
          <Image src={project.cover} alt={`${project.title}${project.city ? `, ${project.city}` : ""}`} fill priority sizes="100vw" className="object-cover" />
        ) : (
          <PhotoStandIn icon={services[0]?.icon} />
        )}
        <span aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/30" />
        <div className={`${CONTAINER} wide-zoom relative h-full flex flex-col justify-end pb-12 700:pb-16`}>
          <nav aria-label="Breadcrumb" className="font-script text-[11px] uppercase tracking-[0.2em] text-white/60">
            <Link href="/" className="hover:text-third transition-colors duration-200">
              Home
            </Link>
            <span aria-hidden="true" className="mx-2.5 pointer-events-none">
              /
            </span>
            <Link href="/projects" className="hover:text-third transition-colors duration-200">
              Projects
            </Link>
          </nav>
          <p className="mt-6 flex flex-wrap items-center gap-3 font-script text-[12px] uppercase tracking-[0.2em] text-third pointer-events-none">
            {project.city}
            {project.year ? ` · ${project.year}` : ""}
            {project.status === "in-progress" && <span className="bg-third px-2.5 py-1 font-bold text-[10.5px] text-neutral-950">In progress</span>}
            {project.sample && <span className="border border-white/30 px-2.5 py-1 text-[10.5px] text-white/80">Sample</span>}
          </p>
          <h1 className="mt-3 max-w-5xl font-display uppercase leading-[0.92] tracking-[0.01em] text-[44px] 400:text-[52px] 700:text-[72px] 1080:text-[88px] pointer-events-none">
            {project.title}
          </h1>
          {services.length > 0 && (
            <ul className="mt-6 flex flex-wrap gap-2">
              {services.map(({ slug, title, href, icon: Icon }) => (
                <li key={slug}>
                  <Link
                    href={href}
                    className="inline-flex items-center gap-2 border border-white/25 bg-black/30 px-3 py-1.5 font-script text-[11px] uppercase tracking-[0.14em] text-white/85 hover:border-third hover:text-third transition-colors duration-200"
                  >
                    <Icon aria-hidden="true" className="text-[14px] text-third" />
                    {title}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section id="story" className={`${SECTION} ${LIGHT}`}>
        <div className={`${CONTAINER} grid gap-12 1080:grid-cols-[minmax(0,1.5fr)_minmax(0,0.8fr)] 1080:gap-20`}>
          <div>
            <Reveal>
              <SectionLabel number={number("story")} tone="light">
                The project
              </SectionLabel>
            </Reveal>
            <Reveal as="p" delay={0.05} className="mt-6 max-w-3xl text-[19px] 700:text-[22px] leading-[1.5] text-neutral-900 pointer-events-none">
              {lede}
            </Reveal>
            {rest.map((paragraph, i) => (
              <Reveal as="p" key={i} delay={0.08} className="mt-5 max-w-3xl text-[16px] 700:text-[17px] leading-relaxed text-neutral-600 pointer-events-none">
                {paragraph}
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.1} className="1080:pt-12">
            <dl className="border-t-2 border-neutral-950">
              <Fact label="Where">
                {project.areaHref && project.areaHref !== "/" ? (
                  <Link href={project.areaHref} className="border-b border-third hover:text-third transition-colors duration-200">
                    {project.city}
                  </Link>
                ) : (
                  project.city
                )}
              </Fact>
              {services.length > 0 && (
                <Fact label={services.length > 1 ? "Services" : "Service"}>
                  <span className="flex flex-col gap-1.5">
                    {services.map(({ slug, title, href }) => (
                      <Link key={slug} href={href} className="self-start border-b border-third hover:text-third transition-colors duration-200">
                        {title}
                      </Link>
                    ))}
                  </span>
                </Fact>
              )}
              <Fact label="Status">{project.status === "in-progress" ? "In progress" : "Finished"}</Fact>
              {project.year && <Fact label="Year">{project.year}</Fact>}
            </dl>
          </Reveal>
        </div>
      </section>

      {project.gallery.length > 0 && (
        <section id="photos" className={`${SECTION} ${LIGHT}`}>
          <div className={CONTAINER}>
            <Reveal>
              <SectionLabel number={number("photos")} tone="light">
                Photos
              </SectionLabel>
            </Reveal>
            <ul className="mt-8 grid gap-4 700:grid-cols-2 1080:grid-cols-3">
              {project.gallery.map(({ image, caption }, i) => (
                <Reveal as="li" key={image} delay={0.04 * (i % 3)}>
                  <a href={image} target="_blank" rel="noopener" className="group block outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-third">
                    <span className="relative block aspect-[4/3] overflow-hidden bg-[#0b0b0b]">
                      <Image
                        src={image}
                        alt={caption || `${project.title}, photo ${i + 1}`}
                        fill
                        sizes="(min-width: 1080px) 33vw, (min-width: 700px) 50vw, 100vw"
                        className="object-cover motion-safe:transition-transform motion-safe:duration-700 [transform:scale(1)] motion-safe:group-hover:[transform:scale(1.03)]"
                      />
                    </span>
                    {caption && <span className="mt-3 block text-[14px] text-neutral-600">{caption}</span>}
                  </a>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      )}

      {more.length > 0 && (
        <section id="more" className={`${SECTION} ${LIGHT}`}>
          <div className={CONTAINER}>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <Reveal>
                  <SectionLabel number={number("more")} tone="light">
                    More projects
                  </SectionLabel>
                </Reveal>
                <Reveal as="h2" delay={0.05} className={`mt-5 ${H2}`}>
                  More of <br />
                  our work.
                </Reveal>
              </div>
              <Reveal delay={0.1}>
                <Link href="/projects" className="inline-flex items-center gap-2 uppercase text-[12px] font-semibold tracking-[0.14em] text-neutral-950 border-b border-third pb-1 hover:text-third transition-colors duration-200">
                  See all projects
                </Link>
              </Reveal>
            </div>
            <ul className="mt-10 grid gap-x-6 gap-y-14 700:grid-cols-2 1080:grid-cols-3">
              {more.map((p, i) => (
                <Reveal as="li" key={p.slug} delay={0.05 * i}>
                  <ProjectCard project={p} />
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      )}

      <Contact number={number("quote")} heading={["Planning something", "like this?"]} />
    </main>
  );
}

function Fact({ label, children }) {
  return (
    <div className="grid grid-cols-[96px_minmax(0,1fr)] gap-4 border-b border-neutral-200 py-4">
      <dt className="font-script text-[11px] uppercase tracking-[0.2em] text-neutral-500 pt-1 pointer-events-none">{label}</dt>
      <dd className="text-[16px] text-neutral-900">{children}</dd>
    </div>
  );
}
