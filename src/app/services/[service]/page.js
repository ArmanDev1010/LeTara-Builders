import { notFound } from "next/navigation";
import ServicePage from "@/components/Service/ServicePage";
import { SERVICE_PAGES, getServicePage } from "@/data/service-pages";
import { buildPageMetadata } from "@/lib/seo";

// Served publicly at /<service>-los-angeles (e.g. /adu-contractor-los-angeles)
// through the rewrite in next.config.mjs, which also sends /services/<service>
// there, so each page has one address. Unknown services 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return SERVICE_PAGES.map(({ slug }) => ({ service: slug }));
}

export async function generateMetadata({ params }) {
  const { service } = await params;
  const page = getServicePage(service);
  if (!page) return {};
  return buildPageMetadata({ title: page.metaTitle, description: page.description, path: page.href });
}

export default async function ServiceRoute({ params }) {
  const { service } = await params;
  const page = getServicePage(service);
  if (!page) notFound();
  return <ServicePage page={page} />;
}
