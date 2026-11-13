import { BUSINESS } from "@/data/business";
import { ExternalLink } from "./links";

// The service and area pages state ADU limits, permit rules and local
// reviews; this page keeps those from reading as promises. The licensing
// section names only the number, which is on the CSLB record; add the
// classifications once they're checked there (CLAUDE.md: check the CSLB
// record first).
const disclaimer = {
  intro: (
    <p>
      What&rsquo;s on letarabuilders.com (the &ldquo;Site&rdquo;) is here to help you get to know LeTara Builders, Inc. and
      plan your project. Please keep the following in mind when you rely on it.
    </p>
  ),
  sections: [
    {
      id: "general-information",
      heading: "General information",
      body: (
        <p>
          The Site&rsquo;s pages, including its answers to common questions and what it says about ADUs, zoning and
          permits, are general information. They aren&rsquo;t legal, architectural, engineering, tax or financial advice,
          and they may not fit your property. Reading the Site doesn&rsquo;t make us your contractor or designer. Talk with
          us, and with the right professionals, before you decide on your project.
        </p>
      ),
    },
    {
      id: "permits-and-rules",
      heading: "Permits, zoning and building codes",
      body: (
        <p>
          Building and zoning rules differ from city to city and change over time. The building department for your
          property, such as the City of Los Angeles&rsquo; Department of Building and Safety (LADBS), or Burbank&rsquo;s or
          Glendale&rsquo;s own, makes the final call on what can be built and which permits it needs. We look into the
          rules for your project as we plan it, but we can&rsquo;t promise a permit will be issued, or how long plan
          review and inspections will take: the city controls those steps.
        </p>
      ),
    },
    {
      id: "costs-and-timelines",
      heading: "Costs and timelines",
      body: (
        <p>
          Nothing on the Site is a price or a schedule for your project. What a project costs and how long it takes depend
          on your property, your design and choices, what&rsquo;s found on site (including inside walls and underground),
          engineering, the city&rsquo;s review, materials, weather and any changes along the way. Only the price and
          schedule in your signed contract are binding.
        </p>
      ),
    },
    {
      id: "drawings-and-photos",
      heading: "Drawings and photos",
      body: (
        <p>
          The animated houses and drawings on the Site, including the house that comes together on our homepage, the
          models on our service and area pages, and the plan drawings of project types, are illustrations, not drawings
          of a particular LeTara Builders project, and they aren&rsquo;t to scale. Colors, materials and finishes can look
          different on a screen than in person.
        </p>
      ),
    },
    {
      id: "reviews",
      heading: "Reviews",
      body: (
        <p>
          The reviews on the Site come from real LeTara Builders clients and are shared with their permission. They
          describe their own experience; yours may differ with the scope and circumstances of your project.
        </p>
      ),
    },
    {
      id: "awards",
      heading: "Awards",
      body: (
        <p>
          The awards mentioned on the Site are Andranik Taranyan&rsquo;s, for his work in visual effects for television.
          The award names are the trademarks of their owners, and the organizations behind them aren&rsquo;t affiliated
          with LeTara Builders and don&rsquo;t endorse it.
        </p>
      ),
    },
    {
      id: "licensing",
      heading: "Our license",
      body: (
        <p>
          LeTara Builders, Inc. is licensed by the California Contractors State License Board (CSLB), license #
          {BUSINESS.license}. You can check any California contractor&rsquo;s license on the{" "}
          <ExternalLink href="https://www.cslb.ca.gov/OnlineServices/CheckLicenseII/CheckLicense.aspx">
            CSLB&rsquo;s website
          </ExternalLink>
          . Work that needs a license we don&rsquo;t hold is done by licensed subcontractors, or otherwise as California
          law allows.
        </p>
      ),
    },
    {
      id: "other-websites",
      heading: "Other websites",
      body: (
        <p>
          Links to other websites are there for convenience. We don&rsquo;t control or endorse those sites and aren&rsquo;t
          responsible for what&rsquo;s on them.
        </p>
      ),
    },
    {
      id: "changes",
      heading: "Changes",
      body: (
        <p>
          We may update the Site and this page at any time. The &ldquo;Last updated&rdquo; date at the top shows when this
          page last changed.
        </p>
      ),
    },
  ],
};

export default disclaimer;
