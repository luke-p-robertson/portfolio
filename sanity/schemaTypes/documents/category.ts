import { defineField, defineType } from "sanity";

/** A Projects page filter (Brand Identity, Digital, Print, Packaging). */
export const category = defineType({
  name: "category",
  title: "Filter category",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "URL",
      type: "slug",
      options: { source: "title", maxLength: 64 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      description: "Position in the filter menu (lowest first).",
    }),
  ],
  orderings: [
    { title: "Menu order", name: "order", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: {
    select: { title: "title" },
  },
});
