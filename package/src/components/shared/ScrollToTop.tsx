'use client';

import React, { useEffect, useState } from 'react';
import { Icon } from "@iconify/react/dist/iconify.js";

const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 200);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      className={`fixed bottom-8 right-8 z-50 bg-primary rounded-full w-12 h-12 items-center justify-center cursor-pointer text-3xl ${isVisible ? "flex" : "hidden"} `}
      onClick={scrollToTop}
      aria-label="Scroll to top"
    >
      <Icon icon="solar:alt-arrow-up-line-duotone" className="text-2xl text-white" />
    </button>
  );
};

export default ScrollToTop; 