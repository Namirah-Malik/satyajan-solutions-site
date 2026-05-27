'use client';

import { Icon } from '@iconify/react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import CallMeBackModal from '@/components/CallMeBackModal';
import { useScrollModal } from '@/hooks/useScrollModal';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';
import EMICalculator from '@/components/EMI/EMICalculator';
import BlogEducationBanner from '@/components/BlogEducationBanner';
import Breadcrumb from '@/components/Breadcrumb';

const ProductGallery = dynamic<{ images: { src: string }[]; name: string }>(
  () => import('@/components/Home/Product/ProductGallery'),
);

interface Props {
  product: any;
  images: { src: string }[];
  formattedPrice: string;
  tabItems: any[];
}

// ── Parse warranty from features / salient_features ───────────────────────────
function parseWarranty(features: string[], salient: string[]): { label: string; detail: string } | null {
  const all = [...(salient || []), ...(features || [])];
  for (const f of all) {
    if (!/warranty/i.test(f)) continue;
    const proRata = f.match(/(\d+)\s*months?\s*(?:warranty)?[:\s-]*\(?(\d+)\s*months?\s*flat\s*\+\s*(\d+)\s*months?\s*pro[- ]?rata\)?/i);
    if (proRata) {
      return {
        label: `${proRata[1]}-Month Warranty`,
        detail: `${proRata[2]} months flat + ${proRata[3]} months pro-rata`,
      };
    }
    const yr = f.match(/(\d+)[- ]?[Yy]ear[s]?\s*[Ww]arranty/);
    if (yr) return { label: `${yr[1]}-Year Warranty`, detail: '' };
    const mo = f.match(/(\d+)\s*[Mm]onths?\s*[Ww]arranty/);
    if (mo) return { label: `${mo[1]}-Month Warranty`, detail: '' };
  }
  return null;
}

// ── Pincode delivery estimator ────────────────────────────────────────────────
function PincodeChecker() {
  const [pin, setPin] = useState('');
  const [result, setResult] = useState<null | { days: string; city: string; ok: boolean }>(null);
  const [checking, setChecking] = useState(false);

  const check = () => {
    const p = pin.trim();
    if (p.length !== 6 || !/^\d{6}$/.test(p)) {
      setResult({ days: '', city: 'Enter a valid 6-digit pincode', ok: false });
      return;
    }
    setChecking(true);
    setTimeout(() => {
      let days = ''; let city = ''; let ok = true;
      if (/^500/.test(p) || /^501/.test(p) || /^502/.test(p)) {
        days = '1–3 business days'; city = 'Hyderabad / Secunderabad';
      } else if (/^50/.test(p) || /^503/.test(p) || /^504/.test(p) || /^505/.test(p) || /^506/.test(p) || /^507/.test(p) || /^508/.test(p)) {
        days = '2–4 business days'; city = 'Telangana';
      } else if (/^5/.test(p)) {
        days = '3–5 business days'; city = 'South India';
      } else {
        days = '5–7 business days'; city = 'Pan India';
      }
      setResult({ days, city, ok });
      setChecking(false);
    }, 600);
  };

  return (
    <div className="border border-gray-200 rounded-xl p-4 bg-white">
      <p className="text-xs font-bold text-gray-700 mb-2 flex items-center gap-1.5">
        <Icon icon="ph:truck-fill" className="text-primary" width={14} />
        Check Delivery to Your Area
      </p>
      <div className="flex gap-2">
        <input
          type="tel" inputMode="numeric" maxLength={6}
          value={pin} onChange={e => { setPin(e.target.value.replace(/\D/g, '').slice(0, 6)); setResult(null); }}
          onKeyDown={e => e.key === 'Enter' && check()}
          placeholder="Enter 6-digit pincode"
          className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
        />
        <button
          onClick={check} disabled={pin.length < 6 || checking}
          className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold hover:bg-dark transition-colors disabled:opacity-50"
        >
          {checking ? <Icon icon="svg-spinners:3-dots-fade" width={18} /> : 'Check'}
        </button>
      </div>
      {result && (
        <div className={`mt-2.5 flex items-start gap-2 px-3 py-2.5 rounded-xl text-xs font-medium ${
          result.ok ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' : 'bg-red-50 border border-red-200 text-red-700'
        }`}>
          <Icon icon={result.ok ? 'ph:truck-fill' : 'ph:warning-circle-fill'} width={14} className="flex-shrink-0 mt-0.5" />
          <span>
            {result.ok
              ? <><strong>{result.days}</strong> delivery to {result.city} (pincode {pin})</>
              : result.city}
          </span>
        </div>
      )}
    </div>
  );
}

