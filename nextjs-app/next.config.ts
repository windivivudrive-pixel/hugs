import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow external images from WordPress uploads
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  // Optimize for Vercel deployment
  serverExternalPackages: ['mysql2', 'ssh2'],
};

export default nextConfig;
