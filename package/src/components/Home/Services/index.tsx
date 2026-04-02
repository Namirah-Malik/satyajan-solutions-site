'use client';

import { useState } from 'react';
import { Icon } from '@iconify/react';

// ── Design system ────────────────────────────────────────────────────────────
const GlassCard = ({ children, className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div {...props} className={`bg-white/40 backdrop-blur-lg rounded-3xl shadow-xl border border-white/30 transition-all duration-300 hover:shadow-2xl ${className}`}>
    {children}
  </div>
);

const PlayfulIcon = ({ icon, ringColor, bgColor, size = 'md' }: { icon: string; ringColor: string; bgColor: string; size?: 'sm' | 'md' }) => {
  const dim = size === 'sm' ? 'w-10 h-10 sm:w-12 sm:h-12' : 'w-12 h-12 sm:w-16 sm:h-16';
  const iconSize = size === 'sm' ? 'text-lg sm:text-xl' : 'text-xl sm:text-3xl';
  return (
    <div className={`relative flex items-center justify-center ${dim} ${bgColor} rounded-full shadow-lg mb-3 flex-shrink-0`}>
      <span className={`absolute inset-0 rounded-full animate-spin-slow border-4 ${ringColor} opacity-30`} />
      <Icon icon={icon} className={`${iconSize} text-white z-10`} />
    </div>
  );
};

// ── Data ─────────────────────────────────────────────────────────────────────
const serviceCards = [
  {
    id: 1,
    icon: 'ph:magnifying-glass-fill',
    bg: 'bg-gradient-to-br from-blue-400 to-indigo-500',
    ring: 'border-blue-400',
    title: 'Diagnose',
    subtitle: 'Battery Condition Analysis',
    description: "Diagnose the condition of the battery when it arrives as 'new', before and after corrective action and when in service — ensuring peak condition using Battery Analyzer.",
    benefits: ['Advanced battery condition analysis', 'Pre-service and post-service evaluation', 'Peak condition monitoring', 'Professional battery analyzer technology'],
  },
  {
    id: 2,
    icon: 'ph:wrench-fill',
    bg: 'bg-gradient-to-br from-emerald-400 to-green-500',
    ring: 'border-emerald-400',
    title: 'Correct',
    subtitle: 'Battery Recovery & Restoration',
    description: 'Correct batteries that are low in capacity using Recover chargers. 70% of dead batteries can be returned to better than new condition, saving time and money.',
    benefits: ['70% battery recovery rate', 'Better than new condition restoration', 'Advanced recovery charger technology', 'Significant cost and time savings'],
  },
  {
    id: 3,
    icon: 'ph:shield-check-fill',
    bg: 'bg-gradient-to-br from-yellow-400 to-orange-400',
    ring: 'border-yellow-400',
    title: 'Prevent / Migrate',
    subtitle: 'Long-term Battery Protection',
    description: 'Keep batteries in peak condition with Solar pulse charger. Prevent problems and extend battery life up to three times by installing desulfators during routine maintenance.',
    benefits: ['Up to 3x battery life extension', 'Solar pulse charger technology', 'Desulfator installation during maintenance', 'Proactive problem prevention'],
  },
];

const batteryBenefits = [
  { icon: 'ph:lightning-fill', bg: 'bg-primary', ring: 'border-primary', title: 'Up to 3x Battery Life', desc: 'Extends battery life up to 3 times' },
  { icon: 'ph:battery-charging-fill', bg: 'bg-gradient-to-br from-emerald-400 to-green-500', ring: 'border-emerald-400', title: '70% Recovery Rate', desc: 'Recovers 70% of spent batteries' },
  { icon: 'ph:arrow-up-fill', bg: 'bg-gradient-to-br from-blue-400 to-indigo-500', ring: 'border-blue-400', title: 'Reduces Jump Starts', desc: 'Dramatically reduces jump starts' },
  { icon: 'ph:wrench-fill', bg: 'bg-gradient-to-br from-purple-400 to-violet-500', ring: 'border-purple-400', title: 'Extends Alternator Life', desc: 'Extends alternator and starter life' },
  { icon: 'ph:leaf-fill', bg: 'bg-gradient-to-br from-teal-400 to-cyan-500', ring: 'border-teal-400', title: 'Supports Sustainability', desc: 'Supports sustainability goals' },
  { icon: 'ph:shopping-cart-fill', bg: 'bg-gradient-to-br from-pink-400 to-rose-400', ring: 'border-pink-400', title: 'Fewer Purchases', desc: 'Reduces batteries purchased' },
  { icon: 'ph:clock-fill', bg: 'bg-gradient-to-br from-amber-400 to-yellow-500', ring: 'border-amber-400', title: 'Less Maintenance', desc: 'Reduces maintenance man hours' },
  { icon: 'ph:car-fill', bg: 'bg-gradient-to-br from-orange-400 to-red-400', ring: 'border-orange-400', title: 'Less Downtime', desc: 'Reduces vehicle downtime' },
];

const whyChoose = [
  { icon: 'ph:lightning-fill', bg: 'bg-gradient-to-br from-yellow-400 to-orange-400', ring: 'border-yellow-400', title: 'Up to 3x Battery Life', desc: 'Extend battery lifespan with advanced tech' },
  { icon: 'ph:battery-charging-fill', bg: 'bg-gradient-to-br from-emerald-400 to-green-500', ring: 'border-emerald-400', title: '70% Recovery Rate', desc: 'Restore spent batteries, save resources' },
  { icon: 'ph:shield-check-fill', bg: 'bg-gradient-to-br from-blue-400 to-indigo-500', ring: 'border-blue-400', title: 'Reduced Downtime', desc: 'Minimize jump starts and vehicle downtime' },
  { icon: 'ph:leaf-fill', bg: 'bg-gradient-to-br from-teal-400 to-cyan-500', ring: 'border-teal-400', title: 'Eco-Friendly Impact', desc: 'Support sustainability and reduce waste' },
];

const Services = () => {
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  return (
    <section id="services" className="py-14 sm:py-20 px-3 sm:px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto">

        {/* ── Section header ──────────────────────────────────────── */}
        <div className="text-center mb-10 sm:mb-16">
          <p className="inline-flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-widest px-3 py-1 bg-primary/10 rounded-full mb-4">
            <Icon icon="ph:sun-fill" className="text-yellow-400 animate-pulse" width={18} />
            Solar & Energy Solutions
          </p>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-3 sm:mb-4 drop-shadow-lg tracking-tight">
            Empowering a Greener Tomorrow
          </h2>
          <p className="text-sm sm:text-lg text-gray-600 font-medium max-w-2xl mx-auto">
            Innovative battery maintenance and solar energy solutions to maximise efficiency, sustainability, and savings.
          </p>
        </div>

        {/* ── Battery Maintenance Benefits ─────────────────────────── */}
        <GlassCard className="p-5 sm:p-8 mb-8 sm:mb-12">
          <div className="flex items-center justify-center gap-3 mb-6 sm:mb-8">
            <PlayfulIcon icon="ph:battery-charging-fill" ringColor="border-primary" bgColor="bg-primary" size="sm" />
            <h3 className="text-lg sm:text-2xl font-extrabold text-gray-900 tracking-tight">
              Battery Maintenance Management Benefits
            </h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {batteryBenefits.map((b, idx) => (
              <div key={idx} className="flex flex-col items-center text-center p-3 sm:p-4 bg-white/50 rounded-2xl border border-white/40 hover:bg-primary/5 transition-colors">
                <PlayfulIcon icon={b.icon} ringColor={b.ring} bgColor={b.bg} size="sm" />
                <span className="text-xs sm:text-sm font-bold text-gray-900 mb-1">{b.title}</span>
                <span className="text-xs text-gray-500 leading-relaxed">{b.desc}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* ── Why Choose ───────────────────────────────────────────── */}
        <GlassCard className="p-5 sm:p-8 mb-8 sm:mb-12">
          <h3 className="text-xl sm:text-3xl font-extrabold text-emerald-800 text-center mb-6 sm:mb-8 tracking-tight">
            Why Choose Our Energy Solutions?
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {whyChoose.map((w, i) => (
              <div key={i} className="flex flex-col items-center text-center p-4 sm:p-6 bg-white/50 rounded-2xl border border-white/40 hover:bg-primary/5 transition-colors">
                <PlayfulIcon icon={w.icon} ringColor={w.ring} bgColor={w.bg} />
                <span className="text-sm sm:text-base font-bold text-gray-900 mb-2">{w.title}</span>
                <span className="text-xs text-gray-500 leading-relaxed">{w.desc}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* ── 3-Step Program header ─────────────────────────────────── */}
        <div className="text-center mb-6 sm:mb-10">
          <h3 className="text-xl sm:text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
            Our 3-Step Battery Maintenance Program
          </h3>
          <p className="text-sm sm:text-base text-gray-600 font-medium max-w-2xl mx-auto">
            A comprehensive approach to optimise battery performance and extend lifespan, powered by solar and smart energy solutions.
          </p>
        </div>

        {/* ── Service Cards ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {serviceCards.map((card) => (
            <GlassCard
              key={card.id}
              className={`cursor-pointer ${expandedCard === card.id ? 'ring-2 ring-primary scale-[1.02]' : ''}`}
              onClick={() => setExpandedCard(expandedCard === card.id ? null : card.id)}
            >
              <div className="p-5 sm:p-7">
                {/* Header */}
                <div className="flex items-start justify-between mb-4 gap-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <PlayfulIcon icon={card.icon} ringColor={card.ring} bgColor={card.bg} size="sm" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-lg sm:text-xl font-extrabold text-primary">{card.id}</span>
                        <h3 className="text-base sm:text-lg font-extrabold text-gray-900 tracking-tight">{card.title}</h3>
                      </div>
                      <p className="text-xs text-gray-500 font-medium">{card.subtitle}</p>
                    </div>
                  </div>
                  <div className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full bg-white/60 border border-white/40">
                    <Icon
                      icon={expandedCard === card.id ? 'ph:caret-up-bold' : 'ph:caret-down-bold'}
                      className="text-gray-500"
                      width={14}
                    />
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-medium mb-3">
                  {card.description}
                </p>

                {/* Expanded */}
                {expandedCard === card.id && (
                  <div className="border-t border-white/40 pt-4 mt-2">
                    <h4 className="text-xs font-extrabold text-gray-900 mb-3 uppercase tracking-wide">Key Benefits</h4>
                    <div className="flex flex-col gap-2">
                      {card.benefits.map((benefit, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-primary to-emerald-400 flex items-center justify-center flex-shrink-0 shadow">
                            <Icon icon="ph:check-bold" className="text-white text-xs" />
                          </div>
                          <span className="text-xs text-gray-700 font-medium">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </GlassCard>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Services;