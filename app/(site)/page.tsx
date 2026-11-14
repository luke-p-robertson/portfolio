import type { Metadata } from "next";

import { FeatureScroll } from "@/components/FeatureScroll/FeatureScroll";
import { getHomepageData } from "@/sanity/lib/cachedQueries";
import { buildPageMetadata } from "@/sanity/lib/seoMetadata";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getHomepageData();
  return buildPageMetadata(data?.seo ?? null, { title: "" });
}

export default async function HomePage() {
  const data = await getHomepageData();

  return <FeatureScroll features={data?.features} />;
}
