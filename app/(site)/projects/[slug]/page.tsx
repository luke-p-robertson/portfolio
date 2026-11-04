import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Slideshow } from "@/components/Slideshow/Slideshow";
import { getProjectData, getProjectSlugs } from "@/sanity/lib/cachedQueries";
import { buildPageMetadata } from "@/sanity/lib/seoMetadata";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const slugs = await getProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectData(slug);
  return buildPageMetadata(project?.seo ?? null, {
    title: project?.title ? `${project.title} — Luke Robertson Studio` : "Luke Robertson Studio",
  });
}

export default async function ProjectPage({ params }: { params: Params }) {
  const { slug } = await params;
  const project = await getProjectData(slug);
  if (!project) {
    notFound();
  }

  return <Slideshow project={project} />;
}
