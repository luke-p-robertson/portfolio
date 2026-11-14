import Image from "next/image";

import {
  IMAGE_QUALITY,
  sanityImageIntrinsicDimensions,
  urlForSanityImage,
  type SanityCropHotspotAsset,
} from "@/sanity/lib/sanityImageUrl";

import { ImagePreload } from "./ImagePreload";
import styles from "./SanityImage.module.scss";

type SanityImageProps = {
  image?: SanityCropHotspotAsset | null;
  /** `sizes` for the responsive srcset, e.g. "(max-width: 768px) 100vw, 50vw". */
  sizes: string;
  /** Cover a positioned parent (cropped around the hotspot) instead of sizing naturally. */
  fill?: boolean;
  /** Fetch early: the first image a visitor sees on a page (Next 16's `preload`). */
  preload?: boolean;
  /**
   * With `preload`: only preload at this media query, e.g. when a desktop and a mobile copy
   * of an image are both on the page and CSS shows one, so each screen fetches just its own.
   */
  preloadMedia?: string;
  alt?: string;
  className?: string;
};

/** Focal point from Sanity's hotspot, as a CSS `object-position`. */
function hotspotPosition(image: SanityCropHotspotAsset): string | undefined {
  const hotspot = image.hotspot as { x?: number; y?: number } | null | undefined;
  if (typeof hotspot?.x !== "number" || typeof hotspot?.y !== "number") {
    return undefined;
  }
  return `${hotspot.x * 100}% ${hotspot.y * 100}%`;
}

export function SanityImage({
  image,
  sizes,
  fill = false,
  preload = false,
  preloadMedia,
  alt,
  className,
}: SanityImageProps) {
  // The base URL carries the Studio crop; the loader sets the width per srcset entry.
  const src = urlForSanityImage(image, { width: 2560 });
  if (!image || !src) {
    return null;
  }

  const altText = image.alt?.trim() || alt || "";

  // Next's own preload has no media query, so a breakpoint-only preload is made here from
  // the same srcset the image will use. The image itself stays lazy, so the copy hidden at
  // the other breakpoint never downloads; the visible one picks up the preloaded file.
  const mediaPreload =
    preload && preloadMedia ? (
      <ImagePreload
        src={src}
        sizes={sizes}
        quality={IMAGE_QUALITY}
        media={preloadMedia}
        {...(fill ? {} : sanityImageIntrinsicDimensions(image))}
      />
    ) : null;
  const loadingProps = mediaPreload ? ({ fetchPriority: "high" } as const) : { preload };

  if (fill) {
    return (
      <>
        {mediaPreload}
        <Image
          className={[styles.cover, className].filter(Boolean).join(" ")}
          src={src}
          alt={altText}
          fill
          sizes={sizes}
          quality={IMAGE_QUALITY}
          {...loadingProps}
          style={{ objectPosition: hotspotPosition(image) }}
        />
      </>
    );
  }

  const { width, height } = sanityImageIntrinsicDimensions(image);

  return (
    <>
      {mediaPreload}
      <Image
        className={[styles.natural, className].filter(Boolean).join(" ")}
        src={src}
        alt={altText}
        width={width}
        height={height}
        sizes={sizes}
        quality={IMAGE_QUALITY}
        {...loadingProps}
      />
    </>
  );
}
