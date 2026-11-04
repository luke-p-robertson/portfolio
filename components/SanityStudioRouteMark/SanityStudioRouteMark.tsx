"use client";

import { usePathname } from "next/navigation";
import { useLayoutEffect } from "react";

/**
 * Keeps `data-sanity-studio` on <html> in sync on client navigations (the inline
 * script in the root layout only runs on full page load).
 */
export function SanityStudioRouteMark() {
  const pathname = usePathname();
  const isStudio = pathname === "/cms" || pathname.startsWith("/cms/");

  useLayoutEffect(() => {
    const el = document.documentElement;
    if (isStudio) {
      el.setAttribute("data-sanity-studio", "");
    } else {
      el.removeAttribute("data-sanity-studio");
    }
  }, [isStudio]);

  return null;
}
