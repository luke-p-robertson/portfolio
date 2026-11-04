import type { MetadataRoute } from "next";

import { getSitemapBaseUrl } from "@/lib/siteUrl";
import { getProjectSlugs } from "@/sanity/lib/cachedQueries";

function absoluteUrl(path: string): string {
  const base = getSitemapBaseUrl();
  return path === "/" ? `${base}/` : `${base}${path}`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getProjectSlugs();

  return [
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/projects"), changeFrequency: "weekly", priority: 0.8 },
    { url: absoluteUrl("/profile"), changeFrequency: "monthly", priority: 0.6 },
    ...slugs.map((slug) => ({
      url: absoluteUrl(`/projects/${slug}`),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
