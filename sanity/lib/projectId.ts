/**
 * Sanity project + dataset — single source of truth for the whole app.
 * Hardcoded so a fresh clone runs with no per-developer `.env` setup; these values
 * are also injected into `next.config.ts` env. The project id and dataset name are
 * public (they ship in the client bundle), so committing them is safe.
 * Override locally by setting NEXT_PUBLIC_SANITY_PROJECT_ID / NEXT_PUBLIC_SANITY_DATASET
 * (e.g. to point at a staging dataset).
 */
export const SANITY_PROJECT_ID =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim() || "x47vlamh";

export const SANITY_DATASET =
  process.env.NEXT_PUBLIC_SANITY_DATASET?.trim() || "production";
