'use client';

import React from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import HeroSub from '@/components/shared/HeroSub';

export default function WishlistPage() {
  const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = (item: any) => {
    // Only pass fields your CartContext's addToCart actually accepts
    addToCart({
      id: item.id,
      name: item.name,
      price: Number(item.price),
      image: typeof item.image === 'object'
        ? (item.image as any)?.src || ''
        : item.image || '',
      SKU: item.SKU || item.id || '',
    });
  };

  return (
    <main className="min-h-screen bg-white">
      <HeroSub
        title="My Wishlist."
        description="Products you've saved for later. Add them to cart when you're ready."
        badge="Wishlist"
      />

      <section className="px-4 max-w-7xl mx-auto py-12">

        {/* ── Empty State ── */}
        {wishlistItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6">
              <Icon icon="ph:heart" width={48} className="text-red-300" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Your wishlist is empty</h2>
            <p className="text-gray-500 text-base mb-8 max-w-sm">
              Save products you love by clicking the ♡ heart icon on any product card.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-full font-semibold hover:bg-dark transition-colors shadow-lg"
            >
              <Icon icon="ph:shopping-bag-fill" width={18} />
              Browse Products
            </Link>
          </div>
        ) : (
          <>
            {/* ── Header ── */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Saved Products</h2>
                <p className="text-gray-500 text-sm mt-1">
                  {wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''} saved
                </p>
              </div>
              <button
                onClick={clearWishlist}
                className="text-sm text-red-500 hover:text-red-700 font-medium flex items-center gap-1.5 transition-colors"
              >
                <Icon icon="ph:trash" width={16} />
                Clear all
              </button>
            </div>

            {/* ── Product Grid ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlistItems.map(item => (
                <div
                  key={item.id}
                  className="group bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
                >
                  {/* Image */}
                  <div className="relative aspect-[4/3] bg-gray-50 overflow-hidden">
                    <Link href={`/products/${item.id}`}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={
                          typeof item.image === 'object'
                            ? (item.image as any)?.src || '/images/fallback.jpg'
                            : item.image || '/images/fallback.jpg'
                        }
                        alt={item.name}
                        className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => { (e.target as HTMLImageElement).src = '/images/fallback.jpg'; }}
                      />
                    </Link>

                    {/* Category badge */}
                    <span className="absolute top-2 left-2 bg-primary/10 text-primary text-xs font-semibold px-2.5 py-1 rounded-full">
                      {item.category}
                    </span>

                    {/* Remove from wishlist */}
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 transition-all"
                      title="Remove from wishlist"
                    >
                      <Icon icon="ph:heart-fill" width={16} />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-4 flex flex-col flex-1">
                    <Link href={`/products/${item.id}`}>
                      <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-2 line-clamp-2 hover:text-primary transition-colors">
                        {item.name}
                      </h3>
                    </Link>

                    <p className="text-lg font-bold text-primary mb-4 mt-auto">
                      ₹{Number(item.price).toLocaleString('en-IN')}
                    </p>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="flex-1 bg-primary hover:bg-dark text-white text-sm font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Icon icon="ph:shopping-cart-fill" width={16} />
                        Add to Cart
                      </button>
                      <Link
                        href={`/products/${item.id}`}
                        className="w-10 h-10 border-2 border-gray-200 rounded-xl flex items-center justify-center text-gray-500 hover:border-primary hover:text-primary transition-colors"
                        title="View product"
                      >
                        <Icon icon="ph:arrow-right" width={16} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Bottom CTA ── */}
            <div className="mt-12 text-center">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 border-2 border-primary text-primary px-8 py-3 rounded-full font-semibold hover:bg-primary hover:text-white transition-colors"
              >
                <Icon icon="ph:plus" width={18} />
                Add More Products
              </Link>
            </div>
          </>
        )}
      </section>
    </main>
  );
}