import type { Metadata } from "next";

import { NavigationTracker } from "@/components/NavigationTracker/NavigationTracker";
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
    <>
      <NavigationTracker />
      {children}
    </>
  );
}
