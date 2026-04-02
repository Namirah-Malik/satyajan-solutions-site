import { NextResponse } from "next/server";
import { mockProducts, mockCategories } from "@/mock/products";

let prisma: any = null;

async function getPrisma() {
  if (!process.env.DATABASE_URL) return null;
  if (prisma) return prisma;
  try {
    const { PrismaClient } = await import("@prisma/client");
    prisma = new PrismaClient();
    return prisma;
  } catch {
    return null;
  }
}

// ── Extract the real image URL from Microtek's Next.js optimizer URL ──────────
// Input:  "https://www.microtek.in/_next/image?url=https%3A%2F%2Fcms.microtek.in%2F...&w=3840&q=75"
// Output: "https://cms.microtek.in/upload/product/..."
function extractDirectUrl(raw: any): string {
  if (!raw) return '';
  let url = typeof raw === 'string' ? raw : (raw?.src || raw?.url || raw?.image || '');
  if (typeof url !== 'string') return '';

  url = url.replace(/\s+/g, ''); // strip spaces

  // If it's a Microtek Next.js optimizer URL, decode the real URL from it
  if (url.includes('microtek.in/_next/image') && url.includes('?url=')) {
    try {
      const urlObj = new URL(url);
      const innerUrl = urlObj.searchParams.get('url');
      if (innerUrl) url = decodeURIComponent(innerUrl);
    } catch {
      // keep original if parsing fails
    }
  }

  // Fix protocol-relative URLs
  if (url.startsWith('//')) url = `https:${url}`;
  // Fix double-slash artifacts
  if (url.startsWith('/http')) url = url.replace(/^\//, '');

  return url;
}

// ── Clean a single product ────────────────────────────────────────────────────
function cleanProduct(raw: any) {
  const rawImages: any[] = Array.isArray(raw.images) ? raw.images : [];
  const images = rawImages
    .map((img: any) => ({ src: extractDirectUrl(img) }))
    .filter(img => img.src && (img.src.startsWith('http') || img.src.startsWith('/')));

  const name = (raw.name || '')
    .replace(/\s*wishlist\s*shareicon\s*/gi, '')
    .replace(/\s*shareicon\s*/gi, '')
    .replace(/\s*wishlist\s*/gi, '')
    .split(' | ')[0]
    .trim();

  const features: string[] = Array.isArray(raw.features)
    ? raw.features
        .map((f: any) => (typeof f === 'string' ? f : f?.value || f?.label || f?.text || ''))
        .filter(Boolean)
    : [];

  const salient_features: string[] = Array.isArray(raw.salient_features)
    ? raw.salient_features
        .map((f: any) => (typeof f === 'string' ? f : f?.value || f?.label || f?.text || ''))
        .filter(Boolean)
    : [];

  const slug = raw.slug || raw.id || '';
  const price = Number(raw.price || raw.rate || 0);

  return {
    ...raw,
    name,
    images,
    features,
    salient_features,
    slug,
    price,
  };
}

// ── Route handler ─────────────────────────────────────────────────────────────
export async function GET() {

  // 1. Try local database
  try {
    const db = await getPrisma();
    if (db) {
      const raw = await db.product.findMany({ orderBy: { createdAt: "desc" } });
      const products = raw.map(cleanProduct);
      const categories = [...new Set(products.map((p: any) => p.category).filter(Boolean))];
      return NextResponse.json({ products, categories });
    }
  } catch (e) {
    console.error("DB error:", e);
  }

  // 2. Fetch from live satyajan.com API
  try {
    const liveRes = await fetch("https://satyajan.com/api/products", {
      next: { revalidate: 3600 },
    });

    if (liveRes.ok) {
      const liveData = await liveRes.json();
      if (liveData?.products?.length) {
        const products = liveData.products.map(cleanProduct);
        const categories = [...new Set(products.map((p: any) => p.category).filter(Boolean))];
        return NextResponse.json({ products, categories });
      }
    }
  } catch (e) {
    console.error("Live API fetch error:", e);
  }

  // 3. Static mock fallback
  return NextResponse.json({
    products: mockProducts.map(cleanProduct),
    categories: mockCategories,
  });
}