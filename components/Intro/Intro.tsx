"use client";

import { useEffect, useState } from "react";

import { FADE_MS, SPLASH_MAX_MS, SPLASH_MS } from "@/lib/motion";
import { INTRO_SEEN_KEY, SPLASH_WAIT_ATTRIBUTE } from "@/lib/navigation";

import styles from "./Intro.module.scss";
import Mark from "./lrs-mark.svg";

/** How long to let a loaded image finish decoding (a background tab may never decode). */
const DECODE_GRACE_MS = 300;

/** Resolves once an image has loaded (or failed) and, within a moment, decoded. */
function imageReady(image: HTMLImageElement): Promise<void> {
  const loaded = image.complete
    ? Promise.resolve()
    : new Promise<void>((resolve) => {
        image.addEventListener("load", () => resolve(), { once: true });
        image.addEventListener("error", () => resolve(), { once: true });
      });
  return loaded.then(() =>
    Promise.race([
      image.decode().catch(() => {}),
      new Promise<void>((resolve) => window.setTimeout(resolve, DECODE_GRACE_MS)),
    ]),
  );
}

/** Resolves once a video has a frame to show (or can't load). */
function videoReady(video: HTMLVideoElement): Promise<void> {
  if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    video.addEventListener("loadeddata", () => resolve(), { once: true });
    video.addEventListener("error", () => resolve(), { once: true });
  });
}

/**
 * Resolves once the images and videos the splash uncovers (the first homepage feature,
 * marked with `data-splash-wait`) are loaded and decoded, so none of them visibly load in.
 * Only the ones laid out at this screen size count: the other breakpoint's copies are
 * `display: none` and never load.
 */
function splashContentReady(): Promise<void> {
  const root = document.querySelector(`[${SPLASH_WAIT_ATTRIBUTE}]`);
  if (!root) {
    return Promise.resolve();
  }
  const media = Array.from(
    root.querySelectorAll<HTMLImageElement | HTMLVideoElement>("img, video"),
  ).filter((element) => element.getClientRects().length > 0);
  return Promise.all(
    media.map((element) =>
      element instanceof HTMLVideoElement ? videoReady(element) : imageReady(element),
    ),
  ).then(() => {});
}

/**
 * The "LR.S" splash: shown once per session on the homepage, then fades away. It holds for
 * at least `SPLASH_MS` and until the first feature's images are ready (at most
 * `SPLASH_MAX_MS`), so the page underneath is complete when it fades. Click skips it.
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
    let cancelled = false;
    const leave = () => {
      if (!cancelled) {
        setPhase((current) => (current === "showing" ? "leaving" : current));
      }
    };
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const minimum = new Promise((resolve) => window.setTimeout(resolve, reduced ? 0 : SPLASH_MS));
    const cap = window.setTimeout(leave, SPLASH_MAX_MS);
    // Checked once the minimum is up, so a page that arrives after the splash still counts.
    void minimum.then(splashContentReady).then(leave);
    return () => {
      cancelled = true;
      window.clearTimeout(cap);
    };
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
