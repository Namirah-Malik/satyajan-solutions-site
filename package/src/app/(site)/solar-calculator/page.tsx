
'use client';

import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import HeroSub from '@/components/shared/HeroSub';

// ── Business Logic ────────────────────────────────────────────────────────────
// Daily Generation = kW × 5 units/day (Satyajan standard)
// System Cost      = kW × ₹50,000 (flat across all sizes)
// Annual Gen       = kW × 5 × 365
// Degradation      = 0.7% per year for 25-year projection
// India CO₂ factor = 0.82 kg/unit

const DAILY_UNITS_PER_KW = 5;      // units per kW per day
const COST_PER_KW        = 50000;  // ₹ per kW — flat
const DEGRADATION        = 0.993;  // 0.7% annual degradation
const PANEL_W            = 550;    // Watts per panel
const PANEL_AREA         = 24;     // sqft per panel

function systemCostByKw(kw: number): number {
  return kw * COST_PER_KW;
}

function calcSolarSavings(kw: number, tariff: number) {
  const systemCost = systemCostByKw(kw);

  // Generation
  const dailyGen   = parseFloat((kw * DAILY_UNITS_PER_KW).toFixed(1));   // units/day
  const monthlyGen = Math.round(dailyGen * 30);                           // units/month
  const annualGen  = Math.round(kw * DAILY_UNITS_PER_KW * 365);          // units/year

  // Savings
  const monthlySavings = Math.round(monthlyGen * tariff);
  const annualSavings  = Math.round(annualGen  * tariff);

  // Payback
  const paybackYears = parseFloat((systemCost / annualSavings).toFixed(1));

  // 25-year savings with degradation
  let totalSavings25 = 0;
  let gen = annualGen;
  for (let i = 0; i < 25; i++) {
    totalSavings25 += gen * tariff;
    gen *= DEGRADATION;
  }

  // Hardware
  const numPanels  = Math.ceil((kw * 1000) / PANEL_W);
  const areaNeeded = numPanels * PANEL_AREA;

  // Environmental
  const co2Annual  = Math.round(annualGen * 0.82);
  const treesEquiv = Math.round(co2Annual / 21.7);

  return {
    systemCost,
    dailyGen,
    monthlyGen,
    annualGen,
    monthlySavings,
    annualSavings,
    paybackYears,
    totalSavings25: Math.round(totalSavings25),
    numPanels,
    areaNeeded,
    co2Annual,
    treesEquiv,
  };
}

function inr(n: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', maximumFractionDigits: 0,
  }).format(n);
}

const TARIFF_OPTIONS = [7, 8, 9, 10, 11];
const KW_PRESETS     = [1, 2, 3, 5, 7, 10];
type Step = 'input' | 'results' | 'booking' | 'done';

