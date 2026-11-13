import Image from "next/image";
import Link from "next/link";
import { TbArrowRight } from "react-icons/tb";
import Contact from "@/components/Home/Contact";
import Reveal from "@/components/Home/Reveal";
import { CONTAINER, LIGHT, PhotoStandIn, SECTION, SectionLabel, Viewfinder } from "@/components/Home/parts";
import ProjectsBrowser from "@/components/Projects/ProjectsBrowser";
import { SERVICES } from "@/data/services";

// The projects page (/projects), from the projects the editor saved
// (lib/projects.js):
//   the hero, dark: the heading, a line, and the real counts (projects,
//     cities, services) in large outline numbers;
//   the featured project (the editor's "Feature it"), large: its photo
//     beside a dark panel with its name, place, services and summary;
//   every project, filterable by service and by city (Projects/
//     ProjectsBrowser), each card opening its page;
//   the quote form.
// With no projects yet, the hero says so and the rest waits.
export default function ProjectsPage({ projects }) {
  const featured = projects.find((p) => p.featured);
  const cities = new Set(projects.map((p) => p.area ?? p.city)).size;
  const services = new Set(projects.flatMap((p) => p.services)).size;
  const stats = [
    [projects.length, projects.length === 1 ? "Project" : "Projects"],
    [cities, cities === 1 ? "City" : "Cities"],
    [services, services === 1 ? "Service" : "Services"],
  ];

  return (
    <main>
      {/* One screen tall, never more (the user, 11-12): the screen's height
          through --svh (StableViewport), at least 560px, the words centred
          below the navbar and a size smaller on short windows (`short:`, as
          the quote dialog) so they always fit. wide-zoom is on the words
          only, never on the screen-sized box (see "Big screens"). */}
      <section id="hero" className="relative flex flex-col justify-center h-[calc(100*var(--svh))] min-h-[560px] overflow-hidden bg-[#030303] text-neutral-50">
        <span aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_70%_at_15%_0%,rgba(233,166,72,0.16),transparent_70%)]" />
        <div className={`${CONTAINER} relative pt-24 pb-10 700:pt-28 700:pb-12`}>
          <div className="wide-zoom">
          <nav aria-label="Breadcrumb" className="font-script text-[11px] uppercase tracking-[0.2em] text-white/50">
            <Link href="/" className="hover:text-third transition-colors duration-200">
              Home
            </Link>
            <span aria-hidden="true" className="mx-2.5 pointer-events-none">
              /
            </span>
            <span className="text-third pointer-events-none">Projects</span>
          </nav>
          <h1 className="mt-6 font-display uppercase leading-[0.92] tracking-[0.01em] text-[48px] 400:text-[56px] 700:text-[76px] 1080:text-[92px] 1440:text-[104px] short:700:text-[64px] short:1080:text-[76px] short:1440:text-[80px] pointer-events-none">
            Our projects <br />
            across <span className="italic whitespace-nowrap">Los Angeles.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-[16px] 700:text-[18px] leading-relaxed text-white/65 pointer-events-none">
            {projects.length
              ? "New homes, additions, ADUs, remodels and outdoor living spaces we've designed and built. Pick a service or a city to narrow it down, and open any project to see more."
              : "Our projects are on their way to this page: new homes, additions, ADUs, remodels and outdoor living spaces we've designed and built."}
          </p>
          {projects.length > 0 && (
            <dl className="mt-12 700:mt-16 short:700:mt-10 grid grid-cols-3 max-w-2xl border-t border-white/10 pointer-events-none">
              {stats.map(([value, label], i) => (
                <div key={label} className={`pt-6 short:700:pt-5 ${i ? "pl-5 700:pl-8 border-l border-white/10" : ""}`}>
                  <dd className="font-display leading-none text-[48px] 700:text-[72px] short:700:text-[56px] text-transparent [-webkit-text-stroke:1.5px_rgba(233,166,72,0.85)]">
                    {String(value).padStart(2, "0")}
                  </dd>
                  <dt className="mt-3 font-script text-[11px] uppercase tracking-[0.2em] text-white/55">{label}</dt>
                </div>
              ))}
            </dl>
          )}
          </div>
        </div>
      </section>

      {projects.length > 0 && (
        <section id="projects" className={`${SECTION} ${LIGHT}`}>
          <div className={CONTAINER}>
            {featured && (
              <Reveal className="mb-20 1080:mb-24">
                <Featured project={featured} />
              </Reveal>
            )}
            <Reveal>
              <SectionLabel number="01" tone="light">
                All projects
              </SectionLabel>
            </Reveal>
            <div className="mt-8">
              <ProjectsBrowser projects={projects} />
            </div>
          </div>
        </section>
      )}

      <Contact number={projects.length ? "02" : "01"} heading={["Have a project", "like these?"]} />
    </main>
  );
}

// The featured project, large: its photo (or a stand-in) in viewfinder
// corners beside a dark panel; the whole block opens its page.
function Featured({ project }) {
  const services = project.services.map((slug) => SERVICES.find((s) => s.slug === slug)).filter(Boolean);
  return (
    <Link
      href={project.href}
      className="group grid 1080:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-third"
    >
      <div className="relative aspect-[16/10] 1080:aspect-auto 1080:min-h-[460px]">
        <Viewfinder />
        <div className="absolute inset-0 overflow-hidden bg-[#0b0b0b]">
          {project.cover ? (
            <Image
              src={project.cover}
              alt={`${project.title}${project.city ? `, ${project.city}` : ""}`}
              fill
              sizes="(min-width: 1080px) 58vw, 100vw"
              className="object-cover motion-safe:transition-transform motion-safe:duration-700 [transform:scale(1)] motion-safe:group-hover:[transform:scale(1.03)]"
            />
          ) : (
            <PhotoStandIn icon={services[0]?.icon} />
          )}
        </div>
      </div>
      <div className="pointer-events-none relative bg-[#0b0b0b] text-neutral-50 p-7 700:p-10 1440:p-12 flex flex-col justify-end gap-5 1080:border-l border-white/10">
        <span aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_100%_0%,rgba(233,166,72,0.14),transparent_70%)]" />
        <p className="relative flex flex-wrap items-center gap-3 font-script text-[11px] uppercase tracking-[0.2em] text-third">
          Featured project
          {project.sample && <span className="border border-white/30 px-2 py-0.5 text-white/70">Sample</span>}
          {project.status === "in-progress" && <span className="bg-third px-2 py-0.5 font-bold text-neutral-950">In progress</span>}
        </p>
        <h2 className="relative font-display uppercase leading-[0.92] tracking-[0.01em] text-[40px] 700:text-[52px]">{project.title}</h2>
        <p className="relative font-script text-[12px] uppercase tracking-[0.18em] text-white/60">
          {project.city}
          {project.year ? ` · ${project.year}` : ""}
          {services.length ? ` · ${services.map((s) => s.title).join(", ")}` : ""}
        </p>
        <p className="relative max-w-lg text-[16px] leading-relaxed text-white/70">{project.summary}</p>
        <span className="relative mt-2 inline-flex items-center gap-2 self-start uppercase text-[12px] font-semibold tracking-[0.14em] border-b border-third pb-1 group-hover:text-third transition-colors duration-200">
          View the project
          <TbArrowRight aria-hidden="true" className="text-third transition-transform duration-200 group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
