import type { Metadata } from 'next';
import HeroSub             from '@/components/shared/HeroSub';
import LoadCalculatorClient  from '@/components/inverter-calculator/LoadCalculatorClient';

export const metadata: Metadata = {
  title:       'Inverter & Battery Load Calculator | Satyajan Energy Solutions',
  description: 'Free tool to calculate the right inverter VA and battery Ah for your home. Select your appliances and get instant recommendations. Satyajan Energy Solutions, Hyderabad.',
  alternates:  { canonical: 'https://satyajan.com/inverter-calculator' },
};

export default function InverterCalculatorPage() {
  return (
    <main className="min-h-screen">
      <HeroSub
        title="Inverter & Battery Calculator."
        description="Select your appliances and backup hours — get the exact inverter and battery recommended for your home."
        badge="Free Tool"
        compact
      />
      <LoadCalculatorClient />
    </main>
  );
}