import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Avoid server-side image optimization on Render.
    // Static files are served directly instead of being decoded/resized in memory.
    unoptimized: true
  }
};

export default nextConfig;
