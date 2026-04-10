'use client';
// src/app/(site)/payment/status/page.tsx

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { useCart } from '@/context/CartContext';

// ── Strict union — never allow stray strings ──────────────────────────────────
type PaymentState = 'loading' | 'COMPLETED' | 'PENDING' | 'FAILED';

function PaymentStatusContent() {
  const searchParams  = useSearchParams();
  const orderId       = searchParams.get('orderId');
  const paymentMethod = searchParams.get('method') || 'online';
  const paidAmount    = searchParams.get('amount');
  const { clearCart } = useCart();

  const [state,   setState]   = useState<PaymentState>('loading');
  const [amount,  setAmount]  = useState<number>(paidAmount ? Number(paidAmount) : 0);
  const [retries, setRetries] = useState(0);

  const isCod = paymentMethod === 'cod';

  useEffect(() => {
    // ── No order ID → immediate failure ──────────────────────────────────────
    if (!orderId) {
      setState('FAILED');
      return;
    }

    // ── COD: mark complete immediately, no API call needed ───────────────────
    if (isCod) {
      clearCart();
      setState('COMPLETED');
      return;
    }

    // ── Online: poll PhonePe status API ──────────────────────────────────────
    const check = async () => {
      try {
        const res  = await fetch(`/api/payment/status?orderId=${orderId}`);
        const data = await res.json();

        // Treat any non-200 response as failure
        if (!res.ok) {
          setState('FAILED');
          return;
        }

        const apiState: string = data.state ?? 'FAILED';

        if (apiState === 'COMPLETED') {
          setState('COMPLETED');
          setAmount(data.amount ?? Number(paidAmount) ?? 0);
          clearCart();
        } else if (apiState === 'PENDING' && retries < 6) {
          // Still pending — retry after 2.5 s
          setTimeout(() => setRetries(r => r + 1), 2500);
        } else {
          // FAILED, CANCELLED, or max retries reached
          setState('FAILED');
        }
      } catch {
        setState('FAILED');
      }
    };

    check();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId, retries]);

  // ── Loading / polling spinner ─────────────────────────────────────────────
  if (!isCod && (state === 'loading' || state === 'PENDING')) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 pt-28">
        <div className="w-20 h-20 rounded-full border-4 border-primary border-t-transparent animate-spin mb-6" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Verifying Payment…</h2>
        <p className="text-gray-500 text-sm text-center max-w-xs">
          Please wait while we confirm your payment. Do not close this page.
        </p>
        {orderId && <p className="text-xs text-gray-400 mt-4 font-mono">Order: {orderId}</p>}
      </div>
    );
  }

  // ── COD / Cash on Delivery success ────────────────────────────────────────
  if (state === 'COMPLETED' && isCod) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex flex-col items-center justify-center px-4 pt-28 pb-16 text-center">

        <div className="relative mb-6">
          <div className="w-28 h-28 bg-green-100 rounded-full flex items-center justify-center shadow-lg">
            <Icon icon="ph:check-circle-fill" width={68} className="text-green-500" />
          </div>
          <div className="absolute -top-2 -right-2 w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg animate-bounce">
            <Icon icon="ph:confetti-fill" width={20} className="text-white" />
          </div>
        </div>

        <h1 className="text-4xl font-black text-gray-900 mb-2">Order Placed! 🎉</h1>
        <p className="text-gray-500 text-sm mb-6 max-w-sm">
          Your order has been confirmed. Our team will call/WhatsApp you to arrange delivery.
        </p>

        {orderId && (
          <p className="text-sm text-gray-400 mb-6">
            Order ID: <span className="font-mono text-gray-700 font-semibold">{orderId}</span>
          </p>
        )}

        <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100 max-w-sm w-full mb-8 text-left space-y-4">
          <p className="text-sm font-bold text-gray-800 mb-1">What happens next?</p>

          {[
            { num: '1', bg: 'bg-green-100',  text: 'text-green-700',  title: 'WhatsApp Confirmation',
              desc: 'Our team will WhatsApp you within 30 minutes to confirm your order details and delivery slot.' },
            { num: '2', bg: 'bg-blue-100',   text: 'text-blue-700',   title: 'Delivery in 5–7 Days',
              desc: 'Your product will be delivered across Hyderabad & Telangana within 5–7 business days.' },
            { num: '3', bg: 'bg-orange-100', text: 'text-orange-700', title: 'Pay on Delivery',
              desc: amount > 0
                ? `Keep ₹${Number(amount).toLocaleString('en-IN')} ready to pay our delivery partner in cash.`
                : 'Keep your payment amount ready to pay our delivery partner in cash.' },
            { num: '4', bg: 'bg-purple-100', text: 'text-purple-700', title: 'Warranty & Installation',
              desc: 'All products come with manufacturer warranty. Installation support available on request.' },
          ].map((step) => (
            <div key={step.num} className="flex items-start gap-3">
              <div className={`w-8 h-8 ${step.bg} rounded-full flex items-center justify-center flex-shrink-0 text-sm font-black ${step.text}`}>
                {step.num}
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{step.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
          <button
            onClick={() => window.open('https://wa.me/918019179159', '_blank')}
            className="flex-1 py-3.5 px-5 bg-[#25D366] hover:bg-[#1fba58] text-white rounded-full font-bold flex items-center justify-center gap-2 transition-colors shadow-lg"
          >
            <Icon icon="mdi:whatsapp" width={20} />
            Chat with Us
          </button>
          <Link href="/"
            className="flex-1 py-3.5 px-5 bg-primary hover:bg-dark text-white rounded-full font-bold flex items-center justify-center gap-2 transition-colors shadow-lg"
          >
            <Icon icon="ph:house-fill" width={18} />
            Go Home
          </Link>
        </div>
        <Link href="/products" className="mt-4 text-sm text-primary hover:underline font-medium">
          Continue Shopping →
        </Link>
      </div>
    );
  }

  // ── Online payment success ────────────────────────────────────────────────
  if (state === 'COMPLETED' && !isCod) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex flex-col items-center justify-center px-4 pt-28 pb-16 text-center">

        <div className="relative mb-8">
          <div className="w-28 h-28 bg-green-100 rounded-full flex items-center justify-center shadow-lg">
            <Icon icon="ph:check-circle-fill" width={68} className="text-green-500" />
          </div>
          <div className="absolute -top-2 -right-2 w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg animate-bounce">
            <Icon icon="ph:confetti-fill" width={20} className="text-white" />
          </div>
        </div>

        <h1 className="text-4xl font-black text-gray-900 mb-2">Payment Successful! 🎉</h1>
        <p className="text-gray-500 text-base mb-6 max-w-sm">
          Your payment was received. Thank you for shopping with Satyajan Energy Solutions!
        </p>

        {amount > 0 && (
          <div className="bg-white rounded-2xl px-10 py-5 shadow-lg border border-green-100 mb-4">
            <p className="text-xs text-gray-400 mb-1 uppercase tracking-wide">Amount Paid</p>
            <p className="text-4xl font-black text-primary">₹{Number(amount).toLocaleString('en-IN')}</p>
          </div>
        )}

        {orderId && (
          <p className="text-sm text-gray-400 mb-8">
            Order ID: <span className="font-mono text-gray-700 font-semibold">{orderId}</span>
          </p>
        )}

        <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100 max-w-sm w-full mb-8 text-left space-y-4">
          {[
            { icon: 'ph:whatsapp-logo-fill', bg: 'bg-green-100',  color: 'text-green-600',  title: 'WhatsApp Confirmation', desc: 'Our team will WhatsApp you within 30 minutes to confirm and arrange delivery.' },
            { icon: 'ph:package-fill',       bg: 'bg-blue-100',   color: 'text-blue-600',   title: 'Fast Delivery',         desc: 'Delivered within 5–7 business days across Hyderabad & Telangana.' },
            { icon: 'ph:shield-check-fill',  bg: 'bg-purple-100', color: 'text-purple-600', title: 'Warranty Assured',      desc: 'All products come with manufacturer warranty. Installation support available.' },
          ].map((item) => (
            <div key={item.title} className="flex items-start gap-3">
              <div className={`w-9 h-9 ${item.bg} rounded-full flex items-center justify-center flex-shrink-0`}>
                <Icon icon={item.icon} width={20} className={item.color} />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">{item.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
          <button
            onClick={() => window.open('https://wa.me/918019179159', '_blank')}
            className="flex-1 py-3.5 px-5 bg-[#25D366] hover:bg-[#1fba58] text-white rounded-full font-bold flex items-center justify-center gap-2 transition-colors shadow-lg"
          >
            <Icon icon="mdi:whatsapp" width={20} />
            Chat with Us
          </button>
          <Link href="/"
            className="flex-1 py-3.5 px-5 bg-primary hover:bg-dark text-white rounded-full font-bold flex items-center justify-center gap-2 transition-colors shadow-lg"
          >
            <Icon icon="ph:house-fill" width={18} />
            Go Home
          </Link>
        </div>
        <Link href="/products" className="mt-4 text-sm text-primary hover:underline font-medium">
          Continue Shopping →
        </Link>
      </div>
    );
  }

  // ── Payment failed (catches all remaining states) ─────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex flex-col items-center justify-center px-4 pt-28 pb-16 text-center">
      <div className="w-28 h-28 bg-red-100 rounded-full flex items-center justify-center mb-6 shadow-lg">
        <Icon icon="ph:x-circle-fill" width={68} className="text-red-500" />
      </div>

      <h1 className="text-4xl font-black text-gray-900 mb-3">Payment Failed</h1>
      <p className="text-gray-500 text-base mb-2 max-w-sm">
        Your payment could not be completed. <strong>No money has been deducted.</strong>
      </p>
      {orderId && <p className="text-xs text-gray-400 mb-6 font-mono">Order: {orderId}</p>}

      <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100 max-w-sm w-full mb-8 text-left">
        <p className="text-sm font-bold text-gray-800 mb-3">What to do next:</p>
        <ul className="space-y-2">
          {[
            'Check your internet connection and try again',
            'Ensure sufficient balance in your account',
            'Try ordering via WhatsApp / COD instead',
            'Contact us on WhatsApp for immediate help',
          ].map((tip, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
              <Icon icon="ph:arrow-right-fill" width={12} className="text-primary mt-0.5 flex-shrink-0" />
              {tip}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
        <Link href="/cart"
          className="flex-1 py-3.5 px-5 bg-primary hover:bg-dark text-white rounded-full font-bold flex items-center justify-center gap-2 transition-colors shadow-lg"
        >
          <Icon icon="ph:arrow-left-bold" width={16} />
          Back to Cart
        </Link>
        <button
          onClick={() =>
            window.open(
              `https://wa.me/918019179159?text=${encodeURIComponent(
                `Hi, my payment failed for order ${orderId || ''}. Please help.`
              )}`,
              '_blank'
            )
          }
          className="flex-1 py-3.5 px-5 bg-[#25D366] hover:bg-[#1fba58] text-white rounded-full font-bold flex items-center justify-center gap-2 transition-colors shadow-lg"
        >
          <Icon icon="mdi:whatsapp" width={20} />
          Get Help
        </button>
      </div>
    </div>
  );
}

export default function PaymentStatusPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col items-center justify-center bg-white pt-28">
        <div className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4" />
        <p className="text-gray-500 text-sm">Loading…</p>
      </div>
    }>
      <PaymentStatusContent />
    </Suspense>
  );
}