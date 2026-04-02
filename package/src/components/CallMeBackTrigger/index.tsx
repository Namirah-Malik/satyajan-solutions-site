"use client";

import React, { useEffect, useState } from 'react';
import CallMeBackModal from '@/components/CallMeBackModal';

const MODAL_SHOWN_KEY = 'callMeBackModalShown';

export default function CallMeBackTrigger() {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // If modal already shown this session, do nothing
    if (sessionStorage.getItem(MODAL_SHOWN_KEY) === 'true') return;

    const footerEl = document.getElementById('site-footer');
    if (!footerEl) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (sessionStorage.getItem(MODAL_SHOWN_KEY) !== 'true') {
              setShowModal(true);
              sessionStorage.setItem(MODAL_SHOWN_KEY, 'true');
            }
          }
        });
      },
      { root: null, threshold: 0.1 }
    );

    observer.observe(footerEl);

    return () => observer.disconnect();
  }, []);

  const closeModal = () => {
    setShowModal(false);
    sessionStorage.setItem(MODAL_SHOWN_KEY, 'true');
  };

  return <CallMeBackModal isOpen={showModal} onClose={closeModal} />;
}
