import { defineArrayMember, defineField, defineType } from "sanity";

export const profile = defineType({
  name: "profile",
  title: "Profile",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "seo", title: "SEO & social" },
  ],
  fields: [
    defineField({
      name: "sections",
      title: "Text",
      type: "array",
      of: [defineArrayMember({ type: "profileSection" })],
      description: "The large text on the right. Leave the first section’s heading empty.",
      group: "content",
    }),
    defineField({
      name: "columns",
      title: "Details",
      type: "array",
      of: [defineArrayMember({ type: "profileColumn" })],
      description: "The small columns on the left (Enquiries, Follow, Business hours; Services).",
      validation: (rule) => rule.max(2),
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
      return { title: "Profile" };
    },
  },
});
