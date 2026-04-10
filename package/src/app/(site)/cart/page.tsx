'use client';
// src/app/(site)/cart/page.tsx

import { useCart } from '@/context/CartContext';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CartEMISummary, { TENURES, calcEMI } from '@/components/EMI/CartEMISummary';
import PhonePeButton from '@/components/PhonePeButton';

const WHATSAPP_NUMBER     = '918019179159';
const COD_DISCOUNT_PCT    = 5;   // 5% for COD / WhatsApp
const ONLINE_DISCOUNT_PCT = 10;  // 10% for PhonePe online

function inr(n: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', maximumFractionDigits: 0,
  }).format(n);
}

export default function CartPage() {
  const router = useRouter();
  const { cartItems, updateQuantity, removeFromCart, getSubtotal, getTotalSavings, clearCart } = useCart();

  const [couponCode,    setCouponCode]    = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponDiscount,setCouponDiscount]= useState(0);
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerName,  setCustomerName]  = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [emailError,    setEmailError]    = useState('');
  const [emiSelected,   setEmiSelected]   = useState(1);
  const [paymentTab,    setPaymentTab]    = useState<'online' | 'cod'>('online');

  // ── Totals ────────────────────────────────────────────────────────────────
  const subtotal         = getSubtotal();
  const totalSavings     = getTotalSavings();
  const mrpTotal         = cartItems.reduce((t, i) => t + (i.originalPrice || i.price) * i.quantity, 0);
  const productDiscount  = mrpTotal - subtotal;
  const couponAmt        = couponDiscount;
  const baseTotal        = subtotal - couponAmt;
  const onlineDiscountAmt = Math.round((baseTotal * ONLINE_DISCOUNT_PCT) / 100);
  const codDiscountAmt    = Math.round((baseTotal * COD_DISCOUNT_PCT)    / 100);
  const totalOnline      = baseTotal - onlineDiscountAmt;
  const totalCod         = baseTotal - codDiscountAmt;
  const totalAmount      = paymentTab === 'online' ? totalOnline : totalCod;

  const selectedTenure = TENURES[emiSelected];
  const { emi, interest, total: emiTotal } = calcEMI(totalCod, selectedTenure.rate, selectedTenure.months);

  // ── Coupon ────────────────────────────────────────────────────────────────
  const handleApplyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if      (code === 'SAVE10')   { setAppliedCoupon(code); setCouponDiscount(subtotal * 0.1); }
    else if (code === 'FIRST100') { setAppliedCoupon(code); setCouponDiscount(100); }
    else alert('Invalid coupon. Try: SAVE10 or FIRST100');
  };
  const handleRemoveCoupon = () => { setAppliedCoupon(null); setCouponDiscount(0); setCouponCode(''); };
  const handleQtyChange = (id: string, qty: number) => {
    if (qty < 1) removeFromCart(id); else updateQuantity(id, qty);
    if (appliedCoupon) handleRemoveCoupon();
  };

  // ── Validation ────────────────────────────────────────────────────────────
  const validateEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  const validateForm  = (): boolean => {
    if (!customerEmail.trim()) {
      setEmailError('Email required for order updates');
      document.getElementById('customer-email')?.focus();
      return false;
    }
    if (!validateEmail(customerEmail)) {
      setEmailError('Enter a valid email address');
      document.getElementById('customer-email')?.focus();
      return false;
    }
    setEmailError('');
    return true;
  };

  // ── COD / WhatsApp checkout → payment/status page ────────────────────────
  const handleCodCheckout = () => {
    if (!validateForm()) return;

    const itemLines = cartItems
      .map((item, i) =>
        `${i + 1}. *${item.name}*\n   SKU: ${item.SKU}\n   Qty: ${item.quantity} × ${inr(item.price)} = ${inr(item.price * item.quantity)}`
      )
      .join('\n\n');

    const emiSection = selectedTenure.months > 1
      ? [
          '💳 *EMI Option:*',
          `   ${selectedTenure.months} months @ ${selectedTenure.rate === 0 ? '0% No Cost EMI' : `${selectedTenure.rate}% p.a.`}`,
          `   Interest: ${interest === 0 ? '₹0' : inr(interest)}`,
          `   *EMI: ${inr(emi)}/month*`,
        ].join('\n')
      : '';

    const message = [
      '🛒 *New Order — Satyajan Energy Solutions*',
      '━━━━━━━━━━━━━━━━━━━━━━━',
      itemLines,
      '━━━━━━━━━━━━━━━━━━━━━━━',
      `   MRP Total: ${inr(mrpTotal)}`,
      productDiscount > 0 ? `   Product Discount: -${inr(productDiscount)}` : '',
      couponAmt > 0       ? `   Coupon (${appliedCoupon}): -${inr(couponAmt)}` : '',
      `   COD Discount (${COD_DISCOUNT_PCT}%): -${inr(codDiscountAmt)}`,
      `   Delivery: FREE`,
      `   *Total (Cash on Delivery): ${inr(totalCod)}*`,
      emiSection ? '━━━━━━━━━━━━━━━━━━━━━━━' : '',
      emiSection,
      '━━━━━━━━━━━━━━━━━━━━━━━',
      customerName  ? `👤 ${customerName}` : '',
      customerPhone ? `📞 +91${customerPhone}` : '',
      `📧 ${customerEmail}`,
      '\n🙏 Please confirm availability & delivery. Thank you!',
    ].filter(Boolean).join('\n');

    // Open WhatsApp
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');

    // Generate order ID and redirect to payment/status with method=cod
    const orderId = `SAT-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    router.push(
      `/payment/status?orderId=${orderId}&method=cod&amount=${totalCod}`
    );
    // Cart is cleared inside the status page once it detects COD
  };

  // ── Empty cart ────────────────────────────────────────────────────────────
  if (cartItems.length === 0) {
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

  return (
    <section className="!pt-44 pb-20 bg-white min-h-screen">
      <div className="container mx-auto max-w-8xl px-5 2xl:px-0">
        <h1 className="text-3xl font-bold text-dark mb-2">Shopping Cart</h1>
        <p className="text-gray-600 mb-8">
          {cartItems.reduce((s, i) => s + i.quantity, 0)} item(s) in your cart
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Cart Items ─────────────────────────────────────────────── */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex flex-col sm:flex-row gap-4 pb-6 mb-6 border-b border-gray-100 last:border-b-0 last:pb-0 last:mb-0">
                  <Link href={`/products/${item.id}`}
                    className="w-full sm:w-32 h-32 flex-shrink-0 rounded-xl overflow-hidden border border-gray-100 bg-gray-50 hover:opacity-90 transition-opacity">
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
                    <div className="flex items-center gap-4 mt-4">
                      <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden">
                        <button onClick={() => handleQtyChange(item.id, item.quantity - 1)} className="px-3 py-2 hover:bg-gray-100 transition-colors">
                          <Icon icon="mdi:minus" width={18} />
                        </button>
                        <span className="px-4 py-2 min-w-[48px] text-center font-semibold text-sm">{item.quantity}</span>
                        <button onClick={() => handleQtyChange(item.id, item.quantity + 1)} className="px-3 py-2 hover:bg-gray-100 transition-colors">
                          <Icon icon="mdi:plus" width={18} />
                        </button>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center gap-1 transition-colors">
                        <Icon icon="mdi:delete-outline" width={16} /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Order Summary ─────────────────────────────────────────── */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 sticky top-24 space-y-5">
              <h2 className="text-xl font-bold text-dark">Order Summary</h2>

              {/* Coupon */}
              <div>
                <label className="block text-sm font-semibold text-dark mb-2">Coupon Code</label>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-xl">
                    <div className="flex items-center gap-2">
                      <Icon icon="mdi:check-circle" width={18} className="text-green-600" />
                      <span className="text-sm font-semibold text-green-800">{appliedCoupon} applied</span>
                    </div>
                    <button onClick={handleRemoveCoupon} className="text-red-500 text-xs hover:text-red-700 font-medium">Remove</button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input type="text" value={couponCode} onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Enter code" onKeyPress={(e) => e.key === 'Enter' && handleApplyCoupon()}
                      className="flex-1 px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                    <button onClick={handleApplyCoupon} className="px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-dark transition-colors">Apply</button>
                  </div>
                )}
              </div>

              {/* ── Payment Method Tabs ── */}
              <div>
                <p className="text-sm font-bold text-gray-800 mb-2">Payment Method</p>
                <div className="grid grid-cols-2 gap-1.5 p-1 bg-gray-100 rounded-2xl">
                  <button onClick={() => setPaymentTab('online')}
                    className={`relative py-3 rounded-xl text-xs font-bold transition-all duration-200 ${
                      paymentTab === 'online' ? 'bg-[#5f259f] text-white shadow-md' : 'text-gray-600 hover:text-gray-900'
                    }`}>
                    <Icon icon="ph:credit-card-fill" width={13} className="inline mr-1" />
                    Pay Online
                    <span className={`absolute -top-2 -right-1 text-[9px] font-black px-1.5 py-0.5 rounded-full ${
                      paymentTab === 'online' ? 'bg-yellow-400 text-gray-900' : 'bg-green-500 text-white'
                    }`}>{ONLINE_DISCOUNT_PCT}% OFF</span>
                  </button>
                  <button onClick={() => setPaymentTab('cod')}
                    className={`relative py-3 rounded-xl text-xs font-bold transition-all duration-200 ${
                      paymentTab === 'cod' ? 'bg-[#25D366] text-white shadow-md' : 'text-gray-600 hover:text-gray-900'
                    }`}>
                    <Icon icon="mdi:cash" width={13} className="inline mr-1" />
                    COD / WhatsApp
                    <span className={`absolute -top-2 -right-1 text-[9px] font-black px-1.5 py-0.5 rounded-full ${
                      paymentTab === 'cod' ? 'bg-yellow-400 text-gray-900' : 'bg-green-500 text-white'
                    }`}>{COD_DISCOUNT_PCT}% OFF</span>
                  </button>
                </div>

                {/* Discount banner */}
                <div className={`mt-2.5 rounded-xl p-3 flex items-center gap-2 ${
                  paymentTab === 'online' ? 'bg-purple-50 border border-purple-100' : 'bg-green-50 border border-green-100'
                }`}>
                  <Icon icon="ph:tag-simple-fill" width={16}
                    className={paymentTab === 'online' ? 'text-purple-600 flex-shrink-0' : 'text-green-600 flex-shrink-0'} />
                  <div>
                    <p className={`text-xs font-bold ${paymentTab === 'online' ? 'text-purple-700' : 'text-green-700'}`}>
                      {paymentTab === 'online'
                        ? `${ONLINE_DISCOUNT_PCT}% Instant Discount on Online Payment`
                        : `${COD_DISCOUNT_PCT}% Discount on COD / WhatsApp Order`}
                    </p>
                    <p className={`text-[11px] ${paymentTab === 'online' ? 'text-purple-500' : 'text-green-500'}`}>
                      You save {paymentTab === 'online' ? inr(onlineDiscountAmt) : inr(codDiscountAmt)} on this order
                    </p>
                  </div>
                </div>
              </div>

              {/* Price breakdown */}
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
                <div className="flex justify-between">
                  <span className={paymentTab === 'online' ? 'text-purple-600 font-semibold' : 'text-green-600 font-semibold'}>
                    {paymentTab === 'online' ? `Online Discount (${ONLINE_DISCOUNT_PCT}%)` : `COD Discount (${COD_DISCOUNT_PCT}%)`}
                  </span>
                  <span className={paymentTab === 'online' ? 'text-purple-600 font-semibold' : 'text-green-600 font-semibold'}>
                    − ₹{(paymentTab === 'online' ? onlineDiscountAmt : codDiscountAmt).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Delivery</span>
                  <span className="text-green-600 font-medium">FREE</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between text-base font-black">
                  <span>Total Payable</span>
                  <span className="text-primary">₹{totalAmount.toLocaleString('en-IN')}</span>
                </div>
                {(totalSavings + couponAmt + (paymentTab === 'online' ? onlineDiscountAmt : codDiscountAmt)) > 0 && (
                  <div className="bg-green-50 rounded-xl px-3 py-2">
                    <p className="text-xs font-bold text-green-700">
                      🎉 Total Savings: ₹{(totalSavings + couponAmt + (paymentTab === 'online' ? onlineDiscountAmt : codDiscountAmt)).toLocaleString('en-IN')}
                    </p>
                  </div>
                )}
              </div>

              {/* EMI — COD tab only */}
              {paymentTab === 'cod' && (
                <div className="border-t border-gray-100 pt-4">
                  <CartEMISummary cartTotal={totalCod} selected={emiSelected} onSelect={setEmiSelected} />
                  <div className="mt-2 p-2.5 bg-blue-50 border border-blue-100 rounded-xl">
                    <p className="text-xs text-blue-700 font-semibold flex items-center gap-1.5">
                      <Icon icon="ph:info-fill" width={12} />
                      No Cost EMI available — zero interest on select tenures
                    </p>
                  </div>
                </div>
              )}

              {/* Customer Details */}
              <div className="border-t border-gray-100 pt-4 space-y-3">
                <h3 className="text-sm font-bold text-gray-800">Your Details</h3>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Full Name <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <div className="relative">
                    <Icon icon="ph:user-fill" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width={13} />
                    <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Your full name"
                      className="w-full pl-8 pr-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Phone <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-primary/30">
                    <span className="pl-3 pr-2 text-gray-500 text-xs font-medium">+91</span>
                    <div className="w-px h-4 bg-gray-200" />
                    <input type="tel" value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="10-digit mobile" maxLength={10} inputMode="numeric"
                      className="flex-1 px-3 py-2.5 bg-transparent focus:outline-none text-sm" />
                  </div>
                </div>

                <div>
                  <label htmlFor="customer-email" className="block text-xs font-semibold text-gray-600 mb-1">
                    Email <span className="text-red-500">*</span>
                    <span className="text-gray-400 font-normal ml-1">(for order confirmation)</span>
                  </label>
                  <div className="relative">
                    <Icon icon="ph:envelope-fill" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width={13} />
                    <input id="customer-email" type="email" value={customerEmail}
                      onChange={(e) => { setCustomerEmail(e.target.value); if (emailError) setEmailError(''); }}
                      placeholder="you@example.com"
                      className={`w-full pl-8 pr-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors ${
                        emailError ? 'border-red-400 bg-red-50' : 'border-gray-300'
                      }`} />
                  </div>
                  {emailError && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      <Icon icon="ph:warning-circle-fill" width={11} /> {emailError}
                    </p>
                  )}
                </div>
              </div>

              {/* ── Payment Buttons ── */}
              <div className="border-t border-gray-100 pt-4 space-y-3">
                {paymentTab === 'online' ? (
                  <>
                    <PhonePeButton
                      amount={totalOnline}
                      customerName={customerName || undefined}
                      customerPhone={customerPhone ? `+91${customerPhone}` : undefined}
                      customerEmail={customerEmail || undefined}
                      items={cartItems.map(i => ({ name: i.name, price: i.price, quantity: i.quantity }))}
                      label={`Pay ${inr(totalOnline)} · Save ${inr(onlineDiscountAmt)}`}
                    />
                    <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
                      <Icon icon="ph:seal-check-fill" width={16} className="text-yellow-600 flex-shrink-0" />
                      <p className="text-xs text-yellow-700 font-medium">
                        <strong>{ONLINE_DISCOUNT_PCT}% instant discount</strong> applied — UPI, Cards & more
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <button onClick={handleCodCheckout}
                      className="w-full py-3.5 px-6 bg-[#25D366] hover:bg-[#1fba58] text-white rounded-full font-bold text-base flex items-center justify-center gap-2 transition-colors shadow-lg">
                      <Icon icon="mdi:whatsapp" width={22} />
                      Order via WhatsApp / COD
                    </button>
                    <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-xl">
                      <Icon icon="mdi:cash" width={16} className="text-green-600 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-green-700 font-bold">{COD_DISCOUNT_PCT}% COD Discount — Pay {inr(totalCod)}</p>
                        <p className="text-[11px] text-green-500">Cash on delivery at your doorstep</p>
                      </div>
                    </div>
                    {selectedTenure.months > 1 && (
                      <p className="text-center text-xs text-gray-500 bg-gray-50 rounded-xl px-3 py-2">
                        EMI option: <strong className="text-gray-800">{inr(emi)}/month</strong> × {selectedTenure.months} months
                        {selectedTenure.rate === 0 && <span className="text-green-600 font-semibold"> (No Cost)</span>}
                      </p>
                    )}
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