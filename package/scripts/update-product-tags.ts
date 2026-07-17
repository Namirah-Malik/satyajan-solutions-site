// scripts/update-product-tags.ts
// ─────────────────────────────────────────────────────────────────────────────
// Updates tags for specific products by slug
// Also fixes slugs for MongoDB ID products
// Run: npx tsx scripts/update-product-tags.ts
// ─────────────────────────────────────────────────────────────────────────────

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
    .replace(/-+$/, '');
}

// ── Tag updates by current slug ───────────────────────────────────────────────
const SLUG_TAG_UPDATES: { slug: string; tags: string[] }[] = [
  {
    slug: 'microtek-i-lithium-1500-sw-1100va925w-lithium-inverter-with-1280wh-128v-li-ion-b',
    tags: [
      'Microtek i Lithium 1500 SW',
      'Microtek Lithium Battery Inverter',
      'Microtek Lithium Inverter for Home',
      'Pure Sine Wave Inverter',
      '1100VA Lithium Inverter',
      'lithium inverter',
      'lithium ups',
      'inverter for home',
      'microtek inverter',
      'power backup inverter',
    ],
  },
  {
    slug: 'microtek-lithium-ion-100ah-battery-deep-cycle-rechargeable-battery-fast-charging',
    tags: [
      'Microtek 100Ah Lithium Battery',
      'Microtek LiFePO4 Battery',
      '100Ah Deep Cycle Lithium Battery',
      'Microtek Lithium Battery for Inverter',
      'Microtek Rechargeable Lithium Battery',
      'lithium battery',
      'lifepo4 battery',
      'deep cycle battery',
      'maintenance free battery',
      '100ah lithium battery',
    ],
  },
  {
    slug: 'microtek-lithium-battery-100ah256v-mlb2560060-lifepo4-256kwh-3500-cycles',
    tags: [
      'Microtek 25.6V 100Ah Lithium Battery',
      'Microtek LiFePO4 Battery',
      'Lithium Inverter Battery',
      '2.56kWh Lithium Battery',
      'Deep Cycle Lithium Battery',
      'lifepo4 battery',
      'lithium battery',
      'deep cycle battery',
      '100ah lithium battery',
      'microtek lithium',
    ],
  },
  {
    slug: 'microtek-lithium-battery-lifepo4-512v-100ah',
    tags: [
      'Microtek 51.2V 100Ah Lithium Battery',
      'Microtek LiFePO4 Battery',
      '51.2V Deep Cycle Lithium Battery',
      'Lithium Battery for Solar & Inverter',
      'lifepo4 battery',
      'lithium battery',
      'deep cycle battery',
      '100ah lithium battery',
      'solar lithium battery',
      'microtek lithium',
    ],
  },
  {
    slug: '550-watt24v-non-dcr-bi-facial',
    tags: [
      '550 Watt Solar Panel',
      'Bifacial Solar Panel',
      'Microtek 550W Solar Panel',
      'Non-DCR Bifacial Solar Panel',
      '24V Solar Panel',
      'solar panel hyderabad',
      'solar energy',
      'microtek solar',
      '550w solar panel',
      'bifacial panel',
    ],
  },
];

