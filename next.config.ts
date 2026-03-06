import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com", // Google OAuth avatars
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com", // If using Cloudinary for uploads
      },
      {
        protocol: "https",
        hostname: "utfs.io", // If using Uploadthing
      },
      {
        protocol: "https",
        hostname: "cdn.vectorstock.com", // External demo/seed event images
      },
    ],
  },
};

export default nextConfig;
