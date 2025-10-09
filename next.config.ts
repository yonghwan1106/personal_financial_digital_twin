import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Allow production builds with ESLint warnings
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
