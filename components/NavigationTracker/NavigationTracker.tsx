"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import { PREVIOUS_PATH_KEY } from "@/lib/navigation";

/**
 * Remembers the previous page within the site, so a project's "Close" can go back to
 * where the visitor came from (the featured scroll or the index) instead of a fixed page.
 */
export function NavigationTracker() {
  const pathname = usePathname();
  const current = useRef<string | null>(null);

  useEffect(() => {
    if (current.current && current.current !== pathname) {
      try {
        sessionStorage.setItem(PREVIOUS_PATH_KEY, current.current);
      } catch {}
    }
    current.current = pathname;
  }, [pathname]);

  return null;
}
