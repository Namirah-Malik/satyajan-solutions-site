import { Icon } from '@iconify/react';
import Image from 'next/image';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

// ── Design system ────────────────────────────────────────────────────────────
const GlassCard = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white/40 backdrop-blur-lg rounded-3xl shadow-xl border border-white/30 transition-all duration-300 hover:shadow-2xl ${className}`}>
    {children}
  </div>
);

const PlayfulIcon = ({ icon, ringColor, bgColor }: { icon: string; ringColor: string; bgColor: string }) => (
  <div className={`relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 ${bgColor} rounded-full shadow-lg mb-3 flex-shrink-0`}>
    <span className={`absolute inset-0 rounded-full animate-spin-slow border-4 ${ringColor} opacity-30`} />
    <Icon icon={icon} className="text-xl sm:text-2xl text-white z-10" />
  </div>
);

// ── FAQ data ──────────────────────────────────────────────────────────────────
const faqs = [
  {
    question: 'What services does Satyajan Energy Solutions offer?',
    answer: 'We provide solar panels, UPS systems, and battery solutions for homes and businesses. Our team handles everything from consultation to installation and maintenance.',
    icon: 'ph:solar-panel-fill',
    bg: 'bg-primary',
    ring: 'border-primary',
  },
  {
    question: 'How much can I save on electricity bills with solar?',
    answer: 'Most customers save 70-90% on their monthly electricity bills. The exact savings depend on your current usage and system size.',
    icon: 'ph:currency-inr-fill',
    bg: 'bg-gradient-to-br from-emerald-400 to-green-500',
    ring: 'border-emerald-400',
  },
  {
    question: 'How long do solar panels last?',
    answer: 'Our solar panels work efficiently for 25+ years with minimal maintenance. They come with performance warranties to guarantee long-term reliability.',
    icon: 'ph:clock-countdown-fill',
    bg: 'bg-gradient-to-br from-yellow-400 to-orange-400',
    ring: 'border-yellow-400',
  },
  {
    question: 'How do I know what solar system size I need?',
    answer: 'Our engineers visit your property, check your electricity bills, and design a system that matches your energy needs and roof space.',
    icon: 'ph:ruler-fill',
    bg: 'bg-gradient-to-br from-blue-400 to-indigo-500',
    ring: 'border-blue-400',
  },
];

// ── Quick stats ───────────────────────────────────────────────────────────────
const stats = [
  { icon: 'ph:house-fill', bg: 'bg-primary', ring: 'border-primary', value: '500+', label: 'Happy Customers' },
  { icon: 'ph:solar-panel-fill', bg: 'bg-gradient-to-br from-yellow-400 to-orange-400', ring: 'border-yellow-400', value: '1MW+', label: 'Solar Installed' },
  { icon: 'ph:star-fill', bg: 'bg-gradient-to-br from-emerald-400 to-green-500', ring: 'border-emerald-400', value: '4.9★', label: 'Customer Rating' },
  { icon: 'ph:clock-fill', bg: 'bg-gradient-to-br from-blue-400 to-indigo-500', ring: 'border-blue-400', value: '24/7', label: 'Support' },
];

const FAQ: React.FC = () => {
  return (
    <section id="faqs" className="py-14 sm:py-20 px-3 sm:px-4">
      <div className="max-w-7xl mx-auto">

        {/* ── Section header ──────────────────────────────────────── */}
        <div className="text-center mb-10 sm:mb-14">
          <p className="inline-flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-widest px-3 py-1 bg-primary/10 rounded-full mb-4">
            <Icon icon="ph:question-fill" className="text-primary" width={16} />
            FAQs
          </p>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900 drop-shadow-lg tracking-tight mb-3">
            Everything about Solar Products
          </h2>
          <p className="text-sm sm:text-lg text-gray-600 font-medium max-w-2xl mx-auto leading-relaxed">
            Choosing the right solar products can be overwhelming. Here are the most common questions answered.
          </p>
        </div>

        {/* ── Main grid ───────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-start mb-10 sm:mb-14">

          {/* Image side */}
          <GlassCard className="overflow-hidden p-0 rounded-3xl">
            <div className="relative w-full aspect-[4/3] sm:aspect-[3/2] lg:aspect-auto lg:h-[580px]">
              <Image
                src="/images/faqs/faq-image.jpg"
                alt="FAQ image"
                fill
                className="object-cover rounded-3xl"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark/60 via-transparent to-transparent rounded-3xl" />

              {/* Stats overlay */}
              <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                  {stats.map((s, i) => (
                    <div key={i} className="flex flex-col items-center text-center p-2 sm:p-3 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30">
                      <PlayfulIcon icon={s.icon} ringColor={s.ring} bgColor={s.bg} />
                      <span className="text-sm sm:text-base font-extrabold text-white">{s.value}</span>
                      <span className="text-xs text-white/70 font-medium">{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </GlassCard>

          {/* FAQ side */}
          <div className="flex flex-col gap-4">
            <GlassCard className="p-5 sm:p-7">
              <p className="inline-flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-widest px-3 py-1 bg-primary/10 rounded-full mb-3">
                <Icon icon="ph:solar-panel-fill" className="text-primary" width={14} />
                Common Questions
              </p>
              <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-1 tracking-tight">
                Everything about Solar Products
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 font-medium leading-relaxed mb-5">
                We know choosing the right solar products can be overwhelming. Here are some frequently asked questions to help guide you.
              </p>

              <Accordion type="single" defaultValue="item-0" collapsible className="w-full flex flex-col gap-3">
                {faqs.map((faq, idx) => (
                  <AccordionItem
                    key={idx}
                    value={`item-${idx}`}
                    className="bg-white/50 rounded-2xl border border-white/40 px-4 overflow-hidden data-[state=open]:bg-primary/5 transition-colors"
                  >
                    <AccordionTrigger className="text-xs sm:text-sm font-bold text-gray-900 py-4 hover:no-underline text-left">
                      <div className="flex items-center gap-3">
                        <div className={`relative flex items-center justify-center w-8 h-8 ${faq.bg} rounded-full shadow flex-shrink-0`}>
                          <Icon icon={faq.icon} className="text-white text-sm z-10" />
                        </div>
                        {faq.question}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-xs sm:text-sm text-gray-600 font-medium leading-relaxed pb-4 pl-11">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </GlassCard>

            {/* CTA card */}
            <GlassCard className="p-5 sm:p-6 bg-white/60 text-center">
              <h4 className="text-base sm:text-lg font-extrabold text-gray-900 mb-2 tracking-tight">Still have questions?</h4>
              <p className="text-xs sm:text-sm text-gray-500 font-medium mb-4">Our experts are ready to help you choose the right system.</p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <a
                  href="https://wa.me/918019179159"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-primary text-white px-5 py-2.5 rounded-full font-bold hover:bg-dark transition-colors shadow-md text-xs sm:text-sm"
                >
                  <Icon icon="ph:whatsapp-logo-fill" width={16} />
                  Chat on WhatsApp
                </a>
                <a
                  href="/contactus"
                  className="inline-flex items-center justify-center gap-2 border-2 border-primary text-primary px-5 py-2.5 rounded-full font-bold hover:bg-primary hover:text-white transition-colors text-xs sm:text-sm"
                >
                  <Icon icon="ph:envelope-fill" width={16} />
                  Contact Us
                </a>
              </div>
            </GlassCard>
          </div>
        </div>

      </div>
    </section>
  );
};

export default FAQ;