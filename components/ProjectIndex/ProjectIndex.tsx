"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";

import { Overlay, overlayOptionClass } from "@/components/Overlay/Overlay";
import { Media } from "@/components/Media/Media";
import { SanityImage } from "@/components/SanityImage/SanityImage";
import { useFilterHeader } from "@/components/SiteHeader/HeaderContext";
import { useIsMobile } from "@/lib/useIsMobile";
import type { CategoryData, ProjectCard } from "@/sanity/lib/cachedQueries";

import styles from "./ProjectIndex.module.scss";

type ProjectIndexProps = {
  projects: ProjectCard[];
  categories: CategoryData[];
  /** From `?filter=` so a filtered view can be linked to. */
  initialFilter?: string | null;
};

const ALL = "";

/** The Projects page: a 3-column (mobile: 2-column) index with a category filter. */
export function ProjectIndex({ projects, categories, initialFilter }: ProjectIndexProps) {
  const options = useMemo(
    () => [
      { title: "All", slug: ALL },
      ...categories.flatMap((c) => (c.slug && c.title ? [{ title: c.title, slug: c.slug }] : [])),
    ],
    [categories],
  );
  const [filter, setFilter] = useState(
    options.some((o) => o.slug === initialFilter) ? (initialFilter ?? ALL) : ALL,
  );
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const isMobile = useIsMobile();

  const choose = useCallback((slug: string) => {
    setFilter(slug);
    setOpen(false);
    const url = new URL(window.location.href);
    if (slug) {
      url.searchParams.set("filter", slug);
    } else {
      url.searchParams.delete("filter");
    }
    window.history.replaceState(window.history.state, "", url);
  }, []);
  const toggle = useCallback(() => setOpen((o) => !o), []);

  // The persistent header draws the "Filter" control from this.
  const filterHeader = useMemo(
    () => (options.length > 1 ? { options, value: filter, open, toggle, setOpen, choose } : null),
    [options, filter, open, toggle, choose],
  );
  useFilterHeader(filterHeader);

  const visible = filter
    ? projects.filter((p) => p.categories?.includes(filter))
    : projects;

  const optionButtons = (className?: string) =>
    options.map((option) => (
      <button
        key={option.slug || "all"}
        type="button"
        className={className}
        aria-pressed={option.slug === filter}
        onClick={() => choose(option.slug)}
      >
        {option.title}
      </button>
    ));

  return (
    <>
      <main className={styles.page}>
        {/* Keyed by filter so a new selection fades in again from the first card. */}
        <ul
          key={filter || "all"}
          className={[styles.grid, open && !isMobile ? styles.dimmed : null]
            .filter(Boolean)
            .join(" ")}
        >
          {visible.map((project, i) => {
            const thumbnail = project.thumbnail;
            const hasThumbnail =
              thumbnail?.mediaType === "video"
                ? Boolean(thumbnail.video?.asset?.url)
                : Boolean(thumbnail?.image?.asset);
            return (
              <li
                key={project._id}
                className={styles.card}
                style={{ "--i": i } as React.CSSProperties}
              >
                <Link href={`/projects/${project.slug}`}>
                  {hasThumbnail ? (
                    // A video loops silently, paused while it's off screen.
                    <Media
                      media={thumbnail}
                      className={styles.image}
                      sizes="(max-width: 768px) 36vw, 24vw"
                      preload={i < 3}
                    />
                  ) : (
                    <div className={styles.image}>
                      <SanityImage
                        image={project.fallbackImage}
                        alt={project.title ?? ""}
                        fill
                        sizes="(max-width: 768px) 36vw, 24vw"
                        preload={i < 3}
                      />
                    </div>
                  )}
                  <span className={styles.label}>
                    {project.title}
                    {project.discipline ? (
                      <span className={styles.discipline}>{project.discipline}</span>
                    ) : null}
                  </span>
                </Link>
              </li>
            );
          })}
          {visible.length === 0 ? (
            <li className={styles.empty}>No projects in this category yet.</li>
          ) : null}
        </ul>
      </main>
      {open && isMobile ? (
        <Overlay label="Filter" onClose={close}>
          {optionButtons(overlayOptionClass)}
        </Overlay>
      ) : null}
    </>
  );
}
