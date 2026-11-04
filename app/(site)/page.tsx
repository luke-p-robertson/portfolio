import type { Metadata } from "next";

import { FeatureScroll } from "@/components/FeatureScroll/FeatureScroll";
import { Intro } from "@/components/Intro/Intro";
import { SiteHeader } from "@/components/SiteHeader/SiteHeader";
import { getHomepageData } from "@/sanity/lib/cachedQueries";
import { buildPageMetadata } from "@/sanity/lib/seoMetadata";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getHomepageData();
  return buildPageMetadata(data?.seo ?? null, { title: "" });
}

export default async function HomePage() {
  const data = await getHomepageData();

  return (
    <>
      <Intro />
      <SiteHeader />
      <FeatureScroll features={data?.features} />
    </>
  );
}
