

import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',             // raw API endpoints — no SEO value
          '/admin/',           // admin dashboard
          '/_next/',           // Next.js internals
          '/career/apply',     // form-only page
          '/cart/',            // cart pages — not indexable
          '/payment/',         // all payment pages — not indexable
          '/payment/status',   // payment status page
          '/site.webmanifest', // PWA manifest — not a page
          '/products?search=', // search result URLs — duplicates of /products
          '/products?category=', // category filter URLs — duplicates of /products
        ],
      },
    ],
    sitemap: 'https://satyajan.com/sitemap.xml',
    host:    'https://satyajan.com',
  };
}