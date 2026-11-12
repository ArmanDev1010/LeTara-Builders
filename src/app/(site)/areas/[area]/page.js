import { notFound } from "next/navigation";
import AreaPage from "@/components/Area/AreaPage";
import { AREA_PAGES, getAreaPage } from "@/data/area-pages";
import { buildPageMetadata } from "@/lib/seo";

// Served publicly at /design-build-contractor-<area> (e.g.
// /design-build-contractor-studio-city) through the rewrite in
// next.config.mjs, which also sends /areas/<area> there, so each page has
// one address. Unknown areas 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return AREA_PAGES.map(({ slug }) => ({ area: slug }));
}

export async function generateMetadata({ params }) {
  const { area } = await params;
  const page = getAreaPage(area);
  if (!page) return {};
  return buildPageMetadata({ title: page.metaTitle, description: page.description, path: page.href });
}

export default async function AreaRoute({ params }) {
  const { area } = await params;
  const page = getAreaPage(area);
  if (!page) notFound();
  return <AreaPage page={page} />;
}
