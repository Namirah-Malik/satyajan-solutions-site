'use client';
// src/components/BlogEducationBanner.tsx

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';

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

export default function BlogEducationBanner({ category }: Props) {
  const [dismissed,   setDismissed]   = useState(false);
  const [pillVisible, setPillVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setPillVisible(true), 300);
    return () => clearTimeout(t);
  }, []);

  if (dismissed) return null;

  const data =
    CATEGORY_MAP[category] ||
    Object.entries(CATEGORY_MAP).find(([key]) =>
      category?.toLowerCase().includes(key.toLowerCase()) ||
      key.toLowerCase().includes(category?.toLowerCase()),
    )?.[1] ||
    DEFAULT;

  const href = `/blogs?category=${data.categorySlug}`;

  return (
    <div
      className={`inline-flex items-center transition-all duration-500 ${
        pillVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
      }`}
    >
      {/* ── Wrapper with group hover — this is the key ── */}
      <div className="relative group">

        {/* ── Pill ── */}
        <Link
          href={href}
          className={`
            relative inline-flex items-center gap-2 pl-2 pr-3 py-1.5
            bg-gradient-to-r ${data.gradient}
            text-white text-xs font-bold rounded-full
            shadow-md hover:shadow-lg
            transition-all duration-200 hover:scale-105 active:scale-95
            select-none cursor-pointer
          `}
        >
          {/* Pulsing dot */}
          <span className="relative flex h-4 w-4 items-center justify-center flex-shrink-0">
            <span className={`animate-ping absolute inline-flex h-3 w-3 rounded-full ${data.pulse} opacity-60`} />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-white/95" />
          </span>
          <Icon icon={data.icon} width={13} className="flex-shrink-0" />
          <span className="whitespace-nowrap">{data.label}</span>
          <Icon icon="ph:arrow-right-bold" width={10} className="opacity-80" />
        </Link>

        {/* ── Invisible bridge: fills gap between pill and tooltip ── */}
        <div className="absolute left-0 top-full w-full h-3 bg-transparent" />

        {/* ── Tooltip: shown on group hover ── */}
        <div className={`
          absolute left-0 top-[calc(100%+8px)] z-[9999]
          w-72 bg-white rounded-2xl border border-gray-100
          shadow-2xl shadow-black/15
          pointer-events-none
          opacity-0 -translate-y-1 scale-95
          group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100
          group-hover:pointer-events-auto
          transition-all duration-200 ease-out
          origin-top-left
        `}>
          {/* Caret */}
          <div className="absolute -top-1.5 left-5 w-3 h-3 bg-white border-t border-l border-gray-100 rotate-45" />

          <Link href={href} className="block p-4 no-underline rounded-2xl">
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
              <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${data.gradient} flex items-center justify-center flex-shrink-0`}>
                <Icon icon="ph:arrow-right-bold" width={11} className="text-white" />
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Dismiss */}
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setDismissed(true); }}
        className="ml-1.5 w-4 h-4 flex items-center justify-center text-gray-300 hover:text-gray-500 transition-colors rounded-full flex-shrink-0"
        aria-label="Dismiss"
      >
        <Icon icon="ph:x-bold" width={9} />
      </button>
    </div>
  );
}