'use client';
// app/(site)/cancellation/page.tsx  OR  app/(site)/thankyou/page.tsx
// ─────────────────────────────────────────────────────────────────────────────
// FIXES:
//  1. getDefaultDeliveryDate was an arrow function used before declaration
//     in default parameter — moved to before the component, fixes ReferenceError
//  2. merchant_id moved to env var (NEXT_PUBLIC_GOOGLE_MERCHANT_ID)
//  3. email guard — survey only fires if email is present
//  4. useEffect dep array cleaned up to avoid lint warnings
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import Script from 'next/script';

// FIX 1: Moved outside component — was arrow function used before declaration
function getDefaultDeliveryDate(): string {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  return d.toISOString().split('T')[0]; // YYYY-MM-DD
}

// FIX 2: Read from env var — fallback to hardcoded for safety
const MERCHANT_ID = Number(
  process.env.NEXT_PUBLIC_GOOGLE_MERCHANT_ID || '5728019286'
);

function ThankYouContent() {
  const searchParams = useSearchParams();
  const orderId      = searchParams.get('orderId')      || `ORD-${Date.now()}`;
  const email        = searchParams.get('email')        || '';
  const deliveryDate = searchParams.get('deliveryDate') || getDefaultDeliveryDate();
  const country      = searchParams.get('country')      || 'IN';
  const rendered     = useRef(false);

  useEffect(() => {
    if (rendered.current) return;
    // FIX 3: Only fire survey if we have a valid email
    // Google silently drops surveys with no email
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

    // FIX 4: Assign renderOptIn before script loads
    (window as any).renderOptIn = () => {
      window.gapi.load('surveyoptin', tryRender);
    };

    // If gapi already loaded (e.g. page refresh), trigger manually
    if ((window as any).gapi) {
      (window as any).renderOptIn();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // ← empty deps intentional: survey fires once on mount only

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-20">
      <div className="max-w-lg w-full text-center">

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

        {orderId && (
          <div className="bg-white border border-gray-200 rounded-2xl px-5 py-4 mb-8 text-left">
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-1">Reference</p>
            <p className="text-sm font-bold text-gray-700">{orderId}</p>
          </div>
        )}

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

      {/* Google Customer Reviews survey script */}
      <Script
        src="https://apis.google.com/js/platform.js?onload=renderOptIn"
        strategy="afterInteractive"
      />
    </main>
  );
}

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

declare global {
  interface Window {
    gapi: any;
    renderOptIn: () => void;
  }
}