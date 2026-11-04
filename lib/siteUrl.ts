/** Canonical production origin (no trailing slash). Single source of truth — also injected via `next.config.ts`. */
export const SITE_ORIGIN = "https://lukerobertson.studio";

/** Resolved site origin; env override optional (e.g. preview deploys). */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || SITE_ORIGIN
).replace(/\/$/, "");

/**
 * Origin for sitemap/robots `<loc>` values.
 * Uses localhost in `next dev` so `/sitemap.xml` is usable locally; production uses `SITE_URL`.
 */
export function getSitemapBaseUrl(): string {
  if (process.env.NODE_ENV === "development") {
    const port = process.env.PORT?.trim() || "3000";
    return `http://localhost:${port}`;
  }
  return SITE_URL;
}
