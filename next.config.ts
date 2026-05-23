import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [{ source: "/favicon.ico", destination: "/icon" }];
  },
  images: {
    // Avoid server-side image optimization on Render.
    // Static files are served directly instead of being decoded/resized in memory.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.yanazubareva.com"
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**"
      }
    ]
  }
};

export default nextConfig;
