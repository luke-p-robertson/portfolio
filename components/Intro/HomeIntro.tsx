"use client";

import { usePathname } from "next/navigation";

import { Intro } from "./Intro";

/**
 * The LR.S splash, on the homepage only. It lives in the site layout rather than the page
 * so it isn't inside the page fade: it covers the header from the very first frame instead
 * of fading in over it.
 */
export function HomeIntro() {
  return usePathname() === "/" ? <Intro /> : null;
}
