/**
 * One-off: the project info from the Figma examples (Nov 11 design), word for word —
 * descriptions, scope, credits and the index labels (disciplines). Typos in the design copy
 * are kept as they are for Luke to correct in the Studio.
 *
 *   npx sanity exec scripts/migrations/2026-11-seed-figma-project-info.ts --with-user-token
 */
import { getCliClient } from "sanity/cli";

const client = getCliClient({ apiVersion: "2025-01-01" });

let n = 0;
const key = () => `figma${(n++).toString(36)}`;

const blocks = (...paragraphs: string[]) =>
  paragraphs.map((text) => ({
    _type: "block",
    _key: key(),
    style: "normal",
    markDefs: [],
    children: [{ _type: "span", _key: key(), text, marks: [] }],
  }));

const credit = (role: string, ...names: string[]) => ({ _type: "credit", _key: key(), role, names });

const category = (slug: string) => ({ _type: "reference", _key: key(), _ref: `category-${slug}` });

async function main() {
  const tx = client.transaction();

  tx.patch("project-area", (p) =>
    p.set({
      scope: ["Brand identity", "Brand guidelines", "Packaging design", "Art direction"],
      credits: [credit("Photography", "Bella Newman")],
      description: blocks(
        "AREA is a world where possibility meets occasion. Named for the legendary Manhattan nightclub that turned evenings into experiences, AREA inhabits the tension between intimacy and spectacle.",
        "In 2025 Nicholas Aburn was appointed creative director. Working alongside the AREA team, a new visual identity was designed, returning the brand to its conceptual core. Inspired by the balance between the European craft and the electricity of New York subculture, the identity establishes new design and typographic codes.",
      ),
    }),
  );

  tx.patch("project-thomas-pierre-jean", (p) =>
    p.set({
      scope: ["Brand identity", "Brand guidelines", "Print design"],
      credits: [credit("Credits", "with Studio Jarvis")],
      description: blocks(
        "With work held in the national collections of the Musée des Arts Décoratifs de Paris, Thomas Pierre Jean is a Paris-based fashion label specialising in fine embroidery, lace and artisanal techniques.",
        "Inspired by the precision of his craft and the interplay between masculinity and vulnerability, the identity introduces a bespoke typeface, wordmark and monogram. The system extends across stationery, packaging and digital applications.",
      ),
    }),
  );

  tx.patch("project-chateau-dyquem", (p) =>
    p.set({
      discipline: "Brand Identity, Art Direction, Digital",
      categories: [category("brand-identity"), category("digital")],
      scope: ["Brand identity", "Brand guidelines", "Print design", "Art direction", "Digital design"],
      credits: [
        credit("Credits", "with Loran Stosskopf"),
        credit("Photography", "Paul Rousteau", "Lydia Roberts", "Christophe Goussard", "Charlotte Kreiger"),
      ],
      description: blocks(
        "Château d’Yquem is a legendary wine, attributed the esteemed title Premier Cru Supérieur in 1855 and grown in an outstanding terroir in the sauternes appellation which has unique climate conditions and geological features. The LVMH group acquired the estate in 1999, with the continued desire to continue writing the legendary Yquem story, both in keeping with tradition and remaining open to modern advances.",
        "We were approached by Château d’Yquem with a mandate to help it reclaim it’s own sense of style and evolve it’s brand image which was increasingly suffering from generic tropes. Following our research and strategic work, we established new design principles for the brand which led to many key evolutions. We restored key historic brand assets, art directed and designed new packaging and marketing materials; bringing back craft as a central tenant to the brand. New photographers were commissioned to capture the truely artisanal spirit of Yquem.",
      ),
    }),
  );

  tx.patch("project-by-no-means", (p) => p.set({ discipline: "Brand Identity, Art Direction" }));

  tx.patch("project-kadri", (p) =>
    p.set({
      discipline: "Brand Identity, Digital",
      categories: [category("brand-identity"), category("digital")],
    }),
  );

  const result = await tx.commit();
  console.log(`Done: ${result.results.length} projects updated.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
