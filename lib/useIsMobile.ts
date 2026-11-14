"use client";

import { useSyncExternalStore } from "react";

import { MOBILE_QUERY } from "./breakpoints";

function subscribe(onChange: () => void) {
  const query = window.matchMedia(MOBILE_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/** True at phone widths, for behavior that differs by layout (not styling). False on the server. */
export function useIsMobile(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(MOBILE_QUERY).matches,
    () => false,
  );
}
