import type { Metadata } from "next";

import { getSiteSettings } from "./cachedQueries";
import type { SanityCropHotspotAsset } from "./sanityImageUrl";
import { urlForSanityImage } from "./sanityImageUrl";

/** Recommended OG width; Sanity serves WebP/AVIF via `auto=format`. */
const OPEN_GRAPH_IMAGE_WIDTH = 1200;

const DEFAULT_SITE_TITLE = "Luke Robertson Studio";
const DEFAULT_SITE_DESCRIPTION =
  "Luke Robertson Studio is a Paris-based creative consultancy working across identity, campaigns and experiences.";

/** Shape returned from GROQ for `seo` object fields. */
export type SanitySeo = {
  title?: string | null;
  description?: string | null;
  openGraphImage?: SanityCropHotspotAsset | null;
} | null;

function trimmed(value: string | null | undefined): string | undefined {
  const text = value?.trim();
  return text || undefined;
}

function openGraphImageUrl(seo: SanitySeo): string | undefined {
  const url = urlForSanityImage(seo?.openGraphImage, {
    width: OPEN_GRAPH_IMAGE_WIDTH,
    fit: "max",
  });
  return url ?? undefined;
}

export function metadataFromSanitySeo(
  seo: SanitySeo,
  fallback: { title: string; description?: string | null },
  options?: { siteSeo?: SanitySeo | null },
): Metadata {
  const siteSeo = options?.siteSeo;
  const title =
    trimmed(seo?.title) ||
    trimmed(fallback.title) ||
    trimmed(siteSeo?.title) ||
    DEFAULT_SITE_TITLE;
  const description =
    trimmed(seo?.description) ||
    trimmed(fallback.description) ||
    trimmed(siteSeo?.description) ||
    undefined;
  const imageUrl =
    openGraphImageUrl(seo) ?? openGraphImageUrl(siteSeo ?? null);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      ...(imageUrl ? { images: [{ url: imageUrl }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(imageUrl ? { images: [imageUrl] } : {}),
    },
  };
}

export async function buildPageMetadata(
  seo: SanitySeo,
  fallback: { title: string; description?: string | null },
): Promise<Metadata> {
  const site = await getSiteSettings();
  return metadataFromSanitySeo(seo, fallback, { siteSeo: site?.seo ?? null });
}

export async function buildSiteMetadata(): Promise<Metadata> {
  const site = await getSiteSettings();
  return metadataFromSanitySeo(site?.seo ?? null, {
    title: DEFAULT_SITE_TITLE,
    description: DEFAULT_SITE_DESCRIPTION,
  });
}
