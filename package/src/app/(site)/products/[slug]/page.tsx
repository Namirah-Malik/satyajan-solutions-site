// app/(site)/products/[slug]/page.tsx

import type { Metadata } from 'next';
import { notFound }      from 'next/navigation';
import ProductDetailsClient from '@/components/ProductDetailsClient';
import { mockProducts }  from '@/mock/products';

export const dynamic = 'force-dynamic';

// ── Prisma singleton ──────────────────────────────────────────────────────────
let prisma: any = null;
async function getPrisma() {
  if (!process.env.DATABASE_URL) return null;
  if (prisma) return prisma;
  try {
    const { PrismaClient } = await import('@prisma/client');
    prisma = new PrismaClient();
    return prisma;
  } catch { return null; }
}

// ── Slug generator ────────────────────────────────────────────────────────────
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// ── MongoDB ObjectID validator ────────────────────────────────────────────────
function isMongoId(str: string): boolean {
  return /^[a-f0-9]{24}$/i.test(str);
}

// ── Fetch by slug OR by id ────────────────────────────────────────────────────
async function fetchProduct(slug: string): Promise<any | null> {
  try {
    const db = await getPrisma();
    if (db) {
      const orConditions: any[] = [
        { slug },
        { slug: { contains: slug } },
      ];
      if (isMongoId(slug)) {
        orConditions.push({ id: slug });
      }
      const product = await db.product.findFirst({
        where: { OR: orConditions },
      });
      if (product) return product;
    }
  } catch (e) {
    console.error('DB error:', e);
  }

  const mock = mockProducts.find((p: any) =>
    p.id === slug ||
    p.slug === slug ||
    generateSlug(p.name) === slug
  );
  if (mock) return mock;

  try {
    const res = await fetch(`https://satyajan.com/api/products/${slug}`, {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const data = await res.json();
      if (data?.product) return data.product;
    }
  } catch (e) { console.error('Live API error:', e); }

  return null;
}

// ── Image URL extractor ───────────────────────────────────────────────────────
function extractDirectImageUrl(img: any): string {
  if (!img) return '';
  let src =
    typeof img === 'string' ? img :
    img.src   ? img.src   :
    img.url   ? img.url   :
    img.image ? img.image : '';
  if (!src) return '';
  src = src.trim();
  if (src.includes('/api/image-proxy?url=')) {
    try { src = decodeURIComponent(src.split('/api/image-proxy?url=')[1].split('&')[0]); }
    catch { return ''; }
  }
  if (src.includes('/_next/image')) {
    try {
      const u = new URL(src.startsWith('http') ? src : `https://x.com${src}`);
      const inner = u.searchParams.get('url');
      if (inner) src = decodeURIComponent(inner);
      else return '';
    } catch { return ''; }
  }
  if (src.startsWith('//'))    src = `https:${src}`;
  if (src.startsWith('/http')) src = src.replace(/^\//, '');
  if (!src.startsWith('http')) return '';
  return src;
}

function normalizeFeatures(arr: any[]): string[] {
  if (!Array.isArray(arr)) return [];
  return arr.map((f: any) =>
    typeof f === 'string' ? f : f?.value || f?.label || f?.text || ''
  ).filter(Boolean);
}

function cleanName(name: string): string {
  return (name || '')
    .replace(/\s*wishlist\s*shareicon\s*/gi, '')
    .replace(/\s*shareicon\s*/gi, '')
    .replace(/\s*wishlist\s*/gi, '')
    .trim();
}

// ── Auto-generate tags from product name + category ───────────────────────────
function generateTags(product: any, name: string): string[] {
  const tags: string[] = [];
  const nameLower = name.toLowerCase();
  const category  = (product.category || '').toLowerCase();

  // Always add brand
  tags.push('Microtek');

  // ── Inverter tags ──────────────────────────────────────────────────────────
  if (category === 'inverter') {
    tags.push('inverter for home', 'power backup inverter', 'home inverter', 'microtek inverter');

    if (nameLower.includes('pure sine wave'))  tags.push('pure sine wave inverter');
    if (nameLower.includes('digital wave'))    tags.push('digital wave inverter');
    if (nameLower.includes('smart hybrid'))    tags.push('smart hybrid inverter', 'hybrid ups');
    if (nameLower.includes('heavy duty'))      tags.push('heavy duty inverter', 'heavy duty ups');
    if (nameLower.includes('energy saver'))    tags.push('energy saver inverter');
    if (nameLower.includes('luxe wifi') || nameLower.includes('wifi')) {
      tags.push('wifi inverter', 'smart inverter', 'microtek luxe wifi', 'smart energy wall');
    }
    if (nameLower.includes('luxe'))            tags.push('microtek luxe inverter');
    if (nameLower.includes('imerlyn'))         tags.push('microtek imerlyn', 'imerlyn inverter');
    if (nameLower.includes('super power'))     tags.push('super power inverter');
    if (nameLower.includes('jumbo') || nameLower.includes('jm sw')) {
      tags.push('jumbo home ups', 'high capacity inverter', 'commercial inverter');
    }
    if (nameLower.includes('lithium') || nameLower.includes('i-lithium')) {
      tags.push('lithium inverter', 'lithium ups', 'inverter with battery');
    }
  }

  // ── Battery tags ───────────────────────────────────────────────────────────
  if (category === 'battery') {
    tags.push('inverter battery', 'tubular battery', 'battery for inverter', 'microtek battery');
    if (nameLower.includes('tall tubular'))  tags.push('tall tubular battery');
    if (nameLower.includes('jumbo tubular')) tags.push('jumbo tubular battery');
    if (nameLower.includes('dura long'))     tags.push('microtek dura long');
    if (nameLower.includes('dura strong'))   tags.push('microtek dura strong');
    const ahMatch = nameLower.match(/(\d+)\s*ah/i);
    if (ahMatch) tags.push(`${ahMatch[1]}ah battery`, `${ahMatch[1]}ah tubular battery`);
  }

  // ── Lithium battery tags ───────────────────────────────────────────────────
  if (category === 'new lithium battery') {
    tags.push('lithium battery', 'lifepo4 battery', 'lithium inverter battery',
              'maintenance free battery', 'deep cycle battery', 'microtek lithium');
    const ahMatch = nameLower.match(/(\d+)\s*ah/i);
    if (ahMatch) tags.push(`${ahMatch[1]}ah lithium battery`);
  }

  // ── Online UPS tags ────────────────────────────────────────────────────────
  if (category === 'online ups') {
    tags.push('online ups', 'ups for computer', 'double conversion ups',
              'ups for office', 'microtek ups');
    const kvaMatch = nameLower.match(/(\d+\.?\d*)\s*kva/i);
    if (kvaMatch) tags.push(`${kvaMatch[1]}kva ups`, `${kvaMatch[1]}kva online ups`);
  }

  // ── Solar tags ─────────────────────────────────────────────────────────────
  if (category === 'solar') {
    tags.push('solar panel', 'solar energy', 'bifacial solar panel',
              'solar panel hyderabad', 'microtek solar');
    const wMatch = nameLower.match(/(\d+)\s*watt/i) || nameLower.match(/(\d+)\s*w\b/i);
    if (wMatch) tags.push(`${wMatch[1]}w solar panel`);
  }

  // ── High Capacity UPS tags ─────────────────────────────────────────────────
  if (category === 'high capacity ups') {
    tags.push('high capacity inverter', 'jumbo ups', 'commercial inverter',
              'heavy load inverter', 'microtek jumbo ups');
  }

  // ── Combo tags ─────────────────────────────────────────────────────────────
  if (category === 'combo' || category === 'combos') {
    tags.push('inverter battery combo', 'inverter combo', 'power backup combo');
  }

  // ── Extract VA/W numbers from name ─────────────────────────────────────────
  const vaMatch = nameLower.match(/(\d+)\s*va/i);
  if (vaMatch) tags.push(`${vaMatch[1]}va inverter`);

  // ── Location tags ──────────────────────────────────────────────────────────
  tags.push('inverter hyderabad', 'buy inverter online', 'satyajan energy solutions');

  // Deduplicate + limit to 14
  return [...new Set(tags)].slice(0, 14);
}

// ── Build FAQs ────────────────────────────────────────────────────────────────
function buildFAQs(product: any, name: string, price: number) {
  const faqs = [
    {
      q: `What is the price of ${name}?`,
      a: price
        ? `The price of ${name} is ₹${Number(price).toLocaleString('en-IN')} at Satyajan Energy Solutions, Hyderabad. Price may vary. Call +91 8019179159 for the latest offer.`
        : `Please contact Satyajan Energy Solutions at +91 8019179159 for the latest price of ${name}.`,
    },
    {
      q: `Where can I buy ${name} in Hyderabad?`,
      a: `You can buy ${name} at Satyajan Energy Solutions, Green Lands Colony, Karmanghat, Hyderabad — 500079. We also offer home delivery across Hyderabad. Call +91 8019179159.`,
    },
    {
      q: `What is the warranty on ${name}?`,
      a: product.features?.find((f: string) => /warranty/i.test(f)) ||
         product.salient_features?.find((f: string) => /warranty/i.test(f)) ||
         `${name} comes with a manufacturer warranty. Contact Satyajan at +91 8019179159 for warranty details.`,
    },
    {
      q: `Is EMI available for ${name}?`,
      a: `Yes. EMI options are available for ${name} at Satyajan Energy Solutions. We accept credit cards, debit cards, and bank EMI schemes. Call +91 8019179159 for details.`,
    },
    {
      q: `Is ${name} available for home delivery in Hyderabad?`,
      a: `Yes. Satyajan Energy Solutions offers home delivery of ${name} across Hyderabad, Secunderabad, and surrounding areas. Call +91 8019179159 to place your order.`,
    },
  ];

  const vaMatch = name.match(/(\d+)\s*VA/i);
  const wMatch  = name.match(/(\d+)\s*W(?:att)?/i);
  if (vaMatch || wMatch) {
    faqs.push({
      q: `How long is the backup time of ${name}?`,
      a: `Backup time depends on your load and battery capacity. For a typical home load of 3–4 fans and LED lights, a 150Ah battery with this inverter gives approximately 3–5 hours of backup. Contact us at +91 8019179159 for a personalised backup calculation.`,
    });
  }

  return faqs;
}

// ── generateMetadata ──────────────────────────────────────────────────────────
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const product  = await fetchProduct(slug);

  if (!product) {
    return {
      title:  'Product Not Found | Satyajan Energy Solutions',
      robots: { index: false, follow: false },
    };
  }

  const name  = cleanName(product.name);
  const price = Number(product.price || product.rate || 0);
  const title = `${name} – Price, Specs & Buy Online | Satyajan Energy Solutions`;

  const description = product.description
    ? `${product.description.slice(0, 140)}… Buy online at Satyajan Energy Solutions, Hyderabad.`
    : `Buy ${name} at ₹${price.toLocaleString('en-IN')}. Best price in Hyderabad. EMI available. Free delivery. Call +91 8019179159.`;

  const rawFirst = Array.isArray(product.images) ? product.images[0] : null;
  const ogImage  = extractDirectImageUrl(rawFirst) || 'https://satyajan.com/images/og-default.jpg';
  const slug_id  = product.slug || generateSlug(product.name) || slug;
  const url      = `https://satyajan.com/products/${slug_id}`;

  // Use DB tags if available, otherwise auto-generate for metadata keywords
  const tags = (product.tags && product.tags.length > 0)
    ? product.tags
    : generateTags(product, name);

  return {
    title,
    description,
    keywords: [
      name,
      `${name} price`,
      `${name} price hyderabad`,
      `buy ${name}`,
      `${name} review`,
      product.category || 'inverter battery',
      'microtek hyderabad',
      'satyajan energy solutions',
      ...tags,
    ],
    alternates: { canonical: url },
    openGraph: {
      type:        'website',
      url,
      title,
      description,
      siteName:    'Satyajan Energy Solutions',
      images:      [{ url: ogImage, width: 800, height: 600, alt: name }],
    },
    twitter: {
      card:        'summary_large_image',
      title,
      description,
      images:      [ogImage],
    },
  };
}

// ── Page component ────────────────────────────────────────────────────────────
export default async function Details(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug }  = await params;
  const dbProduct = await fetchProduct(slug);
  if (!dbProduct) return notFound();

  const name  = cleanName(dbProduct.name);
  const price = Number(dbProduct.price || dbProduct.rate || 0);

  const rawImages: any[] = Array.isArray(dbProduct.images) ? dbProduct.images : [];
  const images = rawImages
    .map((img) => {
      const src = extractDirectImageUrl(img);
      return src ? { src } : null;
    })
    .filter((img): img is { src: string } => !!img?.src);

  const productSlug = dbProduct.slug || generateSlug(dbProduct.name) || slug;

  // Use DB tags if available, otherwise auto-generate
  const tags: string[] = (dbProduct.tags && dbProduct.tags.length > 0)
    ? dbProduct.tags
    : generateTags(dbProduct, name);

  const product = {
    id:               slug,
    name,
    price,
    images,
    salient_features: normalizeFeatures(dbProduct.salient_features),
    features:         normalizeFeatures(dbProduct.features),
    specifications:   Array.isArray(dbProduct.specifications) ? dbProduct.specifications : [],
    description:      dbProduct.description || '',
    category:         dbProduct.category || '',
    categorySlug:     dbProduct.category || '',
    SKU:              dbProduct.SKU || dbProduct.sku || `SAT-${slug.slice(-6).toUpperCase()}`,
    data:             Array.isArray(dbProduct.specifications) ? dbProduct.specifications.slice(0, 3) : [],
    video:            dbProduct.video || '',
    slug:             productSlug,
    tags,             // ← pass tags to client
  };

  const formattedPrice = price
    ? `₹${price.toLocaleString('en-IN')}`
    : 'Price on request';

  // ── Structured Data ───────────────────────────────────────────────────────
  const productSchema = {
    '@context': 'https://schema.org',
    '@type':    'Product',
    name,
    description: dbProduct.description || '',
    image:       images.map((i) => i.src),
    sku:         product.SKU,
    brand:       { '@type': 'Brand', name: 'Microtek' },
    keywords:    tags.join(', '),   // ← tags in schema
    seller: {
      '@type': 'Organization',
      name:    'Satyajan Energy Solutions',
      url:     'https://satyajan.com',
    },
    offers: {
      '@type':         'Offer',
      url:             `https://satyajan.com/products/${product.slug}`,
      priceCurrency:   'INR',
      price:           price || undefined,
      priceValidUntil: '2026-12-31',
      availability:    'https://schema.org/InStock',
      itemCondition:   'https://schema.org/NewCondition',
      seller: {
        '@type': 'Organization',
        name:    'Satyajan Energy Solutions',
      },
    },
    // Uncomment when you have real reviews:
    // aggregateRating: {
    //   '@type':      'AggregateRating',
    //   ratingValue:  '4.5',
    //   reviewCount:  '32',
    //   bestRating:   '5',
    //   worstRating:  '1',
    // },
  };

  const faqs = buildFAQs(dbProduct, name, price);
  const faqSchema = {
    '@context':  'https://schema.org',
    '@type':     'FAQPage',
    mainEntity:  faqs.map((f) => ({
      '@type':        'Question',
      name:           f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type':    'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home',     item: 'https://satyajan.com' },
      { '@type': 'ListItem', position: 2, name: 'Products', item: 'https://satyajan.com/products' },
      ...(product.category ? [{
        '@type':  'ListItem',
        position: 3,
        name:     product.category,
        item:     `https://satyajan.com/products?category=${encodeURIComponent(product.category)}`,
      }] : []),
      {
        '@type':   'ListItem',
        position:  product.category ? 4 : 3,
        name:      name,
        item:      `https://satyajan.com/products/${product.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ProductDetailsClient
        product={product}
        images={images}
        formattedPrice={formattedPrice}
        tabItems={[]}
      />
    </>
  );
}