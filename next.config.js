const path = require("path");
const withSvgr = require("next-svgr");

/** @type {import('next').NextConfig} */
const nextConfig = withSvgr({
  env: {
    PRISMIC_REPOSITORY_NAME: "lukerobertson",
    PRISMIC_REPOSITORY_LOCALE: "en-us",
  },
  images: {
    domains: ["images.prismic.io", "lukerobertson.cdn.prismic.io"],
    formats: ["image/avif", "image/webp"],
  },
  reactStrictMode: true,
  swcMinify: true,
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
});

module.exports = nextConfig;
