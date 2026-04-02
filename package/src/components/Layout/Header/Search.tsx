'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Icon } from '@iconify/react';

type SearchProps = {
  sticky?: boolean;
  isHomepage?: boolean;
};

type Product = {
  name: string;
  slug: string;
  price: number;
  category: string;
  images: { src: string }[];
  features: string[];
  description?: string;
  salient_features?: string[];
};

// ── NOTE: window.__productCache is declared in ProductsClient.tsx ─────────────
// Search.tsx reuses it without re-declaring to avoid the TypeScript conflict.
// Both files share the same 5-minute cache via window.__productCache.
const CACHE_TTL = 5 * 60 * 1000;

// ── Category map ──────────────────────────────────────────────────────────────
const CATEGORY_MAP: Record<string, string[]> = {
  'solar':    ['Solar', 'Solar Inverter', 'Solar Battery'],
  'inverter': ['Inverter', 'Solar Inverter'],
  'battery':  ['Battery', 'New Lithium Battery', 'Solar Battery'],
  'lithium':  ['New Lithium Battery'],
  'ups':      ['ONLINE UPS', 'High Capacity UPS'],
  'online':   ['ONLINE UPS'],
  'jumbo':    ['High Capacity UPS'],
  'combo':    ['Combos'],
  'combos':   ['Combos'],
};

// ── Image URL fixer ───────────────────────────────────────────────────────────
function resolveImageUrl(src: string): string {
  if (!src) return '';
  try {
    if (src.includes('/_next/image')) {
      const parsed = new URL(src);
      const inner = parsed.searchParams.get('url');
      if (inner) return decodeURIComponent(inner);
    }
  } catch { /* fall through */ }
  return src;
}

// ── Resolve category for navigation ──────────────────────────────────────────
function resolveCategoryParam(q: string): string | null {
  const lower = q.toLowerCase().trim();
  if (CATEGORY_MAP[lower]) return CATEGORY_MAP[lower][0];
  const partial = Object.entries(CATEGORY_MAP).find(
    ([key]) => key.includes(lower) || lower.includes(key)
  );
  if (partial) return partial[1][0];
  return null;
}

// ── Normalize a raw product into the Search Product type ─────────────────────
function normalizeForSearch(p: any): Product | null {
  const slug = p.slug || p.id || '';
  const name = (p.name || '')
    .replace(/\s*wishlist\s*shareicon\s*/gi, '')
    .replace(/\s*shareicon\s*/gi, '')
    .replace(/\s*wishlist\s*/gi, '')
    .trim();
  if (!name || !slug) return null;

  const images: { src: string }[] = Array.isArray(p.images)
    ? p.images
        .map((img: any) => {
          let src = typeof img === 'string' ? img : img?.src || img?.url || '';
          src = resolveImageUrl(src);
          if (src && src.startsWith('http')) {
            src = `/api/image-proxy?url=${encodeURIComponent(src)}`;
          }
          return src && src.trim() ? { src: src.trim() } : null;
        })
        .filter(Boolean) as { src: string }[]
    : [];

  return {
    name,
    slug,
    price: Number(p.price || p.rate || 0),
    category: p.category || '',
    images,
    features: Array.isArray(p.features)
      ? p.features.map((f: any) => typeof f === 'string' ? f : f?.value || f?.label || '').filter(Boolean)
      : [],
    salient_features: Array.isArray(p.salient_features)
      ? p.salient_features.map((f: any) => typeof f === 'string' ? f : f?.value || f?.label || '').filter(Boolean)
      : [],
    description: p.description || '',
  };
}

