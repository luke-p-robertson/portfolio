"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";

import { PREVIOUS_PATH_KEY } from "@/lib/navigation";

/** A project's "Close": back to the page the visitor came from, else the Projects page. */
export function useCloseProject() {
  const router = useRouter();
  const pathname = usePathname();
  return useCallback(() => {
    let previous: string | null = null;
    try {
      previous = sessionStorage.getItem(PREVIOUS_PATH_KEY);
    } catch {}
    if (previous && previous !== pathname) {
      router.back();
    } else {
      router.push("/projects");
    }
  }, [router, pathname]);
}
