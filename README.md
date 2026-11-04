# Luke Robertson Studio

Next.js (App Router) site with an embedded Sanity Studio at `/cms`. Hosted on Vercel.

```bash
npm install
npm run dev        # http://localhost:3000, Studio at /cms
```

No `.env.local` is needed: the Sanity project (`x47vlamh`, dataset `production`) is set in
`sanity/lib/projectId.ts`. Production needs `SANITY_REVALIDATE_SECRET` (see `.env.example`).

## Pages

- `/`: the LR.S intro (once per session), then the featured scroll (Homepage document).
- `/projects`: the index with its category filter (Projects page document, Filter categories).
- `/projects/[slug]`: a project's slideshow: statement, image/video and info slides.
- `/profile`: profile text and details (Profile document).

## Content

The Prismic content was copied in with `npm run import:prismic` (`scripts/importPrismic.ts`).
Re-running it replaces the imported documents, including any edits made to them in Sanity.

## Schema

After changing schemas, deploy them: `npx sanity schema deploy`.
