/**
 * JsonLd.tsx  –  JSON-LD Structured Data Components
 * ─────────────────────────────────────────────────────────────
 * Deploy to: src/components/seo/JsonLd.tsx
 *
 * HOW TO USE:
 *   1. Import the relevant component into any page
 *   2. Render it anywhere inside the page (renders nothing visible)
 *
 * Example:
 *   import { OrganizationJsonLd } from '@/components/seo/JsonLd'
 *   // inside page component:
 *   <OrganizationJsonLd />
 */

import React from 'react';
import { SEO } from '@/lib/seo.config';

// ─────────────────────────────────────────────────────────────────────────────
// 1. ORGANIZATION  –  add to Home page & root layout
//    Tells Google who you are: name, logo, contact, social links
// ─────────────────────────────────────────────────────────────────────────────
export function OrganizationJsonLd() {
  const schema = {
    '@context':   'https://schema.org',
    '@type':      'Organization',
    name:         'Satyajan Energy Solutions',
    url:          SEO.domain,
    logo:         `${SEO.domain}/logo.png`,
    description:  SEO.defaultDescription,
    telephone:    SEO.phone,
    email:        SEO.email,
    address: {
      '@type':           'PostalAddress',
      addressLocality:   SEO.address.city,
      addressRegion:     SEO.address.state,
      addressCountry:    SEO.address.country,
    },
    sameAs: [
      'https://www.facebook.com/satyajanenergy',
      'https://www.instagram.com/satyajanenergy',
      `https://wa.me/918019179159`,
    ],
    contactPoint: {
      '@type':            'ContactPoint',
      telephone:          SEO.phone,
      contactType:        'customer service',
      areaServed:         'IN',
      availableLanguage:  ['English', 'Telugu', 'Hindi'],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. LOCAL BUSINESS  –  add to Home & Contact pages
//    Enables Google Maps "Knowledge Panel" and local search results
// ─────────────────────────────────────────────────────────────────────────────
export function LocalBusinessJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type':    'LocalBusiness',
    name:       'Satyajan Energy Solutions',
    image:      SEO.defaultOgImage,
    url:        SEO.domain,
    telephone:  SEO.phone,
    priceRange: '₹₹',
    address: {
      '@type':           'PostalAddress',
      streetAddress:     'Hyderabad',
      addressLocality:   'Hyderabad',
      addressRegion:     'Telangana',
      postalCode:        '500000',
      addressCountry:    'IN',
    },
    geo: {
      '@type':     'GeoCoordinates',
      latitude:    17.3343,
      longitude:   78.5387,
    },
    openingHoursSpecification: [
      {
        '@type':    'OpeningHoursSpecification',
        dayOfWeek:  ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens:      '09:00',
        closes:     '19:00',
      },
    ],
    sameAs: [
      'https://www.facebook.com/satyajanenergy',
      'https://www.instagram.com/satyajanenergy',
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. PRODUCT  –  add to each product detail page
//    Enables Google Shopping rich results with price, rating, availability
// ─────────────────────────────────────────────────────────────────────────────
interface ProductJsonLdProps {
  product: {
    name:         string;
    description:  string;
    price:        number;
    images:       string[];
    slug:         string;
    SKU:          string;
    category?:    string;
  };
}

export function ProductJsonLd({ product }: ProductJsonLdProps) {
  const schema = {
    '@context':   'https://schema.org',
    '@type':      'Product',
    name:         product.name,
    description:  product.description,
    sku:          product.SKU,
    brand: {
      '@type': 'Brand',
      name:    'Microtek',
    },
    image:        product.images,
    url:          `${SEO.domain}/products/${product.slug}`,
    category:     product.category ?? 'Energy Products',
    offers: {
      '@type':          'Offer',
      url:              `${SEO.domain}/products/${product.slug}`,
      priceCurrency:    'INR',
      price:            product.price,
      priceValidUntil:  new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      itemCondition:    'https://schema.org/NewCondition',
      availability:     'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name:    'Satyajan Energy Solutions',
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. BLOG POST (Article)  –  add to each blog post page
//    Enables Google News rich results and article previews
// ─────────────────────────────────────────────────────────────────────────────
interface BlogPostJsonLdProps {
  post: {
    title:         string;
    excerpt:       string;
    slug:          string;
    publishedDate: string;
    featuredImage: string;
    readTime?:     string;
  };
}

export function BlogPostJsonLd({ post }: BlogPostJsonLdProps) {
  const schema = {
    '@context':        'https://schema.org',
    '@type':           'Article',
    headline:          post.title,
    description:       post.excerpt,
    image:             post.featuredImage,
    url:               `${SEO.domain}/blogs/${post.slug}`,
    datePublished:     post.publishedDate,
    dateModified:      post.publishedDate,
    author: {
      '@type': 'Organization',
      name:    'Satyajan Energy Solutions',
      url:     SEO.domain,
    },
    publisher: {
      '@type': 'Organization',
      name:    'Satyajan Energy Solutions',
      logo: {
        '@type': 'ImageObject',
        url:     `${SEO.domain}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id':   `${SEO.domain}/blogs/${post.slug}`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. FAQ  –  add to Home & Services pages
//    Shows FAQ accordion directly in Google search results (huge CTR boost)
// ─────────────────────────────────────────────────────────────────────────────
interface FaqJsonLdProps {
  faqs: { question: string; answer: string }[];
}

export function FaqJsonLd({ faqs }: FaqJsonLdProps) {
  const schema = {
    '@context':  'https://schema.org',
    '@type':     'FAQPage',
    mainEntity:  faqs.map((f) => ({
      '@type':        'Question',
      name:           f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text:    f.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. BREADCRUMB  –  add to Products, Blogs, and any sub-pages
//    Shows breadcrumb path in Google search results
// ─────────────────────────────────────────────────────────────────────────────
interface BreadcrumbJsonLdProps {
  items: { name: string; url: string }[];
}

export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
  const schema = {
    '@context':        'https://schema.org',
    '@type':           'BreadcrumbList',
    itemListElement:   items.map((item, index) => ({
      '@type':    'ListItem',
      position:   index + 1,
      name:       item.name,
      item:       item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}