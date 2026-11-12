import { createReader } from "@keystatic/core/reader";
import config from "../../keystatic.config";
import { SERVICE_AREAS } from "@/data/areas";
import { LAUNCHED } from "@/lib/seo";

// The projects, as the editor saved them (keystatic.config.js: one file each
// in src/content/projects), read on the server and shaped for the pages:
//   slug, href (/projects/<slug>), title, services (service slugs),
//   area (one of data/areas.js, or null), city (the place's name), areaHref,
//   status ("finished" / "in-progress"), year, summary, paragraphs (the
//   description, split at blank lines), cover and gallery ({ image, caption })
//   (paths under /images/projects), featured, sample.
// Samples (made up, for building the site) are left out once it launches.
// Order: featured first, then the newest year, then by name.
const reader = createReader(process.cwd(), config);

function shape({ slug, entry }) {
  const { discriminant, value } = entry.location;
  const area = SERVICE_AREAS.find((a) => a.slug === discriminant) ?? null;
  return {
    slug,
    href: `/projects/${slug}`,
    title: entry.title,
    services: entry.services ?? [],
    area: area?.slug ?? null,
    city: area?.name ?? (typeof value === "string" ? value.trim() : ""),
    areaHref: area?.href ?? null,
    status: entry.status,
    year: entry.year ?? null,
    summary: entry.summary,
    paragraphs: (entry.description ?? "").split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean),
    cover: entry.cover || null,
    gallery: (entry.gallery ?? []).filter((g) => g.image).map((g) => ({ image: g.image, caption: g.caption || "" })),
    featured: Boolean(entry.featured),
    sample: Boolean(entry.sample),
  };
}

export async function getProjects() {
  const entries = await reader.collections.projects.all();
  return entries
    .map(shape)
    .filter((p) => !(LAUNCHED && p.sample))
    .sort((a, b) => Number(b.featured) - Number(a.featured) || (b.year ?? 0) - (a.year ?? 0) || a.title.localeCompare(b.title));
}

export async function getProject(slug) {
  return (await getProjects()).find((p) => p.slug === slug) ?? null;
}

// the projects a service page or an area page shows (none: no section)
export const projectsForService = (projects, slug) => projects.filter((p) => p.services.includes(slug));
export const projectsForArea = (projects, slug) => projects.filter((p) => p.area === slug);
