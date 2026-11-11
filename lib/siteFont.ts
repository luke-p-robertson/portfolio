/**
 * The design uses trial fonts, so no licensed web font files are in the repo yet:
 * Practice (large text), Practice Display (the LR.S mark) and Test The Future (small
 * text). Luke is sending the licensed files. These stubs leave `--font-main`,
 * `--font-display` and `--font-small` unset, and `styles/_typography.scss` falls back to a
 * system serif and sans. Once the woff2 files are in `public/fonts/` (check they include
 * accented glyphs — the trials render "Château" without its â), replace the stubs with, e.g.:
 *
 *   import localFont from "next/font/local";
 *
 *   export const siteFont = localFont({
 *     src: [{ path: "../public/fonts/Practice-Regular.woff2", weight: "400", style: "normal" }],
 *     variable: "--font-main",
 *     display: "swap",
 *     fallback: ["Times New Roman", "Times", "serif"],
 *     preload: true,
 *   });
 *
 *   export const smallFont = localFont({
 *     src: [{ path: "../public/fonts/TestTheFuture-Regular.woff2", weight: "400", style: "normal" }],
 *     variable: "--font-small",
 *     display: "swap",
 *     fallback: ["Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
 *     preload: true,
 *   });
 *
 *   export const displayFont = localFont({
 *     src: [{ path: "../public/fonts/PracticeDisplay-Regular.woff2", weight: "400", style: "normal" }],
 *     variable: "--font-display",
 *     display: "swap",
 *     preload: false,
 *   });
 */
export const siteFont = { variable: "", className: "" };
export const smallFont = { variable: "", className: "" };
export const displayFont = { variable: "", className: "" };
