/**
 * One-off: recommended SEO titles and descriptions for each page (not the social images),
 * drawn only from the site's own copy. Luke can edit them on each document's SEO tab.
 * Titles name the page, then the studio; descriptions stay under ~160 characters.
 *
 *   npx sanity exec scripts/migrations/2026-11-seed-seo.ts --with-user-token
 */
import { getCliClient } from "sanity/cli";

const client = getCliClient({ apiVersion: "2025-01-01" });

const seo = (title: string, description: string) => ({
  "seo.title": title,
  "seo.description": description,
});

const PAGES: Record<string, ReturnType<typeof seo>> = {
  siteSettings: seo(
    "Luke Robertson Studio",
    "Luke Robertson Studio is a Paris-based creative consultancy shaping brands through identity, campaigns and experiences.",
  ),
  homepage: seo(
    "Luke Robertson Studio — Creative Consultancy, Paris",
    "Paris-based creative consultancy shaping brands through identity, campaigns and experiences across fashion, luxury, technology, culture and commerce.",
  ),
  projectIndex: seo(
    "Projects — Luke Robertson Studio",
    "Selected work in brand identity, art direction, digital, print and packaging for Château d’Yquem, AREA, By No Means, Thomas Pierre Jean and others.",
  ),
  profile: seo(
    "Profile — Luke Robertson Studio",
    "A Paris-based creative consultancy offering creative direction, visual identity, strategy, digital and editorial design, packaging and type design.",
  ),
  "project-by-no-means": seo(
    "By No Means — Luke Robertson Studio",
    "Brand identity, packaging and art direction for By No Means, alcohol-free botanical drinks inspired by wine, created for fine dining.",
  ),
  "project-area": seo(
    "AREA — Luke Robertson Studio",
    "A new visual identity for AREA, named for the legendary Manhattan nightclub: brand identity, guidelines, packaging and art direction.",
  ),
  "project-thomas-pierre-jean": seo(
    "Thomas Pierre Jean — Luke Robertson Studio",
    "A bespoke typeface, wordmark and monogram for Thomas Pierre Jean, the Paris fashion label specialising in fine embroidery, lace and artisanal techniques.",
  ),
  "project-chateau-dyquem": seo(
    "Château d’Yquem — Luke Robertson Studio",
    "Brand identity, art direction, print and digital design for Château d’Yquem, the legendary Sauternes estate, restoring craft to the heart of the brand.",
  ),
  "project-chateau-dyquem-y": seo(
    "Château d’Yquem ‘Y’ — Luke Robertson Studio",
    "Art direction for Château d’Yquem ‘Y’ by Luke Robertson Studio, a Paris-based creative consultancy.",
  ),
  "project-kadri": seo(
    "KADRI — Luke Robertson Studio",
    "Brand identity and digital design for KADRI by Luke Robertson Studio, a Paris-based creative consultancy.",
  ),
  "project-alba-golf": seo(
    "Alba Golf — Luke Robertson Studio",
    "Brand identity for Alba Golf by Luke Robertson Studio, a Paris-based creative consultancy.",
  ),
  "project-ryan-chappell": seo(
    "Ryan Chappell — Luke Robertson Studio",
    "Website design for Ryan Chappell by Luke Robertson Studio, a Paris-based creative consultancy.",
  ),
};

async function main() {
  const tx = client.transaction();
  for (const [id, fields] of Object.entries(PAGES)) {
    tx.patch(id, (p) => p.setIfMissing({ seo: { _type: "seo" } }).set(fields));
  }
  const result = await tx.commit();
  console.log(`Done: ${result.results.length} documents updated.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
