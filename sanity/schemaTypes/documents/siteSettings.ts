import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  groups: [
    { name: "general", title: "General", default: true },
    { name: "screensaver", title: "Screen saver" },
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
      name: "screensaverQuote",
      title: "Quote",
      type: "text",
      rows: 2,
      description:
        "Fades in over the whole page on desktop after 20 seconds without a mouse move, scroll or key press, and goes as soon as there is one. The quote marks are added for you, so type just the words, e.g. All things are delicately interconnected. Leave empty to turn the screen saver off.",
      group: "screensaver",
    }),
    defineField({
      name: "screensaverAttribution",
      title: "Attribution",
      type: "string",
      description: "The line under the quote, after a dash, e.g. Jenny Holzer.",
      group: "screensaver",
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
