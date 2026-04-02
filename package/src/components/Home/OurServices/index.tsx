'use client';

import { useRouter } from 'next/navigation';
import { ArrowRight, Compass, Wrench, Settings, FileText, Calculator, Zap, Calendar, Activity, RefreshCw, Recycle, MapPin, AlertCircle, TrendingUp, Headphones } from 'lucide-react';
import { solarServices, powerBackupServices, batteryServices, technicalSupport } from '@/data/servicesData';

const iconMap: { [key: string]: React.ComponentType<any> } = {
  'Compass': Compass,
  'Wrench': Wrench,
  'Settings': Settings,
  'FileText': FileText,
  'Calculator': Calculator,
  'Zap': Zap,
  'Calendar': Calendar,
  'Activity': Activity,
  'RefreshCw': RefreshCw,
  'Recycle': Recycle,
  'MapPin': MapPin,
  'AlertCircle': AlertCircle,
  'TrendingUp': TrendingUp,
  'Headphones': Headphones,
};

export default function OurServices() {
  const router = useRouter();

  // Combine all services for display
  const allServices = [
    ...solarServices.slice(0, 4),
    ...powerBackupServices.slice(0, 4),
    ...batteryServices.slice(0, 4),
    ...technicalSupport.slice(0, 4),
  ];

  const ServiceCard = ({ service }: { service: any }) => {
    const Icon = iconMap[service.icon] || Activity;
    return (
      <div 
        onClick={() => router.push('/services')}
        className="group hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:border-blue-300 h-full rounded-lg p-6 bg-white cursor-pointer hover:bg-blue-50"
      >
        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
          <Icon className="w-7 h-7 text-white" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
          {service.title}
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
          {service.description}
        </p>
        <div className="mt-4 flex items-center gap-2 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-sm font-semibold">Learn More</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    );
  };

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-blue-600 text-base font-semibold mb-2">OUR COMPLETE SOLUTIONS</p>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Comprehensive Services
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            From solar installation to battery maintenance, we provide end-to-end energy solutions with professional installation, maintenance, and 24/7 support
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {allServices.map((service, index) => (
            <ServiceCard key={index} service={service} />
          ))}
        </div>

        {/* View All Services Button */}
        <div className="flex justify-center">
          <button
            onClick={() => router.push('/services')}
            className="bg-blue-600 text-white hover:bg-blue-700 px-8 py-3 rounded-lg font-semibold inline-flex items-center gap-2 transition-all duration-300 hover:shadow-lg"
          >
            View All Services
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
