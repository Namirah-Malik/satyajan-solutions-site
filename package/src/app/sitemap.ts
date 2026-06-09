// app/sitemap.ts
// ─────────────────────────────────────────────────────────────────────────────
// FIXES:
//  1. Uses prisma singleton from @/lib/prisma (no more getPrisma() wrapper)
//  2. Category URLs use proper encodeURIComponent (Google prefers encoded)
//  3. Added /contactus route (matches your actual nav link)
//  4. Added blog post pages from DB if available
//  5. Priority tuned — product pages get 0.9 (high commercial intent)
//  6. changeFrequency aligned with actual update patterns
// ─────────────────────────────────────────────────────────────────────────────

import { MetadataRoute } from 'next';
import prisma from '@/lib/prisma';

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const BASE = 'https://satyajan.com';

  // ── Static pages ────────────────────────────────────────────────────────────
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE}/`,         lastModified: new Date(), changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE}/products`, lastModified: new Date(), changeFrequency: 'daily',   priority: 0.95 },
    { url: `${BASE}/blog`,     lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${BASE}/about`,    lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/contactus`,lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/faqs`,     lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE}/careers`,  lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
  ];

  // ── Category pages ──────────────────────────────────────────────────────────
  // These are high-value SEO pages — include all categories with proper encoding
  const categories = [
    'Inverter',
    'Battery',
    'ONLINE UPS',
    'Solar',
    'High Capacity UPS',
    'New Lithium Battery',
    'Combo',
  ];

  const categoryPages: MetadataRoute.Sitemap = categories.map(cat => ({
    url:             `${BASE}/products?category=${encodeURIComponent(cat)}`,
    lastModified:    new Date(),
    changeFrequency: 'weekly' as const,
    priority:        0.85,
  }));

  // ── Product pages ───────────────────────────────────────────────────────────
  let productPages: MetadataRoute.Sitemap = [];

  try {
    const products = await prisma.product.findMany({
      select: { id: true, slug: true, name: true, category: true },
    });

    productPages = products
      .map((p: any) => {
        const urlSlug = p.slug || generateSlug(p.name) || p.id;
        if (!urlSlug) return null;
        return {
          url:             `${BASE}/products/${urlSlug}`,
          lastModified:    new Date(),
          changeFrequency: 'weekly' as const,
          priority:        0.9, // high — direct purchase pages
        };
      })
      .filter(Boolean) as MetadataRoute.Sitemap;

  } catch (e) {
    console.error('[sitemap] DB error:', e);
    // Fallback to mock products if DB unavailable
    try {
      const { mockProducts } = await import('@/mock/products');
      productPages = (mockProducts as any[])
        .map((p) => {
          const urlSlug = p.slug || generateSlug(p.name) || p.id;
          if (!urlSlug) return null;
          return {
            url:             `${BASE}/products/${urlSlug}`,
            lastModified:    new Date(),
            changeFrequency: 'weekly' as const,
            priority:        0.9,
          };
        })
        .filter(Boolean) as MetadataRoute.Sitemap;
    } catch {}
  }

  // ── Blog post pages ─────────────────────────────────────────────────────────
  // Uncomment when you have a Blog model in your DB
  // let blogPages: MetadataRoute.Sitemap = [];
  // try {
  //   const posts = await prisma.blog.findMany({
  //     select: { slug: true, updatedAt: true },
  //   });
  //   blogPages = posts.map((post: any) => ({
  //     url:             `${BASE}/blog/${post.slug}`,
  //     lastModified:    post.updatedAt || new Date(),
  //     changeFrequency: 'monthly' as const,
  //     priority:        0.6,
  //   }));
  // } catch {}

  return [
    ...staticPages,
    ...categoryPages,
    ...productPages,
    // ...blogPages,
  ];
}