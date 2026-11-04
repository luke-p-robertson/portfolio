import type { Metadata } from "next";
import Script from "next/script";

import { SanityStudioRouteMark } from "@/components/SanityStudioRouteMark/SanityStudioRouteMark";
import { INTRO_SEEN_KEY } from "@/lib/navigation";
import { displayFont, siteFont } from "@/lib/siteFont";
import { SITE_URL } from "@/lib/siteUrl";

import "./globals.scss";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Luke Robertson Studio",
  description:
    "Luke Robertson Studio is a Paris-based creative consultancy working across identity, campaigns and experiences.",
};

/** Marks `/cms` before paint so global body styles do not apply site typography behind Sanity Studio. */
const sanityStudioRouteScript = `(function(){try{var p=location.pathname||"";if(p==="/cms"||p.indexOf("/cms/")===0){document.documentElement.setAttribute("data-sanity-studio","");}}catch(e){}})();`;

/** Hides the LR.S intro before paint once it has played this session (see components/Intro). */
const introSeenScript = `(function(){try{if(sessionStorage.getItem(${JSON.stringify(INTRO_SEEN_KEY)})){document.documentElement.setAttribute("data-intro-seen","");}}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={[siteFont.variable, displayFont.variable].filter(Boolean).join(" ")}
      suppressHydrationWarning
    >
      <body className={siteFont.className}>
        <Script id="sanity-studio-route" strategy="beforeInteractive">
          {sanityStudioRouteScript}
        </Script>
        <Script id="intro-seen" strategy="beforeInteractive">
          {introSeenScript}
        </Script>
        <SanityStudioRouteMark />
        {children}
      </body>
    </html>
  );
}
