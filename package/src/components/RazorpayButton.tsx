'use client';

import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';

// Load Razorpay checkout script
function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(false);
    if ((window as any).Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload  = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

interface RazorpayButtonProps {
  amount:          number;                    // in INR (e.g. 28390)
  customerName?:   string;
  customerPhone?:  string;
  customerEmail?:  string;
  customerAddress?: string;
  items?:          { name: string; price: number; quantity: number }[];
  label?:          string;
  onBeforePay?:    () => boolean;             // validation — return false to block
  onSuccess?:      (paymentId: string, orderId: string) => void;
  onFailure?:      (error: string) => void;
}

export default function RazorpayButton({
  amount,
  customerName,
  customerPhone,
  customerEmail,
  customerAddress,
  items = [],
  label,
  onBeforePay,
  onSuccess,
  onFailure,
}: RazorpayButtonProps) {
  const [loading, setLoading] = useState(false);
  const [scriptReady, setScriptReady] = useState(false);

  useEffect(() => {
    loadRazorpayScript().then(setScriptReady);
  }, []);

  const handlePay = async () => {
    // Run validation if provided
    if (onBeforePay && !onBeforePay()) return;

    if (!scriptReady) {
      alert('Payment system is loading. Please wait a moment and try again.');
      return;
    }

    setLoading(true);

    try {
      // Step 1 — Create Razorpay order on our server
      const res = await fetch('/api/razorpay/create-order', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          customerName,
          customerPhone,
          customerEmail,
          items,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err?.error || 'Failed to create payment order');
      }

      const { orderId, amount: orderAmount, currency, keyId } = await res.json();

      // Step 2 — Open Razorpay checkout popup
      const options = {
        key:          keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount:       orderAmount,        // paise — from server
        currency:     currency || 'INR',
        name:         'Satyajan Energy Solutions',
        description:  items.length > 0
          ? items.map(i => `${i.name} × ${i.quantity}`).join(', ').slice(0, 255)
          : 'Power Backup Products',
        image:        'https://satyajan.com/images/header/satyajan-logo.png',
        order_id:     orderId,

        // Pre-fill customer details
        prefill: {
          name:    customerName  || '',
          email:   customerEmail || '',
          contact: customerPhone || '',
        },

        // Theme
        theme: { color: '#07be8a' },

        // Notes stored in Razorpay dashboard
        notes: {
          address: customerAddress || '',
          items:   JSON.stringify(items).slice(0, 256),
        },

        // ── Payment success handler ──────────────────────────────────────────
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id:   string;
          razorpay_signature:  string;
        }) => {
          try {
            // Step 3 — Verify payment signature on our server
            const verifyRes = await fetch('/api/razorpay/verify-payment', {
              method:  'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id:   response.razorpay_order_id,
                razorpay_signature:  response.razorpay_signature,
                customerName,
                customerPhone,
                customerEmail,
                customerAddress,
                amount,
                items,
              }),
            });

            const verifyData = await verifyRes.json();

            if (!verifyData.success) {
              throw new Error(verifyData.error || 'Payment verification failed');
            }

            // Step 4 — Redirect to success page
            onSuccess?.(response.razorpay_payment_id, response.razorpay_order_id);

            window.location.href =
              `/payment/status?orderId=${response.razorpay_order_id}` +
              `&paymentId=${response.razorpay_payment_id}` +
              `&method=online&status=success&amount=${amount}`;

          } catch (err: any) {
            console.error('[RazorpayButton] Verify error:', err);
            alert('Payment received but verification failed. Please contact support with your payment ID: ' + response.razorpay_payment_id);
          } finally {
            setLoading(false);
          }
        },

        // ── Modal close / failure handler ────────────────────────────────────
        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);

      rzp.on('payment.failed', (response: any) => {
        console.error('[RazorpayButton] Payment failed:', response.error);
        setLoading(false);
        onFailure?.(response.error?.description || 'Payment failed');
        alert(`Payment failed: ${response.error?.description || 'Please try again.'}`);
      });

      rzp.open();

    } catch (err: any) {
      console.error('[RazorpayButton] Error:', err);
      setLoading(false);
      alert(err?.message || 'Failed to create payment order. Please try again.');
    }
  };

  const displayLabel = label || `Pay ₹${amount.toLocaleString('en-IN')} via Razorpay`;

  return (
    <button
      onClick={handlePay}
      disabled={loading || !scriptReady}
      className="w-full py-3.5 px-6 rounded-full font-bold text-base flex items-center justify-center gap-2 transition-all shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
      style={{ background: loading ? '#666' : '#072654', color: '#fff' }}
    >
      {loading ? (
        <>
          <Icon icon="svg-spinners:3-dots-fade" width={22} className="text-white" />
          Processing...
        </>
      ) : (
        <>
          {/* Razorpay logo SVG */}
          <svg width="20" height="20" viewBox="0 0 50 50" fill="none">
            <path d="M25 0L0 50h18.75L25 37.5 31.25 50H50L25 0z" fill="#072654"/>
            <path d="M25 12.5l-9.375 25H25l9.375-25H25z" fill="#3395FF"/>
          </svg>
          {displayLabel}
        </>
      )}
    </button>
  );
}