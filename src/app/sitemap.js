import { AREA_PAGES } from "@/data/area-pages";
import { SERVICE_PAGES } from "@/data/service-pages";
import { getProjects } from "@/lib/projects";
import { BASE_URL } from "@/lib/seo";

function route(url, priority) {
  return {
    url: `${BASE_URL}${url}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority,
  };
}

// Every public page: the homepage, the service and area pages, the
// projects page and every real project (samples never). New pages (legal)
// are added here as they're built.
export default async function sitemap() {
  const projects = (await getProjects()).filter((p) => !p.sample);
  return [
    route("", 1),
    ...SERVICE_PAGES.map(({ href }) => route(href, 0.9)),
    ...AREA_PAGES.map(({ href }) => route(href, 0.8)),
    route("/projects", 0.7),
    ...projects.map(({ href }) => route(href, 0.6)),
  ];
}
