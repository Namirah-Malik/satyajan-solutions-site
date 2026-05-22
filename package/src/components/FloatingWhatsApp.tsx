'use client';
// src/components/FloatingWhatsApp.tsx

import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';

const WHATSAPP_NUMBER = '918019179159';
const DEFAULT_MESSAGE = 'Hi! I need help with energy services at Satyajan.';

export default function FloatingWhatsApp() {
  const [visible, setVisible]   = useState(false);
  const [pulse,   setPulse]     = useState(true);
  const [tooltip, setTooltip]   = useState(true);

  // Show after 2 seconds, hide tooltip after 5 seconds
  useEffect(() => {
    const show    = setTimeout(() => setVisible(true), 2000);
    const hideTip = setTimeout(() => setTooltip(false), 7000);
    // Re-pulse every 10 seconds to grab attention
    const pulseInterval = setInterval(() => {
      setPulse(false);
      setTimeout(() => setPulse(true), 300);
    }, 10000);
    return () => {
      clearTimeout(show);
      clearTimeout(hideTip);
      clearInterval(pulseInterval);
    };
  }, []);

  if (!visible) return null;

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-2">

      {/* Tooltip bubble */}
      {tooltip && (
        <div className="flex items-center gap-2 bg-white text-gray-800 text-xs font-semibold px-4 py-2.5 rounded-2xl shadow-xl border border-gray-100 max-w-[180px] animate-fade-in">
          <Icon icon="mdi:whatsapp" className="text-[#25D366] flex-shrink-0" width={16} />
          <span>Chat with us on WhatsApp!</span>
          <button
            onClick={() => setTooltip(false)}
            className="ml-1 text-gray-400 hover:text-gray-600 flex-shrink-0"
            aria-label="Close"
          >
            <Icon icon="ph:x-bold" width={10} />
          </button>
        </div>
      )}

      {/* Main button */}
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="relative flex items-center justify-center w-14 h-14 bg-[#25D366] hover:bg-[#1fba58] rounded-full shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95"
      >
        {/* Pulse ring */}
        {pulse && (
          <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-40" />
        )}
        <Icon icon="mdi:whatsapp" className="text-white" width={30} />
      </a>
    </div>
  );
}