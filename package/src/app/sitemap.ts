// app/sitemap.ts
// Generates /sitemap.xml automatically — all 101 products + static pages
// Google will discover and index every product URL.

import { MetadataRoute } from 'next';

let prisma: any = null;
async function getPrisma() {
  if (!process.env.DATABASE_URL) return null;
  if (prisma) return prisma;
  try {
    const { PrismaClient } = await import('@prisma/client');
    prisma = new PrismaClient();
    return prisma;
  } catch { return null; }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const BASE = 'https://satyajan.com';

  // ── Static pages ────────────────────────────────────────────────────────────
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
      url:              `${BASE}/products?category=Inverter`,
      lastModified:     new Date(),
      changeFrequency:  'weekly',
      priority:         0.85,
    },
    {
      url:              `${BASE}/products?category=Battery`,
      lastModified:     new Date(),
      changeFrequency:  'weekly',
      priority:         0.85,
    },
    {
      url:              `${BASE}/products?category=ONLINE+UPS`,
      lastModified:     new Date(),
      changeFrequency:  'weekly',
      priority:         0.8,
    },
    {
      url:              `${BASE}/products?category=Solar`,
      lastModified:     new Date(),
      changeFrequency:  'weekly',
      priority:         0.8,
    },
    {
      url:              `${BASE}/products?category=High+Capacity+UPS`,
      lastModified:     new Date(),
      changeFrequency:  'weekly',
      priority:         0.8,
    },
    {
      url:              `${BASE}/products?category=New+Lithium+Battery`,
      lastModified:     new Date(),
      changeFrequency:  'weekly',
      priority:         0.8,
    },
    {
      url:              `${BASE}/blog`,
      lastModified:     new Date(),
      changeFrequency:  'weekly',
      priority:         0.7,
    },
    {
      url:              `${BASE}/about`,
      lastModified:     new Date(),
      changeFrequency:  'monthly',
      priority:         0.5,
    },
    {
      url:              `${BASE}/contact`,
      lastModified:     new Date(),
      changeFrequency:  'monthly',
      priority:         0.5,
    },
  ];

  // ── Dynamic product pages ────────────────────────────────────────────────────
  let productPages: MetadataRoute.Sitemap = [];

  try {
    const db = await getPrisma();
    if (db) {
      const products = await db.product.findMany({
        select: { id: true, slug: true, updatedAt: true, category: true },
      });

      productPages = products.map((p: any) => {
        // Use slug if available, fall back to MongoDB id
        const identifier = p.slug || p.id;
        return {
          url:             `${BASE}/products/${identifier}`,
          lastModified:    p.updatedAt ? new Date(p.updatedAt) : new Date(),
          changeFrequency: 'weekly' as const,
          priority:        0.8,
        };
      });
    }
  } catch (e) {
    console.error('[sitemap] DB error:', e);
    // Fallback: import mock products so sitemap always has content
    try {
      const { mockProducts } = await import('@/mock/products');
      productPages = (mockProducts as any[]).map((p) => ({
        url:             `${BASE}/products/${p.slug || p.id}`,
        lastModified:    new Date(),
        changeFrequency: 'weekly' as const,
        priority:        0.8,
      }));
    } catch {}
  }

  return [...staticPages, ...productPages];
}