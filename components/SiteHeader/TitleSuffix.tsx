"use client";

import { useState } from "react";

import styles from "./SiteHeader.module.scss";

/**
 * " for <project>" after the studio name. The whole title stays centred on the page: the
 * suffix opens its width as it fades in (and closes as it fades out), so the name glides
 * aside rather than jumping.
 */
export function TitleSuffix({ title }: { title: string | null }) {
  // Keep the last title so it can fade out after the project page has gone.
  const [shown, setShown] = useState(title);
  if (title && title !== shown) {
    setShown(title);
  }
  const open = Boolean(title);

  return (
    <span
      className={[styles.collapse, open ? styles.open : null].filter(Boolean).join(" ")}
      aria-hidden={!open}
    >
      <span>
        <span className={styles.space}> </span>for {shown}
      </span>
    </span>
  );
}
