import HeroSub from "@/components/shared/HeroSub";
import ProductListClient from "@/components/Properties/ProductList/ProductListClient";
import React from "react";
import CategoryPageClient from "./CategoryPageClient";
import { PrismaClient } from '@prisma/client';
import type { PropertyHomes } from '@/types/properyHomes';

const prisma = new PrismaClient();

// Map category slug to display name
const categoryMap: Record<string, string> = {
  'solar': 'Solar Solutions',
  'inverter': 'Home UPS',
  'jumbo-ups': 'Jumbo UPS',
  'online-ups': 'Online UPS',
  'battery': 'Tubular Battery',
  'lithium': 'Lithium Batteries',
  'combos': 'Combos'
};

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

const CategoryPage = async ({ params }: CategoryPageProps) => {
  const { category } = await params;

  // Get the display category name from the URL slug
  const displayCategory = categoryMap[category] || category;

  // Fetch products from database
  const dbProducts = await prisma.product.findMany({
    where: {
      category: category
    }
  });
  
  await prisma.$disconnect();

  // Map database products to PropertyHomes format - just use ID as slug
  const mappedProducts: PropertyHomes[] = dbProducts.map((product) => ({
    name: product.name,
    slug: product.id,
    location: '',
    rate: product.price?.toString() || '0',
    beds: 0,
    baths: 0,
    area: 0,
    images: Array.isArray(product.images)
      ? product.images.filter((src: string) => !!src && (src.startsWith('/') || src.startsWith('http'))).map((src: string) => ({ src }))
      : [],
    features: Array.isArray(product.features) ? product.features as string[] : [],
    description: product.description || '',
    category: categoryMap[product.category || ''] || product.category || ''
  }));

  // Get all categories for filter
  const allProducts = await prisma.product.findMany({
    select: { category: true }
  });
  
  const categories = Array.from(
    new Set(allProducts.map(p => categoryMap[p.category || ''] || p.category).filter(Boolean))
  ).sort() as string[];

  return (
    <>
      <HeroSub
        title={`${displayCategory} Products`}
        description={`Explore our exclusive range of ${displayCategory.toLowerCase()} products, crafted to deliver quality, innovation, and satisfaction.`}
        badge={displayCategory}
      />
      <ProductListClient 
        propertyHomes={mappedProducts} 
        categories={categories}
        initialFilter={displayCategory}
      />
      <CategoryPageClient />
    </>
  );
};

export default CategoryPage;

