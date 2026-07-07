// scripts/clean-product-names.ts
// ─────────────────────────────────────────────────────────────────────────────
// Removes "wishlist shareicon", "wishlist", "shareicon" junk text from:
//  1. product.name  (the display name customers see)
//  2. product.slug  (the URL slug)
// Run: npx tsx scripts/clean-product-names.ts
// ─────────────────────────────────────────────────────────────────────────────

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function cleanName(name: string): string {
  return name
    .replace(/\s*wishlist\s*shareicon\s*/gi, '')
    .replace(/\s*shareicon\s*/gi, '')
    .replace(/\s*wishlist\s*/gi, '')
    .replace(/\s{2,}/g, ' ')   // collapse double spaces
    .trim();
}

function cleanSlug(slug: string): string {
  return slug
    .replace(/-*wishlist-*shareicon-*/gi, '')
    .replace(/-*shareicon-*/gi, '')
    .replace(/-*wishlist-*/gi, '')
    .replace(/-{2,}/g, '-')    // collapse double dashes
    .replace(/^-+|-+$/g, '')   // trim leading/trailing dashes
    .trim();
}

async function main() {
  console.log('🔍 Fetching all products...');

  const products = await prisma.product.findMany({
    select: { id: true, name: true, slug: true },
  });

  console.log(`Found ${products.length} products\n`);

  let updatedCount = 0;
  const usedSlugs = new Set<string>();

  // First pass — collect all slugs that DON'T need cleaning (to avoid conflicts)
  for (const p of products) {
    const cleanedName = cleanName(p.name || '');
    const cleanedSlug = cleanSlug(p.slug || '');
    const nameChanged = cleanedName !== p.name;
    const slugChanged = cleanedSlug !== p.slug;
    if (!nameChanged && !slugChanged) {
      usedSlugs.add(p.slug || '');
    }
  }

  // Second pass — update dirty products
  for (const p of products) {
    const cleanedName = cleanName(p.name || '');
    const cleanedSlug = cleanSlug(p.slug || '');

    const nameChanged = cleanedName !== p.name;
    const slugChanged = cleanedSlug !== p.slug;

    if (!nameChanged && !slugChanged) continue;

    // Handle slug conflicts — append -2, -3 etc if slug already used
    let finalSlug = cleanedSlug;
    let counter = 2;
    while (usedSlugs.has(finalSlug)) {
      finalSlug = `${cleanedSlug}-${counter}`;
      counter++;
    }
    usedSlugs.add(finalSlug);

    try {
      await prisma.product.update({
        where: { id: p.id },
        data: {
          ...(nameChanged ? { name: cleanedName } : {}),
          ...(slugChanged || finalSlug !== p.slug ? { slug: finalSlug } : {}),
        },
      });

      console.log(`✅ Fixed:`);
      if (nameChanged) {
        console.log(`   Name: "${p.name}"`);
        console.log(`      → "${cleanedName}"`);
      }
      if (slugChanged || finalSlug !== p.slug) {
        console.log(`   Slug: "${p.slug}"`);
        console.log(`      → "${finalSlug}"`);
      }
      console.log('');
      updatedCount++;
    } catch (err: any) {
      console.error(`❌ Failed to update ${p.id}:`, err.message);
    }
  }

  if (updatedCount === 0) {
    console.log('✨ All product names and slugs are already clean!');
  } else {
    console.log(`\n✅ Done! Updated ${updatedCount} products.`);
    console.log('⚠️  Remember to redeploy so the sitemap picks up the new slugs.');
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());