'use client';

import { PropertyHomes } from '@/types/properyHomes';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';
import WishlistButton from '@/components/WishlistButton';

// ── Constants ─────────────────────────────────────────────────────────────────
const PHONE_NUMBER    = '+918019179159';
const WHATSAPP_NUMBER = '918019179159';

// ── Auto-extract warranty from features ───────────────────────────────────────
function extractWarranty(features: string[] = [], salientFeatures: string[] = [], category: string = ''): string {
  const all = [...features, ...salientFeatures];
  for (const f of all) {
    const m = f.match(/(\d+[\s-]*(year|month|yr)s?\s*(warranty)?)/i);
    if (m) {
      const num  = f.match(/\d+/)?.[0] || '';
      const unit = /month/i.test(f) ? 'Month' : 'Year';
      return `${num} ${unit}`;
    }
  }
  // ── Default warranty by category ──────────────────────────────────────────
  const cat = category.toLowerCase();
  if (
    cat.includes('inverter') ||
    cat.includes('ups')      ||
    cat === 'combo'          ||
    cat === 'combos'
  ) return '3 Year';
  if (cat.includes('lithium'))                              return '5 Year';
  if (cat.includes('battery') && !cat.includes('lithium')) return '5 Year';
  if (cat.includes('solar'))                               return '10 Year';
  return '';
}

// ── Auto-extract capacity from product name ───────────────────────────────────
function extractCapacity(name: string = ''): string {
  const kWh = name.match(/(\d+\.?\d*)\s*kWh/i);
  if (kWh) return `${kWh[1]} kWh`;
  const kva = name.match(/(\d+\.?\d*)\s*KVA/i);
  if (kva) return `${kva[1]} KVA`;
  const vaW = name.match(/(\d+)\s*VA\s*[/\\]?\s*(\d+)\s*W/i);
  if (vaW) return `${vaW[1]}VA / ${vaW[2]}W`;
  const va  = name.match(/(\d+)\s*VA/i);
  if (va)  return `${va[1]}VA`;
  const w   = name.match(/(\d+)\s*W(?:att)?/i);
  if (w)   return `${w[1]}W`;
  const ah  = name.match(/(\d+)\s*Ah/i);
  if (ah)  return `${ah[1]}Ah`;
  return '';
}

// ── Auto-derive Suitable For from category + name ────────────────────────────
function deriveSuitableFor(category: string = '', name: string = ''): string {
  const cat = category.toLowerCase();

  if (cat.includes('online ups')) {
    const kva = name.match(/(\d+\.?\d*)\s*KVA/i);
    if (kva) {
      const v = parseFloat(kva[1]);
      if (v <= 1)  return 'Shop / Small Office';
      if (v <= 3)  return 'Office / Server Room';
      return 'Business / Industry';
    }
    return 'Shop / Office';
  }

  if (cat.includes('high capacity')) {
    const kva = name.match(/(\d+\.?\d*)\s*KVA/i);
    if (kva) {
      const v = parseFloat(kva[1]);
      if (v <= 2.5) return 'Shop / Office';
      if (v <= 4)   return 'Office / Business';
      return 'Large Business';
    }
    return 'Shop / Office';
  }

  if (cat.includes('solar'))   return 'Home / Business';
  if (cat.includes('lithium')) return 'Home / EV';

  if (cat.includes('inverter')) {
    const va = name.match(/(\d+)\s*VA/i);
    if (va) {
      const v = parseInt(va[1]);
      if (v <= 750)  return '1 BHK';
      if (v <= 950)  return '1–2 BHK';
      if (v <= 1150) return '2 BHK';
      if (v <= 1400) return '2–3 BHK';
      if (v <= 1700) return '3 BHK';
      return '3 BHK / Villa';
    }
    return '1–2 BHK';
  }

  if (cat.includes('battery')) {
    const ah = name.match(/(\d+)\s*Ah/i);
    if (ah) {
      const v = parseInt(ah[1]);
      if (v <= 100)  return '1 BHK';
      if (v <= 140)  return '1–2 BHK';
      if (v <= 160)  return '2 BHK';
      if (v <= 185)  return '2–3 BHK';
      if (v <= 210)  return '3 BHK';
      return '3 BHK / Villa';
    }
    return '1–2 BHK';
  }

  return 'Home / Office';
}

// ── Bestseller slugs ──────────────────────────────────────────────────────────
const BESTSELLER_SLUGS = new Set([
  'heavy-duty-ups-1550-vturbo-12v-advanced-digital-wave-1250-va',
  'microtek-dura-strong-m1803624tt-180ah-tall-tubular-inverter-battery-with-adc-tec',
  'microtek-energy-saver-new-1225-12v-pure-sine-wave-inverter-1115va925watt',
  'microtek-super-power-new-700-12v-pure-sine-wave-inverter-600va550watt',
  'microtek-luxe-wifi-1400-12v-pure-sine-wave-inverter-1100va825watt',
]);

