// app/(site)/payment/status/page.tsx
'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { useCart } from '@/context/CartContext';

// ── GA4 purchase event helper ─────────────────────────────────────────────────
function fireGA4Purchase(params: {
  transactionId: string;
  amount:        number;
  currency:      string;
  items:         { name: string; price: number; quantity: number }[];
}) {
  try {
    if (typeof window === 'undefined') return;
    const gtag = (window as any).gtag;
    if (typeof gtag !== 'function') {
      console.warn('[GA4] gtag not found — skipping purchase event');
      return;
    }
    gtag('event', 'purchase', {
      transaction_id: params.transactionId,
      value:          params.amount,
      currency:       params.currency,
      items:          params.items.map((item, idx) => ({
        item_id:    `item_${idx + 1}`,
        item_name:  item.name,
        price:      item.price,
        quantity:   item.quantity,
      })),
    });
    console.log('[GA4] purchase event fired ✓', {
      transaction_id: params.transactionId,
      value:          params.amount,
    });
  } catch (err) {
    console.error('[GA4] purchase event error:', err);
  }
}

// ── Google Customer Reviews survey opt-in ────────────────────────────────────
function fireGoogleSurvey(email: string, orderId: string) {
  try {
    const merchantId = process.env.NEXT_PUBLIC_GOOGLE_MERCHANT_ID;
    if (!merchantId || !email) return;
    if (typeof (window as any).renderOptIn === 'function') {
      (window as any).renderOptIn({
        merchant_id:        merchantId,
        order_id:           orderId,
        email:              email,
        delivery_country:   'IN',
        estimated_delivery_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
          .toISOString().split('T')[0],
      });
    }
  } catch (err) {
    console.error('[GCR] Survey error:', err);
  }
}

