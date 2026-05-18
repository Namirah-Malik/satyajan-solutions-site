'use client';

import React, { Suspense, useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import CallMeBackModal from '@/components/CallMeBackModal';
import { useScrollModal } from '@/hooks/useScrollModal';
import PropertyCard from '@/components/Home/Product/Card/Card';
import type { PropertyHomes } from '@/types/properyHomes';
import { Icon } from '@iconify/react';

interface ProductCacheEntry {
  products: PropertyHomes[];
  ts: number;
}

declare global {
  interface Window { __productCache?: ProductCacheEntry; }
}

const CACHE_TTL = 5 * 60 * 1000;

// ── Sort options ──────────────────────────────────────────────────────────────
type SortOption = 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc';

const SORT_OPTIONS: { value: SortOption; label: string; icon: string }[] = [
  { value: 'price-asc',  label: 'Price: Low to High', icon: 'ph:sort-ascending-fill'  },
  { value: 'price-desc', label: 'Price: High to Low', icon: 'ph:sort-descending-fill' },
  { value: 'name-asc',   label: 'Name: A to Z',       icon: 'ph:text-aa-fill'         },
  { value: 'name-desc',  label: 'Name: Z to A',        icon: 'ph:text-aa-fill'         },
];

const GlassCard = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white/40 backdrop-blur-lg rounded-3xl shadow-xl border border-white/30 transition-all duration-300 hover:shadow-2xl ${className}`}>
    {children}
  </div>
);

const SkeletonCard = () => (
  <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden animate-pulse">
    <div className="aspect-square bg-gray-100" />
    <div className="p-3 sm:p-5 space-y-3">
      <div className="h-4 bg-gray-100 rounded-full w-3/4" />
      <div className="h-3 bg-gray-100 rounded-full w-full" />
      <div className="h-3 bg-gray-100 rounded-full w-5/6" />
      <div className="h-8 bg-gray-100 rounded-full w-full mt-4" />
    </div>
  </div>
);

const SkeletonGrid = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
    {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
  </div>
);

// ── Get a clean direct image URL ──────────────────────────────────────────────
function getDirectImageUrl(img: any): string {
  if (!img) return '';
  let src =
    typeof img === 'string' ? img :
    img.src   ? img.src   :
    img.url   ? img.url   :
    img.image ? img.image : '';
  if (!src) return '';
  if (src.includes('/api/image-proxy?url=')) {
    try { src = decodeURIComponent(src.split('/api/image-proxy?url=')[1].split('&')[0]); }
    catch { return ''; }
  }
  if (src.includes('/_next/image')) {
    try {
      const u = new URL(src.startsWith('http') ? src : `https://x.com${src}`);
      const inner = u.searchParams.get('url');
      if (inner) src = decodeURIComponent(inner);
      else return '';
    } catch { return ''; }
  }
  if (src.startsWith('//'))    src = `https:${src}`;
  if (src.startsWith('/http')) src = src.replace(/^\//, '');
  if (!src.startsWith('http://') && !src.startsWith('https://')) return '';
  return src;
}

// ── Normalize product from API ────────────────────────────────────────────────
function normalizeProduct(raw: any): PropertyHomes {
  const rawImages: any[] = Array.isArray(raw.images) ? raw.images : [];
  const images = rawImages
    .map((img: any) => { const src = getDirectImageUrl(img); return src ? { src } : null; })
    .filter(Boolean) as { src: string }[];
  const slug = raw.slug || raw.id || '';
  const rate = raw.rate ?? raw.price ?? 0;
  const name = (raw.name || '')
    .replace(/\s*wishlist\s*shareicon\s*/gi, '')
    .replace(/\s*shareicon\s*/gi, '')
    .replace(/\s*wishlist\s*/gi, '')
    .trim();
  return { ...raw, slug, rate, images, name, category: raw.category || '', description: raw.description || '' };
}

