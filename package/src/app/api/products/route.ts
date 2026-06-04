// app/api/products/route.ts
// ─────────────────────────────────────────────────────────────────────────────
// ROOT CAUSE OF 58/107 BUG:
//   The previous version used `select: { id, slug, name... }` in findMany().
//   Prisma + MongoDB silently skips documents where a selected field does not
//   exist on the raw document — so ~49 products with missing fields were
//   never returned.
//
//   It also used `take: 24` (pagination). The load-more was not wiring up
//   correctly so users only saw page 1 = 24, or accumulated pages.
//
// FIX:
//   - Removed `select` entirely — fetch all fields like the original did
//   - Removed `take`/`skip` — return all products in one response
//     (107 products × ~2KB each = ~200KB JSON, acceptable)
//   - Kept all the performance improvements: singleton Prisma, cache headers,
//     clean image extraction, stockStatus default
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from 'next/server';
import { mockProducts, mockCategories } from '@/mock/products';
import prisma from '@/lib/prisma';

// ── Image URL extractor ───────────────────────────────────────────────────────
function extractDirectUrl(raw: any): string {
  if (!raw) return '';
  let url = typeof raw === 'string' ? raw : (raw?.src || raw?.url || raw?.image || '');
  if (typeof url !== 'string' || !url) return '';
  url = url.trim();

  if (url.includes('/api/image-proxy?url=')) {
    try { url = decodeURIComponent(url.split('/api/image-proxy?url=')[1]); } catch { return ''; }
  }

  let i = 0;
  while (url.includes('/_next/image') && i++ < 5) {
    try {
      const u = new URL(url.startsWith('/') ? `https://placeholder.com${url}` : url);
      const inner = u.searchParams.get('url');
      if (inner) url = decodeURIComponent(inner); else break;
    } catch { break; }
  }

  if (url.startsWith('//'))    url = `https:${url}`;
  if (url.startsWith('/http')) url = url.replace(/^\//, '');
  if (!url.startsWith('http')) return '';
  return url;
}

// ── Clean product — keeps ALL fields, same as original cleanProduct() ─────────
function cleanProduct(raw: any) {
  const rawImages: any[] = Array.isArray(raw.images) ? raw.images : [];
  const images = rawImages
    .map((img: any) => {
      const src = extractDirectUrl(img);
      if (!src || !src.startsWith('http')) return null;
      return { src };
    })
    .filter(Boolean) as { src: string }[];

  // Video normalisation
  let video: string | null = null;
  const rawVideo = raw.video;
  if (rawVideo && typeof rawVideo === 'string' && rawVideo.trim()) {
    let v = rawVideo.trim();
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
    ? raw.features.map((f: any) =>
        typeof f === 'string' ? f : f?.value || f?.label || f?.text || ''
      ).filter(Boolean)
    : [];

  const salient_features: string[] = Array.isArray(raw.salient_features)
    ? raw.salient_features.map((f: any) =>
        typeof f === 'string' ? f : f?.value || f?.label || f?.text || ''
      ).filter(Boolean)
    : [];

  const slug  = raw.slug || raw.id || '';
  const price = Number(raw.price || raw.rate || 0);

  return {
    ...raw,
    name,
    images,
    video,
    features,
    salient_features,
    slug,
    price,
    rate:        price,
    stockStatus: raw.stockStatus || 'In Stock',
    category:    raw.category    || '',
  };
}

const CACHE_HEADERS = {
  'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
};

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const category = searchParams.get('category') || '';

  try {
    // NO select — fetch ALL fields so Prisma never silently skips documents
    // NO take/skip — return everything (107 products ≈ 200KB, fast enough)
    const where = category ? { category } : {};

    const raw      = await prisma.product.findMany({ where });
    const products = raw.map(cleanProduct);

    const categories = [...new Set(
      products
        .map((p: any) => p.category)
        .filter((c: any): c is string => typeof c === 'string' && c.trim().length > 0)
    )];

    return NextResponse.json(
      { products, categories, total: products.length },
      { headers: CACHE_HEADERS }
    );

  } catch (e) {
    console.error('[/api/products] DB error:', e);
  }

  // Mock fallback
  const filtered = category
    ? mockProducts.filter((p: any) => p.category === category)
    : mockProducts;
  const products = filtered.map(cleanProduct);

  return NextResponse.json(
    { products, categories: mockCategories, total: products.length },
    { headers: CACHE_HEADERS }
  );
}