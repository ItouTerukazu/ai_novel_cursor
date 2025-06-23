import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    // Enable experimental features if needed
  },
  // Custom server configuration
  async rewrites() {
    return [
      // API routes for AG-UI Protocol
      {
        source: '/api/agents/:path*',
        destination: '/api/agents/:path*',
      },
    ];
  },
  // Environment variables
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:5000',
  },
};

export default nextConfig;
