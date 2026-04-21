'use client';
// src/components/BlogEducationBanner.tsx

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { Icon } from '@iconify/react';

/* ─── Category map ─────────────────────────────────────── */
const CATEGORY_MAP: Record<string, {
  categorySlug: string;
  label: string;
  teaser: string;
  blogCount: string;
  icon: string;
  gradient: string;
  pulse: string;
}> = {
  'Inverter': {
    categorySlug: 'inverters',
    label: 'Inverter Guides',
    teaser: 'Most people buy the wrong VA rating — are you?',
    blogCount: '4 articles',
    icon: 'ph:lightning-fill',
    gradient: 'from-blue-500 to-indigo-500',
    pulse: 'bg-blue-400',
  },
  'Battery': {
    categorySlug: 'batteries',
    label: 'Battery Guides',
    teaser: 'Ignoring early warning signs costs ₹12,000+ in emergency replacements.',
    blogCount: '4 articles',
    icon: 'ph:battery-warning-fill',
    gradient: 'from-orange-500 to-red-500',
    pulse: 'bg-orange-400',
  },
  'New Lithium Battery': {
    categorySlug: 'batteries',
    label: 'Lithium Battery Guides',
    teaser: '10-year cost analysis — which battery actually saves more money?',
    blogCount: '4 articles',
    icon: 'ph:atom-fill',
    gradient: 'from-purple-500 to-violet-500',
    pulse: 'bg-purple-400',
  },
  'Solar': {
    categorySlug: 'solar',
    label: 'Solar Guides',
    teaser: 'Can solar actually pay for itself in 4 years? Find out.',
    blogCount: '8 articles',
    icon: 'ph:sun-fill',
    gradient: 'from-yellow-500 to-orange-500',
    pulse: 'bg-yellow-400',
  },
  'Solar Inverter': {
    categorySlug: 'solar',
    label: 'Solar Inverter Guides',
    teaser: 'How a hybrid inverter can cut your electricity bill by 90%.',
    blogCount: '8 articles',
    icon: 'ph:solar-panel-fill',
    gradient: 'from-green-500 to-emerald-500',
    pulse: 'bg-green-400',
  },
  'Solar Battery': {
    categorySlug: 'solar',
    label: 'Solar Battery Guides',
    teaser: 'Wrong battery choice kills your solar system — avoid this.',
    blogCount: '8 articles',
    icon: 'ph:battery-plus-fill',
    gradient: 'from-emerald-500 to-teal-500',
    pulse: 'bg-emerald-400',
  },
  'ONLINE UPS': {
    categorySlug: 'tips',
    label: 'UPS & Maintenance Guides',
    teaser: 'Simple monthly checks that double your UPS lifespan.',
    blogCount: '3 articles',
    icon: 'ph:shield-check-fill',
    gradient: 'from-indigo-500 to-blue-500',
    pulse: 'bg-indigo-400',
  },
  'High Capacity UPS': {
    categorySlug: 'tips',
    label: 'Heavy Load Guides',
    teaser: 'Pro tips that save ₹20,000+ in repair and replacement costs.',
    blogCount: '3 articles',
    icon: 'ph:plug-fill',
    gradient: 'from-slate-600 to-gray-700',
    pulse: 'bg-slate-400',
  },
  'Combo': {
    categorySlug: 'inverters',
    label: 'Inverter + Battery Guides',
    teaser: 'Mismatched combos drain 40% faster — avoid this mistake.',
    blogCount: '4 articles',
    icon: 'ph:package-fill',
    gradient: 'from-teal-500 to-cyan-500',
    pulse: 'bg-teal-400',
  },
  'HOME UPS': {
    categorySlug: 'inverters',
    label: 'Inverter Guides',
    teaser: 'Most people buy the wrong VA rating — are you?',
    blogCount: '4 articles',
    icon: 'ph:lightning-fill',
    gradient: 'from-blue-500 to-indigo-500',
    pulse: 'bg-blue-400',
  },
};

