import { SERVICES } from "@/data/services";
import aduContractor from "./adu-contractor";
import homeAdditions from "./home-additions";
import homeRemodeling from "./home-remodeling";
import outdoorLiving from "./outdoor-living";

// One page per service (data/services.js), served at /<slug>-los-angeles
// and rendered by components/Service/ServicePage. Each file holds the
// page's words: its search title (`metaTitle`; the layout adds
// " | LeTara Builders") apart from its H1 (`title`), the hero's `focus` (a
// key of FOCUS in Hero/intro/scene.js) and line, then each section's
// content. The service's menu name, icon and address come from
// data/services.js, so the two can't disagree; `related` names the other
// services by slug, each with a line on why it goes with this one.
//
// Keep next.config.mjs' SERVICE_SLUGS in step when adding one.
const PAGES = [aduContractor, homeAdditions, homeRemodeling, outdoorLiving];

export const SERVICE_PAGES = PAGES.map((page) => {
  const service = SERVICES.find((s) => s.slug === page.slug);
  return {
    ...page,
    service,
    navLabel: service.title,
    href: service.href,
    // in the services' own order, so their numbers run 01, 02...
    related: page.related
      .map(({ slug, note }) => {
        const i = SERVICES.findIndex((s) => s.slug === slug);
        return { service: SERVICES[i], number: i + 1, note };
      })
      .sort((a, b) => a.number - b.number),
  };
});

export const getServicePage = (slug) => SERVICE_PAGES.find((page) => page.slug === slug) ?? null;
