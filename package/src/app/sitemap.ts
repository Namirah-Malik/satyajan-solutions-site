
import { MetadataRoute } from 'next';
import prisma from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const BASE = 'https://satyajan.com';

  // ── Static pages ────────────────────────────────────────────────────────────
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE}/`,          lastModified: new Date(), changeFrequency: 'weekly',  priority: 1.0  },
    { url: `${BASE}/products`,  lastModified: new Date(), changeFrequency: 'daily',   priority: 0.95 },
    { url: `${BASE}/services`,  lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8  },
    { url: `${BASE}/blog`,      lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.7  },
    { url: `${BASE}/about`,     lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5  },
    { url: `${BASE}/contactus`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5  },
    { url: `${BASE}/faqs`,      lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4  },
    { url: `${BASE}/careers`,   lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3  },
  ];

  let productPages: MetadataRoute.Sitemap = [];

  try {
    const products = await prisma.product.findMany({
      select: { id: true, slug: true, name: true },
      where: {
        slug: {
          not: null,      // only products with a slug
          notIn: [''],    // exclude empty string slugs
        },
      },
    });

    productPages = products
      .filter((p: any) => {
        // Extra safety: exclude anything that looks like a MongoDB ObjectID
        const isMongoId = /^[a-f0-9]{24}$/i.test(p.slug);
        return p.slug && !isMongoId;
      })
      .map((p: any) => ({
        url:             `${BASE}/products/${p.slug}`,
        lastModified:    new Date(),
        changeFrequency: 'weekly' as const,
        priority:        0.9,
      }));

    console.log(`[sitemap] ${productPages.length} product pages included`);

  } catch (e) {
    console.error('[sitemap] DB error:', e);
  }

  // ── Blog pages ──────────────────────────────────────────────────────────────
  // Uncomment when Blog model exists in Prisma schema
  // let blogPages: MetadataRoute.Sitemap = [];
  // try {
  //   const posts = await prisma.blog.findMany({
  //     select: { slug: true, updatedAt: true },
  //     where: { published: true },
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
    ...productPages,
    // ...blogPages,
  ];
}