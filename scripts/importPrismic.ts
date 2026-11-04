/**
 * One-off import of the old Prismic site into Sanity.
 *
 *   npx sanity exec scripts/importPrismic.ts --with-user-token
 *
 * Prismic held one document per slide (86 of them, each with its own colours and link),
 * so they are grouped by client into real projects here. Every image and video is copied
 * into Sanity. Projects in the new design are visible; the rest are imported hidden for
 * Luke to review. Re-running replaces the same documents (ids are derived from the slug)
 * and Sanity de-duplicates the uploaded files.
 *
 * Also seeds the filter categories, the Projects page order and the homepage features from
 * the Figma design, the profile copy from the Figma profile frame, and default SEO from
 * the Prismic homepage.
 */
import { getCliClient } from "sanity/cli";

const PRISMIC_API = "https://lukerobertson.cdn.prismic.io/api/v2";

const client = getCliClient({ apiVersion: "2025-01-01" });

type PrismicLink = { url?: string; name?: string; kind?: string } | null;

type PrismicSlide = {
  id: string;
  type: string;
  first_publication_date: string;
  data: {
    description?: string | null;
    media_type?: "Image" | "Video" | null;
    orientation?: "Full Bleed" | "Constrained" | null;
    image?: { url?: string; alt?: string | null } | null;
    video?: PrismicLink;
    external_link?: PrismicLink;
  };
};

type PrismicHomepage = {
  type: "homepage";
  data: {
    meta_description?: string | null;
    projects?: { project?: { id?: string } }[];
  };
};

type Group = {
  slug: string;
  title: string;
  discipline?: string;
  /** Shown in the new design, so imported visible. */
  visible?: boolean;
};

/** Prismic description prefix → project. First match wins, so specific rules come first. */
const RULES: [RegExp, Group][] = [
  [/^Château d’Yquem,? Y 20\d\d/, { slug: "chateau-dyquem-y", title: "Château d’Yquem ‘Y’", discipline: "Art Direction", visible: true }],
  [/^Château d’Yquem,? Novel/, { slug: "chateau-dyquem-novel", title: "Château d’Yquem Novel" }],
  [/^Château d’Yquem/, { slug: "chateau-dyquem", title: "Château d’Yquem", discipline: "Brand Identity", visible: true }],
  [/^Métamorphoses by Yquem/, { slug: "metamorphoses-by-yquem", title: "Métamorphoses by Yquem", discipline: "Art Direction" }],
  [/^AREA, SS26/, { slug: "area-ss26-invitation", title: "AREA SS26 Invitation" }],
  [/^AREA, FW26/, { slug: "area-fw26-invitation", title: "AREA FW26 Invitation" }],
  [/^AREA/, { slug: "area", title: "AREA", discipline: "Brand Identity", visible: true }],
  [/^By No Means/, { slug: "by-no-means", title: "By No Means", discipline: "Brand Identity", visible: true }],
  [/^ALBA/, { slug: "alba-golf", title: "Alba Golf", discipline: "Brand Identity", visible: true }],
  [/^KADRI/, { slug: "kadri", title: "KADRI", discipline: "Brand Identity", visible: true }],
  [/^Thomas Pierre Jean/, { slug: "thomas-pierre-jean", title: "Thomas Pierre Jean", discipline: "Brand Identity", visible: true }],
  [/^Ryan Chappell/, { slug: "ryan-chappell", title: "Ryan Chappell", discipline: "Website", visible: true }],
  [/^The Breath Coach/, { slug: "the-breath-coach", title: "The Breath Coach" }],
  [/^STOREYSTUDIO/, { slug: "storeystudio", title: "STOREYSTUDIO" }],
  [/^MARCO/, { slug: "marco", title: "MARCO" }],
  [/^Phony Studio/, { slug: "phony-studio", title: "Phony Studio" }],
  [/^Puig/, { slug: "puig-womens-americas-cup", title: "Puig Women’s America’s Cup" }],
  [/^Studio Jarvis/, { slug: "studio-jarvis", title: "Studio Jarvis" }],
  [/^Art Gallery (of )?NSW/, { slug: "art-gallery-of-nsw", title: "Art Gallery of NSW" }],
  [/^Kinema/, { slug: "kinema", title: "Kinema" }],
  [/^Frameline/, { slug: "frameline", title: "Frameline" }],
  [/^Global Health Reporting Center/, { slug: "global-health-reporting-center", title: "Global Health Reporting Center" }],
  [/^Visa/, { slug: "visa", title: "Visa" }],
  [/^Collector V/, { slug: "collector-v", title: "Collector V" }],
  [/^Five Mile Radius/, { slug: "five-mile-radius", title: "Five Mile Radius" }],
  [/^Soap Co/, { slug: "soap-co", title: "Soap Co" }],
  [/^Theory of Flaw/, { slug: "theory-of-flaw", title: "Theory of Flaw" }],
  [/^Home by Six/, { slug: "home-by-six", title: "Home by Six" }],
  [/^The Outsider/, { slug: "the-outsider", title: "The Outsider by John Feely" }],
];

