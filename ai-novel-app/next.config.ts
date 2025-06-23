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
    NEXT_PUBLIC_APP_URL: process.env.NODE_ENV === 'production' 
      ? 'https://your-app.koyeb.app' 
      : 'http://localhost:5000'
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // クライアントサイドでNode.js専用モジュールを無効化
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
        crypto: false,
        stream: false,
        assert: false,
        http: false,
        https: false,
        url: false,
        zlib: false,
      };
    }
    return config;
  },
};

export default nextConfig;
