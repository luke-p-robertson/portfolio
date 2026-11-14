/**
 * One-off: the project "Index image" became "Index image or video" (a `media` object,
 * like the slides), so an existing image thumbnail is wrapped as `media.image`.
 *
 *   npx sanity exec scripts/migrations/2026-11-thumbnail-media.ts --with-user-token
 */
import { getCliClient } from "sanity/cli";

const client = getCliClient({ apiVersion: "2025-01-01" });

type OldThumbnail = { _type: "image"; asset?: unknown; crop?: unknown; hotspot?: unknown; alt?: string };

async function main() {
  // Published and draft versions alike, so nothing Luke is editing keeps the old shape.
  const docs = await client.fetch<{ _id: string; thumbnail: OldThumbnail }[]>(
    `*[_type == "project" && thumbnail._type == "image"]{ _id, thumbnail }`,
  );
  const transaction = client.transaction();
  for (const { _id, thumbnail } of docs) {
    transaction.patch(_id, (patch) =>
      patch.set({
        thumbnail: { _type: "media", mediaType: "image", image: { ...thumbnail, _type: "image" } },
      }),
    );
    console.log(`  ${_id}`);
  }
  if (!docs.length) {
    console.log("Nothing to convert.");
    return;
  }
  await transaction.commit();
  console.log(`Done: ${docs.length} thumbnail(s) converted.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
