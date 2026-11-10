import type { Metadata } from "next";

import { NavigationTracker } from "@/components/NavigationTracker/NavigationTracker";
import { HeaderProvider } from "@/components/SiteHeader/HeaderContext";
import { SiteHeader } from "@/components/SiteHeader/SiteHeader";
import { buildSiteMetadata } from "@/sanity/lib/seoMetadata";

export async function generateMetadata(): Promise<Metadata> {
  return buildSiteMetadata();
}

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <HeaderProvider>
      <NavigationTracker />
      {/* Outside the page template, so it stays while pages fade in and out. */}
      <SiteHeader />
      {children}
    </HeaderProvider>
  );
}
