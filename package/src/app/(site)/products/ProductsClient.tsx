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

// ── Sort — only 2 options ─────────────────────────────────────────────────────
type SortOption = 'price-asc' | 'price-desc';

// ── UI helpers ────────────────────────────────────────────────────────────────
const FilterBar = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white/95 backdrop-blur-md rounded-2xl shadow-soft border border-line ${className}`}>{children}</div>
);

const SkeletonCard = () => (
  <div className="rounded-2xl border border-line bg-white overflow-hidden animate-pulse">
    <div className="aspect-square bg-surface" />
    <div className="p-5 space-y-3">
      <div className="h-4 bg-surface rounded-full w-3/4" />
      <div className="h-3 bg-surface rounded-full w-full" />
      <div className="h-3 bg-surface rounded-full w-5/6" />
      <div className="h-8 bg-surface rounded-full w-full mt-4" />
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

// ── Simple Sort Button ────────────────────────────────────────────────────────
function SortButton({ sort, onChange }: { sort: SortOption; onChange: (v: SortOption) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const isLowHigh = sort === 'price-asc';

  return (
    <div ref={ref} className="relative flex-shrink-0">
      <button
        onClick={() => setOpen(p => !p)}
        className="flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold border bg-white border-line text-dark/80 hover:border-primary hover:text-primary transition-all shadow-soft whitespace-nowrap"
      >
        <Icon icon={isLowHigh ? 'ph:sort-ascending-fill' : 'ph:sort-descending-fill'} width={15} className="text-primary" />
        <span className="hidden sm:inline">{isLowHigh ? 'Price: Low to High' : 'Price: High to Low'}</span>
        <span className="sm:hidden">Sort</span>
        <Icon icon={open ? 'ph:caret-up-bold' : 'ph:caret-down-bold'} width={11} className="text-muted" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-20" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 z-30 bg-white border border-line rounded-2xl shadow-card overflow-hidden min-w-[200px]">
            <button
              onClick={() => { onChange('price-asc'); setOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm text-left transition-colors ${
                sort === 'price-asc' ? 'bg-primary/5 text-primary font-semibold' : 'text-dark/80 hover:bg-surface'
              }`}
            >
              <Icon icon="ph:sort-ascending-fill" width={15} className={sort === 'price-asc' ? 'text-primary' : 'text-muted'} />
              Price: Low to High
              {sort === 'price-asc' && <Icon icon="ph:check-bold" width={12} className="text-primary ml-auto" />}
            </button>
            <button
              onClick={() => { onChange('price-desc'); setOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm text-left transition-colors border-t border-line ${
                sort === 'price-desc' ? 'bg-primary/5 text-primary font-semibold' : 'text-dark/80 hover:bg-surface'
              }`}
            >
              <Icon icon="ph:sort-descending-fill" width={15} className={sort === 'price-desc' ? 'text-primary' : 'text-muted'} />
              Price: High to Low
              {sort === 'price-desc' && <Icon icon="ph:check-bold" width={12} className="text-primary ml-auto" />}
            </button>
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
  const [sort,       setSort]       = useState<SortOption>('price-asc');

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
    if (sort === 'price-asc')  list = list.sort((a, b) => (Number(a.rate) || 0) - (Number(b.rate) || 0));
    if (sort === 'price-desc') list = list.sort((a, b) => (Number(b.rate) || 0) - (Number(a.rate) || 0));
    return list;
  }, [products, filter, sort]);

  return (
    <main className="min-h-screen">
      <section className="site-container pb-16">

        {/* Category chips + Sort button */}
        <FilterBar className="p-3 sm:p-4 mb-6 sm:mb-8">
          <div className="flex items-center gap-2 sm:gap-3">

            <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-none snap-x flex-1 min-w-0">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-8 sm:h-9 w-20 sm:w-24 rounded-full bg-surface animate-pulse flex-shrink-0" />
                ))
              ) : (
                [{ label: 'All', value: 'all' }, ...categories.map(cat => ({ label: cat, value: cat }))].map(f => (
                  <button key={f.value} onClick={() => setFilter(f.value)} type="button"
                    className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-sm font-semibold transition-all duration-200 whitespace-nowrap flex-shrink-0 snap-start ${
                      filter === f.value
                        ? 'bg-primary text-white shadow-soft'
                        : 'bg-surface text-dark/80 hover:bg-primary/10 hover:text-primary border border-line'
                    }`}>
                    {f.label}
                  </button>
                ))
              )}
            </div>

            {!loading && <SortButton sort={sort} onChange={setSort} />}
          </div>
        </FilterBar>

        {/* Results heading */}
        <div className="mb-6 flex items-center justify-between gap-4">
          {loading ? (
            <div className="space-y-2">
              <div className="h-7 sm:h-8 bg-surface rounded-full w-40 sm:w-48 animate-pulse" />
              <div className="h-4 bg-surface rounded-full w-28 sm:w-32 animate-pulse" />
            </div>
          ) : (
            <div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-dark mb-1 tracking-tight">
                {filter === 'all' ? 'All Products' : filter}
              </h2>
              <p className="text-xs sm:text-sm text-muted font-medium">
                {filtered.length} product{filtered.length !== 1 ? 's' : ''} found
              </p>
            </div>
          )}

          {!loading && filter !== 'all' && (
            <button onClick={() => setFilter('all')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-dark/75 bg-surface border border-line rounded-full hover:bg-dark hover:text-white hover:border-dark transition-colors flex-shrink-0">
              <Icon icon="ph:x-bold" width={11} /> Clear
            </button>
          )}
        </div>

        {/* Product Grid */}
        {loading ? (
          <SkeletonGrid />
        ) : filtered.length === 0 ? (
          <div className="card-surface p-10 sm:p-16 text-center">
            <div className="flex flex-col items-center gap-4">
              <Icon icon="ph:magnifying-glass" width={48} className="text-line" />
              <p className="text-dark/75 text-base sm:text-lg font-semibold">No products found</p>
              <button onClick={() => setFilter('all')} className="btn btn-primary mt-2">
                Show all products
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-7">
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