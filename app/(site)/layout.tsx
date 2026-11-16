import type { Metadata } from "next";

import { HomeIntro } from "@/components/Intro/HomeIntro";
import { NavigationTracker } from "@/components/NavigationTracker/NavigationTracker";
import { Screensaver } from "@/components/Screensaver/Screensaver";
import { HeaderProvider } from "@/components/SiteHeader/HeaderContext";
import { SiteHeader } from "@/components/SiteHeader/SiteHeader";
import { getSiteSettings } from "@/sanity/lib/cachedQueries";
import { buildSiteMetadata } from "@/sanity/lib/seoMetadata";

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
    </HeaderProvider>
  );
}
