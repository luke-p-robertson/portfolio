import { defineField, defineType } from "sanity";

export const link = defineType({
  name: "link",
  title: "Link",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "href",
      title: "URL",
      type: "url",
      description: "Optional. A page on this site (e.g. /projects), a full URL, or mailto:.",
      validation: (rule) =>
        rule.uri({ allowRelative: true, scheme: ["http", "https", "mailto", "tel"] }),
    }),
  ],
  preview: {
    select: { title: "label", subtitle: "href" },
  },
});
