import { defineArrayMember, defineField, defineType } from "sanity";

export const homepage = defineType({
  name: "homepage",
  title: "Homepage",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "seo", title: "SEO & social" },
  ],
  fields: [
    defineField({
      name: "features",
      title: "Featured projects",
      type: "array",
      of: [defineArrayMember({ type: "feature" })],
      description: "The long scroll after the LR.S intro, top to bottom.",
      group: "content",
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
      group: "seo",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Homepage" };
    },
  },
});
