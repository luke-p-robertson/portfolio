import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  groups: [
    { name: "general", title: "General", default: true },
    { name: "seo", title: "SEO & social" },
  ],
  fields: [
    defineField({
      name: "siteCreditLink",
      title: "Site credit link",
      type: "url",
      description: "Profile page “Site by AP” link.",
      group: "general",
    }),
    defineField({
      name: "seo",
      title: "Default site SEO",
      type: "seo",
      group: "seo",
      description:
        "Default title, description, and social image for any page without its own SEO values.",
    }),
  ],
  preview: {
    select: {
      seoTitle: "seo.title",
      media: "seo.openGraphImage",
    },
    prepare({ seoTitle, media }) {
      return {
        title: seoTitle?.trim() || "Site settings",
        media,
      };
    },
  },
});
