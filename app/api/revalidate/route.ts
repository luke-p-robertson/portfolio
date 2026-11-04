import { revalidatePath, revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

import { SANITY_CACHE_TAG } from "@/sanity/lib/cachedQueries";

const STATIC_SITE_PATHS = ["/", "/projects", "/profile"] as const;

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");
  const expected = process.env.SANITY_REVALIDATE_SECRET?.trim();

  if (!expected || secret !== expected) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  revalidateTag(SANITY_CACHE_TAG, "max");

  const paths = [...STATIC_SITE_PATHS];

  for (const path of paths) {
    revalidatePath(path);
  }
  revalidatePath("/projects/[slug]", "page");

  return NextResponse.json({
    revalidated: true,
    paths,
    at: Date.now(),
  });
}
