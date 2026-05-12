import type { Metadata } from 'next';
import { homeMetadata } from '@/lib/page-metadata';
import HomePageClient from '@/components/HomePageClient';

export const metadata: Metadata = {
  ...homeMetadata,
  alternates: {
    canonical: 'https://satyajan.com',
  },
}

export default function HomePage() {
  return <HomePageClient />
}