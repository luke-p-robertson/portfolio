import type { Metadata } from "next";

import { ProjectIndex } from "@/components/ProjectIndex/ProjectIndex";
import { getProjectIndexData } from "@/sanity/lib/cachedQueries";
import { buildPageMetadata } from "@/sanity/lib/seoMetadata";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getProjectIndexData();
  return buildPageMetadata(data?.page?.seo ?? null, { title: "Projects — Luke Robertson Studio" });
}

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string | string[] }>;
}) {
  const [data, params] = await Promise.all([getProjectIndexData(), searchParams]);
  const filter = typeof params.filter === "string" ? params.filter : null;

  return (
    <ProjectIndex
      projects={(data?.page?.projects ?? []).filter(Boolean)}
      categories={data?.categories ?? []}
      initialFilter={filter}
    />
  );
}
