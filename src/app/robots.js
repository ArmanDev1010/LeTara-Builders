import { BASE_URL, LAUNCHED } from "@/lib/seo";

// Until launch (LAUNCHED in lib/seo.js), crawlers are turned away entirely.
export default function robots() {
  if (!LAUNCHED) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/"],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
