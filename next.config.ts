import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  poweredByHeader: false,
  turbopack: false, // Force Webpack au lieu de Turbopack

  serverExternalPackages: ['openid-client'],
  experimental: {
    serverMinification: false,
  },
};

export default nextConfig;