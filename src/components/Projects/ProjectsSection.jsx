import Link from "next/link";
import { TbArrowRight } from "react-icons/tb";
import Reveal from "@/components/Home/Reveal";
import { CONTAINER, H2, LEDE, LIGHT, Lines, SECTION, SectionLabel } from "@/components/Home/parts";
import ProjectCard from "@/components/Projects/ProjectCard";

const SHOWN = 3;

// The projects a service page or an area page has (lib/projects.js:
// projectsForService / projectsForArea), on white: the heading and a line,
// up to three cards, and "See all" to the projects page, filtered to this
// service or city (`more`). With no projects, there is no section (the
// user's rule, 11-12): the pages pass it only when they have some.
export default function ProjectsSection({ number, heading, intro, projects, more }) {
  if (!projects.length) return null;
  return (
    <section id="projects" className={`${SECTION} ${LIGHT}`}>
      <div className={CONTAINER}>
        <div className="grid gap-6 1080:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] 1080:items-end">
          <div>
            <Reveal>
              <SectionLabel number={number} tone="light">
                Projects
              </SectionLabel>
            </Reveal>
            <Reveal as="h2" delay={0.05} className={`mt-5 ${H2}`}>
              <Lines lines={heading} />
            </Reveal>
          </div>
          <div className="1080:pb-1">
            <Reveal as="p" delay={0.1} className={`${LEDE.light} max-w-xl`}>
              {intro}
            </Reveal>
            <Reveal delay={0.12} className="mt-5">
              <Link
                href={more}
                className="group inline-flex items-center gap-2 uppercase text-[12px] font-semibold tracking-[0.14em] text-neutral-950 border-b border-third pb-1 hover:text-third transition-colors duration-200"
              >
                {projects.length > SHOWN ? `See all ${projects.length}` : "See all projects"}
                <TbArrowRight aria-hidden="true" className="text-third transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            </Reveal>
          </div>
        </div>
        <ul className="mt-10 1080:mt-12 grid gap-x-6 gap-y-14 700:grid-cols-2 1080:grid-cols-3">
          {projects.slice(0, SHOWN).map((project, i) => (
            <Reveal as="li" key={project.slug} delay={0.05 * i}>
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
