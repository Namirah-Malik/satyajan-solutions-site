// lib/page-metadata.ts
// Central place for all static page metadata.
// Import whichever you need in each page.tsx

import type { Metadata } from 'next';

// ── Homepage ──────────────────────────────────────────────────────────────────
export const homeMetadata: Metadata = {
  title: 'Buy Microtek Inverter, Battery & Solar in Hyderabad | Satyajan Energy Solutions',
  description:
    'Shop Microtek inverters, tubular batteries, solar panels & online UPS at Satyajan Energy Solutions, Hyderabad. 101+ products. Best prices. Free delivery. EMI available. Call +91 8019179159.',
  alternates: { canonical: 'https://satyajan.com' },
  openGraph: {
    url:         'https://satyajan.com',
    title:       'Buy Microtek Inverter, Battery & Solar in Hyderabad | Satyajan',
    description: 'Shop Microtek inverters, tubular batteries, solar panels & UPS. 101+ products. Free delivery. EMI available.',
    images: [{ url: 'https://satyajan.com/images/og-default.jpg', width: 1200, height: 630 }],
  },
};

// ── All Products page ─────────────────────────────────────────────────────────
export const productsMetadata: Metadata = {
  title: 'Shop All Power Backup Products | Inverters, Batteries, UPS & Solar | Satyajan',
  description:
    'Browse 101+ Microtek products — pure sine wave inverters, tubular batteries, online UPS, solar panels & lithium batteries. Best prices in Hyderabad. Free delivery. EMI available.',
  alternates: { canonical: 'https://satyajan.com/products' },
  openGraph: {
    url:         'https://satyajan.com/products',
    title:       'Shop All Power Backup Products | Satyajan Hyderabad',
    description: 'Browse 101+ Microtek inverters, batteries, UPS & solar products. Best prices in Hyderabad.',
    images: [{ url: 'https://satyajan.com/images/og-products.jpg', width: 1200, height: 630 }],
  },
};

// ── Category metadata map ─────────────────────────────────────────────────────
// Use this in pages that render a specific category.
export const categoryMetadata: Record<string, Metadata> = {
  Inverter: {
    title: 'Buy Microtek Inverters Online | Pure Sine Wave & Digital Wave | Satyajan Hyderabad',
    description:
      'Shop Microtek Smart Hybrid, Energy Saver, Heavy Duty, Luxe & iMerlyn inverters. 725VA–2000VA. Pure sine wave. 2–3 year warranty. Best price in Hyderabad.',
    alternates: { canonical: 'https://satyajan.com/products?category=Inverter' },
  },
  Battery: {
    title: 'Microtek Tubular Inverter Batteries | 130Ah–250Ah | Satyajan Hyderabad',
    description:
      'Buy Microtek Dura Long & Dura Strong tall tubular batteries. 130Ah to 250Ah. ADC technology. 48–60 month warranty. Free delivery in Hyderabad.',
    alternates: { canonical: 'https://satyajan.com/products?category=Battery' },
  },
  'ONLINE UPS': {
    title: 'Online UPS for Home & Office | 1KVA–6KVA | Satyajan Energy Solutions Hyderabad',
    description:
      'True double-conversion online UPS systems. 1KVA to 6KVA. DSP + IGBT technology. For computers, servers & sensitive equipment. Buy in Hyderabad.',
    alternates: { canonical: 'https://satyajan.com/products?category=ONLINE+UPS' },
  },
  Solar: {
    title: 'Solar Panels in Hyderabad | 550W Bi-Facial | Buy Online | Satyajan',
    description:
      'Buy 550W bi-facial solar panels in Hyderabad. Anti-reflective AR glass. Maximize energy generation. Reduce electricity bills by up to 80%. Free consultation.',
    alternates: { canonical: 'https://satyajan.com/products?category=Solar' },
  },
  'High Capacity UPS': {
    title: 'High Capacity Jumbo Home UPS | 2KVA–7KVA | Satyajan Hyderabad',
    description:
      'Microtek Jumbo Home UPS series. 2KVA to 7KVA. Pure sine wave. DSP/PWM technology. Ideal for offices, shops & large homes in Hyderabad.',
    alternates: { canonical: 'https://satyajan.com/products?category=High+Capacity+UPS' },
  },
  'New Lithium Battery': {
    title: 'Lithium LiFePO4 Batteries for Inverter | 100Ah | Satyajan Hyderabad',
    description:
      'Buy LiFePO4 lithium batteries for inverters. 100Ah / 25.6V. 3500+ cycles. 10+ year lifespan. Built-in BMS. Maintenance-free. Best price in Hyderabad.',
    alternates: { canonical: 'https://satyajan.com/products?category=New+Lithium+Battery' },
  },
  Combo: {
    title: 'Inverter + Battery Combo Deals | Best Price in Hyderabad | Satyajan',
    description:
      'Shop inverter and battery combo packs. Matched for optimal performance. Best prices in Hyderabad. Free installation consultation. EMI available.',
    alternates: { canonical: 'https://satyajan.com/products?category=Combo' },
  },
};
export const servicesMetadata: Metadata = {
  title: 'Power Backup & Solar Services in Hyderabad | Satyajan',
  description:
    'Expert inverter installation, battery maintenance, solar panel setup & UPS services in Hyderabad. Trusted service by Satyajan Energy Solutions.',
  alternates: { canonical: 'https://satyajan.com/services' },
};


// ── Blog page ─────────────────────────────────────────────────────────────────
export const blogMetadata: Metadata = {
  title: 'Power Backup & Solar Energy Blog | Inverter, Battery & UPS Tips | Satyajan',
  description:
    'Expert articles on choosing the right inverter, extending battery life, solar installation in Hyderabad, UPS for office, and more. Free guides from Satyajan Energy Solutions.',
  alternates: { canonical: 'https://satyajan.com/blog' },
};
// ── Careers page ──────────────────────────────────────────────────────────────
export const careersMetadata: Metadata = {
  title: 'Careers at Satyajan Energy Solutions | Join Our Team',
  description:
    'Explore job opportunities at Satyajan Energy Solutions in Hyderabad. Join our growing team in solar, inverter, and power backup solutions.',
  alternates: { canonical: 'https://satyajan.com/careers' },
};

// ── About page ────────────────────────────────────────────────────────────────
export const aboutMetadata: Metadata = {
  title: 'About Satyajan Energy Solutions | Authorised Microtek Dealer Hyderabad',
  description:
    'Satyajan Energy Solutions is an authorised Microtek dealer in Hyderabad, Telangana. We specialise in solar panels, inverters, batteries, and power backup solutions.',
  alternates: { canonical: 'https://satyajan.com/about' },
};

// ── Contact page ──────────────────────────────────────────────────────────────
export const contactMetadata: Metadata = {
  title: 'Contact Satyajan Energy Solutions | Karmanghat, Hyderabad | +91 8019179159',
  description:
    'Contact Satyajan Energy Solutions in Hyderabad. Visit our showroom at Green Lands Colony, Karmanghat. Call +91 8019179159 or email info@satyajan.com.',
  alternates: { canonical: 'https://satyajan.com/contact' },
};