'use client';
// ─────────────────────────────────────────────────────────────────────────────
// src/app/(site)/payment/status/page.tsx
// Replaces the PhonePe payment/status page.
// Reads status from URL params (set by RazorpayButton after verification).
// ─────────────────────────────────────────────────────────────────────────────

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { useEffect, useRef } from 'react';
import Script from 'next/script';

// FIX: moved outside component — was arrow function used before declaration
function getDefaultDeliveryDate(): string {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  return d.toISOString().split('T')[0];
}

const MERCHANT_ID = Number(process.env.NEXT_PUBLIC_GOOGLE_MERCHANT_ID || '5728019286');

function PaymentStatusContent() {
  const searchParams  = useSearchParams();
  const orderId       = searchParams.get('orderId')   || '';
  const paymentId     = searchParams.get('paymentId') || '';
  const status        = (searchParams.get('status')   || 'COMPLETED').toUpperCase();
  const method        = searchParams.get('method')    || 'online';
  const amount        = searchParams.get('amount')    || '0';
  const reason        = searchParams.get('reason')    || '';
  const email         = searchParams.get('email')     || '';
  const deliveryDate  = searchParams.get('deliveryDate') || getDefaultDeliveryDate();
  const country       = searchParams.get('country')   || 'IN';
  const rendered      = useRef(false);

  const isSuccess = status === 'COMPLETED' || status === 'PAID' || status === 'SUCCESS';
  const isFailed  = status === 'FAILED';
  const isPending = !isSuccess && !isFailed;

  // Google Customer Reviews survey (fire only on success with email)
  useEffect(() => {
    if (!isSuccess || rendered.current) return;
    if (!email || !email.includes('@')) return;
    rendered.current = true;

    const tryRender = () => {
      if (window.gapi?.surveyoptin) {
        window.gapi.surveyoptin.render({
          merchant_id:             MERCHANT_ID,
          order_id:                orderId,
          email,
          delivery_country:        country,
          estimated_delivery_date: deliveryDate,
        });
      } else {
        setTimeout(tryRender, 300);
      }
    };

    (window as any).renderOptIn = () => {
      window.gapi.load('surveyoptin', tryRender);
    };

    if ((window as any).gapi) {
      (window as any).renderOptIn();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-20">
      <div className="max-w-lg w-full text-center">

        {/* Status Icon */}
        <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${
          isSuccess ? 'bg-emerald-100' : isFailed ? 'bg-red-100' : 'bg-amber-100'
        }`}>
          <Icon
            icon={isSuccess ? 'ph:check-circle-fill' : isFailed ? 'ph:x-circle-fill' : 'ph:clock-countdown-fill'}
            className={isSuccess ? 'text-emerald-500' : isFailed ? 'text-red-500' : 'text-amber-500'}
            width={56}
          />
        </div>

        {/* Heading */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3">
          {isSuccess ? 'Payment Successful! 🎉' : isFailed ? 'Payment Failed' : 'Payment Pending'}
        </h1>

        {/* Sub text */}
        <p className="text-gray-500 text-base mb-2">
          {isSuccess
            ? 'Your payment was received. Our team will confirm your order shortly.'
            : isFailed
            ? reason || 'Your payment could not be processed. Please try again.'
            : 'Your payment is being processed. Please wait a moment.'}
        </p>

        {/* COD message */}
        {method === 'cod' && (
          <p className="text-gray-500 text-sm mb-8">
            Your order has been sent via WhatsApp. We&apos;ll confirm delivery details shortly.
          </p>
        )}

        {/* Order details box */}
        {(orderId || paymentId || amount) && (
          <div className="bg-white border border-gray-200 rounded-2xl px-5 py-4 mb-8 text-left space-y-2">
            {orderId && (
              <div className="flex justify-between items-center">
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Order ID</p>
                <p className="text-sm font-bold text-gray-700 font-mono">{orderId}</p>
              </div>
            )}
            {paymentId && (
              <div className="flex justify-between items-center">
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Payment ID</p>
                <p className="text-sm font-bold text-gray-700 font-mono">{paymentId}</p>
              </div>
            )}
            {amount && Number(amount) > 0 && (
              <div className="flex justify-between items-center border-t border-gray-100 pt-2 mt-2">
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Amount</p>
                <p className="text-base font-black text-emerald-600">
                  ₹{Number(amount).toLocaleString('en-IN')}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Next steps — success */}
        {isSuccess && (
          <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-8 text-left space-y-3">
            <p className="text-sm font-extrabold text-gray-900 mb-3">What happens next?</p>
            {[
              { icon: 'ph:whatsapp-logo-fill', color: 'text-emerald-500', text: 'Our team will reply on WhatsApp within 30 minutes' },
              { icon: 'ph:package-fill',       color: 'text-primary',     text: 'We confirm product availability & delivery date' },
              { icon: 'ph:truck-fill',         color: 'text-blue-500',    text: 'Doorstep delivery arranged at your convenience' },
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <Icon icon={step.icon} className={`${step.color} flex-shrink-0 mt-0.5`} width={18} />
                <p className="text-sm text-gray-600">{step.text}</p>
              </div>
            ))}
          </div>
        )}

        {/* Next steps — failed */}
        {isFailed && (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-5 mb-8 text-left">
            <p className="text-sm font-bold text-red-800 mb-2">What you can do:</p>
            <ul className="space-y-1.5 text-sm text-red-700">
              <li>• Try again with a different card or UPI ID</li>
              <li>• Check your bank account balance</li>
              <li>• Contact your bank if the amount was debited</li>
              <li>• Or place your order via WhatsApp / COD</li>
            </ul>
          </div>
        )}

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {isFailed ? (
            <>
              <Link href="/cart"
                className="inline-flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-full font-bold hover:bg-dark transition-colors text-sm">
                <Icon icon="ph:arrow-counter-clockwise-bold" width={16} /> Try Again
              </Link>
              <a href="https://wa.me/918019179159?text=Hi, I need help with my payment"
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1fba58] text-white px-6 py-3 rounded-full font-bold transition-colors text-sm">
                <Icon icon="mdi:whatsapp" width={16} /> WhatsApp Us
              </a>
            </>
          ) : (
            <>
              <Link href="/products"
                className="inline-flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-full font-bold hover:bg-dark transition-colors text-sm">
                <Icon icon="ph:shopping-bag-fill" width={16} /> Continue Shopping
              </Link>
              <Link href="/"
                className="inline-flex items-center justify-center gap-2 border-2 border-gray-200 text-gray-700 px-6 py-3 rounded-full font-bold hover:bg-gray-50 transition-colors text-sm">
                Go to Home
              </Link>
            </>
          )}
        </div>

      </div>

      {/* Google Customer Reviews survey script */}
      {isSuccess && email && (
        <Script
          src="https://apis.google.com/js/platform.js?onload=renderOptIn"
          strategy="afterInteractive"
        />
      )}
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

declare global {
  interface Window {
    gapi: any;
    renderOptIn: () => void;
  }
}