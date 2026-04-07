'use client';

import { PropertyHomes } from '@/types/properyHomes'
import { Icon } from '@iconify/react'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { useState } from 'react'
import WishlistButton from '@/components/WishlistButton';


function proxyImageUrl(src: string | null): string | null {
  if (!src) return null;
  let resolved = src;
  try {
    if (src.includes('/_next/image')) {
      const parsed = new URL(src);
      const inner = parsed.searchParams.get('url');
      if (inner) resolved = decodeURIComponent(inner);
    }
  } catch { }
  if (resolved.startsWith('http://') || resolved.startsWith('https://')) {
    return `/api/image-proxy?url=${encodeURIComponent(resolved)}`;
  }
  return resolved;
}

const PropertyCard: React.FC<{ item: PropertyHomes }> = ({ item }) => {
  const { name, rate, slug, images, features, category } = item
  const { addToCart } = useCart()
  const [adding, setAdding] = useState(false)
  const [imgError, setImgError] = useState(false)

  const rawImage = (() => {
    if (!Array.isArray(images) || images.length === 0) return null;
    for (const img of images) {
      const src = typeof img === 'string' ? img : (img as any)?.src;
      if (src && typeof src === 'string' && src.trim().length > 0) return src.trim();
    }
    return null;
  })();

  const mainImage = proxyImageUrl(rawImage);
  const showImage = mainImage && !imgError;
  const formattedRate = rate && !isNaN(Number(rate)) ? Number(rate).toLocaleString('en-IN') : null;
  const price = Number(rate) || 0;
  const SKU = slug?.trim() ? slug.toUpperCase().replace(/\s+/g, '-') : `PROD-${Date.now()}`;
  const visibleFeatures = features?.slice(0, 3) || [];
  const extraCount = Math.max(0, (features?.length || 0) - 3);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setAdding(true);
    addToCart({ id: slug, name, SKU, price, image: mainImage || '/images/fallback.jpg' });
    setTimeout(() => setAdding(false), 500);
  };

  return (
    <div className="w-full transition-transform duration-200 hover:-translate-y-0.5">
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden flex flex-col h-full shadow-sm hover:shadow-lg transition-shadow duration-200">

        {/* ── IMAGE ─────────────────────────────────────────────────────
            Mobile : 4:3 ratio (Microtek style, prominent)
            Desktop: square                                              */}
        <Link href={slug ? `/products/${slug}` : '#'} className="block flex-shrink-0">
          <div className="relative w-full bg-gray-50 overflow-hidden aspect-[4/3] sm:aspect-square">
            {showImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={mainImage}
                alt={name}
                loading="lazy"
                onError={() => setImgError(true)}
                className="w-full h-full object-contain p-4 hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <Icon icon="ph:lightning-fill" className="text-gray-300" width={48} />
              </div>
            )}
            {/* Category badge — on image for mobile, hidden (shown below) for desktop */}
            {category && (
              <span className="sm:hidden absolute top-2 left-2 text-[9px] font-bold text-white bg-primary/90 px-1.5 py-0.5 rounded-full z-10">
                {category}
              </span>
            )}
            {/* ✅ Wishlist button — always inside image area, top-right */}
  <div className="absolute top-2 right-2 z-10">
    <WishlistButton
      item={{
        id: String(slug || ''),
        name: name || '',
        price: price,
        image: mainImage || '/images/fallback.jpg',
        category: category || '',
        SKU: SKU,
      }}
      size="sm"
    />
  </div>
