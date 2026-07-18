// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // ... your existing config
  experimental: {
    // Add this to handle font issues
    optimizePackageImports: ['@next/font'],
  },
  // Disable Turbopack for build if needed (not recommended for production)
  // turbopack: false,
};

export default nextConfig;