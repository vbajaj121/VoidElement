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
      // phone camera easily produces 3-10MB), which silently fail at the
      // framework level before uploadProductImage's own 10MB check ever
      // runs. Leaves headroom over that 10MB check for multipart overhead.
      bodySizeLimit: "11mb",
    },
  },
};

export default nextConfig;