const Search: React.FC<SearchProps> = ({ sticky, isHomepage }) => {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});
  const fetchedRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // ── Fetch products — reuses window cache if available ─────────────────────
  const fetchProducts = useCallback(async () => {
    if (fetchedRef.current) return;
    setLoading(true);
    try {
      const cache = (window as any).__productCache;
      const now = Date.now();

      // ✅ Reuse cache from ProductsClient if fresh — zero extra API call
      if (cache && now - cache.ts < CACHE_TTL && Array.isArray(cache.products)) {
        const mapped = cache.products
          .map(normalizeForSearch)
          .filter(Boolean) as Product[];
        setProducts(mapped);
        fetchedRef.current = true;
        return;
      }

      // Cache miss — fetch fresh
      const res = await fetch('/api/products');
      const data = await res.json();
      const productList = Array.isArray(data.products) ? data.products : [];

      // Populate cache for ProductsClient
      (window as any).__productCache = { products: productList, ts: now };

      const mapped = productList
        .map(normalizeForSearch)
        .filter(Boolean) as Product[];
      setProducts(mapped);
      fetchedRef.current = true;
    } catch (e) {
      console.error('Search fetch error:', e);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Close on outside click ────────────────────────────────────────────────
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ── Navigate to products page ─────────────────────────────────────────────
  const navigateToProducts = useCallback((q: string) => {
    const trimmed = q.trim();
    if (!trimmed) { router.push('/products'); return; }
    const category = resolveCategoryParam(trimmed);
    if (category) {
      router.push(`/products?category=${encodeURIComponent(category)}`);
    } else {
      router.push(`/products?search=${encodeURIComponent(trimmed)}`);
    }
  }, [router]);

  // ── Smart filtered results ────────────────────────────────────────────────
  const filtered = query.trim().length < 1 ? [] : (() => {
    const q = query.toLowerCase().trim();
    const matchedCategories = CATEGORY_MAP[q] ||
      Object.entries(CATEGORY_MAP)
        .filter(([key]) => key.includes(q) || q.includes(key))
        .flatMap(([, cats]) => cats);

    return products
      .map(item => {
        const nameLower = item.name.toLowerCase();
        const catLower = item.category.toLowerCase();
        let score = 0;
        if (matchedCategories.length > 0 && matchedCategories.some(c => c.toLowerCase() === catLower)) score += 100;
        if (nameLower.includes(q)) score += 50;
        if (catLower.includes(q)) score += 40;
        if ((item.description || '').toLowerCase().includes(q)) score += 5;
        if (score > 0 && item.features.some(f => f.toLowerCase().includes(q))) score += 2;
        return { item, score };
      })
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .map(({ item }) => item)
      .slice(0, 9);
  })();

  // ── "View all" href ───────────────────────────────────────────────────────
  const viewAllHref = (() => {
    const trimmed = query.trim();
    if (!trimmed) return '/products';
    const category = resolveCategoryParam(trimmed);
    if (category) return `/products?category=${encodeURIComponent(category)}`;
    return `/products?search=${encodeURIComponent(trimmed)}`;
  })();

  const isLight = !isHomepage || sticky;

  return (
    <div ref={containerRef} className="relative w-full max-w-xs">

      {/* ── Input ── */}
      <div className="relative">
        <Icon
          icon="ph:magnifying-glass-bold"
          className={`absolute left-3 top-1/2 -translate-y-1/2 ${isLight ? 'text-gray-400' : 'text-white/60'}`}
          width={16}
        />
        <input
          type="text"
          className={`w-full pl-9 pr-4 py-2 border focus:outline-none focus:ring-2 rounded-full transition-colors duration-200 text-sm ${
            isLight
              ? 'bg-white text-dark border-gray-200 placeholder:text-gray-400 focus:ring-primary/30'
              : 'bg-white/10 text-white border-white/30 placeholder:text-white/50 focus:ring-white/30'
          }`}
          placeholder="Search products..."
          value={query}
          autoComplete="off"
          onChange={(e) => { setQuery(e.target.value); setShowResults(true); }}
          onFocus={() => { setShowResults(true); fetchProducts(); }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && query.trim()) {
              setShowResults(false);
              navigateToProducts(query);
            }
          }}
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setShowResults(false); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <Icon icon="ph:x-bold" width={12} />
          </button>
        )}
      </div>

      {/* ── Dropdown results ── */}
      {showResults && query.trim().length > 0 && (
        <div className="absolute left-1/2 -translate-x-1/2 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 w-[92vw] sm:w-[580px] md:w-[660px] overflow-hidden">

          {/* Header */}
          <div className="px-4 py-2.5 border-b border-gray-100 flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500">
              {loading
                ? 'Searching…'
                : filtered.length > 0
                  ? `${filtered.length} result${filtered.length !== 1 ? 's' : ''} for "${query}"`
                  : `No results for "${query}"`
              }
            </span>
            {filtered.length > 0 && (
              <Link href={viewAllHref} className="text-xs text-primary font-semibold hover:underline" onClick={() => setShowResults(false)}>
                View all →
              </Link>
            )}
          </div>

          {/* Body */}
          <div className="max-h-[440px] overflow-y-auto">
            {loading ? (
              <div className="grid grid-cols-3 divide-x divide-y divide-gray-100">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="p-3 animate-pulse">
                    <div className="aspect-square rounded-xl bg-gray-100 mb-2" />
                    <div className="h-3 bg-gray-100 rounded-full w-2/3 mb-1" />
                    <div className="h-3 bg-gray-100 rounded-full w-full mb-1" />
                    <div className="h-3 bg-gray-100 rounded-full w-1/2" />
                  </div>
                ))}
              </div>
            ) : filtered.length > 0 ? (
              <div className="grid grid-cols-3 divide-x divide-y divide-gray-100">
                {filtered.map((item) => {
                  const imgSrc = item.images[0]?.src || '';
                  const showImg = imgSrc && !imgErrors[item.slug];
                  return (
                    <Link
                      key={item.slug}
                      href={`/products/${item.slug}`}
                      className="flex flex-col items-start p-3 hover:bg-emerald-50/60 transition-colors group"
                      onClick={() => { setShowResults(false); setQuery(''); }}
                    >
                      <div className="w-full aspect-square rounded-xl overflow-hidden bg-gray-50 mb-2 flex items-center justify-center border border-gray-100">
                        {showImg ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={imgSrc}
                            alt={item.name}
                            loading="lazy"
                            className="w-full h-full object-contain p-1.5"
                            onError={() => setImgErrors(prev => ({ ...prev, [item.slug]: true }))}
                          />
                        ) : (
                          <div className="flex items-center justify-center w-full h-full bg-primary/5">
                            <Icon icon="ph:lightning-fill" className="text-primary/30" width={28} />
                          </div>
                        )}
                      </div>
                      {item.category && (
                        <span className="text-[9px] font-bold text-white bg-primary px-1.5 py-0.5 rounded-full mb-1">
                          {item.category}
                        </span>
                      )}
                      <span className="text-[11px] font-bold text-gray-800 leading-snug line-clamp-2 w-full group-hover:text-primary transition-colors">
                        {item.name}
                      </span>
                      {item.price > 0 && (
                        <span className="text-[11px] font-extrabold text-primary mt-1">
                          ₹{item.price.toLocaleString('en-IN')}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 gap-3 text-gray-400">
                <Icon icon="ph:magnifying-glass" width={36} />
                <div className="text-center">
                  <p className="text-sm font-semibold text-gray-500">No products found</p>
                  <p className="text-xs text-gray-400 mt-1">Try: "Solar", "Battery", "Inverter", "UPS", "Combo"</p>
                </div>
                <Link href="/products" className="text-xs text-primary font-semibold hover:underline mt-1" onClick={() => setShowResults(false)}>
                  Browse all products →
                </Link>
              </div>
            )}
          </div>

          {/* Footer */}
          {filtered.length > 0 && (
            <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
              <span className="text-xs text-gray-400">
                Showing {filtered.length} of {products.length} products
              </span>
              <Link href={viewAllHref} className="text-xs text-primary hover:underline font-semibold" onClick={() => setShowResults(false)}>
                Browse all →
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;