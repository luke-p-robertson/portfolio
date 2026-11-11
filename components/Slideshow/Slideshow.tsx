"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";

import { BlockContent } from "@/components/BlockContent/BlockContent";
import { Media } from "@/components/Media/Media";
import { SanityImage } from "@/components/SanityImage/SanityImage";
import { useProjectHeader } from "@/components/SiteHeader/HeaderContext";
import { useCloseProject } from "@/components/SiteHeader/useCloseProject";
import { FADE_MS, PROJECT_INTRO_MS } from "@/lib/motion";
import { STUDIO_NAME } from "@/lib/navigation";
import { useIsMobile } from "@/lib/useIsMobile";
import type { MediaData, ProjectData, SlideData } from "@/sanity/lib/cachedQueries";
import { sanityImageIntrinsicDimensions } from "@/sanity/lib/sanityImageUrl";

import styles from "./Slideshow.module.scss";

type SlideshowProps = {
  project: ProjectData;
};

type Item = { kind: "media"; key: string; slide: SlideData } | { kind: "info"; key: string };

/** A swipe shorter than this (px) is treated as a tap. */
const SWIPE_THRESHOLD = 40;

function thumbImage(media?: MediaData | null) {
  return media?.mediaType === "video" ? media.poster : media?.image;
}

/**
 * Slides fill the height between header and thumbnails (the viewport less 100px), so on
 * desktop an image is shown at that height × its aspect ratio wide (or narrower, on a
 * narrow screen) — not the full viewport width. Phones show slides full width.
 */
function slideSizes(media?: MediaData | null): string {
  const { width, height } = sanityImageIntrinsicDimensions(media?.image);
  const ratio = width / height;
  return `(max-width: 768px) 100vw, calc((100vh - 100px) * ${ratio.toFixed(3)})`;
}

function hasInfo(project: ProjectData) {
  return Boolean(
    project.scope?.length || project.credits?.length || project.description?.length,
  );
}

/**
 * A project's case study. The headline fades in, holds, then fades to the first slide; the
 * slides crossfade one at a time and loop, with the info (scope, credits, description) as
 * the last one. Step with the arrow keys, the thumbnails, by clicking either half of the
 * screen, or on phones by tapping (forward) or swiping. Close, the title and Info live in
 * the persistent site header, which this lends its title, colour and Info action.
 */
