'use client';

import React, { Suspense, useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import CallMeBackModal from '@/components/CallMeBackModal';
import { useScrollModal } from '@/hooks/useScrollModal';
import PropertyCard from '@/components/Home/Product/Card/Card';
import type { PropertyHomes } from '@/types/properyHomes';
import { Icon } from '@iconify/react';

interface ProductCacheEntry { products: PropertyHomes[]; ts: number; }
declare global { interface Window { __productCache?: ProductCacheEntry; } }
const CACHE_TTL = 5 * 60 * 1000;

// ── Sort options — Bestseller is default ──────────────────────────────────────
type SortOption = 'bestseller' | 'price-asc' | 'price-desc';

// ── Bestseller scoring — matches Amazon order data (same patterns as Card.tsx) ─
const BESTSELLER_PATTERNS: string[] = [
  'i lithium 1500',
  'heavy duty 1550 advanced',
  'super power ups 900',
  'super power ups 1100',
  'luxe wifi.*1400',
  'msmf 7.2',
  'super power 1100 advanced digital',
];

function getBestsellerScore(name: string): number {
  const lower = name.toLowerCase();
  for (let i = 0; i < BESTSELLER_PATTERNS.length; i++) {
    const p = BESTSELLER_PATTERNS[i];
    const matched = p.includes('.*')
      ? (() => { try { return new RegExp(p, 'i').test(lower); } catch { return false; } })()
      : lower.includes(p);
    if (matched) return BESTSELLER_PATTERNS.length - i; // higher score = better rank
  }
  return 0;
}

// ── UI helpers ────────────────────────────────────────────────────────────────
const GlassCard = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white/40 backdrop-blur-lg rounded-3xl shadow-xl border border-white/30 transition-all duration-300 hover:shadow-2xl ${className}`}>{children}</div>
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

// ── Image URL helper ──────────────────────────────────────────────────────────
function getDirectImageUrl(img: any): string {
  if (!img) return '';
  let src = typeof img === 'string' ? img : img.src ?? img.url ?? img.image ?? '';
  if (!src) return '';
  if (src.includes('/api/image-proxy?url=')) {
    try { src = decodeURIComponent(src.split('/api/image-proxy?url=')[1].split('&')[0]); } catch { return ''; }
  }
  if (src.includes('/_next/image')) {
    try {
      const u = new URL(src.startsWith('http') ? src : `https://x.com${src}`);
      const inner = u.searchParams.get('url');
      if (inner) src = decodeURIComponent(inner); else return '';
    } catch { return ''; }
  }
  if (src.startsWith('//'))    src = `https:${src}`;
  if (src.startsWith('/http')) src = src.replace(/^\//, '');
  if (!src.startsWith('http://') && !src.startsWith('https://')) return '';
  return src;
}

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
  solar:    ['Solar', 'Solar Inverter', 'Solar Battery'],
  inverter: ['Inverter', 'Solar Inverter'],
  battery:  ['Battery', 'New Lithium Battery', 'Solar Battery'],
  lithium:  ['New Lithium Battery'],
  ups:      ['ONLINE UPS', 'High Capacity UPS'],
  online:   ['ONLINE UPS'],
  jumbo:    ['High Capacity UPS'],
  combo:    ['Combos'], combos: ['Combos'],
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
    .filter(([k]) => k.includes(lower) || lower.includes(k))
    .flatMap(([, c]) => c);
}
function sortCategories(all: string[]): string[] {
  return [
    ...PREFERRED_ORDER.filter(c => all.includes(c)),
    ...all.filter(c => !PREFERRED_ORDER.includes(c)).sort(),
  ];
}

