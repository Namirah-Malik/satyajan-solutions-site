// app/layout.tsx
import type { Metadata } from 'next';
import { Bricolage_Grotesque } from 'next/font/google';
// @ts-expect-error
import './globals.css';
import { WishlistProvider } from '@/context/WishlistContext';
import Header           from '@/components/Layout/Header';
import Footer           from '@/components/Layout/Footer';
import NextTopLoader    from 'nextjs-toploader';
import Chatbox          from '@/components/utils/chatbot';
import CallMeBackTrigger from '@/components/CallMeBackTrigger';
import { CartProvider } from '@/context/CartContext';

const font = Bricolage_Grotesque({ subsets: ['latin'], display: 'swap' });

// ── Site-wide metadata ────────────────────────────────────────────────────────
export const metadata: Metadata = {
  // metadataBase tells Next.js the canonical domain for all relative URLs
  metadataBase: new URL('https://satyajan.com'),

  title: {
    default:  'Buy Microtek Inverter & Battery in Hyderabad | Satyajan Energy Solutions',
    template: '%s | Satyajan Energy Solutions',
  },
  description:
    'Authorised Microtek dealer in Hyderabad. Buy pure sine wave inverters, tubular batteries, solar panels & online UPS. 101+ products. Free delivery. Easy EMI. Call +91 8019179159.',

  keywords: [
    'inverter battery hyderabad',
    'microtek inverter hyderabad',
    'buy inverter online hyderabad',
    'tubular battery price hyderabad',
    'solar panel hyderabad',
    'online ups hyderabad',
    'power backup solutions hyderabad',
    'microtek dealer hyderabad',
    'satyajan energy solutions',
    'solar company telangana',
  ],

  // ── Canonical & alternate ─────────────────────────────────────────────────
  alternates: {
    canonical: 'https://satyajan.com',
  },

  // ── Open Graph ───────────────────────────────────────────────────────────
  openGraph: {
    type:        'website',
    locale:      'en_IN',
    url:         'https://satyajan.com',
    siteName:    'Satyajan Energy Solutions',
    title:       'Buy Microtek Inverter & Battery in Hyderabad | Satyajan Energy Solutions',
    description: 'Authorised Microtek dealer in Hyderabad. Solar panels, inverters, batteries & UPS. 101+ products. Easy EMI. Free delivery.',
    images: [{
      url:    'https://satyajan.com/images/og-default.jpg',
      width:  1200,
      height: 630,
      alt:    'Satyajan Energy Solutions – Inverter, Battery & Solar in Hyderabad',
    }],
  },

  // ── Twitter Card ─────────────────────────────────────────────────────────
  twitter: {
    card:        'summary_large_image',
    title:       'Buy Microtek Inverter & Battery in Hyderabad | Satyajan Energy Solutions',
    description: 'Authorised Microtek dealer in Hyderabad. Solar panels, inverters & batteries. Easy EMI.',
    images:      ['https://satyajan.com/images/og-default.jpg'],
  },

  // ── Crawling ──────────────────────────────────────────────────────────────
  robots: {
    index:             true,
    follow:            true,
    googleBot: {
      index:           true,
      follow:          true,
      'max-image-preview':   'large',
      'max-snippet':         -1,
      'max-video-preview':   -1,
    },
  },

  // ── Icons ────────────────────────────────────────────────────────────────
  icons: {
    icon:  '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',

  // ── Google Search Console verification ───────────────────────────────────
  // Get this from: https://search.google.com/search-console
  // Select "HTML tag" method → copy the content= value → paste below
  verification: {
    google: 'DuItGjg2FPhjS2UzApHHpW7H28gAQBZrvYOHoDaxzLk',
  
  },
};

// ── Organisation Schema (site-wide) ──────────────────────────────────────────
const orgSchema = {
  '@context':   'https://schema.org',
  '@type':      'LocalBusiness',
  '@id':        'https://satyajan.com/#organization',
  name:         'Satyajan Energy Solutions Private Limited',
  url:          'https://satyajan.com',
  logo:         'https://satyajan.com/images/logo.png',
  description:  'Authorised Microtek dealer in Hyderabad. Solar panels, inverters, batteries & UPS.',
  telephone:    '+91-8019179159',
  email:        'info@satyajan.com',
  address: {
    '@type':           'PostalAddress',
    streetAddress:     'P. No. 47, Green Lands Colony, Karmanghat',
    addressLocality:   'Hyderabad',
    addressRegion:     'Telangana',
    postalCode:        '500079',
    addressCountry:    'IN',
  },
  geo: {
    '@type':     'GeoCoordinates',
    latitude:    17.3397,
    longitude:   78.5174,
  },
  openingHoursSpecification: {
    '@type':    'OpeningHoursSpecification',
    dayOfWeek:  ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
    opens:      '09:00',
    closes:     '19:00',
  },
  sameAs: [
    'https://www.indiamart.com/satyajan-energy-solutions',
    // Add your Google Business Profile URL here once created
  ],
  priceRange: '₹₹',
  currenciesAccepted: 'INR',
  paymentAccepted: 'Cash, Credit Card, Debit Card, UPI, Net Banking, EMI',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* ── Organisation Schema ── */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />

        {/* ── Google Analytics 4 ── */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-ZBB0L9QBHX" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-ZBB0L9QBHX');
            `,
          }}
        />
      </head>

      <body className={`${font.className} bg-white antialiased`} suppressHydrationWarning>
        <WishlistProvider>
          <CartProvider>
            <NextTopLoader color="#07be8a" />
            <Header />
            {children}
            <Footer />
            <CallMeBackTrigger />
            <Chatbox />
          </CartProvider>
        </WishlistProvider>
      </body>
    </html>
  );
}