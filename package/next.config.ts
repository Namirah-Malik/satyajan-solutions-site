import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',

  eslint: {
    ignoreDuringBuilds: true,
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  // ── Compression ───────────────────────────────────────────────────────────
  compress: true,

  images: {
    // Direct CDN URLs — no Next.js optimization layer (required for Google Merchant Center)
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'www.microtek.in',    pathname: '/**' },
      { protocol: 'https', hostname: 'cms.microtek.in',    pathname: '/**' },
      { protocol: 'https', hostname: 'microtek.in',        pathname: '/**' },
      { protocol: 'https', hostname: 'images.unsplash.com',pathname: '/**' },
      { protocol: 'https', hostname: '*.unsplash.com',     pathname: '/**' },
    ],
  },

  // ── Security + SEO Headers ────────────────────────────────────────────────
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options',              value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options',        value: 'nosniff' },
          { key: 'Strict-Transport-Security',     value: 'max-age=31536000; includeSubDomains' },
          { key: 'Referrer-Policy',               value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy',            value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
      // Cache static assets aggressively
      {
        source: '/images/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },

  // ── Redirects ─────────────────────────────────────────────────────────────
  async redirects() {
    return [
      // 1. www → non-www canonical
      {
        source:      '/:path*',
        has:         [{ type: 'host', value: 'www.satyajan.com' }],
        destination: 'https://satyajan.com/:path*',
        permanent:   true,
      },
      // 2. Old HTML site pages → new Next.js equivalents
      { source: '/technology.html', destination: '/about',                        permanent: true },
      { source: '/blog.html',       destination: '/blog',                         permanent: true },
      { source: '/Careers.html',    destination: '/careers',                      permanent: true },
      { source: '/solar-1.html',    destination: '/products?category=Solar',      permanent: true },
      { source: '/index.html',      destination: '/',                             permanent: true },
      { source: '/contact.html',    destination: '/contact',                      permanent: true },
      { source: '/about.html',      destination: '/about',                        permanent: true },
      // 3. Trailing slash normalisation
      { source: '/products/',       destination: '/products',                     permanent: true },
      { source: '/blog/',           destination: '/blog',                         permanent: true },
    ];
  },
};

export default nextConfig;