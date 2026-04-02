/**
 * src/lib/page-metadata.ts
 * Per-page metadata exports — import into each page's server component
 */

import type { Metadata } from 'next';

const domain = 'https://satyajan.com';
const defaultOgImage = `${domain}/images/og-default.jpg`;

export const homeMetadata: Metadata = {
  title: {
    absolute: 'Satyajan Energy Solutions – Solar, Inverter & Battery in Hyderabad',
  },
  description:
    'Authorised Microtek dealer in Hyderabad. Buy solar panels, inverters, UPS & batteries. Save up to 80% on electricity bills. Easy EMI. Free consultation. Call +91 8019179159.',
  keywords: [
    'solar panels Hyderabad', 'Microtek inverter Hyderabad', 'battery dealer Hyderabad',
    'solar installation Hyderabad', 'power backup Hyderabad', 'UPS Hyderabad',
    'satyajan energy solutions', 'solar company Telangana',
  ],
  alternates: { canonical: `${domain}/` },
  openGraph: {
    url: `${domain}/`,
    title: 'Satyajan Energy Solutions – Solar, Inverter & Battery in Hyderabad',
    description: 'Authorised Microtek dealer in Hyderabad. Solar panels, inverters, batteries & UPS. Easy EMI. Call +91 8019179159.',
    images: [{ url: defaultOgImage, width: 1200, height: 630 }],
  },
};

export const productsMetadata: Metadata = {
  title: 'Solar Panels, Inverters & Batteries – Buy Online',
  description:
    'Shop Microtek solar panels, inverters, tubular batteries, UPS & lithium batteries in Hyderabad. Best prices, EMI available, doorstep delivery.',
  keywords: [
    'buy solar panels Hyderabad', 'Microtek inverter price', 'tubular battery Hyderabad',
    'lithium battery India', 'UPS buy online', 'solar inverter combo',
  ],
  alternates: { canonical: `${domain}/products` },
  openGraph: {
    url: `${domain}/products`,
    title: 'Solar Panels, Inverters & Batteries | Satyajan Energy Solutions',
    description: 'Microtek solar panels, inverters, batteries & UPS at best prices. EMI available. Hyderabad delivery.',
    images: [{ url: defaultOgImage, width: 1200, height: 630 }],
  },
};

export const servicesMetadata: Metadata = {
  title: 'Solar & Power Backup Services in Hyderabad',
  description:
    'Professional solar installation, inverter repair, battery maintenance & 24/7 technical support in Hyderabad. Trusted by 1000+ customers. Call +91 8019179159.',
  keywords: [
    'solar installation Hyderabad', 'inverter repair Hyderabad', 'battery maintenance',
    'solar panel maintenance', 'UPS installation', 'power backup service Hyderabad',
  ],
  alternates: { canonical: `${domain}/services` },
  openGraph: {
    url: `${domain}/services`,
    title: 'Solar & Power Backup Services in Hyderabad | Satyajan',
    description: 'Solar installation, inverter repair & battery maintenance in Hyderabad. Call +91 8019179159.',
    images: [{ url: defaultOgImage, width: 1200, height: 630 }],
  },
};

export const blogsMetadata: Metadata = {
  title: 'Solar & Energy Blog – Tips, Guides & Insights',
  description:
    'Expert articles on solar panels, inverters, batteries, power backup & energy savings for Indian homes and businesses. Stay informed with Satyajan.',
  keywords: [
    'solar energy blog India', 'inverter buying guide', 'battery tips India',
    'power backup guide', 'solar savings', 'energy blog Hyderabad',
  ],
  alternates: { canonical: `${domain}/blogs` },
  openGraph: {
    url: `${domain}/blogs`,
    title: 'Solar & Energy Blog | Satyajan Energy Solutions',
    description: 'Tips, guides and expert insights on solar, inverters & batteries for Indian homes.',
    images: [{ url: defaultOgImage, width: 1200, height: 630 }],
  },
};

export const careersMetadata: Metadata = {
  title: 'Careers at Satyajan – Jobs in Solar & Energy | Hyderabad',
  description:
    'Join Satyajan Energy Solutions. We are hiring solar technicians, sales executives, engineers & more in Hyderabad. Apply now and power your career.',
  keywords: [
    'solar jobs Hyderabad', 'energy company jobs Telangana', 'solar technician job India',
    'satyajan careers', 'jobs in solar industry',
  ],
  alternates: { canonical: `${domain}/careers` },
  openGraph: {
    url: `${domain}/careers`,
    title: 'Careers at Satyajan Energy Solutions – Hyderabad',
    description: 'Join our growing team. Solar technicians, engineers & sales roles in Hyderabad. Apply now.',
    images: [{ url: defaultOgImage, width: 1200, height: 630 }],
  },
};

export const contactMetadata: Metadata = {
  title: 'Contact Us – Satyajan Energy Solutions Hyderabad',
  description:
    'Contact Satyajan Energy Solutions in Hyderabad. Call +91 8019179159 or WhatsApp us for solar, inverter & battery queries. Free consultation available.',
  keywords: [
    'contact satyajan', 'solar company contact Hyderabad', 'inverter dealer contact',
    'energy solutions Hyderabad phone', 'satyajan WhatsApp',
  ],
  alternates: { canonical: `${domain}/contactus` },
  openGraph: {
    url: `${domain}/contactus`,
    title: 'Contact Satyajan Energy Solutions – Hyderabad',
    description: 'Call or WhatsApp +91 8019179159. Free solar & power backup consultation.',
    images: [{ url: defaultOgImage, width: 1200, height: 630 }],
  },
};