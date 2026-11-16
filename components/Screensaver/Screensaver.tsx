"use client";

import { useEffect, useRef, useState } from "react";

import { DESKTOP_QUERY } from "@/lib/breakpoints";
import { IDLE_MS } from "@/lib/motion";

import styles from "./Screensaver.module.scss";

/** Desktop with a mouse only: phones and tablets never idle into it. */
const IDLE_QUERY = `${DESKTOP_QUERY} and (hover: hover) and (pointer: fine)`;

/** Any of these counts as activity: it clears the quote and restarts the wait. */
const ACTIVITY_EVENTS = [
  "pointermove",
  "pointerdown",
  "keydown",
  "wheel",
  "scroll",
  "touchstart",
] as const;

type ScreensaverProps = {
  quote?: string | null;
  attribution?: string | null;
};

/**
 * Luke's idle state (Figma 2733:4): after IDLE_MS without a mouse move, scroll or key press,
 * the quote from Site settings fades in over the whole page, and any activity clears it.
 * A key press that wakes it does only that, so it doesn't also step a slideshow.
 */
export function Screensaver({ quote, attribution }: ScreensaverProps) {
  const text = quote?.trim();
  const credit = attribution?.trim();
  const [showing, setShowing] = useState(false);
  const showingRef = useRef(false);

  useEffect(() => {
    if (!text) {
      return;
    }
    const media = window.matchMedia(IDLE_QUERY);
    let timer: number | undefined;

    const show = () => {
      showingRef.current = true;
      setShowing(true);
    };

    const restart = (event?: Event) => {
      if (showingRef.current) {
        if (event?.type === "keydown") {
          event.preventDefault();
          event.stopImmediatePropagation();
        }
        showingRef.current = false;
        setShowing(false);
      }
      window.clearTimeout(timer);
      if (media.matches) {
        timer = window.setTimeout(show, IDLE_MS);
      }
    };

    const onMediaChange = () => restart();

    restart();
    // Capture, so element scrolls count too and a waking key press is stopped early.
    const options = { capture: true } as const;
    for (const type of ACTIVITY_EVENTS) {
      window.addEventListener(type, restart, options);
    }
    media.addEventListener("change", onMediaChange);
    return () => {
      window.clearTimeout(timer);
      for (const type of ACTIVITY_EVENTS) {
        window.removeEventListener(type, restart, options);
      }
      media.removeEventListener("change", onMediaChange);
    };
  }, [text]);

  if (!text) {
    return null;
  }

  return (
    <div
      className={[styles.root, showing ? styles.showing : null].filter(Boolean).join(" ")}
      aria-hidden
    >
      <p className={styles.quote}>
        {text}
        {credit ? `\n— ${credit}` : null}
      </p>
    </div>
  );
}