</div>
          
        </Link>

        {/* ── CONTENT ───────────────────────────────────────────────── */}
        <div className="flex flex-col flex-1 p-3 sm:p-5">

          {/* ════════════════════════════════════════════════════════
              MOBILE layout (< sm) — Microtek style: centered, simple
              ════════════════════════════════════════════════════════ */}
          <div className="flex flex-col gap-2 sm:hidden">
            <h3 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2 text-center">
              {name}
            </h3>
            <p className="text-[10px] text-gray-400 text-center">SKU: {SKU.slice(0, 24)}</p>
            <div className="flex flex-col items-center">
              {formattedRate ? (
                <>
                  <span className="text-lg font-extrabold text-primary">₹{formattedRate}</span>
                  <p className="text-[10px] text-gray-400">Inclusive of all Taxes</p>
                </>
              ) : (
                <span className="text-xs text-gray-400">Price on request</span>
              )}
            </div>
            <div className="flex gap-2 mt-1">
              <Link
                href={slug ? `/products/${slug}` : '#'}
                className="flex-1 text-center py-2 border border-primary text-primary rounded-lg text-xs font-semibold hover:bg-primary hover:text-white transition-colors"
              >
                View More
              </Link>
              <button
                onClick={handleAddToCart}
                disabled={adding}
                className="flex-1 py-2 bg-primary text-white rounded-lg text-xs font-semibold hover:bg-dark transition-colors flex items-center justify-center gap-1 disabled:opacity-50"
              >
                {adding
                  ? <Icon icon="svg-spinners:3-dots-fade" width={14} />
                  : <><Icon icon="solar:cart-large-4-bold" width={14} /> Cart</>
                }
              </button>
            </div>
          </div>

          {/* ════════════════════════════════════════════════════════
              DESKTOP layout (≥ sm) — matches official satyajan.com
              ════════════════════════════════════════════════════════ */}
          <div className="hidden sm:flex flex-col flex-1 gap-3">

            {/* Category label — uppercase small text like official site */}
            {category && (
              <p className="text-xs font-bold text-primary uppercase tracking-wider">
                {category}
              </p>
            )}

            {/* Product name — full, not truncated */}
            <Link href={slug ? `/products/${slug}` : '#'}>
              <h3 className="text-base font-bold text-gray-900 leading-snug hover:text-primary transition-colors">
                {name}
              </h3>
            </Link>

            {/* Key Features section */}
            {visibleFeatures.length > 0 && (
              <div className="flex flex-col gap-1.5 flex-1">
                <p className="text-xs font-semibold text-gray-700">Key Features:</p>
                <ul className="flex flex-col gap-1.5">
                  {visibleFeatures.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-gray-600">
                      <Icon icon="ph:check-circle-fill" width={13} className="text-primary mt-0.5 flex-shrink-0" />
                      <span className="line-clamp-2">{feature}</span>
                    </li>
                  ))}
                </ul>
                {extraCount > 0 && (
                  <Link
                    href={slug ? `/products/${slug}` : '#'}
                    className="text-xs text-primary font-medium hover:underline mt-0.5"
                  >
                    +{extraCount} more features
                  </Link>
                )}
              </div>
            )}

            <div className="flex-1" />

            {/* Price pill + View Details — matches official site exactly */}
            <div className="flex items-center justify-between gap-2 mt-1">
              {formattedRate ? (
                <span className="bg-gray-100 text-primary font-bold text-sm px-3 py-1.5 rounded-lg">
                  ₹{formattedRate}
                </span>
              ) : (
                <span className="text-xs text-gray-400">Price on request</span>
              )}
              <Link
                href={slug ? `/products/${slug}` : '#'}
                className="text-sm text-primary font-semibold hover:underline flex items-center gap-1 whitespace-nowrap"
              >
                View Details <Icon icon="solar:arrow-right-linear" width={14} />
              </Link>
            </div>

            {/* Full-width Add to Cart button — matches official site */}
            <button
              onClick={handleAddToCart}
              disabled={adding}
              className="w-full py-2.5 bg-primary text-white rounded-lg font-semibold text-sm hover:bg-dark transition-colors flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95"
            >
              {adding
                ? <><Icon icon="svg-spinners:3-dots-fade" width={18} /> Adding…</>
                : <><Icon icon="solar:cart-large-4-bold" width={18} /> Add to Cart</>
              }
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PropertyCard;