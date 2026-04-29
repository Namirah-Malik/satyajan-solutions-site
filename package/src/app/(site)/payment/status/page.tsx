'use client';
// src/app/(site)/payment/status/page.tsx

import { useEffect, useState, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Icon } from '@iconify/react';

function inr(n: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', maximumFractionDigits: 0,
  }).format(n);
}

// ── Status check + WhatsApp notify ───────────────────────────────────────────
function PaymentStatusContent() {
  const searchParams = useSearchParams();
  const orderId      = searchParams.get('orderId') || '';
  const method       = searchParams.get('method')  || 'online';
  const amountParam  = Number(searchParams.get('amount') || 0);

  const [state,    setState]    = useState<'loading' | 'success' | 'pending' | 'failed'>('loading');
  const [amount,   setAmount]   = useState(amountParam);
  const [notified, setNotified] = useState(false);
  const notifyRef = useRef(false);

  useEffect(() => {
    if (!orderId) { setState('failed'); return; }

    // COD orders don't need PhonePe status check
    if (method === 'cod') {
      setState('success');
      return;
    }

    // Online payment — poll PhonePe for status
    let attempts = 0;
    const maxAttempts = 10;

    const checkStatus = async () => {
      try {
        const res  = await fetch(`/api/payment/status?orderId=${orderId}`);
        const data = await res.json();

        if (data.state === 'COMPLETED') {
          setAmount(data.amount || amountParam);
          setState('success');
        } else if (data.state === 'FAILED') {
          setState('failed');
        } else {
          // PENDING — keep polling
          attempts++;
          if (attempts < maxAttempts) {
            setTimeout(checkStatus, 3000);
          } else {
            setState('pending');
          }
        }
      } catch {
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(checkStatus, 3000);
        } else {
          setState('failed');
        }
      }
    };

    checkStatus();
  }, [orderId, method, amountParam]);

  // ── Send WhatsApp notification to team on success ─────────────────────────
  useEffect(() => {
    if (state !== 'success' || notifyRef.current) return;
    notifyRef.current = true;

    // Only notify for online payments (COD is notified directly from cart page)
    if (method !== 'online') return;

    try {
      const raw = sessionStorage.getItem('pendingOrder');
      if (!raw) return;

      const order = JSON.parse(raw);

      fetch('/api/orders/notify', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          method:          'online',
          status:          'COMPLETED',
          customerName:    order.customerName    || null,
          customerPhone:   order.customerPhone   || null,
          customerEmail:   order.customerEmail   || null,
          customerAddress: order.customerAddress || null,
          amount:          amount || order.amount,
          items:           order.items || [],
        }),
      }).then(() => {
        setNotified(true);
        // Clear so it doesn't re-fire on refresh
        sessionStorage.removeItem('pendingOrder');
      }).catch(() => {});
    } catch {}
  }, [state, method, orderId, amount]);

  // ── UI ────────────────────────────────────────────────────────────────────

  if (state === 'loading') {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <Icon icon="ph:circle-notch-bold" className="text-primary animate-spin mx-auto" width={48} />
          <p className="text-gray-600 font-medium">Verifying your payment…</p>
          <p className="text-gray-400 text-sm">This usually takes a few seconds</p>
        </div>
      </main>
    );
  }

  if (state === 'failed') {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-20">
        <div className="max-w-lg w-full text-center">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Icon icon="ph:x-circle-fill" className="text-red-500" width={56} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3">Payment Failed</h1>
          <p className="text-gray-500 text-base mb-8">
            Your payment could not be processed. No money has been deducted.
          </p>
          {orderId && (
            <div className="bg-white border border-gray-200 rounded-2xl px-5 py-4 mb-8 text-left">
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-1">Reference</p>
              <p className="text-sm font-bold text-gray-700">{orderId}</p>
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/cart"
              className="inline-flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-full font-bold hover:bg-dark transition-colors text-sm">
              <Icon icon="ph:arrow-counter-clockwise-bold" width={16} /> Try Again
            </Link>
            <a href={`https://wa.me/918019179159?text=${encodeURIComponent(`Hi, my payment failed for Order ID: ${orderId}. Please help.`)}`}
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-full font-bold hover:bg-[#1fba58] transition-colors text-sm">
              <Icon icon="mdi:whatsapp" width={16} /> Contact Support
            </a>
          </div>
        </div>
      </main>
    );
  }

  if (state === 'pending') {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-20">
        <div className="max-w-lg w-full text-center">
          <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Icon icon="ph:clock-fill" className="text-yellow-500" width={56} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3">Payment Pending</h1>
          <p className="text-gray-500 text-base mb-8">
            Your payment is still being processed. If money was deducted, it will be confirmed within 24 hours.
          </p>
          {orderId && (
            <div className="bg-white border border-gray-200 rounded-2xl px-5 py-4 mb-8 text-left">
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-1">Reference</p>
              <p className="text-sm font-bold text-gray-700">{orderId}</p>
            </div>
          )}
          <a href={`https://wa.me/918019179159?text=${encodeURIComponent(`Hi, my payment is pending for Order ID: ${orderId}. Please check.`)}`}
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-full font-bold hover:bg-[#1fba58] transition-colors text-sm">
            <Icon icon="mdi:whatsapp" width={16} /> Contact Support
          </a>
        </div>
      </main>
    );
  }

  // ── SUCCESS ───────────────────────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-20">
      <div className="max-w-lg w-full text-center">

        {/* Success icon */}
        <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Icon icon="ph:check-circle-fill" className="text-emerald-500" width={56} />
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3">
          {method === 'cod' ? 'Order Request Sent! 🎉' : 'Payment Successful! 🎉'}
        </h1>
        <p className="text-gray-500 text-base mb-2">
          {method === 'cod'
            ? 'Your order has been sent to our team via WhatsApp.'
            : 'Your payment has been received successfully.'}
        </p>
        {amount > 0 && method === 'online' && (
          <p className="text-emerald-600 font-bold text-lg mb-2">{inr(amount)} paid via PhonePe</p>
        )}
        <p className="text-gray-500 text-sm mb-8">
          We&apos;ll confirm your order and delivery details shortly.
        </p>

        {/* Order reference */}
        {orderId && (
          <div className="bg-white border border-gray-200 rounded-2xl px-5 py-4 mb-6 text-left">
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-1">Order Reference</p>
            <p className="text-sm font-bold text-gray-700">{orderId}</p>
          </div>
        )}

        {/* What happens next */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-8 text-left space-y-3">
          <p className="text-sm font-extrabold text-gray-900 mb-3">What happens next?</p>
          {[
            { icon: 'ph:whatsapp-logo-fill', color: 'text-emerald-500', text: 'Our team will contact you on WhatsApp within 30 minutes' },
            { icon: 'ph:package-fill',       color: 'text-primary',     text: 'We confirm product availability & delivery date' },
            { icon: 'ph:truck-fill',         color: 'text-blue-500',    text: 'Doorstep delivery arranged at your convenience' },
          ].map((step, i) => (
            <div key={i} className="flex items-start gap-3">
              <Icon icon={step.icon} className={`${step.color} flex-shrink-0 mt-0.5`} width={18} />
              <p className="text-sm text-gray-600">{step.text}</p>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/products"
            className="inline-flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-full font-bold hover:bg-dark transition-colors text-sm">
            <Icon icon="ph:shopping-bag-fill" width={16} /> Continue Shopping
          </Link>
          <Link href="/"
            className="inline-flex items-center justify-center gap-2 border-2 border-gray-200 text-gray-700 px-6 py-3 rounded-full font-bold hover:bg-gray-50 transition-colors text-sm">
            Go to Home
          </Link>
        </div>

      </div>
    </main>
  );
}

export default function PaymentStatusPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Icon icon="ph:circle-notch-bold" className="text-primary animate-spin" width={40} />
      </div>
    }>
      <PaymentStatusContent />
    </Suspense>
  );
}