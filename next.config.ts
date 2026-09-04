import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  experimental: {
    serverActions: {
      // Default is 1MB — too small for real product/content photos (a
      // phone camera easily produces 3-10MB) or the short hero video clip,
      // which would silently fail at the framework level before the
      // upload actions' own size checks ever run. Sized for the video
      // check's 30MB limit, with headroom for multipart overhead.
      bodySizeLimit: "35mb",
    },
  },
};

export default nextConfig;
