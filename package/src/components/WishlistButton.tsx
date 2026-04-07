'use client';

import React, { useState } from 'react';
import { useWishlist, WishlistItem } from '@/context/WishlistContext';
import { Icon } from '@iconify/react';

interface WishlistButtonProps {
  item: WishlistItem;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showLabel?: boolean;
}

export default function WishlistButton({
  item,
  size = 'md',
  className = '',
  showLabel = false,
}: WishlistButtonProps) {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const [animating, setAnimating] = useState(false);
  const wishlisted = isWishlisted(item.id);

  const sizeMap = {
    sm: { btn: 'w-7 h-7', icon: 16 },
    md: { btn: 'w-9 h-9', icon: 20 },
    lg: { btn: 'w-11 h-11', icon: 24 },
  };

  const { btn, icon } = sizeMap[size];

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setAnimating(true);
    toggleWishlist(item);
    setTimeout(() => setAnimating(false), 400);
  };

  return (
    <button
      onClick={handleClick}
      aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      title={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      className={`
        ${btn} rounded-full flex items-center justify-center
        transition-all duration-200 select-none
        ${wishlisted
          ? 'bg-red-50 text-red-500 hover:bg-red-100 shadow-md shadow-red-100'
          : 'bg-white/80 text-gray-400 hover:text-red-400 hover:bg-red-50 shadow-md backdrop-blur-sm'
        }
        ${animating ? 'scale-125' : 'scale-100'}
        ${className}
      `}
    >
      <Icon
        icon={wishlisted ? 'ph:heart-fill' : 'ph:heart'}
        width={icon}
        className={`transition-all duration-200 ${wishlisted ? 'text-red-500' : 'text-gray-400 group-hover:text-red-400'}`}
      />
      {showLabel && (
        <span className="ml-1.5 text-sm font-medium">
          {wishlisted ? 'Saved' : 'Save'}
        </span>
      )}
    </button>
  );
}