// ── Category helpers ──────────────────────────────────────────────────────────
const CATEGORY_MAP: Record<string, string[]> = {
  solar:   ['Solar', 'Solar Inverter', 'Solar Battery'],
  inverter:['Inverter', 'Solar Inverter'],
  battery: ['Battery', 'New Lithium Battery', 'Solar Battery'],
  lithium: ['New Lithium Battery'],
  ups:     ['ONLINE UPS', 'High Capacity UPS'],
  online:  ['ONLINE UPS'],
  jumbo:   ['High Capacity UPS'],
  combo:   ['Combos'], combos: ['Combos'],
};

const PREFERRED_ORDER = [
  'Combo','Inverter','Battery','ONLINE UPS','Solar',
  'New Lithium Battery','High Capacity UPS','Solar Inverter','Solar Battery',
];

function resolveCategories(q: string): string[] {
  const lower = q.toLowerCase().trim();
  if (!lower) return [];
  if (CATEGORY_MAP[lower]) return CATEGORY_MAP[lower];
  return Object.entries(CATEGORY_MAP)
    .filter(([key]) => key.includes(lower) || lower.includes(key))
    .flatMap(([, cats]) => cats);
}

function sortCategories(allCats: string[]): string[] {
  return [
    ...PREFERRED_ORDER.filter(c => allCats.includes(c)),
    ...allCats.filter(c => !PREFERRED_ORDER.includes(c)).sort(),
  ];
}

