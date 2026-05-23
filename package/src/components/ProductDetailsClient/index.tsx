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

function stockTokens(status?: string) {
  const s = status || 'In Stock';
  if (s === 'In Stock')              return { bg: 'bg-primary/10',  text: 'text-primary',  border: 'border-primary/30',  icon: 'ph:check-circle-fill', dot: 'bg-primary'  };
  if (s === 'Available in 5-7 Days') return { bg: 'bg-amber-50',    text: 'text-amber-700', border: 'border-amber-200',  icon: 'ph:clock-fill',         dot: 'bg-amber-500' };
  return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', icon: 'ph:x-circle-fill', dot: 'bg-red-500' };
}

export default function ProductDetailsClient({
  product,
  images,
  formattedPrice,
}: Props) {
  const { showModal, closeModal } = useScrollModal({
    triggerTimeMs: 60000,
    showOnFooterReach: true,
  });

  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);

  const price =
    typeof product.price === 'number'
      ? product.price
      : Number(product.price) || 0;

  const mainImage = images?.[0]?.src || '/images/fallback.jpg';
  const stock = stockTokens(product.stockStatus);
  const stockLabel = product.stockStatus || 'In Stock';

  const handleAddToCart = () => {
    setAdding(true);
    addToCart({
      id: product.id || product.SKU,
      name: product.name,
      SKU: product.SKU || `SKU-${product.id}`,
      price,
      image: mainImage,
    });
    setTimeout(() => setAdding(false), 500);
  };

  const tags: string[] = Array.isArray(product.tags) ? product.tags : [];

  return (
    <>
      <main className="min-h-screen page-pt pb-16 sm:pb-20">
        <div className="site-container">

          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Products', href: '/products' },
              { label: product.category, href: `/products?category=${encodeURIComponent(product.category)}` },
              { label: product.name, href: `/products/${product.slug}` },
            ]}
          />

          <div className="mt-6 flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">

            {/* ── LEFT: Image ── */}
            <div className="w-full lg:w-[46%] flex-shrink-0 lg:sticky lg:top-28">
              <div className="rounded-3xl border border-line bg-white shadow-card p-4 sm:p-6">
                <ProductGallery images={images} name={product.name} />
              </div>
            </div>

            {/* ── RIGHT: Info ── */}
            <div className="flex-1 flex flex-col gap-5 min-w-0">

              <div className="flex items-center gap-2.5 flex-wrap">
                {product.category && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] sm:text-xs font-bold uppercase tracking-[0.18em] border border-primary/20">
                    {product.category}
                  </span>
                )}
                <BlogEducationBanner category={product.categorySlug || product.category} />
              </div>

              <h1 className="display-2 text-balance">{product.name}</h1>

              <div className="flex items-center gap-3 flex-wrap">
                <p className="text-sm text-muted font-medium">
                  SKU: <span className="text-dark/80">{product.SKU}</span>
                </p>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${stock.bg} ${stock.text} ${stock.border}`}>
                  <Icon icon={stock.icon} width={14} />
                  {stockLabel}
                </span>
              </div>

              <div className="flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-bold text-dark tracking-tight">{formattedPrice}</span>
                {price > 0 && <span className="text-xs text-muted">Inclusive of all taxes</span>}
              </div>

              {price > 0 && <EMICalculator price={price} />}

              {product.description && (
                <div className="border border-line rounded-2xl p-5 bg-surface">
                  <p className="text-xs font-bold text-muted uppercase tracking-widest mb-3">
                    About This Product
                  </p>
                  <p className="text-sm sm:text-base text-dark/85 leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                <button
                  onClick={handleAddToCart}
                  disabled={adding}
                  className="flex-1 btn btn-primary btn-lg disabled:opacity-60"
                >
                  {adding ? (
                    <><Icon icon="svg-spinners:3-dots-fade" width={20} /> Adding...</>
                  ) : (
                    <><Icon icon="solar:cart-large-4-bold" width={18} /> Add to Cart</>
                  )}
                </button>

                <Link
                  href="https://wa.me/918019179159"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 btn btn-outline-primary btn-lg"
                >
                  <Icon icon="ic:baseline-whatsapp" width={18} />
                  Inquire on WhatsApp
                </Link>
              </div>

              {/* Spec summary row */}
              {product.data &&
                Array.isArray(product.data) &&
                product.data.some((i: any) => i?.labal) && (
                  <div className="border border-line rounded-2xl overflow-hidden bg-white shadow-soft">
                    <div className="grid grid-cols-3 divide-x divide-line">
                      {product.data.slice(0, 3).map((item: any, i: number) => {
                        if (!item?.labal) return null;
                        return (
                          <div key={i} className="flex flex-col items-center justify-center py-4 px-3 text-center">
                            <p className="text-[10px] sm:text-xs text-muted font-medium uppercase tracking-wider mb-1">
                              {String(item.labal)}
                            </p>
                            <p className="text-xs sm:text-sm font-bold text-dark">
                              {String(item.value)}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

              {/* Key Highlights */}
              {Array.isArray(product.salient_features) &&
                product.salient_features.length > 0 && (
                  <div>
                    <h3 className="text-base font-bold text-dark mb-3">Key Highlights</h3>
                    <div className="flex flex-col gap-2">
                      {product.salient_features.map((f: string, i: number) => (
                        <div
                          key={i}
                          className="flex items-start gap-2 px-4 py-2.5 bg-primary/5 border border-primary/15 rounded-full"
                        >
                          <Icon icon="ph:seal-check-fill" className="text-primary mt-0.5 flex-shrink-0" width={16} />
                          <p className="text-xs sm:text-sm text-primary font-medium leading-snug">{f}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Product Features */}
              {Array.isArray(product.features) &&
                product.features.length > 0 && (
                  <div className="border border-line rounded-2xl p-5 bg-white shadow-soft">
                    <h3 className="text-base font-bold text-dark mb-4 flex items-center gap-2">
                      <Icon icon="ph:list-checks-fill" className="text-primary" width={18} />
                      Product Features
                      <span className="text-xs text-muted font-medium">({product.features.length})</span>
                    </h3>
                    <ul className="flex flex-col gap-2.5">
                      {product.features.map((f: string, i: number) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <Icon icon="ph:check-circle-fill" className="text-primary mt-0.5 flex-shrink-0" width={16} />
                          <p className="text-sm text-dark/85 leading-snug">{f}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              {/* Specifications */}
              {Array.isArray(product.specifications) &&
                product.specifications.length > 0 && (
                  <div>
                    <h3 className="text-base font-bold text-dark mb-3">Specifications</h3>
                    <div className="overflow-x-auto rounded-2xl border border-line bg-white shadow-soft">
                      <table className="w-full text-sm">
                        <tbody>
                          {product.specifications.map((spec: any, i: number) => (
                            <tr
                              key={i}
                              className={i % 2 === 0 ? 'bg-white' : 'bg-surface/60'}
                            >
                              <td className="px-4 py-3 font-medium text-dark/85 border-b border-line w-1/2 text-xs sm:text-sm">
                                {spec.labal}
                              </td>
                              <td className="px-4 py-3 text-dark border-b border-line text-xs sm:text-sm">
                                {spec.value}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

              {/* Tags */}
              {tags.length > 0 && (
                <div className="pt-2">
                  <p className="text-xs font-bold text-muted uppercase tracking-widest mb-3">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag: string, i: number) => (
                      <Link
                        key={i}
                        href={`/products?search=${encodeURIComponent(tag)}`}
                        className="inline-block px-3 py-1 rounded-full bg-surface text-dark/75 text-xs font-medium hover:bg-primary/10 hover:text-primary transition-colors border border-line"
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Category footer link */}
              {product.category && (
                <div className="pt-2 border-t border-line">
                  <p className="text-sm text-muted">
                    Category:{' '}
                    <Link
                      href={`/products?category=${encodeURIComponent(product.category)}`}
                      className="text-primary font-semibold hover:underline"
                    >
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
