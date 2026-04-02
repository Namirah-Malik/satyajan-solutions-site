'use client';

import { useEffect, useState } from 'react';
import type { PropertyHomes } from '@/types/properyHomes';
import ProductListClient from './ProductListClient';

interface PropertyListProps {
  initialCategory?: string;
}

const PropertyList = ({ initialCategory }: PropertyListProps) => {
  const [products, setProducts] = useState<PropertyHomes[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        const productList = data.products || [];

        const mapped: PropertyHomes[] = productList.map((product: any) => ({
          name: product.name,
          slug: product.id,
          location: '',
          rate: product.price?.toString() || '0',
          beds: 0,
          baths: 0,
          area: 0,
          images: Array.isArray(product.images)
            ? product.images
                .filter((src: string) => !!src && (src.startsWith('/') || src.startsWith('http')))
                .map((src: string) => ({ src }))
            : [],
          features: product.features || [],
          description: product.description || '',
          // ✅ Use raw category directly from API — no mapping so URLs match tabs
          category: product.category || ''
        }));

        setProducts(mapped);

        const uniqueCategories = Array.from(
          new Set(mapped.map((p: PropertyHomes) => p.category).filter(Boolean))
        ).sort() as string[];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <section className="pt-0">
        <div className="container max-w-8xl mx-auto px-5 2xl:px-0">
          <div className="text-center py-12">Loading products...</div>
        </div>
      </section>
    );
  }

  return (
    <ProductListClient
      propertyHomes={products}
      categories={categories}
      initialFilter={initialCategory}
    />
  );
};

export default PropertyList;