'use client';

import { useState, useMemo } from 'react';
import { Icon } from '@iconify/react';
import Link from 'next/link';

// ── Appliance definitions ─────────────────────────────────────────────────────
interface Appliance {
  id:       string;
  name:     string;
  icon:     string;
  watts:    number;
  default:  number;
  category: 'essential' | 'comfort' | 'heavy';
}

const APPLIANCES: Appliance[] = [
  { id: 'fan',          name: 'Ceiling Fan',           icon: 'ph:fan-fill',              watts: 75,   default: 3, category: 'essential' },
  { id: 'light_led',    name: 'LED Light',              icon: 'ph:lightbulb-fill',        watts: 10,   default: 6, category: 'essential' },
  { id: 'light_cfl',    name: 'CFL / Tubelight',        icon: 'ph:lamp-fill',             watts: 25,   default: 0, category: 'essential' },
  { id: 'phone',        name: 'Mobile Charger',         icon: 'ph:device-mobile-fill',    watts: 10,   default: 2, category: 'essential' },
  { id: 'wifi',         name: 'Wi-Fi Router',           icon: 'ph:wifi-high-fill',        watts: 15,   default: 1, category: 'essential' },
  { id: 'tv',           name: 'LED TV (32–43″)',         icon: 'ph:television-fill',       watts: 80,   default: 1, category: 'comfort'   },
  { id: 'laptop',       name: 'Laptop',                 icon: 'ph:laptop-fill',           watts: 65,   default: 0, category: 'comfort'   },
  { id: 'fridge_small', name: 'Refrigerator (Small)',   icon: 'ph:thermometer-cold-fill', watts: 150,  default: 0, category: 'comfort'   },
  { id: 'fridge',       name: 'Refrigerator (Double)',  icon: 'ph:thermometer-cold-fill', watts: 250,  default: 1, category: 'comfort'   },
  { id: 'mixer',        name: 'Mixer / Grinder',        icon: 'ph:spiral-fill',           watts: 500,  default: 0, category: 'comfort'   },
  { id: 'cooler',       name: 'Desert Cooler',          icon: 'ph:wind-fill',             watts: 200,  default: 0, category: 'comfort'   },
  { id: 'ac_1t',        name: 'AC (1 Ton)',             icon: 'ph:snowflake-fill',        watts: 1200, default: 0, category: 'heavy'     },
  { id: 'ac_15t',       name: 'AC (1.5 Ton)',           icon: 'ph:snowflake-fill',        watts: 1800, default: 0, category: 'heavy'     },
  { id: 'geyser',       name: 'Geyser / Water Heater',  icon: 'ph:flame-fill',            watts: 2000, default: 0, category: 'heavy'     },
  { id: 'washing',      name: 'Washing Machine',        icon: 'ph:washing-machine-fill',  watts: 500,  default: 0, category: 'heavy'     },
  { id: 'pump',         name: 'Water Pump (0.5 HP)',    icon: 'ph:wave-fill',             watts: 400,  default: 0, category: 'heavy'     },
];

const BACKUP_OPTIONS = [
  { hours: 2,  label: '2 hrs',   note: 'Short outages'   },
  { hours: 4,  label: '4 hrs',   note: 'Half-day backup' },
  { hours: 6,  label: '6 hrs',   note: 'Full-day backup' },
  { hours: 8,  label: '8 hrs',   note: 'Night + day'     },
  { hours: 10, label: '10+ hrs', note: 'Extended backup' },
];

const CATEGORY_LABELS: Record<string, string> = {
  essential: '⚡ Essential Appliances',
  comfort:   '🏠 Comfort Appliances',
  heavy:     '🔥 Heavy Appliances',
};
const CATEGORY_STYLES: Record<string, string> = {
  essential: 'bg-blue-50   border-blue-100',
  comfort:   'bg-purple-50 border-purple-100',
  heavy:     'bg-orange-50 border-orange-100',
};
const CATEGORY_TEXT: Record<string, string> = {
  essential: 'text-blue-700',
  comfort:   'text-purple-700',
  heavy:     'text-orange-700',
};

