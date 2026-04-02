/**
 * seo.config.ts
 * ─────────────────────────────────────────────────────────────
 * Single source of truth for all SEO defaults across the site.
 * Import from this file in every page's metadata export.
 *
 * Deploy to: src/lib/seo.config.ts
 */

export const SEO = {
  siteName:    'Satyajan Energy Solutions',
  domain:      'https://satyajan.com',
  locale:      'en_IN',
  phone:       '+91 8019179159',
  email:       'satyajan@gmail.com',
  address: {
    street:  'Hyderabad',
    city:    'Hyderabad',
    state:   'Telangana',
    country: 'IN',
    zip:     '500000',
  },

  // Default title template — shown in browser tab and Google
  titleTemplate: '%s | Satyajan Energy Solutions',
  defaultTitle:  'Satyajan Energy Solutions – Solar, Inverter & Battery Solutions in Hyderabad',

  // Default description (≤160 chars)
  defaultDescription:
    'Satyajan Energy Solutions – Authorised Microtek dealer in Hyderabad. Buy solar panels, inverters, batteries & UPS. Easy EMI. Free installation support. Call +91 8019179159.',

  // Default OG image (1200×630) — place file at public/images/og-default.jpg
  defaultOgImage: 'https://satyajan.com/images/og-default.jpg',

  // Social handles
  twitter: '@satyajanenergy',

  // Primary keywords (used across pages)
  keywords: [
    'solar panels Hyderabad',
    'inverter dealer Hyderabad',
    'Microtek dealer Hyderabad',
    'battery solutions Hyderabad',
    'power backup Hyderabad',
    'solar installation Telangana',
    'UPS systems Hyderabad',
    'energy solutions India',
    'satyajan energy',
  ],
} as const;