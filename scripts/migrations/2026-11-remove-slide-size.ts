/**
 * One-off: every slide is now shown at full height between the header and thumbnails, so
 * the per-slide Contained / Full bleed choice (from the Prismic import) is removed.
 *
 *   npx sanity exec scripts/migrations/2026-11-remove-slide-size.ts --with-user-token
 */
import { getCliClient } from "sanity/cli";

const client = getCliClient({ apiVersion: "2025-01-01" });

async function main() {
  const projects = await client.fetch<{ _id: string; keys: string[] | null }[]>(
    `*[_type == "project" && count(slides[defined(size)]) > 0]{ _id, "keys": slides[defined(size)]._key }`,
  );
  const transaction = client.transaction();
  for (const project of projects) {
    const paths = (project.keys ?? []).map((key) => `slides[_key == "${key}"].size`);
    transaction.patch(project._id, (patch) => patch.unset(paths));
  }
  const result = await transaction.commit();
  console.log(`Done: ${result.results.length} projects updated.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
