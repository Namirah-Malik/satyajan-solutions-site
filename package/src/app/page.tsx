import { homeMetadata } from '@/lib/page-metadata';
import HomePageClient from '@/components/HomePageClient';

export const metadata = homeMetadata

export default function HomePage() {
  return <HomePageClient />
}