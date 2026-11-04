import { defineArrayMember, defineField, defineType } from "sanity";

/** A labelled group of names on a project's info slide, e.g. Photography → Annika Kafcaloudis. */
export const credit = defineType({
  name: "credit",
  title: "Credit",
  type: "object",
  fields: [
    defineField({
      name: "role",
      title: "Role",
      type: "string",
      description: "e.g. Photography, Food styling, Credits",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "names",
      title: "Names",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      validation: (rule) => rule.min(1),
    }),
  ],
  preview: {
    select: { title: "role", names: "names" },
    prepare({ title, names }) {
      return { title, subtitle: Array.isArray(names) ? names.join(", ") : undefined };
    },
  },
});
