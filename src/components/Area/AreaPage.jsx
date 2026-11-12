import AreaBuild from "@/components/Area/AreaBuild";
import HeroCopy from "@/components/Hero/HeroCopy";
import ServiceHero from "@/components/Hero/ServiceHero";
import Contact from "@/components/Home/Contact";
import FAQ from "@/components/Home/FAQ";
import Process from "@/components/Home/Process";
import ServiceAreas from "@/components/Home/ServiceAreas";
import ProjectsSection from "@/components/Projects/ProjectsSection";
import { PROPERTY } from "@/data/area-pages";
import { getProjects, projectsForArea } from "@/lib/projects";
import { buildAreaSchema, buildBreadcrumbs } from "@/lib/seo";

// An area page (data/area-pages), served at /design-build-contractor-<slug>,
// built like a service page, in the same order (the user liked how those
// were handled): what LeTara builds there, shown, then how it goes, the
// form, the questions and the map.
//
//   the turntable hero: one Craftsman home with every service on its lot,
//     coming together, the area's name in outline behind it
//     (Hero/ServiceHero, the `property` asset);
//   What we build: the same home as a line drawing with a cutaway over the
//     rooms inside, beside a dark card per service, each lighting its part
//     of the home and opening its page (Area/AreaBuild);
//   How we work: the homepage's five steps;
//   the quote form (the homepage's);
//   the area's own questions (the homepage's FAQ);
//   Where we build: the map, opening on this area, linking to the others,
//     last (the user tried it before the questions on 11-12 and swapped
//     them back).
//
// Mainly white; the hero, the form and the areas are black. Scene numbers
// run in page order. (11-11, rejected: a film-slate hero, a call sheet of
// facts as the first section, a street of two houses, a modern house with
// its ADU set apart, three notes on the area's history and rules ("a
// history lesson"), and "Project ideas", a tabbed switcher with drawings.
// 11-12: "Where do you want to start?", goals on a honeycomb opening how
// we'd go about each here, one call to action too many; then "Neighborhoods
// we cover", tiles of the area's neighborhoods and its neighbors; then
// "Building in <area>", written local descriptions per service. The user
// scrapped the slot until they decide what goes there.)
export default async function AreaPage({ page }) {
  const { name } = page;
  // the area's projects (from the projects editor), after How we work, only
  // when it has some (11-12)
  const projects = projectsForArea(await getProjects(), page.slug);
  const order = ["build", "process", projects.length && "projects", "quote", "faq", "areas"].filter(Boolean);
  const number = (id) => String(order.indexOf(id) + 1).padStart(2, "0");
  const schemas = [
    buildAreaSchema(page),
    buildBreadcrumbs([
      { name: "Home", path: "" },
      { name, path: page.href },
    ]),
  ];

  return (
    <main>
      {schemas.map((schema) => (
        <script key={schema["@type"]} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}

      <ServiceHero asset="property" word={name} label={`A Craftsman home in ${name} with every kind of project LeTara builds on its lot`}>
        <HeroCopy
          crumbs={[
            { label: "Home", href: "/" },
            { label: "Service Areas", href: "/#service-areas" },
            { label: name },
          ]}
          title={
            <>
              Design-Build Contractor <br /> in <span className="italic whitespace-nowrap">{name}.</span>
            </>
          }
          lede={page.hero}
          place={name}
        />
      </ServiceHero>

      <AreaBuild number={number("build")} heading={["What we build", `in ${name}.`]} intro={page.services} items={PROPERTY} />
      <Process number={number("process")} intro={`How a project in ${name} goes with us, from the first call to the final walkthrough.`} />
      <ProjectsSection
        number={number("projects")}
        heading={["Projects", `in ${name}.`]}
        intro={`What we've built in ${name}. Open one to see it.`}
        projects={projects}
        more={`/projects?city=${page.slug}`}
      />
      <Contact
        number={number("quote")}
        heading={["Building in", `${name}?`]}
        intro="A few quick questions, about a minute, and you pick a time for us to come see the property."
      />
      <FAQ
        number={number("faq")}
        heading={["What homeowners ask", `in ${name}.`]}
        intro="Don't see yours? Ask us directly. There's no such thing as a small question when it's your home."
        faqs={page.faqs}
      />
      <ServiceAreas
        number={number("areas")}
        initial={name}
        intro="From the Valley to the hills around it. Pick a city to see it on the map and open its page; if yours isn't here, ask: we may still build there."
      />
    </main>
  );
}
