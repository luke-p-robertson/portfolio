import { createClient, type SanityClient } from "@sanity/client";

import { SANITY_PROJECT_ID, SANITY_DATASET } from "./projectId";

let client: SanityClient | null = null;

function getClient(): SanityClient | null {
  if (!SANITY_PROJECT_ID) return null;
  if (!client) {
    client = createClient({
      projectId: SANITY_PROJECT_ID,
      dataset: SANITY_DATASET,
      apiVersion: "2025-01-01",
      // Always fetch direct from the API, never the CDN. Caching/perf is handled by the
      // Next data cache (`unstable_cache` + SANITY_CACHE_TAG) and invalidated by the
      // /api/revalidate webhook. With `useCdn: true`, a webhook-triggered refetch can hit
      // the CDN before it has propagated the publish and re-cache stale data — so keep it off.
      useCdn: false,
    });
  }
  return client;
}

export const sanityClient = getClient();
