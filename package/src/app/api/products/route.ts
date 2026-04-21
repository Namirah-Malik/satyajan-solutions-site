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

function extractDirectUrl(raw: any): string {
  if (!raw) return '';
  let url = typeof raw === 'string' ? raw : (raw?.src || raw?.url || raw?.image || '');
  if (typeof url !== 'string') return '';
  url = url.replace(/\s+/g, '');
  if (url.includes('/api/image-proxy?url=')) {
    try { url = decodeURIComponent(url.split('/api/image-proxy?url=')[1]); } catch {}
  }
  let i = 0;
  while (url.includes('/_next/image') && i++ < 5) {
    try {
      const u = new URL(url.startsWith('/') ? `https://www.microtek.in${url}` : url);
      const inner = u.searchParams.get('url');
      if (inner) url = decodeURIComponent(inner); else break;
    } catch { break; }
  }
  if (url.startsWith('//')) url = `https:${url}`;
  if (url.startsWith('/http')) url = url.replace(/^\//, '');
  return url;
}

function cleanProduct(raw: any) {
  const rawImages: any[] = Array.isArray(raw.images) ? raw.images : [];
  const images = rawImages
    .map((img: any) => {
      const src = extractDirectUrl(img);
      if (!src) return null;
      if (src.startsWith('/') && !src.startsWith('/http')) return { src };
      if (!src.startsWith('http')) return null;
      return { src: `/api/image-proxy?url=${encodeURIComponent(src)}` };
    })
    .filter(Boolean) as { src: string }[];

  // ── Null-safe video URL processing ───────────────────────────────────────────
  let video: string | null = null;
  const rawVideo = raw.video;
  if (rawVideo && typeof rawVideo === 'string' && rawVideo.trim()) {
    let v = rawVideo.trim();
    // Convert YouTube watch URL → embed URL
    if (v.includes('youtube.com/watch?v=')) {
      try {
        const videoId = new URL(v).searchParams.get('v');
        if (videoId) v = `https://www.youtube.com/embed/${videoId}`;
      } catch {}
    } else if (v.includes('youtu.be/')) {
      const videoId = v.split('youtu.be/')[1]?.split('?')[0];
      if (videoId) v = `https://www.youtube.com/embed/${videoId}`;
    }
    video = v;
  }

  const name = (raw.name || '')
    .replace(/\s*wishlist\s*shareicon\s*/gi, '')
    .replace(/\s*shareicon\s*/gi, '')
    .replace(/\s*wishlist\s*/gi, '')
    .split(' | ')[0]
    .trim();

  const features: string[] = Array.isArray(raw.features)
    ? raw.features.map((f: any) => typeof f === 'string' ? f : f?.value || f?.label || f?.text || '').filter(Boolean)
    : [];

  const salient_features: string[] = Array.isArray(raw.salient_features)
    ? raw.salient_features.map((f: any) => typeof f === 'string' ? f : f?.value || f?.label || f?.text || '').filter(Boolean)
    : [];

  const slug = raw.slug || raw.id || '';
  const price = Number(raw.price || raw.rate || 0);

  return { ...raw, name, images, video, features, salient_features, slug, price };
}

const CACHE_HEADERS = {
  'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
};

export async function GET() {
  console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);

  // 1. Try database
  try {
    const db = await getPrisma();
    if (db) {
      const raw = await db.product.findMany();
      const products = raw.map(cleanProduct);
      const categories = [...new Set(products.map((p: any) => p.category).filter(Boolean))];
      return NextResponse.json({ products, categories }, { headers: CACHE_HEADERS });
    }
  } catch (e) {
    console.error("DB error:", e);
  }

  // 2. Try live API
  try {
    const liveRes = await fetch("https://satyajan.com/api/products", {
      next: { revalidate: 3600 },
    });
    if (liveRes.ok) {
      const liveData = await liveRes.json();
      if (liveData?.products?.length) {
        const products = liveData.products.map(cleanProduct);
        const categories = [...new Set(products.map((p: any) => p.category).filter(Boolean))];
        return NextResponse.json({ products, categories }, { headers: CACHE_HEADERS });
      }
    }
  } catch (e) {
    console.error("Live API fetch error:", e);
  }

  // 3. Mock fallback
  const products = mockProducts.map(cleanProduct);
  return NextResponse.json(
    { products, categories: mockCategories },
    { headers: CACHE_HEADERS }
  );
}