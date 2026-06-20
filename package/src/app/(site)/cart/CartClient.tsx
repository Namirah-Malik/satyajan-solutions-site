'use client';

import { useCart } from '@/context/CartContext';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import PhonePeButton from '@/components/PhonePeButton';

const WHATSAPP_NUMBER     = '918019179159';
const COD_DISCOUNT_PCT    = 2.5;
const ONLINE_DISCOUNT_PCT = 5;

function inr(n: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', maximumFractionDigits: 0,
  }).format(n);
}

const EMI_PLANS = [
  { months: 3,  label: '3 months',  rate: 0,  tag: 'No Cost' },
  { months: 6,  label: '6 months',  rate: 0,  tag: 'No Cost' },
  { months: 9,  label: '9 months',  rate: 12, tag: '' },
  { months: 12, label: '12 months', rate: 12, tag: 'Popular' },
  { months: 18, label: '18 months', rate: 14, tag: '' },
  { months: 24, label: '24 months', rate: 15, tag: '' },
];

function calcIndicativeEmi(principal: number, annualRate: number, months: number): number {
  if (annualRate === 0) return Math.round(principal / months);
  const r = annualRate / 12 / 100;
  return Math.round((principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1));
}

type PaymentTab = 'online' | 'emi' | 'cod';

interface FieldErrors {
  name: string; phone: string; email: string; address: string; pincode: string;
}

interface PincodeData {
  state: string;
  city: string;
  district: string;
  loaded: boolean;
  manual: boolean;
}

const INDIAN_STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh',
  'Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka',
  'Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram',
  'Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu',
  'Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal',
  'Andaman & Nicobar Islands','Chandigarh','Dadra & Nagar Haveli',
  'Daman & Diu','Delhi','Jammu & Kashmir','Ladakh','Lakshadweep','Puducherry',
];

const TRUST_ITEMS = [
  { icon: 'ph:receipt-fill',      label: 'GST Included',         iconClass: 'text-emerald-600', bgClass: 'bg-emerald-50',  borderClass: 'border-emerald-200' },
  { icon: 'ph:wrench-fill',       label: 'Installation Support', iconClass: 'text-blue-600',    bgClass: 'bg-blue-50',     borderClass: 'border-blue-200'    },
  { icon: 'ph:shield-check-fill', label: 'Paperless Warranty',   iconClass: 'text-purple-600',  bgClass: 'bg-purple-50',   borderClass: 'border-purple-200'  },
  { icon: 'ph:truck-fill',        label: '2–5 Days Delivery',    iconClass: 'text-orange-500',  bgClass: 'bg-orange-50',   borderClass: 'border-orange-200'  },
];

