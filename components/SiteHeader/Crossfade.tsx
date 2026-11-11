"use client";

import { useEffect, useState } from "react";

import { FADE_MS } from "@/lib/motion";

import styles from "./SiteHeader.module.scss";

type Shown = { key: string; node: React.ReactNode };

type CrossfadeProps = {
  /** Identifies what's shown; a new key fades the old content out and the new in. */
  itemKey: string;
  children: React.ReactNode;
  className?: string;
};

/**
 * A header slot that crossfades when its content changes (Projects ↔ Close, Profile ↔ Info)
 * and otherwise stays put. Old and new content overlap in one grid cell while they fade.
 */
export function Crossfade({ itemKey, children, className }: CrossfadeProps) {
  const [current, setCurrent] = useState<Shown & { initial: boolean }>({
    key: itemKey,
    node: children,
    initial: true,
  });
  const [leaving, setLeaving] = useState<Shown[]>([]);

  // Adjusting state while rendering (not in an effect) so the swap lands in the same frame.
  if (current.key !== itemKey) {
    setLeaving((items) => [...items.filter((item) => item.key !== itemKey), current]);
    setCurrent({ key: itemKey, node: children, initial: false });
  }

  useEffect(() => {
    if (!leaving.length) {
      return;
    }
    const timer = window.setTimeout(() => setLeaving([]), FADE_MS);
    return () => window.clearTimeout(timer);
  }, [leaving]);

  return (
    <span className={[styles.crossfade, className].filter(Boolean).join(" ")}>
      {leaving.map((item) => (
        <span key={item.key} className={styles.leaving} aria-hidden inert>
          {item.node}
        </span>
      ))}
      <span key={current.key} className={current.initial ? styles.item : styles.entering}>
        {children}
      </span>
    </span>
  );
}
