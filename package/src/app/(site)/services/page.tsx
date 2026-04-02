import { servicesMetadata } from '@/lib/page-metadata';
import ServicesPage from './ServicesPage';

export const metadata = servicesMetadata;

export default function Page() {
  return <ServicesPage />;
}