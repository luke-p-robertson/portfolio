import { defineArrayMember, defineField, defineType } from "sanity";

/** A labeled group of names on a project's info slide, e.g. Photography → Annika Kafcaloudis. */
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
      of: [defineArrayMember({ type: "link" })],
      description: "One per name. Add a URL to make a name a link.",
      validation: (rule) => rule.min(1),
    }),
  ],
  preview: {
    select: { title: "role", names: "names" },
    prepare({ title, names }) {
      const labels = Array.isArray(names)
        ? names.map((name) => (typeof name === "string" ? name : name?.label)).filter(Boolean)
        : [];
      return { title, subtitle: labels.length ? labels.join(", ") : undefined };
    },
  },
});
