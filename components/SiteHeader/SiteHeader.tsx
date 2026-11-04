"use client";

import Link from "next/link";
import { useCallback, useState } from "react";

import { Overlay, overlayItemClass } from "@/components/Overlay/Overlay";
import { STUDIO_NAME } from "@/lib/navigation";

import styles from "./SiteHeader.module.scss";

type SiteHeaderProps = {
  /** Desktop: shown after "Projects" (the index filter). */
  desktopExtra?: React.ReactNode;
  /** Mobile: the right-hand slot (the index's "Filter"). */
  mobileRight?: React.ReactNode;
  /** Lift the header above a page's own overlay (the mobile filter) and drop the blend. */
  raised?: boolean;
};

/**
 * Projects · Luke Robertson Studio · Profile on desktop; Menu · Luke Robertson Studio on
 * mobile, where "Menu" opens a full-screen list of the two pages.
 */
export function SiteHeader({ desktopExtra, mobileRight, raised = false }: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <>
      <header className={[styles.header, menuOpen || raised ? styles.solid : styles.blend].join(" ")}>
        <div className={styles.left}>
          <span className={styles.desktopOnly}>
            <Link href="/projects">Projects</Link>
          </span>
          {desktopExtra ? <span className={styles.desktopOnly}>{desktopExtra}</span> : null}
          <button
            type="button"
            className={styles.mobileOnly}
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
          >
            {menuOpen ? "Close" : "Menu"}
          </button>
        </div>
        <Link href="/" className={styles.center} onClick={closeMenu}>
          {STUDIO_NAME}
        </Link>
        <div className={styles.right}>
          <span className={styles.desktopOnly}>
            <Link href="/profile">Profile</Link>
          </span>
          {mobileRight && !menuOpen ? (
            <span className={styles.mobileOnly}>{mobileRight}</span>
          ) : null}
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
