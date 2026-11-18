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

function thumbImage(media?: MediaData | null) {
  return media?.mediaType === "video" ? media.poster : media?.image;
}

/** A slide's own shape (a video's from its poster), for the phone scroll. */
function slideAspect(media?: MediaData | null): string {
  const { width, height } = sanityImageIntrinsicDimensions(thumbImage(media));
  return `${width} / ${height}`;
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
 * A project's case study. The headline fades in, holds, then fades to the slides.
 *
 * Desktop: the slides switch instantly one at a time and loop, with the info (scope,
 * credits, description) as the last one. Step with the arrow keys, the thumbnails, or by
 * clicking either half of the screen.
 *
 * Phones (Figma 2402:453): the same slides stack into one scrolling column, the info at the
 * end. The styles do the switch, so the page never renders the wrong layout first.
 *
 * Close, the title and Info live in the persistent site header, which this lends its title,
 * color and Info action: Info goes to the info, which turns it into Images (back to the
 * first slide).
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
  const [intro, setIntro] = useState<"showing" | "leaving" | "done">(
    headline ? "showing" : "done",
  );
  const infoRef = useRef<HTMLElement>(null);
  // Phones: true while the info at the end of the scroll is on screen.
  const [infoInView, setInfoInView] = useState(false);

  const show = useCallback(
    (next: number) => {
      if (next !== index) {
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
    if (isMobile) {
      infoRef.current?.scrollIntoView({ behavior: "smooth" });
    } else {
      show(infoIndex);
    }
  }, [infoIndex, isMobile, show]);

  const infoOpen = isMobile ? infoInView : infoIndex >= 0 && index === infoIndex;

  // Back to the start of the slides.
  const showImages = useCallback(() => {
    if (isMobile) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      show(0);
    }
  }, [isMobile, show]);

  // Phones: Info reads Images once the info has scrolled well into view.
  useEffect(() => {
    const info = infoRef.current;
    if (!isMobile || !info) {
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setInfoInView(Boolean(entry?.isIntersecting)),
      { rootMargin: "0px 0px -50% 0px" },
    );
    observer.observe(info);
    return () => observer.disconnect();
  }, [isMobile]);

  // Phones: scrolling while the headline shows skips it, so the slides are there to scroll.
  useEffect(() => {
    if (!isMobile || intro !== "showing") {
      return;
    }
    window.addEventListener("scroll", skipIntro, { passive: true, once: true });
    return () => window.removeEventListener("scroll", skipIntro);
  }, [intro, isMobile, skipIntro]);

  // Phones: a project always opens at the top of its scroll.
  useEffect(() => {
    if (isMobile) {
      window.scrollTo(0, 0);
    }
  }, [isMobile, project._id]);

  useProjectHeader({
    title: project.title ?? "",
    textColor: project.textColor,
    onInfo: infoIndex >= 0 ? showInfo : null,
    infoOpen,
    onImages: infoOpen ? showImages : null,
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
      if (!isMobile && (event.key === "ArrowRight" || event.key === "ArrowLeft")) {
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
  }, [go, close, isMobile]);

  const colors = {
    ...(project.backgroundColor?.trim()
      ? { "--project-background": project.backgroundColor.trim() }
      : {}),
    ...(project.textColor?.trim() ? { "--project-text": project.textColor.trim() } : {}),
  } as CSSProperties;

  const stageVisible = intro !== "showing";

  return (
    <div className={styles.root} style={colors}>
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
        {count > 1 && !isMobile ? (
          <>
            <button
              type="button"
              className={[styles.zone, styles.prev].join(" ")}
              onClick={() => go(-1)}
              aria-label="Previous slide"
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
          // Every image loads as soon as the project opens (in slide order, the first one
          // first), so clicking through never waits on one. Videos are heavier, so on desktop
          // only the current slide and its neighbors load them; the phone scroll has them all
          // (each plays only while on screen).
          const distance = Math.min(Math.abs(i - index), count - Math.abs(i - index));
          const isCurrent = i === index;
          const isVideo = item.kind === "media" && item.slide.media?.mediaType === "video";
          const mounted = !isVideo || distance <= 1 || isMobile;
          return (
            <section
              key={item.key}
              ref={item.kind === "info" ? infoRef : undefined}
              style={
                item.kind === "media"
                  ? ({ "--slide-aspect": slideAspect(item.slide.media) } as CSSProperties)
                  : undefined
              }
              className={[
                styles.slide,
                isCurrent ? styles.current : null,
                item.kind === "info" ? styles.infoSection : null,
              ]
                .filter(Boolean)
                .join(" ")}
              aria-hidden={!isMobile && !isCurrent}
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}`}
            >
              {mounted ? (
                item.kind === "media" ? (
                  <MediaSlide
                    slide={item.slide}
                    preload={i === 0}
                    active={(isCurrent || isMobile) && stageVisible}
                  />
                ) : (
                  <InfoSlide project={project} />
                )
              ) : null}
            </section>
          );
        })}
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
      eager
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
