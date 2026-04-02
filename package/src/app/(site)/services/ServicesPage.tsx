// src/app/(site)/services/ServicesPage.tsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@iconify/react';
import { solarServices, powerBackupServices, batteryServices, technicalSupport, serviceFeatures } from '@/data/servicesData';
import CallMeBackModal from '@/components/CallMeBackModal';
import { useScrollModal } from '@/hooks/useScrollModal';

// ── Design system ─────────────────────────────────────────────────────────────
const GlassCard = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white/40 backdrop-blur-lg rounded-3xl shadow-xl border border-white/30 transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl ${className}`}>
    {children}
  </div>
);

const PlayfulIcon = ({ icon, ringColor, bgColor }: { icon: string; ringColor: string; bgColor: string }) => (
  <div className={`relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 ${bgColor} rounded-full shadow-lg mb-4 flex-shrink-0`}>
    <span className={`absolute inset-0 rounded-full animate-spin-slow border-4 ${ringColor} opacity-30`} />
    <Icon icon={icon} className="text-2xl sm:text-3xl text-white z-10" />
  </div>
);

const iconMap: Record<string, string> = {
  Compass:     'ph:compass-fill',
  Wrench:      'ph:wrench-fill',
  Settings:    'ph:gear-fill',
  FileText:    'ph:file-text-fill',
  Calculator:  'ph:calculator-fill',
  Zap:         'ph:lightning-fill',
  Calendar:    'ph:calendar-fill',
  Activity:    'ph:activity-fill',
  RefreshCw:   'ph:arrows-clockwise-fill',
  Recycle:     'ph:recycle-fill',
  MapPin:      'ph:map-pin-fill',
  AlertCircle: 'ph:warning-circle-fill',
  TrendingUp:  'ph:trend-up-fill',
  Headphones:  'ph:headset-fill',
  Users:       'ph:users-three-fill',
  Clock:       'ph:clock-fill',
  Shield:      'ph:shield-check-fill',
  DollarSign:  'ph:currency-inr-fill',
};

const cardStyles = [
  { bg: 'bg-primary',                                        ring: 'border-primary' },
  { bg: 'bg-gradient-to-br from-emerald-400 to-green-500',  ring: 'border-emerald-400' },
  { bg: 'bg-gradient-to-br from-yellow-400 to-orange-400',  ring: 'border-yellow-400' },
  { bg: 'bg-gradient-to-br from-blue-400 to-indigo-500',    ring: 'border-blue-400' },
  { bg: 'bg-gradient-to-br from-purple-400 to-violet-500',  ring: 'border-purple-400' },
  { bg: 'bg-gradient-to-br from-pink-400 to-rose-400',      ring: 'border-pink-400' },
  { bg: 'bg-gradient-to-br from-teal-400 to-cyan-500',      ring: 'border-teal-400' },
  { bg: 'bg-gradient-to-br from-amber-400 to-yellow-500',   ring: 'border-amber-400' },
];

const ServiceCard = ({ service, index }: { service: any; index: number }) => {
  const style   = cardStyles[index % cardStyles.length];
  const iconName = iconMap[service.icon] || 'ph:lightning-fill';
  return (
    <GlassCard className="p-5 sm:p-7 flex flex-col items-center text-center h-full">
      <PlayfulIcon icon={iconName} ringColor={style.ring} bgColor={style.bg} />
      <h3 className="text-base sm:text-lg font-extrabold text-gray-900 mb-2 tracking-tight">{service.title}</h3>
      <p className="text-xs sm:text-sm text-gray-600 font-medium leading-relaxed">{service.description}</p>
    </GlassCard>
  );
};

const ServiceSection = ({ id, badge, heading, sub, services }: {
  id: string; badge: string; heading: string; sub: string; services: any[];
}) => (
  <section id={id} className="py-12 sm:py-20 px-3 sm:px-4">
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-8 sm:mb-12">
        <span className="inline-block text-xs font-semibold text-primary uppercase tracking-widest px-3 py-1 bg-primary/10 rounded-full mb-4">{badge}</span>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900 mb-3 drop-shadow-lg tracking-tight">{heading}</h2>
        <p className="text-sm sm:text-lg text-gray-600 font-medium max-w-2xl mx-auto">{sub}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {services.map((s, i) => <ServiceCard key={i} service={s} index={i} />)}
      </div>
    </div>
  </section>
);

const steps = [
  { icon: 'ph:phone-call-fill',   bg: 'bg-primary',                                       ring: 'border-primary',     title: 'Request Service',    desc: 'Call, WhatsApp, or fill our contact form' },
  { icon: 'ph:map-pin-fill',      bg: 'bg-gradient-to-br from-blue-400 to-indigo-500',    ring: 'border-blue-400',    title: 'Site Assessment',    desc: 'Our expert visits and evaluates your needs' },
  { icon: 'ph:file-text-fill',    bg: 'bg-gradient-to-br from-yellow-400 to-orange-400',  ring: 'border-yellow-400',  title: 'Quote & Approval',   desc: 'Transparent pricing, no hidden costs' },
  { icon: 'ph:check-circle-fill', bg: 'bg-gradient-to-br from-emerald-400 to-green-500',  ring: 'border-emerald-400', title: 'Service Completion', desc: 'Professional work with full warranty' },
];

// ── Quick Services strip ───────────────────────────────────────────────────────
const QUICK_SERVICES = [
  { label: 'UPS / Inverter\nInstallation',          slug: 'inverter-installation', icon: 'ph:lightning-fill',        bg: 'bg-primary',                                      ring: 'border-primary' },
  { label: 'Battery\nReplacement',                  slug: 'battery-replacement',   icon: 'ph:battery-charging-fill', bg: 'bg-gradient-to-br from-emerald-400 to-green-500', ring: 'border-emerald-400' },
  { label: 'Solar Panel\nInstallation',             slug: 'solar-installation',    icon: 'ph:solar-panel-fill',      bg: 'bg-gradient-to-br from-yellow-400 to-orange-400', ring: 'border-yellow-400' },
  { label: 'UPS / Inverter\nService & Maintenance', slug: 'inverter-maintenance',  icon: 'ph:wrench-fill',           bg: 'bg-gradient-to-br from-blue-400 to-indigo-500',   ring: 'border-blue-400' },
];

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ServicesPage() {
  const router = useRouter();
  const { showModal, closeModal } = useScrollModal({ triggerTimeMs: 60000, showOnFooterReach: true });

  return (
    <main className="min-h-screen">

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative flex items-center overflow-hidden" style={{ minHeight: '100vh' }}>
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1200&q=80&auto=format&fit=crop"
            alt="Professional energy services"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-dark/90 via-primary/60 to-emerald-900/80" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 pt-32 pb-12">

          <span className="inline-block text-xs font-semibold text-white/70 uppercase tracking-widest px-3 py-1 bg-white/10 rounded-full mb-5 backdrop-blur-sm">
            Professional Services
          </span>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-4 leading-tight drop-shadow-lg tracking-tight max-w-3xl">
            Our Services
          </h1>
          <p className="text-base sm:text-xl text-white/80 max-w-2xl mb-8 font-medium leading-relaxed">
            Reliable Solar, Power Backup, Battery &amp; Technical Support Services — complete energy solutions with professional installation, maintenance, and 24/7 support.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-3 mb-10">
            <a href="#solar-energy"
              className="inline-flex items-center justify-center gap-2 bg-white text-primary px-6 sm:px-8 py-3 rounded-full font-bold hover:bg-primary hover:text-white transition-colors shadow-xl text-sm sm:text-base">
              <Icon icon="ph:solar-panel-fill" width={18} /> Explore Services
            </a>
            <a
              href="https://wa.me/918019179159?text=Hi, I need help with energy services"
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 border-2 border-white text-white px-6 sm:px-8 py-3 rounded-full font-bold hover:bg-white hover:text-dark transition-colors text-sm sm:text-base">
              <Icon icon="ph:whatsapp-logo-fill" width={18} /> WhatsApp Us
            </a>
            {/* Book a Service → goes to /services/book selection page */}
            <button
              onClick={() => router.push('/services/book')}
              className="inline-flex items-center justify-center gap-2 bg-primary text-white px-6 sm:px-8 py-3 rounded-full font-bold hover:bg-emerald-600 transition-colors shadow-xl text-sm sm:text-base border-2 border-primary/60">
              <Icon icon="ph:calendar-check-fill" width={18} /> Book a Service
            </button>
          </div>

         

        </div>
      </section>

      {/* ── SERVICE DETAIL SECTIONS ───────────────────────────────────── */}
      <ServiceSection id="solar-energy"      badge="Solar"        heading="Solar Energy Services"           sub="End-to-end solar solutions from design to installation and ongoing maintenance"       services={solarServices} />
      <ServiceSection id="power-backup-ups"  badge="Power Backup" heading="Power Backup & UPS Services"     sub="Professional inverter and UPS solutions ensuring uninterrupted power supply"          services={powerBackupServices} />
      <ServiceSection id="battery-services"  badge="Battery"      heading="Battery Services"                sub="Comprehensive battery care for maximum performance and longevity"                     services={batteryServices} />
      <ServiceSection id="technical-support" badge="Support"      heading="Technical Support & After-Sales" sub="Reliable support and maintenance to keep your systems running smoothly"               services={technicalSupport} />

      {/* ── WHY CHOOSE US ────────────────────────────────────────────── */}
      <section className="py-12 sm:py-20 px-3 sm:px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <span className="inline-block text-xs font-semibold text-primary uppercase tracking-widest px-3 py-1 bg-primary/10 rounded-full mb-4">Why Us</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900 mb-3 drop-shadow-lg tracking-tight">Why Choose Our Services?</h2>
            <p className="text-sm sm:text-lg text-gray-600 font-medium max-w-2xl mx-auto">Professional service you can trust</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-5xl mx-auto">
            {serviceFeatures.map((feature: any, index: number) => {
              const style    = cardStyles[index % cardStyles.length];
              const iconName = iconMap[feature.icon] || 'ph:lightning-fill';
              return (
                <GlassCard key={index} className="p-5 sm:p-7 flex flex-col items-center text-center">
                  <PlayfulIcon icon={iconName} ringColor={style.ring} bgColor={style.bg} />
                  <h3 className="text-sm sm:text-base font-extrabold text-gray-900 mb-2 tracking-tight">{feature.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-600 font-medium leading-relaxed">{feature.description}</p>
                </GlassCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── HOW WE SERVE YOU ─────────────────────────────────────────── */}
      <section className="py-12 sm:py-20 px-3 sm:px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <span className="inline-block text-xs font-semibold text-primary uppercase tracking-widest px-3 py-1 bg-primary/10 rounded-full mb-4">Our Process</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900 mb-3 drop-shadow-lg tracking-tight">How We Serve You</h2>
            <p className="text-sm sm:text-lg text-gray-600 font-medium max-w-2xl mx-auto">Simple, transparent process from request to completion</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-5xl mx-auto">
            {steps.map((step, i) => (
              <GlassCard key={i} className="p-5 sm:p-7 flex flex-col items-center text-center">
                <div className="relative mb-3">
                  <PlayfulIcon icon={step.icon} ringColor={step.ring} bgColor={step.bg} />
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-primary text-white text-xs font-extrabold rounded-full flex items-center justify-center shadow-md">{i + 1}</span>
                </div>
                <h3 className="text-sm sm:text-base font-extrabold text-gray-900 mb-2 tracking-tight">{step.title}</h3>
                <p className="text-xs sm:text-sm text-gray-600 font-medium leading-relaxed">{step.desc}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section className="py-12 sm:py-20 px-3 sm:px-4">
        <div className="max-w-4xl mx-auto">
          <GlassCard className="p-6 sm:p-12 bg-white/60 text-center">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-primary mb-3 sm:mb-4 drop-shadow-lg tracking-tight">Need Reliable Energy Services?</h2>
            <p className="text-sm sm:text-lg text-dark font-medium mb-6 sm:mb-8 max-w-xl mx-auto leading-relaxed">
              Get professional installation, maintenance, and support for all your power backup and solar needs. Contact us today!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6 sm:mb-8">
              <a href="/contactus"
                className="inline-flex items-center justify-center gap-2 bg-primary text-white px-6 sm:px-8 py-3 rounded-full font-bold hover:bg-dark transition-colors shadow-md text-sm sm:text-base">
                <Icon icon="ph:phone-fill" width={18} /> Contact Us
              </a>
              <button
                onClick={() => router.push('/products')}
                className="inline-flex items-center justify-center gap-2 border-2 border-primary text-primary px-6 sm:px-8 py-3 rounded-full font-bold hover:bg-primary hover:text-white transition-colors text-sm sm:text-base">
                View Our Products <Icon icon="ph:arrow-right-bold" width={16} />
              </button>
            </div>
            <div className="border-t border-primary/20 pt-5 sm:pt-6">
              <p className="text-xs sm:text-sm text-gray-500 font-medium mb-2">Call us now for immediate assistance</p>
              <a href="tel:+918019179159" className="text-xl sm:text-2xl font-extrabold text-primary hover:text-dark transition-colors tracking-tight">
                +91 8019179159
              </a>
            </div>
          </GlassCard>
        </div>
      </section>

      <CallMeBackModal isOpen={showModal} onClose={closeModal} />
    </main>
  );
}