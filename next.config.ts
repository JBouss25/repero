import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  poweredByHeader: false,
  // CORRECTION : sortir de experimental et renommer
  serverExternalPackages: ['openid-client'],
};

export default nextConfig;