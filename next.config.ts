import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
 images: {
  remotePatterns: [{ protocol: "https", hostname: "res.cloudinary.com" }],
},
experimental: {
  serverActions: { bodySizeLimit: "10mb" },
},


  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
