import { defineArrayMember, defineField, defineType } from "sanity";

export const projectIndex = defineType({
  name: "projectIndex",
  title: "Projects page",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "seo", title: "SEO & social" },
  ],
  fields: [
    defineField({
      name: "projects",
      title: "Projects",
      type: "array",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "project" }],
          options: { disableNew: true },
        }),
      ],
      description: "The index, in order. Drag to reorder. Hidden projects are skipped.",
      validation: (rule) => rule.unique(),
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
      return { title: "Projects page" };
    },
  },
});
