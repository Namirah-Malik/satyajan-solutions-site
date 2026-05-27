'use client';

import { PropertyHomes } from '@/types/properyHomes';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';
import WishlistButton from '@/components/WishlistButton';

const PHONE_NUMBER    = '+918019179159';
const WHATSAPP_NUMBER = '918019179159';

function extractCapacity(name: string = ''): string {
  const kWh = name.match(/(\d+\.?\d*)\s*kWh/i);   if (kWh) return `${kWh[1]} kWh`;
  const kva = name.match(/(\d+\.?\d*)\s*KVA/i);   if (kva) return `${kva[1]} KVA`;
  const vaW = name.match(/(\d+)\s*VA\s*[/\\]?\s*(\d+)\s*W/i); if (vaW) return `${vaW[1]}VA / ${vaW[2]}W`;
  const va  = name.match(/(\d+)\s*VA/i);           if (va)  return `${va[1]}VA`;
  const w   = name.match(/(\d+)\s*W(?:att)?/i);   if (w)   return `${w[1]}W`;
  const ah  = name.match(/(\d+)\s*Ah/i);           if (ah)  return `${ah[1]}Ah`;
  return '';
}

// ── Bestseller matching from Amazon sales data ────────────────────────────────
const BESTSELLER_PATTERNS = [
  'i lithium 1500',
  'heavy duty 1550 advanced',
  'super power ups 900',
  'super power ups 1100',
  'super power 1100.*lithium',
  'luxe wifi.*1400',
  'msmf 7.2',
  'super power 1100 advanced digital',
];

const BESTSELLER_SLUGS = new Set([
  'heavy-duty-ups-1550-vturbo-12v-advanced-digital-wave-1250-va',
  'microtek-dura-strong-m1803624tt-180ah-tall-tubular-inverter-battery-with-adc-tec',
  'microtek-energy-saver-new-1225-12v-pure-sine-wave-inverter-1115va925watt',
  'microtek-super-power-new-700-12v-pure-sine-wave-inverter-600va550watt',
  'microtek-luxe-wifi-1400-12v-pure-sine-wave-inverter-1100va825watt',
]);

const NEW_SLUGS = new Set([
  'microtek-imerlyn-ups-1850-24v-advanced-digital-wave-inverter-1600va1275w-ups-for',
  'microtek-ups-luxe-1900-24v-pure-sine-wave-inverter-1650va1320w-ups-for-home-wish',
  'microtek-luxe-wifi-1400-12v-pure-sine-wave-inverter-1100va825watt',
  'microtek-lithium-battery-100ah256v-mlb2560060-lifepo4-256kwh-3500-cycles',
  'lithium-iron-100ah-battery-deep-cycle-rechargeable-battery-fast-charging-long-li',
]);

const OFFER_PATTERNS = [
  '25.6v lifepo4', '25.6v.*lithium', 'luxe wifi.*lithium.*combo',
  'luxe.*lifepo4.*combo', 'msmf 7.2', 'heavy duty 2350', 'smart hybrid 875',
  'jmsw.*3500', 'jm sw 3500', 'jm sw 2500', 'heavy duty 1550 sw',
  'heavy duty 1750 sw', 'smart hybrid new 875', 'luxe.*1400.*150ah',
  'luxe new 1400.*lifepo4', 'luxe new.*lifepo4',
];

export function getBestsellerRank(name: string): number {
  const lower = name.toLowerCase();
  for (let i = 0; i < BESTSELLER_PATTERNS.length; i++) {
    const pattern = BESTSELLER_PATTERNS[i];
    if (pattern.includes('.*')) {
      try { if (new RegExp(pattern, 'i').test(lower)) return i + 1; } catch { /* skip */ }
    } else {
      if (lower.includes(pattern)) return i + 1;
    }
  }
  return 0;
}

function isOfferProduct(name: string, slug: string = ''): boolean {
  const lower = (name + ' ' + slug).toLowerCase();
  return OFFER_PATTERNS.some(pattern => {
    if (pattern.includes('.*')) {
      try { return new RegExp(pattern, 'i').test(lower); } catch { return false; }
    }
    return lower.includes(pattern);
  });
}

// ── Stock status badge colour ─────────────────────────────────────────────────
function stockClass(status: string): string {
  if (status === 'In Stock') return 'bg-green-100 text-green-700';
  if (status === 'Available in 5-7 Days') return 'bg-amber-100 text-amber-700';
  return 'bg-red-100 text-red-700';
}

// ─────────────────────────────────────────────────────────────────────────────

