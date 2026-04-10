import type { Metadata } from 'next'
import { Bricolage_Grotesque } from 'next/font/google'
// @ts-expect-error
import './globals.css'
import { WishlistProvider } from '@/context/WishlistContext';

import Header from '@/components/Layout/Header'
import Footer from '@/components/Layout/Footer'
import NextTopLoader from 'nextjs-toploader';
//import ScrollToTop from '@/components/shared/ScrollToTop';
import Chatbox from '@/components/utils/chatbot';
import CallMeBackTrigger from '@/components/CallMeBackTrigger';
import { CartProvider } from '@/context/CartContext';

const font = Bricolage_Grotesque({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default:  'Satyajan Energy Solutions – Solar, Inverter & Battery in Hyderabad',
    template: '%s | Satyajan Energy Solutions',
  },
  description:
    'Authorised Microtek dealer in Hyderabad. Buy solar panels, inverters, UPS & batteries. Save up to 80% on electricity bills. Easy EMI. Free consultation. Call +91 8019179159.',
  keywords: [
    'solar panels Hyderabad', 'Microtek inverter Hyderabad', 'battery dealer Hyderabad',
    'solar installation Hyderabad', 'power backup Hyderabad', 'UPS Hyderabad',
    'satyajan energy solutions', 'solar company Telangana',
  ],
  openGraph: {
    type:        'website',
    locale:      'en_IN',
    url:         'https://satyajan.com',
    siteName:    'Satyajan Energy Solutions',
    title:       'Satyajan Energy Solutions – Solar, Inverter & Battery in Hyderabad',
    description: 'Authorised Microtek dealer in Hyderabad. Solar panels, inverters, batteries & UPS. Easy EMI.',
    images: [{ url: 'https://satyajan.com/images/og-default.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card:        'summary_large_image',
    title:       'Satyajan Energy Solutions – Solar, Inverter & Battery in Hyderabad',
    description: 'Authorised Microtek dealer in Hyderabad. Solar panels, inverters & batteries. Easy EMI.',
    images:      ['https://satyajan.com/images/og-default.jpg'],
  },
  robots: { index: true, follow: true },
  icons: { icon: '/favicon.ico', apple: '/apple-touch-icon.png' },
  manifest: '/site.webmanifest',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        {/* ── Google Analytics 4 ── */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-ZBB0L9QBHX"
        />
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
  )
}