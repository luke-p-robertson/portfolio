"use client";

import { useEffect } from "react";

import styles from "./Overlay.module.scss";

type OverlayProps = {
  label: string;
  onClose: () => void;
  children: React.ReactNode;
};

/** Full-screen mobile panel (menu, filter): Esc closes it, and the page behind can't scroll. */
export function Overlay({ label, onClose, children }: OverlayProps) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label={label}>
      <div className={styles.list}>{children}</div>
    </div>
  );
}

export const overlayItemClass = styles.item;
export const overlayOptionClass = styles.option;