const PropertyCard: React.FC<{ item: PropertyHomes }> = ({ item }) => {
  const { name, rate, slug, images, features, category } = item;
  const stockStatus = (item as any).stockStatus as string | undefined;

  const capacity    = item.capacity || extractCapacity(name);
  const bsRank      = getBestsellerRank(name);
  const isBestSeller = item.isBestSeller ?? (bsRank > 0 || BESTSELLER_SLUGS.has(slug));
  const isNew        = item.isNew        ?? NEW_SLUGS.has(slug);
  const isOffer      = isOfferProduct(name, slug);

  const { addToCart } = useCart();
  const [adding,    setAdding]    = useState(false);
  const [cartFlash, setCartFlash] = useState(false);
  const [imgError,  setImgError]  = useState(false);

  const rawImage = (() => {
    if (!Array.isArray(images) || images.length === 0) return null;
    for (const img of images) {
      const src = typeof img === 'string' ? img : (img as any)?.src;
      if (src && typeof src === 'string' && src.trim().length > 0) return src.trim();
    }
    return null;
  })();

  const mainImage     = rawImage;
  const showImage     = mainImage && !imgError;
  const price         = Number(rate) || 0;
  const formattedRate = price > 0 ? price.toLocaleString('en-IN') : null;
  const SKU           = slug?.trim() ? slug.toUpperCase().replace(/\s+/g, '-') : `PROD-${Date.now()}`;
  const waPhone       = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hi, I'm interested in ${name}. Please share more details.`)}`;

  // Features list
  const visibleFeatures = (features || []).slice(0, 3);
  const extraCount      = Math.max(0, (features?.length || 0) - 3);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (adding) return;
    setAdding(true); setCartFlash(true);
    addToCart({ id: slug, name, SKU, price, image: mainImage || '/images/fallback.jpg' });
    setTimeout(() => { setAdding(false); setCartFlash(false); }, 700);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    try {
      sessionStorage.setItem('buyNowItem', JSON.stringify({
        id: slug, name, SKU, price,
        image: mainImage || '/images/fallback.jpg', quantity: 1,
      }));
    } catch {}
    window.location.href = '/cart?mode=buynow';
  };

  const displayStock = stockStatus || 'In Stock';

  return (
    <div className="w-full h-full group">
      <div className="relative rounded-2xl bg-white overflow-hidden flex flex-col h-full border border-gray-100 shadow-sm hover:shadow-[0_8px_30px_rgba(0,0,0,0.10)] hover:-translate-y-1 transition-all duration-300">

        {/* Top accent bar */}
        <div className={`absolute top-0 left-0 right-0 h-0.5 z-10 ${
          isOffer
            ? 'bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400'
            : isBestSeller
              ? 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400'
              : 'bg-gradient-to-r from-primary via-emerald-400 to-teal-400'
        }`} />

        {/* Image area */}
        <Link href={slug ? `/products/${slug}` : '#'} className="block flex-shrink-0 relative">
          <div className="relative w-full overflow-hidden bg-gradient-to-b from-gray-50 to-white" style={{ aspectRatio: '1/1' }}>

            {/* Wishlist */}
            <div className="absolute top-2.5 right-2.5 z-20">
              <WishlistButton
                item={{ id: String(slug || ''), name: name || '', price, image: mainImage || '/images/fallback.jpg', category: category || '', SKU }}
                size="sm"
              />
            </div>

            {/* Badges */}
            <div className="absolute top-2.5 left-2.5 z-20 flex flex-col gap-1">
              {isOffer && (
                <span className="inline-flex items-center gap-1 bg-red-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-md tracking-wide">
                  🔥 10% OFF
                </span>
              )}
              {isBestSeller && (
                <span className="inline-flex items-center gap-1 bg-amber-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-md tracking-wide">
                  🏆 BESTSELLER
                </span>
              )}
              {isNew && !isBestSeller && (
                <span className="inline-flex items-center gap-1 bg-emerald-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-md tracking-wide">
                  ✦ NEW
                </span>
              )}
            </div>

            {showImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={mainImage!} alt={name} loading="lazy"
                onError={() => setImgError(true)}
                className="w-full h-full object-contain p-4 sm:p-5 group-hover:scale-[1.04] transition-transform duration-500 ease-out"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Icon icon="ph:lightning-fill" className="text-gray-200" width={48} />
              </div>
            )}
          </div>
        </Link>

        {/* Content */}
        <div className="flex flex-col flex-1 px-3 pb-3 pt-2.5 sm:px-4 sm:pb-4 sm:pt-3 gap-2">

          {/* Category + stock row */}
          <div className="flex items-center gap-2 min-w-0">
            {category && (
              <span className="text-[9px] sm:text-[10px] font-bold text-primary uppercase tracking-widest truncate min-w-0">
                {category}
              </span>
            )}
            <span className={`flex-shrink-0 whitespace-nowrap text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-full ${stockClass(displayStock)}`}>
              {displayStock}
            </span>
          </div>

          {/* Product name */}
          <Link href={slug ? `/products/${slug}` : '#'} className="block">
            <h3 className="text-[12px] sm:text-[13px] font-bold text-gray-800 leading-snug line-clamp-2 group-hover:text-primary transition-colors duration-200">
              {name}
            </h3>
          </Link>

          {/* Capacity chip */}
          {capacity && (
            <div className="inline-flex items-center gap-1.5 w-fit bg-primary/10 border border-primary/15 text-primary text-[10px] sm:text-[11px] font-bold px-2 py-1 rounded-lg">
              <Icon icon="ph:lightning-fill" width={9} className="text-primary flex-shrink-0" />
              {capacity}
            </div>
          )}

          {/* Key features (desktop) */}
          {visibleFeatures.length > 0 && (
            <div className="hidden sm:flex flex-col gap-1.5 flex-1">
              <p className="text-xs font-semibold text-gray-700">Key Features:</p>
              <ul className="flex flex-col gap-1.5">
                {visibleFeatures.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-gray-600">
                    <Icon icon="ph:check-circle-fill" width={13} className="text-primary mt-0.5 shrink-0" />
                    <span className="line-clamp-1">{feature}</span>
                  </li>
                ))}
              </ul>
              {extraCount > 0 && (
                <Link href={slug ? `/products/${slug}` : '#'} className="text-xs text-primary font-medium hover:underline mt-0.5">
                  +{extraCount} more features
                </Link>
              )}
            </div>
          )}

          <div className="flex-1 min-h-[4px]" />

          {/* Price */}
          <div>
            {formattedRate ? (
              <>
                <div className="flex items-baseline gap-2">
                  {isOffer && (
                    <span className="text-[10px] text-gray-400 line-through font-medium">
                      ₹{Math.round(price / 0.9).toLocaleString('en-IN')}
                    </span>
                  )}
                  <span className="text-lg sm:text-xl font-black text-gray-900 tracking-tight">
                    ₹<span className={isOffer ? 'text-red-500' : 'text-primary'}>{formattedRate}</span>
                  </span>
                  {isOffer && (
                    <span className="text-[10px] font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded-md">Save 10%</span>
                  )}
                </div>
                <p className="text-[9px] sm:text-[10px] text-gray-400 font-medium mt-0.5">Incl. of all taxes</p>
              </>
            ) : (
              <span className="text-xs text-gray-400 font-medium italic">Price on request</span>
            )}
          </div>

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            disabled={adding}
            className={`w-full py-2 sm:py-2.5 rounded-xl font-bold text-[11px] sm:text-[13px] flex items-center justify-center gap-1.5 transition-all duration-200 active:scale-95 disabled:opacity-70 ${
              cartFlash ? 'bg-emerald-500 text-white scale-[0.98]' : 'bg-gray-900 hover:bg-primary text-white'
            }`}
          >
            {adding
              ? <><Icon icon="svg-spinners:3-dots-fade" width={16} /> Adding…</>
              : <><Icon icon="solar:cart-large-4-bold" width={14} /> Add to Cart</>}
          </button>

          {/* Buy Now (mobile) */}
          <button
            onClick={handleBuyNow}
            className="sm:hidden w-full py-1.5 border-2 border-primary text-primary rounded-xl text-[11px] font-bold hover:bg-primary hover:text-white transition-colors flex items-center justify-center gap-1"
          >
            <Icon icon="solar:bolt-bold" width={12} /> Buy Now
          </button>

          {/* Call + WhatsApp */}
          <div className="grid grid-cols-2 gap-1.5">
            <a
              href={`tel:${PHONE_NUMBER}`}
              className="flex items-center justify-center gap-1 sm:gap-1.5 border border-gray-200 hover:border-gray-400 bg-white hover:bg-gray-50 text-gray-700 font-bold rounded-xl py-1.5 sm:py-2 text-[10px] sm:text-[11px] transition-all duration-200 active:scale-95"
            >
              <Icon icon="solar:phone-bold" width={12} className="text-gray-600" /> Call Us
            </a>
            <a
              href={waPhone} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-1 sm:gap-1.5 bg-[#25D366] hover:bg-[#20c05c] text-white font-bold rounded-xl py-1.5 sm:py-2 text-[10px] sm:text-[11px] transition-all duration-200 active:scale-95 shadow-sm"
            >
              <Icon icon="ic:baseline-whatsapp" width={13} /> WhatsApp
            </a>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PropertyCard;