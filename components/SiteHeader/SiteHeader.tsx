"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useState, type CSSProperties } from "react";

import { Overlay, overlayItemClass } from "@/components/Overlay/Overlay";
import { STUDIO_NAME, STUDIO_SHORT_NAME } from "@/lib/navigation";
import { useIsMobile } from "@/lib/useIsMobile";

import { Crossfade } from "./Crossfade";
import { useHeader } from "./HeaderContext";
import styles from "./SiteHeader.module.scss";
import { TitleSuffix } from "./TitleSuffix";
import { useCloseProject } from "./useCloseProject";

/**
 * The one site header, kept in the site layout so it never disappears between pages.
 * "Luke Robertson Studio" stays put; the slots that change by page crossfade:
 *  - desktop: Projects (+ Filter on the index) ↔ Close on the left, Profile ↔ Info on the
 *    right, and "for <project>" after the name on a project, the whole title centred;
 *  - mobile: Menu ↔ Close on the left, Filter (index) or Info (project) on the right.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const { project, filter } = useHeader();
  const isMobile = useIsMobile();
  const closeProject = useCloseProject();
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  const onProject = pathname.startsWith("/projects/");
  const onIndex = pathname === "/projects";
  const showFilter = onIndex && filter && filter.options.length > 1 ? filter : null;
  const raised = menuOpen || Boolean(showFilter?.open && isMobile);
  const projectColor = onProject ? project?.textColor?.trim() : null;

  const headerClass = [
    styles.header,
    raised ? styles.solid : onProject ? styles.project : styles.blend,
  ].join(" ");

  return (
    <>
      <header
        className={headerClass}
        style={projectColor ? ({ "--header-color": projectColor } as CSSProperties) : undefined}
      >
        <div className={styles.left}>
          <Crossfade itemKey={onProject ? "close" : "projects"} className={styles.desktopOnly}>
            {onProject ? (
              <button type="button" onClick={closeProject}>
                Close
              </button>
            ) : (
              <Link href="/projects">Projects</Link>
            )}
          </Crossfade>
          <Crossfade
            itemKey={menuOpen ? "menu-close" : onProject ? "close" : "menu"}
            className={styles.mobileOnly}
          >
            {menuOpen ? (
              <button type="button" onClick={closeMenu} aria-expanded>
                Close
              </button>
            ) : onProject ? (
              <button type="button" onClick={closeProject}>
                Close
              </button>
            ) : (
              <button type="button" onClick={() => setMenuOpen(true)} aria-expanded={false}>
                Menu
              </button>
            )}
          </Crossfade>
        </div>

        <Crossfade
          itemKey={showFilter ? "filter" : "none"}
          className={`${styles.filterSlot} ${styles.desktopOnly}`}
        >
          {showFilter ? (
            <span className={styles.filter}>
              <button type="button" onClick={showFilter.toggle} aria-expanded={showFilter.open}>
                Filter
              </button>
              {showFilter.open ? (
                <span className={styles.options}>
                  {showFilter.options.map((option) => (
                    <button
                      key={option.slug || "all"}
                      type="button"
                      className={styles.option}
                      aria-pressed={option.slug === showFilter.value}
                      onClick={() => showFilter.choose(option.slug)}
                    >
                      {option.title}
                    </button>
                  ))}
                </span>
              ) : null}
            </span>
          ) : null}
        </Crossfade>

        <div className={[styles.center, onProject ? styles.onProject : null].filter(Boolean).join(" ")}>
          <Link href="/" onClick={closeMenu} aria-label={STUDIO_NAME}>
            <span className={`${styles.collapse} ${styles.nameFull}`}>
              <span>{STUDIO_NAME}</span>
            </span>
            <span className={`${styles.collapse} ${styles.nameShort}`} aria-hidden>
              <span>{STUDIO_SHORT_NAME}</span>
            </span>
          </Link>
          <TitleSuffix title={onProject && project?.title ? project.title : null} />
        </div>

        <div className={styles.right}>
          <Crossfade
            itemKey={onProject ? (project?.onInfo ? "info" : "none") : "profile"}
            className={styles.desktopOnly}
          >
            {onProject ? (
              project?.onInfo ? (
                <button type="button" onClick={project.onInfo}>
                  Info
                </button>
              ) : null
            ) : (
              <Link href="/profile">Profile</Link>
            )}
          </Crossfade>
          <Crossfade
            itemKey={
              menuOpen
                ? "none"
                : showFilter
                  ? showFilter.open
                    ? "filter-close"
                    : "filter"
                  : onProject && project?.onInfo
                    ? "info"
                    : "none"
            }
            className={styles.mobileOnly}
          >
            {menuOpen ? null : showFilter ? (
              <button type="button" onClick={showFilter.toggle} aria-expanded={showFilter.open}>
                {showFilter.open ? "Close" : "Filter"}
              </button>
            ) : onProject && project?.onInfo ? (
              <button type="button" onClick={project.onInfo}>
                Info
              </button>
            ) : null}
          </Crossfade>
        </div>
      </header>
      {menuOpen ? (
        <Overlay label="Menu" onClose={closeMenu}>
          <Link href="/profile" className={overlayItemClass} onClick={closeMenu}>
            Profile
          </Link>
          <Link href="/projects" className={overlayItemClass} onClick={closeMenu}>
            Projects
          </Link>
        </Overlay>
      ) : null}
    </>
  );
}
