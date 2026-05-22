// src/app/(site)/cart/page.tsx
import { Suspense } from 'react';
import CartClient from './CartClient';

export default function CartPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen !pt-44 pb-20 bg-white flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500 font-medium">Loading cart...</p>
          </div>
        </div>
      }
    >
      <CartClient />
    </Suspense>
  );
}