function TrustBadges() {
  return (
    <div className="grid grid-cols-2 gap-2">
      {TRUST_ITEMS.map((b) => (
        <div key={b.label} className={`flex items-center gap-2 px-2.5 py-2 rounded-xl border ${b.bgClass} ${b.borderClass}`}>
          <Icon icon={b.icon} className={`${b.iconClass} flex-shrink-0`} width={14} />
          <span className="text-[11px] font-semibold text-gray-700 leading-tight">{b.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function CartClient() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const isBuyNow     = searchParams.get('mode') === 'buynow';

  const { cartItems, updateQuantity, removeFromCart, getSubtotal, getTotalSavings } = useCart();
  const [buyNowItem, setBuyNowItem] = useState<any>(null);

  useEffect(() => {
    if (isBuyNow) {
      try {
        const stored = sessionStorage.getItem('buyNowItem');
        if (stored) setBuyNowItem(JSON.parse(stored));
      } catch {}
    }
  }, [isBuyNow]);

  const activeItems = isBuyNow && buyNowItem
    ? [{ ...buyNowItem, originalPrice: buyNowItem.price }]
    : cartItems;

  const [couponCode,      setCouponCode]      = useState('');
  const [appliedCoupon,   setAppliedCoupon]   = useState<string | null>(null);
  const [couponDiscount,  setCouponDiscount]  = useState(0);
  const [customerName,    setCustomerName]    = useState('');
  const [customerPhone,   setCustomerPhone]   = useState('');
  const [customerEmail,   setCustomerEmail]   = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerPincode, setCustomerPincode] = useState('');
  const [pincodeData,     setPincodeData]     = useState<PincodeData | null>(null);
  const [pincodeLoading,  setPincodeLoading]  = useState(false);
  const [pincodeError,    setPincodeError]    = useState('');
  const [showManualState, setShowManualState] = useState(false);
  const [manualState,     setManualState]     = useState('');
  const [paymentTab,      setPaymentTab]      = useState<PaymentTab>('online');
  const [selectedEmi,     setSelectedEmi]     = useState(EMI_PLANS[1]);
  const [errors,          setErrors]          = useState<FieldErrors>({ name: '', phone: '', email: '', address: '', pincode: '' });
  const [touched,         setTouched]         = useState({ name: false, phone: false, email: false, address: false, pincode: false });

  const effectiveState      = pincodeData?.state || manualState || '';
  const isOutsideTelangana  = effectiveState && effectiveState.toLowerCase() !== 'telangana';

  const fetchPincode = useCallback(async (pin: string) => {
    if (pin.length !== 6) {
      setPincodeData(null); setPincodeError('');
      setShowManualState(false); setManualState('');
      return;
    }
    setPincodeLoading(true); setPincodeError(''); setShowManualState(false);
    try {
      const res = await fetch(`/api/pincode?pin=${pin}`);
      if (res.ok) {
        const data = await res.json();
        if (data?.state) {
          setPincodeData({ state: data.state, city: data.city || '', district: data.district || '', loaded: true, manual: false });
          setPincodeError(''); setShowManualState(false); setManualState('');
          setPincodeLoading(false);
          return;
        }
      }
    } catch {}
    setPincodeData(null); setPincodeError('');
    setShowManualState(true); setPincodeLoading(false);
  }, []);

  useEffect(() => {
    if (customerPincode.length === 6) fetchPincode(customerPincode);
    else { setPincodeData(null); setPincodeError(''); setShowManualState(false); setManualState(''); }
  }, [customerPincode, fetchPincode]);

  useEffect(() => {
    if (manualState) {
      setPincodeData({ state: manualState, city: '', district: '', loaded: true, manual: true });
    }
  }, [manualState]);

  // ── Totals ────────────────────────────────────────────────────────────────
  const subtotal        = isBuyNow && buyNowItem ? buyNowItem.price * (buyNowItem.quantity || 1) : getSubtotal();
  const totalSavings    = isBuyNow ? 0 : getTotalSavings();
  const mrpTotal        = activeItems.reduce((t, i) => t + (i.originalPrice || i.price) * i.quantity, 0);
  const productDiscount = mrpTotal - subtotal;
  const couponAmt       = couponDiscount;
  const baseTotal       = subtotal - couponAmt;

  const onlineDiscountAmt = Math.round((baseTotal * ONLINE_DISCOUNT_PCT) / 100);
  const totalOnline       = baseTotal - onlineDiscountAmt;
  // ✅ EMI: full amount goes to PhonePe — EMI is set up ON PhonePe's page, not here
  const totalEmi          = baseTotal;
  const emiMonthly        = calcIndicativeEmi(totalEmi, selectedEmi.rate, selectedEmi.months);
  const codDiscountAmt    = Math.round((baseTotal * COD_DISCOUNT_PCT) / 100);
  const totalCod          = baseTotal - codDiscountAmt;

  const totalAmount =
    paymentTab === 'online' ? totalOnline :
    paymentTab === 'emi'    ? totalEmi    : totalCod;

  // ── Coupon ────────────────────────────────────────────────────────────────
  const handleApplyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if      (code === 'SAVE10')   { setAppliedCoupon(code); setCouponDiscount(subtotal * 0.1); }
    else if (code === 'FIRST100') { setAppliedCoupon(code); setCouponDiscount(100); }
    else alert('Invalid coupon. Try: SAVE10 or FIRST100');
  };
  const handleRemoveCoupon = () => { setAppliedCoupon(null); setCouponDiscount(0); setCouponCode(''); };
  const handleQtyChange    = (id: string, qty: number) => {
    if (qty < 1) removeFromCart(id); else updateQuantity(id, qty);
    if (appliedCoupon) handleRemoveCoupon();
  };

  // ── Validation ────────────────────────────────────────────────────────────
  const validateField = (field: keyof FieldErrors, value: string): string => {
    switch (field) {
      case 'name':    return (!value.trim() || value.trim().length < 2) ? 'Full name is required' : '';
      case 'phone':   { const d = value.replace(/\D/g, ''); return (!d || d.length !== 10 || !/^[6-9]/.test(d)) ? 'Enter a valid 10-digit mobile number' : ''; }
      case 'email':   return (!value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) ? 'Enter a valid email address' : '';
      case 'address': return (!value.trim() || value.trim().length < 10) ? 'Enter your full delivery address (min 10 characters)' : '';
      case 'pincode': {
        if (!value.trim() || value.replace(/\D/g,'').length !== 6) return 'Enter a valid 6-digit pincode';
        if (showManualState && !manualState) return 'Please select your state below';
        return '';
      }
      default: return '';
    }
  };

  const handleBlur = (field: keyof FieldErrors, value: string) => {
    setTouched(p => ({ ...p, [field]: true }));
    setErrors(p =>  ({ ...p, [field]: validateField(field, value) }));
  };

  const validateForm = (): boolean => {
    const newErrors: FieldErrors = {
      name:    validateField('name',    customerName),
      phone:   validateField('phone',   customerPhone),
      email:   validateField('email',   customerEmail),
      address: validateField('address', customerAddress),
      pincode: validateField('pincode', customerPincode),
    };
    setErrors(newErrors);
    setTouched({ name: true, phone: true, email: true, address: true, pincode: true });
    if (Object.values(newErrors).some(Boolean)) {
      setTimeout(() => document.getElementById('customer-name')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50);
      return false;
    }
    const cityPart    = pincodeData?.city ? `, ${pincodeData.city}` : '';
    const fullAddress = `${customerAddress}${cityPart}, ${effectiveState} - ${customerPincode}`;
    try {
      sessionStorage.setItem('pendingOrder', JSON.stringify({
        customerName,
        customerPhone: `+91${customerPhone}`,
        customerEmail,
        customerAddress: fullAddress,
        amount: paymentTab === 'online' ? totalOnline : totalEmi,
        discount: paymentTab === 'online' ? onlineDiscountAmt : 0,
        items: activeItems.map(i => ({ name: i.name, SKU: i.SKU || '', price: i.price, quantity: i.quantity, image: i.image || '' })),
      }));
    } catch {}
    return true;
  };

  // ── COD / WhatsApp checkout ───────────────────────────────────────────────
  const handleCodCheckout = async () => {
    if (!validateForm()) return;

    const cityPart    = pincodeData?.city ? `, ${pincodeData.city}` : '';
    const fullAddress = `${customerAddress}${cityPart}, ${effectiveState} - ${customerPincode}`;

    const itemLines = activeItems
      .map((item, i) => `${i + 1}. *${item.name}*\n   SKU: ${item.SKU}\n   Qty: ${item.quantity} × ${inr(item.price)} = ${inr(item.price * item.quantity)}`)
      .join('\n\n');

    const message = [
      isBuyNow ? '⚡ *Buy Now Order — Satyajan Energy Solutions*' : '🛒 *New Order — Satyajan Energy Solutions*',
      '━━━━━━━━━━━━━━━━━━━━━━━',
      itemLines,
      '━━━━━━━━━━━━━━━━━━━━━━━',
      `   MRP Total: ${inr(mrpTotal)}`,
      productDiscount > 0 ? `   Product Discount: -${inr(productDiscount)}` : '',
      couponAmt > 0       ? `   Coupon (${appliedCoupon}): -${inr(couponAmt)}` : '',
      `   COD Discount (${COD_DISCOUNT_PCT}%): -${inr(codDiscountAmt)}`,
      `   Delivery: ${isOutsideTelangana ? 'Actual logistics charges applicable' : 'FREE'}`,
      `   *Total (Cash on Delivery): ${inr(totalCod)}*`,
      '━━━━━━━━━━━━━━━━━━━━━━━',
      `👤 ${customerName}`,
      `📞 +91${customerPhone}`,
      `📧 ${customerEmail}`,
      `📍 ${fullAddress}`,
      isOutsideTelangana ? `\n⚠️ *Note: Outside Telangana — logistics charges will be communicated separately.*` : '',
      '\n🙏 Please confirm availability & delivery. Thank you!',
    ].filter(Boolean).join('\n');

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');

    try {
      await fetch('/api/orders/notify', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: `SAT-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
          method: 'cod', status: 'COD_PLACED',
          customerName,
          customerPhone: `+91${customerPhone}`,
          customerEmail,
          customerAddress: fullAddress,
          amount: totalCod,
          items: activeItems.map(i => ({ name: i.name, SKU: i.SKU || '', price: i.price, quantity: i.quantity })),
        }),
      });
    } catch {}

    const orderId = `SAT-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    router.push(`/payment/status?orderId=${orderId}&method=cod&amount=${totalCod}`);
  };

  // ── Empty state ───────────────────────────────────────────────────────────
  const isEmpty = isBuyNow ? !buyNowItem : cartItems.length === 0;
  if (isEmpty) {
    return (
      <section className="!pt-44 pb-20 bg-white min-h-screen">
        <div className="container mx-auto max-w-8xl px-5 text-center py-20">
          <Icon icon="solar:cart-large-4-outline" width={120} className="mx-auto text-gray-300 mb-6" />
          <h1 className="text-3xl font-bold text-dark mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-8">Add some products to continue shopping.</p>
          <Link href="/products" className="inline-block py-3 px-8 bg-primary text-white rounded-full hover:bg-dark font-semibold shadow-md transition-colors">
            Continue Shopping
          </Link>
        </div>
      </section>
    );
  }

  const itemCount = activeItems.reduce((s, i) => s + i.quantity, 0);

  return (
    <section className="!pt-44 pb-20 bg-white min-h-screen">
      <div className="container mx-auto max-w-8xl px-5 2xl:px-0">

        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-dark">{isBuyNow ? '⚡ Buy Now' : 'Shopping Cart'}</h1>
          {isBuyNow && <span className="text-xs font-bold bg-primary/10 text-primary px-3 py-1 rounded-full border border-primary/20">Express Checkout</span>}
        </div>
        <div className="flex items-center justify-between mb-8">
          <p className="text-gray-600">{itemCount} item{itemCount !== 1 ? 's' : ''}{isBuyNow ? ' — direct checkout' : ' in your cart'}</p>
          {isBuyNow && (
            <Link href="/cart" className="text-xs text-primary font-semibold hover:underline flex items-center gap-1">
              <Icon icon="solar:cart-large-4-bold" width={14} /> View full cart instead
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── LEFT: Cart Items ── */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              {isBuyNow && (
                <div className="mb-5 p-3 bg-primary/5 border border-primary/20 rounded-xl flex items-center gap-2">
                  <Icon icon="solar:bolt-bold" width={16} className="text-primary flex-shrink-0" />
                  <p className="text-xs text-primary font-semibold">Express checkout — only this item will be ordered. Your cart remains unchanged.</p>
                </div>
              )}

              {activeItems.map((item) => (
                <div key={item.id} className="flex flex-col sm:flex-row gap-4 pb-6 mb-6 border-b border-gray-100 last:border-b-0 last:pb-0 last:mb-0">
                  <Link href={`/products/${item.id}`}
                    className="w-full sm:w-32 h-32 flex-shrink-0 rounded-xl overflow-hidden border border-gray-100 bg-gray-50 hover:opacity-90 transition-opacity block">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.image || '/images/fallback.jpg'} alt={item.name}
                      className="w-full h-full object-contain p-2"
                      onError={(e) => { (e.target as HTMLImageElement).src = '/images/fallback.jpg'; }} />
                  </Link>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-dark mb-0.5">{item.name}</h3>
                    <p className="text-xs text-gray-400 mb-3">SKU: {item.SKU}</p>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-lg font-bold text-primary">₹{Number(item.price).toLocaleString('en-IN')}</span>
                      {item.originalPrice && item.originalPrice > item.price && (
                        <span className="text-sm text-gray-400 line-through">₹{Number(item.originalPrice).toLocaleString('en-IN')}</span>
                      )}
                    </div>
                    {!isBuyNow && (
                      <div className="flex items-center gap-4 mt-4">
                        <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden">
                          <button onClick={() => handleQtyChange(item.id, item.quantity - 1)} className="px-3 py-2 hover:bg-gray-100 transition-colors"><Icon icon="mdi:minus" width={18} /></button>
                          <span className="px-4 py-2 min-w-[48px] text-center font-semibold text-sm">{item.quantity}</span>
                          <button onClick={() => handleQtyChange(item.id, item.quantity + 1)} className="px-3 py-2 hover:bg-gray-100 transition-colors"><Icon icon="mdi:plus" width={18} /></button>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center gap-1 transition-colors">
                          <Icon icon="mdi:delete-outline" width={16} /> Remove
                        </button>
                      </div>
                    )}
                    {isBuyNow && <p className="mt-3 text-xs text-gray-400 flex items-center gap-1"><Icon icon="ph:info-fill" width={12} /> Qty: 1 (Buy Now — single item checkout)</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: Order Summary ── */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 sticky top-24 space-y-5">
              <h2 className="text-xl font-bold text-dark">Order Summary</h2>

              <TrustBadges />

              {/* Payment Method Tabs */}
              <div>
                <p className="text-sm font-bold text-gray-800 mb-2">How would you like to pay?</p>
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-gray-100 rounded-2xl">
                  <button onClick={() => setPaymentTab('online')}
                    className={`relative py-3 px-1 rounded-xl text-[11px] font-bold transition-all duration-200 flex flex-col items-center gap-0.5 ${paymentTab === 'online' ? 'bg-[#5f259f] text-white shadow-md' : 'text-gray-600 hover:text-gray-900'}`}>
                    <Icon icon="ph:credit-card-fill" width={15} />
                    Pay Now
                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full mt-0.5 ${paymentTab === 'online' ? 'bg-yellow-400 text-gray-900' : 'bg-green-500 text-white'}`}>
                      {ONLINE_DISCOUNT_PCT}% OFF
                    </span>
                  </button>
                  <button onClick={() => setPaymentTab('emi')}
                    className={`relative py-3 px-1 rounded-xl text-[11px] font-bold transition-all duration-200 flex flex-col items-center gap-0.5 ${paymentTab === 'emi' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:text-gray-900'}`}>
                    <Icon icon="ph:calendar-check-fill" width={15} />
                    EMI
                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full mt-0.5 ${paymentTab === 'emi' ? 'bg-green-400 text-gray-900' : 'bg-blue-500 text-white'}`}>
                      Approved ✓
                    </span>
                  </button>
                  <button onClick={() => setPaymentTab('cod')}
                    className={`relative py-3 px-1 rounded-xl text-[11px] font-bold transition-all duration-200 flex flex-col items-center gap-0.5 ${paymentTab === 'cod' ? 'bg-[#25D366] text-white shadow-md' : 'text-gray-600 hover:text-gray-900'}`}>
                    <Icon icon="mdi:cash" width={15} />
                    COD
                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full mt-0.5 ${paymentTab === 'cod' ? 'bg-yellow-400 text-gray-900' : 'bg-green-500 text-white'}`}>
                      {COD_DISCOUNT_PCT}% OFF
                    </span>
                  </button>
                </div>

                {paymentTab === 'online' && (
                  <div className="mt-2.5 rounded-xl p-3 flex items-start gap-2 bg-purple-50 border border-purple-100">
                    <Icon icon="ph:lightning-fill" width={15} className="text-purple-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-purple-700">{ONLINE_DISCOUNT_PCT}% Instant Discount — Best Price</p>
                      <p className="text-[11px] text-purple-500">Pay full amount via UPI, debit/credit card or net banking. Discount applied instantly.</p>
                    </div>
                  </div>
                )}

                {/* ✅ FIXED: Clear EMI explanation — full amount goes to PhonePe, EMI set up there */}
                {paymentTab === 'emi' && (
                  <div className="mt-2.5 rounded-xl p-3 flex items-start gap-2 bg-blue-50 border border-blue-200">
                    <Icon icon="ph:check-circle-fill" width={15} className="text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-blue-700">EMI — Pay in Easy Monthly Instalments</p>
                      <p className="text-[11px] text-blue-600 leading-relaxed mt-0.5">
                        You will be redirected to PhonePe to complete the full payment of{' '}
                        <strong>{inr(totalEmi)}</strong>. On the PhonePe screen, select{' '}
                        <strong>"Pay via EMI"</strong> and choose your bank or Bajaj Finserv to split into{' '}
                        <strong>{inr(emiMonthly)}/month</strong> × {selectedEmi.months} months.
                      </p>
                    </div>
                  </div>
                )}

                {paymentTab === 'cod' && (
                  <div className="mt-2.5 rounded-xl p-3 flex items-start gap-2 bg-green-50 border border-green-100">
                    <Icon icon="ph:truck-fill" width={15} className="text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-green-700">{COD_DISCOUNT_PCT}% COD Discount — Pay at Doorstep</p>
                      <p className="text-[11px] text-green-500">Order via WhatsApp. Pay cash when product is delivered to your address.</p>
                    </div>
                  </div>
                )}
              </div>

              {/* EMI Plan Selector */}
              {paymentTab === 'emi' && (
                <div className="border border-blue-100 rounded-2xl p-4 bg-blue-50/40">
                  <p className="text-xs font-bold text-gray-700 mb-3">Select EMI Duration</p>
                  <div className="grid grid-cols-2 gap-2">
                    {EMI_PLANS.map((plan) => {
                      const monthly    = calcIndicativeEmi(totalEmi, plan.rate, plan.months);
                      const isSelected = selectedEmi.months === plan.months;
                      return (
                        <button key={plan.months} onClick={() => setSelectedEmi(plan)}
                          className={`relative rounded-xl p-2.5 text-left border-2 transition-all ${isSelected ? 'border-blue-500 bg-blue-600 text-white' : 'border-gray-200 bg-white hover:border-blue-300'}`}>
                          {plan.tag && (
                            <span className={`absolute -top-2 -right-1 text-[9px] font-black px-1.5 py-0.5 rounded-full ${plan.tag === 'No Cost' ? 'bg-green-500 text-white' : 'bg-orange-400 text-white'}`}>
                              {plan.tag}
                            </span>
                          )}
                          <p className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-gray-800'}`}>{plan.label}</p>
                          <p className={`text-base font-black ${isSelected ? 'text-yellow-300' : 'text-blue-600'}`}>
                            {inr(monthly)}<span className={`text-[10px] font-normal ${isSelected ? 'text-blue-100' : 'text-gray-400'}`}>/mo</span>
                          </p>
                          <p className={`text-[10px] ${isSelected ? 'text-blue-100' : 'text-gray-400'}`}>{plan.rate === 0 ? 'Zero interest' : `${plan.rate}% p.a.`}</p>
                        </button>
                      );
                    })}
                  </div>

                  {/* ✅ NEW: Clear "how PhonePe EMI works" callout */}
                  <div className="mt-3 p-3 bg-white border border-blue-200 rounded-xl space-y-2">
                    <p className="text-[11px] font-bold text-gray-800 flex items-center gap-1.5">
                      <Icon icon="ph:info-fill" width={13} className="text-blue-500" />
                      How EMI works on PhonePe
                    </p>
                    <div className="space-y-1.5">
                      {[
                        { step: '1', text: `Click "Pay ${inr(totalEmi)} via EMI" below` },
                        { step: '2', text: 'On PhonePe screen, tap "Pay via EMI"' },
                        { step: '3', text: `Select your bank or Bajaj Finserv / HDFC cardless EMI` },
                        { step: '4', text: `Your bank splits it into ${inr(emiMonthly)}/month × ${selectedEmi.months} months` },
                      ].map(s => (
                        <div key={s.step} className="flex items-start gap-2">
                          <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[9px] font-black flex items-center justify-center flex-shrink-0 mt-0.5">{s.step}</span>
                          <p className="text-[11px] text-gray-600 leading-snug">{s.text}</p>
                        </div>
                      ))}
                    </div>
                    <p className="text-[10px] text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-1.5 leading-relaxed">
                      ⚠️ PhonePe collects the full amount ({inr(totalEmi)}) and converts it to EMI. The EMI shown above is indicative — your bank confirms the final amount.
                    </p>
                  </div>
                </div>
              )}

              {/* Price Breakdown */}
              <div className="space-y-2 text-sm border-t border-gray-100 pt-4">
                <div className="flex justify-between">
                  <span className="text-gray-500">MRP Total</span>
                  <span className="font-medium">₹{mrpTotal.toLocaleString('en-IN')}</span>
                </div>
                {productDiscount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Product Discount</span>
                    <span className="text-green-600 font-medium">− ₹{productDiscount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                {couponAmt > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Coupon ({appliedCoupon})</span>
                    <span className="text-green-600 font-medium">− ₹{couponAmt.toLocaleString('en-IN')}</span>
                  </div>
                )}
                {paymentTab === 'online' && (
                  <div className="flex justify-between">
                    <span className="text-purple-600 font-semibold">Online Discount ({ONLINE_DISCOUNT_PCT}%)</span>
                    <span className="text-purple-600 font-semibold">− ₹{onlineDiscountAmt.toLocaleString('en-IN')}</span>
                  </div>
                )}
                {/* ✅ FIXED: EMI row shows full amount + indicative monthly, not just monthly */}
                {paymentTab === 'emi' && (
                  <div className="flex justify-between">
                    <span className="text-blue-600 font-semibold">EMI Plan ({selectedEmi.months} months)</span>
                    <span className="text-blue-600 font-semibold">≈ {inr(emiMonthly)}/mo</span>
                  </div>
                )}
                {paymentTab === 'cod' && (
                  <div className="flex justify-between">
                    <span className="text-green-600 font-semibold">COD Discount ({COD_DISCOUNT_PCT}%)</span>
                    <span className="text-green-600 font-semibold">− ₹{codDiscountAmt.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">Delivery</span>
                  <span className={isOutsideTelangana ? 'text-amber-600 font-semibold' : 'text-green-600 font-medium'}>
                    {isOutsideTelangana ? 'Charges apply' : effectiveState ? 'FREE 🎉' : 'FREE'}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  {/* ✅ FIXED: Show correct label — for EMI it's "Total to pay on PhonePe" */}
                  <div className="flex justify-between text-base font-black">
                    <span className="text-gray-900">
                      {paymentTab === 'emi' ? 'Total to pay on PhonePe' : 'Total Payable'}
                    </span>
                    <span className="text-primary">₹{totalAmount.toLocaleString('en-IN')}</span>
                  </div>
                  {paymentTab === 'emi' && (
                    <p className="text-[11px] text-blue-500 text-right mt-1">
                      Then select EMI on PhonePe → {inr(emiMonthly)}/mo × {selectedEmi.months} months
                    </p>
                  )}
                </div>
                {paymentTab !== 'emi' && (totalSavings + couponAmt + (paymentTab === 'online' ? onlineDiscountAmt : codDiscountAmt)) > 0 && (
                  <div className="bg-green-50 rounded-xl px-3 py-2">
                    <p className="text-xs font-bold text-green-700">
                      🎉 Total Savings: ₹{(totalSavings + couponAmt + (paymentTab === 'online' ? onlineDiscountAmt : codDiscountAmt)).toLocaleString('en-IN')}
                    </p>
                  </div>
                )}
              </div>

              {/* ── Customer Details ── */}
              <div className="border-t border-gray-100 pt-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-gray-900">Delivery Details</h3>
                  <span className="text-[11px] text-red-500 font-semibold bg-red-50 px-2 py-0.5 rounded-full">All fields required</span>
                </div>

                {/* Name */}
                <div>
                  <label htmlFor="customer-name" className="block text-xs font-semibold text-gray-700 mb-1">Full Name <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Icon icon="ph:user-fill" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width={13} />
                    <input id="customer-name" type="text" value={customerName}
                      onChange={(e) => { setCustomerName(e.target.value); if (touched.name) setErrors(p => ({ ...p, name: validateField('name', e.target.value) })); }}
                      onBlur={(e) => handleBlur('name', e.target.value)}
                      placeholder="Your full name"
                      className={`w-full pl-8 pr-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors ${errors.name ? 'border-red-400 bg-red-50' : 'border-gray-300'}`} />
                  </div>
                  {errors.name && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><Icon icon="ph:warning-circle-fill" width={11} />{errors.name}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Mobile Number <span className="text-red-500">*</span></label>
                  <div className={`flex items-center border rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-primary/30 transition-colors ${errors.phone ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}>
                    <span className="pl-3 pr-2 text-gray-500 text-xs font-semibold whitespace-nowrap">+91</span>
                    <div className="w-px h-4 bg-gray-200" />
                    <input type="tel" value={customerPhone}
                      onChange={(e) => { const v = e.target.value.replace(/\D/g, '').slice(0, 10); setCustomerPhone(v); if (touched.phone) setErrors(p => ({ ...p, phone: validateField('phone', v) })); }}
                      onBlur={(e) => handleBlur('phone', e.target.value)}
                      placeholder="10-digit mobile number" maxLength={10} inputMode="numeric"
                      className="flex-1 px-3 py-2.5 bg-transparent focus:outline-none text-sm" />
                  </div>
                  {errors.phone && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><Icon icon="ph:warning-circle-fill" width={11} />{errors.phone}</p>}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="customer-email" className="block text-xs font-semibold text-gray-700 mb-1">
                    Email Address <span className="text-red-500">*</span>
                    <span className="text-gray-400 font-normal ml-1">(order confirmation)</span>
                  </label>
                  <div className="relative">
                    <Icon icon="ph:envelope-fill" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width={13} />
                    <input id="customer-email" type="email" value={customerEmail}
                      onChange={(e) => { setCustomerEmail(e.target.value); if (touched.email) setErrors(p => ({ ...p, email: validateField('email', e.target.value) })); }}
                      onBlur={(e) => handleBlur('email', e.target.value)}
                      placeholder="you@example.com"
                      className={`w-full pl-8 pr-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors ${errors.email ? 'border-red-400 bg-red-50' : 'border-gray-300'}`} />
                  </div>
                  {errors.email && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><Icon icon="ph:warning-circle-fill" width={11} />{errors.email}</p>}
                </div>

                {/* Pincode */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Pincode <span className="text-red-500">*</span>
                    <span className="text-gray-400 font-normal ml-1">(auto-detects state)</span>
                  </label>
                  <div className="relative">
                    <Icon icon="ph:map-pin-fill" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width={13} />
                    <input
                      type="text" inputMode="numeric" maxLength={6}
                      value={customerPincode}
                      onChange={(e) => {
                        const v = e.target.value.replace(/\D/g, '').slice(0, 6);
                        setCustomerPincode(v);
                        if (touched.pincode) setErrors(p => ({ ...p, pincode: validateField('pincode', v) }));
                      }}
                      onBlur={(e) => handleBlur('pincode', e.target.value)}
                      placeholder="e.g. 500007"
                      className={`w-full pl-8 pr-10 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors
                        ${errors.pincode ? 'border-red-400 bg-red-50'
                          : pincodeData?.loaded ? 'border-green-400 bg-green-50/30'
                          : 'border-gray-300'}`}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {pincodeLoading && <Icon icon="svg-spinners:3-dots-fade" className="text-gray-400" width={16} />}
                      {!pincodeLoading && pincodeData?.loaded && <Icon icon="ph:check-circle-fill" className="text-green-500" width={16} />}
                    </div>
                  </div>
                  {errors.pincode && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><Icon icon="ph:warning-circle-fill" width={11} />{errors.pincode}</p>}

                  {pincodeData?.loaded && !pincodeData.manual && (
                    <div className={`mt-2 p-3 rounded-xl border flex items-start gap-2 ${isOutsideTelangana ? 'bg-amber-50 border-amber-200' : 'bg-green-50 border-green-200'}`}>
                      <Icon
                        icon={isOutsideTelangana ? 'ph:warning-fill' : 'ph:check-circle-fill'}
                        className={isOutsideTelangana ? 'text-amber-500 flex-shrink-0 mt-0.5' : 'text-green-500 flex-shrink-0 mt-0.5'}
                        width={14}
                      />
                      <div>
                        <p className={`text-[11px] font-bold mb-1 ${isOutsideTelangana ? 'text-amber-800' : 'text-green-800'}`}>
                          📍 {[pincodeData.city, pincodeData.state].filter(Boolean).join(', ')}
                        </p>
                        {!isOutsideTelangana && <p className="text-[11px] text-green-700">✅ Free delivery to your location.</p>}
                        {isOutsideTelangana && (
                          <p className="text-[11px] text-amber-800 leading-relaxed">
                            <strong>Delivery Information:</strong> Orders are shipped from our Hyderabad warehouse. Deliveries outside Telangana incur actual logistics charges payable by the customer.
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {showManualState && customerPincode.length === 6 && (
                    <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-xl space-y-2">
                      <p className="text-[11px] text-gray-600 font-medium flex items-center gap-1.5">
                        <Icon icon="ph:info-fill" width={12} className="text-gray-400" />
                        Could not auto-detect. Please select your state:
                      </p>
                      <div className="relative">
                        <select value={manualState} onChange={(e) => setManualState(e.target.value)}
                          className="w-full pl-3 pr-8 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 appearance-none">
                          <option value="">Select your state</option>
                          {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <Icon icon="ph:caret-down-bold" className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" width={11} />
                      </div>
                      {manualState && (
                        <div className={`p-2.5 rounded-lg border flex items-start gap-2 ${isOutsideTelangana ? 'bg-amber-50 border-amber-200' : 'bg-green-50 border-green-200'}`}>
                          <Icon
                            icon={isOutsideTelangana ? 'ph:warning-fill' : 'ph:check-circle-fill'}
                            className={isOutsideTelangana ? 'text-amber-500 flex-shrink-0 mt-0.5' : 'text-green-500 flex-shrink-0 mt-0.5'}
                            width={13}
                          />
                          <div>
                            {!isOutsideTelangana && <p className="text-[11px] text-green-700 font-medium">✅ Free delivery to {manualState}.</p>}
                            {isOutsideTelangana && (
                              <p className="text-[11px] text-amber-800 leading-relaxed">
                                <strong>Delivery Information:</strong> Deliveries outside Telangana incur actual logistics charges payable by the customer.
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Address */}
                <div>
                  <label htmlFor="customer-address" className="block text-xs font-semibold text-gray-700 mb-1">Delivery Address <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Icon icon="ph:house-fill" className="absolute left-3 top-3 text-gray-400" width={13} />
                    <textarea id="customer-address" value={customerAddress} rows={3}
                      onChange={(e) => { setCustomerAddress(e.target.value); if (touched.address) setErrors(p => ({ ...p, address: validateField('address', e.target.value) })); }}
                      onBlur={(e) => handleBlur('address', e.target.value)}
                      placeholder="House/Flat No., Street, Area, City"
                      className={`w-full pl-8 pr-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors resize-none ${errors.address ? 'border-red-400 bg-red-50' : 'border-gray-300'}`} />
                  </div>
                  {errors.address && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><Icon icon="ph:warning-circle-fill" width={11} />{errors.address}</p>}
                </div>

                {/* Completion indicator */}
                {(() => {
                  const filled    = [customerName, customerPhone, customerEmail, customerAddress].filter(v => v.trim().length > 2).length;
                  const pincodeOk = customerPincode.length === 6 && pincodeData?.loaded && !pincodeError;
                  const total     = filled + (pincodeOk ? 1 : 0);
                  return total < 5 ? (
                    <div className="flex items-center gap-2 p-2.5 bg-amber-50 border border-amber-200 rounded-xl">
                      <Icon icon="ph:warning-fill" width={14} className="text-amber-500 flex-shrink-0" />
                      <p className="text-xs text-amber-700 font-medium">Fill all {5 - total} remaining field{5 - total !== 1 ? 's' : ''} to proceed</p>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 p-2.5 bg-green-50 border border-green-200 rounded-xl">
                      <Icon icon="ph:check-circle-fill" width={14} className="text-green-500 flex-shrink-0" />
                      <p className="text-xs text-green-700 font-semibold">Details complete — ready to pay!</p>
                    </div>
                  );
                })()}
              </div>

              {/* ── Payment Action Buttons ── */}
              <div className="border-t border-gray-100 pt-4 space-y-3">

                {paymentTab === 'online' && (
                  <>
                    <PhonePeButton
                      amount={totalOnline}
                      customerName={customerName || undefined}
                      customerPhone={customerPhone ? `+91${customerPhone}` : undefined}
                      customerEmail={customerEmail || undefined}
                      items={activeItems.map(i => ({ name: i.name, price: i.price, quantity: i.quantity }))}
                      label={`Pay ${inr(totalOnline)} · Save ${inr(onlineDiscountAmt)}`}
                      onBeforePay={validateForm}
                    />
                    <div className="flex items-center gap-2 p-3 bg-purple-50 border border-purple-100 rounded-xl">
                      <Icon icon="ph:seal-check-fill" width={15} className="text-purple-600 flex-shrink-0" />
                      <p className="text-xs text-purple-700 font-medium">
                        <strong>{ONLINE_DISCOUNT_PCT}% instant discount</strong> applied · Secured by PhonePe
                      </p>
                    </div>
                  </>
                )}

                {/* ✅ FIXED: EMI button — shows full amount with EMI context, not just monthly */}
                {paymentTab === 'emi' && (
                  <>
                    <PhonePeButton
                      amount={totalEmi}
                      customerName={customerName || undefined}
                      customerPhone={customerPhone ? `+91${customerPhone}` : undefined}
                      customerEmail={customerEmail || undefined}
                      items={activeItems.map(i => ({ name: i.name, price: i.price, quantity: i.quantity }))}
                      label={`Pay ${inr(totalEmi)} via EMI`}
                      onBeforePay={validateForm}
                    />
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 space-y-1.5">
                      <p className="text-xs font-bold text-blue-800 flex items-center gap-1.5">
                        <Icon icon="ph:info-fill" width={13} className="text-blue-600" />
                        Full amount is charged — EMI is set up on PhonePe
                      </p>
                      <p className="text-[11px] text-blue-600 leading-relaxed">
                        After clicking above, on PhonePe's page tap <strong>"Pay via EMI"</strong> → select your bank → confirm <strong>{inr(emiMonthly)}/month × {selectedEmi.months} months</strong>.
                      </p>
                    </div>
                    <div className="grid grid-cols-3 gap-1.5">
                      {['Credit Card EMI', 'Debit Card EMI', 'Bajaj Finserv'].map(p => (
                        <div key={p} className="text-center py-1.5 px-1 bg-gray-50 border border-gray-200 rounded-lg">
                          <p className="text-[10px] text-gray-500 font-medium leading-tight">{p}</p>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {paymentTab === 'cod' && (
                  <>
                    <button onClick={handleCodCheckout}
                      className="w-full py-3.5 px-6 bg-[#25D366] hover:bg-[#1fba58] text-white rounded-full font-bold text-base flex items-center justify-center gap-2 transition-colors shadow-lg">
                      <Icon icon="mdi:whatsapp" width={22} />
                      Order via WhatsApp / COD
                    </button>
                    <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-xl">
                      <Icon icon="mdi:cash" width={15} className="text-green-600 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-green-700 font-bold">{COD_DISCOUNT_PCT}% COD Discount — Pay {inr(totalCod)}</p>
                        <p className="text-[11px] text-green-500">Cash on delivery at your doorstep</p>
                      </div>
                    </div>
                  </>
                )}

                <Link href="/products"
                  className="block w-full py-3 px-6 bg-white text-primary border-2 border-primary rounded-full hover:bg-primary hover:text-white text-base font-semibold text-center transition-colors">
                  Continue Shopping
                </Link>
                <p className="text-center text-[11px] text-gray-400 flex items-center justify-center gap-1 pt-1">
                  <Icon icon="ph:lock-fill" width={11} />
                  100% secure & encrypted
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}