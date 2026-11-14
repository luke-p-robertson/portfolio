"use client";

import { getImageProps } from "next/image";
import { preload } from "react-dom";

type ImagePreloadProps = {
  src: string;
  sizes: string;
  quality: number;
  /** Only preload at this media query. */
  media: string;
  /** Intrinsic size, for an image that isn't `fill`. */
  width?: number;
  height?: number;
};

/**
 * A `<link rel=preload>` for an image at one breakpoint only, built from the same srcset the
 * image itself renders, so the browser reuses the file. Next's own `preload` has no media
 * query. A client component because the custom image loader is one; it still renders on the
 * server, so the link is in the first HTML.
 */
export function ImagePreload({ src, sizes, quality, media, width, height }: ImagePreloadProps) {
  const { props } = getImageProps({
    src,
    alt: "",
    sizes,
    quality,
    ...(width && height ? { width, height } : { fill: true }),
  });
  preload(props.src, {
    as: "image",
    imageSrcSet: props.srcSet,
    imageSizes: props.sizes,
    media,
    fetchPriority: "high",
  });
  return null;
}
