/**
 * One-off: the headlines and By No Means info copy from the Figma, word for word.
 *
 *   npx sanity exec scripts/migrations/2026-11-seed-design-copy.ts --with-user-token
 */
import { getCliClient } from "sanity/cli";

const client = getCliClient({ apiVersion: "2025-01-01" });
let n = 0;
const key = () => `seed${n++}`;
const block = (text: string) => ({
  _type: "block",
  _key: key(),
  style: "normal",
  markDefs: [],
  children: [{ _type: "span", _key: key(), text, marks: [] }],
});

async function main() {
  const tx = client.transaction();
  tx.patch("project-by-no-means", (p) =>
    p.set({
      headline: "A botanical take on the language of wine",
      scope: ["Brand identity", "Brand guidelines", "Packaging design", "Art direction"],
      credits: [
        { _type: "credit", _key: key(), role: "Photography", names: ["Annika Kafcaloudis"] },
        { _type: "credit", _key: key(), role: "Food styling", names: ["Stephanie Stamatis"] },
        { _type: "credit", _key: key(), role: "Post production", names: ["Ring Studio"] },
      ],
      description: [
        block("By No Means creates alcohol-free botanical drinks inspired by wine. Each varietal is built around the beauty of raw ingredients, meticulously balanced for texture, weight, tannin and acidity. The result is a botanical impression of wine, created specifically for fine dining."),
        block("The typographic character of the new identity draws from the organic and the handmade, balancing irregularity with refinement. A new symbol, inspired by a typographic asterism, extends this language. Flipped to reflect the brand’s antipodean origins, the asterism evokes a bunch of grapes, subtly subverting the familiar form."),
        block("As an ‘impression’ of wine, each varietal leaves only a blind impression on the label, subtly embedded within the wordmark."),
      ],
    }),
  );
  tx.patch("project-area", (p) => p.set({ headline: "Defining a new era for AREA" }));
  tx.patch("project-thomas-pierre-jean", (p) =>
    p.set({ headline: "A signature identity for Thomas Pierre Jean" }),
  );
  const r = await tx.commit();
  console.log(`Seeded ${r.results.length} projects`);
}
main().catch((e) => { console.error(e); process.exit(1); });
