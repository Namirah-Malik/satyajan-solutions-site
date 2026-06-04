// next.config.ts
// ─────────────────────────────────────────────────────────────────────────────
// KEY CHANGE: removed `unoptimized: true`
//
// With unoptimized:true, every product image loads as the raw original file
// from microtek.in — often 300–800 KB per image.
// With Next.js image optimization enabled, images are:
//   • Automatically converted to WebP / AVIF (60–80% smaller)
//   • Resized to the exact display size (no 1200px image for a 300px card)
//   • Cached at the CDN edge after first request
//   • Lazy-loaded by default
//
// NOTE: The Card component uses a plain <img> tag with loading="lazy".
// For even better LCP, swap it to Next.js <Image> (see Card.tsx notes below).
// ─────────────────────────────────────────────────────────────────────────────

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',

  eslint:     { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors:  true },
  compress:   true,

  images: {
    // ✅ REMOVED: unoptimized: true   ← this was the #1 cause of slow images
    formats: ['image/avif', 'image/webp'],   // serve AVIF first, WebP fallback
    minimumCacheTTL: 60 * 60 * 24 * 7,      // cache optimized images for 7 days
    deviceSizes:  [320, 480, 640, 750, 828, 1080, 1200],
    imageSizes:   [16, 32, 64, 96, 128, 256, 384],
    remotePatterns: [
      { protocol: 'https', hostname: 'www.microtek.in',     pathname: '/**' },
      { protocol: 'https', hostname: 'cms.microtek.in',     pathname: '/**' },
      { protocol: 'https', hostname: 'microtek.in',         pathname: '/**' },
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
      { protocol: 'https', hostname: '*.unsplash.com',      pathname: '/**' },
    ],
  },

  // ── Experimental: faster JS bundling ─────────────────────────────────────
  experimental: {
    optimizePackageImports: ['@iconify/react', 'lucide-react'],
  },

  // ── Security + caching headers ────────────────────────────────────────────
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options',          value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options',    value: 'nosniff' },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
          { key: 'Referrer-Policy',           value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy',        value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
      // Aggressive cache for static assets
      {
        source: '/images/(.*)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      // API route caching (also set in the route handler, belt-and-suspenders)
      {
        source: '/api/products(.*)',
        headers: [{ key: 'Cache-Control', value: 'public, s-maxage=300, stale-while-revalidate=600' }],
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
      { source: '/technology.html', destination: '/about',                   permanent: true },
      { source: '/blog.html',       destination: '/blog',                    permanent: true },
      { source: '/Careers.html',    destination: '/careers',                 permanent: true },
      { source: '/solar-1.html',    destination: '/products?category=Solar', permanent: true },
      { source: '/index.html',      destination: '/',                        permanent: true },
      { source: '/contact.html',    destination: '/contact',                 permanent: true },
      { source: '/about.html',      destination: '/about',                   permanent: true },
      { source: '/products/',       destination: '/products',                permanent: true },
      { source: '/blog/',           destination: '/blog',                    permanent: true },
    ];
  },
};

export default nextConfig;