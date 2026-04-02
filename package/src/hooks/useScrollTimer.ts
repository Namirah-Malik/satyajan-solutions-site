import { useEffect, useState } from 'react';

const MODAL_SHOWN_KEY = 'callMeBackModalShown';

export const useScrollTimer = (triggerTimeMs: number = 60000): { showModal: boolean; closeModal: () => void } => {
  const [showModal, setShowModal] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    // Check if modal was already shown and closed (persisted)
    const modalAlreadyShown = localStorage.getItem(MODAL_SHOWN_KEY) === 'true';
    if (modalAlreadyShown) {
      return;
    }

    const footerElement = document.getElementById('footer');
    if (!footerElement) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !showModal) {
            setShowModal(true);
            // Mark modal as shown in persistent storage
            localStorage.setItem(MODAL_SHOWN_KEY, 'true');
            observer.disconnect(); // Stop observing once shown
          }
        });
      },
      {
        threshold: 0.1, // Trigger when 10% of the footer is visible
      }
    );

    observer.observe(footerElement);

    return () => {
      observer.disconnect();
    };
  }, [showModal, isClient]);

  const closeModal = () => {
    setShowModal(false);
    // Mark modal as shown and closed - don't show again (persisted)
    localStorage.setItem(MODAL_SHOWN_KEY, 'true');
  };

  return { showModal, closeModal };
};