// ── Sort + Filter Controls ────────────────────────────────────────────────────
function SortFilterBar({
  sort, onSort,
  inStockOnly, onInStockToggle,
}: {
  sort: SortOption; onSort: (v: SortOption) => void;
  inStockOnly: boolean; onInStockToggle: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const sortLabel: Record<SortOption, string> = {
    bestseller: 'Best Sellers',
    'price-asc': 'Price: Low to High',
    'price-desc': 'Price: High to Low',
  };
  const sortIcon: Record<SortOption, string> = {
    bestseller: 'ph:trophy-fill',
    'price-asc': 'ph:sort-ascending-fill',
    'price-desc': 'ph:sort-descending-fill',
  };

  return (
    <div className="flex items-center gap-2 flex-shrink-0">

      {/* In Stock Only toggle */}
      <button
        onClick={onInStockToggle}
        className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-xl text-[10px] sm:text-xs font-bold border transition-all shadow-sm whitespace-nowrap ${
          inStockOnly
            ? 'bg-emerald-500 text-white border-emerald-500'
            : 'bg-white border-gray-200 text-gray-600 hover:border-emerald-400 hover:text-emerald-600'
        }`}
      >
        <span className={`w-1.5 h-1.5 rounded-full inline-block flex-shrink-0 ${inStockOnly ? 'bg-white' : 'bg-emerald-500'}`} />
        <span className="hidden sm:inline">In Stock</span>
        <span className="sm:hidden">Stock</span>
      </button>

      {/* Sort dropdown */}
      <div ref={ref} className="relative">
        <button
          onClick={() => setOpen(p => !p)}
          className="flex items-center gap-1.5 px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-[10px] sm:text-sm font-bold border bg-white border-gray-200 text-gray-700 hover:border-primary hover:text-primary transition-all shadow-sm whitespace-nowrap"
        >
          <Icon icon={sortIcon[sort]} width={14} className="text-primary" />
          <span className="hidden sm:inline">{sortLabel[sort]}</span>
          <span className="sm:hidden">Sort</span>
          <Icon icon={open ? 'ph:caret-up-bold' : 'ph:caret-down-bold'} width={10} className="text-gray-400" />
        </button>

        {open && (
          <>
            <div className="fixed inset-0 z-20" onClick={() => setOpen(false)} />
            <div className="absolute right-0 top-full mt-2 z-30 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden min-w-[200px]">

              {/* Bestseller */}
              <button
                onClick={() => { onSort('bestseller'); setOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm text-left transition-colors ${
                  sort === 'bestseller' ? 'bg-amber-50 text-amber-700 font-bold' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon icon="ph:trophy-fill" width={14} className={sort === 'bestseller' ? 'text-amber-500' : 'text-gray-400'} />
                Best Sellers
                {sort === 'bestseller' && <Icon icon="ph:check-bold" width={12} className="text-amber-500 ml-auto" />}
              </button>

              {/* Price asc */}
              <button
                onClick={() => { onSort('price-asc'); setOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm text-left transition-colors border-t border-gray-100 ${
                  sort === 'price-asc' ? 'bg-primary/5 text-primary font-semibold' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon icon="ph:sort-ascending-fill" width={14} className={sort === 'price-asc' ? 'text-primary' : 'text-gray-400'} />
                Price: Low to High
                {sort === 'price-asc' && <Icon icon="ph:check-bold" width={12} className="text-primary ml-auto" />}
              </button>

              {/* Price desc */}
              <button
                onClick={() => { onSort('price-desc'); setOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm text-left transition-colors border-t border-gray-100 ${
                  sort === 'price-desc' ? 'bg-primary/5 text-primary font-semibold' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon icon="ph:sort-descending-fill" width={14} className={sort === 'price-desc' ? 'text-primary' : 'text-gray-400'} />
                Price: High to Low
                {sort === 'price-desc' && <Icon icon="ph:check-bold" width={12} className="text-primary ml-auto" />}
              </button>

            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
const ProductsContent = () => {
  const searchParams = useSearchParams();
  const urlCategory  = searchParams.get('category') || '';
  const urlSearch    = searchParams.get('search')   || '';

  const [products,     setProducts]     = useState<PropertyHomes[]>([]);
  const [categories,   setCategories]   = useState<string[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [filter,       setFilter]       = useState<string>('all');
  const [sort,         setSort]         = useState<SortOption>('bestseller'); // ✅ default
  const [inStockOnly,  setInStockOnly]  = useState(false);

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
          setCategories(sortCategories([...new Set<string>(
            cached.map(p => p.category).filter((c): c is string => typeof c === 'string' && c.length > 0)
          )]));
          setLoading(false);
        }
        return;
      }
      try {
        const res  = await fetch('/api/products');
        const data = await res.json();
        const norm = (data.products || []).map(normalizeProduct);
        window.__productCache = { products: norm, ts: Date.now() };
        if (!cancelled) {
          setProducts(norm);
          setCategories(sortCategories([...new Set<string>(
            norm.map((p: any) => p.category).filter((c: any): c is string => typeof c === 'string' && c.length > 0)
          )]));
        }
      } catch (e) { console.error(e); }
      finally { if (!cancelled) setLoading(false); }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  const filtered = useMemo(() => {
    let list = filter === 'all' ? [...products] : products.filter(p => p.category === filter);

    // In Stock Only filter
    if (inStockOnly) {
      list = list.filter(p => (p as any).inStock !== false);
    }

    // Sort
    if (sort === 'bestseller') {
      list = list.sort((a, b) => {
        const sa = getBestsellerScore(a.name || '');
        const sb = getBestsellerScore(b.name || '');
        if (sb !== sa) return sb - sa;                          // bestsellers first
        return (Number(a.rate) || 0) - (Number(b.rate) || 0);  // then price asc
      });
    } else if (sort === 'price-asc') {
      list = list.sort((a, b) => (Number(a.rate) || 0) - (Number(b.rate) || 0));
    } else {
      list = list.sort((a, b) => (Number(b.rate) || 0) - (Number(a.rate) || 0));
    }

    return list;
  }, [products, filter, sort, inStockOnly]);

  return (
    <main className="min-h-screen">
      <section className="px-3 sm:px-4 max-w-7xl mx-auto pb-12">

        {/* Category chips + Sort/Filter controls */}
        <GlassCard className="p-3 sm:p-4 mb-6 sm:mb-8">
          <div className="flex items-center gap-2 sm:gap-3">

            <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-none snap-x flex-1 min-w-0">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-8 sm:h-9 w-20 sm:w-24 rounded-full bg-gray-100 animate-pulse flex-shrink-0" />
                ))
              ) : (
                [{ label: 'All', value: 'all' }, ...categories.map(cat => ({ label: cat, value: cat }))].map(f => (
                  <button key={f.value} onClick={() => setFilter(f.value)} type="button"
                    className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-sm font-semibold transition-all duration-200 whitespace-nowrap flex-shrink-0 snap-start ${
                      filter === f.value
                        ? 'bg-primary text-white shadow-md'
                        : 'bg-white/60 text-gray-700 hover:bg-primary/10 hover:text-primary border border-white/40'
                    }`}>
                    {f.label}
                  </button>
                ))
              )}
            </div>

            {!loading && (
              <SortFilterBar
                sort={sort} onSort={setSort}
                inStockOnly={inStockOnly} onInStockToggle={() => setInStockOnly(p => !p)}
              />
            )}
          </div>
        </GlassCard>

        {/* Results heading */}
        <div className="mb-5 sm:mb-6 flex items-center justify-between gap-4 flex-wrap">
          {loading ? (
            <div className="space-y-2">
              <div className="h-7 sm:h-8 bg-gray-100 rounded-full w-40 sm:w-48 animate-pulse" />
              <div className="h-4 bg-gray-100 rounded-full w-28 sm:w-32 animate-pulse" />
            </div>
          ) : (
            <div>
              <h2 className="text-lg sm:text-3xl font-extrabold text-gray-900 mb-1 tracking-tight">
                {filter === 'all' ? 'All Products' : filter}
              </h2>
              <p className="text-xs sm:text-base text-gray-500 font-medium flex items-center gap-2 flex-wrap">
                {filtered.length} product{filtered.length !== 1 ? 's' : ''} found
                {sort === 'bestseller' && (
                  <span className="inline-flex items-center gap-1 text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full text-[10px] font-bold">
                    <Icon icon="ph:trophy-fill" width={10} /> Sorted by Best Sellers
                  </span>
                )}
                {inStockOnly && (
                  <span className="inline-flex items-center gap-1 text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full text-[10px] font-bold">
                    ● In Stock Only
                  </span>
                )}
              </p>
            </div>
          )}

          {!loading && (filter !== 'all' || inStockOnly) && (
            <button onClick={() => { setFilter('all'); setInStockOnly(false); }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-500 bg-red-50 border border-red-200 rounded-full hover:bg-red-100 transition-colors flex-shrink-0">
              <Icon icon="ph:x-bold" width={11} /> Clear
            </button>
          )}
        </div>

        {/* Product Grid */}
        {loading ? (
          <SkeletonGrid />
        ) : filtered.length === 0 ? (
          <GlassCard className="p-10 sm:p-16 text-center">
            <div className="flex flex-col items-center gap-4">
              <Icon icon="ph:magnifying-glass" width={48} className="text-gray-300" />
              <p className="text-gray-500 text-base sm:text-lg font-semibold">No products found</p>
              <button onClick={() => { setFilter('all'); setInStockOnly(false); }}
                className="mt-2 px-5 py-2 bg-primary text-white rounded-full text-sm font-semibold hover:bg-dark transition-colors">
                Show all products
              </button>
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