/** Collaborations named in Prismic descriptions → credits on the project's info slide. */
const CREDIT_RULES: [RegExp, (m: RegExpMatchArray) => { role: string; name: string }][] = [
  [/A Mucho Project/i, () => ({ role: "Credits", name: "with Mucho" })],
  [/A Paul Belford Ltd Project/i, () => ({ role: "Credits", name: "with Paul Belford Ltd" })],
  [/(?:With|w\/) (Studio Jarvis|Dave Foster)/i, (m) => ({ role: "Credits", name: `with ${m[1]}` })],
  [/Published by ([^.]+)/i, (m) => ({ role: "Publisher", name: m[1].trim() })],
  [/Photo by ([^.]+)/i, (m) => ({ role: "Photography", name: m[1].trim() })],
];

/** Filter categories, as in the Figma filter menu. */
const CATEGORIES = [
  { slug: "brand-identity", title: "Brand Identity" },
  { slug: "digital", title: "Digital" },
  { slug: "print", title: "Print" },
  { slug: "packaging", title: "Packaging" },
];

/** Discipline → filter category. Only the obvious ones; Luke assigns the rest. */
const DISCIPLINE_CATEGORY: Record<string, string> = {
  "Brand Identity": "brand-identity",
  Website: "digital",
};

/** The Figma Projects index order; other projects follow. */
const INDEX_ORDER = [
  "chateau-dyquem",
  "ryan-chappell",
  "by-no-means",
  "kadri",
  "chateau-dyquem-y",
  "thomas-pierre-jean",
  "alba-golf",
  "naburn",
  "area",
];

/** The Figma featured scroll, top to bottom (Naburn has no imagery yet, so it's left out). */
const FEATURES: { slug: string; layout: "single" | "pair" }[] = [
  { slug: "chateau-dyquem", layout: "pair" },
  { slug: "by-no-means", layout: "single" },
  { slug: "alba-golf", layout: "pair" },
  { slug: "ryan-chappell", layout: "single" },
  { slug: "area", layout: "pair" },
  { slug: "thomas-pierre-jean", layout: "single" },
];

let keyCounter = 0;
const key = () => `k${(keyCounter++).toString(36).padStart(6, "0")}`;

async function prismicDocuments() {
  const api = await (await fetch(PRISMIC_API)).json();
  const ref = api.refs.find((r: { isMasterRef: boolean }) => r.isMasterRef).ref;
  const docs: (PrismicSlide | PrismicHomepage)[] = [];
  for (let page = 1; ; page++) {
    const res = await fetch(
      `${PRISMIC_API}/documents/search?ref=${ref}&pageSize=100&page=${page}`,
    );
    const json = await res.json();
    docs.push(...json.results);
    if (page >= json.total_pages) break;
  }
  return docs;
}

const uploaded = new Map<string, string>();

