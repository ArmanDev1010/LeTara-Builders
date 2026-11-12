import ProjectsPage from "@/components/Projects/ProjectsPage";
import { getProjects } from "@/lib/projects";
import { buildBreadcrumbs, buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Projects",
  description:
    "Projects by LeTara Builders across Los Angeles: new homes, home additions, ADUs, remodels and outdoor living spaces, designed and built by one licensed team.",
  path: "/projects",
});

export default async function Page() {
  const projects = await getProjects();
  const breadcrumbs = buildBreadcrumbs([
    { name: "Home", path: "" },
    { name: "Projects", path: "/projects" },
  ]);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <ProjectsPage projects={projects} />
    </>
  );
}
