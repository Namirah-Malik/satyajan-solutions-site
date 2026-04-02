import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProductDetailsClient from '@/components/ProductDetailsClient';
import { mockProducts } from '@/mock/products';

export const dynamic = 'force-dynamic';

const categoryMap: Record<string, string> = {
  solar: 'Solar Solutions',
  inverter: 'Home UPS',
  'jumbo-ups': 'Jumbo UPS',
  'online-ups': 'Online UPS',
  battery: 'Tubular Battery',
  lithium: 'Lithium Batteries',
  combos: 'Combos',
};

let prisma: any = null;
async function getPrisma() {
  if (!process.env.DATABASE_URL) return null;
  if (prisma) return prisma;
  try {
    const { PrismaClient } = await import('@prisma/client');
    prisma = new PrismaClient();
    return prisma;
  } catch {
    return null;
  }
}

async function fetchProduct(slug: string): Promise<any | null> {
  // 1. Try database first
  try {
    const db = await getPrisma();
    if (db) {
      const product = await db.product.findFirst({
        where: { OR: [{ id: slug }, { slug: slug }] },
      });
      if (product) return product;
    }
  } catch (e) {
    console.error('DB error:', e);
  }

  // 2. Try mock data
  const mockMatch = mockProducts.find(
    (p: any) => p.id === slug || p.slug === slug
  );
  if (mockMatch) return mockMatch;

  // 3. Fallback to live API
  try {
    const res = await fetch(`https://satyajan.com/api/products/${slug}`, {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const data = await res.json();
      if (data?.product) return data.product;
    }
  } catch (e) {
    console.error('Live API error:', e);
  }

  return null;
}

// ── Unwrap any image shape into a clean direct URL ────────────────────────────
function extractImageSrc(img: any): string {
  if (!img) return '';
  let src =
    typeof img === 'string'
      ? img
      : img.src || img.url || img.image || img.href || '';

  // Unwrap already-proxied URLs
  if (src.includes('/api/image-proxy?url=')) {
    try {
      src = decodeURIComponent(src.split('/api/image-proxy?url=')[1]);
    } catch {}
  }

  // Unwrap Next.js image optimizer wrappers
  let i = 0;
  while (src.includes('/_next/image') && i++ < 5) {
    try {
      const u = new URL(
        src.startsWith('/') ? `https://www.microtek.in${src}` : src
      );
      const inner = u.searchParams.get('url');
      if (inner) src = decodeURIComponent(inner);
      else break;
    } catch {
      break;
    }
  }

  // Fix protocol-relative and malformed URLs
  if (src.startsWith('//')) src = `https:${src}`;
  if (src.startsWith('/http')) src = src.replace(/^\//, '');
  return src;
}

// ── Normalize a features array to plain strings ───────────────────────────────
function normalizeFeatures(arr: any[]): string[] {
  if (!Array.isArray(arr)) return [];
  return arr
    .map((f: any) =>
      typeof f === 'string' ? f : f?.value || f?.label || f?.text || ''
    )
    .filter(Boolean);
}

function cleanName(name: string): string {
  return (name || '')
    .replace(/\s*wishlist\s*shareicon\s*/gi, '')
    .replace(/\s*shareicon\s*/gi, '')
    .replace(/\s*wishlist\s*/gi, '')
    .trim();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await fetchProduct(slug);

  if (!product) {
    return {
      title: 'Product Not Found | Satyajan',
      description: 'The product you are looking for is not available.',
      robots: { index: false, follow: false },
    };
  }

  const name = cleanName(product.name);
  const title = `${name} – Price, Specs & Buy Online | Satyajan`;
  const description = product.description
    ? `${product.description.slice(0, 140)}… Buy online at Satyajan Energy Solutions, Hyderabad.`
    : `Buy ${name} at Satyajan Energy Solutions. Best price in Hyderabad. EMI available.`;

  const rawFirstImage = Array.isArray(product.images) ? product.images[0] : null;
  const ogImage =
    extractImageSrc(rawFirstImage) || 'https://satyajan.com/images/og-default.jpg';
  const url = `https://satyajan.com/products/${product.slug ?? slug}`;

  return {
    title,
    description,
    keywords: [
      name,
      `${name} price`,
      `${name} Hyderabad`,
      `buy ${name}`,
      product.category ?? 'energy product',
      'Satyajan Energy Solutions',
      'Microtek dealer Hyderabad',
    ],
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      url,
      title,
      description,
      siteName: 'Satyajan Energy Solutions',
      images: [{ url: ogImage, width: 800, height: 600, alt: name }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function Details({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const dbProduct = await fetchProduct(slug);
  if (!dbProduct) return notFound();

  const name = cleanName(dbProduct.name);

  // ── Normalize images → proxied { src }[] ─────────────────────────────────
  const rawImages: any[] = Array.isArray(dbProduct.images) ? dbProduct.images : [];
  const images = rawImages
    .map((img) => {
      const src = extractImageSrc(img);
      if (!src) return null;
      // Local images (e.g. /images/products/...) — serve directly, no proxy
      if (src.startsWith('/') && !src.startsWith('/http')) return { src };
      // External images — route through proxy
      if (src.startsWith('http://') || src.startsWith('https://')) {
        return { src: `/api/image-proxy?url=${encodeURIComponent(src)}` };
      }
      return null;
    })
    .filter((img): img is { src: string } => !!img?.src);

  // ── Build the full product object with ALL fields ─────────────────────────
  const product = {
    id: slug,
    name,
    price: dbProduct.price || dbProduct.rate || 0,
    images,

    // ✅ Restored: salient features (key highlights)
    salient_features: normalizeFeatures(dbProduct.salient_features),

    // ✅ Restored: product features
    features: normalizeFeatures(dbProduct.features),

    // ✅ Restored: specifications table
    specifications: Array.isArray(dbProduct.specifications)
      ? dbProduct.specifications
      : [],

    // ✅ Restored: description
    description: dbProduct.description || '',

    // ✅ Restored: category (mapped to display name)
    category:
      categoryMap[dbProduct.category?.toLowerCase() || ''] ||
      dbProduct.category ||
      '',
    categorySlug: dbProduct.category || '',

    // ✅ Restored: SKU
    SKU:
      dbProduct.SKU ||
      dbProduct.sku ||
      `899-A${dbProduct.category?.charAt(0)?.toUpperCase() || 'I'}N-${
        dbProduct.name?.match(/\d+/)?.[0] || slug.slice(-4)
      }`,

    // ✅ Restored: spec summary row (first 3 specs)
    data: Array.isArray(dbProduct.specifications)
      ? dbProduct.specifications.slice(0, 3)
      : [],
  };

  const formattedPrice = product.price
    ? `₹${Number(product.price).toLocaleString('en-IN')}`
    : 'No price listed';

  return (
    <ProductDetailsClient
      product={product}
      images={images}
      formattedPrice={formattedPrice}
      tabItems={[]}
    />
  );
}