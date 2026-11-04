import Image from "next/image";

import {
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
  priority?: boolean;
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
  priority = false,
  alt,
  className,
}: SanityImageProps) {
  const src = urlForSanityImage(image, { width: 2560, quality: 100 });
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
        quality={100}
        priority={priority}
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
      quality={100}
      priority={priority}
    />
  );
}
