import { defineCliConfig } from "sanity/cli";

import { SANITY_PROJECT_ID, SANITY_DATASET } from "./sanity/lib/projectId";

/** Matches `sanity.config.ts` basePath and project. */
export default defineCliConfig({
  api: {
    projectId: SANITY_PROJECT_ID,
    dataset: SANITY_DATASET,
  },
  project: {
    basePath: "/cms",
  },
});
