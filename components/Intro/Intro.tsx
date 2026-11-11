"use client";

import { useEffect, useState } from "react";

import { FADE_MS, SPLASH_MS } from "@/lib/motion";
import { INTRO_SEEN_KEY } from "@/lib/navigation";

import styles from "./Intro.module.scss";
import Mark from "./lrs-mark.svg";


/**
 * The "LR.S" splash: shown once per session on the homepage, then fades away. Click skips it.
 * A returning visitor never sees it flash: the root layout sets `data-intro-seen` before paint.
 */
export function Intro() {
  const [phase, setPhase] = useState<"showing" | "leaving" | "gone">("showing");

  useEffect(() => {
    let seen = false;
    try {
      seen = Boolean(sessionStorage.getItem(INTRO_SEEN_KEY));
      sessionStorage.setItem(INTRO_SEEN_KEY, "1");
    } catch {}
    if (seen) {
      // Already hidden by `data-intro-seen` (set before paint, or when it last finished).
      document.documentElement.setAttribute("data-intro-seen", "");
      return;
    }
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const leave = window.setTimeout(() => setPhase("leaving"), reduced ? 0 : SPLASH_MS);
    return () => window.clearTimeout(leave);
  }, []);

  useEffect(() => {
    if (phase !== "leaving") {
      return;
    }
    const done = window.setTimeout(() => {
      setPhase("gone");
      document.documentElement.setAttribute("data-intro-seen", "");
    }, FADE_MS);
    return () => window.clearTimeout(done);
  }, [phase]);

  if (phase === "gone") {
    return null;
  }

  return (
    <div
      className={[styles.intro, phase === "leaving" ? styles.leaving : null]
        .filter(Boolean)
        .join(" ")}
      onClick={() => setPhase("leaving")}
      aria-hidden
    >
      <Mark className={styles.mark} />
    </div>
  );
}
