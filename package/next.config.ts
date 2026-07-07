
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',

  eslint:     { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors:  true },
  compress:   true,

  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 7,
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

  experimental: {
    optimizePackageImports: ['@iconify/react', 'lucide-react'],
  },

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
      {
        source: '/images/(.*)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/api/products(.*)',
        headers: [{ key: 'Cache-Control', value: 'public, s-maxage=300, stale-while-revalidate=600' }],
      },
    ];
  },

  async redirects() {
    return [

      // ── www → non-www canonical ───────────────────────────────────────────
      {
        source:      '/:path*',
        has:         [{ type: 'host', value: 'www.satyajan.com' }],
        destination: 'https://satyajan.com/:path*',
        permanent:   true,
      },

      // ── Old .html pages ───────────────────────────────────────────────────
      { source: '/technology.html', destination: '/about',                   permanent: true },
      { source: '/blog.html',       destination: '/blog',                    permanent: true },
      { source: '/Careers.html',    destination: '/careers',                 permanent: true },
      { source: '/index.html',      destination: '/',                        permanent: true },
      { source: '/about.html',      destination: '/about',                   permanent: true },
      { source: '/solar-1.html',    destination: '/products?category=Solar', permanent: true },

      // ── FIX: /contact was 404 — site uses /contactus ──────────────────────
      { source: '/contact.html',    destination: '/contactus',               permanent: true },
      { source: '/contact',         destination: '/contactus',               permanent: true },

      // ── Trailing slash redirects ──────────────────────────────────────────
      { source: '/products/',   destination: '/products',   permanent: true },
      { source: '/blog/',       destination: '/blog',       permanent: true },
      { source: '/about/',      destination: '/about',      permanent: true },
      { source: '/contactus/',  destination: '/contactus',  permanent: true },
      { source: '/faqs/',       destination: '/faqs',       permanent: true },
      { source: '/careers/',    destination: '/careers',    permanent: true },
      { source: '/services/',   destination: '/services',   permanent: true },

      // ── FIX: Deleted product slugs → relevant category pages ─────────────
      // These were indexed by Google but no longer exist in the DB.
      {
        source:      '/products/microtek-jumbo-new-3500-24v-100ah-lithium-battery-combo',
        destination: '/products?category=New+Lithium+Battery',
        permanent:   true,
      },
      {
        source:      '/products/microtek-jumbo-ups-4000-48v-100ah-lithium-battery-combo',
        destination: '/products?category=New+Lithium+Battery',
        permanent:   true,
      },
      {
        source:      '/products/microtek-512v-100ah-lithium-battery-lifepo4',
        destination: '/products?category=New+Lithium+Battery',
        permanent:   true,
      },
      {
        source:      '/products/microtek-combo-luxe-1900-pure-sine-wave-inverterups-1650va-24v-256v-100ah-lifepo4-battery-256kwh-',
        destination: '/products?category=Combo',
        permanent:   true,
      },
      {
        source:      '/products/microtek-jumbo-ups-2500-24v-100ah-lithium-battery-combo',
        destination: '/products?category=New+Lithium+Battery',
        permanent:   true,
      },
      {
        source:      '/products/microtek-jumbo-ups-5500-48v-100ah-lithium-battery-combo',
        destination: '/products?category=New+Lithium+Battery',
        permanent:   true,
      },
      {
        source:      '/products/microtek-jumbo-new-3000-24v-100ah-lithium-battery-combo',
        destination: '/products?category=New+Lithium+Battery',
        permanent:   true,
      },
      {
        source:      '/products/microtek-msmf-72-12-12v-72ah-sealed-maintenance-free-vrla-battery',
        destination: '/products?category=Battery',
        permanent:   true,
      },
      {
        source:      '/products/microtek-dura-strong-m2203624tt-220ah-tall-tubular-inverter-battery-with-adc-tec',
        destination: '/products?category=Battery',
        permanent:   true,
      },

      // ── FIX: Old MongoDB ObjectID 404 URLs → /products ────────────────────
      // From "Not found (404)" GSC report
      {
        source:      '/products/68f9c60f901822815a053ef2',
        destination: '/products',
        permanent:   true,
      },
      {
        source:      '/products/6904529f70a71d5331b58f0b',
        destination: '/products',
        permanent:   true,
      },
      {
        source:      '/products/68f9c6b49039fc1f4ccf1b63',
        destination: '/products',
        permanent:   true,
      },
    ];
  },
};

export default nextConfig;