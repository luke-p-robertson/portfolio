import { preload as preloadResource } from "react-dom";

import { SanityImage } from "@/components/SanityImage/SanityImage";
import type { MediaData } from "@/sanity/lib/cachedQueries";
import { urlForSanityImage } from "@/sanity/lib/sanityImageUrl";

import { LoopingVideo } from "./LoopingVideo";
import styles from "./Media.module.scss";

type MediaProps = {
  media?: MediaData | null;
  sizes: string;
  /** Sets the box size and aspect ratio; the image or video fills it. */
  className?: string;
  /** `cover` crops to the box (default); `contain` shows the whole frame. */
  fit?: "cover" | "contain";
  /** Fetch early: the first image a visitor sees on a page (a video loads in full). */
  preload?: boolean;
  /** With `preload`: only at this media query (see SanityImage). */
  preloadMedia?: string;
  /** Videos only: false pauses it (a slide that isn't current). */
  active?: boolean;
};

/** An image or looping video filling a sized box. */
export function Media({
  media,
  sizes,
  className,
  fit = "cover",
  preload,
  preloadMedia,
  active,
}: MediaProps) {
  const boxClass = [styles.box, className].filter(Boolean).join(" ");
  const fitClass = fit === "contain" ? styles.contain : undefined;

  if (media?.mediaType === "video") {
    const src = media.video?.asset?.url;
    if (!src) {
      return null;
    }
    const poster = urlForSanityImage(media.poster, { width: 1920 }) ?? undefined;
    if (preload && poster) {
      preloadResource(poster, {
        as: "image",
        media: preloadMedia,
        fetchPriority: "high",
      });
    }
    return (
      <div className={boxClass}>
        <LoopingVideo
          className={[styles.video, fitClass].filter(Boolean).join(" ")}
          src={src}
          poster={poster}
          active={active}
          eager={preload}
        />
      </div>
    );
  }

  if (!media?.image?.asset) {
    return null;
  }

  return (
    <div className={boxClass}>
      <SanityImage
        image={media.image}
        sizes={sizes}
        fill
        preload={preload}
        preloadMedia={preloadMedia}
        className={fitClass}
      />
    </div>
  );
}