/** Copies a Prismic file into Sanity; returns the asset id. */
async function upload(kind: "image" | "file", url: string): Promise<string> {
  // Prismic image URLs carry imgix params (auto=compress…); drop them for the original.
  const source = kind === "image" ? url.split("?")[0] : url;
  const cached = uploaded.get(source);
  if (cached) return cached;
  const res = await fetch(source);
  if (!res.ok) throw new Error(`${res.status} fetching ${source}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  const filename = decodeURIComponent(new URL(source).pathname.split("/").pop() ?? "upload");
  const asset = await client.assets.upload(kind, buffer, { filename });
  uploaded.set(source, asset._id);
  console.log(`  ↑ ${filename}`);
  return asset._id;
}

async function slideFor(doc: PrismicSlide) {
  const { data } = doc;
  const size = data.orientation === "Constrained" ? "contained" : "fullBleed";
  if (data.media_type === "Video" && data.video?.url) {
    return {
      _type: "slideMedia",
      _key: key(),
      size,
      media: {
        _type: "media",
        mediaType: "video",
        video: { _type: "file", asset: { _type: "reference", _ref: await upload("file", data.video.url) } },
      },
    };
  }
  if (data.image?.url) {
    return {
      _type: "slideMedia",
      _key: key(),
      size,
      media: {
        _type: "media",
        mediaType: "image",
        image: {
          _type: "image",
          asset: { _type: "reference", _ref: await upload("image", data.image.url) },
          ...(data.image.alt ? { alt: data.image.alt } : {}),
        },
      },
    };
  }
  return null;
}

async function main() {
  const docs = await prismicDocuments();
  const homepage = docs.find((d): d is PrismicHomepage => d.type === "homepage");
  const slides = docs.filter((d): d is PrismicSlide => d.type === "project");
  const homepageOrder = new Map(
    (homepage?.data.projects ?? []).map((p, i) => [p.project?.id ?? "", i]),
  );
  console.log(`Prismic: ${slides.length} slides`);

  // Group slides into projects: homepage order first, then oldest first.
  const groups = new Map<string, { group: Group; docs: PrismicSlide[] }>();
  for (const doc of slides) {
    const description = doc.data.description?.trim() ?? "";
    const rule = RULES.find(([pattern]) => pattern.test(description));
    if (!rule) {
      console.warn(`  ! no project for “${description}” (${doc.id}), skipped`);
      continue;
    }
    const entry = groups.get(rule[1].slug) ?? { group: rule[1], docs: [] };
    entry.docs.push(doc);
    groups.set(rule[1].slug, entry);
  }

  const order = (doc: PrismicSlide) => homepageOrder.get(doc.id) ?? Infinity;
  const categoryId = (slug: string) => `category-${slug}`;

  const transaction = client.transaction();

  CATEGORIES.forEach((category, i) => {
    transaction.createOrReplace({
      _id: categoryId(category.slug),
      _type: "category",
      title: category.title,
      slug: { _type: "slug", current: category.slug },
      order: i + 1,
    });
  });

  const projectSlides = new Map<string, Awaited<ReturnType<typeof slideFor>>[]>();

  for (const { group, docs: groupDocs } of groups.values()) {
    console.log(`${group.title} (${groupDocs.length})`);
    groupDocs.sort(
      (a, b) =>
        order(a) - order(b) || a.first_publication_date.localeCompare(b.first_publication_date),
    );
    const projectSlideList = [];
    for (const doc of groupDocs) {
      const slide = await slideFor(doc);
      if (slide) projectSlideList.push(slide);
    }
    projectSlides.set(group.slug, projectSlideList);

    const credits = new Map<string, Set<string>>();
    for (const doc of groupDocs) {
      for (const [pattern, toCredit] of CREDIT_RULES) {
        const match = doc.data.description?.match(pattern);
        if (match) {
          const { role, name } = toCredit(match);
          credits.set(role, (credits.get(role) ?? new Set()).add(name));
        }
      }
    }
    const externalLink = groupDocs.map((d) => d.data.external_link?.url).find(Boolean);
    const category = group.discipline ? DISCIPLINE_CATEGORY[group.discipline] : undefined;

    transaction.createOrReplace({
      _id: `project-${group.slug}`,
      _type: "project",
      title: group.title,
      slug: { _type: "slug", current: group.slug },
      hidden: !group.visible,
      ...(group.slug === "thomas-pierre-jean"
        ? { backgroundColor: "#141414", textColor: "#ffffff" }
        : {}),
      ...(group.discipline ? { discipline: group.discipline } : {}),
      ...(category
        ? { categories: [{ _type: "reference", _key: key(), _ref: categoryId(category) }] }
        : {}),
      slides: projectSlideList,
      ...(credits.size
        ? {
            credits: [...credits].map(([role, names]) => ({
              _type: "credit",
              _key: key(),
              role,
              names: [...names],
            })),
          }
        : {}),
      ...(externalLink ? { externalLink } : {}),
    });
  }

  // Naburn is in the design but not in Prismic: a hidden stub for Luke to fill in.
  transaction.createOrReplace({
    _id: "project-naburn",
    _type: "project",
    title: "Naburn",
    slug: { _type: "slug", current: "naburn" },
    hidden: true,
    discipline: "Brand Identity",
    categories: [{ _type: "reference", _key: key(), _ref: categoryId("brand-identity") }],
  });

  const allSlugs = [...groups.keys(), "naburn"];
  const indexSlugs = [
    ...INDEX_ORDER.filter((slug) => allSlugs.includes(slug)),
    ...allSlugs.filter((slug) => !INDEX_ORDER.includes(slug)),
  ];
  transaction.createOrReplace({
    _id: "projectIndex",
    _type: "projectIndex",
    projects: indexSlugs.map((slug) => ({
      _type: "reference",
      _key: key(),
      _ref: `project-${slug}`,
    })),
  });

  // Homepage features use each project's first images until Luke picks the real ones.
  transaction.createOrReplace({
    _id: "homepage",
    _type: "homepage",
    features: FEATURES.flatMap(({ slug, layout }) => {
      const media = (projectSlides.get(slug) ?? []).flatMap((s) => (s ? [s.media] : []));
      if (!media.length) return [];
      return [
        {
          _type: "feature",
          _key: key(),
          project: { _type: "reference", _ref: `project-${slug}` },
          layout: layout === "pair" && media.length > 1 ? "pair" : "single",
          media: media[0],
          ...(layout === "pair" && media.length > 1 ? { secondMedia: media[1] } : {}),
        },
      ];
    }),
  });

  // Copy from the Figma profile frame, word for word.
  const line = (label: string, href?: string) => ({
    _type: "link",
    _key: key(),
    label,
    ...(href ? { href } : {}),
  });
  const detail = (heading: string, lines: ReturnType<typeof line>[]) => ({
    _type: "profileDetail",
    _key: key(),
    heading,
    lines,
  });
  transaction.createOrReplace({
    _id: "profile",
    _type: "profile",
    sections: [
      {
        _type: "profileSection",
        _key: key(),
        body: "Luke Robertson Studio is a Paris-based creative consultancy shaping brands through identity, campaigns and experiences. We design considered and powerful communications across fashion, luxury, technology, culture and commerce, working with clients at moments of invention and reinvention.",
      },
      {
        _type: "profileSection",
        _key: key(),
        heading: "Approach",
        body: "Ideas-led and craft-driven, our approach adapts to the evolving needs of each project, creating distinctive work built to endure across formats, platforms and experiences.",
      },
      {
        _type: "profileSection",
        _key: key(),
        heading: "Network",
        body: "We build bespoke teams around each project, partnering with a trusted network of strategists, developers, photographers, typographers, spatial designers and copywriters to bring the right expertise to every brief.",
      },
    ],
    columns: [
      {
        _type: "profileColumn",
        _key: key(),
        details: [
          detail("Enquiries", [line("info@lukerobertson.studio", "mailto:info@lukerobertson.studio")]),
          detail("Follow", [
            line("Instagram", "https://www.instagram.com/lukerobertsonstudio/"),
            line("Linkedin"),
          ]),
          detail("Business hours", [line("9.30am – 6pm (CET)"), line("Mon — Fri")]),
        ],
      },
      {
        _type: "profileColumn",
        _key: key(),
        details: [
          detail(
            "Services",
            [
              "Creative direction",
              "Visual identity",
              "Strategy & positioning",
              "Digital & web design",
              "Editorial design",
              "Print production",
              "Packaging design",
              "Type design",
              "Signage & wayfinding",
            ].map((label) => line(label)),
          ),
        ],
      },
    ],
  });

  transaction.createOrReplace({
    _id: "siteSettings",
    _type: "siteSettings",
    siteCreditLink: "https://ap.ltd",
    seo: {
      _type: "seo",
      title: "Luke Robertson Studio",
      ...(homepage?.data.meta_description
        ? { description: homepage.data.meta_description }
        : {}),
    },
  });

  const result = await transaction.commit();
  console.log(`Done: ${result.results.length} documents written, ${uploaded.size} files copied.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
