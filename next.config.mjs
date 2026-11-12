// The service pages' slugs (data/service-pages). Only these have a page at
// /<slug>-los-angeles; keep the list in step with that folder.
const SERVICE_SLUGS = "new-construction|home-additions|adu-contractor|home-remodeling|outdoor-living";
// The area pages' slugs (data/area-pages). Only these have a page at
// /design-build-contractor-<slug>; keep the list in step with that folder.
const AREA_SLUGS = "north-hills|granada-hills|porter-ranch|mission-hills|van-nuys|studio-city|burbank|glendale";

/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // The internal path behind the rewrite below: one public address per
      // service page.
      { source: `/services/:service(${SERVICE_SLUGS})`, destination: "/:service-los-angeles", permanent: true },
      { source: "/services/:path*", destination: "/#services", permanent: true },
      { source: "/services", destination: "/#services", permanent: true },
      { source: `/areas/:area(${AREA_SLUGS})`, destination: "/design-build-contractor-:area", permanent: true },
      { source: "/areas/:path*", destination: "/#service-areas", permanent: true },
      { source: "/areas", destination: "/#service-areas", permanent: true },
    ];
  },
  async rewrites() {
    return [
      // Service pages (app/services/[service]) are served at
      // /<service>-los-angeles (lib/routes.js). Unknown services 404 through
      // the route's dynamicParams = false.
      { source: `/:service(${SERVICE_SLUGS})-los-angeles`, destination: "/services/:service" },
      // Area pages (app/areas/[area]) at /design-build-contractor-<area>.
      { source: `/design-build-contractor-:area(${AREA_SLUGS})`, destination: "/areas/:area" },
    ];
  },
};

export default nextConfig;
