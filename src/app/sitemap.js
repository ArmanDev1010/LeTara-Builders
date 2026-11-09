import { BASE_URL } from "@/lib/seo";

function route(url, priority) {
  return {
    url: `${BASE_URL}${url}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority,
  };
}

// Every public page. New pages (services, projects, legal) are added here
// as they're built.
export default function sitemap() {
  return [route("", 1)];
}
