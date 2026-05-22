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

async function main() {
  console.log('Fetching all products...');
  const products = await prisma.product.findMany({
    select: { id: true, name: true, slug: true },
  });
  console.log(`Found ${products.length} products`);

  const usedSlugs = new Map<string, number>();

  for (const product of products) {
    const base = toSlug(product.name);
    let slug = base;

    if (usedSlugs.has(base)) {
      const count = usedSlugs.get(base)! + 1;
      usedSlugs.set(base, count);
      slug = `${base}-${count}`;
    } else {
      usedSlugs.set(base, 1);
    }

    try {
      await prisma.product.update({ where: { id: product.id }, data: { slug } });
      console.log(`OK: ${slug}`);
    } catch (err: any) {
      const fallback = `${slug}-${product.id.slice(-4)}`;
      await prisma.product.update({ where: { id: product.id }, data: { slug: fallback } });
      console.log(`Fixed duplicate: ${fallback}`);
    }
  }
  console.log('Done!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
