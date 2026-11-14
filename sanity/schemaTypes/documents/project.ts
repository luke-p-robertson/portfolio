import { defineArrayMember, defineField, defineType } from "sanity";
import type { StringRule } from "sanity";

import { slideArrayMembers } from "../objects/slides";

const HEX_COLOR = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i;

function hexColor(rule: StringRule) {
  return rule.custom((value) =>
    !value || HEX_COLOR.test(value.trim()) ? true : "Use a hex code like #141414 or #fff.",
  );
}

export const project = defineType({
  name: "project",
  title: "Project",
  type: "document",
  groups: [
    { name: "general", title: "General", default: true },
    { name: "slides", title: "Slides" },
    { name: "info", title: "Info" },
    { name: "seo", title: "SEO & social" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "The client or project name. The header reads “Luke Robertson Studio for …”.",
      group: "general",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "URL",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      group: "general",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "hidden",
      title: "Hide from the site",
      type: "boolean",
      description: "Keeps the project out of the index and its page offline.",
      initialValue: false,
      group: "general",
    }),
    defineField({
      name: "discipline",
      title: "Discipline",
      type: "string",
      description: "The gray line under the title in the index, e.g. Brand Identity, Website.",
      group: "general",
    }),
    defineField({
      name: "categories",
      title: "Filter categories",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "category" }] })],
      description: "Which filters on the Projects page show this project.",
      group: "general",
    }),
    defineField({
      name: "thumbnail",
      title: "Index image or video",
      type: "media",
      description:
        "Shown in the Projects index, cropped to 4:5. A video loops silently while it's on screen. Without one, the first slide is used.",
      group: "general",
    }),
    defineField({
      name: "backgroundColor",
      title: "Background color",
      type: "string",
      description: "Hex code for the project page, e.g. #141414. Leave empty for white.",
      validation: hexColor,
      group: "general",
    }),
    defineField({
      name: "textColor",
      title: "Text color",
      type: "string",
      description: "Hex code for the header, counter and info text, e.g. #ffffff. Leave empty for black.",
      validation: hexColor,
      group: "general",
    }),
    defineField({
      name: "headline",
      title: "Headline",
      type: "text",
      rows: 2,
      description:
        "One sentence that sums up the project, e.g. “A botanical take on the language of wine”. It fades in when the project opens, then fades away to the first slide.",
      group: "slides",
    }),
    defineField({
      name: "slides",
      title: "Slides",
      type: "array",
      of: slideArrayMembers,
      description:
        "The case study slideshow, in order. The Info slide (scope, credits, description) is added after the last one.",
      group: "slides",
    }),
    defineField({
      name: "scope",
      title: "Scope",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      description: "e.g. Brand identity, Brand guidelines, Packaging design",
      group: "info",
    }),
    defineField({
      name: "credits",
      title: "Credits",
      type: "array",
      of: [defineArrayMember({ type: "credit" })],
      group: "info",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "blockContent",
      group: "info",
    }),
    defineField({
      name: "externalLink",
      title: "External link",
      type: "url",
      description: "The client’s site, if any. Not shown yet; kept from the previous site.",
      group: "info",
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
      group: "seo",
    }),
  ],
  preview: {
    select: {
      title: "title",
      discipline: "discipline",
      hidden: "hidden",
      image: "thumbnail.image",
      poster: "thumbnail.poster",
    },
    prepare({ title, discipline, hidden, image, poster }) {
      return {
        title,
        subtitle: [discipline, hidden ? "Hidden" : null].filter(Boolean).join(" · "),
        media: image ?? poster,
      };
    },
  },
});
