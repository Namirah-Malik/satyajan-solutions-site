import type { Metadata } from 'next';
import HeroSub        from '@/components/shared/HeroSub';
import ProductsClient from './ProductsClient';

const BASE = 'https://satyajan.com';

// ── Per-category metadata with canonical ─────────────────────────────────────
const categoryMeta: Record<string, { title: string; description: string }> = {
  'Inverter': {
    title:       'Buy Microtek Inverter in Hyderabad | Best Price & EMI | Satyajan Energy Solutions',
    description: 'Buy Microtek pure sine wave inverters in Hyderabad. Energy Saver, Heavy Duty, Smart Hybrid, iMerlyn, Luxe series. Best price, free delivery, easy EMI. Call +91 8019179159.',
  },
  'Battery': {
    title:       'Inverter Battery Price in Hyderabad | Tubular Battery | Satyajan Energy Solutions',
    description: 'Buy Microtek tubular and tall tubular inverter batteries in Hyderabad. 130Ah–250Ah. Best price, 5-year warranty, free delivery. Call +91 8019179159.',
  },
  'Solar': {
    title:       'Solar Panel Price in Hyderabad | Solar Installation | Satyajan Energy Solutions',
    description: 'Buy Microtek solar panels in Hyderabad. Bi-facial 550W panels, grid-tie inverters, solar batteries. Installation included. EMI available. Call +91 8019179159.',
  },
  'ONLINE UPS': {
    title:       'Online UPS Price in Hyderabad | Buy UPS System | Satyajan Energy Solutions',
    description: 'Buy Microtek online UPS systems in Hyderabad. 1KVA to 6KVA double-conversion UPS for offices, server rooms, businesses. Best price. Call +91 8019179159.',
  },
  'New Lithium Battery': {
    title:       'Lithium Battery for Inverter in Hyderabad | LiFePO4 | Satyajan Energy Solutions',
    description: 'Buy Microtek LiFePO4 lithium batteries for inverters in Hyderabad. 100Ah, 3500+ cycles, fast charging. Best price, 5-year warranty. Call +91 8019179159.',
  },
  'High Capacity UPS': {
    title:       'High Capacity UPS in Hyderabad | Jumbo Home UPS | Satyajan Energy Solutions',
    description: 'Buy Microtek Jumbo Home UPS and high-capacity inverters in Hyderabad. 2KVA to 8KVA. Best price, free delivery, easy EMI. Call +91 8019179159.',
  },
  'Combo': {
    title:       'Inverter Battery Combo in Hyderabad | Best Price | Satyajan Energy Solutions',
    description: 'Buy Microtek inverter + battery combo packages in Hyderabad. Ready-to-install sets at the best price. EMI available. Call +91 8019179159.',
  },
};

// ── generateMetadata ──────────────────────────────────────────────────────────
export async function generateMetadata(
  { searchParams }: { searchParams: Promise<{ category?: string }> }
): Promise<Metadata> {
  const { category } = await searchParams;

  // ✅ Category page canonical
  if (category && categoryMeta[category]) {
    const { title, description } = categoryMeta[category];
    const url = `${BASE}/products?category=${encodeURIComponent(category)}`;
    return {
      title,
      description,
      alternates: { canonical: url },
      openGraph: {
        type:        'website',
        url,
        title,
        description,
        siteName:    'Satyajan Energy Solutions',
        images: [{
          url:    `${BASE}/images/og-default.jpg`,
          width:  1200,
          height: 630,
          alt:    `${category} products — Satyajan Energy Solutions`,
        }],
      },
      twitter: {
        card:        'summary_large_image',
        title,
        description,
        images:      [`${BASE}/images/og-default.jpg`],
      },
    };
  }

  // ✅ All products page canonical
  return {
    title:       'Buy Microtek Inverter, Battery & Solar in Hyderabad | Satyajan Energy Solutions',
    description: 'Shop 101+ Microtek products — inverters, batteries, solar panels, online UPS & lithium batteries. Best price in Hyderabad. Free delivery. Easy EMI. Call +91 8019179159.',
    alternates: { canonical: `${BASE}/products` },
    openGraph: {
      type:        'website',
      url:         `${BASE}/products`,
      title:       'Buy Microtek Inverter, Battery & Solar in Hyderabad | Satyajan Energy Solutions',
      description: 'Shop 101+ Microtek products in Hyderabad — inverters, batteries, solar, UPS. Best price, free delivery, easy EMI.',
      siteName:    'Satyajan Energy Solutions',
      images: [{
        url:    `${BASE}/images/og-default.jpg`,
        width:  1200,
        height: 630,
        alt:    'Microtek Products — Satyajan Energy Solutions Hyderabad',
      }],
    },
    twitter: {
      card:        'summary_large_image',
      title:       'Buy Microtek Inverter, Battery & Solar | Satyajan Energy Solutions',
      description: '101+ Microtek products — inverters, batteries, solar, UPS. Best price in Hyderabad.',
      images:      [`${BASE}/images/og-default.jpg`],
    },
  };
}

// ── Page component ────────────────────────────────────────────────────────────
const Page = async ({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) => {
  const { category } = await searchParams;

  const heroTitle = category
    ? `${category} Products`
    : 'Discover Our Products.';

  const heroDescription = category
    ? `Browse our full range of ${category} products — best prices in Hyderabad with EMI available.`
    : 'Explore 101+ Microtek inverters, batteries, solar panels & UPS — crafted for reliable power backup.';

  return (
    <>
      <HeroSub
        title={heroTitle}
        description={heroDescription}
        badge="Products"
      />
      <ProductsClient />
    </>
  );
};

export default Page;