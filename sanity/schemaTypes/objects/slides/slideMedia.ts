import { defineField, defineType } from "sanity";

/** One slide: an image or video, shown at full height between the header and thumbnails. */
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
  ],
  preview: {
    select: {
      mediaType: "media.mediaType",
      image: "media.image",
      poster: "media.poster",
    },
    prepare({ mediaType, image, poster }) {
      return {
        title: mediaType === "video" ? "Video" : "Image",
        media: mediaType === "video" ? poster : image,
      };
    },
  },
});
