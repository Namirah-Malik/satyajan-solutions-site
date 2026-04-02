/**
 * robots.ts
 * ─────────────────────────────────────────────────────────────
 * Deploy to: src/app/robots.ts
 *
 * Next.js serves this at: https://satyajan.com/robots.txt
 */

import { MetadataRoute } from 'next';
import { SEO } from '@/lib/seo.config';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        // Allow all crawlers to index the site
        userAgent: '*',
        allow:     '/',
        disallow: [
          '/api/',          // never index raw API endpoints
          '/admin/',        // admin pages if any
          '/_next/',        // Next.js internals
          '/career/apply',  // form pages — no SEO value
        ],
      },
    ],
    sitemap: `${SEO.domain}/sitemap.xml`,
    host:    SEO.domain,
  };
}