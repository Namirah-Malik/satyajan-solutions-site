// fix-images.mjs
// Run: node fix-images.mjs
// Cleans all product image URLs in MongoDB — removes proxies, Next.js wrappers, Amazon CDN
// Replaces everything with direct cms.microtek.in URLs

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ── Allowed direct CDN hostnames ───────────────────────────────────────────────
// Only URLs from these hosts will be kept
const ALLOWED_HOSTS = [
  'cms.microtek.in',
  'microtek.in',
];

// ── Blocked patterns — these are invalid for Google Merchant ──────────────────
const BLOCKED_PATTERNS = [
  '/_next/image',
  '/api/image-proxy',
  '/api/',
  'm.media-amazon.com',
  'amazon.com',
  'images-na.ssl-images-amazon',
  'media-amazon',
];

// ── Valid image extensions ─────────────────────────────────────────────────────
const VALID_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

// ─────────────────────────────────────────────────────────────────────────────
// Core: extract the real direct URL from any wrapped/proxied URL
// ─────────────────────────────────────────────────────────────────────────────
function extractDirectUrl(raw) {
  if (!raw || typeof raw !== 'string') return null;

  let src = raw.trim();

  // 1. Unwrap /api/image-proxy?url=...
  if (src.includes('/api/image-proxy?url=')) {
    try {
      const part = src.split('/api/image-proxy?url=')[1];
      src = decodeURIComponent(part.split('&')[0]);
    } catch { return null; }
  }

  // 2. Unwrap /_next/image?url=...
  if (src.includes('/_next/image')) {
    try {
      const urlObj = new URL(src.startsWith('http') ? src : `https://placeholder.com${src}`);
      const inner  = urlObj.searchParams.get('url');
      if (inner) src = decodeURIComponent(inner);
      else return null;
    } catch { return null; }
  }

  // 3. Fix protocol-relative //
  if (src.startsWith('//')) src = `https:${src}`;

  // 4. Fix /https:// or /http:// (malformed)
  if (src.startsWith('/http')) src = src.replace(/^\//, '');

  // 5. Must be absolute URL now
  if (!src.startsWith('http://') && !src.startsWith('https://')) return null;

  // 6. Check it's from an allowed host
  try {
    const host = new URL(src).hostname;
    if (!ALLOWED_HOSTS.some(h => host.includes(h))) {
      return null; // blocked host (Amazon etc)
    }
  } catch { return null; }

  // 7. Check for blocked patterns
  if (BLOCKED_PATTERNS.some(p => src.includes(p))) return null;

  // 8. Must have a valid image extension (ignore query strings)
  const path = src.split('?')[0].toLowerCase();
  if (!VALID_EXTENSIONS.some(ext => path.endsWith(ext))) return null;

  return src;
}

// ─────────────────────────────────────────────────────────────────────────────
// Normalize one image entry (string or object) → clean URL string or null
// ─────────────────────────────────────────────────────────────────────────────
function normalizeImageEntry(img) {
  if (!img) return null;

  let raw = '';
  if (typeof img === 'string')      raw = img;
  else if (img.src)                 raw = img.src;
  else if (img.url)                 raw = img.url;
  else if (img.image)               raw = img.image;
  else if (img.href)                raw = img.href;
  else return null;

  return extractDirectUrl(raw);
}

// ─────────────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────────────
async function main() {
  console.log('🔍 Connecting to database...\n');

  const products = await prisma.product.findMany({
    select: { id: true, name: true, images: true },
  });

  console.log(`📦 Found ${products.length} products\n`);
  console.log('━'.repeat(60));

  let totalUpdated = 0;
  let totalSkipped = 0;
  let totalNoImages = 0;

  for (const product of products) {
    const rawImages = Array.isArray(product.images) ? product.images : [];

    if (rawImages.length === 0) {
      console.log(`⚠️  NO IMAGES: ${product.name.slice(0, 50)}`);
      totalNoImages++;
      continue;
    }

    // Clean each image
    const cleaned = rawImages
      .map(img => normalizeImageEntry(img))
      .filter(Boolean); // remove nulls

    const originalStr = JSON.stringify(rawImages);
    const cleanedStr  = JSON.stringify(cleaned);

    if (originalStr === cleanedStr && cleaned.length === rawImages.length) {
      console.log(`✅ CLEAN:   ${product.name.slice(0, 50)}`);
      totalSkipped++;
      continue;
    }

    if (cleaned.length === 0) {
      console.log(`❌ NO VALID IMAGES FOUND: ${product.name.slice(0, 50)}`);
      console.log(`   Original: ${rawImages.slice(0, 2).join(', ').slice(0, 100)}`);
      totalNoImages++;
      continue;
    }

    // Update in DB — store as plain string array
    await prisma.product.update({
      where: { id: product.id },
      data:  { images: cleaned },
    });

    console.log(`🔧 FIXED:   ${product.name.slice(0, 50)}`);
    console.log(`   Before:  ${rawImages.length} images`);
    console.log(`   After:   ${cleaned.length} images`);
    console.log(`   Sample:  ${cleaned[0]?.slice(0, 80)}`);
    console.log();

    totalUpdated++;
  }

  console.log('\n' + '━'.repeat(60));
  console.log(`✅ Updated:   ${totalUpdated} products`);
  console.log(`⏭  Clean:     ${totalSkipped} products (already had good URLs)`);
  console.log(`⚠️  No images: ${totalNoImages} products`);
  console.log('━'.repeat(60));
  console.log('\n✅ Done! All images now use direct cms.microtek.in URLs.');
  console.log('   Google Merchant Center can now crawl them directly.\n');
}

main()
  .catch(e => { console.error('Error:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
