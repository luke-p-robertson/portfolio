import { defineConfig } from "sanity";
import { media } from "sanity-plugin-media";
import { structureTool } from "sanity/structure";

import { schemaTypes } from "./sanity/schemaTypes";
import { SANITY_PROJECT_ID, SANITY_DATASET } from "./sanity/lib/projectId";

const singletonTypes = new Set(["homepage", "projectIndex", "profile", "siteSettings"]);
const singletonActions = new Set(["publish", "discardChanges", "restore"]);

export default defineConfig({
  name: "default",
  title: "Luke Robertson Studio",
  // Falls back to a placeholder so the app builds before the real project exists —
  // set the id in sanity/lib/projectId.ts to make the Studio work.
  projectId: SANITY_PROJECT_ID || "placeholder",
  dataset: SANITY_DATASET,
  basePath: "/cms",
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            S.listItem()
              .title("Homepage")
              .id("homepage")
              .child(S.document().schemaType("homepage").documentId("homepage")),
            S.listItem()
              .title("Projects page")
              .id("projectIndex")
              .child(S.document().schemaType("projectIndex").documentId("projectIndex")),
            S.listItem()
              .title("Profile")
              .id("profile")
              .child(S.document().schemaType("profile").documentId("profile")),
            S.divider(),
            S.documentTypeListItem("project").title("Projects"),
            S.documentTypeListItem("category").title("Filter categories"),
            S.divider(),
            S.listItem()
              .title("Site settings")
              .id("siteSettings")
              .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
          ]),
    }),
    media(),
  ],
  schema: {
    types: schemaTypes,
    templates: (templates) =>
      templates.filter((t) => !t.schemaType || !singletonTypes.has(t.schemaType)),
  },
  document: {
    actions: (input, { schemaType }) =>
      singletonTypes.has(schemaType)
        ? input.filter(({ action }) => action && singletonActions.has(action))
        : input,
  },
});
