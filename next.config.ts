import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Allow any HTTPS image host
      },
    ],
  },
};

export default nextConfig;
