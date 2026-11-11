/**
 * One-off: By No Means' last description paragraph → the newer wording from the mobile
 * Figma frame (the desktop frame still had the older paragraph).
 *
 *   npx sanity exec scripts/migrations/2026-11-bnm-mobile-wording.ts --with-user-token
 */
import { getCliClient } from "sanity/cli";

const client = getCliClient({ apiVersion: "2025-01-01" });

const OLD_START = "Packaging and label materials were chosen";
const NEW_TEXT =
  "As an ‘impression’ of wine, each varietal leaves only a blind impression on the label, subtly embedded within the wordmark.";

async function main() {
  const doc = await client.fetch<{ description?: { _key: string; children?: { _key: string; text?: string }[] }[] }>(
    `*[_id == "project-by-no-means"][0]{ description }`,
  );
  const block = doc?.description?.find((b) => b.children?.[0]?.text?.startsWith(OLD_START));
  if (!block?.children?.[0]) {
    console.log("Old paragraph not found; nothing changed.");
    return;
  }
  const path = `description[_key == "${block._key}"].children[_key == "${block.children[0]._key}"].text`;
  await client.patch("project-by-no-means").set({ [path]: NEW_TEXT }).commit();
  console.log("Updated By No Means' last paragraph.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
