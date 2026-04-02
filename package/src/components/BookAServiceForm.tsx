// src/components/BookAServiceForm.tsx
'use client';

import { useState, forwardRef } from 'react';
import { Icon } from '@iconify/react';

const SERVICE_OPTIONS = [
  { label: 'Select a Service',      value: '' },
  { label: 'Inverter Installation', value: 'Inverter Installation' },
  { label: 'Inverter Repair',       value: 'Inverter Repair' },
  { label: 'Inverter Maintenance',  value: 'Inverter Maintenance' },
  { label: 'Battery Installation',  value: 'Battery Installation' },
  { label: 'Battery Replacement',   value: 'Battery Replacement' },
  { label: 'UPS Service',           value: 'UPS Service' },
  { label: 'Solar Installation',    value: 'Solar Installation' },
  { label: 'Solar Maintenance',     value: 'Solar Maintenance' },
];

interface FormState {
  fullName: string; mobile: string; serviceType: string; brandName: string;
  problemDetails: string; address: string; city: string; pincode: string; preferredDate: string;
}
const EMPTY: FormState = {
  fullName: '', mobile: '', serviceType: '', brandName: '',
  problemDetails: '', address: '', city: '', pincode: '', preferredDate: '',
};

const inputCls =
  'w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-800 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all';

const BookAServiceForm = forwardRef<HTMLDivElement>((_, ref) => {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const set = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200)); // replace with your real API call
    setLoading(false);
    setDone(true);
  };

  return (
    <div ref={ref} id="book-a-service" className="py-12 sm:py-20 px-3 sm:px-4 bg-gray-50 scroll-mt-24">
      <div className="max-w-4xl mx-auto">

        <div className="text-center mb-8 sm:mb-12">
          <span className="inline-block text-xs font-semibold text-primary uppercase tracking-widest px-3 py-1 bg-primary/10 rounded-full mb-4">
            Book a Service
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">
            Book a Service
          </h2>
          <p className="text-sm sm:text-base text-gray-500 font-medium">
            Request inverter, battery or UPS service at your doorstep.
          </p>
        </div>

        {done ? (
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-10 text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon icon="ph:check-circle-fill" className="text-emerald-500 text-4xl" />
            </div>
            <h3 className="text-xl font-extrabold text-gray-900 mb-2">Request Submitted!</h3>
            <p className="text-sm text-gray-500 mb-6">Our team will contact you shortly to confirm your booking.</p>
            <button
              onClick={() => { setDone(false); setForm(EMPTY); }}
              className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full font-bold hover:bg-dark transition-colors text-sm"
            >
              <Icon icon="ph:arrow-counter-clockwise-bold" width={16} /> Book Another Service
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wide">Full Name</label>
                <div className="relative">
                  <Icon icon="ph:user-fill" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width={16} />
                  <input name="fullName" value={form.fullName} onChange={set} required placeholder="Full Name" className={inputCls} />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wide">Mobile Number</label>
                <div className="relative">
                  <Icon icon="ph:phone-fill" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width={16} />
                  <input name="mobile" type="tel" value={form.mobile} onChange={set} required placeholder="Mobile Number" className={inputCls} />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wide">Service Type</label>
                <div className="relative">
                  <Icon icon="ph:wrench-fill" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width={16} />
                  <select name="serviceType" id="serviceType" value={form.serviceType} onChange={set} required
                    className={`${inputCls} appearance-none cursor-pointer`}>
                    {SERVICE_OPTIONS.map(o => (
                      <option key={o.value} value={o.value} disabled={o.value === ''}>{o.label}</option>
                    ))}
                  </select>
                  <Icon icon="ph:caret-down-bold" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" width={12} />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wide">
                  Brand Name <span className="text-gray-400 normal-case font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <Icon icon="ph:tag-fill" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width={16} />
                  <input name="brandName" value={form.brandName} onChange={set} placeholder="Brand Name" className={inputCls} />
                </div>
              </div>

              <div className="sm:col-span-2 flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wide">Problem / Service Details</label>
                <div className="relative">
                  <Icon icon="ph:note-fill" className="absolute left-3 top-3.5 text-gray-400" width={16} />
                  <textarea name="problemDetails" value={form.problemDetails} onChange={set} rows={3}
                    placeholder="Describe your issue or requirement…"
                    className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-800 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all resize-none" />
                </div>
              </div>

              <div className="sm:col-span-2 flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wide">Address</label>
                <div className="relative">
                  <Icon icon="ph:map-pin-fill" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width={16} />
                  <input name="address" value={form.address} onChange={set} required placeholder="Street / Area / Landmark" className={inputCls} />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wide">City</label>
                <div className="relative">
                  <Icon icon="ph:buildings-fill" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width={16} />
                  <input name="city" value={form.city} onChange={set} required placeholder="City" className={inputCls} />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wide">Pincode</label>
                <div className="relative">
                  <Icon icon="ph:map-trifold-fill" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width={16} />
                  <input name="pincode" value={form.pincode} onChange={set} required placeholder="PIN Code" maxLength={6} className={inputCls} />
                </div>
              </div>

              <div className="sm:col-span-2 flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wide">Preferred Service Date</label>
                <div className="relative">
                  <Icon icon="ph:calendar-fill" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width={16} />
                  <input name="preferredDate" type="date" value={form.preferredDate} onChange={set}
                    min={new Date().toISOString().split('T')[0]} className={inputCls} />
                </div>
              </div>

            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <button type="submit" disabled={loading}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-primary text-white px-6 py-3.5 rounded-full font-bold hover:bg-dark transition-colors shadow-md text-sm disabled:opacity-60 disabled:cursor-not-allowed">
                {loading
                  ? <><Icon icon="ph:circle-notch-bold" className="animate-spin" width={17} /> Submitting…</>
                  : <><Icon icon="ph:paper-plane-tilt-fill" width={17} /> Submit Service Request</>}
              </button>
              <a href="tel:+918019179159"
                className="flex-1 inline-flex items-center justify-center gap-2 border-2 border-primary text-primary px-6 py-3.5 rounded-full font-bold hover:bg-primary hover:text-white transition-colors text-sm">
                <Icon icon="ph:phone-fill" width={17} /> Call Now for Emergency Service
              </a>
            </div>
          </form>
        )}
      </div>
    </div>
  );
});

BookAServiceForm.displayName = 'BookAServiceForm';
export default BookAServiceForm;