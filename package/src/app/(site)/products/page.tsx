import type { Metadata } from 'next';
import HeroSub        from '@/components/shared/HeroSub';
import ProductsClient from './ProductsClient';
import { categoryMetadata, productsMetadata } from '@/lib/page-metadata';

export async function generateMetadata(
  { searchParams }: { searchParams: Promise<{ category?: string }> }
): Promise<Metadata> {
  const { category } = await searchParams;
  if (category && categoryMetadata[category]) {
    return categoryMetadata[category];
  }
  return productsMetadata;
}

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) => {
  const { category } = await searchParams;

  const heroTitle = category
    ? `${category} Products`
    : 'Discover Our Products.';

  const heroDescription = category
    ? `Browse our full range of ${category} products — best prices in Hyderabad with EMI available.`
    : 'Explore 101+ Microtek inverters, batteries, solar panels & UPS — crafted for reliable power backup.';

  return (
    <>
      <HeroSub
        title={heroTitle}
        description={heroDescription}
        badge="Products"
      />
      <ProductsClient />
    </>
  );
};

export default Page;