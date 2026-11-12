import { collection, config, fields } from "@keystatic/core";
import { SERVICE_AREAS } from "@/data/areas";
import { SERVICES } from "@/data/services";

// The projects editor (Keystatic): a form at /keystatic for adding a project
// without touching code. Each project is saved as one file in
// src/content/projects (<slug>.yaml) and its photos in
// public/images/projects/<slug>/; the site reads them (lib/projects.js) and
// builds the projects page, each project's page, and the projects sections
// on the service and area pages that match it.
//
// The choices come from the site's own lists, so they always match it: the
// services from data/services.js, the cities from data/areas.js (plus
// "somewhere else", with the place typed in).
//
// Storage is local for now: the editor works while the site runs on this
// computer (npm run dev, then http://localhost:3001/keystatic) and writes
// the files here, to be committed. Once the site is live, switch to GitHub
// storage so it can be used on the live site (see CLAUDE.md).
const PHOTOS = { directory: "public/images/projects", publicPath: "/images/projects/" };
const PLACES = [
  ...SERVICE_AREAS.map(({ name, slug }) => ({ label: name, value: slug })),
  { label: "Somewhere else", value: "other" },
];

export default config({
  storage: { kind: "local" },
  ui: { brand: { name: "LeTara Builders" } },
  collections: {
    projects: collection({
      label: "Projects",
      slugField: "title",
      path: "src/content/projects/*",
      format: { data: "yaml" },
      columns: ["title"],
      schema: {
        title: fields.slug({
          name: { label: "Project name", description: "A short name, e.g. \"Backyard ADU\" or \"Kitchen and living room remodel\"." },
          slug: { label: "Web address", description: "Made from the name; it becomes /projects/<this>." },
        }),
        services: fields.multiselect({
          label: "Services",
          description: "What we did on it. Tick every one that applies: the project then shows on each of those service pages.",
          options: SERVICES.map(({ title, slug }) => ({ label: title, value: slug })),
        }),
        location: fields.conditional(
          fields.select({
            label: "Where is it?",
            description: "If it's one of our service areas, the project shows on that area's page.",
            options: PLACES,
            defaultValue: "los-angeles",
          }),
          Object.fromEntries(
            PLACES.map(({ value }) => [
              value,
              value === "other"
                ? fields.text({ label: "City or neighborhood", validation: { length: { min: 1 } } })
                : fields.empty(),
            ]),
          ),
        ),
        status: fields.select({
          label: "Status",
          options: [
            { label: "Finished", value: "finished" },
            { label: "In progress", value: "in-progress" },
          ],
          defaultValue: "finished",
        }),
        year: fields.integer({ label: "Year finished", description: "Optional. Leave it empty if you're not sure." }),
        summary: fields.text({
          label: "Short summary",
          description: "One or two sentences, shown on the project's card.",
          multiline: true,
          validation: { length: { min: 1, max: 240 } },
        }),
        description: fields.text({
          label: "Description",
          description: "The full story, for the project's page: what the homeowners wanted, what we designed and built. Leave a blank line between paragraphs.",
          multiline: true,
        }),
        cover: fields.image({ label: "Main photo", description: "On the project's card and across the top of its page.", ...PHOTOS }),
        gallery: fields.array(
          fields.object({
            image: fields.image({ label: "Photo", ...PHOTOS, validation: { isRequired: true } }),
            caption: fields.text({ label: "Caption", description: "Optional." }),
          }),
          { label: "More photos", itemLabel: (item) => item.fields.caption.value || "Photo" },
        ),
        featured: fields.checkbox({
          label: "Feature it",
          description: "Shown large at the top of the projects page.",
          defaultValue: false,
        }),
        sample: fields.checkbox({
          label: "Sample (made up)",
          description: "A placeholder used while building the site, marked \"Sample\" on it and hidden once the site launches. Delete the samples when the real projects are in.",
          defaultValue: false,
        }),
      },
    }),
  },
});
