// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['@next/font'],
  },
  serverExternalPackages: ['k2-connect-node'],
};

export default nextConfig;