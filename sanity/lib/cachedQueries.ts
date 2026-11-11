import { unstable_cache } from "next/cache";
import { cache } from "react";
import type { PortableTextBlock } from "@portabletext/types";

import { sanityClient } from "./client";
import {
  HOMEPAGE_QUERY,
  PROFILE_QUERY,
  PROJECT_INDEX_QUERY,
  PROJECT_QUERY,
  PROJECT_SLUGS_QUERY,
  SITE_SETTINGS_QUERY,
} from "./queries";
import type { SanityCropHotspotAsset } from "./sanityImageUrl";
import type { SanitySeo } from "./seoMetadata";

export type MediaData = {
  mediaType?: "image" | "video" | null;
  image?: SanityCropHotspotAsset | null;
  poster?: SanityCropHotspotAsset | null;
  video?: { asset?: { _id?: string | null; url?: string | null } | null } | null;
};

export type FeatureData = {
  _key: string;
  layout?: "single" | "pair" | null;
  title?: string | null;
  slug?: string | null;
  media?: MediaData | null;
  secondMedia?: MediaData | null;
  mobileMedia?: MediaData | null;
};

export type HomepageData = {
  features?: FeatureData[] | null;
  seo?: SanitySeo;
};

export type ProjectCard = {
  _id: string;
  title?: string | null;
  slug?: string | null;
  discipline?: string | null;
  categories?: string[] | null;
  thumbnail?: SanityCropHotspotAsset | null;
  /** First media slide (its poster for a video), when there's no index image. */
  fallbackImage?: SanityCropHotspotAsset | null;
};

export type CategoryData = {
  title?: string | null;
  slug?: string | null;
};

export type ProjectIndexData = {
  page?: {
    projects?: ProjectCard[] | null;
    seo?: SanitySeo;
  } | null;
  categories?: CategoryData[] | null;
};

export type SlideData = {
  _key: string;
  media?: MediaData | null;
};

export type CreditData = {
  _key: string;
  role?: string | null;
  names?: string[] | null;
};

export type ProjectData = {
  _id: string;
  title?: string | null;
  slug?: string | null;
  headline?: string | null;
  backgroundColor?: string | null;
  textColor?: string | null;
  slides?: SlideData[] | null;
  scope?: string[] | null;
  credits?: CreditData[] | null;
  description?: PortableTextBlock[] | null;
  seo?: SanitySeo;
};

export type ProfileLine = {
  _key: string;
  label?: string | null;
  href?: string | null;
};

export type ProfileData = {
  sections?: { _key: string; heading?: string | null; body?: string | null }[] | null;
  columns?:
    | {
        _key: string;
        details?: { _key: string; heading?: string | null; lines?: ProfileLine[] | null }[] | null;
      }[]
    | null;
  seo?: SanitySeo;
};

export type SiteSettingsData = {
  siteCreditLink?: string | null;
  seo?: SanitySeo;
};

export const SANITY_CACHE_TAG = "sanity";

/** Bump when GROQ projections change so `unstable_cache` does not serve stale shapes. */
const SANITY_CACHE_KEY_VERSION = "4";

async function fetchSanity<T>(
  query: string,
  params?: Record<string, unknown>,
): Promise<T | null> {
  if (!sanityClient) {
    return null;
  }

  // In development, skip the Next data cache so published content shows immediately
  // (the Sanity → /api/revalidate webhook can't reach localhost to clear it).
  if (process.env.NODE_ENV !== "production") {
    return sanityClient.fetch<T>(query, params ?? {});
  }

  const paramKey = JSON.stringify(params ?? {});

  return unstable_cache(
    () => sanityClient!.fetch<T>(query, params ?? {}),
    [SANITY_CACHE_TAG, SANITY_CACHE_KEY_VERSION, query, paramKey],
    { tags: [SANITY_CACHE_TAG], revalidate: 60 },
  )();
}

export const getHomepageData = cache(async () => {
  return fetchSanity<HomepageData>(HOMEPAGE_QUERY);
});

export const getProjectIndexData = cache(async () => {
  return fetchSanity<ProjectIndexData>(PROJECT_INDEX_QUERY);
});

export const getProjectData = cache(async (slug: string) => {
  return fetchSanity<ProjectData>(PROJECT_QUERY, { slug });
});

export const getProjectSlugs = cache(async () => {
  return (await fetchSanity<string[]>(PROJECT_SLUGS_QUERY)) ?? [];
});

export const getProfileData = cache(async () => {
  return fetchSanity<ProfileData>(PROFILE_QUERY);
});

export const getSiteSettings = cache(async () => {
  return fetchSanity<SiteSettingsData>(SITE_SETTINGS_QUERY);
});
