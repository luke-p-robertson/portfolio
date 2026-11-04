/**
 * One-off: moves imported projects to the schema agreed on the Nov 4 call.
 *
 *   npx sanity exec scripts/migrations/2026-11-headline-colours.ts --with-user-token
 *
 * - `theme` (light/dark) → `backgroundColor` / `textColor` hex codes. Only Thomas Pierre
 *   Jean was dark in the design (#141414 with white type); the rest keep the defaults.
 * - Info slides are now added by the site after the last slide, so `slideInfo` entries go.
 * - A statement slide's text becomes the project `headline` (the intro card).
 */
import { getCliClient } from "sanity/cli";

const client = getCliClient({ apiVersion: "2025-01-01" });

const DARK = { backgroundColor: "#141414", textColor: "#ffffff" };

type Slide = { _key: string; _type: string; text?: string };

async function main() {
  const projects = await client.fetch<
    { _id: string; theme?: string; headline?: string; slides?: Slide[] }[]
  >(`*[_type == "project"]{ _id, theme, headline, slides[]{ _key, _type, text } }`);

  const transaction = client.transaction();
  for (const project of projects) {
    const slides = project.slides ?? [];
    const statement = slides.find((s) => s._type === "slideStatement" && s.text?.trim());
    const removeKeys = slides
      .filter((s) => s._type === "slideInfo" || s._type === "slideStatement")
      .map((s) => `slides[_key == "${s._key}"]`);

    const isDark = project.theme === "dark" || project._id === "project-thomas-pierre-jean";
    transaction.patch(project._id, (patch) => {
      let p = patch.unset(["theme", ...removeKeys]);
      if (isDark) p = p.set(DARK);
      if (statement?.text && !project.headline) p = p.set({ headline: statement.text.trim() });
      return p;
    });
    console.log(`${project._id}: -${removeKeys.length} slides${isDark ? ", dark" : ""}`);
  }
  const result = await transaction.commit();
  console.log(`Done: ${result.results.length} projects updated.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
