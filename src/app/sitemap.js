import { AREA_PAGES } from "@/data/area-pages";
import { SERVICE_PAGES } from "@/data/service-pages";
import { LEGAL_PAGES } from "@/data/legalPages";
import { getProjects } from "@/lib/projects";
import { BASE_URL } from "@/lib/seo";

function route(url, priority, lastModified = new Date()) {
  return {
    url: `${BASE_URL}${url}`,
    lastModified,
    changeFrequency: "monthly",
    priority,
  };
}

// Every public page: the homepage, the service and area pages, the
// projects page and every real project (samples never), and the legal pages
// with their own "Last updated" dates (a real date says more to a crawler
// than the build's).
export default async function sitemap() {
  const projects = (await getProjects()).filter((p) => !p.sample);
  return [
    route("", 1),
    ...SERVICE_PAGES.map(({ href }) => route(href, 0.9)),
    ...AREA_PAGES.map(({ href }) => route(href, 0.8)),
    route("/projects", 0.7),
    ...projects.map(({ href }) => route(href, 0.6)),
    ...LEGAL_PAGES.map(({ slug, updated }) => route(`/${slug}`, 0.3, new Date(`${updated}T00:00:00Z`))),
  ];
}
