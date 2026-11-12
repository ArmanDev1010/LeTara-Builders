import HeroCopy from "@/components/Hero/HeroCopy";
import ServiceHero from "@/components/Hero/ServiceHero";
import Contact from "@/components/Home/Contact";
import FAQ from "@/components/Home/FAQ";
import Process from "@/components/Home/Process";
import ServiceAreas from "@/components/Home/ServiceAreas";
import Layers from "@/components/Service/Layers";
import ProjectsSection from "@/components/Projects/ProjectsSection";
import Posters from "@/components/Service/Posters";
import Types from "@/components/Service/Types";
import { getProjects, projectsForService } from "@/lib/projects";
import { buildBreadcrumbs, buildServiceSchema } from "@/lib/seo";

// the projects section's words, by service ("ADUs we've built.")
const BUILT = {
  "new-construction": "New homes",
  "home-additions": "Additions",
  "adu-contractor": "ADUs",
  "home-remodeling": "Remodels",
  "outdoor-living": "Outdoor spaces",
};

// A service page (data/service-pages), served at /<slug>-los-angeles, in the
// order of what matters most, taken from HB Links' service pages (the user's
// priorities): what you get, how it goes, the forms it comes in, the quote
// form mid-page, then the questions, where we build, and the other services.
//
//   the turntable hero, the service itself the star (Hero/ServiceHero);
//   Layer by layer: what's included, on an exploded drawing of the same object;
//   How we work: the homepage's five steps, worded for the service;
//   the types, as a switcher with a small site plan of each;
//   the quote form (the homepage's);
//   the questions (the homepage's FAQ, the service's own questions);
//   Where we build (the homepage's map, the service's own heading);
//   Also showing: the other services as film posters.
//
// The process, the questions and the areas are the homepage's sections at
// the user's request (11-09): their own versions here (three acts, every
// answer open, a band of areas) read as confusing or didn't look good, and
// "Know before you build" was dropped. Mainly white, like the homepage: the
// hero, the form and the areas are black. Scene numbers run in page order.
// The service's projects (Projects/ProjectsSection, from the projects
// editor) come before the form, only when it has some (11-12).
export default async function ServicePage({ page }) {
  const projects = projectsForService(await getProjects(), page.slug);
  const built = BUILT[page.slug] ?? "Projects";
  const order = ["layers", "process", page.types && "types", projects.length && "projects", "quote", "faq", "areas", "posters"].filter(Boolean);
  const number = (id) => String(order.indexOf(id) + 1).padStart(2, "0");
  const schemas = [
    buildServiceSchema(page),
    buildBreadcrumbs([
      { name: "Home", path: "" },
      { name: page.navLabel, path: page.href },
    ]),
  ];

  return (
    <main>
      {schemas.map((schema) => (
        <script key={schema["@type"]} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}

      <ServiceHero asset={page.asset} label={page.assetLabel}>
        <HeroCopy
          crumbs={[
            { label: "Home", href: "/" },
            { label: "Services", href: "/#services" },
            { label: page.navLabel },
          ]}
          title={
            <>
              {page.title} <br /> in <span className="italic whitespace-nowrap">Los Angeles.</span>
            </>
          }
          lede={page.hero}
        />
      </ServiceHero>

      <Layers number={number("layers")} asset={page.asset} {...page.layers} />
      <Process number={number("process")} {...page.process} />
      {page.types && <Types number={number("types")} {...page.types} />}
      <ProjectsSection
        number={number("projects")}
        heading={[built, "we've built."]}
        intro={`A few of the ${built === "ADUs" ? built : built.toLowerCase()} we've designed and built. Open one to see it.`}
        projects={projects}
        more={`/projects?service=${page.slug}`}
      />
      <Contact number={number("quote")} {...page.quote} />
      <FAQ number={number("faq")} heading={page.faqHeading} intro={page.faqIntro} faqs={page.faqs} />
      <ServiceAreas number={number("areas")} {...page.areas} />
      <Posters number={number("posters")} services={page.related} />
    </main>
  );
}
