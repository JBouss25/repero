import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  poweredByHeader: false,
  serverExternalPackages: ['openid-client'],
  experimental: {
    serverMinification: false,
  },
};

export default nextConfig;