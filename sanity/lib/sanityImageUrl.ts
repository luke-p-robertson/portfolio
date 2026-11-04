import { createImageUrlBuilder } from "@sanity/image-url";

import { SANITY_PROJECT_ID, SANITY_DATASET } from "./projectId";

export type SanityCropHotspotAsset = {
  alt?: string | null;
  crop?: Record<string, unknown> | null;
  hotspot?: Record<string, unknown> | null;
  asset?: {
    _id?: string | null;
    url?: string | null;
    metadata?: {
      dimensions?: { width?: number; height?: number } | null;
    } | null;
  } | null;
};

function getSanityProjectId(): string | null {
  return SANITY_PROJECT_ID || null;
}

function getSanityDataset(): string {
  return SANITY_DATASET;
}

export function sanityImageUrlBuilder(): ReturnType<typeof createImageUrlBuilder> | null {
  const projectId = getSanityProjectId();
  if (!projectId) {
    return null;
  }
  return createImageUrlBuilder({
    projectId,
    dataset: getSanityDataset(),
  });
}

/** CDN URL from a Sanity image object (references `asset._id`). */
export function urlForSanityImage(
  item: SanityCropHotspotAsset | null | undefined,
  options: {
    width: number;
    height?: number;
    fit?: "crop" | "max" | "clip" | "fill" | "scale" | "min";
    quality?: number;
  },
): string | null {
  if (!item) {
    return null;
  }
  const ref = item.asset?._id?.trim();
  if (!ref) {
    return item.asset?.url?.trim() ?? null;
  }
  const builder = sanityImageUrlBuilder();
  const b =
    builder
      ?.image({
        _type: "image",
        asset: { _type: "reference", _ref: ref },
        crop: item.crop ?? undefined,
        hotspot: item.hotspot ?? undefined,
      })
      .width(options.width)
      .fit(options.fit ?? "max")
      .auto("format") ?? null;
  let chain = options.height !== undefined ? b?.height(options.height) : b;
  chain = chain?.quality(options.quality ?? 100);
  const url = chain?.url();
  return url?.trim() ?? item.asset?.url?.trim() ?? null;
}

export function sanityImageIntrinsicDimensions(item: SanityCropHotspotAsset | null | undefined): {
  width: number;
  height: number;
} {
  const w = item?.asset?.metadata?.dimensions?.width;
  const h = item?.asset?.metadata?.dimensions?.height;
  if (typeof w === "number" && w > 0 && typeof h === "number" && h > 0) {
    // A Studio crop changes the rendered aspect ratio, so size by the cropped area.
    const crop = item?.crop as
      | { top?: number; bottom?: number; left?: number; right?: number }
      | null
      | undefined;
    const keptWidth = 1 - (crop?.left ?? 0) - (crop?.right ?? 0);
    const keptHeight = 1 - (crop?.top ?? 0) - (crop?.bottom ?? 0);
    return {
      width: Math.round(w * keptWidth),
      height: Math.round(h * keptHeight),
    };
  }
  return { width: 1600, height: 1200 };
}
