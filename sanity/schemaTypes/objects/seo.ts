import { defineType, defineField } from "sanity";

export const seo = defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  fields: [
    defineField({
      name: "title",
      type: "string",
      description: "Browser tab, search results, and social share title.",
    }),
    defineField({
      name: "description",
      type: "text",
      rows: 3,
      description: "Search snippet and social share description.",
    }),
    defineField({
      name: "openGraphImage",
      title: "Social image",
      type: "image",
      description: "Recommended 1200×630px. Used when this page is shared.",
      options: { hotspot: true },
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "openGraphImage",
    },
    prepare({ title, media }) {
      return {
        title: title?.trim() || "SEO",
        media,
      };
    },
  },
});