// ── Recommendation engine ─────────────────────────────────────────────────────
// INVERTER: based purely on peak load (watts) — not affected by backup hours
// BATTERY:  based on energy needed (watt-hours) — directly affected by backup hours
// Formula:
//   effectiveWatts = totalWatts × 1.2          (20% safety buffer)
//   inverterVA     = effectiveWatts / 0.8       (power factor 0.8)
//   totalWh        = effectiveWatts × backupHours
//   batteryAh      = totalWh / (voltage × batteryEfficiency × DoD)
//                  = totalWh / (V × 0.85 × 0.80)
//
// Example — 450W load, 12V system:
//   2h → rawAh = (540×2)/(12×0.68) = 1080/8.16 = 132 → 150Ah
//   4h → rawAh = (540×4)/(12×0.68) = 2160/8.16 = 265 → 2×150Ah
//   6h → rawAh = (540×6)/(12×0.68) = 3240/8.16 = 397 → 2×200Ah
// This is why different hours MUST give different results.

function snapUp(val: number, steps: number[]): number {
  return steps.find(s => s >= val) ?? steps[steps.length - 1];
}

function getRecommendation(totalWatts: number, backupHours: number) {
  // ── 1. Inverter (load-based only, not hours) ──────────────────────────────
  const effectiveWatts = Math.round(totalWatts * 1.2);
  const rawVA          = Math.ceil(effectiveWatts / 0.8);
  const vaSteps        = [600,700,800,850,900,950,1000,1100,1150,1250,
                          1300,1500,1600,1650,2000,2200,2500,2800,3000,
                          3500,4000,5000,6000,7000,8000];
  const inverterVA     = snapUp(rawVA, vaSteps);

  // ── 2. System voltage ─────────────────────────────────────────────────────
  // 12V  → ≤ 2000VA
  // 24V  → 2000–3500VA
  // 48V  → > 3500VA
  const voltage = inverterVA > 3500 ? 48 : inverterVA > 2000 ? 24 : 12;

  // ── 3. Battery (energy-based — scales with hours) ─────────────────────────
  // totalWh = energy the battery must supply
  // batteryEfficiency = 0.85 (charge/discharge losses)
  // DoD = 0.80 (80% depth of discharge — don't drain fully)
  // Ah   = Wh / (V × η × DoD)
  const totalWh  = Math.round(effectiveWatts * backupHours);
  const rawAh    = Math.ceil(totalWh / (voltage * 0.85 * 0.80));

  // For high-Ah requirements, we recommend multiple batteries
  // Standard sizes: 100, 130, 150, 180, 200, 220, 250 Ah (single battery max ~250Ah)
  const singleAhSteps = [100, 130, 150, 180, 200, 220, 250];

  let batteryAh: number;
  let batteryCount = 1;
  let batteryNote  = '';

  if (rawAh <= 250) {
    // Fits in one battery
    batteryAh    = snapUp(rawAh, singleAhSteps);
    batteryCount = 1;
  } else if (rawAh <= 500) {
    // Two batteries in parallel
    batteryAh    = snapUp(Math.ceil(rawAh / 2), singleAhSteps);
    batteryCount = 2;
    batteryNote  = '2 batteries in parallel';
  } else {
    // Three or more — recommend Lithium
    batteryAh    = snapUp(Math.ceil(rawAh / 2), singleAhSteps);
    batteryCount = 2;
    batteryNote  = 'Consider Lithium LiFePO4 for this load';
  }

  // ── 4. Battery type ────────────────────────────────────────────────────────
  const isHighLoad  = totalWatts > 1500 || inverterVA > 2000;
  const batteryType = isHighLoad ? 'Tall Tubular / Lithium' : 'Tall Tubular';

  // ── 5. Category & URL ─────────────────────────────────────────────────────
  let category   = 'Inverter';
  let productUrl = '/products?category=Inverter';
  if (inverterVA > 3500) { category = 'High Capacity UPS'; productUrl = '/products?category=High+Capacity+UPS'; }

  // ── 6. Labels ─────────────────────────────────────────────────────────────
  const inverterLabel = `~${inverterVA}VA Inverter`;
  const batteryLabel  = batteryCount > 1
    ? `${batteryCount} × ${batteryAh}Ah ${batteryType} Batteries`
    : `${batteryAh}Ah ${batteryType} Battery`;

  // ── 7. Advisory note ──────────────────────────────────────────────────────
  let note = '';
  if (totalWatts > 3000)        note = 'Very heavy load. A High Capacity Jumbo UPS will handle this better.';
  else if (batteryCount > 1)    note = `This backup needs ${batteryNote}. Lithium LiFePO4 is a compact, long-life alternative (3500+ cycles).`;
  else if (batteryAh >= 200)    note = 'For this load + duration, a Lithium LiFePO4 battery gives 3500+ cycles, faster charging, and longer life.';
  else if (totalWatts < 250)    note = 'Light load — a basic inverter with a 130Ah battery will be cost-effective.';
  else if (backupHours >= 8)    note = 'For 8+ hours backup, consider an extra battery or upgrading to Lithium LiFePO4 for reliable long-duration use.';

  return {
    totalWatts,
    totalWh,
    effectiveWatts,
    inverterVA,
    batteryAh,
    batteryCount,
    batteryType,
    voltage,
    category,
    inverterLabel,
    batteryLabel,
    productUrl,
    note,
  };
}

