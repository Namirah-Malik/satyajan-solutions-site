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

// ── Sort ──────────────────────────────────────────────────────────────────────
type SortOption = 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc';
const SORT_OPTIONS: { value: SortOption; label: string; icon: string }[] = [
  { value: 'price-asc',  label: 'Price: Low to High', icon: 'ph:sort-ascending-fill'  },
  { value: 'price-desc', label: 'Price: High to Low', icon: 'ph:sort-descending-fill' },
  { value: 'name-asc',   label: 'Name: A to Z',       icon: 'ph:text-aa-fill'         },
  { value: 'name-desc',  label: 'Name: Z to A',       icon: 'ph:text-aa-fill'         },
];

// ── Price presets ─────────────────────────────────────────────────────────────
const PRICE_PRESETS = [
  { label: 'Under ₹10K',   min: 0,     max: 10000  },
  { label: '₹10K – ₹25K',  min: 10000, max: 25000  },
  { label: '₹25K – ₹50K',  min: 25000, max: 50000  },
  { label: '₹50K+',        min: 50000, max: 999999 },
];

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

// ── Combined Filters & Sort Dropdown ─────────────────────────────────────────
function FiltersDropdown({
  sort, onSortChange,
  minPrice, maxPrice, onMinChange, onMaxChange,
  activePreset, onPreset, onClearPrice,
  productMin, productMax,
  activeCount,
}: {
  sort: SortOption; onSortChange: (v: SortOption) => void;
  minPrice: string; maxPrice: string;
  onMinChange: (v: string) => void; onMaxChange: (v: string) => void;
  activePreset: string | null;
  onPreset: (min: number, max: number, label: string) => void;
  onClearPrice: () => void;
  productMin: number; productMax: number;
  activeCount: number;
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

  return (
    <div ref={ref} className="relative flex-shrink-0">
      <button
        onClick={() => setOpen(p => !p)}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm whitespace-nowrap border ${
          activeCount > 0
            ? 'bg-primary text-white border-primary'
            : 'bg-white border-gray-200 text-gray-700 hover:border-primary hover:text-primary'
        }`}
      >
        <Icon icon="ph:sliders-horizontal-bold" width={16} />
        <span className="hidden sm:inline">Filters & Sort</span>
        <span className="sm:hidden">Filter</span>
        {activeCount > 0 && (
          <span className="bg-white text-primary text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">
            {activeCount}
          </span>
        )}
        <Icon icon={open ? 'ph:caret-up-bold' : 'ph:caret-down-bold'} width={11}
          className={activeCount > 0 ? 'text-white/70' : 'text-gray-400'} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 z-30 bg-white border border-gray-200 rounded-2xl shadow-2xl w-72 sm:w-80 overflow-hidden">

          {/* Sort */}
          <div className="px-4 pt-4 pb-3 border-b border-gray-100">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2.5">Sort By</p>
            <div className="flex flex-col gap-1">
              {SORT_OPTIONS.map(opt => (
                <button key={opt.value} onClick={() => onSortChange(opt.value)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-left transition-colors ${
                    sort === opt.value ? 'bg-primary/5 text-primary font-semibold' : 'text-gray-700 hover:bg-gray-50'
                  }`}>
                  <Icon icon={opt.icon} width={15} className={sort === opt.value ? 'text-primary' : 'text-gray-400'} />
                  {opt.label}
                  {sort === opt.value && <Icon icon="ph:check-bold" width={12} className="text-primary ml-auto" />}
                </button>
              ))}
            </div>
          </div>

          {/* Price */}
          <div className="px-4 py-4">
            <div className="flex items-center justify-between mb-2.5">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Price Range</p>
              {(minPrice || maxPrice) && (
                <button onClick={onClearPrice}
                  className="text-[11px] text-red-500 font-semibold hover:text-red-600 flex items-center gap-1">
                  <Icon icon="ph:x-bold" width={10} /> Clear
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-1.5 mb-3">
              {PRICE_PRESETS.map(p => (
                <button key={p.label} onClick={() => onPreset(p.min, p.max, p.label)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all border text-left ${
                    activePreset === p.label
                      ? 'bg-primary text-white border-primary shadow-sm'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-primary hover:text-primary'
                  }`}>
                  {p.label}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-gray-400 font-medium mb-2">Custom range:</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">₹</span>
                <input type="number" placeholder={productMin.toLocaleString('en-IN')}
                  value={minPrice} onChange={e => onMinChange(e.target.value)}
                  className="w-full pl-6 pr-2 py-2 border border-gray-200 rounded-xl text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
              </div>
              <span className="text-gray-400 text-sm flex-shrink-0">—</span>
              <div className="flex-1 relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">₹</span>
                <input type="number" placeholder={productMax.toLocaleString('en-IN')}
                  value={maxPrice} onChange={e => onMaxChange(e.target.value)}
                  className="w-full pl-6 pr-2 py-2 border border-gray-200 rounded-xl text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
              </div>
            </div>
          </div>

          <div className="px-4 pb-4">
            <button onClick={() => setOpen(false)}
              className="w-full py-2.5 bg-primary text-white rounded-xl font-bold text-sm hover:bg-dark transition-colors">
              Apply Filters
            </button>
          </div>
        </div>
      )}
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
  const [sort,         setSort]         = useState<SortOption>('price-asc');
  // ✅ NO search state — search is in the navbar only
  const [minPrice,     setMinPrice]     = useState('');
  const [maxPrice,     setMaxPrice]     = useState('');
  const [activePreset, setActivePreset] = useState<string | null>(null);

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
          setCategories(sortCategories([...new Set(
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
          setCategories(sortCategories([...new Set(
            norm.map((p: any) => p.category).filter((c: any): c is string => typeof c === 'string' && c.length > 0)
          )]));
        }
      } catch (e) { console.error(e); }
      finally { if (!cancelled) setLoading(false); }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  const productMin = useMemo(() =>
    products.length ? Math.min(...products.map(p => Number(p.rate) || 0)) : 0, [products]);
  const productMax = useMemo(() =>
    products.length ? Math.max(...products.map(p => Number(p.rate) || 0)) : 999999, [products]);

  const handlePreset = (min: number, max: number, label: string) => {
    setMinPrice(String(min)); setMaxPrice(String(max)); setActivePreset(label);
  };
  const clearPrice = () => { setMinPrice(''); setMaxPrice(''); setActivePreset(null); };

  const filterCount = useMemo(() => {
    let n = 0;
    if (sort !== 'price-asc') n++;
    if (minPrice || maxPrice) n++;
    return n;
  }, [sort, minPrice, maxPrice]);

  // ✅ Filter + Price + Sort only (no search state — navbar handles search)
  const filtered = useMemo(() => {
    let list = filter === 'all' ? [...products] : products.filter(p => p.category === filter);

    const min = minPrice !== '' ? Number(minPrice) : null;
    const max = maxPrice !== '' ? Number(maxPrice) : null;
    if (min !== null || max !== null) {
      list = list.filter(p => {
        const price = Number(p.rate) || 0;
        if (min !== null && price < min) return false;
        if (max !== null && price > max) return false;
        return true;
      });
    }

    switch (sort) {
      case 'price-asc':  list = list.sort((a, b) => (Number(a.rate)||0) - (Number(b.rate)||0)); break;
      case 'price-desc': list = list.sort((a, b) => (Number(b.rate)||0) - (Number(a.rate)||0)); break;
      case 'name-asc':   list = list.sort((a, b) => (a.name||'').localeCompare(b.name||''));    break;
      case 'name-desc':  list = list.sort((a, b) => (b.name||'').localeCompare(a.name||''));    break;
    }
    return list;
  }, [products, filter, sort, minPrice, maxPrice]);

  const hasActiveFilters = filter !== 'all' || minPrice || maxPrice;
  const clearAll = () => { setFilter('all'); setMinPrice(''); setMaxPrice(''); setActivePreset(null); };

  return (
    <main className="min-h-screen">
      <section className="px-3 sm:px-4 max-w-7xl mx-auto pb-12">

        {/* ── Category chips + Filters & Sort — NO search bar ── */}
        <GlassCard className="p-3 sm:p-4 mb-6 sm:mb-8">
          <div className="flex items-center gap-3">

            {/* Category filter chips */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none snap-x flex-1 min-w-0">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-9 w-24 rounded-full bg-gray-100 animate-pulse flex-shrink-0" />
                ))
              ) : (
                [{ label: 'All Products', value: 'all' }, ...categories.map(cat => ({ label: cat, value: cat }))].map(f => (
                  <button key={f.value} onClick={() => setFilter(f.value)} type="button"
                    className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 whitespace-nowrap flex-shrink-0 snap-start ${
                      filter === f.value
                        ? 'bg-primary text-white shadow-md'
                        : 'bg-white/60 text-gray-700 hover:bg-primary/10 hover:text-primary border border-white/40'
                    }`}>
                    {f.label}
                  </button>
                ))
              )}
            </div>

            {/* Filters & Sort dropdown */}
            {!loading && (
              <FiltersDropdown
                sort={sort} onSortChange={setSort}
                minPrice={minPrice} maxPrice={maxPrice}
                onMinChange={v => { setMinPrice(v); setActivePreset(null); }}
                onMaxChange={v => { setMaxPrice(v); setActivePreset(null); }}
                activePreset={activePreset} onPreset={handlePreset} onClearPrice={clearPrice}
                productMin={productMin} productMax={productMax}
                activeCount={filterCount}
              />
            )}
          </div>
        </GlassCard>

        {/* Results heading */}
        <div className="mb-5 sm:mb-6 flex items-center justify-between gap-4 flex-wrap">
          {loading ? (
            <div className="space-y-2">
              <div className="h-8 bg-gray-100 rounded-full w-48 animate-pulse" />
              <div className="h-4 bg-gray-100 rounded-full w-32 animate-pulse" />
            </div>
          ) : (
            <div>
              <h2 className="text-xl sm:text-3xl font-extrabold text-gray-900 mb-1 tracking-tight">
                {filter === 'all' ? 'All Products' : filter}
              </h2>
              <p className="text-xs sm:text-base text-gray-500 font-medium flex items-center gap-2 flex-wrap">
                {filtered.length} product{filtered.length !== 1 ? 's' : ''} found
                {activePreset && (
                  <span className="text-primary font-semibold bg-primary/10 px-2 py-0.5 rounded-full text-xs">
                    {activePreset}
                  </span>
                )}
              </p>
            </div>
          )}

          {!loading && hasActiveFilters && (
            <button onClick={clearAll}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-500 bg-red-50 border border-red-200 rounded-full hover:bg-red-100 transition-colors">
              <Icon icon="ph:x-bold" width={11} /> Clear all
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
              <p className="text-gray-400 text-sm">Try changing your filters</p>
              <button onClick={clearAll}
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