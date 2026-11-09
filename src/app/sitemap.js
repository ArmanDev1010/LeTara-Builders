import { SERVICE_PAGES } from "@/data/service-pages";
import { BASE_URL } from "@/lib/seo";

function route(url, priority) {
  return {
    url: `${BASE_URL}${url}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority,
  };
}

// Every public page. New pages (areas, projects, legal) are added here as
// they're built.
export default function sitemap() {
  return [route("", 1), ...SERVICE_PAGES.map(({ href }) => route(href, 0.9))];
}
