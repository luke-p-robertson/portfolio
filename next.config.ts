import path from "node:path";
import type { NextConfig } from "next";

import { SITE_ORIGIN } from "./lib/siteUrl";
import { SANITY_PROJECT_ID, SANITY_DATASET } from "./sanity/lib/projectId";

const nextConfig: NextConfig = {
  // Public, non-secret config baked in so the app runs without a per-developer `.env`.
  env: {
    NEXT_PUBLIC_SITE_URL: SITE_ORIGIN,
    NEXT_PUBLIC_SANITY_PROJECT_ID: SANITY_PROJECT_ID,
    NEXT_PUBLIC_SANITY_DATASET: SANITY_DATASET,
  },
  sassOptions: {
    includePaths: [path.join(process.cwd(), "node_modules")],
  },
  images: {
    // Every image is resized and encoded by Sanity's CDN (lib/sanityImageLoader.ts), not
    // by Vercel's image optimiser.
    loader: "custom",
    loaderFile: "./lib/sanityImageLoader.ts",
    deviceSizes: [640, 750, 828, 1080, 1200, 1280, 1920, 2560],
    imageSizes: [96, 160, 256, 384, 480, 640, 750, 828, 960, 1080, 1200],
  },
  async headers() {
    return [
      {
        source: "/fonts/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },
  webpack(config) {
    const fileLoaderRule = config.module.rules.find((rule: unknown) => {
      const typedRule = rule as {
        test?: RegExp;
      };
      return typedRule.test instanceof RegExp && typedRule.test.test(".svg");
    }) as
      | {
          issuer?: unknown;
          exclude?: RegExp;
        }
      | undefined;

    config.module.rules.push(
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/,
      },
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule?.issuer,
        resourceQuery: { not: [/url/] },
        use: ["@svgr/webpack"],
      }
    );

    if (fileLoaderRule) {
      fileLoaderRule.exclude = /\.svg$/i;
    }

    return config;
  },
};

export default nextConfig;
