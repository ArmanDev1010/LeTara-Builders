import { notFound } from "next/navigation";
import ProjectPage from "@/components/Projects/ProjectPage";
import { getProject, getProjects } from "@/lib/projects";
import { buildBreadcrumbs, buildPageMetadata } from "@/lib/seo";

// One page per project the editor saved, built ahead; anything else 404s
// (notFound below). Not dynamicParams = false: with it, a project saved in
// the editor while the site runs (npm run dev) 404'd until a restart, the
// list of pages being kept from before it.
export async function generateStaticParams() {
  return (await getProjects()).map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return {};
  return buildPageMetadata({
    title: project.city ? `${project.title} in ${project.city}` : project.title,
    description: project.summary,
    path: project.href,
    ...(project.cover ? { image: project.cover } : {}),
  });
}

export default async function Page({ params }) {
  const { slug } = await params;
  const projects = await getProjects();
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();
  // more projects: those sharing a service first, then the rest, three
  const others = projects.filter((p) => p.slug !== slug);
  const shares = (p) => p.services.some((s) => project.services.includes(s));
  const more = [...others.filter(shares), ...others.filter((p) => !shares(p))].slice(0, 3);
  const breadcrumbs = buildBreadcrumbs([
    { name: "Home", path: "" },
    { name: "Projects", path: "/projects" },
    { name: project.title, path: project.href },
  ]);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <ProjectPage project={project} more={more} />
    </>
  );
}