// ── New product slugs ─────────────────────────────────────────────────────────
const NEW_SLUGS = new Set([
  'microtek-imerlyn-ups-1850-24v-advanced-digital-wave-inverter-1600va1275w-ups-for',
  'microtek-ups-luxe-1900-24v-pure-sine-wave-inverter-1650va1320w-ups-for-home-wish',
  'microtek-luxe-wifi-1400-12v-pure-sine-wave-inverter-1100va825watt',
  'microtek-lithium-battery-100ah256v-mlb2560060-lifepo4-256kwh-3500-cycles',
  'lithium-iron-100ah-battery-deep-cycle-rechargeable-battery-fast-charging-long-li',
]);

// ─────────────────────────────────────────────────────────────────────────────

const PropertyCard: React.FC<{ item: PropertyHomes }> = ({ item }) => {
  const { name, rate, slug, images, features, category } = item;

  const warranty    = item.warranty    || extractWarranty(features, (item as any).salient_features, category || '');
  const capacity    = item.capacity    || extractCapacity(name);
  const suitableFor = item.suitableFor || deriveSuitableFor(category, name);
  const isBestSeller = item.isBestSeller ?? BESTSELLER_SLUGS.has(slug);
  const isNew        = item.isNew        ?? NEW_SLUGS.has(slug);

  const { addToCart } = useCart();
  const [adding,   setAdding]   = useState(false);
  const [imgError, setImgError] = useState(false);

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
  const formattedRate = rate && !isNaN(Number(rate)) ? Number(rate).toLocaleString('en-IN') : null;
  const price         = Number(rate) || 0;
  const SKU           = slug?.trim() ? slug.toUpperCase().replace(/\s+/g, '-') : `PROD-${Date.now()}`;
  const visibleFeatures = features?.slice(0, 3) || [];
  const extraCount    = Math.max(0, (features?.length || 0) - 3);
  const waPhone       = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hi, I'm interested in ${name}. Please share more details.`)}`;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    setAdding(true);
    addToCart({ id: slug, name, SKU, price, image: mainImage || '/images/fallback.jpg' });
    setTimeout(() => setAdding(false), 500);
  };

  const handleBuyNow = () => {
    sessionStorage.setItem('buyNowItem', JSON.stringify({
      id: slug, name, SKU, price,
      image: mainImage || '/images/fallback.jpg', quantity: 1,
    }));
    window.location.href = '/cart?mode=buynow';
  };

  return (
    <div className="w-full transition-transform duration-200 hover:-translate-y-0.5">
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden flex flex-col h-full shadow-sm hover:shadow-lg transition-shadow duration-200">

        {/* ── IMAGE ── */}
        <Link href={slug ? `/products/${slug}` : '#'} className="block flex-shrink-0">
          <div className="relative w-full bg-gray-50 overflow-hidden aspect-[4/3] sm:aspect-square">

            {/* Labels */}
            <div className="absolute top-2 left-2 z-20 flex flex-col gap-1">
              {isBestSeller && (
                <span className="inline-flex items-center gap-1 bg-orange-500 text-white text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                  🏆 Bestseller
                </span>
              )}
              {isNew && (
                <span className="inline-flex items-center gap-1 bg-green-600 text-white text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                  ✨ New
                </span>
              )}
            </div>

            {showImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={mainImage!} alt={name} loading="lazy"
                onError={() => setImgError(true)}
                className="w-full h-full object-contain p-4 hover:scale-105 transition-transform duration-300" />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <Icon icon="ph:lightning-fill" className="text-gray-300" width={48} />
              </div>
            )}

            <div className="absolute top-2 right-2 z-20">
              <WishlistButton
                item={{ id: String(slug || ''), name: name || '', price, image: mainImage || '/images/fallback.jpg', category: category || '', SKU }}
                size="sm"
              />
            </div>
          </div>
        </Link>

        {/* ── CONTENT ── */}
        <div className="flex flex-col flex-1 p-3 sm:p-5">

          {/* ════ MOBILE (< sm) ════ */}
          <div className="flex flex-col gap-2 sm:hidden">

            {category && (
              <span className="text-[9px] font-bold text-primary uppercase tracking-wide bg-primary/10 px-2 py-0.5 rounded-full w-fit">
                {category}
              </span>
            )}

            <h3 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2">{name}</h3>

            <div>
              {formattedRate
                ? <span className="text-base font-extrabold text-primary">₹{formattedRate}</span>
                : <span className="text-xs text-gray-400">Price on request</span>}
            </div>

            {warranty && (
              <div className="flex items-center gap-1 bg-green-50 border border-green-200 rounded-lg px-2 py-1">
                <Icon icon="solar:shield-check-bold" className="text-green-600" width={12} />
                <span className="text-[10px] font-semibold text-green-700">{warranty} Warranty</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-1.5">
              <a href={`tel:${PHONE_NUMBER}`}
                className="flex items-center justify-center gap-1 bg-slate-700 hover:bg-slate-800 text-white rounded-lg py-1.5 text-[10px] font-bold transition-colors">
                <Icon icon="solar:phone-bold" width={11} /> Call
              </a>
              <a href={waPhone} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-1 bg-[#25D366] hover:bg-[#1fba58] text-white rounded-lg py-1.5 text-[10px] font-bold transition-colors">
                <Icon icon="ic:baseline-whatsapp" width={12} /> WhatsApp
              </a>
            </div>

            <button onClick={handleAddToCart} disabled={adding}
              className="w-full py-2 bg-primary text-white rounded-lg text-xs font-semibold hover:bg-dark transition-colors flex items-center justify-center gap-1 disabled:opacity-50">
              {adding
                ? <Icon icon="svg-spinners:3-dots-fade" width={14} />
                : <><Icon icon="solar:cart-large-4-bold" width={14} /> Add to Cart</>}
            </button>

            <button onClick={handleBuyNow}
              className="w-full py-1.5 border-2 border-primary text-primary rounded-lg text-xs font-semibold hover:bg-primary hover:text-white transition-colors flex items-center justify-center gap-1">
              <Icon icon="solar:bolt-bold" width={12} /> Buy Now
            </button>
          </div>

          {/* ════ DESKTOP (≥ sm) ════ */}
          <div className="hidden sm:flex flex-col flex-1 gap-3">

            {category && (
              <p className="text-xs font-bold text-primary uppercase tracking-wider">{category}</p>
            )}

            <Link href={slug ? `/products/${slug}` : '#'}>
              <h3 className="text-base font-bold text-gray-900 leading-snug hover:text-primary transition-colors line-clamp-2">
                {name}
              </h3>
            </Link>

            {/* Capacity + Suitable For */}
            {(capacity || suitableFor) && (
              <div className="grid grid-cols-2 gap-2">
                {capacity && (
                  <div className="bg-gray-50 border border-gray-100 rounded-lg p-2">
                    <p className="text-[10px] text-gray-400 font-medium mb-0.5">Capacity</p>
                    <p className="text-xs font-bold text-gray-800">{capacity}</p>
                  </div>
                )}
                {suitableFor && (
                  <div className="bg-gray-50 border border-gray-100 rounded-lg p-2">
                    <p className="text-[10px] text-gray-400 font-medium mb-0.5">Suitable For</p>
                    <p className="text-xs font-bold text-gray-800">{suitableFor}</p>
                  </div>
                )}
              </div>
            )}

            {/* Key features */}
            {visibleFeatures.length > 0 && (
              <div className="flex flex-col gap-1.5 flex-1">
                <p className="text-xs font-semibold text-gray-700">Key Features:</p>
                <ul className="flex flex-col gap-1.5">
                  {visibleFeatures.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-gray-600">
                      <Icon icon="ph:check-circle-fill" width={13} className="text-primary mt-0.5 flex-shrink-0" />
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

            {/* Warranty */}
            {warranty && (
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                <Icon icon="solar:shield-check-bold" className="text-green-600 flex-shrink-0" width={16} />
                <span className="text-xs font-semibold text-green-700">{warranty} Warranty</span>
              </div>
            )}

            <div className="flex-1" />

            {/* Price */}
            <div className="flex items-center justify-between gap-2">
              {formattedRate
                ? <span className="bg-gray-100 text-primary font-bold text-sm px-3 py-1.5 rounded-lg">₹{formattedRate}</span>
                : <span className="text-xs text-gray-400">Price on request</span>}
              <Link href={slug ? `/products/${slug}` : '#'}
                className="text-sm text-primary font-semibold hover:underline flex items-center gap-1 whitespace-nowrap">
                Details <Icon icon="solar:arrow-right-linear" width={14} />
              </Link>
            </div>

            {/* Call + WhatsApp */}
            <div className="grid grid-cols-2 gap-2">
              <a href={`tel:${PHONE_NUMBER}`}
                className="flex items-center justify-center gap-1.5 bg-slate-700 hover:bg-slate-800 text-white rounded-lg py-2 text-xs font-bold transition-colors">
                <Icon icon="solar:phone-bold" width={14} /> Call Us
              </a>
              <a href={waPhone} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 bg-[#25D366] hover:bg-[#1fba58] text-white rounded-lg py-2 text-xs font-bold transition-colors">
                <Icon icon="ic:baseline-whatsapp" width={15} /> WhatsApp
              </a>
            </div>

            {/* Add to Cart + Buy Now */}
            <div className="flex flex-col gap-2">
              <button onClick={handleAddToCart} disabled={adding}
                className="w-full py-2.5 bg-primary text-white rounded-lg font-semibold text-sm hover:bg-dark transition-colors flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95">
                {adding
                  ? <><Icon icon="svg-spinners:3-dots-fade" width={18} /> Adding…</>
                  : <><Icon icon="solar:cart-large-4-bold" width={18} /> Add to Cart</>}
              </button>
              <button onClick={handleBuyNow}
                className="w-full py-2.5 border-2 border-primary text-primary rounded-lg font-semibold text-sm hover:bg-primary hover:text-white transition-colors flex items-center justify-center gap-2 active:scale-95">
                <Icon icon="solar:bolt-bold" width={16} /> Buy Now
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