// ── Inner component: all the actual logic lives here ─────────────────────────
// This is the piece that calls useSearchParams(), so IT is what needs the
// Suspense boundary around it (see default export below).
function PaymentStatusContent() {
  const searchParams  = useSearchParams();
  const { clearCart } = useCart();

  const orderId   = searchParams.get('orderId')   || '';
  const paymentId = searchParams.get('paymentId') || '';
  const method    = searchParams.get('method')    || 'online';
  const status    = searchParams.get('status')    || 'success';
  const amount    = parseFloat(searchParams.get('amount') || '0');

  const [hasFired, setHasFired] = useState(false);
  const firedRef = useRef(false);

  useEffect(() => {
    if (firedRef.current) return;
    firedRef.current = true;

    const isSuccess = status === 'success' || method === 'cod';
    if (!isSuccess) return;

    // 1. Clear the cart
    clearCart();

    // 2. Get pending order details from sessionStorage
    let items: { name: string; price: number; quantity: number }[] = [];
    let customerEmail = '';
    try {
      const pending = sessionStorage.getItem('pendingOrder');
      if (pending) {
        const parsed = JSON.parse(pending);
        items         = parsed.items         || [];
        customerEmail = parsed.customerEmail || '';
        sessionStorage.removeItem('pendingOrder');
      }
    } catch {}

    // 3. Fire GA4 purchase event
    fireGA4Purchase({
      transactionId: paymentId || orderId,
      amount,
      currency: 'INR',
      items,
    });

    // 4. Fire Google Customer Reviews survey (online payments only)
    if (method !== 'cod' && customerEmail) {
      setTimeout(() => fireGoogleSurvey(customerEmail, orderId), 2000);
    }

    setHasFired(true);
  }, []);

  const isSuccess = status === 'success' || method === 'cod';
  const isCod     = method === 'cod';

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-20">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center">

        {isSuccess ? (
          <>
            {/* Success icon */}
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Icon icon="ph:check-circle-fill" width={52} className="text-primary" />
            </div>

            <h1 className="text-2xl font-extrabold text-dark mb-2">
              {isCod ? 'Order Placed!' : 'Payment Successful!'}
            </h1>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              {isCod
                ? 'Your order has been placed via WhatsApp. Our team will confirm availability and delivery details shortly.'
                : 'Your payment was processed successfully. You will receive an order confirmation shortly.'}
            </p>

            {/* Order details */}
            <div className="bg-gray-50 rounded-2xl p-4 mb-6 text-left space-y-3">
              {orderId && (
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500 font-medium">Order ID</span>
                  <span className="text-xs font-bold text-dark truncate max-w-[180px]">{orderId}</span>
                </div>
              )}
              {paymentId && !isCod && (
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500 font-medium">Payment ID</span>
                  <span className="text-xs font-bold text-dark truncate max-w-[180px]">{paymentId}</span>
                </div>
              )}
              {amount > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500 font-medium">Amount</span>
                  <span className="text-sm font-extrabold text-primary">
                    ₹{amount.toLocaleString('en-IN')}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500 font-medium">Payment Method</span>
                <span className="text-xs font-bold text-dark capitalize">
                  {isCod ? 'Cash on Delivery' : 'Online (Razorpay)'}
                </span>
              </div>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-2 mb-6">
              {[
                { icon: 'ph:truck-fill',        label: '2–5 Day Delivery',     color: 'text-emerald-600', bg: 'bg-emerald-50' },
                { icon: 'ph:shield-check-fill', label: 'Paperless Warranty',   color: 'text-purple-600',  bg: 'bg-purple-50'  },
                { icon: 'ph:headset-fill',      label: '24/7 Support',         color: 'text-blue-600',    bg: 'bg-blue-50'    },
              ].map((b) => (
                <div key={b.label} className={`${b.bg} rounded-xl p-2.5 flex flex-col items-center gap-1`}>
                  <Icon icon={b.icon} width={18} className={b.color} />
                  <span className="text-[10px] font-semibold text-gray-600 leading-tight text-center">{b.label}</span>
                </div>
              ))}
            </div>

            {/* CTA buttons */}
            <div className="space-y-3">
              <Link href="/products"
                className="block w-full py-3 bg-primary text-white rounded-full font-bold text-sm hover:bg-dark transition-colors">
                Continue Shopping
              </Link>
              <a href="https://wa.me/918019179159?text=Hi, I just placed an order. Can you confirm my delivery details?"
                target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 bg-[#25D366] text-white rounded-full font-bold text-sm hover:bg-[#1fba58] transition-colors">
                <Icon icon="mdi:whatsapp" width={18} />
                Track via WhatsApp
              </a>
            </div>
          </>
        ) : (
          <>
            {/* Failure icon */}
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Icon icon="ph:x-circle-fill" width={52} className="text-red-500" />
            </div>

            <h1 className="text-2xl font-extrabold text-dark mb-2">Payment Failed</h1>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              Your payment could not be processed. No amount has been charged. Please try again.
            </p>

            {orderId && (
              <div className="bg-gray-50 rounded-2xl p-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500 font-medium">Reference ID</span>
                  <span className="text-xs font-bold text-dark">{orderId}</span>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <Link href="/cart"
                className="block w-full py-3 bg-primary text-white rounded-full font-bold text-sm hover:bg-dark transition-colors">
                Try Again
              </Link>
              <a href="https://wa.me/918019179159?text=Hi, my payment failed. Can you help?"
                target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 border-2 border-gray-200 text-gray-600 rounded-full font-bold text-sm hover:border-gray-300 transition-colors">
                <Icon icon="mdi:whatsapp" width={18} className="text-[#25D366]" />
                Contact Support
              </a>
            </div>
          </>
        )}

        {/* Satyajan branding */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <p className="text-[11px] text-gray-400">
            Thank you for shopping at{' '}
            <span className="font-bold text-primary">Satyajan Energy Solutions</span>
            <br />+91 8019179159 · info@satyajan.com
          </p>
        </div>

      </div>
    </main>
  );
}

// ── Loading fallback shown while the client bails out for useSearchParams ────
function PaymentStatusLoading() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-20">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
          <Icon icon="ph:circle-notch" width={40} className="text-gray-300 animate-spin" />
        </div>
        <p className="text-gray-400 text-sm">Loading order status…</p>
      </div>
    </main>
  );
}

// ── Default export: Next.js requires useSearchParams() to be wrapped in
// Suspense so it can bail out to client rendering during static generation.
export default function PaymentStatusPage() {
  return (
    <Suspense fallback={<PaymentStatusLoading />}>
      <PaymentStatusContent />
    </Suspense>
  );
}