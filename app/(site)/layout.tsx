import { GoogleAnalytics } from "@next/third-parties/google";
import type { Metadata } from "next";

import { HomeIntro } from "@/components/Intro/HomeIntro";
import { NavigationTracker } from "@/components/NavigationTracker/NavigationTracker";
import { Screensaver } from "@/components/Screensaver/Screensaver";
import { HeaderProvider } from "@/components/SiteHeader/HeaderContext";
import { SiteHeader } from "@/components/SiteHeader/SiteHeader";
import { getSiteSettings } from "@/sanity/lib/cachedQueries";
import { buildSiteMetadata } from "@/sanity/lib/seoMetadata";

/** Luke's Google Analytics 4 property (carried over from the previous site). */
const GA_MEASUREMENT_ID = "G-MXL8M803C3";

export async function generateMetadata(): Promise<Metadata> {
  return buildSiteMetadata();
}

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();
  return (
    <HeaderProvider>
      <NavigationTracker />
      {/* Outside the page template, so it stays while pages fade in and out. */}
      <SiteHeader />
      {/* Also outside the template: the splash must cover the header from the first frame. */}
      <HomeIntro />
      {children}
      <Screensaver
        quote={settings?.screensaverQuote}
        attribution={settings?.screensaverAttribution}
      />
      {/*
        Next's own Google Analytics component: gtag.js loads after hydration, off the critical
        path. Vercel production deploys only, so staging, preview and local visits never count,
        and in this layout rather than the root one, so Studio (/cms) never loads it. GA4's
        enhanced measurement records client-side navigations as page views.
      */}
      {process.env.VERCEL_ENV === "production" ? (
        <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />
      ) : null}
    </HeaderProvider>
  );
}
