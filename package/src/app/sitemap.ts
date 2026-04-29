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

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE}/`,                                    lastModified: new Date(), changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE}/products`,                            lastModified: new Date(), changeFrequency: 'daily',   priority: 0.9 },
    { url: `${BASE}/products?category=Inverter`,          lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.85 },
    { url: `${BASE}/products?category=Battery`,           lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.85 },
    { url: `${BASE}/products?category=ONLINE+UPS`,        lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE}/products?category=Solar`,             lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE}/products?category=High+Capacity+UPS`, lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE}/products?category=New+Lithium+Battery`,lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/blog`,                                lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${BASE}/about`,                               lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/contact`,                             lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ];

  let productPages: MetadataRoute.Sitemap = [];

  try {
    const db = await getPrisma();
    if (db) {
      // ✅ Do NOT select updatedAt — it doesn't exist on the Product model
      const products = await db.product.findMany({
        select: { id: true, slug: true, name: true, category: true },
      });

      productPages = products.map((p: any) => ({
        url:             `${BASE}/products/${p.slug || generateSlug(p.name) || p.id}`,
        lastModified:    new Date(),
        changeFrequency: 'weekly' as const,
        priority:        0.8,
      }));
    }
  } catch (e) {
    console.error('[sitemap] DB error:', e);
    // Fallback to mock products
    try {
      const { mockProducts } = await import('@/mock/products');
      productPages = (mockProducts as any[]).map((p) => ({
        url:             `${BASE}/products/${p.slug || generateSlug(p.name) || p.id}`,
        lastModified:    new Date(),
        changeFrequency: 'weekly' as const,
        priority:        0.8,
      }));
    } catch {}
  }

  return [...staticPages, ...productPages];
}