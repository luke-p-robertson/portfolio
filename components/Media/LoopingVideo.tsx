"use client";

import { useEffect, useRef } from "react";

type LoopingVideoProps = {
  src: string;
  poster?: string;
  className?: string;
  /** False while the video's slide isn't the current one; it pauses and rewinds. */
  active?: boolean;
  /** Start downloading the video straight away (the first thing on a page). */
  eager?: boolean;
};

/**
 * Silent, looping video treated like an image: no controls, plays only while it's on
 * screen (and its slide is current), pauses otherwise. `muted` is set on the element via
 * the ref because React doesn't reliably render the attribute, and browsers only allow
 * autoplay for muted video.
 */
export function LoopingVideo({
  src,
  poster,
  className,
  active = true,
  eager = false,
}: LoopingVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }
    video.muted = true;

    if (!active) {
      video.pause();
      video.currentTime = 0;
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          void video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [src, active]);

  return (
    <video
      ref={videoRef}
      className={className}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload={eager ? "auto" : "metadata"}
      aria-hidden
    />
  );
}
