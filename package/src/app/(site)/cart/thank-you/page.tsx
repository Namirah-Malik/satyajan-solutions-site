'use client';

import { useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import Script from 'next/script';
import { Suspense } from 'react';

// ── Inner component reads search params ──────────────────────────────────────
function ThankYouContent() {
  const searchParams  = useSearchParams();
  const orderId       = searchParams.get('orderId')       || `ORD-${Date.now()}`;
  const email         = searchParams.get('email')         || '';
  const deliveryDate  = searchParams.get('deliveryDate')  || getDefaultDeliveryDate();
  const country       = searchParams.get('country')       || 'IN';
  const rendered      = useRef(false);

  // Estimated delivery: 5 business days from now
  function getDefaultDeliveryDate() {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0]; // YYYY-MM-DD
  }

  useEffect(() => {
    if (rendered.current) return;
    rendered.current = true;

    // Wait for gapi to load then render the opt-in
    const tryRender = () => {
      if (window.gapi?.surveyoptin) {
        window.gapi.surveyoptin.render({
          merchant_id: 5728019286,
          order_id: orderId,
          email: email,
          delivery_country: country,
          estimated_delivery_date: deliveryDate,
        });
      } else {
        setTimeout(tryRender, 300);
      }
    };

    // renderOptIn is called by the platform.js script on load
    (window as any).renderOptIn = () => {
      window.gapi.load('surveyoptin', tryRender);
    };

    // If gapi already loaded, trigger manually
    if ((window as any).gapi) {
      (window as any).renderOptIn();
    }
  }, [orderId, email, deliveryDate, country]);

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-20">
      <div className="max-w-lg w-full text-center">

        {/* Success icon */}
        <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Icon icon="ph:check-circle-fill" className="text-emerald-500" width={56} />
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3">
          Order Request Sent! 🎉
        </h1>
        <p className="text-gray-500 text-base mb-2">
          Your order has been sent to our team via WhatsApp.
        </p>
        <p className="text-gray-500 text-sm mb-8">
          We&apos;ll confirm your order and delivery details shortly.
        </p>

        {/* Order ID */}
        {orderId && (
          <div className="bg-white border border-gray-200 rounded-2xl px-5 py-4 mb-8 text-left">
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-1">Reference</p>
            <p className="text-sm font-bold text-gray-700">{orderId}</p>
          </div>
        )}

        {/* What happens next */}
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

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-full font-bold hover:bg-dark transition-colors text-sm"
          >
            <Icon icon="ph:shopping-bag-fill" width={16} /> Continue Shopping
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 border-2 border-gray-200 text-gray-700 px-6 py-3 rounded-full font-bold hover:bg-gray-50 transition-colors text-sm"
          >
            Go to Home
          </Link>
        </div>

      </div>

      {/* ── Google Merchant Customer Reviews Survey Opt-In ── */}
      <Script
        src="https://apis.google.com/js/platform.js?onload=renderOptIn"
        strategy="afterInteractive"
      />
    </main>
  );
}

// ── Page export with Suspense (required for useSearchParams) ─────────────────
export default function ThankYouPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Icon icon="ph:circle-notch-bold" className="text-primary animate-spin" width={40} />
      </div>
    }>
      <ThankYouContent />
    </Suspense>
  );
}

// Extend window type for gapi
declare global {
  interface Window {
    gapi: any;
    renderOptIn: () => void;
  }
}