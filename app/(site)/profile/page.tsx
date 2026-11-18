import type { Metadata } from "next";

import { Profile } from "@/components/Profile/Profile";
import { getProfileData } from "@/sanity/lib/cachedQueries";
import { buildPageMetadata } from "@/sanity/lib/seoMetadata";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getProfileData();
  return buildPageMetadata(data?.seo ?? null, { title: "Profile — Luke Robertson Studio" });
}

export default async function ProfilePage() {
  const data = await getProfileData();

  return <Profile data={data} />;
}