// ── Sort Dropdown Component ───────────────────────────────────────────────────
function SortDropdown({
  value,
  onChange,
  count,
}: {
  value: SortOption;
  onChange: (v: SortOption) => void;
  count: number;
}) {
  const [open, setOpen] = useState(false);
  const current = SORT_OPTIONS.find(o => o.value === value)!;

  return (
    <div className="relative flex-shrink-0">
      <button
        onClick={() => setOpen(p => !p)}
        className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:border-primary hover:text-primary transition-all shadow-sm whitespace-nowrap"
      >
        <Icon icon={current.icon} width={16} className="text-primary" />
        <span className="hidden sm:inline">{current.label}</span>
        <span className="sm:hidden">Sort</span>
        <Icon icon={open ? 'ph:caret-up-bold' : 'ph:caret-down-bold'} width={12} className="text-gray-400" />
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          {/* Dropdown */}
          <div className="absolute right-0 top-full mt-2 z-20 bg-white border border-gray-200 rounded-2xl shadow-xl py-1.5 min-w-[200px]">
            {SORT_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => { onChange(opt.value); setOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors ${
                  value === opt.value
                    ? 'bg-primary/5 text-primary font-semibold'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon icon={opt.icon} width={15} className={value === opt.value ? 'text-primary' : 'text-gray-400'} />
                {opt.label}
                {value === opt.value && <Icon icon="ph:check-bold" width={12} className="text-primary ml-auto" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
const ProductsContent = () => {
  const searchParams = useSearchParams();
  const urlCategory  = searchParams.get('category') || '';
  const urlSearch    = searchParams.get('search')   || '';

  const [products,   setProducts]   = useState<PropertyHomes[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [filter,     setFilter]     = useState<string>('all');
  // ✅ Default sort: Price Low to High
  const [sort, setSort] = useState<SortOption>('price-asc');

  useEffect(() => {
    if (urlCategory) setFilter(urlCategory);
    else if (urlSearch) {
      const cats = resolveCategories(urlSearch);
      setFilter(cats.length === 1 ? cats[0] : 'all');
    } else setFilter('all');
  }, [urlCategory, urlSearch]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      if (window.__productCache && Date.now() - window.__productCache.ts < CACHE_TTL) {
        const cached = window.__productCache.products;
        if (!cancelled) {
          setProducts(cached);
          setCategories(sortCategories(Array.from(new Set(
            cached.map(p => p.category).filter((c): c is string => typeof c === 'string' && c.length > 0)
          ))));
          setLoading(false);
        }
        return;
      }
      try {
        const res        = await fetch('/api/products');
        const data       = await res.json();
        const normalized = (data.products || []).map(normalizeProduct);
        window.__productCache = { products: normalized, ts: Date.now() };
        if (!cancelled) {
          setProducts(normalized);
          setCategories(sortCategories(Array.from(new Set(
            normalized.map((p: any) => p.category).filter((c: any): c is string => typeof c === 'string' && c.length > 0)
          ))));
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  // ✅ Filter + Sort combined
  const filtered = useMemo(() => {
    let list = filter === 'all' ? products : products.filter(p => p.category === filter);

    switch (sort) {
      case 'price-asc':
        list = [...list].sort((a, b) => (Number(a.rate) || 0) - (Number(b.rate) || 0));
        break;
      case 'price-desc':
        list = [...list].sort((a, b) => (Number(b.rate) || 0) - (Number(a.rate) || 0));
        break;
      case 'name-asc':
        list = [...list].sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        break;
      case 'name-desc':
        list = [...list].sort((a, b) => (b.name || '').localeCompare(a.name || ''));
        break;
    }
    return list;
  }, [products, filter, sort]);

  return (
    <main className="min-h-screen">
      <section className="px-3 sm:px-4 max-w-7xl mx-auto pb-12">

        {/* ── Filter tabs + Sort dropdown ── */}
        <GlassCard className="p-3 sm:p-4 mb-6 sm:mb-8">
          <div className="flex items-center gap-3">

            {/* Category filter chips — scrollable */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none snap-x flex-1 min-w-0">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-9 w-24 rounded-full bg-gray-100 animate-pulse flex-shrink-0" />
                ))
              ) : (
                [{ label: 'All Products', value: 'all' }, ...categories.map(cat => ({ label: cat, value: cat }))].map((f) => (
                  <button
                    key={f.value}
                    onClick={() => setFilter(f.value)}
                    type="button"
                    className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 whitespace-nowrap flex-shrink-0 snap-start ${
                      filter === f.value
                        ? 'bg-primary text-white shadow-md'
                        : 'bg-white/60 text-gray-700 hover:bg-primary/10 hover:text-primary border border-white/40'
                    }`}
                  >
                    {f.label}
                  </button>
                ))
              )}
            </div>

            {/* ✅ Sort dropdown — right side */}
            {!loading && (
              <SortDropdown value={sort} onChange={setSort} count={filtered.length} />
            )}
          </div>
        </GlassCard>

        {/* Heading */}
        <div className="mb-5 sm:mb-8 flex items-center justify-between gap-4">
          {loading ? (
            <div className="space-y-2">
              <div className="h-8 bg-gray-100 rounded-full w-48 animate-pulse" />
              <div className="h-4 bg-gray-100 rounded-full w-32 animate-pulse" />
            </div>
          ) : (
            <div>
              <h2 className="text-xl sm:text-4xl font-extrabold text-gray-900 mb-1 sm:mb-2 tracking-tight">
                {filter === 'all' ? 'All Products' : filter}
              </h2>
              <p className="text-xs sm:text-lg text-gray-600 font-medium">
                {filtered.length} product{filtered.length !== 1 ? 's' : ''} available
                {sort === 'price-asc' && (
                  <span className="ml-2 text-xs text-primary font-semibold bg-primary/10 px-2 py-0.5 rounded-full">
                    Price: Low to High
                  </span>
                )}
              </p>
            </div>
          )}
        </div>

        {/* Grid */}
        {loading ? (
          <SkeletonGrid />
        ) : filtered.length === 0 ? (
          <GlassCard className="p-10 sm:p-16 text-center">
            <div className="flex flex-col items-center gap-3 text-gray-400">
              <Icon icon="ph:magnifying-glass" width={40} />
              <p className="text-gray-500 text-base sm:text-lg font-medium">No products found.</p>
            </div>
          </GlassCard>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
            {filtered.map((item, idx) => (
              <PropertyCard key={item.slug || idx} item={item} />
            ))}
          </div>
        )}

      </section>
    </main>
  );
};

const ProductsClient = () => {
  const { showModal, closeModal } = useScrollModal({ triggerTimeMs: 60000, showOnFooterReach: true });
  return (
    <>
      <Suspense fallback={<SkeletonGrid />}>
        <ProductsContent />
      </Suspense>
      <CallMeBackModal isOpen={showModal} onClose={closeModal} />
    </>
  );
};

export default ProductsClient;