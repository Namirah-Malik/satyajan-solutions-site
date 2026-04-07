'use client';

import React from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { useWishlist } from '@/context/WishlistContext';

export default function WishlistIcon() {
  const { wishlistCount } = useWishlist();
  return (
    <Link
      href="/wishlist"
      aria-label={`Wishlist (${wishlistCount} items)`}
      className="relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors"
    >
      <Icon icon="ph:heart" width={22} className="text-gray-700" />
      {wishlistCount > 0 && (
        <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 leading-none">
          {wishlistCount > 99 ? '99+' : wishlistCount}
        </span>
      )}
    </Link>
  );
}