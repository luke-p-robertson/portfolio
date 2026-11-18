/**
 * One-off: credit names go from plain strings to `link` objects (a label and an optional URL),
 * so each name can link out. Converts every project and draft still using strings; names that
 * are already links are left alone, so it's safe to run again. Each patch is tied to the
 * document's revision, so it never overwrites an edit made while it runs.
 *
 * Run it right after the schema change is deployed (the site reads both formats).
 *
 *   npx sanity exec scripts/migrations/2026-11-credit-name-links.ts --with-user-token
 */
import { getCliClient } from "sanity/cli";

const client = getCliClient({ apiVersion: "2025-01-01" });

type Credit = { _key: string; names?: unknown[] };
type Doc = { _id: string; _rev: string; credits?: Credit[] };

function randomKey() {
  return Math.random().toString(36).slice(2, 14);
}

async function main() {
  const all = await client.fetch<Doc[]>(
    `*[_type == "project" && defined(credits)]{ _id, _rev, credits }`,
  );
  const docs = all.filter((doc) =>
    doc.credits?.some((credit) => credit.names?.some((name) => typeof name === "string")),
  );
  if (!docs.length) {
    console.log("Every credit name is already a link; nothing changed.");
    return;
  }

  for (const doc of docs) {
    const set: Record<string, unknown[]> = {};
    for (const credit of doc.credits ?? []) {
      if (!credit.names?.some((name) => typeof name === "string")) {
        continue;
      }
      set[`credits[_key == "${credit._key}"].names`] = credit.names.map((name) =>
        typeof name === "string" ? { _type: "link", _key: randomKey(), label: name } : name,
      );
    }
    await client.patch(doc._id).ifRevisionId(doc._rev).set(set).commit();
    console.log(`${doc._id}: converted ${Object.keys(set).length} credit(s).`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