// ── What You Get from Satyajan ────────────────────────────────────────────────
const SATYAJAN_PROMISES = [
  { icon: 'ph:truck-fill', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', label: 'Free Delivery', sub: 'Across Hyderabad & Telangana' },
  { icon: 'ph:wrench-fill', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', label: 'Expert Installation', sub: 'By certified technicians' },
  { icon: 'ph:shield-check-fill', color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200', label: 'Paperless Warranty', sub: 'Digital warranty registration' },
  { icon: 'ph:receipt-fill', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200', label: 'GST Invoice Included', sub: 'Official tax invoice' },
  { icon: 'ic:baseline-whatsapp', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', label: 'Direct WhatsApp Support', sub: '+91 8019179159' },
  { icon: 'ph:medal-fill', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', label: 'Authorized Microtek Dealer', sub: 'Genuine products guaranteed' },
];

function WhatYouGet() {
  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden">
      <div className="px-4 py-3 bg-gray-900 flex items-center gap-2">
        <Icon icon="ph:seal-check-fill" className="text-primary" width={16} />
        <p className="text-sm font-bold text-white">What You Get from Satyajan Energy</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-px bg-gray-100">
        {SATYAJAN_PROMISES.map((p) => (
          <div key={p.label} className="flex items-start gap-2.5 p-3 bg-white">
            <div className={`flex-shrink-0 w-8 h-8 rounded-lg ${p.bg} ${p.border} border flex items-center justify-center`}>
              <Icon icon={p.icon} className={p.color} width={15} />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] sm:text-xs font-bold text-gray-800 leading-snug">{p.label}</p>
              <p className="text-[10px] sm:text-[11px] text-gray-500 leading-snug mt-0.5">{p.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Warranty badge ────────────────────────────────────────────────────────────
function WarrantyBadge({ label, detail }: { label: string; detail: string }) {
  return (
    <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2.5">
      <Icon icon="ph:shield-check-fill" className="text-emerald-600 flex-shrink-0" width={20} />
      <div>
        <p className="text-sm font-bold text-emerald-800">{label}</p>
        {detail && (
          <p className="text-xs text-emerald-600 mt-0.5">{detail}</p>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

export default function ProductDetailsClient({ product, images, formattedPrice, tabItems }: Props) {
  const { showModal, closeModal } = useScrollModal({ triggerTimeMs: 60000, showOnFooterReach: true });
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);

  const price = typeof product.price === 'number' ? product.price : Number(product.price) || 0;
  const mainImage = images?.[0]?.src || '/images/fallback.jpg';

  const handleAddToCart = () => {
    setAdding(true);
    addToCart({ id: product.id || product.SKU, name: product.name, SKU: product.SKU || `SKU-${product.id}`, price, image: mainImage });
    setTimeout(() => setAdding(false), 500);
  };

  const tags: string[] = Array.isArray(product.tags) ? product.tags : [];
  const warrantyInfo = parseWarranty(product.features || [], product.salient_features || []);

  return (
    <>
      <main className="min-h-screen pt-20 sm:pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Products', href: '/products' },
              { label: product.category, href: `/products?category=${encodeURIComponent(product.category)}` },
              { label: product.name, href: `/products/${product.slug}` },
            ]}
          />

          <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 items-start">
            <div className="w-full sm:w-[45%] flex-shrink-0 sm:sticky sm:top-28">
              <div className="rounded-2xl border border-gray-200 bg-white shadow p-4">
                <ProductGallery images={images} name={product.name} />
              </div>
            </div>

            <div className="flex-1 flex flex-col gap-4">
              <div className="flex items-center gap-3 flex-wrap">
                {product.category && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider border border-primary/20">
                    {product.category}
                  </span>
                )}
                <BlogEducationBanner category={product.categorySlug || product.category} />
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                {product.name}
              </h1>

              <p className="text-sm text-gray-500">SKU: {product.SKU}</p>

              <div>
                <span className="text-3xl sm:text-4xl font-bold text-primary">{formattedPrice}</span>
                {price > 0 && (
                  <p className="text-xs text-gray-400 font-medium mt-1">Inclusive of all taxes (GST included)</p>
                )}
              </div>

              {warrantyInfo && <WarrantyBadge label={warrantyInfo.label} detail={warrantyInfo.detail} />}

              {price > 0 && <EMICalculator price={price} />}

              <PincodeChecker />

              {product.description && (
                <div className="border border-gray-200 rounded-xl p-5 bg-gray-50">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">About This Product</p>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{product.description}</p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={adding}
                  className="flex-1 bg-primary text-white px-6 py-3 rounded-full font-semibold hover:bg-dark transition-colors shadow-md flex items-center justify-center gap-2 disabled:opacity-50 text-sm sm:text-base"
                >
                  {adding
                    ? <><Icon icon="svg-spinners:3-dots-fade" width={20} /> Adding...</>
                    : <><Icon icon="solar:cart-large-4-bold" width={20} /> Add to Cart</>}
                </button>
                <Link
                  href="https://wa.me/918019179159" target="_blank" rel="noopener noreferrer"
                  className="flex-1 border-2 border-primary text-primary px-6 py-3 rounded-full font-semibold hover:bg-primary hover:text-white transition-colors text-center text-sm sm:text-base"
                >
                  Inquire Now
                </Link>
              </div>

              <WhatYouGet />

              {product.data && Array.isArray(product.data) && product.data.some((i: any) => i?.labal) && (
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <div className="grid grid-cols-3 divide-x divide-gray-200">
                    {product.data.slice(0, 3).map((item: any, i: number) => {
                      if (!item?.labal) return null;
                      return (
                        <div key={i} className="flex flex-col items-center py-4 px-3 text-center bg-white">
                          <p className="text-xs text-gray-400 font-medium mb-1">{String(item.labal)}</p>
                          <p className="text-xs sm:text-sm font-bold text-gray-900">{String(item.value)}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {Array.isArray(product.salient_features) && product.salient_features.length > 0 && (
                <div>
                  <h3 className="text-base font-bold text-gray-900 mb-3">Key Highlights</h3>
                  <div className="flex flex-col gap-2">
                    {product.salient_features.map((f: string, i: number) => (
                      <div key={i} className="flex items-start gap-2 px-4 py-2.5 bg-primary/5 border border-primary/20 rounded-full">
                        <Icon icon="ph:seal-check-fill" className="text-primary mt-0.5 flex-shrink-0" width={16} />
                        <p className="text-xs sm:text-sm text-primary font-medium leading-snug">{f}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {Array.isArray(product.features) && product.features.length > 0 && (
                <div className="border border-gray-200 rounded-xl p-5 bg-blue-50/40">
                  <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Icon icon="ph:list-checks-fill" className="text-primary" width={18} />
                    Product Features ({product.features.length})
                  </h3>
                  <ul className="flex flex-col gap-2">
                    {product.features.map((f: string, i: number) => (
                      <li key={i} className="flex items-start gap-2">
                        <Icon icon="ph:check-circle-fill" className="text-primary mt-0.5 flex-shrink-0" width={18} />
                        <p className="text-sm text-gray-700 leading-snug">{f}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {Array.isArray(product.specifications) && product.specifications.length > 0 && (
                <div>
                  <h3 className="text-base font-bold text-gray-900 mb-3">Specifications</h3>
                  <div className="overflow-x-auto rounded-xl border border-gray-200">
                    <table className="w-full text-sm">
                      <tbody>
                        {product.specifications.map((spec: any, i: number) => (
                          <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="px-4 py-3 font-medium text-gray-700 border-b border-gray-100 w-1/2">{spec.labal}</td>
                            <td className="px-4 py-3 text-gray-600 border-b border-gray-100">{spec.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {tags.length > 0 && (
                <div className="pt-2">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag: string, i: number) => (
                      <Link key={i} href={`/products?search=${encodeURIComponent(tag)}`}
                        className="inline-block px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-medium hover:bg-primary/10 hover:text-primary transition-colors border border-gray-200">
                        {tag}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {product.category && (
                <div className="pt-2 border-t border-gray-100">
                  <p className="text-sm text-gray-500">
                    Category:{' '}
                    <Link href={`/products?category=${encodeURIComponent(product.category)}`} className="text-primary font-semibold hover:underline">
                      {product.category}
                    </Link>
                  </p>
                </div>
              )}

            </div>
          </div>
        </div>
      </main>

      <CallMeBackModal isOpen={showModal} onClose={closeModal} />
    </>
  );
}