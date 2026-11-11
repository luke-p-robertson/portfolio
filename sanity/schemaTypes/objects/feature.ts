import { defineField, defineType } from "sanity";

/** One block of the homepage's featured scroll. */
export const feature = defineType({
  name: "feature",
  title: "Feature",
  type: "object",
  fields: [
    defineField({
      name: "project",
      title: "Project",
      type: "reference",
      to: [{ type: "project" }],
      description: "Opens when the feature is clicked. Its title is the caption.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "layout",
      title: "Layout",
      type: "string",
      options: {
        list: [
          { title: "Single — one full-width image", value: "single" },
          { title: "Pair — two images side by side", value: "pair" },
        ],
        layout: "radio",
      },
      initialValue: "single",
    }),
    defineField({
      name: "media",
      title: "Image / video",
      type: "media",
      description: "Desktop. Fills the screen and crops to fit, so landscape works best. Pair: the left half.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "secondMedia",
      title: "Second image / video",
      type: "media",
      description: "The right half of a pair; portrait works best.",
      hidden: ({ parent }) => parent?.layout !== "pair",
    }),
    defineField({
      name: "mobileMedia",
      title: "Mobile image / video",
      type: "media",
      description:
        "Optional. Shown instead on phones, filling the screen (portrait, about 9:16). Without it, the desktop image is cropped to fit.",
    }),
  ],
  preview: {
    select: {
      title: "project.title",
      layout: "layout",
      image: "media.image",
      poster: "media.poster",
    },
    prepare({ title, layout, image, poster }) {
      return {
        title: title || "Feature",
        subtitle: layout === "pair" ? "Pair" : "Single",
        media: image ?? poster,
      };
    },
  },
});
