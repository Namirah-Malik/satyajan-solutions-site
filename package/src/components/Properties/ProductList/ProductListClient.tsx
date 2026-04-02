"use client";

import { useState, useEffect } from "react";
import PropertyCard from '@/components/Home/Product/Card/Card';
import type { PropertyHomes } from '@/types/properyHomes';

interface ProductListClientProps {
  propertyHomes: PropertyHomes[];
  categories: string[];
  initialFilter?: string;
}

const GlassCard = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white/40 backdrop-blur-lg rounded-3xl shadow-xl border border-white/30 transition-all duration-300 hover:shadow-2xl ${className}`}>
    {children}
  </div>
);

const ProductListClient = ({ propertyHomes, categories, initialFilter }: ProductListClientProps) => {
  const [filter, setFilter] = useState<string>(initialFilter || "all");

  useEffect(() => {
    setFilter(initialFilter || "all");
  }, [initialFilter]);

  const FILTERS = [
    { label: "All Products", value: "all" },
    ...categories.map(cat => ({ label: cat, value: cat }))
  ];

  const filtered =
    filter === "all"
      ? propertyHomes
      : propertyHomes.filter(item => item.category?.toLowerCase() === filter.toLowerCase());

  return (
    <main className="min-h-screen">
      <section className="px-3 sm:px-4 max-w-7xl mx-auto !pt-0 pb-28 sm:pb-16">

        {/* Filter tabs */}
        <GlassCard className="p-3 sm:p-4 mb-6 sm:mb-8">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none snap-x">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                type="button"
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 whitespace-nowrap flex-shrink-0 snap-start ${
                  filter === f.value
                    ? "bg-primary text-white shadow-md"
                    : "bg-white/60 text-gray-700 hover:bg-primary/10 hover:text-primary border border-white/40"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </GlassCard>

        {/* Section heading */}
        <div className="mb-4 sm:mb-8">
          <h2 className="text-xl sm:text-4xl font-extrabold text-gray-900 mb-1 sm:mb-2 tracking-tight">
            {filter === "all" ? "All Products" : filter}
          </h2>
          <p className="text-sm sm:text-lg text-gray-600 font-medium">
            {filtered.length} product{filtered.length !== 1 ? "s" : ""} available
          </p>
        </div>

        {/* Grid — 1 col mobile, 2 col tablet, 3 col desktop */}
        {filtered.length === 0 ? (
          <GlassCard className="p-10 sm:p-16 text-center">
            <p className="text-gray-500 text-base sm:text-lg font-medium">No products found in this category.</p>
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {filtered.map((item, idx) => (
              <PropertyCard key={idx} item={item} />
            ))}
          </div>
        )}

      </section>
    </main>
  );
};

export default ProductListClient;