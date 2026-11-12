/**
 * One-off: typo fixes in the Château d'Yquem description (copied verbatim from the Figma):
 * it's → its (×2), tenant → tenet, truely → truly, sauternes → Sauternes.
 *
 *   npx sanity exec scripts/migrations/2026-11-fix-yquem-typos.ts --with-user-token
 */
import { getCliClient } from "sanity/cli";

const client = getCliClient({ apiVersion: "2025-01-01" });

const FIXES: [RegExp, string][] = [
  [/\bit[’']s own sense\b/g, "its own sense"],
  [/\bevolve it[’']s brand\b/g, "evolve its brand"],
  [/\bcentral tenant\b/g, "central tenet"],
  [/\btruely\b/g, "truly"],
  [/\bthe sauternes appellation\b/g, "the Sauternes appellation"],
];

type Block = { _key: string; children?: { _key: string; text?: string }[] };

async function main() {
  const doc = await client.fetch<{ description?: Block[] }>(
    `*[_id == "project-chateau-dyquem"][0]{ description }`,
  );
  const set: Record<string, string> = {};
  for (const block of doc?.description ?? []) {
    for (const span of block.children ?? []) {
      const fixed = FIXES.reduce((text, [pattern, to]) => text.replace(pattern, to), span.text ?? "");
      if (fixed !== span.text) {
        set[`description[_key == "${block._key}"].children[_key == "${span._key}"].text`] = fixed;
      }
    }
  }
  if (!Object.keys(set).length) {
    console.log("Nothing to fix.");
    return;
  }
  await client.patch("project-chateau-dyquem").set(set).commit();
  console.log(`Fixed ${Object.keys(set).length} paragraph(s).`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
