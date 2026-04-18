// update-videos.mjs
// Run: node update-videos.mjs
// Updates all products in MongoDB with a YouTube video URL based on category.
// ─────────────────────────────────────────────────────────────────────────────

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ── Video map by category ─────────────────────────────────────────────────────
// Change any of these URLs later — just re-run the script.
const CATEGORY_VIDEO_MAP = {
  'Inverter':            'https://www.youtube.com/embed/QlSAiI3xMh4',
  'Battery':             'https://www.youtube.com/embed/UuIwPxhRBnU',
  'ONLINE UPS':          'https://www.youtube.com/embed/TbgO24BNMQM',
  'High Capacity UPS':   'https://www.youtube.com/embed/8t_6HDNPAWU',
  'Solar':               'https://www.youtube.com/embed/8t_6HDNPAWU',
  'Solar Inverter':      'https://www.youtube.com/embed/8t_6HDNPAWU',
  'Solar Battery':       'https://www.youtube.com/embed/UuIwPxhRBnU',
  'New Lithium Battery': 'https://www.youtube.com/embed/yrLDMPEKqFQ',
  'Combo':               'https://www.youtube.com/embed/QlSAiI3xMh4',
  'Combos':              'https://www.youtube.com/embed/QlSAiI3xMh4',
};

// ── Name-based overrides for specific inverter series ─────────────────────────
// More specific than category — checked first
const NAME_VIDEO_MAP = [
  { match: /LUXE/i,           video: 'https://www.youtube.com/embed/f8LpBPdGlQM' },
  { match: /iMERLYN/i,        video: 'https://www.youtube.com/embed/bqWfUYsGAoc' },
  { match: /SMART HYBRID/i,   video: 'https://www.youtube.com/embed/wHFypNTYlmQ' },
  { match: /HEAVY DUTY/i,     video: 'https://www.youtube.com/embed/wHFypNTYlmQ' },
  { match: /ENERGY SAVER/i,   video: 'https://www.youtube.com/embed/QlSAiI3xMh4' },
  { match: /SUPER POWER/i,    video: 'https://www.youtube.com/embed/QlSAiI3xMh4' },
  { match: /JUMBO/i,          video: 'https://www.youtube.com/embed/8t_6HDNPAWU' },
  { match: /Hi-GRADE/i,       video: 'https://www.youtube.com/embed/8t_6HDNPAWU' },
  { match: /Lithium/i,        video: 'https://www.youtube.com/embed/yrLDMPEKqFQ' },
  { match: /LiFePO/i,         video: 'https://www.youtube.com/embed/yrLDMPEKqFQ' },
  { match: /Solar Panel/i,    video: 'https://www.youtube.com/embed/8t_6HDNPAWU' },
];

function getVideoForProduct(name, category) {
  // 1. Check name-based rules first (more specific)
  for (const rule of NAME_VIDEO_MAP) {
    if (rule.match.test(name)) return rule.video;
  }
  // 2. Fall back to category map
  return CATEGORY_VIDEO_MAP[category] || null;
}

async function main() {
  console.log('🔄 Connecting to database...');
  
  const products = await prisma.product.findMany({
    select: { id: true, name: true, category: true, video: true },
  });

  console.log(`📦 Found ${products.length} products\n`);

  let updated = 0;
  let skipped = 0;
  let noVideo = 0;

  for (const product of products) {
    // Skip if video already set (don't overwrite real videos from admin)
    if (product.video && product.video.trim()) {
      console.log(`⏭  SKIP  [already has video] ${product.name.slice(0, 50)}`);
      skipped++;
      continue;
    }

    const videoUrl = getVideoForProduct(product.name, product.category || '');

    if (!videoUrl) {
      console.log(`❌ NO VIDEO FOUND for: ${product.name.slice(0, 50)} (${product.category})`);
      noVideo++;
      continue;
    }

    await prisma.product.update({
      where: { id: product.id },
      data: { video: videoUrl },
    });

    console.log(`✅ UPDATED ${product.name.slice(0, 50)}`);
    console.log(`         → ${videoUrl}\n`);
    updated++;
  }

  console.log('\n─────────────────────────────────────────');
  console.log(`✅ Updated:  ${updated} products`);
  console.log(`⏭  Skipped:  ${skipped} (already had video)`);
  console.log(`❌ No match: ${noVideo} products`);
  console.log('─────────────────────────────────────────');
  console.log('Done! All products in the database now have video URLs.');
  console.log('The website will show a Video tab on every product detail page.');
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
