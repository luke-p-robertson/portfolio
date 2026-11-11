import Image from "next/image";

import {
  IMAGE_QUALITY,
  sanityImageIntrinsicDimensions,
  urlForSanityImage,
  type SanityCropHotspotAsset,
} from "@/sanity/lib/sanityImageUrl";

import styles from "./SanityImage.module.scss";

type SanityImageProps = {
  image?: SanityCropHotspotAsset | null;
  /** `sizes` for the responsive srcset, e.g. "(max-width: 768px) 100vw, 50vw". */
  sizes: string;
  /** Cover a positioned parent (cropped around the hotspot) instead of sizing naturally. */
  fill?: boolean;
  /** Fetch early: the first image a visitor sees on a page (Next 16's `preload`). */
  preload?: boolean;
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
  alt,
  className,
}: SanityImageProps) {
  // The base URL carries the Studio crop; the loader sets the width per srcset entry.
  const src = urlForSanityImage(image, { width: 2560 });
  if (!image || !src) {
    return null;
  }

  const altText = image.alt?.trim() || alt || "";

  if (fill) {
    return (
      <Image
        className={[styles.cover, className].filter(Boolean).join(" ")}
        src={src}
        alt={altText}
        fill
        sizes={sizes}
        quality={IMAGE_QUALITY}
        preload={preload}
        style={{ objectPosition: hotspotPosition(image) }}
      />
    );
  }

  const { width, height } = sanityImageIntrinsicDimensions(image);

  return (
    <Image
      className={[styles.natural, className].filter(Boolean).join(" ")}
      src={src}
      alt={altText}
      width={width}
      height={height}
      sizes={sizes}
      quality={IMAGE_QUALITY}
      preload={preload}
    />
  );
}