const DEFAULT = {
  categorySlug: 'all',
  label: 'Buying Guides',
  teaser: 'Read expert tips before making your purchase decision.',
  blogCount: 'All articles',
  icon: 'ph:book-open-fill',
  gradient: 'from-gray-500 to-gray-600',
  pulse: 'bg-gray-400',
};

interface Props { category: string }

const TW  = 288;  // tooltip width  (18rem)
const TH  = 190;  // tooltip height (approx)
const GAP = 10;   // gap between pill bottom and tooltip top

export default function BlogEducationBanner({ category }: Props) {
  const [dismissed, setDismissed]     = useState(false);
  const [hovered, setHovered]         = useState(false);
  const [portalReady, setPortalReady] = useState(false);
  const [pillVisible, setPillVisible] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0, direction: 'bottom' as 'top'|'bottom', caretLeft: 20 });

  // ⚠️  ref goes on the <a> tag (the actual pill) so getBoundingClientRect()
  //     returns the pill's exact position, not a full-width block wrapper.
  const pillRef  = useRef<HTMLAnchorElement>(null);
  const leaveRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setPortalReady(true);
    const t = setTimeout(() => setPillVisible(true), 300);
    return () => clearTimeout(t);
  }, []);

  const computePos = useCallback(() => {
    if (!pillRef.current) return;
    const r = pillRef.current.getBoundingClientRect();   // exact pill rect

    const direction: 'top'|'bottom' =
      window.innerHeight - r.bottom < TH + GAP + 16 && r.top >= TH + GAP + 16
        ? 'top' : 'bottom';

    // left-align with pill, clamp within viewport
    let left = r.left;
    if (left + TW > window.innerWidth - 12) left = window.innerWidth - TW - 12;
    if (left < 8) left = 8;

    const caretLeft = Math.min(Math.max(r.left - left + r.width / 2 - 6, 10), TW - 22);
    const top = direction === 'bottom' ? r.bottom + GAP : r.top - TH - GAP;

    setPos({ top, left, direction, caretLeft });
  }, []);

  const onEnter = useCallback(() => {
    if (leaveRef.current) clearTimeout(leaveRef.current);
    computePos();
    setHovered(true);
  }, [computePos]);

  const onLeave = useCallback(() => {
    leaveRef.current = setTimeout(() => setHovered(false), 100);
  }, []);

  useEffect(() => {
    if (!hovered) return;
    window.addEventListener('scroll', computePos, { passive: true });
    window.addEventListener('resize', computePos);
    return () => {
      window.removeEventListener('scroll', computePos);
      window.removeEventListener('resize', computePos);
    };
  }, [hovered, computePos]);

  if (dismissed) return null;

  const data =
    CATEGORY_MAP[category] ||
    Object.entries(CATEGORY_MAP).find(([key]) =>
      category?.toLowerCase().includes(key.toLowerCase()) ||
      key.toLowerCase().includes(category?.toLowerCase()),
    )?.[1] ||
    DEFAULT;

  const href = `/blogs?category=${data.categorySlug}`;

  /* ── Portal tooltip ── */
  const tooltipNode = (
    <div
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{
        position:        'fixed',
        top:             pos.top,
        left:            pos.left,
        width:           TW,
        zIndex:          2147483647,
        pointerEvents:   hovered ? 'auto' : 'none',
        opacity:         hovered ? 1 : 0,
        transform:       hovered ? 'scale(1)' : 'scale(0.95)',
        transformOrigin: pos.direction === 'bottom' ? 'top left' : 'bottom left',
        transition:      'opacity 150ms ease, transform 150ms ease',
      }}
    >
      <Link
        href={href}
        style={{
          display:      'block',
          background:   '#ffffff',
          borderRadius:  16,
          border:       '1px solid #f3f4f6',
          padding:       16,
          boxShadow:    '0 20px 60px rgba(0,0,0,0.16), 0 4px 16px rgba(0,0,0,0.08)',
          textDecoration:'none',
          position:     'relative',
        }}
      >
        {/* Caret arrow */}
        {pos.direction === 'bottom' ? (
          <div style={{
            position:'absolute', left:pos.caretLeft, top:-6,
            width:12, height:12, background:'#fff',
            borderTop:'1px solid #f3f4f6', borderLeft:'1px solid #f3f4f6',
            transform:'rotate(45deg)',
          }}/>
        ) : (
          <div style={{
            position:'absolute', left:pos.caretLeft, bottom:-6,
            width:12, height:12, background:'#fff',
            borderBottom:'1px solid #f3f4f6', borderRight:'1px solid #f3f4f6',
            transform:'rotate(45deg)',
          }}/>
        )}

        {/* Header */}
        <div className="flex items-center justify-between mb-2.5">
          <div className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide bg-gradient-to-r ${data.gradient} bg-clip-text text-transparent`}>
            <Icon icon="ph:lightbulb-fill" width={12} className="text-yellow-400" />
            Did you know?
          </div>
          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r ${data.gradient} text-white`}>
            {data.blogCount}
          </span>
        </div>

        {/* Teaser */}
        <p className="text-sm font-semibold text-gray-900 leading-snug mb-3">
          {data.teaser}
        </p>

        {/* CTA */}
        <div className="flex items-center justify-between pt-2.5 border-t border-gray-100">
          <div className={`flex items-center gap-1.5 text-xs font-bold bg-gradient-to-r ${data.gradient} bg-clip-text text-transparent`}>
            <Icon icon="ph:books-fill" width={13} />
            Browse all {data.label}
          </div>
          <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${data.gradient} flex items-center justify-center`}>
            <Icon icon="ph:arrow-right-bold" width={11} className="text-white" />
          </div>
        </div>
      </Link>
    </div>
  );

  return (
    <>
      {/* ── Pill + dismiss ── */}
      <div
        className={`inline-flex items-center transition-all duration-500 ${
          pillVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
        }`}
      >
        {/*
          ⚠️  KEY FIX: ref is placed directly on the <Link> (<a> tag).
          Previously the ref was on a plain <div> with no display class,
          which defaulted to block / full-width.
          getBoundingClientRect() was returning the wrong (too-wide) rect,
          so the computed position was off — tooltip appeared far below/left.
        */}
        <Link
          ref={pillRef}
          href={href}
          onMouseEnter={onEnter}
          onMouseLeave={onLeave}
          className={`
            relative inline-flex items-center gap-2 pl-2 pr-3 py-1.5
            bg-gradient-to-r ${data.gradient}
            text-white text-xs font-bold rounded-full
            shadow-md hover:shadow-lg
            transition-all duration-200 hover:scale-105 active:scale-95
            select-none cursor-pointer
          `}
        >
          <span className="relative flex h-4 w-4 items-center justify-center flex-shrink-0">
            <span className={`animate-ping absolute inline-flex h-3 w-3 rounded-full ${data.pulse} opacity-60`} />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-white/95" />
          </span>
          <Icon icon={data.icon} width={13} className="flex-shrink-0" />
          <span className="whitespace-nowrap">{data.label}</span>
          <Icon icon="ph:arrow-right-bold" width={10} className="opacity-80" />
        </Link>

        {/* Dismiss */}
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setDismissed(true); }}
          className="ml-1.5 w-4 h-4 flex items-center justify-center text-gray-300 hover:text-gray-500 transition-colors rounded-full"
          aria-label="Dismiss"
        >
          <Icon icon="ph:x-bold" width={9} />
        </button>
      </div>

      {/* Portal renders tooltip directly in <body> — escapes all stacking contexts */}
      {portalReady && createPortal(tooltipNode, document.body)}
    </>
  );
}