export function Slideshow({ project }: SlideshowProps) {
  const close = useCloseProject();
  const isMobile = useIsMobile();
  const items: Item[] = [
    ...(project.slides ?? []).flatMap((slide) =>
      slide.media?.mediaType ? [{ kind: "media" as const, key: slide._key, slide }] : [],
    ),
    ...(hasInfo(project) ? [{ kind: "info" as const, key: "info" }] : []),
  ];
  const count = items.length;
  const infoIndex = items.findIndex((item) => item.kind === "info");
  const headline = project.headline?.trim();

  const [index, setIndex] = useState(0);
  const [previous, setPrevious] = useState<number | null>(null);
  const [intro, setIntro] = useState<"showing" | "leaving" | "done">(
    headline ? "showing" : "done",
  );
  const touchStart = useRef<number | null>(null);

  const show = useCallback(
    (next: number) => {
      if (next !== index) {
        setPrevious(index);
        setIndex(next);
      }
    },
    [index],
  );

  const skipIntro = useCallback(() => {
    setIntro((phase) => (phase === "showing" ? "leaving" : phase));
  }, []);

  const go = useCallback(
    (step: number) => {
      if (intro !== "done") {
        skipIntro();
        return;
      }
      if (count > 0) {
        show((index + step + count) % count);
      }
    },
    [count, index, intro, show, skipIntro],
  );

  const showInfo = useCallback(() => {
    setIntro("done");
    show(infoIndex);
  }, [infoIndex, show]);

  useProjectHeader({
    title: project.title ?? "",
    textColor: project.textColor,
    onInfo: infoIndex >= 0 ? showInfo : null,
  });

  // Headline: hold, fade out (crossfading to the first slide), then unmount.
  useEffect(() => {
    if (intro === "showing") {
      const timer = window.setTimeout(() => setIntro("leaving"), PROJECT_INTRO_MS);
      return () => window.clearTimeout(timer);
    }
    if (intro === "leaving") {
      const timer = window.setTimeout(() => setIntro("done"), FADE_MS);
      return () => window.clearTimeout(timer);
    }
  }, [intro]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
        // A key press puts whatever was last clicked (a slide half, a thumbnail, Info) into
        // keyboard-focus mode and draws its focus ring; the arrows shouldn't, so let go of it.
        // Tabbing through the controls still shows focus as normal.
        const focused = document.activeElement;
        if (focused instanceof HTMLElement && focused !== document.body) {
          focused.blur();
        }
        go(event.key === "ArrowRight" ? 1 : -1);
      } else if (event.key === "Escape") {
        close();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, close]);

  const onTouchStart = (event: React.TouchEvent) => {
    touchStart.current = event.touches[0]?.clientX ?? null;
  };

  const onTouchEnd = (event: React.TouchEvent) => {
    const start = touchStart.current;
    const end = event.changedTouches[0]?.clientX;
    touchStart.current = null;
    if (start === null || end === undefined) {
      return;
    }
    const delta = end - start;
    if (Math.abs(delta) >= SWIPE_THRESHOLD) {
      go(delta < 0 ? 1 : -1);
    }
  };

  const colors = {
    ...(project.backgroundColor?.trim()
      ? { "--project-background": project.backgroundColor.trim() }
      : {}),
    ...(project.textColor?.trim() ? { "--project-text": project.textColor.trim() } : {}),
  } as CSSProperties;

  const stageVisible = intro !== "showing";

  return (
    <div
      className={styles.root}
      style={colors}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <h1 className={styles.hidden}>
        {STUDIO_NAME} for {project.title}
      </h1>

      {intro !== "done" && headline ? (
        <button
          type="button"
          className={[styles.headline, intro === "leaving" ? styles.headlineLeaving : null]
            .filter(Boolean)
            .join(" ")}
          onClick={skipIntro}
        >
          <span>{headline}</span>
        </button>
      ) : null}

      <div className={[styles.stage, stageVisible ? null : styles.stageHidden].filter(Boolean).join(" ")}>
        {count > 1 ? (
          <>
            <button
              type="button"
              className={[styles.zone, styles.prev].join(" ")}
              // Phones: a tap anywhere moves forward; swiping goes either way.
              onClick={() => go(isMobile ? 1 : -1)}
              aria-label={isMobile ? "Next slide" : "Previous slide"}
            />
            <button
              type="button"
              className={[styles.zone, styles.next].join(" ")}
              onClick={() => go(1)}
              aria-label="Next slide"
            />
          </>
        ) : null}

        {items.map((item, i) => {
          // Only the current slide, the one fading out, and the neighbours load media.
          const distance = Math.min(Math.abs(i - index), count - Math.abs(i - index));
          const isCurrent = i === index;
          const mounted = distance <= 1 || i === previous;
          return (
            <section
              key={item.key}
              className={[
                styles.slide,
                isCurrent ? styles.current : null,
                item.kind === "info" ? styles.infoSection : null,
              ]
                .filter(Boolean)
                .join(" ")}
              aria-hidden={!isCurrent}
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}`}
            >
              {mounted ? (
                item.kind === "media" ? (
                  <MediaSlide
                    slide={item.slide}
                    preload={i === 0}
                    active={isCurrent && stageVisible}
                  />
                ) : (
                  <InfoSlide project={project} />
                )
              ) : null}
            </section>
          );
        })}


        {count > 0 ? (
          <p className={styles.counter} aria-live="polite">
            {index + 1}/{count}
          </p>
        ) : null}
      </div>

      {/* Outside the stage: visible (all dimmed) while the intro card shows, as in the design. */}
      <nav className={styles.thumbs} aria-label="Slides">
        {items.map((item, i) => {
          if (item.kind !== "media") {
            return null;
          }
          const image = thumbImage(item.slide.media);
          if (!image?.asset) {
            return null;
          }
          return (
            <button
              key={item.key}
              type="button"
              className={styles.thumb}
              aria-current={stageVisible && i === index}
              aria-label={`Slide ${i + 1}`}
              onClick={() => {
                skipIntro();
                show(i);
              }}
            >
              <SanityImage image={image} sizes="80px" className={styles.thumbImage} />
            </button>
          );
        })}
      </nav>
    </div>
  );
}

function MediaSlide({
  slide,
  preload,
  active,
}: {
  slide: SlideData;
  preload: boolean;
  active: boolean;
}) {
  return (
    <Media
      media={slide.media}
      className={styles.media}
      fit="contain"
      sizes={slideSizes(slide.media)}
      preload={preload}
      active={active}
    />
  );
}

function InfoSlide({ project }: { project: ProjectData }) {
  return (
    <div className={styles.infoSlide}>
      {project.scope?.length ? (
        <dl className={styles.scope}>
          <dt className={styles.label}>Scope</dt>
          {project.scope.map((item) => (
            <dd key={item}>{item}</dd>
          ))}
        </dl>
      ) : null}
      {project.credits?.length ? (
        <dl className={styles.credits}>
          {project.credits.map((credit) => (
            <div key={credit._key}>
              <dt className={styles.label}>{credit.role}</dt>
              {credit.names?.map((name) => (
                <dd key={name}>{name}</dd>
              ))}
            </div>
          ))}
        </dl>
      ) : null}
      <div className={styles.description}>
        <BlockContent value={project.description} />
      </div>
    </div>
  );
}
