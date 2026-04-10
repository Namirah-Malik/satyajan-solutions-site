'use client';
// src/components/PhonePeButton.tsx
// Drop this button anywhere — cart page, product detail, etc.

import React, { useState } from 'react';
import { Icon } from '@iconify/react';

interface PhonePeButtonProps {
  amount: number;               // in ₹ (e.g. 7483)
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  orderId?: string;
  items?: { name: string; price: number; quantity: number }[];
  className?: string;
  label?: string;
}

export default function PhonePeButton({
  amount,
  customerName,
  customerPhone,
  customerEmail,
  orderId,
  items,
  className = '',
  label = 'Pay with PhonePe',
}: PhonePeButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePay = async () => {
    if (loading) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/payment/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          customerName,
          customerPhone,
          customerEmail,
          orderId,
          items,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Payment initiation failed');
      }

      // Redirect to PhonePe checkout page
      window.location.href = data.redirectUrl;
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <button
        onClick={handlePay}
        disabled={loading}
        className={`
          w-full flex items-center justify-center gap-2.5
          bg-[#5f259f] hover:bg-[#4a1c7c] active:bg-[#3d1766]
          text-white font-bold text-base
          py-3.5 px-6 rounded-xl
          transition-all duration-200
          disabled:opacity-60 disabled:cursor-not-allowed
          shadow-lg shadow-purple-200
          ${loading ? '' : 'hover:shadow-xl hover:scale-[1.01]'}
          ${className}
        `}
      >
        {loading ? (
          <>
            <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            Processing…
          </>
        ) : (
          <>
            {/* PhonePe logo mark */}
            <svg width="22" height="22" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="20" fill="white"/>
              <path d="M26.5 13.5H21L13 27h5.5l2-3.5h4.5c3.3 0 6-2.7 6-6s-2.7-4-4.5-4zm-.5 7h-3.5l2-3.5h1.5c1.1 0 2 .9 2 2s-.9 1.5-2 1.5z" fill="#5f259f"/>
            </svg>
            {label}
          </>
        )}
      </button>
      {error && (
        <p className="mt-2 text-sm text-red-500 text-center flex items-center justify-center gap-1">
          <Icon icon="ph:warning-circle" width={14} />
          {error}
        </p>
      )}
      <p className="mt-2 text-center text-[10px] text-gray-400">
        Secured by PhonePe · UPI · Cards · NetBanking
      </p>
    </div>
  );
}