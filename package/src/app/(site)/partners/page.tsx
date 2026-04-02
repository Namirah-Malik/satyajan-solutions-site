import { Metadata } from 'next'
import { Icon } from '@iconify/react'
import Link from 'next/link'
import HeroSub from '@/components/shared/HeroSub'

export const metadata: Metadata = {
  title: 'Partners',
  description:
    "Join Satyajan Energy Solutions dealer network and grow your business with India's trusted energy solutions distributor.",
}

const GlassCard = ({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) => (
  <div
    className={`bg-white/40 backdrop-blur-lg rounded-3xl shadow-xl border border-white/30 transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl ${className}`}
  >
    {children}
  </div>
)

const PlayfulIcon = ({
  icon,
  ringColor,
  bgColor,
}: {
  icon: string
  ringColor: string
  bgColor: string
}) => (
  <div className={`relative flex items-center justify-center w-14 h-14 ${bgColor} rounded-full shadow-lg mb-2`}>
    <span className={`absolute inset-0 rounded-full animate-spin-slow border-4 ${ringColor} opacity-30`} />
    <Icon icon={icon} className="text-2xl text-white z-10" width={26} height={26} />
  </div>
)

const WHY_BENEFITS = [
  {
    icon: 'ph:trend-up-fill',
    ringColor: 'border-primary',
    bgColor: 'bg-primary',
    title: 'High Margins',
    desc: 'Competitive margins to maximize your profitability',
  },
  {
    icon: 'ph:users-three-fill',
    ringColor: 'border-emerald-400',
    bgColor: 'bg-gradient-to-br from-emerald-400 to-green-500',
    title: 'Dedicated Support',
    desc: '24/7 technical and sales support from our team',
  },
  {
    icon: 'ph:gift-fill',
    ringColor: 'border-yellow-400',
    bgColor: 'bg-gradient-to-br from-yellow-400 to-orange-400',
    title: 'Marketing Materials',
    desc: 'Free product catalogs and digital assets',
  },
  {
    icon: 'ph:buildings-fill',
    ringColor: 'border-blue-400',
    bgColor: 'bg-gradient-to-br from-blue-400 to-indigo-500',
    title: 'Business Training',
    desc: 'Comprehensive product and sales training',
  },
  {
    icon: 'ph:star-fill',
    ringColor: 'border-purple-400',
    bgColor: 'bg-gradient-to-br from-purple-400 to-violet-500',
    title: 'Premium Products',
    desc: 'Access to complete range of power solutions',
  },
  {
    icon: 'ph:shield-check-fill',
    ringColor: 'border-pink-400',
    bgColor: 'bg-gradient-to-br from-pink-400 to-rose-400',
    title: 'Warranty Support',
    desc: 'We handle claims — you focus on sales',
  },
]

const DEALER_BENEFITS = [
  'Exclusive territory rights with competitive dealer margins',
  'Complete product training and technical certification',
  'Marketing support with promotional materials',
  'Fast delivery and logistics support across India',
  'Dedicated dealer support team',
  'Access to latest products and technologies',
]

const STATS = [
  {
    icon: 'ph:users-fill',
    ringColor: 'border-primary',
    bgColor: 'bg-primary',
    value: '250+',
    label: 'Active Dealers',
  },
  {
    icon: 'ph:map-pin-fill',
    ringColor: 'border-emerald-400',
    bgColor: 'bg-gradient-to-br from-emerald-400 to-green-500',
    value: '500+',
    label: 'Delivery Points',
  },
  {
    icon: 'ph:handshake-fill',
    ringColor: 'border-yellow-400',
    bgColor: 'bg-gradient-to-br from-yellow-400 to-orange-400',
    value: '10,000+',
    label: 'Happy Customers',
  },
  {
    icon: 'ph:calendar-fill',
    ringColor: 'border-blue-400',
    bgColor: 'bg-gradient-to-br from-blue-400 to-indigo-500',
    value: '25 Yrs',
    label: 'Solar Warranty',
  },
]

const inputClass =
  'w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors text-sm bg-white/70'
const labelClass = 'block text-sm font-semibold text-gray-800 mb-1'

const PartnersPage = () => {
  return (
    <main className="min-h-screen">
      <HeroSub
        title="Partner With Us."
        description="Grow your business with Hyderabad's most trusted energy solutions distributor."
        badge="Partners"
      />

      {/* Why Become a Distributor */}
      <section className="px-4 max-w-7xl mx-auto !pt-0 pb-6">
        <div className="text-start mb-8">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2 drop-shadow-lg tracking-tight">
            Why Become a Distributor?
          </h2>
          <p className="text-base text-gray-600 max-w-4xl mr-auto font-medium">
            Everything you need to build a successful energy business.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
          {WHY_BENEFITS.map((b, i) => (
            <GlassCard key={i} className="flex flex-col items-center text-center p-6">
              <PlayfulIcon icon={b.icon} ringColor={b.ringColor} bgColor={b.bgColor} />
              <h4 className="text-base font-bold text-gray-900 mb-1 tracking-tight">{b.title}</h4>
              <p className="text-xs text-gray-600 font-medium leading-relaxed">{b.desc}</p>
            </GlassCard>
          ))}
        </div>

        {/* Stats Banner */}
        <GlassCard className="mb-8 p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {STATS.map((s, i) => (
              <div key={i} className="flex flex-col items-center">
                <PlayfulIcon icon={s.icon} ringColor={s.ringColor} bgColor={s.bgColor} />
                <div className="text-2xl font-extrabold text-gray-900 tracking-tight">{s.value}</div>
                <div className="text-xs text-gray-500 font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Join Dealer Network */}
        <div className="text-start mb-8">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2 drop-shadow-lg tracking-tight">
            Join Our Dealer Network
          </h2>
          <p className="text-base text-gray-600 max-w-4xl mr-auto font-medium">
            Become a part of India&apos;s fastest-growing energy solutions network.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-stretch mb-6">
          {/* Left: Benefits */}
          <div className="flex flex-col gap-6 h-full">
            <GlassCard className="p-6 flex-1">
              <h3 className="text-xl font-bold text-emerald-800 mb-4 tracking-tight">Dealer Benefits</h3>
              <ul className="space-y-3">
                {DEALER_BENEFITS.map((b, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <div className="w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                      <Icon icon="ph:check-circle-fill" className="text-primary" width={14} height={14} />
                    </div>
                    <span className="text-sm text-gray-700 font-medium leading-snug">{b}</span>
                  </li>
                ))}
              </ul>
            </GlassCard>

            <GlassCard className="p-5 bg-white/60">
              <h4 className="font-bold text-gray-900 mb-1 tracking-tight">Download Dealer Brochure</h4>
              <p className="text-xs text-gray-600 mb-3 font-medium">
                Get detailed information about our dealer program.
              </p>
              <a
              href="/images/hero/og.pdf"
download="Satyajan-Dealer-Brochure.pdf"

className="inline-flex items-center gap-2 border-2 border-primary text-primary px-4 py-2 rounded-full font-bold hover:bg-primary hover:text-white transition-colors text-xs"
              >
                <Icon icon="ph:download-simple-bold" width={14} height={14} />
                Download Brochure
              </a>
            </GlassCard>
          </div>

          {/* Right: Form */}
          <GlassCard className="p-6 h-full flex flex-col">
            <h4 className="text-lg font-extrabold text-gray-900 mb-1 tracking-tight">Dealer Registration Form</h4>
            <p className="text-xs text-gray-600 mb-4 font-medium">
              Fill out the form below and our team will contact you within 24 hours
            </p>
            <form className="space-y-3 flex flex-col h-full">
              <div>
                <label className={labelClass}>Full Name *</label>
                <input required type="text" placeholder="Your full name" className={inputClass} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Email *</label>
                  <input required type="email" placeholder="Email address" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Phone *</label>
                  <input required type="tel" placeholder="+91 98765 43210" className={inputClass} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Business Name *</label>
                  <input required type="text" placeholder="Business name" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>City</label>
                  <input type="text" placeholder="Your city" className={inputClass} />
                </div>
              </div>

              <div>
                <label className={labelClass}>Message</label>
                <textarea
                  rows={2}
                  placeholder="Tell us about your business..."
                  className={`${inputClass} resize-none`}
                />
              </div>

              <div className="mt-auto pt-2">
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 bg-primary hover:bg-dark text-white py-2.5 rounded-full font-bold text-sm transition-colors shadow-md"
                >
                  Submit Application
                  <Icon icon="ph:paper-plane-tilt-fill" width={16} height={16} />
                </button>
              </div>
            </form>
          </GlassCard>
        </div>
      </section>

      {/* CTA */}
      <section className="py-6 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <GlassCard className="p-8 bg-white/60">
            <h2 className="text-2xl font-bold text-primary mb-2 drop-shadow-lg tracking-tight">
              Ready to Start Your Journey?
            </h2>
            <p className="text-dark mb-6 text-base font-medium">
              Call us directly and our partner team will get you onboarded fast.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="https://wa.me/918019179159"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-primary/60 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-primary transition-colors shadow-md text-sm"
              >
                <Icon icon="ph:whatsapp-logo-fill" width={16} height={16} />
                WhatsApp Us
              </a>
              <Link
                href="/contactus"
                className="border-2 border-primary text-primary px-6 py-2.5 rounded-lg font-semibold hover:bg-primary hover:text-white transition-colors shadow-md text-sm"
              >
                Contact Us Today
              </Link>
            </div>
          </GlassCard>
        </div>
      </section>
    </main>
  )
}

export default PartnersPage