// ── Products to fix by MongoDB ID → assign proper slug + tags ─────────────────
const ID_UPDATES: { id: string; slug: string; tags: string[] }[] = [
  {
    id: '6a4e16185f8ef6ac0f5bf729',
    slug: 'microtek-i-lithium-1500-sw-inverter-1100va',
    tags: [
      'Microtek i Lithium 1500 SW',
      'Microtek Lithium Battery Inverter',
      'Microtek Lithium Inverter for Home',
      'Pure Sine Wave Inverter',
      '1100VA Lithium Inverter',
      'lithium inverter',
      'inverter for home',
      'microtek inverter',
      'power backup',
    ],
  },
  {
    id: '6a5492d0ef5dc10eb003d1b9',
    slug: 'microtek-heavy-duty-1550-100ah-lithium-battery-combo',
    tags: [
      'Microtek Heavy Duty 1550 Lithium Inverter Combo',
      '100Ah LiFePO4 Battery Combo',
      'Microtek Inverter with Lithium Battery Price',
      'Home Inverter Battery Combo',
      'inverter battery combo',
      'lithium battery combo',
      'heavy duty inverter combo',
      'microtek combo',
    ],
  },
  {
    id: '6a548fded25285ccf2d0e654',
    slug: 'microtek-heavy-duty-lithium-256v-inverter-combo',
    tags: [
      'Microtek Heavy Duty with Lithium Inverter Combo',
      'Lithium 25.6V Battery',
      'Microtek Inverter with Lithium Battery Price',
      'Home Inverter Battery Combo',
      'inverter battery combo',
      'lithium battery combo',
      '25.6v lithium battery',
      'microtek combo',
    ],
  },
  {
    id: '6a5491514bdc99bfb747502b',
    slug: 'microtek-heavy-duty-lithium-256v-combo-v2',
    tags: [
      'Microtek Heavy Duty with Lithium Inverter Combo',
      'Lithium 25.6V Battery',
      'Microtek Inverter with Lithium Battery Price',
      'Home Inverter Battery Combo',
      'inverter battery combo',
      'lithium battery combo',
      '25.6v lithium battery',
      'microtek combo',
    ],
  },
];

async function main() {
  console.log('🔍 Starting tag + slug updates...\n');

  let updated = 0;
  let notFound = 0;

  // ── Update by slug ──────────────────────────────────────────────────────────
  console.log('📝 Updating tags by slug...\n');

  for (const item of SLUG_TAG_UPDATES) {
    const product = await prisma.product.findFirst({
      where: { slug: item.slug },
      select: { id: true, name: true, slug: true },
    });

    if (!product) {
      console.log(`⚠️  Not found by slug: ${item.slug}`);
      notFound++;
      continue;
    }

    await prisma.product.update({
      where: { id: product.id },
      data:  { tags: item.tags },
    });

    console.log(`✅ Tags updated: ${product.name}`);
    console.log(`   Slug: ${item.slug}`);
    console.log(`   Tags: ${item.tags.slice(0, 3).join(', ')}...`);
    console.log('');
    updated++;
  }

  // ── Update by MongoDB ID — fix slug + add tags ──────────────────────────────
  console.log('\n📝 Fixing MongoDB ID slugs + tags...\n');

  for (const item of ID_UPDATES) {
    try {
      const product = await prisma.product.findFirst({
        where:  { id: item.id },
        select: { id: true, name: true, slug: true },
      });

      if (!product) {
        console.log(`⚠️  Not found by ID: ${item.id}`);
        notFound++;
        continue;
      }

      // Check slug conflict with another product
      const existing = await prisma.product.findFirst({
        where: { slug: item.slug, NOT: { id: item.id } },
        select: { id: true },
      });

      const finalSlug = existing
        ? `${item.slug}-${item.id.slice(-4)}`
        : item.slug;

      await prisma.product.update({
        where: { id: item.id },
        data:  { slug: finalSlug, tags: item.tags },
      });

      console.log(`✅ Fixed: ${product.name}`);
      console.log(`   Old slug: ${product.slug || '(none — was MongoDB ID URL)'}`);
      console.log(`   New slug: ${finalSlug}`);
      console.log(`   New URL:  https://satyajan.com/products/${finalSlug}`);
      console.log(`   Tags: ${item.tags.slice(0, 3).join(', ')}...`);
      console.log('');
      updated++;
    } catch (err: any) {
      console.error(`❌ Failed for ID ${item.id}:`, err.message);
    }
  }

  console.log(`\n✅ Done! Updated ${updated} products.`);
  if (notFound > 0) {
    console.log(`⚠️  ${notFound} products not found — may have been deleted or IDs changed.`);
  }
  console.log('⚠️  Redeploy to Vercel so sitemap and product pages pick up new slugs and tags.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());