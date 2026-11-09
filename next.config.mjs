// The service pages' slugs (data/service-pages). Only these have a page at
// /<slug>-los-angeles; keep the list in step with that folder.
const SERVICE_SLUGS = "adu-contractor|home-additions|home-remodeling|outdoor-living";

/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // The internal path behind the rewrite below: one public address per
      // service page.
      { source: `/services/:service(${SERVICE_SLUGS})`, destination: "/:service-los-angeles", permanent: true },
      { source: "/services/:path*", destination: "/#services", permanent: true },
      { source: "/services", destination: "/#services", permanent: true },
    ];
  },
  async rewrites() {
    return [
      // Service pages (app/services/[service]) are served at
      // /<service>-los-angeles (lib/routes.js). Unknown services 404 through
      // the route's dynamicParams = false.
      { source: `/:service(${SERVICE_SLUGS})-los-angeles`, destination: "/services/:service" },
    ];
  },
};

export default nextConfig;
