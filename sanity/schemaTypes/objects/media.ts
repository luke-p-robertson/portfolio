import { defineField, defineType } from "sanity";

export const media = defineType({
  name: "media",
  title: "Media",
  type: "object",
  fields: [
    defineField({
      name: "mediaType",
      title: "Media type",
      type: "string",
      options: {
        list: [
          { title: "Image", value: "image" },
          { title: "Video", value: "video" },
        ],
        layout: "radio",
      },
      initialValue: "image",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Alt text", type: "string" })],
      hidden: ({ parent }) => parent?.mediaType !== "image",
    }),
    defineField({
      name: "video",
      title: "Video",
      type: "file",
      description:
        "Plays muted on loop. Compress for web before uploading — HandBrake → MP4, H.264, “Web Optimized”, ~1080p.",
      options: { accept: "video/*" },
      hidden: ({ parent }) => parent?.mediaType !== "video",
    }),
    defineField({
      name: "poster",
      title: "Video poster",
      type: "image",
      description: "Shown while the video loads, and as the video’s thumbnail.",
      options: { hotspot: true },
      hidden: ({ parent }) => parent?.mediaType !== "video",
    }),
  ],
  preview: {
    select: { mediaType: "mediaType", image: "image", poster: "poster" },
    prepare({ mediaType, image, poster }) {
      return {
        title: mediaType === "video" ? "Video" : "Image",
        media: mediaType === "video" ? poster : image,
      };
    },
  },
});
