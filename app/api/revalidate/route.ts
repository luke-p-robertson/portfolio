import { revalidatePath, revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

import { SANITY_CACHE_TAG } from "@/sanity/lib/cachedQueries";

type WebhookBody = {
  _type?: string;
  slug?: string | null;
};

/**
 * Sanity webhook (sanity.io/manage → API → Webhooks), fired on every publish, unpublish or
 * delete. The request is signed with SANITY_REVALIDATE_SECRET, set both on the webhook and
 * in Vercel. `parseBody` checks the signature, then waits for the Content Lake so the
 * refetch reads what was just published.
 *
 * All Sanity data shares one cache tag, so any change expires everything at once — the
 * next visitor to any page gets fresh content (`expire: 0`), never a stale copy. The site
 * is small enough that this beats tracking which pages use which document.
 */
export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET?.trim();
  if (!secret) {
    return NextResponse.json({ message: "SANITY_REVALIDATE_SECRET is not set" }, { status: 500 });
  }

  const { isValidSignature, body } = await parseBody<WebhookBody>(request, secret);
  if (!isValidSignature) {
    return NextResponse.json({ message: "Invalid signature" }, { status: 401 });
  }

  revalidateTag(SANITY_CACHE_TAG, { expire: 0 });
  revalidatePath("/", "layout");

  return NextResponse.json({
    revalidated: true,
    type: body?._type ?? null,
    slug: body?.slug ?? null,
    at: Date.now(),
  });
}
