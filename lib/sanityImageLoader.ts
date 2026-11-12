"use client";

import { IMAGE_QUALITY } from "@/sanity/lib/sanityImageUrl";

/**
 * next/image loader (next.config.ts `images.loaderFile`): every image is already a Sanity
 * CDN URL (with any Studio crop), and Sanity resizes, re-encodes (AVIF/WebP by browser)
 * and caches it at the edge. So images go straight to Sanity at the width the browser
 * picked from `sizes`, encoded once — rather than through Vercel's optimizer as well.
 */
export default function sanityImageLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}): string {
  const url = new URL(src);
  url.searchParams.set("w", String(width));
  url.searchParams.set("q", String(quality ?? IMAGE_QUALITY));
  url.searchParams.set("auto", "format");
  url.searchParams.set("fit", "max");
  return url.toString();
}
