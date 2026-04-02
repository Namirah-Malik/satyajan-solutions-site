'use client';

import { useCart } from '@/context/CartContext';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CartEMISummary, { TENURES, calcEMI } from '@/components/EMI/CartEMISummary';

const WHATSAPP_NUMBER = '918019179159';

function inr(n: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
}

export default function CartPage() {
  const router = useRouter();
  const { cartItems, updateQuantity, removeFromCart, getSubtotal, getTotalSavings } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponDiscount, setCouponDiscount] = useState(0);

  // ── Customer email for Google survey ──
  const [customerEmail, setCustomerEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  // ── EMI state ──
  const [emiSelected, setEmiSelected] = useState(1);

  const subtotal = getSubtotal();
  const totalSavings = getTotalSavings();
  const mrpTotal = cartItems.reduce((total, item) => {
    const originalPrice = item.originalPrice || item.price;
    return total + originalPrice * item.quantity;
  }, 0);
  const productDiscount = mrpTotal - subtotal;
  const deliveryCharges = 0;
  const couponDiscountAmount = couponDiscount;
  const totalAmount = subtotal - couponDiscountAmount + deliveryCharges;

  const selectedTenure = TENURES[emiSelected];
  const { emi, interest, total: emiTotal } = calcEMI(totalAmount, selectedTenure.rate, selectedTenure.months);

  const handleApplyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (code === 'SAVE10') {
      setAppliedCoupon(code);
      setCouponDiscount(subtotal * 0.1);
    } else if (code === 'FIRST100') {
      setAppliedCoupon(code);
      setCouponDiscount(100);
    } else {
      alert('Invalid coupon code. Try: SAVE10 or FIRST100');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
    setCouponCode('');
  };

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(id);
    } else {
      updateQuantity(id, newQuantity);
    }
    if (appliedCoupon) handleRemoveCoupon();
  };

  // ── Validate email ────────────────────────────────────────────────────────
  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // ── WhatsApp checkout + redirect to thank-you page ────────────────────────
  const handleCheckout = () => {
    // Validate email before proceeding
    if (!customerEmail.trim()) {
      setEmailError('Please enter your email to receive order updates');
      document.getElementById('customer-email')?.focus();
      return;
    }
    if (!validateEmail(customerEmail)) {
      setEmailError('Please enter a valid email address');
      document.getElementById('customer-email')?.focus();
      return;
    }
    setEmailError('');

    const itemLines = cartItems
      .map((item, i) =>
        `${i + 1}. *${item.name}*\n   SKU: ${item.SKU}\n   Qty: ${item.quantity} × ${inr(item.price)} = ${inr(item.price * item.quantity)}`
      )
      .join('\n\n');

    const emiSection = [
      '💳 *EMI Plan Selected:*',
      `   Tenure: ${selectedTenure.months} months`,
      `   Interest Rate: ${selectedTenure.rate === 0 ? '0% (No Cost EMI)' : `${selectedTenure.rate}% p.a.`}`,
      `   Total Interest: ${interest === 0 ? '₹0 (No Cost)' : inr(interest)}`,
      `   Total Payable: ${inr(emiTotal)}`,
      `   *Monthly EMI: ${inr(emi)}/month*`,
    ].join('\n');

    const message = [
      '🛒 *New Order Inquiry — Satyajan Energy Solutions*',
      '━━━━━━━━━━━━━━━━━━━━━━━',
      '📦 *Order Details:*',
      itemLines,
      '━━━━━━━━━━━━━━━━━━━━━━━',
      '🧾 *Price Breakdown:*',
      `   MRP Total: ${inr(mrpTotal)}`,
      productDiscount > 0 ? `   Product Discount: -${inr(productDiscount)}` : '',
      appliedCoupon ? `   Coupon (${appliedCoupon}): -${inr(couponDiscountAmount)}` : '',
      `   Delivery: FREE`,
      `   *Total Amount: ${inr(totalAmount)}*`,
      '━━━━━━━━━━━━━━━━━━━━━━━',
      emiSection,
      '━━━━━━━━━━━━━━━━━━━━━━━',
      `📧 Customer Email: ${customerEmail}`,
      `📊 Total Items: ${cartItems.reduce((s, i) => s + i.quantity, 0)}`,
      '\nPlease confirm availability and delivery details. Thank you! 🙏',
    ]
      .filter(Boolean)
      .join('\n');

    // Open WhatsApp
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');

    // Generate order reference ID
    const orderId = `SAT-${Date.now()}`;

    // Estimated delivery: 7 days from now
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 7);
    const deliveryDateStr = deliveryDate.toISOString().split('T')[0];

    // Redirect to thank-you page with email for Google survey
    router.push(
      `/cart/thank-you?orderId=${orderId}&email=${encodeURIComponent(customerEmail)}&deliveryDate=${deliveryDateStr}&country=IN`
    );
  };

  if (cartItems.length === 0) {
    return (
      <section className="!pt-44 pb-20 relative bg-white min-h-screen">
        <div className="container mx-auto max-w-8xl px-5 2xl:px-0">
          <div className="text-center py-20">
            <Icon icon="solar:cart-large-4-outline" width={120} height={120} className="mx-auto text-gray-300 mb-6" />
            <h1 className="text-3xl font-bold text-dark mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-8">Add some products to your cart to continue shopping.</p>
            <Link href="/products" className="inline-block py-3 px-8 bg-primary text-white rounded-full hover:bg-dark duration-300 text-base font-semibold shadow-md">
              Continue Shopping
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="!pt-44 pb-20 relative bg-white min-h-screen">
      <div className="container mx-auto max-w-8xl px-5 2xl:px-0">
        <h1 className="text-3xl font-bold text-dark mb-2">Shopping Cart</h1>
        <p className="text-gray-600 mb-8">
          {cartItems.reduce((sum, item) => sum + item.quantity, 0)} item(s) in your cart
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex flex-col sm:flex-row gap-4 pb-6 mb-6 border-b border-gray-200 last:border-b-0 last:pb-0 last:mb-0">
                  
                  <Link href={`/products/${item.id}`} className="w-full sm:w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden border border-gray-100 bg-gray-50 block hover:opacity-90 transition-opacity">
  {/* eslint-disable-next-line @next/next/no-img-element */}
  <img
    src={item.image || '/images/fallback.jpg'}
    alt={item.name}
    className="w-full h-full object-contain p-2"
    onError={(e) => {
      (e.target as HTMLImageElement).src = '/images/fallback.jpg';
    }}
  />
</Link>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-dark mb-1">{item.name}</h3>
                    <p className="text-sm text-gray-500 mb-2">SKU: {item.SKU}</p>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-4">
                      <div className="flex items-center gap-4">
                        <span className="text-lg font-bold text-primary">₹{Number(item.price).toLocaleString('en-IN')}</span>
                        {item.originalPrice && item.originalPrice > item.price && (
                          <>
                            <span className="text-base text-gray-400 line-through">₹{Number(item.originalPrice).toLocaleString('en-IN')}</span>
                            <span className="text-sm text-green-600 font-medium">
                              Save ₹{Number((item.originalPrice - item.price) * item.quantity).toLocaleString('en-IN')} per unit
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-4">
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button onClick={() => handleQuantityChange(item.id, item.quantity - 1)} className="px-3 py-2 hover:bg-gray-100 transition-colors">
                          <Icon icon="mdi:minus" width={20} height={20} />
                        </button>
                        <span className="px-4 py-2 min-w-[60px] text-center font-semibold">{item.quantity}</span>
                        <button onClick={() => handleQuantityChange(item.id, item.quantity + 1)} className="px-3 py-2 hover:bg-gray-100 transition-colors">
                          <Icon icon="mdi:plus" width={20} height={20} />
                        </button>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center gap-1">
                        <Icon icon="mdi:delete-outline" width={18} height={18} />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <p className="text-lg font-semibold text-dark mb-2">Subtotal: ₹{Number(subtotal).toLocaleString('en-IN')}</p>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-24">
              <h2 className="text-xl font-bold text-dark mb-6">Order Summary</h2>

              {/* Coupon */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-dark mb-2">Apply Coupon</label>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Icon icon="mdi:check-circle" width={20} height={20} className="text-green-600" />
                      <span className="text-sm font-medium text-green-800">{appliedCoupon} applied</span>
                    </div>
                    <button onClick={handleRemoveCoupon} className="text-red-600 hover:text-red-800 text-sm">Remove</button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text" value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Enter coupon code"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      onKeyPress={(e) => e.key === 'Enter' && handleApplyCoupon()}
                    />
                    <button onClick={handleApplyCoupon} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-dark duration-300 font-medium">Apply</button>
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-2">Try: SAVE10 or FIRST100</p>
              </div>

              {/* Price breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-base">
                  <span className="text-gray-600">MRP Total</span>
                  <span className="font-semibold">₹{Number(mrpTotal).toLocaleString('en-IN')}</span>
                </div>
                {productDiscount > 0 && (
                  <div className="flex justify-between text-base">
                    <span className="text-gray-600">Product Discount</span>
                    <span className="font-semibold text-green-600">- ₹{Number(productDiscount).toLocaleString('en-IN')}</span>
                  </div>
                )}
                {couponDiscountAmount > 0 && (
                  <div className="flex justify-between text-base">
                    <span className="text-gray-600">Coupon Discount</span>
                    <span className="font-semibold text-green-600">- ₹{Number(couponDiscountAmount).toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-base">
                  <span className="text-gray-600">Delivery Charges</span>
                  <span className="font-semibold text-green-600">FREE</span>
                </div>
                <div className="border-t border-gray-200 pt-3 mt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Amount</span>
                    <span>₹{Number(totalAmount).toLocaleString('en-IN')}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">(Tax Included)</p>
                </div>
                {totalSavings > 0 && (
                  <div className="mt-3 p-3 bg-green-50 rounded-lg">
                    <p className="text-sm font-semibold text-green-800">
                      Total Savings: ₹{Number(totalSavings + couponDiscountAmount).toLocaleString('en-IN')}
                    </p>
                  </div>
                )}
              </div>

              {/* EMI */}
              <div className="mb-6">
                <CartEMISummary
                  cartTotal={totalAmount}
                  selected={emiSelected}
                  onSelect={setEmiSelected}
                />
              </div>

              {/* ── Email field for Google survey ── */}
              <div className="mb-5">
                <label
                  htmlFor="customer-email"
                  className="block text-sm font-semibold text-gray-800 mb-1.5"
                >
                  Your Email
                  <span className="text-red-500 ml-0.5">*</span>
                  <span className="text-xs text-gray-400 font-normal ml-1">(for order updates)</span>
                </label>
                <div className="relative">
                  <Icon
                    icon="ph:envelope-fill"
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    width={16}
                  />
                  <input
                    id="customer-email"
                    type="email"
                    value={customerEmail}
                    onChange={(e) => {
                      setCustomerEmail(e.target.value);
                      if (emailError) setEmailError('');
                    }}
                    placeholder="you@example.com"
                    className={`w-full pl-9 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-colors ${
                      emailError ? 'border-red-400 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                </div>
                {emailError && (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <Icon icon="ph:warning-circle-fill" width={12} />
                    {emailError}
                  </p>
                )}
                <p className="text-[11px] text-gray-400 mt-1">
                  Used only for order confirmation & delivery updates
                </p>
              </div>

              {/* Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleCheckout}
                  className="w-full py-3 px-6 bg-primary text-white rounded-full hover:bg-dark duration-300 text-base font-semibold shadow-md flex items-center justify-center gap-2"
                >
                  <Icon icon="mdi:whatsapp" width={20} height={20} />
                  Proceed to Checkout
                </button>
                <Link
                  href="/products"
                  className="block w-full py-3 px-6 bg-white text-primary border-2 border-primary rounded-full hover:bg-primary hover:text-white duration-300 text-base font-semibold text-center"
                >
                  Continue Shopping
                </Link>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}