const GlassCard = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white/40 backdrop-blur-lg rounded-3xl shadow-xl border border-white/30 transition-all duration-300 hover:shadow-2xl ${className}`}>
    {children}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
export default function LoadCalculatorClient() {
  const [quantities, setQuantities] = useState<Record<string, number>>(
    Object.fromEntries(APPLIANCES.map(a => [a.id, a.default]))
  );
  const [backupHours, setBackupHours] = useState(4);
  const [calculated,  setCalculated]  = useState(false);

  const setQty = (id: string, delta: number) => {
    setQuantities(p => ({ ...p, [id]: Math.max(0, (p[id] || 0) + delta) }));
    setCalculated(false);
  };
  const setQtyDirect = (id: string, val: number) => {
    setQuantities(p => ({ ...p, [id]: Math.max(0, isNaN(val) ? 0 : val) }));
    setCalculated(false);
  };

  const totalWatts = useMemo(() =>
    APPLIANCES.reduce((sum, a) => sum + a.watts * (quantities[a.id] || 0), 0)
  , [quantities]);

  const rec = useMemo(() => getRecommendation(totalWatts, backupHours), [totalWatts, backupHours]);

  const activeAppliances = APPLIANCES.filter(a => (quantities[a.id] || 0) > 0);

  const grouped = useMemo(() => {
    const g: Record<string, Appliance[]> = { essential: [], comfort: [], heavy: [] };
    APPLIANCES.forEach(a => g[a.category].push(a));
    return g;
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">

      {/* Intro */}
      <div className="text-center mb-8 sm:mb-12 pt-2">
        <p className="text-sm sm:text-base text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed">
          Select the appliances you use at home and how many hours of backup you need.
          We'll instantly recommend the right inverter capacity and battery size.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">

        {/* ── LEFT: Appliances + backup hours ── */}
        <div className="lg:col-span-3 space-y-5">

          {(['essential', 'comfort', 'heavy'] as const).map(cat => (
            <div key={cat} className={`rounded-2xl border p-4 sm:p-5 ${CATEGORY_STYLES[cat]}`}>
              <p className={`text-xs font-bold uppercase tracking-widest mb-3 ${CATEGORY_TEXT[cat]}`}>
                {CATEGORY_LABELS[cat]}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {grouped[cat].map(app => {
                  const qty = quantities[app.id] || 0;
                  return (
                    <div key={app.id}
                      className={`flex items-center justify-between gap-2 bg-white rounded-xl px-3 py-2.5 border transition-all duration-200 ${
                        qty > 0 ? 'border-primary/30 shadow-sm' : 'border-white/60'
                      }`}>
                      <div className="flex items-center gap-2 min-w-0">
                        <Icon icon={app.icon} width={15} className={qty > 0 ? 'text-primary' : 'text-gray-400'} />
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-gray-800 truncate leading-snug">{app.name}</p>
                          <p className="text-[10px] text-gray-400">{app.watts}W each</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button onClick={() => setQty(app.id, -1)}
                          className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold text-gray-600 text-base transition-colors">
                          −
                        </button>
                        <input
                          type="number" min={0} max={20} value={qty}
                          onChange={e => setQtyDirect(app.id, parseInt(e.target.value))}
                          className="w-8 text-center text-xs font-bold text-gray-900 bg-transparent focus:outline-none"
                        />
                        <button onClick={() => setQty(app.id, 1)}
                          className="w-7 h-7 rounded-lg bg-primary/10 hover:bg-primary/20 flex items-center justify-center font-bold text-primary text-base transition-colors">
                          +
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Backup hours */}
          <GlassCard className="p-4 sm:p-5">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
              ⏱ How many hours of backup do you need?
            </p>
            <div className="grid grid-cols-5 gap-2">
              {BACKUP_OPTIONS.map(opt => (
                <button key={opt.hours}
                  onClick={() => { setBackupHours(opt.hours); setCalculated(false); }}
                  className={`rounded-xl p-2 sm:p-2.5 text-center transition-all border-2 ${
                    backupHours === opt.hours
                      ? 'border-primary bg-primary text-white shadow-md'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-primary/50'
                  }`}>
                  <p className={`text-xs sm:text-sm font-black leading-tight ${backupHours === opt.hours ? 'text-white' : 'text-gray-900'}`}>
                    {opt.label}
                  </p>
                  <p className={`text-[9px] font-medium mt-0.5 hidden sm:block ${backupHours === opt.hours ? 'text-white/80' : 'text-gray-400'}`}>
                    {opt.note}
                  </p>
                </button>
              ))}
            </div>
          </GlassCard>

          {/* Calculate button */}
          <button
            onClick={() => setCalculated(true)}
            disabled={totalWatts === 0}
            className="w-full py-4 bg-primary hover:bg-dark text-white rounded-2xl font-black text-base
                       flex items-center justify-center gap-2 transition-all shadow-lg
                       hover:shadow-xl hover:scale-[1.01] active:scale-95
                       disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100">
            <Icon icon="ph:calculator-fill" width={20} />
            Calculate My Requirements
          </button>
        </div>

        {/* ── RIGHT: Sticky sidebar ── */}
        <div className="lg:col-span-2">
          <div className="lg:sticky lg:top-24 space-y-4">

            {/* Live Load Meter */}
            <div className="rounded-2xl border border-gray-100 bg-white p-4 sm:p-5 shadow-sm">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block" />
                Live Load Meter
              </p>

              <div className="mb-4">
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-xs text-gray-500 font-medium">Total Load</span>
                  <span className="text-2xl font-black text-gray-900">
                    {totalWatts.toLocaleString('en-IN')}
                    <span className="text-sm font-semibold text-gray-400 ml-1">W</span>
                  </span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      totalWatts > 3000 ? 'bg-red-500' :
                      totalWatts > 1500 ? 'bg-orange-500' :
                      totalWatts > 800  ? 'bg-yellow-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, (totalWatts / 4000) * 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[9px] text-gray-300 mt-1 font-medium">
                  <span>0W</span><span>1kW</span><span>2kW</span><span>3kW</span><span>4kW+</span>
                </div>
              </div>

              {/* Active appliances */}
              <div className="space-y-1 mb-3 max-h-48 overflow-y-auto pr-1">
                {activeAppliances.map(a => (
                  <div key={a.id} className="flex items-center justify-between text-xs py-0.5">
                    <span className="text-gray-600 flex items-center gap-1.5 truncate">
                      <Icon icon={a.icon} width={11} className="text-primary flex-shrink-0" />
                      {quantities[a.id]}× {a.name}
                    </span>
                    <span className="text-gray-400 font-semibold flex-shrink-0 ml-2">
                      {(a.watts * (quantities[a.id] || 0)).toLocaleString('en-IN')}W
                    </span>
                  </div>
                ))}
                {activeAppliances.length === 0 && (
                  <p className="text-xs text-gray-300 italic text-center py-6">
                    Add appliances above to see your load
                  </p>
                )}
              </div>

              {totalWatts > 0 && (
                <div className="border-t border-gray-100 pt-3 space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Load with 20% buffer</span>
                    <span className="font-bold text-gray-700">{rec.effectiveWatts.toLocaleString('en-IN')}W</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Energy needed ({backupHours}h backup)</span>
                    <span className="font-bold text-primary">{rec.totalWh.toLocaleString('en-IN')} Wh</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Battery system voltage</span>
                    <span className="font-bold text-gray-700">{rec.voltage}V</span>
                  </div>
                </div>
              )}
            </div>

            {/* Result card */}
            {calculated && totalWatts > 0 && (
              <div className="rounded-2xl border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-emerald-50 p-4 sm:p-5 shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center flex-shrink-0 shadow">
                    <Icon icon="ph:check-bold" className="text-white" width={16} />
                  </div>
                  <div>
                    <p className="text-sm font-extrabold text-gray-900">Your Recommendation</p>
                    <p className="text-[10px] text-gray-400">
                      {activeAppliances.length} appliance{activeAppliances.length !== 1 ? 's' : ''} · {totalWatts}W · {backupHours}h backup
                    </p>
                  </div>
                </div>

                {/* Inverter */}
                <div className="bg-white rounded-xl p-3 mb-2 border border-primary/15 shadow-sm">
                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon icon="ph:lightning-fill" className="text-primary" width={16} />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">Inverter</p>
                      <p className="text-sm font-black text-gray-900">{rec.inverterLabel}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        For {rec.totalWatts}W load (+20% buffer = {rec.effectiveWatts}W)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Battery */}
                <div className="bg-white rounded-xl p-3 mb-3 border border-emerald-100 shadow-sm">
                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon icon="ph:battery-charging-fill" className="text-emerald-600" width={16} />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">Battery</p>
                      <p className="text-sm font-black text-gray-900">{rec.batteryLabel}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        {rec.totalWh.toLocaleString('en-IN')} Wh needed · {rec.voltage}V system · {backupHours}h backup
                      </p>
                    </div>
                  </div>
                </div>

                {/* Summary sentence */}
                <div className="bg-primary/10 border border-primary/20 rounded-xl p-3 mb-3">
                  <p className="text-xs font-semibold text-primary leading-relaxed">
                    💡 Based on your load of{' '}
                    {activeAppliances.slice(0, 3).map(a => `${quantities[a.id]}× ${a.name}`).join(', ')}
                    {activeAppliances.length > 3 ? ` + ${activeAppliances.length - 3} more` : ''}
                    , you need approximately a{' '}
                    <strong>{rec.inverterLabel}</strong> with a{' '}
                    <strong>{rec.batteryLabel}</strong> for {backupHours} hours of backup.
                  </p>
                </div>

                {/* Advisory note */}
                {rec.note && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-3">
                    <p className="text-[11px] text-amber-700 font-medium flex items-start gap-1.5">
                      <Icon icon="ph:info-fill" width={12} className="flex-shrink-0 mt-0.5" />
                      {rec.note}
                    </p>
                  </div>
                )}

                {/* CTAs */}
                <div className="flex flex-col gap-2">
                  <Link href={rec.productUrl}
                    className="w-full py-2.5 bg-primary text-white rounded-xl font-bold text-sm
                               flex items-center justify-center gap-2 hover:bg-dark transition-colors shadow-md">
                    <Icon icon="ph:shopping-bag-fill" width={16} />
                    Browse Matching Products
                  </Link>
                  <a
                    href={`https://wa.me/918019179159?text=${encodeURIComponent(
                      `Hi! I used the Load Calculator on your website.\n\nMy appliances:\n${
                        activeAppliances.map(a => `• ${quantities[a.id]}× ${a.name} (${a.watts * (quantities[a.id] || 0)}W)`).join('\n')
                      }\n\nTotal Load: ${rec.totalWatts}W\nBackup needed: ${backupHours} hours\nEnergy required: ${rec.totalWh} Wh\n\nRecommendation:\n✅ ${rec.inverterLabel}\n🔋 ${rec.batteryLabel}\n\nPlease help me find the right product and pricing.`
                    )}`}
                    target="_blank" rel="noopener noreferrer"
                    className="w-full py-2.5 bg-[#25D366] hover:bg-[#1fba58] text-white rounded-xl font-bold text-sm
                               flex items-center justify-center gap-2 transition-colors">
                    <Icon icon="mdi:whatsapp" width={16} />
                    Get Expert Help on WhatsApp
                  </a>
                </div>
              </div>
            )}

            {/* Prompt */}
            {!calculated && totalWatts > 0 && (
              <div className="rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 p-5 text-center">
                <Icon icon="ph:arrow-up-fill" className="text-primary mx-auto mb-2 animate-bounce" width={24} />
                <p className="text-sm font-semibold text-primary">Click "Calculate" to see your recommendation</p>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: 'ph:sliders-horizontal-fill', color: 'text-blue-600',    bg: 'bg-blue-50',    step: '1', title: 'Select Appliances',       desc: 'Choose each device you run during a power cut and set the quantity.' },
          { icon: 'ph:clock-countdown-fill',    color: 'text-purple-600',  bg: 'bg-purple-50',  step: '2', title: 'Set Backup Duration',     desc: 'Tell us how many hours of backup you need. More hours = bigger battery.' },
          { icon: 'ph:check-circle-fill',       color: 'text-emerald-600', bg: 'bg-emerald-50', step: '3', title: 'Get Your Recommendation', desc: 'We calculate the exact inverter VA and battery Ah — different for every load and duration.' },
        ].map(s => (
          <div key={s.step} className={`flex items-start gap-3 ${s.bg} rounded-2xl p-4 border border-white/60`}>
            <div className="w-9 h-9 rounded-xl bg-white/80 flex items-center justify-center flex-shrink-0 shadow-sm">
              <Icon icon={s.icon} className={s.color} width={18} />
            </div>
            <div>
              <p className="text-xs font-black text-gray-900 mb-1">Step {s.step} — {s.title}</p>
              <p className="text-xs text-gray-500 leading-relaxed">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="mt-10 rounded-3xl bg-gradient-to-r from-primary to-emerald-500 p-6 sm:p-8 text-center shadow-xl">
        <h3 className="text-xl sm:text-2xl font-extrabold text-white mb-2">Still confused? Talk to our experts.</h3>
        <p className="text-white/80 text-sm mb-5 font-medium">
          Our team will assess your exact requirements and recommend the perfect inverter + battery combo.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a href="https://wa.me/918019179159?text=Hi, I need help choosing the right inverter and battery for my home."
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-white text-primary font-bold px-6 py-3 rounded-full text-sm hover:bg-gray-50 transition-all shadow-md">
            <Icon icon="mdi:whatsapp" width={18} className="text-[#25D366]" />
            Chat on WhatsApp
          </a>
          <Link href="/products?category=Inverter"
            className="inline-flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 text-white font-bold px-6 py-3 rounded-full text-sm transition-all border border-white/40">
            <Icon icon="ph:shopping-bag-fill" width={16} />
            Browse Inverters
          </Link>
        </div>
      </div>

    </div>
  );
}