const GlassCard = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white/40 backdrop-blur-lg rounded-3xl shadow-xl border border-white/30 transition-all duration-300 hover:shadow-2xl ${className}`}>
    {children}
  </div>
);

export default function SolarCalculatorPage() {
  const [step, setStep]           = useState<Step>('input');
  const [kw, setKw]               = useState(3);
  const [customKw, setCustomKw]   = useState('');
  const [tariff, setTariff]       = useState(8);
  const [form, setForm]           = useState({ name: '', phone: '', email: '', message: '' });
  const [formError, setFormError] = useState('');

  const effectiveKw = customKw ? parseFloat(customKw) || kw : kw;
  const calc        = calcSolarSavings(effectiveKw, tariff);

  const handleCalculate = () => {
    if (effectiveKw < 0.5 || effectiveKw > 50) return;
    setStep('results');
    setTimeout(() => document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) { setFormError('Name and phone are required'); return; }
    setFormError('');
    const msg = [
      '☀️ *Solar Consultation Request — Satyajan Energy*',
      '━━━━━━━━━━━━━━━━━━━━━',
      `👤 Name: ${form.name}`,
      `📞 Phone: ${form.phone}`,
      form.email ? `📧 Email: ${form.email}` : '',
      '━━━━━━━━━━━━━━━━━━━━━',
      `⚡ System Size: ${effectiveKw} kW`,
      `🔆 Daily Generation: ${calc.dailyGen} units/day`,
      `💡 Unit Rate: ₹${tariff}/unit`,
      `💰 Est. Monthly Savings: ${inr(calc.monthlySavings)}`,
      `🏷️ System Cost: ${inr(calc.systemCost)}`,
      `📅 Payback: ${calc.paybackYears} years`,
      form.message ? `💬 Message: ${form.message}` : '',
      '━━━━━━━━━━━━━━━━━━━━━',
      'Requesting free site visit & detailed quote 🙏',
    ].filter(Boolean).join('\n');
    window.open(`https://wa.me/918019179159?text=${encodeURIComponent(msg)}`, '_blank');
    setStep('done');
  };

  const handleReset = () => {
    setStep('input'); setKw(3); setCustomKw(''); setTariff(8);
    setForm({ name: '', phone: '', email: '', message: '' }); setFormError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen">
      <HeroSub
        title="Solar Savings Calculator."
        description="Calculate your monthly savings, payback period, and 25-year returns before going solar."
        badge="Solar Calculator"
      />

      {/* ── Input ─────────────────────────────────────────────────── */}
      <section className="px-4 max-w-7xl mx-auto pt-12 pb-8">
        <div className="text-start mb-10">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4 drop-shadow-lg tracking-tight">
            Calculate Your Savings
          </h2>
          <p className="text-lg text-gray-600 max-w-4xl font-medium">
            5 units/kW/day · ₹50,000/kW · Satyajan pricing
          </p>
        </div>

        <GlassCard className="p-8">
          <div className="grid lg:grid-cols-2 gap-8">

            {/* System Size */}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-3">
                System Size (kW)
                <span className="text-gray-400 font-normal ml-2">— typical home: 3–7 kW</span>
              </p>
              <div className="grid grid-cols-3 gap-2 mb-3">
                {KW_PRESETS.map(k => (
                  <button key={k} onClick={() => { setKw(k); setCustomKw(''); }}
                    className={`py-2.5 rounded-xl text-sm font-bold border-2 transition-all duration-200 ${
                      effectiveKw === k && !customKw
                        ? 'bg-primary border-primary text-white shadow-lg'
                        : 'border-gray-200 text-gray-600 hover:border-primary/50 bg-white'
                    }`}>
                    {k} kW
                  </button>
                ))}
              </div>
              <input type="number" value={customKw} onChange={e => setCustomKw(e.target.value)}
                placeholder="Or enter custom kW (e.g. 4, 15, 25)"
                min={0.5} max={50} step={0.5}
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary transition-all text-sm" />
            </div>

            {/* Electricity Rate */}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-3">
                Your Electricity Rate (₹/unit)
                <span className="text-gray-400 font-normal ml-2">— check your TGSPDCL bill</span>
              </p>
              <div className="flex gap-2 mb-4">
                {TARIFF_OPTIONS.map(t => (
                  <button key={t} onClick={() => setTariff(t)}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-bold border-2 transition-all duration-200 ${
                      tariff === t
                        ? 'bg-primary border-primary text-white shadow-lg'
                        : 'border-gray-200 text-gray-600 hover:border-primary/50 bg-white'
                    }`}>
                    ₹{t}
                  </button>
                ))}
              </div>

              {/* Live preview */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Daily Generation', value: `${calc.dailyGen} units`,    color: 'text-blue-600' },
                  { label: 'System Cost',       value: inr(calc.systemCost),        color: 'text-gray-800' },
                  { label: 'Monthly Savings',   value: inr(calc.monthlySavings),    color: 'text-primary font-extrabold' },
                  { label: 'Payback Period',    value: `${calc.paybackYears} yrs`,  color: 'text-orange-500 font-extrabold' },
                ].map(m => (
                  <div key={m.label} className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">{m.label}</p>
                    <p className={`text-sm font-bold ${m.color}`}>{m.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button onClick={handleCalculate}
            className="w-full mt-6 py-4 bg-primary hover:bg-dark text-white font-black rounded-xl transition-all duration-200 text-base flex items-center justify-center gap-2 shadow-xl">
            <Icon icon="ph:calculator-fill" width={20} />
            Calculate My Savings
          </button>
        </GlassCard>
      </section>

      {/* ── Results ─────────────────────────────────────────────────── */}
      {(step === 'results' || step === 'booking' || step === 'done') && (
        <section id="results-section" className="px-4 max-w-7xl mx-auto pb-8 space-y-6">
          <div className="text-start mb-6">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-2 drop-shadow-lg tracking-tight">
              Your Solar Savings
            </h2>
            <p className="text-gray-600 font-medium">
              {effectiveKw} kW system · {calc.numPanels} panels · ₹{tariff}/unit
            </p>
          </div>

          {/* 4 key metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Monthly Generation', value: `${calc.monthlyGen}`, unit: 'units',  icon: 'ph:lightning-fill',    color: 'text-blue-500',    bg: 'bg-blue-50 border-blue-100' },
              { label: 'Monthly Savings',    value: inr(calc.monthlySavings), unit: '',   icon: 'ph:currency-inr-fill', color: 'text-primary',     bg: 'bg-green-50 border-green-100' },
              { label: 'Yearly Savings',     value: inr(calc.annualSavings),  unit: '',   icon: 'ph:trend-up-fill',     color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100' },
              { label: 'Payback Period',     value: `${calc.paybackYears}`,   unit: 'years', icon: 'ph:clock-fill',    color: 'text-orange-500',  bg: 'bg-orange-50 border-orange-100' },
            ].map(m => (
              <GlassCard key={m.label} className={`p-5 border ${m.bg}`}>
                <Icon icon={m.icon} width={24} className={`${m.color} mb-2`} />
                <p className={`text-2xl sm:text-3xl font-black ${m.color}`}>{m.value}</p>
                {m.unit && <p className="text-xs text-gray-400">{m.unit}</p>}
                <p className="text-xs text-gray-500 mt-1">{m.label}</p>
              </GlassCard>
            ))}
          </div>

          {/* Summary */}
          <GlassCard className="p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">Summary</h3>
            <p className="text-gray-600 font-medium leading-relaxed">
              With a <span className="text-gray-900 font-bold">{effectiveKw} kW solar system</span> ({calc.numPanels} × 550W panels),
              you will generate approximately <span className="text-gray-900 font-bold">{calc.dailyGen} units per day</span> and{' '}
              <span className="text-gray-900 font-bold">{calc.monthlyGen} units per month</span>. At your electricity rate of{' '}
              <span className="text-gray-900 font-bold">₹{tariff}/unit</span>, you&apos;ll save{' '}
              <span className="text-primary font-bold">{inr(calc.monthlySavings)}/month</span> — that&apos;s{' '}
              <span className="text-primary font-bold">{inr(calc.annualSavings)}/year</span>. The system costs{' '}
              <span className="text-gray-900 font-bold">{inr(calc.systemCost)}</span> and pays for
              itself in <span className="text-orange-500 font-bold">{calc.paybackYears} years</span>, after which
              you enjoy free electricity for 20+ more years!
            </p>
          </GlassCard>

          {/* Financial breakdown */}
          <GlassCard className="p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 tracking-tight">Financial Breakdown</h3>
            <div className="space-y-4">
              {[
                { label: 'System Cost',          value: inr(calc.systemCost),         valueColor: 'text-gray-800 font-bold' },
                { label: 'Daily Generation',      value: `${calc.dailyGen} units/day`, valueColor: 'text-blue-600 font-bold' },
                { label: 'Monthly Generation',    value: `${calc.monthlyGen} units`,   valueColor: 'text-blue-600 font-bold' },
                { label: 'Monthly Savings',       value: inr(calc.monthlySavings),     valueColor: 'text-primary font-bold' },
                { label: 'Annual Savings',        value: inr(calc.annualSavings),      valueColor: 'text-primary font-bold' },
                { label: 'Payback Period',        value: `${calc.paybackYears} years`, valueColor: 'text-orange-500 font-bold', border: true },
                { label: '25-Year Total Savings', value: inr(calc.totalSavings25),     valueColor: 'text-emerald-600 text-lg font-black', border: true },
              ].map((r, i) => (
                <div key={i} className={`flex justify-between items-center text-sm ${r.border ? 'pt-4 border-t border-gray-200' : ''}`}>
                  <span className="text-gray-600">{r.label}</span>
                  <span className={r.valueColor}>{r.value}</span>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Payback banner */}
          <div className="relative overflow-hidden bg-gradient-to-r from-primary to-emerald-400 rounded-3xl p-8 text-center">
            <p className="text-white/80 text-sm font-semibold mb-1">Your system pays for itself in</p>
            <p className="text-7xl font-black text-white">{calc.paybackYears}</p>
            <p className="text-white/80 font-semibold">Years</p>
            <p className="text-white/70 text-sm mt-2">then enjoy free electricity for 20+ more years!</p>
          </div>

          {/* Hardware + Environmental */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: 'ph:solar-panel-fill', color: 'text-yellow-500', label: 'No. of Panels',     value: `${calc.numPanels} panels`,                       sub: '550W Mono PERC each' },
              { icon: 'ph:house-fill',        color: 'text-sky-500',    label: 'Roof Area Needed',  value: `~${calc.areaNeeded} sqft`,                       sub: 'Shade-free terrace' },
              { icon: 'ph:leaf-fill',         color: 'text-emerald-500',label: 'CO₂ Saved / Year',  value: `${calc.co2Annual.toLocaleString('en-IN')} kg`,    sub: `≈ ${calc.treesEquiv} trees/year` },
              { icon: 'ph:lightning-fill',    color: 'text-blue-500',   label: 'Annual Generation', value: `${calc.annualGen.toLocaleString('en-IN')} units`, sub: 'kWh per year' },
            ].map(m => (
              <GlassCard key={m.label} className="p-5">
                <Icon icon={m.icon} width={24} className={`${m.color} mb-2`} />
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">{m.label}</p>
                <p className="text-xl font-black text-gray-900">{m.value}</p>
                <p className={`text-xs ${m.color} mt-1`}>{m.sub}</p>
              </GlassCard>
            ))}
          </div>

          {step === 'results' && (
            <div className="grid grid-cols-2 gap-3">
              <button onClick={handleReset}
                className="py-3.5 border-2 border-gray-200 text-gray-600 font-semibold rounded-xl hover:border-gray-300 transition text-sm">
                ← Recalculate
              </button>
              <button
                onClick={() => { setStep('booking'); setTimeout(() => document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' }), 100); }}
                className="py-3.5 bg-[#25D366] hover:bg-[#1fba58] text-white font-black rounded-xl transition flex items-center justify-center gap-2 text-sm shadow-lg">
                <Icon icon="mdi:whatsapp" width={18} />
                Get Free Quote
              </button>
            </div>
          )}
        </section>
      )}

      {/* ── Booking ─────────────────────────────────────────────────── */}
      {(step === 'booking' || step === 'done') && (
        <section id="booking-section" className="px-4 max-w-7xl mx-auto pb-16">
          {step === 'booking' && (
            <GlassCard className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">Book a Free Site Visit</h2>
              <p className="text-gray-600 font-medium mb-6">Our expert will assess your roof and give you a detailed quote — no obligation.</p>
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 text-sm text-primary">
                <strong className="text-gray-900">Your estimate:</strong>{' '}
                {inr(calc.monthlySavings)}/month · {calc.numPanels} panels · Payback: {calc.paybackYears} yrs · Cost: {inr(calc.systemCost)}
              </div>
              <form onSubmit={handleBook} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="Your Name *"
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary transition" />
                  <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                    placeholder="Phone Number *"
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary transition" />
                </div>
                <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="Email (optional)"
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary transition" />
                <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                  placeholder="Any questions or specific requirements? (optional)" rows={3}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary transition resize-none" />
                {formError && <p className="text-xs text-red-500">{formError}</p>}
                <button type="submit"
                  className="w-full py-4 bg-[#25D366] hover:bg-[#1fba58] text-white font-black rounded-xl transition flex items-center justify-center gap-2 text-base shadow-xl">
                  <Icon icon="mdi:whatsapp" width={22} />
                  Send via WhatsApp
                </button>
              </form>
              <button onClick={() => setStep('results')} className="text-sm text-gray-400 hover:text-gray-600 w-full text-center mt-4 transition">
                ← Back to results
              </button>
            </GlassCard>
          )}

          {step === 'done' && (
            <GlassCard className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <Icon icon="ph:check-circle-fill" width={40} className="text-primary" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">Request Sent!</h3>
              <p className="text-gray-500 text-sm mb-6">
                Our team will reach out on WhatsApp within <strong className="text-gray-900">30 minutes</strong>.
              </p>
              <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-sm text-left space-y-2 mb-6">
                <p className="text-gray-600">☀️ System: <span className="text-gray-900 font-bold">{effectiveKw} kW · {calc.numPanels} panels</span></p>
                <p className="text-gray-600">💰 Monthly Savings: <span className="text-primary font-bold">{inr(calc.monthlySavings)}</span></p>
                <p className="text-gray-600">🏷️ System Cost: <span className="text-gray-900 font-bold">{inr(calc.systemCost)}</span></p>
              </div>
              <div className="flex gap-3">
                <button onClick={handleReset} className="flex-1 py-3 border-2 border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:border-gray-300 transition">
                  New Calculation
                </button>
                <Link href="/" className="flex-1 py-3 bg-primary text-white rounded-xl text-sm font-bold text-center hover:bg-dark transition">
                  Go Home
                </Link>
              </div>
            </GlassCard>
          )}
        </section>
      )}

      {/* ── Understanding Your Savings ── */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-start mb-12">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4 drop-shadow-lg tracking-tight">
              Understanding Your Savings
            </h2>
            <p className="text-lg text-gray-600 max-w-4xl font-medium">
              How we calculate your solar savings and what the numbers mean for your home.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: 'ph:sun-fill', color: 'text-yellow-500', bg: 'bg-yellow-50 border-yellow-100',
                title: 'How We Calculate',
                desc: 'Daily generation = kW × 5 units/day. Monthly = Daily × 30. Annual = kW × 5 × 365. Based on Satyajan field data across Hyderabad installations.',
              },
              {
                icon: 'ph:clock-countdown-fill', color: 'text-orange-500', bg: 'bg-orange-50 border-orange-100',
                title: 'Payback Period',
                desc: 'System Cost ÷ Annual Savings. Flat pricing of ₹50,000/kW. A 3 kW system costs ₹1,50,000 and typically pays back in 4–6 years.',
              },
              {
                icon: 'ph:trend-up-fill', color: 'text-primary', bg: 'bg-green-50 border-green-100',
                title: 'Long-term Benefits',
                desc: '25-year projection with 0.7% annual panel degradation. Solar panels carry a 25-year performance warranty — after payback, electricity is nearly free.',
              },
              {
                icon: 'ph:leaf-fill', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100',
                title: 'Environmental Impact',
                desc: 'India grid emission factor: 0.82 kg CO₂ per unit. A 5 kW system avoids ~9,125 units/year — saving ~7,483 kg CO₂, equal to planting 345 trees annually.',
              },
            ].map(c => (
              <GlassCard key={c.title} className={`p-5 border ${c.bg}`}>
                <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center mb-3`}>
                  <Icon icon={c.icon} width={20} className={c.color} />
                </div>
                <h3 className="text-sm font-bold text-gray-900 mb-2">{c.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{c.desc}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <GlassCard className="p-10 bg-white/60">
            <h2 className="text-3xl font-bold text-primary mb-4 drop-shadow-lg tracking-tight">Ready to Go Solar?</h2>
            <p className="text-dark mb-8 text-lg font-medium">
              Get a free site assessment and detailed quote from our certified solar experts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products?category=Solar"
                className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-dark transition-colors shadow-md">
                View Solar Products
              </Link>
              <Link href="/contactus"
                className="border-2 border-primary text-primary px-8 py-3 rounded-lg font-semibold hover:bg-primary hover:text-white transition-colors shadow-md">
                Contact Us Today
              </Link>
            </div>
          </GlassCard>
        </div>
      </section>
    </main>
  );
}
