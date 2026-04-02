import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'www.microtek.in',     pathname: '/**' },
      { protocol: 'https', hostname: 'cms.microtek.in',     pathname: '/**' },
      { protocol: 'https', hostname: 'microtek.in',         pathname: '/**' },
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
      { protocol: 'https', hostname: '*.unsplash.com',      pathname: '/**' },
    ],
  },
  async headers() {
    return [
      {
        // ✅ Override for image proxy FIRST (before the catch-all)
        source: '/api/image-proxy',
        headers: [
          { key: 'Referrer-Policy', value: 'unsafe-url' },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options',           value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options',    value: 'nosniff' },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
          { key: 'Referrer-Policy',           value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy',        value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
      {
        source: '/images/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source:      '/:path*',
        has:         [{ type: 'host', value: 'www.satyajan.com' }],
        destination: 'https://satyajan.com/:path*',
        permanent:   true,
      },
    ];
  },
};

export default nextConfig;