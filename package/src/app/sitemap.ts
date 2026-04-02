/**
 * sitemap.ts  –  Auto-generated XML sitemap
 * ─────────────────────────────────────────────────────────────
 * Deploy to: src/app/sitemap.ts
 *
 * Next.js serves this at: https://satyajan.com/sitemap.xml
 * Submit that URL in Google Search Console.
 */

import { MetadataRoute } from 'next';
import { SEO } from '@/lib/seo.config';
import { existingBlogs } from '@/components/Blog/blogdata';

const BASE = SEO.domain;

// ── Static pages ──────────────────────────────────────────────────────────────
const staticPages: MetadataRoute.Sitemap = [
  {
    url:              `${BASE}/`,
    lastModified:     new Date(),
    changeFrequency:  'weekly',
    priority:         1.0,
  },
  {
    url:              `${BASE}/products`,
    lastModified:     new Date(),
    changeFrequency:  'daily',
    priority:         0.9,
  },
  {
    url:              `${BASE}/services`,
    lastModified:     new Date(),
    changeFrequency:  'monthly',
    priority:         0.8,
  },
  {
    url:              `${BASE}/blogs`,
    lastModified:     new Date(),
    changeFrequency:  'daily',
    priority:         0.8,
  },
  {
    url:              `${BASE}/careers`,
    lastModified:     new Date(),
    changeFrequency:  'weekly',
    priority:         0.6,
  },
  {
    url:              `${BASE}/contactus`,
    lastModified:     new Date(),
    changeFrequency:  'yearly',
    priority:         0.5,
  },
  {
    url:              `${BASE}/technology`,
    lastModified:     new Date(),
    changeFrequency:  'monthly',
    priority:         0.7,
  },
];

// ── Blog posts ────────────────────────────────────────────────────────────────
const blogPages: MetadataRoute.Sitemap = existingBlogs.map((post: any) => ({
  url:             `${BASE}/blogs/${post.slug}`,
  lastModified:    new Date(post.publishedDate ?? Date.now()),
  changeFrequency: 'monthly' as const,
  priority:        0.7,
}));

// ── Products (fetched from live API so slugs are always fresh) ────────────────
async function getProductPages(): Promise<MetadataRoute.Sitemap> {
  try {
    const res = await fetch(`${BASE}/api/products`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const products: any[] = await res.json();
    return products
      .filter((p) => p.slug)   // only include products that have a readable slug
      .map((p) => ({
        url:             `${BASE}/products/${p.slug}`,
        lastModified:    new Date(),
        changeFrequency: 'weekly' as const,
        priority:        0.8,
      }));
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const productPages = await getProductPages();
  return [...staticPages, ...blogPages, ...productPages];
}