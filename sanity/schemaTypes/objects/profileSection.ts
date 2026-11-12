import { defineArrayMember, defineField, defineType } from "sanity";

/** A paragraph of the profile text, with an optional gray heading (Approach, Network). */
export const profileSection = defineType({
  name: "profileSection",
  title: "Section",
  type: "object",
  fields: [
    defineField({ name: "heading", title: "Heading", type: "string" }),
    defineField({
      name: "body",
      title: "Text",
      type: "text",
      rows: 5,
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "heading", subtitle: "body" },
    prepare({ title, subtitle }) {
      return { title: title || "Introduction", subtitle };
    },
  },
});

/** A labeled list on the profile page (Enquiries, Follow, Services…). */
export const profileDetail = defineType({
  name: "profileDetail",
  title: "Detail",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "lines",
      title: "Lines",
      type: "array",
      of: [defineArrayMember({ type: "link" })],
      description: "One per line. Add a URL to make a line a link.",
    }),
  ],
  preview: {
    select: { title: "heading" },
  },
});

/** One column of profile details. */
export const profileColumn = defineType({
  name: "profileColumn",
  title: "Column",
  type: "object",
  fields: [
    defineField({
      name: "details",
      title: "Details",
      type: "array",
      of: [defineArrayMember({ type: "profileDetail" })],
    }),
  ],
  preview: {
    select: { first: "details.0.heading", second: "details.1.heading" },
    prepare({ first, second }) {
      return { title: [first, second].filter(Boolean).join(", ") || "Column" };
    },
  },
});
