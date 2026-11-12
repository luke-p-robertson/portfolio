# Luke Robertson Studio

Next.js (App Router) site with an embedded Sanity Studio at `/cms`. Hosted on Vercel.

```bash
npm install
npm run dev        # http://localhost:3000, Studio at /cms
```

No `.env.local` is needed: the Sanity project (`x47vlamh`, dataset `production`) is set in
`sanity/lib/projectId.ts`. Production needs `SANITY_REVALIDATE_SECRET` (see `.env.example`).

## Content updates

Pages are cached and rebuilt in the background at most once a minute. A Sanity webhook makes
publishing instant: on every create, update or delete it calls `POST /api/revalidate`,
signed with `SANITY_REVALIDATE_SECRET`, which expires all Sanity data at once, so the next
visitor to any page gets fresh content (`app/api/revalidate/route.ts`).

One webhook per site URL (sanity.io/manage → project → API → Webhooks), each with the same
secret as that deployment's `SANITY_REVALIDATE_SECRET` in Vercel:

- URL: `https://<site>/api/revalidate`, method POST
- Trigger on: create, update, delete
- Filter: `_type in ["project", "category", "homepage", "projectIndex", "profile", "siteSettings"]`
- Projection: `{_type, "slug": slug.current}`
- Drafts: off

`npx sanity hooks logs` shows recent deliveries.

## Images

All images are served from Sanity's CDN through a custom `next/image` loader
(`lib/sanityImageLoader.ts`): Sanity resizes, crops, picks AVIF/WebP and caches them, so
Vercel's image optimizer isn't used. Quality is `IMAGE_QUALITY` in
`sanity/lib/sanityImageUrl.ts`.

## Pages

- `/`: the LR.S intro (once per session), then the featured scroll (Homepage document).
- `/projects`: the index with its category filter (Projects page document, Filter categories).
- `/projects/[slug]`: a project's slideshow: an optional intro text card, its image/video slides, then the info slide.
- `/profile`: profile text and details (Profile document).

## Content

The Prismic content was copied in with `npm run import:prismic` (`scripts/importPrismic.ts`).
Re-running it replaces the imported documents, including any edits made to them in Sanity.

## Schema

After changing schemas, deploy them: `npx sanity schema deploy`.
