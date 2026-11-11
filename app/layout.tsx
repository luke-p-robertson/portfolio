import type { Metadata } from "next";

import { SanityStudioRouteMark } from "@/components/SanityStudioRouteMark/SanityStudioRouteMark";
import { INTRO_SEEN_KEY } from "@/lib/navigation";
import { SITE_URL } from "@/lib/siteUrl";

import "./globals.scss";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Luke Robertson Studio",
  description:
    "Luke Robertson Studio is a Paris-based creative consultancy working across identity, campaigns and experiences.",
};

/**
 * Runs in <head> before the page paints, flagging <html> for CSS:
 * - `data-sanity-studio` on /cms, so site typography and background don't apply behind Studio;
 * - `data-intro-seen` once the LR.S intro has played this session, so it never flashes again.
 * A plain inline <script>, not next/script: `beforeInteractive` inline code is queued
 * and runs after first paint, which let the intro flash on every reload.
 */
const beforePaintScript = `(function(){try{var d=document.documentElement,p=location.pathname||"";if(p==="/cms"||p.indexOf("/cms/")===0){d.setAttribute("data-sanity-studio","");}if(sessionStorage.getItem(${JSON.stringify(INTRO_SEEN_KEY)})){d.setAttribute("data-intro-seen","");}}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: beforePaintScript }} />
        {/*
          The licensed fonts' @font-face rules, served as a static file so their license
          notice is kept verbatim (a bundled stylesheet would have it minified away).
          Both faces are used above the fold on every page, so both are preloaded.
        */}
        {/* eslint-disable-next-line @next/next/no-css-tags */}
        <link rel="stylesheet" href="/fonts/fonts.css" />
        <link
          rel="preload"
          href="/fonts/TheFuture-Regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/Practice-Regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <SanityStudioRouteMark />
        {children}
      </body>
    </html>
  );
}
