import { defineField, defineType } from "sanity";

export const slideMedia = defineType({
  name: "slideMedia",
  title: "Image / video",
  type: "object",
  fields: [
    defineField({
      name: "media",
      title: "Media",
      type: "media",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "size",
      title: "Size",
      type: "string",
      options: {
        list: [
          { title: "Contained — whole image, between header and thumbnails", value: "contained" },
          { title: "Full bleed — fills the screen, may crop", value: "fullBleed" },
        ],
        layout: "radio",
      },
      initialValue: "contained",
    }),
  ],
  preview: {
    select: {
      mediaType: "media.mediaType",
      image: "media.image",
      poster: "media.poster",
      size: "size",
    },
    prepare({ mediaType, image, poster, size }) {
      return {
        title: mediaType === "video" ? "Video" : "Image",
        subtitle: size === "fullBleed" ? "Full bleed" : "Contained",
        media: mediaType === "video" ? poster : image,
      };
    },
  },
});
