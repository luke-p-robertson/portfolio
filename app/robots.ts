import type { MetadataRoute } from "next";

import { getSitemapBaseUrl } from "@/lib/siteUrl";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/cms/", "/api/"],
    },
    sitemap: `${getSitemapBaseUrl()}/sitemap.xml`,
  };
}
